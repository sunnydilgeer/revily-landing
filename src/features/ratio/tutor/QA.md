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

# Lesson 31 (Ratio R2) QA

Run `npm run verify:lesson31:tutor` with the list above.

Checked on 8 October 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-044-B). `next build` and `tsc --noEmit` pass.
- The verifier works out every board row again (reading past "total" and "each"), checks every row picture keeps the same amount for 1 (direct) or the same total work (inverse), that each row's name matches its blocks, and the source answers from the worksheets' own numbers.
- Every screen at 320px and 1280px wide, with every answer typed or chosen and every working stepped through: every answer is marked right and nothing scrolls sideways.
- The two videos are Aniksha's files, byte for byte (sha256 checked against her zip), with SVG posters.

# Lesson 32 (Ratio R3) QA

Run `npm run verify:lesson32:tutor` with the list above.

Checked on 8 October 2026:

- Every verifier passes except `verify:lesson15:tutor` to `verify:lesson20:tutor`, which already fail on `main` (they cannot load `RatioPictures.tsx`). `next build` and `tsc --noEmit` pass.
- The verifier works out every board row again (reading past £, % and words), checks every hundred-square piece is that share of the whole and fits beside the square, that each green answer and purple note fits on one line on a phone, and the source answers from the worksheets' own numbers.
- Every screen at 320px and 1280px wide, with every answer typed or chosen and every working stepped through: every answer is marked right and nothing scrolls sideways. Lessons 30 and 31 were walked again at 320px with the v2 videos.
- The four videos are Aniksha's files, byte for byte (sha256 checked against her zip), with SVG posters. Lessons 30 and 31 now use her v2 videos, also byte for byte.

# Lessons 33 and 34 (Ratio R4 and R5) QA

Run `npm run verify:lesson33:tutor` and `npm run verify:lesson34:tutor` with the list above.

Checked on 9 October 2026:

- Every verifier passes except `verify:lesson15:tutor` to `verify:lesson20:tutor`, which already fail on `main` (they cannot load `RatioPictures.tsx`). `next build` and `tsc --noEmit` pass.
- The verifiers work out every board row again (reading past £, % and words, and working out powers like 1.05⁴; a row cut short with "…" or given to the penny must agree to its last digit), check every hundred-square piece is that share of the original and that the square never shows the original before the last step, and check every bar picture: one size through a working, the years worked out in order, each pill the bar's value, the last bar only on the last step, and nothing off the edge.
- Every screen at 320px and 1280px wide, with every answer typed or chosen and every working stepped through: every answer is marked right and nothing scrolls sideways.
- The six videos are Aniksha's files, byte for byte (sha256 checked against her zips), with SVG posters.

