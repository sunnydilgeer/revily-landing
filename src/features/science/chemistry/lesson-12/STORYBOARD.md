# Chemistry Lesson 12 storyboard — How ions form

Chapter C2, Bonding, structure and properties of matter (first lesson of the chapter). Folder `chemistry/lesson-12`, id `C-BND-012-C`, skill `C-ION-FORMATION`. It builds on protons and electrons (atoms lesson), electronic structure and full outer shells, and the groups of the periodic table.

Big idea: an ion is a charged particle made when an atom loses or gains electrons. The nucleus does not change, so the charge is just the difference between protons and electrons, which equals the number of electrons lost or gained. Atoms lose or gain electrons to reach a full outer shell like a noble gas, so metals (few outer electrons) lose them and form positive ions, and non-metals (nearly full outer shells) gain them and form negative ions. Elements in one group have the same number of outer electrons, so the group number tells you the charge: Group 1 → 1+, Group 2 → 2+, Group 6 → 2−, Group 7 → 1−.

Flow note: one atom becomes one ion in every drawing, and the same atom → ion picture is reused all lesson (atom, arrow, ion in square brackets, moved electrons above the arrow), so only the element and the right-hand panel change.
1. **What is an ion?** Counting charges comes first because everything else depends on it: an atom's charges cancel (sodium 11 + 11) → sodium loses one (11 v 10, 1+, "ion") → chlorine gains one (17 v 18, 1−, "chloride") → writing charges (Na⁺, Mg²⁺, Cl⁻, O²⁻; a sign on its own means 1).
2. **Why lose or gain electrons?** Only once the charge is clear do we ask why: noble gases' full outer shells → sodium 2,8,1 → 2,8 = neon → chlorine 2,8,7 → 2,8,8 = argon → metals lose/positive, non-metals gain/negative.
3. **Which ion does each group form?** The shortcut comes last, because it only makes sense after the why: same group → same outer electrons → same charge (table slice) → Groups 1 and 2 lose (magnesium) → Groups 6 and 7 gain (oxygen, "oxide") → the charge row under the table.
4. **On your own**: an unnamed atom → ion drawing in assessment view (sulfur); electrons in a potassium ion; a table of four particles; why chlorine and bromine share a charge; a written explanation for calcium.

Sections:
1. Start here (C12-01): the overall charge of a sodium atom (prior knowledge from the atoms lesson).
2. What is an ion? (C12-02–04): no charge → lose one (ion) → gain one (chloride) → writing charges. Checks: charge after losing 2; 8 protons and 10 electrons.
3. Why lose or gain electrons? (C12-05–08): full outer shell → sodium like neon (noble gas electronic structure) → chlorine like argon → metals and non-metals. Checks: why chlorine gains one; sodium ion's structure; which ions metals form.
4. Which ion does each group form? (C12-09–11): outer electrons by group → Groups 1 and 2 → Groups 6 and 7 (oxide) → charges by group. Checks: lithium; fluorine.
5. On your own (C12-12–16): numbered atom → ion (sulfur, unnamed); potassium ion's electrons; data table; chlorine and bromine; written task on calcium.

Wording rules: one new term per frame (ion, chloride, noble gas electronic structure, oxide); plain meaning first; earlier lessons by topic ("You met full outer shells when you learned about electronic structure"); formulas in text use Unicode superscripts (Na⁺, O²⁻), charges in words use the real minus sign (2−).

Out of scope: ionic bonding, electrostatic attraction between ions, dot-and-cross diagrams of compounds (NaCl, MgO, MgCl₂), ionic lattices and formulae of ionic compounds (the ionic bonding lesson); ions of Group 3 and transition metals; Higher-tier content; the book's cartoon, joke boxes and exam questions (its bromine, calcium and potassium prediction questions are replaced by original items: fluorine, lithium, calcium with an explanation, potassium electron count).

Source boundary: supplied revision-guide page 110 (scope only); AQA 8464 Chemistry 5.2.1.1 (ions as charged particles) and 5.2.1.2 (electron transfer, noble gas electronic structures, charge from the group number for Groups 1, 2, 6 and 7). The table slice, all examples, questions, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- "Losing 1 electron is much easier than gaining 7 more" is given as the reason sodium loses rather than gains; energy is not discussed.
- The page's generic "3 electrons gained → 3−" is not used, to keep to the Groups 1, 2, 6 and 7 the spec names; Group 3 and 5 ions are not mentioned.
- The periodic-table slice shows rows 2–4 only (no hydrogen or helium) with the transition metals as one labelled dashed box in row 4. Group 0 is shown with 8 outer electrons (helium's 2 is not on the slice).
- Sulfide (S²⁻) and fluoride (F⁻) are named only in explanations; bromide (Br⁻) in one explanation.
- The data-table item (C12-14) uses invented particles A–D; the explanation names them only as positive ion, negative ion or atom, not as elements.
- Moved electrons are drawn as ordinary electrons floating above the arrow; the drawing does not say where lost electrons go (that is the ionic bonding lesson).

## Diagram plan
- `components/IonVisuals.tsx`, focus prefix `ion-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette`, `Electron` and `Nucleus` from AtomVisuals; atoms drawn as in the electronic structure lesson (real nucleus of the commonest isotope, electrons filled 2, 8, 8). Ions: square brackets with the charge top right; positive ions pale coral wash, negative ions pale blue wash; moved electrons ringed (lost ones on the atom, gained ones on the ion) with a dashed arrow to or from the free electrons above the reaction arrow, labelled "n electron(s) lost/gained".
- **What an ion is** (`ion-what-atom`, `-lose`, `-gain`): sodium atom with a charge panel (11 protons, 11 electrons, none); sodium atom → [Na]⁺ with panel (11, 10, 1+); chlorine atom → [Cl]⁻ with panel (17, 18, 1−). Captions under each particle: name (and formula), structure, protons · electrons.
- **Writing charges** (`ion-what-write`): four cards Na⁺, Mg²⁺ (coral), Cl⁻, O²⁻ (blue) with lost/gained counts; pill "electrons lost or gained = size of the charge".
- **Why** (`ion-why-goal`, `-sodium`, `-chlorine`, `-all`): neon and argon with outer shells highlighted; Na → Na⁺ = neon; Cl → Cl⁻ = argon; two panels metal atoms / non-metal atoms.
- **Groups** (`ion-group-table`, `-metals`, `-nonmetals`, `-all`): table slice rows 2–4, Groups 1–2 coral and 6–7 blue, outer electrons under each group; Mg → Mg²⁺ with a Group 2 / Group 1 panel; O → O²⁻ with a Group 6 / Group 7 panel; the slice with charge pills 1+, 2+, 2−, 1−.
- **Question visuals**: `ion-question` (sulfur atom → ion with pointers 1 and 2; assessment view hides names, charge (shown "?"), tint, ringed and free electrons) and `ion-data` (protons/electrons table; the charge column only outside assessment).

## States in full

### C12-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A sodium atom has 11 protons and 11 electrons. What is the overall charge of the atom?
- **0 No overall charge ✓** · 1 11+ · 2 11− · 3 1+
- Hint: Protons are positive and electrons are negative. What happens when there are equal numbers?
- Explanation: Each proton has a charge of +1 and each electron has a charge of −1. A sodium atom has 11 of each, so the charges cancel out. The atom has no overall charge.

### C12-02 · teach "What is an ion?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Atoms have no charge | An atom has the same number of protons and electrons. | protons (+) = electrons (−) → no overall charge | You met protons and electrons when you learned what is inside an atom. Each proton has a positive charge and each electron has a negative charge. A sodium atom has 11 protons and 11 electrons. The charges cancel out, so the atom has no overall charge. | `ion-what-atom` |
| Losing an electron | Losing an electron leaves a particle with a positive charge. | lose an electron → more + than − → positive | When atoms react, they can lose or gain electrons. The protons in the nucleus do not change. A sodium atom can lose its one outer electron. Then it has 11 protons but only 10 electrons, so its overall charge is 1+. A charged particle like this is called an ion. | `ion-what-lose` |
| Gaining an electron | Gaining an electron gives a particle a negative charge. | gain an electron → more − than + → negative | A chlorine atom has 17 protons and 17 electrons. It can gain one electron into its outer shell. Then it has 18 electrons but still 17 protons, so its overall charge is 1−. This negative ion is called a chloride ion. | `ion-what-gain` |
| Writing the charge | The charge on an ion equals the number of electrons lost or gained. | lost 2 → 2+; gained 2 → 2− | The number of electrons lost or gained is the size of the charge. Write the charge at the top right of the symbol. A sodium ion is Na⁺ and a chloride ion is Cl⁻. A plus or minus on its own means a charge of 1. A magnesium atom loses 2 electrons, so its ion is Mg²⁺. | `ion-what-write` |

### C12-03 · choice · `understanding, guided, practice`
**Q:** An atom loses 2 electrons. What is the charge on the ion it forms?
- 0 2− · **1 2+ ✓** · 2 No charge · 3 1+
- Hint: After losing electrons, are there more protons or more electrons?
- Explanation: Losing 2 electrons leaves 2 more protons than electrons. Protons are positive, so the ion has a charge of 2+.

### C12-04 · choice · `understanding, guided, practice`
**Q:** A particle has 8 protons and 10 electrons. What is its overall charge?
- 0 2+ · 1 8− · **2 2− ✓** · 3 10−
- Hint: How many more electrons than protons are there?
- Explanation: There are 10 − 8 = 2 more electrons than protons. Electrons are negative, so the overall charge is 2−.

### C12-05 · teach "Why lose or gain electrons?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The goal: a full outer shell | Noble gas atoms have full outer shells, so they are stable. | full outer shell → stable | You met full outer shells when you learned about electronic structure. The noble gases are in Group 0 of the periodic table. Neon (2,8) and argon (2,8,8) have full outer shells, so they are very stable. When other atoms lose or gain electrons, they end up with a full outer shell too. | `ion-why-goal` |
| Sodium loses one | A sodium ion has the same electronic structure as neon. | sodium 2,8,1 → lose 1 → 2,8 like neon | A sodium atom is 2,8,1. Losing 1 electron is much easier than gaining 7 more. When its outer electron goes, the full second shell becomes the outer shell. So a sodium ion is 2,8, the same electronic structure as neon. This arrangement is called a noble gas electronic structure. | `ion-why-sodium` |
| Chlorine gains one | A chloride ion has the same electronic structure as argon. | chlorine 2,8,7 → gain 1 → 2,8,8 like argon | A chlorine atom is 2,8,7. It needs just 1 more electron to fill its outer shell. So it gains 1 electron and becomes 2,8,8. That is the same electronic structure as argon, a noble gas. So the chloride ion is stable. | `ion-why-chlorine` |
| Put it together | Metal atoms lose electrons; non-metal atoms gain them. | metal → lose → positive; non-metal → gain → negative | Metal atoms, like sodium, have only a few outer electrons. They lose them to form positive ions. Non-metal atoms, like chlorine, have nearly full outer shells. They gain electrons to form negative ions. Either way, the ion has a full outer shell like a noble gas. | `ion-why-all` |

### C12-06 · choice · `understanding, guided, practice`
**Q:** A chlorine atom (2,8,7) gains one electron to form a chloride ion. Why?
- 0 To lose its outer shell · 1 To gain a proton · 2 To become a metal · **3 To get a full outer shell, like argon ✓**
- Hint: How many more electrons does its outer shell need?
- Explanation: Chlorine’s outer shell has 7 electrons and needs 1 more to be full. After gaining 1 electron it is 2,8,8, the same electronic structure as argon, a noble gas.

### C12-07 · choice · `understanding, guided, practice`
**Q:** A sodium atom is 2,8,1. What is the electronic structure of a sodium ion?
- **0 2,8 ✓** · 1 2,8,2 · 2 2,8,1 · 3 2,7
- Hint: Sodium loses its outer electron. What is left?
- Explanation: Sodium loses the 1 electron in its third shell. That leaves 2,8, which is a full outer shell, the same as neon.

### C12-08 · choice · `understanding, guided, practice`
**Q:** What kind of ion do metal atoms form?
- 0 Negative ions, by gaining electrons · 1 Positive ions, by gaining electrons · **2 Positive ions, by losing electrons ✓** · 3 Negative ions, by losing electrons
- Hint: Think of sodium. Did it lose or gain an electron?
- Explanation: Metal atoms have only a few outer electrons, so they lose them. Losing electrons leaves more protons than electrons, so metal atoms form positive ions.

### C12-09 · teach "Which ion does each group form?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Same group, same outer shell | Elements in one group have the same number of outer electrons. | same group → same outer electrons → same charge | Elements in the same group of the periodic table have the same number of outer electrons. So they lose or gain the same number of electrons to get a full outer shell. That means they form ions with the same charge. You can read the charge from the group number. | `ion-group-table` |
| Groups 1 and 2 lose | Group 1 metals form 1+ ions; Group 2 metals form 2+ ions. | Group 1 → lose 1 → 1+; Group 2 → lose 2 → 2+ | Groups 1 and 2 are metals. Group 1 atoms have 1 outer electron, so they lose it and form 1+ ions. Group 2 atoms have 2 outer electrons. A magnesium atom (2,8,2) loses both and becomes Mg²⁺ (2,8). Its 12 protons now outnumber its 10 electrons by 2. | `ion-group-metals` |
| Groups 6 and 7 gain | Group 7 non-metals form 1− ions; Group 6 non-metals form 2− ions. | Group 7 → gain 1 → 1−; Group 6 → gain 2 → 2− | Groups 6 and 7 are non-metals. Group 7 atoms have 7 outer electrons, so they gain 1 and form 1− ions. Group 6 atoms have 6 outer electrons, so they gain 2. An oxygen atom (2,6) becomes 2,8 with a 2− charge. This ion, O²⁻, is called an oxide ion. | `ion-group-nonmetals` |
| Put it together | Read the charge from the group: 1+, 2+, 2−, 1−. | Group 1: 1+, Group 2: 2+, Group 6: 2−, Group 7: 1− | You do not need to learn the ion of every element. Find the element’s group. Group 1 forms 1+ ions, like Na⁺. Group 2 forms 2+ ions, like Mg²⁺. Group 6 forms 2− ions, like O²⁻, and Group 7 forms 1− ions, like Cl⁻. | `ion-group-all` |

### C12-10 · choice · `understanding, guided, practice`
**Q:** Lithium is in Group 1. Which ion does a lithium atom form?
- 0 Li⁻ · **1 Li⁺ ✓** · 2 Li²⁺ · 3 Li²⁻
- Hint: How many outer electrons do Group 1 atoms have?
- Explanation: Group 1 atoms have 1 outer electron, which they lose. Losing 1 electron gives a charge of 1+, so the ion is Li⁺.

### C12-11 · choice · `understanding, guided, practice`
**Q:** Fluorine is in Group 7. Which ion does a fluorine atom form?
- 0 F⁺ · 1 F²⁻ · 2 F²⁺ · **3 F⁻ ✓**
- Hint: Does a Group 7 atom lose or gain electrons, and how many?
- Explanation: Group 7 atoms have 7 outer electrons, so they gain 1 to fill the outer shell. Gaining 1 electron gives a charge of 1−, so the ion is F⁻, a fluoride ion.

### C12-12 · choice · `application, independent, independent` · visual `ion-question`
**Q:** Particle 1 is an atom. Particle 2 is the ion it forms. What happened, and what is the ion’s charge?
- **0 It gained 2 electrons, so the charge is 2− ✓** · 1 It lost 2 electrons, so the charge is 2+ · 2 It gained 2 protons, so the charge is 2+ · 3 It gained 8 electrons, so the charge is 8−
- Hint: Count the electrons in the outer shell of each particle.
- Explanation: The atom’s outer shell has 6 electrons and the ion’s has 8, so the atom gained 2 electrons. The protons did not change, so there are 2 more electrons than protons: the charge is 2−. It is a sulfur atom (2,8,6) becoming a sulfide ion.

### C12-13 · choice · `application, independent, independent`
**Q:** Potassium is in Group 1. A potassium atom has 19 protons and 19 electrons. How many electrons does a potassium ion have?
- 0 20 · 1 19 · **2 18 ✓** · 3 8
- Hint: Does a Group 1 atom lose or gain electrons, and how many?
- Explanation: Group 1 atoms lose their 1 outer electron. So a potassium ion has 19 − 1 = 18 electrons and a charge of 1+ (K⁺).

### C12-14 · choice · `dataInterpretation, independent, independent` · visual `ion-data`
**Q:** The table shows the protons and electrons in four particles. Which particle is a negative ion?
- 0 A · **1 B ✓** · 2 C · 3 D
- Hint: A negative ion has more electrons than protons.
- Explanation: Only B has more electrons (10) than protons (9), so B is a negative ion with a 1− charge. A and D have more protons than electrons, so they are positive ions. C has equal numbers, so it is an atom.

### C12-15 · choice · `understanding, independent, independent`
**Q:** Chlorine and bromine are both in Group 7. Why do they form ions with the same charge?
- 0 They have the same number of protons · 1 They are both gases · 2 They have the same number of shells · **3 They have the same number of outer electrons ✓**
- Hint: What do elements in the same group share?
- Explanation: Both atoms have 7 outer electrons, so both gain 1 electron to fill the outer shell. So both form 1− ions: chloride (Cl⁻) and bromide (Br⁻).

### C12-16 · written · teacher-reviewed
**Q:** Calcium (Group 2) is 2,8,8,2. Explain how a calcium atom becomes an ion, and why its charge is 2+.
- Hint: Say how many electrons move and which way, what the ion’s electronic structure is, and compare its protons and electrons.
- Model answer: Calcium is a metal in Group 2, so its atom has 2 outer electrons. It loses these 2 electrons. The ion is 2,8,8, a full outer shell like the noble gas argon. The number of protons stays at 20, but there are now only 18 electrons. So there are 2 more positive charges than negative charges, and the ion is Ca²⁺.
- Rubric (4): A calcium atom loses its 2 outer electrons. / The ion is 2,8,8: a full outer shell, like a noble gas (argon). / The protons do not change: 20 protons but only 18 electrons. / So there are 2 more positive than negative charges, giving 2+ (Ca²⁺).
- Reject: Saying calcium gains electrons, or gains protons. / Saying the ion has a 2− charge. / Saying calcium loses protons.
