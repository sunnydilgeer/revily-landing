# Lesson 25 (Algebra A11) QA

Run:

```bash
npm run verify:lesson25:tutor
npm run verify:lesson24:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 4 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier works every answer out again from the question itself: each answer must allow exactly the same numbers as the question, tested on every quarter from −30 to 30. Every one of the 77 board rows is tested the same way, so no move changes the answer. A row that forgot to flip the sign would fail. The integers are found by trying every whole number.
- Only A11.4 flips a sign, and every flip is boxed on the row that divides or multiplies by the negative.
- Other ways of writing each answer are accepted (<= and >=, no spaces, lists in any order); a sign that should have flipped and a strict sign swapped for an inclusive one are rejected.
- In every working: one move a step, every heading short, every ⓘ in words with no "=", the part each move works on boxed, and the answer once, at the last step. Greying out is checked on every step.
- 21 wrong-answer messages checked (an end that should or shouldn't be in a list, the sign not flipped, a move done to one part only, the fraction not cleared).
- Every screen at 320px and 1280px wide, every working stepped through and every ⓘ opened, with an answer typed on every question. No sideways scrolling, and nothing clipped inside a card.
- The four videos are the zip's own files, byte for byte, with SVG posters.
