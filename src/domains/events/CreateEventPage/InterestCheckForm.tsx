import { CommunitySelector } from '@components/CommunitySelector/CommunitySelector';
import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';
import { NumberInput } from '@components/NumberInput/NumberInput';
import { PersonnelInviteSection } from '@domains/events/sections/PersonnelInviteSection';
import { RoleDraftSection } from '@domains/events/sections/RoleDraftSection/RoleDraftSection';
import { Button, LoadingSymbol } from '@saga/global-web';
import { ImagePlus, InfoCircle, Plus, Trash01 } from '@untitledui/icons';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InterestCheckRole, ThresholdUnit } from '../interestCheck/types';
import styles from './InterestCheckForm.module.scss';

// Wireframe clone: the event "Interest Check" form, reached from the third card on the
// "Is your event?" chooser. It reuses the paid event form's framework (poster, title,
// Team, Location, Description, chips) and swaps the ticket section for the interest-check
// fields: proposed dates, ticket price, interest threshold, decision date, and open roles.
// Front-end only: "Post interest check" / "Save as draft" hold a brief state then return
// to the events list. No payment is taken; copy makes clear cards are authorized, not charged.

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';
const PLATFORM_FEE_RATE = 0.05;
const MAX_DATES = 3;

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface PosterUploadProps {
  readonly poster: string | undefined;
  readonly onChange: (poster: string | undefined) => void;
}

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

interface DateOption {
  id: string;
  at: string;
  timezone: string;
}

export function InterestCheckForm() {
  const navigate = useNavigate();
  const localTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState<string | undefined>(undefined);
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
  const [dates, setDates] = useState<DateOption[]>(() => [
    { id: genId('date'), at: '', timezone: localTimezone },
  ]);
  const [ticketPriceDollars, setTicketPriceDollars] = useState('0.00');
  const [thresholdValue, setThresholdValue] = useState('');
  const [thresholdUnit, setThresholdUnit] = useState<ThresholdUnit>('people');
  const [decisionAt, setDecisionAt] = useState('');
  const [decisionTz, setDecisionTz] = useState(localTimezone);
  const [roles, setRoles] = useState<InterestCheckRole[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePill = (key: ExtraKey) => {
    setOpenExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExtraActive = (key: ExtraKey) =>
    key === 'communities'
      ? openExtras.communities || selectedCommunityIds.length > 0
      : openExtras[key] || Boolean(textExtras[key]);

  const updateDate = (id: string, patch: Partial<DateOption>) => {
    setDates((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };
  const addDate = () => {
    setDates((prev) =>
      prev.length >= MAX_DATES ? prev : [...prev, { id: genId('date'), at: '', timezone: localTimezone }],
    );
  };
  const removeDate = (id: string) => {
    setDates((prev) => (prev.length <= 1 ? prev : prev.filter((d) => d.id !== id)));
  };

  const thresholdFee = useMemo(() => {
    if (thresholdUnit !== 'amount') return null;
    const amount = Number.parseFloat(thresholdValue);
    if (Number.isNaN(amount) || amount <= 0) return null;
    return (amount * PLATFORM_FEE_RATE).toFixed(2);
  }, [thresholdUnit, thresholdValue]);

  const submit = () => {
    // Wireframe: no createInterestCheck call fires. Hold the submitting state briefly,
    // then return to the events list.
    setIsSubmitting(true);
    window.setTimeout(() => navigate('/events'), 900);
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

        {/* ── Proposed dates ── */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Proposed dates</span>
          <p className={styles.hint}>1 to 3 options. Add more than one to let people vote on the date.</p>
          <div className={styles.dateList}>
            {dates.map((d) => (
              <div key={d.id} className={styles.dateRow}>
                <div className={styles.dateRowPicker}>
                  <DateTimePicker
                    startAt={d.at}
                    endAt=""
                    timezone={d.timezone}
                    onChange={(key, value) => {
                      if (key === 'startAt') updateDate(d.id, { at: value });
                    }}
                    onTimezoneChange={(tz) => updateDate(d.id, { timezone: tz })}
                    showEndDate={false}
                    triggerLabel="Select a date"
                  />
                </div>
                {dates.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeDateBtn}
                    onClick={() => removeDate(d.id)}
                    aria-label="Remove date option"
                  >
                    <Trash01 width={16} height={16} aria-hidden />
                  </button>
                )}
              </div>
            ))}
          </div>
          {dates.length < MAX_DATES && (
            <button type="button" className={styles.addDateBtn} onClick={addDate}>
              <Plus width={16} height={16} aria-hidden />
              Add date option
            </button>
          )}
        </div>

        {/* ── Ticket price ── */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Ticket price (per person)</span>
          <p className={styles.hint}>
            Authorized when someone reserves. Cards are not charged until the event confirms.
          </p>
          <div className={styles.priceWrap}>
            <span className={styles.priceCurrency}>$</span>
            <div className={styles.priceInput}>
              <NumberInput
                min={0}
                step={0.01}
                placeholder="0.00"
                value={ticketPriceDollars}
                onChange={setTicketPriceDollars}
                showChevrons={false}
              />
            </div>
          </div>
        </div>

        {/* ── Interest threshold ── */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Interest threshold</span>
          <p className={styles.hint}>How many people, or how much committed, makes it happen.</p>
          <div className={styles.thresholdRow}>
            <div className={styles.thresholdValue}>
              <NumberInput
                min={1}
                placeholder={thresholdUnit === 'people' ? 'e.g. 30' : 'e.g. 500'}
                value={thresholdValue}
                onChange={setThresholdValue}
                showChevrons={false}
              />
            </div>
            <div className={styles.unitToggle} role="radiogroup" aria-label="Threshold unit">
              <button
                type="button"
                className={`${styles.unitOption} ${thresholdUnit === 'people' ? styles.unitOptionActive : ''}`}
                onClick={() => setThresholdUnit('people')}
                aria-pressed={thresholdUnit === 'people'}
              >
                # people
              </button>
              <button
                type="button"
                className={`${styles.unitOption} ${thresholdUnit === 'amount' ? styles.unitOptionActive : ''}`}
                onClick={() => setThresholdUnit('amount')}
                aria-pressed={thresholdUnit === 'amount'}
              >
                $ amount
              </button>
            </div>
          </div>
          {thresholdFee !== null && (
            <p className={styles.feeLine}>
              Platform fee: 5% (about ${thresholdFee} on this goal)
            </p>
          )}
        </div>

        {/* ── Decision date ── */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>When we decide if it's on</span>
          <p className={styles.hint}>The interest check closes at this time.</p>
          <DateTimePicker
            startAt={decisionAt}
            endAt=""
            timezone={decisionTz}
            onChange={(key, value) => {
              if (key === 'startAt') setDecisionAt(value);
            }}
            onTimezoneChange={setDecisionTz}
            showEndDate={false}
            triggerLabel="Select a date"
          />
        </div>

        {/* ── Open roles ── */}
        <div className={styles.section}>
          <RoleDraftSection roles={roles} onChange={setRoles} />
        </div>

        {/* ── How it works ── */}
        <div className={styles.infoBox}>
          <InfoCircle className={styles.infoBoxIcon} aria-hidden />
          <span>
            No one is charged now. Cards are authorized. If the threshold is met by the decision date,
            everyone who pledged is charged and the event is confirmed. If not, all authorizations are
            released.
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            className={styles.cancelButton}
            onClick={submit}
            disabled={isSubmitting}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            className={styles.submitButton}
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSymbol size="small" />
                Posting...
              </>
            ) : (
              'Post interest check'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterestCheckForm;
