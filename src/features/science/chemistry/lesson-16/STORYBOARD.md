# Chemistry Lesson 16 storyboard — Metallic bonding and alloys

Chapter C2, Bonding, structure and properties of matter. Folder `chemistry/lesson-16`, id `C-BND-016-C`, skill `C-METALLIC-BONDING`. It builds on how ions form (metals lose outer electrons to make positive ions) and on the metal properties met with the modern periodic table.

Big idea: a metal is a giant structure of positive metal ions in a regular pattern, held together by strong attraction to a "shared" set of delocalised electrons. That one picture explains why metals conduct, why they melt only at high temperatures, and why they bend; putting atoms of a different size into it (an alloy) stops the layers sliding, so alloys are harder.

Flow note: build the picture of a metal first, then spend it property by property.
1. **What holds a metal together?** One 4 × 4 square of metal, built in four steps on the same drawing: atoms in a regular pattern (giant structure) → outer electrons leave and move freely (delocalised) → the atoms left are positive ions (recalled from how ions form) → opposite charges attract (metallic bond) → put it together. The bond cannot be defined until both the ions and the electrons exist.
2. **Why do metals conduct?** Uses the moving electrons just met: charge (a wire in a circuit, electrons drifting to +, ions fixed) → thermal energy (a bar heated at one end) → everyday uses. It comes straight after bonding because it needs only the delocalised electrons.
3. **Why are metals solid but easy to shape?** Uses the strength of the bonds: strong bonds in every direction (the same square, with pull lines) → real melting points against room temperature → layers seen from the side → layers slide. Layers come here because the alloy section needs them first.
4. **Why are alloys harder?** Re-uses the side view: pure metal soft → alloy defined (steel, brass) → different-sized atoms distort the layers → layers catch, so harder → pure v alloy side by side. Hands on to the next lesson (states of matter).
5. **On your own**: new scenario (gold mixed with copper for rings); a numbered metal diagram in assessment view (which particles carry charge; AQA asks students to recognise metallic structures from diagrams); invented dent-test data read without over-claiming; a written explanation of conduction and high melting point from structure and bonding.

Sections:
1. Start here (C16-01): copper wires and saucepans share good conduction (prior knowledge from everyday life and the modern periodic table).
2. What holds a metal together? (C16-02–04): giant structure → delocalised electrons → positive ions → metallic bond → whole picture. Checks: what delocalised electrons are; what a metallic bond is.
3. Why do metals conduct? (C16-05–07): charge → thermal energy → uses. Checks: copper wire; steel spoon in soup.
4. Why are metals solid but easy to shape? (C16-08–10): strong bonds → iron 1538 °C, copper 1085 °C, aluminium 660 °C v room temperature about 25 °C → layers → sliding. Checks: why high melting points; why a copper pipe bends.
5. Why are alloys harder? (C16-11–13): pure metals soft → alloy (steel, brass) → distorted layers → harder → compare. Checks: why an alloy is harder; which is an alloy (steel v a compound).
6. On your own (C16-14–17): gold and copper ring; numbered diagram; dent data; written task.

Wording rules: one new term per frame (giant structure, delocalised, positive ion recalled, metallic bond, thermal energy, alloy, distorted); plain meaning first, then "is called"; other lessons named by topic only ("You met ions when you learned how ions form").

Out of scope: Higher-tier content; metallic bonding strength trends (charge on the ion, number of delocalised electrons); malleability/ductility terms beyond "bent or shaped"; named alloy compositions beyond steel (iron + carbon), brass (copper + zinc), bronze (in data only) and gold with copper; carat numbers; the scan's hinges question, cartoons and jokes; graphite and graphene conduction (the giant covalent lesson).

Source boundary: supplied revision-guide page 117 (scope only); AQA 8464 Chemistry 5.2.1.5, 5.2.2.7, 5.2.2.8. All wording, examples, questions and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The bonding drawing gives each atom one delocalised electron (16 ions, 16 electrons, all 1+), like sodium; the frame text says "In the drawing, each atom gives up one electron" and that metals have "only a few" outer electrons. The metal is not named.
- The atom stage draws each atom's core (nucleus plus inner electrons) as a coral circle without a sign, with one outer electron on a shell; the ion stage adds the "+".
- "The sharing of delocalised electrons" (AQA wording) is expressed as "the delocalised electrons are shared by all the ions".
- Conduction: electrons are drawn drifting towards the positive terminal (the real electron direction); conventional current is not mentioned.
- Thermal conduction is credited to the delocalised electrons only (as AQA 5.2.2.8 does); lattice vibrations are not mentioned.
- Melting points: iron 1538 °C, copper 1085 °C, aluminium 660 °C (rounded); mercury named as the liquid exception.
- Side-view layers are drawn square-packed (not close-packed) so the rows read clearly as layers; circles are labelled "atom" and electrons are not shown. The alloy's added atoms are drawn larger; the text says only "a different size" (carbon in steel is in fact smaller).
- The sliding frame says the delocalised electrons "still hold the ions together", so the metal bends instead of shattering: a light explanation beyond the page.
- The dent-test data (pure copper 50 N, brass 120 N, bronze 140 N) is invented and labelled so.

## Diagram plan
- `components/MetallicVisuals.tsx`, focus prefix `metal-`, routed by `CellBiologyVisuals.tsx`. Colours from `atomPalette`: positive metal ions coral with "+", delocalised electrons small electron-blue dots, the metal's space the pale atom wash; amber (as in PeriodicVisuals) for thermal energy and for the other element's atoms in an alloy; soft grey for metal objects.
- **Square of metal** (`metal-bond-atoms`, `-free`, `-ions`, `-bond`, `-whole`): 4 × 4 sites with a numbered step key (1 regular pattern, 2 delocalised, 3 positive ions, 4 metallic bond); the current step is highlighted and later steps faded. Reused for `metal-shape-strong` (pull lines from five electrons) and the question `metal-question` (pointers 1 = ion, 2 = electron; labels hidden in assessment view).
- **Wire in a circuit** (`metal-conduct-charge`) and **heated bar** (`metal-conduct-heat`): one strip of 16 ions and 16 electrons; arrows show electrons drifting to + or carrying energy from the flame end. **Uses** (`metal-conduct-uses`): copper cable and saucepan on a hob.
- **Melting points** (`metal-shape-melt`): horizontal bar chart in °C with a dashed room-temperature line.
- **Layers, side view** (`metal-shape-layers`, `-slide`, `metal-alloy-pure`, `-mix`, `-distort`, `-hard`, `metal-alloy-compare`): three rows of seven atoms; the top row slides one place; the alloy has three larger amber atoms that push neighbours up or down; dashed guide lines show the distortion; a stop bar shows the blocked push.
- **Dent data** (`metal-dent-data`): bar chart, force in N, labelled invented.

## States in full

### C16-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Wires are made of copper, and saucepans are often made of steel or aluminium. What do these metals have in common?
- 0 They snap easily when bent · **1 They conduct electricity and heat well ✓** · 2 They melt at low temperatures · 3 They are all gases when pure
- Hint: What does a wire or a pan need to let through?
- Explanation: A wire must let electricity through, and a pan must let heat through to the food. So these metals are useful because they conduct electricity and heat well.

### C16-02 · teach "What holds a metal together?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A giant structure | A piece of metal is a huge number of atoms packed in a regular pattern. | metal atoms → packed in neat rows → giant structure | Metal atoms pack tightly together in neat, repeating rows. Even a tiny piece of metal holds billions of atoms, all bonded to each other. A structure with this many atoms joined in a regular pattern is called a giant structure. | `metal-bond-atoms` |
| Free electrons | The outer-shell electrons leave their own atoms. | outer electrons → free to move → delocalised | Metal atoms have only a few electrons in their outer shell. In a metal, these outer electrons are not held by one atom. They move freely through the whole structure. Electrons that are free to move like this are called delocalised electrons. In the drawing, each atom gives up one electron. | `metal-bond-free` |
| Positive ions | The atoms left behind are positive ions. | lose outer electrons → positive metal ions | Each atom has lost its outer electrons, so it now has more protons than electrons. So it is a positive ion. You met ions when you learned how ions form. The positive metal ions stay in their regular rows. | `metal-bond-ions` |
| Metallic bonds | Positive ions and negative electrons attract each other strongly. | positive ions + negative electrons → attraction → metallic bond | Opposite charges attract. So the positive metal ions and the negative delocalised electrons pull strongly on each other. This is an electrostatic attraction, and it acts in every direction. The strong attraction between metal ions and delocalised electrons is called a metallic bond. | `metal-bond-bond` |
| Put it together | Metallic bonds hold the ions in a regular pattern. | ions + shared electrons → strong bonds all through the metal | A metal is a giant structure of positive ions in a regular pattern. The delocalised electrons are shared by all the ions. The attraction between them makes strong metallic bonds all through the metal. The rest of this lesson uses this one picture to explain how metals behave. | `metal-bond-whole` |

### C16-03 · choice · `understanding, guided, practice`
**Q:** What are the delocalised electrons in a metal?
- 0 Pairs of electrons shared between two atoms · 1 Electrons that stay in one atom’s inner shell · **2 Outer-shell electrons that are free to move through the whole metal ✓** · 3 Electrons gained by the metal atoms
- Hint: Where do the outer electrons go in a metal?
- Explanation: In a metal, the outer-shell electrons are not held by one atom. So they are free to move through the whole structure: they are delocalised.

### C16-04 · choice · `understanding, guided, practice`
**Q:** What is a metallic bond?
- **0 The attraction between positive metal ions and delocalised electrons ✓** · 1 A pair of electrons shared between two metal atoms · 2 The attraction between positive and negative ions in a salt · 3 A weak force between separate metal molecules
- Hint: Which two things with opposite charges are in a metal?
- Explanation: A metal contains positive metal ions and negative delocalised electrons. So the strong electrostatic attraction between them is the metallic bond.

### C16-05 · teach "Why do metals conduct?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Carrying charge | Delocalised electrons carry electric charge through a metal. | charged electrons free to move → charge flows | An electric current is a flow of charge. Delocalised electrons are charged and free to move. When a wire is connected to a cell, they drift through the metal towards the positive end. So they carry charge through the whole structure, while the positive ions stay in place. | `metal-conduct-charge` |
| Carrying heat | Delocalised electrons also carry thermal energy. | hot end → electrons pass energy along → cold end warms | When one end of a metal is heated, the particles there gain energy. The delocalised electrons move through the structure and pass this energy along. So energy spreads quickly from the hot end to the cold end. Energy that heats things up is called thermal energy. | `metal-conduct-heat` |
| Put it together | Metals are good conductors of electricity and heat. | delocalised electrons → carry charge and energy → good conductor | The same delocalised electrons carry both electric charge and thermal energy. So metals are good conductors of electricity and of heat. That is why copper is used for wires and metals are used for saucepans. | `metal-conduct-uses` |

### C16-06 · choice · `understanding, guided, practice`
**Q:** Why does a copper wire conduct electricity?
- 0 Its copper atoms share pairs of electrons · 1 It has a very high melting point · 2 Its positive ions move along the wire · **3 Its delocalised electrons move through it, carrying charge ✓**
- Hint: Which particles in a metal are free to move?
- Explanation: The positive ions stay in their fixed rows, but the delocalised electrons are free to move. So the delocalised electrons carry electric charge through the wire.

### C16-07 · choice · `understanding, guided, practice`
**Q:** One end of a steel spoon sits in hot soup. Why does the other end soon get warm?
- 0 Heat cannot travel through a solid · **1 Delocalised electrons carry thermal energy along the spoon ✓** · 2 The metal ions flow up the spoon · 3 The spoon’s metallic bonds all break
- Hint: What carries energy through a metal?
- Explanation: Delocalised electrons move through the whole metal structure. So they carry thermal energy from the hot end to the cold end.

### C16-08 · teach "Why are metals solid but easy to shape?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Strong bonds | Metallic bonds are strong and act in every direction. | many strong bonds → lots of energy to break them | Every ion in a metal is held by metallic bonds pulling in all directions. To melt the metal, many of these strong bonds must be broken. So a lot of energy is needed to melt a metal, and even more to boil it. | `metal-shape-strong` |
| High melting points | Most metals melt only at high temperatures. | strong bonds → high melting point → solid at room temperature | Because so much energy is needed, most metals have high melting and boiling points. Iron melts at 1538 °C and copper at 1085 °C. Room temperature is only about 25 °C. So most metals are solid at room temperature. Mercury is a rare exception: it is a liquid. | `metal-shape-melt` |
| Layers of atoms | In a pure metal, the atoms are arranged in layers. | all atoms the same size → flat, neat layers | In a pure metal, every atom is of the same element, so they are all the same size. They pack together in flat, neat layers. The drawing shows the layers from the side. | `metal-shape-layers` |
| Layers slide | A push makes the layers slide over each other. | push → layers slide → metal bends | When you push hard on a metal, whole layers of atoms can slide over each other. The delocalised electrons move too and still hold the ions together. So the metal bends into a new shape instead of shattering. This is why metals can be hammered, bent or pressed into shapes. | `metal-shape-slide` |

### C16-09 · choice · `understanding, guided, practice`
**Q:** Why do most metals have high melting points?
- 0 There are only weak forces between their molecules · 1 Their electrons cannot move · **2 Lots of energy is needed to break their strong metallic bonds ✓** · 3 Their positive ions repel each other
- Hint: How strong are metallic bonds?
- Explanation: Metals have strong metallic bonds all through their giant structure. So lots of energy is needed to break them, which gives high melting points.

### C16-10 · choice · `understanding, guided, practice`
**Q:** A plumber bends a copper pipe to fit round a corner. Why can the pipe bend without snapping?
- **0 Layers of copper atoms slide over each other ✓** · 1 The copper melts as it bends · 2 Its metallic bonds are very weak · 3 Its electrons leave the pipe
- Hint: What happens to the layers when a metal is pushed?
- Explanation: The copper atoms are in layers that can slide over each other. So the pipe changes shape, and the delocalised electrons keep holding the ions together.

### C16-11 · teach "Why are alloys harder?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Pure metals are soft | Neat layers slide easily, so many pure metals are soft. | same-size atoms → layers slide easily → soft | The layers in a pure metal slide over each other quite easily. So many pure metals are too soft for everyday jobs. For example, pure gold bends and scratches easily. | `metal-alloy-pure` |
| Alloys | Mixing another element into a metal makes an alloy. | metal + another element → mixture → alloy | Most metals we use are mixed with at least one other element. The other element can be another metal or a non-metal. A mixture like this is called an alloy. Steel is iron with a little carbon, and brass is copper with zinc. | `metal-alloy-mix` |
| Distorted layers | Atoms of a different size push the layers out of line. | different-sized atoms → layers pushed out of line | The added element’s atoms are a different size from the metal’s atoms. They break up the neat rows, so the layers are no longer flat. Layers pushed out of shape like this are called distorted. | `metal-alloy-distort` |
| Harder to slide | Distorted layers cannot slide easily, so alloys are harder. | distorted layers → catch on each other → harder | When you push an alloy, the uneven layers catch on each other. So it is much harder for the layers to slide. This makes an alloy harder than the pure metal it is made from. | `metal-alloy-hard` |
| Put it together | Alloys are harder, which makes them more useful. | pure metal: layers slide → soft; alloy: layers stuck → harder | A pure metal has neat layers that slide, so it is soft. An alloy has distorted layers that do not slide easily, so it is harder. That is why most metal objects, from bike frames to cutlery, are made of alloys. Next, you will see how particles are arranged in solids, liquids and gases. | `metal-alloy-compare` |

### C16-12 · choice · `understanding, guided, practice`
**Q:** Why is an alloy harder than the pure metal it is made from?
- 0 All its atoms are the same size · 1 It has no delocalised electrons · 2 Its metallic bonds are much weaker · **3 Different-sized atoms distort the layers, so they cannot slide easily ✓**
- Hint: What do the added atoms do to the layers?
- Explanation: The added atoms are a different size, so they distort the layers. So the layers cannot slide over each other easily, and the alloy is harder.

### C16-13 · choice · `understanding, guided, practice`
**Q:** Which of these is an alloy?
- 0 Pure copper · **1 Steel, which is iron mixed with a little carbon ✓** · 2 Sodium chloride, a compound of sodium and chlorine · 3 Oxygen gas
- Hint: An alloy is a mixture. What must it contain?
- Explanation: An alloy is a mixture of a metal with at least one other element. Steel is iron mixed with carbon, so it is an alloy. Sodium chloride is a compound, not a mixture.

### C16-14 · choice · `application, independent, independent`
**Q:** Pure gold bends and scratches easily. Jewellers often mix gold with some copper to make rings. Why?
- 0 Copper makes the gold conduct electricity · 1 It makes the gold melt at a lower temperature · **2 The different-sized copper atoms distort the layers, so the ring is harder ✓** · 3 It turns the gold into a compound
- Hint: What happens to the layers when atoms of another size are added?
- Explanation: Copper atoms are a different size from gold atoms, so they distort the layers. So the layers cannot slide easily, and the ring is harder and keeps its shape.

### C16-15 · choice · `understanding, independent, independent` · visual `metal-question`
**Q:** The diagram shows the particles in a metal. Which numbered particles move through the metal to carry electric charge?
- 0 Particles 1 · **1 Particles 2 ✓** · 2 Both 1 and 2 · 3 Neither: nothing moves in a solid
- Hint: Which particles are free to move, and which stay in rows?
- Explanation: Particles 1 are positive metal ions, fixed in a regular pattern. Particles 2 are delocalised electrons, free to move. So particles 2 move through the metal and carry the charge.

### C16-16 · choice · `dataInterpretation, independent, independent` · visual `metal-dent-data`
**Q:** A student measured the force needed to dent three samples. Which conclusion does the data support?
- **0 In this test, both alloys needed more force to dent than pure copper ✓** · 1 Every alloy is harder than every pure metal · 2 Bronze is the best material for every job · 3 Pure copper cannot be dented
- Hint: Does the data cover every metal, or just these three samples?
- Explanation: Brass (120 N) and bronze (140 N) needed more force to dent than pure copper (50 N). So in this test the alloys were harder, but three samples cannot show that every alloy is harder than every metal.

### C16-17 · written · teacher-reviewed
**Q:** Use the structure of a metal to explain why metals conduct electricity and have high melting points.
- Hint: Describe the particles first, then the bond between them. Then use them to explain each property.
- Model answer: A metal is a giant structure of positive metal ions arranged in a regular pattern. The outer-shell electrons are delocalised, so they are free to move through the whole structure. There is a strong electrostatic attraction between the positive ions and the delocalised electrons: these are metallic bonds. A lot of energy is needed to break these strong bonds, so metals have high melting points. The delocalised electrons can move through the metal carrying electric charge, so metals conduct electricity.
- Rubric (4): A metal is a giant structure of positive metal ions in a regular pattern, with delocalised (free-moving) outer-shell electrons. / Metallic bonds are strong electrostatic attractions between the positive metal ions and the delocalised electrons. / A lot of energy is needed to break the strong metallic bonds, so the melting point is high. / The delocalised electrons move through the metal and carry electric charge, so metals conduct electricity.
- Reject: Saying the metal ions move to carry the charge. / Saying metals are made of small molecules with weak forces between them. / Describing a metallic bond as a shared pair of electrons between two atoms.
