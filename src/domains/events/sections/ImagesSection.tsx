import { useCallback, useId, useRef } from 'react';
import styles from './ImagesSection.module.scss';

// Wireframe clone: the source validates uploads (validateImage), reads them as
// data URLs (useFileInput + readFileAsDataURL), and enforces a max size pulled
// from config. The clone has no upload pipeline, so it previews the chosen file
// via an object URL and stores that string. The two-upload layout (banner +
// thumbnail) and all classNames match the source. Max-size hint is hardcoded.

const MAX_SIZE_MB = 30;
const ACCEPT = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';

interface ImageUploadProps {
  image: string | undefined;
  label: string;
  hint: string;
  onImageChange: (image: string | undefined) => void;
  disabled: boolean;
}

function ImageUpload({ image, label, hint, onImageChange, disabled }: Readonly<ImageUploadProps>) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onImageChange(URL.createObjectURL(file));
    },
    [onImageChange],
  );

  const openFilePicker = () => inputRef.current?.click();

  const handleRemove = useCallback(() => {
    onImageChange(undefined);
    if (inputRef.current) inputRef.current.value = '';
  }, [onImageChange]);

  return (
    <div className={styles.imageUploadGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <p className={styles.hint}>{hint}</p>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className={styles.fileInput}
        disabled={disabled}
      />
      {image ? (
        <div className={styles.imagePreview}>
          <img src={image} alt={`${label} preview`} />
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeImageButton}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          className={styles.uploadButton}
          disabled={disabled}
        >
          Choose {label}
        </button>
      )}
    </div>
  );
}

interface ImagesSectionProps {
  banner: string | undefined;
  thumbnail: string | undefined;
  onBannerChange: (banner: string | undefined) => void;
  onThumbnailChange: (thumbnail: string | undefined) => void;
  disabled: boolean;
}

export function ImagesSection({
  banner,
  thumbnail,
  onBannerChange,
  onThumbnailChange,
  disabled,
}: Readonly<ImagesSectionProps>) {
  return (
    <div className={styles.imagesSection}>
      <ImageUpload
        image={banner}
        label="Banner Image (optional)"
        hint={`Recommended: 1200x400px, Max ${MAX_SIZE_MB}MB`}
        onImageChange={onBannerChange}
        disabled={disabled}
      />
      <ImageUpload
        image={thumbnail}
        label="Thumbnail Image (optional)"
        hint={`Recommended: 400x400px, Max ${MAX_SIZE_MB}MB`}
        onImageChange={onThumbnailChange}
        disabled={disabled}
      />
    </div>
  );
}
