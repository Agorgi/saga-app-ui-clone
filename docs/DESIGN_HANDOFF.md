# Design hand-off guide

How to make a UI or design change in this repo so it stays ready to hand to engineers.

Read this once before your first design PR. It is short on purpose.

## What this repo is

This is the Saga UI clone: a UI-only wireframe of the public app at app.try-saga.com. It reproduces the real app's page structure, component vocabulary, design tokens, and theming, with placeholder content and no backend. See [README.md](../README.md) for the full picture.

We use it to iterate on look and feel without touching the production app or its data. Every change you make here is a **proposal**. Engineers review it and decide if and how to carry it into the real app.

The clone mirrors the production front-end (`apps/app-web` in the `Try-Saga/saga` monorepo) folder-for-folder and class-name-for-class-name. That 1:1 mirror is the entire value of this repo: a change here reads as a liftable diff against production. Protecting that mirror is what the rules below are for.

## The hard rule

**Never change or push to the production repo (`Try-Saga/saga`).** It is read-only for this work. Everything happens in this clone (`Agorgi/saga-app-ui-clone`). Engineers review PRs here, one at a time, and apply what they choose to production themselves. Nothing in this repo pushes to or depends on the production app at runtime.

## The workflow

1. **Iterate code-first, here in the clone.** Not in Figma. Editing the real components keeps full fidelity with production and avoids any design-to-code translation loss. Figma stays a sketchpad for brand-new screens only, never the hand-off artifact.
2. **One PR per design change.** Each change gets its own branch and its own PR. That gives engineers a reviewable, revertable, liftable unit. Do not batch unrelated changes.
3. **Fill in the PR template.** It prompts for before/after screenshots, which layer the change lands in, the production file(s) it maps to, and whether it touches the shared design system. See [.github/pull_request_template.md](../.github/pull_request_template.md).
4. **Verify in the preview before you commit** (see "The verify loop" below).

## Three layers

Every change lands in one of three layers. Knowing which one tells you the blast radius and where an engineer applies it in the monorepo. Always say which layer in the PR.

### 1. Global tokens

**File:** `src/vendor/global-web/styles/tokens.scss`

Color, type scale, spacing, radius, shadow. These are production's real `--precedent-*` CSS custom-property tokens, so they map to the shared `@saga/global-web` package in the monorepo. This is the highest-leverage, cleanest hand-off: change one token, every screen updates consistently.

Use this layer for any change to the visual foundation rather than restyling screens one by one.

### 2. Shared design-system primitives

**Files:** `src/vendor/global-web/components/*` (Button, Avatar, and the rest)

These are shared design-system components. They have **high blast radius**: a change here affects every Saga client, not just the web app. In the monorepo these map to the shared `@saga/global-web` package, **not** to `apps/app-web`.

**Flag these separately in the PR.** Engineers route them to the design-system package and weigh the cross-client impact. Do not fold a primitive change into a screen-level PR.

### 3. App screens

**Files:** `src/domains/*`, `src/components/*`, `src/pages/*`

Individual pages and feature areas. These map 1:1 to the same paths in `apps/app-web`. Edit them freely. This is where most design changes live.

## Two rules that keep the mirror intact

These are what make a change liftable. Break them and an engineer has to reverse-engineer your intent instead of copying a diff.

1. **Never hardcode a value that a token exists for.** If you want a different blue, a tighter spacing, a softer radius, change the token in `tokens.scss`. A hardcoded hex or pixel value in a screen is a change an engineer cannot safely lift, because production reads the token.
2. **Keep the DOM and class names identical to production.** Restyle in the `.module.scss` next to the component. Do not rewrite the markup, rename classes, or restructure the element tree. The class names are the map back to production; if they drift, the diff stops being liftable.

## The verify loop

Before committing any change:

1. `npm run dev` and open http://localhost:3000.
2. Navigate to the screen you changed and confirm it against app.try-saga.com.
3. Check light and dark theme if you touched color or contrast. Check mobile and desktop if the change is responsive.
4. Capture before/after screenshots from this local preview for the PR. Never screenshot production for the "after".
5. Run `npm run typecheck` and `npm run build`. Both must pass.

## Starting a change, end to end

```bash
git checkout main && git pull
git checkout -b design/<short-name>      # e.g. design/event-card-spacing

# make the change in the right layer
#   tokens:        src/vendor/global-web/styles/tokens.scss
#   primitives:    src/vendor/global-web/components/*   (flag in PR)
#   app screens:   src/domains/* | src/components/* | src/pages/*

npm run dev          # verify at http://localhost:3000, capture screenshots
npm run typecheck && npm run build

git add -A && git commit -m "design: <what changed>"
git push -u origin HEAD
gh pr create         # fill in the template
```

Then your engineers review the PR in this repo and decide whether and how to apply it to `apps/app-web`.
