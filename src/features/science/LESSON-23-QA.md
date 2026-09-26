# Lesson 23 QA note — Vaccination

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed. Built from the storyboard you approved. The code was checked against it string by string, and every question, option, hint, explanation and frame matches.

## Checked (automated, `lesson23.test.tsx`)
All 12 checks ran and passed, including the full-flow, repair-route and storage-isolation checks through the real preview-session engine.

The checks cover:
- **Metadata** and AQA 4.3.1.7 references. Lesson `B-INF-023-B`, skill `B-VACCINATION`, prerequisite `B-BODY-DEFENCES`.
- **Grading:** all answer paths grade correctly. The written task is `teacherOnly`.
- **Answer spread:** 0 ×3, 1 ×3, 2 ×3, 3 ×2. The largest share is 27%.
- **Plain language:** a guard bans memory cell, herd immunity, booster, MMR, passive (immunity) and other out-of-scope terms. Sentences are 26 words or fewer and questions 22 words or fewer.
- **Rendering:** teaching frames render through the real `TeachingChunk` and `CellBiologyVisual`.
- **Hidden answers:** the four question diagrams keep the answer hidden until submission (B23-04, B23-07, B23-09, B23-14).
- **Scope:** Lesson 20 (measles) and Lesson 22 (antibodies) are brief links, not retaught. The terms immune, vaccination, inactive and epidemic are each defined once. There are no absolute claims, and nowhere does it say that vaccines contain antibodies.
- **Flow:** chickenpox in Sam's class → vaccine → his whole school. The first response comes before the second, and the limits come last, on the one summary screen.
- **Navigation:** Lesson 23 is in the hub, the B3 chapter and the parser, and Lesson 22 now recommends Lesson 23.

Regression runs in the same sandbox:
- The full Science test suite passed. Lesson 22's flow test now expects Lesson 23 as the next step, not a practical.
- Repository TypeScript and the production build passed for the tracked application.
- The exam-preparation storage-key count was updated from 31 to 32 after the full suite exposed the new Lesson 23 record.

## Checked (visual)
- All 23 rendered diagram states (22 unique visuals, including the assessment versions) were checked at 540px and 330px: 46 geometry checks with 0 viewBox escapes, text overlaps or horizontal overflows.
- Screenshots were reviewed and fixed:
  - a bottom caption that ran off the edge;
  - a label that overlapped a question badge, and one that overlapped a tick label;
  - white blood cells clipped by the zoom circle;
  - panel 4 of the vaccine strip spilling past its panel;
  - droplets that reached only one row of pupils;
  - leader lines that started on top of bold text;
  - a label that crowded a pupil;
  - a virus that touched a label.
- **Scene-first:**
  - Sam's class, and Sam with a blood zoom circle (B23-02).
  - An arm with a zoom circle under the skin (B23-05).
  - A school crowd, where a shield badge means vaccinated, as in Lesson 19 (B23-08).
- **Grids** are used only for the vaccine-stage question strip (B23-07) and the one benefits-and-limits summary (`vaccine-summary`).
- **The epidemic frame** compares two groups of pupils. It is drawn as one scene split by a dashed line, not as cards.

## Needs a qualified Science teacher
- **Simplifications:**
  - "Most people only have chickenpox once."
  - An inactive pathogen is drawn pale with a dashed outline, while its antigens stay solid. This is a model.
  - The response curve is schematic. It has no units and makes no claim about the timing of memory.
- **Invented data:** the antibody-level graph (B23-14) is illustrative.
- **Wording on reactions:** "a sore arm or a fever, usually mild".
- **Written-answer rubric** for B23-15.

## Repository verification
- `npm run test:science`
- `npx tsc --noEmit`
- `npm run build`
- Live manual review at 540px and 330px, alongside the full contact sheets.
