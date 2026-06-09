import { PledgeSection } from '@domains/crowd-commissions/ui/PledgeSection/PledgeSection';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import type { RefObject } from 'react';
import styles from './CommissionPledgeCard.module.scss';

interface CommissionPledgeCardProps {
  commission: CrowdCommission;
  canBack: boolean;
  pledgeSectionRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

export function CommissionPledgeCard({
  commission,
  canBack,
  pledgeSectionRef,
  isLoading,
}: CommissionPledgeCardProps) {
  const isActive = commission.status === CrowdCommissionStatus.ACTIVE;

  return (
    <div className={styles.pledgeCard} ref={pledgeSectionRef}>
      {isActive && <h2 className={styles.pledgeCardHeading}>Back this commission</h2>}
      <PledgeSection commission={commission} canBack={canBack} isLoading={isLoading} />
    </div>
  );
}
