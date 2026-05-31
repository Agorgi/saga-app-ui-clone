import { useAuth } from '@domains/auth/context/useAuth';
import { useCallback, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { EditableBanner } from '../../ui/EditableBanner/EditableBanner';
import { EditableProfilePicture } from '../../ui/EditableProfilePicture/EditableProfilePicture';
import { ProfileEditForm } from '../../ui/ProfileEditForm/ProfileEditForm';
import styles from './ProfileEditSection.module.scss';

export function ProfileEditSection() {
  const { profile, profilePictureUrl, bannerUrl, setIsEditing } = useProfile();
  const { userName: currentUserName } = useAuth();

  const [selectedPfpFile, setSelectedPfpFile] = useState<File | undefined>(undefined);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | undefined>(undefined);
  const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false);
  const [shouldRemoveProfilePicture, setShouldRemoveProfilePicture] = useState(false);

  const handlePfpSelect = useCallback((file: File) => {
    setSelectedPfpFile(file);
    setShouldRemoveProfilePicture(false);
  }, []);

  const handlePfpRemove = useCallback(() => {
    setSelectedPfpFile(undefined);
    setShouldRemoveProfilePicture(true);
  }, []);

  const handleBannerSelect = useCallback((file: File) => {
    setSelectedBannerFile(file);
    setShouldRemoveBanner(false);
  }, []);

  const handleBannerRemove = useCallback(() => {
    setSelectedBannerFile(undefined);
    setShouldRemoveBanner(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedPfpFile(undefined);
    setSelectedBannerFile(undefined);
    setShouldRemoveBanner(false);
    setShouldRemoveProfilePicture(false);
    setIsEditing(false);
  }, [setIsEditing]);

  if (!profile) {
    return null;
  }

  return (
    <header className={styles.profile__header}>
      <EditableBanner
        bannerUrl={bannerUrl}
        onBannerSelect={handleBannerSelect}
        onBannerRemove={handleBannerRemove}
        shouldHideBanner={shouldRemoveBanner}
        userName={currentUserName}
      />
      <EditableProfilePicture
        displayName={profile.displayName}
        profilePictureUrl={profilePictureUrl}
        onProfilePictureSelect={handlePfpSelect}
        onProfilePictureRemove={handlePfpRemove}
        userName={currentUserName}
      />
      <div className={styles.profile__details}>
        <ProfileEditForm
          onCancel={handleCancel}
          profilePictureFile={selectedPfpFile}
          bannerFile={selectedBannerFile}
          shouldRemoveBanner={shouldRemoveBanner}
          shouldRemoveProfilePicture={shouldRemoveProfilePicture}
        />
      </div>
    </header>
  );
}
