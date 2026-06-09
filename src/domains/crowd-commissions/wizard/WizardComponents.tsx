import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';
import { useFileInput } from '@hooks/useFileInput';
import { Button } from '@saga/global-web';
import { logger } from '@saga/logger-middleware';
import type { RichTextOps } from '@saga/crowd-commission-middleware';
import {
  AlertCircle,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  BarChart01,
  Check,
  CheckCircle,
  Clock,
  CurrencyDollar,
  File02,
  Image01,
  InfoCircle,
  Save01,
  Send01,
} from '@untitledui/icons';
import { readFileAsDataURL, validateImage } from '@utils/fileUtils';
import type Quill from 'quill';
import { type RefObject, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PollOptionsSection } from './steps/PollOptionsSection';
import { StandardDescriptionSection } from './steps/StandardDescriptionSection';
import {
  createDefaultPollOptions,
  formatGoalDisplay,
  formatReviewDeadline,
  PLATFORM_FEE_RATE,
  STEPS,
  TITLE_MAX_CHARS,
} from './wizardConstants';
import type { BasicsForm, CommissionType, FundingForm, WizardStep } from './wizardTypes';

// ─── StepIndicator ────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  readonly currentStep: WizardStep;
  readonly ariaLabel?: string;
  readonly styles: Record<string, string>;
}

export function StepIndicator({
  currentStep,
  ariaLabel = 'Commission steps',
  styles,
}: StepIndicatorProps) {
  return (
    <nav className={styles.stepIndicator} aria-label={ariaLabel}>
      {STEPS.map(({ id, label }, i) => {
        const circleClass = [
          styles.stepCircle,
          currentStep === id ? styles['stepCircle--active'] : '',
          currentStep > id ? styles['stepCircle--done'] : '',
        ]
          .filter(Boolean)
          .join(' ');
        const labelClass = [styles.stepLabel, currentStep === id ? styles['stepLabel--active'] : '']
          .filter(Boolean)
          .join(' ');
        return (
          <div key={id} className={styles.stepIndicatorItem}>
            <div className={circleClass} aria-current={currentStep === id ? 'step' : undefined}>
              {currentStep > id ? <Check width={12} height={12} aria-hidden="true" /> : id}
            </div>
            <span className={labelClass}>{label}</span>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  styles.stepConnector,
                  currentStep > id ? styles['stepConnector--done'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ─── StepNav ──────────────────────────────────────────────────────────────────

interface StepNavProps {
  /** String → renders a cancel Link; function → renders a back Button. */
  readonly backTo: string | (() => void);
  readonly onNext: () => void;
  readonly nextLabel?: string;
  readonly nextDisabled?: boolean;
  /** Icon rendered inside the primary forward button. Defaults to ArrowNarrowRight. */
  readonly nextIcon?: React.ReactNode;
  readonly extraAction?: React.ReactNode;
  readonly styles: Record<string, string>;
}

export function StepNav({
  backTo,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  nextIcon,
  extraAction,
  styles,
}: StepNavProps) {
  const backIcon = <ArrowNarrowLeft width={18} height={18} aria-hidden="true" />;
  const fwdIcon = nextIcon ?? <ArrowNarrowRight width={18} height={18} aria-hidden="true" />;

  return (
    <div className={styles.stepNav}>
      <div className={styles.stepNavLeft}>
        {typeof backTo === 'string' ? (
          <Link to={backTo} className={`${styles.btnPill} ${styles.btnCancel}`} aria-label="Cancel">
            {backIcon}
            <span className={styles.btnLabel}>Cancel</span>
          </Link>
        ) : (
          <Button
            className={`${styles.btnPill} ${styles.btnSecondary}`}
            onClick={backTo}
            aria-label="Back"
          >
            {backIcon}
            <span className={styles.btnLabel}>Back</span>
          </Button>
        )}
      </div>
      <div className={styles.stepNavRight}>
        {extraAction}
        <Button
          className={styles.btnPill}
          onClick={onNext}
          disabled={nextDisabled}
          aria-label={nextLabel}
        >
          <span className={styles.btnLabel}>{nextLabel}</span>
          {fwdIcon}
        </Button>
      </div>
    </div>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────

interface FieldErrorProps {
  readonly message: string | undefined;
  readonly styles: Record<string, string>;
}

export function FieldError({ message, styles }: FieldErrorProps) {
  if (!message) return null;
  return <span className={styles.fieldError}>{message}</span>;
}

// ─── ReviewRow ────────────────────────────────────────────────────────────────

interface ReviewRowProps {
  readonly label: string;
  readonly value: string;
  readonly styles: Record<string, string>;
}

export function ReviewRow({ label, value, styles }: ReviewRowProps) {
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value || '—'}</span>
    </div>
  );
}

// ─── BasicsStep ───────────────────────────────────────────────────────────────

interface BasicsStepProps {
  readonly values: BasicsForm;
  readonly onChange: <K extends keyof BasicsForm>(key: K, value: BasicsForm[K]) => void;
  readonly errors: Partial<Record<string, string>>;
  /** Ref to the Quill instance used for the description editor. */
  readonly descriptionRef: RefObject<Quill | null>;
  /** Default content to pre-populate the editor (edit flow). */
  readonly defaultDescription?: RichTextOps;
  /** String → cancel Link (Edit flow); function → cancel Button (Create flow). */
  readonly cancelTo: string | (() => void);
  readonly onNext: () => void;
  readonly stepTitle: string;
  readonly stepSubtitle: string;
  /** Existing persisted hero URL — shown when no new file is picked */
  readonly existingHeroUrl?: string | null;
  /** If true, the commission type toggle is hidden (edit flow locks the type) */
  readonly hideTypeToggle?: boolean;
  readonly styles: Record<string, string>;
}

export function BasicsStep({
  values,
  onChange,
  errors,
  descriptionRef,
  defaultDescription,
  cancelTo,
  onNext,
  stepTitle,
  stepSubtitle,
  existingHeroUrl,
  hideTypeToggle = false,
  styles,
}: BasicsStepProps) {
  const descriptionId = useId();
  const captionId = useId();
  const isPoll = values.commissionType === 'poll';

  const { openFilePicker, inputProps, reset } = useFileInput({
    accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp',
    onFiles: async (files) => {
      const file = files[0];
      if (!file) return;
      const error = validateImage(file);
      if (error) {
        toast.error(error);
        reset();
        return;
      }
      try {
        const dataUrl = await readFileAsDataURL(file);
        onChange('heroImageDataUrl', dataUrl);
      } catch (err) {
        logger.error({ error: err }, 'Failed to load hero image');
        toast.error('Failed to load hero image');
      }
    },
  });

  const previewSrc =
    values.heroImageDataUrl || (!values.removedExistingImage && existingHeroUrl) || '';

  return (
    <div className={styles.stepContent}>
      <div className={styles.fields}>
        {/* ── Title — big composer input leads, like the event creation form ── */}
        <div className={styles.formGroup}>
          <input
            className={[styles.composerTitle, errors.title ? styles.composerTitleError : '']
              .filter(Boolean)
              .join(' ')}
            type="text"
            placeholder="Commission title"
            maxLength={TITLE_MAX_CHARS}
            value={values.title}
            onChange={(e) => onChange('title', e.target.value)}
            aria-label="Commission title"
          />
          <FieldError message={errors.title} styles={styles} />
        </div>

        {/* ── Cover image ── */}
        <div className={styles.formGroup}>
          <input {...inputProps} />
          {previewSrc ? (
            <div className={styles.imagePreview}>
              <img src={previewSrc} alt="Cover preview" />
              <button
                type="button"
                className={styles.removeImageBtn}
                onClick={() => {
                  onChange('heroImageDataUrl', '');
                  onChange('removedExistingImage', true);
                  reset();
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Upload cover image"
              className={styles.coverZone}
              onClick={openFilePicker}
            >
              <Image01 className={styles.coverZoneIcon} width={20} height={20} aria-hidden="true" />
              <p className={styles.coverZoneTitle}>Add a cover image</p>
              <p className={styles.coverZoneSub}>1200 × 400 · PNG, JPG, WebP · optional</p>
            </button>
          )}
        </div>

        {/* ── Commission type toggle (hidden in edit flow) ── */}
        {!hideTypeToggle && (
          <div className={styles.formGroup}>
            <div className={styles.pillTrack} role="radiogroup" aria-label="Commission type">
              <div
                className={[styles.pillSlider, !isPoll ? styles['pillSlider--second'] : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
              <label
                className={[styles.pillOption, isPoll ? styles['pillOption--active'] : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="commissionType"
                  value="poll"
                  checked={isPoll}
                  onChange={() => {
                    onChange('commissionType', 'poll');
                    onChange('pollOptions', createDefaultPollOptions());
                  }}
                  className={styles.srOnly}
                />
                Poll
              </label>
              <label
                className={[styles.pillOption, !isPoll ? styles['pillOption--active'] : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="commissionType"
                  value="standard"
                  checked={!isPoll}
                  onChange={() => onChange('commissionType', 'standard')}
                  className={styles.srOnly}
                />
                Description
              </label>
            </div>

            {/* Callout — key forces remount on type change, triggering fade-in */}
            <div key={values.commissionType} role="status" className={styles.typeCallout}>
              {isPoll ? (
                <BarChart01
                  className={styles.typeCalloutIcon}
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              ) : (
                <File02
                  className={styles.typeCalloutIcon}
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              )}
              {isPoll ? (
                <span>
                  <strong>Poll commission</strong> — Let fans vote on what you create next. Each
                  vote costs a set price you choose. The winning option is determined after the
                  deadline.
                </span>
              ) : (
                <span>
                  <strong>Description commission</strong> — Write what you're creating and why.
                  Backers fund your work directly with a pledge amount they choose.
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Content area: one clear branch per commission type ── */}
        {isPoll ? (
          <PollOptionsSection
            values={values}
            onChange={onChange}
            errors={errors}
            styles={styles}
            captionId={captionId}
          />
        ) : (
          <StandardDescriptionSection
            descriptionRef={descriptionRef}
            defaultDescription={defaultDescription}
            errors={errors}
            styles={styles}
            descriptionId={descriptionId}
          />
        )}
      </div>

      <StepNav backTo={cancelTo} onNext={onNext} nextLabel="Next: Funding" styles={styles} />
    </div>
  );
}

// ─── BehaviorCallout ──────────────────────────────────────────────────────────

interface BehaviorCalloutProps {
  readonly hasGoal: boolean;
  readonly hasDeadline: boolean;
  readonly styles: Record<string, string>;
}

function BehaviorCallout({ hasGoal, hasDeadline, styles }: BehaviorCalloutProps) {
  if (!hasGoal && !hasDeadline) {
    return (
      <p className={`${styles.behaviorCallout} ${styles['behaviorCallout--warning']}`}>
        <AlertCircle className={styles.behaviorCalloutIcon} aria-hidden />
        Set at least a goal or a deadline before publishing. You can save a draft without either.
      </p>
    );
  }

  if (hasGoal && hasDeadline) {
    return (
      <p className={styles.behaviorCallout}>
        <InfoCircle className={styles.behaviorCalloutIcon} aria-hidden />
        Pledges are collected until the deadline. If the goal is met, funds are disbursed to you. If
        not, all backers are refunded automatically.
      </p>
    );
  }

  if (hasDeadline) {
    return (
      <p className={styles.behaviorCallout}>
        <InfoCircle className={styles.behaviorCalloutIcon} aria-hidden />
        Pledges are collected until the deadline. All funds collected are disbursed to you when it
        ends — no goal check.
      </p>
    );
  }

  // hasGoal only
  return (
    <p className={styles.behaviorCallout}>
      <InfoCircle className={styles.behaviorCalloutIcon} aria-hidden />
      Pledges are collected indefinitely. The moment the goal is hit, funding closes automatically
      and all funds are disbursed to you.
    </p>
  );
}

// ─── FundingStep ──────────────────────────────────────────────────────────────

interface FundingStepProps {
  readonly values: FundingForm;
  readonly onChange: <K extends keyof FundingForm>(key: K, value: FundingForm[K]) => void;
  readonly errors: Partial<Record<keyof FundingForm, string>>;
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly stepTitle: string;
  readonly stepSubtitle: string;
  readonly goalEnabled: boolean;
  readonly commissionType?: CommissionType;
  readonly styles: Record<string, string>;
}

export function FundingStep({
  values,
  onChange,
  errors,
  onBack,
  onNext,
  stepTitle,
  stepSubtitle,
  goalEnabled,
  commissionType = 'standard',
  styles,
}: FundingStepProps) {
  const goalId = useId();
  const isPoll = commissionType === 'poll';
  const hasGoal = goalEnabled && !isPoll && values.goalAmountDollars.trim() !== '';
  const hasDeadline = values.fundingDeadlineAt.trim() !== '';
  const goalCents = hasGoal ? Math.round(parseFloat(values.goalAmountDollars) * 100) : null;
  const platformFeeDollars =
    goalCents !== null && !Number.isNaN(goalCents)
      ? ((goalCents * PLATFORM_FEE_RATE) / 100).toFixed(2)
      : null;

  const handleGoalChange = (value: string) => {
    onChange('goalAmountDollars', value);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>{stepTitle}</h2>
        <p className={styles.stepSubtitle}>{stepSubtitle}</p>
      </div>

      <div className={styles.fields}>
        {/* Goal amount (standard only) */}
        {goalEnabled && !isPoll && (
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor={goalId}>
              Funding goal (in USD)
            </label>
            <p className={styles.hint}>Leave blank for an open goal — any amount accepted.</p>
            <div className={styles.inputPrefix}>
              <span className={styles.prefix}>$</span>
              <input
                id={goalId}
                className={[
                  styles.input,
                  styles.inputWithPrefix,
                  errors.goalAmountDollars ? styles.inputError : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={values.goalAmountDollars}
                onChange={(e) => handleGoalChange(e.target.value)}
              />
            </div>
            <FieldError message={errors.goalAmountDollars} styles={styles} />
            {platformFeeDollars !== null && (
              <p className={styles.feeInfo}>
                Platform fee: {Math.round(PLATFORM_FEE_RATE * 100)}% (${platformFeeDollars} on this
                goal)
              </p>
            )}
          </div>
        )}

        {/* Funding deadline */}
        <div className={styles.formGroup}>
          <p className={styles.label}>Funding deadline</p>
          <p className={styles.hint}>When pledges stop being accepted.</p>
          <DateTimePicker
            startAt={values.fundingDeadlineAt}
            endAt=""
            timezone={values.fundingTimezone}
            onChange={(key, value) => {
              if (key === 'startAt') onChange('fundingDeadlineAt', value);
            }}
            onTimezoneChange={(tz) => onChange('fundingTimezone', tz)}
            showEndDate={false}
          />
          <FieldError message={errors.fundingDeadlineAt} styles={styles} />
        </div>
      </div>

      {!isPoll && <BehaviorCallout hasGoal={hasGoal} hasDeadline={hasDeadline} styles={styles} />}
      {isPoll && hasDeadline && (
        <p className={styles.behaviorCallout}>
          <InfoCircle className={styles.behaviorCalloutIcon} aria-hidden />
          All votes are collected until the deadline, then the winning option is determined
          automatically. In case of a tie, you&apos;ll pick the winner.
        </p>
      )}

      <StepNav backTo={onBack} onNext={onNext} nextLabel="Next: Review" styles={styles} />
    </div>
  );
}

// ─── ReviewStep ───────────────────────────────────────────────────────────────

interface ReviewStepCreateProps {
  readonly mode: 'create';
  readonly onSaveDraft: () => void;
  readonly onSaveAndPublish: () => void;
  readonly isSubmitting: boolean;
}

interface ReviewStepEditProps {
  readonly mode: 'edit';
  readonly existingHeroUrl: string | null;
  readonly onSave: () => void;
  readonly isSaving: boolean;
}

type ReviewStepProps = {
  readonly basics: BasicsForm;
  readonly funding: FundingForm;
  /** Plain-text summary of the description for the review row. */
  readonly descriptionPreview: string;
  readonly onBack: () => void;
  readonly stepTitle: string;
  readonly stepSubtitle: string;
  readonly goalEnabled: boolean;
  readonly commissionType?: CommissionType;
  readonly styles: Record<string, string>;
} & (ReviewStepCreateProps | ReviewStepEditProps);

export function ReviewStep(props: ReviewStepProps) {
  const {
    basics,
    funding,
    descriptionPreview,
    onBack,
    stepTitle,
    stepSubtitle,
    goalEnabled,
    commissionType = 'standard',
    styles,
  } = props;

  const isPoll = commissionType === 'poll';
  const goalDisplay = formatGoalDisplay(funding.goalAmountDollars);

  const heroPreview =
    props.mode === 'edit'
      ? basics.heroImageDataUrl || (!basics.removedExistingImage ? props.existingHeroUrl : null)
      : basics.heroImageDataUrl || undefined;

  const CAPTION_TRUNCATE_AT = 120;
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const captionNeedsTruncation = (basics.pollCaption?.length ?? 0) > CAPTION_TRUNCATE_AT;
  const captionText =
    isCaptionExpanded || !captionNeedsTruncation
      ? basics.pollCaption
      : `${basics.pollCaption?.slice(0, CAPTION_TRUNCATE_AT).trimEnd()}…`;

  const navProps =
    props.mode === 'create'
      ? {
          onNext: props.onSaveAndPublish,
          nextLabel: props.isSubmitting ? 'Publishing…' : 'Save & publish',
          nextIcon: <Send01 width={18} height={18} aria-hidden="true" />,
          nextDisabled: props.isSubmitting,
          extraAction: (
            <Button
              className={`${styles.btnPill} ${styles.btnSecondary}`}
              onClick={props.onSaveDraft}
              disabled={props.isSubmitting}
              aria-label="Save as draft"
            >
              <Save01 width={18} height={18} aria-hidden="true" />
              <span className={styles.btnLabel}>Save as draft</span>
            </Button>
          ),
        }
      : {
          onNext: props.onSave,
          nextLabel: props.isSaving ? 'Saving…' : 'Save changes',
          nextDisabled: props.isSaving,
          extraAction: undefined,
        };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>{stepTitle}</h2>
        <p className={styles.stepSubtitle}>{stepSubtitle}</p>
      </div>

      {/* ── Preview card — shows exactly what the commission will look like ── */}
      <section className={styles.reviewPreview} aria-label="Commission preview">
        {/* Hero with title overlay — OR title zone when no image */}
        {heroPreview ? (
          <div className={styles.reviewPreviewHero}>
            <img src={heroPreview} alt="" className={styles.reviewPreviewHeroImg} />
            <div className={styles.reviewPreviewHeroOverlay} aria-hidden="true" />
            <div className={styles.reviewPreviewHeroFooter}>
              <span className={styles.reviewTypeChip}>
                {isPoll ? (
                  <BarChart01 width={11} height={11} aria-hidden="true" />
                ) : (
                  <File02 width={11} height={11} aria-hidden="true" />
                )}
                {isPoll ? 'Poll' : 'Standard'}
              </span>
              <p className={styles.reviewPreviewHeroTitle}>{basics.title || 'Untitled'}</p>
            </div>
          </div>
        ) : (
          <div className={styles.reviewPreviewTitleZone}>
            <span className={styles.reviewTypeChip}>
              {isPoll ? (
                <BarChart01 width={11} height={11} aria-hidden="true" />
              ) : (
                <File02 width={11} height={11} aria-hidden="true" />
              )}
              {isPoll ? 'Poll' : 'Standard'}
            </span>
            <p className={styles.reviewPreviewTitle}>{basics.title || 'Untitled'}</p>
            {isPoll && basics.pollCaption && (
              <p className={styles.reviewPollCaption}>
                {captionText}
                {captionNeedsTruncation && (
                  <button
                    type="button"
                    className={styles.reviewCaptionToggle}
                    onClick={() => setIsCaptionExpanded((prev) => !prev)}
                  >
                    {isCaptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>
            )}
          </div>
        )}

        {/* Body: description / poll options + funding stats */}
        {heroPreview && isPoll && basics.pollCaption && (
          <p className={styles.reviewPollCaption}>
            {captionText}
            {captionNeedsTruncation && (
              <button
                type="button"
                className={styles.reviewCaptionToggle}
                onClick={() => setIsCaptionExpanded((prev) => !prev)}
              >
                {isCaptionExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
        )}
        <div className={styles.reviewPreviewBody}>
          {isPoll ? (
            <ol className={styles.reviewPollOptions} aria-label="Poll options">
              {basics.pollOptions.map((opt, i) => (
                <li key={opt.id ?? i} className={styles.reviewPollOption}>
                  <span className={styles.reviewPollOptionNum} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={styles.reviewPollOptionText}>
                    {opt.text || <em>Untitled option</em>}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            descriptionPreview && (
              <p className={styles.reviewPreviewDesc}>
                {descriptionPreview.length > 180
                  ? `${descriptionPreview.slice(0, 180)}…`
                  : descriptionPreview}
              </p>
            )
          )}

          {/* Funding stats — only when at least one is set */}
          {(funding.fundingDeadlineAt || (!isPoll && goalEnabled && funding.goalAmountDollars)) && (
            <>
              <div className={styles.reviewDivider} aria-hidden="true" />
              <div className={styles.reviewFundingGrid}>
                {!isPoll && goalEnabled && funding.goalAmountDollars && (
                  <div className={styles.reviewFundingStat}>
                    <span className={styles.reviewFundingStatIcon}>
                      <CurrencyDollar width={15} height={15} aria-hidden="true" />
                    </span>
                    <span className={styles.reviewFundingStatMeta}>
                      <span className={styles.reviewFundingStatLabel}>Goal</span>
                      <span className={styles.reviewFundingStatValue}>{goalDisplay}</span>
                    </span>
                  </div>
                )}
                {funding.fundingDeadlineAt && (
                  <div className={styles.reviewFundingStat}>
                    <span className={styles.reviewFundingStatIcon}>
                      <Clock width={15} height={15} aria-hidden="true" />
                    </span>
                    <span className={styles.reviewFundingStatMeta}>
                      <span className={styles.reviewFundingStatLabel}>
                        {isPoll ? 'Voting ends' : 'Deadline'}
                      </span>
                      <span className={styles.reviewFundingStatValue}>
                        {formatReviewDeadline(funding.fundingDeadlineAt)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Ready banner — create mode only ── */}
      {props.mode === 'create' && (
        <div className={styles.reviewReadyBanner} role="status">
          <CheckCircle
            width={16}
            height={16}
            className={styles.reviewReadyBannerIcon}
            aria-hidden="true"
          />
          Everything looks good — publish now or save as draft.
        </div>
      )}

      <StepNav backTo={onBack} {...navProps} styles={styles} />
    </div>
  );
}
