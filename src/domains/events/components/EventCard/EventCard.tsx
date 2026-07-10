import type { WireEvent } from '@/data/fixtures';
import { EventCardAction } from '@domains/events/components/EventCard/EventCardAction';
import { EventDefaultBanner } from '@domains/events/components/EventDefaultBanner/EventDefaultBanner';
import { type EventHeroTone, useEventHeroTone } from '@domains/events/hooks/useEventHeroTone';
import { useTheme } from '@saga/global-web';
import { Calendar, MarkerPin01 } from '@untitledui/icons';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.scss';

export interface EventCardProps {
  event: WireEvent;
  compact?: boolean;
  variant?: 'default' | 'tile';
}

// Wireframe clone: the redesigned "glass" event card. The source loads a real
// banner and derives hero tone from its luminance; the clone has no real media,
// so every card uses the branded default-banner ambience (the source's
// no-banner state) and the hero tone falls back to the app theme. The action is
// an inert ticket CTA. Date badge parts are parsed from the fixture dateText.
function badgeFromDateText(dateText: string): { month: string; day: string } {
  const afterComma = dateText.includes(',') ? (dateText.split(',')[1] ?? '') : dateText;
  const parts = afterComma.trim().split(/\s+/);
  const month = (parts[0] ?? '').slice(0, 3).toUpperCase();
  const day = (parts[1] ?? '').replace(/[^0-9]/g, '');
  return { month, day };
}

function EventDateBadge({
  month,
  day,
  compact = false,
}: Readonly<{ month: string; day: string; compact?: boolean }>) {
  return (
    <div
      className={compact ? `${styles.dateBadge} ${styles.dateBadgeCompact}` : styles.dateBadge}
      aria-hidden="true"
    >
      <div className={styles.dateBadgeInner}>
        <Calendar className={styles.dateBadgeIcon} width={14} height={14} strokeWidth={2} />
        <span className={styles.dateBadgeMonth}>{month}</span>
        <span className={styles.dateBadgeDay}>{day}</span>
      </div>
    </div>
  );
}

function EventCardComponent({
  event,
  compact = false,
  variant = 'default',
}: Readonly<EventCardProps>) {
  const { theme } = useTheme();
  const heroTone: EventHeroTone = useEventHeroTone(undefined, theme);
  const { month, day } = badgeFromDateText(event.dateText);

  if (compact) {
    return (
      <Link
        to={`/events/${event.id}`}
        className={styles.cardCompact}
        aria-label={`View event ${event.name}`}
      >
        <EventDateBadge month={month} day={day} compact />
        <div className={styles.bodyCompact}>
          <h3 className={styles.nameCompact}>{event.name}</h3>
          <p className={styles.dateCompact}>{event.dateText}</p>
          {event.location ? <p className={styles.locationCompact}>{event.location}</p> : null}
        </div>
      </Link>
    );
  }

  const cardClassName = variant === 'tile' ? styles.cardTile : styles.card;

  return (
    <article className={cardClassName} data-hero-tone={heroTone}>
      <Link
        to={`/events/${event.id}`}
        className={styles.cardNav}
        aria-label={`View event ${event.name}`}
      >
        <div className={styles.media}>
          <EventDefaultBanner layout="fill" mark="subtle" />
        </div>

        <div className={styles.contentTop}>
          <div className={styles.metaRow}>
            <EventDateBadge month={month} day={day} />
            <h3 className={styles.title} title={event.name}>
              {event.name}
            </h3>
          </div>

          {event.location ? (
            <p className={styles.location}>
              <MarkerPin01 className={styles.locationIcon} width={14} height={14} strokeWidth={2} />
              <span title={event.location}>{event.location}</span>
            </p>
          ) : (
            <p className={styles.location} aria-hidden="true" />
          )}
        </div>
      </Link>

      <div className={styles.actionRow}>
        <EventCardAction event={event} variant={variant} />
      </div>
    </article>
  );
}

export const EventCard = memo(EventCardComponent);
