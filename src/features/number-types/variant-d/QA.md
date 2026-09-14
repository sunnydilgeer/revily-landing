# Variant D — revised implementation QA

Checked 13 September 2026. These results supersede the initial static implementation's QA.

## Scope and content

- Eleven opening states implement the revised SPEC.md. Only the integers/non-integers micro-skill changes.
- Assertions passed for unique state IDs, all correct/wrong answer keys, exact multi-select grading (including rejecting an incomplete correct subset), and identical correct/incorrect progression routes.
- All 33 baseline states from L1-F01 onward are retained by reference, in their original order. Baseline lesson content, B content, factor/multiple visuals, prime grid and shared CSS are unchanged.
- Fractions and decimal notation are classified by value. Root explanations use exact square identities or consecutive-square bounds; plotted roots use Math.sqrt rather than rounded decimal evidence.

## Actual rendered checks

Used the Codex browser against Next.js development and production previews, not just compilation.

- Desktop: explored presets and keyboard half-unit movement, including −2.5 between −3 and −2. Verified zero and negative integer cases.
- Worked fraction: revealed 12 ÷ 4 = 3, plotted 3, replayed to the initial step. Continue is available without completing the optional demonstration.
- Equivalent forms: switched 2 / 2.0 / 4/2 while the point stayed at 2. Reason choices remain readable as full-width rows.
- Worked roots: switched between √49 and √11, revealed square identities/bounds, and plotted/classified both. Switching resets the worked steps.
- Single choices submit immediately and grade the tapped ID. Both correct and incorrect outcomes were exercised across the opening. No second guess or Check button is required for a single choice.
- Choices remain visible and disabled after grading; correct answers are marked, and the learner's incorrect choice is separately marked. Explanations state the answer immediately. Continue stays enabled.
- Final multi-select: exact correct set succeeds; a wrong selection and an incomplete correct subset fail, reveal all four accepted answers, and permit Continue. Both outcomes reach the original factors/multiples introduction.
- Back returns to the previous screen and resets local demo/answer state. A/B/D switching works. Existing A multi-select, B single-select and shared numeric-input submission still grade and progress through their existing controls.
- Production smoke check: negative non-integer exploration, Back, one-tap wrong answer and retained choices all passed. No browser console errors were recorded during this smoke check.

## Mobile layout

The browser viewport override returned successfully but did not change innerWidth. Used temporary same-origin frames containing the actual /preview application at 390px and 320px instead. The temporary QA HTML was removed before the production build.

- Traversed all eleven screens at both widths, including expanded worked examples, reason choices, roots and final feedback.
- Twenty-four DOM geometry checks found document scrollWidth equal to viewport width and no escaping stage, choice, equation, tick or point elements.
- Inspected actual screenshots of the explorer, feedback, worked fraction, worked root and final choices. Markers align proportionally with integer ticks; √11 and √20 lie inside the correct intervals.
- Fixed D's mobile part counter wrapping by preventing that counter from shrinking. Shared-state header styling remains unchanged.
- Controls provide at least 44px height; slider and buttons work with keyboard/pointer input. Reduced-motion transition override is present in scoped CSS; a real device and an enabled OS reduced-motion setting were not tested.

## Build

- Repository `npx tsc --noEmit`: passed.
- The first in-repository production build compiled and passed type checks, then failed collecting generated pages while another existing Next.js dev server was using .next.
- Rebuilt an isolated temporary copy of the same source with the existing node_modules. `npm run build` passed compilation, lint/type validation, all 17 static pages and tracing. Served this production output on 127.0.0.1:3100 and smoke-tested it in the browser. The existing development server was preserved.
- No deployment, push or commit.

## Practical limits

This is a research-informed redesign and browser QA, not evidence of improved pupil learning. No real-device or pupil usability study has been performed. Atom's logged-in player and Duolingo's exact integer/non-integer sequence were not inspected; research distinguishes published approaches from directly observed Cognito behavior.

## PDF incorporation extension — 13 September 2026

The user approved the revised flow and requested the remaining PDF content. The opening is now 18 states: the original eleven plus seven PDF tasks, mapped individually in SPEC.md. Earlier references above to an eleven-screen opening describe the previous revision.

- Re-read all five PDF pages. Q1's full list remains D-I-11; Q2, Q3, Q4a, Q4b, Q5a, Q5b and Q5c now map to D-P-01…07. Original values and correct answers are retained. Explanations correct the PDF's whole-number terminology and use exact root bounds.
- Type checking and production build passed in an isolated source copy. Shared-state identity assertions passed for all 33 states; all 18 opening routes connect in order and wrong-answer routes match correct-answer routes.
- Open interval grading accepts valid decimals, simple integer fractions, and mixed fractions. Automated assertions covered 6.2, 6.5, 13/2, whitespace around fractions, 6 1/2, middle-dot decimal notation and near-boundary values. Endpoints, out-of-range numbers, division by zero, NaN, Infinity, malformed input and expression-like text are rejected.
- Actual production browser: traversed the original eleven screens into the new practice. Checked all three classification sets, wrong root/equation reasons, correct 13/2 using Enter, invalid endpoint 7 using Check answer, wrong Maya reasoning and continuation to the unchanged factor introduction.
- At 320px, traversed all seven additions and inspected classification, root bounds, equation, text input and midpoint layouts. Ten geometry checks reported scrollWidth = viewport width with no escaping stage, choice, equation, tick, point or input. Screenshots confirm retained choices and readable explanations. Entered 6 1/2 successfully and reached the original factor introduction after Maya's correct answer.
- Temporary mobile test frame exists only in the isolated preview directory and is removed after QA; it is not a repository change. No console errors recorded during the desktop production checks.
- Text input intentionally accepts the documented decimal/fraction forms, not arbitrary mathematical expressions or prose. This is an interactive adaptation of the PDF, not a downloadable embedded copy or an exam mark scheme. Pupil testing and real-device testing remain outstanding.
- Final near-endpoint check: 6.999999 is accepted, its point is positioned at 99.9999% of the 6…7 interval, and the label is inset to stay inside the stage at 320px. Rebuilt successfully and inspected the final rendered screenshot after this adjustment.

## Minimal study view — 13 September 2026

- Cosmetic scope: D's lesson shell only. Removed the large Numbers/level/variant header, part count, journey strip and habit footer while studying. Topic and progress remain; lesson/variant switches are behind Lesson menu. No question/answer/grading edits.
- Production build and TypeScript checks passed. Fixed two style-specificity conflicts found in actual screenshots: the shared outer card/shadow and the mobile rule hiding the single-letter logo.
- Actual browser verified the Maya screen at desktop width, the layout at 760px, and menu/activity/feedback at 320px. Final 320px document scrollWidth equals viewport width; logo displays and the outer lesson container has no border/shadow/clipping. Final desktop Maya stage starts about 157px below the viewport top.
- Opening/closing the menu retains explorer value 2.5 and typed interval answer 6.2. Escape and Back to lesson close the disclosure and return focus to its toggle. Variant A can be selected through the menu and retains its expanded presentation; switching back to D restores the compact view.
- Wrong answers still show feedback and Continue. Menu controls fit a 320px viewport, use 44px minimum heights and readable labels. Browser QA uses the actual preview in temporary fixed-width frames; no real-device testing or measured cognitive-load study is claimed.
- Final local preview left on Maya's question. No deployment, commit or push. Temporary layout QA HTML removed from the isolated preview directory.

## Worked explanations (13 September 2026)

- Production build passes after the final styling change.
- Content coverage: every interactive question has complete correct/incorrect worked feedback (A: 28, B: 27, D: 39). Both outcomes share the working.
- Compared against HEAD: state IDs, counts, question content, visuals, answer keys, acceptance rules and transitions remain unchanged in all variants.
- Rendered D was traversed through all 39 questions, including factors/multiples, primes, squares/cubes, rational/irrational, mixed and transfer. Every question displayed Explanation. Continue remained enabled through the sequence; the final question offered Start lesson again.
- A and B wrong-answer smoke checks displayed the new steps and Continue. D covered both correct and incorrect attempts. Open-response 6.2 was accepted while the source final value 6·5 was labelled Example answer.
- Real 320px iframe viewport: the four-step tutor example and stacked fractions fit without horizontal overflow (document width and scroll width both 320px, article 288px). Screenshot verified spacing and accessible numbering. Desktop screenshot and computed list style verified decimal step numbering.
- PDF extracted and checked against all eight tutor explanations. Source worked wording/equations retained; marking annotations omitted. Source terminology caveats are documented in SPEC.md.
- Changes remain local; no deployment performed for this update.
