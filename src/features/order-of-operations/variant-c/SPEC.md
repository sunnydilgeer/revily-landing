# Lesson 2 Variant C - tutor-backed storyboard

The owner-approved Variant C is now the only selectable Lesson 2 path. It adapts every supplied tutor question, all three silent worked-example videos, and the current lesson’s essential equal-priority teaching. Source provenance is stored on every screen.

## Screen-by-screen storyboard

| Screen | Source | Mode | Outcome |
| --- | --- | --- | --- |
| L2C-01 | Variant B 01 | Exploration | See addition outside three equal groups, so the multiplication forms one quantity first. |
| L2C-02 | N2.1 Q1 + video 09.47.34, 0-29s | Replayable example | `5 × (2³ - 3) + 6 = 31`. |
| L2C-03 | video 09.47.34, 30-43s | Replayable misconception example | `3 + 4 × 2 = 11`, not 14. |
| L2C-04 | N2.1 Q2 | Guided numeric | `4 + 6 × 3 = 22`. |
| L2C-05 | N2.1 Q3 | Numeric | `20 ÷ (2 + 3) × 4 = 16`. |
| L2C-06 | N2.1 Q4a | Numeric | `3 + 4² × (6 - 2) = 67`. |
| L2C-07 | N2.1 Q4b | Bracket-placement choice | `(2 + 3) × 4 - 1 = 19`. |
| L2C-08 | N2.1 Q5a | Independent numeric | `n = 27`. |
| L2C-09 | N2.1 Q5b | Misconception check | Zain is wrong because division precedes subtraction; result 8. |
| L2C-10 | N2.1 Q5c | Transfer | Disprove “brackets always change the answer” with the source counterexample. |
| L2C-11 | Variant B 13 | Replayable example | Division and multiplication share priority; work left to right. |
| L2C-12 | Variant B 15 | Independent numeric | `18 ÷ 3 × 2 = 12`. |
| L2C-13 | Variant B 16 | Replayable example | Addition and subtraction share priority; work left to right. |
| L2C-14 | Variant B 18 | Reasoning | Reject “addition always comes first.” |
| L2C-15 | Variant B 19 | Exploration | Treat numerator and denominator as complete groups. |
| L2C-16 | video 09.48.11 | Replayable example | Work out top 8, bottom 4, then divide to get 2. |
| L2C-17 | N2.2 Q1 | Replayable example | Simplify `12/10` to `6/5`. |
| L2C-18 | N2.2 Q2 | Guided numeric | `(5 + 3)/(2 × 2) = 2`. |
| L2C-19 | N2.2 Q3 | Numeric | `(4² - 6)/(3 + 2 × 1) = 2`. |
| L2C-20 | N2.2 Q4a | Numeric | `2 × (1 + 4)/(3² - 4) = 2`. |
| L2C-21 | N2.2 Q4b | Bracket-placement choice | Group `2 + 3` in the denominator. |
| L2C-22 | N2.2 Q5a | Independent numeric | `n = 6`. |
| L2C-23 | N2.2 Q5b | Misconception check | Kofi is wrong; the value is 1. |
| L2C-24 | N2.2 Q5c | Transfer | The grouped single-line rewrite matches the fraction. |
| L2C-25 | video 09.48.31 | Replayable example | Form algebraic products, check like terms, then collect them. |
| L2C-26 | N2.3 Q1 | Replayable example | `3ab × 4b - 5 × ab² = 7ab²`. |
| L2C-27 | N2.3 Q2 | Algebra input | `10x²`. |
| L2C-28 | N2.3 Q3 | Algebra input | `7pq²`. |
| L2C-29 | N2.3 Q4a | Algebra input | `22mn`. |
| L2C-30 | N2.3 Q4b | Reasoning | Compare `12x²` with `8x`. |
| L2C-31 | N2.3 Q5a | Algebra input | `17c²d`. |
| L2C-32 | N2.3 Q5b | Misconception check | Coefficients multiply: `3 × 2 = 6`, so `6x²y`. |
| L2C-33 | N2.3 Q5c | Transfer | Multiply first, then collect like terms to get `7a²`. |
| L2C-34 | All sources | Recap | Four BIDMAS priority levels plus the algebra product rule. |

## Preserve, replace, extend

- Remove A/B options and their render paths from the Lesson 2 menu. Selecting Lesson 2 opens the tutor-backed lesson directly; other lessons retain their own choices.
- Preserve Variant B’s equal-groups exploration, equal-priority examples, fraction grouping exploration, optional BIDMAS hint and minimal study shell by reusing their proven components.
- Keep Variant C's own data, renderer, styling and documentation. Legacy visual and hint helpers remain implementation dependencies, not selectable alternatives.
- Replace every replayable worked demonstration with the owner-approved cumulative layout.
- Extend answer checking with narrowly scoped algebra-expression normalisation so spaces, multiplication signs, `^2` and `²` do not create false negatives. It does not evaluate arbitrary input.

## File structure

- `SOURCE-MAP.md`: full source transcription, video timing and transparent corrections.
- `SPEC.md`: this storyboard and architecture decision.
- `variantCLesson.ts`: stable IDs, source references, typed interactions, answers and working.
- `VariantCLessonView.tsx`: minimal study renderer, response retention and interaction controls.
- `TutorOperationsVisual.tsx`: Variant C visual dispatch, reusing the mature Variant B visual language where appropriate.
- `VariantC.css`: scoped additions for tutor-source labels and algebra inputs.
- `RESEARCH.md`: evidence boundary and mathematical decisions.
- `QA.md`: static, grading, interaction, responsive and build checks.

## In-flow video clips

Cleaned clips are attached to the existing teaching screens `L2C-02`, `L2C-16` and `L2C-25`, so all 34 stable screen IDs and 23 questions remain unchanged. The player opens in a Watch video tab; Step by step reveals the approved cumulative calculation. Switching tabs pauses playback and preserves revealed working. Leaving a screen unmounts and pauses its player. Native controls provide play/pause, seeking and fullscreen; additional Replay and speed controls are explicit. Playback never autoplays, loops or advances the lesson, and Continue does not require watching to the end.

The supplied clips have baked-in captions and no audio. A written walkthrough is available as an accessible alternative; source shorthand is clarified, not copied uncritically. Tabs support arrow keys, Home and End. A failed player offers the working alternative rather than blocking the learner. Media files live in `public/media/lesson-2/` and ship with the application; no external video service or new storage permissions are required.

## Cumulative working throughout Lesson 2

After approval of the `L2C-02` trial, all eight demonstration screens use `StackedWorkedExample.tsx`: `02`, `03`, `11`, `13`, `16`, `17`, `25`, `26`. The original expression remains visible and Next appends one simplification line. Back removes the latest working; Replay resets to the original expression. Each previous line underlines exactly the calculation replaced in the next line. The latest line is not underlined until its result is revealed. Continue remains independent of the optional controls.

Fraction numerator and denominator operations each get their own line. `L2C-17` separates denominator multiplication from addition before simplifying the completed fraction. `L2C-25` contains two distinct algebra examples: the second appears as a new labelled group when its first step is revealed, without an equals sign linking unrelated expressions. Back hides that group when returning to the first example, and Replay resets the complete walkthrough.

All 23 answer-feedback explanations remain complete and immediately visible on both correct and incorrect paths; learners do not need additional clicks to access a correction.
