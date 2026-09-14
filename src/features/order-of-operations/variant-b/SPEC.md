# Lesson 2 Variant B — storyboard and specification

Original Revily content, using Lesson 1 D's teaching pattern and minimal study shell. No Anushka Lesson 2 material was supplied; this is not attributed to her or claimed to be tutor-reviewed. Existing Lesson 2 remains Variant A. No deployment.

## Screen-by-screen storyboard (before implementation)

| Screen | Visual / action | Task and result |
| --- | --- | --- |
| 01 | Two loose counters plus three equal groups; change group size | Explore how 2 + 3 × n is built; Continue always available |
| 02 | 7 + 3 × 4 | Choose the first calculation: 3 × 4 |
| 03 | Same expression, multiplication resolved to 12 | Find the final value: 19 |
| 04 | Replayable steps for 18 − 2 × 6 | Watch multiplication then subtraction: 6 |
| 05 | 20 − 3 × 4, no highlights | Try independently: 8 |
| 06 | Switch 2 + 3 × 4 / (2 + 3) × 4 | See the bracket change the grouping and result: 14 / 20 |
| 07 | (6 + 2) × 3 | Apply brackets first: 24 |
| 08 | Replayable 3² = 3 × 3 = 9 | Learn what an index means |
| 09 | 4² | Choose its meaning: 4 × 4 |
| 10 | Replayable 30 − (2 + 3)² | Resolve bracket, square, subtract: 5 |
| 11 | 2 × (5² − 9) | Choose the first calculation inside the bracket: 5² |
| 12 | Same expression without highlights | Evaluate: 32 |
| 13 | Replayable 24 ÷ 6 × 2 | Equal priority: left to right, answer 8 |
| 14 | 8 × 3 ÷ 2 | Choose multiplication first because it is furthest left |
| 15 | 18 ÷ 3 × 2 | Independent left-to-right check: 12 |
| 16 | Replayable 10 − 6 + 2 | Subtraction and addition share priority: 6 |
| 17 | 20 − 8 + 3 | Apply the rule: 15 |
| 18 | Claim that addition always comes before subtraction | Choose the counterexample reasoning for 10 − 6 + 2 |
| 19 | Vertical (8 + 4)/(5 − 2); explore top and bottom | See two complete groups and division: 12/3 = 4 |
| 20 | Replayable vertical (18 − 2 × 5)/(3 + 1) | Work within each group then divide: 2 |
| 21 | Vertical (4² + 8)/(2 × 3) | Find only the numerator: 24 |
| 22 | Same fraction | Find the final value: 4 |
| 23 | Vertical (30 ÷ 5 + 6)/(10 − 6) | Independent fraction: 3 |
| 24 | 36 ÷ 6 × 2 − 5, no scaffolding | Delayed mixed retrieval: 7 |
| 25 | 3 + 5 × 2 = 16 claim | Choose where brackets make the statement true: (3 + 5) × 2 |
| 26 | Vertical (3² + 3)/(10 − 6) | Transfer across indices and grouping: 3 |
| 27 | Compact four-level priority map | Finish and restart; no claim of durable mastery |

## Mathematical decisions

- Apply the same operation hierarchy inside each bracket. Indices inside brackets precede addition/subtraction there.
- Division/multiplication share priority; addition/subtraction share priority. Each pair is evaluated left to right, not in acronym letter order.
- A fraction bar groups the entire numerator and denominator. Either group can be calculated first; top-then-bottom is a helpful workflow, not a mathematical requirement. Denominators here are nonzero.
- A square means multiply the base by itself, not multiply by two. No ambiguous implicit multiplication, negative-base powers, or new algebra prerequisites.
- Independent screens withhold highlights, intermediate values and full working until submission.

## Files and interaction

Keep content, typed B-specific visual definitions and structured explanations in `variantBLesson.ts`; local visuals in `OperationsVisual.tsx`; engine-backed focused renderer in `VariantBLessonView.tsx`; scoped CSS in `VariantB.css`; rendered verification in `QA.md`. Reuse the shared lesson engine and `ExplanationSteps` without altering Lesson 1's local feedback work. Add a separate A/B selector and focus-mode condition in `src/App.tsx`.

Visual first, one question directly above responses. One-tap choice submission; numeric checks via button/Enter. Retain answers after grading, mark accepted choices, reveal complete numbered working and an explicit Answer on both outcomes. Continue never requires a correct response or completion of a demo. Opening/closing Lesson menu preserves local controls, input and feedback. Worked steps are learner-controlled and replayable. Keyboard-visible focus, semantic maths, 44px targets, 320px mobile layout. Menu/variant navigation may restart a lesson when switching variant, matching the existing player.

## BIDMAS wording refinement

Introduce the name in screen 04's existing worked-example copy. Expand B/I beside the bracket-and-square example (10), connect D/M to equal priority (13), and A/S to equal priority (16). Screen 27 labels the existing four-level recap with B, I, DM and AS, expanding all six words while keeping each equal-priority pair on one row. No extra screens, persistent banner or question hints. The acronym follows the teaching sequence rather than introducing every rule at the beginning.

## Reference beside every question (supersedes the earlier no-question-hints scope)

User now requests subtle BIDMAS cross-referencing on every question. Preserve the 27-screen sequence and 17 questions. Each expression panel gains the same neutral four-group control: B () → I x² → DM ÷× → AS +−. Tap a group to show one contextual rule and highlight its symbols; tap again to close. The question remains directly above its responses.

- 02/05: match multiplication and addition/subtraction; absent brackets/indices are explained.
- 03: distinguish the already-resolved multiplication annotation from the addition still to do.
- 07/11/12: match bracket boundaries, powers and operations while explaining priority inside the bracket.
- 09: link I to the displayed square; do not supply its numerical result.
- 14/15/17/18/24: preserve paired priority and left-to-right rules, even when the leftmost operation is M or S.
- 21: numerator-only scope; denominator operators must not highlight as part of the requested task.
- 22/23/26: fraction bar marks both grouping and division after each group is complete; never treat its implicit division as preceding its numerator/denominator work.
- 25: explain how brackets change priority without supplying the correct placement.

`bidmasRules.ts` holds rule definitions and the narrowly scoped expression-highlighting helpers; `BidmasReference.tsx` renders the expression/reference together; `OperationsVisual.tsx` dispatches question expressions to it. Optional typed context lives with the lesson data. No changes to shared grading or Lesson 1.

## Collapsed hints

At the user's request, every question now starts with the BIDMAS panel hidden behind a small Hint button. Opening reveals the existing reference; closing removes its operator highlights as well. Rule selection is retained for reopening the hint on the same question. New questions start closed. Opening the hint records hint use, and existing teaching/recap mentions remain unchanged.
