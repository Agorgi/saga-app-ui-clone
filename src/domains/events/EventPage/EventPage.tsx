import { wireEvents } from '@/data/fixtures';
import { EventDefaultBanner } from '@domains/events/components/EventDefaultBanner/EventDefaultBanner';
import { EventFAQSection } from '@domains/events/components/EventFAQSection/EventFAQSection';
import { EventGuidelinesSection } from '@domains/events/components/EventGuidelinesSection/EventGuidelinesSection';
import { EventMomentsBar } from '@domains/events/components/EventMomentsBar/EventMomentsBar';
import { EventScheduleSection } from '@domains/events/components/EventScheduleSection/EventScheduleSection';
import { EventTeamWidget } from '@domains/events/components/EventTeamWidget/EventTeamWidget';
import { useEventHeroTone } from '@domains/events/hooks/useEventHeroTone';
import { OpenRolesDisplay } from '@domains/events/openRoles/OpenRolesDisplay';
import { getEventHeroTitleStyle } from '@domains/events/utils/eventHeroTitleUtils';
import { PostFeedSection } from '@domains/posts/ui/PostFeedSection/PostFeedSection';
import { useTheme } from '@saga/global-web';
import { Calendar, MarkerPin01, Ticket01 } from '@untitledui/icons';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';

// Wireframe clone: the redesigned event detail page. The source loads the event
// over the API and wires RSVP, ticketing, payments, host management, moments,
// and schedule modals. Here it resolves a fixture event and renders the new
// glass hero (branded default banner, no real media), the description, and the
// Guidelines + FAQ sections, keeping the clone's Open Roles panel and posts
// feed. Ticketing/calendar/schedule/modals are inert.
export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { theme } = useTheme();
  const heroTone = useEventHeroTone(undefined, theme);

  const event = wireEvents.find((e) => e.id === eventId) ?? wireEvents[0];

  // The schedule timeline maps its "HH:MM" times onto a concrete day and marks
  // past / active / upcoming against the clock. The wireframe has no real event
  // date, so anchor the run-of-show to today for a plausible live state.
  const eventStartAt = useMemo(() => new Date(), []);

  if (!event) {
    return <div className={styles.container} />;
  }

  const heroTitleStyle = getEventHeroTitleStyle(event.name);

  return (
    <div className={styles.container}>
      <section className={styles.hero} aria-label="Event overview">
        <div className={styles.heroGlass} data-hero-tone={heroTone}>
          <div className={styles.heroAmbienceBackdrop} aria-hidden="true">
            <div className={styles.heroAmbienceFallback}>
              <EventDefaultBanner layout="fill" mark="none" />
            </div>
          </div>

          <div className={styles.heroLayout}>
            <div className={styles.heroBannerCol}>
              <EventDefaultBanner
                layout="card"
                mark="soft"
                className={styles.bannerPlaceholderCard}
              />
            </div>

            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle} style={heroTitleStyle}>
                {event.name}
              </h1>
              <div className={styles.heroMeta}>
                <button type="button" className={styles.heroMetaButton}>
                  {event.dateText}
                </button>
                {event.location ? (
                  <span className={styles.heroMetaLocation}>
                    <MarkerPin01 width={15} height={15} aria-hidden="true" />
                    {event.location}
                  </span>
                ) : null}
              </div>
              <div className={styles.heroCTARow}>
                <button type="button" className={styles.heroCtaButton}>
                  <Calendar width={18} height={18} aria-hidden="true" />
                  Add to Calendar
                </button>
                <button type="button" className={styles.heroCtaButtonPrimary}>
                  <Ticket01 width={18} height={18} aria-hidden="true" />
                  {event.ctaLabel ?? 'Get tickets'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.contentContainer}>
        {event.description ? (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>The Experience</h2>
            <div className={styles.description}>
              {event.description.split('\n').map((paragraph) =>
                paragraph.trim() ? (
                  <p key={paragraph} className={styles.descriptionParagraph}>
                    {paragraph}
                  </p>
                ) : null,
              )}
            </div>
          </div>
        ) : null}

        {event.team?.length || event.schedule?.length ? (
          <div className={styles.momentsTeamGrid}>
            {event.team?.length ? <EventTeamWidget rows={event.team} /> : null}
            {event.schedule?.length ? (
              <EventScheduleSection schedule={event.schedule} eventStartAt={eventStartAt} />
            ) : null}
          </div>
        ) : null}

        <div className={styles.section}>
          <EventMomentsBar />
        </div>

        <div className={styles.extrasStack}>
          <div className={styles.extrasGuidelines}>
            <EventGuidelinesSection guidelines={event.guidelines} />
          </div>
          <div className={styles.extrasFaqs}>
            <EventFAQSection faqs={event.faqs} />
          </div>
        </div>

        <div className={styles.section}>
          <OpenRolesDisplay
            roles={event.openRoles ?? []}
            openToApplications={event.openToApplications ?? false}
            eventName={event.name}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Posts</h2>
          <PostFeedSection />
        </div>
      </div>
    </div>
  );
}
