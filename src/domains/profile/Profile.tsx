import { wireProfile } from '@/data/fixtures';
import { ProfileProvider, useProfile } from '@domains/profile/context/ProfileContext';
import { ProfileEditSection } from '@domains/profile/sections/ProfileEditSection/ProfileEditSection';
import {
  ProfileBannerSection,
  ProfileContentSection,
} from '@domains/profile/sections/ProfileMainSection/ProfileMainSection';
import { ProfileSidebarSection } from '@domains/profile/sections/ProfileSidebarSection/ProfileSidebarSection';
import { ProfileState } from '@domains/profile/ui/ProfileState/ProfileState';
import { useParams } from 'react-router-dom';
import styles from './Profile.module.scss';

// Wireframe clone: the redesigned profile page. A two-column layout, sidebar
// (avatar + identity + follow stats) on the left, banner + tabs on the right.
// The source wires live follow stats + a follow-list modal + GSAP entrance
// animation; here stats come from the fixture and the follow buttons are inert.
function ProfilePageContent() {
  const { isLoading, error, profile, isEditing } = useProfile();

  if (isLoading || error || !profile) {
    return (
      <ProfileState isLoading={isLoading} error={error} isEmpty={!profile && !isLoading && !error} />
    );
  }

  if (isEditing) {
    return (
      <div className={styles.container}>
        <ProfileEditSection />
      </div>
    );
  }

  const stats = {
    followerCount: wireProfile.followerCount,
    followingCount: wireProfile.followingCount,
  };
  const noop = () => {};

  return (
    <div className={`${styles.container} ${styles.containerImmersive}`}>
      <div className={styles.layout}>
        <ProfileSidebarSection
          followStats={stats}
          isStatsLoading={false}
          onFollowersClick={noop}
          onFollowingClick={noop}
        />
        <div className={styles.rightColumn}>
          <ProfileBannerSection />
          <ProfileContentSection />
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { username, userId: paramUserId } = useParams();

  return (
    <ProfileProvider username={username} userId={paramUserId}>
      <ProfilePageContent />
    </ProfileProvider>
  );
}
