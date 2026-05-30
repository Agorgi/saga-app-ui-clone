import { logger } from '@saga/logger-middleware';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { LoadingSymbol } from '../LoadingSymbol/LoadingSymbol';
import styles from './ImageWithSpinner.module.scss';

interface ImageWithSpinnerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  showPlaceholderIcon?: boolean;
}

export const ImageWithSpinner: React.FC<ImageWithSpinnerProps> = ({
  className,
  src,
  showPlaceholderIcon = true,
  ...imgProps
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [decoded, setDecoded] = useState(false);
  const hasValidSrc = src !== undefined && src !== '';

  // biome-ignore lint/correctness/useExhaustiveDependencies: src is needed to re-run when the image source changes
  useEffect(() => {
    setDecoded(false);

    if (!hasValidSrc) return;

    const img = imgRef.current;
    if (!img) return;

    const markFailed = () => {
      logger.error(`Failed to load image: ${src}`);
    };

    // Validate dimensions — JSON or non-image responses can "load" with 0x0
    const decodeAndSet = () => {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        markFailed();
        return;
      }
      // Fall back to showing the image if decode() is unsupported or rejects
      // (e.g. iOS Safari rejecting off-screen decode) — the image loaded fine
      (img.decode?.() ?? Promise.resolve())
        .catch(() => logger.warn(`Failed to decode image, showing anyway: ${src}`))
        .finally(() => setDecoded(true));
    };

    if (img.complete) {
      decodeAndSet();
      return;
    }

    img.addEventListener('load', decodeAndSet);
    img.addEventListener('error', markFailed);

    return () => {
      img.removeEventListener('load', decodeAndSet);
      img.removeEventListener('error', markFailed);
    };
  }, [src]);

  return (
    <div className={styles.wrapper}>
      {!decoded && showPlaceholderIcon && (
        <div className={styles.placeholder}>
          <LoadingSymbol size="medium" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        {...imgProps}
        alt={imgProps.alt ?? ''}
        className={`${className ?? ''} ${decoded ? styles.visible : styles.hidden}`}
        loading="eager"
      />
    </div>
  );
};
