import { Calendar, ChevronLeft, ChevronRight, Globe04, XClose } from '@untitledui/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatTimezoneLabel, getTimezones, type TimezoneOption } from '../../utils/timezoneUtils';
import styles from './DateTimePicker.module.scss';

interface DateTimePickerProps {
  readonly startAt: string;
  readonly endAt: string;
  readonly timezone: string;
  readonly onChange: (key: 'startAt' | 'endAt', value: string) => void;
  readonly onTimezoneChange: (tz: string) => void;
  /** When false, hides end-date tab, end-date trigger, TBD button, and clear button. Defaults to true. */
  readonly showEndDate?: boolean;
  /** Placeholder shown on the trigger before a date is picked. Defaults to "Choose a date & time". */
  readonly triggerLabel?: string;
  /**
   * Optional upper bound (datetime-local string in the picker's `timezone`).
   * Calendar days strictly after `maxAt`'s date are disabled, and time slots
   * after `maxAt`'s time are disabled when the selected day equals `maxAt`'s
   * day. Used e.g. to clamp a ticket-sales window to the event's end date.
   */
  readonly maxAt?: string;
}

type ActiveTab = 'start' | 'end';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const SHORT_MONTH_NAMES = MONTH_NAMES.map((m) => m.slice(0, 3));

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const minute = m.toString().padStart(2, '0');
      const ampm = h < 12 ? 'AM' : 'PM';
      slots.push(`${hour}:${minute}${ampm}`);
    }
  }
  return slots;
})();

interface ParsedDateTime {
  year: number;
  month: number; // 0-based
  day: number;
  hours: number;
  minutes: number;
}

interface CalendarDay {
  day: number;
  month: number; // 0-based
  year: number;
}

function parseDateTime(value: string): ParsedDateTime | undefined {
  if (!value) return undefined;
  const tIdx = value.indexOf('T');
  if (tIdx === -1) return undefined;
  const datePart = value.slice(0, tIdx);
  const timePart = value.slice(tIdx + 1);
  const dateParts = datePart.split('-').map(Number);
  const timeParts = timePart.split(':').map(Number);
  const year = dateParts[0] ?? Number.NaN;
  const month = dateParts[1] ?? Number.NaN;
  const day = dateParts[2] ?? Number.NaN;
  const hours = timeParts[0] ?? Number.NaN;
  const minutes = timeParts[1] ?? Number.NaN;
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  )
    return undefined;
  return { year, month: month - 1, day, hours, minutes };
}

function toDateTimeLocal(p: ParsedDateTime): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${p.year}-${pad(p.month + 1)}-${pad(p.day)}T${pad(p.hours)}:${pad(p.minutes)}`;
}

function hoursMinutesToSlot(hours: number, minutes: number): string {
  const totalRounded = Math.round((hours * 60 + minutes) / 15) * 15;
  const h24 = Math.floor(totalRounded / 60) % 24;
  const m = totalRounded % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? 'AM' : 'PM';
  return `${h12}:${m.toString().padStart(2, '0')}${ampm}`;
}

function to24Hour(rawH: number, ampm: string): number {
  if (ampm === 'PM' && rawH !== 12) return rawH + 12;
  if (ampm === 'AM' && rawH === 12) return 0;
  return rawH;
}

function slotToHoursMinutes(slot: string): { hours: number; minutes: number } {
  const match = /^(\d+):(\d+)(AM|PM)$/.exec(slot);
  if (!match) return { hours: 0, minutes: 0 };
  const rawH = Number.parseInt(match[1] ?? '0', 10);
  const m = Number.parseInt(match[2] ?? '0', 10);
  const ampm = match[3] ?? 'AM';
  return { hours: to24Hour(rawH, ampm), minutes: m };
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const days: CalendarDay[] = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, month: nextMonth, year: nextYear });
  }
  return days;
}

function formatHeaderDate(parsed: ParsedDateTime | undefined): string {
  if (!parsed) return 'Select a date';
  const dow = new Date(parsed.year, parsed.month, parsed.day).getDay();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    dow
  ];
  return `${dayName}, ${SHORT_MONTH_NAMES[parsed.month]} ${parsed.day}`;
}

function formatHeaderTime(parsed: ParsedDateTime | undefined): string {
  if (!parsed) return '';
  const h = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
  const m = parsed.minutes.toString().padStart(2, '0');
  const ampm = parsed.hours < 12 ? 'am' : 'pm';
  return `${h}:${m}${ampm}`;
}

function getDaySuffix(day: number): string {
  if ([11, 12, 13].includes(day)) return 'th';
  if (day % 10 === 1) return 'st';
  if (day % 10 === 2) return 'nd';
  if (day % 10 === 3) return 'rd';
  return 'th';
}

function formatTabLabel(
  parsed: ParsedDateTime | undefined,
): { date: string; time: string } | undefined {
  if (!parsed) return undefined;
  const dow = new Date(parsed.year, parsed.month, parsed.day).getDay();
  const shortDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow];
  const day = parsed.day;
  const h = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
  const m = parsed.minutes.toString().padStart(2, '0');
  const ampm = parsed.hours < 12 ? 'AM' : 'PM';
  return {
    date: `${shortDay}, ${SHORT_MONTH_NAMES[parsed.month]} ${day}${getDaySuffix(day)}`,
    time: `${h}:${m}${ampm}`,
  };
}

/** Returns the two-line trigger display: { dateLine, timeLine } */
function formatTriggerParts(
  parsed: ParsedDateTime | undefined,
): { dateLine: string; timeLine: string } | undefined {
  if (!parsed) return undefined;
  const dow = new Date(parsed.year, parsed.month, parsed.day).getDay();
  const shortDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow];
  const h = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
  const m = parsed.minutes.toString().padStart(2, '0');
  const ampm = parsed.hours < 12 ? 'am' : 'pm';
  return {
    dateLine: `${shortDay}, ${SHORT_MONTH_NAMES[parsed.month]} ${parsed.day}`,
    timeLine: `${h}:${m}${ampm}`,
  };
}

/** Pre-computed views of the optional `maxAt` upper bound. Memoised to avoid re-allocating per render. */
interface MaxBound {
  parsed: ParsedDateTime;
  date: Date;
  totalMinutes: number;
}

function useMaxBound(maxAt: string | undefined): MaxBound | undefined {
  return useMemo(() => {
    if (!maxAt) return undefined;
    const parsed = parseDateTime(maxAt);
    if (!parsed) return undefined;
    return {
      parsed,
      date: new Date(parsed.year, parsed.month, parsed.day),
      totalMinutes: parsed.hours * 60 + parsed.minutes,
    };
  }, [maxAt]);
}

function isDayAfterMax(calDay: CalendarDay, max: MaxBound | undefined): boolean {
  if (!max) return false;
  return new Date(calDay.year, calDay.month, calDay.day) > max.date;
}

function isSlotAfterMaxOnSameDay(
  slotTotalMinutes: number,
  activeParsed: ParsedDateTime | undefined,
  max: MaxBound | undefined,
): boolean {
  if (!max || !activeParsed) return false;
  const sameDay =
    activeParsed.year === max.parsed.year &&
    activeParsed.month === max.parsed.month &&
    activeParsed.day === max.parsed.day;
  return sameDay && slotTotalMinutes > max.totalMinutes;
}

function isViewAtOrPastMaxMonth(
  viewYear: number,
  viewMonth: number,
  max: MaxBound | undefined,
): boolean {
  if (!max) return false;
  if (viewYear > max.parsed.year) return true;
  return viewYear === max.parsed.year && viewMonth >= max.parsed.month;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => globalThis.window?.matchMedia('(max-width: 767px)').matches ?? false,
  );
  useEffect(() => {
    const mq = globalThis.window?.matchMedia('(max-width: 767px)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function DateTimePicker({
  startAt,
  endAt,
  timezone,
  onChange,
  onTimezoneChange,
  showEndDate = true,
  triggerLabel = 'Choose a date & time',
  maxAt,
}: Readonly<DateTimePickerProps>) {
  const now = useMemo(() => new Date(), []);
  const isMobile = useIsMobile();
  const [tzSearch, setTzSearch] = useState('');
  const [tzFocused, setTzFocused] = useState(false);

  const filteredTimezones = useMemo((): TimezoneOption[] => {
    const all = getTimezones();
    if (!tzSearch.trim()) return all;
    const q = tzSearch.toLowerCase();
    return all.filter((tz) => tz.searchKey.includes(q));
  }, [tzSearch]);

  const showTzDropdown = tzFocused && filteredTimezones.length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('start');
  const [draftStart, setDraftStart] = useState(startAt);
  const [draftEnd, setDraftEnd] = useState(endAt);
  const [viewYear, setViewYear] = useState(() => parseDateTime(startAt)?.year ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parseDateTime(startAt)?.month ?? now.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);
  const selectedTimeRef = useRef<HTMLButtonElement>(null);

  // On mobile the picker works off draft state; on desktop changes are immediate
  const activeStart = isMobile ? draftStart : startAt;
  const activeEnd = isMobile ? draftEnd : endAt;
  const startParsed = parseDateTime(activeStart);
  const endParsed = parseDateTime(activeEnd);
  const activeParsed = activeTab === 'start' ? startParsed : endParsed;
  const selectedSlot = activeParsed
    ? hoursMinutesToSlot(activeParsed.hours, activeParsed.minutes)
    : undefined;

  // Close desktop popover on outside click
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insidePicker = pickerRef.current?.contains(target);
      const insideTrigger = containerRef.current?.contains(target);
      if (!insidePicker && !insideTrigger) {
        setIsOpen(false);
        setTzSearch('');
        setTzFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, isMobile]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setTzSearch('');
        setTzFocused(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Scroll selected time into view when picker opens or tab changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: activeTab and isOpen are intentional scroll triggers
  useEffect(() => {
    const container = timeListRef.current;
    const selected = selectedTimeRef.current;
    if (!container || !selected) return;
    if (isMobile) {
      // Horizontal scroll for mobile chip strip
      container.scrollLeft =
        selected.offsetLeft - container.clientWidth / 2 + selected.clientWidth / 2;
    } else {
      container.scrollTop =
        selected.offsetTop - container.clientHeight / 2 + selected.clientHeight / 2;
    }
  }, [activeTab, isOpen, isMobile]);

  const syncViewToDate = (value: string) => {
    const parsed = parseDateTime(value);
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  };

  const handleOpen = (tab: ActiveTab) => {
    setDraftStart(startAt);
    setDraftEnd(endAt);
    setActiveTab(tab);
    syncViewToDate(tab === 'start' ? startAt : endAt);
    setIsOpen(true);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    syncViewToDate(tab === 'start' ? activeStart : activeEnd);
  };

  const handleDateTimeChange = (key: 'startAt' | 'endAt', value: string) => {
    if (isMobile) {
      if (key === 'startAt') setDraftStart(value);
      else setDraftEnd(value);
    } else {
      onChange(key, value);
    }
  };

  const handleDayClick = (calDay: CalendarDay) => {
    const key = activeTab === 'start' ? 'startAt' : 'endAt';
    const h = activeParsed?.hours ?? 12;
    const m = activeParsed?.minutes ?? 0;
    handleDateTimeChange(key, toDateTimeLocal({ ...calDay, hours: h, minutes: m }));
    if (calDay.month !== viewMonth) {
      setViewYear(calDay.year);
      setViewMonth(calDay.month);
    }
  };

  const handleTimeClick = (slot: string) => {
    const { hours, minutes } = slotToHoursMinutes(slot);
    const key = activeTab === 'start' ? 'startAt' : 'endAt';
    const year = activeParsed?.year ?? now.getFullYear();
    const month = activeParsed?.month ?? now.getMonth();
    const day = activeParsed?.day ?? now.getDate();
    handleDateTimeChange(key, toDateTimeLocal({ year, month, day, hours, minutes }));

    // After confirming a start time, auto-advance to the end tab
    if (activeTab === 'start' && showEndDate) {
      const endValue = isMobile ? draftEnd : endAt;
      setActiveTab('end');
      syncViewToDate(endValue);
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleConfirm = () => {
    onChange('startAt', draftStart);
    onChange('endAt', draftEnd);
    setIsOpen(false);
    setTzSearch('');
    setTzFocused(false);
  };

  const handleClear = () => {
    setDraftStart('');
    setDraftEnd('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTzSearch('');
    setTzFocused(false);
  };

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Current time rounded down to the nearest 15-min slot
  const nowSlotMinutes = Math.floor((now.getHours() * 60 + now.getMinutes()) / 15) * 15;

  const maxBound = useMaxBound(maxAt);

  const isDateDisabled = (calDay: CalendarDay): boolean => {
    const calDayDate = new Date(calDay.year, calDay.month, calDay.day);

    // Both tabs: never allow a date in the past
    if (calDayDate < todayMidnight) return true;

    // Both tabs: respect upper bound if provided
    if (isDayAfterMax(calDay, maxBound)) return true;

    if (activeTab === 'end' && startParsed) {
      const startDate = new Date(startParsed.year, startParsed.month, startParsed.day);

      // End tab: never allow a date before the start date
      if (calDayDate < startDate) return true;

      // End tab: disable the start date itself when the end time is already
      // set and would be after the start time (force user to fix the time first)
      const isSameAsStartDay =
        calDay.year === startParsed.year &&
        calDay.month === startParsed.month &&
        calDay.day === startParsed.day;
      if (isSameAsStartDay && endParsed) {
        const endTotalMinutes = endParsed.hours * 60 + endParsed.minutes;
        const startTotalMinutes = startParsed.hours * 60 + startParsed.minutes;
        if (endTotalMinutes <= startTotalMinutes) return true;
      }
    }

    return false;
  };

  const isTimeDisabled = (slot: string): boolean => {
    const { hours: slotHours, minutes: slotMinutes } = slotToHoursMinutes(slot);
    const slotTotalMinutes = slotHours * 60 + slotMinutes;

    if (isSlotAfterMaxOnSameDay(slotTotalMinutes, activeParsed, maxBound)) return true;

    if (activeTab === 'start') {
      // Start tab: hide slots that are in the past when today is selected
      if (!activeParsed) return false;
      const isToday =
        activeParsed.year === now.getFullYear() &&
        activeParsed.month === now.getMonth() &&
        activeParsed.day === now.getDate();
      return isToday && slotTotalMinutes <= nowSlotMinutes;
    }

    // End tab: hide times before/equal to start time when on the same day
    if (!startParsed || !endParsed) return false;
    const isSameDay =
      endParsed.year === startParsed.year &&
      endParsed.month === startParsed.month &&
      endParsed.day === startParsed.day;
    if (!isSameDay) return false;
    const startTotalMinutes = startParsed.hours * 60 + startParsed.minutes;
    return slotTotalMinutes <= startTotalMinutes;
  };

  const isPrevMonthDisabled = viewYear === now.getFullYear() && viewMonth <= now.getMonth();
  const isNextMonthDisabled = isViewAtOrPastMaxMonth(viewYear, viewMonth, maxBound);

  const renderTimezoneSelector = () => (
    <div className={styles.timezoneSelector}>
      <Globe04 width={14} height={14} aria-hidden="true" className={styles.timezoneIcon} />
      <input
        className={styles.timezoneSearch}
        type="text"
        placeholder={formatTimezoneLabel(timezone)}
        value={tzSearch}
        onChange={(e) => setTzSearch(e.target.value)}
        onFocus={() => setTzFocused(true)}
        onBlur={() => {
          // Delay so a click on a dropdown option registers before the list disappears
          setTimeout(() => setTzFocused(false), 150);
        }}
        aria-label="Search timezone"
      />
      {showTzDropdown && (
        <div className={styles.timezoneDropdown}>
          {filteredTimezones.slice(0, 50).map((option) => (
            <button
              key={option.tzName}
              type="button"
              className={`${styles.timezoneOption} ${option.tzName === timezone ? styles.timezoneOptionSelected : ''}`}
              onClick={() => {
                onTimezoneChange(option.tzName);
                setTzSearch('');
                setTzFocused(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Trigger reflects committed prop values (not drafts)
  const startTriggerParts = formatTriggerParts(parseDateTime(startAt));
  const endTriggerParts = formatTriggerParts(parseDateTime(endAt));
  const calendarDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const startTabLabel = formatTabLabel(startParsed);
  const endTabLabel = formatTabLabel(endParsed);

  const renderTimePicker = (extraClass?: string) => (
    <div className={[styles.timePicker, extraClass].filter(Boolean).join(' ')} ref={timeListRef}>
      {TIME_SLOTS.filter((slot) => !isTimeDisabled(slot)).map((slot) => {
        const isActive = slot === selectedSlot;
        return (
          <button
            key={slot}
            type="button"
            ref={isActive ? selectedTimeRef : undefined}
            className={`${styles.timeSlot} ${isActive ? styles.timeSlotActive : ''}`}
            onClick={() => handleTimeClick(slot)}
            aria-pressed={isActive}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );

  const renderPickerBody = () => (
    <>
      <div className={styles.header}>
        <div className={styles.headerDate}>{formatHeaderDate(activeParsed)}</div>
        {activeParsed && <div className={styles.headerTime}>{formatHeaderTime(activeParsed)}</div>}
      </div>

      {showEndDate && (
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'start' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('start')}
          >
            {startTabLabel ? (
              <>
                <span className={styles.tabDate}>{startTabLabel.date}</span>
                <span className={styles.tabTime}>{startTabLabel.time}</span>
              </>
            ) : (
              <>
                <span className={styles.tabDate}>Select date</span>
                <span className={styles.tabTime}>Start date</span>
              </>
            )}
          </button>

          <ChevronRight width={16} height={16} aria-hidden="true" className={styles.tabArrow} />

          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'end' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('end')}
          >
            {endTabLabel ? (
              <>
                <span className={styles.tabDate}>{endTabLabel.date}</span>
                <span className={styles.tabTime}>{endTabLabel.time}</span>
              </>
            ) : (
              <>
                <span className={styles.tabOptional}>Optional</span>
                <span className={styles.tabDate}>End Date</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.calendar}>
          <div className={styles.calendarNav}>
            <span className={styles.monthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className={styles.monthNavButtons}>
              <button
                type="button"
                className={styles.monthNavButton}
                onClick={handlePrevMonth}
                aria-label="Previous month"
                disabled={isPrevMonthDisabled}
              >
                <ChevronLeft width={16} height={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.monthNavButton}
                onClick={handleNextMonth}
                aria-label="Next month"
                disabled={isNextMonthDisabled}
              >
                <ChevronRight width={16} height={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.dayHeaders}>
            {DAY_LABELS.map((d) => (
              <span key={d} className={styles.dayHeader}>
                {d}
              </span>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {calendarDays.map((calDay) => {
              const isSelected =
                activeParsed?.year === calDay.year &&
                activeParsed?.month === calDay.month &&
                activeParsed?.day === calDay.day;
              const isCurrentMonth = calDay.month === viewMonth;
              const isToday =
                now.getFullYear() === calDay.year &&
                now.getMonth() === calDay.month &&
                now.getDate() === calDay.day;
              const isDisabled = isDateDisabled(calDay);

              const cellClass = [
                styles.dayCell,
                !isCurrentMonth && styles.dayCellOtherMonth,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
                isDisabled && styles.dayCellDisabled,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={`${calDay.year}-${calDay.month}-${calDay.day}`}
                  type="button"
                  className={cellClass}
                  onClick={() => !isDisabled && handleDayClick(calDay)}
                  aria-label={`${calDay.day} ${MONTH_NAMES[calDay.month]} ${calDay.year}`}
                  aria-pressed={isSelected}
                  disabled={isDisabled}
                >
                  {calDay.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop: vertical time column */}
        {renderTimePicker()}
      </div>
    </>
  );

  return (
    <div className={styles.container} ref={containerRef}>
      {/* ── Trigger ── */}
      <div className={styles.triggerWrapper}>
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''} ${startTriggerParts ? styles.triggerFilled : ''}`}
          onClick={() => handleOpen('start')}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <Calendar width={18} height={18} aria-hidden="true" className={styles.triggerIcon} />
          {startTriggerParts ? (
            <span className={styles.triggerContent}>
              <span className={styles.triggerDateLine}>{startTriggerParts.dateLine}</span>
              <span className={styles.triggerTimeLine}>
                {startTriggerParts.timeLine}
                {showEndDate && endTriggerParts && (
                  <>
                    {' '}
                    &rarr; {endTriggerParts.dateLine} &middot; {endTriggerParts.timeLine}
                  </>
                )}
              </span>
            </span>
          ) : (
            <span className={styles.triggerPlaceholder}>{triggerLabel}</span>
          )}
        </button>

        {/* Clear end-date button */}
        {showEndDate && endTriggerParts && (
          <button
            type="button"
            className={styles.clearEndButton}
            onClick={() => onChange('endAt', '')}
            aria-label="Remove end date"
          >
            <XClose width={12} height={12} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Desktop popover ── */}
      {isOpen && !isMobile && (
        <div
          className={styles.popover}
          ref={pickerRef}
          role="dialog"
          aria-label="Date and time picker"
          aria-modal="true"
        >
          {renderPickerBody()}
          <div className={styles.footer}>
            {renderTimezoneSelector()}
            {showEndDate && activeTab === 'end' && (
              <button
                type="button"
                className={styles.tbdButton}
                onClick={() => {
                  onChange('endAt', '');
                  setIsOpen(false);
                }}
              >
                Not sure yet? <strong>Set as TBD</strong>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile bottom sheet ── */}
      {isOpen && isMobile && (
        <>
          <div className={styles.modalBackdrop} onClick={handleClose} aria-hidden="true" />
          <div
            className={styles.modal}
            ref={pickerRef}
            role="dialog"
            aria-label="Date and time picker"
            aria-modal="true"
          >
            {/* Drag handle */}
            <div className={styles.modalHandle} aria-hidden="true" />

            <div className={styles.modalScroll}>
              {/* Header + tabs + calendar */}
              <div className={styles.header}>
                <div className={styles.headerDate}>{formatHeaderDate(activeParsed)}</div>
                {activeParsed && (
                  <div className={styles.headerTime}>{formatHeaderTime(activeParsed)}</div>
                )}
              </div>

              {showEndDate && (
                <div className={styles.tabs}>
                  <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'start' ? styles.tabActive : ''}`}
                    onClick={() => handleTabChange('start')}
                  >
                    {startTabLabel ? (
                      <>
                        <span className={styles.tabDate}>{startTabLabel.date}</span>
                        <span className={styles.tabTime}>{startTabLabel.time}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.tabDate}>Select date</span>
                        <span className={styles.tabTime}>Start date</span>
                      </>
                    )}
                  </button>
                  <ChevronRight
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className={styles.tabArrow}
                  />
                  <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'end' ? styles.tabActive : ''}`}
                    onClick={() => handleTabChange('end')}
                  >
                    {endTabLabel ? (
                      <>
                        <span className={styles.tabDate}>{endTabLabel.date}</span>
                        <span className={styles.tabTime}>{endTabLabel.time}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.tabOptional}>Optional</span>
                        <span className={styles.tabDate}>End Date</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Calendar (no side time column on mobile) */}
              <div className={styles.mobileCalendarOnly}>
                <div className={styles.calendarNav}>
                  <span className={styles.monthTitle}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </span>
                  <div className={styles.monthNavButtons}>
                    <button
                      type="button"
                      className={styles.monthNavButton}
                      onClick={handlePrevMonth}
                      aria-label="Previous month"
                      disabled={isPrevMonthDisabled}
                    >
                      <ChevronLeft width={16} height={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.monthNavButton}
                      onClick={handleNextMonth}
                      aria-label="Next month"
                      disabled={isNextMonthDisabled}
                    >
                      <ChevronRight width={16} height={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className={styles.dayHeaders}>
                  {DAY_LABELS.map((d) => (
                    <span key={d} className={styles.dayHeader}>
                      {d}
                    </span>
                  ))}
                </div>
                <div className={styles.daysGrid}>
                  {calendarDays.map((calDay) => {
                    const isSelected =
                      activeParsed?.year === calDay.year &&
                      activeParsed?.month === calDay.month &&
                      activeParsed?.day === calDay.day;
                    const isCurrentMonth = calDay.month === viewMonth;
                    const isToday =
                      now.getFullYear() === calDay.year &&
                      now.getMonth() === calDay.month &&
                      now.getDate() === calDay.day;
                    const isDisabled = isDateDisabled(calDay);

                    const cellClass = [
                      styles.dayCell,
                      !isCurrentMonth && styles.dayCellOtherMonth,
                      isSelected && styles.dayCellSelected,
                      isToday && !isSelected && styles.dayCellToday,
                      isDisabled && styles.dayCellDisabled,
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <button
                        key={`${calDay.year}-${calDay.month}-${calDay.day}`}
                        type="button"
                        className={cellClass}
                        onClick={() => !isDisabled && handleDayClick(calDay)}
                        aria-label={`${calDay.day} ${MONTH_NAMES[calDay.month]} ${calDay.year}`}
                        aria-pressed={isSelected}
                        disabled={isDisabled}
                      >
                        {calDay.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Horizontal time chip strip */}
              {renderTimePicker(styles.timePickerMobile)}
            </div>

            <div className={styles.mobileFooter}>
              {renderTimezoneSelector()}
              <div className={styles.mobileActions}>
                <button type="button" className={styles.clearButton} onClick={handleClear}>
                  Clear
                </button>
                <button type="button" className={styles.confirmButton} onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
