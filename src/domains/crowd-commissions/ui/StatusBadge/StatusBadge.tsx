import type { CrowdCommissionStatusValue } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  File02,
  PlayCircle,
  XCircle,
} from '@untitledui/icons';
import type React from 'react';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: CrowdCommissionStatusValue;
}

interface StatusConfig {
  readonly label: string;
  readonly modifier: string;
  readonly Icon: React.ElementType;
}

const STATUS_CONFIG = {
  [CrowdCommissionStatus.DRAFT]: { label: 'Draft', modifier: 'draft', Icon: File02 },
  [CrowdCommissionStatus.ACTIVE]: { label: 'Active', modifier: 'active', Icon: PlayCircle },
  [CrowdCommissionStatus.LOCKING]: { label: 'Locking', modifier: 'locking', Icon: AlertCircle },
  [CrowdCommissionStatus.PENDING_WINNER]: {
    label: 'Pick Winner',
    modifier: 'pendingWinner',
    Icon: AlertTriangle,
  },
  [CrowdCommissionStatus.PENDING_RESULT]: {
    label: 'Pending Result',
    modifier: 'pendingResult',
    Icon: Clock,
  },
  [CrowdCommissionStatus.COMPLETED]: {
    label: 'Completed',
    modifier: 'completed',
    Icon: CheckCircle,
  },
  [CrowdCommissionStatus.FAILED]: { label: 'Failed', modifier: 'failed', Icon: XCircle },
} satisfies Record<CrowdCommissionStatusValue, StatusConfig>;

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, modifier, Icon } = STATUS_CONFIG[status];
  return (
    <span className={`${styles.badge} ${styles[modifier]}`}>
      <Icon width={12} height={12} aria-hidden />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
