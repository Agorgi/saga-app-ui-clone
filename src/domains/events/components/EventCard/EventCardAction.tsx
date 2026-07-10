import type { WireEvent } from '@/data/fixtures';
import { Ticket01 } from '@untitledui/icons';
import { type MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EventCard.module.scss';

interface EventCardActionProps {
  readonly event: WireEvent;
  readonly variant: 'default' | 'tile';
}

// Wireframe clone: the source resolves ticket-vs-RSVP, a live ticket count, and
// auth state. Here it is a single inert call-to-action that opens the event.
export function EventCardAction({ event, variant }: Readonly<EventCardActionProps>) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (clickEvent: MouseEvent<HTMLButtonElement>) => {
      clickEvent.preventDefault();
      clickEvent.stopPropagation();
      navigate(`/events/${event.id}`);
    },
    [event.id, navigate],
  );

  const label = event.ctaLabel ?? 'Get tickets';
  const ctaClassName = variant === 'tile' ? `${styles.cta} ${styles.ctaTile}` : styles.cta;

  return (
    <button type="button" className={ctaClassName} onClick={handleClick} aria-label={label}>
      <Ticket01 className={styles.ctaIcon} width={18} height={18} strokeWidth={2.25} />
      {label}
    </button>
  );
}
