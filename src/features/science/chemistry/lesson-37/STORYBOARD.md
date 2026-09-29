# Chemistry Lesson 37 storyboard: Hydrocarbons and alkanes

Chapter C7, Organic chemistry (first lesson of the chapter). Folder `chemistry/lesson-37`, id `C-ORG-037-C`, skill `C-HYDROCARBONS`. It builds on covalent bonding (single bonds, shared electrons) and on writing and balancing equations from the earlier lessons.

Big idea: hydrocarbons contain only carbon and hydrogen. In the alkanes every bond is single, every carbon forms four bonds, and the atoms follow CₙH₂ₙ₊₂. Burning a hydrocarbon in plenty of oxygen gives carbon dioxide and water and releases energy (oxidation), and the equation is balanced carbon, hydrogen, oxygen.

Flow note: each idea needs the one before it. Hydrocarbon and displayed formula first (the four drawings stay on screen), then the formula rule is read from those four drawings, then combustion (uses the formulae), then balancing with one worked example, propane, so the guided and independent items use new molecules.
1. **What is a hydrocarbon?** (C37-02, frames: hydro-hc, hydro-displayed, hydro-alkane, hydro-four) then C37-03, 04, 05.
2. **What is the formula of an alkane?** (C37-06, 3 frames: count, rule, use) then C37-07 (n = 6), C37-08.
3. **What happens when a hydrocarbon burns?** (C37-09, 3 frames) then C37-10, C37-11.
4. **How do you balance the equation?** (C37-12, 4 frames, propane C, H, O) then C37-13 (methane), C37-14 (two propane).
5. **On your own** (C37-15–18): three displayed formulae, one not a hydrocarbon; alkane with 9 carbon atoms; spot the unbalanced oxygen; written task on ethane.

Sections:
1. Start here (C37-01): a camping gas made only of carbon and hydrogen.
2. What is a hydrocarbon? (C37-02–05)
3. What is the formula of an alkane? (C37-06–08)
4. What happens when a hydrocarbon burns? (C37-09–11)
5. How do you balance the equation? (C37-12–14)
6. On your own (C37-15–18)

Answer positions: 0 x3, 1 x4, 2 x3, 3 x3 across 13 choices.

Out of scope: naming alkanes beyond butane, alkenes and cracking (later lessons), incomplete combustion, isomers, structural formulae, Higher-tier equations with fractions, the book's cartoons, jokes and its exam question (only the idea of writing an equation for ethane is used, in a new written task with a new rubric).

Source boundary: supplied revision-guide page 144 (scope only). AQA 8464 Chemistry 5.7.1.1 and 5.7.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Oxidation is only "gain of oxygen" here, as on the page.
- The written task accepts only whole-number coefficients (2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O).
- The formula rule is derived from counting the first four alkanes, not memorised as a bare fact.

## Diagram specs (diagram worker: `components/HydrocarbonVisuals.tsx`, prefix `hydro-`)
House style: Chemistry lessons, `atomPalette`; organic, soft, hand-drawn-feeling. Atom colour code in these drawings: carbon = grey-charcoal soft disc labelled C, hydrogen = pale disc labelled H, oxygen = coral disc labelled O (same in every frame). Displayed formulae: letters with straight bond lines (single lines only), drawn as text-and-line, not 3D. Neutral captions "original schematic".
Frames:
- `hydro-hc`: a small carbon atom and a hydrogen atom joined into a molecule tray on the left ("carbon" + "hydrogen") and a soft label "hydrocarbon: carbon and hydrogen only". Show a methane molecule as ball-and-stick with a tick, and a molecule with an O atom with a cross ("not a hydrocarbon").
- `hydro-displayed`: methane. Ball-and-stick on the left and displayed formula (H above, below, left and right of C, single lines) on the right, arrow between. Labels: "each line = one single covalent bond", name "methane, CH₄".
- `hydro-alkane`: methane displayed formula with the four bonds numbered 1 to 4 (numbered dots on each line); label "4 single bonds from each C". A ghost ethane beside it with C–C bond highlighted "C–C is single too".
- `hydro-four`: 2 x 2 grid: methane CH₄, ethane C₂H₆, propane C₃H₈, butane C₄H₁₀ displayed formulae with names. Numbers of carbons labelled 1, 2, 3, 4. This four-drawing set is reused as the base of the next frames.
- `hydro-count`: the four drawings shrunk with a table beside them: name, carbon atoms, hydrogen atoms (1/4, 2/6, 3/8, 4/10).
- `hydro-formula`: the table, plus an arrow from carbon count "n" to hydrogen count "2n + 2", and the big formula "CₙH₂ₙ₊₂" and legend "n = number of carbon atoms".
- `hydro-formula-use`: worked example n = 3: "n = 3, H = 2 × 3 + 2 = 8, so C₃H₈" beside the propane displayed formula.
- `hydro-comb-word`: word equation strip on a soft banner: "hydrocarbon + oxygen → carbon dioxide + water (+ energy)" with a small flame; "plenty of oxygen" tag.
- `hydro-oxidation`: methane on the left, arrows to CO₂ and H₂O on the right; the oxygen atoms picked up highlighted in coral. Caption "gains oxygen = oxidised".
- `hydro-comb-fuel`: a camping stove or gas ring flame with small labels "CO₂" and "H₂O vapour" leaving and a heat wave labelled "energy released".
- `hydro-bal-1`: "C₃H₈ + O₂ → CO₂ + H₂O" (unbalanced) with propane displayed formula; small note "write the formulae first".
- `hydro-bal-2`: "C₃H₈ + O₂ → 3CO₂ + H₂O" with the carbon atoms counted (3 | 3) and the 3 highlighted.
- `hydro-bal-3`: "C₃H₈ + O₂ → 3CO₂ + 4H₂O", hydrogen counted (8 | 8), the 4 highlighted.
- `hydro-bal-4`: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O" with an atom count table C 3|3, H 8|8, O 10|10 and ticks.
Question visuals (assessment view: no names or formulae, numbers only):
- `hydro-q-three`: three displayed formulae numbered 1, 2, 3. 1 = ethane, 2 = ethanol-like molecule with one O atom (H–C–C–O–H skeleton with all H), 3 = propane. No names, no formulae, no "hydrocarbon" wording; the O is drawn like the other letters. Answer = 2.
