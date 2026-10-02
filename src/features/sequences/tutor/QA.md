# Lesson 23 (Algebra A9) QA

Run:

```bash
npm run verify:lesson23:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 2 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier works every answer out again from the sequence itself: the gaps and the Fibonacci rule, square, cube and triangular numbers, each common ratio, every nth term tested against every given term, "is it a term?" by trying every position up to 1,000, and terms next to each other by trying every n. It also checks that the textbook's own numbers and its Higher-tier surd sequence are not used.
- In every working: one move a step, every heading short, every ⓘ in words with no "=", and the answer once, at the last step. Every row of every board is true at the n it reaches (49 rows). Greying out is checked on all 69 steps drawn on the sequence picture.
- Typed answers: nth terms in any order (98 − 8n is −8n + 98) and without spaces; next terms in boxes, in order (or either order for two terms next to each other); every box needed; ½ as a fraction (2/4 too). 22 wrong-answer messages checked (the term-to-term rule typed for the nth term, the gap and first term swapped, the sign, a number from the wrong step).
- All 48 screens at 320px and 1280px wide, every working stepped through and every ⓘ opened, with an answer typed on every question. No sideways scrolling, and nothing clipped inside a card. Long worded answers wrap on a phone.
- The five videos are the newer zip's, byte for byte, with SVG posters.
