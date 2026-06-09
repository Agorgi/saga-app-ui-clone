import { Avatar } from '@saga/global-web';
import { Check, Heart, Ticket01, Trophy01 } from '@untitledui/icons';
import type React from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import styles from './PollCard.module.scss';

type CSSWithVars = CSSProperties & Record<`--${string}`, string | number>;

type PollStatus =
  | 'draft'
  | 'active'
  | 'locking'
  | 'pending_winner'
  | 'pending_result'
  | 'completed'
  | 'failed';

export interface PollOptionData {
  id: string;
  text: string;
  imageUrl: string | null;
  voteCount: number;
  voterCount: number;
  displayOrder: number;
}

export interface PollCardProps {
  title: string;
  caption: string | null;
  creatorName: string;
  creatorAvatarUrl: string | null;
  creatorProfileUrl: string | undefined;
  heroImageUrl: string | null;
  status: PollStatus;
  options: PollOptionData[];
  totalWeightedVotes: number;
  totalVoters: number;
  totalCollectedCents?: number;
  userVotedOptionId: string | null;
  userVoteStatus: 'pending' | 'paid_unvoted' | 'completed' | 'expired' | 'failed' | null;
  userVoteSessionUrl: string | null;
  winnerOptionId: string | null;
  deadlineAt: string | null;
  variant?: 'default' | 'list';
  isCreator?: boolean;
  /** Retained for wrapper compat — called from modal only, not this card */
  onCheckout?: (amountCents: number) => void;
  onVote?: (optionId: string) => void;
  onPickWinner?: (optionId: string) => void;
  onOpen?: () => void;
}

function formatTimeLeft(deadlineAt: string | null): {
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

const TAP_HINTS = {
  completed: 'View Creative',
  paidUnvoted: "You're in! Check it out",
  votedActive: "You're in! Check it out",
  locking: 'Pledges are being locked in',
  pendingResult: 'Magician at work',
  failed: "Didn't reach the goal this time",
  explore: 'Tap to explore',
  default: 'Support this creator — tap to join',
} as const;

export function PollCard({
  title,
  caption,
  creatorName,
  creatorAvatarUrl,
  creatorProfileUrl,
  heroImageUrl,
  status,
  options,
  totalVoters,
  userVotedOptionId,
  userVoteStatus,
  winnerOptionId,
  deadlineAt,
  onOpen,
}: PollCardProps) {
  const isPaidUnvoted = userVoteStatus === 'paid_unvoted';
  const hasVoted = !!userVotedOptionId || userVoteStatus === 'completed';
  const isCompleted = status === 'completed';
  const isPendingResult = status === 'pending_result';
  const isActive = status === 'active' || status === 'locking';

  const timeLeft = formatTimeLeft(deadlineAt);

  // Winner bar data
  const winnerOption = winnerOptionId
    ? (options.find((o) => o.id === winnerOptionId) ?? null)
    : null;
  const totalVotes = options.reduce((sum, o) => sum + o.voteCount, 0);
  const winnerPct =
    winnerOption && totalVotes > 0 ? Math.round((winnerOption.voteCount / totalVotes) * 100) : 0;
  const winnerBarStyle: CSSWithVars = { '--fill-pct': `${winnerPct}%` };

  const votedOption = userVotedOptionId
    ? (options.find((o) => o.id === userVotedOptionId) ?? null)
    : null;

  const tapHint = (() => {
    if (isCompleted) return TAP_HINTS.completed;
    if (isPaidUnvoted) return TAP_HINTS.paidUnvoted;
    if (hasVoted && isActive) return TAP_HINTS.votedActive;
    switch (status) {
      case 'locking':
        return TAP_HINTS.locking;
      case 'pending_result':
        return TAP_HINTS.pendingResult;
      case 'failed':
        return TAP_HINTS.failed;
      case 'draft':
      case 'pending_winner':
        return TAP_HINTS.explore;
      default:
        return TAP_HINTS.default;
    }
  })();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: card contains nested <a> elements making <button> root invalid HTML
    <div
      className={`${styles.card} ${isPaidUnvoted ? styles['card--pendingVote'] : ''}`}
      role="button"
      onClick={onOpen}
      tabIndex={0}
      aria-label={`Poll: ${title}. Tap to open.`}
      onKeyDown={handleKeyDown}
    >
      {/* ── Hero ── */}
      <div className={styles.hero}>
        {heroImageUrl ? (
          <img src={heroImageUrl} alt="" className={styles.heroImage} loading="lazy" />
        ) : (
          <div className={styles.heroGradient} />
        )}
        <div className={styles.heroOverlay} />

        {/* Status badge — top right */}
        <div className={styles.heroBadgeWrap}>
          <StatusBadge status={status} />
        </div>

        {/* Voted badge — top left (voted + active) */}
        {hasVoted && isActive && (
          // biome-ignore lint/a11y/useAriaPropsSupportedByRole: decorative badge, aria-label provides screen reader context
          <span className={styles.votedBadge} aria-label="You have voted">
            <Check width={10} height={10} aria-hidden="true" />
            Voted
          </span>
        )}

        {/* Vote-now pill — top left (paid_unvoted) */}
        {isPaidUnvoted && (
          // biome-ignore lint/a11y/useAriaPropsSupportedByRole: decorative badge, aria-label provides screen reader context
          <span
            className={styles.voteNowPill}
            aria-label="Your contribution is in — tap to cast your vote"
          >
            <span className={styles.dotPulse} aria-hidden="true" />
            Vote now
          </span>
        )}

        {/* Creator pill — bottom-left of hero */}
        {creatorProfileUrl ? (
          <Link
            to={creatorProfileUrl}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`${styles.creatorPill} ${styles.heroCreator}`}
            aria-label={`View ${creatorName}'s profile`}
          >
            <Avatar
              name={creatorName}
              type="user"
              variant="xs"
              imageUrl={creatorAvatarUrl ?? undefined}
            />
            <span className={styles.creatorName}>{creatorName}</span>
          </Link>
        ) : (
          <div className={`${styles.creatorPill} ${styles.heroCreator}`}>
            <Avatar
              name={creatorName}
              type="user"
              variant="xs"
              imageUrl={creatorAvatarUrl ?? undefined}
            />
            <span className={styles.creatorName}>{creatorName}</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Caption */}
        {caption && <p className={styles.caption}>{caption}</p>}

        {/* Notice strip: paid_unvoted */}
        {isPaidUnvoted && (
          <div
            className={`${styles.noticeStrip} ${styles['noticeStrip--amber']}`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`${styles.noticeIcon} ${styles['noticeIcon--amber']}`}
              aria-hidden="true"
            >
              <Ticket01 width={14} height={14} />
            </div>
            <div className={styles.noticeText}>
              <div className={`${styles.noticeTitle} ${styles['noticeTitle--amber']}`}>
                You're in! Cast your vote
              </div>
              <div className={styles.noticeSub}>Open to make your voice count</div>
            </div>
          </div>
        )}

        {/* Notice strip: voted + active */}
        {hasVoted && isActive && votedOption && (
          <div className={`${styles.noticeStrip} ${styles['noticeStrip--indigo']}`} role="status">
            <div
              className={`${styles.noticeIcon} ${styles['noticeIcon--indigo']}`}
              aria-hidden="true"
            >
              <Heart width={14} height={14} />
            </div>
            <div className={styles.noticeText}>
              <div className={`${styles.noticeTitle} ${styles['noticeTitle--indigo']}`}>
                You backed &ldquo;{votedOption.text}&rdquo;
              </div>
              <div className={styles.noticeSub}>
                The community is still voting — check back soon
              </div>
            </div>
          </div>
        )}

        {/* Winner section: completed or pending_result */}
        {(isCompleted || isPendingResult) && winnerOption && (
          <div className={styles.winnerSection}>
            <div className={styles.winnerLabel}>
              <span className={styles.trophyBadge} aria-hidden="true">
                <Trophy01 width={9} height={9} />
              </span>
              Winner
            </div>
            <div className={styles.winnerOptionName}>{winnerOption.text}</div>

            {/* Winner bar */}
            <div
              className={styles.barTrack}
              role="progressbar"
              aria-valuenow={winnerPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${winnerOption.text} — ${winnerPct}%`}
            >
              <div
                className={`${styles.barFill} ${styles['barFill--winner']}`}
                style={winnerBarStyle}
              />
            </div>
            <div className={styles.barMeta}>
              <span className={styles.barPctWinner}>{winnerPct}%</span>
            </div>
          </div>
        )}

        {/* Divider before stats on completed or pending_result */}
        {(isCompleted || isPendingResult) && <div className={styles.divider} />}

        {/* Stat pills */}
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: div used as group container, aria-label describes purpose */}
        <div className={styles.statPills} aria-label="Poll statistics">
          <div className={styles.statPill}>
            <span className={styles.statValue}>{totalVoters.toLocaleString()}</span>
            <span className={styles.statLabel}>voters</span>
          </div>

          {!isCompleted && !isPendingResult && timeLeft.value !== '–' && (
            <div className={styles.statPill}>
              <span
                className={`${styles.statValue} ${
                  timeLeft.variant === 'green'
                    ? styles['statValue--green']
                    : timeLeft.variant === 'amber'
                      ? styles['statValue--amber']
                      : ''
                }`}
              >
                {timeLeft.value}
              </span>
              {timeLeft.unit && <span className={styles.statLabel}>{timeLeft.unit}</span>}
            </div>
          )}
        </div>

        {/* Tap hint */}
        <div className={styles.tapHint} aria-hidden="true">
          {tapHint}
        </div>
      </div>
    </div>
  );
}
