# Lesson 2 Variant B — QA, 13 September 2026

## Automated/build verification

- `npx tsc --noEmit`: passed.
- Full production `npm run build`: passed in an isolated copy at `/private/tmp/revily-lesson2-build`, using the same app/src/components/lib/config files and installed dependencies. All 17 routes generated. Initial in-place build compiled and passed types but failed collecting unrelated routes while a development server shared `.next`; isolation resolved this without project configuration changes.
- `git diff --check`: passed. Existing uncommitted Lesson 1 structured-explanation changes preserved. No deployment.

## Actual rendered browser checks

Local Next.js preview at `http://127.0.0.1:3001/preview`, using the app browser's documented Playwright controls.

- Desktop 1280px: traversed the full 27-screen lesson, deliberately answering every one of the 17 questions incorrectly. Every question displayed Explanation, numbered working, an explicit Answer and an enabled Continue. Finished and restarted successfully without requiring any correct answers.
- Mobile 320 × 740: traversed the full lesson with all 17 accepted answers. Every response graded correctly. Checked no document horizontal overflow and no KaTeX errors on screens 01–26, including post-answer states. Completion and restart worked.
- Screenshots inspected for opening counter groups, bracket comparison, numerator/denominator visual, fraction worked example and incorrect choice feedback. Long feedback scrolls vertically; response choices remain visible above it.
- Explorer: changing 4 to 2 counters per group updates the dots and equation to 2 + 3 × 2 = 8.
- Brackets: With brackets shows (2 + 3) × 4 = 20; Without brackets shows 2 + 3 × 4 = 14.
- Worked examples: advanced the multiplication/subtraction example, replayed it, and advanced all four fraction steps. Continue also works without viewing a single step.
- Fraction explorer: denominator control reveals the whole denominator 5 − 2 = 3. Vertical mathematical fraction notation renders correctly.
- Menu: opening/closing preserves explorer selection, unsent numeric input and submitted wrong-answer feedback. Escape closes it and returns focus to its toggle.
- Keyboard: Enter submits numeric input correctly. Back returns to the preceding screen; returning via Back intentionally resets the response, consistent with the shared engine.
- Existing Lesson 2 Variant A loads with its original spotlight; switching back opens B. Lesson 1 D loads and still displays structured working and Continue on its first question.
- Browser console reported no errors during QA.

## Limits

Content is newly authored for Revily, not provided or reviewed by Anushka. These checks verify mathematics, rendering and interaction, not measured pupil learning outcomes. Other variants were smoke-tested, not exhaustively re-tested. Switching lesson/variant restarts its mounted player, matching existing behavior; opening/closing the menu does not.

## BIDMAS refinement verification

TypeScript and diff whitespace checks passed. Browser verified new copy on screens 04, 10, 13 and 16 while traversing the lesson to the recap. Inspected screen 04 at desktop size and the redesigned four-level recap at 320px; no horizontal overflow. All 27 screens and existing answers/transitions remain intact. No deployment.

## Per-question BIDMAS reference verification

- TypeScript and `git diff --check` passed. A full isolated production build passed with the updated source.
- Rendered all four reference selections for each of the 17 questions at 320 × 740: 68 selected-rule states. Every maths expression stayed within its panel; no document horizontal overflow or KaTeX errors. Each rule group toggled closed correctly.
- Browser checks confirmed that rule selection does not submit/grade a response. All 17 deliberately incorrect responses still displayed full working and allowed Continue. Completion/restart remained available.
- Checked correct-answer feedback with the reference still usable afterwards: grading and Continue stayed intact.
- Checked keyboard Enter activation of a rule, selected-rule preservation through menu open/Escape, and typed-answer preservation when switching rules.
- Inspected desktop neutral/selected references and mobile bracket, numerator-only and whole-fraction states. Questions remain directly above answer controls; only the optional rule note expands.
- Pure helper checks rendered all 17 × 4 authored LaTeX variants with KaTeX `throwOnError: true`. Asserted neutral expressions are unchanged, completed multiplication annotations are not marked, and denominator multiplication is not marked in the numerator-only task.
- All 27 lesson states, questions and correct answers preserved. Rule consultation before submission is recorded with the shared hint bookkeeping. No deployment.

Research source details and access limitations are in RESEARCH.md. The four-group interactive reference is a Revily design synthesis, not a claim to copy a provider's authenticated lesson interface.

## Collapsed hint check

TypeScript and whitespace checks passed. Verified the shared question component starts with only Hint visible, opens all four groups, hides both groups and selected-rule highlights on closing, supports keyboard Enter, preserves typed input, and resets closed on the next question. Wrong-answer Continue still works. Inspected the collapsed 320px layout with no horizontal overflow. No deployment.
