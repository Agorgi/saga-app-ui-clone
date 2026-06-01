import {
  type WireCommunity,
  type WireEvent,
  type WirePost,
  wireCommunities,
  wireEvents,
  wirePosts,
} from '@/data/fixtures';

export type HomeFeedItem =
  | { kind: 'post'; key: string; post: WirePost }
  | { kind: 'event'; key: string; event: WireEvent }
  | { kind: 'community'; key: string; community: WireCommunity };

const POSTS_PER_RUN = 5;
const EVENTS_PER_BLOCK = 3;
const COMMUNITIES_PER_BLOCK = 5;

// The home feed repeats one fixed composition per cycle: 5 regular posts, then 3
// events, then 5 more regular posts, then 5 landscape community listings.
// `buildHomeFeedItems` flattens that into an ordered list and cycles the finite
// fixtures with wraparound cursors. A monotonic slot counter stamps a unique key
// on every slot so React keys never collide when a fixture is reused downstream.
export function buildHomeFeedItems(cycles = 3): HomeFeedItem[] {
  const items: HomeFeedItem[] = [];
  let postCursor = 0;
  let eventCursor = 0;
  let communityCursor = 0;
  let slot = 0;

  const pushPosts = (count: number) => {
    for (let i = 0; i < count; i++) {
      const post = wirePosts[postCursor % wirePosts.length];
      items.push({ kind: 'post', key: `feed-${slot++}-${post.id}`, post });
      postCursor++;
    }
  };

  const pushEvents = (count: number) => {
    for (let i = 0; i < count; i++) {
      const event = wireEvents[eventCursor % wireEvents.length];
      items.push({ kind: 'event', key: `feed-${slot++}-${event.id}`, event });
      eventCursor++;
    }
  };

  const pushCommunities = (count: number) => {
    for (let i = 0; i < count; i++) {
      const community = wireCommunities[communityCursor % wireCommunities.length];
      items.push({ kind: 'community', key: `feed-${slot++}-${community.id}`, community });
      communityCursor++;
    }
  };

  for (let cycle = 0; cycle < cycles; cycle++) {
    pushPosts(POSTS_PER_RUN);
    pushEvents(EVENTS_PER_BLOCK);
    pushPosts(POSTS_PER_RUN);
    pushCommunities(COMMUNITIES_PER_BLOCK);
  }

  return items;
}
