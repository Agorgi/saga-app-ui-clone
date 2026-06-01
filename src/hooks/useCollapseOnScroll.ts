import { useEffect, useRef, useState } from 'react';

// Reports whether scroll-reactive chrome (the floating bottom navbar) should
// collapse to its compact state. Collapses while scrolling down past a small
// threshold, restores while scrolling up or when near the top of the page.
// The feed scrolls the window (there is no inner scroll container), so this
// listens to window scroll. rAF-throttled with a passive listener.
export function useCollapseOnScroll(threshold = 8): boolean {
  const [collapsed, setCollapsed] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (Math.abs(delta) > threshold) {
        if (y < 24) {
          setCollapsed(false);
        } else {
          setCollapsed(delta > 0);
        }
        lastY.current = y;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return collapsed;
}
