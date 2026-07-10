import { EventScheduleTimeline } from '@domains/events/components/EventScheduleTimeline/EventScheduleTimeline';
import type { ScheduleTimelineEntry } from '@domains/events/utils/scheduleTimelineUtils';
import { BaseModal } from '@saga/global-web';
import { XClose } from '@untitledui/icons';
import { useId } from 'react';
import styles from './EventScheduleModal.module.scss';

export interface EventScheduleModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly entries: ScheduleTimelineEntry[];
}

export function EventScheduleModal({ isOpen, onClose, entries }: EventScheduleModalProps) {
  const titleId = useId();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
      ariaLabelledBy={titleId}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.sheetHeader}>
          <h2 id={titleId} className={styles.sheetTitle}>
            Schedule
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close schedule"
          >
            <XClose width={20} height={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.scrollBody}>
          <EventScheduleTimeline entries={entries} />
        </div>
      </div>
    </BaseModal>
  );
}
