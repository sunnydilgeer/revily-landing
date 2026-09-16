# Lesson 1 — implementation QA

## 15 September 2026 — canonical lesson and clickable progress

- Removed the former Lesson 1 A/B selector, definitions, B-only visuals and unused legacy explanations. Anushka's 62-state sequence is now the only Lesson 1 and no variant name appears in the lesson or menu.
- Replaced the single passive bar with five clickable section bars. Only reached sections are enabled; later sections remain locked. Selecting a reached section opens its first screen without advancing the learner's furthest-reached boundary or clearing recorded attempts.
- Verified the initial state exposes only Integers & non-integers. After completing that section, Special Integers unlocks while Rational Numbers, Irrational Numbers and Multiples & Factors remain disabled.
- Verified backward navigation from Special Integers to the first Integers & non-integers screen and forward navigation back to the first Special Integers screen.
- Desktop QA at 1280px found five equal 146px progress targets and no horizontal overflow (`scrollWidth = 1280`). At 320px all five targets remain 44px high, fit at 54px each and produce no horizontal overflow (`scrollWidth = 320`).
- The Lesson 1 verifier, TypeScript validation and production build pass. The build reports only the pre-existing multiple-lockfile warning. No deployment was performed.

### Restart behaviour

- Start lesson again now resets the learner to the first screen and clears responses, attempts and interactive activity state without clearing the furthest-reached section boundary.
- After a completed lesson restarts, all five progress sections therefore remain clickable. This is in-memory behaviour only; refreshing the page still creates a fresh lesson until user/session persistence is implemented.

## Line-by-line explanation pass — 15 September 2026

- Implemented the lesson-owner-approved rewrites for D-I-07, D-P-01–03, D-R-07, D-IR-01, D-IR-03–04, D-IR-06–07, D-IR-09, D-MF-01, D-MF-05 and D-MF-07–08.
- Each independent calculation and reasoning point now renders on its own line. The revised explanation and teaching content no longer uses centred dots to join calculations.
- Updated the D-R-07 algebra, neighbouring-square comparisons, √45 simplification, irrational classifications, multiple-of-6 working, factor pairs, HCF factor lists and LCM multiple lists to use explicit staged working.
- The Lesson 1 verifier passed with 62 unique, reachable states and 40 source exercises. It now rejects centred-dot separators in worked-explanation lines, rejects reintroducing the teaching-visual join pattern, and locks the expected line counts for the revised explanations.
- The production build compiled, type-checked, generated all 21 routes and completed tracing. Next.js reported only the existing multiple-lockfile workspace-root warning.
- Rendered QA inspected incorrect D-P-01 feedback at 1280px, the fully expanded D-MF-01 teaching interaction and incorrect D-MF-07 feedback at an actual 320px viewport. Document and body scroll widths matched the viewport at both sizes; browser console errors: none.
- No deployment, commit or push was performed.

## Recurring-decimal and irrational-interval copy — 15 September 2026

- Removed the top-right recurring-dot glyph from the D-R-04, D-R-05 and D-R-07 green cards, prompts and answer choices. The questions still say “recurring decimal”, and the worked examples show the repeating digits explicitly.
- D-R-04 now displays `π,  √10,  0·6,  √12`; preserved whitespace and commas create clear separation while still allowing wrapping on narrow screens.
- The first √20 placement step now states `√20 = 4.472… It is between 4 and 5.` The next interaction step retains the longer decimal and the non-terminating, non-recurring explanation.
- D-IR-08 and D-IR-12 now calculate every MCQ option on a separate worked-explanation line. Irrational roots use nine decimal places plus an ellipsis; terminating decimals and exact roots are identified separately.
- The Lesson 1 verifier passed with 62 unique, reachable states and 40 source exercises. It now checks the plain recurring-decimal displays, comma spacing, absence of recurring-overdot glyphs and the expected per-option explanation line counts.
- The production build compiled, type-checked, generated all 21 routes and completed tracing. Next.js reported only the existing multiple-lockfile workspace-root warning.
- Rendered QA checked D-R-04, D-R-05, D-R-07, the placed √20 interaction, and submitted D-IR-08/D-IR-12 explanations. Browser console errors: none.
- Desktop document width matched the 1280px viewport. At an actual 320px viewport, D-R-04 and the expanded D-IR-12 feedback both kept document and body scroll widths at 320px; the comma list, answer grid and one-line-per-option explanation remained legible.
- No deployment, commit or push was performed.

## Child-friendly Special Integers copy — 15 September 2026

- Replaced chained inequality teaching for √11 and √20 with decimal values, plain “squared is” statements and a sentence saying which whole numbers the root sits between. The teaching visuals no longer use a less-than operator for this reasoning.
- Simplified the square and cube headings/definitions. The initial cube-layer label is now “One 2 × 2 layer”.
- Removed state `D-SI-03` and its 6/7-counter visual. `D-SI-02` now proceeds directly to restored prime grid `D-SI-03A`; existing exercise IDs remain unchanged.
- D-SI-05 now keeps only `21, 22, 23, 24, 25, 26, 27, 28, 29` in its green card before and after submission. Its seven composite checks render as seven separate explanation paragraphs.
- D-SI-08 now renders `1 × 1 × 1 = 1`, `2 × 2 × 2 = 8` and `3 × 3 × 3 = 27` on separate lines.
- Lesson 1 verification passed with 62 unique, reachable states and 40 source exercises. TypeScript validation and the production build passed; Next.js reported only the pre-existing multiple-lockfile warning.
- Desktop production QA inspected the completed √11 example, correct √20 feedback, square and cube teaching, direct cube-to-prime-grid transition, D-SI-05 before/after an incorrect answer and correct D-SI-08 feedback.
- At 320 × 900, the expanded cube explanation stayed on three distinct lines. Document width and scroll width were both 320px, and no lesson-state descendant escaped the viewport.
- No deployment, commit or push was performed.

## Recovered prime explorer — 15 September 2026

- Located the original “Explore prime numbers to 50” screen in commit `7beec6f`. The current repository still contained its reusable `PrimeHundredGrid` component and styles; the rebuilt lesson had only stopped routing through it.
- Restored it as stable state `D-SI-03A`, between the prime/composite array demonstration and the Special Integers PDF exercises. Existing state IDs and Aniksha-derived question/explanation wording were not changed.
- Retained the historical title, body, prompt, 1–50 range, highlighted prime set and factor-list behaviour. Pointer hover and keyboard focus expose the complete positive factor list and prime/composite classification for every cell.
- Lesson 1 verification passed with 63 unique, reachable states and all 40 source exercises. The verifier now locks the recovered screen copy, component type, range and highlighted primes.
- Production build passed with only the pre-existing multiple-lockfile warning.
- Rendered the restored screen at desktop size and focused cells 49 and 50. Prime highlighting, focus treatment and the factor tooltip were visible and correct; Back and Continue remained available.
- At 320 × 900, document width and scroll width both remained 320px, with no escaping lesson-state descendant. Added D-focused mobile spacing beneath the grid so multi-line factor tooltips do not collide with the explanatory note.
- No deployment, commit or push was performed.

## PDF wording fidelity and prime-card polish — 15 September 2026

This section supersedes earlier notes describing the PDF prose as adapted.

- Compared all 40 worksheet exercises from N1.1–N1.5 with their Lesson 1 screens. Question text, explanation headings, calculation lines and answer lines now use the source wording verbatim; marks and teacher-only annotations remain omitted. The three owner-approved corrections remain in place and are documented in `SPEC.md`.
- Added commas and spaces to the D-SI-05 teaching card: `21, 22, 23, 24, 25, 26, 27, 28, 29`.
- Extended the Lesson 1 verifier to cover all 40 PDF-derived exercise IDs and exact question strings, plus the comma-spaced prime-number row. All 62 states remain reachable; correct/incorrect routes, answer keys and worked explanations passed.
- `npm run build` passed. Next.js reported only the pre-existing multiple-lockfile workspace-root warning.
- Rendered D-SI-05 before and after an incorrect submission at desktop size. The submitted 23, 28 and 29 remained visible, correct and incorrect markings were clear, the source-matched explanation appeared, and Continue was enabled.
- Rechecked the same feedback state at an actual 320 × 900 viewport. `innerWidth`, document width and scroll width were all 320px; no D-activity descendant escaped the viewport. The comma-separated number row wrapped cleanly to two lines and the full explanation/Continue layout remained readable.
- No deployment, commit or push was performed.

## Full Anushka rebuild — 15 September 2026

This section supersedes the earlier statements below that the lesson rejoins shared legacy content after the integer section.

### Source and flow coverage

- Preserved the existing 18-state `D-I-01`…`D-P-07` integer/non-integer sequence; only the final transition now points to `D-SI-01`.
- Added 44 source-led states: 11 Special Integers, 8 Rational Numbers, 13 Irrational Numbers and 12 Multiples & Factors. Lesson 1 now has 62 states and no post-integer `L1-*` states.
- Mapped all 32 exercises from the four supplied PDFs. Rational Q4b and Q5c appear after irrational-number teaching.
- Implemented the three documented corrections: prime factors of 12, both valid HCF-6 pairs, and the non-zero qualification for rational × irrational.
- Added interactive adaptations of the video teaching: square arrays, cube layers, prime/composite arrays, fraction shading/division, recurring forms, root interval/digit reveal, exact/non-exact roots, `√45` simplification, multiple hops, factor rectangles and HCF/LCM set comparisons.

### Automated verification

- `node scripts/verify-number-types-variant-d.cjs`: passed. It checks 62 unique D IDs, all 32 source exercise IDs, full correct-route reachability, valid transition targets, correct answers, worked explanations for both outcomes, incomplete multi-select rejection and all one-of alternatives. It explicitly verifies both accepted answers for the corrected HCF-pair task and rejects `12 and 24`.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run build`: passed compilation, lint/type validation, page generation for all 21 routes and build tracing. Next.js still reports the pre-existing multiple-lockfile workspace-root warning.

### Production browser QA

- Started the production build locally and traversed all 62 Lesson 1 screens at a 1280px viewport. All 47 questions displayed their worked explanation. The traversal included 28 correct and 19 incorrect submissions; every response stayed visible and every feedback state had an enabled Continue (or Start lesson again on the final state).
- Exercised the optional new teaching controls: alternate square/prime arrays, the added cube layer, full fraction-to-decimal reveal, rational-form tabs, full `√20` digit reveal, exact/non-exact root switch, complete `√45` simplification, multiple hops and all factor-pair rectangles.
- Geometry checks on every desktop screen before and after feedback found no document or D-activity overflow. Browser console errors: none.
- At an actual 320 × 900 viewport, checked all 44 new screens before and after feedback. `documentElement.scrollWidth` stayed 320 and no D-activity descendant escaped the viewport. Screenshots were inspected for the completed 5/8 fraction strip, `√20` number-line placement, the 1 × 24 factor rectangle and final LCM feedback.
- A and B smoke checks at 320px retained their original first activities and six-part journey labels, with no horizontal overflow.

### Remaining caveats

- No deployment, push or commit was performed.
- Pupil testing and physical-device testing remain outstanding; browser viewport QA is not evidence of learning impact or a substitute for a real-device accessibility pass.

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
- Opening/closing the menu retains explorer value 2.5 and typed interval answer 6.2. Escape and Back to lesson close the disclosure and return focus to its toggle. This historical variant-switching check is superseded by the canonical-lesson QA above.
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
# Optional section videos — 16 September 2026

- Five original MP4s copied unchanged, with extracted JPEG posters. All are silent 1024×576 animations with embedded text; durations 57.6, 53.2, 38.2, 38.2 and 39.2 seconds. MP4 metadata precedes media data for progressive playback.
- Production build and TypeScript pass. Route verification passes: 67 screens, 40 source exercises, all routes reachable. Five section-entry redirects and asset existence are explicitly checked.
- Actual rendered lesson traversed through the first four sections to the fifth video. All five players loaded the matching source and duration with no media error. Unwatched rational/irrational clips allowed immediate Continue; activities followed each clip at the intended section entry.
- Native playback advances; 2× speed applies; end-of-video Replay restarts playback. Seeking and pause verified on the factors clip. Opening/closing Lesson menu preserves the mounted player and current playback. Wrong-answer explanations and Continue remain available during traversal.
- Actual 320px iframe: player, speed control, clarification and expanded summary fit; document scrollWidth and viewport width both 320px. Continue is visible with the summary collapsed. Desktop screenshots confirm 16:9 sizing and minimal shell.
- An initial native-control accessibility click crashed the embedded browser. A fresh tab and screenshot-grounded coordinate clicks completed playback/seek/pause QA successfully. No external-browser or real-device playback claim is made.
- Source mathematical wording issues are visibly clarified and documented in SPEC.md; original clips are not edited. No deployment, commit or push for this update.
