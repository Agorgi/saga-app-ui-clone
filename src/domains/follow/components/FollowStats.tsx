import { formatCount } from '@saga/precedent-middleware';
import { useNavigate } from 'react-router-dom';
import styles from './FollowStats.module.scss';

type FollowStatsProps = {
  userId: string;
  userName: string;
  stats?: { followerCount: number; followingCount: number };
  setStats?: (s: { followerCount: number; followingCount: number }) => void;
};

// Wireframe: follower/following counts are placeholder values. The production
// component fetches them from `@saga/api-web` and listens for live follow
// events; here we render either caller-provided stats or a fixed placeholder.
const PLACEHOLDER_STATS = { followerCount: 1204, followingCount: 317 };

export function FollowStats({ userName, stats: externalStats }: FollowStatsProps) {
  const navigate = useNavigate();
  const displayStats = externalStats ?? PLACEHOLDER_STATS;

  return (
    <div className={styles.stats}>
      <button
        onClick={() => navigate(`/profile/${userName}/followers`)}
        className={styles.stat}
        type="button"
      >
        <span className={styles.count}>{formatCount(displayStats.followerCount)}</span>
        <span className={styles.label}>Followers</span>
      </button>
      <button
        onClick={() => navigate(`/profile/${userName}/following`)}
        className={styles.stat}
        type="button"
      >
        <span className={styles.count}>{formatCount(displayStats.followingCount)}</span>
        <span className={styles.label}>Following</span>
      </button>
    </div>
  );
}
