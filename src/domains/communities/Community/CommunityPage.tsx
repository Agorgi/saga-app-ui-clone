import { wireCommunities } from '@/data/fixtures';
import { JoinButton } from '@domains/communities/components/JoinButton';
import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import { PostFeedSection } from '@domains/posts/ui/PostFeedSection/PostFeedSection';
import { Avatar, type Tab, Tabs, useTheme } from '@saga/global-web';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CommunityPage.module.scss';

// Wireframe clone: community detail page. The source loads the community over
// the API, wires join/leave + admin actions, and shows the Events tab only when
// the community has events. Here it resolves a placeholder community, renders a
// theme-aware banner placeholder, and always shows both tabs over fixture data.
export default function CommunityPage() {
  const { communityId } = useParams<{ communityId: string }>();
  const { theme } = useTheme();
  const [communityTab, setCommunityTab] = useState<'posts' | 'events'>('posts');

  const community = wireCommunities.find((c) => c.id === communityId) ?? wireCommunities[0];

  if (!community) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>Community not found</div>
      </div>
    );
  }

  const communityTabs: Array<Tab<'posts' | 'events'>> = [
    { id: 'posts', label: 'Posts' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className={styles.container}>
      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <div
          className={`${styles.bannerPlaceholder} ${theme === 'light' ? styles.bannerPlaceholderLight : styles.bannerPlaceholderDark}`}
        />
      </div>

      {/* Community Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.thumbnailContainer}>
            <Avatar name={community.name} type="community" variant="community-large" />
          </div>

          <div className={styles.communityInfo}>
            <div className={styles.communityNameRow}>
              <h1 className={styles.communityName}>{community.name}</h1>
            </div>

            <div className={styles.communityStats}>
              <button type="button" className={styles.statItem}>
                {community.memberCountText}
              </button>
            </div>

            <p className={styles.communityDescription}>{community.description}</p>
          </div>

          <div className={styles.actionsContainer}>
            <div className={styles.buttonsGroup}>
              <JoinButton isMember={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Feed section — Posts + Events tabs over placeholder data */}
      <div className={styles.feedSection}>
        <Tabs
          tabs={communityTabs}
          activeTab={communityTab}
          onTabChange={setCommunityTab}
          ariaLabel="Community content"
          tabsContainerClassName={styles.communityTabs}
        >
          {(tab) => {
            if (tab === 'posts') {
              return <PostFeedSection />;
            }
            return (
              <div className={styles.eventsSection}>
                <HorizontalEventRow title="Upcoming" />
                <HorizontalEventRow title="Past events" />
              </div>
            );
          }}
        </Tabs>
      </div>
    </div>
  );
}
