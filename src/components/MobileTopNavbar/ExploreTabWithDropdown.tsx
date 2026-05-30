import { useRef } from 'react';
import styles from './ExploreTabWithDropdown.module.scss';

interface ExploreTabWithDropdownProps {
  readonly isActive: boolean;
  readonly onClick: () => void;
}

// Wireframe clone: the explore tab. The source wires a category dropdown here;
// the clone keeps the tab markup and drops the dropdown behaviour.
export function ExploreTabWithDropdown({ isActive, onClick }: ExploreTabWithDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.tabContainer} ref={dropdownRef}>
      <div
        className={`${styles.tab} ${isActive ? styles.active : ''}`}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
        aria-selected={isActive}
        role="tab"
        tabIndex={0}
      >
        <span>Explore</span>
      </div>
    </div>
  );
}
