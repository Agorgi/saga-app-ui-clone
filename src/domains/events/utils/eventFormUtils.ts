import { EVENT_NAME_MAX_LENGTH } from '@saga/events-middleware';

// Wireframe clone: the source converts between datetime-local strings and UTC
// using date-fns-tz (timezone-aware). The clone has no date-fns-tz dependency,
// so conversions fall back to the browser's local timezone — the DateTimePicker
// does its own date math and no value is ever sent to a backend. The validation
// rules are preserved verbatim from the source.

/**
 * Format a Date for a datetime-local input. Without date-fns-tz this uses the
 * browser's local wall-clock time rather than the given IANA timezone.
 */
export function toDateTimeLocalValue(d: Date, timezone: string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Parse a datetime-local input string to an ISO string. Without date-fns-tz the
 * value is interpreted in the browser's local timezone.
 */
export function fromDateTimeLocalToISO(value: string, timezone: string): string {
  return value ? new Date(value).toISOString() : '';
}

/**
 * Validate required fields common to both create and edit event forms.
 * Returns an error message string, or undefined if valid.
 */
export function validateEventDetails(values: {
  name: string;
  startAt: string;
  endAt?: string;
  timezone: string;
}): string | undefined {
  if (!values.name.trim()) return 'Event name is required';
  if (values.name.length > EVENT_NAME_MAX_LENGTH) {
    return `Event name must be ${EVENT_NAME_MAX_LENGTH} characters or fewer`;
  }
  if (!values.startAt.trim()) return 'Start date and time is required';
  if (values.endAt?.trim() && values.endAt <= values.startAt) {
    return 'End time must be after start time';
  }
  return undefined;
}
