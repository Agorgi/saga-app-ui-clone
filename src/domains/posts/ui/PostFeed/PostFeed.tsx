import { wirePosts } from '@/data/fixtures';
import { useAuth } from '@domains/auth';
import { useGeneratePostModalHandlers } from '@hooks/useGeneratePostModalHandlers';
import type React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostEnlargedView } from '../PostEnlargedView/PostEnlargedView';
import PostModal from '../PostModal/PostModal';
import styles from './PostFeed.module.scss';

export interface PostFeedProps {
  feedType?: string;
  profileUserId?: string;
  communityId?: string;
  eventId?: string;
  renderContainer?: boolean;
  viewContext?: string;
  /** Accepted for parity with the production feed; the wireframe has no toggle. */
  hideViewToggle?: boolean;
}

// Wireframe clone: the source handles fetching, infinite scroll, view toggles,
// progressive image preloading, and merged commission cards. Here we map the
// WirePost fixtures to enlarged cards and open the post modal via the ?post
// search param, matching the real feed-card → modal interaction.
export const PostFeed: React.FC<PostFeedProps> = ({ renderContainer = true }) => {
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const modalPostId = searchParams.get('post') ?? undefined;
  const { openPostModal, closePostModal } = useGeneratePostModalHandlers();

  const feedContent = (
    <div className={styles.postsList}>
      {wirePosts.map((post) => (
        <PostEnlargedView
          key={post.id}
          post={post}
          hideActions={{ save: true }}
          onClick={() => openPostModal(post.id)}
          userId={userId}
        />
      ))}
    </div>
  );

  const modalElement = modalPostId ? (
    <PostModal postId={modalPostId} onClose={closePostModal} />
  ) : null;

  if (!renderContainer) {
    return (
      <>
        {feedContent}
        {modalElement}
      </>
    );
  }

  return (
    <div className={styles.container}>
      {feedContent}
      {modalElement}
    </div>
  );
};
