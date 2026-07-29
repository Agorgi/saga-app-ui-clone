import { X } from '@untitledui/icons';
import { useEffect, useRef } from 'react';
import styles from './ImageViewerModal.module.scss';

interface ImageViewerModalProps {
  readonly imageUrl: string;
  readonly alt: string;
  readonly onClose: () => void;
}

export function ImageViewerModal({ imageUrl, alt, onClose }: ImageViewerModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    backdropRef.current?.focus();
  }, []);

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Image: ${alt}`}
      tabIndex={-1}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <X width={20} height={20} aria-hidden="true" />
      </button>
      <img src={imageUrl} alt={alt} className={styles.image} />
    </div>
  );
}
