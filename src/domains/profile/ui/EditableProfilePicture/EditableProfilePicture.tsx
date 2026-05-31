import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { useFileInput } from '@hooks/useFileInput';
import { useImagePreview } from '@hooks/useImagePreview';
import { toast, useTrackEvent } from '@saga/global-web';
import { CameraPlus, Trash01 } from '@untitledui/icons';
import { validateImage } from '@utils/fileUtils';
import { useCallback } from 'react';
import styles from './EditableProfilePicture.module.scss';

type EditableProfilePictureProps = Readonly<{
  displayName: string;
  profilePictureUrl?: string;
  onProfilePictureSelect: (file: File) => void;
  onProfilePictureRemove?: () => void;
  userName?: string;
}>;

export function EditableProfilePicture({
  displayName,
  profilePictureUrl,
  onProfilePictureSelect,
  onProfilePictureRemove,
  userName,
}: EditableProfilePictureProps) {
  const { trackEvent } = useTrackEvent();
  const { previewUrl, setFile: setPreviewFile, clear: clearPreview } = useImagePreview();
  const {
    openFilePicker,
    inputProps,
    reset: resetInput,
  } = useFileInput({
    accept: 'image/*',
    onFiles: (files) => {
      const file = files[0];
      if (!file) return;
      const error = validateImage(file, { MAX_SIZE_BYTES: 10 * 1024 * 1024 });
      if (error) {
        toast.error(error);
        return;
      }
      setPreviewFile(file);
      onProfilePictureSelect(file);
    },
  });

  const handleUploadClick = useCallback(() => {
    trackEvent('profile_picture_upload', userName || '');
    openFilePicker();
  }, [trackEvent, userName, openFilePicker]);

  const handleRemove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      clearPreview();
      resetInput();
      onProfilePictureRemove?.();
    },
    [onProfilePictureRemove, clearPreview, resetInput],
  );

  const currentPfpUrl = previewUrl || profilePictureUrl;

  return (
    <div className={styles.profile__pfp_wrapper}>
      <input {...inputProps} className={styles.profile__pfp_input} />
      <button
        type="button"
        className={styles.profile__pfp_container}
        onClick={handleUploadClick}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Change profile photo"
      >
        <ProfilePictureIcon
          displayName={displayName}
          profilePictureUrl={currentPfpUrl}
          variant="profile"
        />
        <div className={styles.profile__pfp_overlay}>
          <span className={styles.profile__pfp_overlay_icon} aria-hidden>
            <CameraPlus size={24} />
          </span>
          <span>Change photo</span>
        </div>
      </button>
      {currentPfpUrl && onProfilePictureRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={styles.profile__pfp_remove_button}
          aria-label="Remove profile picture"
        >
          <Trash01 size={14} aria-hidden />
          <span>Remove photo</span>
        </button>
      )}
    </div>
  );
}
