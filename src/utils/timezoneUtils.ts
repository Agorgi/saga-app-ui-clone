// Wireframe clone: the source builds its timezone list from @vvo/tzdb with
// live DST-aware offsets. The clone has no @vvo/tzdb dependency, so this is a
// curated, hardcoded list of common timezones with the same shape and the same
// public API (TimezoneOption, getTimezones, formatTimezoneLabel) the
// DateTimePicker consumes. Offsets are static labels, not DST-aware.

export interface TimezoneOption {
  /** IANA name to store, e.g. "America/Los_Angeles" */
  tzName: string;
  /** Display label shown in the dropdown, e.g. "-08:00 Pacific Time (PT)" */
  label: string;
  /** Lowercase concatenation of all searchable fields */
  searchKey: string;
}

// Curated common timezones. The third field feeds the search index alongside
// the IANA name and label so typing "pacific" or "tokyo" filters correctly.
const CURATED: ReadonlyArray<{ tzName: string; label: string; alt: string }> = [
  { tzName: 'Pacific/Honolulu', label: '-10:00 Hawaii Time (HST)', alt: 'Hawaii Honolulu' },
  { tzName: 'America/Anchorage', label: '-09:00 Alaska Time (AKT)', alt: 'Alaska Anchorage' },
  { tzName: 'America/Los_Angeles', label: '-08:00 Pacific Time (PT)', alt: 'Pacific Los Angeles' },
  { tzName: 'America/Phoenix', label: '-07:00 Mountain Time (MST)', alt: 'Arizona Phoenix' },
  { tzName: 'America/Denver', label: '-07:00 Mountain Time (MT)', alt: 'Mountain Denver' },
  { tzName: 'America/Chicago', label: '-06:00 Central Time (CT)', alt: 'Central Chicago' },
  { tzName: 'America/New_York', label: '-05:00 Eastern Time (ET)', alt: 'Eastern New York' },
  { tzName: 'America/Sao_Paulo', label: '-03:00 Brasilia Time (BRT)', alt: 'Brazil Sao Paulo' },
  { tzName: 'UTC', label: '+00:00 Coordinated Universal Time (UTC)', alt: 'utc gmt' },
  { tzName: 'Europe/London', label: '+00:00 London Time (GMT)', alt: 'London United Kingdom' },
  { tzName: 'Europe/Paris', label: '+01:00 Central European Time (CET)', alt: 'Paris France' },
  { tzName: 'Europe/Berlin', label: '+01:00 Central European Time (CET)', alt: 'Berlin Germany' },
  { tzName: 'Africa/Lagos', label: '+01:00 West Africa Time (WAT)', alt: 'Lagos Nigeria' },
  { tzName: 'Africa/Johannesburg', label: '+02:00 South Africa Time (SAST)', alt: 'Johannesburg' },
  { tzName: 'Asia/Dubai', label: '+04:00 Gulf Time (GST)', alt: 'Dubai United Arab Emirates' },
  { tzName: 'Asia/Kolkata', label: '+05:30 India Time (IST)', alt: 'India Kolkata Mumbai' },
  { tzName: 'Asia/Bangkok', label: '+07:00 Indochina Time (ICT)', alt: 'Bangkok Thailand' },
  { tzName: 'Asia/Singapore', label: '+08:00 Singapore Time (SGT)', alt: 'Singapore' },
  { tzName: 'Asia/Hong_Kong', label: '+08:00 Hong Kong Time (HKT)', alt: 'Hong Kong' },
  { tzName: 'Asia/Tokyo', label: '+09:00 Japan Time (JST)', alt: 'Tokyo Japan' },
  { tzName: 'Australia/Sydney', label: '+11:00 Eastern Australia Time (AEDT)', alt: 'Sydney' },
  { tzName: 'Pacific/Auckland', label: '+13:00 New Zealand Time (NZDT)', alt: 'Auckland' },
];

const TIMEZONE_OPTIONS: TimezoneOption[] = CURATED.map((tz) => ({
  tzName: tz.tzName,
  label: tz.label,
  searchKey: `${tz.tzName} ${tz.label} ${tz.alt}`.toLowerCase(),
}));

const TIMEZONE_LABEL_MAP = new Map<string, string>(
  TIMEZONE_OPTIONS.map((o) => [o.tzName, o.label]),
);

/**
 * Returns the curated timezone options.
 */
export function getTimezones(): TimezoneOption[] {
  return TIMEZONE_OPTIONS;
}

/**
 * Format an IANA timezone name for display. Falls back to a humanized version
 * of the IANA name for any timezone not in the curated list (e.g. the user's
 * own resolved timezone), so the picker always renders something readable.
 */
export function formatTimezoneLabel(tzName: string): string {
  return TIMEZONE_LABEL_MAP.get(tzName) ?? tzName.replaceAll('_', ' ');
}
