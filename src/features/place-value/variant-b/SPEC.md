# Lesson 3 Variant B — storyboard

Original Revily content adapting the existing Lesson 3 scope to the agreed pattern in `../../LESSON_DESIGN.md`. Preserve the original as A; new B is Step by step. No deployment.

## Screen-by-screen sequence

| Screen | Visual and interaction | Outcome |
| --- | --- | --- |
| 01 | Tap each 3 in 3,333; read its column and value | Same digit, different values |
| 02 | 4,582 with the 5 marked; choose its place | Hundreds |
| 03 | Same marked 5; enter its value | 500 |
| 04 | Replayable 72,406,981 example, marked 4 | Locate hundred thousands, then 4 × 100,000 = 400,000 |
| 05 | Mark the first 5 in 18,852,534; independent value | 50,000 |
| 06 | Mark the adjacent 8s in 18,852,534; choose relationship | First is worth ten times the second |
| 07 | Explore the four 4s in 4.444 | Each column right is one tenth as large |
| 08 | Mark 7 in 6.47; identify its place | Hundredths |
| 09 | Same digit; enter its value | 0.07 |
| 10 | Replayable 39.41285 example with marked 2 | Count three places right; 2 thousandths = 0.002 |
| 11 | Mark 8 in 7.06482; independent decimal value | 0.0008 |
| 12 | Fill placeholder zeroes in the columns for 5,000 + 70 + 0.4 | 5,070.4; other digits stay in position |
| 13 | Four named parts: 6 ten-thousands, 2 hundreds, 4 ones, 3 hundredths | Choose 60,204.03 |
| 14 | 8,000 + 6 + 0.09 | Enter 8,006.09 |
| 15 | Switch between 3.4, 3.40, 3.400; aligned digits | Trailing decimal zeroes preserve value |
| 16 | Select both values equal to 0.5 | 0.50 and 0.500 |
| 17 | Test the claim that any zero can be removed | Counterexample: 5.07 ≠ 5.7 |
| 18 | Replayable alignment of 3.45 and 3.405 | First different place is hundredths; 3.45 > 3.405 |
| 19 | Compare 0.7 and 0.07; choose a sign | > |
| 20 | Compare 5.208 and 5.28; choose a sign | < |
| 21 | Explain why more decimal digits does not mean larger | 0.405 < 0.45, because 0 hundredths < 5 hundredths |
| 22 | Replayable ordering of four decimals; align then sort | 0.07 < 0.7 < 0.707 < 0.77 |
| 23 | Move 1.5, 1.005, 1.055, 1.05 into ascending order | 1.005, 1.05, 1.055, 1.5 |
| 24 | Delayed large-number retrieval: marked 3 in 9,304,218 | 300,000 |
| 25 | 48,306.075; select three true statements | 8 represents 8,000; 7 is hundredths; .075 < .57 |
| 26 | Three concise method reminders | Finish / restart |

## Mathematical and presentation decisions

- Digit, place and value are separate questions before being combined. Naming a place is not the same as giving a value.
- The decimal point sits between ones and tenths. No wording implying the point moves. Positive numbers only, matching the source scope.
- Each place to the right is one tenth the previous place. Multiplication/division algorithms by powers of ten remain outside this lesson.
- Internal placeholder zeroes matter; trailing decimal zeroes do not change a value. Never claim all zeroes can be removed.
- Compare matching columns from the left; the first unequal place decides. Equal values have no unequal place.
- Large numbers appear as a single readable number with the target digit clearly marked. Hints show a focused three-column window rather than shrinking a full eight-column chart.
- Comparison questions show the two numbers once, with sign choices directly under the question. Alignment is optional inside Hint. Ordering keeps the learner's submitted order after checking; the accepted order appears in the explanation.
- All 17 questions have a collapsed inline Hint. No modal, no default answer-revealing charts. Hints are contextual and do not reveal the final response. Existing full-working feedback and non-blocking Continue apply.

## Files

`variantBLesson.ts`: typed 26-screen content, visuals, hints, answers and worked explanations. `PlaceValueVisuals.tsx`: number displays, focused column guide, explorers and worked examples. `PlaceValueHint.tsx`: inline disclosure with optional method tabs. `VariantBLessonView.tsx`: shared-engine player and retained choice/numeric/order responses. `VariantB.css`: scoped layout. `QA.md`: rendered checks. `src/App.tsx`: Lesson 3 A/B selection and focused shell.
