import type { CrowdCommission } from '@saga/crowd-commission-middleware';

import { CrowdCommissionCard } from '../CrowdCommissionCard/CrowdCommissionCard';
import { CrowdCommissionPollCard } from '../CrowdCommissionPollCard/CrowdCommissionPollCard';

interface CommissionFeedCardProps {
  commission: CrowdCommission;
  /**
   * Called when the user activates the card.
   * - Standard commissions: forwarded to the card's onClick; when provided it replaces the default sheet-open behavior.
   * - Poll commissions: ignored — polls always open the vote modal on click.
   */
  onNavigate?: () => void;
  /** Layout variant — only meaningful for poll cards. Defaults to 'default'. */
  variant?: 'default' | 'list';
  /**
   * Whether the current viewer has an active pledge on this commission.
   * Only relevant for standard commissions; poll cards derive this from usePollResults internally.
   * `null` (default) = unknown or not authenticated.
   */
  userHasBacked?: boolean | null;
}

/**
 * Unified feed card component for all commission types.
 *
 * Eliminates per-call-site branching on commissionType for card rendering.
 * Each underlying card component handles its own UX; this wrapper owns the dispatch.
 */
export function CommissionFeedCard({
  commission,
  onNavigate,
  variant,
  userHasBacked,
}: CommissionFeedCardProps) {
  if (commission.commissionType === 'poll') {
    return <CrowdCommissionPollCard commission={commission} variant={variant} />;
  }
  return (
    <CrowdCommissionCard
      commission={commission}
      onClick={onNavigate}
      userHasBacked={userHasBacked}
    />
  );
}
