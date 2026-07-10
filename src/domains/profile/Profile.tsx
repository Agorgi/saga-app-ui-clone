import { wireFollowers, wireFollowing, wireProfile } from '@/data/fixtures';
import { FollowListModal } from '@domains/follow/components/FollowListModal/FollowListModal';
import { ProfileProvider, useProfile } from '@domains/profile/context/ProfileContext';
import { ProfileEditSection } from '@domains/profile/sections/ProfileEditSection/ProfileEditSection';
import {
  ProfileBannerSection,
  ProfileContentSection,
} from '@domains/profile/sections/ProfileMainSection/ProfileMainSection';
import { ProfileSidebarSection } from '@domains/profile/sections/ProfileSidebarSection/ProfileSidebarSection';
import { ProfileState } from '@domains/profile/ui/ProfileState/ProfileState';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Profile.module.scss';

type FollowListType = 'followers' | 'following';

// Wireframe clone: the redesigned profile page. A two-column layout, sidebar
// (avatar + identity + follow stats) on the left, banner + tabs on the right.
// The follow-stats counts open the follow-list modal (fixture-backed, client-side
// search); the source wires those over live data plus a GSAP entrance animation.
function ProfilePageContent() {
  const { isLoading, error, profile, isEditing, isOwnProfile } = useProfile();
  const [followList, setFollowList] = useState<FollowListType | undefined>(undefined);

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

  return (
    <div className={`${styles.container} ${styles.containerImmersive}`}>
      <div className={styles.layout}>
        <ProfileSidebarSection
          followStats={stats}
          isStatsLoading={false}
          onFollowersClick={() => setFollowList('followers')}
          onFollowingClick={() => setFollowList('following')}
        />
        <div className={styles.rightColumn}>
          <ProfileBannerSection />
          <ProfileContentSection />
        </div>
      </div>

      {followList ? (
        <FollowListModal
          userName={profile.userName}
          type={followList}
          isOwnProfile={isOwnProfile}
          followers={wireFollowers}
          following={wireFollowing}
          onClose={() => setFollowList(undefined)}
          onTypeChange={setFollowList}
        />
      ) : null}
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
