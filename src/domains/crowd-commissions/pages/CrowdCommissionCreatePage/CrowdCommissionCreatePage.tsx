import { readQuillObj } from '@components/QuillEditor/readQuillObj';
import { useAuth } from '@domains/auth';
import { COMMISSION_TYPE_CONFIG } from '@domains/crowd-commissions/commissionTypeConfig';
import {
  useCreateCrowdCommission,
  usePublishCrowdCommission,
} from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import { CrowdCommissionConfirmModal } from '@domains/crowd-commissions/ui/Modals/CrowdCommissionConfirmModal';
import { useWizardDraft } from '@domains/crowd-commissions/wizard/useWizardDraft';
import {
  BasicsStep,
  FundingStep,
  ReviewStep,
  StepIndicator,
} from '@domains/crowd-commissions/wizard/WizardComponents';
import {
  INITIAL_BASICS,
  INITIAL_FUNDING,
  STEP_META,
  validateBasics,
  validateFunding,
} from '@domains/crowd-commissions/wizard/wizardConstants';
import type {
  BasicsForm,
  FundingForm,
  WizardStep,
} from '@domains/crowd-commissions/wizard/wizardTypes';
import { fromDateTimeLocalToISO } from '@domains/events/utils/eventFormUtils';
import { useFeatures } from '@hooks/useFeatures';
import type { RichTextOps } from '@saga/crowd-commission-middleware';
import type Quill from 'quill';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrowdCommissionCreatePage.module.scss';

export function CrowdCommissionCreatePage() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const { crowdCommissionsGoalEnabled } = useFeatures();

  const [step, setStep, clearStepDraft] = useWizardDraft<WizardStep>('saga_cc_step', 1);
  const [basics, setBasics, clearBasicsDraft] = useWizardDraft<BasicsForm>(
    'saga_cc_basics',
    INITIAL_BASICS,
    (b) => ({
      ...b,
      heroImageDataUrl: '',
      pollOptions: b.pollOptions.map((o) => ({ ...o, imageDataUrl: '' })),
    }),
  );
  const [funding, setFunding, clearFundingDraft] = useWizardDraft<FundingForm>(
    'saga_cc_funding',
    INITIAL_FUNDING,
  );
  const [basicsErrors, setBasicsErrors] = useState<
    Partial<Record<keyof BasicsForm | 'description', string>>
  >({});
  const [fundingErrors, setFundingErrors] = useState<Partial<Record<keyof FundingForm, string>>>(
    {},
  );
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [descriptionOps, setDescriptionOps, clearDescDraft] = useWizardDraft<RichTextOps>(
    'saga_cc_desc',
    { type: 'richText', ops: [] },
  );
  const descriptionRef = useRef<Quill | null>(null);

  const { execute: createCommission, isLoading: isCreating } = useCreateCrowdCommission();
  const { execute: publishCommission, isLoading: isPublishing } = usePublishCrowdCommission();

  const isSubmitting = isCreating || isPublishing;

  const clearAllDrafts = useCallback(() => {
    clearStepDraft();
    clearBasicsDraft();
    clearFundingDraft();
    clearDescDraft();
  }, [clearStepDraft, clearBasicsDraft, clearFundingDraft, clearDescDraft]);

  const handleBasicsChange = useCallback(
    <K extends keyof BasicsForm>(key: K, value: BasicsForm[K]) => {
      setBasics((prev) => ({ ...prev, [key]: value }));
      setBasicsErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [setBasics],
  );

  const handleFundingChange = useCallback(
    <K extends keyof FundingForm>(key: K, value: FundingForm[K]) => {
      setFunding((prev) => ({ ...prev, [key]: value }));
      setFundingErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [setFunding],
  );

  const handleBasicsNext = useCallback(() => {
    const errs = validateBasics(basics, descriptionRef);
    if (Object.keys(errs).length > 0) {
      setBasicsErrors(errs);
      return;
    }
    if (basics.commissionType === 'standard') {
      const ops = descriptionRef.current?.getContents().ops ?? [];
      setDescriptionOps({ type: 'richText', ops: ops as Array<Record<string, unknown>> });
    }
    setStep(2);
  }, [basics, setDescriptionOps, setStep]);

  const handleFundingNext = useCallback(() => {
    const errs = validateFunding(funding, basics.commissionType);
    if (Object.keys(errs).length > 0) {
      setFundingErrors(errs);
      return;
    }
    setStep(3);
  }, [funding, basics.commissionType, setStep]);

  const buildCreateInput = useCallback(() => {
    const isPoll = basics.commissionType === 'poll';
    const fundingDeadlineIso = funding.fundingDeadlineAt
      ? fromDateTimeLocalToISO(funding.fundingDeadlineAt, funding.fundingTimezone)
      : undefined;

    if (isPoll) {
      return {
        commissionType: 'poll' as const,
        title: basics.title.trim(),
        ...(basics.pollCaption.trim() ? { caption: basics.pollCaption.trim() } : {}),
        ...(basics.heroImageDataUrl ? { heroImageDataUrl: basics.heroImageDataUrl } : {}),
        ...(fundingDeadlineIso ? { fundingDeadlineAt: fundingDeadlineIso } : {}),
        pollOptions: basics.pollOptions.map((opt) => ({
          text: opt.text,
          displayOrder: opt.displayOrder,
          ...(opt.imageDataUrl ? { imageDataUrl: opt.imageDataUrl } : {}),
        })),
      };
    }

    const goalCents = funding.goalAmountDollars
      ? Math.round(parseFloat(funding.goalAmountDollars) * 100)
      : undefined;

    return {
      title: basics.title.trim(),
      description: descriptionOps,
      ...(basics.heroImageDataUrl ? { heroImageDataUrl: basics.heroImageDataUrl } : {}),
      ...(goalCents !== undefined ? { goalAmountCents: goalCents } : {}),
      ...(fundingDeadlineIso ? { fundingDeadlineAt: fundingDeadlineIso } : {}),
    };
  }, [basics, funding, descriptionOps]);

  const handleSaveDraft = useCallback(async () => {
    const commission = await createCommission(buildCreateInput());
    if (!commission) return;
    clearAllDrafts();
    navigate(
      COMMISSION_TYPE_CONFIG[commission.commissionType].getPostCreateTarget(
        commission,
        userName ?? '',
      ),
    );
  }, [buildCreateInput, clearAllDrafts, createCommission, navigate, userName]);

  const handleSaveAndPublish = useCallback(() => {
    setShowPublishModal(true);
  }, []);

  const handlePublishConfirm = useCallback(async () => {
    setShowPublishModal(false);
    const commission = await createCommission(buildCreateInput());
    if (!commission) return;
    await publishCommission(commission.id);
    clearAllDrafts();
    navigate(
      COMMISSION_TYPE_CONFIG[commission.commissionType].getPostCreateTarget(
        commission,
        userName ?? '',
      ),
    );
  }, [buildCreateInput, clearAllDrafts, createCommission, publishCommission, navigate, userName]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const descriptionPreview = readQuillObj(
    descriptionRef.current?.getContents().ops ?? descriptionOps.ops,
    'text',
  );

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <StepIndicator currentStep={step} ariaLabel="Commission creation steps" styles={styles} />

        {step === 1 && (
          <BasicsStep
            values={basics}
            onChange={handleBasicsChange}
            errors={basicsErrors}
            descriptionRef={descriptionRef}
            defaultDescription={descriptionOps}
            cancelTo={handleCancel}
            onNext={handleBasicsNext}
            stepTitle={STEP_META[1].title}
            stepSubtitle={STEP_META[1].subtitle}
            styles={styles}
          />
        )}

        {step === 2 && (
          <FundingStep
            values={funding}
            onChange={handleFundingChange}
            errors={fundingErrors}
            onBack={() => setStep(1)}
            onNext={handleFundingNext}
            stepTitle={STEP_META[2].title}
            stepSubtitle={STEP_META[2].subtitle}
            goalEnabled={crowdCommissionsGoalEnabled}
            commissionType={basics.commissionType}
            styles={styles}
          />
        )}

        {step === 3 && (
          <ReviewStep
            mode="create"
            basics={basics}
            funding={funding}
            descriptionPreview={descriptionPreview}
            onBack={() => setStep(2)}
            onSaveDraft={handleSaveDraft}
            onSaveAndPublish={handleSaveAndPublish}
            isSubmitting={isSubmitting}
            stepTitle={STEP_META[3].title}
            stepSubtitle={STEP_META[3].subtitle}
            goalEnabled={crowdCommissionsGoalEnabled}
            commissionType={basics.commissionType}
            styles={styles}
          />
        )}

        <CrowdCommissionConfirmModal
          variant="publish"
          isOpen={showPublishModal}
          onConfirm={handlePublishConfirm}
          onCancel={() => setShowPublishModal(false)}
          isLoading={isCreating || isPublishing}
        />
      </div>
    </div>
  );
}
