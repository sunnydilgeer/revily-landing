# Lesson 14 QA

Run:

```bash
npm run verify:lesson14:tutor
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 28 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B); the Maths half of that check passes.
- `next build` passes on a case-sensitive copy. On a normal macOS checkout, `main` itself fails to build and to run because `practice/Sprint.tsx`/`sprint.ts` and `readiness/PaperMap.tsx`/`paperMap.ts` clash by case; Vercel (Linux) is unaffected.
- The verifier works every typed answer out again from the question's own text, and checks that each hop picture moves the point as many places as the power.
- Standard form answers use two boxes, A × 10 to the power n, with a sign button for negative powers (phones have no minus key on the number pad). A must be at least 1 and less than 10.
- Wrong answers give specific messages: point moved the wrong way, zeros added instead of moving the point, a power one out (counting digits or zeros), A not between 1 and 10, powers multiplied instead of added, and powers subtracted the wrong way round.
- All 49 screens at 320px wide, with an answer checked and the working stepped through: no sideways scrolling.
