import { CommunitySelector } from '@components/CommunitySelector/CommunitySelector';
import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';
import { PersonnelInviteSection } from '@domains/events/sections/PersonnelInviteSection';
import { fromDateTimeLocalToISO } from '@domains/events/utils/eventFormUtils';
import type {
  SalesWindow,
  TicketTypeDraft,
} from '@domains/tickets/sections/TicketTypeDraftSection/TicketTypeDraftSection';
import { TicketTypeDraftSection } from '@domains/tickets/sections/TicketTypeDraftSection/TicketTypeDraftSection';
import { Button, LoadingSymbol } from '@saga/global-web';
import { ImagePlus, Plus } from '@untitledui/icons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateEventForm.module.scss';

// Wireframe clone: the single-page event form reached from the "Is your event?"
// chooser. There is no backend — "Create event" holds a brief submitting state
// then returns to the events list. The paid and free variants share this form;
// the free variant hides the ticket-pricing section. Per the redesign the field
// labels live inside the inputs (inline placeholders) instead of separate
// heading-with-subtext boxes; the reused Team and Tickets sections keep their
// own internal headers, matching the production components.

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';

interface PosterUploadProps {
  readonly poster: string | undefined;
  readonly onChange: (poster: string | undefined) => void;
}

// A single 1:1 poster. Clicking the square opens the file picker; once a poster
// is chosen it fills the square and clicking it again replaces it.
function PosterUpload({ poster, onChange }: PosterUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className={styles.posterWrap}>
      <button
        type="button"
        className={styles.poster}
        onClick={() => inputRef.current?.click()}
        aria-label={poster ? 'Replace event poster' : 'Upload event poster'}
      >
        {poster ? (
          <img src={poster} alt="Event poster preview" className={styles.posterImage} />
        ) : (
          <span className={styles.posterPlaceholder}>
            <ImagePlus className={styles.posterIcon} aria-hidden />
            <span className={styles.posterText}>Upload event poster</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className={styles.fileInput}
      />
    </div>
  );
}

type ExtraKey = 'link' | 'dressCode' | 'communities';
type TextExtraKey = 'link' | 'dressCode';

const EXTRA_PILLS: ReadonlyArray<{ key: ExtraKey; label: string }> = [
  { key: 'link', label: 'Link' },
  { key: 'dressCode', label: 'Dress code' },
  { key: 'communities', label: 'Tag communities' },
];

const TEXT_PLACEHOLDERS: Record<TextExtraKey, string> = {
  link: 'Add a link',
  dressCode: 'Add a dress code',
};

interface CreateEventFormProps {
  readonly mode: 'paid' | 'free';
}

export function CreateEventForm({ mode }: CreateEventFormProps) {
  const navigate = useNavigate();
  const localTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState<string | undefined>(undefined);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [timezone, setTimezone] = useState(localTimezone);
  const [selectedCoHostIds, setSelectedCoHostIds] = useState<string[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [openExtras, setOpenExtras] = useState<Record<ExtraKey, boolean>>({
    link: false,
    dressCode: false,
    communities: false,
  });
  const [textExtras, setTextExtras] = useState<Record<TextExtraKey, string>>({
    link: '',
    dressCode: '',
  });
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>([]);
  const [ticketDrafts, setTicketDrafts] = useState<TicketTypeDraft[]>([]);
  const [salesWindow, setSalesWindow] = useState<SalesWindow>(() => ({
    startAt: '',
    endAt: '',
    timezone: localTimezone,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventEndDate = useMemo(() => {
    const iso = endAt ? fromDateTimeLocalToISO(endAt, timezone) : undefined;
    return iso ? new Date(iso) : undefined;
  }, [endAt, timezone]);

  const handleDateChange = useCallback((key: 'startAt' | 'endAt', value: string) => {
    if (key === 'startAt') setStartAt(value);
    else setEndAt(value);
  }, []);

  const togglePill = (key: ExtraKey) => {
    setOpenExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExtraActive = (key: ExtraKey) =>
    key === 'communities'
      ? openExtras.communities || selectedCommunityIds.length > 0
      : openExtras[key] || Boolean(textExtras[key]);

  const handleSubmit = () => {
    // Wireframe: no createEvent call fires. Hold the submitting state briefly,
    // then return to the events list.
    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate('/events');
    }, 900);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Event title"
        />

        <PosterUpload poster={poster} onChange={setPoster} />

        <div className={styles.section}>
          <DateTimePicker
            startAt={startAt}
            endAt={endAt}
            timezone={timezone}
            onChange={handleDateChange}
            onTimezoneChange={setTimezone}
            triggerLabel="Select a date"
          />
        </div>

        <div className={styles.section}>
          <PersonnelInviteSection
            selectedCoHostIds={selectedCoHostIds}
            onCoHostSelectionChange={setSelectedCoHostIds}
            selectedStaffIds={selectedStaffIds}
            onStaffSelectionChange={setSelectedStaffIds}
            placeholder="Team, enter email or phone number"
          />
        </div>

        <input
          type="text"
          className={styles.input}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Location"
        />

        <textarea
          className={styles.textarea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          aria-label="Description"
        />

        <div className={styles.pillRow}>
          {EXTRA_PILLS.map((pill) => (
            <button
              key={pill.key}
              type="button"
              className={`${styles.pill} ${isExtraActive(pill.key) ? styles.pillActive : ''}`}
              onClick={() => togglePill(pill.key)}
              aria-expanded={openExtras[pill.key]}
            >
              <Plus className={styles.pillIcon} aria-hidden />
              {pill.label}
            </button>
          ))}
        </div>

        {EXTRA_PILLS.some((pill) => openExtras[pill.key]) && (
          <div className={styles.extraInputs}>
            {EXTRA_PILLS.filter((pill) => openExtras[pill.key]).map((pill) => {
              if (pill.key === 'communities') {
                return (
                  <CommunitySelector
                    key={pill.key}
                    selectedCommunityIds={selectedCommunityIds}
                    onSelectionChange={setSelectedCommunityIds}
                    maxSelection={10}
                    label=""
                  />
                );
              }
              const textKey = pill.key;
              return (
                <input
                  key={textKey}
                  type="text"
                  className={styles.input}
                  placeholder={TEXT_PLACEHOLDERS[textKey]}
                  value={textExtras[textKey]}
                  onChange={(e) =>
                    setTextExtras((prev) => ({ ...prev, [textKey]: e.target.value }))
                  }
                  aria-label={pill.label}
                />
              );
            })}
          </div>
        )}

        {mode === 'paid' && (
          <div className={styles.section}>
            <TicketTypeDraftSection
              drafts={ticketDrafts}
              onChange={setTicketDrafts}
              salesWindow={salesWindow}
              onSalesWindowChange={setSalesWindow}
              eventEndAt={eventEndDate}
            />
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/events')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSymbol size="small" />
                Create event...
              </>
            ) : (
              'Create event'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventForm;
