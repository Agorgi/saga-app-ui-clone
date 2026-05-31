import type { WirePost } from '@/data/fixtures';
import { CreatorLink } from '@components/CreatorLink';
import { POST } from '@saga/records-middleware';
import type React from 'react';
import { memo } from 'react';
import { CollabCountButton } from '../CollabCountButton/CollabCountButton';
import { CommentButton } from '../CommentButton/CommentButton';
import { CommunityRoleBadge } from '../CommunityRoleBadge/CommunityRoleBadge';
import { LikeButton } from '../LikeButton/LikeButton';
import { PostMedia } from '../PostMedia/PostMedia';
import { SaveButton } from '../SaveButton/SaveButton';
import styles from './PostEnlargedView.module.scss';
import { RichTextContent } from './RichTextContent';

export interface PostEnlargedViewProps {
  post: WirePost;
  onClick: () => void;
  userId?: string;
  viewType?: 'enlarged' | 'columns';
  hideActions?: {
    save?: boolean;
    comments?: boolean;
    collabs?: boolean;
  };
}

// Wireframe clone: the source renders real images/video (via getImageUrls +
// ImageWithSpinner) and reads live stats from the post object. Here we render a
// neutral media placeholder for image posts and a text preview otherwise, off a
// WirePost fixture. DOM, class names, and the action row match the real card.
export const PostEnlargedView: React.FC<PostEnlargedViewProps> = memo(
  ({ post, onClick, userId, viewType = 'enlarged', hideActions }) => {
    const renderContent = () => {
      if (post.hasImage) {
        return (
          <div className={styles.imageWrapper}>
            <PostMedia />
          </div>
        );
      }
      return <RichTextContent text={post.body} />;
    };

    return (
      <article
        className={styles.enlargedCard}
        onClick={onClick}
        data-view-type={viewType}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className={`${styles.enlargedContent} `}>{renderContent()}</div>
        <div className={styles.enlargedInfo}>
          <div className={styles.titleSection}>
            {post.title && <h2 className={styles.enlargedTitle}>{post.title}</h2>}
          </div>
          <div className={styles.footerSection}>
            <div className={styles.creatorRow}>
              <CreatorLink
                userId={post.id}
                userName={post.authorHandle}
                displayName={post.authorName}
                variant="small"
                trackingEvent="visit_creator_profile_from_post"
                className={styles.profileSection}
                linkClassName={styles.creatorLink}
              />
              <CommunityRoleBadge role={post.creatorRole} />
            </div>
            <div className={styles.enlargedActions}>
              <LikeButton
                recordId={post.id}
                userId={userId}
                recordType={POST}
                initialLikeCount={post.likeCount ?? 0}
                iconClassName={styles.icon}
                countClassName={styles.countText}
                showLabel={true}
              />
              {!hideActions?.comments && (
                <div className={styles.commentButtonWrapper}>
                  <CommentButton
                    count={post.commentCount ?? 0}
                    showLabel={true}
                    iconClassName={styles.icon}
                    countClassName={styles.countText}
                    onClick={onClick}
                  />
                </div>
              )}
              {!hideActions?.collabs && (
                <div className={styles.collabButtonWrapper}>
                  <CollabCountButton
                    count={post.collabCount ?? 0}
                    showLabel={true}
                    iconClassName={styles.icon}
                    countClassName={styles.countText}
                    onClick={onClick}
                  />
                </div>
              )}
              {!hideActions?.save && (
                <SaveButton
                  recordId={post.id}
                  userId={userId}
                  initialSaveCount={post.saveCount ?? 0}
                  iconClassName={styles.icon}
                  countClassName={styles.countText}
                  showLabel={true}
                />
              )}
            </div>
          </div>
        </div>
      </article>
    );
  },
);
