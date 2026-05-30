import { HorizontalEventRow } from '@domains/events/components/HorizontalEventRow/HorizontalEventRow';
import { Button } from '@saga/global-web';
import { Link } from 'react-router-dom';
import styles from './EventsListPage.module.scss';

// Wireframe clone: public events listing. Logged-out view shows the "Explore"
// row; the personalized rows (your upcoming / attended) are auth-only and omitted.
export function EventsListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Events</h1>
              <p className={styles.subtitle}>Discover and join events in your communities</p>
            </div>
            <Link to="/events/create" className={styles.createButtonLink}>
              <Button className={styles.createButton}>Create event</Button>
            </Link>
          </div>
        </header>

        <HorizontalEventRow
          title="Explore"
          emptyMessage="No upcoming events to explore right now."
        />
      </div>
    </div>
  );
}
