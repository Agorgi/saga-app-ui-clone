// Placeholder fixtures for the UI wireframe clone.
//
// Everything here is invented filler — no real users, no real content, no
// images. Detail/list pages read these so the layout has something to render
// while staying obviously a wireframe. Swap freely while iterating on design.

export interface WireOpenRole {
  id: string;
  title: string;
  count?: number;
  note?: string;
}

export interface WireEvent {
  id: string;
  name: string;
  dateText: string;
  location?: string;
  goingText?: string;
  // Open Roles: roles the host needs filled, and whether they take general
  // crew applications even with no specific role listed.
  openRoles?: WireOpenRole[];
  openToApplications?: boolean;
}

export const wireEvents: WireEvent[] = [
  {
    id: 'evt-1',
    name: 'Placeholder event title one',
    dateText: 'Sat, Jan 10 · 7:00 PM',
    location: 'Venue name, City',
    goingText: '128 going · 210 total',
    openRoles: [
      { id: 'role-1a', title: 'Photographer', count: 1, note: 'Candid plus portraits through the night' },
      { id: 'role-1b', title: 'DJ', note: 'Two sets, house and afrobeats' },
      { id: 'role-1c', title: 'Door / check-in', count: 2 },
    ],
    openToApplications: true,
  },
  {
    id: 'evt-2',
    name: 'Placeholder event title two',
    dateText: 'Sun, Jan 18 · 2:00 PM',
    location: 'Venue name, City',
    goingText: '64 going',
    // No specific roles listed, but open to general crew applications.
    openToApplications: true,
  },
  {
    id: 'evt-3',
    name: 'Placeholder event title three',
    dateText: 'Fri, Jan 24 · 9:00 PM',
    location: 'Venue name, City',
    goingText: '312 going · 540 total',
  },
  {
    id: 'evt-4',
    name: 'Placeholder event title four',
    dateText: 'Thu, Feb 6 · 6:30 PM',
    location: 'Venue name, City',
    goingText: '47 going',
  },
  {
    id: 'evt-5',
    name: 'Placeholder event title five',
    dateText: 'Sat, Feb 15 · 8:00 PM',
    location: 'Venue name, City',
    goingText: '89 going · 120 total',
  },
  {
    id: 'evt-6',
    name: 'Placeholder event title six',
    dateText: 'Wed, Feb 26 · 5:00 PM',
    location: 'Venue name, City',
    goingText: '21 going',
  },
  {
    id: 'evt-7',
    name: 'Placeholder event title seven',
    dateText: 'Sat, Mar 7 · 7:30 PM',
    location: 'Venue name, City',
    goingText: '156 going · 240 total',
  },
  {
    id: 'evt-8',
    name: 'Placeholder event title eight',
    dateText: 'Sun, Mar 15 · 1:00 PM',
    location: 'Venue name, City',
    goingText: '38 going',
  },
];

export interface WireCommunity {
  id: string;
  name: string;
  memberCountText: string;
  description: string;
}

// Placeholder communities. Names are public franchises / topics (no real user
// data) chosen to span the alphabet so the create-event "Tag communities"
// autocomplete has something to filter against (e.g. typing "chain" surfaces
// "Chainsaw Man").
export const wireCommunities: WireCommunity[] = [
  {
    id: 'com-1',
    name: 'Chainsaw Man',
    memberCountText: '12.4K members',
    description: 'Fans of the manga and anime trade theories, art, and cosplay.',
  },
  {
    id: 'com-2',
    name: 'Cosplay Collective',
    memberCountText: '8.1K members',
    description: 'Makers and performers sharing builds, patterns, and con plans.',
  },
  {
    id: 'com-3',
    name: 'Cyberpunk 2077',
    memberCountText: '5.6K members',
    description: 'Night City regulars swapping screenshots, mods, and lore.',
  },
  {
    id: 'com-4',
    name: 'Attack on Titan',
    memberCountText: '15.2K members',
    description: 'Discussion, fan art, and rewatch threads for the series.',
  },
  {
    id: 'com-5',
    name: 'Anime Expo',
    memberCountText: '21.7K members',
    description: 'Attendees coordinating meetups, panels, and badge swaps.',
  },
  {
    id: 'com-6',
    name: 'Demon Slayer',
    memberCountText: '9.8K members',
    description: 'Breathing-style debates and weekly episode reactions.',
  },
  {
    id: 'com-7',
    name: 'Dungeons & Dragons',
    memberCountText: '6.3K members',
    description: 'Players looking for tables, one-shots, and homebrew ideas.',
  },
  {
    id: 'com-8',
    name: 'Formula 1',
    memberCountText: '18.9K members',
    description: 'Race-weekend watch parties and paddock talk.',
  },
  {
    id: 'com-9',
    name: 'Genshin Impact',
    memberCountText: '14.0K members',
    description: 'Teyvat travelers sharing builds, art, and co-op runs.',
  },
  {
    id: 'com-10',
    name: 'Indie Game Devs',
    memberCountText: '3.1K members',
    description: 'Builders showing works in progress and trading feedback.',
  },
  {
    id: 'com-11',
    name: 'Jujutsu Kaisen',
    memberCountText: '11.5K members',
    description: 'Cursed-energy theorists and fan-art posters welcome.',
  },
  {
    id: 'com-12',
    name: 'K-Pop Stans',
    memberCountText: '24.6K members',
    description: 'Comeback countdowns, fan projects, and streaming parties.',
  },
  {
    id: 'com-13',
    name: 'Love and Deepspace',
    memberCountText: '7.7K members',
    description: 'A space for players to share cards, dates, and fan edits.',
  },
  {
    id: 'com-14',
    name: 'Marvel Cinematic Universe',
    memberCountText: '19.3K members',
    description: 'Premiere nights, theory threads, and rewatch clubs.',
  },
  {
    id: 'com-15',
    name: 'One Piece',
    memberCountText: '16.8K members',
    description: 'Weekly chapter breakdowns and Grand Line fan art.',
  },
  {
    id: 'com-16',
    name: 'Streetwear Heads',
    memberCountText: '10.2K members',
    description: 'Fit checks, drop alerts, and resale talk.',
  },
  {
    id: 'com-17',
    name: 'Studio Ghibli',
    memberCountText: '13.4K members',
    description: 'Cozy screenings and appreciation for the films.',
  },
  {
    id: 'com-18',
    name: 'Vinyl Collectors',
    memberCountText: '4.5K members',
    description: 'Crate-digging finds, pressings, and listening sessions.',
  },
  {
    id: 'com-19',
    name: 'A24 Films',
    memberCountText: '8.9K members',
    description: 'Discussion and watch parties for the studio catalog.',
  },
];

export interface WirePost {
  id: string;
  title: string;
  authorName: string;
  authorHandle: string;
  communityName: string;
  timeAgo: string;
  body: string;
  hasImage: boolean;
  likeCount: number;
  commentCount: number;
  collabCount: number;
  saveCount: number;
  // CommunityMemberRole numeric (MODERATOR=1, ADMIN=2). Drives CommunityRoleBadge.
  creatorRole?: number;
}

export const wirePosts: WirePost[] = [
  {
    id: 'post-1',
    title: 'Placeholder post title one',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '2h',
    body: 'This is placeholder post copy. It stands in for a real member post so the feed layout has something to render while we iterate on the design.',
    hasImage: true,
    likeCount: 124,
    commentCount: 18,
    collabCount: 4,
    saveCount: 31,
    creatorRole: 2,
  },
  {
    id: 'post-2',
    title: 'Placeholder post title two',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '5h',
    body: 'Another placeholder post. Short and text-only this time to show how the card adapts without media.',
    hasImage: false,
    likeCount: 57,
    commentCount: 6,
    collabCount: 1,
    saveCount: 9,
  },
  {
    id: 'post-3',
    title: 'Placeholder post title three',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '1d',
    body: 'Placeholder post with a longer body to demonstrate how multiple lines of text wrap inside the post card layout used across the feed.',
    hasImage: true,
    likeCount: 982,
    commentCount: 143,
    collabCount: 27,
    saveCount: 204,
    creatorRole: 1,
  },
  {
    id: 'post-4',
    title: 'Placeholder post title four',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '2d',
    body: 'Final placeholder post in the seed feed. Replace any of this filler while working on the visual design.',
    hasImage: false,
    likeCount: 13,
    commentCount: 2,
    collabCount: 0,
    saveCount: 1,
  },
  {
    id: 'post-5',
    title: 'Placeholder post title five',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '3h',
    body: 'Placeholder copy for an image post sitting mid-feed so the composition has variety across the post runs.',
    hasImage: true,
    likeCount: 268,
    commentCount: 34,
    collabCount: 7,
    saveCount: 52,
  },
  {
    id: 'post-6',
    title: 'Placeholder post title six',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '6h',
    body: 'A text-only placeholder post. Keeps the run from being all media so the feed rhythm reads naturally.',
    hasImage: false,
    likeCount: 41,
    commentCount: 5,
    collabCount: 2,
    saveCount: 7,
  },
  {
    id: 'post-7',
    title: 'Placeholder post title seven',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '9h',
    body: 'Higher-engagement placeholder post with media, to show how the card handles larger counts in the action row.',
    hasImage: true,
    likeCount: 1543,
    commentCount: 221,
    collabCount: 38,
    saveCount: 311,
    creatorRole: 2,
  },
  {
    id: 'post-8',
    title: 'Placeholder post title eight',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '14h',
    body: 'Another short text placeholder. The feed composer cycles these fixtures, so unique copy keeps a 10-post window from repeating.',
    hasImage: false,
    likeCount: 88,
    commentCount: 11,
    collabCount: 3,
    saveCount: 19,
  },
  {
    id: 'post-9',
    title: 'Placeholder post title nine',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '1d',
    body: 'Placeholder image post used to round out the second run of posts in the home-feed composition pattern.',
    hasImage: true,
    likeCount: 372,
    commentCount: 48,
    collabCount: 9,
    saveCount: 73,
    creatorRole: 1,
  },
  {
    id: 'post-10',
    title: 'Placeholder post title ten',
    authorName: 'Member name',
    authorHandle: 'member',
    communityName: 'Placeholder community',
    timeAgo: '2d',
    body: 'Tenth placeholder post, text-only, closing out a no-repeat window before the composer wraps the fixtures.',
    hasImage: false,
    likeCount: 24,
    commentCount: 3,
    collabCount: 1,
    saveCount: 4,
  },
];

export interface WireProfile {
  username: string;
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  followersText: string;
  followingText: string;
}

export const wireProfile: WireProfile = {
  username: 'member',
  displayName: 'Member name',
  handle: '@member',
  bio: 'Placeholder bio line that describes this member in a sentence or two.',
  location: 'City, Country',
  followersText: '1,204 followers',
  followingText: '317 following',
};

export interface WireUser {
  id: string;
  displayName: string;
  userName: string;
}

// Stands in for the platform-wide user search the real event form hits when
// inviting co-hosts and staff. The personnel section filters this list locally.
export const wireUsers: WireUser[] = [
  { id: 'usr-1', displayName: 'Placeholder Member One', userName: 'member_one' },
  { id: 'usr-2', displayName: 'Placeholder Member Two', userName: 'member_two' },
  { id: 'usr-3', displayName: 'Placeholder Member Three', userName: 'member_three' },
  { id: 'usr-4', displayName: 'Placeholder Member Four', userName: 'member_four' },
  { id: 'usr-5', displayName: 'Placeholder Member Five', userName: 'member_five' },
  { id: 'usr-6', displayName: 'Placeholder Member Six', userName: 'member_six' },
  { id: 'usr-7', displayName: 'Placeholder Member Seven', userName: 'member_seven' },
  { id: 'usr-8', displayName: 'Placeholder Member Eight', userName: 'member_eight' },
];
