# Lesson 4: Short division

Lesson 4 uses the shared declarative lesson engine to teach the formal short-division bus-stop method with one-digit divisors, including exact answers, final whole-number remainders, internal quotient zeroes and inverse checking.

## Data flow

`shortDivisionLesson.ts` → shared `useLessonEngine.ts` → `ShortDivisionLessonView.tsx` → shared `StateVisual.tsx` → semantic short-division components.

## Lesson-specific interactions

- `ShortDivisionVisual` supports question, paused, static and staged worked-example modes. Its learner-controlled player has Play/Pause, Previous/Next and a directly selectable progress timeline. Every mathematical state is reversible, and staged answers are absent from rendered content until their reveal step.
- `QuotientRemainderInput` uses separate labelled integer fields to avoid treating a remainder as a decimal digit.
- `DivisionCheck` models `(quotient × divisor) + remainder = dividend` and the remainder bound.
- `ShortDivisionHint` provides accessible, answer-safe method prompts.

Incorrect answers reveal the accepted answer and unlock **Continue** after one submission. Formal long division with multi-digit divisors, decimal or fractional answers and contextual remainder interpretation are intentionally reserved for later lessons.

## Variant B

`variant-b/` adds a 25-screen, 16-question sequence with equal-group and exchange explorations, progressive bus-stop examples, collapsed hints and structured feedback. B is the initial preview selection; A remains available in the lesson menu. See `variant-b/SPEC.md` and `variant-b/QA.md`. The renderer is shared with Lesson 5 B in `../written-methods/`.
