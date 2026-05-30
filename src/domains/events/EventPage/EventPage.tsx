import { wireEvents } from '@/data/fixtures';
import { PostFeedSection } from '@domains/posts/ui/PostFeedSection/PostFeedSection';
import { Avatar, useTheme } from '@saga/global-web';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';

// Wireframe clone: event detail page. The source loads the event over the API
// and wires RSVP, ticketing, payments, and host/co-host management. Here it
// resolves a placeholder event, renders a theme-aware banner placeholder, an
// inert RSVP control, and the posts feed over fixture data.
export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { theme } = useTheme();

  const event = wireEvents.find((e) => e.id === eventId) ?? wireEvents[0];

  if (!event) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>Event not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.bannerSection}>
        <div
          className={`${styles.bannerPlaceholder} ${theme === 'light' ? styles.bannerPlaceholderLight : styles.bannerPlaceholderDark}`}
        />
      </div>

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.thumbnailContainer}>
            <Avatar name={event.name} type="community" variant="community-large" />
          </div>
          <div className={styles.eventInfo}>
            <div className={styles.eventNameRow}>
              <h1 className={styles.eventName}>{event.name}</h1>
            </div>
            <p className={styles.eventMeta}>{event.dateText}</p>
            {event.location ? <p className={styles.eventMeta}>{event.location}</p> : null}

            <div className={styles.rsvpRow}>
              <button type="button" className={`${styles.rsvpButton} ${styles.rsvpButtonActive}`}>
                Going
              </button>
              <button type="button" className={styles.rsvpButton}>
                Maybe
              </button>
              <button type="button" className={styles.rsvpButton}>
                Can't go
              </button>
            </div>

            {event.goingText ? <p className={styles.eventGoing}>{event.goingText}</p> : null}
          </div>
        </div>
      </div>

      <div className={styles.postsSection}>
        <div className={styles.postsSectionHeader}>
          <h2 className={styles.postsSectionTitle}>Posts</h2>
        </div>
        <PostFeedSection />
      </div>
    </div>
  );
}
