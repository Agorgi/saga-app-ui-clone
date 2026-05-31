import type { WirePost } from '@/data/fixtures';
import { CreatorLink } from '@components/CreatorLink';
import { ClickableLabel } from '@saga/global-web';
import type React from 'react';
import { CommunityRoleBadge } from '../CommunityRoleBadge/CommunityRoleBadge';
import { PostActions } from '../PostActions/PostActions';
import { PostMedia } from '../PostMedia/PostMedia';
import styles from './PostContent.module.scss';

interface PostContentProps {
  post: WirePost;
  likeCount: number;
  saveCount: number;
}

// Wireframe clone: this is the full-view post body shown inside PostModal. The
// source renders rich-text (innerHTML from Quill), collab highlighting, an
// options menu (edit/delete/unlink), and feature-flagged behavior — all dropped.
// Header, title row, body, community label, and action row match the real DOM.
const PostContent: React.FC<PostContentProps> = ({ post, likeCount, saveCount }) => {
  return (
    <div className={styles.postContentWrapper}>
      <div className={styles.postContent}>
        <div className={styles.postCreatorHeader}>
          <div className={styles.creatorRow}>
            <CreatorLink
              userId={post.id}
              userName={post.authorHandle}
              displayName={post.authorName}
              variant="small"
              trackingEvent="visit_creator_profile_from_post"
              className={styles.postCreator}
              linkClassName={styles.creatorLink}
            />
            <CommunityRoleBadge role={post.creatorRole} />
          </div>
          <div className={styles.postHeaderRight}>
            <div className={styles.postDate}>{post.timeAgo}</div>
          </div>
        </div>
        {post.title && (
          <div className={styles.postNameRow}>
            <h2 className={styles.postName}>{post.title}</h2>
          </div>
        )}
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
      <PostActions
        recordId={post.id}
        initialLikeCount={likeCount}
        initialSaveCount={saveCount}
        showCollabButton={true}
      />
    </div>
  );
};

export default PostContent;
