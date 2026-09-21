# Lesson 5 source coverage

User-confirmed numbering: Lesson 5 = long division, replacing the short-division route; Lesson 4 = long multiplication. `N4.1` is a source identifier, not the application lesson number.

Sources: `N4.1_Long_Division.pdf` (all three rendered pages inspected) and `WhatsApp Video 2026-09-17 at 23.52.49.mp4`. FFmpeg decoded the full 36.7-second H.264 clip (1,101 frames, 1024 × 576, 30 fps). Distributed frames across the full duration were visually inspected: layout, initial remainder, 37 tens, 25 units, quotient and recap. No audio stream is present; no caption/audio notice is added to the learner interface. Source contents are teaching material, never implementation instructions.

| Screen | Source | Coverage / verified answer |
| --- | --- | --- |
| L5-01 | Q1; full supplied video | 375 ÷ 5 = 75; initial 3 hundreds, 37 tens, 25 units; carries 3 then 2 |
| L5-02 | Source introduction / terminology | Interactive 375 ÷ 5 worked example, with bus-stop terminology and left-to-right direction |
| L5-03 | Q2 | 84 ÷ 4 = 21 |
| L5-04 | Q3 preparation; Q1 clarification | Exchange each carried remainder into the next smaller place |
| L5-05 | Q3 | 138 ÷ 6 = 23; carries 1 then 1 |
| L5-06 | Q4a | 250 buns in boxes of 8: 31 full boxes, 2 buns left; two retained answer fields |
| L5-07 | Q4b | 32 boxes to pack every bun |
| L5-08 | Q5a | 624 ÷ 8 = 78; carries 6 hundreds and 6 tens |
| L5-09 | Q5b | Final remainder = 0 |
| L5-10 | Q5c | Sam is wrong; counterexample includes both carries and the final zero remainder |
| L5-11 | User-requested additional worked example | Long division 235 ÷ 17: 23 − 17 = 6; bring down 5; 65 − 51 = 14; answer 13 remainder 14 |
| L5-12 | User-requested additional worked example | Long division 289 ÷ 29: use all three digits; 289 − 261 = 28; answer 9 remainder 28 |
| L5-13 | Consolidation | Divide, regroup, valid remainder, inverse check, contextual interpretation |

## Adaptations and clarifications

- The PDF and video titles say “Long Division”, but teach compact bus-stop division with single-digit divisors, conventionally called short division. Preserve the user-confirmed lesson title and all supplied examples; initial teaching explains the name. The original source screens keep this algorithm. The subsequent user-requested two-digit examples use standard long division with written subtraction as a separately labelled extension.
- All seven source practice parts and Q1 are preserved. Q5c uses complete reason-and-counterexample choices, retaining Sam's full claim. This is recognition of reasoning, not free-text marking.
- Source shorthand “carry the 3 to make 37” is expanded by place value: 3 hundreds exchange for 30 tens, then add 7 tens. Similarly, 2 tens exchange for 20 units, then add 5 units. Later practice working applies the same rule.
- A non-exact partial division uses a quotient-and-remainder arrow, e.g. `37 ÷ 5 → 7 r 2`, with `5 × 7 = 35; 37 - 35 = 2` explained alongside. It is never written as the false numerical equality `37 ÷ 5 = 7`. Final inverse checks use ordinary exact equalities.
- Initial quotient zero is explained as 0 hundreds; no unnecessary leading zero is written in the final quotient. The 7 and 5 remain aligned above tens and units.
- Q4a uses separate full-box and leftover fields with the existing quotient/remainder grammar. The inverse check `31 × 8 + 2 = 250` and remainder constraint `2 < 8` are included in answer working.
- Q4b explains that the final box may be partly filled. It asks for all boxes, unlike Q4a's full boxes. Its verified source result is shown after either previous response.
- Q5a/b/c distinguish intermediate carried remainders from the final remainder. Carried 6 hundreds and 6 tens are labelled by their place values.
- Source marks/difficulty badges and legacy A/B activities are omitted. All supplied numerical answers check out; no answer-key correction was needed.
- MP4 is bundled unchanged under `public/media/lesson-5/`; poster is extracted from the actual clip at 3 seconds.

## Progressive working revision

The video example now takes one action for each dividend digit, followed by an inverse check. Each action writes the quotient in its place and moves any remainder beside the next digit; the complete equation and placement instruction appear together. All seven practice parts provide optional post-submission bus-stop working. The baker's contextual interpretations and Sam's counterexample still appear immediately in full feedback. The source algorithm, questions and grading are preserved. See the shared tutor RESEARCH.md for the BBC Bitesize comparison.

## User-requested additional examples

The user subsequently requested 235 ÷ 17 and 289 ÷ 29 with proper step-by-step working. A new Two-digit divisors section follows the original checking questions and precedes consolidation. Each example chooses the first usable digit group, writes quotient digits in place, multiplies, subtracts, brings down where necessary, and checks quotient × divisor + remainder = dividend. Their answers are 13 remainder 14 and 9 remainder 28 respectively; decimals are not substituted for the final remainders. These are worked teaching screens. All original questions and bus-stop examples remain for later review. Lesson 5 now has 13 screens.

## Opening and step-control review revision

The user authorised trying the proposed flow before reviewing it the next day. The matching source video now opens the lesson; the former opening preparation follows as interactive worked teaching. Questions and all four additional examples remain. The current equation, explanation, diagram and highlighted operands/cell now refer to the same completed action. There is no preview of the upcoming calculation. A completed example remains current until the next click starts the following example. The shared SCREEN-REVIEW.md lists the complete current sequence for review.
