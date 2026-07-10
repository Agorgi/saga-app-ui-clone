import { EventScheduleModal } from '@domains/events/components/EventScheduleModal/EventScheduleModal';
import { EventScheduleTimeline } from '@domains/events/components/EventScheduleTimeline/EventScheduleTimeline';
import {
  buildScheduleTimeline,
  hasMoreScheduleEntries,
  selectSchedulePreviewEntries,
} from '@domains/events/utils/scheduleTimelineUtils';
import type { ScheduleItem } from '@saga/events-middleware';
import { ChevronRight } from '@untitledui/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './EventScheduleSection.module.scss';

interface EventScheduleSectionProps {
  schedule?: ScheduleItem[];
  eventStartAt: Date;
}

export function EventScheduleSection({ schedule, eventStartAt }: EventScheduleSectionProps) {
  const [now, setNow] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const timelineEntries = useMemo(
    () => (schedule ? buildScheduleTimeline(schedule, eventStartAt, now) : []),
    [eventStartAt, now, schedule],
  );

  const previewEntries = useMemo(
    () => selectSchedulePreviewEntries(timelineEntries),
    [timelineEntries],
  );

  const showMoreHint = hasMoreScheduleEntries(timelineEntries, previewEntries);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (timelineEntries.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={styles.card}
        onClick={handleOpenModal}
        aria-label="View full schedule"
      >
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>Schedule</h2>
          {showMoreHint ? (
            <span className={styles.viewAll}>
              View all
              <ChevronRight className={styles.viewAllIcon} aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <div
          className={[styles.preview, showMoreHint ? styles.previewTruncated : '']
            .filter(Boolean)
            .join(' ')}
        >
          <EventScheduleTimeline entries={previewEntries} showTrailingMore={showMoreHint} />
        </div>
      </button>

      <EventScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        entries={timelineEntries}
      />
    </>
  );
}
