import type { Location } from 'react-router-dom';

/**
 * A stable subset of react-router's Location type used for background/fallback
 * navigation state. Avoids dependence on unstable internal fields (e.g. unstable_mask)
 * introduced in react-router-dom v7.
 */
export type BackgroundLocation = Pick<Location, 'pathname' | 'search' | 'hash' | 'state' | 'key'>;
