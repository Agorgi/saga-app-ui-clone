import { type WireEvent, wireEvents } from '@/data/fixtures';
import type { ReactNode } from 'react';
import { EventCard } from '../EventCard/EventCard';
import styles from './HorizontalEventRow.module.scss';

export interface HorizontalEventRowProps {
  title: string;
  events?: WireEvent[];
  /** Optional first card rendered inside the scroll track before event cards. */
  prependSlot?: ReactNode;
  emptyMessage?: string;
  hideWhenEmpty?: boolean;
  // Accepted for parity with the production events tab, which filters by RSVP
  // and time window. The wireframe ignores these and renders fixtures.
  upcomingOnly?: boolean;
  pastOnly?: boolean;
  rsvpUserId?: string;
  rsvpStatus?: string;
}

// Wireframe clone: a titled horizontal scroller of tile event cards. The source
// wires pagination + infinite scroll over live data; here it maps fixtures.
export function HorizontalEventRow({
  title,
  events = wireEvents,
  prependSlot,
}: Readonly<HorizontalEventRowProps>) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.scrollTrack}>
        {prependSlot}
        {events.map((event) => (
          <div key={event.id} className={styles.cardWrap}>
            <EventCard event={event} variant="tile" />
          </div>
        ))}
      </div>
    </section>
  );
}
