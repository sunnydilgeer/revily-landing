# Science B — exam-focused Lesson 1

`/preview/scienceB` now serves only Lesson 1, **Cells: animal, plant and bacterial**, not all six lessons or the whole AQA Cell Biology unit. Old `?lesson=2` through `6` URLs fall back to this single-lesson overview rather than exposing other lessons. The original `/preview/science` A/B prototypes and their authored content/progress are unchanged. The Coach experiment remains in source, but is no longer the Science B route. No old browser records are deleted or migrated.

## Product

- Ready-made revision cards: 27 original question/concise-answer pairs in six sections, optional easy explanations, common slips, original cell/area models and specification locators.
- Reveal before self-checking. “Remembered” is explicitly student judgement, never auto-scored recall or mastery. Revisit cards come from student selections or canonically wrong choice/numeric answers.
- One original worked answer, one guided written answer, nine original application/recall/calculation checks. Models remain hidden until submission, except the worked example. Submitted responses lock; drafts, position, support, model exposure and revisit cards persist.
- Only selected choices and supplied-unit numerical results are auto-checked. Written reasoning remains pending qualified review; there is no delivery queue, keyword marking, calculated exam total, grade prediction or automatic mastery claim. Viewing guidance makes repetition practice.
- Storage: `revily:science:exam-revision:lesson1:v1`, isolated from all existing lesson and Coach records. Invalid records disable saving rather than overwrite unreadable work.

## Evidence and outstanding work

Specification mapping uses the existing Lesson 1 alignment and original science content: 4.1.1.1–4.1.1.2 with linked maths and working-scientifically skills. It excludes later microscopy/magnification, specialisation, division, stem cells and transport. Digital work never completes hands-on practicals.

Existing research notes (13–14 September 2026) describe broad assessment demands from June 2023 8464/B/1F references 01.2–01.4. They are historical notes, not a fresh source verification or proof of precise matches. Original points use the established structure → process → stated job approach. No official paper, diagram or mark-scheme wording is imported, and no exact official marks/matches are invented.

The UI explicitly marks **past-paper/mark-scheme calibration pending**. AQA's current material-use policy restricts AI input of its materials. Exact analysis and source-specific calibration remain blocked pending confirmation of appropriate permission/permitted review workflow and source review. This implementation completes the independent revision-product work, **not** the requested verified-paper audit. Links are existing source locators, not confirmation of public availability.

Run `npm run test:science` and `npx tsc --noEmit --incremental false`. Tests check content/link coverage, paper-pending status, storage isolation, reveal gates, canonical grading, pending writing, support flags, wrong-answer revisit cards, locked submissions, drafts, reload and malformed-data rejection.
