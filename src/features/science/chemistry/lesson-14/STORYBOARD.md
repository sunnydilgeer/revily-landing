# Chemistry Lesson 14 storyboard — Covalent bonding and simple molecules

Chapter C2, Bonding, structure and properties of matter. Folder `chemistry/lesson-14`, id `C-BND-014-C`, skill `C-COVALENT`. It builds on electronic structure (full outer shells), ions and ionic bonding (electron transfer between a metal and a non-metal) and the halogens (Cl₂, Br₂, I₂ are molecules of two atoms).

Big idea: when non-metal atoms bond, neither gives an electron away. Instead they share pairs of electrons, and each shared pair is a strong covalent bond. Counting shared electrons tells you how many bonds each atom makes. A substance made of small molecules is held together only by weak forces between the molecules, so it melts and boils easily and does not conduct.

Flow note: the lesson starts with one bond and zooms out. It builds one chlorine molecule step by step, then reuses the same counting on H₂, HCl, water, ammonia and methane beside one growing table, then extends it to double and triple bonds, then compares ways of drawing a molecule, and only at the end looks at a whole substance made of molecules.
1. **How do non-metal atoms share?** Two chlorine atoms, 7 outer electrons each → shells overlap, one electron each: a shared pair → both count 8 → shared pair = covalent bond, strong → a Cl₂ molecule. Chlorine comes first because students have just seen a chlorine atom gain an electron from a metal, so "what if both atoms need one?" is the natural question.
2. **How many bonds does an atom make?** H₂ (full shell of 2) → HCl and the rule "one bond, one extra electron" → water (O needs 2) → ammonia (N needs 3) → methane (C needs 4). One table (outer electrons, needs, bonds) stays on screen and fills row by row. The rule has to exist before double bonds make sense.
3. **Can atoms share more than one pair?** O₂ (needs 2 each → two pairs, double bond) → N₂ (needs 3 each → three pairs, triple bond, kept light) → H₂, O₂, N₂ side by side.
4. **How can you draw a molecule?** Ammonia three ways: dot-and-cross (shows where electrons came from, not the shape) → displayed formula (lines; double bond two lines; shows joins, not shape) → 3D model (shape, not electrons) → choosing a drawing → molecular formula by counting (hydrogen peroxide, H₂O₂). Drawings come after the bonding rules so every drawing shows something already understood.
5. **Why do small molecules boil easily?** Liquid bromine as many Br₂ molecules ("simple molecular substance") → weak intermolecular forces between, strong covalent bond inside → boiling overcomes only the weak forces, molecules stay whole, low boiling points, mostly gases or liquids → bigger molecules (Cl₂, Br₂, I₂) have stronger forces and higher boiling points → no overall charge, so no conduction (contrasted in one clause with ionic compounds).
6. **On your own**: a numbered methane dot-and-cross (assessment view); real alkane boiling-point data read without over-claiming; a mystery substance from its melting point and conductivity; a written explanation of methane's bonding and state.

Sections:
1. Start here (C14-01): chlorine has 7 outer electrons and needs 1 more (prior knowledge from electronic structure and ions).
2. How do non-metal atoms share? (C14-02–04): 5 frames. Checks: what a covalent bond is (against transfer and ion attraction); how many electrons each Cl counts in Cl₂.
3. How many bonds does an atom make? (C14-05–07): 5 frames. Checks: nitrogen makes 3 bonds; apply the rule to sulfur (H₂S).
4. Can atoms share more than one pair? (C14-08–09): 3 frames. Check: electrons shared in O₂'s double bond (4).
5. How can you draw a molecule? (C14-10–12): 5 frames. Checks: which drawing shows where electrons came from; molecular formula of propane from its displayed formula (visual `cov-propane`).
6. Why do small molecules boil easily? (C14-13–15): 5 frames. Checks: what is overcome when chlorine boils; why oxygen does not conduct.
7. On your own (C14-16–19): numbered methane diagram; alkane data; substance X; written task on methane.

Wording rules: one new term per frame (shared pair, covalent bond, double bond, triple bond, dot-and-cross diagram, displayed formula, molecular formula, simple molecular substance, intermolecular forces); plain meaning first; other lessons referred to by topic in one clause ("When you learned about ionic bonding…", "You met chlorine, bromine and iodine in Group 7"); "overcome" rather than "break" for intermolecular forces.

Out of scope: giant covalent structures, polymers and carbon (next lesson: the book's following page); explaining covalent bonds as electrostatic attraction beyond "each nucleus pulls on the shared pair"; bond angles and the names of molecular shapes beyond "a low pyramid"; lone pairs as a term; dot-and-cross diagrams for molecules not on the page (only H₂S is asked, as a formula); the book's cartoons, jokes, worked example and exam questions.

Source boundary: supplied revision-guide pages 113–114 (scope only); AQA 8464 Chemistry 5.2.1.4 (covalent bonding, drawing small molecules, limitations of representations, molecular formula from a diagram) and 5.2.2.4 (properties of small molecules). The chlorine build, the bond-counting table, the hydrogen peroxide and propane examples, the bromine liquid/gas and circuit drawings, the halogen boiling-point line, the alkane table, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Dot-and-cross drawings put each shared pair side by side in the overlap (dot on its own atom's side) and stack extra pairs across the bond; lone pairs are drawn as pairs on the shell. The first-named atom has dots (so H is dots in HCl and H₂O, N in NH₃, C in CH₄).
- "Neither atom gives an electron away" is a Foundation simplification of why non-metals share.
- Boiling points: Cl₂ −34 °C, Br₂ 59 °C, I₂ 184 °C; methane −162, ethane −89, propane −42, butane −1 °C (butane is −0.5 °C, rounded). Iodine is labelled "solid at 20 °C" (melting point 114 °C), which the boiling-point line alone does not show.
- C14-07 (H₂S) applies the bond-counting rule to a molecule not on the page.
- The 3D ammonia model uses the element colours from the formulas lesson (N blue, H white) and is flat, without shading.

## Diagram plan
- `components/CovalentVisuals.tsx`, focus prefix `cov-`, routed by `CellBiologyVisuals.tsx`. Ink, muted and electron blue come from `atomPalette`; ball models use the formulas lesson's element colours (plus bromine red-brown, iodine lilac). Dot-and-cross: outer shells as thin ink circles, dots = first-named atom's electrons (electron blue), crosses = the other atom's (ink), overlap tinted pale blue.
- **Chlorine build** (`cov-share-need`, `-overlap`, `-count`, `-bond`, `-molecule`): two Cl atoms apart (7 each) → overlapping with the shared pair → both shells highlighted "6 + 2 = 8" → "covalent bond, strong" → bracket "chlorine molecule, Cl₂"; numbered step key on the right.
- **Bond counting** (`cov-count-h2`, `-hcl`, `-water`, `-ammonia`, `-methane`): the molecule on the left, the table (atom, outer electrons, needs, bonds) on the right with the current row highlighted and later rows faded.
- **Multiple bonds** (`cov-multi-oxygen`, `-nitrogen`, `-all`): O₂ and N₂ stacked, one highlighted at a time; then H₂, O₂, N₂ side by side with single, double, triple.
- **Drawings** (`cov-draw-dotcross`, `-displayed`, `-model`, `-compare`): three panels of ammonia, the current one highlighted with a ✓/✗ note, all notes in the compare frame. `cov-draw-formula`: H–O–O–H with atom counts → H₂O₂.
- **Substance** (`cov-prop-molecules`, `-forces`, `-boil`): a box of liquid bromine; an enlarged molecule, then two molecules with "covalent bond: very strong" and "intermolecular force: weak"; then heat → a gas box with the molecules whole. `cov-prop-size`: a temperature line with Cl₂, Br₂, I₂ at their boiling points and a room-temperature line. `cov-prop-conduct`: a cell, an unlit bulb and electrodes in liquid bromine.
- **Question visuals**: `cov-propane` (displayed formula, no formula given), `cov-question` (methane with numbers 1 shell, 2 shared pair, 3 hydrogen atom; key only outside assessment view), `cov-data` (alkane table).

## States in full

### C14-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A chlorine atom has 7 electrons in its outer shell. How many more electrons would fill that shell?
- 0 7 · **1 1 ✓** · 2 8 · 3 2
- Hint: How many electrons fill the outer shell of an atom like chlorine?
- Explanation: Chlorine’s outer shell is full with 8 electrons. It has 7, so it needs 1 more.

### C14-02 · teach "How do non-metal atoms share?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Two atoms that both need one | Two chlorine atoms each have 7 outer electrons and each need 1 more. | both non-metals → both need to gain | When you learned about ionic bonding, a chlorine atom took an electron from a metal atom. But what if two chlorine atoms meet? Each has 7 outer electrons and needs 1 more to fill its outer shell. Neither atom gives an electron away. We draw only the outer shells, with dots for one atom’s electrons and crosses for the other’s. | `cov-share-need` |
| Sharing a pair | Each atom puts one electron into the place where the two outer shells overlap. | one electron from each atom → two electrons shared | Instead, the two atoms move so close that their outer shells overlap. Each atom puts one of its electrons into the overlap. Both atoms now share these two electrons. Two electrons shared by two atoms like this are called a shared pair. | `cov-share-overlap` |
| Both atoms count the pair | Each atom counts both shared electrons in its own outer shell. | 6 not shared + 2 shared = 8 each | Each atom counts the shared pair as part of its own outer shell. So each chlorine atom has 6 electrons that are not shared, plus the 2 in the shared pair. That makes 8 each. Both outer shells are now full, so the atoms are stable. | `cov-share-count` |
| A covalent bond | The shared pair holds the two atoms together strongly. | shared pair → covalent bond → strong | The nucleus of each atom pulls on the shared pair. So the shared pair holds the two atoms together. A pair of electrons shared between two atoms is called a covalent bond. Covalent bonds are very strong. They form when non-metal atoms bond together. | `cov-share-bond` |
| Put it together: a molecule | Atoms joined by covalent bonds make a molecule. | share → count 8 → bond → molecule | You met molecules when you learned about formulas: atoms joined together in a small group. Here, two chlorine atoms are joined by one covalent bond. This is a chlorine molecule, Cl₂. Chlorine gas is made of these molecules. | `cov-share-molecule` |

### C14-03 · choice · `understanding, guided, practice`
**Q:** What is a covalent bond?
- 0 An electron moved from a metal atom to a non-metal atom · 1 The attraction between a positive ion and a negative ion · **2 A pair of electrons shared between two atoms ✓** · 3 Two atoms touching, with no electrons involved
- Hint: What did the two chlorine atoms do with one electron each?
- Explanation: In a covalent bond, each atom puts one electron into a pair that both atoms share. So a covalent bond is a shared pair of electrons. Moving electrons to make ions is ionic bonding.

### C14-04 · choice · `understanding, guided, practice`
**Q:** In a chlorine molecule, Cl₂, how many electrons does each chlorine atom count in its outer shell?
- **0 8 ✓** · 1 7 · 2 14 · 3 2
- Hint: Does each atom count the shared pair as its own?
- Explanation: Each atom has 6 outer electrons that are not shared, and it counts both electrons in the shared pair. So each atom counts 6 + 2 = 8, a full outer shell.

### C14-05 · teach "How many bonds does an atom make?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Hydrogen | Two hydrogen atoms share one pair to make a hydrogen molecule. | H has 1, full shell holds 2 → 1 bond | A hydrogen atom has only 1 electron, in its only shell. That shell is full with just 2 electrons. So two hydrogen atoms share one pair, just like chlorine. Each atom now counts 2 electrons, a full shell. This is a hydrogen molecule, H₂. | `cov-count-h2` |
| One bond, one extra electron | Each covalent bond gives an atom one extra electron to count. | electrons needed = bonds made | In hydrogen chloride, HCl, a hydrogen atom and a chlorine atom share one pair. Each covalent bond gives an atom one extra electron to count. So an atom usually makes as many bonds as the electrons it needs. Hydrogen and chlorine each need 1, so each makes 1 bond. | `cov-count-hcl` |
| Water | Oxygen needs 2 more electrons, so it makes 2 bonds. | O has 6 → needs 2 → 2 bonds | An oxygen atom has 6 outer electrons, so it needs 2 more. It makes 2 covalent bonds, one with each of two hydrogen atoms. This is a water molecule, H₂O. Now the oxygen atom counts 8 outer electrons and each hydrogen atom counts 2. | `cov-count-water` |
| Ammonia | Nitrogen needs 3 more electrons, so it makes 3 bonds. | N has 5 → needs 3 → 3 bonds | A nitrogen atom has 5 outer electrons, so it needs 3 more. It makes 3 covalent bonds with three hydrogen atoms. This is an ammonia molecule, NH₃. Count nitrogen’s outer shell: 2 electrons not shared plus 3 shared pairs makes 8. | `cov-count-ammonia` |
| Put it together: methane | Carbon needs 4 more electrons, so it makes 4 bonds. | C has 4 → needs 4 → 4 bonds | A carbon atom has 4 outer electrons, so it needs 4 more. It makes 4 covalent bonds with four hydrogen atoms. This is a methane molecule, CH₄, the main gas in natural gas. For every atom in the table, bonds made = electrons needed. | `cov-count-methane` |

### C14-06 · choice · `understanding, guided, practice`
**Q:** A nitrogen atom has 5 outer electrons. How many covalent bonds does it usually make?
- 0 5 · 1 8 · 2 2 · **3 3 ✓**
- Hint: How many more electrons does nitrogen need to reach 8?
- Explanation: Nitrogen has 5 outer electrons, so it needs 3 more to reach 8. Each covalent bond gives it one extra electron, so it makes 3 bonds, as in ammonia, NH₃.

### C14-07 · choice · `application, guided, practice`
**Q:** A sulfur atom has 6 outer electrons, like oxygen. What is the formula of the molecule sulfur makes with hydrogen?
- 0 HS · **1 H₂S ✓** · 2 H₆S · 3 H₈S
- Hint: How many bonds does oxygen make in water?
- Explanation: Sulfur has 6 outer electrons, so it needs 2 more and makes 2 covalent bonds. Each hydrogen atom makes 1 bond, so sulfur bonds with 2 hydrogen atoms: H₂S.

### C14-08 · teach "Can atoms share more than one pair?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Oxygen shares two pairs | Each oxygen atom needs 2 more electrons, so two oxygen atoms share two pairs. | needs 2 → share 2 pairs → double bond | Oxygen gas is made of O₂ molecules. Each oxygen atom has 6 outer electrons and needs 2 more. So each atom puts 2 electrons into the overlap, and the atoms share two pairs. Two shared pairs between the same two atoms are called a double bond. | `cov-multi-oxygen` |
| Nitrogen shares three pairs | Each nitrogen atom needs 3 more electrons, so two nitrogen atoms share three pairs. | needs 3 → share 3 pairs → triple bond | Nitrogen gas is made of N₂ molecules. Each nitrogen atom has 5 outer electrons and needs 3 more. So the two atoms share three pairs. This is called a triple bond. Each atom counts 2 electrons not shared plus 6 shared, which makes 8. | `cov-multi-nitrogen` |
| Put it together | Two atoms share as many pairs as each atom needs electrons. | 1 pair single, 2 pairs double, 3 pairs triple | Hydrogen atoms each need 1 electron, so H₂ has one shared pair, a single bond. Oxygen atoms need 2, so O₂ has a double bond. Nitrogen atoms need 3, so N₂ has a triple bond. In every case, each atom ends up with a full outer shell. | `cov-multi-all` |

### C14-09 · choice · `understanding, guided, practice`
**Q:** How many electrons are shared between the two atoms in an oxygen molecule, O₂?
- 0 2 · 1 8 · **2 4 ✓** · 3 6
- Hint: How many shared pairs make a double bond?
- Explanation: An oxygen molecule has a double bond: two shared pairs. Each pair is 2 electrons, so 4 electrons are shared.

### C14-10 · teach "How can you draw a molecule?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Dot-and-cross diagram | Dots and crosses show which atom each electron came from. | dots and crosses → where the electrons came from | The drawings so far are called dot-and-cross diagrams. Here is ammonia drawn this way. The shared pairs sit where the shells overlap. Dots and crosses show which atom each bonding electron came from. But the drawing does not show the real shape of the molecule or the sizes of the atoms. | `cov-draw-dotcross` |
| Displayed formula | Each covalent bond is drawn as a line between two symbols. | one line = one covalent bond | A quicker drawing shows each atom as its symbol and each covalent bond as a line. This is called a displayed formula. A double bond is two lines, like O=O. It clearly shows which atoms are joined, even in big molecules. But it does not show the shape, or where the electrons came from. | `cov-draw-displayed` |
| 3D model | A model shows how the atoms are arranged in space. | balls and sticks → shape in space | A 3D model shows atoms as balls and covalent bonds as sticks. It shows how the atoms are arranged in space. Ammonia is shaped like a low pyramid, with nitrogen at the top. But models of big molecules can be confusing. They do not show where the electrons in each bond came from. | `cov-draw-model` |
| Choosing a drawing | Each drawing shows some things and hides others. | electrons → dot-and-cross; joins → displayed; shape → 3D | No drawing shows everything. Use a dot-and-cross diagram to show where the bonding electrons came from. Use a displayed formula to show which atoms are joined. Use a 3D model to show the shape. | `cov-draw-compare` |
| Molecular formula | Count the atoms of each element in one molecule to write its formula. | count each kind of atom → formula | You can find a molecule’s formula from any of these drawings. Count the atoms of each element. This hydrogen peroxide molecule has 2 hydrogen atoms and 2 oxygen atoms, so its formula is H₂O₂. A formula showing the number of atoms of each element in one molecule is called a molecular formula. | `cov-draw-formula` |

### C14-11 · choice · `understanding, guided, practice`
**Q:** Which drawing shows which atom each electron in a covalent bond came from?
- **0 A dot-and-cross diagram ✓** · 1 A displayed formula · 2 A 3D model · 3 A molecular formula
- Hint: Which drawing uses two different marks for electrons?
- Explanation: A dot-and-cross diagram uses dots for one atom’s electrons and crosses for the other atom’s. So it shows where the bonding electrons came from. Lines, balls and formulas do not show electrons at all.

### C14-12 · choice · `understanding, guided, practice` · visual `cov-propane`
**Q:** The displayed formula shows a propane molecule. What is its molecular formula?
- 0 CH₃ · 1 C₈H₃ · 2 C₃H₄ · **3 C₃H₈ ✓**
- Hint: Count every C, then count every H.
- Explanation: There are 3 carbon atoms and 8 hydrogen atoms in the molecule. So the molecular formula is C₃H₈: each symbol followed by its number of atoms.

### C14-13 · teach "Why do small molecules boil easily?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A substance made of molecules | Liquid bromine is made of a huge number of separate Br₂ molecules. | many small molecules → simple molecular substance | Bromine is a liquid at room temperature. A bottle of it holds a huge number of Br₂ molecules. Each molecule is just two atoms joined by a covalent bond. Water, ammonia and methane are also made of small molecules. A substance made of small molecules is called a simple molecular substance. | `cov-prop-molecules` |
| Weak forces between molecules | The forces between molecules are much weaker than the covalent bonds inside them. | strong inside, weak between | Inside each molecule, the covalent bond is very strong. There are also forces pulling the molecules towards each other. These forces are very weak. Forces between molecules are called intermolecular forces. | `cov-prop-forces` |
| Boiling | When bromine boils, the molecules move apart but each one stays whole. | boil → overcome weak forces only → low boiling point | To boil bromine, you only need to overcome the weak intermolecular forces. The covalent bonds do not break, so each Br₂ molecule stays whole. This takes little energy, so bromine boils at only 59 °C. Simple molecular substances have low melting and boiling points. Most are gases or liquids at room temperature. | `cov-prop-boil` |
| Bigger molecules | Bigger molecules have stronger intermolecular forces, so they boil at higher temperatures. | bigger molecule → stronger forces → higher boiling point | You met chlorine, bromine and iodine in Group 7. All three are made of molecules with two atoms, but the molecules get bigger from chlorine to iodine. Bigger molecules have stronger intermolecular forces. More energy is needed to overcome them, so the boiling point is higher. At room temperature chlorine is a gas, bromine a liquid and iodine a solid. | `cov-prop-size` |
| No charge, no current | Simple molecular substances do not conduct electricity. | no overall charge → nothing to carry a current | To conduct electricity, a substance needs charged particles that can move. Molecules have no overall electric charge. So simple molecular substances do not conduct electricity, even as liquids. Ionic compounds are different: they conduct when melted or dissolved, because their ions can move. | `cov-prop-conduct` |

### C14-14 · choice · `understanding, guided, practice`
**Q:** Chlorine boils at −34 °C. What happens to chlorine molecules as it boils?
- 0 The covalent bond inside each molecule breaks · **1 The weak forces between the molecules are overcome ✓** · 2 The molecules turn into ions · 3 The molecules get smaller
- Hint: Do the Cl₂ molecules stay whole in the gas?
- Explanation: When chlorine boils, the Cl₂ molecules move apart but each one stays whole. So only the weak intermolecular forces are overcome. The strong covalent bonds do not break.

### C14-15 · choice · `understanding, guided, practice`
**Q:** Oxygen, O₂, is a simple molecular substance. Why does it not conduct electricity?
- 0 Its covalent bonds are too strong · 1 Its ions cannot move · **2 Its molecules have no overall charge ✓** · 3 Its molecules are too far apart
- Hint: What does a substance need in order to carry a current?
- Explanation: A current needs charged particles that can move. Oxygen molecules have no overall electric charge, so oxygen cannot conduct.

### C14-16 · choice · `understanding, independent, independent` · visual `cov-question`
**Q:** The dot-and-cross diagram shows a methane molecule. Which number points to one covalent bond?
- 0 1 · **1 2 ✓** · 2 3
- Hint: Which part is a pair of electrons shared by two atoms?
- Explanation: A covalent bond is a shared pair of electrons, drawn where two outer shells overlap. So number 2, the dot and cross between carbon and hydrogen, is one covalent bond.

### C14-17 · choice · `dataInterpretation, independent, independent` · visual `cov-data`
**Q:** The table shows four simple molecular substances. Which conclusion does the data support?
- **0 In these four, bigger molecules have higher boiling points ✓** · 1 Methane has the strongest intermolecular forces of the four · 2 Butane is a liquid at 20 °C · 3 Boiling breaks the covalent bonds in these molecules
- Hint: Compare the number of atoms with the boiling point, row by row.
- Explanation: The boiling point rises from −162 °C for methane to −1 °C for butane as the molecules get bigger. So the data supports bigger molecules having higher boiling points in these four. All four boil below 20 °C, so all are gases at 20 °C.

### C14-18 · choice · `application, independent, independent`
**Q:** Substance X melts at −95 °C and does not conduct electricity as a liquid. What is X most likely made of?
- 0 Positive and negative ions in a giant lattice · 1 A metal · 2 Ions that are free to move · **3 Small molecules with weak forces between them ✓**
- Hint: Which kind of substance has a low melting point and no charged particles?
- Explanation: A low melting point means only weak forces hold the particles together. No conduction means no charged particles can move. So X is most likely a simple molecular substance: small molecules with weak intermolecular forces.

### C14-19 · written · teacher-reviewed
**Q:** Methane, CH₄, is in natural gas. Explain how its atoms are held together and why it is a gas at room temperature.
- Hint: Say what the atoms share, how strong those bonds are, and what has to be overcome for methane to boil.
- Model answer: The carbon atom shares a pair of electrons with each of the four hydrogen atoms. Each shared pair is a covalent bond, and these bonds are strong. Methane is made of small molecules. The intermolecular forces between the molecules are weak, so little energy is needed to overcome them. So methane has a very low boiling point and is a gas at room temperature.
- Rubric (4): The carbon and hydrogen atoms share pairs of electrons: four covalent bonds. / The covalent bonds inside each molecule are strong. / The intermolecular forces between methane molecules are weak. / Little energy is needed to overcome these weak forces, so the boiling point is low and methane is a gas at room temperature.
- Reject: Saying the covalent bonds break when methane boils. / Saying methane is made of ions, or that electrons are transferred. / Saying the forces between the molecules are strong.
