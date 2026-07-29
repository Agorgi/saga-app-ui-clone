import { NumberInput } from '@components/NumberInput/NumberInput';
import { Plus, Trash01 } from '@untitledui/icons';
import type { InterestCheckRole } from '../../interestCheck/types';
import styles from './RoleDraftSection.module.scss';

function generateRoleId(): string {
  return `role_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

interface Props {
  readonly roles: InterestCheckRole[];
  readonly onChange: (roles: InterestCheckRole[]) => void;
}

// Wireframe: open-role rows for an interest check, modeled on the Add Ticket Type
// repeating-row pattern. Each row is a role (name, optional count, optional note).
// Local state only; people apply to these on the detail view.
export function RoleDraftSection({ roles, onChange }: Props) {
  const update = (id: string, patch: Partial<InterestCheckRole>) => {
    onChange(roles.map((role) => (role.id === id ? { ...role, ...patch } : role)));
  };

  const add = () => {
    onChange([...roles, { id: generateRoleId(), name: '' }]);
  };

  const remove = (id: string) => {
    onChange(roles.filter((role) => role.id !== id));
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Open roles</h2>
      <p className={styles.hint}>People can apply to help. Optional.</p>

      {roles.length > 0 && (
        <div className={styles.rows}>
          {roles.map((role) => (
            <div key={role.id} className={styles.row}>
              <input
                type="text"
                className={styles.nameInput}
                placeholder="Role (e.g. Photographer)"
                value={role.name}
                onChange={(e) => update(role.id, { name: e.target.value })}
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
    </div>
  );
}
