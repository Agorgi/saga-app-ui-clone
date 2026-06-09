import { useAuth } from '@domains/auth';
import { CommissionFeedCard } from '@domains/crowd-commissions/ui/CommissionFeedCard/CommissionFeedCard';
import { EventCard } from '@domains/events/components/EventCard/EventCard';
import { useGeneratePostModalHandlers } from '@hooks/useGeneratePostModalHandlers';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostEnlargedView } from '../PostEnlargedView/PostEnlargedView';
import PostModal from '../PostModal/PostModal';
import { FeedCommunityCard } from './FeedCommunityCard';
import styles from './HomeFeed.module.scss';
import { buildHomeFeedItems } from './buildHomeFeedItems';

// Wireframe clone: the home feed is a deliberate composition, not a plain post
// stream. It interleaves posts, events, and landscape community listings in a
// repeating order (see buildHomeFeedItems). This renderer is home-only — the
// shared PostFeed (community/event/profile/following pages) stays post-only.
// Post cards still open the post modal via the ?post search param, matching the
// real feed-card to modal interaction.
export function HomeFeed() {
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const modalPostId = searchParams.get('post') ?? undefined;
  const { openPostModal, closePostModal } = useGeneratePostModalHandlers();
  const items = useMemo(() => buildHomeFeedItems(), []);

  return (
    <>
      <div className={styles.feedList}>
        {items.map((item) => {
          if (item.kind === 'post') {
            return (
              <PostEnlargedView
                key={item.key}
                post={item.post}
                hideActions={{ save: true }}
                onClick={() => openPostModal(item.post.id)}
                userId={userId}
              />
            );
          }
          if (item.kind === 'event') {
            return <EventCard key={item.key} event={item.event} />;
          }
          if (item.kind === 'commission') {
            return <CommissionFeedCard key={item.key} commission={item.commission} />;
          }
          return <FeedCommunityCard key={item.key} community={item.community} />;
        })}
      </div>
      {modalPostId ? <PostModal postId={modalPostId} onClose={closePostModal} /> : null}
    </>
  );
}
