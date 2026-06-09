import { Avatar } from '@saga/global-web';
import { CheckCircle, ChevronDown, Clock, CurrencyDollar, Users01 } from '@untitledui/icons';
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import type { PollOptionData } from '../types';
import styles from './GlassPollCard.module.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

type PollStatus =
  | 'draft'
  | 'active'
  | 'locking'
  | 'pending_winner'
  | 'pending_result'
  | 'completed'
  | 'failed';

interface OptionWithStats extends PollOptionData {
  adjustedVoters: number;
  percentage: number;
}

interface OptionRowCSSVars extends CSSProperties {
  '--stagger'?: string;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

function formatTimeLeft(deadlineAt: string | null): {
  label: string;
  variant: 'default' | 'amber' | 'green';
} {
  if (!deadlineAt) return { label: '—', variant: 'default' };
  const ms = new Date(deadlineAt).getTime() - Date.now();
  if (ms <= 0) return { label: 'Ended', variant: 'default' };
  const hours = ms / 3_600_000;
  if (hours < 24) {
    const h = Math.ceil(hours);
    return { label: `${h}h left`, variant: h < 6 ? 'amber' : 'green' };
  }
  const days = Math.floor(hours / 24);
  return { label: `${days}d left`, variant: days <= 2 ? 'amber' : 'green' };
}

// ─── Counter animation hook ───────────────────────────────────────────────────

function useCountTo(target: number, duration = 400): number {
  const [displayed, setDisplayed] = useState(target);
  const prevValueRef = useRef(target);
  const rafIdRef = useRef(0);

  useEffect(() => {
    const from = prevValueRef.current;
    prevValueRef.current = target;
    cancelAnimationFrame(rafIdRef.current);

    if (from === target) {
      setDisplayed(target);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayed(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [target, duration]);

  return displayed;
}

// ─── Percent badge sub-component ─────────────────────────────────────────────

interface PercentBadgeProps {
  readonly value: number;
  readonly isWinner: boolean;
  readonly staggerMs?: number;
}

function PercentBadge({ value, isWinner, staggerMs = 0 }: PercentBadgeProps) {
  const animated = useCountTo(value);

  return (
    <span
      role="status"
      className={`${styles.percentBadge} ${isWinner ? styles['percentBadge--winner'] : ''}`}
      style={{ '--stagger': `${staggerMs}ms` } as CSSProperties}
      aria-label={`${animated} percent`}
    >
      {animated}%
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface GlassPollCardProps {
  readonly title: string;
  readonly creatorName: string;
  readonly creatorAvatarUrl?: string | null;
  readonly creatorProfileUrl?: string;
  readonly status: PollStatus;
  readonly options: PollOptionData[];
  readonly totalVoters: number;
  readonly totalCollectedCents?: number;
  readonly userVotedOptionId?: string | null;
  readonly winnerOptionId?: string | null;
  readonly deadlineAt?: string | null;
  readonly isCreator?: boolean;
  readonly ownerPanel?: ReactNode;
  readonly onVote?: (optionId: string) => void;
}

export function GlassPollCard({
  title,
  creatorName,
  creatorAvatarUrl,
  creatorProfileUrl,
  status,
  options,
  totalVoters,
  totalCollectedCents,
  userVotedOptionId = null,
  winnerOptionId = null,
  deadlineAt = null,
  isCreator = false,
  ownerPanel,
  onVote,
}: GlassPollCardProps) {
  const [localVotedId, setLocalVotedId] = useState<string | null>(userVotedOptionId);
  const [controlsOpen, setControlsOpen] = useState(false);
  const ownerPanelId = useId();

  useEffect(() => {
    setLocalVotedId(userVotedOptionId ?? null);
  }, [userVotedOptionId]);

  const handleVote = useCallback(
    (optionId: string) => {
      const next = localVotedId === optionId ? null : optionId;
      setLocalVotedId(next);
      if (next !== null) onVote?.(next);
    },
    [localVotedId, onVote],
  );

  const toggleControls = useCallback(() => {
    setControlsOpen((prev) => !prev);
  }, []);

  // Compute adjusted vote counts that reflect local (optimistic) vote delta
  const optionsWithPct: OptionWithStats[] = useMemo(() => {
    const adjusted = options.map((opt) => {
      const wasVoted = opt.id === userVotedOptionId;
      const isNowVoted = opt.id === localVotedId;
      const delta = (isNowVoted ? 1 : 0) - (wasVoted ? 1 : 0);
      return { ...opt, adjustedVoters: Math.max(0, opt.voterCount + delta) };
    });

    const total = adjusted.reduce((sum, o) => sum + o.adjustedVoters, 0);

    return adjusted.map((opt) => ({
      ...opt,
      percentage: total > 0 ? Math.round((opt.adjustedVoters / total) * 100) : 0,
    }));
  }, [options, localVotedId, userVotedOptionId]);

  // Determine the solo leading option for the cyan winner accent.
  // Ties receive no highlight — only a single clear leader qualifies.
  const leadingOptionId = useMemo<string | null>(() => {
    if (winnerOptionId) return winnerOptionId;
    const maxPct = Math.max(...optionsWithPct.map((o) => o.percentage));
    if (maxPct === 0) return null;
    const leaders = optionsWithPct.filter((o) => o.percentage === maxPct);
    const [soloLeader] = leaders;
    return leaders.length === 1 ? (soloLeader?.id ?? null) : null;
  }, [optionsWithPct, winnerOptionId]);

  const isVotable = status === 'active';
  const isCompleted = status === 'completed' || status === 'pending_result';
  const showPercentages = totalVoters > 0 || localVotedId !== null;
  const showVoterCounts = showPercentages;

  const timeLeft = formatTimeLeft(deadlineAt);

  return (
    <article className={styles.card} aria-label={`Poll: ${title}`}>
      {/* ── Header ── */}
      <header className={styles.header}>
        {creatorProfileUrl ? (
          <Link
            to={creatorProfileUrl}
            className={styles.creator}
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
          <div className={styles.creator}>
            <Avatar
              name={creatorName}
              type="user"
              variant="xs"
              imageUrl={creatorAvatarUrl ?? undefined}
            />
            <span className={styles.creatorName}>{creatorName}</span>
          </div>
        )}

        {/* biome-ignore lint/a11y/useSemanticElements: stats display group, fieldset semantics don't apply to non-interactive stat items */}
        <div role="group" className={styles.stats} aria-label="Poll statistics">
          <span className={styles.stat}>
            <Users01 width={12} height={12} aria-hidden="true" />
            <span>{totalVoters.toLocaleString()} voters</span>
          </span>

          {totalCollectedCents != null && totalCollectedCents > 0 && (
            <span className={styles.stat}>
              <CurrencyDollar width={12} height={12} aria-hidden="true" />
              <span>{formatCents(totalCollectedCents)} raised</span>
            </span>
          )}

          {!isCompleted && deadlineAt && (
            <span
              className={`${styles.stat} ${
                timeLeft.variant === 'amber'
                  ? styles['stat--amber']
                  : timeLeft.variant === 'green'
                    ? styles['stat--green']
                    : ''
              }`}
            >
              <Clock width={12} height={12} aria-hidden="true" />
              <span>{timeLeft.label}</span>
            </span>
          )}
        </div>
      </header>

      {/* ── Title ── */}
      <h2 className={styles.title}>{title}</h2>

      {/* ── Options ── */}
      <ul className={styles.options} aria-label="Voting options">
        {optionsWithPct.map((opt, index) => {
          const isWinning = opt.id === leadingOptionId;
          const isVoted = opt.id === localVotedId;
          const staggerMs = index * 60;

          const rowClass = [
            styles.optionRow,
            isWinning ? styles['optionRow--winner'] : '',
            isVoted ? styles['optionRow--voted'] : '',
            !isVotable ? styles['optionRow--disabled'] : '',
          ]
            .filter(Boolean)
            .join(' ');

          const rowStyle: OptionRowCSSVars = { '--stagger': `${staggerMs}ms` };

          return (
            <li key={opt.id} className={styles.optionItem}>
              <button
                type="button"
                className={rowClass}
                style={rowStyle}
                onClick={isVotable ? () => handleVote(opt.id) : undefined}
                disabled={!isVotable}
                aria-pressed={isVoted}
                aria-label={[
                  opt.text,
                  isVoted ? 'your vote' : null,
                  isWinning ? 'currently leading' : null,
                  showPercentages ? `${opt.percentage}%` : null,
                ]
                  .filter(Boolean)
                  .join(', ')}
              >
                {/* Thumbnail */}
                <span className={styles.thumb} aria-hidden="true">
                  {opt.imageUrl ? (
                    <img className={styles.thumbImg} src={opt.imageUrl} alt="" loading="lazy" />
                  ) : (
                    <img className={styles.thumbFallback} src="/favicon.png" alt="" />
                  )}
                  {isVoted && (
                    <span className={styles.thumbCheck}>
                      <CheckCircle width={16} height={16} aria-hidden="true" />
                    </span>
                  )}
                </span>

                {/* Content */}
                <span className={styles.optionContent}>
                  <span className={styles.optionLabel}>{opt.text}</span>
                  {showVoterCounts && (
                    <span className={styles.voterLabel}>
                      {opt.adjustedVoters === 0
                        ? '0 voters'
                        : `${opt.adjustedVoters} voter${opt.adjustedVoters !== 1 ? 's' : ''}`}
                    </span>
                  )}
                </span>

                {/* Floating percent badge — keyed so re-mount triggers pulse on winner change */}
                {showPercentages && (
                  <PercentBadge
                    key={`${opt.id}-${isWinning}`}
                    value={opt.percentage}
                    isWinner={isWinning}
                    staggerMs={staggerMs}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Creator controls ── */}
      {isCreator && ownerPanel && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlsToggle}
            onClick={toggleControls}
            aria-expanded={controlsOpen}
            aria-controls={ownerPanelId}
          >
            <span className={styles.controlsLabel}>Creator controls</span>
            <ChevronDown
              className={`${styles.controlsChevron} ${
                controlsOpen ? styles['controlsChevron--open'] : ''
              }`}
              width={16}
              height={16}
              aria-hidden="true"
            />
          </button>

          <div
            id={ownerPanelId}
            className={`${styles.controlsBody} ${controlsOpen ? styles['controlsBody--open'] : ''}`}
            aria-hidden={!controlsOpen}
          >
            <div className={styles.controlsInner}>{ownerPanel}</div>
          </div>
        </div>
      )}
    </article>
  );
}
