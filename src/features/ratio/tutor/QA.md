# Lesson 30 (Ratio R1) QA

Run:

```bash
npm run verify:lesson30:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 7 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B); its Maths checks, which run first, pass. `next build` and `tsc --noEmit` pass.
- The verifier works out every board row again (the changing-ratio equations at their solution, 1 part), every pill against its parts times 1 part (or one group of 1 : n), and the source answers from the worksheets' own numbers.
- Every ratio picture stays inside its box, keeps one size through its working (and matches the question's own bars), with names, pills, block numbers and the purple line all fitting.
- One move a step, short headings, the answer once at the last step, the aim said first on each worked example.
- Every screen at 320px and 1280px wide, with the answer typed or chosen on every question and every working stepped through: every answer is marked right, no sideways scrolling, no console errors.
- The three videos are Aniksha's files, byte for byte (sha256 checked against her zip), with SVG posters.
