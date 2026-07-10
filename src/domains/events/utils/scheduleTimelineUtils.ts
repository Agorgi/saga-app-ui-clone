import type { ScheduleItem } from '@saga/events-middleware';

export type ScheduleTimelineStatus = 'past' | 'active' | 'upcoming';

export interface ScheduleTimelineEntry {
  item: ScheduleItem;
  itemTime: Date | null;
  status: ScheduleTimelineStatus;
  connectorStatus: ScheduleTimelineStatus;
}

export function parseScheduleItemTime(eventStartAt: Date, time: string): Date | null {
  if (!time.trim()) {
    return null;
  }

  const segments = time.split(':');
  const hours = Number(segments[0]);
  const minutes = Number(segments[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const itemTime = new Date(eventStartAt);
  itemTime.setHours(hours, minutes, 0, 0);
  return itemTime;
}

function getItemStatus(
  itemTime: Date | null,
  nextItemTime: Date | null,
  now: Date,
): ScheduleTimelineStatus {
  if (!itemTime || now < itemTime) {
    return 'upcoming';
  }

  if (nextItemTime && now >= nextItemTime) {
    return 'past';
  }

  return 'active';
}

function getConnectorStatus(
  itemTime: Date | null,
  nextItemTime: Date | null,
  now: Date,
): ScheduleTimelineStatus {
  if (!nextItemTime) {
    return 'upcoming';
  }

  if (now >= nextItemTime) {
    return 'past';
  }

  if (itemTime && now >= itemTime) {
    return 'active';
  }

  return 'upcoming';
}

export function buildScheduleTimeline(
  schedule: ScheduleItem[],
  eventStartAt: Date,
  now: Date,
): ScheduleTimelineEntry[] {
  const sorted = [...schedule].sort((left, right) => left.time.localeCompare(right.time));

  return sorted.map((item, index) => {
    const itemTime = parseScheduleItemTime(eventStartAt, item.time);
    const nextItem = sorted[index + 1];
    const nextItemTime = nextItem ? parseScheduleItemTime(eventStartAt, nextItem.time) : null;

    return {
      item,
      itemTime,
      status: getItemStatus(itemTime, nextItemTime, now),
      connectorStatus: getConnectorStatus(itemTime, nextItemTime, now),
    };
  });
}

const PREVIEW_ENTRY_COUNT = 3;

function sliceAroundIndex(
  entries: ScheduleTimelineEntry[],
  centerIndex: number,
  count: number,
): ScheduleTimelineEntry[] {
  const half = Math.floor((count - 1) / 2);
  const start = Math.max(0, Math.min(centerIndex - half, entries.length - count));
  return entries.slice(start, start + count);
}

/** Returns up to three entries framing the current moment: past, active, and upcoming. */
export function selectSchedulePreviewEntries(
  entries: ScheduleTimelineEntry[],
): ScheduleTimelineEntry[] {
  if (entries.length <= PREVIEW_ENTRY_COUNT) {
    return entries;
  }

  const activeIndex = entries.findIndex((entry) => entry.status === 'active');
  if (activeIndex >= 0) {
    const isFinalSlot = activeIndex === entries.length - 1;
    const allBeforePast = entries.slice(0, activeIndex).every((entry) => entry.status === 'past');
    if (isFinalSlot && allBeforePast && entries.length > PREVIEW_ENTRY_COUNT) {
      return entries.slice(-PREVIEW_ENTRY_COUNT);
    }

    return sliceAroundIndex(entries, activeIndex, PREVIEW_ENTRY_COUNT);
  }

  const allPast = entries.every((entry) => entry.status === 'past');
  if (allPast) {
    return entries.slice(-PREVIEW_ENTRY_COUNT);
  }

  return entries.slice(0, PREVIEW_ENTRY_COUNT);
}

export function hasMoreScheduleEntries(
  allEntries: ScheduleTimelineEntry[],
  previewEntries: ScheduleTimelineEntry[],
): boolean {
  return previewEntries.length < allEntries.length;
}

export function assertNeverScheduleTimelineStatus(value: never): never {
  throw new Error(`Unexpected schedule timeline status: ${String(value)}`);
}
