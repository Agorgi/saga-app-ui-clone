// Placeholder fixtures for the UI wireframe clone.
//
// Everything here is invented filler — no real users, no real content, no
// images. Detail/list pages read these so the layout has something to render
// while staying obviously a wireframe. Swap freely while iterating on design.

import { CommunityMemberRole, type CommunityModerator } from '@saga/community-middleware';
import {
  CommissionType,
  type CrowdCommission,
  CrowdCommissionStatus,
} from '@saga/crowd-commission-middleware';
import type { TeamRow } from '@domains/events/components/EventTeamWidget/EventTeamWidget';
import type { InterestCheck, InterestCheckPledge } from '@domains/events/interestCheck/types';
import type { ScheduleItem } from '@saga/events-middleware';

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
  // Label for the redesigned event card's inert CTA (defaults to "Get tickets").
  ctaLabel?: string;
  // Redesigned event detail page content.
  description?: string;
  guidelines?: string[];
  faqs?: { question: string; answer: string }[];
  // Run-of-show agenda for the schedule timeline (24h "HH:MM" times).
  schedule?: ScheduleItem[];
  // The people running the event, host first, for the "Meet the team" widget.
  team?: TeamRow[];
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
    description:
      'Join us for a night of live sets and community.\nDoors at 7, first act at 8. Come early, stay late, and bring your crew.',
    guidelines: [
      '18+ with valid ID',
      'No professional cameras without a press pass',
      'Respect the space and each other',
    ],
    faqs: [
      { question: 'Is there a dress code?', answer: 'Come as you are. Most people dress up a little.' },
      {
        question: 'Can I get a refund?',
        answer: 'Tickets are refundable up to 48 hours before the event.',
      },
      { question: 'Is re-entry allowed?', answer: 'Yes, keep your wristband on and you can come and go.' },
    ],
    schedule: [
      { time: '19:00', title: 'Doors open', description: 'Grab a drink and find your people.' },
      { time: '20:00', title: 'First act', description: 'Opening set to warm up the room.' },
      { time: '21:30', title: 'Headliner' },
      { time: '23:00', title: 'Late set', description: 'House and afrobeats until close.' },
      { time: '23:45', title: 'Last call' },
    ],
    team: [
      { userId: 'u-host', userName: 'member', displayName: 'Member name', roleLabel: 'Host' },
      { userId: 'u-cohost', userName: 'cohost', displayName: 'Co-host name', roleLabel: 'Co-host' },
      { userId: 'u-staff1', userName: 'staffone', displayName: 'Staff one', roleLabel: 'Door' },
      { userId: 'u-staff2', userName: 'stafftwo', displayName: 'Staff two', roleLabel: 'Sound' },
      { userId: 'u-staff3', userName: 'staffthree', displayName: 'Staff three', roleLabel: 'Bar' },
    ],
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

export interface WireApplicant {
  id: string;
  name: string;
  handle: string;
  message: string;
}

// Applicants to open roles, keyed by role id (WireEvent.openRoles[].id). The host
// review reads these. The apply flow on the event page is inert, so these stand in
// for "who applied."
export const wireRoleApplicants: Record<string, WireApplicant[]> = {
  'role-1a': [
    {
      id: 'app-1a-1',
      name: 'Placeholder Member One',
      handle: 'member_one',
      message:
        'I shoot a lot of nightlife events and would love to capture this one. Portfolio is in my profile.',
    },
    {
      id: 'app-1a-2',
      name: 'Placeholder Member Two',
      handle: 'member_two',
      message: 'Available all night, happy to do candids plus a few setups.',
    },
  ],
  'role-1b': [
    {
      id: 'app-1b-1',
      name: 'Placeholder Member Three',
      handle: 'member_three',
      message: 'House and afrobeats are my main sets. I can bring my own controller.',
    },
  ],
  'role-1c': [
    {
      id: 'app-1c-1',
      name: 'Placeholder Member Four',
      handle: 'member_four',
      message: 'Done door and check-in for a few shows, fast with a guest list.',
    },
    {
      id: 'app-1c-2',
      name: 'Placeholder Member Five',
      handle: 'member_five',
      message: 'Reliable and on time, happy to cover the whole night.',
    },
  ],
};

// General "open to crew" applicants, not tied to a specific role.
export const wireGeneralApplicants: WireApplicant[] = [
  {
    id: 'app-gen-1',
    name: 'Placeholder Member Six',
    handle: 'member_six',
    message:
      'No specific role in mind, but I help produce events often and would love to pitch in.',
  },
];

export interface WireCrewMember {
  id: string;
  name: string;
  handle: string;
  fromRole?: string;
  fromEvent?: string;
  note?: string;
}

// The host's saved crew (the "crew database"). People saved from past open-role
// applications collect here for reuse on future events.
export const wireCrew: WireCrewMember[] = [
  {
    id: 'crew-1',
    name: 'Placeholder Member Seven',
    handle: 'member_seven',
    fromRole: 'Photographer',
    fromEvent: 'Placeholder event title three',
    note: 'Great in low light, fast turnaround.',
  },
  {
    id: 'crew-2',
    name: 'Placeholder Member Eight',
    handle: 'member_eight',
    fromRole: 'DJ',
    fromEvent: 'Placeholder event title five',
  },
  {
    id: 'crew-3',
    name: 'Placeholder Member Nine',
    handle: 'member_nine',
    fromRole: 'Open to crew',
    fromEvent: 'Placeholder event title two',
    note: 'Reliable all-rounder, helped with setup and door.',
  },
];

export interface WireCommunity {
  id: string;
  name: string;
  memberCountText: string;
  description: string;
  // Total member count for the members widget/modal (drives the "+N" overflow
  // pill and the modal's header count). Falls back to a default when absent.
  memberCount?: number;
}

// Shared placeholder member roster for the community members widget + modal.
// Invented handles only. A couple carry ADMIN / MODERATOR roles so the modal's
// "Owner" / "Mod" badges render; the rest are plain members.
export const wireCommunityMembers: CommunityModerator[] = [
  { userId: 'cm-1', communityId: 'com', role: CommunityMemberRole.ADMIN, user: { id: 'cm-1', userName: 'aria', displayName: 'Aria Okafor' } },
  { userId: 'cm-2', communityId: 'com', role: CommunityMemberRole.MODERATOR, user: { id: 'cm-2', userName: 'kenji', displayName: 'Kenji Tanaka' } },
  { userId: 'cm-3', communityId: 'com', role: CommunityMemberRole.MODERATOR, user: { id: 'cm-3', userName: 'lume', displayName: 'Lume Rivera' } },
  { userId: 'cm-4', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-4', userName: 'sana', displayName: 'Sana Bright' } },
  { userId: 'cm-5', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-5', userName: 'devon', displayName: 'Devon Cole' } },
  { userId: 'cm-6', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-6', userName: 'mira', displayName: 'Mira Sound' } },
  { userId: 'cm-7', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-7', userName: 'juno', displayName: 'Juno Park' } },
  { userId: 'cm-8', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-8', userName: 'theo', displayName: 'Theo Vance' } },
  { userId: 'cm-9', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-9', userName: 'nova', displayName: 'Nova Kim' } },
  { userId: 'cm-10', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-10', userName: 'rex', displayName: 'Rex Idowu' } },
  { userId: 'cm-11', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-11', userName: 'wren', displayName: 'Wren Adeyemi' } },
  { userId: 'cm-12', communityId: 'com', role: CommunityMemberRole.MEMBER, user: { id: 'cm-12', userName: 'iko', displayName: 'Iko Santos' } },
];

// Placeholder communities. Names are public franchises / topics (no real user
// data) chosen to span the alphabet so the create-event "Tag communities"
// autocomplete has something to filter against (e.g. typing "chain" surfaces
// "Chainsaw Man").
export const wireCommunities: WireCommunity[] = [
  {
    id: 'com-1',
    name: 'Chainsaw Man',
    memberCountText: '52 members',
    description: 'Fans of the manga and anime trade theories, art, and cosplay.',
    memberCount: 52,
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
  // Links this post to a crowd commission; renders the CommissionBadge on the post.
  // Mirrors production's Post.crowdCommissionId.
  crowdCommissionId?: string;
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
    crowdCommissionId: 'cc-1',
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
  // Follow counts for the redesigned profile stats card.
  followerCount: number;
  followingCount: number;
  // Social links for the sidebar icon strip (parsed by platform).
  socialLinks: ReadonlyArray<{ url: string }>;
}

export const wireProfile: WireProfile = {
  username: 'member',
  displayName: 'Member name',
  handle: '@member',
  bio: 'Placeholder bio line that describes this member in a sentence or two.',
  location: 'City, Country',
  followersText: '1,204 followers',
  followingText: '317 following',
  followerCount: 1204,
  followingCount: 317,
  socialLinks: [
    { url: 'https://instagram.com/member' },
    { url: 'https://x.com/member' },
    { url: 'https://tiktok.com/@member' },
    { url: 'https://member.example.com' },
  ],
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

// Placeholder crowd commissions. A crowd commission is a creator-funded ask the community
// backs; production interleaves them into the feed alongside posts. These stand-ins span a
// range of statuses and funding states so the cards, status badges, funding bars, and detail
// sheet all have something representative to render. No real users, amounts, or images.
// Deadlines are relative to now so the countdown pills read live.
function isoInDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function wireRichText(text: string): CrowdCommission['description'] {
  return { type: 'richText', ops: [{ insert: `${text}\n` }] };
}

let wireCommissionSeq = 0;
function makeWireCommission(
  overrides: Partial<CrowdCommission> & Pick<CrowdCommission, 'title'>,
): CrowdCommission {
  wireCommissionSeq += 1;
  return {
    id: `cc-${wireCommissionSeq}`,
    creatorId: 'creator',
    commissionType: CommissionType.STANDARD,
    caption: null,
    description: null,
    heroImageUrl: null,
    endResultMediaIds: null,
    endResultDescription: null,
    goalAmountCents: null,
    fundingDeadlineAt: null,
    currency: 'usd',
    platformFeeBps: 500,
    winnerOptionId: null,
    pendingWinnerAt: null,
    status: CrowdCommissionStatus.ACTIVE,
    publishedAt: null,
    completedAt: null,
    failedAt: null,
    totalCollectedCents: 0,
    totalRefundedCents: 0,
    totalDisbursedCents: 0,
    backerCount: 0,
    publishGeneration: 1,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resultPost: null,
    pollOptions: null,
    ...overrides,
  };
}

export const wireCommissions: CrowdCommission[] = [
  makeWireCommission({
    title: 'Placeholder commission: animated opening sequence',
    description: wireRichText(
      'Placeholder brief for a community-funded animated opening. Stands in for a real commission description while the layout is built.',
    ),
    goalAmountCents: 300_000,
    totalCollectedCents: 124_000,
    backerCount: 84,
    fundingDeadlineAt: isoInDays(12),
  }),
  makeWireCommission({
    title: 'Placeholder poll: what should I create next?',
    commissionType: CommissionType.POLL,
    caption: 'Vote for the next piece. The top option wins after the deadline.',
    fundingDeadlineAt: isoInDays(5),
    totalCollectedCents: 28_000,
    backerCount: 56,
    pollOptions: [
      {
        id: 'cc-poll-opt-1',
        commissionId: 'cc-poll',
        text: 'Cosmic knight',
        imageUrl: null,
        displayOrder: 0,
        voteCount: 24,
        voterCount: 18,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cc-poll-opt-2',
        commissionId: 'cc-poll',
        text: 'Neon city street',
        imageUrl: null,
        displayOrder: 1,
        voteCount: 41,
        voterCount: 33,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cc-poll-opt-3',
        commissionId: 'cc-poll',
        text: 'Forest spirit at dusk',
        imageUrl: null,
        displayOrder: 2,
        voteCount: 15,
        voterCount: 12,
        createdAt: new Date().toISOString(),
      },
    ],
  }),
  makeWireCommission({
    title: 'Placeholder commission: original character illustration set',
    description: wireRichText(
      'Placeholder brief for an illustration set. This one is overfunded to show the milestone tier styling on the funding bar.',
    ),
    goalAmountCents: 200_000,
    totalCollectedCents: 450_000,
    backerCount: 312,
    fundingDeadlineAt: isoInDays(1),
  }),
  makeWireCommission({
    title: 'Placeholder commission: fan-zine cover art',
    description: wireRichText(
      'Placeholder brief with no funding goal set, to show the goalless backer-count layout on the card.',
    ),
    totalCollectedCents: 36_000,
    backerCount: 12,
    fundingDeadlineAt: isoInDays(20),
  }),
  makeWireCommission({
    title: 'Placeholder commission: short comic, delivered',
    description: wireRichText(
      'Placeholder brief for a completed commission, to show the completed status badge and tap hint.',
    ),
    status: CrowdCommissionStatus.COMPLETED,
    goalAmountCents: 150_000,
    totalCollectedCents: 162_000,
    backerCount: 140,
    completedAt: new Date().toISOString(),
    fundingDeadlineAt: isoInDays(-3),
  }),
  makeWireCommission({
    title: 'Placeholder commission: vinyl sleeve design',
    description: wireRichText(
      'Placeholder brief for a commission that did not reach its goal, to show the failed status styling.',
    ),
    status: CrowdCommissionStatus.FAILED,
    goalAmountCents: 500_000,
    totalCollectedCents: 90_000,
    backerCount: 23,
    failedAt: new Date().toISOString(),
    fundingDeadlineAt: isoInDays(-1),
  }),
];

// Placeholder event Interest Checks. A host proposes an event; people pre-commit (card
// authorized, not charged); it confirms and charges only if the threshold is met by the
// decision date. These cover each lifecycle state so the detail view is demoable. No real
// users, amounts, or payments. Dates are relative to now so countdowns read live.
function icIsoInDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

let wireIcPledgeSeq = 0;
function makeIcPledges(
  count: number,
  amountCents: number,
  state: InterestCheckPledge['state'],
  dateChoice: string[] = [],
): InterestCheckPledge[] {
  return Array.from({ length: count }, () => {
    wireIcPledgeSeq += 1;
    return {
      id: `icp-${wireIcPledgeSeq}`,
      userName: `Member ${wireIcPledgeSeq}`,
      dateChoice,
      authorizedAmountCents: amountCents,
      state,
    };
  });
}

export const wireInterestChecks: InterestCheck[] = [
  // OPEN, single fixed date, below threshold (in progress).
  {
    id: 'ic-1',
    title: 'Rooftop film night',
    location: 'Downtown rooftop, City',
    description: 'A pop-up outdoor screening, but only if enough people are in.',
    coHostIds: [],
    staffIds: [],
    communityIds: [],
    proposedDates: [{ id: 'ic1-d1', at: icIsoInDays(14), timezone: 'UTC' }],
    ticketPriceCents: 2500,
    threshold: { value: 30, unit: 'people' },
    decisionDate: icIsoInDays(7),
    roles: [
      { id: 'ic1-r1', name: 'Photographer', count: 1, note: 'Capture the night' },
      { id: 'ic1-r2', name: 'Volunteer', count: 3 },
    ],
    status: 'open',
    pledges: makeIcPledges(18, 2500, 'authorized', ['ic1-d1']),
    applications: [{ id: 'ic1-a1', roleId: 'ic1-r1', userName: 'Member 41', state: 'pending' }],
  },
  // OPEN, multiple proposed dates (a date vote), threshold as a $ amount.
  {
    id: 'ic-2',
    title: 'Community art jam',
    location: 'Maker space, City',
    description: 'Pick the date that works for you; it happens if we hit the goal.',
    coHostIds: [],
    staffIds: [],
    communityIds: [],
    proposedDates: [
      { id: 'ic2-d1', at: icIsoInDays(10), timezone: 'UTC' },
      { id: 'ic2-d2', at: icIsoInDays(12), timezone: 'UTC' },
      { id: 'ic2-d3', at: icIsoInDays(17), timezone: 'UTC' },
    ],
    ticketPriceCents: 4000,
    threshold: { value: 2000, unit: 'amount' },
    decisionDate: icIsoInDays(5),
    roles: [{ id: 'ic2-r1', name: 'Illustrator', count: 2 }],
    status: 'open',
    pledges: [
      ...makeIcPledges(8, 4000, 'authorized', ['ic2-d2']),
      ...makeIcPledges(5, 4000, 'authorized', ['ic2-d1', 'ic2-d2']),
      ...makeIcPledges(3, 4000, 'authorized', ['ic2-d3']),
    ],
    applications: [],
  },
  // CONFIRMED, single date, threshold met, pledgers charged.
  {
    id: 'ic-3',
    title: 'Supper club: ramen night',
    location: 'Test kitchen, City',
    description: 'We hit the goal, so it is on.',
    coHostIds: [],
    staffIds: [],
    communityIds: [],
    proposedDates: [{ id: 'ic3-d1', at: icIsoInDays(9), timezone: 'UTC' }],
    ticketPriceCents: 2000,
    threshold: { value: 25, unit: 'people' },
    decisionDate: icIsoInDays(-1),
    roles: [{ id: 'ic3-r1', name: 'Promoter' }],
    status: 'confirmed',
    winningDateId: 'ic3-d1',
    pledges: makeIcPledges(32, 2000, 'charged', ['ic3-d1']),
    applications: [{ id: 'ic3-a1', roleId: 'ic3-r1', userName: 'Member 70', state: 'accepted' }],
  },
  // CANCELLED, threshold not met, authorizations released.
  {
    id: 'ic-4',
    title: 'Weekend hack day',
    location: 'Coworking, City',
    description: 'Did not reach enough interest this time.',
    coHostIds: [],
    staffIds: [],
    communityIds: [],
    proposedDates: [{ id: 'ic4-d1', at: icIsoInDays(-2), timezone: 'UTC' }],
    ticketPriceCents: 1500,
    threshold: { value: 50, unit: 'people' },
    decisionDate: icIsoInDays(-1),
    roles: [],
    status: 'cancelled',
    pledges: makeIcPledges(12, 1500, 'released', ['ic4-d1']),
    applications: [],
  },
];
