# Saga App UI Clone

A standalone, UI-only wireframe of the Saga web app (app.try-saga.com). It reproduces the public, logged-out screens of the real app screen by screen, but with placeholder content instead of real data. No backend, no auth, no API calls, no real images or text.

The purpose is cosmetic design iteration and engineer handoff. You can restyle, rearrange, and prototype here without touching the production app or its data.

## What this is and is not

- **Is:** a faithful copy of the real app's page structure, component vocabulary, design tokens, and theming, rendered with neutral placeholder content.
- **Is not:** the real app. There is no database, no login, no networking. Interactive logic (auth, posting, joining, RSVP, infinite scroll, navigation handlers) has been deliberately removed or made inert.
- **Source of truth:** the production app lives in the `Try-Saga/saga` monorepo under `apps/app-web`. That repo is read-only for this project. Nothing here pushes to it or depends on it at runtime. The front-end code was extracted as a starting point and then stripped down to a wireframe.

No real user data, PII, photos, or copy appears anywhere in this repo. Everything visible is generic placeholder content.

## Handoff docs

Two short docs govern how design work moves between this clone and production. Read the one that matches what you are doing:

- **[docs/DESIGN_HANDOFF.md](docs/DESIGN_HANDOFF.md)**: for anyone *making* a change here. Covers the three-layer model (tokens, shared primitives, app screens), the mirror rules, and the one-PR-per-component workflow.
- **[docs/PRODUCTION_PORT_GUIDE.md](docs/PRODUCTION_PORT_GUIDE.md)**: for an engineer *porting* merged changes into `apps/app-web`. A file-by-file plan, what to skip, and a final verify checklist. Start here if you are carrying this repo's design into production.

## Stack

Matches `apps/app-web` exactly:

- Vite 7
- React 19 + TypeScript
- React Router DOM v7
- Sass (CSS Modules)
- @untitledui/icons

The Saga design system (`@saga/global-web`) is vendored verbatim into `src/vendor/global-web/`. Private `@saga/*` workspace packages the components import are aliased to no-op shims in `src/vendor/saga-shims/`, so the design system renders without the rest of the monorepo.

## Getting started

```bash
npm install
npm run dev        # local dev server at http://localhost:3000
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit
```

## Screens

Public pages plus the reachable detail pages, mirroring the real app's route map:

| Route | Screen |
|-------|--------|
| `/` and `/feed` | Main feed |
| `/communities` | Communities list |
| `/communities/:communityId` | Community detail (try `/communities/com-1`) |
| `/events` | Events list |
| `/events/:eventId` | Event detail (try `/events/evt-1`) |
| `/profile/:username` | Member profile (try `/profile/member`) |
| `/login` | Login form (inert) |
| `/404` and anything unmatched | Not Found |

Light and dark themes both work via the theme toggle in the navbar. Banner placeholders adapt to the active theme.

## Project structure

```
src/
  App.tsx                 Route map
  main.tsx                App entry
  components/             Shared layout: Navbar, BottomNavbar, MobileTopNavbar, GlobalOverlay
  domains/                One folder per feature area, mirroring app-web 1:1
    auth/                 Login page + auth form UI
    communities/          List + detail + cards
    events/               List + detail + cards
    posts/                Feed, post cards, composer prompt
    profile/              Header, tabs, profile sections
  pages/NotFound/         404
  data/                   Placeholder content lives here
    fixtures.ts           Wireframe events, communities, posts, profile
    placeholderAvatars.ts Default avatar set
  styles/                 Global styles + shared scss mixins
  vendor/
    global-web/           Vendored Saga design system (verbatim)
    saga-shims/           No-op stubs for private @saga/* packages
```

The folder layout intentionally matches `apps/app-web` so changes here are easy to map back to the real app.

## How the clone was built

A consistent pattern was used for every page so the wireframe stays close to the original:

- `.module.scss` files are copied verbatim from the source for maximum visual fidelity.
- `.tsx` files are rewritten to reproduce the same DOM and class names, but with placeholder content and no behavior.
- All data comes from `src/data/fixtures.ts`. There are no fetches.
- Interactive handlers (auth, API, navigation side effects, infinite scroll) are dropped or made inert. Buttons and secondary links render but do nothing.

## Iterating on the design

- **Change content:** edit `src/data/fixtures.ts` and `src/data/placeholderAvatars.ts`.
- **Restyle a screen:** edit the matching `.module.scss` in that page's folder under `src/domains/`.
- **Adjust tokens or global styling:** see `src/styles/` and `src/vendor/global-web/styles/`.
- **Add or change a route:** edit `src/App.tsx`.

When a design direction is settled here, an engineer carries it into `apps/app-web` by hand, using the matching folder path as the map. The step-by-step plan for that is in [docs/PRODUCTION_PORT_GUIDE.md](docs/PRODUCTION_PORT_GUIDE.md).
