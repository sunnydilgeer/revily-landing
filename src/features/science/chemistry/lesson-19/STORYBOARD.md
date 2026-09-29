# Chemistry Lesson 19 storyboard — Conservation of mass

Chapter C3, Quantitative chemistry. Folder `chemistry/lesson-19`, id `C-QNT-019-C`, skill `C-CONSERVATION-MASS`. It builds on relative formula mass (the previous lesson, not re-taught) and balanced symbol equations (the formulas and equations lesson). Visuals: `components/MassConservationVisuals.tsx`, focus prefix `cons-`.

Big idea: in a chemical reaction no atoms are lost or made, so mass is conserved. In a balanced equation each type of atom, and the total relative formula mass, is the same on both sides. If every mass but one is known, the missing mass is the difference between the two totals.

Flow note: section 1 keeps one reaction on screen (magnesium burning, 2Mg + O₂ → 2MgO) and builds it up: atoms swap partners → count them → same mass (level balance) → same total Mᵣ. Practice uses Mᵣ from the previous lesson. Section 2 keeps one reaction with a missing mass (zinc and copper sulfate, all solids and solutions, so no gas is involved) and builds: one mass missing → total the known side → subtract → two equal bars.

Sections:
1. Start here (C19-01): what happens to atoms in a reaction (prior knowledge).
2. Where does the mass go? (C19-02–05): atoms rearranged → count → mass conserved → same total Mᵣ. Worked 2H₂ + O₂ → 2H₂O (36 = 36); practice CaO (112); what is the same on both sides.
3. Finding a missing mass (C19-06–10): worked MgSO₄ (12.0 g); practice ZnSO₄ (8.05 g), a missing reactant (16.0 g), and the method in words.
4. On your own (C19-11–15): total Mᵣ for NaCl (117), missing mass of FeSO₄ (15.2 g), which of four equations is unbalanced (assessment view hides the atom counts), a sealed-flask data table read without over-claiming, and a written task on the "3 particles against 2" mistake.

Out of scope: masses that seem to change in unsealed containers, gases and thermal decomposition (next lesson); moles, reacting-mass calculations and anything Higher-only; the book's Li + F₂ and H₂SO₄ + NaOH examples, cartoon and jokes.

Source boundary: supplied revision-guide page 122 (scope only; page 123 belongs to the next lesson); AQA 8464 Chemistry 5.3.1.1. All examples, numbers, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Mass is conserved "as long as nothing escapes and nothing is added from outside" (one clause, no gases taught here).
- Masses of the copper sulfate reactions are real (0.1 mol scale) so they are consistent: Zn 6.5 + CuSO₄ 16.0 = Cu 6.4 + ZnSO₄ 16.1; Mg 2.4 + 16.0 = 6.4 + 12.0; Fe 5.6 + 16.0 = 6.4 + 15.2; Zn 3.25 + 8.0 = 3.2 + 8.05.
- Aᵣ used: H 1, O 16, Na 23, Mg 24, Ca 40, Cl 35.5.

## States in full

### C19-01 · choice
**Q:** Hydrogen and oxygen react to make water. What happens to the atoms in the reaction?

### C19-03 · worked
**Q:** Show that mass is conserved in 2H₂ + O₂ → 2H₂O

### C19-04 · choice
**Q:** Calcium burns in oxygen: 2Ca + O₂ → 2CaO. Aᵣ: Ca = 40, O = 16. What is the total Mᵣ of the products?

### C19-05 · choice
**Q:** Which two things are the same on both sides of a balanced symbol equation?

### C19-07 · worked
**Q:** Work out the mass of magnesium sulfate formed

### C19-08 · choice
**Q:** Zinc reacts with copper sulfate. 3.25 g of zinc reacts with 8.0 g of copper sulfate, making 3.2 g of copper and some zinc sulfate. What mass of zinc sulfate is made?

### C19-09 · choice
**Q:** In a similar reaction, 6.5 g of zinc reacts with some copper sulfate. It makes 6.4 g of copper and 16.1 g of zinc sulfate. What mass of copper sulfate reacted?

### C19-10 · choice
**Q:** Every mass in a reaction is known except one reactant. What is the correct way to find it?

### C19-11 · choice
**Q:** Sodium burns in chlorine: 2Na + Cl₂ → 2NaCl. Aᵣ: Na = 23, Cl = 35.5. What is the total Mᵣ of the reactants?

### C19-12 · choice
**Q:** Iron reacts with copper sulfate. 5.6 g of iron reacts with 16.0 g of copper sulfate, making 6.4 g of copper and some iron sulfate. What mass of iron sulfate is made?

### C19-13 · choice
**Q:** A student wrote four equations. In which line are the atoms, and so the mass, NOT the same on both sides?

### C19-14 · choice
**Q:** The table shows three reactions in sealed flasks. Which conclusion do these data support?

### C19-15 · written
**Q:** A student says: “2Mg + O₂ → 2MgO has 3 particles on the left and only 2 on the right, so mass must be lost.” Explain why the student is wrong. Aᵣ: Mg = 24, O = 16.

### C19-02 · teach "Where does the mass go?"

| Label | Summary | Text | Focus |
|---|---|---|---|
| Atoms swap partners | In a reaction, the same atoms join up in a new way. | Magnesium burns in oxygen to make magnesium oxide: 2Mg + O₂ → 2MgO. On the left there are two magnesium atoms and one oxygen molecule. In the reaction the atoms swap partners. On the right, the same four atoms are joined as two magnesium oxide units. | `cons-atoms-move` |
| Nothing lost, nothing made | Count each type of atom on both sides. | No atoms are lost and no atoms are made in a chemical reaction. Count them to check. There are 2 magnesium atoms and 2 oxygen atoms before, and the same after. In a balanced equation, each type of atom appears the same number of times on both sides. | `cons-atoms-count` |
| Mass is conserved | The same atoms mean the same total mass. | The atoms are the same, so the total mass stays the same. We say mass is conserved. This holds as long as nothing escapes and nothing is added from outside. The mass of everything you start with equals the mass of everything you end with. | `cons-mass-balance` |
| Same total Mᵣ | In a balanced equation, the total Mᵣ is the same on both sides. | You can check this with relative formula mass. Left side: 2 × 24 for the magnesium, plus 32 for O₂, gives 80. Right side: 2 × 40 for the two MgO gives 80. The total Mᵣ is the same on both sides. | `cons-mr-sum` |

### C19-06 · teach "Finding a missing mass"

| Label | Summary | Text | Focus |
|---|---|---|---|
| One mass is missing | You can know every mass except one. | Zinc reacts with copper sulfate to make copper and zinc sulfate. Here 6.5 g of zinc reacts with 16.0 g of copper sulfate, and 6.4 g of copper is made. The mass of zinc sulfate is not known. Mass is conserved, so you can work it out. | `cons-miss-setup` |
| Add the side you know | Find the total mass of the reactants. | Both reactant masses are known, so add them: 6.5 + 16.0 = 22.5 g. Mass is conserved, so the products must add up to the same total, 22.5 g. | `cons-miss-left` |
| Take away what you know | Subtract the known product from the total. | The products must add up to 22.5 g. Copper makes up 6.4 g of that. What is left is zinc sulfate: 22.5 − 6.4 = 16.1 g. This subtraction finds the difference between the two totals. | `cons-miss-take` |
| Put it together | Total one side, then subtract to find the missing mass. | First, add the masses on the side where you know every mass. Next, take away the known masses on the other side. The difference is the missing mass. Check that both sides now total the same: 22.5 g. | `cons-miss-bar` |

