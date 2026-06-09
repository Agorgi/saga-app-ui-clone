// Wireframe clone shim for the private @saga/crowd-commission-middleware package.
// These are pure types and string-const enums (no runtime/backend dependency), copied
// verbatim from the production middleware so cloned components import the real shapes.
// Aliased in vite.config.ts / tsconfig.json.

// ─── Commission type ──────────────────────────────────────────────────────────

export const CommissionType = {
  STANDARD: 'standard',
  POLL: 'poll',
} as const satisfies Record<string, string>;

export type CommissionTypeValue = (typeof CommissionType)[keyof typeof CommissionType];

// ─── Status ──────────────────────────────────────────────────────────────────

export const CrowdCommissionStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  LOCKING: 'locking',
  PENDING_WINNER: 'pending_winner',
  PENDING_RESULT: 'pending_result',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const satisfies Record<string, string>;

export type CrowdCommissionStatusValue =
  (typeof CrowdCommissionStatus)[keyof typeof CrowdCommissionStatus];

// ─── Rich text ───────────────────────────────────────────────────────────────

/** Quill Delta ops — mirrors RichTextContent from records-middleware. */
export interface RichTextOps {
  type: 'richText';
  ops: Array<Record<string, unknown>>;
}

// ─── Poll vote status ─────────────────────────────────────────────────────────

export const PollVoteStatus = {
  PENDING: 'pending',
  PAID_UNVOTED: 'paid_unvoted',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  FAILED: 'failed',
} as const satisfies Record<string, string>;

export type PollVoteStatusValue = (typeof PollVoteStatus)[keyof typeof PollVoteStatus];

// ─── Poll shapes ──────────────────────────────────────────────────────────────

export interface CrowdCommissionPollOption {
  id: string;
  commissionId: string;
  text: string;
  imageUrl: string | null;
  displayOrder: number;
  voteCount: number;
  voterCount: number;
  createdAt: string;
}

export interface CrowdCommissionPollVote {
  id: string;
  commissionId: string;
  optionId: string;
  voterId: string;
  transactionId: string | null;
  voteWeightCents: number;
  status: PollVoteStatusValue;
  sessionUrl: string | null;
  createdAt: string;
}

/** Lean view of a viewer's own vote — excludes internal fields (transactionId, voterId). */
export interface UserVoteView {
  id: string;
  /** null when status is 'paid_unvoted' (payment received, option not yet chosen) */
  optionId: string | null;
  status: PollVoteStatusValue;
  voteWeightCents: number;
  /** Stripe checkout URL; non-null only while status is 'pending'. */
  sessionUrl: string | null;
  createdAt: string;
}

export interface PollResultsResponse {
  options: Array<CrowdCommissionPollOption & { percentage: number }>;
  totalWeightedVotes: number;
  totalVoters: number;
  /** Total amount collected from all payments (voted + paid_unvoted), in cents. */
  totalCollectedCents: number;
  userVote: UserVoteView | null;
}

// ─── Core shape (API response) ────────────────────────────────────────────────

export interface CrowdCommission {
  id: string;
  creatorId: string;
  commissionType: CommissionTypeValue;
  title: string;
  caption: string | null;
  description: RichTextOps | null;
  heroImageUrl: string | null;
  endResultMediaIds: string[] | null;
  endResultDescription: RichTextOps | null;
  goalAmountCents: number | null;
  fundingDeadlineAt: string | null; // ISO-8601 UTC
  currency: string;
  platformFeeBps: number;
  // Poll-specific fields (null for STANDARD)
  winnerOptionId: string | null;
  pendingWinnerAt: string | null;
  status: CrowdCommissionStatusValue;
  publishedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  totalCollectedCents: number;
  totalRefundedCents: number;
  totalDisbursedCents: number;
  backerCount: number;
  publishGeneration: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  /** The post created to deliver the finished work (STANDARD commissions only). */
  resultPost: { id: string } | null;
  /** Populated when fetching a single poll commission. */
  pollOptions: CrowdCommissionPollOption[] | null;
}

// ─── API request shapes ───────────────────────────────────────────────────────

export interface CreatePollOptionInput {
  text: string; // max 200 chars
  imageDataUrl?: string;
  displayOrder: number;
}

export interface CreateCrowdCommissionInput {
  commissionType?: CommissionTypeValue; // defaults to 'standard'
  title: string;
  /** Short subtitle shown under the poll title. Poll commissions only. Max 1000 chars. */
  caption?: string;
  description?: RichTextOps; // required for STANDARD
  heroImageDataUrl?: string;
  goalAmountCents?: number; // STANDARD only
  fundingDeadlineAt?: string; // ISO-8601
  // Poll-specific
  pollOptions?: CreatePollOptionInput[];
}

export interface UpdateCrowdCommissionInput {
  title?: string;
  /** Short subtitle shown under the poll title. Poll commissions only. Max 1000 chars. */
  caption?: string | null;
  description?: RichTextOps;
  heroImageDataUrl?: string;
  goalAmountCents?: number | null;
  fundingDeadlineAt?: string | null;
  // Poll-specific (draft only)
  pollOptions?: CreatePollOptionInput[];
}

export interface CreatePledgeInput {
  amountCents: number;
}

export interface CreatePollVoteInput {
  optionId: string;
  amountCents: number;
}

export interface PickWinnerInput {
  optionId: string;
}

// ─── Summary (for pledge list header / creator dashboard) ────────────────────

export interface CrowdCommissionSummary {
  totalCollectedCents: number;
  totalRefundedCents: number;
  totalDisbursedCents: number;
  backerCount: number;
  status: CrowdCommissionStatusValue;
  goalAmountCents: number | null;
  fundingDeadlineAt: string | null;
}

// ─── Pledge (backer's view) ───────────────────────────────────────────────────

export type PledgeStatusValue =
  | 'pending'
  | 'succeeded'
  | 'refunded'
  | 'failed'
  | 'expired'
  | 'refund_failed';

export interface CrowdCommissionPledge {
  id: string;
  crowdCommissionId: string;
  amountCents: number;
  platformFeeCents: number;
  netAmountCents: number;
  currency: string;
  status: PledgeStatusValue;
  createdAt: string;
}
