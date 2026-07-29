import { type WireApplicant, wireGeneralApplicants, wireRoleApplicants } from '@/data/fixtures';
import { Check, MessageCircle01, UserPlus01 } from '@untitledui/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrew } from './CrewContext';
import type { OpenRole } from './types';
import styles from './ApplicantsReview.module.scss';

interface Props {
  readonly roles: OpenRole[];
  readonly openToApplications: boolean;
  readonly eventName: string;
}

// Wireframe: host-side review of who applied to an event's open roles. Applicants
// per role (plus general "open to crew" requests), each with Save to crew /
// Message, and a per-role Mark filled. Save to crew writes to the shared crew
// store, so saved people show up on /crew this session. Message is inert.
export function ApplicantsReview({ roles, openToApplications, eventName }: Props) {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useCrew();
  const [filledRoleIds, setFilledRoleIds] = useState<Set<string>>(() => new Set());

  const toggleFilled = (id: string) =>
    setFilledRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const general = openToApplications ? wireGeneralApplicants : [];
  const total =
    roles.reduce((n, r) => n + (wireRoleApplicants[r.id]?.length ?? 0), 0) + general.length;

  const renderApplicant = (a: WireApplicant, fromRole: string) => {
    const saved = isSaved(a.id);
    return (
      <div key={a.id} className={styles.applicant}>
        <span className={styles.avatar} aria-hidden>
          {a.name.charAt(0)}
        </span>
        <div className={styles.body}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{a.name}</span>
            <span className={styles.handle}>@{a.handle}</span>
          </div>
          <p className={styles.message}>{a.message}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
              onClick={() =>
                toggleSaved({
                  id: a.id,
                  name: a.name,
                  handle: a.handle,
                  fromRole,
                  fromEvent: eventName,
                })
              }
            >
              {saved ? (
                <Check width={14} height={14} aria-hidden />
              ) : (
                <UserPlus01 width={14} height={14} aria-hidden />
              )}
              {saved ? 'Saved to crew' : 'Save to crew'}
            </button>
            <button type="button" className={styles.msgBtn}>
              <MessageCircle01 width={14} height={14} aria-hidden />
              Message
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.review}>
      <div className={styles.head}>
        <h3 className={styles.title}>Applicants</h3>
        <span className={styles.subtle}>{total} total</span>
      </div>

      {roles.map((role) => {
        const applicants = wireRoleApplicants[role.id] ?? [];
        const filled = filledRoleIds.has(role.id);
        return (
          <div key={role.id} className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupTitle}>
                {role.title}
                <span className={styles.groupMeta}>{applicants.length} applied</span>
                {filled ? <span className={styles.filledPill}>Filled</span> : null}
              </span>
              <button
                type="button"
                className={styles.fillBtn}
                onClick={() => toggleFilled(role.id)}
              >
                {filled ? 'Reopen' : 'Mark filled'}
              </button>
            </div>
            {applicants.length > 0 ? (
              applicants.map((a) => renderApplicant(a, role.title))
            ) : (
              <p className={styles.empty}>No applicants yet.</p>
            )}
          </div>
        );
      })}

      {general.length > 0 && (
        <div className={styles.group}>
          <div className={styles.groupHead}>
            <span className={styles.groupTitle}>
              Open to crew
              <span className={styles.groupMeta}>{general.length} interested</span>
            </span>
          </div>
          {general.map((a) => renderApplicant(a, 'Open to crew'))}
        </div>
      )}

      <button type="button" className={styles.crewLink} onClick={() => navigate('/crew')}>
        View my crew
      </button>
    </div>
  );
}
