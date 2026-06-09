// Feature flags for the wireframe.
//
// In production these resolve from the real flag client (OpenFeature / Flagsmith).
// Here each flag is a static default with an optional runtime override so the
// demo can show the gated and ungated states without a rebuild:
//   - add ?ff_<key>=on  to a URL to turn a flag on (persists to localStorage)
//   - add ?ff_<key>=off to turn it back off
// When porting a flagged feature, swap the resolver below for the real flag
// read; the call sites (e.g. isInterestCheckEnabled()) stay the same.

const STORAGE_PREFIX = 'saga_ff_';

function resolveFlag(key: string, defaultValue: boolean): boolean {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const param = new URLSearchParams(window.location.search).get(`ff_${key}`);
    if (param === 'on' || param === 'off') {
      const enabled = param === 'on';
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(enabled));
      return enabled;
    }
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored !== null) return stored === 'true';
  } catch {
    return defaultValue;
  }
  return defaultValue;
}

// Interest Check ("gauge interest"): gated off by default. Flip on for the demo
// with ?ff_interest_check=on (off with ?ff_interest_check=off).
export function isInterestCheckEnabled(): boolean {
  return resolveFlag('interest_check', false);
}
