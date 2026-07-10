import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { useProfile } from '../../context/ProfileContext';
import { ProfileIdentity } from '../../ui/ProfileIdentity/ProfileIdentity';
import { type FollowStats, ProfileStatsCard } from '../../ui/ProfileStatsCard/ProfileStatsCard';
import styles from './ProfileSidebarSection.module.scss';

interface ProfileSidebarSectionProps {
  readonly followStats: FollowStats | undefined;
  readonly isStatsLoading: boolean;
  readonly onFollowersClick: () => void;
  readonly onFollowingClick: () => void;
}

// Wireframe clone: the redesigned profile sidebar. The source also renders a
// social-icon strip (needs SocialPlatformIcon, not vendored here) and an invite
// button; those are deferred. Avatar + identity + stats are fixture-backed.
export function ProfileSidebarSection({
  followStats,
  isStatsLoading,
  onFollowersClick,
  onFollowingClick,
}: ProfileSidebarSectionProps) {
  const { profile, profilePictureUrl } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <aside className={styles.sidebar} aria-label="Profile information">
      <div className={styles.sidebarInner}>
        <div className={styles.avatarWrap}>
          <ProfilePictureIcon
            displayName={profile.displayName}
            profilePictureUrl={profilePictureUrl}
            className={styles.avatar}
          />
        </div>

        <div className={styles.identitySection}>
          <ProfileIdentity
            displayName={profile.displayName}
            userName={profile.userName}
            bio={profile.properties?.description}
          />
        </div>

        <div className={styles.statsSection}>
          <ProfileStatsCard
            stats={followStats}
            isLoading={isStatsLoading}
            onFollowersClick={onFollowersClick}
            onFollowingClick={onFollowingClick}
          />
        </div>
      </div>
    </aside>
  );
}
