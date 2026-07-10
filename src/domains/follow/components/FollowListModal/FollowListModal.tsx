import { SearchBar } from '@components/navigation/SearchBar/SearchBar';
import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { useAuth } from '@domains/auth/context/useAuth';
import { BaseModal, SegmentedToggle } from '@saga/global-web';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FollowButton } from '../FollowButton';
import styles from './FollowListModal.module.scss';

export interface FollowUser {
  id: string;
  userName: string;
  displayName: string;
}

type FollowListType = 'followers' | 'following';

interface FollowListModalProps {
  readonly userName: string;
  readonly type: FollowListType;
  readonly isOwnProfile: boolean;
  readonly followers: readonly FollowUser[];
  readonly following: readonly FollowUser[];
  readonly onClose: () => void;
  readonly onTypeChange: (type: FollowListType) => void;
}

// Wireframe clone: the source loads the follow list from the API and merges a
// debounced remote search over local results. Here both lists are fixtures and
// the search filters the active list client-side by handle/name. The Followers /
// Following segmented toggle, per-row FollowButton, and empty states are faithful.
export function FollowListModal({
  userName,
  type,
  isOwnProfile,
  followers,
  following,
  onClose,
  onTypeChange,
}: FollowListModalProps) {
  const { userName: currentUserName, userId: currentUserId } = useAuth();
  const isFollowers = type === 'followers';
  const items = isFollowers ? followers : following;
  const emptyMessage = isFollowers ? 'No followers yet' : 'Not following anyone yet';

  const [query, setQuery] = useState('');

  const handleTypeChange = (nextType: FollowListType) => {
    setQuery('');
    onTypeChange(nextType);
  };

  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (user) =>
        (user.userName || '').toLowerCase().includes(q) ||
        (user.displayName || '').toLowerCase().includes(q),
    );
  }, [items, query]);

  const followSegments = useMemo(
    () =>
      [
        { id: 'followers' as const, label: 'Followers' },
        { id: 'following' as const, label: 'Following' },
      ] satisfies ReadonlyArray<{ id: FollowListType; label: string }>,
    [],
  );

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      ariaLabel={isFollowers ? 'Followers' : 'Following'}
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>@{userName}</h2>
          <SegmentedToggle
            segments={followSegments}
            value={type}
            onChange={handleTypeChange}
            ariaLabel="Follow list view"
            layout="stretch"
          />
        </div>

        {items.length > 0 ? (
          <div className={styles.searchWrap}>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={`Search ${isFollowers ? 'followers' : 'following'}…`}
              aria-label="Search users"
            />
          </div>
        ) : null}

        <div className={styles.listContainer}>
          {items.length === 0 ? <p className={styles.emptyMessage}>{emptyMessage}</p> : null}

          {items.length > 0 && displayItems.length === 0 ? (
            <p className={styles.emptyMessage}>No users found</p>
          ) : null}

          {displayItems.length > 0 ? (
            <ul className={styles.userList}>
              {displayItems.map((user) => {
                const isCurrentUser =
                  user.userName === currentUserName || user.id === currentUserId;
                const hideFollowButton = isOwnProfile || isCurrentUser;

                return (
                  <li key={user.id} className={styles.userRow}>
                    <Link
                      to={`/profile/${user.userName}`}
                      className={styles.userLink}
                      onClick={onClose}
                    >
                      <ProfilePictureIcon displayName={user.displayName} variant="small" />
                      <div className={styles.userInfo}>
                        <span className={styles.displayName}>{user.displayName}</span>
                        <span className={styles.userName}>@{user.userName}</span>
                      </div>
                    </Link>
                    {!hideFollowButton ? (
                      <FollowButton userId={user.id} className={styles.followButton} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </BaseModal>
  );
}
