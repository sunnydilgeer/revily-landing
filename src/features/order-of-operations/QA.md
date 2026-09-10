# Lesson 2 QA record

Date: 2026-09-09

## Automated checks

- TypeScript: `tsc --noEmit --incremental false` passes.
- Production build: `npm run build` passes.
- Browser console: no errors or warnings during the complete path.

## Browser checks

- Complete correct path reaches the Lesson complete screen.
- The opening comparison is a worked contrast, not a multiple-choice question.
- Guided priority checks use keyboard-accessible operation controls embedded in the expression.
- An incorrect operation immediately identifies and explains the legal next operation without requiring a retry.
- The outer **Continue** control remains locked until every transformed line has been completed.
- Fraction resolution is absent from the DOM before a question is submitted.
- Final summary changes **Finish lesson** to **Start lesson again** after completion.
- Lesson 1 remains accessible from preview navigation and opens at its original first state.
- At a 320 x 800 viewport, the page has no horizontal overflow (`scrollWidth === clientWidth === 320`).
- Mobile opening screen was visually inspected; header, journey, expression comparison and typography remain usable.

## Content checks

- All accepted answers and revealed calculation sequences were manually recalculated.
- DM and AS are explicitly described as equal-priority pairs evaluated left to right.
- The priority table has the required Letter, Meaning and Example headings.
- Algebra content is excluded.
- Lesson 2 has no multiple-choice interactions; final-value checks use numeric entry.

## Still required before publication

- Anushka's formal academic sign-off on the new direct-operation interaction and its explanations.
- Manual 200% zoom and keyboard-only checks in the target production browser matrix.
- Learner testing and delayed-retention evidence.
