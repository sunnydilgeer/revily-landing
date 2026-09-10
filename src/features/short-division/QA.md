# Lesson 4 QA record

Date: 2026-09-09

## Automated checks

- TypeScript: `tsc --noEmit --incremental false` passes.
- Production build: `npm run build` passes.
- All eight authored division results were independently checked against `q × d + r = N` and `0 ≤ r < d`.
- The pre-existing multiple-lockfile workspace-root warning remains; it does not fail the build.

## Browser checks

- Complete all-correct path reaches the lesson-complete state.
- **Finish lesson** changes to **Start lesson again**, and restart returns to the hook with cleared response state.
- Complete all-incorrect path reaches the lesson-complete state. Every question reveals the accepted answer and **Continue** after one submission.
- Representative misconception feedback was verified for independent-digit division, an oversized multiple, leading zero, carrying the quotient, remainder-as-decimal, omitted internal zero, omitted check remainder and rejecting a quotient zero.
- Exact answer `26.0` is rejected by the integer-only acceptance rule and reveals `26`.
- Quotient `69` with invalid remainder `5` is rejected and reveals `69 remainder 2`.
- Separate quotient and remainder fields have visible programmatic labels.
- Answers for the exact and remainder independent questions are absent from visible and accessible visual text before submission and appear after submission.
- Worked examples expose one step per activation and withhold later quotient digits and working.
- The layout teaching visual pairs each term with useful content: `Divisor — 9`, `Quotient — answer goes here`, and `Dividend — 288`.
- The introductory method visual no longer repeats the five process words as chips beneath the bus-stop diagram.
- The worked-example player starts paused, advances one segment every 2.6 seconds when played, pauses without advancing, rewinds with **Previous**, forwards with **Next**, and supports direct selection of every labelled timeline dot.
- Rewinding removes later quotient digits, working and final-answer text. Once the final step has been viewed, **Continue** stays available while the learner reviews earlier steps.
- The regrouping steps animate the carried `1` travelling beside the next digit and resolve to `18` or `17` without a competing flowchart.
- Step 5 of `288 ÷ 9` contains no multiplication or subtraction bubbles; the explanation is carried by the diagram and one short sentence.
- All three worked examples use the same player: 6 steps for `288 ÷ 9`, 5 for `67 ÷ 5`, and 4 for `408 ÷ 4`.
- Hint dialog puts focus on **Close hint**, dismisses with Escape and restores focus to the trigger. The modal traps its single focusable control.
- Back navigation returns to the preceding state and clears feedback.
- Lesson 1, Lesson 2 and Lesson 3 selectors still open their existing lessons; Lesson 4 reopens with fresh state after switching.
- At 320 × 800, `scrollWidth === clientWidth === 320`; the lesson card is 292 px wide and the paired response fields stack.
- At 1440 × 900, the lesson is capped at 980 px with no page overflow.
- Reduced-motion media rules are present and remove Lesson 4 animation, transition and smooth scrolling while keeping the step sequence user-controlled.
- Browser console reports no errors or warnings on the tested paths.

## Remaining manual checks

- Confirm at a true browser-level 200% zoom. The in-app test browser did not expose a working zoom control; 320 px reflow was verified as the stricter width case.
- Run a screen-reader pass with the publication target and confirm the preferred pronunciation of the bus-stop symbol.

## Publication gate

- Academic sign-off remains required before publication.
- Production analytics dispatch remains an integration gate; lesson metadata and local misconception tracking are present, but this preview has no identified analytics sink.
