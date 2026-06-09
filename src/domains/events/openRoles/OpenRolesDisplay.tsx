import { BaseModal, Button } from '@saga/global-web';
import { Check, ChevronRight, Plus, Users01 } from '@untitledui/icons';
import { useState } from 'react';
import { ApplicantsReview } from './ApplicantsReview';
import type { OpenRole } from './types';
import styles from './OpenRolesDisplay.module.scss';

interface Props {
  readonly roles: OpenRole[];
  readonly openToApplications: boolean;
  readonly eventName: string;
}

type ApplyTarget = { kind: 'role'; role: OpenRole } | { kind: 'general' };

// Wireframe: Open Roles on the event page, behind a button. The popup has an
// applicant view (roles list, then a one-message apply) and a host view (who
// applied, with Save to crew / Mark filled). The Apply / Host view toggle is a
// demo affordance; in production the view is decided by event ownership. Inert.
export function OpenRolesDisplay({ roles, openToApplications, eventName }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'applicant' | 'host'>('applicant');
  const [apply, setApply] = useState<ApplyTarget | null>(null);
  const [message, setMessage] = useState('');
  const [appliedRoleIds, setAppliedRoleIds] = useState<Set<string>>(() => new Set());
  const [generalApplied, setGeneralApplied] = useState(false);

  if (roles.length === 0 && !openToApplications) return null;

  const close = () => {
    setOpen(false);
    setApply(null);
  };

  const openApply = (next: ApplyTarget) => {
    setMessage('');
    setApply(next);
  };

  const submit = () => {
    if (!apply) return;
    if (apply.kind === 'role') {
      setAppliedRoleIds((prev) => new Set(prev).add(apply.role.id));
    } else {
      setGeneralApplied(true);
    }
    setApply(null);
  };

  const triggerLabel = roles.length > 0 ? 'Open roles' : 'Open to crew';
  const heading = roles.length > 0 ? 'Roles needed' : 'Join the crew';

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <span className={styles.triggerIcon}>
          <Users01 width={20} height={20} aria-hidden />
        </span>
        <span className={styles.triggerText}>
          <span className={styles.triggerLabel}>{triggerLabel}</span>
          <span className={styles.triggerSummary}>Help produce this. Apply with a message.</span>
        </span>
        {roles.length > 0 ? <span className={styles.triggerCount}>{roles.length}</span> : null}
        <ChevronRight width={18} height={18} aria-hidden className={styles.triggerChevron} />
      </button>

      <BaseModal isOpen={open} onClose={close} ariaLabel="Open roles" className={styles.modal}>
        <div className={styles.modalBody}>
          {apply !== null ? (
            <>
              <h3 className={styles.modalTitle}>
                {apply.kind === 'role'
                  ? `Apply for ${apply.role.title}`
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
                <Button type="button" className={styles.modalCancel} onClick={() => setApply(null)}>
                  Back
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
            </>
          ) : (
            <>
              <div className={styles.modeToggle} role="tablist" aria-label="Open roles view">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'applicant'}
                  className={`${styles.modeTab} ${mode === 'applicant' ? styles.modeTabActive : ''}`}
                  onClick={() => setMode('applicant')}
                >
                  Apply
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'host'}
                  className={`${styles.modeTab} ${mode === 'host' ? styles.modeTabActive : ''}`}
                  onClick={() => setMode('host')}
                >
                  Host view
                </button>
              </div>

              {mode === 'applicant' ? (
                <>
                  <h3 className={styles.modalTitle}>{heading}</h3>
                  <p className={styles.modalHint}>
                    Help produce {eventName}. Apply with a quick message.
                  </p>

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
                              {role.note ? (
                                <span className={styles.roleNote}>{role.note}</span>
                              ) : null}
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
                </>
              ) : (
                <ApplicantsReview
                  roles={roles}
                  openToApplications={openToApplications}
                  eventName={eventName}
                />
              )}
            </>
          )}
        </div>
      </BaseModal>
    </div>
  );
}
