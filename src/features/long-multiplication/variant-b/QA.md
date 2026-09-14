# Lesson 5 B — QA

Verified locally on 13 September 2026 at `http://127.0.0.1:3001/preview`. Original Revily content; no deployment or commit.

## Content and grading

- 26 unique screens, including 19 questions. All have collapsed contextual hints and numbered Explanation steps plus explicit Answer on both grading paths.
- Browser walkthrough: all 19 incorrect responses on desktop and all 19 correct responses at 320 × 740. Continue always unlocks, responses stay visible, and completion/restart works.
- Comma-formatted answers such as 3,168 pass. Entered and submitted `947.200` is accepted as 947.2 and its exact formatting remains visible. Malformed grouping, empty input and expressions are rejected by the grader.
- The final multiple-selection question requires Check answer and preserves the selected subset after grading. Choosing an incomplete/incorrect subset fails.
- `node scripts/verify-written-methods.cjs` checks question metadata, accepted/rejected responses, numeric formats, both feedback branches and recomputes each worked example’s partial products and total.

## Interaction and visual checks

- Every Hint opened during both walkthroughs; closing and reopening verified throughout; new questions reset it. Typed input, expanded hint and visual selection survive menu disclosure. No persistent supplementary guidance panels or modal hints.
- All four worked examples exercised through every frame at 320px: 23 × 12, 281 × 23, 347 × 26, 405 × 32. Previous removes the final frame; Next restores it; Replay resets; menu toggling preserves the current frame. Continue is enabled from the initial frame.
- Area model selects either part, reports 140 or 28, and combines them to 168. Menu preserves the selection. Final mobile refinement retains the true 5:1 width ratio for ten columns versus two (measured 192.5px and 38.5px).
- Scaling controls tested with Space and Enter: both factors ×10 produce 120 × 30 = 3,600 and product ×100. State persists through menu open/Escape.
- A/B switching opens the original A and returns to B. B is the initial variant when selecting Lesson 5.
- No document overflow at 320px across all screens, expanded hints, graded feedback and worked frames. Visually inspected desktop/mobile area model, carrying frame and expanded decimal-scaling hint. Browser error log empty.

## Build

TypeScript, content verification, `git diff --check` and isolated production build pass; all 17 routes generated. Build directory: `/private/tmp/revily-lessons45-build`. Existing local changes preserved.

Implementation QA does not replace classroom testing or a formal accessibility audit. Menu disclosure preserves the mounted activity; switching lessons/variants or reloading restarts its sequence, matching the existing preview.
