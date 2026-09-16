# Lesson 2 Variant C - QA

## 16 September 2026 — owner-requested video simplification

- Removed the on-screen-caption note and Read the walkthrough section from all three video panels. Removed supporting body paragraphs from video-backed teaching screens only; mathematical working and other teaching screens are unchanged.
- Removed the video's reference to the deleted description element and updated unsupported-player copy. Playback failure still offers Step by step.
- Inspected the simplified BIDMAS screen locally; Replay played the clip, switching tabs paused it, and Next revealed cumulative working. No expandable sections or supporting body paragraphs remained.
- Regression assertions cover the shared templates for all five Lesson 1 and all three Lesson 2 clips. Both lesson verifiers, TypeScript, whitespace checks and isolated production build passed before publishing.

Verified locally on 16 September 2026. No deployment was performed.

## Cleaned in-flow video integration

- Inspected all four supplied recordings using sampled frames across their full durations. The three BIDMAS clips match the existing numerical, fraction and algebra demonstrations. The fourth is integers/non-integers and is excluded from Lesson 2; no Lesson 1 changes were made.
- Added the three original MP4 assets unchanged and matching poster stills under `public/media/lesson-2/`. All three are 1024 × 576, captioned, silent recordings.
- Verified real browser playback at `L2C-02` (55.4s), `16` (54.4s), and `25` (51.8s), with readyState 4 and no media errors.
- Tested Replay, 2× speed, pause-on-tab-switch and persistence of two revealed working steps when switching away and back.
- Tested keyboard ArrowRight and Home tab navigation, and opening the complete written walkthrough.
- Let the first clip finish: its Watched indicator appeared while the lesson stayed on screen `02`; it did not auto-advance.
- Continued from the algebra clip while it was playing: the next screen remained accessible and contained no video element. Playback is never a completion gate.
- Traversed all 34 screens after integration and answered all 23 questions. Completion and Start lesson again remained accessible.
- Inspected desktop and 320 × 800 player layouts; video controls, speed selection, written alternatives and working tabs fit without document overflow. Mobile document width remained 320px at all three video screens. Reset the temporary viewport override after testing.
- Browser console reported no warnings or errors.
- TypeScript, lesson content/media-asset assertions, whitespace checks and isolated production build passed; all 21 application routes generated. The existing development server was left running.

## Owner-approved cumulative rollout

- All eight worked-demo screens use stacked working: `02`, `03`, `11`, `13`, `16`, `17`, `25`, `26`; nine distinct calculations and 27 transitions in total.
- Browser traversal reached all 34 screens and completion after the rollout, submitting all 23 questions (including a deliberately wrong answer on `04`). Complete feedback remained accessible.
- Tested every demonstration's Next, Back and Replay controls. The final Next button is disabled; Replay resets to the original expression.
- Numerical row sequences: `02`: 1–5; `03`, `11`, `13`: 1–3. Fraction sequences: `16`: 1–5; `17`: 1–6. Algebra sequences: `25`: 1, 2, 3, 5, 6, 7; `26`: 1–4.
- The two-row increase on `25` introduces the separately labelled second example and its first result. Its original has no equals sign linking it to the first example. Back across the boundary hides the entire second group; Replay resets both examples.
- Inspected completed fraction and algebra working at 320 × 800. At every revealed step on `16`, `17`, `25` and `26`, document scroll width and viewport width both remained 320px. Browser console reported no warnings or errors; viewport override was reset afterward.
- Lesson 2 opens directly into C. Its Lesson menu contains no variant selector or A/B options. Other lessons' variant selectors remain unchanged.
- Automated assertions enforce all eight stacked demos, every underlined input matching its preceding expression, valid KaTeX rendering, separate algebra examples and the sole C route.
- Original first-example checks also covered keyboard Enter, menu state retention, optional Continue before revealing any steps, desktop/mobile underlines and disabled initial Back/Replay.
- TypeScript, content verification and isolated production build pass. No deployment was performed. The existing local development server was left running.

## Automated checks

- `npx tsc --noEmit` - passed.
- `npm run verify:lesson2:tutor` - passed: 34 sequential unique screens, 23 questions, complete source references, valid next-state routes, all authored answers, representative incorrect answers, identical correct/incorrect explanations and algebra-equivalence cases.
- `npm run build` - passed with Next.js 15.5.19; all 21 application routes generated. The existing multiple-lockfile workspace-root warning remains informational.
- `git diff --check` - passed after the final documentation update.

## Content and grading

- All 21 PDF practice questions are present and match the source mathematics.
- All three silent videos are represented by replayable worked examples with their complete teaching sequence.
- Division/multiplication and addition/subtraction equal-priority checks are retained from Variant B.
- Numeric answers were verified for the authored correct value and a representative wrong value.
- Every single-choice answer was verified for its authored correct option and a representative wrong option.
- Algebra inputs accept equivalent safe monomial forms, including `10x²`, `10*x*x`, `7q^2p`, `22nm` and `17dc^2`, while rejecting an unrelated monomial.
- Every question contains the same complete numbered explanation for correct and incorrect responses and an explicit Answer line.

## Browser traversal

- Traversed `L2C-01` through `L2C-34`; all 34 screens were unique and reachable.
- Submitted `999` on `L2C-04`; the input remained visible, the complete working appeared and Continue was enabled.
- Submitted the remaining questions correctly, including Enter-key submission on `L2C-05` and `L2C-27`.
- Opened and closed the Hint on all 23 questions. No hint action submitted or graded a response.
- Selected B, I, DM and AS in the `L2C-04` hint and confirmed the contextual rule changed without feedback appearing.
- Replayed all eight worked demonstrations. `L2C-02` also verified that Continue works before the optional demonstration is started.
- Used Back from `L2C-03` to return to `L2C-02`.
- Entered `999`, opened and closed Lesson menu, and confirmed the response remained intact.
- Confirmed the completion screen and Start lesson again control.
- Browser console contained no warnings or errors during the traversal.

## Responsive visual checks

- Desktop: inspected the opening exploration, worked examples, question hints, wrong-answer feedback and completion recap.
- 320 × 800: inspected the fraction worked example (`L2C-17`), algebra question and open BIDMAS hint (`L2C-27`), algebra feedback and completion recap.
- At every measured mobile state, viewport width and document scroll width were both exactly 320px; no horizontal overflow occurred.
- Fractions, indices, highlighted operations, algebra and feedback remained readable at 320px.

## Source-specific checks

- Fraction work keeps numerator and denominator grouped and describes top-first as a workflow rather than a mathematical priority rule.
- N2.2 Q5c keeps explicit brackets in the single-line equivalent.
- Algebra teaching says to multiply coefficients and combine variable factors; it does not use the ambiguous phrase “multiply the letters.”
- The optional BIDMAS reference now recognises variable powers such as `x²` as indices.
