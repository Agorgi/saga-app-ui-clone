// Placeholder fixtures for the UI wireframe clone.
//
// Everything here is invented filler — no real users, no real content, no
// images. Detail/list pages read these so the layout has something to render
// while staying obviously a wireframe. Swap freely while iterating on design.

export interface WireEvent {
  id: string;
  name: string;
  dateText: string;
  location?: string;
  goingText?: string;
}

export const wireEvents: WireEvent[] = [
  {
    id: 'evt-1',
    name: 'Placeholder event title one',
    dateText: 'Sat, Jan 10 · 7:00 PM',
    location: 'Venue name, City',
    goingText: '128 going · 210 total',
  },
  {
    id: 'evt-2',
    name: 'Placeholder event title two',
    dateText: 'Sun, Jan 18 · 2:00 PM',
    location: 'Venue name, City',
    goingText: '64 going',
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
];

export interface WireCommunity {
  id: string;
  name: string;
  memberCountText: string;
  description: string;
}

export const wireCommunities: WireCommunity[] = [
  {
    id: 'com-1',
    name: 'Placeholder community one',
    memberCountText: '1.2K members',
    description: 'Short placeholder description of what this community is about.',
  },
  {
    id: 'com-2',
    name: 'Placeholder community two',
    memberCountText: '843 members',
    description: 'Short placeholder description of what this community is about.',
  },
  {
    id: 'com-3',
    name: 'Placeholder community three',
    memberCountText: '5.6K members',
    description: 'Short placeholder description of what this community is about.',
  },
  {
    id: 'com-4',
    name: 'Placeholder community four',
    memberCountText: '209 members',
    description: 'Short placeholder description of what this community is about.',
  },
  {
    id: 'com-5',
    name: 'Placeholder community five',
    memberCountText: '12.4K members',
    description: 'Short placeholder description of what this community is about.',
  },
  {
    id: 'com-6',
    name: 'Placeholder community six',
    memberCountText: '78 members',
    description: 'Short placeholder description of what this community is about.',
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
