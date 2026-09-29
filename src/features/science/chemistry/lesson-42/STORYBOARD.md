# Chemistry Lesson 42 storyboard — How paper chromatography works

Chapter C8, Chemical analysis. Folder `chemistry/lesson-42`, id `C-ANA-042-C`, skill `C-CHROMA`. Owns the two phases, distribution and reading a chromatogram. The set-up method belongs to the earlier chromatography lesson and is recalled in one clause. Rf values are the next lesson.

Big idea: the solvent (mobile phase) carries chemicals up the paper (stationary phase). A chemical that is more soluble spends more time dissolved and moves further, so different chemicals end up as different spots. The number of spots is the minimum number of chemicals; one spot in many solvents suggests a pure substance.

Flow note: phases first because the how-it-works explanation uses the words, then the movement and distribution, then reading the result, because the reading rules (spots, overlap, solvents) rest on the mechanism.

Sections:
1. Start here (C42-01): ink spot on paper dipped in water.
2. What are the two phases? (C42-02–04): purpose → two phases → mobile (solvent) → stationary (paper). Checks: which is mobile; which is stationary.
3. Why do the spots separate? (C42-05–07): solvent carries them → distribution → more soluble, further up → different distances → separate spots. Checks: very soluble chemical; why different heights.
4. How do you read a chromatogram? (C42-08–10): solvent front → spots are chemicals → counting → overlap → another solvent → one spot in every solvent. Checks: three spots; same distance.
5. On your own (C42-11–15): most soluble spot read from a diagram; one spot in five solvents; why one spot from two chemicals; changing solvent; written explanation of why spots separate.

Out of scope: Rf calculation and reference spots (next lesson); setting up the practical (earlier lesson); other types of chromatography; particle-level bonding explanations.

Source boundary: supplied revision-guide page 149 (scope only); AQA 8464 Chemistry 5.8.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The page's "solvent front is the furthest point reached" is stated; students mark it with a pencil line.
- The phrase "one spot in many solvents suggests pure" is kept as a likelihood, not a proof.

## Diagram specs
Soft, rounded, hand-drawn-feeling shapes, gentle tints, as in Lessons 17 and 18. One chromatography beaker and paper strip drawn once and reused across frames, changing what is highlighted. Text in the SVG at least 12px. Spot colours: pale tints only; use a distinct hue per chemical.

- `chroma-purpose`: a strip with one mixed ink spot, arrow "1 separate", a strip with three spots, arrow "2 identify", then a card matching each spot colour to "chemical A/B/C".
- `chroma-phases`: beaker with paper strip hanging from a rod into shallow solvent, and a two-row key: "mobile phase: molecules can move" and "stationary phase: molecules cannot move" (not yet assigned to parts).
- `chroma-mobile`: same drawing; the solvent and wet paper highlighted with arrows upward; key row 1 active: "the solvent, such as water or ethanol", leader to the solvent.
- `chroma-stationary`: same drawing; paper strip highlighted; key row 2 active: "the paper", leader to the strip.
- `chroma-carry`: the strip with the solvent rising and three small chemical dots being carried, arrows upward at different heights.
- `chroma-distribution`: a magnified patch of paper with one chemical particle shown twice: dissolved in the solvent (moving) and stuck to the paper (still); label "time dissolved = distribution".
- `chroma-soluble`: two strips side by side: a very soluble chemical high up, a less soluble one low down; labels "more soluble: more time dissolved, further up".
- `chroma-different`: one strip with three chemicals at three different heights with distance brackets of different lengths from the baseline.
- `chroma-spots`: before (one mixed spot on the pencil line) → "solvent runs" → after (three separate spots, a dashed ring where the mixture started).
- `chroma-front`: a chromatogram with the pencil baseline, the spots and the solvent front line at the top labelled "solvent front: furthest point reached by the solvent".
- `chroma-gram`: a chromatogram with three spots in different colours, each labelled "chemical A/B/C"; caption "Different spots = different chemicals".
- `chroma-count`: a chromatogram with three spots numbered 1, 2, 3 and a note "3 spots: at least 3 chemicals".
- `chroma-overlap`: a chromatogram with a yellow spot and a pink-purple spot; the lower spot magnified shows pink and purple particles mixed; label "two chemicals, same distance: one spot".
- `chroma-solvents`: the same mixture with two solvents: "solvent A" gives 2 spots (yellow and the pink-purple blend), "solvent B" gives 3 spots (pink, yellow, purple) at different heights.
- `chroma-pure`: a row of five small chromatograms, one per solvent, each with a single spot at different heights; label "one spot every time: likely pure".
- `chroma-q-spots` (question, assessment view): a chromatogram with baseline, solvent front line, and three spots numbered 1, 2, 3 (spot 3 nearest the front, spot 1 nearest the baseline). No labels saying "most soluble". Neutral description: "A chromatogram with three numbered spots between a start line and a solvent front line."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
