# Chemistry Lesson 18 storyboard — Relative formula mass

Chapter C3, Quantitative chemistry (first lesson of the chapter). Folder `chemistry/lesson-18`, id `C-QNT-018-C`, skill `C-FORMULA-MASS`. It builds on relative atomic mass (the atoms lesson) and reading formulas, small numbers and brackets (the formulas and equations lesson).

Big idea: a compound's relative formula mass, Mᵣ, is the sum of the relative atomic masses of every atom in its formula. Small numbers (and small numbers after brackets) tell you how many times to count each Aᵣ. From Mᵣ you can work out what percentage of a compound's mass comes from one element.

Flow note: each idea keeps one compound on screen while it is built up, so the student sees one picture change frame by frame.
1. **What is relative formula mass?** Carbon dioxide first, because it has no brackets and only one small number: Aᵣ from the periodic-table box (recalled, not re-taught) → add every atom (16 + 12 + 16), "relative formula mass, Mᵣ" → the small number lets you multiply (2 × 16) → three-step method. Then the calculation route: worked example (Na₂O = 62) → near-identical practice (K₂O = 94) → a definition check.
2. **What if there are brackets?** Brackets need the method from section 1 first. Magnesium hydroxide, Mg(OH)₂, step by step: what the 2 doubles → inside the bracket (17) → times 2 (34) → add the magnesium (58), with the common mistake (42) crossed out. Checks: Al(OH)₃ = 78; which sum gives Cu(OH)₂.
3. **How much of the mass is one element?** Percentage mass needs Mᵣ, so it comes last, and it is kept light (one worked example, one question). Magnesium oxide, MgO (Mᵣ 40, no small numbers): a bar split 24 : 16 → "percentage mass" and the rule → three steps; worked example 60%; one question, sulfur in SO₃ (40%).
4. **On your own**: a new Mᵣ (CaCO₃ = 100), a spot-the-mistake working for Mg(NO₃)₂ with numbered lines in assessment view, a data table of four chlorides read without over-claiming, and a written task correcting a bracket mistake (Zn(OH)₂: 83 → 99).

Sections:
1. Start here (C18-01): what the small 2 in CO₂ means (prior knowledge from reading formulas).
2. What is relative formula mass? (C18-02–05): Aᵣ in the periodic table → add all atoms → multiply by the small number → method. Worked Na₂O; practice K₂O; what Mᵣ means.
3. What if there are brackets? (C18-06–08): bracket doubles everything inside → OH = 17 → 2 × 17 = 34 → 24 + 34 = 58. Checks: Al(OH)₃; the right sum for Cu(OH)₂.
4. How much of the mass is one element? (C18-09–11): share of the mass → percentage mass rule → three steps. Worked MgO 60%; practice SO₃ 40%.
5. On your own (C18-12–15): CaCO₃; the Mg(NO₃)₂ working; chlorides data; written Zn(OH)₂.

Wording rules: one new term per frame (relative formula mass / Mᵣ, percentage mass); relative atomic mass and brackets are recalled by topic ("You met … when you learned about atoms / to read formulas"); every question gives the Aᵣ values it needs; British spelling; sentences ≤ 26 words.

Numbers (all checked; AQA periodic table Aᵣ: H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, S 32, Cl 35.5, K 39, Ca 40, Cu 63.5, Zn 65):
CO₂ 44 · Na₂O 62 · K₂O 94 (distractors 55 = 39 + 16, 110 = 2 × 55, 78 = K only) · Mg(OH)₂ 58 (mistake 42) · Al(OH)₃ 78 (distractors 46 = 27 + 16 + 3, 44 = 27 + 17, 76 = 27 + 48 + 1) · MgO 40, Mg 60% · SO₃ 80, S 40% (distractors 25% = 1 atom in 4, 60% = oxygen, 67% = 32 ÷ 48) · CaCO₃ 100 (distractors 68, 71, 156) · Mg(NO₃)₂ 148 (student's 100) · HCl 36.5, NaCl 58.5, CaCl₂ 111, AlCl₃ 133.5 · Zn(OH)₂ 99 (student's 83; doubling everything 164).

Out of scope: the second half of 5.3.1.2 (in a balanced equation the total Mᵣ of reactants equals that of products), conservation of mass, moles and anything Higher-only; the Aᵣ calculation from isotopes (taught in the atoms lesson); percentage mass beyond one worked example and one question (it is on the page but is not a named Foundation point); the book's examples (MgCl₂, Ca(OH)₂, NaBr), practice questions (H₂O, LiOH, H₂SO₄, KOH), cartoon and jokes.

Source boundary: supplied revision-guide page 121 (scope only; page 120 is a revision test and was not used); AQA 8464 Chemistry 5.3.1.2. All compounds used as examples and questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Aᵣ is described as "the top number in each element's box", matching the layout of the AQA periodic table (relative atomic mass above the symbol, atomic number below).
- Percentage mass is kept to one worked example (MgO) and one guided question (SO₃), with no independent item; the independent calculation evidence comes from Mᵣ (CaCO₃).
- CO₂ is drawn with double bonds (O=C=O) and hydroxide groups with an O–H stick; magnesium and sodium atoms in ionic compounds are drawn apart with no sticks, because only counting matters here. Ions are not mentioned.
- "Copper hydroxide" is used for Cu(OH)₂ (strictly copper(II) hydroxide); the question only asks which sum is right.
- The chlorides data question (C18-14) expects students to reject "every compound …" as over-claiming (AgCl, Mᵣ 143.5, would break it) and to see that HCl and NaCl differ with the same number of chlorine atoms.

## Diagram plan
- `components/FormulaMassVisuals.tsx`, focus prefix `mr-`, routed by `CellBiologyVisuals.tsx`. Ink, panels and greys from `atomPalette`; element colours as in the formulas lesson (H white, C dark grey, O soft red, Mg teal; sodium sand). Amber marks the numbers or step in use; red marks a mistake; green a correction.
- **CO₂ board** (`mr-co2-tiles`, `-add`, `-multiply`, `-method`): the formula, periodic-table boxes for C and O (Aᵣ on top), one O=C=O molecule with an Aᵣ tag under each atom, the sum, and the Mᵣ result; the last frame adds three numbered steps.
- **Worked Na₂O** (`mr-worked-na2o`): two Na and one O with tags and the set-up (2 × 23) + 16, no answer.
- **Mg(OH)₂ board** (`mr-bracket-count`, `-inside`, `-times`, `-total`): Mg plus two dashed OH groups; highlights move from the bracket to one group (17) to both (34) to the total (58), with the 42 mistake crossed out.
- **MgO bar** (`mr-pc-share`, `-rule`, `-steps`, `mr-worked-mgo`): a to-scale bar 24 : 16 of 40; then the rule panel, the three steps, and the worked set-up (24 × 1) ÷ 40 × 100 without the answer.
- **Question visuals**: `mr-question-error` (four numbered lines; the wrong line and the correction appear only outside assessment view) and `mr-data-chlorides` (data table).

## States in full

### C18-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** In the formula CO₂, what does the small 2 tell you?
- 0 There are 2 carbon atoms · **1 There are 2 oxygen atoms ✓** · 2 There are 2 molecules of carbon dioxide
- Hint: Which symbol does the small 2 come straight after?
- Explanation: A small number counts the atoms of the element just before it. The 2 comes after O, so there are 2 oxygen atoms and 1 carbon atom.

### C18-02 · teach "What is relative formula mass?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Relative atomic mass | Each element’s box in the periodic table gives its relative atomic mass. | periodic table box → top number → Aᵣ | You met relative atomic mass when you learned about atoms. It tells you how heavy an element’s atoms are compared with other atoms. Its symbol is Aᵣ. In the periodic table, it is the top number in each element’s box. Carbon’s Aᵣ is 12 and oxygen’s is 16. | `mr-co2-tiles` |
| Adding up the atoms | Add the Aᵣ of every atom in the formula. | every atom → its Aᵣ → add them all | A molecule of carbon dioxide, CO₂, has one carbon atom and two oxygen atoms. Write the Aᵣ under each atom: 16, 12 and 16. Then add them all up: 16 + 12 + 16 = 44. This total is called the relative formula mass. Its symbol is Mᵣ. | `mr-co2-add` |
| Using the small numbers | A small number tells you how many times to count that Aᵣ. | O₂ in the formula → 2 × 16 | The small 2 in CO₂ means there are two oxygen atoms. So instead of adding 16 twice, you can multiply: 2 × 16 = 32. Then add the carbon: 12 + 32 = 44. Both ways give the same Mᵣ. | `mr-co2-multiply` |
| Put it together | Three steps give the relative formula mass of any compound. | look up → count → multiply and add | First, look up the Aᵣ of each element in the periodic table. Next, count how many atoms of each element are in the formula. Then multiply each Aᵣ by its number of atoms, and add the answers. For CO₂, Mᵣ = 12 + (2 × 16) = 44. | `mr-co2-method` |

### C18-03 · worked example "Work out the relative formula mass of sodium oxide" · visual `mr-worked-na2o`
**Q:** Sodium oxide is Na₂O. Aᵣ: Na = 23, O = 16. What is its relative formula mass, Mᵣ?
1. Look up the Aᵣ values: Na = 23 and O = 16.
2. Count the atoms in Na₂O: 2 sodium atoms and 1 oxygen atom.
3. Multiply: 2 × 23 = 46 for sodium, and 1 × 16 = 16 for oxygen.
4. Add: 46 + 16 = 62. So the Mᵣ of Na₂O is 62.

### C18-04 · choice · `calculation, guided, practice`
**Q:** Potassium oxide is K₂O. Aᵣ: K = 39, O = 16. What is its relative formula mass?
- 0 55 · **1 94 ✓** · 2 110 · 3 78
- Hint: How many potassium atoms are in K₂O?
- Explanation: K₂O has 2 potassium atoms and 1 oxygen atom. So Mᵣ = (2 × 39) + 16 = 78 + 16 = 94.

### C18-05 · choice · `understanding, guided, practice`
**Q:** What is the relative formula mass, Mᵣ, of a compound?
- **0 The sum of the Aᵣ values of all the atoms in its formula ✓** · 1 The Aᵣ of the heaviest element in it · 2 The number of atoms in its formula · 3 The Aᵣ of each element added once, ignoring small numbers
- Hint: What did you do with every atom in CO₂?
- Explanation: Mᵣ adds up the relative atomic masses of every atom in the formula. So a small number, like the 2 in CO₂, means that Aᵣ is counted more than once.

### C18-06 · teach "What if there are brackets?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Brackets | A small number after a bracket multiplies everything inside it. | Mg(OH)₂ → 1 Mg, 2 O, 2 H | You met brackets when you learned to read formulas. Magnesium hydroxide is Mg(OH)₂. The small 2 after the bracket doubles everything inside it. So there is 1 magnesium atom, 2 oxygen atoms and 2 hydrogen atoms. | `mr-bracket-count` |
| Inside the bracket first | Add up the atoms inside the bracket. | one OH → 16 + 1 = 17 | The Aᵣ values are Mg = 24, O = 16 and H = 1. Start inside the bracket. One OH group has one oxygen atom and one hydrogen atom. So one OH group adds up to 16 + 1 = 17. | `mr-bracket-inside` |
| Then multiply | Multiply the bracket total by the small number after it. | two OH groups → 2 × 17 = 34 | The small 2 means there are two OH groups. So multiply the bracket total by 2: 2 × 17 = 34. This is the mass of both OH groups together. | `mr-bracket-times` |
| Put it together | Add the bracket total to the rest of the formula. | Mg + two OH → 24 + 34 = 58 | Now add the magnesium: 24 + 34 = 58. So the Mᵣ of Mg(OH)₂ is 58. A common mistake is to double only the hydrogen, which gives 24 + 16 + 2 = 42. The 2 doubles the oxygen too. | `mr-bracket-total` |

### C18-07 · choice · `calculation, guided, practice`
**Q:** Aluminium hydroxide is Al(OH)₃. Aᵣ: Al = 27, O = 16, H = 1. What is its relative formula mass?
- 0 46 · 1 44 · 2 76 · **3 78 ✓**
- Hint: What does the 3 after the bracket multiply?
- Explanation: One OH group is 16 + 1 = 17, and the 3 means three OH groups: 3 × 17 = 51. So Mᵣ = 27 + 51 = 78.

### C18-08 · choice · `understanding, guided, practice`
**Q:** Copper hydroxide is Cu(OH)₂. Aᵣ: Cu = 63.5, O = 16, H = 1. Which sum gives its Mᵣ?
- 0 63.5 + 16 + (2 × 1) · 1 2 × (63.5 + 16 + 1) · **2 63.5 + 2 × (16 + 1) ✓** · 3 63.5 + (2 × 16) + 1
- Hint: Which atoms are inside the bracket?
- Explanation: The 2 after the bracket doubles everything inside it: the oxygen and the hydrogen. Copper is outside the bracket, so it is counted once: 63.5 + 2 × (16 + 1).

### C18-09 · teach "How much of the mass is one element?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A share of the mass | Each element makes up part of a compound’s Mᵣ. | Mᵣ 40 → magnesium 24, oxygen 16 | Magnesium oxide is MgO. The Aᵣ values are Mg = 24 and O = 16, so its Mᵣ is 24 + 16 = 40. Of that 40, magnesium makes up 24 and oxygen makes up 16. So more than half of the mass is magnesium. | `mr-pc-share` |
| Percentage mass | One element’s share of the mass, written as a percentage. | element’s part ÷ whole Mᵣ × 100 | The share of a compound’s mass that comes from one element, as a percentage, is called the percentage mass of that element. To find it, multiply the element’s Aᵣ by its number of atoms in the formula. Divide the answer by the Mᵣ of the compound. Then multiply by 100. | `mr-pc-rule` |
| Put it together | Find the Mᵣ, find the element’s part, then divide and multiply by 100. | Mᵣ → Aᵣ × atoms → ÷ Mᵣ → × 100 | First, work out the Mᵣ of the compound. Next, multiply the element’s Aᵣ by how many of its atoms are in the formula. Then divide by the Mᵣ and multiply by 100. The percentages of all the elements in a compound add up to 100%. | `mr-pc-steps` |

### C18-10 · worked example "Work out the percentage mass of magnesium in magnesium oxide" · visual `mr-worked-mgo`
**Q:** Magnesium oxide is MgO. Aᵣ: Mg = 24, O = 16. What is the percentage mass of magnesium?
1. Work out the Mᵣ: 24 + 16 = 40.
2. Magnesium’s part: Aᵣ × number of atoms = 24 × 1 = 24.
3. Divide by the Mᵣ: 24 ÷ 40 = 0.6.
4. Multiply by 100: 0.6 × 100 = 60%. So 60% of the mass of MgO is magnesium.

### C18-11 · choice · `calculation, guided, practice`
**Q:** Sulfur trioxide is SO₃. Aᵣ: S = 32, O = 16. What is the percentage mass of sulfur?
- 0 25% · **1 40% ✓** · 2 60% · 3 67%
- Hint: Work out the Mᵣ first. How many oxygen atoms are there?
- Explanation: Mᵣ = 32 + (3 × 16) = 32 + 48 = 80. Sulfur: (32 × 1) ÷ 80 × 100 = 40%. The other 60% is oxygen.

### C18-12 · choice · `calculation, independent, independent`
**Q:** Calcium carbonate is CaCO₃. Aᵣ: Ca = 40, C = 12, O = 16. What is its Mᵣ?
- **0 100 ✓** · 1 68 · 2 71 · 3 156
- Hint: How many oxygen atoms does CaCO₃ have?
- Explanation: CaCO₃ has 1 calcium atom, 1 carbon atom and 3 oxygen atoms. So Mᵣ = 40 + 12 + (3 × 16) = 40 + 12 + 48 = 100.

### C18-13 · choice · `application, independent, independent` · visual `mr-question-error`
**Q:** A student worked out the Mᵣ of magnesium nitrate, Mg(NO₃)₂. Which numbered line has the mistake?
- 0 Line 1 · 1 Line 2 · **2 Line 3 ✓** · 3 Line 4
- Hint: Which line uses the small 2 after the bracket?
- Explanation: Line 3 doubles only the nitrogen. The 2 must double everything in the bracket: 2 × 62 = 124. So the Mᵣ of Mg(NO₃)₂ is 24 + 124 = 148, not 100.

### C18-14 · choice · `dataInterpretation, independent, independent` · visual `mr-data-chlorides`
**Q:** The table shows the Mᵣ of four chlorine compounds. Which conclusion do these data support?
- 0 Every compound with more chlorine atoms has a bigger Mᵣ · 1 Chlorine is the heaviest element in each compound · 2 Mᵣ depends only on the number of chlorine atoms · **3 In this table, compounds with more chlorine atoms have bigger Mᵣ values ✓**
- Hint: Is the claim about these four compounds, or about every compound?
- Explanation: In the table, HCl and NaCl (one chlorine atom) have the smallest Mᵣ, then CaCl₂ (two), then AlCl₃ (three). But HCl and NaCl differ, so other atoms matter too, and four compounds cannot show what is true for every compound.

### C18-15 · written · teacherOnly
**Q:** Zinc hydroxide is Zn(OH)₂. A student says its Mᵣ is 83. Using Zn 65, O 16, H 1, explain the mistake.
- Hint: Say what the 2 after the bracket multiplies. Then work out the correct Mᵣ step by step: inside the bracket, times 2, then add the zinc.
- Model answer: The 2 after the bracket doubles everything inside it, so Zn(OH)₂ has 1 zinc atom, 2 oxygen atoms and 2 hydrogen atoms. The student only doubled the hydrogen: 65 + 16 + (2 × 1) = 83. One OH group is 16 + 1 = 17, so two OH groups are 2 × 17 = 34. The correct Mᵣ is 65 + 34 = 99.
- Rubric:
  - The 2 after the bracket doubles everything inside it, so there are 2 oxygen atoms and 2 hydrogen atoms.
  - The student only doubled the hydrogen: 65 + 16 + (2 × 1) = 83.
  - One OH group is 16 + 1 = 17, so two OH groups are 2 × 17 = 34.
  - The correct Mᵣ is 65 + 34 = 99.
- Reject:
  - Saying the 2 doubles only the hydrogen.
  - Doubling the zinc as well: 2 × (65 + 16 + 1) = 164.
  - Giving a number with no working or no explanation of the mistake.
