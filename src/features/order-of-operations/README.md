# Lesson 2: Order of operations

Lesson 2 opens directly into the owner-approved tutor-backed implementation in `variant-c/`. Variants A and B are no longer menu options or render paths. Other lessons' variant choices are unchanged.

The lesson contains 34 screens and 23 questions: all 21 PDF practice questions, replayable adaptations of all three tutor videos, and two retained equal-priority checks.

## Working layout

The cleaned tutor clips are embedded at the BIDMAS, fraction and algebra demonstrations (`L2C-02`, `16`, `25`). Watch video / Step by step tabs offer the original recording and interactive working without adding screens or changing questions. Videos have familiar playback controls, Replay, speed selection and a written walkthrough; playback is learner-controlled and never gates Continue. Assets are bundled under `public/media/lesson-2/`. The fourth supplied clip is about integers and is not included in BIDMAS.

Every replayable worked demonstration keeps the original expression visible and builds a vertical stack with Next. Back removes the latest working; Replay starts again. The previous line underlines the calculation that produces the result below. Fraction and algebra examples use the same layout, with separate labelled groups for unrelated examples.

Question feedback still reveals the full numbered working immediately, regardless of accuracy. The learner's response stays visible and Continue is always available after feedback. Optional BIDMAS hints do not submit an answer.

## Architecture

`variantCLesson.ts` → shared `useLessonEngine.ts` → `VariantCLessonView.tsx` → `TutorOperationsVisual.tsx` / `StackedWorkedExample.tsx`

The implementation reuses proven visual, hint and styling helpers from `variant-b/`; those helpers are not selectable lesson alternatives. Algebra inputs accept safely normalised equivalent monomials, including variable reordering, spaces, multiplication signs and squared notation.

See `variant-c/SOURCE-MAP.md` for source transcription and corrections, `variant-c/SPEC.md` for the storyboard and layout contract, and `variant-c/QA.md` for verification. Run `npm run verify:lesson2:tutor` for content, grading, underlined-transition and sole-route checks.
