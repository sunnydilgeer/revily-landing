# Unified Science preview — 14 September 2026

## Easier-only organisation extension — 21 September 2026

The strict lesson parser now accepts `?lesson=1` through `24`. Variant A still contains Lessons 1–6 only. Variant B adds Lessons 7–24, and every canonical link to those lesson numbers includes `variant=b`; requesting one without a variant is normalised to the easier-only lesson rather than implying an absent A copy. The main hub exposes all twenty-four built lessons and switches to Variant B for easier-only lesson links. All thirty A/B lesson records keep separate versioned local-storage identities.

The B recommendation chain continues 6→7→8→9→10→11→12→13→14→15→16→17→18→19→20→21→22→23→24. Lessons 7–24 replace the two-way wording switch with an explicit “Easier wording · only version” badge. Invalid, absent and repeated lesson values still show the relevant hub rather than mounting an undefined lesson.

## Six-lesson update — 17 September 2026

Six ordered unlocked preview cards and menu switches now use `?lesson=1` through `6`. Invalid/repeated values still show the picker. All six direct links and reloads, all six menu switches/current indicators, back/forward, three existing aliases and invalid values were checked in the browser. Every menu fits an actual 320px viewport. The new menu and practical graph/table also fit 320, 360, 390, 430, 768, 820, 1280, 1366 and 1440px; actual `innerWidth` and document width were checked, not inferred from screenshots. Keyboard reverse/forward boundary wrapping and Escape/focus return were checked after excluding hidden disclosure links. No records were reset. [Detailed current QA](./LESSONS-4-6-QA.md). The earlier QA below remains the original three-lesson baseline.

## Design

Single course entry `/preview/science`: three ordered, numbered lesson cards with a short description and Start/Resume/Review. Minimal learning-path inspiration from Duolingo's course home, not copied branding, artwork or reward system: https://blog.duolingo.com/new-duolingo-home-screen-design/.

Cards open the same page using `?lesson=1`, `2` or `3`, so reload, browser history and sharing work naturally. Invalid or repeated lesson parameters show the course picker. All lessons stay unlocked in this preview. Existing microscopy/practical/revision routes redirect to the appropriate lesson. Existing record IDs/versions/storage keys unchanged.

All lessons link back to the picker in the header. Existing section menu remains, with a compact three-lesson switcher before the section list. Summary next-lesson actions use canonical links. Hub reads validated existing records only; completion counts do not claim mastery. No new progress system, account writes or deployment.

## QA results

Verified root picker → all three lessons → picker; direct menu switches, Lesson 3 query reload, browser back/forward, all three old aliases and invalid-query fallback. Lesson 1's open hint survived switches, then was closed again; no answers submitted or records reset/deleted. Catalogue/restore tests verify isolation, stored-record integrity and unchanged keys. Hub reads rather than rewrites records.

Resume was also checked in the browser: selecting B2-02 showed `0 / 34 activities completed` and Resume on the course card; opening it restored B2-02. Original B2-01 selection was restored afterwards without resetting its record.

Actual 320px viewport: picker and all three lesson switcher/section menus fit without horizontal overflow; current lesson correctly highlighted. Viewport override reset, temporary redirect-check tab closed, root picker kept as deliverable. Fresh redirect/invalid-query testing returned no console errors. Repository typecheck and all 48 grouped Science regression/navigation/typography checks passed. Existing lesson-content QA remains in each lesson folder; this change does not claim a new full accessibility or learner review.
