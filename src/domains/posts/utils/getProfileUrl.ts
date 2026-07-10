export const PROFILE_TAB_IDS = {
  created: 'created',
  library: 'library',
  saved: 'saved',
  liked: 'liked',
  events: 'events',
  tickets: 'tickets',
  commissions: 'commissions',
} as const;

export type ProfileTabId = (typeof PROFILE_TAB_IDS)[keyof typeof PROFILE_TAB_IDS];

export interface GetProfileUrlOptions {
  tab?: ProfileTabId;
}

export function resolveProfileTab(
  requestedTab: string | null | undefined,
  visibleTabs: readonly ProfileTabId[],
): ProfileTabId {
  switch (requestedTab) {
    case PROFILE_TAB_IDS.created:
    case PROFILE_TAB_IDS.library:
    case PROFILE_TAB_IDS.saved:
    case PROFILE_TAB_IDS.liked:
    case PROFILE_TAB_IDS.events:
    case PROFILE_TAB_IDS.tickets:
    case PROFILE_TAB_IDS.commissions:
      return visibleTabs.includes(requestedTab)
        ? requestedTab
        : (visibleTabs[0] ?? PROFILE_TAB_IDS.created);
    default:
      return visibleTabs[0] ?? PROFILE_TAB_IDS.created;
  }
}

export function getProfileUrl(userName: string, options: GetProfileUrlOptions = {}): string {
  if (options.tab === undefined) {
    return `/profile/${userName}`;
  }

  const search = new URLSearchParams({ tab: options.tab }).toString();
  return `/profile/${userName}?${search}`;
}
