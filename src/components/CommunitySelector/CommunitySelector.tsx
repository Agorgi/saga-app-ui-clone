import { wireCommunities } from '@/data/fixtures';
import { useMemo } from 'react';
import styles from './CommunitySelector.module.scss';

export interface CommunitySelectorProps {
  readonly selectedCommunityIds: string[];
  readonly onSelectionChange: (communityIds: string[]) => void;
  readonly maxSelection?: number;
  readonly label?: string;
  /** Community IDs to exclude from the list (e.g. communities a post is banned from) */
  readonly excludeCommunityIds?: string[];
}

// Wireframe clone: the source is a react-select-async-paginate multi-select that
// pages through the user's communities from the API. The clone has no async
// select / network, so it renders the fixture communities as a capped toggle
// list. Option-row classNames are reused from the source; the label avoids the
// source's em dash per the Saga copy rule.
export function CommunitySelector({
  selectedCommunityIds,
  onSelectionChange,
  maxSelection = 5,
  label,
  excludeCommunityIds,
}: Readonly<CommunitySelectorProps>) {
  const excludedIds = useMemo(() => new Set(excludeCommunityIds), [excludeCommunityIds]);
  const options = wireCommunities.filter((community) => !excludedIds.has(community.id));

  const toggleCommunity = (communityId: string) => {
    if (selectedCommunityIds.includes(communityId)) {
      onSelectionChange(selectedCommunityIds.filter((id) => id !== communityId));
      return;
    }
    if (maxSelection && selectedCommunityIds.length >= maxSelection) return;
    onSelectionChange([...selectedCommunityIds, communityId]);
  };

  const resolvedLabel = label ?? `Communities (optional, max ${maxSelection})`;

  return (
    <div className={styles.container}>
      <span className={styles.label}>{resolvedLabel}</span>

      <div className={styles.optionList}>
        {options.map((community) => {
          const isSelected = selectedCommunityIds.includes(community.id);
          const atLimit =
            !isSelected && maxSelection !== undefined && selectedCommunityIds.length >= maxSelection;
          return (
            <button
              key={community.id}
              type="button"
              className={styles.optionButton}
              aria-pressed={isSelected}
              disabled={atLimit}
              onClick={() => toggleCommunity(community.id)}
            >
              <div className={styles.optionTemplate}>
                <div className={styles.optionContent}>
                  <div className={styles.optionName}>{community.name}</div>
                  <div className={styles.optionStats}>{community.memberCountText}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
