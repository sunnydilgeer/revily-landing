# Lesson 28 (Algebra A13) QA

Run:

```bash
npm run verify:lesson28:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 5 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- Every identity row is checked at 12 random sets of values for its letters, every angle row at its answer, and the triangle proofs for random triangles (541 rows). Ella's wrong identity (A13.2 Q5c) is checked to be wrong.
- The counterexamples are checked: 2n + 1 is prime for n = 1, 2, 3 but not 4; n² + n + 11 is prime for n = 1 to 9 but not 10.
- Typed expressions are accepted in any order; slips like 5x + 2 are rejected.
- Every angle picture's lines and labels sit inside its 320 × 210 box (21 pictures).
- On a phone, a proof's rows are written one under another from the left, so a long side wraps across the whole board instead of a narrow column.
- Every screen at 320px and 1280px wide, with an answer on every question and every working stepped through. No sideways scrolling.
- Three videos are Aniksha's files, byte for byte; the A13.2 video is her file with the wrong scene cut (see SOURCE-MAP.md).
