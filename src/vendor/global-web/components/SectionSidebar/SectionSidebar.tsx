import { NavLink } from 'react-router-dom';

import { cx } from '../../utils/cx';

import styles from './SectionSidebar.module.scss';

export interface SectionSidebarNavItem {
  readonly to: string;
  readonly label: string;
  readonly description?: string;
}

export interface SectionSidebarProps {
  readonly items: ReadonlyArray<SectionSidebarNavItem>;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

/**
 * Vertical nav for section-based pages (e.g. settings). Each item links via React Router.
 */
export function SectionSidebar({
  items,
  className,
  'aria-label': ariaLabel = 'Sections',
}: SectionSidebarProps) {
  return (
    <nav className={cx(styles.nav, className)} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to} className={styles.item}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) => cx(styles.link, isActive && styles.linkActive)}
            >
              <span className={styles.linkLabel}>{item.label}</span>
              {item.description !== undefined && item.description !== '' ? (
                <span className={styles.linkDescription}>{item.description}</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

SectionSidebar.displayName = 'SectionSidebar';
