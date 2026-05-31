import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import { PostFeed } from '@domains/posts/ui/PostFeed/PostFeed';
import {
  PROFILE_TAB_IDS,
  type ProfileTabId,
  resolveProfileTab,
} from '@domains/posts/utils/getProfileUrl';
import { type Tab, Tabs } from '@saga/global-web';
import { assertNever } from '@saga/precedent-middleware';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { CommissionsTabContent } from './CommissionsTabContent';
import styles from './ProfileTabsSection.module.scss';

export type TabKey = ProfileTabId;

// Wireframe clone: the production tabs wire per-tab feeds over live data
// (created/saved/liked posts, RSVP'd events, commissions). Here the same tab
// chrome + URL-driven active tab is preserved, but each tab renders placeholder
// fixtures. The clone PostFeed has no view toggle or feed-type fetching, so the
// `feedType` is passed straight through as the active tab id.
export function ProfileTabsSection() {
  const { profile, isOwnProfile } = useProfile();
  const [searchParams] = useSearchParams();

  const visibleTabs = useMemo<Array<Tab<TabKey>>>(
    () => [
      { id: PROFILE_TAB_IDS.created, label: 'Posts' },
      { id: PROFILE_TAB_IDS.saved, label: 'Saved' },
      { id: PROFILE_TAB_IDS.liked, label: 'Liked' },
      { id: PROFILE_TAB_IDS.events, label: 'Events' },
      { id: PROFILE_TAB_IDS.commissions, label: 'Commissions' },
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<TabKey>(() =>
    resolveProfileTab(
      searchParams.get('tab'),
      visibleTabs.map((tab) => tab.id),
    ),
  );

  useEffect(() => {
    setActiveTab(
      resolveProfileTab(
        searchParams.get('tab'),
        visibleTabs.map((tab) => tab.id),
      ),
    );
  }, [searchParams, visibleTabs]);

  if (!profile) {
    return undefined;
  }

  return (
    <Tabs
      tabs={visibleTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      ariaLabel="Profile content"
      tabsContainerClassName={styles.profile__tabs}
    >
      {(tab: TabKey) => {
        switch (tab) {
          case 'events':
            return (
              <div className={styles.eventsContainer}>
                <HorizontalEventRow
                  title="Upcoming events"
                  upcomingOnly
                  rsvpUserId={profile.id}
                  emptyMessage="No upcoming RSVPs."
                  hideWhenEmpty
                />

                <HorizontalEventRow
                  title="Attended"
                  pastOnly
                  rsvpUserId={profile.id}
                  rsvpStatus="going"
                  emptyMessage="No events attended yet."
                  hideWhenEmpty
                />
              </div>
            );
          case 'commissions':
            return <CommissionsTabContent profileUserId={profile.id} isOwnProfile={isOwnProfile} />;
          case 'created':
          case 'saved':
          case 'liked':
            return (
              <PostFeed
                feedType={tab}
                profileUserId={profile.id}
                viewContext="profile"
                hideViewToggle={false}
              />
            );
          default:
            return assertNever(tab);
        }
      }}
    </Tabs>
  );
}
