import { wireEvents } from '@/data/fixtures';
import { EventCard } from '../EventCard/EventCard';
import styles from './HorizontalEventRow.module.scss';

export interface HorizontalEventRowProps {
  title: string;
  emptyMessage?: string;
  hideWhenEmpty?: boolean;
  // Accepted for parity with the production profile events tab, which filters
  // by RSVP and time window. The wireframe ignores these and renders fixtures.
  upcomingOnly?: boolean;
  pastOnly?: boolean;
  rsvpUserId?: string;
  rsvpStatus?: string;
}

// Wireframe clone: a titled horizontal scroller of event cards. The source
// wires pagination + infinite scroll over live data; here it maps placeholder
// events so the layout renders.
export function HorizontalEventRow({ title }: Readonly<HorizontalEventRowProps>) {
  const events = wireEvents;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.scrollTrack}>
        {events.map((event) => (
          <div key={event.id} className={styles.cardWrap}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
