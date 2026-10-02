# Chemistry Lesson 20H storyboard — Moles

Chapter C3, Quantitative chemistry. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). Folder `chemistry/lesson-20h`, id `C-MOL-020H-C`, skill `C-MOLES`. Visuals: `components/HigherMolesVisuals.tsx` (focus prefix `hmole-`).

Big idea: chemists count particles in moles. One mole is 6.02 × 10²³ particles (the Avogadro constant) and has a mass in grams equal to the Aᵣ or Mᵣ, so moles = mass ÷ Mᵣ. The big numbers in a balanced equation are mole ratios, so reacting masses give the equation, and the moles of the limiting reactant give the mass of product.

Flow note: builds on relative formula mass, balanced equations and conservation of mass without re-teaching them. Counting idea first (a number), then what a mole is, then its mass, then the formula and its rearrangement. Equations are read forwards (particles → moles) before being worked backwards from masses, using the same table. Limiting reactants are shown with molecules before any calculation, so "used up", "in excess" and "proportional" are seen before the five-step method.

1. **Start here** (C20H-01): the Mᵣ of water (prior knowledge the whole lesson needs).
2. **The mole** (C20H-02–07): a heap of magnesium on a balance, built up over five frames: Avogadro constant (magnifier) → one mole → 24 g of Mg and 18 g of water both one mole → moles = mass ÷ Mᵣ (48 g = 2 mol) → formula triangle. Worked: 60 g MgO = 1.5 mol; 0.25 mol CaCO₃ = 25 g. Practice: 34 g NH₃ = 2 mol; 0.5 mol NaOH = 20 g; exam-style: which holds as many atoms as 24 g Mg (12 g C).
3. **Moles in equations** (C20H-08–12): one table for 2Mg + O₂ → 2MgO: particles → moles → masses ÷ Mᵣ (4.8, 3.2, 8.0 g → 0.2, 0.1, 0.2) → ÷ smallest (2, 1, 2) → all four steps. Worked: 2Fe + 3Cl₂ → 2FeCl₃ (needs the ×2 step). Practice: mole ratio in N₂ + 3H₂ → 2NH₃; exam-style 2Al + 3Cl₂ → 2AlCl₃ from masses; what to do with 1, 2.5, 2.
4. **Limiting reactants** (C20H-13–16): two boxes of molecules for H₂ + Cl₂ → 2HCl: reaction stops → limiting reactant ringed → excess ringed → double the hydrogen, double the product → five-step method. Worked: 8.0 g O₂ + excess H₂ → 9.0 g H₂O. Practice: which reactant is limiting (molecule picture, assessment view); exam-style 5.6 g N₂ → 6.8 g NH₃.
5. **On your own** (C20H-17–20): methane equation from masses (calculation); spot the wrong line in a sodium oxide working (numbered lines, assessment view); magnesium-burning data read without over-claiming; written task: limiting reactant and mass of MgO from 4.8 g Mg.

Numbers (each checked twice): 2 + 16 = 18 · 60 ÷ 40 = 1.5 · 0.25 × 100 = 25 · 34 ÷ 17 = 2 · 0.5 × 40 = 20 · 12 ÷ 12 = 1 = 24 ÷ 24 · 4.8 ÷ 24 = 0.2, 3.2 ÷ 32 = 0.1, 8.0 ÷ 40 = 0.2 · 11.2 ÷ 56 = 0.2, 21.3 ÷ 71 = 0.3, 32.5 ÷ 162.5 = 0.2 (11.2 + 21.3 = 32.5) · 5.4 ÷ 27 = 0.2, 21.3 ÷ 71 = 0.3, 26.7 ÷ 133.5 = 0.2 (5.4 + 21.3 = 26.7) · 8.0 ÷ 32 = 0.25 → 0.5 × 18 = 9.0 · 5.6 ÷ 28 = 0.2 → 0.4 × 17 = 6.8 · methane 0.1, 0.2, 0.1, 0.2 (1.6 + 6.4 = 4.4 + 3.6 = 8.0) · 4.6 ÷ 23 = 0.2 → 0.1 × 62 = 6.2 (student's wrong 24.8) · Mg data 0.6/1.2/2.4 g → 1.0/2.0/4.0 g (0.025 mol × 40) · 4.8 ÷ 24 = 0.2 → 0.2 × 40 = 8.0.

Out of scope: moles of gas volumes, concentration in mol/dm³ and titrations; significant-figure rounding (all answers are exact); the book's examples, questions, cartoons and jokes.

Source boundary: supplied revision-guide pages 123, 125 and 126 (scope only); AQA 8464 Chemistry 5.3.2.1–5.3.2.4 (HT). All examples, numbers, questions, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- The mole is introduced with a "count in dozens" comparison (not on the page).
- MgO is described as "two lots of magnesium oxide" rather than formula units or ions.
- The limiting-reactant particle pictures use H₂ + Cl₂ → 2HCl so that every reactant molecule pairs 1 : 1.
- The written task gives Aᵣ values in its hint, to keep the question within the 22-word limit.

## States in full

(See `lesson.ts` for every state, option, hint and explanation, and `teachingFrames.ts` for every frame.)
