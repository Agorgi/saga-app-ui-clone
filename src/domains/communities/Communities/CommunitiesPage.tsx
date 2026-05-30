import { wireCommunities } from '@/data/fixtures';
import { SearchSm, X } from '@untitledui/icons';
import { useState } from 'react';
import { CommunityList } from '../components/CommunityList';
import styles from './CommunitiesPage.module.scss';

// Wireframe clone: communities directory. The search box is local-only (no
// filtering) and the result count is static — the source wires paginated
// search + membership state.
export function CommunitiesPage() {
  const [searchInput, setSearchInput] = useState('');
  const totalCount = wireCommunities.length;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Communities</h1>
          <p className={styles.subtitle}>
            Discover and join communities to connect with like-minded people
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <SearchSm className={styles.searchIcon} width={16} height={16} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                <X className={styles.clearIcon} />
              </button>
            )}
          </div>
        </form>

        <div className={styles.resultsInfo}>
          <p className={styles.resultsText}>
            Showing {totalCount} {totalCount === 1 ? 'community' : 'communities'}
          </p>
        </div>

        <CommunityList
          communities={wireCommunities}
          emptyMessage="No communities available yet"
          showJoinButtons={true}
        />
      </div>
    </div>
  );
}
