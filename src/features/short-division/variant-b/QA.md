# Lesson 4 B — QA

Verified locally on 13 September 2026 at `http://127.0.0.1:3001/preview`. Original Revily content; no deployment or commit.

## Content and grading

- 25 unique screens, including 16 questions. Every question has a collapsed contextual Hint and numbered Explanation steps with an explicit Answer on both grading paths.
- Browser walkthrough: all 16 incorrect responses on desktop and all 16 correct responses at 320 × 740. Every submitted response remains visible; Continue unlocks after one attempt. Completed and restarted the lesson.
- Numeric responses accept whitespace and equivalent formatted numbers. Quotient/remainder inputs deliberately accept nonnegative integer strings only; the grader also enforces the inverse identity and remainder bound. Separate fields retain both values after grading and across menu disclosure.
- `node scripts/verify-written-methods.cjs` checks all accepted answers, representative incorrect answers, numeric formatting, remainder constraints, explanation completeness and final worked results for both lessons.

## Interaction and visual checks

- Every Hint opened during both walkthroughs; closing and reopening verified throughout. Hints reset on a new question, stay inline and do not contain final numerical answers. No hint-specific highlighting remains outside the disclosure.
- Every worked example advanced through every frame at 320px: 84 ÷ 4, 72 ÷ 3, 288 ÷ 9, 67 ÷ 5, 408 ÷ 4 and inverse checking. Previous reverses the frame, Next restores it, Replay resets the example. Continue is always enabled, including before revealing any steps.
- Groups explorer makes four groups of 3 from 14 and leaves 2; a fifth group is disabled. Menu opening/closing retains groups. Exchanging one ten changes 7 tens + 2 ones into 6 tens + 12 ones, retains total 72 and survives menu disclosure.
- Enter submits numeric and quotient/remainder forms. Escape closes the menu and returns focus. Button controls use native keyboard activation.
- A/B switching exposes the unchanged Variant A and returns to B. Both new lessons initially select B. Existing Lesson 3 B still opens correctly.
- No document overflow at 320px across all screens, expanded hints, graded feedback and every worked frame. Visually inspected introduction, regrouping carry and expanded remainder-input screen. Browser error log empty.

## Build

TypeScript, content verification, `git diff --check` and the production build pass. Build ran in `/private/tmp/revily-lessons45-build` with a separate `.next` directory; all 17 routes generated. Unrelated existing local work preserved.

These checks are implementation QA, not a formal accessibility audit or classroom evaluation. Menu disclosure preserves the mounted lesson; changing lesson/variant or reloading starts its sequence again, as in the existing preview.
