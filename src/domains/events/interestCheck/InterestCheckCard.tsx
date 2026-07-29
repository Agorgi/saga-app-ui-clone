import { Link } from 'react-router-dom';
import {
  committedCents,
  daysUntil,
  formatCents,
  interestedCount,
  statusLabel,
  thresholdProgress,
} from './format';
import styles from './InterestCheckCard.module.scss';
import type { InterestCheck } from './types';

interface Props {
  readonly interestCheck: InterestCheck;
}

// Compact card for the events list. Replicates the commission card's status + progress
// visual (gradient hero, status badge, progress bar) without importing it. Links to the
// detail view. Wireframe only.
export function InterestCheckCard({ interestCheck: ic }: Props) {
  const interested = interestedCount(ic);
  const committed = committedCents(ic);
  const progress = thresholdProgress(ic);
  const days = daysUntil(ic.decisionDate);

  let stat: string;
  if (ic.status === 'open') {
    stat = `${interested} interested · ${formatCents(committed)} committed · decides in ${days}d`;
  } else if (ic.status === 'confirmed') {
    stat = `${interested} backers · ${formatCents(committed)} charged`;
  } else if (ic.status === 'cancelled') {
    stat = `${interested} were interested · threshold not met`;
  } else {
    stat = 'Draft';
  }

  const note =
    ic.status === 'open'
      ? 'Held, not charged'
      : ic.status === 'confirmed'
        ? 'Charged on confirmation'
        : ic.status === 'cancelled'
          ? 'Authorizations released'
          : 'Not posted yet';

  return (
    <Link to={`/events/interest-check/${ic.id}`} className={styles.card}>
      <div className={styles.hero}>
        <div className={styles.heroGradient} />
        <span className={`${styles.badge} ${styles[`badge--${ic.status}`]}`}>
          {statusLabel(ic.status)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{ic.title}</h3>
        <p className={styles.statRow}>{stat}</p>
        <div className={styles.progressTrack} aria-hidden>
          <div className={styles.progressFill} style={{ width: `${progress.pct}%` }} />
        </div>
        <p className={styles.held}>{note}</p>
      </div>
    </Link>
  );
}
