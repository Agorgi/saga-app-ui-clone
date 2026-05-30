import type React from 'react';
import { useEffect, useId, useRef } from 'react';
import { BaseModal } from '../BaseModal/BaseModal';
import { Button } from '../Button/Button';
import styles from './ConfirmModal.module.scss';

type IconVariant = 'primary' | 'warning' | 'danger' | 'default';

const ICON_VARIANT_CLASS = {
  primary: styles.iconWrapperPrimary!,
  warning: styles.iconWrapperWarning!,
  danger: styles.iconWrapperDanger!,
  default: styles.iconWrapperDefault!,
} satisfies Record<IconVariant, string>;

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  isConfirming?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconVariant?: IconVariant;
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isConfirming = false,
  className,
  icon,
  iconVariant = 'default',
  children,
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
    }
  }, [isOpen]);

  const confirmClass =
    variant === 'danger'
      ? `${styles.confirmButton} ${styles.confirmButtonDanger}`
      : styles.confirmButton;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descriptionId}
      className={className ? `${styles.dialog} ${className}` : styles.dialog}
      overlayClassName={styles.overlay}
    >
      <div className={styles.content}>
        <div className={styles.handle} aria-hidden="true" />

        {icon && (
          <div className={`${styles.iconWrapper} ${ICON_VARIANT_CLASS[iconVariant]}`}>{icon}</div>
        )}

        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {message && (
            <p id={descriptionId} className={styles.message}>
              {message}
            </p>
          )}
        </div>

        {children}

        <div className={styles.actions}>
          <Button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={confirmClass}
            disabled={isConfirming}
          >
            {isConfirming ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
