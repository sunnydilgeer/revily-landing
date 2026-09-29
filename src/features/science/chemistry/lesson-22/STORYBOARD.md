# Chemistry Lesson 22 storyboard — Acids, alkalis and pH

Chapter C4, Chemical changes (first lesson of the chapter). Folder `chemistry/lesson-22`, id `C-CHG-022-C`, skills `C-PH-SCALE`, `C-PH-MEASURE`, `C-ACID-BASE-ALKALI`, `C-NEUTRALISATION`. AQA 8464 5.4.2.4 and 5.4.2.2. It assumes only everyday ideas and the idea of ions from the bonding chapter.

Big idea: pH (0 to 14) says how acidic or alkaline a solution is. Acids make H⁺ ions in water, alkalis (bases that dissolve) make OH⁻ ions, and neutralisation is acid + base → salt + water, which for an alkali is H⁺ + OH⁻ → H₂O.

Flow note: the scale comes first because every later idea uses it; measuring comes before the particle explanation so the student can already "see" acidic and alkaline; the ion story then explains why, and neutralisation ends by joining both (ions, and an indicator turning green).

Sections:
1. Start here (C22-01): which everyday liquid is an acid (prior knowledge).
2. The pH scale (C22-02–04): 0 to 14 → below/above 7 and neutral → everyday liquids. Checks: pH 3; most alkaline.
3. Measuring pH (C22-05–07): indicator → universal indicator (wide range) → pH probe and meter. Checks: blue = alkaline; why a probe is more accurate.
4. Acids, bases and alkalis (C22-08–10): H⁺ → base → alkali and OH⁻ → sets diagram. Checks: which beaker is the alkali; copper oxide is a base but not an alkali.
5. Neutralisation (C22-11–13): acid + base → salt + water, products pH 7 → H⁺ + OH⁻ → H₂O → universal indicator end point. Checks: products; which ions react.
6. On your own (C22-14–17): alkaline solutions on a scale; the end-point beaker; four solutions of data; written explanation of ions and the end point.

Out of scope: salt names, metal oxides/carbonates and the salt-making method (next lesson, page 127); acids with metals; strong and weak acids and pH calculations (Higher); titration calculations.
Source boundary: supplied revision-guide page 126 (scope only; the page 126 test questions and cartoon were not used); AQA 8464 5.4.2.2 and 5.4.2.4. All examples, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Universal indicator ranges (red 0–2, orange 3–4, yellow 5–6, green 7, blue 8–10, purple 11–14) are a simplified chart, matching the gradient on the page; real charts vary by brand.
- Everyday pH values (lemon juice 2, vinegar 3, normal rain about 6, pure water 7, hand soap 10, drain cleaner 13) are approximate and labelled so.
- "All alkalis are bases, not all bases are alkalis" is shown with copper oxide and sodium hydroxide; the page only defines the words.
- Beakers show only the ions that matter (no spectator ions or water molecules); the ionic equation is stated with state symbols as on the page.
- C22-16 rejects "dangerous to touch" as beyond the data.

## Diagram plan
`components/AcidVisuals.tsx`, focus prefix `acid-`. The pH strip uses universal-indicator colours; H⁺ coral and OH⁻ blue (Chemistry ion colours); water is a red oxygen with two white hydrogens. Frames: `acid-scale-range/-bands/-examples`, `acid-ind-dye/-universal/-probe`, `acid-h`, `acid-base`, `acid-oh`, `acid-sets`, `acid-neut-word/-ions/-indicator`. Question visuals (assessment hides the words acidic/alkaline/neutral and pH readings that give the answer): `acid-q-ions`, `acid-q-scale`, `acid-q-titre`, `acid-q-data`, and `acid-ind-universal` (a colour key).

## States in full
See `lesson.ts` (17 screens: C22-01 to C22-17) and `teachingFrames.ts`.
