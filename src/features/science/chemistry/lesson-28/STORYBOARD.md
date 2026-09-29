# Chemistry Lesson 28 storyboard: Exothermic and endothermic reactions

Chapter C5, Energy changes (new). Folder `chemistry/lesson-28`, id `C-NRG-028-C`, skill `C-ENERGY-CHANGES`. It opens the chapter, so it assumes only the idea of reactants and products.

Big idea: chemicals store energy. In a reaction, the difference between the energy stored in the products and in the reactants moves to or from the surroundings, and the total is conserved. Exothermic reactions give energy out (temperature rises); endothermic reactions take energy in (temperature falls).

Flow note: energy is drawn first as blocks (stored, given out, taken in, conserved) so the two names arrive as labels for ideas already seen. Then the beaker and thermometer link energy to something you can measure. Examples and uses come last, sorted into two columns.

Sections:
1. Start here (C28-01): where a candle's heat comes from.
2. Where does the energy go? (C28-02 to C28-04)
3. Exothermic or endothermic? (C28-05 to C28-07)
4. Examples and uses (C28-08 to C28-10)
5. On your own (C28-11 to C28-15): matching, a numbered bar diagram, temperature data, a conservation misconception, and a written explanation.

Out of scope: measuring energy changes and the polystyrene-cup practical (next lesson); reaction profiles and activation energy (later lesson); bond energies (Higher); physical processes such as freezing and melting (mentioned on the page as a side note, left out to keep one idea per frame).

Source boundary: supplied revision page 132 (scope only). AQA 8464 Chemistry 5.5.1.1. Wording, examples, diagrams and questions are original. Draft pending teacher review.

Judgement calls for the teacher:
- Energy blocks are an illustration of "the difference between stored energies"; they are not a reaction profile and carry no units of joules.
- "Surroundings" is used for everything around the reacting chemicals, including the solution and air.
- Rusting is the oxidation example (the page just says "many oxidation reactions"); the sports pack and hand warmer are described in general terms only.
- C28-11 treats neutralisation as exothermic and thermal decomposition as endothermic, as the page states.

## Diagram plan
`components/ExoEndoVisuals.tsx`, focus prefix `exo-`. Amber blocks = stored energy; coral = energy given out; blue = energy taken in; dashed block = energy that has moved away. Frames: `exo-store`, `exo-gives`, `exo-takes`, `exo-conserve`, `exo-def-exo`, `exo-def-endo`, `exo-def-table`, `exo-ex-exo`, `exo-use-exo`, `exo-ex-endo`, `exo-use-endo`, `exo-sort`. Question visuals: `exo-question-bars` (three numbered bar pairs, no words that give the answer) and `exo-question-data` (temperature table).

## States in full
See `lesson.ts` (15 screens: C28-01 to C28-15) and `teachingFrames.ts`.
