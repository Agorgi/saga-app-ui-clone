import { ChevronDown } from '@untitledui/icons';
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cx } from '../../utils/cx';
import styles from './SegmentedToggle.module.scss';

export interface SegmentedToggleSegment<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedToggleProps<T extends string> {
  readonly segments: ReadonlyArray<SegmentedToggleSegment<T>>;
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly ariaLabel: string;
  readonly highlightColor?: string;
  readonly indicatorVariant?: 'filled' | 'subtle';
  /** `content` hugs segment labels; `stretch` fills the available width. */
  readonly layout?: 'content' | 'stretch';
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly segmentClassName?: string;
  readonly indicatorClassName?: string;
  readonly iconClassName?: string;
  readonly labelClassName?: string;
}

interface IndicatorMetrics {
  left: number;
  width: number;
}

type PresentationMode = 'toggle' | 'dropdown';

function buildHighlightStyle(highlightColor: string | undefined): CSSProperties {
  if (!highlightColor) {
    return {};
  }

  return {
    '--segmented-toggle-highlight-start': highlightColor,
    '--segmented-toggle-highlight-end': highlightColor,
    '--segmented-toggle-highlight-glow': highlightColor,
  } as CSSProperties;
}

function measureIndicator(
  container: HTMLDivElement,
  activeSegment: HTMLButtonElement,
): IndicatorMetrics {
  const containerRect = container.getBoundingClientRect();
  const segmentRect = activeSegment.getBoundingClientRect();

  return {
    left: segmentRect.left - containerRect.left,
    width: segmentRect.width,
  };
}

interface SegmentedToggleSegmentButtonProps<T extends string> {
  readonly segment: SegmentedToggleSegment<T>;
  readonly isActive: boolean;
  readonly indicatorVariant: 'filled' | 'subtle';
  readonly onSelect: (value: T) => void;
  readonly onSegmentRef: (id: T, element: HTMLButtonElement | null) => void;
  readonly segmentClassName?: string;
  readonly iconClassName?: string;
  readonly labelClassName?: string;
}

function SegmentedToggleSegmentButton<T extends string>({
  segment,
  isActive,
  indicatorVariant,
  onSelect,
  onSegmentRef,
  segmentClassName,
  iconClassName,
  labelClassName,
}: SegmentedToggleSegmentButtonProps<T>) {
  const handleClick = useCallback(() => {
    onSelect(segment.id);
  }, [onSelect, segment.id]);

  const handleRef = useCallback(
    (element: HTMLButtonElement | null) => {
      onSegmentRef(segment.id, element);
    },
    [onSegmentRef, segment.id],
  );

  const segmentClasses = cx(
    styles.segment,
    isActive
      ? indicatorVariant === 'subtle'
        ? styles.segmentSubtleActive
        : styles.segmentFilledActive
      : '',
    segmentClassName,
  );

  return (
    <button
      ref={handleRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={segmentClasses}
      onClick={handleClick}
      aria-label={segment.label}
    >
      {segment.icon ? (
        <span className={cx(styles.icon, iconClassName)} aria-hidden="true">
          {segment.icon}
        </span>
      ) : null}
      <span className={cx(styles.label, labelClassName)}>{segment.label}</span>
    </button>
  );
}

interface SegmentedToggleDropdownOptionProps<T extends string> {
  readonly segment: SegmentedToggleSegment<T>;
  readonly isSelected: boolean;
  readonly onSelect: (value: T) => void;
  readonly onClose: () => void;
}

function SegmentedToggleDropdownOption<T extends string>({
  segment,
  isSelected,
  onSelect,
  onClose,
}: SegmentedToggleDropdownOptionProps<T>) {
  const handleClick = useCallback(() => {
    onSelect(segment.id);
    onClose();
  }, [onClose, onSelect, segment.id]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cx(styles.dropdownOption, isSelected ? styles.dropdownOptionSelected : '')}
      onClick={handleClick}
    >
      {segment.icon ? (
        <span className={styles.dropdownOptionIcon} aria-hidden="true">
          {segment.icon}
        </span>
      ) : null}
      <span>{segment.label}</span>
    </button>
  );
}

interface SegmentedToggleDropdownProps<T extends string> {
  readonly segments: ReadonlyArray<SegmentedToggleSegment<T>>;
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly ariaLabel: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

function SegmentedToggleDropdown<T extends string>({
  segments,
  value,
  onChange,
  ariaLabel,
  className,
  style,
}: SegmentedToggleDropdownProps<T>) {
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const activeSegment = segments.find((segment) => segment.id === value) ?? segments[0];

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !wrapperRef.current?.contains(target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  if (!activeSegment) {
    return null;
  }

  return (
    <div ref={wrapperRef} className={cx(styles.dropdownRoot, className)} style={style}>
      <button
        type="button"
        className={styles.dropdownTrigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`${ariaLabel}: ${activeSegment.label}`}
        onClick={handleToggleOpen}
      >
        <span className={styles.dropdownTriggerLabel}>{activeSegment.label}</span>
        <ChevronDown
          className={cx(styles.dropdownChevron, isOpen ? styles.dropdownChevronOpen : '')}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div id={listboxId} className={styles.dropdownMenu} role="listbox" aria-label={ariaLabel}>
          {segments.map((segment) => (
            <SegmentedToggleDropdownOption
              key={segment.id}
              segment={segment}
              isSelected={segment.id === value}
              onSelect={onChange}
              onClose={closeMenu}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SegmentedToggle<T extends string>({
  segments,
  value,
  onChange,
  ariaLabel,
  highlightColor,
  indicatorVariant = 'filled',
  layout = 'content',
  className,
  style,
  segmentClassName,
  indicatorClassName,
  iconClassName,
  labelClassName,
}: SegmentedToggleProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Partial<Record<string, HTMLButtonElement>>>({});
  const naturalWidthRef = useRef(0);
  const [indicatorMetrics, setIndicatorMetrics] = useState<IndicatorMetrics | undefined>(undefined);
  const [presentationMode, setPresentationMode] = useState<PresentationMode>('toggle');

  const evaluatePresentation = useCallback(() => {
    if (layout === 'stretch') {
      return;
    }

    const root = rootRef.current;
    const container = containerRef.current;

    if (!root || !container || segments.length === 0) {
      return;
    }

    const availableWidth = root.clientWidth;
    const contentWidth = container.scrollWidth;
    naturalWidthRef.current = Math.max(naturalWidthRef.current, contentWidth);

    setPresentationMode((current) => {
      if (current === 'dropdown') {
        return availableWidth >= naturalWidthRef.current ? 'toggle' : 'dropdown';
      }

      return contentWidth > availableWidth + 1 ? 'dropdown' : 'toggle';
    });
  }, [layout, segments.length]);

  useLayoutEffect(() => {
    if (presentationMode !== 'dropdown') {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const restoreToggleIfFits = () => {
      if (root.clientWidth >= naturalWidthRef.current) {
        setPresentationMode('toggle');
      }
    };

    restoreToggleIfFits();

    const resizeObserver = new ResizeObserver(restoreToggleIfFits);
    resizeObserver.observe(root);

    return () => {
      resizeObserver.disconnect();
    };
  }, [presentationMode]);

  useLayoutEffect(() => {
    void layout;
    void segments.length;
    naturalWidthRef.current = 0;
    setPresentationMode('toggle');
  }, [layout, segments.length]);

  useLayoutEffect(() => {
    if (presentationMode !== 'toggle' || segments.length === 0) {
      return;
    }

    const container = containerRef.current;
    const activeSegment = segmentRefs.current[value];

    if (!container || !activeSegment) {
      return;
    }

    setIndicatorMetrics(measureIndicator(container, activeSegment));
    evaluatePresentation();
  }, [evaluatePresentation, presentationMode, segments, value]);

  useLayoutEffect(() => {
    if (presentationMode !== 'toggle') {
      return;
    }

    const root = rootRef.current;
    const container = containerRef.current;
    const scrollHost = scrollHostRef.current;

    if (!root || !container) {
      return;
    }

    const syncIndicator = () => {
      const activeSegment = segmentRefs.current[value];
      if (!activeSegment) {
        return;
      }

      setIndicatorMetrics(measureIndicator(container, activeSegment));
      evaluatePresentation();
    };

    const resizeObserver = new ResizeObserver(syncIndicator);
    resizeObserver.observe(root);
    resizeObserver.observe(container);

    for (const segment of segments) {
      const segmentElement = segmentRefs.current[segment.id];
      if (segmentElement) {
        resizeObserver.observe(segmentElement);
      }
    }

    scrollHost?.addEventListener('scroll', syncIndicator, { passive: true });

    return () => {
      resizeObserver.disconnect();
      scrollHost?.removeEventListener('scroll', syncIndicator);
    };
  }, [evaluatePresentation, presentationMode, segments, value]);

  useLayoutEffect(() => {
    if (presentationMode !== 'toggle' || layout !== 'content') {
      return;
    }

    const scrollHost = scrollHostRef.current;
    const activeSegment = segmentRefs.current[value];

    if (!scrollHost || !activeSegment) {
      return;
    }

    activeSegment.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [layout, presentationMode, value]);

  const containerClassName = cx(styles.container, layout === 'stretch' ? styles.stretch : '');

  const scrollHostClassName = styles.scrollHost;

  const indicatorClasses = cx(
    styles.indicator,
    indicatorMetrics ? styles.indicatorMeasured : styles.indicatorHidden,
    indicatorVariant === 'subtle' ? styles.indicatorSubtle : styles.indicatorFilled,
    indicatorClassName,
  );

  const rootStyle: CSSProperties = {
    ...buildHighlightStyle(highlightColor),
    ...style,
  };

  const indicatorStyle: CSSProperties = indicatorMetrics
    ? {
        left: indicatorMetrics.left,
        width: indicatorMetrics.width,
      }
    : {};

  const handleSegmentRef = useCallback((id: T, element: HTMLButtonElement | null) => {
    if (element) {
      segmentRefs.current[id] = element;
      return;
    }

    delete segmentRefs.current[id];
  }, []);

  if (presentationMode === 'dropdown') {
    return (
      <div
        ref={rootRef}
        className={cx(styles.root, styles.rootStretch, className)}
        style={rootStyle}
      >
        <SegmentedToggleDropdown
          segments={segments}
          value={value}
          onChange={onChange}
          ariaLabel={ariaLabel}
        />
      </div>
    );
  }

  const toggleBody = (
    <div ref={containerRef} className={containerClassName} role="tablist" aria-label={ariaLabel}>
      <div className={indicatorClasses} style={indicatorStyle} aria-hidden="true" />
      {segments.map((segment) => (
        <SegmentedToggleSegmentButton
          key={segment.id}
          segment={segment}
          isActive={segment.id === value}
          indicatorVariant={indicatorVariant}
          onSelect={onChange}
          onSegmentRef={handleSegmentRef}
          segmentClassName={segmentClassName}
          iconClassName={iconClassName}
          labelClassName={labelClassName}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, layout === 'stretch' ? styles.rootStretch : '', className)}
      style={rootStyle}
    >
      {layout === 'content' ? (
        <div ref={scrollHostRef} className={scrollHostClassName}>
          {toggleBody}
        </div>
      ) : (
        toggleBody
      )}
    </div>
  );
}
