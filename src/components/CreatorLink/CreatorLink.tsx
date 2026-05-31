import { Avatar, type AvatarVariant } from '@saga/global-web';
import { Link } from 'react-router-dom';
import styles from './CreatorLink.module.scss';

type CreatorLinkProps = Readonly<{
  /** The user ID for fetching the profile picture */
  userId?: string;
  /** The username used for the profile URL */
  userName: string;
  /** The display name shown next to the profile picture */
  displayName: string;
  /** Size variant for the profile picture */
  variant?: AvatarVariant;
  /** Whether to show the display name text (default: true) */
  showName?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** Custom class name for the link text */
  linkClassName?: string;
  /** Event name for tracking navigation (kept for API parity; inert in the clone) */
  trackingEvent?: string;
  /** Whether to stop click propagation (default: true) */
  stopPropagation?: boolean;
}>;

/**
 * A reusable component that displays a profile picture with a linked username.
 * Both the profile picture and display name link to the user's profile page.
 *
 * Wireframe clone: the source renders a ProfilePictureIcon and fires analytics
 * via useTrackEvent. Here we render the vendored Avatar and drop tracking,
 * keeping the same DOM, class names, and props so call sites stay identical.
 */
export function CreatorLink({
  userId,
  userName,
  displayName,
  variant = 'small',
  showName = true,
  className,
  linkClassName,
  trackingEvent: _trackingEvent,
  stopPropagation = true,
}: CreatorLinkProps) {
  const profileUrl = `/profile/${userName}`;

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
  };

  return (
    <div className={`${styles.creatorLink} ${className ?? ''}`}>
      <Link
        to={profileUrl}
        onClick={handleClick}
        className={styles.profilePictureLink}
        aria-label={`View ${displayName}'s profile`}
      >
        <Avatar name={displayName} userId={userId} type="user" variant={variant} />
      </Link>
      {showName && (
        <Link
          to={profileUrl}
          onClick={handleClick}
          className={`${styles.displayNameLink} ${linkClassName ?? ''}`}
        >
          {displayName}
        </Link>
      )}
    </div>
  );
}
