import { getProfileUrl } from '@domains/posts/utils/getProfileUrl';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';

import type { CommissionType } from './wizard/wizardTypes';

interface CommissionTypeConfig {
  /** Navigation target after creating this commission type. */
  getPostCreateTarget: (commission: CrowdCommission, userName: string) => string;
  /** Navigation target after editing this commission type. */
  getPostEditTarget: (commission: CrowdCommission, userName: string, cancelTo: string) => string;
}

/**
 * Single source of truth for all frontend divergence between commission types.
 *
 * Add a new entry here when adding a new commission type — TypeScript will enforce
 * completeness via the Record<CommissionType, ...> shape.
 */
export const COMMISSION_TYPE_CONFIG: Record<CommissionType, CommissionTypeConfig> = {
  standard: {
    getPostCreateTarget: () => '/',
    getPostEditTarget: (_, __, cancelTo) => cancelTo,
  },
  poll: {
    getPostCreateTarget: (_, userName) => getProfileUrl(userName, { tab: 'commissions' }),
    getPostEditTarget: (_, userName) => getProfileUrl(userName, { tab: 'commissions' }),
  },
};
