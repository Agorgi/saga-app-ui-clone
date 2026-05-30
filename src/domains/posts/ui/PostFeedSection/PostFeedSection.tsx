import { wirePosts } from '@/data/fixtures';
import { PostContent } from '../PostContent/PostContent';
import styles from '../PostFeed/PostFeed.module.scss';

// Wireframe clone: the source streams a paginated, infinite-scroll feed merged
// from posts + commissions. Here we map placeholder posts into the same
// vertical list layout.
export function PostFeedSection() {
  return (
    <div className={styles.postsList}>
      {wirePosts.map((post) => (
        <PostContent key={post.id} post={post} />
      ))}
    </div>
  );
}
