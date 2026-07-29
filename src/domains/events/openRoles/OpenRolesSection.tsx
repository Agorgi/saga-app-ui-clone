import { NumberInput } from '@components/NumberInput/NumberInput';
import { Plus, Trash01 } from '@untitledui/icons';
import { generateRoleId, type OpenRole } from './types';
import styles from './OpenRolesSection.module.scss';

interface Props {
  readonly roles: OpenRole[];
  readonly onChange: (roles: OpenRole[]) => void;
  readonly openToApplications: boolean;
  readonly onOpenToApplicationsChange: (value: boolean) => void;
}

// Wireframe: host-side authoring for Open Roles on an event. Lists the roles a
// host needs filled (title, optional headcount, optional note) plus a single
// "Open to crew applications" switch so an event with no specific roles can
// still take general requests. Local state only; people apply on the event page.
export function OpenRolesSection({
  roles,
  onChange,
  openToApplications,
  onOpenToApplicationsChange,
}: Props) {
  const update = (id: string, patch: Partial<OpenRole>) => {
    onChange(roles.map((role) => (role.id === id ? { ...role, ...patch } : role)));
  };
  const add = () => onChange([...roles, { id: generateRoleId(), title: '' }]);
  const remove = (id: string) => onChange(roles.filter((role) => role.id !== id));

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Open roles</h2>
      <p className={styles.hint}>
        List the roles you need to help produce this. People apply with a short message. Optional.
      </p>

      {roles.length > 0 && (
        <div className={styles.rows}>
          {roles.map((role) => (
            <div key={role.id} className={styles.row}>
              <input
                type="text"
                className={styles.nameInput}
                placeholder="Role (e.g. Photographer)"
                value={role.title}
                onChange={(e) => update(role.id, { title: e.target.value })}
                aria-label="Role title"
              />
              <div className={styles.countWrap}>
                <NumberInput
                  min={1}
                  placeholder="Count"
                  value={role.count === undefined ? '' : String(role.count)}
                  onChange={(v) => {
                    const n = Number.parseInt(v, 10);
                    update(role.id, { count: Number.isNaN(n) ? undefined : n });
                  }}
                />
              </div>
              <input
                type="text"
                className={styles.noteInput}
                placeholder="Note (optional)"
                value={role.note ?? ''}
                onChange={(e) => update(role.id, { note: e.target.value })}
                aria-label="Role note"
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(role.id)}
                aria-label="Remove role"
              >
                <Trash01 width={16} height={16} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={styles.addBtn} onClick={add}>
        <Plus width={16} height={16} aria-hidden />
        Add role
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={openToApplications}
        className={`${styles.toggle} ${openToApplications ? styles.toggleOn : ''}`}
        onClick={() => onOpenToApplicationsChange(!openToApplications)}
      >
        <span className={styles.toggleTrack}>
          <span className={styles.toggleKnob} />
        </span>
        <span className={styles.toggleText}>
          <span className={styles.toggleLabel}>Open to crew applications</span>
          <span className={styles.toggleHelp}>
            Let people ask to join your team, even if you haven't listed a specific role.
          </span>
        </span>
      </button>
    </div>
  );
}
