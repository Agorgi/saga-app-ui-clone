import { wireEvents } from '@/data/fixtures';
import { EventCard } from '@domains/events/components/EventCard/EventCard';
import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import styles from './EventsListPage.module.scss';

// Wireframe clone: public events listing. Two stacked sections in a single
// feed-like column: a horizontally scrollable "Hot" row at the top, then a
// vertically scrollable feed of events that mirrors the home-screen layout
// (same EventCard, stacked). Both use 1:1 card thumbnails. The page header
// (title / subtitle / Create button) is intentionally gone; event creation
// lives in the global Create flow.
export function EventsListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HorizontalEventRow title="Hot" square emptyMessage="No hot events right now." />

        <div className={styles.feed}>
          {wireEvents.map((event) => (
            <EventCard key={event.id} event={event} square />
          ))}
        </div>
      </div>
    </div>
  );
}
