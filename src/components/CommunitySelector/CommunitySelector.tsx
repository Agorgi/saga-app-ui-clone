import { wireCommunities, type WireCommunity } from '@/data/fixtures';
import { SearchSm, X } from '@untitledui/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './CommunitySelector.module.scss';

export interface CommunitySelectorProps {
  readonly selectedCommunityIds: string[];
  readonly onSelectionChange: (communityIds: string[]) => void;
  readonly maxSelection?: number;
  readonly label?: string;
  /** Community IDs to exclude from the list (e.g. communities a post is banned from) */
  readonly excludeCommunityIds?: string[];
}

// Wireframe clone of the source's CommunitySelector. The source is a searchable
// multi-select (react-select-async-paginate) that types-to-filter the user's
// communities from the API and renders chosen ones as removable chips. The clone
// has no async-select dependency or network, so it reimplements the same typeahead
// over the local `wireCommunities` fixture: type to filter by name prefix, click or
// press Enter to add a chip, Backspace/X to remove. The prop shape matches the
// source so the real component is a drop-in swap at integration time. Option rows
// reuse the source's .optionTemplate / .optionContent / .optionName / .optionStats
// classNames; the default label avoids the source's em dash per the Saga copy rule.
export function CommunitySelector({
  selectedCommunityIds,
  onSelectionChange,
  maxSelection = 5,
  label,
  excludeCommunityIds,
}: Readonly<CommunitySelectorProps>) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const excludedIds = useMemo(() => new Set(excludeCommunityIds), [excludeCommunityIds]);

  const selected = useMemo<WireCommunity[]>(
    () =>
      selectedCommunityIds
        .map((id) => wireCommunities.find((c) => c.id === id))
        .filter((c): c is WireCommunity => c !== undefined),
    [selectedCommunityIds],
  );

  const atMax = selectedCommunityIds.length >= maxSelection;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return wireCommunities
      .filter((c) => !excludedIds.has(c.id) && !selectedCommunityIds.includes(c.id))
      .filter((c) => (q ? c.name.toLowerCase().startsWith(q) : true));
  }, [query, selectedCommunityIds, excludedIds]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const addCommunity = (id: string) => {
    if (atMax || selectedCommunityIds.includes(id)) return;
    onSelectionChange([...selectedCommunityIds, id]);
    setQuery('');
    setActiveIndex(0);
  };

  const removeCommunity = (id: string) => {
    onSelectionChange(selectedCommunityIds.filter((cid) => cid !== id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const match = matches[activeIndex];
      if (match) addCommunity(match.id);
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Backspace' && query === '' && selected.length > 0) {
      removeCommunity(selected[selected.length - 1].id);
    }
  };

  const showMenu = open && !atMax && matches.length > 0;
  const showEmpty = open && !atMax && query.trim().length > 0 && matches.length === 0;

  // `undefined` keeps the source's default label; an explicit '' hides it (used by
  // the event form, where the "Tag communities" pill above already names the field).
  const resolvedLabel =
    label === undefined ? `Communities (optional, max ${maxSelection})` : label;

  return (
    <div className={styles.container} ref={wrapperRef}>
      {resolvedLabel && <span className={styles.label}>{resolvedLabel}</span>}

      <div
        className={styles.control}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault();
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        {selected.map((community) => (
          <span key={community.id} className={styles.chip}>
            {community.name}
            <button
              type="button"
              className={styles.chipRemove}
              onClick={() => removeCommunity(community.id)}
              aria-label={`Remove ${community.name}`}
            >
              <X className={styles.chipRemoveIcon} aria-hidden />
            </button>
          </span>
        ))}

        <span className={styles.inputRow}>
          <SearchSm className={styles.searchIcon} aria-hidden />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={query}
            placeholder={
              atMax
                ? `Up to ${maxSelection} communities`
                : selected.length > 0
                  ? 'Add another community'
                  : 'Search communities to tag'
            }
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            aria-label="Search communities to tag"
            aria-expanded={showMenu}
            role="combobox"
            aria-autocomplete="list"
            disabled={atMax}
          />
        </span>
      </div>

      {showMenu && (
        <ul className={styles.menu} role="listbox">
          {matches.map((community, index) => (
            <li key={community.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`${styles.option} ${index === activeIndex ? styles.optionActive : ''}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  addCommunity(community.id);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className={styles.optionTemplate}>
                  <div className={styles.optionContent}>
                    <div className={styles.optionName}>{community.name}</div>
                    <div className={styles.optionStats}>{community.memberCountText}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showEmpty && <div className={styles.empty}>No communities found</div>}
    </div>
  );
}

export default CommunitySelector;
