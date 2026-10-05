# Lesson 20 (Algebra A6) QA

Run:

```bash
npm run verify:lesson20:tutor
npm run verify:lesson19:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 1 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier rearranges all 24 formulae by hand (as plain arithmetic) and puts each answer back into the original. Every row of every board is true for those numbers (112 rows); each working ends on exactly one answer box, subject first, as the last row of its last move, with nothing repeating it; every move boxes what it undoes and does one thing to both sides; every ⓘ is words, not maths.
- Typed formulas: 16 questions, each accepting its answer in 3–4 other ways (51 spellings, including the formula box's own fraction and root forms, lower case letters, ÷ and expanded forms), and checked against the hand-rearranged formula at three sets of numbers. 36 wrong answers each get their specific message.
- The 8 "use your formula" values are worked out by hand and put back into the original formula.
- All 33 screens at 320px and 1280px wide, with every working stepped through, every ⓘ opened, right answers and nine wrong ones. No sideways scrolling at either width.
- Lesson 19's board shares the picture code; its verifier still passes. One small change shows there too: a boxed term keeps the space after its sign ("+ 5" in its box, as unboxed terms already had), so the opening screen reads "C = 3m + 5", not "3m +5".
