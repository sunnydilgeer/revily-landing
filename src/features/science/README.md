# Revily Science: local lesson preview

## Easier-wording Lessons 13–16 — 22 September 2026

[Variant B](http://localhost:3000/preview/science?variant=b) now continues with Lesson 13 **Blood**, Lesson 14 **Cardiovascular disease and treatments**, Lesson 15 **Health and disease**, and Lesson 16 **Risk factors and cancer**. These easier-wording-only drafts add independent local progress, original code-native diagrams, independent checks and teacher-only written responses while preserving the established lesson engine.

The supplied page-26 revision checklist was not imported because it repeats material already covered in Lessons 7–12. New scope begins with page 25’s blood components, then continues through the new material on pages 27–31. The screenshots were treated as scope references rather than instructions or copy. See [alignment](./LESSONS-13-16-ALIGNMENT.md), [QA](./LESSONS-13-16-QA.md), and each new lesson’s `STORYBOARD.md`.

## Easier-wording Lessons 10–12 — 22 September 2026

[Variant B](http://localhost:3000/preview/science?variant=b) now continues with Lesson 10 **The lungs**, Lesson 11 **Circulatory system: the heart**, and Lesson 12 **Circulatory system: blood vessels**. These are easier-wording-only drafts with independent local progress records, concise walkthroughs, original code-native schematics, independent checks and a teacher-only written response. The sequence now continues 9→10→11→12.

The supplied scans of pages 22–24 were used only to identify scope and sequence. Printed instructions, QR prompts, questions, prose and artwork were not treated as user instructions or copied. Current AQA 8464 section 4.2.2.2 was checked as the curriculum authority. Page 24’s facing material on blood components belongs to page 25 and is intentionally left for a later lesson rather than expanding Lesson 12.

See [alignment and originality boundaries](./LESSONS-10-12-ALIGNMENT.md), [current QA](./LESSONS-10-12-QA.md), and the storyboards under `variants/b/lesson-10` through `lesson-12`.

## Easier-wording Lessons 7–9 — 21 September 2026

[Variant B](http://localhost:3000/preview/science?variant=b) now continues into Topic B2a with three easier-wording-only drafts: Lesson 7 **Cells, tissues and organs**, Lesson 8 **Enzymes and reaction rates**, and Lesson 9 **Digestion and food tests**. There is intentionally no current-wording/A copy for these lessons. Their original diagrams, questions and datasets follow the supplied pages 17–21 without copying the book’s prose or artwork. See [alignment and safety boundaries](./LESSONS-7-9-ALIGNMENT.md), [current QA](./LESSONS-7-9-QA.md), and each lesson’s `STORYBOARD.md` under `variants/b/lesson-7` through `lesson-9`.

Lessons 1–6 keep both independent A and B records. The current B sequence continues 6→7→8→9→10→11→12→13→14→15→16. The current AQA handbook’s ethanol-emulsion method is primary for lipids, while Sudan III is clearly identified as an alternative school method. All extended responses remain pending teacher review, and online work never certifies hands-on practical completion.

## Curriculum map and Lesson 6 exam bridge

Open the [six-lesson teaching coverage and paper register](http://localhost:3000/preview/science/coverage?variant=b) or [Lesson 6 exam-practice pilot](http://localhost:3000/preview/science/exam?variant=b). The map has 18 exact teaching-section links and a local teacher-review register for paper sub-questions. Official question matches are not pre-verified; inherited references are visibly pending. The pilot uses four original worked/supported/independent practice screens, saved separately from lesson progress, with written answers pending teacher review and no automatic score. Source/permission limits and QA: [EXAM-PREPARATION.md](./EXAM-PREPARATION.md). The current full suite has 185 grouped checks.

## A/B wording variants

Variant A retains the current six lessons and their existing progress. [Variant B](http://localhost:3000/preview/science?variant=b) contains independent simpler-wording copies of Lessons 1–6 plus the easier-only Lessons 7–16. Both share the interface, diagrams and assessment engine. Use **A · Current wording / B · Easier wording** on the hub or in Lessons 1–6. Lessons 7–16 display an easier-only badge instead of offering a missing comparison. Hub, lesson-menu and next-lesson links preserve the selected variant.

B's content lives under `variants/b/lesson-1` through `lesson-16`, with its own `lesson.ts` and `teachingFrames.ts`. B lesson IDs end in `-B`; the easier-only drafts are separately versioned. A IDs, versions, legacy storage and content remain unchanged. There are twenty-two separate local progress records. Run `npm run test:science` for the complete regression suite. See [variant design and QA](./VARIANTS.md).

## Teaching-copy pass — all six lessons

Learner-facing teaching, hints, explanations, worked examples, written-task guidance and relevant diagram captions have been audited across Lessons 1–6. Definitions now start with plain meaning; explanations explicitly connect features, effects and functions. Existing clear questions are retained. See [the editorial record](./TEACHING-COPY-PASS.md). This is an editorial update, not a new assessment version: IDs, sequence, answer keys, marks, evidence requirements and storage identities are preserved. `teachingCopy.test.ts` checks those contracts against fingerprints captured before editing.

## Lessons 4–6 — 17 September 2026

The picker now contains six built drafts. Lesson 4 (**B-CELL-004**, v0.1.0, 24 activities) teaches specialisation and differentiation; Lesson 5 (**B-CELL-005**, v0.1.0, 31 activities) teaches chromosomes, mitosis and stem cells; Lesson 6 (**B-CELL-006**, v0.1.0, 45 activities) teaches transport, exchange and required-practical-2 preparation. Open with `?lesson=4`, `5` or `6`. Each has an original storyboard, replayable visual walkthroughs, worked reasoning, independent checks and a written task saved pending judgement. Scripts are text fallbacks, not recorded video.

Read [official-source alignment and boundaries](./LESSONS-4-6-ALIGNMENT.md), [current end-to-end QA](./LESSONS-4-6-QA.md) and each new lesson's `STORYBOARD.md`. Run `npm run test:science` for all 62 grouped checks. The six-lesson changes have also been transferred to the original checkout: use [localhost:3000/preview/science](http://localhost:3000/preview/science). Existing Lesson 1–3 browser records and unrelated Maths/tutor work are preserved. Port 3100 was the isolated authoring/QA preview, not the primary URL.

The sections below describe the earlier Lessons 1–3 baseline. References there to three built lessons or later lessons being planned are historical and superseded by this update. No production, account, mastery or deployment integration has been added.

Lesson 1 is **B-CELL-001 — Cells: animal, plant and bacterial**, content version **0.3.0**. It has a working local interactive preview, with draft content that is not yet teacher-approved.

## View locally

Open [localhost:3000/preview/science](http://localhost:3000/preview/science) while the existing Next.js development server is running (`npm run dev` if needed). The existing `/preview` Maths experience is unchanged.

This is now the single Science entry point: a compact three-lesson picker with Start/Resume/Review and validated local completion counts. Lessons open on the same page with `?lesson=1`, `2` or `3`; the header's All lessons link returns to the picker and the lesson menu includes direct switches. Old `/microscopy`, `/practical` and `/revision` bookmarks redirect to their corresponding lessons. IDs, content versions and storage keys are unchanged. [Navigation design and QA](./NAVIGATION.md).

Lesson 2 is now available at [localhost:3000/preview/science/microscopy](http://localhost:3000/preview/science/microscopy): **B-CELL-002 — Microscopy: seeing cells and measuring them**, version **0.1.0**, 34 screens. It introduces light/electron microscopes separately, distinguishes magnification and resolution, scaffolds magnification/missing-size/unit/standard-form calculations, then assesses independent choices and written reasoning. [Lesson 2 storyboard and alignment](./lesson-2/STORYBOARD.md) records the approved scope; [QA](./lesson-2/QA.md) records checks and limitations.

Lesson 3 is available at [localhost:3000/preview/science/practical](http://localhost:3000/preview/science/practical): **B-CELL-003 — Microscopy practical: prepare, observe and draw**, version **0.1.0**, 30 screens. Original visuals explain onion wet-mount preparation, safe focusing, separate plant/animal observations, scientific drawing and calibrated measurement. Includes independent practical reasoning and a saved teacher-only written method. [Storyboard and safety boundaries](./lesson-3/STORYBOARD.md); [QA](./lesson-3/QA.md). All three menus link between lessons without sharing learner records. Online completion is preparation, not evidence of hands-on practical completion.

The friendly revision-book design is the only Science appearance: DM Sans throughout, a blue topic ribbon and yellow/lilac accents. Original animal, plant and bacterial SVG illustrations have distinct identities, consistent structure colours and numbered pointers tied to readable keys. Plant teaching covers all eight structures directly. `/preview/science/revision` redirects to the canonical route for old bookmarks; the old appearance selector is removed. Run `node src/features/science/typography.test.mjs` to check the typography policy.

The preview implements 42 screens. Teaching progresses from a complete animal cell to a complete plant cell, then side-by-side comparison, a bacterial cell, and only then the eukaryotic/prokaryotic category names. Scale, units, standard form, area estimation, independent checks, a saved two-difference comparison and dimension-specific evidence summary remain. Walkthroughs are silent, not recorded videos; their scripts are generated from the same `teachingFrames.ts` content displayed on screen. The menu provides section jumps, a link back to Maths, and a curriculum map covering all 24 AQA topic groups across six papers. The remaining lessons are planned, not built.

Progress, drafts, submitted answers and hint state are saved to a separate versioned local browser-storage key per lesson. The session-engine factory is shared; Lesson 1's legacy exports and snapshots remain compatible. No account, server-side marking, production mastery or scheduled retrieval is updated. Restart normally preserves prior answer exposure. The explicit “clear local practice history” option resets only the current lesson's preview record for fresh testing.

The teaching sequence has materially changed, so versions 0.1.0 and 0.2.0 snapshots are not reused or regraded. Their browser-storage records remain untouched; version 0.3.0 starts separately.

Keep Biology, Chemistry and Physics as separate curriculum strands under one Science experience. Share the activity shell and evidence/event infrastructure; do not share a single subject-specific question renderer or force every lesson into Easy/Medium/Hard/Very Hard. AQA assesses Trilogy using separate subject papers ([assessment structure](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/specification-at-a-glance)). This strand choice and the micro-lesson sequence below are Revily design decisions, not an AQA-mandated teaching order.

## Start here

- [Lesson storyboard](./lesson-1/STORYBOARD.md): actual teaching scripts, screen sequence and visual briefs.
- [Research and alignment](./lesson-1/RESEARCH.md): specification boundaries, inspected Foundation evidence and limits.
- [Architecture](./ARCHITECTURE.md): component contracts, assessment and deterministic routing.
- `types.ts`, `lesson-1/lesson.ts`, `engine.ts`: typed content and executable reference policies.
- `scaffold.test.ts`, [QA](./lesson-1/QA.md): automated checks and remaining human review.

## Proposed opening sequence

| Stable lesson ID | Micro-lesson | Why separate? |
| --- | --- | --- |
| B-CELL-001 | Cells: animal, plant and bacterial | Built draft: structures/functions, classification and size/area maths |
| B-CELL-002 | Microscopy: seeing cells and measuring them | Built draft: instruments, resolution, magnification and size calculations |
| B-CELL-003 | Microscopy practical: prepare, observe and draw | Built digital-preparation draft: slide, focusing, plant/animal observations, drawing and scale |
| B-CELL-004 | Specialisation and differentiation | Planned: structures enabling specialised functions |
| B-CELL-005 | Chromosomes, mitosis and stem cells | Planned: division and differentiation applications |
| B-CELL-006 | Transport and exchange | Planned: diffusion, osmosis, active transport and exchange surfaces |

The first three IDs are local preview lessons; later IDs are proposed, not existing curriculum records. Supervised microscopy with real plant and animal specimens, biological drawing and calibrated size information remains essential; no digital lesson certifies that this practical work has been completed. Future Chemistry and Physics lesson choices need their own specification and prerequisite research.

## What is deliberately not implemented yet

No recorded video/audio, learner database, teacher-marking queue, fresh repair bank, physical equipment simulator, production scheduler, AI marking or deployment. Storyboards precede UI implementation, following the local lesson-design standard. Existing Maths files and unrelated work are preserved.

The package uses the existing N1.1 product rhythm: compact teaching, one action, collapsed hints, submitted response retained, explanation then Continue. Science content instead progresses through model interpretation, explicit misconception checks, guided reasoning, practical/evidence connection and independent transfer. Short videos have text fallbacks; exploration and replay never gate progression.
