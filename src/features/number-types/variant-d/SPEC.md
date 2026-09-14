# Lesson 1 Variant D — revised storyboard

## Scope and source authority

This revision responds to the user's rejection of the initial presentation. Research and limitations are in RESEARCH.md. Anushka's five-page PDF and silent video remain source material; the user's teaching/UX instructions govern the implementation.

Change only `whole-values`; preserve A/B and all baseline states from `L1-F01` onward by reference. No deployment. Whole numbers retain the definition 0, 1, 2, …; negative integers are not called members of that subset. Classify values, not notation: 2.0 = 2 and 4/2 = 2. Roots use exact square identities/bounds, with proportional plotting.

## Interaction and presentation

A compact teaching stage uses a shared number-line visual language. Demo controls move or resolve mathematical objects. Questions appear once, directly above choices. Single-choice taps submit immediately; multi-select uses Check answer. Choices stay visible after submission, accepted answers are marked and the learner's incorrect selection is distinguished. A short explanation gives the answer immediately, followed by an enabled Continue. No repeat guessing, repair route or forced wait.

Worked examples show one step at a time with optional advance/replay controls; Continue is always available. Reduced-motion preferences remove transitions. Final independent practice withdraws the diagram instead of repeating the same values above and inside options. Existing header/journey remain; only the D opening activity has compact styling.

## Screens

| ID | Visual and action | Learner task | Answer / explanation |
| --- | --- | --- | --- |
| D-I-01 | Movable point on −3…3. Slider steps by 0.5; presets 2, 2.5, 0, −2. Position and integer status update together. | Explore, then Continue. | Integers sit on integer ticks; values between ticks are non-integers. Negatives and zero count. |
| D-I-02 | −3 on a line from −4 to 0. | Is −3 an integer? One tap. | Integer. It is a negative integer with no fractional part. |
| D-I-03 | 1.5 between ticks 1 and 2, on 0…3. | Is 1.5 an integer? One tap. | Non-integer. It lies between 1 and 2. |
| D-I-04 | Worked 12/4. Reveal division 12 ÷ 4 = 3, then plot 3 and conclude; replay available. | Study the worked example, then Continue. | 12/4 represents 3, an integer. Fraction notation does not exclude integer values. |
| D-I-05 | 20/5 expression. Value revealed after a tap. | What is the value of 20/5? Choices 4, 5, 15. | 4. 20 ÷ 5 = 4. |
| D-I-06 | 20/5 = 4 on the integer tick 4, line 2…6. | Is 20/5 an integer? One tap. | Integer, because its value is 4. Resolving and classifying are separate decisions. |
| D-I-07 | Switch between 2, 2.0 and 4/2 while the point remains at 2. | Why are all three integers? One tap on a reason. | Each has the value 2. Neither a decimal point nor a fraction bar decides the category. |
| D-I-08 | Worked roots: switch √49 / √11. Reveal 7² = 49 or 3² < 11 < 4²; then plot and classify. | Study either/both replayable examples, then Continue. | √49 = 7 is an integer; 3 < √11 < 4 makes √11 a non-integer. |
| D-I-09 | √81 expression. On submission reveal 9² = 81 and its integer position. | Is √81 an integer? One tap. | Integer. √81 = 9. |
| D-I-10 | √20 expression. On submission reveal 16 < 20 < 25 and plot between 4 and 5. | Is √20 an integer? One tap. | Non-integer. 4 < √20 < 5; no integer lies strictly between adjacent integer ticks. |
| D-I-11 | Diagram withdrawn. Six values appear once as choices: −7, 1.5, 0, 12/4, √11, 26. | Select all the integers, then Check answer. | −7, 0, 12/4 and 26. Fraction resolves to 3; √11 and 1.5 lie between integers. Both result paths lead into the PDF practice extension at D-P-01. |

## Source adaptations

The video supplies the negative/zero/fractional contrast; cookie plates and video embedding are removed. Its inaccurate broad fraction claims and negative-whole terminology are corrected. The PDF supplies expression values, square-root contrasts and the final six-number set. Its inverse-square-root and midpoint tasks are deferred from this opening because they introduce additional problem-solving objectives. Difficulty labels and mark allocations are omitted. This is an intentional micro-skill adaptation, not a transcription of every worksheet item.

## Files and architecture

- `variant-d/variantDLesson.ts`: typed 18-screen opening (11 teaching/practice screens plus seven PDF tasks) and baseline rejoin; metadata/other journey labels inherit baseline.
- `variant-d/IntegerValueVisual.tsx`: interactive explorer, number-line primitive, equivalent-form switches and replayable worked examples; local UI state resets per lesson state.
- `variant-d/VariantDActivity.tsx`: D-only question/answer/feedback presentation, using the existing lesson engine; preserves choices after grading.
- `variant-d/VariantD.css`: scoped compact stage, controls, answer/result styles and mobile/reduced-motion behavior.
- `types.ts`: D visual definitions; no alteration of existing interaction definitions.
- `NumberTypesLessonView.tsx`: dispatch D opening activities; render shared states with the existing player layout.
- `useLessonEngine.ts`: additive single-choice submission helper to grade an explicit selected ID without stale React state. Existing submit/continue/grading paths remain shared.
- `App.tsx`: existing A/B/D selection is retained. `StateVisual.tsx`: existing additive D visual dispatch is retained.
- `RESEARCH.md`, `SPEC.md`, `QA.md`: evidence, storyboard and latest validation.

## Verification

Check the real demo controls, step/replay controls, touch/keyboard behavior, correct/incorrect one-tap submission, exact multi-select grading, retained choices, Continue, Back, A/B/D switching and the baseline rejoin. Inspect desktop and 390/320px layouts, marker positions, equivalent-form containment and reduced motion. Run type/build checks and assertions that shared states remain identical. Distinguish design QA from learning-outcome evidence: pupil testing is still needed to assess effectiveness.

## Approved-flow extension: incorporate the full Anushka PDF

The user approved the revised presentation and then requested incorporation of the PDF. Preserve D-I-01…11 and append the remaining worksheet tasks. D-I-11 now leads to D-P-01. The PDF's worked-example list already appears in D-I-11; the fraction and root reasoning are modelled earlier. This extends the opening to 18 screens without repeating that list.

| ID / PDF task | Presentation and interaction | Correct answer / immediate explanation |
| --- | --- | --- |
| D-P-01 / Q2 | Four values as choices once; one-tap integer selection. | −15. 4.2 and 3/8 = 0.375 have fractional parts; 2 < √7 < 3. |
| D-P-02 / Q3 | Six choices; select all non-integers. | 6.5 and 11/4 = 2.75. −2, 0, 20/5 = 4 and √49 = 7 are integers. |
| D-P-03 / Q4a | Five choices; select all integers. | 18/6 = 3, −9 and √81 = 9. √20 and 2.75 lie between integers. |
| D-P-04 / Q4b | √20 above three full-width reason choices. After answering, plot √20 between ticks 4 and 5. | 4 < √20 < 5 because 16 < 20 < 25. A root sign alone does not decide the category. |
| D-P-05 / Q5a | √n = 6 above three answer-and-reason choices. Reveal the square operation after answering. | n = 36, an integer, because 6 × 6 = 36. |
| D-P-06 / Q5b | Blank interval line 6…7, then one question and a text field. Accept decimals, simple fractions and mixed fractions whose value is strictly inside the interval. Retain the submitted answer. Plot the learner's valid value after grading; otherwise plot example 6.5. | Any value strictly between 6 and 7, e.g. 6.2, 6.5, 13/2. Endpoints, out-of-range values and malformed input fail with immediate example and Continue. |
| D-P-07 / Q5c | Maya's exact claim in a compact quote; one question above reason choices. After grading show the midpoint 5 on the 2…8 number line. | No: halfway between 2 and 8 is 5, an integer. One counterexample disproves “always”. Both outcomes rejoin L1-F01. |

The extra reasoning tasks are now included at the user's request; this supersedes their previous deferral. Difficulty labels, worksheet marks and claims that negatives are whole numbers are not copied. All options remain visible during feedback and wrong answers never block.

Implementation adds D-only visuals for the equation, interval and midpoint, uses the existing number-line primitive, and adds a narrowly scoped `openInterval` grading rule with explicit bounds. Existing grading behavior is unchanged. PDF source: `/Users/sunnyd/Downloads/N1.1_Integers_vs_Non-Integers.pdf`.

## Cosmetic study view — 13 September 2026

User requested a minimal studying screen after approving the content. `App.tsx` activates the compact shell for Lesson 1 Variant D. One Lesson menu disclosure contains existing lesson/variant navigation, supports Escape and returns focus to its toggle. Opening/closing the menu preserves the mounted lesson and its response state. `NumberTypesLessonView.tsx` accepts `focusMode` and shows only the active topic title and accessible progress bar above the activity, omitting the expanded header, journey and footer. Scoped App/VariantD styles reduce the overall width and remove the outer card decoration; the activity remains in its own readable white panel. A/B retain their previous presentation; all teaching, questions, answers and progression remain unchanged.


## Worked explanations update

Every question in Lesson 1 A, B and D now reveals “Explanation”, numbered worked steps and a final answer. Correct and incorrect attempts show the same complete working and allow Continue. The shared content map lives in `../lessonExplanations.ts`; `ExplanationSteps` renders it without changing other lessons.

Anushka’s Q1–Q5 worked wording and equations are transcribed verbatim from the supplied PDF; exam marking annotations are omitted. Q5(b) labels 6·5 as an example because other values strictly between 6 and 7 are accepted. Other questions use newly written steps in the same instructional style.

Source caveats retained at the user’s explicit request: the PDF calls negative integers “whole”; our formal whole-number set elsewhere starts at zero. Its root decimals are truncated displays, and “does not come out exactly” is informal wording rather than a definition of non-integer. The baseline A opening also predates the formal distinction and calls negative integers whole numbers. Question content is unchanged by this feedback-only update. New explanations outside the PDF use the precise term integer. Middle dots within source decimals retain the PDF typography; separator dots are also retained.
