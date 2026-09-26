# Lesson 24 QA note — Medicines and where they come from

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed. Built from the storyboard you approved. The code was checked against it string by string, and every question, option, hint, explanation, marking point and frame matches.

## Checked (automated, `lesson24.test.tsx`)
All 12 checks ran and passed, including the full-flow, repair-route and storage-isolation checks through the real preview-session engine.

The checks cover:
- **Metadata** and AQA 4.3.1.8 and 4.3.1.9 references. Lesson `B-INF-024-B`, skill `B-MEDICINES`, prerequisite `B-VACCINATION`.
- **Grading:** all answer paths grade correctly. The written task is `teacherOnly`.
- **Answer spread:** 0 ×3, 1 ×3, 2 ×3, 3 ×2. The largest share is 27%.
- **Plain language:** a guard bans Lesson 25 terms (placebo, clinical trial, efficacy, toxicity, double-blind, peer review), natural selection, antiviral and monoclonal. Sentence and question lengths are within the limits.
- **Rendering:** teaching frames render through the real `TeachingChunk` and `CellBiologyVisual`.
- **Hidden answers:** the three question diagrams keep the answer hidden until submission (B24-05, B24-10, B24-14).
- **Scope:** Lesson 20 (gonorrhoea) and Lesson 22 (white blood cells) are brief links. Each required term is defined once. Nothing says that painkillers kill pathogens or that antibiotics kill or treat viruses.
- **Flow:** Mia's flu → ear infection → resistance → her medicine cupboard. What antibiotics do comes before what they cannot do, and the lab comes last.
- **Navigation:** Lesson 24 is in the hub, the B3 chapter and the parser, and Lesson 23 now recommends Lesson 24.

Regression runs in the same sandbox:
- The full Science test suite passed. Lesson 23's flow test now expects Lesson 24 as the next step.
- Repository TypeScript and the production build passed for the tracked application.
- The exam-preparation storage-key count was updated from 32 to 33 after the full suite exposed the new Lesson 24 record.

## Checked (visual)
- All 23 rendered diagram states (22 unique visuals, including the assessment versions) were checked at 540px and 330px: 46 geometry checks with 0 viewBox escapes, text overlaps or horizontal overflows.
- Screenshots were reviewed and fixed:
  - body cells shrunk so the pathogens sit between them, not on top;
  - the "painkiller" text now fits its packet;
  - a label that ran off the bottom edge;
  - a long leader line that crossed the scene;
  - the willow and foxglove redrawn so they read as those plants, with hanging narrow leaves and one-sided tube flowers.
- **Scene-first:**
  - Mia in bed, with a zoom circle into her body (B24-02 and B24-04).
  - A bacteria zoom (B24-07).
  - Mia's medicine cupboard, with each packet linked to its source by an arrow (B24-09).
- **Grids** are used only for the one painkillers-and-antibiotics summary (`drug-summary`) and the clear-zone chart.
- **Resistance** shows a single changed bacterium and then a strain. It has no survival-and-spread sequence, which is kept for natural selection later.

## Needs a qualified Science teacher
- **Simplifications:**
  - "Mutate means change."
  - "A strain is one type of a bacterium."
  - Antibiotic particles are drawn as grey dots.
  - The mould dish shows a clear ring as a nod to Fleming's observation. It is not a reproduction of his plate.
- **B24-12** says a doctor would "most likely" suggest something to ease symptoms for a cold. Check that you're happy with this wording, which is not medical advice.
- **Invented data:** the clear-zone chart (B24-14) is illustrative.
- **Written-answer rubric** for B24-16.

## Repository verification
- `npm run test:science`
- `npx tsc --noEmit`
- `npm run build`
- Live manual review at 540px and 330px, alongside the full contact sheets.
