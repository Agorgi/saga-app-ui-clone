import { HomeFeed } from '@domains/posts/ui/HomeFeed/HomeFeed';
import styles from './MainFeed.module.scss';

// Wireframe clone: the main feed. Source also mounts poll/commission checkout
// return handlers, dropped here since the clone has no payments flow.
// Home-only: the feed is a composed interleave (posts + events + community
// listings) via HomeFeed, not the shared post-only PostFeedSection. Other
// pages (community/event/following/profile) keep using PostFeedSection.
// The create-post prompt that used to sit above the feed is intentionally gone;
// the first post now sits at the top of the screen.
export default function MainFeedPage() {
  return (
    <div className={styles.container}>
      <HomeFeed />
    </div>
  );
}
