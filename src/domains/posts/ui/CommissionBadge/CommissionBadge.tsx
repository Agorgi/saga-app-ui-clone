import { ChevronRight, CoinsHand } from '@untitledui/icons';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CommissionBadge.module.scss';

interface CommissionBadgeProps {
  crowdCommissionId: string;
  variant: 'overlay' | 'inline';
  onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CommissionBadge: React.FC<CommissionBadgeProps> = ({
  crowdCommissionId,
  variant,
  onOpen,
}) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={variant === 'overlay' ? styles.badgeOverlay : styles.badgeInline}
      aria-label="View linked commission"
      onClick={(e) => {
        e.stopPropagation();
        if (onOpen) {
          onOpen(e);
          return;
        }
        navigate(`/crowd-commissions/${crowdCommissionId}`);
      }}
    >
      <CoinsHand width={12} height={12} aria-hidden />
      <span className={styles.label}>Commission</span>
      <span className={styles.chevron}>
        <ChevronRight width={12} height={12} aria-hidden />
      </span>
    </button>
  );
};
