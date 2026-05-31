import { DotsVertical } from '@untitledui/icons';
import {
  type ComponentType,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './ProfileMenu.module.scss';

export interface ProfileMenuItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly onSelect: () => void;
  readonly variant?: 'default' | 'destructive';
}

interface ProfileMenuProps {
  readonly items: ReadonlyArray<ProfileMenuItem>;
}

const COMPACT_QUERY = '(max-width: 479px)';
const POPOVER_OFFSET_PX = 10;
const POPOVER_EDGE_INSET_PX = 12;
const SWIPE_DISMISS_THRESHOLD_PX = 80;

function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

interface PopoverPosition {
  readonly top: number;
  readonly right: number;
}

export function ProfileMenu({ items }: Readonly<ProfileMenuProps>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const swipeStartYRef = useRef<number | null>(null);
  const sheetTranslateRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null);
  const isCompact = useMatchMedia(COMPACT_QUERY);
  const menuId = useId();

  const openMenu = useCallback(() => setIsOpen(true), []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleSelect = useCallback((item: ProfileMenuItem) => {
    item.onSelect();
    setIsOpen(false);
  }, []);

  // Compute popover position for the anchored variant on open / on resize.
  useLayoutEffect(() => {
    if (!isOpen || isCompact) {
      setPopoverPosition(null);
      return;
    }
    const computePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPopoverPosition({
        top: rect.bottom + POPOVER_OFFSET_PX,
        right: Math.max(POPOVER_EDGE_INSET_PX, window.innerWidth - rect.right),
      });
    };
    computePosition();
    window.addEventListener('resize', computePosition);
    window.addEventListener('scroll', computePosition, true);
    return () => {
      window.removeEventListener('resize', computePosition);
      window.removeEventListener('scroll', computePosition, true);
    };
  }, [isOpen, isCompact]);

  // Esc to close + minimal focus cycling within the menu.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Auto-focus the first item when the menu opens.
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const firstItem = menuRef.current.querySelector<HTMLElement>('button[role="menuitem"]');
    firstItem?.focus();
  }, [isOpen]);

  // Lock body scroll while the bottom sheet is open (compact viewport only).
  useEffect(() => {
    if (!isOpen || !isCompact || typeof document === 'undefined') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isCompact]);

  // Swipe-down dismissal for the bottom sheet variant.
  const handleSheetTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    swipeStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleSheetTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = swipeStartYRef.current;
    if (startY === null) return;
    const currentY = event.touches[0]?.clientY;
    if (currentY === undefined) return;
    const delta = Math.max(0, currentY - startY);
    if (sheetTranslateRef.current) {
      sheetTranslateRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handleSheetTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = swipeStartYRef.current;
    swipeStartYRef.current = null;
    if (sheetTranslateRef.current) {
      sheetTranslateRef.current.style.transform = '';
    }
    if (startY === null) return;
    const endY = event.changedTouches[0]?.clientY;
    if (endY === undefined) return;
    const delta = endY - startY;
    if (delta > SWIPE_DISMISS_THRESHOLD_PX) {
      closeMenu();
    }
  };

  const renderRow = (item: ProfileMenuItem, index: number) => {
    const isDestructive = item.variant === 'destructive';
    const rowClass = isDestructive ? `${styles.row} ${styles.rowDestructive}` : styles.row;
    return (
      <button
        key={item.id}
        type="button"
        role="menuitem"
        className={rowClass}
        onClick={() => handleSelect(item)}
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <span className={styles.rowIconTile} aria-hidden>
          <item.Icon className={styles.rowIcon} />
        </span>
        <span className={styles.rowContent}>
          <span className={styles.rowTitle}>{item.label}</span>
          <span className={styles.rowDescription}>{item.description}</span>
        </span>
      </button>
    );
  };

  // Split items so destructive entries get a visual divider above them.
  const standardItems = items.filter((item) => item.variant !== 'destructive');
  const destructiveItems = items.filter((item) => item.variant === 'destructive');

  const triggerClass = isOpen ? `${styles.trigger} ${styles.triggerOpen}` : styles.trigger;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        onClick={isOpen ? closeMenu : openMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Profile menu"
      >
        <DotsVertical className={styles.triggerIcon} aria-hidden="true" />
      </button>

      {isOpen
        ? createPortal(
            <>
              <button
                type="button"
                className={styles.backdrop}
                onClick={closeMenu}
                aria-label="Dismiss profile menu"
                tabIndex={-1}
              />

              {isCompact ? (
                <div
                  ref={sheetTranslateRef}
                  className={styles.sheetWrapper}
                  onTouchStart={handleSheetTouchStart}
                  onTouchMove={handleSheetTouchMove}
                  onTouchEnd={handleSheetTouchEnd}
                >
                  <div
                    ref={menuRef}
                    id={menuId}
                    className={styles.sheet}
                    role="menu"
                    aria-label="Profile menu"
                  >
                    <span className={styles.sheetHandle} aria-hidden />
                    <div className={styles.rows}>
                      {standardItems.map((item, index) => renderRow(item, index))}
                      {destructiveItems.length > 0 ? (
                        <span className={styles.rowDivider} aria-hidden />
                      ) : null}
                      {destructiveItems.map((item, index) =>
                        renderRow(item, standardItems.length + index),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={menuRef}
                  id={menuId}
                  className={styles.popover}
                  role="menu"
                  aria-label="Profile menu"
                  style={
                    popoverPosition
                      ? { top: popoverPosition.top, right: popoverPosition.right }
                      : { visibility: 'hidden' }
                  }
                >
                  <div className={styles.rows}>
                    {standardItems.map((item, index) => renderRow(item, index))}
                    {destructiveItems.length > 0 ? (
                      <span className={styles.rowDivider} aria-hidden />
                    ) : null}
                    {destructiveItems.map((item, index) =>
                      renderRow(item, standardItems.length + index),
                    )}
                  </div>
                </div>
              )}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
