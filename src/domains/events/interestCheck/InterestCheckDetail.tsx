import { Button } from '@saga/global-web';
import { Calendar, CheckCircle, InfoCircle, Users01, XCircle } from '@untitledui/icons';
import { useState } from 'react';
import {
  committedCents,
  daysUntil,
  formatCents,
  formatDateLabel,
  interestedCount,
  leadingDateId,
  statusLabel,
  thresholdProgress,
} from './format';
import styles from './InterestCheckDetail.module.scss';
import type { InterestCheck, InterestCheckPledge } from './types';

// The current viewer, for the demo. Reserving / applying acts as this person.
const ME = 'You';

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

interface Props {
  readonly initial: InterestCheck;
}

// Wireframe: the Interest Check detail view, replicating the commission drawer's
// status + progress pattern (not importing it). All lifecycle behavior is local state:
// reserve authorizes (never charges), demo controls flip OPEN / CONFIRMED / CANCELLED,
// and confirming a multi-date check charges winning-date pledgers and releases the rest
// with a one-tap re-commit. No backend, no payments.
export function InterestCheckDetail({ initial }: Props) {
  const [ic, setIc] = useState<InterestCheck>(initial);
  const [selectedDates, setSelectedDates] = useState<string[]>(
    initial.proposedDates.length === 1 ? [initial.proposedDates[0]?.id ?? ''] : [],
  );

  const isMulti = ic.proposedDates.length > 1;
  const progress = thresholdProgress(ic);
  const interested = interestedCount(ic);
  const committed = committedCents(ic);
  const days = daysUntil(ic.decisionDate);
  const myPledge = ic.pledges.find((p) => p.userName === ME);
  const priceLabel = formatCents(ic.ticketPriceCents);
  const thresholdLabel =
    ic.threshold.unit === 'people'
      ? `${ic.threshold.value} people`
      : formatCents(ic.threshold.value * 100);
  const winningDate = ic.winningDateId
    ? ic.proposedDates.find((d) => d.id === ic.winningDateId)
    : undefined;
  const myReleased = ic.status === 'confirmed' && myPledge?.state === 'released';

  const reserve = () => {
    if (myPledge) return;
    const dateChoice = isMulti ? selectedDates : ic.proposedDates.map((d) => d.id);
    const pledge: InterestCheckPledge = {
      id: genId('icp'),
      userName: ME,
      dateChoice,
      authorizedAmountCents: ic.ticketPriceCents,
      state: 'authorized',
    };
    setIc((prev) => ({ ...prev, pledges: [...prev.pledges, pledge] }));
  };

  const markConfirmed = () => {
    setIc((prev) => {
      const winning = isMulti ? leadingDateId(prev) : prev.proposedDates[0]?.id;
      return {
        ...prev,
        status: 'confirmed',
        winningDateId: winning,
        pledges: prev.pledges.map((p) => ({
          ...p,
          state:
            !winning || p.dateChoice.length === 0 || p.dateChoice.includes(winning)
              ? 'charged'
              : 'released',
        })),
      };
    });
  };

  const markCancelled = () => {
    setIc((prev) => ({
      ...prev,
      status: 'cancelled',
      winningDateId: undefined,
      pledges: prev.pledges.map((p) => ({ ...p, state: 'released' })),
    }));
  };

  const resetOpen = () => {
    setIc((prev) => ({
      ...prev,
      status: 'open',
      winningDateId: undefined,
      pledges: prev.pledges.map((p) => ({ ...p, state: 'authorized' })),
    }));
  };

  const recommit = () => {
    setIc((prev) => {
      if (!prev.winningDateId) return prev;
      const winningId = prev.winningDateId;
      return {
        ...prev,
        pledges: prev.pledges.map((p) =>
          p.userName === ME ? { ...p, dateChoice: [winningId], state: 'charged' } : p,
        ),
      };
    });
  };

  const apply = (roleId: string) => {
    setIc((prev) => {
      if (prev.applications.some((a) => a.roleId === roleId && a.userName === ME)) return prev;
      return {
        ...prev,
        applications: [
          ...prev.applications,
          { id: genId('ica'), roleId, userName: ME, state: 'pending' },
        ],
      };
    });
  };

  const toggleDate = (id: string) => {
    setSelectedDates((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className={styles.page}>
      <div className={styles.sheet}>
        <div className={styles.hero}>
          <div className={styles.heroGradient} />
          <span className={`${styles.badge} ${styles[`badge--${ic.status}`]}`}>
            {statusLabel(ic.status)}
          </span>
          <h1 className={styles.title}>{ic.title}</h1>
        </div>

        <div className={styles.statusRow}>
          <span>
            {interested} {ic.status === 'cancelled' ? 'were interested' : 'interested'}
          </span>
          <span className={styles.dot} aria-hidden>
            ·
          </span>
          <span>
            {ic.status === 'open'
              ? `${formatCents(committed)} committed (held, not charged)`
              : ic.status === 'confirmed'
                ? `${formatCents(committed)} charged`
                : 'authorizations released'}
          </span>
          {ic.status === 'open' && (
            <>
              <span className={styles.dot} aria-hidden>
                ·
              </span>
              <span>decides in {days}d</span>
            </>
          )}
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressTrack} aria-hidden>
            <div className={styles.progressFill} style={{ width: `${progress.pct}%` }} />
          </div>
          <p className={styles.progressLabel}>Threshold progress: {progress.label}</p>
        </div>

        {ic.location && <p className={styles.meta}>{ic.location}</p>}
        {ic.description && <p className={styles.desc}>{ic.description}</p>}

        {ic.status === 'open' && (
          <div className={styles.commitCard}>
            {isMulti ? (
              <div className={styles.dateSelect}>
                <p className={styles.dateSelectLabel}>
                  Pick the date(s) you can make. You're only charged for the winning date.
                </p>
                {ic.proposedDates.map((d) => {
                  const checked = selectedDates.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className={`${styles.dateOption} ${checked ? styles.dateOptionActive : ''}`}
                    >
                      <input
                        type="checkbox"
                        className={styles.dateCheckbox}
                        checked={checked}
                        disabled={Boolean(myPledge)}
                        onChange={() => toggleDate(d.id)}
                      />
                      <Calendar width={15} height={15} aria-hidden />
                      {formatDateLabel(d.at)}
                    </label>
                  );
                })}
              </div>
            ) : (
              ic.proposedDates[0] && (
                <p className={styles.singleDate}>
                  <Calendar width={15} height={15} aria-hidden />
                  {formatDateLabel(ic.proposedDates[0].at)}
                </p>
              )
            )}

            {myPledge ? (
              <div className={styles.reservedNote}>
                <CheckCircle width={16} height={16} aria-hidden />
                You're in. Your card is authorized for {priceLabel}, not charged.
              </div>
            ) : (
              <Button
                type="button"
                className={styles.reserveBtn}
                onClick={reserve}
                disabled={isMulti && selectedDates.length === 0}
              >
                Reserve, authorize {priceLabel}
              </Button>
            )}
            <p className={styles.reassure}>
              You won't be charged unless {thresholdLabel} is reached. Your card is authorized, not
              charged.
            </p>
          </div>
        )}

        {ic.status === 'confirmed' && (
          <div className={`${styles.banner} ${styles.bannerConfirmed}`}>
            <CheckCircle width={18} height={18} aria-hidden />
            <div>
              <strong>Confirmed.</strong>{' '}
              {winningDate ? `Winning date: ${formatDateLabel(winningDate.at)}. ` : ''}
              Pledgers on the winning date were charged {priceLabel}.
              {isMulti ? ' Pledgers on other dates were released.' : ''}
            </div>
          </div>
        )}

        {myReleased && (
          <div className={styles.recommitCard}>
            <p className={styles.recommitText}>
              Your date didn't win, so your authorization was released.
            </p>
            <Button type="button" className={styles.reserveBtn} onClick={recommit}>
              Re-commit for {winningDate ? formatDateLabel(winningDate.at) : 'the winning date'}, same
              price
            </Button>
          </div>
        )}

        {ic.status === 'cancelled' && (
          <div className={`${styles.banner} ${styles.bannerCancelled}`}>
            <XCircle width={18} height={18} aria-hidden />
            <div>
              <strong>Cancelled.</strong> The threshold wasn't met by the decision date. All
              authorizations were released, and no one was charged.
            </div>
          </div>
        )}

        {ic.roles.length > 0 && (
          <div className={styles.rolesBlock}>
            <h2 className={styles.rolesTitle}>
              <Users01 width={16} height={16} aria-hidden />
              Open roles
            </h2>
            <div className={styles.rolesList}>
              {ic.roles.map((role) => {
                const myApp = ic.applications.find(
                  (a) => a.roleId === role.id && a.userName === ME,
                );
                return (
                  <div key={role.id} className={styles.roleRow}>
                    <div className={styles.roleInfo}>
                      <span className={styles.roleName}>
                        {role.name}
                        {role.count ? ` · ${role.count} needed` : ''}
                      </span>
                      {role.note && <span className={styles.roleNote}>{role.note}</span>}
                    </div>
                    {myApp ? (
                      <span className={styles.applied}>Applied · pending</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.applyBtn}
                        onClick={() => apply(role.id)}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.infoBox}>
          <InfoCircle className={styles.infoBoxIcon} aria-hidden />
          <span>
            No one is charged now. Cards are authorized. If the threshold is met by the decision
            date, everyone who pledged is charged and the event is confirmed. If not, all
            authorizations are released.
          </span>
        </div>

        <div className={styles.demoControls}>
          <span className={styles.demoLabel}>Demo: flip the lifecycle (front-end state only)</span>
          <div className={styles.demoButtons}>
            <button
              type="button"
              className={styles.demoBtn}
              onClick={resetOpen}
              disabled={ic.status === 'open'}
            >
              Open
            </button>
            <button
              type="button"
              className={styles.demoBtn}
              onClick={markConfirmed}
              disabled={ic.status === 'confirmed'}
            >
              Mark confirmed
            </button>
            <button
              type="button"
              className={styles.demoBtn}
              onClick={markCancelled}
              disabled={ic.status === 'cancelled'}
            >
              Mark cancelled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
