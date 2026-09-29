# Chemistry Lesson 2 storyboard — Compounds and chemical equations

Chapter C1a, Atoms, elements, compounds and mixtures. Folder `chemistry/lesson-2`, id `C-ATM-002-C`, skill `C-COMPOUNDS-EQUATIONS`. It follows *Atoms, elements and isotopes* (atoms, elements and chemical symbols) and hands on to mixtures.

Big idea: in a chemical reaction atoms are rearranged into at least one new substance. Atoms of different elements join by chemical bonds in fixed proportions to make compounds, a formula records which atoms and how many, and an equation must show the same atoms on both sides, so we balance it with numbers in front and never by changing a formula.

Flow note: the lesson follows one compound, water, until "compound" is secure, then reads formulas, then writes one reaction (hydrogen + chlorine → hydrogen chloride) first in words and then in symbols, and finally balances that same equation. Each step needs the one before it.
1. **What is a compound?** A reaction making a new substance (water from hydrogen and oxygen, with an energy change) comes first, because a compound is made by a reaction and can only be split by one. The same water molecule is then used for "compound", "fixed proportions" and "chemical bonds", and splitting closes the loop.
2. **What does a formula tell you?** Formulas need "compound" and "fixed proportions". CO₂ introduces symbols, then its small 2; pairs (O₂ …) introduce "molecule", which the balancing section needs; brackets come last because they combine both ideas. A handful of common formulas is shown once, lightly.
3. **How do you write a reaction?** Word equation, reactants, products, then the symbol equation H₂ + Cl₂ → HCl, left deliberately unbalanced so that the next section has a reason to exist.
4. **How do you balance an equation?** Atoms are not made or lost, so counts must match; a number in front (2HCl) fixes it; changing a formula (H₂Cl₂) is wrong; the three-step method. Then the calculation route: worked example (N₂ + H₂ → NH₃, two numbers needed) → near-identical guided practice (N₂ + O₂ → NO₂, same two-step shape) → independent balancing in On your own (C + O₂ → CO, dimension `calculation`).
5. **On your own** applies every idea to something new: numbered particles (N₂, NH₃, Ar) in assessment view, Al(OH)₃, balancing carbon monoxide, spotting the one balanced equation, and a written task correcting a changed formula (Li + Cl₂ → LiCl).

Sections:
1. Start here (C2-01): a rusty nail — rust is a new substance (everyday prior knowledge; sets up "reaction makes a new substance").
2. What is a compound? (C2-02–04): new substance + energy change (chemical reaction) → compound → fixed proportions (2 H : 1 O) → chemical bonds → split only by a reaction → put it together. Checks: definition of a compound; how to split water.
3. What does a formula tell you? (C2-05–07): formula (CO₂) → small numbers → pairs and "molecule" (O₂, H₂, N₂, Cl₂) → brackets (Mg(OH)₂, 5 atoms) → six common formulas. Checks: atoms in propane C₃H₈ (11); atoms in Cu(OH)₂.
4. How do you write a reaction? (C2-08–10): word equation → reactants → products → symbol equation (H₂ + Cl₂ → HCl, not balanced yet). Checks: zinc + sulfur word equation; products of calcium + water.
5. How do you balance an equation? (C2-11–14): same atoms both sides (balanced) → 2HCl → never change a formula → method; worked N₂ + 3H₂ → 2NH₃; practice N₂ + 2O₂ → 2NO₂; which change is allowed (2H₂O).
6. On your own (C2-15–19): which particle is a compound; oxygen atoms in Al(OH)₃; balance C + O₂ → CO; which equation is balanced (S + O₂ → SO₂); written: correct LiCl₂ and balance 2Li + Cl₂ → 2LiCl.

Wording rules: one new term per frame (chemical reaction, compound, fixed proportions, chemical bonds, formula, molecule, word equation, reactants, products, symbol equation, balanced), plain meaning first; the previous lesson is referred to by topic only; British spelling; the energy change is kept to "gets hot / a temperature change".

Out of scope: ionic and covalent bonding (types of compound and how bonds form — later chapters); state symbols; relative formula mass and moles; half equations and ionic equations; Higher-tier content; how water is actually split (electrolysis is not named); the book's cartoons, jokes, worked examples (methane combustion, sulfuric acid + sodium hydroxide) and exam questions (Na₂CO₃, Al₂(SO₄)₃, Fe + Cl₂, water splitting).

Source boundary: supplied revision-guide pages 94–95 (scope only); AQA 8464 Chemistry 5.1.1.1. All examples (water, hydrogen chloride, CO₂ and Mg(OH)₂ formula frames, ammonia, nitrogen dioxide, carbon monoxide, lithium chloride, propane, copper and aluminium hydroxide, zinc sulfide, calcium + water, rusting), all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: all balanced examples are simple molecular reactions so "molecule" is accurate; sodium chloride appears only as a formula tile (it is ionic, so it is never drawn as a molecule), and Mg(OH)₂ is drawn as separate Mg and OH pieces with no bond to magnesium. Balls-and-sticks are schematic: one line per bond whatever the bond order (O₂, N₂ and CO₂ bonds are really double or triple). Water is split "only by a chemical reaction" as the page says, without naming electrolysis. "Energy change" is illustrated only as getting hot (hydrogen and oxygen react exothermically). Carbon is drawn as a single atom in C + O₂ → CO. C2-17 uses a two-step balance (2C + O₂ → 2CO) as the independent item, which mirrors the guided practice in shape.

## Diagram plan
- `components/CompoundVisuals.tsx`, focus prefix `cmpd-`, routed by `CellBiologyVisuals.tsx`. Ink, muted text and panels come from `atomPalette` (AtomVisuals.tsx). Atoms are balls with their symbol inside, one colour per element for all of Chemistry: H white, C dark grey, O soft red, N blue, Cl green, S yellow, Mg teal, Ar lilac; bonds are short grey sticks. Amber marks what has just changed; green ✓ = counts match, red ✗ = they do not.
- **Compound walkthrough** (`cmpd-compound-*`): numbered key on the right (new substance, compound, fixed proportions, chemical bonds, split only by a reaction), highlighted one step per frame: before/after boxes (4 H₂ + 2 O₂ → 4 H₂O, "gets hot"); one enlarged water molecule; three water molecules (tap, river, cloud) each 2 H : 1 O; the same molecule with bonds in amber; boil → steam (still water) vs react → hydrogen + oxygen; put it together.
- **Formulas** (`cmpd-formula-*`): CO₂ with labelled symbols over its molecule, then the same with the small 2 boxed; four element pairs (O₂, H₂, N₂, Cl₂) and "molecule"; Mg(OH)₂ with the bracket doubled and a count table (1 + 2 + 2 = 5); six formula tiles.
- **Equations** (`cmpd-equation-*`): one drawing, hydrogen + chlorine → hydrogen chloride with a molecule under each name; reactants then product highlighted; the symbol equation added below with its (unequal) atom counts.
- **Balancing** (`cmpd-balance-*`): a shared `BalanceEquation` that draws the equation, one molecule per coefficient (2HCl = two HCl molecules) and a left/right atom-count table with ✓/✗, recomputed from the molecules; wrong (H₂Cl₂ crossed out) vs right (2HCl); the three-step method; the ammonia worked example as three rows whose counts change as 2 and then 3 are added; the unbalanced N₂ + O₂ → NO₂ start for C2-13.
- **Questions** (`cmpd-question-*`): three numbered particles (N₂, NH₃, Ar) with names only outside assessment view; the unbalanced C + O₂ → CO start with its counts (the starting state only, no answer).

## States in full

### C2-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** An iron nail left outside turns rusty. What is the rust?
- 0 Iron that has only changed colour · **1 A new substance made from iron and substances in the air ✓** · 2 Dirt that has stuck to the iron
- Hint: Could you rub the rust straight back into shiny iron?
- Explanation: Iron reacts with oxygen and water from the air. So rust is a new substance, with different properties from iron.

### C2-02 · teach "What is a compound?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| New substances | A chemical reaction makes at least one new substance. | reaction → new substance, often an energy change | Hydrogen and oxygen are both gases. When they react, they make water, which is a completely new substance. The mixture also gets hot, so there is an energy change. A change that makes at least one new substance is called a chemical reaction. | `cmpd-compound-new` |
| Compounds | Atoms of different elements can join together. | atoms of two or more elements joined → compound | Look closely at one particle of water. It has 2 hydrogen atoms and 1 oxygen atom, joined together. A substance made of atoms of two or more different elements, chemically joined, is called a compound. So water is a compound, but hydrogen and oxygen are elements. | `cmpd-compound-compound` |
| Fixed proportions | A compound always has the same amounts of each element. | water: always 2 H for every 1 O | Every water particle has 2 hydrogen atoms for every 1 oxygen atom. Water from a tap, a river or a cloud is just the same. The amounts of each element in a compound never change. We say the elements are in fixed proportions. | `cmpd-compound-fixed` |
| Chemical bonds | The atoms in a compound are held together. | atoms held together → chemical bonds | The atoms in a compound do not just sit side by side. Strong forces hold them together. These forces are called chemical bonds. In the drawings, each bond is a short line joining two atoms. | `cmpd-compound-bonds` |
| Splitting a compound | Only a chemical reaction can split a compound into its elements. | compound → elements only by a reaction | Boiling water only turns it into steam, which is still water. Filtering it does not split it either. The chemical bonds hold the atoms together. So the only way to separate a compound into its elements is by another chemical reaction. | `cmpd-compound-split` |
| Put it together | A compound: two or more elements, fixed proportions, held by bonds. | reaction → compound → bonds → reaction to split | Water is a compound made in a chemical reaction. It contains hydrogen and oxygen atoms in fixed proportions, 2 to 1. Chemical bonds hold its atoms together. So only another chemical reaction can split it back into hydrogen and oxygen. | `cmpd-compound-all` |

### C2-03 · choice · `understanding, guided, practice`
**Q:** Which of these describes a compound?
- 0 A substance made of only one kind of atom · **1 Two or more elements chemically combined in fixed proportions ✓** · 2 Two elements mixed together but not joined · 3 Atoms that all have the same number of protons
- Hint: How many elements, and are their atoms joined?
- Explanation: A compound contains atoms of two or more different elements. The atoms are chemically joined by bonds, always in the same fixed proportions.

### C2-04 · choice · `understanding, guided, practice`
**Q:** How could you split water into hydrogen and oxygen?
- 0 Boil it · 1 Filter it · **2 Use a chemical reaction ✓**
- Hint: Can boiling or filtering break chemical bonds?
- Explanation: Boiling only turns water into steam, and filtering leaves it as water. The atoms are held by chemical bonds, so only a chemical reaction can split water into its elements.

### C2-05 · teach "What does a formula tell you?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A formula | Symbols show which elements are in a compound. | symbols → which elements | Carbon dioxide is a compound of carbon and oxygen. We can write it as CO₂. The symbols C and O show which elements it contains. A short way of writing a substance using symbols is called its formula. | `cmpd-formula-symbols` |
| Small numbers | A small number counts the atoms of the element just before it. | small number after a symbol → how many of that atom | In CO₂, the small 2 comes after the O. It means there are 2 oxygen atoms. There is no number after the C, so there is just 1 carbon atom. A small number only counts the symbol just before it. | `cmpd-formula-number` |
| Elements in pairs | Some elements are made of pairs of joined atoms. | O₂, H₂, N₂, Cl₂ → pairs of the same atom | Oxygen gas is made of pairs of oxygen atoms joined together, so we write it as O₂. A particle made of atoms joined together is called a molecule. Hydrogen (H₂), nitrogen (N₂) and chlorine (Cl₂) also go around in pairs. They are still elements, because each molecule has only one kind of atom. | `cmpd-formula-pairs` |
| Brackets | A number after a bracket multiplies everything inside it. | Mg(OH)₂ → 2 × everything in the bracket | Magnesium hydroxide is written Mg(OH)₂. The small 2 after the bracket doubles everything inside it. So there are 2 oxygen atoms and 2 hydrogen atoms. Mg is outside the bracket, so there is 1 magnesium atom. That makes 5 atoms altogether. | `cmpd-formula-brackets` |
| Formulas worth knowing | A few formulas come up again and again. | H₂O, CO₂, NaCl, HCl, NH₃, CH₄ | Water is H₂O and carbon dioxide is CO₂. Sodium chloride, or table salt, is NaCl. Hydrogen chloride is HCl and ammonia is NH₃. Methane, the gas used in cookers, is CH₄. You can count the atoms in each one using the small numbers. | `cmpd-formula-common` |

### C2-06 · choice · `application, guided, practice`
**Q:** Propane, a camping gas, has the formula C₃H₈. How many atoms are in one molecule?
- 0 3 · 1 8 · **2 11 ✓** · 3 24
- Hint: What does each small number count?
- Explanation: C₃ means 3 carbon atoms and H₈ means 8 hydrogen atoms. So one molecule has 3 + 8 = 11 atoms.

### C2-07 · choice · `application, guided, practice`
**Q:** Copper hydroxide has the formula Cu(OH)₂. How many atoms of each element does it show?
- **0 1 Cu, 2 O, 2 H ✓** · 1 1 Cu, 1 O, 2 H · 2 2 Cu, 2 O, 2 H · 3 1 Cu, 2 O, 1 H
- Hint: Which atoms are inside the bracket?
- Explanation: Cu is outside the bracket, so there is 1 copper atom. The 2 after the bracket doubles O and H, so there are 2 oxygen atoms and 2 hydrogen atoms.

### C2-08 · teach "How do you write a reaction?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Word equations | A word equation names what reacts and what is made. | names + arrow = react to make | Hydrogen reacts with chlorine to make hydrogen chloride. We can write this as hydrogen + chlorine → hydrogen chloride. The arrow means “react to make”. A reaction written with the names of the chemicals is called a word equation. | `cmpd-equation-word` |
| Reactants | The chemicals you start with go on the left. | left of the arrow → reactants | Hydrogen and chlorine are on the left of the arrow. They are the chemicals that react with each other. The substances you start with in a reaction are called reactants. | `cmpd-equation-reactants` |
| Products | The new substances go on the right. | right of the arrow → products | Hydrogen chloride is on the right of the arrow. It is the new substance made in the reaction. The substances made in a reaction are called products. A plus sign goes between two reactants or two products. | `cmpd-equation-products` |
| Symbol equations | Formulas can take the place of the names. | names → formulas | Now swap each name for its formula: H₂ for hydrogen, Cl₂ for chlorine and HCl for hydrogen chloride. The reaction becomes H₂ + Cl₂ → HCl. An equation written with formulas is called a symbol equation. Count the atoms on each side: they do not match yet, and you will fix that next. | `cmpd-equation-symbol` |

### C2-09 · choice · `understanding, guided, practice`
**Q:** Zinc reacts with sulfur to make zinc sulfide. Which is the word equation?
- 0 zinc sulfide → zinc + sulfur · **1 zinc + sulfur → zinc sulfide ✓** · 2 zinc + zinc sulfide → sulfur
- Hint: Which substances do you start with?
- Explanation: Zinc and sulfur are the reactants, so they go on the left of the arrow. Zinc sulfide is the product, so it goes on the right.

### C2-10 · choice · `understanding, guided, practice`
**Q:** calcium + water → calcium hydroxide + hydrogen. Which are the products?
- **0 Calcium hydroxide and hydrogen ✓** · 1 Calcium and water · 2 Calcium and hydrogen
- Hint: Which side of the arrow are the products on?
- Explanation: Calcium and water are on the left, so they are the reactants. Calcium hydroxide and hydrogen are on the right. They are the new substances made, so they are the products.

### C2-11 · teach "How do you balance an equation?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Atoms are not lost | An equation must have the same atoms on both sides. | atoms on the left = atoms on the right | In a reaction, atoms are only rearranged into new substances. No atoms are made and none disappear. So there must be the same number of each kind of atom on both sides. An equation like this is called balanced. H₂ + Cl₂ → HCl has 2 H and 2 Cl on the left, but only 1 of each on the right. | `cmpd-balance-count` |
| Numbers in front | A big number in front of a formula means more molecules. | 2HCl = two molecules of HCl | To fix it, write a big 2 in front of HCl. 2HCl means two molecules of HCl, so it has 2 H atoms and 2 Cl atoms. Now each side has 2 H and 2 Cl. So H₂ + Cl₂ → 2HCl is balanced. | `cmpd-balance-front` |
| Never change a formula | Changing a small number makes a different substance. | change numbers in front, never the small numbers | You might try writing H₂Cl₂ instead of 2HCl. That is wrong, because H₂Cl₂ is not hydrogen chloride. Changing a formula changes the substance. So when you balance an equation, only ever put numbers in front of formulas. | `cmpd-balance-formula` |
| The method | Count, put a number in front, count again. | count → number in front → count again | First, count each kind of atom on both sides. Next, find one that does not match and put a number in front of a formula. Then count again, because one number can change two elements at once. Keep going until every kind of atom matches. | `cmpd-balance-method` |

### C2-12 · worked example "Balance the equation for making ammonia" · visual `cmpd-balance-example`
**Q:** Nitrogen reacts with hydrogen to make ammonia: N₂ + H₂ → NH₃. Balance the equation.
1. Count the atoms. Left: 2 N and 2 H. Right: 1 N and 3 H.
2. Nitrogen does not match, so put a 2 in front of NH₃. Now the right has 2 N and 2 × 3 = 6 H.
3. Hydrogen does not match: 2 on the left, 6 on the right. Put a 3 in front of H₂, so the left has 3 × 2 = 6 H.
4. Count again: 2 N and 6 H on each side. So the balanced equation is N₂ + 3H₂ → 2NH₃.

### C2-13 · choice · `calculation, guided, practice` · visual `cmpd-balance-practice`
**Q:** Nitrogen reacts with oxygen to make nitrogen dioxide: N₂ + O₂ → NO₂. Which is the balanced equation?
- 0 N₂ + O₂ → 2NO₂ · 1 N₂ + 2O₂ → NO₂ · 2 N₂ + O₂ → N₂O₂ · **3 N₂ + 2O₂ → 2NO₂ ✓**
- Hint: Balance nitrogen first, then count the oxygen.
- Explanation: Put a 2 in front of NO₂ to get 2 N on each side. The right now has 2 × 2 = 4 O. Put a 2 in front of O₂ to get 4 O on the left. N₂ + 2O₂ → 2NO₂ has 2 N and 4 O on each side.

### C2-14 · choice · `understanding, guided, practice`
**Q:** You are balancing an equation that contains H₂O. Which change are you allowed to make?
- **0 Write 2H₂O instead of H₂O ✓** · 1 Change H₂O to H₂O₂ · 2 Change H₂O to H₄O₂ · 3 Take an O atom away from one side
- Hint: Which change keeps the substance as water?
- Explanation: Changing the small numbers changes the formula, so it would no longer be water. Only numbers in front are allowed, so 2H₂O (two water molecules) is the allowed change.

### C2-15 · choice · `understanding, independent, independent` · visual `cmpd-question-particles`
**Q:** Look at the numbered particles. Which one is a molecule of a compound?
- 0 Particle 1 · **1 Particle 2 ✓** · 2 Particle 3
- Hint: Which particle has atoms of more than one element joined together?
- Explanation: Particle 1 is two nitrogen atoms joined (N₂) and particle 3 is one argon atom. Both are elements. Particle 2 has nitrogen and hydrogen atoms joined together, so it is a compound (ammonia, NH₃).

### C2-16 · choice · `application, independent, independent`
**Q:** Aluminium hydroxide has the formula Al(OH)₃. How many oxygen atoms does the formula show?
- 0 1 · **1 3 ✓** · 2 4 · 3 6
- Hint: What does the number after the bracket multiply?
- Explanation: The small 3 after the bracket multiplies everything inside it. There is 1 O inside the bracket, so there are 3 × 1 = 3 oxygen atoms.

### C2-17 · choice · `calculation, independent, independent` · visual `cmpd-question-co`
**Q:** Carbon burns in a little oxygen to make carbon monoxide: C + O₂ → CO. Which is the balanced equation?
- 0 C + O₂ → CO₂ · 1 C + O₂ → 2CO · **2 2C + O₂ → 2CO ✓** · 3 C + O₂ → CO + O
- Hint: Balance the oxygen first, then count the carbon.
- Explanation: Put a 2 in front of CO to get 2 O on each side. The right now has 2 C. Put a 2 in front of C. 2C + O₂ → 2CO has 2 C and 2 O on each side.

### C2-18 · choice · `application, independent, independent`
**Q:** Which of these symbol equations is already balanced?
- 0 K + Cl₂ → KCl · 1 Zn + O₂ → ZnO · 2 H₂ + I₂ → HI · **3 S + O₂ → SO₂ ✓**
- Hint: Count each kind of atom on both sides.
- Explanation: In the first three, the left has 2 Cl, 2 O or 2 I, but the right has only 1. S + O₂ → SO₂ has 1 S and 2 O on each side, so it is balanced.

### C2-19 · written · teacher-reviewed
**Q:** To balance Li + Cl₂ → LiCl, a student writes LiCl₂. Explain the mistake and balance it correctly.
- Hint: Say what changing a formula does. Then count each kind of atom on both sides and use numbers in front.
- Model answer: The student changed a formula. LiCl₂ is not lithium chloride, so the equation would show a different substance. When balancing, you may only put numbers in front of formulas. Chlorine has 2 on the left and 1 on the right, so write 2LiCl. Now there are 2 Li on the right, so write 2Li. The balanced equation is 2Li + Cl₂ → 2LiCl, with 2 Li and 2 Cl on each side.
- Rubric (4): Changing LiCl to LiCl₂ changes the formula, so it would be a different substance. / Only numbers in front of formulas may be added when balancing. / A 2 in front of LiCl balances the chlorine: 2 Cl on each side. / A 2 in front of Li balances the lithium: 2Li + Cl₂ → 2LiCl, with 2 Li and 2 Cl on each side.
- Reject: Keeping LiCl₂ or any other changed formula. / Li + Cl₂ → 2LiCl (the lithium is not balanced). / Saying atoms can be made or lost in a reaction.
