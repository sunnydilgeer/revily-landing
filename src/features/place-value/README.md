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
