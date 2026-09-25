# Lesson 22 QA note — How your body defends itself

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed. At your request, this lesson was built without a separate storyboard approval step. The storyboard is generated from the code.

## Checked (automated, `lesson22.test.tsx`)
All 12 checks ran and passed in the full repository, including the full-flow, repair-route and storage-isolation checks.

The checks cover:
- **Metadata** and AQA 4.3.1.6 references.
- **Grading:** all answer paths grade correctly. The written task is `teacherOnly`.
- **Answer spread:** the largest share is 27%.
- **Plain language:** a guard bans lymphocyte, phagocyte, memory cell, immunity, vaccination and other out-of-scope terms. Sentence and question lengths are within the limits.
- **Rendering:** teaching frames render through the real `TeachingChunk` and `CellBiologyVisual`.
- **Hidden answers:** the three question diagrams keep the answer hidden until submission (B22-03, B22-09, B22-14).
- **Scope:** Lessons 10, 13 and 19 are brief links, not retaught. Antigens are never said to be made by white blood cells.
- **Flow:** door handle → barriers → cut → the three white blood cell actions, with antigens taught before antibodies.
- **Navigation** and the 21 → 22 recommendation.

Full-repository verification:
- `npm run test:science` passed, including Lessons 17–22 and all navigation and recommendation regressions.
- Navigation list and parser checks passed.
- Recommendation chain: 17 → 18 → 19 → 20 → 21 → 22 → practical passed.
- `npx tsc --noEmit` passed.
- `npm run build` passed.

## Checked (visual)
- All 19 new diagram states, plus the 67 from Lessons 19–21 as a regression check, were rendered at 540px and 330px. The result was 0 problems.
- Screenshots were reviewed and fixed:
  - the zoom insets are clipped to their circles;
  - the question markers are numbered top to bottom;
  - antibodies now point their tips at the antigens;
  - the engulfing step of phagocytosis was redrawn as one cell wrapping round the bacterium.

## Needs a qualified Science teacher
- **Simplifications:**
  - "White blood cells swallow pathogens" is a plain-language gloss for engulfing.
  - Antigens are drawn as triangles and squares to show specificity. This is a model, not their real shape.
  - Skin "releases substances that kill pathogens".
- **Invented data:** the infected-cut graph (B22-14) is illustrative.
- **Written-answer rubric** for B22-15.
