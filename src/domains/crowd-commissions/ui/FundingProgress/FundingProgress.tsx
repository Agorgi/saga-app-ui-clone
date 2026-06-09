import {
  calcFundingProgressPct,
  formatBackerCount,
  formatCents,
  getFundingTier,
  getTierClass,
} from '@domains/crowd-commissions/utils/formatCurrency';
import styles from './FundingProgress.module.scss';
import { FundingProgressBar } from './FundingProgressBar';

interface FundingProgressProps {
  collectedCents: number;
  goalAmountCents: number | null;
  backerCount: number;
  currency: string;
  isLoading?: boolean;
}

const TIER_PERCENT_CLASS = {
  bronze: styles.percentBronze,
  silver: styles.percentSilver,
  gold: styles.percentGold,
  platinum: styles.percentPlatinum,
} as const;

export function FundingProgress({
  collectedCents,
  goalAmountCents,
  backerCount,
  currency,
  isLoading = false,
}: FundingProgressProps) {
  const pct = calcFundingProgressPct(collectedCents, goalAmountCents);
  const hasGoal = goalAmountCents !== null && goalAmountCents > 0;
  const collectedLabel = formatCents(collectedCents, currency);
  const goalLabel = hasGoal ? formatCents(goalAmountCents, currency) : undefined;
  const tier = hasGoal ? getFundingTier(pct) : undefined;
  const roundedPct = Math.round(pct);

  const percentClass = [styles.percent, getTierClass(tier, TIER_PERCENT_CLASS)]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {hasGoal && (
        <div className={styles.barWrapper}>
          <FundingProgressBar
            collectedCents={collectedCents}
            goalAmountCents={goalAmountCents ?? 0}
            pct={pct}
            ariaLabel={`Funding progress: ${collectedLabel} of ${goalLabel} — ${roundedPct}%`}
          />
        </div>
      )}

      <div className={styles.meta}>
        {isLoading ? (
          <>
            <span className={styles.skeleton} style={{ width: 64 }} />
            <span className={styles.skeleton} style={{ width: 96 }} />
          </>
        ) : (
          <>
            <span className={styles.left}>
              <span className={styles.collected}>{collectedLabel}</span>
              {goalLabel && <span className={styles.goal}>of {goalLabel}</span>}
              {!goalLabel && <span className={styles.goal}>raised</span>}
              {hasGoal && <span className={percentClass}>{roundedPct}%</span>}
            </span>
            <span className={styles.backers}>{formatBackerCount(backerCount)}</span>
          </>
        )}
      </div>
    </div>
  );
}
