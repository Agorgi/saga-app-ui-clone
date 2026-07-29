import { PollOptionsEditor } from '@domains/crowd-commissions/ui/Poll';

import { FieldError } from '../WizardComponents';
import { POLL_CAPTION_MAX_CHARS } from '../wizardConstants';
import type { BasicsForm } from '../wizardTypes';

interface PollOptionsSectionProps {
  readonly values: Pick<BasicsForm, 'pollOptions' | 'pollCaption'>;
  readonly onChange: <K extends keyof BasicsForm>(key: K, value: BasicsForm[K]) => void;
  readonly errors: Partial<Record<string, string>>;
  readonly styles: Record<string, string>;
  readonly captionId: string;
}

/**
 * Poll options and caption section for Poll commissions.
 *
 * Renders the poll options editor (2–5 options with optional images)
 * and the optional caption field. Only shown when commissionType === 'poll'.
 */
export function PollOptionsSection({
  values,
  onChange,
  errors,
  styles,
  captionId,
}: PollOptionsSectionProps) {
  const captionRemaining = POLL_CAPTION_MAX_CHARS - values.pollCaption.length;

  return (
    <>
      <div className={styles.formGroup}>
        <p className={styles.label}>
          Poll options <span className={styles.required}>*</span>
        </p>
        <p className={styles.hint}>2–5 options. Add an image to each option (optional).</p>
        <PollOptionsEditor
          options={values.pollOptions}
          onChange={(opts) => onChange('pollOptions', opts)}
          errors={errors as Record<string, string>}
        />
        <FieldError message={errors.pollOptions} styles={styles} />
      </div>

      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor={captionId}>
            Caption
          </label>
          <span className={captionRemaining < 30 ? styles.charCountWarn : styles.charCount}>
            {captionRemaining} left
          </span>
        </div>
        <p className={styles.hint}>
          A short line shown under the title — give voters more context. Optional.
        </p>
        <textarea
          id={captionId}
          className={styles.input}
          placeholder="e.g. Vote for what I draw next — top option wins!"
          maxLength={POLL_CAPTION_MAX_CHARS}
          rows={3}
          style={{ resize: 'none' }}
          value={values.pollCaption}
          onChange={(e) => onChange('pollCaption', e.target.value)}
        />
      </div>
    </>
  );
}
