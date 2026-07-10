import {
  assertNeverScheduleTimelineStatus,
  type ScheduleTimelineEntry,
  type ScheduleTimelineStatus,
} from '@domains/events/utils/scheduleTimelineUtils';
import styles from './EventScheduleTimeline.module.scss';

const STATUS_CLASS: Record<ScheduleTimelineStatus, string> = {
  past: styles.statusPast ?? '',
  active: styles.statusActive ?? '',
  upcoming: styles.statusUpcoming ?? '',
};

const CONNECTOR_CLASS: Record<ScheduleTimelineStatus, string> = {
  past: styles.connectorPast ?? '',
  active: styles.connectorActive ?? '',
  upcoming: styles.connectorUpcoming ?? '',
};

function getStatusClassName(status: ScheduleTimelineStatus): string {
  switch (status) {
    case 'past':
      return STATUS_CLASS.past;
    case 'active':
      return STATUS_CLASS.active;
    case 'upcoming':
      return STATUS_CLASS.upcoming;
    default:
      return assertNeverScheduleTimelineStatus(status);
  }
}

function getConnectorClassName(status: ScheduleTimelineStatus): string {
  switch (status) {
    case 'past':
      return CONNECTOR_CLASS.past;
    case 'active':
      return CONNECTOR_CLASS.active;
    case 'upcoming':
      return CONNECTOR_CLASS.upcoming;
    default:
      return assertNeverScheduleTimelineStatus(status);
  }
}

export interface EventScheduleTimelineProps {
  entries: ScheduleTimelineEntry[];
  showTrailingMore?: boolean;
}

function ScheduleItemDescription({ text }: Readonly<{ text: string }>) {
  const paragraphs = text
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={styles.descriptionBlock}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`${paragraphIndex}-${paragraph.slice(0, 24)}`} className={styles.description}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function EventScheduleTimeline({
  entries,
  showTrailingMore = false,
}: Readonly<EventScheduleTimelineProps>) {
  return (
    <div className={styles.timeline}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const itemKey = `${entry.item.time}-${entry.item.title}-${index}`;
        const showConnector = !isLast || showTrailingMore;

        return (
          <div
            key={itemKey}
            className={[styles.timelineItem, getStatusClassName(entry.status)]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.timelineMark}>
              <div className={styles.dot} aria-hidden="true" />
              {showConnector ? (
                <div
                  className={[
                    styles.connector,
                    isLast && showTrailingMore
                      ? styles.connectorMore
                      : getConnectorClassName(entry.connectorStatus),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className={styles.content}>
              <div className={styles.time}>{entry.item.time}</div>
              <div className={styles.itemTitle}>{entry.item.title}</div>
              {entry.item.description ? (
                <ScheduleItemDescription text={entry.item.description} />
              ) : null}
            </div>
          </div>
        );
      })}
      {showTrailingMore ? (
        <div className={styles.trailingMore} aria-hidden="true">
          <div className={styles.trailingMoreMark}>
            <span className={styles.trailingMoreDots}>···</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
