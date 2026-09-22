# Canonical tutor arithmetic lessons

`src/App.tsx` opens only Lesson 4 long multiplication and Lesson 5 long division. The replaced short-division lesson and multiplication A/B implementations have been removed. No variant selector remains. Lessons 1–3 and 6 retain their routes.

Lesson 4 has 15 sequential screens; Lesson 5 has 13. Each includes all seven supplied practice parts, the original worked example and two additional worked examples explicitly requested by the user. See each topic's SOURCE-MAP.md for exact source coverage and clarifications. The source document identifiers do not determine route numbering.

## Learner interactions

Use the approved shared `useLessonEngine` and safe `lessonMath` grading. One activity, topic heading, contiguous reached/locked progress sections, lesson Back and Continue. Every submitted response remains visible and disabled; correct and incorrect paths both immediately show identical complete numbered working and Answer. Either path unlocks Continue, without retry. Optional contextual hints never submit or grade. Each new activity resets hints. Reached-section navigation and restart follow Lessons 1–3.

`MethodWorkedExample` builds aligned column/bus-stop working or fills a grid. One Next click performs one meaningful written action and adds a complete equation plus a short placement instruction: write a digit and carry, fill a cell, or divide and move the remainder. It no longer splits an operation and its result across separate clicks. The current operation is underlined and its operands/cell are highlighted. Its complete equation and instruction sit beside the current diagram; earlier completed calculations remain visible below under Earlier working. No upcoming operation is shown. Original operands/expression always remain visible. Calculation Back removes the latest action; Replay resets. The multiplication clip's grid and column calculations are separately labelled groups, without an equality joining them. Worked-example completion never gates lesson navigation.

All seven practice parts in each lesson provide the same progressive working after either grading result, via “See this calculation step by step”. The complete numbered Explanation and Answer still appear immediately. The optional walkthrough stays mounted when closed so its position is retained. At a two-example boundary, the completed first example remains current until the next click performs the first action in the second. Columns show partial products and carries in their place-value columns; bus-stop working aligns quotient digits and places the carried remainder beside the next dividend digit. Non-exact divisions use a quotient-and-remainder arrow, never a false numerical equality. Research rationale is recorded in RESEARCH.md.

Lesson 6 deliberately uses a leaner feedback pattern: submitted answers show correctness and, for calculation questions, only the expandable progressive working. It does not render the separate numbered explanation block. Conceptual claim questions omit the calculation walkthrough. Each decimal video contains its walkthrough in the Step by step tab and proceeds directly to the next source question, without a duplicate worked-example screen. Dependent worksheet references such as “part a” are rewritten as self-contained learner copy.

Lesson 7 follows the same lean feedback and video pattern. Calculation and diagram questions retain expandable working; conceptual reasoning questions do not show an unrelated walkthrough. Its dependent prompts are also restated so they can be understood without relying on the previous screen.

Videos and posters are local bundles. Reuse the approved native `LessonVideo`: controls, playsInline, metadata preload, speed choice, no autoplay. Video/working panels stay mounted, so switching pauses video and retains calculations; unmounting pauses playback. Viewing/ending never advances the lesson. Video screens contain only matching topic/question, tabs, player/tools, working and lesson actions; necessary mathematical clarification is in teaching/answer working.

## Validation

`npm run verify:arithmetic:tutor`: exact source coverage, independently recomputed answers and calculation results, wrong answers, numeric/remainder grammar, identical complete feedback, contextual hints, sequential transitions, contiguous progress topics, source-identical bundled videos, posters, KaTeX expressions/underlines, separate examples and canonical routes. Run existing maths verifiers and TypeScript. Browser QA must cover complete right/wrong paths, retained responses, hints, lesson navigation, calculation controls, video playback and tab pause/preservation, completion, all routes, desktop and narrow-mobile overflow. Production build runs in a temporary source copy. Publishing requires user approval.

## Two-digit divisor extension

The user-added 235 ÷ 17 and 289 ÷ 29 examples use a distinct `long-division` renderer and `longDivisionWorking` model. It reveals choose-group, divide, multiply, subtract, bring-down and inverse-check actions, with subtraction lines aligned under the relevant digits. Bring down joins the difference to the next dividend digit in the diagram; the previous complete subtraction remains in the calculation history. Quotient digits are placed above their correct columns. Final answers use quotient/remainder form, with a remainder smaller than the divisor. Existing one-digit source examples retain their compact bus-stop renderer. No source question is cut.

## Opening sequence under review

Both lessons now start with their supplied video (default Watch video, optional Step by step tab), followed by interactive worked teaching and then original practice. The source terminology and preparation remain in the following worked screen. Existing screen counts remain 15 and 13. SCREEN-REVIEW.md records all screens, source references and user-added examples for the next review. Nothing is cut at this stage.
