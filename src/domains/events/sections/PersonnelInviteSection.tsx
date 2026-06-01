import { wireUsers } from '@/data/fixtures';
import { EVENT_PERSONNEL_ROLE, type EventPersonnelRole } from '@saga/events-middleware';
import { Avatar } from '@saga/global-web';
import { assertNever } from '@saga/precedent-middleware';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PersonnelInviteSection.module.scss';

// Wireframe clone: the source searches every user on the platform (searchUsers
// API, debounced) and, in edit mode, manages live personnel via invite/remove
// API calls. The clone has no backend, so this keeps the create-flow UI only —
// the search filters a small fixture user list locally and selections are
// staged in parent state. Edit mode (member lists, pending invites) is dropped.
// classNames and the search-row / role-pill / chip markup match the source.

interface UserSearchResult {
  id: string;
  displayName: string;
  userName: string;
}

const ROLE_LABELS: Record<EventPersonnelRole, string> = {
  [EVENT_PERSONNEL_ROLE.CO_HOST]: 'Co-host',
  [EVENT_PERSONNEL_ROLE.STAFF]: 'Staff',
};

const ROLE_OPTIONS = [
  EVENT_PERSONNEL_ROLE.CO_HOST,
  EVENT_PERSONNEL_ROLE.STAFF,
] as const satisfies EventPersonnelRole[];

interface SelectedDetail {
  displayName: string;
  userName: string;
}

interface PersonnelInviteSectionProps {
  /** Selected co-host user IDs. */
  readonly selectedCoHostIds?: string[];
  readonly onCoHostSelectionChange?: (userIds: string[]) => void;
  /** Selected staff user IDs. */
  readonly selectedStaffIds?: string[];
  readonly onStaffSelectionChange?: (userIds: string[]) => void;
  /** Overrides the role-based search placeholder when provided. */
  readonly placeholder?: string;
}

export function PersonnelInviteSection({
  selectedCoHostIds = [],
  onCoHostSelectionChange = () => {},
  selectedStaffIds = [],
  onStaffSelectionChange = () => {},
  placeholder,
}: PersonnelInviteSectionProps) {
  const [selectedRole, setSelectedRole] = useState<EventPersonnelRole>(
    EVENT_PERSONNEL_ROLE.CO_HOST,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<Record<string, SelectedDetail>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  const excludedIds = useMemo(() => {
    const set = new Set<string>(selectedCoHostIds);
    for (const id of selectedStaffIds) set.add(id);
    return set;
  }, [selectedCoHostIds, selectedStaffIds]);

  const filteredResults = useMemo<UserSearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return wireUsers
      .filter((u) => !excludedIds.has(u.id))
      .filter(
        (u) => u.displayName.toLowerCase().includes(q) || u.userName.toLowerCase().includes(q),
      );
  }, [searchQuery, excludedIds]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectUser = (user: UserSearchResult) => {
    switch (selectedRole) {
      case EVENT_PERSONNEL_ROLE.CO_HOST:
        onCoHostSelectionChange([...selectedCoHostIds, user.id]);
        break;
      case EVENT_PERSONNEL_ROLE.STAFF:
        onStaffSelectionChange([...selectedStaffIds, user.id]);
        break;
      default:
        assertNever(selectedRole);
    }
    setSelectedDetails((prev) => ({
      ...prev,
      [user.id]: { displayName: user.displayName, userName: user.userName },
    }));
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const handleRemoveSelected = (id: string, role: EventPersonnelRole) => {
    switch (role) {
      case EVENT_PERSONNEL_ROLE.CO_HOST:
        onCoHostSelectionChange(selectedCoHostIds.filter((x) => x !== id));
        break;
      case EVENT_PERSONNEL_ROLE.STAFF:
        onStaffSelectionChange(selectedStaffIds.filter((x) => x !== id));
        break;
      default:
        assertNever(role);
    }
    setSelectedDetails((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const searchPlaceholder =
    placeholder ?? `Search to invite as ${ROLE_LABELS[selectedRole].toLowerCase()}...`;

  const selectedChipEntries = useMemo(
    () => [
      ...selectedCoHostIds.map((id) => ({ id, role: EVENT_PERSONNEL_ROLE.CO_HOST }) as const),
      ...selectedStaffIds.map((id) => ({ id, role: EVENT_PERSONNEL_ROLE.STAFF }) as const),
    ],
    [selectedCoHostIds, selectedStaffIds],
  );

  return (
    <div className={styles.section} ref={dropdownRef}>
      <span className={styles.label}>Team (optional)</span>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDropdownOpen(e.target.value.trim().length > 0);
            }}
            onFocus={() => searchQuery.trim() && setDropdownOpen(true)}
            aria-label="Search users to invite"
          />
          {dropdownOpen && (searchQuery.trim() || filteredResults.length > 0) && (
            <div className={styles.dropdown}>
              {filteredResults.length === 0 && (
                <p className={styles.statusText}>
                  {searchQuery.trim()
                    ? 'No users found'
                    : 'Type to search any user on the platform'}
                </p>
              )}
              {filteredResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={styles.option}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar name={user.displayName} type="user" variant="xs" />
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>{user.displayName}</span>
                    <span className={styles.optionUsername}>@{user.userName}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.roleSelector}>
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              type="button"
              className={`${styles.rolePill} ${selectedRole === role ? styles.rolePillActive : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
      </div>

      {selectedChipEntries.length > 0 && (
        <div className={styles.chips}>
          {selectedChipEntries.map(({ id, role }) => {
            const detail = selectedDetails[id];
            const label = detail ? `${detail.displayName} @${detail.userName}` : id.slice(0, 8);
            return (
              <span key={`${role}:${id}`} className={styles.chip}>
                {label}
                <span className={styles.roleBadge}>{ROLE_LABELS[role]}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => handleRemoveSelected(id, role)}
                  aria-label={`Remove ${label}`}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
