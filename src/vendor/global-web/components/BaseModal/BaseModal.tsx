import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './BaseModal.module.scss';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  overlayClassName?: string;
  zIndex?: number;
  children: React.ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  lockScroll = true,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  overlayClassName,
  zIndex,
  children,
}: BaseModalProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onCloseRef.current();
      }
    },
    [closeOnEscape],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleEscape);

    if (lockScroll) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleEscape);
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape, lockScroll]);

  if (!isOpen) return undefined;

  const overlayStyle = zIndex === undefined ? undefined : { zIndex };

  const modal = (
    // biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation prevents portal click events from bubbling through the React tree to underlying interactive elements
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard events are handled by individual modal consumers
    <div
      className={`${styles.overlay} ${overlayClassName ?? ''}`}
      style={overlayStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {closeOnBackdrop && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => onCloseRef.current()}
          aria-label="Close modal"
          tabIndex={-1}
        />
      )}
      <dialog
        className={`${styles.dialog} ${className ?? ''}`}
        open
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </dialog>
    </div>
  );

  return createPortal(modal, document.body);
}
