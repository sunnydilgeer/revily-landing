# Unified Science preview — 14 September 2026

## Current state — 26 September 2026, after the cell-biology split (read this first)

- **31 Biology lessons.** Lessons 1, 2, 5 and 6 were split, so Science went from 26 to 31 lessons. The catalogue (`scienceLessons` in `lessonNavigation.ts`) is the single source of truth for order, titles, sections and frames. `lessonSections.ts` and `lessonFrames.ts` are derived from it.
- **Folders are not lesson numbers.** Cell biology (chapter B1) is lessons 1–11: `lesson-1` animal and plant cells, `lesson-1b` bacteria and comparing cells, `lesson-2` light and electron microscopes, `lesson-2b` magnification maths, `lesson-3` practical skills (RP1), `lesson-4` specialisation, `lesson-5` chromosomes and mitosis, `lesson-5b` stem cells, `lesson-6` diffusion and osmosis, `lesson-6b` osmosis practical (RP2), `lesson-6c` active transport and exchange surfaces. Folders `lesson-7` … `lesson-26` are now lessons 12 … 31.
- **Key on lesson ids, not numbers.** Anything about a particular lesson (practical notes, the transport story, the exam pilot link, the new-screen pilot in `app/preview/science/page.tsx`, the coverage map) uses `lesson.id`. Use `scienceLessonNumberById` / `scienceLessonHrefById` to get a number or a link.
- **State ids were not renumbered.** Screens that moved to a split lesson keep their ids (e.g. B1-21 is in `lesson-1b`, B1-35 and B2-12… are in `lesson-2b`). New screens continue each family: B1-43+, B2-35+, B5-32+, B6-46+.
- **The coach experiment is retired.** `coach/` was deleted; `/preview/scienceB` still shows the Lesson 1 revision cards (`revision-b/`), which keep the coach's styles as `revision-b/RevisionShell.css`.
- **Saved progress** for the rewritten lessons resets (new content versions). There is no database yet.
- **All content is still a draft** awaiting qualified teacher review.

Notes below this section are a dated history; lesson numbers in them are the old numbers.

## Earlier state — 26 September 2026 (before the split)

- **One Science catalogue.** The original wording (Variant A, Lessons 1–6) has been deleted, along with the A/B switch and the `?variant=` parameter. The easier wording (formerly Variant B) is now the only Science content: 26 Biology lessons in `lesson-1/` to `lesson-26/`, listed in `lessonNavigation.ts` as `scienceLessons`.
- **Saved progress is unchanged.** Lesson IDs keep their `-B` suffix (e.g. `B-CELL-001-B`), so storage keys such as `revily:science:B-CELL-001-B:0.1.0:preview` still load for testers. The exam pilot key keeps its `:b` suffix for the same reason.
- **Routes.** The Science home is in the app at `/preview?subject=science`. `/preview/science?lesson=N` plays a lesson; an old `&variant=` is ignored. `/preview/science` with no lesson redirects to the app.
- **Shared pieces** that used to live in A's folders: `teachingFrame.ts` (the `TeachingFrame` type and plant part IDs) and `lesson-6/practicalData.ts`.
- **All content is still a draft** awaiting qualified teacher review.

Notes below this section are a dated history. Mentions of Variant A, Variant B, `variants/b/` or `?variant=b` describe how things were then.

## Easier-only organisation extension — 21 September 2026

The strict lesson parser now accepts `?lesson=1` through `26`. Variant A still contains Lessons 1–6 only. Variant B adds Lessons 7–26, and every canonical link to those lesson numbers includes `variant=b`; requesting one without a variant is normalised to the easier-only lesson rather than implying an absent A copy. The main hub exposes all twenty-six built lessons and switches to Variant B for easier-only lesson links. All thirty-two A/B lesson records keep separate versioned local-storage identities.

The B recommendation chain continues 6→7→8→9→10→11→12→13→14→15→16→17→18→19→20→21→22→23→24→25→26. Lessons 7–26 replace the two-way wording switch with an explicit “Easier wording · only version” badge. Invalid, absent and repeated lesson values still show the relevant hub rather than mounting an undefined lesson.

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
