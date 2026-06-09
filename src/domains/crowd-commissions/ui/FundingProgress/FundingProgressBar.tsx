import styles from './FundingProgressBar.module.scss';

interface FundingProgressBarProps {
  readonly collectedCents: number;
  readonly goalAmountCents: number;
  readonly pct: number;
  readonly ariaLabel?: string;
}

const MILESTONE_PCTS = [120, 150, 200, 250] as const;
const DISPLAY_MAX = 250;

const TIER_TRACK_CLASS = {
  bronze: styles.trackTierBronze,
  silver: styles.trackTierSilver,
  gold: styles.trackTierGold,
  platinum: styles.trackTierPlatinum,
} as const;

const TIER_FILL_CLASS = {
  bronze: styles.tierBronze,
  silver: styles.tierSilver,
  gold: styles.tierGold,
  platinum: styles.tierPlatinum,
} as const;

type TierKey = keyof typeof TIER_FILL_CLASS;

function getActiveTier(pct: number): TierKey | undefined {
  if (pct >= 250) return 'platinum';
  if (pct >= 200) return 'gold';
  if (pct >= 150) return 'silver';
  if (pct >= 120) return 'bronze';
  return undefined;
}

export function FundingProgressBar({
  collectedCents,
  goalAmountCents,
  pct,
  ariaLabel,
}: FundingProgressBarProps) {
  const barWidthPct = pct > 100 ? Math.min((pct / DISPLAY_MAX) * 100, 100) : Math.min(pct, 100);

  const tier = getActiveTier(pct);

  const trackClass = [
    styles.track,
    tier ? styles.trackTier : undefined,
    tier ? TIER_TRACK_CLASS[tier] : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const fillClass = [styles.fill, tier ? TIER_FILL_CLASS[tier] : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={styles.progressBar}
      role="progressbar"
      aria-label={ariaLabel ?? `Funding progress ${Math.round(pct)}%`}
      aria-valuenow={collectedCents}
      aria-valuemin={0}
      aria-valuemax={goalAmountCents}
    >
      <div className={trackClass}>
        {pct > 100 &&
          MILESTONE_PCTS.map((milestone) => {
            const tickLeft = (milestone / DISPLAY_MAX) * 100;
            const reached = pct >= milestone;
            return (
              <span
                key={milestone}
                className={`${styles.tick} ${reached ? styles.tickReached : ''}`}
                style={{ left: `${tickLeft}%` }}
                aria-hidden="true"
              />
            );
          })}
        <div className={fillClass} style={{ width: `${barWidthPct}%` }} />
      </div>
    </div>
  );
}
