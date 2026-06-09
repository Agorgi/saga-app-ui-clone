import type { CrowdCommissionStatusValue } from '@saga/crowd-commission-middleware';
import { ConfirmModal } from '@saga/global-web';
import { EyeOff, Globe01, Trash01 } from '@untitledui/icons';
import type React from 'react';
import styles from './confirmModal.module.scss';

type ConfirmVariant = 'publish' | 'unpublish' | 'delete';

interface ModalConfig {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly variant?: 'danger';
  readonly iconVariant?: 'primary' | 'warning' | 'danger';
}

function getDeleteMessage(commissionStatus: CrowdCommissionStatusValue | undefined): string {
  switch (commissionStatus) {
    case 'active':
      return 'Deleting this commission will immediately refund all backers. This cannot be undone.';
    case 'failed':
      return 'This commission has already ended. Deleting it will remove it permanently. No additional refunds will be issued.';
    default:
      return 'This will permanently delete your draft.';
  }
}

const VARIANT_ICON = {
  publish: <Globe01 width={24} height={24} aria-hidden="true" />,
  unpublish: <EyeOff width={24} height={24} aria-hidden="true" />,
  delete: <Trash01 width={24} height={24} aria-hidden="true" />,
} satisfies Record<ConfirmVariant, React.ReactNode>;

const BASE_MODAL_CONFIG = {
  publish: {
    title: 'Publish this commission?',
    message: 'It will become visible to everyone and accept pledges.',
    confirmLabel: 'Publish',
    iconVariant: 'primary',
  },
  unpublish: {
    title: 'Unpublish this commission?',
    message: 'It will be hidden from the feed but existing pledges are unaffected.',
    confirmLabel: 'Unpublish',
    iconVariant: 'warning',
  },
} satisfies Partial<Record<ConfirmVariant, ModalConfig>>;

export interface CrowdCommissionConfirmModalProps {
  readonly variant: ConfirmVariant;
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly isLoading: boolean;
  readonly commissionStatus?: CrowdCommissionStatusValue;
}

export function CrowdCommissionConfirmModal({
  variant,
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
  commissionStatus,
}: CrowdCommissionConfirmModalProps) {
  const config: ModalConfig =
    variant === 'delete'
      ? {
          title: 'Delete this commission?',
          message: getDeleteMessage(commissionStatus),
          confirmLabel: 'Delete',
          variant: 'danger',
          iconVariant: 'danger',
        }
      : BASE_MODAL_CONFIG[variant];

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={config.title}
      message={config.message}
      confirmLabel={config.confirmLabel}
      cancelLabel="Cancel"
      variant={config.variant}
      isConfirming={isLoading}
      className={styles.dialog}
      icon={VARIANT_ICON[variant]}
      iconVariant={config.iconVariant}
    />
  );
}
