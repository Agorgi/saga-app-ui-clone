import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { Settings01 } from '@untitledui/icons';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { ProfileHeader } from '../../ui/ProfileHeader/ProfileHeader';
import styles from './ProfileHeaderSection.module.scss';

export function ProfileHeaderSection() {
  const { profile, profilePictureUrl, bannerUrl, isOwnProfile, setIsEditing } = useProfile();
  const navigate = useNavigate();

  if (!profile) {
    return null;
  }

  return (
    <header className={styles.profile__header}>
      {bannerUrl && (
        <div className={styles.profile__banner_container}>
          <img
            src={bannerUrl}
            alt="Profile banner"
            className={styles.profile__banner}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
      )}
      <div
        className={`${styles.profile__content} ${
          bannerUrl ? styles.profile__content_with_banner : ''
        }`}
      >
        <ProfilePictureIcon
          displayName={profile.displayName}
          profilePictureUrl={profilePictureUrl}
          variant="profile"
        />
        <ProfileHeader
          displayName={profile.displayName}
          userName={profile.userName}
          userId={profile.id}
          bio={profile.properties?.description}
          isOwnProfile={isOwnProfile}
          onEditClick={() => setIsEditing(true)}
        />
      </div>

      {isOwnProfile && (
        <button
          type="button"
          className={styles.settingsButton}
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          title="Settings"
        >
          <Settings01 className={styles.settingsIcon} aria-hidden="true" />
        </button>
      )}
    </header>
  );
}
