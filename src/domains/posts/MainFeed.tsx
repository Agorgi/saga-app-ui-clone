import { PostFeedSection } from '@domains/posts/ui/PostFeedSection/PostFeedSection';
import styles from './MainFeed.module.scss';
import { CreatePostPrompt } from './ui/CreatePostPrompt/CreatePostPrompt';

// Wireframe clone: the main feed. Source also mounts poll/commission checkout
// return handlers — dropped here since the clone has no payments flow.
export default function MainFeedPage() {
  return (
    <div className={styles.container}>
      <CreatePostPrompt />
      <PostFeedSection />
    </div>
  );
}
