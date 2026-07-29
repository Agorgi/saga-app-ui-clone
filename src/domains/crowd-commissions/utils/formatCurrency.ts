export function formatCents(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatGoalProgress(collected: number, goal: number | undefined): string {
  if (goal === undefined || goal === 0) return formatCents(collected);
  const pct = Math.round((collected / goal) * 100);
  return `${formatCents(collected)} of ${formatCents(goal)} (${pct}%)`;
}

export function calcFundingProgressPct(collected: number, goal: number | null | undefined): number {
  if (goal == null || goal === 0) return 0;
  return (collected / goal) * 100;
}

export function formatBackerCount(backerCount: number): string {
  return backerCount === 1 ? '1 backer' : `${backerCount} backers`;
}

/** Compact dollar formatting: $1,234 → "$1.2K", $1,000,000 → "$1M". Falls back to formatCents below $1,000. */
export function formatCompactCents(cents: number, currency = 'usd'): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) {
    const v = dollars / 1_000_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (dollars >= 1_000) {
    const v = dollars / 1_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return formatCents(cents, currency);
}

/** Compact integer formatting: 1234 → "1.2K", 1000000 → "1M". */
export function formatCompactCount(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return String(n);
}

// ── Milestone tiers ──────────────────────────────────────────────────────────
// Each tier activates when pct >= its threshold.
// Colors are chosen to satisfy WCAG 4.5:1 contrast on both dark and light surfaces
// via semi-transparent fills paired with explicit foreground text colors.

export interface FundingTier {
  /** Milestone threshold in percent (e.g. 120 for Bronze) */
  readonly threshold: number;
  readonly name: string;
  /**
   * CSS modifier key used to apply the correct tier class in SCSS.
   * Maps to `.tier--<key>` in FundingProgressBar and FundingProgress stylesheets.
   */
  readonly key: 'bronze' | 'silver' | 'gold' | 'platinum';
  /** CSS gradient for the progress bar fill — rendered on the coloured fill element,
   *  not on a surface, so hardcoded values are fine here. */
  readonly barGradient: string;
}

const FUNDING_TIERS = [
  {
    threshold: 250,
    name: 'Platinum',
    key: 'platinum',
    barGradient: 'linear-gradient(90deg, #b8d0e8 0%, #e8f4f8 50%, #c5cfe8 100%)',
  },
  {
    threshold: 200,
    name: 'Gold',
    key: 'gold',
    barGradient: 'linear-gradient(90deg, #b8860b 0%, #ffd700 50%, #daa520 100%)',
  },
  {
    threshold: 150,
    name: 'Silver',
    key: 'silver',
    barGradient: 'linear-gradient(90deg, #707070 0%, #c0c0c0 50%, #909090 100%)',
  },
  {
    threshold: 120,
    name: 'Bronze',
    key: 'bronze',
    barGradient: 'linear-gradient(90deg, #8c4a1e 0%, #cd7f32 50%, #a05c20 100%)',
  },
] satisfies FundingTier[];

/** Returns the active tier for a given percentage, or undefined if < 120%. */
export function getFundingTier(pct: number): FundingTier | undefined {
  return FUNDING_TIERS.find((t) => pct >= t.threshold);
}

/**
 * Looks up the SCSS class for a given tier from a caller-supplied map.
 * Each component provides its own module-scoped map to keep SCSS coupling local.
 */
export function getTierClass(
  tier: FundingTier | undefined,
  map: Record<FundingTier['key'], string | undefined>,
): string | undefined {
  return tier ? map[tier.key] : undefined;
}
