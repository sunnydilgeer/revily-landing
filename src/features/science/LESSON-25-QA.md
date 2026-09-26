# Lesson 25 QA note — Testing new drugs

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed. Built from the storyboard you approved. The code was checked against it string by string, and every question, option, hint, explanation, marking point and frame matches.

## Checked (automated, `lesson25.test.tsx`)
All 12 checks ran and passed, including the full-flow, repair-route and storage-isolation checks through the real preview-session engine.

The checks cover:
- **Metadata** and AQA 4.3.1.9 references. Lesson `B-INF-025-B`, skill `B-DRUG-TESTING`, prerequisite `B-MEDICINES`.
- **Grading:** all answer paths grade correctly. The written task is `teacherOnly`.
- **Answer spread:** 0 ×3, 1 ×3, 2 ×3, 3 ×2. The largest share is 27%.
- **Plain language:** a guard bans trial phase names, regulators, licensing, statistics, natural selection, "safe" and "no side effects". Sentence and question lengths are within the limits.
- **Rendering:** teaching frames render through the real `TeachingChunk` and `CellBiologyVisual`.
- **Hidden answers:** the three question diagrams keep the answer hidden until submission (B25-07, B25-11, B25-14). This check caught one real leak during the build: the dose chart's screen-reader title named "dose 3". The title now lists the values in order instead.
- **Scope:** Lesson 24 and Mia are brief links. The terms preclinical, efficacy, toxicity, dosage, clinical trial, optimum dose, placebo, double-blind and peer review are each defined once. The tone on animal testing is neutral, with no absolute claims.
- **Flow:** the lesson checks that the stages come in order: cells → animals → healthy volunteers → patients → placebo → peer review.
- **Navigation:** Lesson 25 is in the hub, the B3 chapter and the parser, and Lesson 24 now recommends Lesson 25.

Regression runs in the same sandbox:
- The full Science test suite passed. Lesson 24's flow test now expects Lesson 25 as the next step.
- Repository TypeScript and the production build passed for the tracked application.
- The exam-preparation storage-key count was updated from 33 to 34 after the full suite exposed the new Lesson 25 record.

## Checked (visual)
- All 22 rendered Lesson 25 diagram states (21 unique visuals, including the assessment versions) were checked at 540px and 330px: 44 geometry checks with 0 viewBox escapes, text overlaps or horizontal overflows.
- The shared Lesson 24 `drug-` scenes remained covered by the passing full render suite, and the existing scene code was unchanged while the new `trial-` scenes were appended.
- Screenshots were reviewed and fixed:
  - chart legends moved off the bars and away from the "optimum" marker;
  - the spoon icon kept clear of the word "dosage";
  - the peer-review heading moved clear of the report;
  - two leader lines removed or moved so they no longer cross text or people.
- **Scene-first:**
  - A lab bench (bottle, cell dish, mouse cage, and a clipboard for the three checks).
  - A clinic (volunteers, patients and a dose meter).
  - Two patient groups with identical pill pots, blindfolds for blind and double-blind, and a report checked by three scientists.
- **Grids** are used only for the stages strip (B25-07) and the two charts.

## Needs a qualified Science teacher
- **Simplifications:**
  - The optimum dose is shown as a band on a dose meter.
  - Blindfolds are drawn to show "does not know".
  - "So nobody's expectations can affect the results" is the one reason given for double-blind trials. It goes slightly beyond page 43.
- **Invented data:** both charts (B25-11 dose results, B25-14 trial results) are illustrative. The placebo group improves too, on purpose.
- **Written-answer rubric** for B25-15, which has 5 marking points.

## Repository verification
- `npm run test:science`
- `npx tsc --noEmit`
- `npm run build`
- Live manual review at 540px and 330px, alongside the full contact sheets.
