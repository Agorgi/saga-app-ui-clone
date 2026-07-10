import { formatCount } from '@saga/precedent-middleware';
import styles from './ProfileStatsCard.module.scss';

export interface FollowStats {
  followerCount: number;
  followingCount: number;
}

interface ProfileStatsCardProps {
  readonly stats: FollowStats | undefined;
  readonly isLoading: boolean;
  readonly onFollowersClick: () => void;
  readonly onFollowingClick: () => void;
}

// Wireframe clone: copied from the source (local FollowStats type). Counts come
// from the fixture profile; the follow-list buttons are inert.
export function ProfileStatsCard({
  stats,
  isLoading,
  onFollowersClick,
  onFollowingClick,
}: ProfileStatsCardProps) {
  return (
    <section className={styles.card} aria-label="Follow stats">
      {isLoading ? (
        <p className={styles.loading}>Loading stats...</p>
      ) : (
        <div className={styles.statsRow}>
          <button type="button" className={styles.stat} onClick={onFollowersClick}>
            <span className={styles.count}>{formatCount(stats?.followerCount ?? 0)}</span>
            <span className={styles.label}>Followers</span>
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={styles.stat} onClick={onFollowingClick}>
            <span className={styles.count}>{formatCount(stats?.followingCount ?? 0)}</span>
            <span className={styles.label}>Following</span>
          </button>
        </div>
      )}
    </section>
  );
}
