# Lesson 15 (Algebra A1) QA

Run:

```bash
npm run verify:lesson15:tutor
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 28 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B); the Maths half of that check passes. `next build` passes on the Mac.
- Typed answers are marked by the `collectedExpression` rule: any order, 1x = x, xy = yx, x^2 = x², and the answer must be fully collected (4p + 2p + 3 is not accepted for 6p + 3).
- The verifier works every answer out again with a second, separate collector, and checks each answer is accepted in another order.
- Wrong answers give specific messages: unlike terms joined (5xy, u²v², 12ef), powers added (5w³, x⁴), a minus sign dropped, a number added to a letter term (18k), a term left out, and "you can still collect".
- "Which are like terms?" questions take several ticks and say why each wrong pick is not a like term.
- The Algebra chapter shows as Chapter 2 with this as lesson 1; the exam checklist lists it as A1. Its statements sit in the exam map's existing "Simplifying expressions" topic.
- All 41 screens at 320px wide, with an answer checked and the working stepped through: no sideways scrolling.
