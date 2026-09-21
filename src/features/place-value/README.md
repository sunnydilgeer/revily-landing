# Lesson 3: Place value

Lesson 3 uses the shared declarative lesson engine to teach digit/place/value, decimal places, placeholder zeroes, and decimal comparison and ordering.

## Data flow

`placeValueLesson.ts` → shared `useLessonEngine.ts` → `PlaceValueLessonView.tsx` → shared `StateVisual.tsx` → semantic place-value components.

## Lesson-specific visuals

- `PlaceValueChart` derives fixed columns from a number, supports exploratory digit selection, and withholds resolved values on question screens.
- `DecimalComparison` aligns two decimals and reveals the first unequal place only after submission.
- `DecimalOrdering` lets learners reorder the decimal cards directly using drag or explicit left/right buttons.
- `PlaceValueHint` provides accessible, answer-safe method prompts.

Incorrect answers reveal the accepted answer and always unlock **Continue**. Multiplication and division by powers of ten are intentionally reserved for a later lesson.

## Variant B · Step by step

The preview defaults to Variant B for Lesson 3. Use **Lesson menu → A Current** to compare the original lesson.

Variant B has 26 screens and 17 questions, following the shared [lesson design pattern](../LESSON_DESIGN.md). It separates place from value, introduces whole-number columns before decimal columns, then teaches placeholder zeroes, equivalent decimals, comparison and ordering. Every question has a collapsed inline Hint. Worked examples are optional and replayable; submitted answers remain visible alongside structured explanations.

Implementation and content live in `variant-b/`. See its [storyboard](variant-b/SPEC.md) and [QA record](variant-b/QA.md).

## Active canonical lesson (17 September 2026)

The application now opens `tutor/PlaceValueLessonView.tsx` directly, using `tutor/placeValueLesson.ts`. Lesson 3 has no variant selector. Earlier content and Variant B are retained only as implementation references. See `tutor/SOURCE-MAP.md`, `tutor/SPEC.md` and `tutor/QA.md` for the supplied PDF/video coverage, corrections and current validation.
