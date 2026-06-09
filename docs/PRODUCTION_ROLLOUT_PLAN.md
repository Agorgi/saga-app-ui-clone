# Production rollout plan: porting the clone redesign into `apps/app-web`

Companion to [PRODUCTION_PORT_GUIDE.md](./PRODUCTION_PORT_GUIDE.md) (file-by-file how-to) and
[DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md) (three-layer model). This doc is the **what changed in total,
and the staffed schedule** to ship it. Grounded against the production mirror at commit `bff38ea`
(`main`, "CDN path fixes", 2026-06-07). Production is an active repo, so step 0 is to re-baseline
against live `main`.

## TL;DR

- The redesign splits into **six tracks**. Five are a pure front-end port; one (Interest Check) is a
  new feature with real backend/payments work.
- **The front-end redesign port (nav, feed, events list, create-event, plus the two create-flow
  restyles if approved) is ~2 to 2.5 weeks for three engineers, shipped behind one feature flag.**
- **Interest Check is a separate 3 to 5 week track** (the long pole is payment authorize / capture /
  release on the backend). It must NOT gate the redesign rollout.
- The single biggest risk is the crowd-commissions domain: production already has it. Do not re-port
  it. Only its create-flow restyle (#27, two files) is portable.

## What changed, in its entirety

The clone changes a subset of production's screens. The diff below is the clone's full state vs its
frozen pre-redesign baseline (`f109dac`), which isolates exactly the redesign work. Production has 15
domains; the clone touches 10 and redesigns 6 areas.

| # | Track | What changed | Files | Clone status | Port target? | Top risk |
|---|-------|--------------|-------|--------------|--------------|----------|
| 1 | **Navigation** | Mirrored desktop header (logo+nav left, utilities right), reactive mobile bottom bar that collapses on scroll, mobile top bar simplified (Explore dropdown removed), logo = home. | ~10: `Navbar`, `MobileTopNavbar`, `BottomNavbar`, `GlobalOverlay`, new `useCollapseOnScroll` hook | Merged (#6, #9) | **Yes** | App-wide: nav renders on every screen. Visual regression everywhere. |
| 2 | **Home feed** | Flat post list becomes an interleaved composition (5 posts, 3-event row, 5 posts, 5 communities); in-feed composer prompt removed. | ~9: `HomeFeed/*` (5 new), `MainFeed`, `CreatePostPrompt` (deleted) | Merged (#5, #7) | **Yes** | Highest-traffic screen. Wire to real feed/events/communities queries (not fixtures); watch N+1 + LCP/CLS. The 5/3/5/5 ratio is a product decision to confirm. |
| 3 | **Events list** | "Hot" row + vertical feed; event card image 16:9 to 1:1. | 4: `EventsListPage`, `EventCard` | Merged (#8) | **Yes** | `EventCard` is shared everywhere events render; 1:1 is an app-wide change. |
| 4 | **Create-event flow** | Multi-step wizard becomes a chooser (Paid / Free to RSVP) into a single-page form; inline labels; "Tag communities" typeahead. Two shared primitives gain one optional prop each (`DateTimePicker.triggerLabel`, `PersonnelInviteSection.placeholder`); keep prod's `CommunitySelector`. | ~10: `CreateEventPage` (rewritten), new `CreateEventForm`, 4 wizard sections deleted, 1 stylesheet renamed | Merged (#10) | **Yes** | Additive prop changes are shared (confirm no caller regresses). New routes need `ProtectedRoute`. |
| 5 | **Create-flow restyles** | Post creation becomes a single-page composer (#26); crowd-commission create step 1 becomes content-first (#27, keeps the 3-step wizard). | #26: 6 post-creation files (skip the `Editor` stub); #27: 2 files | Open PRs, **design proposals** | **Only if design approved** | These intentionally diverge from prod. #27 is the *only* portable piece of the crowd-commission stack: diff two files, never touch hooks. |
| 6 | **Interest Check** | New third event option (pre-commit, charge only if threshold is met). UI + a front-end data-shape spec (`interestCheck/types.ts`): threshold, proposed dates, decision date, roles, pledges (authorize/charge/release), DRAFT/OPEN/CONFIRMED/CANCELLED. | ~11 UI files + the chooser's 3rd card | Open PRs, **new feature** | **Yes (UI), plus new backend** | The payment authorize/capture/release lifecycle, persistence, and the decision-date job are net-new backend. The long pole. |

### Not ported (do not carry into production)

- **Crowd-commissions domain (~60 files).** Production already has it at identical paths; the clone
  reproduces it (with the six data hooks stubbed inert) only so the wireframe runs and #27 has a home.
  Copying it back would overwrite prod's real, API-backed hooks. See PORT_GUIDE "Newer work" #1.
- **`CommissionBadge` in posts (3 files)** and the two `PostContent`/`PostEnlargedView` edits that
  render it: part of crowd-commissions, already in prod. Verify and skip.
- **All clone-only infra:** `src/vendor/saga-shims/*`, `src/data/fixtures.ts`, demo `AuthProvider`,
  inert hooks, the `Editor` `editorRef`/`defaultValue` stub, `QuillEditor` stub.
- **Clone tooling:** `vite.config.ts`, `tsconfig.json`, `package.json`, lockfile, `docs/*`, README,
  PR template, and `App.tsx` wholesale (port only the new routes).

## The efficient approach (principles)

1. **One feature flag for the whole redesign.** Production already uses OpenFeature / Flagsmith.
   Build and merge behind a flag, ship dark, enable per cohort. This lets all three engineers merge
   continuously (no big-bang cutover) and gives instant rollback. Interest Check gets its own flag.
2. **Re-baseline against live `main` first.** The mirror is a snapshot; prod is active. The clone is
   the *visual target*; the change to apply is the clone's per-component diff. Confirm path parity
   still holds before porting (Phase 0).
3. **Port the final consolidated state per component, not PR-by-PR.** PORT_GUIDE "Port by component"
   gives one diff per component against `f109dac`.
4. **Strip clone-isms on the way in.** Replace every `@/data/fixtures` read with the real query; drop
   inert hooks/shims/demo auth. This is the #1 source of breakage.
5. **Never touch crowd-commissions** except #27's two files (diff-only, no hooks).
6. **Land the shared-primitive prop adds early** (`DateTimePicker`, `PersonnelInviteSection`): tiny,
   additive, and they unblock create-event and Interest Check. Verify no other caller regresses.
7. **Gate on performance and accessibility**, not just visual match (see gates below).

## Schedule, three engineers

Engineers map to risk profiles: **A** = reliability/infra lead, **B** = performance, **C** =
features/flows. Everything lands behind the redesign flag.

### Phase 0, shared kickoff (about 1 day, Eng A leads)
- Cut the integration branch; create the redesign feature flag and the Interest Check flag.
- Re-diff the clone's six tracks against live `main`; confirm path parity; note any files prod moved.
- Capture performance baselines (LCP, CLS, feed query count, events-list render) to compare against.

### Phase 1, foundation (week 1, parallel)
- **Eng A: Track 1 Navigation.** Highest blast radius (every screen). Port the consolidated `Navbar`,
  `MobileTopNavbar`, `BottomNavbar`, `GlobalOverlay`, `useCollapseOnScroll`; keep prod's real
  `ProfilePictureIcon`. Visual-regression pass across breakpoints.
- **Eng B: Track 2 Home feed (start).** Port `HomeFeed` + `buildHomeFeedItems`; wire to real
  feed/events/communities queries; remove the composer prompt. Profile for N+1 and LCP/CLS.
- **Eng C: Track 4 Create-event flow + the two shared-primitive props.** Land the additive props
  first (unblocks others), then the chooser + single-page form; wrap new routes in `ProtectedRoute`;
  keep prod's `CommunitySelector`.

### Phase 2, screens complete (week 2, parallel)
- **Eng A:** Nav canary to an internal cohort; then start **Track 6 Interest Check backend** (the long
  pole): payment authorize/capture/release, lifecycle persistence, decision-date job.
- **Eng B: Track 3 Events list** (Hot row + vertical feed; `EventCard` 1:1). Confirm the 1:1 change is
  intended everywhere `EventCard` renders. Finish feed perf hardening.
- **Eng C: Track 5 restyles**, only if design has signed off: post-creation single-page (#26, skip the
  `Editor` stub; note it deletes `PostHeaderSection`/`ParentPostInput`) and crowd-commission create
  (#27, two files, diff-only).

### Phase 3, redesign GA (week 2.5 to 3)
- Progressive flag enablement for tracks 1 to 5: internal, then a small percentage, then 100%, with
  the perf/a11y gates green at each step. Rollback = flip the flag.
- **The front-end redesign is done here.** Interest Check continues on its own track.

### Phase 4, Interest Check feature (weeks 3 to 5, its own flag)
- **Eng C:** port the Interest Check UI (reuses the event form; replicate the commission drawer
  pattern) behind the Interest Check flag.
- **Eng A (+ B as needed):** finish the backend (payments lifecycle, persistence, the decision-date
  job and notifications), integration tests, then canary to GA.

## Reliability and performance gates (every track, before flag-on)

- **Behind a flag**, dark by default, with a tested rollback (flip the flag).
- **No `@/data/fixtures`, shim, or inert-hook import** survives the port (grep the diff).
- **Crowd-commissions hooks untouched**; #27 limited to two files.
- **Performance:** feed and events-list LCP/CLS and query count at or below the Phase 0 baseline; feed
  interleaving adds no N+1; list virtualization preserved.
- **Accessibility:** nav and `EventCard` pass the a11y check (contrast, focus order, touch targets) at
  all breakpoints, since both are app-wide.
- **Shared primitives:** `DateTimePicker` and `PersonnelInviteSection` prop defaults reproduce the
  current strings; every existing caller verified unchanged.
- **Per-PR:** typecheck, Biome lint, build, and the monorepo test suite green; one component per PR for
  reviewability.

## Bottom line

Three engineers ship the full visual redesign (nav, feed, events, create-event, and the two restyles
if approved) in about **two to two and a half weeks** behind a flag, with reliability and performance
gates at each step. Interest Check is the only genuine new build; budget **three to five more weeks**
for it on a parallel track, gated by its own flag, without holding up the redesign.
