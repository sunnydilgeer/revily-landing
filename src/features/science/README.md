# Revily Science: first scaffold

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
