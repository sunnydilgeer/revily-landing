# Teaching-copy pass: Science Lessons 1–6

17 September 2026. Editorial pass on the existing AQA 8464 Foundation drafts, not an assessment redesign or teacher approval.

## Writing standard

Start with the idea in everyday language, then name the scientific term. Explain the mechanism rather than merely stating a fact. Use explicit subjects and verbs. For adaptations, connect feature → effect → function. For calculations, explain why a step is needed as well as showing it. Introduce the main idea before misconceptions and qualifications, while retaining scientifically important limits and practical safety advice.

The supplied CGP scans are references for these teaching principles, not instructions or reusable source copy. No CGP wording, illustrations or jokes have been reproduced. Existing clear questions were reviewed and retained; this is not a mechanical rewrite of every sentence.

## Coverage

All 56 walkthroughs (155 frames), standalone teaching and worked examples, all question prompts/options/hints/explanations, written-task guidance and relevant visual keys/captions were reviewed. Scripts are generated from the displayed frames, so the script fallback receives the same update.

| Lesson | Main improvements |
| --- | --- |
| 1 — Cells | Cell function means job; DNA, protein synthesis and cell sap explained; shared structures before category names; paired comparisons; observation versus textbook model; size and area reasoning. |
| 2 — Microscopy | Specimen, slide and lens jobs introduced; close points versus a merged patch makes resolution concrete; why units match, when to multiply/divide and how to check units. |
| 3 — Practical | Equipment names explained; thin tissue → light passes through → clearer cells; stain → contrast; coverslip → air escapes; safe focusing; real observation, scale and drawing enlargement separated. |
| 4 — Specialisation | Cell job first; each feature connected to how it helps; axon, contraction, lignin and pores explained; differentiation and animal/plant timing written directly. |
| 5 — Division/stem cells | Chromosome → DNA → gene relationship; replication means copying; copying explains complete daughter sets; daughter cells, self-renewal, bone marrow, meristems and clones explained; benefits, medical risks and ethical objections separated. |
| 6 — Transport | Concentration and gradient explained before use; random motion → net movement; dilute/concentrated and partially permeable defined; outside/inside comparison drives tissue predictions; energy and gradient direction separated; area/volume reasoning, exchange adaptations, controls, percentages, graphs and rates made explicit. |

## Research basis and scope

The earlier public-page review informed the approach: [Seneca sperm-cell notes](https://senecalearning.com/en-GB/revision-notes/gcse/biology/aqa/higher/1-1-16-sperm-cells) connect adaptations to jobs; [Save My Exams diffusion notes](https://www.savemyexams.com/gcse/biology/aqa/18/revision-notes/1-cell-biology/1-3-transport-in-cells/1-3-1-diffusion/) combine definitions and explanations; [Oak's particle-diffusion lesson](https://www.thenational.academy/teachers/programmes/science-secondary-ks3/units/diffusion/lessons/diffusion-moving-particles) provides vocabulary and misconception prompts. These are writing/structure references, not proof of learning effectiveness. Public samples do not represent whole paid courses. Higher-tier or KS3 examples do not widen this course's scope; the [AQA 8464 Biology specification](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content) and existing alignment documents govern it.

## Compatibility and verification

No changes to lesson/state/option IDs, ordering, correct-answer keys, question targets, marks, rubrics, evidence dimensions/roles, requirements, prerequisites, content versions or storage keys. This editorial update retains the existing practice records rather than resetting them. Written work remains saved pending teacher judgement; digital practice does not certify hands-on practical completion. No account/mastery integration, Maths changes or deployment.

- `npm run test:science`: 81 grouped checks pass (the previous 62 plus 19 copy checks).
- `teachingCopy.test.ts`: six SHA-256 assessment-contract fingerprints captured before editing remain identical; all walkthrough scripts match the displayed frames; all 155 frames render their copy through the real teaching component; required copy is present and authoring-only caveats do not leak into explanations.
- Existing tests still cover every choice option, numerical answers, session flow, hints, locked submissions, draft/reload behaviour and pending written work. Two practical-test wording assertions were updated to their equivalent clearer wording, retaining the same safety/observation requirements.
- `npx tsc --noEmit --incremental false`: passes.
- Isolated production build: passes, 21 pages generated. Next's non-fatal multiple-lockfile warning remains. Generated TypeScript configuration changes were restored.

The incremental copy-only patch was conflict-checked and applied to the original checkout serving localhost:3000. The same 81 checks pass there. Browser verification checked the six-lesson hub, revised question wording, representative teaching in each lesson, the matching script fallback, root-hair cause/effect, DNA replication, osmosis diagrams and all percentage-example steps. The osmosis copy was also visually checked at the existing narrow viewport and remained readable; the temporary viewport override was reset. No answers were submitted or practice history cleared during browser checks. Teacher review and learner comprehension testing remain outstanding; automated checks do not establish teaching effectiveness.
