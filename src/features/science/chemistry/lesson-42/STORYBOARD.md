# Chemistry Lesson 42 storyboard — How paper chromatography works

Chapter C8, Chemical analysis. Folder `chemistry/lesson-42`, id `C-ANA-042-C`, skill `C-CHROMA`. Owns the two phases, distribution and reading a chromatogram. The set-up method belongs to the earlier chromatography lesson and is recalled in one clause. Rf values are the next lesson.

Big idea: the solvent (mobile phase) carries chemicals up the paper (stationary phase). A chemical that is more soluble spends more time dissolved and moves further, so different chemicals end up as different spots. The number of spots is the minimum number of chemicals; one spot in many solvents suggests a pure substance.

Flow note: phases first because the how-it-works explanation uses the words, then the movement and distribution, then reading the result, because the reading rules (spots, overlap, solvents) rest on the mechanism.

Sections:
1. Start here (C42-01): ink spot on paper dipped in water.
2. What are the two phases? (C42-02–04): purpose → two phases → mobile (solvent) → stationary (paper). Checks: which is mobile; which is stationary.
3. Why do the spots separate? (C42-05–07): solvent carries them → distribution → more soluble, further up → different distances → separate spots. Checks: very soluble chemical; why different heights.
4. How do you read a chromatogram? (C42-09–11): solvent front → spots are chemicals → counting → overlap → another solvent → one spot in every solvent. Checks: three spots; same distance.
5. On your own (C42-12–16): most soluble spot read from a diagram; one spot in five solvents; why one spot from two chemicals; changing solvent; written explanation of why spots separate.

Out of scope: Rf calculation and reference spots (next lesson); setting up the practical (earlier lesson); other types of chromatography; particle-level bonding explanations.

Source boundary: supplied revision-guide page 149 (scope only); AQA 8464 Chemistry 5.8.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The page's "solvent front is the furthest point reached" is stated; students mark it with a pencil line.
- The phrase "one spot in many solvents suggests pure" is kept as a likelihood, not a proof.

## Diagram specs
Soft, rounded, hand-drawn-feeling shapes, gentle tints, as in Lessons 17 and 18. One chromatography beaker and paper strip drawn once and reused across frames, changing what is highlighted. Text in the SVG at least 12px. Spot colours: pale tints only; use a distinct hue per chemical.

- `chroma-purpose`: a mixed ink spot on a strip turning into separate coloured spots; labels "separate" and "identify".
- `chroma-phases`: beaker with paper strip and solvent, two bracket labels: "mobile phase" and "stationary phase" (bracket shapes, not yet assigned).
- `chroma-mobile`: same drawing, the solvent (blue, water tint) highlighted with small arrows upward; label "mobile phase: solvent (water or ethanol), molecules can move".
- `chroma-stationary`: same drawing, paper strip highlighted; label "stationary phase: paper, molecules cannot move".
- `chroma-carry`: the strip with the solvent rising and three small chemical dots being carried, arrows upward at different heights.
- `chroma-distribution`: a magnified patch of paper with one chemical particle shown twice: dissolved in the solvent (moving) and stuck to the paper (still); label "time dissolved = distribution".
- `chroma-soluble`: two strips side by side: a very soluble chemical high up, a less soluble one low down; labels "more soluble: more time dissolved, further up".
- `chroma-different`: one strip with three chemicals at three different heights with distance brackets of different lengths from the baseline.
- `chroma-spots`: the finished strip: one mixed spot on the baseline becomes three separate spots, arrows showing each chemical's path.
- `chroma-front`: a chromatogram with the pencil baseline, the spots and the solvent front line at the top labelled "solvent front: furthest point reached by the solvent".
- `chroma-gram`: a chromatogram with three spots in different colours; pointers "different spots = different chemicals".
- `chroma-count`: a chromatogram with three spots numbered 1, 2, 3 and a note "3 spots: at least 3 chemicals".
- `chroma-overlap`: two chemicals drawn as small blobs at the same height merging into one spot; label "same distance: one spot".
- `chroma-solvents`: two chromatograms of the same mixture side by side: "solvent A" and "solvent B" with spots at different heights and a different number of spots.
- `chroma-pure`: a row of five small chromatograms, one per solvent, each with a single spot at different heights; label "one spot every time: likely pure".
- `chroma-q-spots` (question, assessment view): a chromatogram with baseline, solvent front line, and three spots numbered 1, 2, 3 (spot 3 nearest the front, spot 1 nearest the baseline). No labels saying "most soluble". Neutral description: "A chromatogram with three numbered spots between a start line and a solvent front line."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
