/*
 * URL and email recognition utilities.
 * - Conservative domain matching (practical subset of RFC3986)
 * - Safe normalization for href generation (adds https:// for host-only matches)
 * - Fast extraction for large documents using `matchAll`
 */

import { logger } from '@saga/logger-middleware';

// domain building blocks
const DOMAIN_LABEL = '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?';
const TLD = '[a-zA-Z]{2,63}';
// Limit label repetition to a small, practical bound to avoid nested-quantifier blowups
// (still permissive for realistic hostnames while preventing pathological inputs).
const HOST = `(?:${DOMAIN_LABEL}(?:\\.${DOMAIN_LABEL}){0,9}\\.${TLD})`;

// Allow common non-TLD hosts used in development (localhost) and IPv4 addresses
const NON_TLD_HOST = `(?:localhost|\\d{1,3}(?:\\.\\d{1,3}){3})`;
const SIMPLE_HOST = `(?:${HOST}|${NON_TLD_HOST})`;

const SCHEME = '(?:https?:\\/\\/)';
const WWW = '(?:www\\.)';
const PORT = '(?::\\d{1,5})?';
// Limit path/query/fragment length to avoid catastrophic backtracking (ReDoS).
// Allow up to 2000 characters after the leading '/'.
const PATH_QUERY_FRAGMENT = '(?:\\/[^\\s<>"\'`\\x00-\\x1F]{0,2000})?';
// --- Defensive limits to mitigate ReDoS risks when validating host-like tokens ---
// RFC constraints used as safe upper bounds plus a practical cap on label count.
const MAX_HOST_LENGTH = 255; // full domain name max (RFC)
const MAX_LABEL_LENGTH = 63; // per-label max (RFC)
const MAX_LABEL_COUNT = 10; // practical cap to avoid pathological inputs
// Precompile the host-like regex once to avoid recreating it in hot paths.
const HOST_LIKELY_REGEX = new RegExp(`^${SIMPLE_HOST}${PORT}${PATH_QUERY_FRAGMENT}$`, 'i');
function isLikelySafeHostToken(token: string): boolean {
  // isolate host portion (before path or port); be defensive with indexing
  const hostSegment = (token.split('/')[0] ?? '').replace(/:\d+$/, '');
  if (!hostSegment) return false;
  if (hostSegment.length > MAX_HOST_LENGTH) return false;
  const labels = hostSegment.split('.').filter(Boolean);
  if (labels.length > MAX_LABEL_COUNT) return false;
  if (labels.some((l) => l.length > MAX_LABEL_LENGTH)) return false;
  return true;
}
// Combined matcher: scheme URLs, www-prefixed, plain hostnames, and emails
export const LINK_REGEX = new RegExp(
  [
    `(${SCHEME}${SIMPLE_HOST}${PORT}${PATH_QUERY_FRAGMENT})`,
    `(${WWW}${SIMPLE_HOST}${PORT}${PATH_QUERY_FRAGMENT})`,
    `(${SIMPLE_HOST}${PORT}${PATH_QUERY_FRAGMENT})`,
    '([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63})',
  ].join('|'),
  'gi',
);

export interface ExtractedLink {
  match: string;
  index: number;
}

export function extractLinkMatches(text: string): ExtractedLink[] {
  const out: ExtractedLink[] = [];
  for (const m of text.matchAll(LINK_REGEX)) {
    if (!m[0]) continue;
    out.push({ match: m[0], index: m.index ?? 0 });
  }
  return out;
}

/**
 * Normalize a matched token into a `core` (visible), `href` (safe link), and `trailing` punctuation.
 */
export const parseLinkMatch = (matchText: string): ParsedLink => {
  if (!matchText) return { core: '', href: '', trailing: '' };

  let token = matchText.trim();

  // Trailing punctuation commonly adjacent to URLs/emails. List characters
  // explicitly to avoid unintended ASCII ranges (clarifies intent):
  // - punctuation often attached to URLs: . , ; : ? ! ) ]
  const trailing = token.match(/[!.,;:?)\]]+$/)?.[0] ?? '';
  if (trailing) token = token.slice(0, -trailing.length);

  const emailRe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;
  if (emailRe.test(token)) {
    const href = `mailto:${token}`;
    return { core: token, href, trailing };
  }

  if (/^https?:\/\//i.test(token)) {
    const href = token;
    return { core: token, href, trailing };
  }

  if (/^www\./i.test(token)) {
    const href = `https://${token}`;
    return { core: token, href, trailing };
  }

  if (HOST_LIKELY_REGEX.test(token)) {
    // Defensive short-circuit: reject excessively long / deeply-nested host-like
    // tokens before constructing href -- avoids exposing the regex to
    // pathological inputs (mitigates ReDoS attack surface).
    if (!isLikelySafeHostToken(token)) {
      // preserve visible text but do NOT fabricate a href for safety
      return { core: token, href: '', trailing };
    }

    const href = `https://${token}`;
    return { core: token, href, trailing };
  }

  // Defensive: if the token *looks* host-like (contains dots) but fails our
  // safety checks, reject fabricating a link. This handles pathological host
  // tokens that don't match our HOST regex but are still suspicious.
  if (token.includes('.') && !isLikelySafeHostToken(token)) {
    return { core: token, href: '', trailing };
  }

  // Conservative fallback: return token but avoid fabricating an https href for unknown tokens
  // Use a strict allowlist for explicit schemes — only `http`, `https`, and `mailto` are permitted.
  const href = token;

  // If the token explicitly contains a scheme (e.g. "file:", "blob:") then only
  // allow it when the scheme is on our allowlist. This is much safer than a
  // long blocklist and prevents unexpected/unsafe protocols from being used.
  const scheme = href.match(/^([a-z0-9+.-]+):/i)?.[1]?.toLowerCase();
  if (scheme) {
    const allowedSchemes = new Set(['http', 'https', 'mailto']);
    if (!allowedSchemes.has(scheme)) {
      logger.warn(`[parseLinkMatch] rejected disallowed scheme: ${scheme} in token: ${href}`);
      return { core: '', href: '', trailing: '' };
    }
  }

  return { core: token, href, trailing };
};

export type ParsedLink = {
  core: string;
  href: string;
  trailing: string;
};
