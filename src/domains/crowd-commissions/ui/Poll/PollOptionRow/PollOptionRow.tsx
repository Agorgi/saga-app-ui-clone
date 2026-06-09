import { Check, ChevronRight, X } from '@untitledui/icons';
import type { CSSProperties } from 'react';
import { DONATION_PRESETS } from '../types';
import styles from './PollOptionRow.module.scss';

interface PollOptionBarStyle extends CSSProperties {
  '--fill-scale'?: number;
  '--stagger'?: string;
}

interface ChipStyle extends CSSProperties {
  '--chip-index'?: number;
}

interface PollOptionRowProps {
  readonly text: string;
  readonly imageUrl?: string | null;
  readonly percentage: number;
  readonly voteCount: number;
  readonly voterCount: number;
  readonly revealed: boolean;
  readonly isVoted: boolean;
  readonly isWinner: boolean;
  readonly isTied: boolean;
  readonly isCreator: boolean;
  readonly disabled: boolean;
  readonly isSelected?: boolean;
  readonly isPendingPayment?: boolean;
  readonly loadingPresetCents?: number | null;
  readonly staggerMs?: number;
  readonly showImage?: boolean;
  /** Kept for callers (PollCard, PollModal); unused — bars use brand tokens only */
  readonly color?: string;
  readonly size?: 'default' | 'modal';
  readonly isGolden?: boolean;
  readonly onClick?: () => void;
  readonly onImageClick?: () => void;
  readonly onPresetSelect?: (amountCents: number) => void;
  readonly onDismiss?: () => void;
  readonly ariaLabel?: string;
}

export function PollOptionRow({
  text,
  imageUrl,
  percentage,
  voterCount,
  revealed,
  isVoted,
  isWinner,
  isTied,
  isCreator,
  disabled,
  isSelected = false,
  isPendingPayment = false,
  loadingPresetCents = null,
  staggerMs = 0,
  showImage = false,
  size = 'default',
  isGolden = false,
  onClick,
  onImageClick,
  onPresetSelect,
  onDismiss,
  ariaLabel,
}: PollOptionRowProps) {
  const fillScale = percentage / 100;

  const stateClass = (() => {
    if (!revealed) return styles['bar--pre'];
    if (isVoted || isWinner) return styles['bar--active'];
    return styles['bar--muted'];
  })();

  const barClass = [
    styles.bar,
    stateClass,
    size === 'modal' ? styles['bar--modal'] : '',
    disabled && !isSelected ? styles['bar--disabled'] : '',
    isTied && isCreator ? styles['bar--tie'] : '',
    isSelected ? styles['bar--selected'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cssVars: PollOptionBarStyle = {
    '--fill-scale': fillScale,
    '--stagger': `${staggerMs}ms`,
  };

  const resolvedAriaLabel = ariaLabel ?? `Vote for: ${text}`;

  const isLoadingAny = loadingPresetCents !== null;

  const displayLabel = (() => {
    if (voterCount > 0) {
      return `${voterCount} voter${voterCount !== 1 ? 's' : ''}`;
    }
    if (revealed) {
      return '0 voters';
    }
    return null;
  })();

  // ── Modal layout: split card (image left + content right) ─────────────────
  if (size === 'modal') {
    const cardStateClass = (() => {
      if (isGolden) return styles['cardModal--golden'];
      if (isVoted && revealed) return styles['cardModal--brand'];
      return '';
    })();

    const cardClass = [
      styles.cardModal,
      cardStateClass,
      disabled && !isGolden && !isVoted ? styles['cardModal--disabled'] : '',
      isTied && isCreator && !isGolden ? styles['cardModal--tie'] : '',
    ]
      .filter(Boolean)
      .join(' ');

    const showVotedPill = isGolden && isVoted;

    return (
      <div
        className={cardClass}
        style={{ '--stagger': `${staggerMs}ms`, '--fill-scale': fillScale } as CSSProperties}
      >
        {/* Left: image zone */}
        <button
          type="button"
          className={styles.imageZone}
          onClick={imageUrl ? onImageClick : undefined}
          aria-label={imageUrl ? `View image for ${text}` : undefined}
          tabIndex={imageUrl ? 0 : -1}
          style={imageUrl ? undefined : { cursor: 'default', pointerEvents: 'none' }}
        >
          {imageUrl ? (
            <img className={styles.imageZoneImg} src={imageUrl} alt={text} loading="lazy" />
          ) : (
            <img
              className={styles.imageZoneFallback}
              src="/favicon.png"
              alt=""
              aria-hidden="true"
            />
          )}
        </button>

        {/* Right: content zone (vote target) */}
        <button
          type="button"
          className={styles.contentZone}
          onClick={!disabled && !isPendingPayment ? onClick : undefined}
          aria-label={resolvedAriaLabel}
          aria-pressed={isVoted}
          aria-disabled={disabled || isPendingPayment}
        >
          {/* Fill layer — scales from left based on vote percentage */}
          {revealed && <div className={styles.cardFill} aria-hidden="true" />}

          <span className={styles.optionLabel}>{text}</span>

          {(revealed && displayLabel) || showVotedPill ? (
            <div className={styles.statsRow}>
              {revealed && displayLabel && (
                <span className={styles.voterCount}>{displayLabel}</span>
              )}
              {showVotedPill && (
                <span className={styles.votedPill}>
                  <Check width={10} height={10} aria-hidden="true" />
                  You voted for this
                </span>
              )}
            </div>
          ) : null}

          {isTied && isCreator && !isGolden && (
            <span className={styles.pickWinnerCta} aria-hidden="true">
              Pick winner
              <ChevronRight className={styles.pickWinnerChevron} width={12} height={12} />
            </span>
          )}
        </button>
      </div>
    );
  }

  // ── Default layout (feed card): existing bar ──────────────────────────────

  if (isSelected && !isPendingPayment) {
    const selectedBarClass = [styles.bar, styles['bar--selected']].filter(Boolean).join(' ');

    return (
      <div className={styles.row}>
        <div className={selectedBarClass} style={cssVars}>
          <div className={styles.labelWrapper}>
            <span className={styles.optionText}>{text}</span>
          </div>
        </div>
        <fieldset className={styles.presets} aria-label={`Select vote amount for: ${text}`}>
          {DONATION_PRESETS.map(({ label, cents }, index) => {
            const chipStyle: ChipStyle = { '--chip-index': index };
            return (
              <button
                key={cents}
                type="button"
                style={chipStyle}
                className={[
                  styles.presetBtn,
                  loadingPresetCents === cents ? styles['presetBtn--loading'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onPresetSelect?.(cents)}
                disabled={isLoadingAny}
                aria-label={`${label} vote`}
                aria-busy={loadingPresetCents === cents}
              >
                {loadingPresetCents === cents ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : null}
                {label}
              </button>
            );
          })}
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={onDismiss}
            disabled={isLoadingAny}
            aria-label="Cancel vote selection"
          >
            <X width={13} height={13} aria-hidden="true" />
          </button>
        </fieldset>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={barClass}
        style={cssVars}
        onClick={!disabled && !isPendingPayment ? onClick : undefined}
        aria-label={resolvedAriaLabel}
        aria-pressed={isVoted}
        aria-disabled={disabled || isPendingPayment}
      >
        <div className={styles.fill} aria-hidden="true" />
        <div className={styles.labelWrapper}>
          <span className={styles.optionText}>{text}</span>
          {revealed && displayLabel && <span className={styles.percentage}>{displayLabel}</span>}
          {isTied && isCreator && (
            <span className={styles.pickWinnerCta} aria-hidden="true">
              Pick winner
              <ChevronRight className={styles.pickWinnerChevron} width={12} height={12} />
            </span>
          )}
        </div>
      </button>

      {showImage && imageUrl && (
        <img className={styles.optionImage} src={imageUrl} alt={text} loading="lazy" />
      )}
    </div>
  );
}
