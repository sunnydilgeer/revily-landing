# Lesson 17 (Algebra A3) QA

Run:

```bash
npm run verify:lesson17:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 28 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` passes.
- Answers are typed and marked by the order-free `collectedExpression` rule, with the x² key. They must be fully collected: x² + 6x + 4x + 24 is not accepted for x² + 10x + 24.
- The verifier checks every answer against the brackets at three sets of letter values (including negatives), checks each is accepted with its terms in another order, and checks that the boxes of every grid add up to the answer.
- Wrong answers get specific messages, found by trying each slip on one product at a time: a term inside left unmultiplied (8m + 3), a sign flipped (−6p − 15, x² + 4x + 21, 3x − 2), a letter times itself not squared (15k + 20k), the numbers not multiplied (m² for 2m²), a product left out (a × 1), only the first and last products (x² − 21), the last numbers added (x² + 4x + 4), a squared bracket as two squares ((n − 4)² = n² − 16), and "you can still collect".
- All 17 screens at 320px wide, with the right answer checked, the working stepped through and every ⓘ opened: no sideways scrolling. Wrong answers checked in the browser too.
