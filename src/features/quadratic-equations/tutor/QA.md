# Lesson 22 (Algebra A8) QA

Run:

```bash
npm run verify:lesson22:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:maths:navigation
npm run build
```

Checked on 2 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier solves all 11 equations again by trying every whole number from −100 to 100 and compares the answers with the source's. In every working: each row of the board is true at both answers, each listed pair multiplies to the last number, exactly one adds to the middle number and it goes into the brackets, one move a step in the textbook's order, the label above each heading names its textbook step, no heading or ⓘ repeats the answer, and the answer appears once. Greying out is checked on all 56 steps.
- Typed answers: two boxes, x = ☐ or x = ☐, accepted in either order and with a typed − sign; one answer, swapped signs, a repeated answer and the question's own numbers are marked wrong. 13 wrong-answer messages checked (the numbers from the brackets, one sign wrong, the question's numbers, a pair that doesn't add up, solving before making one side 0).
- All 14 screens at 320px and 1280px wide, every working stepped through and every ⓘ opened, with right answers and six wrong ones. No sideways scrolling. Six progress dots beside "Show the first step" were 4px too wide at 320px, so the dots now close up there (`WorkedChain.css`).
- The worked example has no video yet: Aniksha is re-recording it with x² + x = 20.
