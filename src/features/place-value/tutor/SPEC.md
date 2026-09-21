# Canonical Lesson 3 specification

`placeValueLesson.ts` is the active content. `PlaceValueLessonView.tsx` renders it through the existing shared lesson engine. `src/App.tsx` routes Lesson 3 directly here with no approach selector. Legacy A/B content remains unrendered as an implementation reference.

23 sequential states: large-number teaching, matching video/worked example and seven source practice parts; decimal teaching, PDF worked example, practice, matching video, fraction teaching and the remaining source practice parts; review. See SOURCE-MAP.md for every source and correction.

## Interaction

- Topic heading and segmented lesson progress. Future sections are disabled until reached. Reached sections are revisitable using the shared engine. Restart preserves reached sections, matching Lesson 1.
- One activity at a time, lesson Back and Continue. Continue on teaching is always available; on questions it becomes available after either result. There is no retry gate.
- Numeric and fraction responses remain visible and disabled after submission. Selected choices retain pressed state after grading; complete numbered working and answer appear immediately on both result paths.
- Every practice question has an optional contextual Hint. Opening it does not submit, grade or alter the response. Hints reset for the next activity.
- Fraction notation uses the shared safe numeric parser and a fraction-only grammar; equivalent positive fractions are accepted. No learner input is evaluated as code.

## Worked examples and media

Use Lesson 2’s cumulative `StackedWorkedExample`. Original calculation and source number remain visible. Next adds one line; calculation Back removes the latest line; Replay resets. Each transition underlines precisely the calculation in the preceding line that produces its result. Independent calculations are labelled groups, with no equality between them. These controls never gate lesson navigation.

Use the same exported video player as Lesson 2: native controls, playsInline, speed choices, metadata preload, bundled poster, no autoplay. Video / working panels stay mounted, so switching pauses the video and preserves revealed working. Unmounting pauses playback. Viewing or ending a clip does not advance the lesson.

Video screens show the tabs, player/tools, mathematical topic/question and lesson actions. No tutor attribution, correction paragraphs, summary/walkthrough disclosures, caption/no-audio notices or extra continuation instructions.

## Verification

`npm run verify:lesson3:tutor` checks exact source coverage, independently checked answers and ratios, wrong responses, equivalent fraction grammar, all transitions, cumulative math/underlines, real media files and the sole Lesson 3 route. Browser QA covers complete correct/incorrect paths, media, working controls, hints, all lesson menu routes, desktop and narrow mobile layouts. Final TypeScript, existing verifiers and an isolated production build must pass. Deployment is not part of this change.
