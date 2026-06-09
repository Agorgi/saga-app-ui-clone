import { Avatar, BaseModal } from '@saga/global-web';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard02,
  Lock01,
  X,
} from '@untitledui/icons';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CelebrationBurst, type CelebrationTheme } from '../CelebrationBurst/CelebrationBurst';
import { PollOptionRow } from '../PollOptionRow/PollOptionRow';
import { DONATION_PRESETS, formatPollDeadline, OPTION_COLORS, type PollOptionData } from '../types';
import { ImageViewerModal } from './ImageViewerModal';
import styles from './PollModal.module.scss';

interface PollModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly caption?: string | null;
  readonly creatorName: string;
  readonly creatorAvatarUrl?: string | null;
  readonly creatorProfileUrl?: string;
  readonly heroImageUrl?: string | null;
  readonly status: string;
  readonly options: PollOptionData[];
  readonly totalWeightedVotes: number;
  readonly totalVoters: number;
  /** Total collected from all payments in cents (voted + paid_unvoted). Used for "raised" display. */
  readonly totalCollectedCents?: number;
  readonly userVotedOptionId?: string | null;
  readonly userVoteStatus?: 'pending' | 'paid_unvoted' | 'completed' | 'expired' | 'failed' | null;
  readonly userVoteSessionUrl?: string | null;
  readonly winnerOptionId?: string | null;
  readonly deadlineAt?: string | null;
  readonly isCreator?: boolean;
  readonly statusBadge?: ReactNode;
  readonly ownerPanel?: ReactNode;
  readonly onCheckout?: (amountCents: number) => void;
  readonly onVote?: (optionId: string) => void;
  readonly onPickWinner?: (optionId: string) => void;
}

export function PollModal({
  isOpen,
  onClose,
  title,
  caption,
  creatorName,
  creatorAvatarUrl,
  creatorProfileUrl,
  heroImageUrl,
  status,
  options,
  totalWeightedVotes,
  totalVoters,
  totalCollectedCents,
  userVotedOptionId,
  userVoteStatus,
  userVoteSessionUrl,
  winnerOptionId,
  deadlineAt,
  isCreator = false,
  statusBadge,
  ownerPanel,
  onCheckout,
  onVote,
  onPickWinner,
}: PollModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [showDonationView, setShowDonationView] = useState(false);
  const [leavingGate, setLeavingGate] = useState(false);
  const [leavingDonation, setLeavingDonation] = useState(false);
  const [loadingPresetCents, setLoadingPresetCents] = useState<number | null>(null);
  const [viewingImage, setViewingImage] = useState<{ url: string; alt: string } | null>(null);
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationTheme | null>(null);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [captionNeedsTruncation, setCaptionNeedsTruncation] = useState(false);
  const [titleNeedsTruncation, setTitleNeedsTruncation] = useState(false);

  const handleCelebrationComplete = useCallback(() => {
    setCelebration(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowDonationView(false);
      setLeavingGate(false);
      setLeavingDonation(false);
      setViewingImage(null);
      setOwnerPanelOpen(false);
      setCelebration(null);
      setCaptionExpanded(false);
      setTitleExpanded(false);
      setCaptionNeedsTruncation(false);
      setTitleNeedsTruncation(false);
      return;
    }
    dialogRef.current?.focus();
  }, [isOpen]);

  // Detect overflow while elements are in their clamped state so we know
  // whether to render the "Show more" toggle. useLayoutEffect runs synchronously
  // after DOM mutations — no visible flicker on first paint.
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!captionExpanded && captionRef.current) {
      const el = captionRef.current;
      if (el.scrollHeight > el.clientHeight) setCaptionNeedsTruncation(true);
    }
    if (!titleExpanded && titleRef.current) {
      const el = titleRef.current;
      if (el.scrollHeight > el.clientHeight) setTitleNeedsTruncation(true);
    }
  }, [isOpen, captionExpanded, titleExpanded]);

  if (!isOpen) return null;

  const hasCompletedVote = userVoteStatus === 'completed';
  const hasPendingPayment = userVoteStatus === 'pending';
  const hasPaidUnvoted = userVoteStatus === 'paid_unvoted';
  const isCompleted = status === 'completed';
  const isPendingWinner = status === 'pending_winner';
  const isPendingResult = status === 'pending_result';
  const isActive = status === 'active';

  const revealed =
    isCreator ||
    hasCompletedVote ||
    hasPaidUnvoted ||
    isCompleted ||
    isPendingWinner ||
    isPendingResult;

  const voteCounts = options.map((o) => o.voteCount);
  const maxVotes = Math.max(...voteCounts, 0);
  const tiedOptionIds = isPendingWinner
    ? new Set(options.filter((o) => o.voteCount === maxVotes).map((o) => o.id))
    : new Set<string>();

  const votedOption = options.find((o) => o.id === userVotedOptionId);

  const canDonate =
    isActive &&
    !hasCompletedVote &&
    !hasPendingPayment &&
    !hasPaidUnvoted &&
    !isCompleted &&
    !isPendingWinner;
  const canVote = isActive && hasPaidUnvoted;
  const canSelectOption = canDonate || canVote;

  const handlePresetSelect = async (amountCents: number) => {
    setLoadingPresetCents(amountCents);
    setCelebration('contribute');
    try {
      await onCheckout?.(amountCents);
    } finally {
      setLoadingPresetCents(null);
    }
  };

  // Gate → Donation: 140ms exit animation on gate, then donation panel entrance-animates in.
  // 140ms = ~58% of the 240ms donation entrance — satisfies exit-faster-than-enter.
  const handleUnlockClick = () => {
    setLeavingGate(true);
    setTimeout(() => {
      setLeavingGate(false);
      setShowDonationView(true);
    }, 140);
  };

  // Donation → Gate: 140ms exit on donation panel, then gate re-enters.
  const handleCancelDonation = () => {
    setLeavingDonation(true);
    setTimeout(() => {
      setLeavingDonation(false);
      setShowDonationView(false);
    }, 140);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.pollOverlay}
      className={styles.pollDialog}
      ariaLabel={title}
      closeOnBackdrop={true}
      closeOnEscape={true}
    >
      <div className={styles.modal} ref={dialogRef}>
        {/* Drag handle — mobile only */}
        <div className={styles.dragHandle} aria-hidden="true" />

        {/* Hero zone (when image present) */}
        {heroImageUrl ? (
          <div className={styles.heroZone}>
            <img
              className={styles.heroImage}
              src={heroImageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
            <button
              type="button"
              className={styles.closeHero}
              onClick={onClose}
              aria-label="Close poll"
            >
              <X width={15} height={15} aria-hidden="true" />
            </button>
            <div className={styles.heroText}>
              {creatorProfileUrl ? (
                <a
                  href={creatorProfileUrl}
                  className={styles.creatorLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar
                    name={creatorName}
                    type="user"
                    variant="xs"
                    imageUrl={creatorAvatarUrl ?? undefined}
                  />
                  <span className={styles.heroCreator}>{creatorName}</span>
                </a>
              ) : (
                <div className={styles.creatorLink}>
                  <Avatar
                    name={creatorName}
                    type="user"
                    variant="xs"
                    imageUrl={creatorAvatarUrl ?? undefined}
                  />
                  <span className={styles.heroCreator}>{creatorName}</span>
                </div>
              )}
              <div className={styles.heroTitleWrapper}>
                <h2
                  ref={titleRef}
                  className={[styles.heroTitle, titleExpanded ? styles['heroTitle--expanded'] : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {title}
                </h2>
                {titleNeedsTruncation && (
                  <button
                    type="button"
                    className={styles.showMoreBtnHero}
                    onClick={() => setTitleExpanded((v) => !v)}
                    aria-expanded={titleExpanded}
                  >
                    {titleExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Plain header when no image */
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.headerTitleWrapper}>
                <h2
                  ref={titleRef}
                  className={[
                    styles.headerTitle,
                    titleExpanded ? styles['headerTitle--expanded'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {title}
                </h2>
                {titleNeedsTruncation && (
                  <button
                    type="button"
                    className={styles.showMoreBtn}
                    onClick={() => setTitleExpanded((v) => !v)}
                    aria-expanded={titleExpanded}
                  >
                    {titleExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
              <div className={styles.headerMeta}>
                {creatorProfileUrl ? (
                  <a
                    href={creatorProfileUrl}
                    className={styles.creatorLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span>{creatorName}</span>
                  </a>
                ) : (
                  <div className={styles.creatorLink}>
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span>{creatorName}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className={styles.closePlain}
              onClick={onClose}
              aria-label="Close poll"
            >
              <X width={16} height={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Meta row */}
        <div className={styles.metaRow}>
          <span className={styles.metaStats}>
            <span>
              {totalVoters} voter{totalVoters !== 1 ? 's' : ''}
            </span>
            <span className={styles.metaDot} aria-hidden="true">
              ·
            </span>
            <span className={styles.metaPrice}>
              $
              {totalCollectedCents != null
                ? Math.round(totalCollectedCents / 100)
                : totalWeightedVotes}{' '}
              raised
            </span>
          </span>
          <div className={styles.metaRight}>
            {deadlineAt && (
              <span className={styles.metaDeadline}>
                <Clock width={11} height={11} aria-hidden="true" />
                {formatPollDeadline(deadlineAt)}
              </span>
            )}
            {statusBadge}
          </div>
        </div>

        {/* Scrollable body — caption scrolls with content, keeps fixed header tight */}
        <div className={styles.body}>
          {/* Caption — first in scroll body so long captions don't squeeze options */}
          {caption && (
            <div className={styles.captionWrapper}>
              <p
                ref={captionRef}
                className={[
                  styles.captionSection,
                  !captionExpanded ? styles['captionSection--clamped'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {caption}
              </p>
              {captionNeedsTruncation && (
                <button
                  type="button"
                  className={styles.showMoreBtn}
                  onClick={() => setCaptionExpanded((v) => !v)}
                  aria-expanded={captionExpanded}
                >
                  {captionExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {isPendingWinner && (
            <div className={styles.tieBanner}>
              <AlertTriangle width={16} height={16} aria-hidden="true" />
              {isCreator
                ? 'This poll ended in a tie — pick the winning option below'
                : "It's a tie — the creator is picking the winner"}
            </div>
          )}

          {hasPendingPayment && userVoteSessionUrl && (
            <div className={styles.pendingBanner}>
              <div className={styles.pendingBannerIcon} aria-hidden="true">
                <CreditCard02 width={14} height={14} />
              </div>
              <div className={styles.pendingBannerBody}>
                <p className={styles.pendingBannerTitle}>Payment pending</p>
                <p className={styles.pendingBannerSub}>
                  Expires soon — complete to lock in your vote
                </p>
              </div>
              <a
                href={userVoteSessionUrl}
                className={styles.pendingLink}
                aria-label="Complete checkout for your poll vote"
              >
                Pay now
              </a>
            </div>
          )}

          {hasPaidUnvoted && (
            <div className={styles.pendingBanner}>
              <div className={styles.pendingBannerIcon} aria-hidden="true">
                <CheckCircle width={14} height={14} />
              </div>
              <div className={styles.pendingBannerBody}>
                <p className={styles.pendingBannerTitle}>You're in the circle of supporters ✨</p>
                <p className={styles.pendingBannerSub}>Pick an option below to cast your vote</p>
              </div>
            </div>
          )}

          {isCreator ? (
            options.map((option, idx) => {
              const percentage =
                totalWeightedVotes > 0
                  ? Math.round((option.voteCount / totalWeightedVotes) * 100)
                  : 0;
              const isVoted = hasCompletedVote && userVotedOptionId === option.id;
              const isWinner = winnerOptionId === option.id;
              const isTied = tiedOptionIds.has(option.id);
              const isGolden =
                (isWinner && (isCompleted || isPendingResult)) || (isTied && isPendingWinner);
              const color = OPTION_COLORS[idx % OPTION_COLORS.length] ?? '#8B5CF6';

              return (
                <PollOptionRow
                  key={option.id}
                  text={option.text}
                  imageUrl={option.imageUrl}
                  percentage={percentage}
                  voteCount={option.voteCount}
                  voterCount={option.voterCount}
                  revealed={true}
                  isVoted={isVoted}
                  isWinner={isWinner}
                  isTied={isTied}
                  isCreator={true}
                  isGolden={isGolden}
                  disabled={!(isPendingWinner && isTied)}
                  isPendingPayment={false}
                  staggerMs={idx * 50}
                  showImage={false}
                  size="modal"
                  color={color}
                  onImageClick={() => {
                    if (option.imageUrl) {
                      setViewingImage({ url: option.imageUrl, alt: option.text });
                    }
                  }}
                  onClick={() => {
                    if (isPendingWinner && isTied) {
                      onPickWinner?.(option.id);
                    }
                  }}
                  ariaLabel={
                    isPendingWinner && isTied
                      ? `Choose the winner: ${option.text}`
                      : isWinner
                        ? `${option.text} — winner, ${option.voterCount} voters`
                        : `${option.text} — ${option.voterCount} voters`
                  }
                />
              );
            })
          ) : showDonationView && canDonate ? (
            <div
              className={[
                styles.donationPanel,
                leavingDonation ? styles['donationPanel--leaving'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.donationHeader}>
                <p className={styles.donationTitle}>Support {creatorName}</p>
                <p className={styles.donationSub}>
                  Choose how much to contribute — your vote comes right after
                </p>
              </div>
              <div className={styles.donationPresets}>
                {DONATION_PRESETS.map(({ label, cents }) => (
                  <button
                    key={cents}
                    type="button"
                    className={[
                      styles.donationBtn,
                      loadingPresetCents === cents ? styles['donationBtn--loading'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => void handlePresetSelect(cents)}
                    disabled={loadingPresetCents !== null}
                    aria-busy={loadingPresetCents === cents}
                    aria-label={`Support with ${label}`}
                  >
                    {loadingPresetCents === cents && (
                      <span className={styles.donationSpinner} aria-hidden="true" />
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.donationBack}
                onClick={handleCancelDonation}
                disabled={loadingPresetCents !== null}
              >
                Cancel
              </button>
            </div>
          ) : canDonate ? (
            <button
              type="button"
              className={[styles.gateCta, leavingGate ? styles['gateCta--leaving'] : '']
                .filter(Boolean)
                .join(' ')}
              onClick={handleUnlockClick}
              aria-label="Back this creator to cast your vote"
            >
              <span className={styles.gateCtaIcon} aria-hidden="true">
                <Lock01 width={14} height={14} />
              </span>
              <span className={styles.gateCtaLabel}>
                Back this creator
                <span className={styles.gateCtaDesc}>Back the work · then vote</span>
              </span>
              <span className={styles.gateCtaHint} aria-hidden="true">
                Every dollar is a vote of confidence
              </span>
            </button>
          ) : (
            options.map((option, idx) => {
              const percentage =
                totalWeightedVotes > 0
                  ? Math.round((option.voteCount / totalWeightedVotes) * 100)
                  : 0;
              const isVoted = hasCompletedVote && userVotedOptionId === option.id;
              const isWinner = winnerOptionId === option.id;
              const isTied = tiedOptionIds.has(option.id);
              const isGolden =
                (isWinner && (isCompleted || isPendingResult)) || (isTied && isPendingWinner);
              const color = OPTION_COLORS[idx % OPTION_COLORS.length] ?? '#8B5CF6';

              const clickable = isPendingWinner && isCreator && isTied ? true : canSelectOption;

              return (
                <PollOptionRow
                  key={option.id}
                  text={option.text}
                  imageUrl={option.imageUrl}
                  percentage={percentage}
                  voteCount={option.voteCount}
                  voterCount={option.voterCount}
                  revealed={revealed}
                  isVoted={isVoted}
                  isWinner={isWinner}
                  isTied={isTied}
                  isCreator={isCreator}
                  isGolden={isGolden}
                  disabled={!clickable}
                  isPendingPayment={hasPendingPayment}
                  staggerMs={idx * 50}
                  showImage={false}
                  size="modal"
                  color={color}
                  onImageClick={() => {
                    if (option.imageUrl) {
                      setViewingImage({ url: option.imageUrl, alt: option.text });
                    }
                  }}
                  onClick={() => {
                    if (isPendingWinner && isCreator && isTied) {
                      onPickWinner?.(option.id);
                    } else if (canVote) {
                      setCelebration('vote');
                      void onVote?.(option.id);
                    } else if (canDonate) {
                      handleUnlockClick();
                    }
                  }}
                  ariaLabel={
                    isPendingWinner && isCreator && isTied
                      ? `Choose the winner: ${option.text}`
                      : isWinner
                        ? `${option.text} — winner, ${option.voterCount} voters`
                        : revealed
                          ? `${option.text} — ${option.voterCount} voters`
                          : canVote
                            ? `Vote for ${option.text}`
                            : `Back this creator's work — tap to contribute`
                  }
                />
              );
            })
          )}
          <CelebrationBurst
            show={celebration !== null}
            theme={celebration ?? 'vote'}
            onComplete={handleCelebrationComplete}
          />
        </div>

        {/* Footer */}
        {votedOption && hasCompletedVote && (
          <div className={styles.footer}>
            <span className={styles.userVoteNote}>
              <CheckCircle width={14} height={14} aria-hidden="true" />
              You backed {votedOption.text}
            </span>
          </div>
        )}
        {hasPaidUnvoted && !isActive && (
          <div className={styles.footer}>
            <span className={styles.userVoteNote}>
              <CheckCircle width={14} height={14} aria-hidden="true" />
              You supported this commission — the poll ended before you voted
            </span>
          </div>
        )}

        {/* Owner panel — only shown to the commission creator */}
        {ownerPanel && (
          <div className={styles.ownerPanelWrap}>
            <button
              type="button"
              className={styles.ownerPanelTrigger}
              onClick={() => setOwnerPanelOpen((v) => !v)}
              aria-expanded={ownerPanelOpen}
            >
              <span className={styles.ownerPanelTriggerLabel}>Creator controls</span>
              <ChevronDown
                width={16}
                height={16}
                className={[
                  styles.ownerPanelChevron,
                  ownerPanelOpen ? styles['ownerPanelChevron--open'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
            </button>
            <div
              className={[
                styles.ownerPanelContent,
                ownerPanelOpen ? styles['ownerPanelContent--open'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden={!ownerPanelOpen}
            >
              <div className={styles.ownerPanelContentInner}>{ownerPanel}</div>
            </div>
          </div>
        )}
      </div>

      {viewingImage && (
        <ImageViewerModal
          imageUrl={viewingImage.url}
          alt={viewingImage.alt}
          onClose={() => setViewingImage(null)}
        />
      )}
    </BaseModal>
  );
}
