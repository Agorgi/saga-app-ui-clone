import { wireProfile } from '@/data/fixtures';
import { Avatar } from '@saga/global-web';
import { ProfileHeader } from '../../ui/ProfileHeader/ProfileHeader';
import styles from './ProfileHeaderSection.module.scss';

// Wireframe clone: profile header band. The source loads banner + avatar images
// and shows an owner-only settings shortcut; here it renders an image-free
// banner placeholder, a neutral avatar, and the ProfileHeader details.
export function ProfileHeaderSection() {
  return (
    <header className={styles.profile__header}>
      <div className={styles.profile__banner_container}>
        <div className={styles.profile__banner_placeholder} />
      </div>
      <div className={`${styles.profile__content} ${styles.profile__content_with_banner}`}>
        <Avatar name={wireProfile.displayName} type="user" variant="profile" />
        <ProfileHeader profile={wireProfile} />
      </div>
    </header>
  );
}
