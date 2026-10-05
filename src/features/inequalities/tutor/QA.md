# Lesson 24 (Algebra A10) QA

Run:

```bash
npm run verify:lesson24:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 4 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier works every inequality out again from the question's own words: each answer must allow exactly the same numbers as the question, tested on every half-number from −40 to 600. The smallest and largest integers are found by trying every whole number.
- Other ways of writing each answer are accepted (3 > x, <= and >=, no spaces); the other circle, the other direction, a different number and a different letter are rejected.
- In every working: one move a step, every heading short, every ⓘ in words with no "=", halfway lines purple, and the answer once, at the last step. Each drawn circle matches the answer's sign. Greying out is checked on every step, and the opening screen draws only what the question gives.
- 16 wrong-answer messages checked (the open or filled circle, the arrow's direction, the circles swapped, one sign instead of two, the wrong letter).
- Every screen at 320px and 1280px wide, every working stepped through and every ⓘ opened, with an answer typed on every question. No sideways scrolling, and nothing clipped inside a card.
- The two videos are the zip's own files, byte for byte, with SVG posters.
