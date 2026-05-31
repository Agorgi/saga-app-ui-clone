<!--
This repo is the Saga UI clone: a UI-only wireframe of app.try-saga.com used for
design iteration. Every PR here is a design PROPOSAL for engineers to review, not a
change to the production app. See docs/DESIGN_HANDOFF.md before opening a PR.
One PR per design change. Keep it small and reviewable.
-->

## What changed

<!-- One or two sentences. What does this PR change visually, and why? -->

## Before / after

<!-- Drag in screenshots. Light and dark theme if the change touches color or contrast.
     Mobile and desktop if the change is responsive. Capture from the local preview
     (npm run dev, http://localhost:3000), not from production. -->

| Before | After |
| ------ | ----- |
|        |       |

## Layer / blast radius

<!-- Check the one that fits. This tells engineers where the change lands in the
     monorepo and how widely it ripples. See docs/DESIGN_HANDOFF.md "Three layers". -->

- [ ] **Global tokens** (`src/vendor/global-web/styles/tokens.scss`): color, type, spacing, radius, shadow. Highest leverage, affects every screen.
- [ ] **Shared design-system primitive** (`src/vendor/global-web/components/*`): Button, Avatar, etc. High blast radius, affects every Saga client, not just web.
- [ ] **App screen** (`src/domains/*`, `src/components/*`, `src/pages/*`): a single page or feature area. Maps 1:1 to `apps/app-web`.

## Production files this maps to

<!-- The path(s) in Try-Saga/saga > apps/app-web that an engineer would edit to carry
     this change into production. The clone mirrors that structure 1:1, so usually it is
     the same relative path. Example: src/domains/events/EventCard/EventCard.module.scss -->

-

## Touches the shared design system?

<!-- If you checked "Shared design-system primitive" above, this is a YES and it needs a
     callout. A change to src/vendor/global-web/* maps to the shared @saga/global-web
     package in the monorepo, which the iOS app and every web client also consume.
     Engineers route these to the design-system package, not to apps/app-web. -->

- [ ] No, this change is scoped to app screens or tokens only.
- [ ] Yes, this touches `src/vendor/global-web/components/*`. Flagging for design-system review. Details:

## How to verify

<!-- How a reviewer reproduces what your screenshots show. -->

1. `npm install`
2. `npm run dev` and open http://localhost:3000
3. Go to:
4. Confirm:

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] DOM and class names are unchanged from production (restyle in the `.module.scss`, do not rewrite markup)
- [ ] No hardcoded value where a `--precedent-*` token exists (changed the token instead)

---

> This is a design proposal in the UI clone. Merging here does not change the production
> app. Engineers review it and decide if and how to implement it in `apps/app-web`.
