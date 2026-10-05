# Lesson 26 (Graphs GR1) QA

```bash
npm run verify:lesson26:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:maths:navigation
npm run verify:lesson-kit
```

Checked on 5 October 2026:

- The lesson verifier checks every grid is drawn to its own numbers (y = a across at a, x = a up and down at a, every point on the grid, every step straight across or up and labelled with its size, at most 9 squares across with numbers on both sides of each axis, and every step that plots dots, draws a line or counts an arrow highlighting the axis numbers it uses), works every gradient out again from the two points its steps join (and, for two-point questions, from the question's own words), checks the slips are rejected and explained, one move a step, short headings, ⓘ in words, and the answer once at the end. It also checks the lesson stays hidden: not in the registry, App, cards, practice or exam map; its preview page noindexed and behind the preview password.
- Every screen walked in Chromium at 360px and 1280px, every working stepped through, an answer given on every question: no sideways scroll, no console errors.
- Every lesson verifier 1–25 still passes with the shared changes (graph picture, `signed` answers). `verify:revision-cards` still fails on `main` for a Science card (B-GEN-042-B).
