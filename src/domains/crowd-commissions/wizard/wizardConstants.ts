import { constants } from '@saga/config-web';
import type Quill from 'quill';
import type { RefObject } from 'react';
import type { BasicsForm, FundingForm, WizardStep } from './wizardTypes';

// ─── Wizard constants ─────────────────────────────────────────────────────────

export const TITLE_MAX_CHARS = constants.crowdCommissions.titleMaxChars;
export const POLL_CAPTION_MAX_CHARS = constants.crowdCommissions.captionMaxChars;
export const PLATFORM_FEE_RATE = constants.crowdCommissions.platformFeeBps / 10000;
export const POLL_OPTION_MAX_CHARS = constants.crowdCommissions.pollOptionMaxChars;
export const POLL_OPTIONS_MIN = constants.crowdCommissions.pollOptionsMin;
export const POLL_OPTIONS_MAX = constants.crowdCommissions.pollOptionsMax;

export const DEFAULT_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function createDefaultPollOptions() {
  return [
    { id: crypto.randomUUID(), text: '', imageDataUrl: '', displayOrder: 0 },
    { id: crypto.randomUUID(), text: '', imageDataUrl: '', displayOrder: 1 },
  ];
}

export const INITIAL_BASICS: BasicsForm = {
  title: '',
  heroImageDataUrl: '',
  removedExistingImage: false,
  commissionType: 'poll',
  pollOptions: createDefaultPollOptions(),
  pollCaption: '',
};

export const INITIAL_FUNDING: FundingForm = {
  goalAmountDollars: '',
  fundingDeadlineAt: '',
  fundingTimezone: DEFAULT_TZ,
};

// ─── Step metadata ────────────────────────────────────────────────────────────

export interface StepMeta {
  readonly id: WizardStep;
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
}

export const STEP_META = {
  1: {
    id: 1,
    label: 'Basics',
    title: 'Set the scene',
    subtitle: 'Start with a cover, then tell your fans what this commission is about.',
  },
  2: {
    id: 2,
    label: 'Funding',
    title: 'Set your funding goal',
    subtitle: 'Define how much you need and by when. This step is optional.',
  },
  3: {
    id: 3,
    label: 'Review',
    title: 'Review & publish',
    subtitle: 'Check everything before saving or going live.',
  },
} satisfies Record<WizardStep, StepMeta>;

export const STEPS = [STEP_META[1], STEP_META[2], STEP_META[3]] as const;

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateBasics(
  values: BasicsForm,
  descriptionRef: RefObject<Quill | null>,
): Partial<Record<keyof BasicsForm | 'description' | `pollOption_${number}`, string>> {
  const errs: Partial<Record<string, string>> = {};

  if (!values.title.trim()) errs.title = 'Title is required';

  if (values.commissionType === 'standard') {
    const descText = descriptionRef.current?.getText().trim() ?? '';
    if (!descText) errs.description = 'Description is required';
  } else {
    // Poll validation
    if (values.pollOptions.length < POLL_OPTIONS_MIN) {
      errs.pollOptions = `At least ${POLL_OPTIONS_MIN} options are required`;
    }
    values.pollOptions.forEach((opt, i) => {
      if (!opt.text.trim()) errs[`pollOption_${i}`] = 'Option text is required';
      if (opt.text.length > POLL_OPTION_MAX_CHARS) {
        errs[`pollOption_${i}`] = `Option text cannot exceed ${POLL_OPTION_MAX_CHARS} characters`;
      }
    });
  }

  return errs;
}

export function validateFunding(
  values: FundingForm,
  commissionType: 'standard' | 'poll' = 'standard',
): Partial<Record<keyof FundingForm, string>> {
  const errs: Partial<Record<keyof FundingForm, string>> = {};

  if (commissionType === 'poll') {
    if (!values.fundingDeadlineAt) {
      errs.fundingDeadlineAt = 'A voting deadline is required for polls';
    }
  } else {
    if (values.goalAmountDollars) {
      const amount = parseFloat(values.goalAmountDollars);
      if (Number.isNaN(amount) || amount <= 0) {
        errs.goalAmountDollars = 'Goal must be a positive amount';
      }
    }
  }

  return errs;
}

// ─── Review helpers ───────────────────────────────────────────────────────────

export function formatReviewDeadline(value: string): string {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatGoalDisplay(goalAmountDollars: string): string {
  return goalAmountDollars ? `$${parseFloat(goalAmountDollars).toFixed(2)} USD` : 'Open goal';
}
