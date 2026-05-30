import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import { PostFeedSection } from '@domains/posts/ui/PostFeedSection/PostFeedSection';
import { type Tab, Tabs } from '@saga/global-web';
import { useState } from 'react';
import styles from './ProfileTabsSection.module.scss';

type TabKey = 'created' | 'saved' | 'liked' | 'events' | 'commissions';

// Wireframe clone: profile content tabs. The source wires per-tab feeds
// (created/saved/liked posts, RSVP'd events, commissions) over live data; here
// each tab renders placeholder content so the tab chrome and layout show.
export function ProfileTabsSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('created');

  const visibleTabs: Array<Tab<TabKey>> = [
    { id: 'created', label: 'Posts' },
    { id: 'saved', label: 'Saved' },
    { id: 'liked', label: 'Liked' },
    { id: 'events', label: 'Events' },
    { id: 'commissions', label: 'Commissions' },
  ];

  return (
    <Tabs
      tabs={visibleTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      ariaLabel="Profile content"
      tabsContainerClassName={styles.profile__tabs}
    >
      {(tab) => {
        if (tab === 'events') {
          return (
            <div className={styles.eventsContainer}>
              <HorizontalEventRow title="Upcoming events" />
              <HorizontalEventRow title="Attended" />
            </div>
          );
        }
        if (tab === 'commissions') {
          return <div className={styles.profile__loading}>No commissions to show yet</div>;
        }
        return <PostFeedSection />;
      }}
    </Tabs>
  );
}
