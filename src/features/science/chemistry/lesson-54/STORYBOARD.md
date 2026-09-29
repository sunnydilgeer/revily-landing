# Chemistry Lesson 54 storyboard: Testing and purifying water

Chapter C10, Using resources. Folder `chemistry/lesson-54`, id `C-RES-054-C`, skill `C-WATER-TESTING`, prefix `wtest-`. It owns the tests for pure water (boiling point, pH, dissolved solids by evaporation) and distilling water in the lab. This is preparation for the required practical, not a replacement for doing it. The general distillation idea is recalled from the separation lesson; the previous lesson covered potable water.

Big idea: pure water boils at 100 °C, has pH 7 and leaves no solid behind when evaporated. You can test for each, and distillation separates pure water from dissolved solids by boiling and condensing.

Flow note: the three properties first (so every test has a purpose), then the evaporating basin test in full, because it has a calculation (worked example, guided practice with new numbers, independent item), then the quick pH and boiling point checks, then the distillation apparatus, ending with the whole set-up.

Sections:
1. Start here (C54-01): how to check a sample safely.
2. What is pure water like? (C54-02–04): never taste; three properties; which test for which. Checks: boiling point; pH.
3. How do you test for dissolved solids? (C54-05–07): weigh basin, add sample, heat to dry, cool and weigh, subtract (worked 40.22 − 40.16 = 0.06 g), look in the basin. Checks: why dry; guided 38.47 − 38.40.
4. What about pH and boiling point? (C54-08–10): pH probe or indicator; boiling point 100 °C; reading results. Checks: pH tools; a sample boiling at 102 °C.
5. How is water distilled in the lab? (C54-11–13): why; flask; condenser; collect; whole set-up. Checks: the condenser; where the solids end up.
6. On your own (C54-14–17): mass change 44.10 to 44.58 g; no change in mass; numbered apparatus diagram; written description of distillation.

Out of scope: exact numbers of drops or volumes; boiling point elevation by salt as an explanation; how to draw the apparatus; safety detail beyond "never taste" and the Bunsen note; lab tolerance and repeats.

Source boundary: supplied revision-guide page 163 (scope only); AQA 8464 Chemistry 5.10.1.2 and its required practical. All wording, examples and diagrams are original. The lesson prepares students but never claims the practical is completed online. Draft pending teacher review.

Judgement calls for the teacher:
- "Never taste a sample" is stated once for safety; teacher supervision is implied for Bunsen burner work.
- The 102 °C example shows a non-pure result without explaining why.

## Diagram specs
Soft, rounded, hand-drawn-feeling shapes, gentle tints, as in Lessons 17 and 18. Blue = water. Yellow for flames and heat. Glassware with rounded curves and thin outlines. Text in the SVG at least 12px. "Original schematic, not to scale".

- `wtest-intro`: a beaker of water beside a thermometer, a pH strip and a balance, with a crossed-out mouth or cup labelled "never taste".
- `wtest-three`: three panels: a thermometer at 100 °C "boils at 100 °C"; a pH scale with 7 marked "pH 7: neutral"; a beaker of clear water with no particles "no dissolved solids".
- `wtest-match`: the same three panels each joined by an arrow to a small test picture: evaporating basin (dissolved solids), pH probe (pH), thermometer in boiling water (boiling point).
- `wtest-basin`: an empty evaporating basin on a balance reading 40.16 g. Label "clean, dry evaporating basin".
- `wtest-sample`: the basin with a measuring cylinder pouring in water; label "known volume of sample".
- `wtest-heat`: the basin on a tripod and gauze over a Bunsen burner with steam rising, water level falling in three small stages; label "heat until completely dry".
- `wtest-weigh`: the cooled basin with a thin ring of leftover solid on a balance reading 40.22 g.
- `wtest-change`: a subtraction: "40.22 − 40.16 = 0.06 g" beside the two balance readings, with an arrow "increase: dissolved solids were present".
- `wtest-look`: a close-up of the basin showing a faint ring with a magnifier; label "small amounts may be hard to see".
- `wtest-ph`: a beaker with a pH probe and a meter reading about 7, and a strip of universal indicator paper next to a colour scale (green in the middle for 7). Labels: "pH probe and meter", "universal indicator".
- `wtest-bp`: a beaker of boiling water with a thermometer reading 100 °C and bubbles; label "pure water boils at 100 °C".
- `wtest-results`: a three-row checklist: "solid left behind?", "pH about 7?", "boils at 100 °C?" with tick and cross versions; caption "any failed check: not pure".
- `wtest-why`: a beaker of salty water with salt particles, an arrow to a beaker of clear water (no particles) labelled "pure water", and salt left behind.
- `wtest-flask`: a round-bottomed flask of water over a Bunsen burner with bubbles and steam rising; a thermometer in the neck. Labels: "impure water", "heat until it boils", "solids stay behind".
- `wtest-condenser`: the condenser tube slanting downwards with an outer jacket; "cold water in" at the bottom, "water out" at the top; steam entering and droplets forming. Label "steam cools and condenses".
- `wtest-collect`: the end of the condenser dripping into a beaker; label "pure water collected".
- `wtest-setup`: the whole apparatus: burner, flask, thermometer, condenser with cold-water arrows, beaker. Numbered steps 1 to 4 along the route (heat, steam, condense, collect).
- `wtest-q-basin` (question, assessment view): two balance readings beside an evaporating basin: "before: 44.10 g" and "after: 44.58 g". No conclusions or the word "pure". Description: "An evaporating basin with a balance reading before and after evaporation."
- `wtest-q-apparatus` (question, assessment view): the distillation apparatus with numbered pointers 1 (flask), 2 (condenser), 3 (beaker), 4 (Bunsen burner) and no part names. Description: "Distillation apparatus with four numbered parts."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
