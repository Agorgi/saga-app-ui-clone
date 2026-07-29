// Shared form shapes and step type used by both Create and Edit wizard pages.

export type WizardStep = 1 | 2 | 3;

export type CommissionType = 'standard' | 'poll';

export interface PollOptionForm {
  /** Stable client-side id for React keying — not sent to the backend */
  id?: string;
  text: string;
  /** base64 data URL for new images, or empty string for no image */
  imageDataUrl: string;
  displayOrder: number;
}

export interface BasicsForm {
  title: string;
  /** Holds a local data URL when a new image is selected; empty string means "no change / use existing". */
  heroImageDataUrl: string;
  /** True when the user explicitly removed an existing hero image in the edit flow. */
  removedExistingImage: boolean;
  commissionType: CommissionType;
  /** Used when commissionType === 'poll'. Min 2, max 5 options. */
  pollOptions: PollOptionForm[];
  /** Short subtitle shown under the poll title. Poll commissions only. Max 1000 chars. */
  pollCaption: string;
}

export interface FundingForm {
  goalAmountDollars: string;
  fundingDeadlineAt: string;
  fundingTimezone: string;
}
