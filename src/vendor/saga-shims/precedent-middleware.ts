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
