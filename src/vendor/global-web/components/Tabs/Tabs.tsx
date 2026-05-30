import type React from 'react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './Tabs.module.scss';

export interface Tab<T extends string> {
  id: T;
  label: ReactNode;
}

export interface TabsProps<T extends string> {
  tabs: Array<Tab<T>>;
  activeTab: T;
  onTabChange: (tabId: T) => void;
  children?: (activeTab: T) => ReactNode;
  className?: string;
  /** Applied to the scrollable container that wraps the tab track. */
  tabsContainerClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  className,
  tabsContainerClassName,
  contentClassName,
  ariaLabel = 'Tabs',
  ref,
}: TabsProps<any> & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const uid = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });
  const [baseline, setBaseline] = useState({ x: 0, width: 0 });

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  /**
   * Measures the active label's bounding rect relative to the scroll container.
   * Uses getBoundingClientRect so the current scroll offset is already factored in.
   * Stable — safe for scroll event listener.
   */
  const measureIndicator = useCallback(() => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;
    const activeButton = track.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!activeButton) return;
    const labelEl = activeButton.querySelector<HTMLElement>('[data-tab-label]');
    const target = labelEl ?? activeButton;
    const scrollRect = scroll.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setIndicator({
      x: targetRect.left - scrollRect.left,
      width: targetRect.width,
    });
  }, []);

  /**
   * Measures the full span of tab buttons using offsetLeft (layout coords).
   * offsetLeft is relative to the nearest positioned ancestor (.root), which is
   * the same coordinate space as the baseline's translateX — so the baseline
   * stays put when the row is scrolled rather than drifting with the scroll offset.
   * Only called on layout changes (not scroll).
   */
  const measureBaseline = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const buttons = track.querySelectorAll<HTMLButtonElement>('button');
    if (buttons.length === 0) return;
    const first = buttons[0]!;
    const last = buttons[buttons.length - 1]!;
    setBaseline({
      x: first.offsetLeft,
      width: last.offsetLeft + last.offsetWidth - first.offsetLeft,
    });
  }, []);

  // Scroll active tab into view, then sync both indicator and baseline.
  // biome-ignore lint/correctness/useExhaustiveDependencies: tabs is intentionally reactive
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;

    const buttons = track.querySelectorAll<HTMLButtonElement>('button');
    const activeButton = buttons[activeTabIndex];
    if (!activeButton) return;

    // Scroll using offsetLeft (layout position) so it is settled before getBoundingClientRect.
    const btnLeft = activeButton.offsetLeft;
    const btnRight = btnLeft + activeButton.offsetWidth;
    if (btnLeft < scroll.scrollLeft) {
      scroll.scrollLeft = btnLeft;
    } else if (btnRight > scroll.scrollLeft + scroll.clientWidth) {
      scroll.scrollLeft = btnRight - scroll.clientWidth;
    }

    measureIndicator();
    measureBaseline();
  }, [activeTabIndex, tabs, measureIndicator, measureBaseline]);

  // Keep indicator in sync while the user manually scrolls the tab row.
  // Baseline does NOT re-measure on scroll — it should stay fixed.
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.addEventListener('scroll', measureIndicator, { passive: true });
    return () => scroll.removeEventListener('scroll', measureIndicator);
  }, [measureIndicator]);

  // Re-measure both on container resize (window resize, layout shifts, etc.).
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      measureIndicator();
      measureBaseline();
    });
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, [measureIndicator, measureBaseline]);

  return (
    <div ref={ref} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div
        ref={scrollRef}
        className={[styles.tabsScroll, tabsContainerClassName].filter(Boolean).join(' ')}
      >
        <div ref={trackRef} className={styles.tabsTrack} role="tablist" aria-label={ariaLabel}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${uid}-tab-${tab.id}`}
              type="button"
              className={[styles.tab, activeTab === tab.id ? styles['tab--active'] : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              aria-controls={`${uid}-panel`}
              role="tab"
            >
              <span data-tab-label>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chrome}>
        <div
          className={styles.baseline}
          style={{ transform: `translateX(${baseline.x}px)`, width: baseline.width }}
        />
        <div
          className={styles.indicator}
          style={{ transform: `translateX(${indicator.x}px)`, width: indicator.width }}
        />
      </div>

      {children && (
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${activeTab}`}
          className={[styles.tabContent, contentClassName].filter(Boolean).join(' ')}
        >
          {children(activeTab)}
        </div>
      )}
    </div>
  );
};

Tabs.displayName = 'Tabs';
