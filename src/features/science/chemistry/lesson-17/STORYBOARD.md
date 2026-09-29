# Chemistry Lesson 17 storyboard — States of matter and changing state

Chapter C2, Bonding, structure and properties of matter. Folder `chemistry/lesson-17`, id `C-BND-017-C`, skill `C-STATES-OF-MATTER`. It builds on atoms, ions and molecules from earlier Chemistry lessons, and on the everyday idea that solids keep their shape.

Big idea: every substance is made of particles. How strongly the particles attract each other, and how much energy they have, decides whether a substance is a solid, a liquid or a gas. Changing state is a physical change: heating gives particles enough energy to break free or overcome the forces, cooling lets the forces pull them back. The stronger the forces, the higher the melting and boiling points, so the two points predict the state at any temperature. State symbols record the state in an equation.

Flow note: the lesson keeps one set of three particle boxes (solid, liquid, gas) and reuses it in every section, so each new idea is added to a picture the student already knows.
1. **How are the particles arranged?** The particle model (atom, ion or molecule → one small solid ball) → solid → liquid → gas → hotter means faster → the three side by side. The states come first because every later idea (changing state, forces, symbols) is described in their terms.
2. **What happens when a state changes?** Physical change (same particles) → melting → boiling → condensing → freezing → one picture with both temperatures. Heating changes come before cooling changes because cooling is explained as the reverse. "Physical change" comes first so the student never thinks the particles themselves melt.
3. **Which state at a given temperature?** Forces and energy (weak v strong links) → oxygen v water on one temperature scale → below the melting point → above the boiling point → in between (25 °C) → worked table (chlorine, mercury, sulfur). The rule "stronger forces → higher melting and boiling points" is taught before prediction, so predicting is reading a strip, not memorising. Guided practice uses a near-identical table with new substances.
4. **How do equations show state?** (s), (l), (g) → (aq), aqueous → reading a real equation → H₂O(s), H₂O(l), H₂O(g). Symbols come last because (s), (l) and (g) now have a clear particle meaning, and the water frame links back to physical change.
5. **On your own**: three numbered particle boxes in assessment view; a new substance (white phosphorus) on a temperature strip with a "boiling point of water" distractor; a new equation (hydrogen burning); a written description of ice melting and boiling.

Sections:
1. Start here (C17-01): which everyday object keeps its own shape (prior knowledge).
2. How are the particles arranged? (C17-02–05): particle model → solid → liquid → gas → hotter means faster → put together. Checks: fixed volume but not shape; why a gas fills a container; particles in a solid vibrate.
3. What happens when a state changes? (C17-06–08): physical change → melting → boiling → condensing → freezing → put together. Checks: steam on a cold window (condensing); what happens to particles when ice melts.
4. Which state at a given temperature? (C17-09–11): forces and energy → oxygen v water → below / above / between → worked table. Checks: stronger forces → higher boiling point; which substance is a liquid at 25 °C (table).
5. How do equations show state? (C17-12–14): (s), (l), (g) → (aq) → magnesium and hydrochloric acid → water in three states. Checks: meaning of (aq); sugar dissolved in tea.
6. On your own (C17-15–18): numbered boxes; white phosphorus at 100 °C; state symbols in 2H₂(g) + O₂(g) → 2H₂O(l); written task.

Wording rules: one new term per frame (particle model, physical change, melting point, boiling point, condensing, freezing, state symbols, aqueous); plain meaning first, then "this is called…"; earlier lessons referred to by topic only; "forces of attraction" is shortened to "forces" after the first mention.

Out of scope: the limitations of the particle model (Higher tier only, 5.2.2.2 HT: particles are not solid spheres, no forces shown); sublimation (not on the page); heating and cooling curves, latent heat and energy calculations (Physics); why particular substances have strong or weak forces (the bonding lessons); the book's cartoons, jokes, figure, worked example substances and exam questions.

Source boundary: supplied revision-guide pages 118–119 (scope only); AQA 8464 Chemistry 5.2.2.1 The three states of matter and 5.2.2.2 State symbols. The particle boxes, the oxygen/water comparison, the chlorine/mercury/sulfur table, the ammonia/iodine/propanone table, white phosphorus, the magnesium + hydrochloric acid and hydrogen-burning equations, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Melting and boiling points are real values rounded to the nearest degree: oxygen −219/−183 °C, water 0/100, chlorine −101/−34, mercury −39/357, sulfur 115/445 (sulfur boils at 444.6 °C), ammonia −78/−33, iodine 114/184, propanone −95/56, white phosphorus 44/280.
- "Room temperature is usually taken as 25 °C", as on the page.
- Oxygen v water is used to show "stronger forces → higher melting and boiling points" without naming the kind of force (hydrogen bonding is not Foundation content). The frame says only that the forces between water particles are stronger.
- The forces picture draws forces as links between particles, labelled only "weaker forces" and "stronger forces"; the lesson does not say whether they are bonds or intermolecular forces (the bonding lessons do that).
- The "hotter" frame shows a solid and a gas only; the text adds that liquid particles also move faster.
- Condensing is described as happening "at the boiling point" and freezing "at the melting point", as on the page.

## Diagram plan
- `components/StateVisuals.tsx`, focus prefix `state-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette` from AtomVisuals and the PeriodicVisuals tints. Particles are plain soft-grey balls (the neutral particle colour); coral red = heating, energy in and the frame's focus; electron blue = cooling. Temperature strips: solid soft grey, liquid pale blue, gas pale amber.
- **Particle model** (`state-model`): an argon atom, a sodium ion (coral, positive) and a water molecule, each with an arrow to one identical grey ball.
- **Three boxes** (`state-solid`, `-liquid`, `-gas`, `-all`): one closed box per state with four short property lines; the frame's state highlighted, the others faded. Solid: a 5 × 4 block on the box floor with vibration arcs. Liquid: touching particles in a random order filling the bottom, two slide arrows. Gas: six far-apart particles with straight arrows.
- **Hotter** (`state-hotter`): cooler v hotter solid (more vibration arcs) and gas (longer arrows).
- **Changing state** (`state-change-physical`, `-melt`, `-boil`, `-condense`, `-freeze`, `-all`): the three boxes smaller in a row, melting and boiling arrows (coral) above, freezing and condensing arrows (blue) below, one arrow highlighted per frame and a two-line note underneath.
- **Forces** (`state-mp-forces`): two spaced-out solid blocks, thin dashed links v thick coral links, with an "energy needed" bar under each.
- **Temperature strips** (`state-mp-compare`, `state-predict-solid`, `-gas`, `-liquid`): oxygen and water on one scale; then water alone with the solid, gas and liquid zones lit in turn and a 25 °C marker.
- **Tables** (`state-predict-example` with the answers column; `state-predict-guided` without).
- **State symbols** (`state-symbol-list`, `-aq`, `-equation`, `-water`): four symbol cards with mini boxes and a beaker for (aq); the magnesium equation with a leader from each state symbol; ice, water and steam boxes with H₂O(s), H₂O(l), H₂O(g).
- **Question visuals**: `state-question-boxes` (solid, gas, liquid numbered 1–3; names appear only after answering) and `state-question-phosphorus` (strip with 44 °C and 280 °C and a 100 °C marker; zone colours and names appear only after answering).

## States in full

### C17-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** You move each of these into a different container. Which one keeps its own shape?
- 0 Orange juice · 1 The air in a balloon · **2 A wooden block ✓**
- Hint: Which one could you pick up and it would stay the same?
- Explanation: Juice flows to fill the bottom of a container, and air spreads out to fill all of it. A wooden block is a solid, so it keeps its own shape wherever you put it.

### C17-02 · teach "How are the particles arranged?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The particle model | Every substance is made of tiny particles, drawn as small solid balls. | atom, ion or molecule → one small ball | Every substance is made of tiny particles. The particles can be atoms, ions or molecules. To explain how substances behave, we draw each particle as a small, solid ball. This way of picturing substances is called the particle model. | `state-model` |
| Solids | In a solid, strong forces hold the particles in fixed positions. | strong forces → fixed positions → fixed shape | In a solid, there are strong forces of attraction between the particles. The forces hold each particle in a fixed position, in a regular pattern. The particles can only vibrate on the spot. So a solid keeps a fixed shape and a fixed volume. | `state-solid` |
| Liquids | In a liquid, the particles are close together but can move past each other. | weak forces → move past each other → flows | In a liquid, the forces between the particles are weak. The particles stay close together, but in a random order. They move around and slide past each other. So a liquid has a fixed volume, but it flows to fill the bottom of its container. | `state-liquid` |
| Gases | In a gas, the particles are far apart and move in all directions. | very weak forces → far apart → fills the container | In a gas, the forces between the particles are very weak. The particles are far apart. They move quickly in straight lines, in random directions. So a gas has no fixed shape or volume, and it spreads out to fill any container. | `state-gas` |
| Hotter means faster | Heating gives the particles more energy. | hotter → more energy → faster | When a substance gets hotter, its particles gain energy. In a solid, the particles vibrate more. In a liquid or a gas, the particles move faster. The hotter it gets, the more the particles move. | `state-hotter` |
| Put it together | The forces between particles decide how each state behaves. | strong → weak → very weak forces | Solid, liquid and gas are the three states of matter. In a solid, strong forces hold the particles in place. In a liquid, weaker forces keep them close but let them move. In a gas, the forces are very weak and the particles spread out. | `state-all` |

### C17-03 · choice · `understanding, guided, practice`
**Q:** A substance has a fixed volume, but it takes the shape of the bottom of its container. What state is it in?
- 0 Solid · **1 Liquid ✓** · 2 Gas · 3 It could be any state
- Hint: Which state flows but does not spread out to fill the whole container?
- Explanation: A solid keeps its own shape, and a gas has no fixed volume. A liquid has a fixed volume but flows to fill the bottom of its container.

### C17-04 · choice · `understanding, guided, practice`
**Q:** Why does a gas spread out to fill any container?
- 0 Its particles get bigger when it spreads · 1 Its particles are held in a regular pattern · 2 Its particles are close together and touching · **3 Its particles move freely, with very weak forces between them ✓**
- Hint: How strong are the forces between gas particles?
- Explanation: The forces between gas particles are very weak, and the particles are far apart. So they move in straight lines in random directions until they fill the container. The particles themselves do not get bigger.

### C17-05 · choice · `understanding, guided, practice`
**Q:** Which sentence describes the particles in a solid?
- **0 They vibrate in fixed positions ✓** · 1 They do not move at all · 2 They are far apart from each other · 3 They slide past each other
- Hint: Strong forces hold them in place. Can they still move a little?
- Explanation: Strong forces hold the particles of a solid in fixed positions in a regular pattern. They cannot move around, but they do vibrate on the spot.

### C17-06 · teach "What happens when a state changes?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A physical change | Changing state does not make a new substance. | same particles, new arrangement | Ice, water and steam are all made of the same water particles. When a substance changes state, the particles themselves do not change. Only their arrangement and their energy change. A change like this, with no new substance made, is called a physical change. | `state-change-physical` |
| Melting | Heating a solid can turn it into a liquid. | heat → vibrate more → break free | When a solid is heated, its particles gain energy and vibrate more. This weakens some of the forces between them. At one temperature, the particles have enough energy to break free from their fixed positions. The solid melts into a liquid. This temperature is called the melting point. | `state-change-melt` |
| Boiling | Heating a liquid can turn it into a gas. | more heat → overcome the forces → gas | When a liquid is heated, its particles gain even more energy. The forces holding the liquid together get weaker. At one temperature, the particles have enough energy to overcome these forces and spread out. The liquid boils into a gas. This temperature is called the boiling point. | `state-change-boil` |
| Condensing | Cooling a gas can turn it back into a liquid. | cool → less energy → forces pull together | When a gas cools, its particles lose energy and move more slowly. The forces between them get stronger. At the boiling point, the forces are strong enough to pull the particles close together. The gas turns into a liquid. This is called condensing. | `state-change-condense` |
| Freezing | Cooling a liquid can turn it into a solid. | cool more → held in place → solid | When a liquid cools, its particles lose even more energy and move less. The forces between them get stronger still. At the melting point, the forces hold the particles in fixed positions. The liquid turns into a solid. This is called freezing. | `state-change-freeze` |
| Put it together | Two temperatures mark the four changes of state. | melting point: melt or freeze · boiling point: boil or condense | Melting and boiling need energy, so they happen when a substance is heated. Condensing and freezing happen when it cools and loses energy. A substance melts and freezes at the same temperature, its melting point. It boils and condenses at its boiling point. | `state-change-all` |

### C17-07 · choice · `understanding, guided, practice`
**Q:** Steam hits a cold window and turns into water droplets. What is this change of state called?
- 0 Boiling · 1 Freezing · **2 Condensing ✓** · 3 Melting
- Hint: Steam is a gas. What does it turn into?
- Explanation: The steam cools, so its particles lose energy and the forces pull them together. A gas turning into a liquid is called condensing.

### C17-08 · choice · `understanding, guided, practice`
**Q:** When ice melts, what happens to its particles?
- 0 They melt and get smaller · **1 They gain energy and break free from fixed positions ✓** · 2 They turn into a new substance · 3 They lose energy and slow down
- Hint: Is energy going in or out when ice melts?
- Explanation: Melting needs heat, so the particles gain energy and vibrate more. At the melting point they break free from their fixed positions. The particles themselves stay the same.

### C17-09 · teach "Which state at a given temperature?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Forces and energy | Stronger forces need more energy to overcome. | stronger forces → more energy → higher melting point | To change state, particles need enough energy to overcome the forces between them. If the forces are weak, only a little energy is needed. If the forces are strong, a lot of energy is needed. So the stronger the forces, the higher the melting and boiling points. | `state-mp-forces` |
| Comparing two substances | Different substances melt and boil at different temperatures. | higher melting and boiling points → stronger forces | Oxygen melts at −219 °C and boils at −183 °C. Water melts at 0 °C and boils at 100 °C. Both are much higher for water. This tells us the forces between water particles are stronger than those between oxygen particles. | `state-mp-compare` |
| Below the melting point | Colder than its melting point, a substance is a solid. | below melting point → solid | You can use the melting and boiling points to predict the state of a substance. If the temperature is below the melting point, the substance is a solid. Water melts at 0 °C. So at −10 °C, water is a solid: ice. | `state-predict-solid` |
| Above the boiling point | Hotter than its boiling point, a substance is a gas. | above boiling point → gas | If the temperature is above the boiling point, the substance is a gas. Water boils at 100 °C. So at 120 °C, water is a gas: steam. | `state-predict-gas` |
| In between | Between its melting and boiling points, a substance is a liquid. | between the two → liquid | If the temperature is between the melting point and the boiling point, the substance is a liquid. Room temperature is usually taken as 25 °C. This is between 0 °C and 100 °C. So at room temperature, water is a liquid. | `state-predict-liquid` |
| Put it together | Compare the temperature with both points, one substance at a time. | below → solid · between → liquid · above → gas | Chlorine boils at −34 °C, so 25 °C is above its boiling point: it is a gas. Mercury melts at −39 °C and boils at 357 °C, so it is a liquid. Sulfur melts at 115 °C, so 25 °C is below its melting point: it is a solid. | `state-predict-example` |

### C17-10 · choice · `understanding, guided, practice`
**Q:** The forces between particles are stronger in substance A than in substance B. What does this tell you?
- **0 A has a higher boiling point than B ✓** · 1 A has a lower melting point than B · 2 A is always a gas · 3 A needs less energy to melt than B
- Hint: Stronger forces need more or less energy to overcome?
- Explanation: Stronger forces need more energy to overcome. So substance A has to be heated to a higher temperature to melt or boil: it has the higher melting and boiling points.

### C17-11 · choice · `dataInterpretation, guided, practice` · visual `state-predict-guided`
**Q:** Use the table. Which substance is a liquid at room temperature (25 °C)?
- 0 Ammonia · 1 Iodine · 2 None of them · **3 Propanone ✓**
- Hint: For each substance, is 25 °C below, between or above its two points?
- Explanation: Ammonia boils at −33 °C, so it is a gas at 25 °C. Iodine melts at 114 °C, so it is a solid. Propanone melts at −95 °C and boils at 56 °C. 25 °C is between these, so propanone is a liquid.

### C17-12 · teach "How do equations show state?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| State symbols | Short letters in an equation show each substance’s state. | (s) solid · (l) liquid · (g) gas | A symbol equation can show the state of each substance. A short letter in brackets goes straight after each formula. (s) means solid, (l) means liquid and (g) means gas. These letters are called state symbols. | `state-symbol-list` |
| Aqueous | A fourth symbol shows that a substance is dissolved in water. | dissolved in water → (aq) | Many reactions happen in water. When a substance is dissolved in water, it is not shown as a solid. It gets the state symbol (aq). This stands for aqueous, which means dissolved in water. Salt water is sodium chloride dissolved in water, so it is NaCl(aq). | `state-symbol-aq` |
| Reading an equation | The state symbols tell you what each substance is like. | read each symbol after its formula | When magnesium reacts with hydrochloric acid, it makes magnesium chloride and hydrogen. Magnesium is a solid metal, so it is Mg(s). The acid and the magnesium chloride are both dissolved in water, so they are (aq). Hydrogen is a gas, so it is H₂(g). | `state-symbol-equation` |
| Put it together | The same substance can have different state symbols. | same formula, different symbol | Ice, liquid water and steam all have the formula H₂O. The particles are the same, so the formula stays the same. Only the state symbol changes: H₂O(s), H₂O(l) or H₂O(g). This matches what you know: changing state is a physical change. | `state-symbol-water` |

### C17-13 · choice · `understanding, guided, practice`
**Q:** What does the state symbol (aq) tell you about a substance?
- **0 It is dissolved in water ✓** · 1 It is a pure liquid · 2 It is water · 3 It is a gas
- Hint: What does aqueous mean?
- Explanation: (aq) stands for aqueous, which means dissolved in water. A pure liquid has the symbol (l) instead.

### C17-14 · choice · `understanding, guided, practice`
**Q:** Sugar is dissolved in a cup of tea. Which state symbol should the sugar have in an equation?
- 0 (s) · 1 (l) · 2 (g) · **3 (aq) ✓**
- Hint: The sugar is not a solid lump any more. Where is it?
- Explanation: The sugar has dissolved in the water in the tea. A substance dissolved in water has the state symbol (aq).

### C17-15 · choice · `understanding, independent, independent` · visual `state-question-boxes`
**Q:** Which numbered box shows particles with a fixed volume but no fixed shape?
- 0 Box 1 · 1 Box 2 · **2 Box 3 ✓**
- Hint: Look for particles that touch but are not in a pattern.
- Explanation: Box 1 is a solid: a regular block. Box 2 is a gas: particles far apart. Box 3 is a liquid: its particles touch in a random order and fill the bottom of the box. A liquid has a fixed volume but no fixed shape.

### C17-16 · choice · `dataInterpretation, independent, independent` · visual `state-question-phosphorus`
**Q:** White phosphorus melts at 44 °C and boils at 280 °C. What state is it in at 100 °C?
- 0 Solid · **1 Liquid ✓** · 2 Gas, because 100 °C is a boiling point · 3 A mix of solid and gas
- Hint: Is 100 °C below, between or above its two points?
- Explanation: 100 °C is above the melting point (44 °C) but below the boiling point (280 °C). So white phosphorus is a liquid at 100 °C. 100 °C is the boiling point of water, not of phosphorus.

### C17-17 · choice · `application, independent, independent`
**Q:** Hydrogen burns in oxygen: 2H₂(g) + O₂(g) → 2H₂O(l). What do the state symbols tell you?
- **0 Both reactants are gases, and the water made is a liquid ✓** · 1 The water made is dissolved in hydrogen · 2 All three substances are liquids · 3 The water made is steam
- Hint: Read the symbol straight after each formula.
- Explanation: H₂ and O₂ both have (g), so both reactants are gases. H₂O has (l), so the water made is a liquid, not steam.

### C17-18 · written · teacher-reviewed
**Q:** Describe what happens to the particles when ice is heated until it melts, and then until the water boils.
- Hint: Use the words energy, forces, melting point and boiling point. Say how the particles are arranged and how they move.
- Model answer: In ice, strong forces hold the particles in fixed positions, and they vibrate on the spot. When the ice is heated, the particles gain energy and vibrate more. At the melting point, they have enough energy to break free from their fixed positions, and the ice becomes liquid water. The particles are still close together but move past each other. Further heating gives them more energy, so they move faster and the forces weaken. At the boiling point, they have enough energy to overcome the forces, and the water becomes a gas, with particles far apart and moving randomly.
- Rubric (4): Heating gives the particles more energy, so they vibrate / move more. / At the melting point the particles break free from their fixed positions, and the solid becomes a liquid. / In the liquid the particles are still close together but move past each other. / At the boiling point the particles have enough energy to overcome the forces between them, and the liquid becomes a gas with particles far apart.
- Reject: Saying the particles themselves melt, expand or change into a new substance. / Saying the particles in ice do not move at all. / Saying the particles lose energy when they are heated.
