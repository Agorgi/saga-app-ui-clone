import { useFileInput } from '@hooks/useFileInput';
import { useImagePreview } from '@hooks/useImagePreview';
import { toast, useTrackEvent } from '@saga/global-web';
import { validateImage } from '@utils/fileUtils';
import { useCallback } from 'react';
import styles from './EditableBanner.module.scss';

type EditableBannerLayout = 'default' | 'settings';

type EditableBannerProps = Readonly<{
  bannerUrl?: string;
  onBannerSelect: (file: File) => void;
  onBannerRemove: () => void;
  shouldHideBanner?: boolean;
  userName?: string;
  layout?: EditableBannerLayout;
}>;

export function EditableBanner({
  bannerUrl,
  onBannerSelect,
  onBannerRemove,
  shouldHideBanner = false,
  userName,
  layout = 'default',
}: EditableBannerProps) {
  const { trackEvent } = useTrackEvent();
  const { previewUrl, setFile: setPreviewFile, clear: clearPreview } = useImagePreview();
  const {
    openFilePicker,
    inputProps,
    reset: resetInput,
  } = useFileInput({
    accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp',
    onFiles: (files) => {
      const file = files[0];
      if (!file) return;
      const error = validateImage(file, { MAX_SIZE_BYTES: 10 * 1024 * 1024 });
      if (error) {
        toast.error(error);
        return;
      }
      setPreviewFile(file);
      onBannerSelect(file);
    },
  });

  const handleBannerUploadClick = useCallback(() => {
    trackEvent('profile_banner_upload', userName || '');
    openFilePicker();
  }, [trackEvent, userName, openFilePicker]);

  const handleBannerRemove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      clearPreview();
      resetInput();
      onBannerRemove();
    },
    [onBannerRemove, clearPreview, resetInput],
  );

  const currentBannerUrl = !shouldHideBanner && (previewUrl || bannerUrl);
  const isSettingsLayout = layout === 'settings';
  const wrapperClassName = isSettingsLayout
    ? `${styles.banner__wrapper} ${styles['banner__wrapper--settings']}`
    : styles.banner__wrapper;
  const uploadClassName = isSettingsLayout
    ? `${styles.banner__upload} ${styles['banner__upload--settings']}`
    : styles.banner__upload;
  const containerClassName = isSettingsLayout
    ? `${styles.banner__container} ${styles['banner__container--settings']}`
    : styles.banner__container;

  return (
    <div className={wrapperClassName}>
      <input {...inputProps} className={styles.banner__input} />
      {currentBannerUrl && (
        <button
          type="button"
          className={containerClassName}
          onClick={handleBannerUploadClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleBannerUploadClick();
              e.preventDefault();
            }
          }}
          aria-label="Click to upload banner"
        >
          <img
            src={currentBannerUrl}
            alt="Banner"
            className={styles.banner__image}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
          <div className={styles.banner__overlay}>
            <span>Change Banner</span>
          </div>
          <button
            type="button"
            onClick={handleBannerRemove}
            className={styles.banner__remove_button}
            aria-label="Remove banner"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Remove banner</title>
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </button>
      )}
      {!currentBannerUrl && (
        <button
          type="button"
          className={uploadClassName}
          onClick={handleBannerUploadClick}
          aria-label="Click to upload banner"
        >
          <span>Upload Banner</span>
        </button>
      )}
    </div>
  );
}
