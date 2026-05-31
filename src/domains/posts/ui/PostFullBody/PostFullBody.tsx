import type { WirePost } from '@/data/fixtures';
import type React from 'react';
import PostContent from '../PostContent/PostContent';
import styles from './PostFullBody.module.scss';

interface PostFullBodyProps {
  post: WirePost;
}

// Wireframe clone: the source layers parent/child collabs, a Collabs/Comments
// tab switcher, infinite scroll, and delete/unlink moderation on top of
// PostContent. None of that is in scope for the UI clone, so this renders just
// the post body. The .postFullBody wrapper + class set match the real one.
export const PostFullBody: React.FC<PostFullBodyProps> = ({ post }) => {
  return (
    <div className={styles.postFullBody}>
      <PostContent post={post} likeCount={post.likeCount} saveCount={post.saveCount} />
    </div>
  );
};
