import { readQuillObj } from '@components/QuillEditor/readQuillObj';
import { useAuth } from '@domains/auth';
import { COMMISSION_TYPE_CONFIG } from '@domains/crowd-commissions/commissionTypeConfig';
import { useCrowdCommission } from '@domains/crowd-commissions/hooks/useCrowdCommission';
import { useUpdateCrowdCommission } from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import {
  BasicsStep,
  FundingStep,
  ReviewStep,
  StepIndicator,
} from '@domains/crowd-commissions/wizard/WizardComponents';
import { validateBasics, validateFunding } from '@domains/crowd-commissions/wizard/wizardConstants';
import type {
  BasicsForm,
  FundingForm,
  WizardStep,
} from '@domains/crowd-commissions/wizard/wizardTypes';
import { fromDateTimeLocalToISO, toDateTimeLocalValue } from '@domains/events/utils/eventFormUtils';
import { useFeatures } from '@hooks/useFeatures';
import type { RichTextOps } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import { getCrowdCommissionImageUrl } from '@utils/getImageUrls';
import type Quill from 'quill';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../CrowdCommissionCreatePage/CrowdCommissionCreatePage.module.scss';

function isoToDateTimeLocal(isoString: string | null): string {
  if (!isoString) return '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return toDateTimeLocalValue(new Date(isoString), tz);
}

export function CrowdCommissionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userName } = useAuth();
  const cancelTo = '/';
  const { crowdCommissionsGoalEnabled } = useFeatures();

  const { commission, loading, error } = useCrowdCommission(id ?? '');
  const { isLoading: isSaving, execute: updateCommission } = useUpdateCrowdCommission();

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [step, setStep] = useState<WizardStep>(1);
  const [initialised, setInitialised] = useState(false);
  const [descriptionOps, setDescriptionOps] = useState<RichTextOps>({ type: 'richText', ops: [] });
  const descriptionRef = useRef<Quill | null>(null);

  const [basics, setBasics] = useState<BasicsForm>({
    title: '',
    heroImageDataUrl: '',
    removedExistingImage: false,
    commissionType: 'standard',
    pollOptions: [],
    pollCaption: '',
  });

  const [funding, setFunding] = useState<FundingForm>({
    goalAmountDollars: '',
    fundingDeadlineAt: '',
    fundingTimezone: userTz,
  });

  const [basicsErrors, setBasicsErrors] = useState<
    Partial<Record<keyof BasicsForm | 'description', string>>
  >({});
  const [fundingErrors, setFundingErrors] = useState<Partial<Record<keyof FundingForm, string>>>(
    {},
  );

  useEffect(() => {
    if (!commission || initialised) return;

    setBasics({
      title: commission.title,
      heroImageDataUrl: '',
      removedExistingImage: false,
      commissionType: commission.commissionType ?? 'standard',
      pollOptions: (commission.pollOptions ?? []).map((opt, i) => ({
        text: opt.text,
        imageDataUrl: '',
        displayOrder: opt.displayOrder ?? i,
      })),
      pollCaption: commission.caption ?? '',
    });

    setFunding({
      goalAmountDollars:
        commission.goalAmountCents !== null ? (commission.goalAmountCents / 100).toFixed(2) : '',
      fundingDeadlineAt: isoToDateTimeLocal(commission.fundingDeadlineAt),
      fundingTimezone: userTz,
    });

    setInitialised(true);
  }, [commission, initialised, userTz]);

  const isActive = commission?.status === CrowdCommissionStatus.ACTIVE;

  const handleBasicsChange = useCallback(
    <K extends keyof BasicsForm>(key: K, value: BasicsForm[K]) => {
      setBasics((prev) => ({ ...prev, [key]: value }));
      setBasicsErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const handleFundingChange = useCallback(
    <K extends keyof FundingForm>(key: K, value: FundingForm[K]) => {
      setFunding((prev) => ({ ...prev, [key]: value }));
      setFundingErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const handleBasicsNext = useCallback(() => {
    const errs = validateBasics(basics, descriptionRef);
    if (Object.keys(errs).length > 0) {
      setBasicsErrors(errs);
      return;
    }
    const ops = descriptionRef.current?.getContents().ops ?? [];
    setDescriptionOps({ type: 'richText', ops: ops as Array<Record<string, unknown>> });
    // Active commissions skip FundingStep — funding fields are immutable while live
    setStep(isActive ? 3 : 2);
  }, [basics, isActive]);

  const handleFundingNext = useCallback(() => {
    const errs = validateFunding(funding, basics.commissionType);
    if (Object.keys(errs).length > 0) {
      setFundingErrors(errs);
      return;
    }
    setStep(3);
  }, [funding, basics.commissionType]);

  const handleSave = useCallback(async () => {
    if (!id) return;

    const goalCents = funding.goalAmountDollars
      ? Math.round(parseFloat(funding.goalAmountDollars) * 100)
      : null;

    const fundingDeadlineIso = funding.fundingDeadlineAt
      ? fromDateTimeLocalToISO(funding.fundingDeadlineAt, funding.fundingTimezone)
      : null;

    const isPoll = basics.commissionType === 'poll';

    const updated = await updateCommission(id, {
      title: basics.title.trim(),
      ...(isPoll
        ? {
            caption: basics.pollCaption.trim() || null,
            pollOptions: basics.pollOptions.map((opt) => ({
              text: opt.text,
              ...(opt.imageDataUrl ? { imageDataUrl: opt.imageDataUrl } : {}),
              displayOrder: opt.displayOrder,
            })),
          }
        : { description: descriptionOps }),
      ...(basics.heroImageDataUrl
        ? { heroImageDataUrl: basics.heroImageDataUrl }
        : basics.removedExistingImage
          ? { heroImageDataUrl: '' }
          : {}),
      // Funding fields are only sent for draft commissions
      ...(!isActive && {
        ...(isPoll
          ? {
              ...(fundingDeadlineIso
                ? { fundingDeadlineAt: fundingDeadlineIso }
                : { fundingDeadlineAt: null }),
            }
          : {
              ...(goalCents !== null ? { goalAmountCents: goalCents } : { goalAmountCents: null }),
              ...(fundingDeadlineIso
                ? { fundingDeadlineAt: fundingDeadlineIso }
                : { fundingDeadlineAt: null }),
            }),
      }),
    });

    if (updated) {
      navigate(
        COMMISSION_TYPE_CONFIG[updated.commissionType].getPostEditTarget(
          updated,
          userName ?? '',
          cancelTo,
        ),
      );
    }
  }, [id, basics, funding, descriptionOps, isActive, updateCommission, navigate, userName]);

  if (loading || !initialised) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessage}>Loading commission…</p>
      </div>
    );
  }

  if (error !== undefined || commission === undefined) {
    return (
      <div className={styles.page}>
        <p className={styles.stateMessageError}>{error ?? 'Commission not found.'}</p>
      </div>
    );
  }

  const descriptionPreview = readQuillObj(
    descriptionRef.current?.getContents().ops ?? descriptionOps.ops,
    'text',
  );

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <StepIndicator currentStep={step} ariaLabel="Commission editing steps" styles={styles} />

        {step === 1 && (
          <BasicsStep
            values={basics}
            onChange={handleBasicsChange}
            errors={basicsErrors}
            descriptionRef={descriptionRef}
            defaultDescription={commission.description ?? undefined}
            hideTypeToggle={true}
            cancelTo={cancelTo}
            onNext={handleBasicsNext}
            stepTitle="Edit commission"
            stepSubtitle={
              isActive
                ? 'You can update the title, description, and cover image. To change the funding goal or deadline, unpublish the commission first.'
                : 'Update the core details for your commission.'
            }
            existingHeroUrl={
              commission.heroImageUrl
                ? getCrowdCommissionImageUrl(
                    commission.creatorId,
                    commission.id,
                    commission.heroImageUrl,
                  )
                : null
            }
            styles={styles}
          />
        )}

        {step === 2 && !isActive && (
          <FundingStep
            values={funding}
            onChange={handleFundingChange}
            errors={fundingErrors}
            onBack={() => setStep(1)}
            onNext={handleFundingNext}
            stepTitle="Update funding goal"
            stepSubtitle="Adjust how much you need and by when."
            goalEnabled={crowdCommissionsGoalEnabled}
            commissionType={basics.commissionType}
            styles={styles}
          />
        )}

        {step === 3 && (
          <ReviewStep
            mode="edit"
            basics={basics}
            funding={funding}
            descriptionPreview={descriptionPreview}
            existingHeroUrl={
              commission.heroImageUrl
                ? getCrowdCommissionImageUrl(
                    commission.creatorId,
                    commission.id,
                    commission.heroImageUrl,
                  )
                : null
            }
            onBack={() => setStep(isActive ? 1 : 2)}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            stepTitle="Review changes"
            stepSubtitle="Check everything before saving."
            goalEnabled={crowdCommissionsGoalEnabled}
            commissionType={basics.commissionType}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
}
