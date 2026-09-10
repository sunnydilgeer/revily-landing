# Lesson 3 QA record

Date: 2026-09-09

## Automated checks

- TypeScript: `tsc --noEmit --incremental false` passes.
- Production build: `npm run build` passes.
- The pre-existing multiple-lockfile workspace-root warning remains; it does not fail the build.

## Browser checks completed

- Complete correct path reaches the lesson-complete state and exposes **Start lesson again**.
- Incorrect hook response reveals tailored misconception feedback, the accepted answer and **Continue**.
- Comma-grouped (`400,000`), space-grouped (`8 006.09`, `300 000`) and plain numeric input are accepted by the normalized-number rule.
- Hint dialog opens with focus on **Close hint** and dismisses with Escape.
- Decimal ordering completes using the explicit left/right controls and reveals aligned values.
- GCSE multi-select transfer accepts exactly the three true statements.
- Back navigation returns to the preceding state.
- Lesson 1 and Lesson 2 selectors still open their existing lessons.
- At 320 × 800, `scrollWidth === clientWidth === 320`; the place-value chart scrolls inside its own container.
- Browser console reports no errors or warnings on the tested paths.

## Required browser checks

- Full all-incorrect path (representative incorrect path completed).
- Answer withholding before submission (source and representative DOM checks completed; finish full state matrix).
- Hint close button, backdrop and tab loop (open, Escape and focus behavior completed).
- Ordering by pointer drag (left/right controls completed).
- Restart (final **Start lesson again** state verified; activation remains to test).
- Desktop layout and 200% zoom (320 px mobile layout completed).
- Reduced-motion presentation and semantic table reading.

## Publication gate

- Anushka academic sign-off remains required.
