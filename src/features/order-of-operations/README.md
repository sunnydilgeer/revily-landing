# Lesson 2: Order of operations

Lesson 2 extends the existing declarative lesson engine without changing Lesson 1 content.

## Data flow

`orderOfOperationsLesson.ts` -> shared `useLessonEngine.ts` -> `OrderOfOperationsLessonView.tsx` -> shared `StateVisual.tsx` -> semantic mathematical component

## Lesson-specific visuals

- `OperationPriority` renders a semantic three-column BIDMAS table and presents DM and AS as equal-priority pairs.
- `ExpressionSteps` withholds worked steps on question states and reveals a legal transformation sequence after submission.
- `NextOperation` makes the operations within an expression the controls: the learner selects the calculation that is legal next, receives immediate explanatory feedback, and advances through transformed lines.
- `GroupedFraction` treats numerator and denominator as separate calculation zones, then reveals Top -> Bottom -> Simplify working.

## Feedback extension

Choice options can carry optional `errorMethod`, `misconceptionId`, `rationale` and learner-facing `feedback` fields. The engine uses selected-option feedback for incorrect single-select responses and records the specific misconception. Existing states without this metadata retain their general fallback feedback.

Lesson 2 contains no multiple-choice questions. Guided BIDMAS reasoning uses direct operation selection, while independent final-value checks use numeric entry. An incorrect operation immediately reveals and explains the accepted operation without forcing repeated guesses.

## Scope

The lesson teaches numerical order of operations only. Algebraic multiplication, index laws for algebra and collecting like terms are excluded because they depend on separate prerequisites. Numerical fraction simplification is assumed prior knowledge and is applied, not taught as a separate micro-skill.
