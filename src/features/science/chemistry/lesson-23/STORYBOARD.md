# Chemistry Lesson 23 storyboard — Reactions of acids and making salts

Chapter C4, Chemical changes. Folder `chemistry/lesson-23`, id `C-CHG-023-C`, skill `C-ACID-SALTS`. It builds on the acids-and-bases lesson (acid + base → salt + water, neutralisation) and on reading formulas and balanced equations.

Big idea: an acid reacting with a metal oxide, hydroxide or carbonate makes a salt. The metal in the base gives the first word of the salt's name and the acid gives the second (chloride, sulfate, nitrate). Carbonates also give water and carbon dioxide. A pure, dry sample of a soluble salt is made from an acid and an insoluble base: react, filter off the excess, crystallise.

Flow note: names come first because every later equation needs them. Oxides and hydroxides come next (salt + water, one balanced equation), then carbonates (one extra product, a gas). The method comes last because it uses everything before it: the choice of reactants needs the naming rule, and "excess base" needs the idea of a base reacting completely. The method is drawn once (four panels of apparatus, steps 1 to 6) and each frame lights the steps it teaches.
1. **Which acid makes which salt?** Swap H for a metal (NaCl from HCl) → acid gives the second word → base gives the first word → put together with a colour-coded word equation (coral metal, blue family).
2. **What do oxides and hydroxides make?** Both are bases → acid + metal oxide (copper chloride) → acid + metal hydroxide (potassium sulfate, with formulas) → CuO + 2HCl → CuCl₂ + H₂O with an atom count and state symbols.
3. **What do carbonates make?** Three products → fizzing = carbon dioxide → calcium sulfate example with formulas.
4. **How do you make a pure, dry salt?** Soluble and insoluble → choose the reactants (same negative ion, same metal) → warm and add base to excess → filter → evaporate some water, cool, filter and dry → whole method.
5. **On your own**: zinc chloride reactants, a numbered method diagram in assessment view, a small data table, magnesium carbonate products, and a written method for magnesium chloride.

Sections:
1. Start here (C23-01): what an acid and a base make.
2. Which acid makes which salt? (C23-02–04)
3. What do oxides and hydroxides make? (C23-05–07)
4. What do carbonates make? (C23-08–10)
5. How do you make a pure, dry salt? (C23-11–14)
6. On your own (C23-15–19)

Out of scope: acids with metals (hydrogen), the reactivity series and displacement (taught later); making salts from an alkali by titration; testing for carbon dioxide; ionic equations and other Higher content; the book's cartoon, jokes and its calcium carbonate and hydrochloric acid exam question (reworded: different carbonates and acids are used).

Source boundary: supplied revision-guide page 127 (scope only). AQA 8464 Chemistry 5.4.2.2 and 5.4.2.3 (preparation of a pure, dry sample of a soluble salt is a required practical). Everything (examples, diagrams, wording) is original except the standard spec examples and the copper oxide / hydrochloric acid equation, which are the usual textbook case. Draft pending teacher review. The lesson prepares students for the practical; it does not replace doing it.

Judgement calls for the teacher:
- "A salt is an acid whose hydrogen has been replaced by a metal" is the Foundation wording; ammonium salts are not mentioned.
- The lesson says the metal comes "from the base"; in the carbonate frames it comes from the carbonate.
- Only insoluble bases are used in the method, so the base can be added in excess and filtered off. Soluble alkalis (sodium hydroxide) are not used to make the salt in the method; the page only asks for insoluble bases.
- Step 4 says "water bath or electric heater" and step 5 "stop heating and leave to cool", as on the page; the diagram shows an evaporating basin over a beaker of hot water.
- Copper hydroxide and copper carbonate are named as insoluble bases; copper carbonate will also fizz.
- The Bunsen burner is turned off after warming the acid, as on the page (the acid is only warmed).

## Diagram plan
- `components/SaltVisuals.tsx`, focus prefix `salt-`. Colours from `atomPalette`: coral tint = metal or hydrogen (positive), blue tint = acid family (negative ion), amber tint = acid, grey = base, white = water and carbon dioxide, amber outline = what the frame is about.
- Naming (`salt-name-what`, `-acid`, `-metal`, `-join`), base cards (`salt-base-types`), word equations with formulas (`salt-eq-oxide`, `-hydroxide`, `-count`), carbonates (`salt-carb-word`, `-fizz`, `-symbols`), reactant choice (`salt-solubility`, `salt-plan`).
- Method diagram (`salt-m-react`, `-filter`, `-crystal`, `-all`): four apparatus panels (warm acid on a tripod; add base with excess at the bottom; filter funnel over a flask; evaporating basin over hot water with crystals, and dried crystals on paper), badges 1 to 6, key list under the drawing; unlit steps fade.
- Question visuals: `salt-question-method` (panels numbered 1 to 4, no words) and `salt-question-data` (data table).

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
