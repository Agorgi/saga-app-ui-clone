import { BaseModal } from '@saga/global-web';
import { Calendar, Download01, Plus } from '@untitledui/icons';
import { useCallback } from 'react';
import styles from './EventCalendarModal.module.scss';

interface EventCalendarModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly eventName: string;
  readonly startAt: Date;
  readonly endAt?: Date;
  readonly location?: string;
  readonly description?: string;
}

function generateICS(
  eventName: string,
  startAt: Date,
  endAt: Date | undefined,
  location: string | undefined,
  description: string | undefined,
): string {
  const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const dtstart = formatDate(startAt);
  const dtend = endAt
    ? formatDate(endAt)
    : formatDate(new Date(startAt.getTime() + 60 * 60 * 1000));
  const dtstamp = formatDate(new Date());
  const uid = `${startAt.getTime()}@saga-app`;

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Saga//Saga//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${eventName.replace(/"/g, '\\"')}`;

  if (location) {
    icsContent += `\nLOCATION:${location.replace(/"/g, '\\"')}`;
  }

  if (description) {
    icsContent += `\nDESCRIPTION:${description.replace(/"/g, '\\"').replace(/\n/g, '\\n')}`;
  }

  icsContent += `\nEND:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function EventCalendarModal({
  isOpen,
  onClose,
  eventName,
  startAt,
  endAt,
  location,
  description,
}: EventCalendarModalProps) {
  const handleDownloadICS = useCallback(() => {
    const icsContent = generateICS(eventName, startAt, endAt, location, description);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventName.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  }, [eventName, startAt, endAt, location, description, onClose]);

  const handleAddToGoogleCalendar = useCallback(() => {
    const startISO = startAt
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d+Z/, 'Z');
    const endISO = (endAt || new Date(startAt.getTime() + 60 * 60 * 1000))
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d+Z/, 'Z');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventName,
      dates: `${startISO}/${endISO}`,
      ...(location && { location }),
      ...(description && { details: description }),
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    onClose();
  }, [eventName, startAt, endAt, location, description, onClose]);

  const handleAddToAppleCalendar = useCallback(() => {
    const icsContent = generateICS(eventName, startAt, endAt, location, description);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 100);
    onClose();
  }, [eventName, startAt, endAt, location, description, onClose]);

  const handleAddToOutlook = useCallback(() => {
    const startISO = startAt.toISOString();
    const endISO = (endAt || new Date(startAt.getTime() + 60 * 60 * 1000)).toISOString();

    const params = new URLSearchParams({
      subject: eventName,
      startdt: startISO,
      enddt: endISO,
      ...(location && { location }),
      ...(description && { body: description }),
    });

    window.open(
      `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`,
      '_blank',
    );
    onClose();
  }, [eventName, startAt, endAt, location, description, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden />

        <div className={styles.sheetHeader}>
          <Calendar width={20} height={20} className={styles.headerIcon} aria-hidden />
          <h2 className={styles.sheetTitle}>Add to calendar</h2>
        </div>

        <div className={styles.optionsContainer}>
          <button
            type="button"
            className={styles.calendarOption}
            onClick={handleAddToGoogleCalendar}
            aria-label="Add to Google Calendar"
          >
            <div className={styles.optionIconWrap}>
              <Plus width={18} height={18} />
            </div>
            <div className={styles.optionContent}>
              <p className={styles.optionLabel}>Google Calendar</p>
              <p className={styles.optionDesc}>Add to your Google Calendar</p>
            </div>
          </button>

          <button
            type="button"
            className={styles.calendarOption}
            onClick={handleAddToAppleCalendar}
            aria-label="Add to Apple Calendar"
          >
            <div className={styles.optionIconWrap}>
              <Plus width={18} height={18} />
            </div>
            <div className={styles.optionContent}>
              <p className={styles.optionLabel}>Apple Calendar</p>
              <p className={styles.optionDesc}>Add to your Apple Calendar</p>
            </div>
          </button>

          <button
            type="button"
            className={styles.calendarOption}
            onClick={handleAddToOutlook}
            aria-label="Add to Outlook"
          >
            <div className={styles.optionIconWrap}>
              <Plus width={18} height={18} />
            </div>
            <div className={styles.optionContent}>
              <p className={styles.optionLabel}>Outlook</p>
              <p className={styles.optionDesc}>Add to your Outlook calendar</p>
            </div>
          </button>

          <button
            type="button"
            className={styles.calendarOption}
            onClick={handleDownloadICS}
            aria-label="Download as ICS file"
          >
            <div className={styles.optionIconWrap}>
              <Download01 width={18} height={18} />
            </div>
            <div className={styles.optionContent}>
              <p className={styles.optionLabel}>Download ICS</p>
              <p className={styles.optionDesc}>Save event as .ics file</p>
            </div>
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
