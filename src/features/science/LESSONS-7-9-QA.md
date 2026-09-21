# Lessons 7–9 QA — 21 September 2026

## Automated verification

- `npm run test:science` passes the complete Science suite: 157 reported checks across the scaffold, session engine, all lesson groups, A/B isolation, exam pilot, Coach, revision and typography.
- `lessons789.test.tsx` adds 14 grouped checks for unique IDs, sources, menu targets, answer keys, teacher-only writing, script/frame agreement, original visual rendering, assessment-label hiding, complete session flow, reloads, locked submissions, B-only recommendations, practical boundaries, calculations and storage isolation.
- `npx tsc --noEmit --incremental false` passes.
- An isolated `next build` passes all 24 application routes. Generated build configuration changes and the temporary build directory were removed afterwards.

## Browser verification

Checked the B hub and Lessons 7–9 in the local Next preview.

- B hub exposes nine ordered lessons; A remains six.
- Lessons 7–9 show “Easier wording · only version” and do not offer a missing A route.
- The narrow lesson menu shows all nine lessons and all Lesson 8 sections.
- Lesson 7 hierarchy, Lesson 8 amylase/pH practical and Lesson 9 food-test walkthroughs render at 390 px and 1280 px.
- Document width equals viewport width at both checked sizes; no horizontal overflow.
- Iodine, Biuret and lipid steps retain their own positive-result colours rather than inheriting the Benedict’s test colour.
- Browser console: no errors or warnings during the final pass.

## Review boundary

This is implementation QA, not qualified Science-teacher approval or learner validation. All three lesson records remain `draftNeedsTeacherReview`. Timings are authored estimates; accessibility has had structural and responsive checks, not a full independent audit. Digital progress does not certify the supervised required practicals.
