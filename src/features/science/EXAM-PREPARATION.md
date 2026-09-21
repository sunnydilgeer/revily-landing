# Cell Biology coverage and exam-practice pilot

## Scope and learner experience

`/preview/science/coverage?variant=b`: an audit of 18 topic areas across all six existing lessons, with skill descriptions, specification locators and exact teaching-screen links. The selected variant is preserved. The six lessons are a Cell Biology unit, not the whole GCSE or the whole Biology Paper 1 curriculum. Coverage does not certify individual mastery or completion of hands-on practicals.

`/preview/science/exam?variant=b`: a separate Lesson 6 bridge: original worked 2-mark active-transport answer, supported 2-mark root-hair explanation, independent 3-mark osmosis calculation/explanation, independent 2-mark diffusion explanation. These are original Revily drafts, not adapted or reproduced AQA questions. Model answers and draft marking points are available only after submitting a response (except the worked example). Scientific equivalents may be accepted by a qualified reviewer. Answers are never automatically scored or added to the lesson evidence profile. Submission is not an actual teacher delivery/queue. The scaffolded question is explicitly supported practice; after model exposure a repeat is not fresh independent evidence.

Lessons A/B, their content versions, question contracts and existing progress are unchanged. Entry links are added to the hub and lesson menu. The pilot is not gated by digital completion, but explains its teaching prerequisites.

## Past-paper register: what is and is not verified

The register is limited to AQA Combined Science Trilogy Biology Paper 1 Foundation, 8464/B/1F. It begins with the existing Lesson 1 June 2023 source locator split into three pending references (01.2, 01.3, 01.4), not asserted topic mappings. No exact past-paper match, marks or source availability is newly verified by this implementation. No official question, diagram, mark-scheme or examiner-report text has been imported or processed to populate it.

A teacher can add/edit exact sub-question metadata: series/year, question number, marks, all linked teaching sections, readiness, missing prerequisites/original review note, reviewer and review date. “Ready” requires at least one teaching section. Partial and not-taught records require a knowledge-gap note. Teacher-checked records require marks, reviewer and date; the form requires an explicit source/prerequisite check. They remain user-entered local review claims, not independent source verification. A generated QP/MS URL is not proof of availability or public release. Use the official assessment-resource finder and confirm links before assigning a question. Date range is 2018–2025, not a claim that every series/year has public papers. Duplicate sub-question records are prevented; one record can link several lessons.

The register displays pending and checked records separately and filters ready/partial/not-taught only among checked records. An editable JSON metadata export supports teacher handoff. There is no import, central database, permissions workflow or automatic paper scraping. A complete paper-by-paper mapping remains pending qualified teacher review and any permissions needed for the planned workflow. Past-paper frequencies must not narrow the taught specification.

Official resources: https://www.aqa.org.uk/subjects/science/gcse/science-8464/assessment-resources

Before reproducing official material or putting it into an AI workflow, clear the use with AQA. Do not use secure/unreleased papers. Public accessibility is not a reproduction/AI licence. Policy checked 17 September 2026: https://www.aqa.org.uk/about-us/who-we-are/our-standards/copyright-and-intellectual-property-policy/copyright-policy-for-centres

## Storage and QA

Mapping metadata: `revily:science:exam-map:v1` (shared curriculum metadata for A/B). Pilot: `revily:science:transport-exam-pilot:v1:a` and `:b`. No established lesson record is written. Pilot drafts, locked submissions and model exposure restore independently. Invalid pilot data disables saving to preserve the unreadable record; storage failures are visible. Invalid map data falls back to pending source references; replacing it requires an explicit Save mapping action. No reset/delete operation was added.

`examPreparation.test.ts` adds nine grouped checks: 18 exact A/B targets; pending references; valid source URL format; readiness/reviewer validation; malformed/duplicate records; original pilot marking contracts; gates; full draft/submission/reload/model flow; corrupted snapshot rejection; all 15 local keys distinct. Existing 108 checks continue to protect A/B copy and assessment contracts.

Final QA, 17 September 2026: all 117 checks pass in both the worktree and original port-3000 checkout. TypeScript and the isolated production build pass. Generated build-only config changes were restored; the existing server PID 16178 was retained. Browser verification covered hub/menu entry links; all six lessons and 18 coverage links; an actual B6-13 teaching-target navigation; pending/ready filtering; rejection of a ready mapping with no topic; pending metadata save/reload; the complete four-screen pilot flow; draft reload; locked submissions; model exposure; summary reload; zero Lesson 6 completion awarded; and A's pilot still at its untouched first screen after completing B. Question changes focus the new heading. Narrow-viewport screenshots show readable forms and teaching/practice text with no horizontal overflow. No new browser console errors were recorded during verification. Existing Maths/tutor changes and all A/B lesson content/progress contracts were preserved. No official paper-question match was promoted to teacher-checked during QA.
