# Lesson 29 (Algebra A14) QA

Run:

```bash
npm run verify:lesson29:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run verify:maths:navigation
npm run build
```

Checked on 6 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier works out every board row again (235 rows; the equation questions at 12 random values of x), and every machine picture's numbers from its boxes (74 box sums). Inputs found by working backwards are put through the machine forwards again.
- Each machine picture keeps every shape inside its 320-wide box, with no two numbers or opposites underneath overlapping, every arrow long enough to see, and each step rings the box its heading names.
- One move a step, short headings, the answer once at the last step, the aim said first on each worked example.
- Every screen at 320px and 1280px wide, with an answer typed or chosen on every question and every working stepped through. No sideways scrolling.
- The three videos are Aniksha's files, byte for byte (sha256 checked against her zip), with SVG posters.
- `verify:practice`'s rotation check now runs three times the sprints each ramp needs to serve every template once, instead of a fixed 40, which the bank had outgrown (adding any template tipped it over by chance).
