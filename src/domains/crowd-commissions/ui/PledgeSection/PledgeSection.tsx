import { useCrowdCommissionPledgeCheckout } from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import { useCallback } from 'react';
import { FundingProgress } from '../FundingProgress/FundingProgress';
import styles from './PledgeSection.module.scss';

interface PledgeSectionProps {
  commission: CrowdCommission;
  canBack: boolean;
  isLoading?: boolean;
}

const PLEDGE_PRESETS = [
  { label: '$1', cents: 100 },
  { label: '$2', cents: 200 },
  { label: '$5', cents: 500 },
] as const;

function getCannotBackMessage(status: CrowdCommission['status']): string {
  switch (status) {
    case CrowdCommissionStatus.DRAFT:
      return 'This commission is not yet open for backing.';
    case CrowdCommissionStatus.LOCKING:
      return 'This commission is currently locking — pledges are closed.';
    case CrowdCommissionStatus.PENDING_RESULT:
      return 'The commission period has ended — pledges are closed.';
    case CrowdCommissionStatus.COMPLETED:
      return 'This commission has been completed.';
    case CrowdCommissionStatus.FAILED:
      return 'This commission did not reach its goal. All pledges were refunded.';
    case CrowdCommissionStatus.ACTIVE:
      return 'Sign in to back this commission.';
    default:
      return 'Backing is currently unavailable.';
  }
}

export function PledgeSection({ commission, canBack, isLoading = false }: PledgeSectionProps) {
  const { isRedirecting, execute } = useCrowdCommissionPledgeCheckout();

  const handlePreset = useCallback(
    async (cents: number) => {
      await execute(commission.id, { amountCents: cents });
    },
    [commission.id, execute],
  );

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <FundingProgress
          collectedCents={commission.totalCollectedCents}
          goalAmountCents={commission.goalAmountCents}
          backerCount={commission.backerCount}
          currency={commission.currency}
          isLoading={isLoading}
        />
      </div>

      {canBack ? (
        <div className={styles.pledgeArea}>
          <div className={styles.presetRow}>
            {PLEDGE_PRESETS.map(({ label, cents }, i) => (
              <button
                key={cents}
                type="button"
                className={styles.presetBtn}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => void handlePreset(cents)}
                disabled={isRedirecting}
                aria-busy={isRedirecting}
              >
                {isRedirecting ? <span className={styles.spinner} aria-hidden="true" /> : label}
              </button>
            ))}
          </div>
          <p className={styles.hint}>
            You will be redirected to a secure checkout to complete your pledge.
          </p>
        </div>
      ) : (
        <div className={styles.unavailable} role="status">
          <p className={styles.unavailableMessage}>{getCannotBackMessage(commission.status)}</p>
        </div>
      )}
    </div>
  );
}
