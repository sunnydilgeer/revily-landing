# Chemistry Lesson 25 storyboard — Reactions of metals

Chapter C4, Chemical changes. Folder `chemistry/lesson-25`, id `C-CHG-025-C`, skill `C-METAL-REACT`. It builds on salt naming (metal first, acid family second), balanced equations and state symbols from the acids lesson, and on metals forming positive ions.

Big idea: how easily a metal reacts (its reactivity) can be seen in its reactions. Metals react with acids to make a salt and hydrogen, and the more reactive ones react with water to make a metal hydroxide and hydrogen. Faster bubbles or a bigger temperature rise mean a more reactive metal, which is how the reactivity series is worked out. A more reactive metal displaces a less reactive metal from its compound.

Flow note: acids come first because the salt-naming rule is fresh and the gas (hydrogen) is new. Water follows with one parallel equation. Only then can bubbles and temperature be used as evidence, so the ordering section comes third and ends with the series itself. Displacement comes last because it uses the series to make predictions. Test-tube drawings are reused for acid, ordering and the question visual, so students meet the same picture at every stage.
1. **What do metals make with acids?** Acid + metal → salt + hydrogen → two named examples with symbol equations → how fast (magnesium, zinc, iron, copper).
2. **What do metals make with water?** Metal + water → metal hydroxide + hydrogen → calcium with state symbols → which metals react.
3. **How can you order metals?** Bubbles → temperature rise (invented data) → fair test → the reactivity series.
4. **When does one metal push out another?** Iron in copper sulfate → the rule → equation → copper in iron sulfate (no reaction).
5. **On your own**: lithium and water, three tubes (P, Q, R), a results table of three displacement tests, copper in acid, and a written plan to order three metals.

Sections:
1. Start here (C25-01)
2. What do metals make with acids? (C25-02–04)
3. What do metals make with water? (C25-05–07)
4. How can you order metals? (C25-08–10)
5. When does one metal push out another? (C25-11–13)
6. On your own (C25-14–18)

Out of scope: carbon and hydrogen in the reactivity series, oxidation and reduction, extraction by carbon or electrolysis (taught in the neighbouring lessons); ionic equations and half-equations; Higher-tier content.

Source boundary: supplied revision-guide page 129 (scope only). AQA 8464 Chemistry 5.4.1.2 and 5.4.2.1. All examples, data, diagrams and wording are original except the standard textbook cases (calcium and water, iron and copper sulfate). The page's exam questions are not reused: lithium and water and a plan to order magnesium, zinc and iron replace them. Draft pending teacher review.

Judgement calls for the teacher:
- Only metals named on the page (K, Na, Li, Ca, Mg, Zn, Fe, Cu) are used; the series is shown without carbon and hydrogen.
- The temperature data (18, 9 and 4 °C) and the tube bubble counts are invented and schematic.
- Zinc and iron are said not to react with water, as on the page (they react with steam, which is not taught).
- "Cold, dilute acid" is stated for copper, as on the page.
- Potassium and sodium are described as too violent for school; no method is taught for them.

## Diagram plan
`components/MetalReactionVisuals.tsx`, focus prefix `mrx-`. Colours from `atomPalette` as in the salts lesson: coral = metal, amber = acid, blue = acid family in a salt, grey = hydroxide, white = water and hydrogen. Frames: `mrx-acid-word`, `-acid-eq`, `-acid-rate` (four test tubes), `-water-word`, `-water-ca`, `-water-list`, `-order-bubbles`, `-order-temp` (bar chart), `-order-fair`, `-series`, `-disp-what` (nail before and after), `-disp-rule`, `-disp-eq`, `-disp-none`. Question visuals: `mrx-question-tubes` (tubes P, Q, R) and `mrx-question-displace` (results table); neither gives the answer away in words.

## States in full
Read `lesson.ts` and `teachingFrames.ts`; they are the single source for wording, answers and hints.
