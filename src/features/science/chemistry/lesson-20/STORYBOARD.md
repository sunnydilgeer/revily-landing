# Chemistry Lesson 20 storyboard — When mass seems to change

Chapter C3, Quantitative chemistry. Folder `chemistry/lesson-20`, id `C-QNT-020-C`, skill `C-GAS-MASS`. It builds on conservation of mass (the previous lesson) and the particle model of gases.

Big idea: mass is always conserved, but the balance only weighs what is inside the container. In an unsealed container, a gas reactant coming in from the air makes the reading go up, and a gas product escaping makes it go down.

Flow note: the general idea first (a flask on a balance, sealed then open), then one example for each direction, each kept on screen while it is built up: magnesium burning in an open crucible (gas reactant, up), then copper carbonate heated in an open tube (gas product, down; thermal decomposition). Each direction has a worked subtraction and a near-identical guided practice; the independent calculation is the gas-product case.

Sections:
1. Start here (C20-01): where gas particles go in an open beaker.
2. Why can the mass seem to change? (C20-02–03): sealed flask → open flask → the two ways.
3. When a reactant is a gas (C20-04–07): before, burning, after, state-symbol rule. Worked Mg (0.16 g); practice Cu (0.25 g); which equation raises the mass.
4. When a product is a gas (C20-08–11): before, heating (thermal decomposition), after, rule. Worked CuCO₃ (2.2 g); practice ZnCO₃ (1.1 g); why the reading falls.
5. On your own (C20-12–16): data table of three open experiments; independent calculation (1.8 g); numbered two-flask diagram; a "mass is not conserved" claim; written explanation for calcium carbonate.

Wording rules: one new term per frame (unsealed container, thermal decomposition); conservation of mass recalled by topic; British spelling; sentences ≤ 26 words.

Numbers (checked): 2Mg + O₂ → 2MgO, 0.24 g Mg → 0.40 g MgO, so 25.24 → 25.40 g (0.16 g O). CuCO₃ (123.5) → CuO (79.5) + CO₂ (44): 6.2 g → 4.0 g + 2.2 g. ZnCO₃ 3.0 g → about 1.9 g ZnO (1.95 g rounded down) + 1.1 g CO₂. Copper 22.40 → 22.65 g (0.25 g O, illustrative). Independent: 5.0 − 3.2 = 1.8 g (distractors 8.2 sum, 3.2, 2.2 from the worked example).

Out of scope: the Higher-only moles work; the method for finding a missing mass from a whole equation (previous lesson); acid + carbonate reactions and metal + acid (later chemical-changes lessons; only a reaction with all-aqueous species appears as a no-gas comparison); the book's specific questions, cartoon and jokes.

Source boundary: supplied revision-guide page 123 (scope only; the page's worked example on masses of reactants and products and its questions were not used); AQA 8464 Chemistry 5.3.1.3. All examples, numbers and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The balance reading in the copper carbonate scenes ignores the mass of the tube, stated in the worked example.
- Gas is "weighed once it is part of a solid": a simplification of "the mass of the gas was not being measured".
- Zinc carbonate 3.0 g → 1.9 g uses a rounded value.
- The sealed flask with a tight bung is shown without any pressure warning; the diagram is a schematic.

## Diagram plan
`components/GasMassVisuals.tsx`, focus prefix `gasmass-`. Balance with a digital reading, conical flask, crucible and test tube; oxygen molecules in soft red, carbon dioxide as O–C–O; amber marks the focus.
- General idea: `gasmass-rule`, `gasmass-open`, `gasmass-two`.
- Magnesium: `gasmass-mg-before`, `-during`, `-after`, `-rule`; worked set-up `gasmass-worked-mg`.
- Copper carbonate: `gasmass-cu-before`, `-during`, `-after`, `-rule`; worked set-up `gasmass-worked-cu`.
- Question visuals: `gasmass-data` (table) and `gasmass-question-flasks` (numbered flasks; the escaping gas is drawn only outside assessment view).

## States
C20-01 choice (diagnostic) · C20-02 teach ×3 · C20-03 choice · C20-04 teach ×4 · C20-05 worked · C20-06 choice (calculation) · C20-07 choice · C20-08 teach ×4 · C20-09 worked · C20-10 choice (calculation) · C20-11 choice · C20-12 independent data · C20-13 independent calculation · C20-14 independent diagram · C20-15 independent claim · C20-16 written. Full wording is in `lesson.ts` and `teachingFrames.ts`.
