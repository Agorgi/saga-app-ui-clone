import { SearchBar } from '@components/navigation/SearchBar/SearchBar';
import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { matchesMemberSearch } from '@domains/communities/utils/memberSearch';
import { CommunityMemberRole, type CommunityModerator } from '@saga/community-middleware';
import { BaseModal } from '@saga/global-web';
import { formatCount } from '@saga/precedent-middleware';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CommunityMembersModal.module.scss';

const ROLE_LABELS: Partial<Record<number, string>> = {
  [CommunityMemberRole.ADMIN]: 'Owner',
  [CommunityMemberRole.MODERATOR]: 'Mod',
};

interface CommunityMembersModalProps {
  readonly members: readonly CommunityModerator[];
  readonly memberCount: number;
  readonly onClose: () => void;
}

// Wireframe clone: the source paginates members from the server and passes the
// search term to getCommunityMembers. Here the full roster is a fixture and the
// search filters it client-side via matchesMemberSearch (the same debounce and
// "no members match" empty state as the source). Pagination is dropped since the
// whole fixture is already in hand.
export function CommunityMembersModal({
  members,
  memberCount,
  onClose,
}: CommunityMembersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filtered = useMemo(
    () => members.filter((member) => matchesMemberSearch(member.user, debouncedSearch)),
    [members, debouncedSearch],
  );

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      ariaLabel="Community members"
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>Members</h2>
          <div className={styles.countWrap}>
            <span className={styles.countNum}>{formatCount(memberCount)}</span>
            <span className={styles.countLabel}>Members</span>
          </div>
        </div>

        <div className={styles.searchWrap}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search members…"
            aria-label="Search members"
          />
        </div>

        <div className={styles.listContainer}>
          {filtered.length === 0 ? (
            <p className={styles.emptyMessage}>
              {debouncedSearch ? 'No members match your search' : 'No members yet.'}
            </p>
          ) : (
            <ul className={styles.userList}>
              {filtered.map((member) => {
                const roleLabel = ROLE_LABELS[member.role];
                const roleClass =
                  member.role === CommunityMemberRole.ADMIN ? styles.ownerBadge : styles.modBadge;

                return (
                  <li key={member.userId} className={styles.userRow}>
                    <Link
                      to={`/profile/${member.user.userName}`}
                      className={styles.userLink}
                      onClick={onClose}
                    >
                      <div className={styles.avatarContainer}>
                        <ProfilePictureIcon
                          displayName={member.user.displayName}
                          userId={member.userId}
                          variant="small"
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.displayName}>{member.user.displayName}</span>
                        <span className={styles.userName}>@{member.user.userName}</span>
                      </div>
                      {roleLabel ? (
                        <span className={`${styles.roleBadge} ${roleClass}`}>{roleLabel}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
