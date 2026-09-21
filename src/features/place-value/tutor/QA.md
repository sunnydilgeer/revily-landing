# Lesson 3 QA

Verified locally on 17 September 2026. No commit, push or production deployment performed. Branch: `teacher-review/lesson-1`, starting at `34ac26c`.

## Sources and mathematics

- Extracted both PDFs and inspected all six rendered pages. All 14 practice parts and both worked examples are mapped in SOURCE-MAP.md.
- Decoded both complete supplied clips with FFmpeg; inspected distributed frames and their topic/example transitions. Video 12.45.00 demonstrates 526,908; video 12.45.27 demonstrates 0.6059. They are placed alongside matching written working, with two separate calculation groups per clip.
- Bundled MP4s have identical SHA-256 hashes to the supplied originals; posters are extracted from the clips.
- Independently checked integer/decimal values, constructed numbers, fractions, and both ratios (20,000 and the corrected 17.5).
- N3.2 Q4b’s false premise, Q3’s fraction requirement, video shorthand, choice adaptations, notation and scope decisions are documented in SOURCE-MAP.md.
- `npm run verify:lesson3:tutor` passed: 23 unique sequential states, 14 practice parts, two matching videos, eight cumulative calculation groups, ten underlined transitions; all authored answers accepted and representative wrong answers rejected.
- Fraction cases cover 5/1000, 1/200, equivalent unsimplified fractions and spacing. Decimal-only input, wrong denominator, zero denominator, malformed syntax, trailing text and exponent notation are rejected.

## Browser interaction

- Completed all 23 screens with incorrect answers at desktop width and all 23 with correct answers at a measured 320px CSS width. Each path includes all 14 questions. Both complete and restart successfully.
- Every submission immediately shows numbered Explanation steps and Answer. Wrong answers unlock Continue without retries. Numeric/fraction inputs remain visible; selected choices retain pressed state after grading.
- Opened and closed every hint on both paths (28 hint checks). No hint submits or grades an answer; draft inputs remain unchanged. Each new question starts with Hint collapsed.
- Exercised Next, calculation Back and Replay on every cumulative teaching screen on both paths (12 screen-level checks). Earlier lines and the original expression remain; unrelated calculations are separate Example 1 / Example 2 groups. Controls do not gate Continue.
- Both videos have native controls, inline playback, real duration metadata, bundled posters, selectable speeds and no autoplay. Replay starts playback. Switching to working pauses playback and preserves revealed lines when switching back. The 39.2-second clip played to its end at 2× without changing the lesson screen. Watch video / Step by step also supports keyboard arrow navigation.
- Lesson Back works from teaching and after feedback. Enter submits numeric input. Reached topic navigation works; future topics are initially disabled. Restart preserves reached topics, following existing Lesson 1 behavior.
- Opened all six lesson menu routes and both remaining A/B approaches for Lessons 4 and 5. Lesson 3 opens only the canonical tutor-backed route and has no approach selector.
- No browser console errors during the completed in-app checks.

## Layout

- All 23 screens, all hints, all answer explanations and fully expanded calculations checked for document and lesson horizontal overflow at 320px CSS width: none.
- Additional desktop video inspection at 1280px CSS width and decimal-introduction check at 375px CSS width passed. Viewport overrides accounted for the browser’s existing 120% zoom and were reset after checking.
- Visually inspected the introduction, desktop video/player/actions, expanded mobile decimal groups, and corrected comparison feedback. Long activities use vertical scrolling; calculation groups and mathematical working remain readable.

## Final checks

- `npx tsc --noEmit --incremental false`: passed without changing the existing untracked build-info file.
- Lesson 1 verifier: passed (67 states, 40 source exercises).
- Lesson 2 tutor verifier: passed (34 screens, 23 questions).
- Written-method verifiers for Lessons 4 and 5: passed.
- Lesson 3 tutor verifier: passed.
- `git diff --check`: passed.
- Production build: passed in `/private/tmp/revily-lesson3-build`, with 21 generated pages. Source was copied without `.git`, `.next`, `node_modules`, `dist`, or `impressive prototype/`; dependencies were linked. Workspace `.next` was not used or changed.
- Served the production build locally on port 3103 and opened canonical Lesson 3 in the in-app browser. The preview responds with HTTP 200 and both video byte-range requests return HTTP 206, supporting native seeking.
- Existing `.DS_Store`, `tsconfig.tsbuildinfo` and `impressive prototype/` remain unrelated untracked items and were left untouched.

These checks validate implemented teaching, grading and interface behavior. They do not establish classroom learning outcomes or constitute a formal accessibility audit.
