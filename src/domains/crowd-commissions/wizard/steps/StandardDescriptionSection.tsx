import Editor from '@domains/post-creation/ui/Editor/Editor';
import type { RichTextOps } from '@saga/crowd-commission-middleware';
import type Quill from 'quill';
import type { RefObject } from 'react';

import { FieldError } from '../WizardComponents';

interface StandardDescriptionSectionProps {
  readonly descriptionRef: RefObject<Quill | null>;
  readonly defaultDescription?: RichTextOps;
  readonly errors: Partial<Record<string, string>>;
  readonly styles: Record<string, string>;
  readonly descriptionId: string;
}

/**
 * Description editor section for Standard commissions.
 *
 * Renders the Quill rich-text editor and its error state.
 * Only shown when commissionType === 'standard'.
 */
export function StandardDescriptionSection({
  descriptionRef,
  defaultDescription,
  errors,
  styles,
  descriptionId,
}: StandardDescriptionSectionProps) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={descriptionId}>
        Description <span className={styles.required}>*</span>
      </label>
      <div
        id={descriptionId}
        className={[styles.editorWrapper, errors.description ? styles.inputError : '']
          .filter(Boolean)
          .join(' ')}
      >
        <Editor editorRef={descriptionRef} defaultValue={defaultDescription} />
      </div>
      <FieldError message={errors.description} styles={styles} />
    </div>
  );
}
