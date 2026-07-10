import { PostFeed } from '@domains/posts/ui/PostFeed/PostFeed';
import { SegmentedToggle } from '@saga/global-web';
import { Bookmark, Heart } from '@untitledui/icons';
import { type ReactNode, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './ProfileTabsSection.module.scss';

type LibrarySubTab = 'saved' | 'liked';

interface LibraryTabContentProps {
  readonly profileUserId: string;
}

// Wireframe clone: the "Library" tab folds the old Saved / Liked tabs into one
// place, switched by a segmented toggle. The source passes the toggle to the
// feed as `toolbarStart`; the clone feed has no toolbar slot, so it renders
// above the feed. The feed itself is fixture-backed, so switching sub-tabs is
// inert (same placeholder posts) — the interaction and chrome are what matter.
export function LibraryTabContent({ profileUserId }: LibraryTabContentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubTab: LibrarySubTab = searchParams.get('subtab') === 'liked' ? 'liked' : 'saved';

  const handleSubTabChange = useCallback(
    (subTab: LibrarySubTab) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (subTab === 'saved') {
            next.delete('subtab');
          } else {
            next.set('subtab', subTab);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const librarySegments = useMemo(
    () =>
      [
        {
          id: 'saved' as const,
          label: 'Saved',
          icon: <Bookmark width={15} height={15} aria-hidden="true" />,
        },
        {
          id: 'liked' as const,
          label: 'Liked',
          icon: <Heart width={15} height={15} aria-hidden="true" />,
        },
      ] satisfies ReadonlyArray<{ id: LibrarySubTab; label: string; icon: ReactNode }>,
    [],
  );

  return (
    <div>
      <div className={styles.libraryToolbar}>
        <SegmentedToggle
          segments={librarySegments}
          value={activeSubTab}
          onChange={handleSubTabChange}
          ariaLabel="Library view"
        />
      </div>

      <PostFeed
        feedType={activeSubTab}
        profileUserId={profileUserId}
        viewContext="profile"
        hideViewToggle={true}
      />
    </div>
  );
}
