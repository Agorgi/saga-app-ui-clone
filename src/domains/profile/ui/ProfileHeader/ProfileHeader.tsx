import { LinkifyText } from '@components/AutoLink/LinkifyText';
import { useAuth } from '@domains/auth/context/useAuth';
import { FollowButton } from '@domains/follow/components/FollowButton';
import { FollowStats } from '@domains/follow/components/FollowStats';
import { getProfileUrl } from '@domains/posts/utils/getProfileUrl';
import { Button, toast, useTrackEvent } from '@saga/global-web';
import { Check, Link01, LogOut01, Settings01, Users01 } from '@untitledui/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenu, type ProfileMenuItem } from '../ProfileMenu/ProfileMenu';
import styles from './ProfileHeader.module.scss';

// Wireframe clone: the production header loads follow stats from `@saga/api-web`
// and logs failures via `@saga/logger-middleware`. The clone has no backend, so
// follow stats are seeded with a fixed placeholder and the fetch effect is
// dropped. The copy-handle, ProfileMenu, edit/invite, and FollowButton surfaces
// are kept verbatim so the DOM and classNames match the source.
type FollowStatsData = { followerCount: number; followingCount: number };

interface ProfileHeaderProps {
  displayName: string;
  userName: string;
  bio?: string;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  userId: string;
}

export function ProfileHeader({
  displayName,
  userName,
  userId,
  bio,
  isOwnProfile = false,
  onEditClick,
}: Readonly<ProfileHeaderProps>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackEvent } = useTrackEvent();
  const { isAuthenticated, userName: currentUserName, logout } = useAuth();
  const [stats, setStats] = useState<FollowStatsData | undefined>({
    followerCount: 1204,
    followingCount: 317,
  });
  const [copied, setCopied] = useState(false);

  const handleEditClick = () => {
    if (onEditClick) {
      trackEvent('profile_edit_button_click', currentUserName || '');
      onEditClick();
    }
  };

  const handleInviteClick = async () => {
    if (!isOwnProfile || !userId) return;

    try {
      const origin = globalThis.window?.location?.origin ?? '';
      const url = new URL('/signup', origin);
      url.searchParams.set('referrer', userId);

      await globalThis.navigator?.clipboard?.writeText(url.toString());
      toast.success('Referral link copied to clipboard!');
    } catch {
      toast.error("Couldn't copy referral link. Try again.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleManageCommunities = () => {
    navigate('/manage-communities', {
      state: { backgroundLocation: location },
    });
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const baseMenuItems: ReadonlyArray<ProfileMenuItem> = [
    {
      id: 'manage-communities',
      label: 'Manage Communities',
      description: 'Edit communities you moderate',
      Icon: Users01,
      onSelect: handleManageCommunities,
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Account and preferences',
      Icon: Settings01,
      onSelect: handleSettings,
    },
  ];

  const logoutMenuItem: ProfileMenuItem = {
    id: 'logout',
    label: 'Logout',
    description: 'Sign out of your account',
    Icon: LogOut01,
    onSelect: handleLogout,
    variant: 'destructive',
  };

  const profileMenuItems: ReadonlyArray<ProfileMenuItem> = [...baseMenuItems, logoutMenuItem];

  // Construct the full profile URL
  const profileUrl = `${window.location.origin}${getProfileUrl(userName)}`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  // Use shared LinkifyText component to render bio with safe link parsing

  return (
    <div className={styles.profile__details}>
      <div className={styles.profile__header_row}>
        <h1>{displayName}</h1>
        {isOwnProfile ? <ProfileMenu items={profileMenuItems} /> : null}
      </div>

      <div className={styles.profile__username_row}>
        <button
          type="button"
          className={styles.profile__username}
          onClick={handleCopyClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCopyClick();
            }
          }}
          aria-label={`Copy link to ${userName}'s profile`}
          title={copied ? 'Copied!' : 'Copy link to profile'}
          style={{ cursor: 'pointer' }}
        >
          @{userName}
        </button>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopyClick}
          aria-label={`Copy link to ${userName}'s profile`}
          title={copied ? 'Copied!' : 'Copy link to profile'}
        >
          {copied ? <Check className={styles.icon} /> : <Link01 className={styles.icon} />}
        </button>
      </div>

      <FollowStats
        userId={userId}
        userName={userName}
        stats={stats}
        setStats={(s) => setStats(s)}
      />

      {bio ? (
        <LinkifyText
          text={bio}
          className={styles.profile__bio}
          linkClassName={styles.profile__bio_link}
        />
      ) : null}

      {isOwnProfile && isAuthenticated ? (
        <div className={styles.profile__actions}>
          {onEditClick ? (
            <Button onClick={handleEditClick} className={styles.profile__edit_button}>
              Edit Profile
            </Button>
          ) : null}
          <Button onClick={handleInviteClick} className={styles.profile__invite_button}>
            Invite Friends
          </Button>
        </div>
      ) : (
        <FollowButton
          userId={userId}
          className={styles.profile__follow_button}
          onFollowChange={({ action }) => {
            // Update local stats immediately when following/unfollowing this profile
            setStats((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                followerCount:
                  action === 'follow'
                    ? prev.followerCount + 1
                    : Math.max(0, prev.followerCount - 1),
              };
            });
          }}
        />
      )}
    </div>
  );
}
