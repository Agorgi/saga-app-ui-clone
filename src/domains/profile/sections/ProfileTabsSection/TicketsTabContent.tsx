import { SegmentedToggle } from '@saga/global-web';
import { Ticket01 } from '@untitledui/icons';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TicketsTabContent.module.scss';

type MyTicketsFilter = 'upcoming' | 'all' | 'past' | 'cancelled';

interface EmptyStateCopy {
  title: string;
  description: string;
  showBrowseLink: boolean;
}

const EMPTY_COPY: Record<MyTicketsFilter, EmptyStateCopy> = {
  upcoming: {
    title: 'No upcoming tickets',
    description: 'Browse events and grab a ticket to see it here.',
    showBrowseLink: true,
  },
  all: {
    title: 'No tickets yet',
    description: 'Your purchased tickets will show up here.',
    showBrowseLink: true,
  },
  past: {
    title: 'No past tickets',
    description: 'Tickets from events you have attended will appear here.',
    showBrowseLink: false,
  },
  cancelled: {
    title: 'No cancelled tickets',
    description: 'Refunded or cancelled tickets will appear here.',
    showBrowseLink: false,
  },
};

// Wireframe clone: the source lists the signed-in user's purchased tickets
// (grouped by event, with a ticket-detail QR modal) behind an Upcoming / All /
// Past / Cancelled filter. The clone has no purchases, so it renders the filter
// toggle plus the source's honest per-filter empty state.
export function TicketsTabContent() {
  const [filter, setFilter] = useState<MyTicketsFilter>('upcoming');

  const filterSegments = useMemo(
    () =>
      [
        { id: 'upcoming' as const, label: 'Upcoming' },
        { id: 'all' as const, label: 'All' },
        { id: 'past' as const, label: 'Past' },
        { id: 'cancelled' as const, label: 'Cancelled' },
      ] satisfies ReadonlyArray<{ id: MyTicketsFilter; label: string }>,
    [],
  );

  const emptyState = EMPTY_COPY[filter];

  return (
    <div className={styles.container}>
      <SegmentedToggle
        segments={filterSegments}
        value={filter}
        onChange={setFilter}
        ariaLabel="Ticket filter"
        className={styles.filterToggle}
      />

      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <Ticket01 />
        </span>
        <p className={styles.emptyTitle}>{emptyState.title}</p>
        <p className={styles.emptyDescription}>{emptyState.description}</p>
        {emptyState.showBrowseLink ? (
          <Link to="/events" className={styles.emptyLink}>
            Browse events
          </Link>
        ) : null}
      </div>
    </div>
  );
}
