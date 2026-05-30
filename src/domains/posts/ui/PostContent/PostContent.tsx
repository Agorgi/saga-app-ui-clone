import type { WirePost } from '@/data/fixtures';
import { Avatar, ClickableLabel } from '@saga/global-web';
import { Link } from 'react-router-dom';
import { PostActions } from '../PostActions/PostActions';
import { PostMedia } from '../PostMedia/PostMedia';
import styles from './PostContent.module.scss';

export interface PostContentProps {
  post: WirePost;
}

// Wireframe clone: reproduces the feed post card DOM (creator header, body,
// community label, action row) with placeholder content. The source wires
// rich-text rendering, collab highlights, edit/delete menus, and live counts —
// all dropped here.
export function PostContent({ post }: Readonly<PostContentProps>) {
  return (
    <div className={styles.postContentWrapper}>
      <div className={styles.postContent}>
        <div className={styles.postCreatorHeader}>
          <div className={styles.creatorRow}>
            <Link to={`/profile/${post.authorHandle.replace('@', '')}`} className={styles.postCreator}>
              <Avatar name={post.authorName} userId={post.id} type="user" variant="small" />
              <span className={styles.creatorLink}>{post.authorName}</span>
            </Link>
          </div>
          <div className={styles.postHeaderRight}>
            <div className={styles.postDate}>{post.timeAgo}</div>
          </div>
        </div>
        <div className={styles.postContentBody}>
          {post.hasImage && <PostMedia />}
          <p>{post.body}</p>
        </div>
        <div className={styles.communitiesContainer}>
          <div className={styles.communityLabel}>
            <ClickableLabel label={post.communityName} selected={false} onToggle={() => {}} />
          </div>
        </div>
      </div>
      <PostActions likeCount={Number(post.likeCount)} showCollabButton={true} />
    </div>
  );
}
