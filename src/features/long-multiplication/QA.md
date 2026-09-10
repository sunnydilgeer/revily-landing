# Lesson 5 QA

## Automated verification

- `./node_modules/.bin/tsc --noEmit --incremental false`
- `npm run build`

Both pass. The existing multiple-lockfile workspace-root warning remains.

## Browser checks

- Lesson 5 is selected and rendered at `/preview`.
- The opening setup is a four-step reversible animation, not an MCQ.
- Step 1 shows only 281; later steps add 23, the line and the starting digit.
- Every assessed state uses one short numeric response; there are no answer-card MCQs.
- The `281 × 23` player exposes nine clickable steps with a next-step prompt.
- Step 3 shows the carry and only the partial result available at that step.
- Active multiplication steps draw arrows from the bottom digit to the top digit or digits it multiplies.
- The former red carry bubble is not rendered; carries remain in the explanatory working text.
- Step 5 shows a distinct place-holding zero before the tens row is built.
- Rewinding from step 5 to step 2 removes the later digits and zero.
- The Continue action remains hidden until the final worked-example step.
- A 390 × 844 viewport has no horizontal document overflow.
- The five-item lesson selector fits the phone viewport.
- No browser console errors were introduced by the lesson.

## Accessibility and motion

- Worked-example dots and playback buttons have accessible names.
- Progress tracks expose min, max and current values.
- Stage narration uses a polite live region.
- Lesson headings receive focus after state changes.
- Hints use modal dialog semantics, Escape dismissal and focus on close.
- `prefers-reduced-motion` disables stage, row, carry and zero animations.
