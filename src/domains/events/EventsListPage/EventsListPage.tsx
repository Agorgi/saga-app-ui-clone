import {
  EventFeedFilters,
  type EventFeedSort,
} from '@domains/events/components/EventFeedFilters/EventFeedFilters';
import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import { useState } from 'react';
import styles from './EventsListPage.module.scss';

// Wireframe clone: the redesigned events listing. A hero (title + inert search +
// filter chips) over horizontal rows of tile event cards. The source wires live
// event queries, geolocation, and a search-results feed; here search, location,
// and filters are visual only, and the rows map fixtures.
export function EventsListPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState<EventFeedSort>('soonest');
  const [next7Days, setNext7Days] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Find Your <span className={styles.heroAccent}>Moment</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover live events, workshops, and gatherings across your communities. From
            underground shows to intimate meetups, your next unforgettable experience is here.
          </p>

          <div className={styles.searchForm}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
            />
          </div>

          <div className={styles.locationRow}>
            <input
              type="text"
              className={styles.locationInput}
              placeholder="Anywhere"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
          </div>

          <div className={styles.filterRow}>
            <EventFeedFilters
              sortBy={sortBy}
              onSortByChange={setSortBy}
              showNearby
              next7Days={next7Days}
              onNext7DaysToggle={() => setNext7Days((prev) => !prev)}
            />
          </div>
        </div>

        <div className={styles.pageBody}>
          <HorizontalEventRow title="Your upcoming events" />
          <HorizontalEventRow title="Explore" />
        </div>
      </div>
    </div>
  );
}
