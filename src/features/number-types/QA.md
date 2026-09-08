# Lesson 1 QA record

QA date: 8 September 2026

## Automated and browser checks completed

- Production Next.js build: passed.
- Main learner path baseline: all 38 core states were completed in the browser with every configured correct answer accepted before the latest content revision.
- Revised path coverage: the changed flow was exercised from the opening through the simplified prime-number explanation.
- GCSE alternative-answer check: both `3` and `11` are accepted as primes in `L1-T01`.
- Mobile check at 320 × 800: no horizontal document overflow; visible action target was 48px high.
- Reduced-motion handling: CSS transitions are disabled and state-change scrolling falls back to `auto`.
- Non-blocking incorrect-answer check: an incorrect opening selection exposed `Correct answer: 7, −3 and 6 ÷ 2.`, showed `Continue`, and advanced to `Whole or not?`.
- Removed-support check: an incorrect response to `Is 10 ÷ 2 an integer?` exposed the correct answer and continued directly to `Integer check`.
- Integer-coverage check: `π`, `√2` and `√9` are available in the checkpoint, with `√9` configured as an accepted integer.
- Factor-prompt check: the workspace shows `4 × ? = 20` before submission and `4 × 5 = 20` afterwards.
- Multiples-visual check: masked `6 × 1`, `6 × 2` and `6 × 3` facts appear without their products before submission.
- Prime-visual check: the 7 and 4 explanations use factor arithmetic rather than counter rows, and the old `1 × 1` treatment is absent.

## Defects found and fixed

1. The lesson was below a large marketing hero and unrelated prototype content.
2. Several visuals exposed correct answers before the learner responded.
3. Hidden answers were still present in screen-reader captions.
4. `L1-T01` rejected the valid prime answer `3`.
5. Optional repair was included in the main step count, causing an apparent skipped step.
6. Internal state IDs such as `L1-H01` were visible to learners.
7. Wide number lines rendered too many overlapping ticks, and markers were vertically detached from the rail.
8. The cube-prediction visual displayed `27` before input.
9. A hard-coded Lesson 1 exception existed inside the reusable power component.
10. Continue states and declarative `stateUpdate` values were not recorded by the engine.
11. The factors-of-1 visual did not distinguish one factor pair from one distinct factor.
12. State transitions retained the learner's old scroll position and did not move focus to the new prompt.
13. The conditional division support screen was unrelated to the integer-classification flow and exposed its answer in the visual.
14. Prime-number teaching relied on row-based counter arrangements instead of direct factor evidence.
15. The multiples checkpoint used repeated addition rather than a recognisable, answer-safe times-table structure.

## Remaining product gaps

These are not correctness blockers, but the lesson is not yet a literal implementation of every storyboard animation:

- `ArrayBuilder` and `PowerStructure` currently reveal semantic visual states; they do not yet provide the full drag/rearrange/step-through manipulation described in the storyboard.
- Semantic visual actions such as `addCubeLayer` are represented by answer-triggered reveals rather than multi-stage choreographed animation.
- Progress and misconception metadata are held in the lesson engine for the session but are not persisted to the existing attempts API.
- The browser regression is currently an executed QA procedure, not a checked-in automated end-to-end test suite.

## Product feedback incorporated

- Incorrect answers do not block progression.
- Incorrect feedback always exposes the accepted answer.
- The learner-facing action after incorrect feedback is `Continue`; the conditional repair screen has been removed.
- The opening screen has no extra eyebrow or headline, and uses the direct instruction `Select all the whole numbers.`
- The integer checkpoint now includes π, √2 and √9.
- The division support screen has been removed.
- Factor-pair completion displays `4 × ? = 20` directly.
- The multiples checkpoint uses masked 6-times-table facts before revealing products.
- Prime teaching uses factor lists, and the explanation of why 1 is not prime has been simplified.
