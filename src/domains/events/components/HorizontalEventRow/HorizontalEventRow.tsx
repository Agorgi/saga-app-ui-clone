import { wireEvents } from '@/data/fixtures';
import { EventCard } from '../EventCard/EventCard';
import styles from './HorizontalEventRow.module.scss';

export interface HorizontalEventRowProps {
  title: string;
  emptyMessage?: string;
  hideWhenEmpty?: boolean;
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
