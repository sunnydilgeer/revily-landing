# Chemistry Lesson 15 storyboard — Polymers, giant covalent structures and carbon

Chapter C2, Bonding, structure and properties of matter. Folder `chemistry/lesson-15`, id `C-BND-015-C`, skill `C-GIANT-COVALENT`. It builds on covalent bonding and simple molecules (strong bonds inside molecules, weak forces between them).

Big idea: covalent bonds are always strong, so what a covalent substance is like depends on how far the bonding goes. Small molecules melt easily; long polymer molecules hold each other more strongly; in giant covalent structures there are no separate molecules, so melting means breaking covalent bonds. Carbon shows how the number of bonds per atom changes everything: four (diamond), three in layers (graphite, graphene) and curved sheets (fullerenes, nanotubes).

Flow note: the lesson grows the structure step by step, from molecules that are long, to structures with no molecules at all, to carbon's forms.
1. **What is a polymer?** Small molecules join into one long molecule (ethene → poly(ethene)) → covalent bonds all along → larger intermolecular forces, so solid at room temperature but lower melting than ionic compounds → the repeating unit → (C₂H₄)n. It starts from the simple molecules just met, so only one thing changes: the size of the molecule.
2. **What is a giant covalent structure?** Silicon dioxide (sand) as a network with no separate molecules → very high melting point (bonds break) → no charged particles free to move → a "put it together" panel comparing simple molecules, polymers and giant covalent (what breaks on melting). Silica comes before carbon so the general idea is in place before the carbon examples.
3. **How are diamond and graphite different?** Diamond: four bonds, rigid, very hard → very high melting point, no free electrons → graphite: three bonds, hexagons, layers → layers slide (soft, slippery) → one delocalised electron per atom (conducts) → comparison table. Diamond and graphite appear on both source pages; they are taught once, here.
4. **What are graphene and fullerenes?** Graphene = one graphite layer (needs graphite first) → fullerenes (hollow balls, rings of 5/6/7, C₆₀) → nanotubes (high length to diameter ratio) → uses table.
5. **On your own**: three unlabelled structures (which conducts?), invented data for four solids read without over-claiming, a new polymer formula (poly(propene)), and a written comparison of diamond and graphite uses.

Sections:
1. Start here (C15-01): what breaks when oxygen boils (prior knowledge from simple molecules).
2. What is a polymer? (C15-02–04): polymer → covalent bonds → intermolecular forces, solid → repeating unit → (C₂H₄)n. Checks: why polymers are solid; PTFE formula from its repeating unit.
3. What is a giant covalent structure? (C15-05–07): silicon dioxide network → very high melting point → no conduction → comparison. Checks: why silicon dioxide melts so high; poly(ethene) v silicon dioxide.
4. How are diamond and graphite different? (C15-08–10): diamond four bonds, hard → no free electrons → graphite three bonds, hexagons → layers slide → delocalised electrons → comparison. Checks: why graphite is slippery; why graphite conducts but diamond does not.
5. What are graphene and fullerenes? (C15-11–13): graphene → fullerenes, C₆₀ → nanotubes → uses. Checks: what graphene is; reading a nanotube's length and width.
6. On your own (C15-14–17): numbered structures; four-solid data table; poly(propene) formula; written task.

Wording rules: one new term per frame (polymer, intermolecular forces, repeating unit, giant covalent structure, delocalised electrons, graphene, fullerene, nanotube); plain meaning first; the covalent-bonding lesson is referred to by topic ("You met small molecules such as oxygen when you learned about covalent bonding"); metals are mentioned only as "a bit like in a metal", because metallic bonding is the next lesson.

Out of scope: how polymers are made (addition polymerisation, monomers and C=C in detail — later organic chemistry); displayed formulas of the monomer; the 3D shapes of diamond and silica beyond "real diamond is 3D"; nanoparticle sizes and nanoscience (chemistry-only); Higher-tier ideas; the book's cartoons, jokes, figures and exam questions (poly(chloroethene), diamond v poly(ethene), "describe graphite").

Source boundary: supplied revision-guide pages 115–116 (scope only); AQA 8464 Chemistry 5.2.2.5, 5.2.2.6, 5.2.3.1, 5.2.3.2, 5.2.3.3 (with 5.2.1.4 for drawing polymers and 5.2.2.4 for the start question). All diagrams, examples (PTFE, poly(propene), the four-solid table, drill tips and pencils), questions and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Ethene is drawn with a double bond (correct) but the C=C bond is not named or taught; the lesson says only that small molecules "join together, end to end".
- "Most polymers are solid at room temperature" and "melt at lower temperatures than ionic compounds such as salt" follow the page; giant covalent is added to that comparison in the next section.
- Silicon dioxide melting point is given as "about 1700 °C" (quartz ≈ 1710 °C).
- Diamond and silica are drawn as flat square grids (each atom with the right number of bonds) with a note that the real structures are 3D; graphite layers are drawn from above as hexagons and from the side as lines of atoms.
- The C₆₀ drawing is a flat front view (central ring of five, rings of six round it), labelled "only the front half is drawn".
- Nanotubes: the lesson says they are strong for how light they are and are used in electronics and to strengthen materials; it does not claim all nanotubes conduct.
- The four-solid table (C15-15) is invented (A 1610 °C, B 801 °C, C 115 °C, D 1085 °C); the explanation says the data makes A "most likely" giant covalent but does not prove it. B uses ionic conduction when melted (met in the ionic compounds lesson).
- "Graphite is used in pencils" and "electrodes" (C15-17) are everyday uses not on the page; they only apply the properties taught.

## Diagram plan
- `components/GiantVisuals.tsx`, focus prefix `giant-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette` from AtomVisuals and the PeriodicVisuals tints: carbon = neutron grey, hydrogen = white, oxygen = amber (oxygen's group tint), silicon = pale grey (carbon's group tint), fluorine = pale blue (halogen tint). Covalent bonds are solid ink lines, intermolecular forces dashed; delocalised electrons are small electron-blue dots; coral red (proton colour) marks the frame's idea.
- **Polymer** (`giant-poly-join`, `-bonds`): four ball-and-stick ethene molecules joining into a poly(ethene) chain; then the chain's bonds highlighted. `giant-poly-forces`: three chains with dashed forces between them. `giant-poly-unit`: displayed chain with the repeating unit boxed. `giant-poly-formula`: unit in brackets with n → (C₂H₄)n.
- **Silicon dioxide** (`giant-gc-network`, `-melt`, `-conduct`): one flat Si/O grid; one Si with its four bonds, then every bond, then a crossed-out electron. `giant-gc-compare`: three panels (simple molecules, polymer, giant covalent) with what breaks on melting.
- **Carbon** (`giant-diamond`, `-props`): flat diamond grid with one atom's four bonds and numbered pointers. `giant-graphite` (hexagon layer, one atom's three bonds), `giant-graphite-layers` (side view, top layer sliding, pointer to the gap), `giant-graphite-electrons` (delocalised electrons among the hexagons), `giant-carbon-compare` (table).
- **Graphene and fullerenes** (`giant-graphene`, `giant-fullerene`, `giant-nanotube`, `giant-carbon-uses`): one layer lifted from graphite; flat C₆₀ with pointers to a ring of five and a ring of six; a nanotube with length and diameter arrows; uses table.
- **Question visuals**: `giant-q-ptfe` and `giant-q-propene` (repeating units, no formula shown), `giant-q-structures` (three numbered panels with neutral structural captions; names appear only after answering), `giant-q-data` (four-solid table).

## States in full

### C15-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Oxygen, O₂, is a gas at room temperature. When liquid oxygen boils, what is broken?
- 0 The covalent bond inside each O₂ molecule · **1 The weak forces between the O₂ molecules ✓** · 2 The oxygen atoms themselves
- Hint: Is oxygen gas still made of O₂ molecules?
- Explanation: Oxygen gas is still made of O₂ molecules, so the covalent bonds inside them do not break. So boiling only breaks the weak forces between the molecules, which is why oxygen boils at a low temperature.

### C15-02 · teach "What is a polymer?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Small molecules join up | Lots of small molecules can join into one very long molecule. | many small molecules → one long chain | You met small molecules such as oxygen when you learned about covalent bonding. Some small molecules can join together, end to end, thousands of times. This makes one very long molecule. A substance made of very long molecules like this is called a polymer. | `giant-poly-join` |
| Strong bonds all along | Every atom in a polymer molecule is held by strong covalent bonds. | shared pairs of electrons → strong chain | Every atom in the long molecule is joined to its neighbours by covalent bonds. A covalent bond is a shared pair of electrons. These bonds are strong. So a polymer molecule does not easily break apart. | `giant-poly-bonds` |
| Forces between the chains | Long molecules attract each other more strongly than small ones do. | big molecules → larger forces between them → solid | The long molecules lie next to each other. The forces of attraction between them are called intermolecular forces. Because polymer molecules are so big, these forces are larger than between small molecules. So more energy is needed to separate them, and most polymers are solid at room temperature. They are still weaker than covalent bonds, so polymers melt at lower temperatures than ionic compounds such as salt. | `giant-poly-forces` |
| The repeating unit | A polymer chain is one small section repeated over and over. | same section again and again → repeating unit | Poly(ethene) is the polymer used to make plastic bags. Its long chain is the same small section, over and over again. This section has 2 carbon atoms and 4 hydrogen atoms. The section that repeats is called the repeating unit. | `giant-poly-unit` |
| Writing the formula | A polymer’s formula is its repeating unit’s formula in brackets, with n. | count atoms in the unit → brackets → n | To draw a polymer, you draw one repeating unit in brackets. A bond sticks out through each bracket, to join on to the next unit. To write the molecular formula, count the atoms in the unit: C₂H₄. Put brackets round it and write n after them: (C₂H₄)n. The n stands for a large number of units. | `giant-poly-formula` |

### C15-03 · choice · `understanding, guided, practice`
**Q:** Why are most polymers solid at room temperature?
- 0 Their molecules are small · 1 They contain ions · **2 The forces between their long molecules are quite strong ✓** · 3 Their molecules have no covalent bonds
- Hint: What is there between the long molecules?
- Explanation: Polymer molecules are very long, so the intermolecular forces between them are larger than between small molecules. So more energy is needed to separate them, and most polymers are solid at room temperature.

### C15-04 · choice · `application, guided, practice` · visual `giant-q-ptfe`
**Q:** PTFE is the polymer on non-stick pans. Its repeating unit is shown. What is the molecular formula of PTFE?
- **0 (C₂F₄)n ✓** · 1 C₂F₄ · 2 (C₂H₄)n · 3 (C₂F₂)n
- Hint: Count the atoms inside the brackets, then add brackets and n.
- Explanation: The repeating unit has 2 carbon atoms and 4 fluorine atoms: C₂F₄. So the formula of the polymer is (C₂F₄)n, where n is a large number.

### C15-05 · teach "What is a giant covalent structure?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A giant network | In some substances every atom is bonded to its neighbours, with no separate molecules. | bonds in every direction → no separate molecules | Sand is mostly silicon dioxide, also called silica. In silicon dioxide, each silicon atom is joined to four oxygen atoms by covalent bonds. Each oxygen atom is joined to two silicon atoms. The bonding carries on in every direction, so there are no separate molecules. This is called a giant covalent structure. | `giant-gc-network` |
| Very high melting points | To melt a giant covalent substance, strong covalent bonds must break. | melt → break strong covalent bonds → lots of energy | To melt a giant covalent substance, its atoms must be pulled apart. That means breaking lots of strong covalent bonds. This takes a lot of energy. So giant covalent substances have very high melting and boiling points. Silicon dioxide melts at about 1700 °C. | `giant-gc-melt` |
| No charged particles | Most giant covalent substances do not conduct electricity. | no ions, no free electrons → no current | To conduct electricity, a substance needs charged particles that are free to move. Silicon dioxide has no ions. All its outer electrons are held in bonds, so none are free to move. So it does not conduct electricity. Graphite, a form of carbon, is an exception you will meet next. | `giant-gc-conduct` |
| Put it together | What must break to melt a substance depends on its structure. | weak forces → larger forces → covalent bonds | To melt a simple molecular substance, you only break weak forces between small molecules. To melt a polymer, you break the larger forces between long molecules. To melt a giant covalent substance, you break strong covalent bonds. So melting points go from low, to higher, to very high. | `giant-gc-compare` |

### C15-06 · choice · `understanding, guided, practice`
**Q:** Why does silicon dioxide have a very high melting point?
- 0 Its molecules are very large · 1 It contains ions · 2 There are weak forces between its molecules · **3 Many strong covalent bonds must break to melt it ✓**
- Hint: What holds every atom in place in silicon dioxide?
- Explanation: In silicon dioxide, every atom is held by strong covalent bonds. There are no separate molecules. So melting means breaking lots of strong bonds, which takes a lot of energy.

### C15-07 · choice · `understanding, guided, practice`
**Q:** Which needs more energy to melt, poly(ethene) or silicon dioxide?
- 0 Poly(ethene), because its molecules are longer · **1 Silicon dioxide, because covalent bonds must break ✓** · 2 Poly(ethene), because its covalent bonds must break · 3 Neither: both have covalent bonds, so both melt at the same temperature
- Hint: What must break to melt each one?
- Explanation: To melt poly(ethene), only the forces between its molecules break. To melt silicon dioxide, strong covalent bonds must break. So silicon dioxide needs much more energy to melt.

### C15-08 · teach "How are diamond and graphite different?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Diamond | In diamond, each carbon atom is bonded to four others. | 4 bonds per atom → rigid network → very hard | Carbon atoms can join up in different ways to make different substances. In diamond, each carbon atom forms four covalent bonds with other carbon atoms. This makes a giant, rigid network. So diamond is very hard. The drawing is flat, but real diamond is a 3D network. | `giant-diamond` |
| No free electrons | Diamond has a very high melting point and does not conduct. | all outer electrons in bonds → no conduction | Melting diamond means breaking lots of strong covalent bonds. So diamond has a very high melting point. Each carbon atom uses all four of its outer electrons in bonds. There are no free electrons and no ions. So diamond does not conduct electricity. | `giant-diamond-props` |
| Graphite | In graphite, each carbon atom is bonded to three others in flat sheets. | 3 bonds per atom → rings of six → flat layers | Graphite is another form of carbon, used in pencils. Each carbon atom forms three covalent bonds. The atoms make rings of six, called hexagons. The hexagons join up into flat sheets, which are stacked in layers. | `giant-graphite` |
| Layers slide | Graphite is soft and slippery because its layers can slide. | no bonds between layers → layers slide → soft | There are no covalent bonds between the layers, only weak forces. So the layers can slide over each other. This makes graphite soft and slippery. When you write with a pencil, layers rub off onto the paper. The bonds within each layer are strong, so graphite still has a very high melting point. | `giant-graphite-layers` |
| Free electrons | Graphite conducts electricity because some electrons can move. | 1 spare electron per atom → free to move → conducts | Each carbon atom in graphite uses only three of its four outer electrons in bonds. The fourth electron is free to move along the layer. Electrons that are free to move like this are called delocalised electrons. They can carry charge, so graphite conducts electricity. They also carry heat, a bit like in a metal. | `giant-graphite-electrons` |
| Put it together | Diamond and graphite are both carbon, but their bonding gives them different properties. | 4 bonds → hard, no conduction; 3 bonds → soft, conducts | Diamond and graphite are both made only of carbon atoms. Diamond has four bonds per atom, so it is very hard and does not conduct. Graphite has three bonds per atom, in layers, so it is soft and does conduct. Both have very high melting points, because both are giant covalent structures. | `giant-carbon-compare` |

### C15-09 · choice · `understanding, guided, practice`
**Q:** Why is graphite soft and slippery?
- 0 It has a low melting point · 1 Its carbon atoms have no covalent bonds · **2 There are no covalent bonds between its layers, so they slide ✓** · 3 It has delocalised electrons
- Hint: What is there between the layers?
- Explanation: The atoms in each layer are held by strong covalent bonds, but there are no covalent bonds between the layers. So the layers can slide over each other, which makes graphite soft and slippery.

### C15-10 · choice · `understanding, guided, practice`
**Q:** Graphite conducts electricity, but diamond does not. Why?
- **0 Graphite has one delocalised electron from each carbon atom ✓** · 1 Graphite contains ions · 2 Diamond has fewer covalent bonds per atom · 3 The bonds in graphite’s layers are weak
- Hint: How many outer electrons does each carbon atom use in bonds?
- Explanation: In graphite, each carbon atom uses three outer electrons in bonds, so one is free to move. In diamond, all four are used in bonds. So graphite has delocalised electrons that carry charge, but diamond has none.

### C15-11 · teach "What are graphene and fullerenes?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Graphene | Graphene is a single layer of graphite. | one layer → strong, light, conducts | Imagine lifting off just one layer of graphite. This sheet of carbon hexagons is only one atom thick. It is called graphene. Its covalent bonds make it very strong, and it is also very light. It has delocalised electrons, so it conducts electricity. | `giant-graphene` |
| Fullerenes | Some carbon molecules are hollow balls or tubes. | hexagons plus rings of 5 or 7 → curved, hollow | Carbon atoms can also form molecules shaped like hollow balls or closed tubes. These molecules are called fullerenes. Their atoms are mostly in rings of six. Some rings have five or seven atoms instead, which lets the sheet curve. The first one found was buckminsterfullerene, C₆₀, a hollow ball of 60 carbon atoms. | `giant-fullerene` |
| Nanotubes | A nanotube is a fullerene shaped like a very thin tube. | tiny cylinder → very long compared with its width | Some fullerenes are tiny cylinders of carbon, called nanotubes. A nanotube is very long compared with its diameter. We say it has a high length to diameter ratio. Nanotubes are very strong for how light they are. | `giant-nanotube` |
| Put it together | Each form of carbon’s properties suit different uses. | property → use | Graphene can be added to other materials to make them stronger but hardly heavier. Its free electrons make it useful in electronics. Hollow fullerene balls can carry drugs into the body, and they can be used as catalysts to speed up reactions. Nanotubes are used in electronics and to strengthen materials without adding much weight. | `giant-carbon-uses` |

### C15-12 · choice · `understanding, guided, practice`
**Q:** What is graphene?
- 0 A hollow ball of 60 carbon atoms · 1 A polymer made of carbon and hydrogen · 2 A form of diamond · **3 A single layer of graphite, one atom thick ✓**
- Hint: What do you get if you lift off one sheet of graphite?
- Explanation: Graphite is made of layers of carbon hexagons. So one layer on its own, just one atom thick, is graphene.

### C15-13 · choice · `dataInterpretation, guided, practice`
**Q:** A nanotube is about 1 nanometre wide and 1000 nanometres long. What does this show?
- 0 It is wider than it is long · **1 It has a high length to diameter ratio ✓** · 2 It is a hollow ball · 3 It cannot conduct electricity
- Hint: How many times longer than its width is it?
- Explanation: The nanotube is about 1000 times longer than it is wide. So it has a high length to diameter ratio, like all nanotubes.

### C15-14 · choice · `application, independent, independent` · visual `giant-q-structures`
**Q:** Three structures are shown. Which numbered structure would conduct electricity?
- 0 Structure 1 · 1 Structure 2 · **2 Structure 3 ✓** · 3 None of them
- Hint: Which carbon atoms have an outer electron not used in a bond?
- Explanation: In structure 3, each carbon atom forms only three bonds, so each has one electron free to move. This is graphite. So structure 3 conducts. In structures 1 and 2, every outer electron is used in a bond.

### C15-15 · choice · `dataInterpretation, independent, independent` · visual `giant-q-data`
**Q:** The table shows data for four solids. Which one is most likely to have a giant covalent structure?
- **0 Solid A ✓** · 1 Solid B · 2 Solid C · 3 Solid D
- Hint: Which one has a very high melting point and never conducts?
- Explanation: Solid A melts at 1610 °C and does not conduct, even when melted. That fits a giant covalent structure. B conducts when melted and D conducts as a solid, so they have charged particles that can move. C melts at a low temperature. The data makes A most likely, but does not prove it.

### C15-16 · choice · `application, independent, independent` · visual `giant-q-propene`
**Q:** The repeating unit of poly(propene) is shown. What is the molecular formula of poly(propene)?
- 0 (C₂H₄)n · 1 C₃H₆ · 2 (C₃H₇)n · **3 (C₃H₆)n ✓**
- Hint: Count every C and every H inside the brackets.
- Explanation: The repeating unit has 3 carbon atoms and 6 hydrogen atoms: C₃H₆. So the polymer is (C₃H₆)n, with brackets round the unit and n after them.

### C15-17 · written · teacher-reviewed
**Q:** Diamond is used on drill tips for cutting rock; graphite in pencils and electrodes. Explain how their structures suit these uses.
- Hint: For each one, say how many bonds each carbon atom forms, what that does to the structure, and which property it gives.
- Model answer: In diamond, each carbon atom forms four strong covalent bonds, making a rigid giant network. So diamond is very hard and has a very high melting point, which suits drill tips for cutting rock. In graphite, each carbon atom forms three covalent bonds in layers. There are no covalent bonds between the layers, so they slide over each other and graphite is soft and slippery, so it rubs off in a pencil. Each carbon atom in graphite also has one delocalised electron, free to move, so graphite conducts electricity, which suits electrodes.
- Rubric (4): In diamond, each carbon atom forms four covalent bonds in a rigid giant network. / So diamond is very hard (with a very high melting point), which suits cutting rock. / In graphite, each carbon atom forms three bonds in layers, with no covalent bonds between the layers, so the layers slide: soft and slippery for pencils. / Graphite has one delocalised electron per carbon atom, free to move, so it conducts electricity, which suits electrodes.
- Reject: Saying graphite’s layers slide because its covalent bonds are weak. / Saying graphite conducts because it contains ions. / Saying diamond is hard because of strong forces between molecules.
