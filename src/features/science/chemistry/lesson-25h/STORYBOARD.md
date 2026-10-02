# Chemistry Lesson 25H storyboard — Redox and ionic equations

Chapter C4, Chemical changes. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). Folder `chemistry/lesson-25h`, id `C-REDOX-025H-C`, skill `C-REDOX`. Visuals: `components/HigherRedoxVisuals.tsx` (focus prefix `hredox-`). It sits after Lesson 25 (reactions of metals, displacement) and before Lesson 26 (electrolysis).

Big idea: oxidation is loss of electrons and reduction is gain of electrons (OIL RIG), and they always happen together (redox). A half equation shows one half, with electrons added to the more positive side. In displacement the metal atom is oxidised and the metal ion is reduced; crossing out spectator ions leaves the ionic equation, which shows only what is oxidised and reduced.

Flow note: builds on ions (Mg → Mg²⁺ by losing 2 electrons), oxidation and reduction as gain and loss of oxygen, and displacement (iron in copper sulfate), without re-teaching them. The electron definitions come first on a familiar reaction (magnesium burning), so the new meaning is seen agreeing with the old one. Half equations are then written for the same reaction, one board built up: split → balance charge (lost) → balance charge (gained) → combine. Displacement comes last because it uses both ideas: the electron story in particles first, then the equation worked down to the ionic equation. Metals with acids (5.4.2.1) are named in the first section's last frame, practised as a half equation, and pulled together in the written task.

1. **Start here** (C25H-01): what happens when Mg becomes Mg²⁺ (loses 2 electrons).
2. **Losing and gaining electrons** (C25H-02–05): Mg atom (2,8,2) and O atom (2,6) on shells, built up: oxygen definition recap → Mg loses 2e⁻ (oxidation) → O gains 2e⁻ (reduction) → electrons move from one to the other (redox) → OIL RIG, plus metals with acids. Practice: which definition is right; which reactant is reduced in Na + Cl; why the two always go together.
3. **Half equations** (C25H-06–10): one board for 2Mg + O₂ → 2Mg²⁺ + 2O²⁻: halves Mg → Mg²⁺ and O₂ → 2O²⁻ → Mg → Mg²⁺ + 2e⁻ (charge tallies) → O₂ + 4e⁻ → 2O²⁻ → double the Mg half, add, cancel 4e⁻ → four steps. Worked: 2Na + Cl₂ → Na → Na⁺ + e⁻, Cl₂ + 2e⁻ → 2Cl⁻. Practice: Al → Al³⁺ + 3e⁻; 2H⁺ + 2e⁻ → H₂ (acid as redox); first step to combine the sodium and chlorine halves (×2).
4. **Displacement and ionic equations** (C25H-11–14): particle panel (Fe → Fe²⁺ + 2e⁻ to Cu²⁺ → Cu) over four numbered equation rows: full → ions → cross out SO₄²⁻ → Fe + Cu²⁺ → Fe²⁺ + Cu (2+ = 2+). Worked: Mg + CuSO₄ → Mg + Cu²⁺ → Mg²⁺ + Cu. Practice: spectator ions for Zn + CuSO₄; ionic equation for Fe + CuCl₂ (same ionic equation, chloride spectators).
5. **On your own** (C25H-15–19): 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu, which is oxidised; numbered particles in Mg + CuSO₄ (assessment view), which is reduced; balanced ionic equation for Cu + Ag⁺ (charge check); first mistake in a student’s working for Mg + FeCl₂ (solid Mg written as Mg²⁺); written task: why Mg + HCl is redox, with two half equations.

Equations (each checked for atoms and charge): Mg → Mg²⁺ + 2e⁻ · O + 2e⁻ → O²⁻ · O₂ + 4e⁻ → 2O²⁻ · 2Mg → 2Mg²⁺ + 4e⁻ · 2Mg + O₂ → 2Mg²⁺ + 2O²⁻ · Na → Na⁺ + e⁻ · Cl₂ + 2e⁻ → 2Cl⁻ · 2Na + Cl₂ → 2Na⁺ + 2Cl⁻ · Al → Al³⁺ + 3e⁻ · 2H⁺ + 2e⁻ → H₂ · Fe + Cu²⁺ → Fe²⁺ + Cu · Mg + Cu²⁺ → Mg²⁺ + Cu · Zn + Cu²⁺ + SO₄²⁻ → Zn²⁺ + SO₄²⁻ + Cu · Fe + Cu²⁺ + 2Cl⁻ → Fe²⁺ + 2Cl⁻ + Cu · 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu (6+ = 6+) · Cu + 2Ag⁺ → Cu²⁺ + 2Ag (2+ = 2+) · Mg + Fe²⁺ + 2Cl⁻ → Mg²⁺ + 2Cl⁻ + Fe · Mg + 2H⁺ → Mg²⁺ + H₂.

Out of scope: electrolysis and its half equations (Lesson 26 has its own section); state symbols in ionic equations; ionic equations for neutralisation; oxidation states; combining halves that need multiplying both sides (e.g. aluminium with acid); the book's examples, questions, cartoons and jokes.

Source boundary: supplied revision-guide pages 134–135 (scope only); AQA 8464 Chemistry 5.4.1.4 (HT) and 5.4.2.1 (HT). Fe + CuSO₄ and Mg + O₂ are the standard spec examples (both already used in Lessons 24 and 25). Every other example, the questions, diagrams and wording are original: the book's Ca + Cl₂, Na + acid, Zn + acid and Zn + FeSO₄ examples were replaced by Mg + O₂ halves, Na + Cl₂, Mg + acid, Zn/Fe + copper salts, Al + Cu²⁺, Cu + Ag⁺ and Mg + FeCl₂. Draft pending teacher review.

Judgement calls for the teacher:
- Section 2 shows one magnesium atom giving 2 electrons to one oxygen atom (O + 2e⁻ → O²⁻); section 3 then writes the oxygen half with O₂ molecules (O₂ + 4e⁻ → 2O²⁻). Both are stated plainly.
- The spec point asks students to write ionic equations and identify what is oxidised and reduced; writing half equations is taken from the revision pages (and needed for Lesson 26). Combining halves is kept to one doubling.
- Copper with silver nitrate (Ag⁺) appears only in one independent question, with the ion given.
- Aluminium appears only in equations (Al³⁺ half equation; Al + Cu²⁺), not as a reactivity claim.
- Ionic equations are written without state symbols.

## States in full

(See `lesson.ts` for every state, option, hint and explanation, and `teachingFrames.ts` for every frame.)
