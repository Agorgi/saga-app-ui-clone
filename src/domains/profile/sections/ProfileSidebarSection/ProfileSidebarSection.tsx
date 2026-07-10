import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { SocialPlatformIcon } from '@saga/global-web';
import { parseSocialLinks, SOCIAL_PLATFORM_REGISTRY } from '@saga/precedent-middleware';
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

const socialPlatformLabels = Object.fromEntries(
  SOCIAL_PLATFORM_REGISTRY.map((config) => [config.platform, config.label]),
);

// Wireframe clone: the redesigned profile sidebar. Avatar + identity + stats +
// social-icon strip are fixture-backed. The source also renders an own-profile
// invite button (needs the tracking + referral-URL plumbing); that is deferred.
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

  const socialLinks = parseSocialLinks(profile.properties?.socialLinks);

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

        {socialLinks.length > 0 && (
          <div className={styles.socialIconStrip}>
            {socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialPlatformLabels[link.platform] ?? link.platform}
                className={styles.socialLink}
              >
                <SocialPlatformIcon platform={link.platform} size={20} />
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
