# Science scaffold architecture

## Blood, health and cancer extension — 22 September 2026

Variant B continues from the existing lung, heart and vessel sequence into Lessons 13–16. Blood components remain separate from Lesson 12, so no vessel content is duplicated. The fixed lesson flow, section navigation, teacher-only writing, versioned local records and evidence rules are unchanged. `HealthDiseaseVisuals.tsx` supplies original code-native blood, cardiovascular, health, risk and tumour models; assessment views hide answer-bearing names where a visual is part of the prompt.

## Lungs and circulation extension — 22 September 2026

Variant B now contains Lessons 10–12 with IDs `B-ORG-010-B` through `B-ORG-012-B`. Routing, menu sections, recommendations and local-storage engines extend the existing easier-only sequence without creating absent Variant A records. Lung, heart and vessel visuals are original code-native schematics routed through `OrganisationVisuals.tsx`; assessment renders suppress answer-bearing labels and feedback restores the teaching key.

Lesson 10 covers the airway route, alveolar gas exchange and adaptations plus an illustrative breathing-rate calculation. Lesson 11 covers double circulation, four chambers, the five specified associated vessels, valves, coronary supply and pacemakers. Lesson 12 covers artery, vein and capillary structure–function relationships and blood-flow rate. Blood components remain outside Lesson 12 because they are the next source page and AQA subsection. Existing completion/evidence rules, locked choices, teacher-only writing and browser-local progress remain unchanged.

## Variant-B organisation extension — 21 September 2026

The catalogue is intentionally asymmetric: Variant A has Lessons 1–6; Variant B has Lessons 1–16. `scienceLessonHref` treats lesson numbers 7–16 as easier-only and adds `variant=b`. The page resolves a lesson only from the selected variant catalogue, so an unsupported A record is never invented. `ScienceLessonPreview` uses the B-only organisation sequence and original code-native visuals, while the existing six-lesson Coach pilot remains explicitly sliced to its original scope.

`OrganisationVisuals.tsx` covers hierarchy, epithelial tissue, digestive organs, enzyme models and curves, required-practical preparation, digestive enzyme products, bile and food-test evidence. Assessment views hide answer-bearing labels where a diagram is part of the prompt. The content keeps the existing engine contracts: explicit choice keys, locked submissions, isolated session storage, `teacherOnly` writing and pending review. Required-practical screens teach method knowledge and interpretation but do not award hands-on completion.

## Six-lesson extension — 17 September 2026

The catalogue and strict single query parser now accept Lessons 1–6. Existing record IDs, content versions and keys for Lessons 1–3 are unchanged; B-CELL-004/005/006 each use v0.1.0 and their own engine instance/storage identity. `lessonAuthoring.ts` is an authoring helper, not a replacement grading policy. It declares independently sampled requirements rather than certifying a whole topic. `CellBiologyVisuals`, `DivisionVisuals` and `TransportVisuals` supply original schematic visuals with readable HTML equivalents and illustrative data. Optional plot controls are local, non-gating teaching state and never submit evidence.

New sections map to existing activity IDs for chapter/resume navigation. Written answers remain teacherOnly, pending; the UI explicitly states that no teacher-marking queue is connected. Next recommendations now traverse 1→2→3→4→5→6, with supervised RPA2 preparation after Lesson 6. Repair, retrieval, exposure and evidence policies otherwise remain unchanged. Collapsed disclosure links are excluded from menu keyboard wrapping; the activity remains inert while the menu is open. Earlier three-lesson descriptions below are historical.

## Content versus learner state

Keep the canonical curriculum, versioned content and learner events separate. A lesson version contains teaching states, interactions, visual briefs, references, misconception objects and an evidence contract. The learner session stores current state ID, draft response, hint state, feedback visibility, completed state IDs and an immutable attempt ledger. Opening the menu must not reset any of them. Do not infer exposure or assessment from simply rendering a screen.

The TypeScript package is a small reference implementation, not a production engine or prerequisite registry. Its stable IDs are proposed records. The prerequisite `B-KS3-CELL-BASIC` means “recognises cells as basic units of organisms”; use B1-01 as a baseline signal and offer a short cells-versus-organs repair if needed. A single baseline response cannot establish prerequisite mastery.

## Runtime flow

`/preview/science` is a read-only course picker over the built lesson records. Valid single `?lesson=1` through `16` values mount a lesson when that record exists in the selected wording catalogue; absent, invalid or repeated values show the picker. Easier-only lessons normalise their links to Variant B. Next links handle reload/history/deep links. Old subject routes redirect to canonical query URLs. The header returns to the picker and the section menu can switch lessons. Record IDs, versions, storage keys and grading remain isolated.

`teaching / draft response → submit → feedback with retained response → Continue → next state`

The fixed state sequence handles both correct and incorrect responses. Incorrect responses can show an optional inline repair; no forced repeated guessing. The summary selects a repair, due retrieval or the next lesson automatically, rather than presenting a difficulty menu.

| Component contract | Responsibility | Must not do |
| --- | --- | --- |
| ScienceLessonShell | Current title, slim progress, menu; persist session across menu toggles | Treat progress as mastery |
| TeachingChunk | Play/replay short video; visible transcript fallback and optional worked steps | Record a teaching screen as a correct assessment |
| CellModel | SVG model with labelled/unlabelled modes, explicit pointer endpoints, accessible equivalents | Classify cells by outline/colour or draw decorative details as observed facts |
| ChoiceInteraction | One-tap single-choice submission, lock submitted answer | Automatically submit when opening Hint |
| WrittenInteraction | Save a short explanation, show model/rubric after submission | Keyword-mark a causal explanation as correct |
| FeedbackPanel | Numbered reasoning, explicit accepted answer; selected-claim correction if supported | Claim it knows why an ambiguous answer was wrong |
| ObservationRecord / DataTable | Present source-grounded or clearly illustrative observations; distinguish them from schematic models | Invent a micrograph or infer absence from non-visibility |
| EvidenceSummary | Separate recall, understanding, explanation, application, calculation, practical and data evidence | Display a single “Science mastered” badge |
| RetrievalActivity | Fresh prompt, due-time check, independent evidence | Count an immediate replay as retention |

The local preview reuses the existing structured explanation renderer and implements the compact shell/choice behaviour with Science-specific styles. It does not import the Maths `MicroSkillId` union or `lessonMath` answer checker. `engine.ts` remains pure TypeScript policy code. `previewSession.ts` exposes a lesson-specific session-engine factory and backward-compatible Lesson 1 exports. Each lesson has isolated identity, state IDs and versioned storage. Legacy Lesson 1 snapshots without the added lessonId field are accepted and normalised without changing content version or deleting records. `ScienceLessonPreview.tsx` selects the lesson and menu; specialised original SVGs live in `components/`. The shared walkthrough accepts lesson-specific frames and generates script fallbacks from the same teaching content. Production storage/marking integration remains separate.

`/preview/science` stores only this lesson's versioned local preview snapshot. Opening the menu leaves the activity mounted and suspends timed walkthrough progression. Choice submission is locked after grading; revisiting preserves the submitted answer. Written drafts and hint-open state survive a reload. Menu section jumps are marked as inspection controls, do not complete skipped states and produce “Your preview summary” rather than “Lesson complete” until every screen has actually been completed. The explicit fresh-test reset option clears only this local lesson's practice history; ordinary restart preserves prior answer exposure.

## Evidence rules

The profile's statuses mean **not assessed**, **developing**, **secure in this session**, and **retained on sampled delayed checks**. Teaching is not evidence. Practice and diagnostics cannot award secure status. Secure status requires every declared independent item in one session, first attempt, no hint or prior answer exposure. Version 0.3.0 retains ten recall requirements covering five animal functions plus plant/bacterial/classification targets, and four sampled calculation requirements (area, diameter ratio, unit conversion and standard form). Passing a choice explanation is understanding evidence, not independently generating an explanation. These samples are not a whole-topic mastery estimate.

Written responses remain `pendingTeacherReview`; only a trusted teacher judgement can resolve them. For the prototype, award “correct” only for the full rubric, keeping partial-credit marks separately in the eventual teacher UI. The reference ledger appends the adjudication under a new event ID but the same session/state/attempt identity, later timestamp and unchanged original response/support flags. Production must validate all these properties. Teacher marking time must not replace learner response time for retrieval scheduling: preserve response-time and adjudication-time as separate fields when integrating the storage model. The reference single timestamp is deliberately conservative about delayed teacher-marked evidence.

An incorrect later response demotes that dimension to developing until fresh qualifying evidence is collected. Supporting practice does not overwrite first-attempt failure. Retries and repeated items after a model answer are learning opportunities, not clean evidence. The host must record hint use before submission and prior answer exposure across reloads, menu navigation and repeated sessions. The reference accepts trusted flags; it cannot detect unrecorded exposure.

Retrieval is eligible in a different session at least 24 hours after relevant non-delayed assessment exposure. Production also needs teaching/answer-view exposure events. Spacing is a Revily beta policy, not an AQA rule. Recalculate after replay/repair. The six-item future retrieval bank samples animal/plant/bacterial recall, understanding, application and written comparison; no live retrieval is implemented. It does not certify every fact or all of Cell Biology. Calculation has in-session requirements but no delayed bank; practical/data reasoning remains practice-only.

## Misconception objects

The selected false statements in MC-ENERGY-CREATED, MC-RIBOSOME-RESPIRATION, MC-MODEL-COLOUR and MC-UNSEEN-ABSENT support targeted correction of that statement. Store a `misconceptionSignal`, not a diagnosis. Do not attach a misconception ID to every wrong label. A random selection, a reading issue and a knowledge gap can produce the same answer. A second contrasting probe would be needed before using signals for durable misconception-based personalisation.

## Deterministic next action

After completion: due retrieval first; otherwise insufficient declared independent dimensions (excluding pending written explanation) → review; otherwise Lesson 1 offers microscopy B-CELL-002, microscopy offers practical preparation B-CELL-003, and Lesson 3 points to planned specialisation B-CELL-004. Pending written review does not block forward learning. Lesson-aware recommendations do not send a lesson back to itself. All three menus link directly between built lessons; repair banks and live retrieval remain integration work. Lesson 3's practical-reasoning profile describes digital question evidence, not actual equipment-handling competence; its summary explicitly requires supervised plant/animal observation, drawing and calibrated size information.

At curriculum scale use registered sub-skills, prerequisite edges, evidence dimensions and coverage tags rather than hand-maintaining state-ID requirements. Preserve separate dimension evidence: a magnification arithmetic slip need not erase knowledge of cell functions. Tag future question formats for apparatus, methods, hazards, variables, data and calculations as needed; not every lesson needs them all.

## Publishing and safety gate

Draft → factual/safety check → Foundation boundary check → answer/rubric/visual check → qualified Science teacher review → beta publication. Record reviewer, date, content version and review notes. This package stays `draftNeedsTeacherReview`; AI-authored draft content must never imply teacher endorsement. No home cell collection, stains, glass handling or laboratory procedure is assigned here. Later microscopy requires teacher-approved apparatus-specific methods and risk controls. A digital completion record must never certify required-practical completion.

Keep answer keys in canonical authoring data and grade on a trusted service if results become consequential. TypeScript schemas and client-side checks are not a security boundary. No AI is needed for curriculum IDs, event reduction, mastery thresholds, scheduling or next-step selection.
