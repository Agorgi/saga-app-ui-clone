import { BaseModal, Button } from '@saga/global-web';
import { Check, Plus, Users01 } from '@untitledui/icons';
import { useState } from 'react';
import type { OpenRole } from './types';
import styles from './OpenRolesDisplay.module.scss';

interface Props {
  readonly roles: OpenRole[];
  readonly openToApplications: boolean;
  readonly eventName: string;
}

type ApplyTarget = { kind: 'role'; role: OpenRole } | { kind: 'general' };

// Wireframe: applicant-facing Open Roles on the event page. Lists the roles the
// host needs, each with an Apply button, plus a general "Ask to join the crew"
// when the host is open to applications. Applying opens a one-message modal;
// sending is inert and flips the control to an applied state (local only).
export function OpenRolesDisplay({ roles, openToApplications, eventName }: Props) {
  const [target, setTarget] = useState<ApplyTarget | null>(null);
  const [message, setMessage] = useState('');
  const [appliedRoleIds, setAppliedRoleIds] = useState<Set<string>>(() => new Set());
  const [generalApplied, setGeneralApplied] = useState(false);

  if (roles.length === 0 && !openToApplications) return null;

  const openApply = (next: ApplyTarget) => {
    setMessage('');
    setTarget(next);
  };

  const submit = () => {
    if (!target) return;
    if (target.kind === 'role') {
      setAppliedRoleIds((prev) => new Set(prev).add(target.role.id));
    } else {
      setGeneralApplied(true);
    }
    setTarget(null);
  };

  const heading = roles.length > 0 ? 'Roles needed' : 'Join the crew';

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>{heading}</h2>
      <p className={styles.subhead}>Help produce {eventName}. Apply with a quick message.</p>

      {roles.length > 0 && (
        <ul className={styles.list}>
          {roles.map((role) => {
            const applied = appliedRoleIds.has(role.id);
            return (
              <li key={role.id} className={styles.roleRow}>
                <div className={styles.roleInfo}>
                  <span className={styles.roleTitle}>
                    {role.title}
                    {role.count && role.count > 1 ? (
                      <span className={styles.roleCount}>{role.count} needed</span>
                    ) : null}
                  </span>
                  {role.note ? <span className={styles.roleNote}>{role.note}</span> : null}
                </div>
                {applied ? (
                  <span className={styles.appliedPill}>
                    <Check width={15} height={15} aria-hidden />
                    Applied
                  </span>
                ) : (
                  <Button
                    type="button"
                    className={styles.applyButton}
                    onClick={() => openApply({ kind: 'role', role })}
                  >
                    Apply
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {openToApplications && (
        <div className={styles.generalCard}>
          <span className={styles.generalIcon}>
            <Users01 width={20} height={20} aria-hidden />
          </span>
          <div className={styles.generalText}>
            <span className={styles.generalTitle}>Open to crew</span>
            <span className={styles.generalSub}>
              No role that fits? Ask to join and the host can keep you in mind.
            </span>
          </div>
          {generalApplied ? (
            <span className={styles.appliedPill}>
              <Check width={15} height={15} aria-hidden />
              Request sent
            </span>
          ) : (
            <Button
              type="button"
              className={styles.applyButton}
              onClick={() => openApply({ kind: 'general' })}
            >
              <Plus width={15} height={15} aria-hidden />
              Ask to join
            </Button>
          )}
        </div>
      )}

      <BaseModal
        isOpen={target !== null}
        onClose={() => setTarget(null)}
        ariaLabel="Apply to help"
        className={styles.modal}
      >
        <div className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            {target?.kind === 'role'
              ? `Apply for ${target.role.title}`
              : `Ask to join ${eventName}`}
          </h3>
          <p className={styles.modalHint}>
            Add a short message so the host knows why you'd be a great fit.
          </p>
          <textarea
            className={styles.modalTextarea}
            placeholder="Hi! I'd love to help. Here's a bit about me..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            aria-label="Application message"
          />
          <div className={styles.modalActions}>
            <Button type="button" className={styles.modalCancel} onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              className={styles.modalSend}
              onClick={submit}
              disabled={message.trim().length === 0}
            >
              Send application
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
