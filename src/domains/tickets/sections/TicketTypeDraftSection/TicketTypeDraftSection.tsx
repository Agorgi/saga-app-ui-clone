import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';
import { NumberInput } from '@components/NumberInput/NumberInput';
import { useCallback, useId, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { formatTicketPrice } from '../../utils/formatTicketPrice';
import styles from '../TicketTypesManagement/TicketTypesManagement.module.scss';

// Wireframe clone: copied near-verbatim from the source. Ticket drafts are
// staged entirely in client state — the parent flushes them to the API after
// the event is created (no API here). The only deviation: the source formats
// the event-end clamp (`maxAt`) with date-fns-tz; the clone has no date-fns-tz,
// so it formats in browser-local time.

/**
 * Locally-staged ticket type, used during event creation before the event exists.
 * After the event is created, each draft would become a ticket-type POST.
 */
export interface TicketTypeDraft {
  /** Client-only id for list keys + edit/delete before any server id exists. */
  localId: string;
  name: string;
  description?: string;
  priceCents: number;
  totalQuantity: number;
  maxPerUser?: number;
}

/** Sales window shared across all draft ticket types (matches the live editor's behavior). */
export interface SalesWindow {
  startAt: string;
  endAt: string;
  timezone: string;
}

interface FormValues {
  name: string;
  description: string;
  /** Dollar/cent value as entered by the user (e.g. "9.99"). Converted to cents on save. */
  priceDollars: string;
  totalQuantity: string;
  maxPerUser: string;
}

const EMPTY_FORM: FormValues = {
  name: '',
  description: '',
  priceDollars: '0.00',
  totalQuantity: '100',
  maxPerUser: '10',
};

function draftToForm(draft: TicketTypeDraft): FormValues {
  return {
    name: draft.name,
    description: draft.description ?? '',
    priceDollars: (draft.priceCents / 100).toFixed(2),
    totalQuantity: String(draft.totalQuantity),
    maxPerUser: draft.maxPerUser === undefined ? '' : String(draft.maxPerUser),
  };
}

function generateLocalId(): string {
  return `draft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Format a Date as a datetime-local string ("yyyy-MM-ddTHH:mm") in browser-local time. */
function formatLocalDateTime(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
  readonly drafts: TicketTypeDraft[];
  readonly onChange: (drafts: TicketTypeDraft[]) => void;
  readonly salesWindow: SalesWindow;
  readonly onSalesWindowChange: (window: SalesWindow) => void;
  /** When provided, the sales window picker disallows dates after the event ends. */
  readonly eventEndAt?: Date;
}

/**
 * Stages ticket types locally during event creation.
 */
export function TicketTypeDraftSection({
  drafts,
  onChange,
  salesWindow,
  onSalesWindowChange,
  eventEndAt,
}: Props) {
  const formId = useId();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | undefined>(undefined);

  const openCreate = () => {
    setPendingDeleteId(undefined);
    setEditingId(undefined);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (draft: TicketTypeDraft) => {
    setPendingDeleteId(undefined);
    setEditingId(draft.localId);
    setForm(draftToForm(draft));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(undefined);
    setForm(EMPTY_FORM);
  };

  const handleFieldChange = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const name = form.name.trim();
    if (!name) {
      toast.error('Name is required');
      return;
    }
    const priceCents = Math.round(Number.parseFloat(form.priceDollars) * 100);
    const totalQuantity = Number.parseInt(form.totalQuantity, 10);
    const parsedMax = Number.parseInt(form.maxPerUser, 10);
    const maxPerUser = Number.isNaN(parsedMax) ? undefined : parsedMax;

    if (Number.isNaN(priceCents) || priceCents < 0) {
      toast.error('Price must be 0 or greater');
      return;
    }
    if (Number.isNaN(totalQuantity) || totalQuantity <= 0) {
      toast.error('Total quantity must be at least 1');
      return;
    }
    if (maxPerUser !== undefined && maxPerUser <= 0) {
      toast.error('Max per user must be at least 1');
      return;
    }

    if (salesWindow.startAt && salesWindow.endAt && salesWindow.endAt <= salesWindow.startAt) {
      toast.error('Sales end date must be after sales start date');
      return;
    }

    const draft: TicketTypeDraft = {
      localId: editingId ?? generateLocalId(),
      name,
      description: form.description.trim() || undefined,
      priceCents,
      totalQuantity,
      maxPerUser,
    };

    if (editingId) {
      onChange(drafts.map((d) => (d.localId === editingId ? draft : d)));
    } else {
      onChange([...drafts, draft]);
    }
    closeForm();
  };

  const handleSalesChange = useCallback(
    (key: 'startAt' | 'endAt', value: string) => {
      onSalesWindowChange({ ...salesWindow, [key]: value });
    },
    [salesWindow, onSalesWindowChange],
  );

  const handleTimezoneChange = useCallback(
    (timezone: string) => {
      onSalesWindowChange({ ...salesWindow, timezone });
    },
    [salesWindow, onSalesWindowChange],
  );

  const handleDeleteConfirm = (localId: string) => {
    onChange(drafts.filter((d) => d.localId !== localId));
    setPendingDeleteId(undefined);
  };

  // Express the event's end-instant as a datetime-local string the picker can
  // clamp to. The source does this in the sales-window timezone via date-fns-tz;
  // the wireframe formats in browser-local time instead.
  const maxAt = useMemo(
    () => (eventEndAt ? formatLocalDateTime(eventEndAt) : undefined),
    [eventEndAt],
  );

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Tickets</h2>
        {!showForm && (
          <button type="button" className={styles.addButton} onClick={openCreate}>
            + Add Ticket Type
          </button>
        )}
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>Ticket sales window</legend>
        <DateTimePicker
          startAt={salesWindow.startAt}
          endAt={salesWindow.endAt}
          timezone={salesWindow.timezone}
          onChange={handleSalesChange}
          onTimezoneChange={handleTimezoneChange}
          maxAt={maxAt}
        />
      </fieldset>

      {showForm && (
        <div className={styles.form}>
          <h3 className={styles.formTitle}>{editingId ? 'Edit Ticket Type' : 'New Ticket Type'}</h3>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-name`}>
              Name
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              className={styles.input}
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. General Admission"
              maxLength={100}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-desc`}>
              Description
            </label>
            <textarea
              id={`${formId}-desc`}
              className={styles.textarea}
              value={form.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Optional"
              rows={3}
              maxLength={500}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-price`}>
                Price
              </label>
              <NumberInput
                id={`${formId}-price`}
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.priceDollars}
                onChange={(v) => handleFieldChange('priceDollars', v)}
                showChevrons={false}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-qty`}>
                Total Quantity
              </label>
              <NumberInput
                id={`${formId}-qty`}
                min={1}
                value={form.totalQuantity}
                onChange={(v) => handleFieldChange('totalQuantity', v)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-max`}>
                Max Per User
              </label>
              <NumberInput
                id={`${formId}-max`}
                min={1}
                value={form.maxPerUser}
                onChange={(v) => handleFieldChange('maxPerUser', v)}
              />
            </div>
          </div>
          <div className={styles.formFooter}>
            <button type="button" className={styles.cancelButton} onClick={closeForm}>
              Cancel
            </button>
            <button type="button" className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}

      {drafts.length === 0 ? (
        <p className={styles.empty}>No ticket types yet. Add one above.</p>
      ) : (
        <div className={styles.typeList}>
          {drafts.map((draft) => (
            <div key={draft.localId} className={styles.typeRow}>
              <div className={styles.typeInfo}>
                <p className={styles.typeName}>{draft.name}</p>
                <p className={styles.typeMeta}>
                  {formatTicketPrice(draft.priceCents, 'usd')} · {draft.totalQuantity} available
                </p>
              </div>
              <div className={styles.typeActions}>
                {pendingDeleteId === draft.localId ? (
                  <>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeleteConfirm(draft.localId)}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setPendingDeleteId(undefined)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => openEdit(draft)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => setPendingDeleteId(draft.localId)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
