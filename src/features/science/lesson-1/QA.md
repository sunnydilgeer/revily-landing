# Lesson 1 QA and handoff

Checked 13 September 2026. **Draft: needs qualified GCSE Science teacher review before publication.**

**Current result: version 0.2.0, 14 September 2026.** The 40-screen full-Cells lesson and canonical friendly design supersede the animal-only/dual-appearance checks below. Current scope is mapped in [alignment](./ALIGNMENT-2026-09-14.md); the pre-implementation brief is [realignment](./REALIGNMENT.md). Historical checks remain as an audit trail.

## Completed checks

- Official AQA 8464 specification and primary Foundation assessment references inspected; sources and precise question locators recorded in RESEARCH.md.
- Original five-part animal-cell teaching uses “most”/“typical”, distinguishes membrane from nucleus, respiration from protein synthesis and energy release from creation.
- No plant classification by outline or absence of chloroplasts. No claim that a schematic is a photograph or an observation.
- Practical bridge is clearly illustrative and does not count as required-practical completion. No unsupervised laboratory procedure or unsafe specimen collection assigned.
- All choice paths checked against canonical answer IDs; every assessed screen has a hint, answer and reasoning. Written explanations are pending teacher marking.
- Stable IDs, sources, misconception references and independent/delayed requirement references resolve.
- Fixed sequence terminates; duplicate completion IDs cannot inflate progress.
- Teaching, supported answers, retries and immediate replay cannot earn independent/retained status.
- Evidence requirements cannot be combined across sessions to manufacture secure-in-session coverage.
- Later failure demotes the affected dimension, rather than erasing every science skill.
- New package compiles under strict TypeScript; repository-wide typecheck passes with incremental output disabled.
- Executable reference policy suite: **17 grouped checks passed**, including every choice option, written marking, version filtering, retrieval timing and recommendations.
- Local session suite: **10 grouped checks passed**, covering progression, locked submission, hints, reload snapshots, written drafts, scoped restart and complete 21-screen traversal.

## Reproduce automated verification

Run `mktemp -d /private/tmp/revily-science-check.XXXXXX` to obtain an isolated output directory. Substitute its actual returned path for OUTPUT_DIR below:

```sh
node_modules/.bin/tsc --strict --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --outDir OUTPUT_DIR src/features/science/scaffold.test.ts src/features/science/previewSession.test.ts
node OUTPUT_DIR/scaffold.test.js
node OUTPUT_DIR/previewSession.test.js
node_modules/.bin/tsc --noEmit --incremental false
```

The isolated `/preview/science` route was added. Existing Maths files and package configuration were not changed. No deployment was performed.

## Teacher-review gate still open

Review the vocabulary, pace, prerequisite assumptions, distractor plausibility, rubric flexibility, Foundation demand and practical-observation wording. Check the proposed animal → plant → bacterial → microscopy → magnification sequence against the wider curriculum. Verify function teaching and exceptions without overloading beginners. Review whether the final transfer is sufficiently distinct from its worked example.

The automatic thresholds and 24-hour spacing are transparent beta decisions, not validated mastery estimates. Review the five recall targets, narrow understanding/application checks and sampled delayed coverage with actual learner evidence. Separate response time and teacher-marking time in production; add explicit teaching/answer-view exposure events before scheduling becomes live.

## Local UI QA completed

Browser checks against the running localhost route confirmed:

- Hydration, SVG rendering and the first activity at the normal desktop viewport.
- Teaching-step buttons change the highlighted structure and explanation; opening/closing the menu preserves the current frame.
- Labelled teaching keys only include meaningful selectable steps. Assessment labels remain hidden until feedback; accessible assessment descriptions do not name the hidden target answer.
- Wrong choices retain the selected answer and expose reasoning/Continue. Supported answers show the hint-assisted practice notice.
- Open hints and submitted choices survive menu toggles and a full reload. Written drafts survive reload; saving preserves the original text and remains pending, with an expandable draft marking guide.
- Observation reasoning, all five independent recall checks, function distinctions and both application questions are reachable.
- Section jumps do not inflate completion. Partial completion shows a preview summary and returns to the first unfinished screen; completing all 21 screens shows “Lesson complete”.
- Recall/understanding/application evidence remains separate from pending written reasoning and introduced practical/data reasoning. Calculation/retention are not falsely certified.
- At 320px, visual walkthroughs, long options, changed models, written response and summary stay within the viewport: document scroll width equals viewport width. Representative diagrams and screens were visually inspected. The temporary mobile viewport was reset.
- No browser console errors were captured in the tested flow. The localhost route returns HTTP 200 and repository typechecking passes.

Actual recorded video/audio, screen-reader/manual keyboard usability, storage-denied behaviour and full accessibility audit remain outstanding. Focus management and menu keyboard confinement are implemented but not a substitute for assistive-technology testing. There is no live teacher queue or retrieval scheduler; written responses and dates are local preview information only.

Question-paper text was available, but its page screenshots could not be fetched. Do not reuse its figures until they are visually verified and appropriately licensed. The original diagram briefs avoid dependency on those figures.

Next bounded improvements: teacher-review the content and models, then refine the preview from human feedback and record the teaching clips. Integrate no production mastery writes until the adapter and evidence contract are reviewed.

## Visual refinement — 14 September 2026

Borrowed the user-supplied cells prototype’s mint/teal/lavender palette, short explanatory headers and “Think:” cues. Kept the original five-structure SVG, question sequence, grading and saved-session contract. Teaching headers now show the part and its simple function above the model, with supporting detail below. Selected parts have a gentle static glow rather than flashing; transitions respect reduced-motion preferences.

Repository and strict component typechecks pass; all 17 scaffold and 10 session checks still pass. Browser inspection confirmed the new headers and cell highlights, no horizontal overflow at 320px, hidden labels on the boundary assessment, and no captured console errors. Temporary viewport overrides were reset. Teacher review remains required.

## Revision-book variant — 14 September 2026

Added a separate `/preview/science/revision` visual variant, with existing Syne/DM Sans fonts, a blue topic ribbon, yellow concept highlights and lilac cues. No copied book artwork or added curriculum content. All theme rules are scoped to `.science-preview--revision`; the default route retains its original theme. Both routes share the same lesson/session implementation and local progress key.

Repository typecheck and all 27 existing grouped checks pass. Desktop and 320px browser checks confirmed the concept heading treatment, legible questions and hints, no horizontal overflow, hidden assessment labels and no captured console errors. The comparison link opens the original route without the revision class; temporary viewport sizing was reset. Full accessibility and qualified teacher review remain outstanding.

Follow-up font refinement: topic and activity/question headings now inherit DM Sans, matching the MCQ choices at a stronger weight. Highlighted teaching concepts retain Syne, and colours/cell artwork are untouched. Browser computed styles confirmed matching topic, question and answer font families, with Syne preserved on teaching concepts.

Full typography audit supersedes the selective refinements above: removed the remaining broad display-font rule and 800-weight teaching override. All heading levels and the brand now inherit DM Sans at weight 600, including teaching concepts and the suggested-next-step summary. Searched font declarations across the app and Science components; unrelated home-page display fonts and the shared font loader are intentionally unchanged.

The new `variant-revision/typography.test.mjs` checks all six heading levels, brand coverage, moderate weight, absence of the display font/extra-heavy overrides and font-rule scope. It passes, as does repository typechecking. Browser computed styles verified the topic, MCQ question, menu, brand and both walkthrough headers; the 320px teaching view fits without overflow and no console errors were captured. Summary heading coverage is verified by the shared h3 policy and stylesheet regression check, not a new complete lesson traversal.

## Full-Cells implementation QA — current version 0.2.0

Completed 14 September 2026. **Technical QA passed; qualified teacher and full accessibility review remain open.**

- All 40 screens traversed in order through browser actions to “Lesson complete”. Tested a deliberately incorrect baseline response, retained selection, numbered answer feedback, Continue, and reload persistence. All remaining choice answers followed their canonical path; the policy suite grades every alternative path too.
- All six timed walkthroughs were stepped, played/paused, and their scripts opened/closed. Menu open/close preserved a frame. Both worked examples revealed all three reasoning steps.
- Open hint state survived reload. Submitted responses remained locked; boundary assessment labels stayed hidden before grading.
- Written comparison draft survived reload unchanged. Save preserved and locked its text, showed awaiting-review status, model answer and expandable marking guide, then reached the summary. No keyword grading or false correct tick.
- Summary correctly separated secure-in-session recall/understanding/application/calculation from pending written review and practice-only practical/data reasoning. It pointed to planned microscopy and did not certify the required practical or delayed retention. Summary headings use DM Sans at weight 600, including the next-step h3.
- 320px inspection covered summary, expanded curriculum menu, plant and bacterial highlights, area diagrams and all 20 remaining screens from estimation justification through final written comparison. Scroll width equalled client width throughout. Readable HTML dimension labels supplement small SVG labels. Temporary sizing was reset.
- Fresh browser load of `/preview/science/revision` redirected to `/preview/science`, displayed the canonical friendly theme and first screen, and captured no console errors. Moving the stylesheet produced a transient development hot-reload resolution error before the route import update settled; this was not present on the final fresh-load check.
- Only newly created version-0.2.0 QA answers were cleared using the preview’s scoped fresh-test reset. The old 0.1.0 browser record and account/production records were not deleted. The deliverable is left at screen 1 with fresh progress.
- Strict test compilation, strict React component typecheck and repository typecheck pass. **19 scaffold checks + 11 session checks + 1 typography policy check = 31 grouped checks passed.** Includes all 24 topic groups/six paper groupings, new numerical requirements and rejection of old-version snapshots.
- Old appearance branch/comparison link removed; `FriendlyLesson.css` is the canonical theme. The old revision URL is only a bookmark redirect. No deployment, recording, teacher queue or live retrieval scheduler added.

Current reproduction: use the automated compilation commands above, plus `node src/features/science/typography.test.mjs`. The previously named `variant-revision/` test/style files were moved to the Science package root when the friendly design became canonical.

## Cosmetic copy cleanup

Removed the starting-phase label, “Your turn” badges, opening tagline, repeated visible model/scale caption and hint-assisted evidence notice. Empty baseline metadata is not rendered. Model limitations remain in accessible descriptions; meaningful plant/plasmid qualifiers remain visible. Hint support flags, grading, version and persistence are unchanged. Repository/strict UI typechecks, session suite and typography policy pass. Browser checks confirmed the removed copy is absent from baseline and shared animal teaching screens; the preview was returned to the first screen without resetting learner records.

## Teaching chrome cleanup

Removed all activity phase labels and Learn badges, the shared walkthrough label/timing row, and redundant outer media-teaching headings. Exam marks, question headings, substantive teaching explanations and controls remain. The current walkthrough concept is now the level-two heading and receives the existing screen-entry focus. Updated desktop/mobile highlight selectors accordingly. Repository typecheck and typography policy pass; browser checks confirmed the cleaned teaching screen and successful switching to the Nucleus step, with DM Sans at weight 600 and no removed metadata elements. Progress and grading are unchanged.

## Whole-cell redesign — version 0.3.0

- Rebuilt teaching around animal cells, then a separate plant-cell introduction covering all eight structures, followed by comparison, bacteria and supporting category names. Added B1-42 (remaining plant functions/overview) and B1-41 (comparison): 42 screens total. Scripts and visible teaching now share `teachingFrames.ts`.
- Redesigned original SVG diagrams with distinct cell identities, consistent colours for common structures, folded mitochondria and numbered diagram pointers/readable keys. Plant vacuole is pale blue; membrane and outer wall are independently highlighted. Keys grow as structures are introduced. Previously taught keys without a frame in the current chunk are plain labels, not nonfunctional buttons.
- Browser completed all 42 screens in order. Every frame in all eight media chunks was selected and its heading verified; each script opened/closed. Both three-step worked examples completed. Baseline deliberately answered incorrectly; all other choice answers and explanations verified. Final written draft survived reload, saved/locked pending review, and full summary showed appropriate dimension statuses.
- Phone checks at 320px: complete plant and animal diagrams, bacterial plasmids and two-diagram comparison all reported document width 320px without horizontal overflow. Comparison stacks on phones. Six-frame controls wrap onto a separate step row. Plant key selection changed the heading; menu opening/closing preserved the selected frame; play/pause controls toggled correctly.
- Fresh tab loaded the baseline without console errors. Only this run's newly created version-0.3.0 QA responses were cleared using the lesson UI; older-version records and all unrelated data were preserved. Preview left at the first screen.
- Automated checks: 20 scaffold + 11 session + 1 typography = 32 grouped checks. Added order/full-plant coverage/script consistency assertions and rejection of version-0.2.0 records. Repository typecheck passes. These checks do not replace qualified teacher review, testing with learners or a full accessibility audit.
