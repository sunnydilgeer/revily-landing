# Chemistry Lesson 36H storyboard — Le Chatelier’s principle

Chapter C6, The rate and extent of chemical change. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). Folder `chemistry/lesson-36h`, id `C-EQM-036H-C`, skill `C-EQM`. Visuals: `components/HigherEquilibriumVisuals.tsx` (focus prefix `hequil-`). It sits after Lesson 36 (reversible reactions and equilibrium, which deliberately stops before Le Chatelier) and before Lesson 37 (hydrocarbons, a new chapter).

Big idea: the position of equilibrium is the mix of reactants and products once the amounts stop changing (lies to the right = more products; to the left = more reactants), and it depends on the conditions. Le Chatelier’s principle: if the conditions change, the system responds to counteract the change. Raising the temperature moves the equilibrium in the endothermic direction, lowering it in the exothermic direction. For gases, raising the pressure moves it to the side with fewer molecules of gas (counted from the balanced equation). Adding a reactant or removing a product moves it to the right.

Flow note: builds on Lesson 36 without re-teaching it: the same sealed flask of A, B, C and D (1 A, 1 B, 3 C, 3 D, as in its equilibrium frame), "more products means going forwards" restated as "lies to the right", opposite energy changes, and heating ammonium chloride, which this lesson now explains. The principle comes first as one three-step routine (what changed → which direction works against it → moves that way), then each condition applies it. Temperature comes before pressure because it reuses exothermic and endothermic; pressure and concentration share one section and one picture (the ammonia equation counted in molecules, over a cylinder of gas), since both are "the system undoes what you did to the amounts".

1. **Start here** (C36H-01): what cooling does to ammonia + hydrogen chloride (more ammonium chloride), the observation the lesson explains.
2. **The system pushes back** (C36H-02–05): flask + equation + position track: position of equilibrium → lies right/left → depends on temperature, pressure (gases), concentration → change pushes in, system counteracts (Le Chatelier) → three steps. Practice: what the principle says; "lies to the left"; what moving to the right does.
3. **Changing the temperature** (C36H-06–09): N₂ + 3H₂ ⇌ 2NH₃ with energy arrows and a thermometer: forward exothermic/backward endothermic → hotter: endothermic direction, left, less NH₃ → cooler: exothermic direction, right, more NH₃ → ammonium chloride (forward endothermic) moves right when heated → two rules. Worked: CO + 2H₂ ⇌ CH₃OH (forward exothermic), temperature raised → left, less methanol. Practice: methane + steam (forward endothermic) heated → right; which change gives more ammonia (cooling).
4. **Pressure and concentration** (C36H-10–14): N₂(g) + 3H₂(g) ⇌ 2NH₃(g) with molecules drawn (4 and 2) over a piston cylinder: count gas molecules → squeeze: to fewer molecules, right (the squeezed cylinder holds 1 N₂ + 5 NH₃, i.e. 1 N₂ + 3 H₂ became 2 NH₃) → add N₂: some used up, right → remove NH₃: more made, right → four rules plus "same number, no effect". Worked: CH₄ + H₂O ⇌ CO + 3H₂ (2 vs 4), pressure raised → left, less hydrogen. Practice: CO + 2H₂ ⇌ CH₃OH pressure raised (3 vs 1, more methanol); N₂ + O₂ ⇌ 2NO (2 vs 2, no effect); more hydrogen pumped into the methanol equilibrium (more methanol).
5. **On your own** (C36H-15–19): molecule picture of 2NO + O₂ ⇌ 2NO₂ (assessment view: molecules and atom key only), pressure raised → right; H₂ + CO₂ ⇌ H₂O + CO (forward endothermic) cooled → less CO (equal molecule numbers as a distractor); data table for X ⇌ Y (% Y rises with temperature) → forward endothermic; extra hydrogen into methane + steam (adding a product) → more methane; written: pressure and temperature changes for more SO₃ in 2SO₂ + O₂ ⇌ 2SO₃ (forward exothermic).

Numbers: C36H-17 table (temperature °C → Y at equilibrium %): 100 → 12, 200 → 27, 300 → 45, 400 → 61 (invented, for a made-up reaction X(g) ⇌ Y(g)). Gas molecule counts: N₂ + 3H₂ 4 | 2NH₃ 2; CO + 2H₂ 3 | CH₃OH 1; CH₄ + H₂O 2 | CO + 3H₂ 4; N₂ + O₂ 2 | 2NO 2; 2NO + O₂ 3 | 2NO₂ 2; H₂ + CO₂ 2 | H₂O + CO 2; 2SO₂ + O₂ 3 | 2SO₃ 2.

Energy directions used (all real): ammonia synthesis exothermic; methanol synthesis exothermic; steam reforming of methane endothermic; H₂ + CO₂ → H₂O + CO (reverse water-gas shift) endothermic; ammonium chloride decomposition endothermic; 2SO₂ + O₂ → 2SO₃ exothermic. Each question states the direction it relies on.

Out of scope: why the conditions change rates, catalysts, compromise conditions and industrial processes (the Haber and Contact processes are not named as processes); equilibrium constants; the effect of a catalyst on equilibrium; solids and liquids in pressure questions; the book's examples, questions, cartoons and jokes.

Source boundary: supplied revision-guide pages 148 (only "position of equilibrium depends on conditions") and 149 (scope only); AQA 8464 Chemistry 5.6.2.4–5.6.2.7 (HT). N₂ + 3H₂ ⇌ 2NH₃ and ammonium chloride are standard examples (ammonium chloride is already in Lesson 36). The book's end-of-page reactions (ethene + steam, N₂O₄ ⇌ 2NO₂, 2CO + O₂ ⇌ 2CO₂) were not used; every other example, the questions, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- "Counteract" is glossed as "work against"; the lesson does not say the change is fully undone.
- Pressure is explained as "fewer gas molecules in the same space give a lower pressure", with no kinetic theory.
- "Adding a product, or removing a reactant, would move it to the left" is stated once (frame) and tested once (C36H-18, extra hydrogen into methane + steam), as a direct use of the principle beyond the two spec cases.
- C36H-17 asks students to infer the energy direction from data (reverse reasoning); the table is for a made-up reaction.
- The written task's model answer raises the pressure and lowers the temperature; rates and cost are deliberately not discussed (they are rejected if used instead of equilibrium reasoning, not if added).

## States in full

(See `lesson.ts` for every state, option, hint and explanation, and `teachingFrames.ts` for every frame.)
