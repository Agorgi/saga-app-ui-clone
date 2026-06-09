# Production port guide

How to lift the merged design changes in this clone into production `apps/app-web`
(`Try-Saga/saga`) with the least possible work.

This is the companion to [DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md). That doc explains how a
designer **makes** a change here. This doc explains how an engineer **ports** the changes that
have already merged. Read DESIGN_HANDOFF.md first for the three-layer model and the mirror rules;
this guide assumes them.

Scope: the seven merged PRs on `main` (#1, #5, #6, #7, #8, #9, #10). #1 is scaffolding for this
repo only and is never ported. #5 through #10 are the design changes. A later wave of work
(PRs #19 to #29) is built and reviewable but not yet merged to `main`; see "Newer work" below.

## Newer work (PRs #19 to #29, not yet merged)

A later batch is open as PRs #19 to #29 and combined on the `demo/all-features` branch (one runnable
build of everything). It is NOT on `main`, so it does not appear when you run `main`; check out
`demo/all-features` to see and click through all of it. The batch falls into three categories that
port very differently. Read this section before you touch any of it, because the largest category
(crowd commissions) is **not a port target at all.**

### 1. Crowd commissions (PRs #19 to #25): a reproduction of an existing production domain, NOT a port target

Production already has the full `apps/app-web/src/domains/crowd-commissions/` domain. This clone did
not invent it; PRs #19 to #25 **reproduce** that existing domain inside the wireframe (with the data
hooks stubbed inert) for two reasons only: so the clone app is feature-complete to click through, and
so the create-flow restyle in #27 has a surface to sit on. **Do not port PRs #19 to #25 back into
production.** Every file in them already exists in production at the identical path, and production's
versions are the real, API-backed source of truth.

This was verified file-by-file against the production mirror: all crowd-commission files in the clone
collide 1:1 with existing production files, and the clone's six data hooks
(`hooks/useCrowdCommission*`, `hooks/usePoll*`) are **inert stubs** that are far smaller than
production's real react-query / `@saga/api-web` hooks. Copying the clone's hooks over production's
would delete the feature's entire backend wiring.

The "Production file mapping (1:1)" tables inside PRs #19 to #25 are **provenance** (where each file
was copied from in production), not an instruction to copy them the other way. Treat those PRs as a
reference for what the clone contains, not as a porting checklist.

The only portable thing in this whole stack is the #27 restyle, covered next.

### 2. Create-flow restyles (PRs #26, #27): design proposals, diff-only

Two proposals to make the create flows feel like the event creation form. Both intentionally diverge
from production, so they are **adopt-if-approved**, not copy-the-diff mirrors.

- **#26, post creation.** Production's `CreatePost` is a 3-step wizard; this makes it a single-page
  composer (tabbed Image / Text / Video, the title directly above the upload box, inline caption, pill
  row). If adopted, it **replaces** production's wizard page. This PR also deletes `PostHeaderSection`
  and `ParentPostInput`, which the single-page layout orphaned (the editable parent-post field became
  a read-only "Collab on: ..." note); production keeps both unless you adopt this restyle.
- **#27, crowd-commission create.** This is the one portable piece of the crowd-commission stack, and
  it is small: it keeps production's existing 3-step wizard and only restyles step 1 (a borderless
  composer-style title leads, the step header is dropped, the cover image is more prominent). Two
  files change: `crowd-commissions/wizard/WizardComponents.tsx` (BasicsStep) and the create page
  `.module.scss`. **Diff those two files against production and lift only the visual delta. Do not
  touch any hook, type, or the inert infra around them.**

### 3. Interest Check (PRs #28, #29): brand-new feature

A new event "Interest Check" option (a third card in the event chooser, beside Paid and Free to RSVP)
that does not exist in production. The clone is the **UI plus a front-end data-shape spec**
(`src/domains/events/interestCheck/types.ts`): threshold (# people or $ amount), ticket price,
proposed dates, decision date, open roles, pledges (authorize / charge / release), applications, and
the DRAFT / OPEN / CONFIRMED / CANCELLED lifecycle (local state + fixtures). The authorize, capture,
and release payment lifecycle and the persistence are to be built on the backend; the UI reuses the
event form and replicates the commission drawer's visual pattern. Port the UI and the `types.ts`
shape; do not port the fixtures or the local-state reducers.

### Clone-only infra none of the above should carry into production

Shared by the batch, never ported: the `src/vendor/saga-shims/*` shims (`crowd-commission-middleware`,
`quill`, `config-web`, etc.; production has the real packages at the same import path), the inert
data hooks, `src/data/fixtures.ts` (including `wireCommissions` and `wireInterestChecks`), the
`@domains/post-creation/ui/Editor/Editor` `editorRef` / `defaultValue` stub (production's real Quill
Editor already satisfies that interface), and the demo `AuthProvider`.

### Branch and merge order

`demo/all-features` already has all three categories merged for preview. If you assemble them onto a
branch yourself, the order is: the crowd-commission stack (#19 to #25) in sequence, then #27 on top;
#26 independently off `main`; the Interest Check stack (#28 then #29). This is the order to **stack
the branches**, not a list of things to port: of the eleven PRs, only #27 (two files), #26 (if the
post restyle is approved), and #28 / #29 (the new Interest Check UI) are candidates to lift into
production.

## Start here (first read)

New to this repo? Read in this order before porting anything.

1. **What this repo is, in one line:** a UI-only wireframe that mirrors `apps/app-web` folder-for-folder
   and class-for-class, with placeholder data and no backend. Every file here sits at the same path it
   would occupy in `apps/app-web`.
2. **Run it:** `npm install && npm run dev`, then open http://localhost:3000. `main` is the finished,
   runnable design and is the visual target you are porting. See [README.md](../README.md) for the
   screen and route map.
3. **Read [DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md)** for the three-layer model (global tokens, shared
   primitives, app screens) and the two mirror rules: never hardcode a value a token exists for, and
   keep the DOM and class names identical to production. Those rules are why this port is mostly
   copy-the-diff.
4. **Then work through this guide** for the file-by-file plan.

The single most useful fact: all design work is already merged to `main`, so you port **from `main`'s
final state**, one component at a time, using the table in "Port by component, not by PR." You never
replay the individual design PRs in sequence.

## Audit verdict

The clone was audited file-by-file against the production mirror. Result: **clean and liftable.**

- **Paths map 1:1.** Every modified clone file sits at the identical path in `apps/app-web`. Every
  deleted file exists in production (verify-then-delete is safe). Every added file is absent in
  production (no collisions). The one renamed file is called out in the #10 table below.
- **Almost everything is App-screen layer (layer 3).** Edits land in `src/domains/*` and
  `src/components/*`, which map straight to the same paths in `apps/app-web`.
- **Zero token changes.** No PR touched `tokens.scss`. The visual foundation
  (`--precedent-*` custom properties) is untouched, so there is no design-system color/type/spacing
  drift to reconcile.
- **Two shared primitives changed, both additive and backward-compatible.** `DateTimePicker` and
  `PersonnelInviteSection` each gained one optional prop with a default that reproduces production's
  current behavior. Existing callers are unaffected. See "Shared additive prop changes" below.
- **No user-facing copy contains an em dash.** Per the Saga copy rule, all user-visible strings use
  commas or parentheses. (Em dashes appear only inside code comments and placeholder fixture prose,
  which are not ported.)

Net: this is a copy-the-diff job, not a reverse-engineering job, with a short, bounded reconciliation
list. The rest of this guide is that list.

## How to use this guide

1. Read "Global reconciliation rules" once. It covers what is **not** portable (clone tooling, stubs,
   fixtures, demo auth) so you do not waste time on it.
2. Read "Components to keep production's version." Two components were reimplemented in the clone to
   drop a runtime dependency; production keeps its own. You port only the wiring.
3. Port PRs in merge order (#5 first, #10 last). Each per-PR section lists every file with an action
   and a port note.
4. For files touched by more than one PR (the nav files, `fixtures.ts`), port the **current `main`
   state** of the file, not the intermediate per-PR diffs. See "Port by component, not by PR" below
   for one consolidated diff per component.
5. Run the final verify checklist before opening your production PR.

## Port by component, not by PR

All seven PRs are already merged to `main`, so `main` holds the final, consolidated state of every
file. **Port one component at a time from that final state. Do not replay the PRs in sequence.**
Replaying is the only thing that creates "same file across multiple PRs" confusion; porting the
final state removes it, because each file appears exactly once.

The design PRs were scoped by visual change (e.g. "reorder the header," "remove the composer
prompt"), not strictly by component, so a few components were touched by more than one PR. For
porting that does not matter: take the whole component as it stands on `main`. To pull the complete
consolidated diff for one component against the pre-redesign baseline (`f109dac`):

```
git diff f109dac..main -- <component paths>
```

| Component | Paths | Contributing PRs | Consolidated diff command |
|---|---|---|---|
| Mobile bottom navbar | `src/components/BottomNavbar/`, `src/hooks/useCollapseOnScroll.ts`, `src/components/GlobalOverlay/GlobalOverlay.module.scss` | #6 only | `git diff f109dac..main -- src/components/BottomNavbar src/hooks/useCollapseOnScroll.ts src/components/GlobalOverlay/GlobalOverlay.module.scss` |
| Mobile top navbar | `src/components/MobileTopNavbar/` | #6, #7 | `git diff f109dac..main -- src/components/MobileTopNavbar` |
| Desktop header (Navbar) | `src/components/Navbar/` | #6, #9 | `git diff f109dac..main -- src/components/Navbar` |
| Home feed | `src/domains/posts/` | #5, #7 | `git diff f109dac..main -- src/domains/posts` |
| Event card + list | `src/domains/events/EventsListPage/`, `src/domains/events/components/EventCard/` | #8 only | `git diff f109dac..main -- src/domains/events/EventsListPage src/domains/events/components/EventCard` |
| Create-event flow | `src/domains/events/CreateEventPage/`, `src/domains/events/sections/`, `src/domains/events/components/EventFormStepIndicator/`, `src/domains/events/styles/` | #10 only | `git diff f109dac..main -- src/domains/events/CreateEventPage src/domains/events/sections src/domains/events/components/EventFormStepIndicator src/domains/events/styles` |
| Shared: DateTimePicker | `src/components/DateTimePicker/` | #10 | `git diff f109dac..main -- src/components/DateTimePicker` |
| Shared: CommunitySelector | `src/components/CommunitySelector/` | #10 | Keep production's version (do not diff-port). |

Each row is a self-contained review unit. The mobile bottom navbar, event card + list, and
create-event flow are each isolated to one PR already; the mobile top navbar, desktop header, and
home feed each consolidate two PRs into one final state. Either way, one component equals one diff.

If you prefer the GitHub diff UI to the command line, each component's consolidated diff is also
preserved as a closed, review-only pull request (#12 through #18). Each one compares a single
component against the frozen pre-redesign baseline (the `handoff/baseline` branch, pinned at commit
`f109dac`). Those PRs are a review lens only: they are not buildable or mergeable on their own (the
clone-only `fixtures.ts` and cross-surface dependencies live on `main`), which is why they are kept
closed rather than open. The `git diff f109dac..main` commands above are the source of truth.

## Global reconciliation rules

These apply to every PR below.

- **Do not port clone tooling.** Vite config, `package.json` scripts, npm lockfile, `tsconfig` path
  aliases that exist only here. Production is Bun + Biome + its own build. The clone's aliases
  (`@domains/*`, `@components/*`, `@saga/global-web`) already match production's, so import lines
  usually need no change; just confirm against `apps/app-web/tsconfig`.
- **Do not port `@saga/*` vendored stubs.** This repo vendors a thin `@saga/global-web` under
  `src/vendor/` so it can build with no backend. Production has the real package at the same import
  path. Imports like `import { Button } from '@saga/global-web'` resolve to the real package
  unchanged. Just confirm each primitive used (Button, LoadingSymbol, etc.) exists in the real
  package version you target.
- **Do not port `src/data/fixtures.ts`.** It is placeholder content for the wireframe only
  (`wireEvents`, `wireCommunities`, `wirePosts`, `wireUsers`, `wireProfile`). Anywhere a ported
  component imports from `@/data/fixtures`, rewire it to the real data source (feed query, events
  query, `getUserCommunities`, etc.). The fixture shapes were chosen to resemble the real DTOs to
  make that swap mechanical, but the swap is yours to make.
- **Do not port the demo auth.** This repo fakes sign-in via a demo `AuthProvider` so authenticated
  surfaces render. Production uses the real auth + `ProtectedRoute`. Route additions in #10 must be
  wrapped in production's `ProtectedRoute`, matching the existing `/events/create` route.
- **Do not port `src/App.tsx` wholesale.** The clone's `App.tsx` is a simplified router with no
  providers. Port only the specific route additions called out in #10 into production's real
  `App.tsx` (which has OpenFeature, Flagsmith, permissions, notification, view-type, and home-tab
  providers plus `ProtectedRoute`).
- **Strip clone-only comments on the way in.** Many files carry comments that begin "Wireframe
  clone:" or "Mirrors the source's ..." explaining how the clone stands in for production behavior.
  Those are scaffolding notes for this repo and should not land in production. Keep any comment that
  explains a non-obvious design decision; drop the ones that only explain the clone/production
  relationship.
- **Docs and PR template do not port.** `docs/*`, `.github/pull_request_template.md` are clone-only.

## Components to keep production's version

Two components were reimplemented in the clone purely to remove a runtime dependency the wireframe
could not satisfy. **Keep production's implementation of both.** Port only the call-site usage and
the additive prop.

### `CommunitySelector` (`src/components/CommunitySelector/CommunitySelector.{tsx,scss}`)

- Production is a `react-select-async-paginate` multi-select backed by `getUserCommunities(userId)`
  and `useAuth`. The clone reimplements the same typeahead over the local `wireCommunities` fixture
  because it has no network. **Keep production's version entirely.**
- **The prop interface is byte-identical** between clone and production:
  `selectedCommunityIds`, `onSelectionChange`, `maxSelection?`, `label?`, `excludeCommunityIds?`
  (all `readonly`). This was deliberate so production's component is a drop-in at the new call site.
  Port only the call site in `CreateEventForm.tsx`, not the component.
- **One caveat to decide on.** The new form passes `label=""` (empty string) to hide the label,
  because the "Tag communities" pill above the field already names it. Production's `CommunitySelector`
  renders a `<label htmlFor>` **unconditionally**, so `label=""` would render an empty `<label>`
  element. The clone avoided this by treating `label === undefined` as "use default" and any explicit
  string (including `""`) as "render what you were given," plus conditionally rendering the label
  wrapper. Two clean options for production:
  1. Pass a real, short label at the call site instead of `""` (simplest, no component change), or
  2. Adopt the clone's `label === undefined ? default : label` + conditional-render pattern in
     production's component (a small, safe change if you want the pill-only look).
  Either is fine; pick per your design intent. Do not ship an empty `<label>`.
- **Default-label copy:** production's default label puts an em dash between "optional" and "max N".
  The clone uses a comma instead (`Communities (optional, max N)`) to satisfy the Saga copy rule. If
  this default is ever surfaced in production, switch it to the comma form. (In the new form the
  default is not shown, so this only matters if production reuses the selector elsewhere with no
  label.)

### `PersonnelInviteSection` (`src/domains/events/sections/PersonnelInviteSection.tsx`)

- Production is the full API-coupled version (`searchUsers`, `invitePersonnel`, `getPersonnel`,
  `removePersonnel`, `cancelPersonnelInvite`, `useAuth`, toast, edit-mode, co-host/staff roles).
  **Keep production's version.** The clone only changed one thing: it added a `placeholder?` prop.
  See the next section.

## Shared additive prop changes (layer 2, flag in review)

Both changes are additive and backward-compatible. They live in shared primitives, so they have
cross-client blast radius: route them to the shared package and confirm no other caller regresses.
Neither changes existing behavior because each default reproduces the current production string.

### `DateTimePicker` (`src/components/DateTimePicker/DateTimePicker.tsx`)

- Add one optional prop: `readonly triggerLabel?: string;`.
- Default it to the string production already renders: `'Choose a date & time'` (production renders
  `Choose a date &amp; time` at the trigger today; the default keeps that exact text).
- Swap the hardcoded trigger placeholder for `{triggerLabel}`.
- The new create-event form passes `triggerLabel="Select a date"`. Every existing caller omits the
  prop and gets the original text. Net diff is roughly five lines.

### `PersonnelInviteSection` (`src/domains/events/sections/PersonnelInviteSection.tsx`)

- Add one optional prop: `readonly placeholder?: string;`.
- Change the computed search placeholder from
  `` `Search to invite as ${ROLE_LABELS[selectedRole].toLowerCase()}...` `` to
  `` placeholder ?? `Search to invite as ${ROLE_LABELS[selectedRole].toLowerCase()}...` ``.
- The new form passes `placeholder="Team, enter email or phone number"`. Every existing caller omits
  the prop and gets the original computed text. Net diff is two lines on top of production's file.

## Per-PR port plans

Port in this order. Action key: **M** modify in place, **A** add new file, **D** delete after
confirming no other importer, **R** rename/move.

### PR #5: Compose the home feed

Design intent: the home feed renders as an interleaved composition (5 posts, then a 3-event row,
then 5 posts, then 5 community listings) instead of a flat post list.

| Action | Path | Port note |
|---|---|---|
| M | `src/domains/posts/MainFeed.tsx` | Swap the flat list render for `<HomeFeed />`. In production, wire `HomeFeed` to the real feed/events/communities queries, not fixtures. |
| A | `src/domains/posts/ui/HomeFeed/HomeFeed.tsx` | New composition component. Port the JSX + the interleave order; replace its fixture reads with real data. |
| A | `src/domains/posts/ui/HomeFeed/HomeFeed.module.scss` | New styles. Port as-is. |
| A | `src/domains/posts/ui/HomeFeed/buildHomeFeedItems.ts` | Pure interleave helper (post/event/community ordering). Port the ordering logic; feed it real items. |
| A | `src/domains/posts/ui/HomeFeed/FeedCommunityCard.tsx` | New in-feed community listing card. Port; rewire to the real community DTO. |
| A | `src/domains/posts/ui/HomeFeed/FeedCommunityCard.module.scss` | New styles. Port as-is. |
| M | `src/data/fixtures.ts` | **Do not port.** Clone-only placeholder expansion. |

Flag: the composition ratio (5/3/5/5) is a product decision encoded in `buildHomeFeedItems.ts`.
Confirm it matches the intended production behavior before wiring it to live data.

Overlap: `MainFeed.tsx` is also touched by #7. Port the current `main` state of the file once.

### PR #6: Redesign navigation

Design intent: mirrored desktop header and a reactive mobile bottom bar; the old mobile Explore
dropdown is removed; the bottom bar collapses on scroll.

| Action | Path | Port note |
|---|---|---|
| M | `src/components/Navbar/Navbar.tsx` | Desktop header restructure. Port current `main` state (also touched by #9). |
| M | `src/components/Navbar/Navbar.module.scss` | Header styles. Port current `main` state (also touched by #9). |
| M | `src/components/MobileTopNavbar/MobileTopNavbar.tsx` | Mobile top bar simplification. Port current `main` state (also touched by #7). |
| M | `src/components/MobileTopNavbar/MobileTopNavbar.module.scss` | Mobile top bar styles. Port current `main` state (also touched by #7). |
| M | `src/components/BottomNavbar/BottomNavbar.tsx` | Reactive bottom bar. Uses the new `useCollapseOnScroll` hook. |
| M | `src/components/BottomNavbar/BottomNavbar.module.scss` | Bottom bar styles. Port as-is. |
| M | `src/components/GlobalOverlay/GlobalOverlay.module.scss` | Small overlay spacing change to accommodate the bottom bar. Port as-is. |
| A | `src/hooks/useCollapseOnScroll.ts` | New scroll-direction hook. Port as-is; no fixture or auth dependency. |
| D | `src/components/MobileTopNavbar/ExploreTabWithDropdown.tsx` | Delete after confirming no other importer in `apps/app-web`. |
| D | `src/components/MobileTopNavbar/ExploreTabWithDropdown.module.scss` | Delete with the above. |

Flag: nav uses a profile affordance. The clone may render a generic avatar; production should keep
its real `ProfilePictureIcon` (do not swap it for the clone's primitive). Verify the avatar element
when porting `Navbar.tsx`.

### PR #7: Remove composer prompt

Design intent: drop the "create post" prompt at the top of the feed so the feed leads with the first
post; the mobile top bar becomes fixed rather than sticky.

| Action | Path | Port note |
|---|---|---|
| M | `src/domains/posts/MainFeed.tsx` | Remove the composer-prompt render. Port current `main` state (also touched by #5). |
| M | `src/domains/posts/MainFeed.module.scss` | Spacing cleanup after removal. Port as-is. |
| M | `src/components/MobileTopNavbar/MobileTopNavbar.module.scss` | `position: sticky` to `fixed`. Port current `main` state (also touched by #6). |
| D | `src/domains/posts/ui/CreatePostPrompt/CreatePostPrompt.tsx` | Delete after confirming no other importer. The create-post entry point still exists elsewhere (bottom-bar / create modal); only the in-feed prompt is removed. |
| D | `src/domains/posts/ui/CreatePostPrompt/CreatePostPrompt.module.scss` | Delete with the above. |

### PR #8: Events page

Design intent: events list gets a "Hot" row plus a vertical feed, and event card images go from 16:9
to 1:1.

| Action | Path | Port note |
|---|---|---|
| M | `src/domains/events/EventsListPage/EventsListPage.tsx` | Hot row + vertical feed layout. Wire to real events data in production, not fixtures. |
| M | `src/domains/events/EventsListPage/EventsListPage.module.scss` | Layout styles. Port as-is. |
| M | `src/domains/events/components/EventCard/EventCard.module.scss` | One line: `.thumbnailWrap` `aspect-ratio: 16 / 9` to `1 / 1`. |
| M | `src/domains/events/components/EventCard/EventCard.tsx` | Comment-only tweak alongside the SCSS change. |

Flag: `EventCard` is shared across every surface that lists events. The 1:1 aspect ratio is an
app-wide visual change. Confirm it is intended everywhere `EventCard` renders, not just on the events
list.

### PR #9: Reorder desktop header

Design intent: desktop header places logo + nav links on the left and utilities on the right.

| Action | Path | Port note |
|---|---|---|
| M | `src/components/Navbar/Navbar.tsx` | Header element reorder. Port current `main` state (combined with #6). |
| M | `src/components/Navbar/Navbar.module.scss` | Header layout styles. Port current `main` state (combined with #6). |

Overlap: #6 and #9 both edit the two `Navbar` files. Port the single current `main` state of each;
do not apply #6 and #9 as separate sequential diffs.

### PR #10: Create-event flow

Design intent: replace the multi-step wizard with a chooser ("is your event paid or free?") that
leads to a single-page form. The paid and free variants share one form; the free variant hides the
ticket-pricing section. Field labels move inline (placeholders inside inputs). "Tag communities" is a
typeahead multi-select (the `CommunitySelector`).

> **Correction to the original PR #10 description.** The merged code differs from that PR's writeup.
> The extras pill row is **Link / Dress code / Tag communities** (not "Fandoms"), and the form **does**
> have a community-tagging control: the "Tag communities" pill reveals the `CommunitySelector`
> (wired to `selectedCommunityIds` / `onSelectionChange`, `maxSelection={10}`, `label=""`). The PR body
> claimed the redesign dropped community tagging and deleted `CommunitiesSection`; in fact tagging was
> re-added through the reused `CommunitySelector`, and only the wizard's `CommunitiesSection` step was
> deleted. Port from the code, not from that PR's prose.

| Action | Path | Port note |
|---|---|---|
| M | `src/domains/events/CreateEventPage/CreateEventPage.tsx` | Rewritten from the wizard into the paid/free **chooser** (uses `CreateEventChooser.module.scss`). Replaces production's wizard page. |
| A | `src/domains/events/CreateEventPage/CreateEventChooser.module.scss` | New chooser styles. Port as-is. |
| A | `src/domains/events/CreateEventPage/CreateEventForm.tsx` | New single-page form (the paid/free body). Rewire `@/data/fixtures` reads and keep production's `CommunitySelector` / `PersonnelInviteSection` at the call sites. |
| R | `src/domains/events/styles/eventForm.module.scss` → `src/domains/events/CreateEventPage/CreateEventForm.module.scss` | The clone moved + renamed the wizard's stylesheet into the CreateEventPage folder (56% similar). In production this file currently lives at `domains/events/styles/eventForm.module.scss`; decide whether to move it or keep it in place and adjust the import in `CreateEventForm.tsx`. |
| M | `src/components/DateTimePicker/DateTimePicker.tsx` | Additive `triggerLabel?` prop only. See "Shared additive prop changes." |
| M | `src/domains/events/sections/PersonnelInviteSection.tsx` | Additive `placeholder?` prop only. Keep production's full component. |
| M | `src/components/CommunitySelector/CommunitySelector.tsx` | **Keep production's version.** Port only the new call site. See "Components to keep production's version" (incl. the `label=""` caveat). |
| M | `src/components/CommunitySelector/CommunitySelector.module.scss` | **Keep production's version.** |
| M | `src/data/fixtures.ts` | **Do not port.** Clone-only `wireCommunities` expansion that feeds the clone's stub selector; production reads `getUserCommunities`. |
| M | `src/App.tsx` | Port only the route additions: `/events/create/paid` and `/events/create/free`, each wrapped in production's `ProtectedRoute` (mirror the existing `/events/create` route). Also add `CreateEventForm` to the `@domains/events` barrel (`src/domains/events/index.ts`) since the clone references it from routing. Do not port the clone's App.tsx wholesale. |
| D | `src/domains/events/components/EventFormStepIndicator/EventFormStepIndicator.tsx` | Wizard step indicator. Delete after the page rewrite lands (the rewritten page is its sole importer). |
| D | `src/domains/events/sections/CommunitiesSection.tsx` | Wizard community step. Replaced by the `CommunitySelector` in the new form. Delete after the rewrite. |
| D | `src/domains/events/sections/EventDetailsSection.tsx` | Wizard details step. Folded into the single-page form. Delete after the rewrite. |
| D | `src/domains/events/sections/ImagesSection.tsx` | Wizard images step. Replaced by the inline poster upload in the new form. Delete after the rewrite. |
| D | `src/domains/events/sections/ImagesSection.module.scss` | Delete with the above. |

Delete ordering: production's wizard `CreateEventPage.tsx` is the sole importer of the four deleted
sections + the step indicator. Rewrite the page first, then delete, so the tree never references a
missing module mid-port.

Routing note: production currently has one route, `/events/create` to `<CreateEventPage />` inside
`ProtectedRoute`, and no paid/free routes. After porting, `/events/create` renders the chooser, and
the two new auth-gated routes render `<CreateEventForm mode="paid" />` and
`<CreateEventForm mode="free" />`.

## Token and copy notes

- **No `tokens.scss` change in any PR.** If your diff shows one, something leaked; back it out.
- **No em dashes in user-facing strings.** Keep it that way when you port. The one place production
  currently has one is the `CommunitySelector` default label; only relevant if you surface that
  default (see the CommunitySelector caveat).
- **No hardcoded values where a token exists.** The clone follows this; verify nothing slipped in
  when you adapt a file to production data.

## Final verify checklist (porting engineer)

- [ ] Each ported file sits at its production path; the one renamed stylesheet is handled.
- [ ] No `@/data/fixtures` import remains; every ported component reads real data.
- [ ] No clone-vendored `@saga/*` stub leaked; imports resolve to the real package.
- [ ] `CommunitySelector` and `PersonnelInviteSection` are production's versions; only the call site
      and the additive `placeholder?` prop were taken.
- [ ] `DateTimePicker.triggerLabel?` and `PersonnelInviteSection.placeholder?` defaults reproduce the
      original strings; existing callers unchanged. Both flagged as shared-primitive changes.
- [ ] New `/events/create/paid` and `/events/create/free` routes are wrapped in `ProtectedRoute`;
      `CreateEventForm` is exported from the events barrel.
- [ ] Deleted files have no remaining importer in `apps/app-web`.
- [ ] Clone-only comments stripped; no `tokens.scss` change; no em dashes in copy.
- [ ] `bun run` typecheck, lint (Biome), and build pass in the monorepo.
