# Science Coach

Separate product experiment at `/preview/scienceB`; no changes to A/B authored content or existing progress.

- All six easier-wording B lessons reuse the established teaching renderer and session engine, with `revily:science-coach:` storage keys.
- New home: continue learning, short review, supported mistake repair, six-lesson catalogue and student-facing starter checklist.
- Fourteen starter goals across all six lessons. Forty-two original draft multiple-choice questions: initial review, different supported repair, different later review. This is **not** full specification coverage, official exam content or whole-topic mastery.
- Reviews unlock only after all teaching screens linked to a goal are completed. Jumping to a section does not unlock a goal.
- Sets contain at most five questions. Choices appear after an invitation to think; only the selected choice is assessed, not the student's unobserved spoken/thought answer.
- Later checks become available at least 24 hours after the latest lesson/review exposure. This conservative pilot interval is not a validated optimal schedule. Clock is local, not authoritative.
- Fresh, correct, unassisted review choices can be labelled “Correct on a later check”. Reminded, repair and previously seen items remain practice. Once fresh questions are exhausted, repeated practice stays explicitly labelled.
- Relevant lesson/review wrong choices populate the repair list. Correct supported repair clears the immediate repair need, not a mastery requirement. Written answers are never auto-scored and cannot generate guessed repair diagnoses.
- Review set, locked answers, hint use and current position persist. Local restore rejects incompatible or malformed records and recalculates choice grading. No accounts, synced scheduling, notifications, teacher queue or production evidence updates.
- Real microscopy and osmosis practicals remain teacher-supervised requirements.

Run `npm run test:science` and `npx tsc --noEmit --incremental false`. Coach tests cover authored links, isolation, eligibility, timing, repair, exposure, hints, exhausted banks, locked submissions and persistence.
