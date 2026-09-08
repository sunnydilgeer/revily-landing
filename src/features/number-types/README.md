# Lesson 1: Numbers — implementation architecture

This feature turns the Lesson 1 storyboard into a declarative state tree rendered by reusable mathematical components. The central product test is whether lesson content can request mathematical behaviour without embedding animation or screen-specific React code in the data.

The tree currently contains 38 learner steps. Incorrect answers reveal the accepted answer and continue without inserting a separate repair screen.

## Data flow

`numberTypesLesson.ts` → `useLessonEngine.ts` → `NumberTypesLessonView.tsx` → `components/StateVisual.tsx` → mathematical component

- The lesson definition owns wording, answers, feedback, misconception IDs, progress updates and transitions.
- The engine owns attempts, answer checking, feedback routing, state history and derived mastery.
- The view owns layout and accessibility announcements.
- `StateVisual` is the single registry between semantic component names and React implementations.
- Mathematical components own their visual behaviour. They do not contain Lesson 1 wording.

## Architectural decisions

1. `ArrayBuilder` supports factor arrangements and square arrays. Prime/composite teaching uses explicit factor lists rather than row-based counter arrangements.
2. Classification is multi-select because number properties overlap. A number is never forced into one exclusive family.
3. Incorrect feedback is resolved within the current state, then progression continues to the next core state.
4. Feedback is text plus an optional semantic visual action. Components decide how actions such as `resolveExpression` or `revealRecurringPattern` look.
5. Answer checking is pure and centralised in `lessonMath.ts`. Factor-list order and duplicate entries do not change correctness.
6. Progress is calculated per micro-skill. An initial secure result requires a completed teaching interaction, two correct independent items, and a correct misconception-sensitive item; isolated mistakes do not block completion.

## Feedback and progression policy

- Every submitted answer unlocks `Continue`; incorrect answers never trap the learner on the current state.
- Incorrect feedback explicitly shows the accepted answer before the learner moves on.
- Incorrect attempts remain recorded for mastery and misconception analytics even though progression continues.

## File responsibilities

- `types.ts`: stable content and runtime contracts.
- `lessonMath.ts`: pure, testable maths and answer helpers.
- `numberTypesLesson.ts`: Lesson 1 content only.
- `useLessonEngine.ts`: generic state-machine behaviour and progression metadata.
- `components/NumberCard.tsx`: number/expression presentation.
- `components/ChoiceCards.tsx`: single- and multi-select interaction with a tap alternative to dragging.
- `components/FeedbackPanel.tsx`: non-colour-only result and evidence display.
- `components/NumberLine.tsx`: integer ticks, between-tick markers and resolved expressions.
- `components/ArrayBuilder.tsx`: shared counter-array representation.
- `components/FactorPairBuilder.tsx`: progressively revealed factor pairs.
- `components/MultipleStepper.tsx`: repeated-addition/times-table sequence.
- `components/PowerStructure.tsx`: square arrays and symbolic cube layers.
- `components/DecimalPattern.tsx`: terminating, recurring and non-recurring decimal behaviour.
- `components/StateVisual.tsx`: visual registry.
- `NumberTypesLessonView.tsx`: responsive lesson shell.
- `RationalNumbersLesson.css`: feature-local visual system and motion/accessibility rules.

## Extension rule

Add a lesson by supplying new states. Add a component only when an interaction cannot be expressed by an existing semantic visual. Do not add state IDs, wording or answers to reusable components.
