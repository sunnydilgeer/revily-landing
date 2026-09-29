# Chemistry Lesson 13 storyboard — Ionic bonding and ionic compounds

Chapter C2, Bonding, structure and properties of matter. Folder `chemistry/lesson-13`, id `C-BND-013-C`, skill `C-IONIC-BONDING`. It builds on how ions form (the previous lesson: metals lose electrons, non-metals gain them, charges from Groups 1, 2, 6 and 7) and on electronic structure.

Big idea: when a metal reacts with a non-metal, electrons move from the metal atoms to the non-metal atoms. The oppositely charged ions formed attract each other strongly (ionic bonds, acting in all directions), so they build a giant ionic lattice. That lattice explains the formula (the simplest ratio of ions) and the properties (high melting points; conducts only when the ions can move).

Flow note: the lesson follows one pair of atoms, sodium and chlorine, and then zooms out.
1. **How do ions stick together?** Sodium atom and chlorine atom → electron transfer → two ions with full outer shells → opposite charges attract (electrostatic force) → ionic bond, ionic compound. The same two-row drawing is built up frame by frame. The bond has to exist before it can be drawn.
2. **How do you draw it?** The same NaCl drawing, now read as a dot and cross diagram (dots from sodium, crosses from chlorine) → brackets and charges → outer shells only for MgO → MgCl₂ (one metal atom, two non-metal atoms) → what the diagram leaves out. The last frame (no size, no arrangement) is the bridge to the lattice.
3. **What does salt look like inside?** One layer of the giant ionic lattice → bonds in all directions → ball-and-stick model → space-filling model, each with what it shows and misses.
4. **How do you find the formula?** Count ions in the ball-and-stick model (9 : 9 → 1 : 1 → NaCl, empirical formula) → balance charges (K⁺ and O²⁻ → K₂O). Worked example in the frames → guided practice with new ions (CaCl₂) → independent item (Li₂S).
5. **Why is salt hard to melt?** Many strong bonds → high melting point (801 °C) → solid does not conduct (ions fixed) → molten conducts → solution conducts → summary, with a hand-on to covalent bonding. Properties come last because they are explained by the lattice.
6. **On your own**: lithium oxide dot and cross (numbered, assessment view hides the key), invented data for four substances read without over-claiming, lithium sulfide formula (calculation), a written explanation.

Sections:
1. Start here (C13-01): table salt is made from a metal and a non-metal (prior knowledge from the modern periodic table).
2. How do ions stick together? (C13-02–04): checks on the direction of transfer and on what holds the ions together.
3. How do you draw it? (C13-05–07): checks on what the dots mean in MgO and on what the diagram does not show.
4. What does salt look like inside? (C13-08–10): checks on bonds in all directions and on choosing the space-filling model.
5. How do you find the formula? (C13-11–12): guided calculation CaCl₂.
6. Why is salt hard to melt? (C13-13–15): checks on why the solid does not conduct and why the melting point is high.
7. On your own (C13-16–19).

Wording rules: one new term per frame (electron transfer, electrostatic force, ionic bond/ionic compound, dot and cross diagram, giant ionic lattice, ball-and-stick model, space-filling model, empirical formula, molten); plain meaning first; other lessons by topic only ("You met ions when you learned how ions form"; "Next, you will see how non-metal atoms bond … by sharing electrons").

Out of scope: covalent and metallic bonding (next lessons); why ions form in detail (previous lesson); electrolysis products; the Higher-tier limitations of models beyond those on the page; lattice energies; charges beyond Groups 1, 2, 6 and 7; the book's cartoons, jokes, worked example questions (KBr, magnesium sulfide lattice) and artwork.

Source boundary: supplied revision-guide pages 111–112 (scope only); AQA 8464 Chemistry 5.2.1.2 Ionic bonding, 5.2.1.3 Ionic compounds, 5.2.2.3 Properties of ionic compounds. The NaCl walkthrough drawing, the lattice layer, the models, the charge tiles, the circuit, the calcium chloride, lithium oxide, lithium sulfide and four-substance examples, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Mg²⁺ and Li⁺ in outer-shell-only diagrams are drawn as the symbol in brackets with no electrons (the emptied outer shell is not drawn), as the revision page does. Some mark schemes also accept a full shell of eight; the lesson does not say either is wrong.
- The lattice layer and melting-point drawing show "bonds" as lines between neighbours for clarity; the frame text says the attraction acts in all directions, including above and below the layer.
- The ball-and-stick model draws both ions the same size, so the "does not show the sizes" point is true of the drawing. The space-filling model uses a Cl⁻ : Na⁺ radius ratio of about 1.7 (real ratio about 1.8).
- Sodium chloride's melting point (801 °C) is a real value added for concreteness; it is not on the page.
- The circuit shows positive ions drifting to the negative electrode and negative ions to the positive one. Electrolysis products are not mentioned.
- C13-17 data are invented: A 770 °C (ionic-like), B −95 °C and D 44 °C (simple molecular-like), C 1085 °C and conducts as a solid (metal-like). The explanation says the data fit but do not prove A is ionic.

## Diagram plan
- `components/IonicVisuals.tsx`, focus prefix `ionic-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette` from AtomVisuals (electron-blue dots, ink crosses, shell lines, space wash) plus PeriodicVisuals' amber and blue tints. Positive ions: pale coral wash, coral charge; negative ions: pale electron-blue wash, blue charge. Ions in square brackets with the charge at top right (real minus sign).
- **NaCl walkthrough** (`ionic-bond-atoms`, `-transfer`, `-ions`, `-attract`, `-all`): two rows (atoms with full shells, then ions), a curved arrow for the transferred electron, a double arrow "attract"/"ionic bond"; numbered step key on the right, active step highlighted, later steps faded.
- **Dot and cross** (`ionic-dc-nacl`, `-brackets`): the same NaCl drawing with a dots/crosses key (brackets highlighted in the second). `ionic-dc-mgo`, `ionic-dc-mgcl2`: outer shells only, same two-row layout. `ionic-dc-limits`: the ion pair with ✓/✗ list.
- **Lattice** (`ionic-lattice-layer`, `-directions`): one 6 × 4 layer of alternating ions; one Na⁺ with its four in-layer neighbours highlighted. `ionic-lattice-ballstick`: 3 × 3 × 2 cube (9 Na⁺, 9 Cl⁻), equal ball sizes. `ionic-lattice-spacefill`: 4 × 4 × 4 packed model, visible faces only.
- **Formula** (`ionic-formula-count`, `-ratio`): the ball-and-stick model with a count panel. `ionic-formula-charges`, `-balance`: charge tiles (K⁺ +1, O²⁻ −2) balancing to zero.
- **Properties** (`ionic-prop-melt`): lattice layer with bond lines and a thermometer at 801 °C. `ionic-prop-solid`, `-molten`, `-dissolved`: one circuit (cell, bulb, two electrodes, beaker) with the contents changing and a three-row key. `ionic-prop-summary`: three small circuits.
- **Question visuals**: `ionic-question` (lithium oxide, outer shells only, pointers 1–3; key hidden in assessment view) and `ionic-data` (invented data table).

## States in full

### C13-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Table salt is sodium chloride. What kinds of element is it made from?
- 0 Two metals · **1 A metal and a non-metal ✓** · 2 Two non-metals
- Hint: Is sodium a metal or a non-metal? What about chlorine?
- Explanation: Sodium is a metal, on the left of the periodic table. Chlorine is a non-metal, on the right. So sodium chloride is made from a metal and a non-metal.

### C13-02 · teach "How do ions stick together?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Metal meets non-metal | Sodium is a metal and chlorine is a non-metal. | metal + non-metal → neither outer shell is full | Metals and non-metals can react together. Sodium is a metal with one electron in its outer shell. Chlorine is a non-metal with seven electrons in its outer shell. Neither atom has a full outer shell. | `ionic-bond-atoms` |
| One electron moves | Sodium’s outer electron moves across to chlorine. | sodium loses 1 → chlorine gains 1 | When they react, sodium’s one outer electron moves to the chlorine atom. So sodium loses an electron and chlorine gains one. Moving electrons from one atom to another is called electron transfer. In the drawing, sodium’s electrons are dots and chlorine’s are crosses. | `ionic-bond-transfer` |
| Two ions | Both atoms become ions with full outer shells. | lose → positive ion, gain → negative ion | You met ions when you learned how ions form. Sodium has lost an electron, so it becomes a positive sodium ion, Na⁺. Chlorine has gained one, so it becomes a negative chloride ion, Cl⁻. Both ions now have a full outer shell, like a noble gas. | `ionic-bond-ions` |
| Opposites attract | The positive and negative ions pull strongly on each other. | positive + negative → strong pull | Opposite charges attract each other. So the positive sodium ion and the negative chloride ion pull strongly towards each other. A pull between electric charges is called an electrostatic force. | `ionic-bond-attract` |
| Put it together | The strong attraction between the ions is an ionic bond. | transfer → ions → attraction → ionic bond | Sodium gave one electron to chlorine, and the ions formed attract each other strongly. This strong attraction between oppositely charged ions is called an ionic bond. It holds the ions together in a compound, sodium chloride. A compound held together by ionic bonds is an ionic compound. | `ionic-bond-all` |

### C13-03 · choice · `understanding, guided, practice`
**Q:** When sodium reacts with chlorine, what happens to the electrons?
- **0 A sodium atom gives one electron to a chlorine atom ✓** · 1 A chlorine atom gives one electron to a sodium atom · 2 The two atoms share a pair of electrons · 3 Both atoms lose one electron
- Hint: Which atom has just one electron in its outer shell?
- Explanation: Sodium has one outer electron and chlorine has seven. So sodium’s outer electron moves to chlorine: sodium loses one electron and chlorine gains one.

### C13-04 · choice · `understanding, guided, practice`
**Q:** What holds the ions together in sodium chloride?
- 0 Shared pairs of electrons · 1 Weak forces between molecules · **2 Strong electrostatic attraction between oppositely charged ions ✓** · 3 Magnetism between the two elements
- Hint: What do positive and negative charges do to each other?
- Explanation: Na⁺ is positive and Cl⁻ is negative, and opposite charges attract. So a strong electrostatic attraction, the ionic bond, holds the ions together.

### C13-05 · teach "How do you draw it?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Dots and crosses | Each electron is drawn as a dot or a cross. | dot = from one atom, cross = from the other | This drawing is called a dot and cross diagram. It shows how the electrons are arranged in atoms and ions. Here, the dots are sodium’s electrons and the crosses are chlorine’s. So you can see which atom each electron came from: the chloride ion has one dot among its crosses. | `ionic-dc-nacl` |
| Brackets and charges | Each ion goes in square brackets with its charge. | ion → square brackets → charge at top right | Each ion is drawn inside square brackets. Its charge is written outside the brackets, at the top right. The sodium ion has +, and the chloride ion has −. When the charge is more than one, the number goes first, for example 2+. | `ionic-dc-brackets` |
| Outer shells only | Magnesium gives two electrons to oxygen. | Mg loses 2 → Mg²⁺; O gains 2 → O²⁻ | Diagrams often show only the outer shells, because those electrons are the ones that move. Magnesium is in Group 2, so it loses its two outer electrons. Oxygen is in Group 6, so it gains two. This makes a magnesium ion, Mg²⁺, and an oxide ion, O²⁻: magnesium oxide. | `ionic-dc-mgo` |
| One magnesium, two chlorines | One magnesium atom gives one electron to each of two chlorine atoms. | Mg loses 2, each Cl gains 1 → MgCl₂ | A chlorine atom only needs one extra electron. But a magnesium atom must lose two. So one magnesium atom gives one electron to each of two chlorine atoms. This makes one Mg²⁺ ion and two Cl⁻ ions: magnesium chloride, MgCl₂. | `ionic-dc-mgcl2` |
| What they leave out | Dot and cross diagrams are useful, but they do not show everything. | shows where electrons came from, not size or arrangement | Dot and cross diagrams are good for showing how ionic compounds form. But they do not show how big the ions are. They do not show how the ions are arranged in the compound. They also make dots and crosses look different, but really all electrons are the same. | `ionic-dc-limits` |

### C13-06 · choice · `understanding, guided, practice`
**Q:** In the magnesium oxide diagram, the oxide ion has six crosses and two dots. What do the two dots show?
- 0 Protons that oxygen gained · 1 Oxygen’s own outer electrons · 2 Electrons shared by both atoms · **3 The electrons that came from magnesium ✓**
- Hint: Whose electrons are drawn as dots in that diagram?
- Explanation: In the diagram, magnesium’s electrons are dots and oxygen’s are crosses. So the two dots are the electrons that moved from magnesium to oxygen.

### C13-07 · choice · `understanding, guided, practice`
**Q:** Which of these does a dot and cross diagram of sodium chloride not show?
- 0 Which atom each electron came from · **1 How the ions are arranged in the compound ✓** · 2 The charge on each ion · 3 How many electrons are in each shell
- Hint: The diagram shows one pair of ions. What about the rest of the compound?
- Explanation: A dot and cross diagram shows electrons, charges and where each electron came from. So it does not show how the ions are arranged, or how big they are.

### C13-08 · teach "What does salt look like inside?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A regular pattern | In an ionic compound, the ions are packed in a regular pattern. | many + and − ions → alternating pattern → lattice | A single grain of salt holds billions of ions, not just one pair. The positive and negative ions are packed in a regular, repeating pattern. Each ion sits next to ions with the opposite charge. This huge, regular arrangement of ions is called a giant ionic lattice. | `ionic-lattice-layer` |
| Bonds in all directions | Each ion is attracted by the oppositely charged ions all around it. | one ion → pulled from every side → strong structure | Pick any sodium ion in the lattice. It is surrounded by chloride ions, and it attracts every one of them. So the ionic bonds act in all directions, including above and below this layer. This holds the whole lattice together very strongly. | `ionic-lattice-directions` |
| Ball-and-stick model | Balls for ions and sticks between them show the arrangement. | shows the arrangement, but the gaps are not real | This drawing is called a ball-and-stick model. It shows clearly how the sodium and chloride ions alternate in 3D. But it makes the ions look far apart, with gaps between them. Really, the ions are packed tightly together. It does not show the sizes of the ions either. | `ionic-lattice-ballstick` |
| Space-filling model | Touching balls show how big the ions are. | shows the sizes, but only the outside can be seen | In a space-filling model, the ions are drawn touching, at their real relative sizes. It shows that chloride ions are bigger than sodium ions. It also shows the regular pattern. But you can only see the ions on the outside of the model. | `ionic-lattice-spacefill` |

### C13-09 · choice · `understanding, guided, practice`
**Q:** In a giant ionic lattice, in which directions do the ionic bonds act?
- **0 In all directions ✓** · 1 Only left and right · 2 Only between one pair of ions · 3 Only up and down
- Hint: How many ions surround each ion?
- Explanation: Each ion is surrounded by oppositely charged ions on every side. So it attracts all of them: the ionic bonds act in all directions.

### C13-10 · choice · `understanding, guided, practice`
**Q:** You want to show how big chloride ions are compared with sodium ions. Which model is best?
- 0 A ball-and-stick model · 1 A dot and cross diagram · **2 A space-filling model ✓** · 3 The formula NaCl
- Hint: Which model draws the ions touching, at their real sizes?
- Explanation: A space-filling model draws the ions touching, at their real relative sizes. So it shows that chloride ions are bigger than sodium ions. A ball-and-stick model does not.

### C13-11 · teach "How do you find the formula?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Count the ions | A lattice diagram lets you count each kind of ion. | count the Na⁺ ions, count the Cl⁻ ions | You can find the formula of an ionic compound from a diagram of its lattice. First, count each kind of ion in the diagram. This ball-and-stick model has 9 sodium ions and 9 chloride ions. | `ionic-formula-count` |
| Simplest ratio | Cancel the numbers down to the smallest whole numbers. | 9 : 9 → 1 : 1 → NaCl | Next, cancel the numbers down to the simplest whole-number ratio. 9 : 9 cancels to 1 : 1, so there is one sodium ion for every chloride ion. So the formula is NaCl. A formula that gives the simplest ratio of ions is called an empirical formula. | `ionic-formula-ratio` |
| Use the charges | The charges in a formula must add up to zero. | K⁺ and O²⁻ → total charge must be 0 | You can also find a formula from the charges on the ions. Potassium is in Group 1, so it forms K⁺ ions. Oxygen is in Group 6, so it forms O²⁻ ions. An ionic compound has no overall charge, so the charges must add up to zero. | `ionic-formula-charges` |
| Balance and write | Two K⁺ ions balance one O²⁻ ion, so the formula is K₂O. | +1 + 1 − 2 = 0 → K₂O | One K⁺ ion only balances half of the 2− charge. So you need two K⁺ ions for each O²⁻ ion. Check: +1 + 1 − 2 = 0. So the empirical formula of potassium oxide is K₂O. The small 2 after K means two potassium ions. | `ionic-formula-balance` |

### C13-12 · choice · `calculation, guided, practice`
**Q:** Calcium forms Ca²⁺ ions and chlorine forms Cl⁻ ions. What is the formula of calcium chloride?
- 0 CaCl · 1 Ca₂Cl · 2 Ca₂Cl₂ · **3 CaCl₂ ✓**
- Hint: How many Cl⁻ ions balance one Ca²⁺ ion?
- Explanation: One Ca²⁺ ion has a 2+ charge, and each Cl⁻ ion has a 1− charge. So two Cl⁻ ions balance one Ca²⁺ ion (+2 − 1 − 1 = 0), and the formula is CaCl₂.

### C13-13 · teach "Why is salt hard to melt?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Hard to melt | Ionic compounds have high melting and boiling points. | many strong bonds → lots of energy → high melting point | To melt a solid, its particles must be pulled apart. In an ionic lattice, that means breaking lots of strong ionic bonds. This takes a lot of energy. So ionic compounds have high melting points and high boiling points. Sodium chloride melts at 801 °C. | `ionic-prop-melt` |
| Solid: no current | Solid ionic compounds do not conduct electricity. | ions held in place → cannot carry charge | An electric current is a flow of charge. In a solid ionic compound, the ions are charged but held in place in the lattice. They cannot move, so they cannot carry charge. So solid ionic compounds do not conduct electricity. | `ionic-prop-solid` |
| Molten: current flows | Melted ionic compounds do conduct. | melted → ions free to move → carry charge | When an ionic compound melts, the ions are free to move around. Moving ions can carry electric charge. So a melted ionic compound conducts electricity. A melted substance is called molten. | `ionic-prop-molten` |
| Dissolved: current flows | Ionic compounds dissolved in water conduct too. | dissolved → ions move through the water → conducts | Many ionic compounds dissolve in water. The lattice breaks up and the ions spread out through the water. The ions can move in the solution, so they carry charge. So a solution of an ionic compound conducts electricity. | `ionic-prop-dissolved` |
| Put it together | Ions that can move carry charge; ions held in place cannot. | solid ✗ · molten ✓ · dissolved ✓ | Ionic compounds have high melting points because of their many strong ionic bonds. They conduct electricity only when their ions can move: when molten or dissolved. Next, you will see how non-metal atoms bond in a different way, by sharing electrons. | `ionic-prop-summary` |

### C13-14 · choice · `understanding, guided, practice`
**Q:** Why does solid sodium chloride not conduct electricity?
- 0 It contains no charged particles · **1 Its ions are held in place and cannot move ✓** · 2 Its electrons are all shared · 3 It only forms ions when it is heated
- Hint: Are there charged particles in the solid? Can they move?
- Explanation: Solid sodium chloride is made of ions, but they are held in place in the lattice. So they cannot move and carry charge, and the solid does not conduct.

### C13-15 · choice · `understanding, guided, practice`
**Q:** Why do ionic compounds have high melting points?
- **0 Lots of energy is needed to break the many strong ionic bonds ✓** · 1 The forces between their molecules are weak · 2 Their ions are too heavy to move · 3 They always contain a metal
- Hint: What has to be broken to melt a lattice?
- Explanation: Melting pulls the ions apart, which means breaking many strong ionic bonds in all directions. So it takes a lot of energy, and the melting point is high.

### C13-16 · choice · `application, independent, independent` · visual `ionic-question`
**Q:** In this lithium oxide diagram, what do the dots in ion 2, like the one at pointer 3, show?
- 0 Electrons shared by lithium and oxygen · 1 Protons that the oxide ion gained · **2 Electrons that moved from the lithium atoms ✓** · 3 Oxygen’s own outer electrons
- Hint: Ion 2 has two kinds of mark. Which atoms lost electrons?
- Explanation: Each lithium atom lost its one outer electron, becoming Li⁺. The oxygen atom gained both, becoming O²⁻. So the two dots are the electrons that came from the two lithium atoms. The crosses are oxygen’s own.

### C13-17 · choice · `dataInterpretation, independent, independent` · visual `ionic-data`
**Q:** The table shows invented data for four substances. Which is most likely to be an ionic compound?
- **0 Substance A ✓** · 1 Substance B · 2 Substance C · 3 Substance D
- Hint: An ionic compound has a high melting point. When does it conduct?
- Explanation: Substance A has a high melting point and conducts when molten, but not as a solid. That fits an ionic compound. So A is the most likely, but the data does not prove it. C conducts as a solid, so it is not ionic.

### C13-18 · choice · `calculation, independent, independent`
**Q:** Lithium forms Li⁺ ions and sulfur forms S²⁻ ions. What is the formula of lithium sulfide?
- 0 LiS · 1 LiS₂ · 2 Li₂S₂ · **3 Li₂S ✓**
- Hint: How many Li⁺ ions balance one S²⁻ ion?
- Explanation: Each Li⁺ ion has a 1+ charge, and one S²⁻ ion has a 2− charge. So two Li⁺ ions balance one S²⁻ ion (+1 + 1 − 2 = 0), and the formula is Li₂S.

### C13-19 · written · `explanation, transfer, independent`
**Q:** Explain how sodium chloride forms from its atoms, and why it conducts electricity when molten but not when solid.
- Hint: Say what happens to the electron, which ions form, what holds them together, and whether the ions can move in each state.
- Model answer: A sodium atom transfers its one outer electron to a chlorine atom. This makes a positive sodium ion, Na⁺, and a negative chloride ion, Cl⁻. The oppositely charged ions attract each other by strong electrostatic forces, called ionic bonds, in a giant ionic lattice. In the solid, the ions are held in place, so they cannot move to carry charge. When it is molten, the ions are free to move, so they carry charge and it conducts.
- Rubric (5): (1) A sodium atom transfers (loses) its one outer electron to a chlorine atom, which gains it. (2) This forms a positive sodium ion (Na⁺) and a negative chloride ion (Cl⁻). (3) Strong electrostatic attraction between the oppositely charged ions (ionic bonds) holds them together in a giant ionic lattice. (4) In the solid the ions are held in place, so they cannot move and carry charge. (5) When molten the ions are free to move, so they can carry charge and it conducts.
- Reject: Saying sodium and chlorine share electrons, or form molecules. Saying electrons flow through the molten compound to carry the current. Saying the solid does not conduct because it has no ions or no charged particles.
