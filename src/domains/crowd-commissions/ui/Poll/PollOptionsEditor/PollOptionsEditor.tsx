import { constants } from '@saga/config-web';
import { Image01, Plus, Trash03 } from '@untitledui/icons';
import { useRef } from 'react';
import styles from './PollOptionsEditor.module.scss';

export interface PollOptionFormValue {
  /** Stable client-side id for React keying — not sent to the backend */
  id?: string;
  text: string;
  imageDataUrl: string;
  displayOrder: number;
}

interface PollOptionsEditorProps {
  readonly options: PollOptionFormValue[];
  readonly onChange: (options: PollOptionFormValue[]) => void;
  readonly errors?: Record<string, string>;
}

export function PollOptionsEditor({ options, onChange, errors = {} }: PollOptionsEditorProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTextChange = (index: number, text: string) => {
    const next = options.map((opt, i) => (i === index ? { ...opt, text } : opt));
    onChange(next);
  };

  const handleImageSelect = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const next = options.map((opt, i) => (i === index ? { ...opt, imageDataUrl: dataUrl } : opt));
      onChange(next);
    };
    reader.readAsDataURL(file);
  };

  const addOption = () => {
    if (options.length >= constants.crowdCommissions.pollOptionsMax) return;
    onChange([
      ...options,
      { id: crypto.randomUUID(), text: '', imageDataUrl: '', displayOrder: options.length },
    ]);
  };

  const removeOption = (index: number) => {
    if (options.length <= constants.crowdCommissions.pollOptionsMin) return;
    const next = options
      .filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, displayOrder: i }));
    onChange(next);
  };

  return (
    <div className={styles.editor}>
      {options.map((opt, idx) => {
        const remaining = constants.crowdCommissions.pollOptionMaxChars - opt.text.length;
        const errorKey = `pollOption_${idx}`;
        const error = errors[errorKey];
        const isRemoveDisabled = options.length <= constants.crowdCommissions.pollOptionsMin;

        const rowClass = [styles.optionRow, error ? styles['optionRow--error'] : '']
          .filter(Boolean)
          .join(' ');

        return (
          <div key={opt.id ?? String(opt.displayOrder)} className={styles.optionWrap}>
            {/* Pill container */}
            <div className={rowClass}>
              {/* Number badge */}
              <span
                className={[styles.badge, error ? styles['badge--error'] : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              >
                {idx + 1}
              </span>

              {/* Image slot */}
              <button
                type="button"
                className={[styles.imageSlot, opt.imageDataUrl ? styles['imageSlot--filled'] : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => fileInputRefs.current[idx]?.click()}
                aria-label={opt.imageDataUrl ? 'Change option image' : 'Add option image'}
                title={opt.imageDataUrl ? 'Change option image' : 'Add option image'}
              >
                {opt.imageDataUrl ? (
                  <>
                    <img src={opt.imageDataUrl} alt="" aria-hidden="true" />
                    <span className={styles.imageSlotOverlay} aria-hidden="true">
                      <Image01 width={14} height={14} aria-hidden="true" />
                    </span>
                  </>
                ) : (
                  <Image01
                    className={styles.imageSlotIcon}
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                )}
              </button>

              <input
                ref={(el) => {
                  fileInputRefs.current[idx] = el;
                }}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className={styles.hiddenInput}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(idx, file);
                  e.target.value = '';
                }}
                aria-hidden="true"
                tabIndex={-1}
              />

              {/* Text input — borderless inside pill */}
              <input
                type="text"
                className={[styles.textInput, error ? styles['textInput--error'] : '']
                  .filter(Boolean)
                  .join(' ')}
                placeholder={`Option ${idx + 1}`}
                maxLength={constants.crowdCommissions.pollOptionMaxChars}
                value={opt.text}
                onChange={(e) => handleTextChange(idx, e.target.value)}
                aria-label={`Poll option ${idx + 1}`}
                aria-invalid={!!error}
              />

              {/* Character count */}
              <span
                className={[styles.charCount, remaining < 20 ? styles['charCount--warn'] : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-live="polite"
              >
                {remaining}
              </span>

              {/* Remove button */}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeOption(idx)}
                disabled={isRemoveDisabled}
                aria-label={`Remove option ${idx + 1}`}
              >
                <Trash03 width={14} height={14} aria-hidden="true" />
              </button>
            </div>

            {/* Error sits outside the pill so the capsule silhouette stays clean */}
            {error && (
              <span className={styles.fieldError} role="alert">
                {error}
              </span>
            )}
          </div>
        );
      })}

      {options.length < constants.crowdCommissions.pollOptionsMax && (
        <button
          type="button"
          className={styles.addButton}
          onClick={addOption}
          aria-label="Add poll option"
        >
          <Plus width={14} height={14} aria-hidden="true" />
          Add option
        </button>
      )}
    </div>
  );
}
