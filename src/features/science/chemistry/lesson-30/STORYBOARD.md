# Chemistry Lesson 30 storyboard — Reaction profiles

Chapter C5, Energy changes. Folder `chemistry/lesson-30`, id `C-NRG-030-C`, skill `C-ENERGY-PROFILES`. It builds on the exothermic and endothermic lesson, which owns the definitions and examples; they are only recapped here.

Big idea: a reaction profile is a graph of energy against progress of reaction. Every reaction has a hump, the activation energy, which must be supplied. Where the line finishes shows the overall energy change: lower products mean energy given out (exothermic), higher products mean energy taken in (endothermic).

Flow note: activation energy comes first because both profile kinds share it. Exothermic comes next because students already know the idea from everyday fires. Endothermic is then the mirror image, and the last frame puts the two side by side. The drawing is rebuilt frame by frame, so students see one picture develop.

Sections:
1. Start here (C30-01): why a gas hob needs a spark.
2. Activation energy (C30-02–04): axes and levels → the hump → bigger hump → heat supplies it.
3. Exothermic profiles (C30-05–07): products lower → the drop is energy given out → the rise at the start → whole profile (the mixture warms while the chemicals lose energy).
4. Endothermic profiles (C30-08–10): products higher → the rise is energy taken in → activation energy again → side by side.
5. On your own (C30-11–15): a numbered arrows diagram, a pair of profiles, two peaks compared, methane burning, and a written description of how to draw the methane profile.

Out of scope: collision theory and the effect of temperature or catalysts on activation energy (later lesson); bond energies and energy-change calculations (Higher); catalysts on profiles.

Source boundary: supplied revision-guide page 134 (scope only); page 135 for question ideas. AQA 8464 Chemistry 5.5.1.2. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The overall energy change is read as the height difference only; no numbers or kJ are used.
- Question 13 states that a profile does not show speed, to avoid a common over-claim.
- The methane equation is used only to say which way round the products sit.

## Diagram plan
- `components/ProfileVisuals.tsx`, focus prefix `profile-`. Colours from `atomPalette`: coral = exothermic, blue = endothermic, amber = activation energy, grey = an unnamed profile.
- Frames: `profile-what`, `-ea`, `-ea-compare`, `-ea-heat`, `-exo-shape`, `-exo-delta`, `-exo-ea`, `-exo-all`, `-endo-shape`, `-endo-delta`, `-endo-all`, `-compare`.
- Question visuals: `profile-q-arrows` (numbered arrows, no words), `profile-q-pair` (two profiles numbered 1 and 2), `profile-q-two` (profiles P and Q).

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
