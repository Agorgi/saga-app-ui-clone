// Front-end-only data shapes for the event "Interest Check" feature.
//
// There is no backend here: these model the wireframe's local state and fixtures so a
// real API can be wired to the same shapes later. A host proposes an event, people
// pre-commit (their card is shown as authorized, not charged), and the event confirms,
// charging pledgers, only if the interest threshold is met by the decision date.

export type ThresholdUnit = 'people' | 'amount';

export interface InterestThreshold {
  value: number;
  unit: ThresholdUnit;
}

export interface ProposedDate {
  id: string;
  /** datetime-local string, e.g. "2026-07-04T19:00" */
  at: string;
  timezone: string;
}

export interface InterestCheckRole {
  id: string;
  name: string;
  count?: number;
  note?: string;
}

export type InterestCheckStatus = 'draft' | 'open' | 'confirmed' | 'cancelled';

/** A pledger's card is authorized on commit, then charged (confirm) or released (cancel). */
export type PledgeState = 'authorized' | 'charged' | 'released';

export interface InterestCheckPledge {
  id: string;
  userName: string;
  /** Proposed-date ids this person can make. Empty/one for single-date checks. */
  dateChoice: string[];
  authorizedAmountCents: number;
  state: PledgeState;
}

export type ApplicationState = 'pending' | 'accepted';

export interface RoleApplication {
  id: string;
  roleId: string;
  userName: string;
  state: ApplicationState;
}

export interface InterestCheck {
  id: string;
  title: string;
  posterUrl?: string;
  location?: string;
  description?: string;
  coHostIds: string[];
  staffIds: string[];
  communityIds: string[];
  link?: string;
  dressCode?: string;
  /** 1 to 3 options. One = fixed date; multiple = a date vote. */
  proposedDates: ProposedDate[];
  ticketPriceCents: number;
  threshold: InterestThreshold;
  /** datetime-local string: "When we decide if it's on." */
  decisionDate: string;
  roles: InterestCheckRole[];
  status: InterestCheckStatus;
  /** Set when CONFIRMED with multiple proposed dates. */
  winningDateId?: string;
  pledges: InterestCheckPledge[];
  applications: RoleApplication[];
}
