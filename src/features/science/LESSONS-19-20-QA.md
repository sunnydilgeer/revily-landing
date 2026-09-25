# Lessons 19–20 QA note — B3 Infection and response

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed.

## Checked (automated, `lessons1920.test.tsx`)
The file mirrors `lessons1718.test.tsx` and all 20 checks pass in the full repository, including full-flow, repair-route and storage-isolation checks.

The checks cover:
- **Metadata:** metadata, unique IDs, AQA 4.3.1 locators and spec references, sections mapped to real states, and sampled requirements drawn from independent states only.
- **Grading:** every choice option grades correctly. Explanations end on the correct option. Hints never repeat the answer. Written tasks are `teacherOnly`, with a rubric and rejected answers.
- **Answer spread:** correct answers use at least three positions, and no position holds more than 45%. Lesson 19's largest share is 36%; Lesson 20's is 33%.
- **Plain language:** a guard bans out-of-scope terms (antigen, antibody, phagocytosis, MRSA, herd immunity and others) and judgemental wording. No teaching sentence is longer than 26 words, and no question is longer than 22 words.
- **Rendering:** every teaching frame renders through the real `TeachingChunk` and `CellBiologyVisual`, with its text, `role="img"`, `aria-labelledby` and a descriptive `<title>`.
- **Hidden answers:** all six question diagrams keep the answer hidden until submission. These are B19-08, B19-11, B19-14, B20-14, B20-15 and B20-16.
- **Scope and flow:** Lessons 1, 15, 19, 22, 23 and 24 are brief links, not retaught. Lesson 19 follows the cold to the end before the other pathogens. Lesson 20 teaches bacteria before viruses.
- **Navigation:** the hub, the B3 chapter, the parser and the canonical links all include Lessons 19–20.

Full-repository verification on 25 September 2026:
- `npm run test:science` passed, including Lessons 1–20, navigation, variant, exam-preparation, Coach and revision regressions.
- `npx tsc --noEmit` passed.
- `npm run build` passed.
- Recommendation chain 17 → 18 → 19 → 20 → practical passed.
- The Lesson 19 prerequisite resolves to Lesson 15's `B-HEALTH` skill.
- Lessons 19–20 show the Infection and response sequence in the lesson-information panel.

## Checked (visual)
- All 44 diagram states were rendered in Chromium at 540px and 330px. An automated check confirmed every text label and shape sits inside its viewBox, no text labels overlap, and every diagram has accessibility attributes. The result was 0 problems.
- Screenshots were reviewed and fixed over several rounds. Examples: the handshake and water scenes, text overflowing the disease-card panels, and label collisions on the measles chart. Two question-diagram titles had given the answer away and were rewritten.
- The known limit is the same as the existing diagrams: at phone width, label text scales down to about 8–9px.

## Needs a qualified Science teacher
- **Scientific judgement calls:**
  - "a virus is not a cell" is stated plainly.
  - Toxins are attributed to bacteria only.
  - "Fungi include moulds and mushrooms."
  - Protists are described as "larger and more complex than a bacterium".
  - A cold is used as the opening example. It is not a spec disease.
- **Sensitive wording:** gonorrhoea and HIV use neutral, factual wording. Please check the discharge description and the sharing-needles example.
- **Invented data:** the hand-gel and measles-vaccination data are illustrative, not real observations.
- **Written-answer rubrics** for B19-16 and B20-18.
- **Links:** the Lesson 1 link (bacterial cells) and Lesson 15 link (communicable disease) assume those lessons use those terms.
