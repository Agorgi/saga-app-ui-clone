// Wireframe shim for @saga/precedent-middleware.
// Only the small pure helpers used by vendored global-web components are
// reproduced here (formatCount, assertNever). The real package also carries
// shared backend/domain types that the UI clone does not need.

export function formatCount(count: number): string {
  if (!Number.isFinite(count)) return '0';
  const abs = Math.abs(count);
  if (abs < 1000) return String(count);
  if (abs < 1_000_000) {
    const v = count / 1000;
    return `${trim(v)}K`;
  }
  if (abs < 1_000_000_000) {
    const v = count / 1_000_000;
    return `${trim(v)}M`;
  }
  const v = count / 1_000_000_000;
  return `${trim(v)}B`;
}

function trim(value: number): string {
  // One decimal place, but drop a trailing ".0".
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

// Social links. Copied from the real precedent-middleware socialLinks.ts (pure,
// no dependencies). Only the read/display path is reproduced here: the registry,
// URL normalization + platform detection, and parseSocialLinks. The edit-form
// validator (normalizeSocialLinksInput) lives in the source package.
interface SocialPlatformConfig {
  readonly platform: string;
  readonly label: string;
  readonly patterns: readonly RegExp[];
}

export const SOCIAL_PLATFORM_REGISTRY: readonly SocialPlatformConfig[] = [
  {
    platform: 'discord',
    label: 'Discord',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:discord\.gg|discord(?:app)?\.com)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:instagram\.com|instagr\.am)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:youtube\.com|youtu\.be)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'x',
    label: 'X',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:twitter\.com|x\.com)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:tiktok\.com|vm\.tiktok\.com)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'twitch',
    label: 'Twitch',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?twitch\.tv(?:\/|$|\?|#)/i],
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    patterns: [
      /^https?:\/\/(?:[\w-]+\.)?(?:facebook\.com|fb\.com|fb\.me|m\.facebook\.com)(?:\/|$|\?|#)/i,
    ],
  },
  {
    platform: 'reddit',
    label: 'Reddit',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:reddit\.com|redd\.it)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?linkedin\.com(?:\/|$|\?|#)/i],
  },
  {
    platform: 'snapchat',
    label: 'Snapchat',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?snapchat\.com(?:\/|$|\?|#)/i],
  },
  {
    platform: 'threads',
    label: 'Threads',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?threads\.net(?:\/|$|\?|#)/i],
  },
  {
    platform: 'pinterest',
    label: 'Pinterest',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:pinterest\.com|pin\.it)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'telegram',
    label: 'Telegram',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:t\.me|telegram\.(?:me|org|dog))(?:\/|$|\?|#)/i],
  },
  {
    platform: 'wechat',
    label: 'WeChat',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:wechat\.com|weixin\.qq\.com)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'kakao',
    label: 'KakaoTalk',
    patterns: [
      /^https?:\/\/(?:[\w-]+\.)?(?:kakao\.com|kakaocorp\.com|open\.kakao\.com)(?:\/|$|\?|#)/i,
    ],
  },
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?(?:wa\.me|whatsapp\.com|api\.whatsapp\.com)(?:\/|$|\?|#)/i],
  },
  {
    platform: 'line',
    label: 'LINE',
    patterns: [/^https?:\/\/(?:[\w-]+\.)?line\.me(?:\/|$|\?|#)/i],
  },
  {
    platform: 'website',
    label: 'Website',
    patterns: [],
  },
];

export interface SocialLink {
  platform: string;
  url: string;
}

const HTTP_URL_PATTERN = /^https?:\/\/.+/i;

const URL_PLATFORM_RULES: ReadonlyArray<{ platform: string; pattern: RegExp }> =
  SOCIAL_PLATFORM_REGISTRY.filter((config) => config.patterns.length > 0).flatMap((config) =>
    config.patterns.map((pattern) => ({ platform: config.platform, pattern })),
  );

function normalizeSocialUrl(rawUrl: string): string | undefined {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) return undefined;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (!HTTP_URL_PATTERN.test(withProtocol)) return undefined;

  return withProtocol;
}

function detectPlatformFromUrl(normalizedUrl: string): string {
  const matchedRule = URL_PLATFORM_RULES.find((rule) => rule.pattern.test(normalizedUrl));
  return matchedRule?.platform ?? 'website';
}

export function parseSocialLinks(raw: unknown): ReadonlyArray<SocialLink> {
  if (!Array.isArray(raw)) return [];

  const seenPlatforms = new Set<string>();
  const links: SocialLink[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;

    const record = item as Record<string, unknown>;
    const urlValue = record.url;
    if (typeof urlValue !== 'string') continue;

    const url = normalizeSocialUrl(urlValue);
    if (!url) continue;

    const platform = detectPlatformFromUrl(url);
    if (platform !== 'website' && seenPlatforms.has(platform)) continue;

    seenPlatforms.add(platform);
    links.push({ platform, url });
  }

  return links;
}
