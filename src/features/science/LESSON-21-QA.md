# Lesson 21 QA note — Plant diseases and malaria

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed.

## Checked (automated, `lesson21.test.tsx`)
The file uses the same checks as `lessons1920.test.tsx`, for one lesson, and all 12 checks pass in the full repository, including full-flow, repair-route and storage-isolation checks.

The checks cover:
- **Metadata:** metadata, unique IDs, AQA 4.3.1 locators and spec references, sections, and sampled requirements drawn from independent states only.
- **Grading:** every choice option grades correctly. Explanations end on the correct option. Hints never repeat the answer. The written task is `teacherOnly`.
- **Answer spread:** correct answers use four positions. The largest share is 36%.
- **Plain language:** a guard bans terms beyond Foundation level (Plasmodium, Anopheles, hyphae, spores and others). No teaching sentence is longer than 26 words, and no question is longer than 22 words.
- **Rendering:** every teaching frame renders through the real `TeachingChunk` and `CellBiologyVisual`, with accessible SVG.
- **Hidden answers:** all four question diagrams keep the answer hidden until submission. These are B21-04, B21-09, B21-12 and B21-14.
- **Scope:** chlorophyll is defined once and reused for roses, not retaught. The lesson never says the mosquito causes malaria.
- **Flow:** tomatoes, then roses, then malaria, then the grid.
- **Navigation:** the hub, the B3 chapter [19, 20, 21], the parser and the links include Lesson 21, and Lesson 20 now leads to Lesson 21.

Full-repository verification on 25 September 2026:
- `npm run test:science` passed, including Lessons 1–22, navigation, variant, exam-preparation, Coach and revision regressions.
- `npx tsc --noEmit` passed.
- `npm run build` passed.
- Recommendation chain 17 → 18 → 19 → 20 → 21 → 22 → practical passed.
- The B3 chapter, hub, parser, canonical links and isolated storage records include Lesson 21.

## Checked (visual)
- All 23 new diagram states, plus the 44 from Lessons 19–20 as a regression check, were rendered in Chromium at 540px and 330px. The result was 0 problems for text outside the frame, overlapping text or missing accessibility attributes.
- The generated 540px and 330px sheets were visually reviewed. The malaria bite cycle keeps each mosquito inside its panel and clearly biting the arm; chain text, the seven-disease grid and the fungicide table remain legible; question versions keep answers hidden.

## Needs a qualified Science teacher
- **TMV spread by touch (B21-02, last frame):** this is beyond the scans and the spec. It is never assessed. Delete it if you prefer to keep strictly to the spec.
- **Wording:** "Malaria can kill" and "fever that keeps coming back" were kept to plain language on purpose.
- **Invented data:** the fungicide data is illustrative.
- **Written-answer rubric** for B21-16.

## Diagram revision
The disease cards and the column-of-boxes chain were replaced with scenes in `components/PlantDiseaseVisuals.tsx`, following the Lesson 17–18 pattern. Focus IDs, lesson text and questions are unchanged.
- **TMV:** a tomato plant; a zoomed-in mosaic leaf; sunlight arrows absorbed by green parts and passing through pale patches; a stunted plant beside a healthy one; spread on a hand.
- **Rose black spot:** a rose bush; a zoomed-in spotted leaf with fungus; yellow leaves falling; sunlight missing the lost leaves (the same chain as TMV, written on the scene); wind and rain carrying the fungus; a fungicide spray and a bin.
- **Malaria:** a person with a zoom into the blood showing protists; a temperature graph with fever that keeps coming back; a bed with a mosquito net, and still water where mosquitoes breed crossed out.
- **Unchanged:** the question diagrams (the chain with a blank step, the numbered bite cycle, the seven-disease grid) and the fungicide chart.
- **Removed:** the old disease-card code in `InfectionVisuals.tsx`, which is no longer used.

All 86 diagram states for Lessons 19–22 were checked at 540px and 330px with 0 problems. The complete Science suite passes, including the full-flow, repair-route and storage-isolation checks. The strict type check and production build also pass.
