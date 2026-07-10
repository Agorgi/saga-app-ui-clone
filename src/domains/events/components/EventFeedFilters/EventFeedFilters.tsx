import { Calendar, MarkerPin01, TrendUp01 } from '@untitledui/icons';
import { useCallback } from 'react';
import styles from './EventFeedFilters.module.scss';

export type EventFeedSort = 'soonest' | 'popular' | 'near_me' | 'near_location';

export interface EventFeedFiltersProps {
  sortBy: EventFeedSort;
  onSortByChange: (sort: EventFeedSort) => void;
  showNearby: boolean;
  isResolvingLocation?: boolean;
  /** True while a location search is active — Nearby is mutually exclusive with it. */
  disableNearby?: boolean;
  /** Independent date-range filter — composes with sortBy, not mutually exclusive. */
  next7Days: boolean;
  onNext7DaysToggle: () => void;
}

export function EventFeedFilters({
  sortBy,
  onSortByChange,
  showNearby,
  isResolvingLocation = false,
  disableNearby = false,
  next7Days,
  onNext7DaysToggle,
}: Readonly<EventFeedFiltersProps>) {
  const isPopular = sortBy === 'popular';
  const isNearMe = sortBy === 'near_me';

  const handlePopularToggle = useCallback(() => {
    onSortByChange(isPopular ? 'soonest' : 'popular');
  }, [isPopular, onSortByChange]);

  const handleNearbyToggle = useCallback(() => {
    onSortByChange(isNearMe ? 'soonest' : 'near_me');
  }, [isNearMe, onSortByChange]);

  return (
    <fieldset className={styles.row}>
      <legend className={styles.srOnly}>Event filters</legend>
      <button
        type="button"
        className={`${styles.chip}${isPopular ? ` ${styles.chipActive}` : ''}`}
        aria-pressed={isPopular}
        onClick={handlePopularToggle}
      >
        <TrendUp01 className={styles.chipIcon} aria-hidden="true" />
        Popular
      </button>

      {showNearby ? (
        <>
          <span className={styles.divider} aria-hidden="true" />
          <button
            type="button"
            className={`${styles.chip}${isNearMe ? ` ${styles.chipActive}` : ''}`}
            aria-pressed={isNearMe}
            disabled={isResolvingLocation || disableNearby}
            onClick={handleNearbyToggle}
          >
            <MarkerPin01 className={styles.chipIcon} aria-hidden="true" />
            {isResolvingLocation ? 'Locating…' : 'Nearby'}
          </button>
        </>
      ) : null}

      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.chip}${next7Days ? ` ${styles.chipActive}` : ''}`}
        aria-pressed={next7Days}
        onClick={onNext7DaysToggle}
      >
        <Calendar className={styles.chipIcon} aria-hidden="true" />
        Next 7 days
      </button>
    </fieldset>
  );
}
