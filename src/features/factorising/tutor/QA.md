# Lesson 18 (Algebra A4) QA

Run:

```bash
npm run verify:lesson18:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 30 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- Answers are typed with the x² key and marked by the new `factorisedExpression` rule: the right term outside, and the bracket's terms in any order (the bracket may also come first). Partly factorised answers, like 7(2y² − 3y), and the question itself are not accepted. Taking out the negative factor, −7y(−2y + 3), is.
- The verifier expands every answer back and checks it against the question at four sets of letter values (including negatives and a fraction), checks nothing is still shared inside the bracket, checks each answer in another order and bracket-first, and checks every box of every grid.
- Wrong answers get specific messages, found by expanding the answer back and comparing term by term: not fully factorised (names what is still shared), the question written back, a term lost (6 ÷ 6 = 1 keeps its place), a sign flipped, and a box that doesn't give back its term.
- All 17 screens at 320px wide, with the right answer checked, the working stepped through and every ⓘ opened: no sideways scrolling. Four wrong answers checked in the browser too, and the lesson at 1280px.
