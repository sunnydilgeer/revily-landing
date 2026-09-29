# Unified Science preview — 14 September 2026

## Per-subject lesson numbers — 29 September 2026 (read this first)

Lesson numbers restart in each subject: Biology Lesson 1–58 (unchanged), Chemistry Lesson 1, 2, 3 … Chemistry Lessons 1–7 are built and registered: C1a — 1 *Atoms, elements and isotopes* (`C-ATM-001-C`), 2 *Compounds and chemical equations*, 3 *Mixtures and chromatography*, 4 *Filtration, crystallisation and distillation*; C1b — 5 *How the model of the atom changed* (`C-PER-005-C`), 6 *Electronic structure*, 7 *Building the periodic table*. Each lives in `chemistry/lesson-N`, with facts in `cards/facts/chemistry/N.ts`. Lesson 1's diagrams live in `components/AtomVisuals.tsx` (focus prefix `atom-`, the Chemistry particle colour code); Lessons 2–7 use `CompoundVisuals`, `MixtureVisuals`, `SeparationVisuals`, `AtomHistoryVisuals`, `ElectronVisuals` and `PeriodicVisuals`. Tests: `chemistry1.test.tsx`, `chemistry2to7.test.tsx`. Question and worked-example visuals route by screen id: `B4`+ and every `C<N>` id go to `CellBiologyVisual`.

- **Catalogue** (`lessonNavigation.ts`): every chapter and lesson entry has a `subject`. Biology is still `scienceChapters` / `scienceLessons` (and `LessonNumber`, `scienceLessonHref`, `parseScienceLesson` still mean Biology). Chemistry is `chemistryChapters` — C1a *Atoms, elements, compounds and mixtures* (Lessons 1–4), C1b *The periodic table* (Lessons 5–7) — and `chemistryLessons` (Lessons 1–7). Chapters list planned numbers; a lesson appears once registered.
- **Lookups:** `getScienceLesson(subject, number)`, `scienceLessonsFor`, `scienceChaptersFor`, `scienceChapterFor`, `nextScienceLesson` (stays inside the subject), `scienceEntryById`, `allScienceLessons`, `scienceLessonDir`.
- **Routes:** Biology `/preview/science?lesson=N` (unchanged). Other subjects `/preview/science?subject=chemistry&lesson=N` (`scienceSubjectLessonHref`, `parseScienceLessonRef`). An unbuilt lesson redirects to the Science home.
- **Storage:** lesson sessions were already keyed by lesson id (`revily:science:<id>:<version>:preview`); curriculum/card progress maps are now keyed by lesson id too. The last-lesson key `revily:science-last-lesson:v1` keeps a bare number for Biology (existing values still load) and stores `chemistry:N` for Chemistry. Card ids use screen ids, so screen ids must be unique across subjects (tested).
- **Ids:** lesson `C-<TOPIC>-<NNN>-C` (e.g. `C-ATM-001-C` for C1a, `C-PER-005-C` for C1b; NNN = the Chemistry number when first built, never renumbered); screens `C<N>-NN` (e.g. `C1-01`); `strand: 'chemistry'`.
- **Curriculum:** Chemistry stays under "Coming later" until it has a lesson; then its chapters show as a real section (an empty chapter says "Coming soon"). `recommendedNext` in `engine.ts` and the exam coverage map are Biology-only.

**Register a Chemistry lesson:** (1) add `chemistry/lesson-N/lesson.ts` (exporting the lesson and `…Sections`) and `teachingFrames.ts`; (2) append `{ subject: 'chemistry', number: N, folder: 'N', title, detail, lesson, sections, frames }` to `chemistryLessons`, numbers 1, 2, 3 … in order; (3) add key facts `cards/facts/chemistry/N.ts` and import it in `cards/facts/index.ts`; (4) run `node scripts/check-science-lesson.cjs c<N>` (or `chemistry/<N>`), `node scripts/render-science-visuals.cjs c<N> [out dir]` and `npm run test:science`.

## Current state — 26 September 2026, after the cell-biology split

- **31 Biology lessons.** Lessons 1, 2, 5 and 6 were split, so Science went from 26 to 31 lessons. The catalogue (`scienceLessons` in `lessonNavigation.ts`) is the single source of truth for order, titles, sections and frames. `lessonSections.ts` is derived from it (`lessonFrames.ts` was removed on 29 September; the player reads `entry.frames`).
- **Folders are not lesson numbers.** Cell biology (chapter B1) is lessons 1–11: `lesson-1` animal and plant cells, `lesson-1b` bacteria and comparing cells, `lesson-2` light and electron microscopes, `lesson-2b` magnification maths, `lesson-3` practical skills (RP1), `lesson-4` specialisation, `lesson-5` chromosomes and mitosis, `lesson-5b` stem cells, `lesson-6` diffusion and osmosis, `lesson-6b` osmosis practical (RP2), `lesson-6c` active transport and exchange surfaces. Folders `lesson-7` … `lesson-26` are now lessons 12 … 31.
- **Key on lesson ids, not numbers.** Anything about a particular lesson (practical notes, the transport story, the exam pilot link, the new-screen pilot in `app/preview/science/page.tsx`, the coverage map) uses `lesson.id`. Use `scienceLessonNumberById` / `scienceLessonHrefById` to get a number or a link.
- **State ids were not renumbered.** Screens that moved to a split lesson keep their ids (e.g. B1-21 is in `lesson-1b`, B1-35 and B2-12… are in `lesson-2b`). New screens continue each family: B1-43+, B2-35+, B5-32+, B6-46+.
- **One lesson screen.** Every lesson plays in the Maths-style frame (`ScienceLesson.tsx` + `ScienceContentsDrawer.tsx`). The old player (`ScienceLessonPreview.tsx`) and the CSS only it used were deleted. Lesson extras are keyed by id: refreshers on B4-01/B5-01 (shown after the Start here answer), the transport story (ORG-009…012) in Contents, practical notes on the four required-practical lessons.
- **Science revision cards** (`cards/`): one deck per lesson (31), in the app at `/preview?subject=science&view=cards`. Key facts are authored per lesson in `cards/facts/<folder>.ts` (keyed by section start id) plus 2–4 of the lesson's own choice questions; a section's cards join Today once it is finished. The card screen is shared with Maths (`features/cards/CardsView.tsx`) but each subject has its own decks and its own schedule (`revily:science-cards:v1`), so sessions never mix. `/preview/scienceB` and `/preview/science/revision` redirect there; `revision-b/` keeps only its practice data and marking rules for Practice. Cards are drafts awaiting teacher review.
- **The coach experiment is retired.** `coach/` was deleted; its Lesson 1 revision cards now live in the Science decks.
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
