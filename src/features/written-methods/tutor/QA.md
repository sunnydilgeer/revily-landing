# Canonical arithmetic tutor QA

Local verification on 18 September 2026. Branch `teacher-review/lesson-1`, starting HEAD `34ac26c`. No commit, push or deployment. Existing Lesson 3 and unrelated science/config changes are preserved; `impressive prototype/` is untouched.

## BBC carried-over wording

- User explicitly requested the BBC screenshot’s carried-over wording verbatim and no tens/hundreds terminology in the example explanations. Shared column steps now use “Now add the [number] you carried over”, preceded by the multiplication result and followed by the addition result. Only example-specific numbers change. The same phrase is used when adding the two product rows.
- All multiplication actions and seven answer explanations were inspected programmatically: 98 actions, with the phrase in all 21 actions that add an incoming carry, and no tens/hundreds/thousands words in their titles/instructions or answer explanations. Column-question feedback is generated from the same worked instructions; the carry-number follow-up also uses the updated wording. Original source questions and layout stay intact.
- The zero-row explanation still explains the extra ×10 and retains its underlined multiplier digit, using “second row” and “rightmost column”. Carry accessible labels now say “Carried over”. Division explanations retain their own method.
- Arithmetic verifier, TypeScript and whitespace checks pass. Browser checks on port 3000 cover a multiplication carry, a carry during row addition, the full 347 × 4 answer feedback and its interactive carry step. New text wraps at 320px without overflow; viewport reset afterwards. Current workspace development preview reflects the edits.

## Zero-step multiplier underline

- Added multiplier-only focus to the shared tens-row zero step. Its tens digit is underlined and highlighted, linking the written factor directly to the zero in the units place; the top operand is not highlighted during this action. This applies to every two-digit teaching and post-answer column example.
- Existing arithmetic verifier now checks the zero-step focus and zero frame for every two-digit column example. Arithmetic verification, TypeScript and whitespace checks pass. Browser confirms underlined 5 in 56 and 2 in 28 on port 3000, including Next/Back restoring the multiplier-only focus.

## Tens-row zero explanation

- Expanded the shared two-digit multiplication step to explain that the tens digit represents ×20, ×40 or ×50; this includes an extra ×10, which moves product digits one column left and leaves 0 in units. The zero holds the units place before the product starts in tens. No actions, arithmetic, questions or sequence changed.
- Arithmetic verifier and isolated production build (`/private/tmp/revily-tens-zero-build`) pass. Browser checked the current zero step for ×40, ×20 and ×50 on port 3000, with the diagram showing 0 in units. Longer copy wraps cleanly at 320px with no horizontal overflow; viewport reset afterwards.
- An existing workspace Revily development server had resumed on port 3000. Kept that server using the updated workspace source and stopped the additional temporary production listener, leaving one consistent preview on `http://localhost:3000/preview`.

## Current-step synchronisation and opening review

- User authorised trying the revised flow for next-day review. Both matching videos now occupy screen 1 with Watch video selected by default. Interactive worked teaching follows at screen 2. Multiplication then keeps its column preparation before Q2; division then reaches Q2. Counts remain 15 and 13, with all 14 original practice parts and all four extra examples retained.
- Removed the upcoming-calculation preview. Diagram snapshots, underlined equation, highlighted operands/cell and current instruction now use the same completed action. Earlier calculations are listed separately below; the current action plus earlier history account for every revealed step.
- Corrected the two-example boundary: at step 6 the completed 34 × 26 grid remains current; step 7 writes the first digit of 246 × 43 and switches to its diagram. Back to step 6 restores the grid. Replay returns to setup without showing a future operation.
- Shared progress selection is checked at every action across all 27 available calculation groups (147 independently recomputed equations). Each current action is the corresponding completed source-model action, and complete underlined equations render in strict KaTeX. All question coverage/grading/media/route checks pass.
- Browser verified grid, column, bus-stop and long division at measured 1280px and 320px widths, across 15 complete walkthrough runs. Each action checks current-step index, earlier-history count and document width. Next, Back and Replay pass, with no horizontal overflow. Visually inspected the mobile current grid sum and bring-down instruction beside their diagrams.
- Checked an incorrect submitted multiplication answer: immediate full feedback remains, its optional walkthrough uses the synchronised renderer, and hide/reopen preserves the current step. Video/working switching pauses playback and retains completed steps. No console errors/warnings.
- Production build passes in `/private/tmp/revily-synchronised-steps-build` (24 application routes). TypeScript, existing maths verifiers and diff whitespace checks pass. Updated the local preview on port 3000, confirmed both new openings and a division action there, and stopped the temporary port-3103 QA server. No commit, push or external deployment.
- SCREEN-REVIEW.md contains the complete current screen list, titles, section/type and PDF/user-added source reference for the next review. Topic SOURCE-MAP.md tables have the first two screen references updated. Viewport override reset; temporary browser tab closed; the port-3000 preview remains ready on Lesson 4.

## Four additional examples and port 3000

- Added the four explicitly requested worked teaching screens without removing any source practice. Lesson 4 now has 15 screens; Lesson 5 has 13. Original question coverage remains seven parts per lesson.
- Independently checked 424 × 28 = 11,872 (3,392 + 8,480) and 291 × 56 = 16,296 (1,746 + 14,550), including every carry, the tens-row zero and column addition.
- The new two-digit division renderer builds standard long division with written subtraction. 235 ÷ 17 uses 23 − 17 = 6, brings down 5 to make 65, then 65 − 51 = 14: answer 13 remainder 14. 289 ÷ 29 uses all three digits; 29 × 9 = 261 and 29 × 10 = 290 is too big: answer 9 remainder 28. Both final inverse checks and remainder bounds pass.
- Current arithmetic verifier checks 26 calculation groups and 143 independently recomputed equations. It also checks the exact requested screens, step sequences, quotient placement and subtraction/bring-down row endpoints. TypeScript, all existing maths verifiers and diff whitespace checks pass.
- Production build passes in `/private/tmp/revily-four-worked-examples-build`, with all 24 application routes generated. Build remains isolated from workspace `.next`.
- All four new examples were fully exercised at 1280px desktop and 320px mobile: eight complete runs covering 11, 12, 9 and 5 actions respectively. Each action checks the cumulative ledger count, original expression and document width. Next, Back and Replay pass. No horizontal overflow. Visually inspected column carry placement and both long-division layouts; viewport reset afterwards.
- Per the user's follow-up, replaced the previous Revily development listener on port 3000 with the verified local production preview. Confirmed all four new screens in the browser at `http://localhost:3000/preview`, with no console errors/warnings. Stopped the temporary port-3103 preview. This is a local server move, with no commit, push or external deployment.

The remaining sections record source verification and the previous complete right/wrong runs over the original 24 lesson screens, before these four additions.

## Sources and maths

- Extracted both complete PDFs and visually inspected all six rendered pages. All 14 practice parts and both PDF worked examples are mapped in each topic's SOURCE-MAP.md.
- Fully decoded both original MP4s using temporary FFmpeg tooling. Inspected frames distributed across each full clip, including grid/column example change and final recaps.
- Multiplication video: 34 × 26 grid gives 884; separately, 246 × 43 column gives 10,578. Working includes both partial products, carries and addition column calculations. The source's same-factor counterexample 34 × 26 is separately demonstrated in columns.
- Division video: 375 ÷ 5 gives 75, including initial 3 hundreds, 37 tens and 25 units. Carry exchanges and quotient alignment are explicit.
- Independently recomputed all numerical practice answers, carries, quotients, final remainders, contextual box rounding and every underlined calculation result. All printed numeric answers are correct.
- Documented the single-digit bus-stop terminology, video setup shorthand, grid/column comparison and final two-column product digit clarification. These clarifications appear in teaching or working, not correction paragraphs on video screens.
- `npm run verify:arithmetic:tutor` passes: 13 Lesson 4 screens, 11 Lesson 5 screens, seven exact source practice parts each, 22 separately labelled calculation groups (seven teaching groups and 15 post-answer groups) and 106 independently recomputed complete calculation equations. Checks include safe input grammar, formatting, remainder bounds, wrong-answer rejection, identical full feedback on either path, contextual hints, sequential transitions, contiguous progress sections, canonical routes, posters and source-identical video SHA-256 hashes.

## Progressive working revision

- Directly inspected the BBC Bitesize publisher sample, printed page 4 / PDF page 12. RESEARCH.md records the source, design rationale and Corbettmaths access limits. Tutor examples and the supplied bus-stop algorithm are preserved.
- Every teaching calculation now uses meaningful written actions. 246 × 43 takes 11 actions instead of 25 fragmented reveals. Next underlines the pending calculation, highlights its operands/cell and updates the aligned written method.
- All 14 source practice parts have optional post-submission walkthroughs after either grading result. Full numbered feedback still appears immediately. Browser checks verify that the walkthrough is initially hidden, closing/reopening preserves its position, and it never gates Continue.
- Automated regression checks include repeated carries, internal zeros, cumulative partial sums, quotient alignment and remainder exchange. 347 × 4 writes 8, 88, 1388 with carries 2 then 1. 375 ÷ 5 uses four actions, aligning its 7 and 5 above tens and units.

## Browser interaction and layout

- Production preview tested in the Codex in-app browser at measured 1280px desktop and 320px mobile CSS widths.
- Completed both lessons on desktop with every question answered incorrectly. Completed both lessons on mobile with every question answered correctly. All 24 screens and 14 questions appear on each pair of runs; completion and restart work.
- Every submitted numeric value, both full-box/leftover fields and selected reason/example choices remain visible and disabled. Either result immediately reveals numbered complete Explanation and Answer, with Continue enabled and no retry gate.
- Opened/closed contextual hints on both correct and incorrect paths. Hints preserve drafts and never submit or grade. New questions start collapsed.
- Exercised Next, calculation Back and Replay on every cumulative worked screen on both paths. Next adds one complete equation, placement instruction and matching written action together; Back removes one action, and Replay resets. Every intermediate expansion was checked for document overflow. Source operands and all earlier lines remain; the video examples are separate labelled groups. Worked controls do not gate Continue.
- No document horizontal overflow in any checked screen, expanded working, hint or feedback at 320px. A bounding-box probe initially flagged clipped, invisible KaTeX MathML; visual inspection showed the visible grid sum fits, with no document overflow. Hidden MathML is excluded from visible-element checks.
- Visually inspected narrow multiplication controls and the full cumulative grid sum, plus desktop quotient/carry alignment and column digit placement. Controls sit beside the written diagram, above the growing history. Long worked examples use vertical scrolling.
- Enter submits a numeric response. Lesson Back works after feedback. Reached-section navigation works; future sections are initially locked. Restart preserves reached sections, matching the shared engine. Opening and closing the lesson menu preserves the current activity, answer and feedback.
- All six lesson menu routes open successfully without an approach selector; Lessons 1–3 and 6 retain their existing content. Keyboard arrow navigation switches video/working tabs.
- Both videos report their real metadata durations, have native controls, playsInline, speed choices, local posters and no autoplay. Replay starts playback, and selecting 2× changes the media playback rate. Switching to working pauses video; repeated tab switches preserve calculation lines. During initial implementation, both clips played to their actual ends at 2×, displayed Watched, and stayed on their matching lesson screens without advancing. The bundled player and files remain unchanged. The current revision rechecks tab pause and preservation with the new calculation component. No browser console warnings/errors during these checks.

## Build and regression checks

- TypeScript (`tsc --noEmit --incremental false`) passes.
- Existing Lesson 1, Lesson 2, Lesson 3 and written-method verifiers pass.
- `git diff --check` passes.
- Current production build passes in `/private/tmp/revily-arithmetic-working-build` (24 generated pages). Source copied without `.git`, `.next`, `node_modules`, `dist`, `impressive prototype/`, `.agents` or `.codex`; dependencies linked. An initial build was briefly started in the workspace and interrupted during startup before compilation completed; existing `.next` startup metadata may have changed. The final production build and browser preview use the isolated copy.
- Preview served only on `127.0.0.1:3103`; HTTP 200 for the preview and HTTP 206 for byte-range requests to both video files, supporting native seeking. Publishing is not authorised.

These checks verify implemented content and interactions, rather than classroom learning outcomes or a formal accessibility audit.
