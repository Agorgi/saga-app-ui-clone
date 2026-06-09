import { readQuillObj } from '@components/QuillEditor/readQuillObj';
import { CommissionDetailSheet } from '@domains/crowd-commissions/ui/CommissionDetailSheet/CommissionDetailSheet';
import {
  calcFundingProgressPct,
  formatCompactCents,
  formatCompactCount,
} from '@domains/crowd-commissions/utils/formatCurrency';
import { useProfilePicture } from '@hooks/useProfilePicture';
import { useUserProfile } from '@hooks/useUserProfile';
import type {
  CrowdCommission,
  CrowdCommissionStatusValue,
} from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import { Avatar } from '@saga/global-web';
import { assertNever } from '@saga/precedent-middleware';
import { getCrowdCommissionImageUrl } from '@utils/getImageUrls';
import { useState } from 'react';
import { FundingProgressBar } from '../FundingProgress/FundingProgressBar';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './CrowdCommissionCard.module.scss';

interface CrowdCommissionCardProps {
  commission: CrowdCommission;
  onClick?: () => void;
  /**
   * Whether the current viewer has an active (succeeded) pledge on this commission.
   * `null` means unknown (e.g. not authenticated, data not loaded yet) — falls back to default hint.
   */
  userHasBacked?: boolean | null;
}

const DESCRIPTION_MAX_LENGTH = 110;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.substring(0, max)}…`;
}

function getTapHint(status: CrowdCommissionStatusValue, userHasBacked: boolean | null): string {
  switch (status) {
    case CrowdCommissionStatus.ACTIVE:
      return userHasBacked ? "You're in! Check it out" : 'Tap to view';
    case CrowdCommissionStatus.LOCKING:
      return userHasBacked ? 'Locking in your pledge...' : 'Pledges are being locked in';
    case CrowdCommissionStatus.PENDING_RESULT:
      return 'Magician at work';
    case CrowdCommissionStatus.COMPLETED:
      return 'View Creative';
    case CrowdCommissionStatus.FAILED:
      return userHasBacked ? "Didn't make it, pledges refunded" : "Didn't reach the goal this time";
    case CrowdCommissionStatus.DRAFT:
    case CrowdCommissionStatus.PENDING_WINNER:
      return 'Tap to explore';
    default:
      return assertNever(status);
  }
}

function getTimeLeft(deadlineAt: string | null): {
  value: string;
  unit: string;
  variant: 'green' | 'amber' | 'default';
} {
  if (!deadlineAt) return { value: '–', unit: '', variant: 'default' };
  const ms = new Date(deadlineAt).getTime() - Date.now();
  if (ms <= 0) return { value: 'Ended', unit: '', variant: 'default' };
  const hours = ms / 3_600_000;
  if (hours < 24) {
    const h = Math.ceil(hours);
    return { value: `${h}h`, unit: 'left', variant: h < 6 ? 'amber' : 'green' };
  }
  const days = Math.floor(hours / 24);
  return { value: `${days}d`, unit: 'left', variant: days <= 2 ? 'amber' : 'green' };
}

export function CrowdCommissionCard({
  commission,
  onClick,
  userHasBacked = null,
}: CrowdCommissionCardProps) {
  const {
    title,
    description,
    heroImageUrl,
    status,
    totalCollectedCents,
    goalAmountCents,
    backerCount,
    currency,
    fundingDeadlineAt,
    creatorId,
  } = commission;

  const [sheetOpen, setSheetOpen] = useState(false);

  const creatorProfile = useUserProfile(creatorId);
  const creatorAvatarUrl = useProfilePicture(creatorId);
  const creatorName = creatorProfile?.displayName ?? creatorProfile?.userName ?? creatorId;

  const plainDescription = readQuillObj(description, 'text');
  const truncatedDescription = truncate(plainDescription, DESCRIPTION_MAX_LENGTH);

  const isActive = status === CrowdCommissionStatus.ACTIVE;
  const timeLeft = getTimeLeft(isActive ? fundingDeadlineAt : null);
  const showTimeLeft = isActive && timeLeft.value !== '–' && timeLeft.value !== 'Ended';

  const heroUrl = heroImageUrl
    ? getCrowdCommissionImageUrl(creatorId, commission.id, heroImageUrl)
    : null;

  const hasGoal = !!goalAmountCents && goalAmountCents > 0;
  const pct = calcFundingProgressPct(totalCollectedCents, goalAmountCents);

  const raisedLabel = formatCompactCents(totalCollectedCents, currency);
  const goalLabel = goalAmountCents ? formatCompactCents(goalAmountCents, currency) : null;
  const backersValue = formatCompactCount(backerCount);

  const handleClick = onClick ?? (() => setSheetOpen(true));

  const timeLeftValueClass = [
    styles.statValue,
    timeLeft.variant === 'green' ? styles['statValue--green'] : '',
    timeLeft.variant === 'amber' ? styles['statValue--amber'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: card contains nested interactive elements */}
      <div
        className={styles.card}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View commission: ${title}`}
      >
        {/* ── Hero ── */}
        <div className={styles.hero}>
          {heroUrl ? (
            <img src={heroUrl} alt="" className={styles.heroImage} loading="lazy" />
          ) : (
            <div className={styles.heroGradient} />
          )}
          <div className={styles.heroOverlay} />

          {/* Status badge — top right */}
          <div className={styles.heroBadgeWrap}>
            <StatusBadge status={status} />
          </div>

          {/* Creator pill — bottom-left of hero */}
          <div className={`${styles.creatorPill} ${styles.heroCreator}`}>
            <Avatar
              name={creatorName}
              type="user"
              variant="xs"
              imageUrl={creatorAvatarUrl ?? undefined}
            />
            <span className={styles.creatorName}>{creatorName}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          <h2 className={styles.title}>{title}</h2>

          {truncatedDescription && <p className={styles.description}>{truncatedDescription}</p>}

          {/* Progress bar — only when a funding goal is set */}
          {hasGoal && (
            <div className={styles.barStrip}>
              <FundingProgressBar
                collectedCents={totalCollectedCents}
                goalAmountCents={goalAmountCents ?? 0}
                pct={pct}
                ariaLabel={`Funding: ${raisedLabel} of ${goalLabel}`}
              />
            </div>
          )}

          {/* Stat pills */}
          {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: div used as group container, aria-label describes purpose */}
          <div className={styles.statPills} aria-label="Commission statistics">
            {backerCount > 0 ? (
              <>
                <div className={styles.statPill}>
                  <span className={styles.statValue}>{raisedLabel}</span>
                  <span className={styles.statLabel}>
                    {goalLabel ? `of ${goalLabel}` : 'raised'}
                  </span>
                </div>
                <div className={styles.statPill}>
                  <span className={styles.statValue}>{backersValue}</span>
                  <span className={styles.statLabel}>
                    {backerCount === 1 ? 'backer' : 'backers'}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.statPill}>
                <span className={styles.statLabel}>No backers yet</span>
              </div>
            )}

            {showTimeLeft && (
              <div className={styles.statPill}>
                <span className={timeLeftValueClass}>{timeLeft.value}</span>
                {timeLeft.unit && <span className={styles.statLabel}>{timeLeft.unit}</span>}
              </div>
            )}
          </div>

          {/* Tap hint */}
          <div className={styles.tapHint} aria-hidden="true">
            {getTapHint(status, userHasBacked)}
          </div>
        </div>
      </div>

      {!onClick && (
        <CommissionDetailSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          commission={commission}
        />
      )}
    </>
  );
}
