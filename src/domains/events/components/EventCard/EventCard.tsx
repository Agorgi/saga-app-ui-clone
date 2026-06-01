import type { WireEvent } from '@/data/fixtures';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.scss';

export interface EventCardProps {
  event: WireEvent;
  compact?: boolean;
}

// Wireframe clone: renders the no-thumbnail state (the source's image
// placeholder) so the card carries no real media. Thumbnails are 1:1.
function EventCardComponent({ event, compact = false }: Readonly<EventCardProps>) {
  const dateText = event.dateText;

  if (compact) {
    return (
      <Link
        to={`/events/${event.id}`}
        className={styles.cardCompact}
        aria-label={`View event ${event.name}`}
      >
        <div className={styles.thumbnailWrapCompact}>
          <div className={styles.thumbnailPlaceholder}>📅</div>
        </div>
        <div className={styles.bodyCompact}>
          <h3 className={styles.nameCompact}>{event.name}</h3>
          <p className={styles.dateCompact}>{dateText}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/events/${event.id}`}
      className={styles.card}
      aria-label={`View event ${event.name}`}
    >
      <div className={styles.thumbnailWrap}>
        <div className={styles.thumbnailPlaceholder}>📅</div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{event.name}</h3>
        <p className={styles.date}>{dateText}</p>
        {event.location ? <p className={styles.location}>{event.location}</p> : null}
        {event.goingText ? <p className={styles.rsvpSummary}>{event.goingText}</p> : null}
      </div>
    </Link>
  );
}

export const EventCard = memo(EventCardComponent);
