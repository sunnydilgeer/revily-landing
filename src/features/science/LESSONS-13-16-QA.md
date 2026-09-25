# Lessons 13–16 refactor — QA note

Refactored Lessons 13 (Blood), 14 (Cardiovascular disease and treatments), 15 (Health and disease) and 16 (Risk factors and cancer) to the Lesson 17–18 standard. All four stay `draftNeedsTeacherReview` and are bumped to `contentVersion: '0.2.0'`, which resets local preview progress for these lessons only.

## What was checked

| Check | L13 | L14 | L15 | L16 |
|---|---|---|---|---|
| Screens (was → now) | 19 → 18 | 20 → 18 | 17 → 16 | 25 → 19 |
| Sections | 7 | 7 | 6 | 7 |
| Answer positions used / largest share | 3 / 42% | 4 / 33% | 3 / 36% | 4 / 36% |
| Longest teaching sentence (words) | 13 | 18 | 15 | 16 |
| Question diagrams with answer-free assessment versions | 2 | 2 | 2 | 2 |
| Independent questions + written task | 3 + 1 | 3 + 1 | 3 + 1 | 3 + 1 |

- `lessons1316.test.tsx` now applies the Lesson 17–18 checks to all four lessons: answer spread, question length, sentence length, authoring words, banned out-of-scope terms, hints that don't repeat the answer, titled accessible SVGs, and lesson-specific rules so question diagrams never show the answer.
- The Appendix A layout checker reports 0 problems for Lessons 13–18 at 540px and 330px.
- Every diagram was also checked by eye in screenshots, and leader, overlap and legibility problems were fixed. The checker cannot catch those.
- The phrase checks still pass: haemoglobin, platelets, immune rejection, physical and mental well-being, does not mean every, secondary tumour.
- Engine, preview-session and evidence contracts are unchanged. Written tasks remain `teacherOnly`.

## Diagrams

All Lesson 13–16 focus IDs have explicit branches in `HealthDiseaseVisuals.tsx`; none falls to a default drawing. The old IDs `health-interactions`, `health-factors` and `risk-evidence-question` still route to their replacements. Lesson 16 reuses `cycle-daughters` from `DivisionVisuals.tsx`. Colour meanings follow the handoff table. Invented data is labelled as example data.

## Needs a qualified Science teacher

**Lesson 13**
- Phagocytosis, fibrin, antitoxins and plasma proteins are removed from learner text and labels (B3 teaches defence).
- "Biconcave" is introduced as "dished in on both sides".

**Lesson 14**
- "Heart attack" is dropped; AQA 4.2.2.4 does not require it.
- "Mechanical valves … the patient needs drugs to stop blood clots" simplifies lifelong anticoagulation.
- Heart-and-lung transplant is mentioned in one sentence.

**Lesson 15**
- The tone of Sam's week (a cold, poor sleep, exam worry).
- Depression is defined in one plain sentence.
- Invented school-absence data in the bar-chart question.

**Lesson 16**
- The road-crossing opener and the ice cream / sunburn example of correlation without cause.
- Lymph, screening and insulin are removed as beyond Foundation scope.
- The placenta sentence ("the baby shares the mother's blood supply through the placenta") is a simplification.
- Invented scatter data in the correlation question.

**All four**
- Check the link-back lesson numbers against the live course: Lessons 5, 7, 10, 11, 14 and 19.
