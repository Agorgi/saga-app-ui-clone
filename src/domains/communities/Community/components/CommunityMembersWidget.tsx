import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import type { CommunityModerator } from '@saga/community-middleware';
import styles from './CommunityMembersWidget.module.scss';

const MEMBERS_LIMIT = 8;

interface CommunityMembersWidgetProps {
  readonly members: readonly CommunityModerator[];
  readonly memberCount: number;
  readonly onOpenMembers: () => void;
}

// Wireframe clone: the source fetches the first page of members via
// getCommunityMembers(communityId). Here the preview comes from a fixture; the
// avatar grid, "+N" overflow pill, and "View all members" button are verbatim.
export function CommunityMembersWidget({
  members,
  memberCount,
  onOpenMembers,
}: CommunityMembersWidgetProps) {
  const preview = members.slice(0, MEMBERS_LIMIT);
  const overflow = memberCount - preview.length;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Members</h3>

      <div className={styles.avatarGrid}>
        {preview.map((m) => (
          <div key={m.userId} className={styles.avatarItem}>
            <ProfilePictureIcon
              displayName={m.user.displayName || m.user.userName}
              userId={m.userId}
              variant="medium"
            />
          </div>
        ))}

        {overflow > 0 && (
          <button
            type="button"
            className={styles.overflowPill}
            onClick={onOpenMembers}
            aria-label={`View all ${memberCount} members`}
          >
            +{overflow}
          </button>
        )}
      </div>

      <button type="button" className={styles.viewAllBtn} onClick={onOpenMembers}>
        View all members
      </button>
    </div>
  );
}
