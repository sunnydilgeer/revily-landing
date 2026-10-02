# Lesson 21 (Algebra A7) QA

Run:

```bash
npm run verify:lesson21:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 1 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier multiplies all 24 source answers back out (at four values of x) and checks the two numbers multiply to the last number and add to the middle one. In every working: each listed pair multiplies to the last number, every pair with the right signs is listed, exactly one pair adds to the middle number and it is the ticked one, the brackets hold that pair, one thing is added a step, and the working ends on one answer. Greying out is checked on all 96 steps.
- Typed answers: two brackets with the x² key, accepted in either order, without spaces, with × between them and with the number first inside a bracket; the question itself, swapped signs and a repeated number are marked wrong. Wrong answers get a message worked out from the student's own brackets (16 checked): what they multiply out to, and whether their numbers multiply right, add right or have the wrong signs.
- All 33 screens at 320px and 1280px wide, every working stepped through and every ⓘ opened, with right answers and seven wrong ones. No sideways scrolling.
