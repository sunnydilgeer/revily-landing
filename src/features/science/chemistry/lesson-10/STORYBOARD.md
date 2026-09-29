# Chemistry Lesson 10 storyboard — Group 7: the halogens

Chapter C1b, The periodic table. Folder `chemistry/lesson-10`, id `C-PER-010-C`, skill `C-HALOGENS`. It builds on electronic structure (2,8,7), ions (from the atoms lesson), molecules and balanced equations (from the compounds lesson) and the modern periodic table's groups.

Big idea: every halogen atom has 7 outer electrons, so all the halogens react in the same way, by gaining (or sharing) one electron. Further down the group the outer shell is further from the nucleus, so that electron is harder to gain: reactivity falls while mass and melting/boiling points rise. The reactivity order decides which halogen can displace which from a salt.

Flow note: the route goes from what a halogen *is* to what it *does*, then how that changes down the group, and finally the reaction that uses the whole order.
1. **What are the halogens?** Where Group 7 is → 7 outer electrons (the reason they are alike) → pairs of atoms, Cl₂ → what they look like at room temperature (gas, gas, liquid, solid), which sets up the melting-point trend.
2. **What do halogens make?** Gaining one electron → halide ions (-ine → -ide) → halide salts with metals (ionic) → sharing with non-metals (covalent, HCl) → put it together. It comes before the trends because the reactivity explanation needs "gains one electron".
3. **What changes down the group?** Relative atomic mass → boiling points (with states at room temperature) → reactivity falls ("trend") → why (outer shell further from the nucleus, weaker pull on the incoming electron) → put it together and predict astatine. One column of tiles stays on the left; only the right-hand panel changes.
4. **Which halogen wins?** Chlorine water turns potassium bromide orange → chlorine takes bromine's place (displacement) → word and balanced symbol equation → no swap the other way → results grid and the rule. Last, because it needs both the reactivity order and halide salts.
5. **On your own**: four numbered tubes (assessment view hides the results); predict iodine's melting point from three values (estimate, not exact); identify a mystery halogen from two tests; written explanation of a displacement result.

Sections:
1. Start here (C10-01): chlorine 2,8,7 → outer shell 7 (prior knowledge from electronic structure).
2. What are the halogens? (C10-02–04): Group 7 → 7 outer electrons → Cl₂ → appearance. Checks: why they react alike; what chlorine gas is made of.
3. What do halogens make? (C10-05–08): Cl → Cl⁻ → halide names → NaCl dot-and-cross → HCl dot-and-cross → summary. Checks: bromide ion; covalent bond in hydrogen bromide; naming potassium iodide.
4. What changes down the group? (C10-09–12): mass → boiling points → reactivity → why → predict. Checks: most reactive; why bromine is less reactive than chlorine; astatine's reactivity (prediction).
5. Which halogen wins? (C10-13–15): chlorine + potassium bromide → swap → equation → bromine + potassium chloride (no reaction) → grid. Checks: chlorine + potassium iodide; iodine + potassium bromide.
6. On your own (C10-16–19): tubes; melting points; mystery halogen; written task.

Wording rules: one new term per frame (halogens, molecule is recalled, halide ions, ionic compound, covalent bond, trend, displacement reaction); plain meaning first; other lessons referred to by topic in one clause ("You met ions when you learned about atoms"); ionic and covalent bonding are named only as far as the page needs, with a hand-on ("You will learn more about both kinds of bond later").

Out of scope: dot-and-cross drawing as a skill (later bonding lessons teach it; here it is shown once for NaCl and HCl, as on the page); ionic lattices and properties of ionic or covalent substances; intermolecular forces by name (one plain sentence only: bigger molecules attract each other more strongly); half equations, oxidation and reduction (Higher/Chemistry-only); the reactions of halogens with iron wool or hydrogen as practicals; fluorine in displacement reactions (it reacts with water); uses of halogens; the book's jokes, figures and exam question.

Source boundary: supplied revision-guide page 107 (scope only); AQA 8464 Chemistry 5.1.2.6 (with 5.1.1.7 electronic structure). All wording, examples (bromine + metal, hydrogen bromide, potassium iodide, astatine prediction, the four tubes, the mystery halogen), questions and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Relative atomic masses as on the page (F 19, Cl 35.5, Br 80, I 127, At 210). The spec says "relative molecular mass" goes up; the lesson uses relative atomic mass, which follows the same trend.
- Melting and boiling points rounded to whole degrees (F −220/−188, Cl −101/−34, Br −7/59, I 114/184 °C). Iodine's colour is given as dark grey (solid) and brown (in water); some texts say iodine solution is yellow-brown or orange-brown.
- The reactivity explanation ("outer shell further from the nucleus, so harder to gain an electron") is on the page and taught at Foundation; the "more shells" sentence is kept deliberately plain. Shielding is not mentioned.
- The boiling-point explanation says only that bigger molecules attract each other more strongly (the page defers it to Group 0).
- Astatine is predicted from the trend (solid, less reactive than iodine); its real properties are poorly known, so the lesson only says "should be".
- C10-17 asks for an estimate ("about 110 °C"; real 114 °C) from a steady trend; the explanation says the trend only gives an estimate.
- Chlorine water is described as pale green; in practice it can look almost colourless.

## Diagram plan
- `components/HalogenVisuals.tsx`, focus prefix `hal-`, routed by `CellBiologyVisuals.tsx`. Chemistry palette from AtomVisuals; halogen tiles, molecules and halide ions use the blue family tint of the halogens from PeriodicVisuals; positive ions the pale coral proton tint; coral red marks reactivity and the frame's key change. Real substance colours (pale yellow, pale green, red-brown, orange, brown, dark grey) appear only where the colour is the evidence.
- **Group** (`hal-group`): simplified periodic table with Group 7 highlighted and enlarged into five tiles with Ar values.
- **Atoms** (`hal-outer`, `hal-ion`, `hal-trend-why`): Lesson 1/6-style Bohr atoms (blue electrons on thin shells, coral nucleus disc with the symbol) with the outer shell highlighted and a dashed empty place; Cl → [Cl]⁻ with brackets, charge and the gained electron ringed; F v Cl with the incoming electron and the nucleus-to-outer-shell distance.
- **Molecules and appearance** (`hal-molecule`, `hal-looks`): gas jar of Cl₂ pairs with a zoomed molecule; four jars at room temperature.
- **Compounds** (`hal-halides`, `hal-salt`, `hal-share`, `hal-both`): four halide ion cards; NaCl dot-and-cross (sodium dots, chlorine crosses, full shells, brackets); HCl outer-shell dot-and-cross; two-branch summary.
- **Trends** (`hal-trend-mass`, `-bp`, `-react`, `-all`): the same F/Cl/Br/I column with a changing right-hand panel: Ar bars, boiling points on a temperature axis with room temperature, reactivity bars (order only), then wedges for the three trends and the astatine prediction.
- **Displacement** (`hal-disp-mix`, `-swap`, `-equation`, `-none`, `-rule`): dropper and tubes; before/after particle picture (Cl₂ + 2 K⁺Br⁻ → Br₂ + 2 K⁺Cl⁻); equation with colour chips and an atom check; bromine + potassium chloride with no change; results grid.
- **Question visuals**: `hal-q-tubes` (numbered tubes; assessment view shows only what is mixed, the results appear after answering) and `hal-q-melt` (melting points with iodine shown as "? °C" in assessment view).

## States in full

### C10-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A chlorine atom has the electronic structure 2,8,7. How many electrons are in its outer shell?
- 0 2 · 1 8 · **2 7 ✓** · 3 17
- Hint: Which number is the last shell?
- Explanation: The numbers list the shells from the nucleus outwards: 2, then 8, then 7. So the outer shell, the last one, holds 7 electrons. 17 is the total.

### C10-02 · teach "What are the halogens?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Group 7 | Group 7 is a column of non-metals near the right of the periodic table. | Group 7 → the halogens | Group 7 is the column one place in from the right-hand edge of the periodic table. From the top, it holds fluorine, chlorine, bromine, iodine and astatine. They are all non-metals. The elements in Group 7 are called the halogens. | `hal-group` |
| Seven outer electrons | Every halogen atom has 7 electrons in its outer shell. | 7 outer electrons → similar reactions | Fluorine is 2,7 and chlorine is 2,8,7. So both have 7 electrons in their outer shell, and so do bromine and iodine. The outer electrons decide how an element reacts. So all the halogens react in similar ways. | `hal-outer` |
| Pairs of atoms | Halogen atoms join up in pairs to make molecules. | two atoms joined → one molecule, Cl₂ | You met molecules when you learned about compounds. In a halogen, two atoms of the same element join together. So chlorine gas is made of chlorine molecules, written Cl₂. The small 2 means two atoms. Fluorine, bromine and iodine are the same: F₂, Br₂ and I₂. | `hal-molecule` |
| What they look like | At room temperature, the halogens go from gases to a liquid to a solid. | gas, gas, liquid, solid | At room temperature, fluorine is a pale yellow gas and chlorine is a pale green gas. Chlorine is poisonous, so it is only used in small amounts, with care. Bromine is a red-brown liquid. Iodine is a dark grey solid. | `hal-looks` |

### C10-03 · choice · `understanding, guided, practice`
**Q:** Why do all the halogens react in similar ways?
- **0 They all have 7 electrons in their outer shell ✓** · 1 They all have the same relative atomic mass · 2 They are all gases at room temperature · 3 They all have 7 shells of electrons
- Hint: What decides how an element reacts?
- Explanation: The outer electrons decide how an element reacts. Every halogen atom has 7 outer electrons, so they all react in similar ways.

### C10-04 · choice · `understanding, guided, practice`
**Q:** What is chlorine gas made of?
- 0 Single chlorine atoms, each on its own · **1 Molecules made of two chlorine atoms, Cl₂ ✓** · 2 Molecules made of seven chlorine atoms · 3 Chloride ions with a 1− charge
- Hint: What does the small 2 in Cl₂ mean?
- Explanation: In a halogen, two atoms of the same element join together. So chlorine gas is made of Cl₂ molecules, each with two chlorine atoms.

### C10-05 · teach "What do halogens make?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Gaining one electron | With a metal, a halogen atom gains one electron. | 7 outer electrons + 1 → full outer shell, 1− charge | A chlorine atom has 7 outer electrons, so it needs one more for a full outer shell. When chlorine reacts with a metal, each chlorine atom takes one electron from the metal. Now it has 17 protons but 18 electrons. So it becomes an ion with a 1− charge, written Cl⁻. You met ions when you learned about atoms. | `hal-ion` |
| Halide ions | The 1− ions of the halogens are called halide ions. | -ine → -ide | Every halogen forms an ion with a 1− charge in the same way. The name changes its ending from -ine to -ide. So fluorine forms fluoride, F⁻, chlorine forms chloride, Cl⁻, bromine forms bromide, Br⁻, and iodine forms iodide, I⁻. Together, these are called halide ions. | `hal-halides` |
| Halide salts | A metal and a halogen make an ionic compound. | metal + halogen → metal halide (made of ions) | Sodium reacts with chlorine to make sodium chloride, a white solid. Each sodium atom gives its outer electron to a chlorine atom. That makes a sodium ion, Na⁺, and a chloride ion, Cl⁻. A compound made of ions like this is called an ionic compound. Sodium chloride is one of the halide salts. | `hal-salt` |
| Sharing with non-metals | With a non-metal, a halogen shares electrons instead. | non-metal + halogen → share a pair → covalent bond | Hydrogen is a non-metal, so it does not give its electron away. Instead, a hydrogen atom and a chlorine atom share a pair of electrons. Now both have a full outer shell. A bond made by sharing a pair of electrons is called a covalent bond. Hydrogen chloride, HCl, is made of small molecules like this. | `hal-share` |
| Put it together | Either way, the halogen atom ends up with a full outer shell. | metal → ions; non-metal → shared pair | With a metal, a halogen atom gains one electron and becomes a halide ion. The product is an ionic halide salt, such as sodium chloride. With a non-metal, a halogen atom shares a pair of electrons. The product is made of small molecules, such as hydrogen chloride. You will learn more about both kinds of bond later. | `hal-both` |

### C10-06 · choice · `understanding, guided, practice`
**Q:** Bromine reacts with a metal. Which ion does each bromine atom form?
- 0 Br⁺, by losing one electron · **1 Br⁻, a bromide ion, by gaining one electron ✓** · 2 Br²⁻, by gaining two electrons · 3 Br₂, a bromine molecule
- Hint: How many electrons does a halogen atom need for a full outer shell?
- Explanation: A bromine atom has 7 outer electrons, so it gains one electron from the metal. So it becomes a bromide ion with a 1− charge, Br⁻.

### C10-07 · choice · `understanding, guided, practice`
**Q:** Hydrogen reacts with bromine to make hydrogen bromide. What holds the two atoms together?
- 0 Ions made when hydrogen gives its electron away · 1 Nothing: the two elements are just mixed · 2 Two extra electrons taken from bromine · **3 A shared pair of electrons: a covalent bond ✓**
- Hint: Is hydrogen a metal or a non-metal?
- Explanation: Hydrogen is a non-metal, so it shares electrons with the halogen instead of giving one away. So the atoms are held by a shared pair of electrons, a covalent bond.

### C10-08 · choice · `understanding, guided, practice`
**Q:** Potassium reacts with iodine. What is the product called?
- 0 potassium iodine · 1 iodine potassium · **2 potassium iodide ✓** · 3 potassium iodate
- Hint: How does the ending of a halogen’s name change in its compound?
- Explanation: Iodine gains an electron from potassium and becomes an iodide ion. So the product is potassium iodide: -ine changes to -ide.

### C10-09 · teach "What changes down the group?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Heavier atoms | Relative atomic mass goes up down the group. | down the group → heavier, bigger atoms | Going down Group 7, each atom has more protons, neutrons and electrons. So the relative atomic mass goes up: fluorine 19, chlorine 35.5, bromine 80 and iodine 127. Each atom also has more shells, so the atoms get bigger. | `hal-trend-mass` |
| Higher boiling points | Melting and boiling points go up down the group. | bigger molecules → higher melting and boiling points | Chlorine boils at −34 °C, but bromine boils at 59 °C and iodine at 184 °C. Bigger molecules attract each other more strongly, so more heating is needed to separate them. So melting and boiling points go up down the group. That is why bromine is a liquid and iodine is a solid at room temperature. | `hal-trend-bp` |
| Less reactive | Reactivity goes down down the group. | further down → less reactive | Fluorine is the most reactive halogen. Chlorine is a little less reactive, and bromine less again. Iodine is the least reactive of these four. A pattern that changes steadily down a group like this is called a trend. | `hal-trend-react` |
| Why reactivity falls | Lower halogens find it harder to gain an electron. | outer shell further from nucleus → weaker pull → less reactive | When a halogen reacts, each atom gains one electron into its outer shell. The positive nucleus pulls that electron in. Further down the group, the outer shell is further from the nucleus. So the pull is weaker, the atom gains an electron less easily, and it is less reactive. | `hal-trend-why` |
| Put it together | You can use the trends to predict properties. | follow the trend → predict astatine | Down Group 7, relative atomic mass goes up, melting and boiling points go up, and reactivity goes down. You can use these trends to predict. Astatine is below iodine, and iodine is already a solid. So astatine should have an even higher melting point and be a solid at room temperature too. | `hal-trend-all` |

### C10-10 · choice · `understanding, guided, practice`
**Q:** Which of these halogens is the most reactive?
- 0 Iodine · 1 Bromine · 2 Chlorine · **3 Fluorine ✓**
- Hint: Does reactivity go up or down as you go down Group 7?
- Explanation: Reactivity goes down as you go down Group 7. Fluorine is at the top, so it is the most reactive.

### C10-11 · choice · `understanding, guided, practice`
**Q:** Why is bromine less reactive than chlorine?
- **0 Its outer shell is further from the nucleus, so it gains an electron less easily ✓** · 1 It has fewer electrons in its outer shell · 2 It is a liquid, so it cannot react · 3 Its atoms are lighter than chlorine atoms
- Hint: How far is bromine’s outer shell from its nucleus?
- Explanation: Bromine is below chlorine, so its outer shell is further from the nucleus. So the nucleus pulls on a new electron less strongly, and bromine gains an electron less easily.

### C10-12 · choice · `understanding, guided, practice`
**Q:** Astatine is below iodine in Group 7. How reactive do you predict it is?
- 0 More reactive than fluorine · **1 Less reactive than iodine ✓** · 2 Exactly as reactive as chlorine · 3 Not reactive at all
- Hint: Which way does reactivity change down the group?
- Explanation: Reactivity goes down as you go down Group 7. Astatine is below iodine, so it should be less reactive than iodine. It is still a halogen, so it can still react.

### C10-13 · teach "Which halogen wins?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A halogen meets a salt | Chlorine water turns potassium bromide solution orange. | pale green + colourless → orange | Potassium bromide is a halide salt, and its solution in water is colourless. Chlorine water is chlorine dissolved in water. When a little chlorine water is added, the mixture turns orange. Orange is the colour of bromine dissolved in water. So bromine has been made. | `hal-disp-mix` |
| Taking its place | The more reactive chlorine pushes bromine out of the salt. | more reactive halogen takes the place of the less reactive one | Chlorine is more reactive than bromine. So chlorine takes bromine’s place in the salt. The chlorine becomes chloride ions, and the bromide ions become bromine. A reaction like this, where a more reactive element pushes a less reactive one out of its compound, is called a displacement reaction. | `hal-disp-swap` |
| The equation | Chlorine and potassium bromide make bromine and potassium chloride. | Cl₂ + 2KBr → Br₂ + 2KCl | The word equation is chlorine + potassium bromide → bromine + potassium chloride. The balanced symbol equation is Cl₂ + 2KBr → Br₂ + 2KCl. Check it: there are 2 chlorine, 2 potassium and 2 bromine atoms on each side. | `hal-disp-equation` |
| No swap the other way | A less reactive halogen cannot displace a more reactive one. | less reactive halogen → no reaction | Now add bromine water to potassium chloride solution. Bromine is less reactive than chlorine, so it cannot take chlorine’s place. Nothing happens. The mixture is just the colour of the bromine water that was added. | `hal-disp-none` |
| Put it together | A halogen displaces the halogens below it in the group. | higher in Group 7 → displaces the ones below | Chlorine displaces bromine and iodine from their salts. Bromine displaces iodine, but not chlorine. Iodine displaces neither. When iodine is made in water, the solution turns brown. So a halogen can only displace a halogen that is lower down Group 7. | `hal-disp-rule` |

### C10-14 · choice · `understanding, guided, practice`
**Q:** Chlorine water is added to potassium iodide solution. What happens?
- 0 Nothing, because chlorine is less reactive than iodine · **1 Iodine is displaced, so the solution turns brown ✓** · 2 Chlorine is displaced, so the solution turns green · 3 Bromine is made, so the solution turns orange
- Hint: Is chlorine above or below iodine in Group 7?
- Explanation: Chlorine is more reactive than iodine, so it takes iodine’s place in the salt. So iodine is made, and the solution turns brown.

### C10-15 · choice · `understanding, guided, practice`
**Q:** Iodine solution is added to potassium bromide solution. Why is there no reaction?
- **0 Iodine is less reactive than bromine ✓** · 1 Iodine is more reactive than bromine · 2 Potassium bromide is not a salt · 3 Iodine and bromine are in different groups
- Hint: Which is higher up Group 7?
- Explanation: Iodine is below bromine in Group 7, so it is less reactive. So iodine cannot take bromine’s place, and nothing happens.

### C10-16 · choice · `application, independent, independent` · visual `hal-q-tubes`
**Q:** Each tube mixes a halogen solution with a salt solution. In which two tubes does a displacement reaction happen?
- 0 Tubes 1 and 2 · 1 Tubes 2 and 4 · 2 Tubes 3 and 4 · **3 Tubes 1 and 3 ✓**
- Hint: In each tube, is the halogen added higher up Group 7 than the one in the salt?
- Explanation: Chlorine and bromine are both more reactive than iodine, so they displace iodine in tubes 1 and 3. Iodine and bromine are less reactive than chlorine, so tubes 2 and 4 show no reaction.

### C10-17 · choice · `dataInterpretation, independent, independent` · visual `hal-q-melt`
**Q:** The chart shows the melting points of three halogens. Which is the best prediction for iodine’s melting point?
- 0 About −150 °C · 1 About −50 °C · 2 Exactly −7 °C · **3 About 110 °C ✓**
- Hint: Which way do the melting points go down the group, and by roughly how much each step?
- Explanation: The melting points go up down the group: −220 °C, −101 °C, −7 °C, rising about 100 °C each step. So iodine’s should be roughly 100 °C higher than bromine’s. It is really 114 °C, but the trend only gives an estimate.

### C10-18 · choice · `application, independent, independent`
**Q:** A halogen solution turns sodium iodide solution brown, but it does not change sodium bromide solution. Which halogen is it?
- 0 Chlorine · 1 Iodine · **2 Bromine ✓** · 3 Fluorine
- Hint: It displaces iodine but not bromine. Where must it sit in Group 7?
- Explanation: It displaces iodine, so it must be above iodine in Group 7. It does not displace bromine, so it is not chlorine. So it is bromine.

### C10-19 · written · teacher-reviewed
**Q:** Chlorine water turns potassium bromide solution orange, but iodine solution does not react with it. Explain why.
- Hint: Compare how reactive chlorine, bromine and iodine are, say what is displaced, and use the outer shell to explain the order.
- Model answer: Chlorine is more reactive than bromine because it is higher up Group 7. So chlorine displaces bromine from potassium bromide: it takes bromine’s place and bromine is made, which is orange. Iodine is lower down the group than bromine, so it is less reactive and cannot displace it. Reactivity goes down the group because the outer shell is further from the nucleus, so the atom gains an electron less easily.
- Rubric (4): Chlorine is more reactive than bromine (it is higher up Group 7). / So chlorine displaces bromine from the salt: bromine is made, which is why the solution turns orange. / Iodine is less reactive than bromine, so it cannot displace bromine and there is no reaction. / Lower halogens are less reactive because the outer shell is further from the nucleus, so they gain an electron less easily.
- Reject: Saying iodine is more reactive than bromine or chlorine. / Saying the orange colour is chlorine or potassium bromide. / Saying halogens react by losing electrons.
