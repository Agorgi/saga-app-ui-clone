import { BaseModal, Button } from '@saga/global-web';
import { ChevronRight, Users01 } from '@untitledui/icons';
import { useState } from 'react';
import { OpenRolesSection } from './OpenRolesSection';
import type { OpenRole } from './types';
import styles from './OpenRolesField.module.scss';

interface Props {
  readonly roles: OpenRole[];
  readonly onChange: (roles: OpenRole[]) => void;
  readonly openToApplications: boolean;
  readonly onOpenToApplicationsChange: (value: boolean) => void;
}

// Wireframe: host-side Open Roles entry on the create form. Collapsed to a single
// button that opens a popup holding the role authoring UI, so the form stays
// uncluttered (like the Link / Dress code extras). The roles + toggle state is
// lifted to the form; this only owns the popup open/close.
export function OpenRolesField({
  roles,
  onChange,
  openToApplications,
  onOpenToApplicationsChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const namedCount = roles.filter((r) => r.title.trim().length > 0).length;
  const summary =
    namedCount > 0
      ? `${namedCount} role${namedCount === 1 ? '' : 's'}${openToApplications ? ', open to crew' : ''}`
      : openToApplications
        ? 'Open to crew applications'
        : 'Add roles people can apply to help with';

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.triggerIcon}>
          <Users01 width={20} height={20} aria-hidden />
        </span>
        <span className={styles.triggerText}>
          <span className={styles.triggerLabel}>Open roles</span>
          <span className={styles.triggerSummary}>{summary}</span>
        </span>
        <ChevronRight width={18} height={18} aria-hidden className={styles.triggerChevron} />
      </button>

      <BaseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="Open roles"
        className={styles.modal}
      >
        <div className={styles.modalBody}>
          <OpenRolesSection
            roles={roles}
            onChange={onChange}
            openToApplications={openToApplications}
            onOpenToApplicationsChange={onOpenToApplicationsChange}
          />
          <div className={styles.modalActions}>
            <Button type="button" className={styles.doneButton} onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
