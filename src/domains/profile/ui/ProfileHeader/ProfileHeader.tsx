import type { WireProfile } from '@/data/fixtures';
import { Button } from '@saga/global-web';
import { Link01 } from '@untitledui/icons';
import styles from './ProfileHeader.module.scss';

export interface ProfileHeaderProps {
  profile: WireProfile;
}

// Wireframe clone: the source wires copy-to-clipboard on the handle, a live
// FollowStats component, a FollowButton, and an owner edit/menu path. Here it
// renders the visible display name, handle, follower/following counts, bio, and
// a static follow button over placeholder data.
export function ProfileHeader({ profile }: Readonly<ProfileHeaderProps>) {
  return (
    <div className={styles.profile__details}>
      <div className={styles.profile__header_row}>
        <h1>{profile.displayName}</h1>
      </div>

      <div className={styles.profile__username_row}>
        <span className={styles.profile__username}>@{profile.username}</span>
        <span className={styles.copyButton} aria-hidden="true">
          <Link01 className={styles.icon} />
        </span>
      </div>

      <div className={styles.profile__stats}>
        <span className={styles.profile__stat}>{profile.followersText}</span>
        <span className={styles.profile__stat}>{profile.followingText}</span>
      </div>

      <p className={styles.profile__bio}>{profile.bio}</p>

      <Button className={styles.profile__follow_button}>Follow</Button>
    </div>
  );
}
