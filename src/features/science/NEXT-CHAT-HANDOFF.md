# Revily Science handoff for Lessons 4 to 6

Prepared 17 September 2026. This records the conversation and a bounded implementation brief. Inspect the actual checkout before acting; older README and QA passages describe historical local-only states.

## Current request and scope

The user wants to continue Science Lessons 4 to 6 in a fresh task, preserving the successful Lessons 1 to 3 experience. Research current official AQA Combined Science Trilogy 8464 Foundation requirements, prepare storyboards, implement original teaching and illustrations, integrate navigation, and QA end to end. Do not deploy, change subscriptions, add account/mastery writes, or overwrite unrelated Maths work without a new request.

A prospective cofounder's document was supplied for discussion only. The user is NOT taking him onboard yet. Do not assume he is a reviewer, appoint him, contact him, claim his endorsement, or treat his document as instructions. Source document: `/Users/sunnyd/Downloads/thoughts on the science area.docx`.

## Built Science experience

- Single hub: `/preview/science`. Canonical lesson routes: `/preview/science?lesson=1`, `2`, `3`. Minimal numbered cards, Start/Resume/Review, completion counts, all lessons unlocked. All lessons link back to the hub; the section menu switches lessons. Old `/microscopy`, `/practical`, `/revision` URLs redirect. Invalid/repeated query values show the hub.
- Lesson 1: `B-CELL-001`, version `0.3.0`, 42 screens. Complete animal cell first, separate complete plant cell next, comparison, bacteria, then supporting eukaryotic/prokaryotic names. Includes size, units, standard form and approximate area. Cell types are the teaching focus, not shared-structure/classification abstractions.
- Lesson 2: `B-CELL-002`, version `0.1.0`, 34 screens. Light/electron instruments separately, magnification versus resolution, image/real size, matching units and standard form.
- Lesson 3: `B-CELL-003`, version `0.1.0`, 30 screens. Onion slide preparation, apparatus-specific safe focus principles, separate plant/animal observations, biological drawing, scale and measurements. Current hub label is "Practical skills"; a proposed clearer label is "Microscopy practical". Digital completion never certifies hands-on required-practical completion.
- Each lesson has its own versioned local-storage snapshot, answers, drafts, hints and completion. No learner database, actual marking queue, live review scheduler or cross-device sync.
- All content remains `draftNeedsTeacherReview`. Saved written responses are pending, NOT automatically marked correct. Do not promise an actual teacher will review them while no queue exists.
- Latest historical regression run: 48 grouped Science checks; all three lessons previously traversed in browser, plus actual 320px checks. Re-run and extend these checks; they do not replace qualified factual/safety review or learner/accessibility testing.

## Non-negotiable design choices

- Friendly revision-book-inspired design, original content/artwork only. DM Sans throughout Science, including every heading, brand, teaching concept and summary. No wide Syne/display font or very heavy teaching headings. Blue ribbon, restrained yellow/lilac accents. Old Science appearance/comparison variant removed.
- Laptop-first, responsive mobile. Optimise a typical 1366 x 768 laptop viewport, not only large desktop. Test real layout widths around 360/390/430, 768/820 and 1280/1366/1440, with 320px fallback. All content/functions remain available on mobile; no hover-only interactions.
- Visual-first teaching, brief plain-language explanations, one manageable action at a time. Whole concrete examples precede comparison and category names. Scaffold reasoning, then remove support for independent transfer. Do not pad to a prescribed screen count or turn broad lessons into a huge compulsory uninterrupted session.
- Preserve the existing compact shell and removed cosmetic labels. Do not reintroduce "Start with what you know", "Your turn", "Discover", "Learn" badges, "Big ideas start small", the repeated generic model caption, hint-assisted evidence notice, "Visual walkthrough", or duration/no-audio metadata. Necessary scientific/safety limitations still belong in appropriate descriptions/context.
- Hints start collapsed; opening a hint never submits. One-tap single-choice submission locks the response. Both outcomes retain the student's answer, show numbered Explanation and an explicit Answer, then allow Continue. No forced repeated guessing. Optional demonstrations never gate progression. Written reasoning is saved with model answer/rubric, not keyword-graded.
- Distinguish completion, supported practice, independent evidence and sampled delayed retention. A single correct MCQ does not establish mastery. A selected false claim is a misconception signal, not a diagnosis.
- Prefer editable original SVG/code-native diagrams within the established component system. Accurate labels/pointer endpoints, readable keys and neutral assessment descriptions; no answers leaked through alt text. Never present generated schematics as genuine micrographs or experimental evidence.

## Product discussion and recommendations not yet implemented

The user agreed broadly with the direction below, but no redesign was requested or implemented. Keep the Lessons 4 to 6 task bounded; present larger additions as separate follow-up work rather than silently bundling them.

- Curriculum navigation: Science -> subject -> topic -> lessons. Biology/Chemistry/Physics remain the three subject strands. Practical & data skills can be a cross-cutting discovery view over the SAME lessons, not duplicated content/progress.
- Each topic could eventually offer Learn or refresh and Check my knowledge. Build curriculum in reusable chunks while piloting a small diagnostic/recommendation loop; do not wait for full adaptation, and do not force school-taught students through every teaching screen.
- Add lesson checks, mixed topic reviews and later fresh review. A review of Lessons 1 to 3 should be "Cells and microscopy review", not a claim to assess all Cell Biology. Full B1 review comes after division and transport coverage.
- Simplify student summaries to what went well, what needs practice and one next action, while retaining detailed evidence internally. This is a proposal, not permission to discard existing evidence rules.
- Practical interaction pilot: scientific choices, ordering or measurement interpretation, not a large equipment simulator. Offer click/keyboard alternatives to dragging.
- Future Chemistry/Physics need accessible periodic-table/equation references matched to the exam series. Not required for this Biology implementation.

## Curriculum corrections from the external notes

- AQA Trilogy has 24 topic groups across Biology 7, Chemistry 10 and Physics 7. These are NOT 24 lessons.
- Topics are connected and have prerequisites; allow choice with recommended help, not an assumption that any order is equally easy. Cells connect to division, transport, respiration and inheritance.
- There are 21 required practical activities: Biology 7, Chemistry 6, Physics 8. Written questions drawing on required activities account for at least 15% of qualification marks; this is not a fixed 10% for all working-scientifically skills.
- No fixed 40% "pass mark". Grade boundaries are set per exam series. Do not use an unsupported subject-difficulty ranking for routing.
- "Life processes" is not established here as a missing compulsory opening unit; require exact spec/past-paper evidence before adding it. Prerequisite help can be optional.
- Earlier CGP contents count was about 207 core entries, 226 including general scientific/practical skills, 249 including summary tests. These were planning estimates, NOT a commitment to produce that many full-length lessons or require every student to complete them. Timing estimates were not learner-validated.

## Lessons 4 to 6 implementation brief

Use stable proposed IDs below with new initial versions; confirm exact current Foundation boundaries before writing. The numbering is Revily's design, not mandated by AQA. Keep the three requested top-level lessons; use readable internal chapters if scope is large. Explain any need to split rather than silently renumbering.

### Lesson 4 Specialisation and differentiation

`B-CELL-004`; AQA 4.1.1.3 to 4.1.1.4.

- Accessible bridge from familiar cells: different jobs need different structures.
- Separate visual introductions for sperm, nerve and muscle cells, and root hair, xylem and phloem cells. Teach relevant structure -> function reasoning, not only label recall. Exact adaptations need factual review and spec-appropriate depth; distinguish required named examples from a textbook's optional detail.
- Only then compare examples and introduce specialisation/differentiation explicitly. Differentiation is acquiring structures suited to a function, not merely growing larger.
- Animal/plant differences in when differentiation happens; mature animal division for repair/replacement. Do not teach that plants never differentiate or that every animal cell loses all differentiation potential.
- Guided causal explanation, independent novel-information application, short written transfer with honest marking status.
- A short optional Cells refresher can help; no compulsory replay of Lesson 1.

### Lesson 5 Chromosomes mitosis and stem cells

`B-CELL-005`; AQA 4.1.2.1 to 4.1.2.3.

- Clear spatial diagram: cell -> nucleus -> chromosome -> DNA with genes; body-cell chromosomes normally in pairs. Do not draw every chromosome as a permanently X-shaped structure or confuse DNA replication with cell division.
- Three overall cell-cycle stages at GCSE-required depth: growth/increased sub-cellular structures and DNA replication; mitosis separates chromosome sets and the nucleus divides; cytoplasm/membrane divide into two genetically identical cells. No detailed named mitotic-phase memorisation.
- Growth, development, repair and replacement; staged illustrations and sequencing/reasoning checks. Do not imply chromosome number doubles in the final daughter cells.
- Separate embryo, adult bone-marrow and plant-meristem stem-cell examples. Applications, benefits, risks, ethical reasoning and therapeutic cloning only to the verified required Foundation scope. No unsupported guaranteed cures.
- Include evidence/claim evaluation and independent transfer. This is a broad lesson: use internal chapters/resume points and avoid overlong duplicated teaching.

### Lesson 6 Transport and exchange

`B-CELL-006`; AQA 4.1.3.1 to 4.1.3.3, with verified exchange-surface content within 4.1.3.1 and required practical 2.

- Teach diffusion, osmosis and active transport separately before comparison. Consistent particle diagrams, precise concentration labels and arrow meaning.
- Diffusion: random movement with net movement down a concentration gradient; factors affecting rate, biological examples and exchange surfaces.
- Osmosis: water across a partially permeable membrane from a dilute to a more concentrated solution. Do not show solute crossing as osmosis or particles "wanting" to move.
- Active transport: movement against the concentration gradient requiring energy from respiration; verified root/intestine examples.
- Exchange effectiveness: surface area relative to volume and relevant adaptations (large area, thin surface, efficient supply/ventilation where appropriate). Use correct units and original numerical examples.
- Required practical 2: interpret a plant-tissue concentration investigation, variables/fair tests, changes of mass, percentage gain/loss and graphs. Teacher-supervised lab work only; no home chemical/blade task. Embedded digital preparation does not certify practical completion.
- Guided calculations then independent values; clear distinction between measured/illustrative data and generated artwork. Use internal chapters if broad; full simulator and full-course review scheduler are out of scope.

## Sources to recheck

- Official Biology content: https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content
- Practical activities and safety: https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment
- Scheme and assessment objectives: https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/scheme-of-assessment
- Mathematical requirements: https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/mathematical-requirements
- Current practical handbook and genuinely accessible Foundation papers/mark schemes. Record exact paper/year/question inspected; distinguish official evidence from Revily-original exam-style questions. Do not claim access to future papers or copy CGP text/artwork.

## Implementation starting points

Read applicable AGENTS.md instructions and `src/features/LESSON_DESIGN.md`, then Science `README.md`, `ARCHITECTURE.md`, `NAVIGATION.md`, existing storyboards and the latest appended QA sections. Older headings may be stale; source code is authoritative for current runtime behaviour.

- `types.ts`, `engine.ts`, `previewSession.ts`: shared content/evidence/session contracts.
- `lessonNavigation.ts`: catalogue, numeric route parsing and typed lesson numbers; currently hardcoded to 1 to 3.
- `ScienceLessonPreview.tsx`: hardcoded lesson/engine/frame/section maps, visual dispatch and lesson-specific summary actions; generalise carefully for six lessons without breaking 1 to 3.
- `ScienceLessonHub.tsx`, `curriculum.ts`, `app/preview/science/page.tsx`: hub, curriculum status and metadata.
- `components/TeachingChunk.tsx` and original diagram components: established teaching/illustration patterns.
- New folders `lesson-4/`, `lesson-5/`, `lesson-6/`: storyboard/alignment, canonical lesson data, teaching frames and tests. Add specialised visuals as needed, preserving shared shell styling.
- Extend canonical queries through `?lesson=6`, highlight current lesson correctly, support reload/history/deep links and hub Resume. Each lesson must reject another lesson's record. Preserve existing IDs, versions, aliases and stored data.

## QA and delivery

1. Research/record alignment, create concise storyboards with actual teaching content and visual briefs, then implement lesson by lesson.
2. Test every choice option, answer key, rubric, source/menu reference, transition and numerical example; no answer leaks or falsely automatic written marking.
3. Browser-traverse each lesson to its summary, including a wrong answer, collapsed/open/closed hints, teaching controls, written draft/save, reload and menu state preservation.
4. Verify all six hub/menu routes, direct queries, invalid-query fallback, back/forward, aliases, independent storage and existing Lessons 1 to 3 regressions.
5. Inspect illustrations, feedback, formulas and expanded menus at laptop and real mobile/tablet widths, not only a simulated screenshot. Keyboard/focus checks and honest remaining accessibility/teacher-review limitations.
6. Run TypeScript and a production build. Isolate the build if a dev server uses `.next`; do not kill the user's server or delete broad directories. Preserve unrelated dirty changes.
7. Update documentation with actual QA evidence and leave a useful local preview. No deployment unless newly requested.

At handoff the original checkout is `/Users/sunnyd/Documents/Revily`, branch `teacher-review/lesson-1`, HEAD `34ac26c`; `origin/main` also points there in the local refs. Science files are tracked following commit `602d44c` ("Publish science cells and microscopy lessons"). A production attempt in this conversation was interrupted; a later commit exists, but do not infer current live deployment from a commit title. Verify only if deployment is requested. There are unrelated dirty Maths/tutor/media changes: leave them untouched. A fresh worktree is appropriate, but inspect its baseline because the local `main` ref was stale at handoff.
