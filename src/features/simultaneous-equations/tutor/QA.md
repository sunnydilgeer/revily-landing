# Lesson 27 (Algebra A12) QA

Run:

```bash
npm run verify:lesson27:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 5 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier turns every board row into a sum and checks both sides are equal at the question's solution (107 rows), and solves each pair of labelled equations again from their coefficients (11 pairs): one solution, the one given.
- x and y are typed in their own labelled boxes; the two swapped round is marked wrong, with a note.
- One move a step, short headings, the answer once at the last step, and the rows being taken from each other stay clear while older rows grey out.
- Every screen at 320px and 1280px wide, with an answer typed on every question and every working stepped through. No sideways scrolling.
- The two videos are Aniksha's files, byte for byte, with SVG posters.
