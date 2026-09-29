# Chemistry Lesson 11 storyboard — Group 0: the noble gases

Chapter C1b, The periodic table. Folder `chemistry/lesson-11`, id `C-PER-011-C`, skill `C-NOBLE-GASES`. It builds on electronic structure (shells, 2,8,8) and on groups in the modern periodic table.

Big idea: the noble gases (Group 0) are colourless gases whose atoms already have a full outer shell. That stable arrangement means they barely react, exist as single atoms and can be used to keep air away from chemicals. Going down the group the atoms get heavier and have more electrons, so the forces between atoms get stronger and the boiling point rises, a pattern that lets you predict values.

Flow note: meet the family, then explain it, then use it, then extend it.
1. **Who are the noble gases?** Where Group 0 sits → the six members and the name → colourless gases. Students need to know which elements they are and what they look like before explaining anything.
2. **Why do they hardly react?** Helium's full first shell → neon and argon's 8 outer electrons → full means stable, so inert → single atoms. One drawing of helium, neon and argon is built up frame by frame; single atoms come last because they follow from "does not bond".
3. **What is an unreactive gas good for?** Air spoils some reactions → fill the flask with argon (unreactive atmosphere) → put it together. The use only makes sense once "inert" is understood.
4. **What changes down the group?** Relative atomic mass → electrons → forces between atoms → boiling point → the chain. One table gains a column per frame; the forces frame is a separate close-up because it is the hidden link.
5. **Can you predict a boiling point?** Predict a state (argon is a gas → helium and neon too) → predict a value from neighbours (argon between neon and krypton) → check it (−186 °C). Prediction needs the trend first.
6. **On your own**: numbered Group 0 boxes in assessment view (which has the highest boiling point); a student's data table read without over-claiming; argon shielding in welding (new scenario); written explanation of both the unreactivity and the boiling-point trend.

Sections:
1. Start here (C11-01): neon's 10 electrons are 2,8 (prior knowledge from electronic structure).
2. Who are the noble gases? (C11-02–04): Group 0 far right → He, Ne, Ar, Kr, Xe, Rn, "noble gases" → colourless gases. Checks: where they are; what a jar of neon looks like.
3. Why do they hardly react? (C11-05–07): helium 2 → neon 2,8 and argon 2,8,8 → full outer shell is stable, "inert" → single atoms. Checks: why unreactive; why helium with 2 is still in Group 0.
4. What is an unreactive gas good for? (C11-08–09): oxygen and water in air react → fill with argon, "atmosphere" → put it together. Check: why a chemist uses argon for a water-sensitive product.
5. What changes down the group? (C11-10–12): relative atomic mass 4 → 222 → electrons 2 → 86 → "forces between atoms" → boiling point −269 → −62 °C → chain. Checks: trend; why xenon boils higher than argon.
6. Can you predict a boiling point? (C11-13–14): predict a state → predict argon from neon and krypton → check (−186 °C). Check: krypton between argon and xenon (new numbers).
7. On your own (C11-15–18): numbered group; data table; welding; written task.

Wording rules: one new term per frame (Group 0, noble gases, colourless, inert, atmosphere, forces between atoms); plain meaning first; other lessons referred to by topic ("You met electron shells when you learned about electronic structure"); boiling points given with the real minus sign.

Out of scope: electronic structures beyond argon (krypton, xenon and radon are only said to have 8 outer electrons); why the forces are stronger in any detail (intermolecular forces are taught with simple molecules, and no "intermolecular" or "van der Waals" words here); noble gas compounds (xenon fluorides); uses beyond an unreactive atmosphere (balloons, lighting, signs); melting points; radioactivity of radon; the history of their discovery; Higher-tier content (none on the page); the book's jokes, examples and exam question.

Source boundary: supplied revision-guide page 108 (scope only; page 109 is a revision test and was not used); AQA 8464 Chemistry 5.1.2.4 (with 5.1.1.7 electronic structure, recalled). The jars, flasks, particle pictures, the argon prediction from neon and krypton, the krypton practice, the welding scenario, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Relative atomic masses as on the page (He 4, Ne 20, Ar 40, Kr 84, Xe 131, Rn 222). Boiling points rounded to the nearest °C: He −269, Ne −246, Ar −186, Kr −153, Xe −108, Rn −62.
- "More electrons mean stronger forces between atoms" follows the page's Foundation explanation; the forces are called "forces between atoms", with a note in the diagram that they are not bonds.
- "About 1% of air is argon" (0.93%) is given once as everyday context, not assessed.
- Predict-a-state reasoning ("argon is a gas at 25 °C, so it boils below 25 °C; helium and neon boil lower, so they are gases too") treats "above its boiling point" as "gas", which is fine for these elements.
- Welding (C11-17) is a new application of the unreactive atmosphere idea; the question explains the context in the stem.
- Bohr atoms draw the commonest isotope's nucleus (He-4, Ne-20, Ar-40).

## Diagram plan
- `components/NobleGasVisuals.tsx`, focus prefix `noble-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette`, `Electron` and `Nucleus` from AtomVisuals and `Arrow` from InfectionVisuals. Group 0 tiles and noble gas atoms in particle pictures use the soft grey tint PeriodicVisuals uses for a group; coral red (the proton colour) marks what the frame is about. Oxygen molecules amber (oxygen's group tint), water electron blue, nitrogen plain white.
- **Table outline** (`noble-table`): periods 1–6 of the table with the Group 0 column highlighted and its symbols shown.
- **Group 0 table** (`noble-members`, `noble-trend-mass`, `noble-trend-electrons`, `noble-trend-bp`, `noble-predict-state`): one column of He … Rn tiles with names; each trend frame adds and highlights one column (relative atomic mass, electrons, boiling point) with an "increases" arrow; the predict-state frame adds an "at 25 °C" column.
- **Jars** (`noble-colourless`): three sealed jars that look empty.
- **Shells** (`noble-shell-he`, `-ne-ar`, `-stable`): helium, neon and argon Bohr atoms; outer shells highlighted in turn; "full outer shell → stable → very unreactive (inert)" banner.
- **Single atoms** (`noble-single`): oxygen gas as pairs v argon gas as single atoms.
- **Flasks** (`noble-air`, `noble-argon`, `noble-atmosphere`): a chemical in air (nitrogen, oxygen, water; warning) and in argon (tick), each highlighted, then both.
- **Forces** (`noble-trend-forces`): two small helium atoms with thin pull arrows v two larger xenon atoms with thick ones.
- **Chain** (`noble-trend-chain`): five linked boxes beside a "down the group" arrow.
- **Number line** (`noble-predict-range`, `-check`): neon and krypton on a boiling-point line with the range between shaded; argon's prediction, then its real value.
- **Question visuals**: `noble-question` (six numbered boxes; symbols, names and boiling points appear only after answering) and `noble-data` (four-row data table).

## States in full

### C11-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Neon has 10 electrons. How are they arranged in shells?
- 0 8,2 · **1 2,8 ✓** · 2 2,4,4 · 3 10 in one shell
- Hint: How many electrons fit in the first shell?
- Explanation: The first shell holds 2 electrons, and the second holds up to 8. So neon’s 10 electrons are arranged 2,8, which fills both shells.

### C11-02 · teach "Who are the noble gases?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The last column | Group 0 is the column on the far right of the periodic table. | far right column → Group 0 | You met groups when you learned about the modern periodic table: columns of elements that behave in similar ways. The column on the far right is special. Its elements hardly react at all. This column is called Group 0. | `noble-table` |
| Six elements | Group 0 holds helium, neon, argon, krypton, xenon and radon. | He, Ne, Ar, Kr, Xe, Rn → the noble gases | Group 0 starts with helium at the top. Below it come neon, argon, krypton, xenon and radon. All six are gases, and they rarely react with anything. So the elements of Group 0 are called the noble gases. | `noble-members` |
| Colourless gases | At room temperature, every noble gas is a colourless gas. | room temperature → gas, no colour → looks empty | At room temperature, all the noble gases are gases. None of them has a colour, so a jar full of one looks empty. A gas with no colour is called colourless. About 1% of the air around you is argon, and you never notice it. | `noble-colourless` |

### C11-03 · choice · `understanding, guided, practice`
**Q:** Where are the noble gases in the periodic table?
- 0 In the column on the far left, Group 1 · 1 In the middle block of metals · **2 In the column on the far right, Group 0 ✓** · 3 Along the top row
- Hint: Which column was highlighted in the drawing?
- Explanation: The noble gases are the column on the far right of the periodic table. So they are Group 0. Group 1 is the column on the far left.

### C11-04 · choice · `understanding, guided, practice`
**Q:** A sealed jar is full of neon at room temperature. What would you see?
- **0 A jar that looks empty, because neon is a colourless gas ✓** · 1 A pale green gas · 2 A silvery liquid at the bottom · 3 A grey solid
- Hint: What state and colour are the noble gases at room temperature?
- Explanation: Neon, like every noble gas, is a gas at room temperature and has no colour. So the jar would look empty, even though it is full of neon.

### C11-05 · teach "Why do they hardly react?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Helium’s shell | Helium has 2 electrons, and its only shell holds 2. | 2 electrons → first shell full | You met electron shells when you learned about electronic structure. Helium has just 2 electrons. Both sit in the first shell, which can only hold 2. So helium’s outer shell is full. | `noble-shell-he` |
| Eight outer electrons | The other noble gases all have 8 electrons in their outer shell. | neon 2,8 · argon 2,8,8 → 8 outer electrons | Neon’s electrons are arranged 2,8, and argon’s are 2,8,8. So each has 8 electrons in its outer shell, which is full. Krypton, xenon and radon also have 8 outer electrons. So every noble gas has a full outer shell. | `noble-shell-ne-ar` |
| Full means stable | A full outer shell is stable, so noble gases are very unreactive. | full outer shell → stable → inert | Atoms of other elements react by losing, gaining or sharing electrons. This gives them a full outer shell. Noble gas atoms already have one, so they have no need to react. Their full outer shell is a stable arrangement. So noble gases are very unreactive, which is called inert. | `noble-shell-stable` |
| Single atoms | Noble gas atoms do not join up, so the gases are made of single atoms. | no bonds → single atoms, not molecules | Oxygen gas is made of molecules: pairs of atoms joined together. Noble gas atoms do not easily bond, not even to each other. So a noble gas is made of single atoms, each moving around on its own. | `noble-single` |

### C11-06 · choice · `understanding, guided, practice`
**Q:** Why are the noble gases very unreactive?
- 0 Their atoms have no electrons · 1 They are gases, and gases never react · 2 Their outer shells have only 1 electron · **3 Their atoms already have a full outer shell ✓**
- Hint: What do other atoms react to get?
- Explanation: Other atoms react by losing, gaining or sharing electrons to get a full outer shell. Noble gas atoms already have one, which is stable, so they have no need to react.

### C11-07 · choice · `understanding, guided, practice`
**Q:** Helium has only 2 outer electrons, but the other noble gases have 8. Why is helium still in Group 0?
- 0 Helium is not really a noble gas · **1 Its only shell holds 2, so 2 electrons make it full ✓** · 2 Helium has 8 electrons in its first shell · 3 Helium is the heaviest noble gas
- Hint: How many electrons can the first shell hold?
- Explanation: The first shell can only hold 2 electrons, and helium’s electrons are all in that shell. So helium also has a full, stable outer shell, like the other noble gases.

### C11-08 · teach "What is an unreactive gas good for?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| When air gets in the way | Oxygen or water in the air can react with some chemicals. | air → oxygen and water → unwanted reactions | Air contains oxygen and water vapour. Some chemicals react with these instead of taking part in the reaction you want. Sometimes the product you make reacts with the air and is spoiled. So some reactions cannot be done in air. | `noble-air` |
| Fill it with argon | The flask is filled with a noble gas, usually argon, instead of air. | push out the air → fill with argon | So chemists push the air out of the flask and fill it with a noble gas instead, usually argon. Argon does not react with the chemicals. A gas around the chemicals is called an atmosphere. So argon gives an unreactive atmosphere, and only the reaction you want happens. | `noble-argon` |
| Put it together | Noble gases protect chemicals because they do not react. | inert gas → keeps air away → chemicals protected | In air, oxygen and water can react with the chemicals. In argon, nothing reacts with them. So a noble gas keeps the air away and protects the reactants and products. This works only because noble gases are inert. | `noble-atmosphere` |

### C11-09 · choice · `understanding, guided, practice`
**Q:** A chemist makes a product that reacts with water vapour in air. Why does she fill the flask with argon?
- 0 Argon reacts with the product to make it stronger · 1 Argon is coloured, so she can see the product · **2 Argon keeps out the air, and argon itself does not react ✓** · 3 Argon speeds up every reaction
- Hint: What does argon do with other chemicals?
- Explanation: Argon is inert, so it does not react with the product. So a flask full of argon keeps out the water vapour in air and protects the product.

### C11-10 · teach "What changes down the group?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Heavier atoms | Relative atomic mass increases down Group 0. | down the group → heavier atoms | Look at the relative atomic masses down Group 0. Helium’s is 4, argon’s is 40 and radon’s is 222. So the atoms get heavier as you go down the group. | `noble-trend-mass` |
| More electrons | Atoms further down the group have more electrons. | further down → more protons → more electrons | Going down the group, each atom also has more protons, so it has more electrons. A helium atom has 2 electrons. An argon atom has 18, and a radon atom has 86. | `noble-trend-electrons` |
| Stronger forces | More electrons mean stronger forces between atoms. | more electrons → stronger forces between atoms | Noble gas atoms do not bond, but weak forces still pull neighbouring atoms towards each other. These are called forces between atoms. Atoms with more electrons pull on each other more strongly. So the forces between atoms get stronger down the group. | `noble-trend-forces` |
| Higher boiling points | Boiling point increases down Group 0. | stronger forces → more energy to separate → higher boiling point | To boil a liquid, its atoms must be separated from each other. Stronger forces take more energy to overcome, so the liquid must get hotter. So boiling point increases down the group. Helium boils at −269 °C and radon at −62 °C. | `noble-trend-bp` |
| Put it together | One chain of ideas explains the trend. | heavier → more electrons → stronger forces → higher boiling point | Going down Group 0, relative atomic mass increases. So each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate them, and the boiling point increases. | `noble-trend-chain` |

### C11-11 · choice · `understanding, guided, practice`
**Q:** What happens to the boiling points of the noble gases as you go down Group 0?
- **0 They increase ✓** · 1 They decrease · 2 They stay the same · 3 They go up, then down
- Hint: Compare helium at the top with radon at the bottom.
- Explanation: Helium boils at −269 °C and radon at −62 °C, with the others in between in order. So boiling point increases down Group 0.

### C11-12 · choice · `understanding, guided, practice`
**Q:** Xenon has a higher boiling point than argon. Which explanation is correct?
- 0 Xenon atoms have fewer electrons · 1 Xenon has a full outer shell but argon does not · 2 Xenon atoms are joined in pairs by strong bonds · **3 Xenon atoms have more electrons, so the forces between them are stronger ✓**
- Hint: What changes as atoms get more electrons?
- Explanation: Xenon is further down Group 0, so its atoms have more electrons than argon’s. So the forces between xenon atoms are stronger, and more energy is needed to boil it.

### C11-13 · teach "Can you predict a boiling point?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Predict a state | A pattern lets you predict a state from one known fact. | argon is a gas → neon and helium boil lower → also gases | Suppose you only know that argon is a gas at 25 °C. So argon boils below 25 °C. Helium and neon are above argon, so they boil at even lower temperatures. So they must be gases at 25 °C too. | `noble-predict-state` |
| Predict a value | An element’s boiling point lies between those of its neighbours. | between two neighbours → between their boiling points | Neon boils at −246 °C and krypton at −153 °C. Argon sits between them in the group. So its boiling point should be between −246 °C and −153 °C. A sensible prediction is about −200 °C. | `noble-predict-range` |
| Check the prediction | Argon’s real boiling point is inside the predicted range. | real value in the range → the pattern works | Argon really boils at −186 °C. This is between −246 °C and −153 °C, as predicted. It is not exactly −200 °C, because a pattern only shows roughly where a value lies. So give your prediction as a range or an estimate. | `noble-predict-check` |

### C11-14 · choice · `application, guided, practice`
**Q:** Krypton is between argon (−186 °C) and xenon (−108 °C) in Group 0. Which is the best prediction for krypton’s boiling point?
- 0 −250 °C · **1 −150 °C ✓** · 2 −50 °C · 3 +20 °C
- Hint: Which value lies between −186 °C and −108 °C?
- Explanation: Krypton is between argon and xenon in Group 0, so its boiling point should be between −186 °C and −108 °C. Only −150 °C is in that range. Krypton really boils at −153 °C.

### C11-15 · choice · `understanding, independent, independent` · visual `noble-question`
**Q:** The boxes show Group 0 in order, from top to bottom. Which box is the noble gas with the highest boiling point?
- 0 Box 1 · 1 Box 2 · 2 Box 4 · **3 Box 6 ✓**
- Hint: Which way does boiling point increase in Group 0?
- Explanation: Boiling point increases down Group 0. So the element at the bottom, box 6 (radon), has the highest boiling point.

### C11-16 · choice · `dataInterpretation, independent, independent` · visual `noble-data`
**Q:** A student’s table shows four noble gases. Which conclusion does the data support?
- **0 In this data, boiling point rises as relative atomic mass rises ✓** · 1 Boiling point doubles each time relative atomic mass doubles · 2 Krypton is a liquid at 25 °C · 3 Every noble gas boils above 0 °C
- Hint: Read down both columns. Do they go up together?
- Explanation: Going down the table, relative atomic mass rises from 4 to 84 and boiling point rises from −269 °C to −153 °C. So the data shows they rise together. It does not show an exact rule such as doubling.

### C11-17 · choice · `application, independent, independent`
**Q:** When steel is welded, the hot metal can react with oxygen in the air. Welders blow argon over the join. Why?
- 0 Argon reacts with oxygen and uses it up · 1 Argon makes the steel melt at a lower temperature · **2 Argon keeps the air away and does not react with the hot metal ✓** · 3 Argon adds electrons to the steel
- Hint: Does argon react with anything?
- Explanation: Argon is inert, so it does not react with the hot steel. So a stream of argon keeps oxygen away from the join, like an unreactive atmosphere in a flask.

### C11-18 · written · teacher-reviewed
**Q:** Explain why the noble gases are very unreactive, and why their boiling points increase down Group 0.
- Hint: First describe their outer shells. Then link relative atomic mass, electrons, forces between atoms and boiling point.
- Model answer: Noble gas atoms have a full outer shell: 8 electrons, or 2 for helium. This is a stable arrangement, so they do not need to lose, gain or share electrons, and they are very unreactive (inert). Going down Group 0, relative atomic mass increases and each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate the atoms, and the boiling point increases.
- Rubric (4): Noble gas atoms have a full outer shell (8 electrons; helium 2). / A full outer shell is stable, so they do not need to lose, gain or share electrons: very unreactive (inert). / Down the group, relative atomic mass increases and atoms have more electrons. / More electrons mean stronger forces between atoms, so more energy is needed to separate them: higher boiling point.
- Reject: Saying noble gases have no electrons or an empty outer shell. / Saying boiling point rises because stronger covalent bonds join the atoms. / Saying noble gases are unreactive just because they are gases.

### C11-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Neon has 10 electrons. How are they arranged in shells?
- 0 8,2 · **1 2,8 ✓** · 2 2,4,4 · 3 10 in one shell
- Hint: How many electrons fit in the first shell?
- Explanation: The first shell holds 2 electrons, and the second holds up to 8. So neon’s 10 electrons are arranged 2,8, which fills both shells.

### C11-02 · teach "Who are the noble gases?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The last column | Group 0 is the column on the far right of the periodic table. | far right column → Group 0 | You met groups when you learned about the modern periodic table: columns of elements that behave in similar ways. The column on the far right is special. Its elements hardly react at all. This column is called Group 0. | `noble-table` |
| Six elements | Group 0 holds helium, neon, argon, krypton, xenon and radon. | He, Ne, Ar, Kr, Xe, Rn → the noble gases | Group 0 starts with helium at the top. Below it come neon, argon, krypton, xenon and radon. All six are gases, and they rarely react with anything. So the elements of Group 0 are called the noble gases. | `noble-members` |
| Colourless gases | At room temperature, every noble gas is a colourless gas. | room temperature → gas, no colour → looks empty | At room temperature, all the noble gases are gases. None of them has a colour, so a jar full of one looks empty. A gas with no colour is called colourless. About 1% of the air around you is argon, and you never notice it. | `noble-colourless` |

### C11-03 · choice · `understanding, guided, practice`
**Q:** Where are the noble gases in the periodic table?
- 0 In the column on the far left, Group 1 · 1 In the middle block of metals · **2 In the column on the far right, Group 0 ✓** · 3 Along the top row
- Hint: Which column was highlighted in the drawing?
- Explanation: The noble gases are the column on the far right of the periodic table. So they are Group 0. Group 1 is the column on the far left.

### C11-04 · choice · `understanding, guided, practice`
**Q:** A sealed jar is full of neon at room temperature. What would you see?
- **0 A jar that looks empty, because neon is a colourless gas ✓** · 1 A pale green gas · 2 A silvery liquid at the bottom · 3 A grey solid
- Hint: What state and colour are the noble gases at room temperature?
- Explanation: Neon, like every noble gas, is a gas at room temperature and has no colour. So the jar would look empty, even though it is full of neon.

### C11-05 · teach "Why do they hardly react?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Helium’s shell | Helium has 2 electrons, and its only shell holds 2. | 2 electrons → first shell full | You met electron shells when you learned about electronic structure. Helium has just 2 electrons. Both sit in the first shell, which can only hold 2. So helium’s outer shell is full. | `noble-shell-he` |
| Eight outer electrons | The other noble gases all have 8 electrons in their outer shell. | neon 2,8 · argon 2,8,8 → 8 outer electrons | Neon’s electrons are arranged 2,8, and argon’s are 2,8,8. So each has 8 electrons in its outer shell, which is full. Krypton, xenon and radon also have 8 outer electrons. So every noble gas has a full outer shell. | `noble-shell-ne-ar` |
| Full means stable | A full outer shell is stable, so noble gases are very unreactive. | full outer shell → stable → inert | Atoms of other elements react by losing, gaining or sharing electrons. This gives them a full outer shell. Noble gas atoms already have one, so they have no need to react. Their full outer shell is a stable arrangement. So noble gases are very unreactive, which is called inert. | `noble-shell-stable` |
| Single atoms | Noble gas atoms do not join up, so the gases are made of single atoms. | no bonds → single atoms, not molecules | Oxygen gas is made of molecules: pairs of atoms joined together. Noble gas atoms do not easily bond, not even to each other. So a noble gas is made of single atoms, each moving around on its own. | `noble-single` |

### C11-06 · choice · `understanding, guided, practice`
**Q:** Why are the noble gases very unreactive?
- 0 Their atoms have no electrons · 1 They are gases, and gases never react · 2 Their outer shells have only 1 electron · **3 Their atoms already have a full outer shell ✓**
- Hint: What do other atoms react to get?
- Explanation: Other atoms react by losing, gaining or sharing electrons to get a full outer shell. Noble gas atoms already have one, which is stable, so they have no need to react.

### C11-07 · choice · `understanding, guided, practice`
**Q:** Helium has only 2 outer electrons, but the other noble gases have 8. Why is helium still in Group 0?
- 0 Helium is not really a noble gas · **1 Its only shell holds 2, so 2 electrons make it full ✓** · 2 Helium has 8 electrons in its first shell · 3 Helium is the heaviest noble gas
- Hint: How many electrons can the first shell hold?
- Explanation: The first shell can only hold 2 electrons, and helium’s electrons are all in that shell. So helium also has a full, stable outer shell, like the other noble gases.

### C11-08 · teach "What is an unreactive gas good for?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| When air gets in the way | Oxygen or water in the air can react with some chemicals. | air → oxygen and water → unwanted reactions | Air contains oxygen and water vapour. Some chemicals react with these instead of taking part in the reaction you want. Sometimes the product you make reacts with the air and is spoiled. So some reactions cannot be done in air. | `noble-air` |
| Fill it with argon | The flask is filled with a noble gas, usually argon, instead of air. | push out the air → fill with argon | So chemists push the air out of the flask and fill it with a noble gas instead, usually argon. Argon does not react with the chemicals. A gas around the chemicals is called an atmosphere. So argon gives an unreactive atmosphere, and only the reaction you want happens. | `noble-argon` |
| Put it together | Noble gases protect chemicals because they do not react. | inert gas → keeps air away → chemicals protected | In air, oxygen and water can react with the chemicals. In argon, nothing reacts with them. So a noble gas keeps the air away and protects the reactants and products. This works only because noble gases are inert. | `noble-atmosphere` |

### C11-09 · choice · `understanding, guided, practice`
**Q:** A chemist makes a product that reacts with water vapour in air. Why does she fill the flask with argon?
- 0 Argon reacts with the product to make it stronger · 1 Argon is coloured, so she can see the product · **2 Argon keeps out the air, and argon itself does not react ✓** · 3 Argon speeds up every reaction
- Hint: What does argon do with other chemicals?
- Explanation: Argon is inert, so it does not react with the product. So a flask full of argon keeps out the water vapour in air and protects the product.

### C11-10 · teach "What changes down the group?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Heavier atoms | Relative atomic mass increases down Group 0. | down the group → heavier atoms | Look at the relative atomic masses down Group 0. Helium’s is 4, argon’s is 40 and radon’s is 222. So the atoms get heavier as you go down the group. | `noble-trend-mass` |
| More electrons | Atoms further down the group have more electrons. | further down → more protons → more electrons | Going down the group, each atom also has more protons, so it has more electrons. A helium atom has 2 electrons. An argon atom has 18, and a radon atom has 86. | `noble-trend-electrons` |
| Stronger forces | More electrons mean stronger forces between atoms. | more electrons → stronger forces between atoms | Noble gas atoms do not bond, but weak forces still pull neighbouring atoms towards each other. These are called forces between atoms. Atoms with more electrons pull on each other more strongly. So the forces between atoms get stronger down the group. | `noble-trend-forces` |
| Higher boiling points | Boiling point increases down Group 0. | stronger forces → more energy to separate → higher boiling point | To boil a liquid, its atoms must be separated from each other. Stronger forces take more energy to overcome, so the liquid must get hotter. So boiling point increases down the group. Helium boils at −269 °C and radon at −62 °C. | `noble-trend-bp` |
| Put it together | One chain of ideas explains the trend. | heavier → more electrons → stronger forces → higher boiling point | Going down Group 0, relative atomic mass increases. So each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate them, and the boiling point increases. | `noble-trend-chain` |

### C11-11 · choice · `understanding, guided, practice`
**Q:** What happens to the boiling points of the noble gases as you go down Group 0?
- **0 They increase ✓** · 1 They decrease · 2 They stay the same · 3 They go up, then down
- Hint: Compare helium at the top with radon at the bottom.
- Explanation: Helium boils at −269 °C and radon at −62 °C, with the others in between in order. So boiling point increases down Group 0.

### C11-12 · choice · `understanding, guided, practice`
**Q:** Xenon has a higher boiling point than argon. Which explanation is correct?
- 0 Xenon atoms have fewer electrons · 1 Xenon has a full outer shell but argon does not · 2 Xenon atoms are joined in pairs by strong bonds · **3 Xenon atoms have more electrons, so the forces between them are stronger ✓**
- Hint: What changes as atoms get more electrons?
- Explanation: Xenon is further down Group 0, so its atoms have more electrons than argon’s. So the forces between xenon atoms are stronger, and more energy is needed to boil it.

### C11-13 · teach "Can you predict a boiling point?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Predict a state | A pattern lets you predict a state from one known fact. | argon is a gas → neon and helium boil lower → also gases | Suppose you only know that argon is a gas at 25 °C. So argon boils below 25 °C. Helium and neon are above argon, so they boil at even lower temperatures. So they must be gases at 25 °C too. | `noble-predict-state` |
| Predict a value | An element’s boiling point lies between those of its neighbours. | between two neighbours → between their boiling points | Neon boils at −246 °C and krypton at −153 °C. Argon sits between them in the group. So its boiling point should be between −246 °C and −153 °C. A sensible prediction is about −200 °C. | `noble-predict-range` |
| Check the prediction | Argon’s real boiling point is inside the predicted range. | real value in the range → the pattern works | Argon really boils at −186 °C. This is between −246 °C and −153 °C, as predicted. It is not exactly −200 °C, because a pattern only shows roughly where a value lies. So give your prediction as a range or an estimate. | `noble-predict-check` |

### C11-14 · choice · `application, guided, practice`
**Q:** Krypton is between argon (−186 °C) and xenon (−108 °C) in Group 0. Which is the best prediction for krypton’s boiling point?
- 0 −250 °C · **1 −150 °C ✓** · 2 −50 °C · 3 +20 °C
- Hint: Which value lies between −186 °C and −108 °C?
- Explanation: Krypton is between argon and xenon in Group 0, so its boiling point should be between −186 °C and −108 °C. Only −150 °C is in that range. Krypton really boils at −153 °C.

### C11-15 · choice · `understanding, independent, independent` · visual `noble-question`
**Q:** The boxes show Group 0 in order, from top to bottom. Which box is the noble gas with the highest boiling point?
- 0 Box 1 · 1 Box 2 · 2 Box 4 · **3 Box 6 ✓**
- Hint: Which way does boiling point increase in Group 0?
- Explanation: Boiling point increases down Group 0. So the element at the bottom, box 6 (radon), has the highest boiling point.

### C11-16 · choice · `dataInterpretation, independent, independent` · visual `noble-data`
**Q:** A student’s table shows four noble gases. Which conclusion does the data support?
- **0 In this data, boiling point rises as relative atomic mass rises ✓** · 1 Boiling point doubles each time relative atomic mass doubles · 2 Krypton is a liquid at 25 °C · 3 Every noble gas boils above 0 °C
- Hint: Read down both columns. Do they go up together?
- Explanation: Going down the table, relative atomic mass rises from 4 to 84 and boiling point rises from −269 °C to −153 °C. So the data shows they rise together. It does not show an exact rule such as doubling.

### C11-17 · choice · `application, independent, independent`
**Q:** When steel is welded, the hot metal can react with oxygen in the air. Welders blow argon over the join. Why?
- 0 Argon reacts with oxygen and uses it up · 1 Argon makes the steel melt at a lower temperature · **2 Argon keeps the air away and does not react with the hot metal ✓** · 3 Argon adds electrons to the steel
- Hint: Does argon react with anything?
- Explanation: Argon is inert, so it does not react with the hot steel. So a stream of argon keeps oxygen away from the join, like an unreactive atmosphere in a flask.

### C11-18 · written · teacher-reviewed
**Q:** Explain why the noble gases are very unreactive, and why their boiling points increase down Group 0.
- Hint: First describe their outer shells. Then link relative atomic mass, electrons, forces between atoms and boiling point.
- Model answer: Noble gas atoms have a full outer shell: 8 electrons, or 2 for helium. This is a stable arrangement, so they do not need to lose, gain or share electrons, and they are very unreactive (inert). Going down Group 0, relative atomic mass increases and each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate the atoms, and the boiling point increases.
- Rubric (4): Noble gas atoms have a full outer shell (8 electrons; helium 2). / A full outer shell is stable, so they do not need to lose, gain or share electrons: very unreactive (inert). / Down the group, relative atomic mass increases and atoms have more electrons. / More electrons mean stronger forces between atoms, so more energy is needed to separate them: higher boiling point.
- Reject: Saying noble gases have no electrons or an empty outer shell. / Saying boiling point rises because stronger covalent bonds join the atoms. / Saying noble gases are unreactive just because they are gases.

### C11-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Neon has 10 electrons. How are they arranged in shells?
- 0 8,2 · **1 2,8 ✓** · 2 2,4,4 · 3 10 in one shell
- Hint: How many electrons fit in the first shell?
- Explanation: The first shell holds 2 electrons, and the second holds up to 8. So neon’s 10 electrons are arranged 2,8, which fills both shells.

### C11-02 · teach "Who are the noble gases?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The last column | Group 0 is the column on the far right of the periodic table. | far right column → Group 0 | You met groups when you learned about the modern periodic table: columns of elements that behave in similar ways. The column on the far right is special. Its elements hardly react at all. This column is called Group 0. | `noble-table` |
| Six elements | Group 0 holds helium, neon, argon, krypton, xenon and radon. | He, Ne, Ar, Kr, Xe, Rn → the noble gases | Group 0 starts with helium at the top. Below it come neon, argon, krypton, xenon and radon. All six are gases, and they rarely react with anything. So the elements of Group 0 are called the noble gases. | `noble-members` |
| Colourless gases | At room temperature, every noble gas is a colourless gas. | room temperature → gas, no colour → looks empty | At room temperature, all the noble gases are gases. None of them has a colour, so a jar full of one looks empty. A gas with no colour is called colourless. About 1% of the air around you is argon, and you never notice it. | `noble-colourless` |

### C11-03 · choice · `understanding, guided, practice`
**Q:** Where are the noble gases in the periodic table?
- 0 In the column on the far left, Group 1 · 1 In the middle block of metals · **2 In the column on the far right, Group 0 ✓** · 3 Along the top row
- Hint: Which column was highlighted in the drawing?
- Explanation: The noble gases are the column on the far right of the periodic table. So they are Group 0. Group 1 is the column on the far left.

### C11-04 · choice · `understanding, guided, practice`
**Q:** A sealed jar is full of neon at room temperature. What would you see?
- **0 A jar that looks empty, because neon is a colourless gas ✓** · 1 A pale green gas · 2 A silvery liquid at the bottom · 3 A grey solid
- Hint: What state and colour are the noble gases at room temperature?
- Explanation: Neon, like every noble gas, is a gas at room temperature and has no colour. So the jar would look empty, even though it is full of neon.

### C11-05 · teach "Why do they hardly react?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Helium’s shell | Helium has 2 electrons, and its only shell holds 2. | 2 electrons → first shell full | You met electron shells when you learned about electronic structure. Helium has just 2 electrons. Both sit in the first shell, which can only hold 2. So helium’s outer shell is full. | `noble-shell-he` |
| Eight outer electrons | The other noble gases all have 8 electrons in their outer shell. | neon 2,8 · argon 2,8,8 → 8 outer electrons | Neon’s electrons are arranged 2,8, and argon’s are 2,8,8. So each has 8 electrons in its outer shell, which is full. Krypton, xenon and radon also have 8 outer electrons. So every noble gas has a full outer shell. | `noble-shell-ne-ar` |
| Full means stable | A full outer shell is stable, so noble gases are very unreactive. | full outer shell → stable → inert | Atoms of other elements react by losing, gaining or sharing electrons. This gives them a full outer shell. Noble gas atoms already have one, so they have no need to react. Their full outer shell is a stable arrangement. So noble gases are very unreactive, which is called inert. | `noble-shell-stable` |
| Single atoms | Noble gas atoms do not join up, so the gases are made of single atoms. | no bonds → single atoms, not molecules | Oxygen gas is made of molecules: pairs of atoms joined together. Noble gas atoms do not easily bond, not even to each other. So a noble gas is made of single atoms, each moving around on its own. | `noble-single` |

### C11-06 · choice · `understanding, guided, practice`
**Q:** Why are the noble gases very unreactive?
- 0 Their atoms have no electrons · 1 They are gases, and gases never react · 2 Their outer shells have only 1 electron · **3 Their atoms already have a full outer shell ✓**
- Hint: What do other atoms react to get?
- Explanation: Other atoms react by losing, gaining or sharing electrons to get a full outer shell. Noble gas atoms already have one, which is stable, so they have no need to react.

### C11-07 · choice · `understanding, guided, practice`
**Q:** Helium has only 2 outer electrons, but the other noble gases have 8. Why is helium still in Group 0?
- 0 Helium is not really a noble gas · **1 Its only shell holds 2, so 2 electrons make it full ✓** · 2 Helium has 8 electrons in its first shell · 3 Helium is the heaviest noble gas
- Hint: How many electrons can the first shell hold?
- Explanation: The first shell can only hold 2 electrons, and helium’s electrons are all in that shell. So helium also has a full, stable outer shell, like the other noble gases.

### C11-08 · teach "What is an unreactive gas good for?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| When air gets in the way | Oxygen or water in the air can react with some chemicals. | air → oxygen and water → unwanted reactions | Air contains oxygen and water vapour. Some chemicals react with these instead of taking part in the reaction you want. Sometimes the product you make reacts with the air and is spoiled. So some reactions cannot be done in air. | `noble-air` |
| Fill it with argon | The flask is filled with a noble gas, usually argon, instead of air. | push out the air → fill with argon | So chemists push the air out of the flask and fill it with a noble gas instead, usually argon. Argon does not react with the chemicals. A gas around the chemicals is called an atmosphere. So argon gives an unreactive atmosphere, and only the reaction you want happens. | `noble-argon` |
| Put it together | Noble gases protect chemicals because they do not react. | inert gas → keeps air away → chemicals protected | In air, oxygen and water can react with the chemicals. In argon, nothing reacts with them. So a noble gas keeps the air away and protects the reactants and products. This works only because noble gases are inert. | `noble-atmosphere` |

### C11-09 · choice · `understanding, guided, practice`
**Q:** A chemist makes a product that reacts with water vapour in air. Why does she fill the flask with argon?
- 0 Argon reacts with the product to make it stronger · 1 Argon is coloured, so she can see the product · **2 Argon keeps out the air, and argon itself does not react ✓** · 3 Argon speeds up every reaction
- Hint: What does argon do with other chemicals?
- Explanation: Argon is inert, so it does not react with the product. So a flask full of argon keeps out the water vapour in air and protects the product.

### C11-10 · teach "What changes down the group?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Heavier atoms | Relative atomic mass increases down Group 0. | down the group → heavier atoms | Look at the relative atomic masses down Group 0. Helium’s is 4, argon’s is 40 and radon’s is 222. So the atoms get heavier as you go down the group. | `noble-trend-mass` |
| More electrons | Atoms further down the group have more electrons. | further down → more protons → more electrons | Going down the group, each atom also has more protons, so it has more electrons. A helium atom has 2 electrons. An argon atom has 18, and a radon atom has 86. | `noble-trend-electrons` |
| Stronger forces | More electrons mean stronger forces between atoms. | more electrons → stronger forces between atoms | Noble gas atoms do not bond, but weak forces still pull neighbouring atoms towards each other. These are called forces between atoms. Atoms with more electrons pull on each other more strongly. So the forces between atoms get stronger down the group. | `noble-trend-forces` |
| Higher boiling points | Boiling point increases down Group 0. | stronger forces → more energy to separate → higher boiling point | To boil a liquid, its atoms must be separated from each other. Stronger forces take more energy to overcome, so the liquid must get hotter. So boiling point increases down the group. Helium boils at −269 °C and radon at −62 °C. | `noble-trend-bp` |
| Put it together | One chain of ideas explains the trend. | heavier → more electrons → stronger forces → higher boiling point | Going down Group 0, relative atomic mass increases. So each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate them, and the boiling point increases. | `noble-trend-chain` |

### C11-11 · choice · `understanding, guided, practice`
**Q:** What happens to the boiling points of the noble gases as you go down Group 0?
- **0 They increase ✓** · 1 They decrease · 2 They stay the same · 3 They go up, then down
- Hint: Compare helium at the top with radon at the bottom.
- Explanation: Helium boils at −269 °C and radon at −62 °C, with the others in between in order. So boiling point increases down Group 0.

### C11-12 · choice · `understanding, guided, practice`
**Q:** Xenon has a higher boiling point than argon. Which explanation is correct?
- 0 Xenon atoms have fewer electrons · 1 Xenon has a full outer shell but argon does not · 2 Xenon atoms are joined in pairs by strong bonds · **3 Xenon atoms have more electrons, so the forces between them are stronger ✓**
- Hint: What changes as atoms get more electrons?
- Explanation: Xenon is further down Group 0, so its atoms have more electrons than argon’s. So the forces between xenon atoms are stronger, and more energy is needed to boil it.

### C11-13 · teach "Can you predict a boiling point?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Predict a state | A pattern lets you predict a state from one known fact. | argon is a gas → neon and helium boil lower → also gases | Suppose you only know that argon is a gas at 25 °C. So argon boils below 25 °C. Helium and neon are above argon, so they boil at even lower temperatures. So they must be gases at 25 °C too. | `noble-predict-state` |
| Predict a value | An element’s boiling point lies between those of its neighbours. | between two neighbours → between their boiling points | Neon boils at −246 °C and krypton at −153 °C. Argon sits between them in the group. So its boiling point should be between −246 °C and −153 °C. A sensible prediction is about −200 °C. | `noble-predict-range` |
| Check the prediction | Argon’s real boiling point is inside the predicted range. | real value in the range → the pattern works | Argon really boils at −186 °C. This is between −246 °C and −153 °C, as predicted. It is not exactly −200 °C, because a pattern only shows roughly where a value lies. So give your prediction as a range or an estimate. | `noble-predict-check` |

### C11-14 · choice · `application, guided, practice`
**Q:** Krypton is between argon (−186 °C) and xenon (−108 °C) in Group 0. Which is the best prediction for krypton’s boiling point?
- 0 −250 °C · **1 −150 °C ✓** · 2 −50 °C · 3 +20 °C
- Hint: Which value lies between −186 °C and −108 °C?
- Explanation: Krypton is between argon and xenon in Group 0, so its boiling point should be between −186 °C and −108 °C. Only −150 °C is in that range. Krypton really boils at −153 °C.

### C11-15 · choice · `understanding, independent, independent` · visual `noble-question`
**Q:** The boxes show Group 0 in order, from top to bottom. Which box is the noble gas with the highest boiling point?
- 0 Box 1 · 1 Box 2 · 2 Box 4 · **3 Box 6 ✓**
- Hint: Which way does boiling point increase in Group 0?
- Explanation: Boiling point increases down Group 0. So the element at the bottom, box 6 (radon), has the highest boiling point.

### C11-16 · choice · `dataInterpretation, independent, independent` · visual `noble-data`
**Q:** A student’s table shows four noble gases. Which conclusion does the data support?
- **0 In this data, boiling point rises as relative atomic mass rises ✓** · 1 Boiling point doubles each time relative atomic mass doubles · 2 Krypton is a liquid at 25 °C · 3 Every noble gas boils above 0 °C
- Hint: Read down both columns. Do they go up together?
- Explanation: Going down the table, relative atomic mass rises from 4 to 84 and boiling point rises from −269 °C to −153 °C. So the data shows they rise together. It does not show an exact rule such as doubling.

### C11-17 · choice · `application, independent, independent`
**Q:** When steel is welded, the hot metal can react with oxygen in the air. Welders blow argon over the join. Why?
- 0 Argon reacts with oxygen and uses it up · 1 Argon makes the steel melt at a lower temperature · **2 Argon keeps the air away and does not react with the hot metal ✓** · 3 Argon adds electrons to the steel
- Hint: Does argon react with anything?
- Explanation: Argon is inert, so it does not react with the hot steel. So a stream of argon keeps oxygen away from the join, like an unreactive atmosphere in a flask.

### C11-18 · written · teacher-reviewed
**Q:** Explain why the noble gases are very unreactive, and why their boiling points increase down Group 0.
- Hint: First describe their outer shells. Then link relative atomic mass, electrons, forces between atoms and boiling point.
- Model answer: Noble gas atoms have a full outer shell: 8 electrons, or 2 for helium. This is a stable arrangement, so they do not need to lose, gain or share electrons, and they are very unreactive (inert). Going down Group 0, relative atomic mass increases and each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate the atoms, and the boiling point increases.
- Rubric (4): Noble gas atoms have a full outer shell (8 electrons; helium 2). / A full outer shell is stable, so they do not need to lose, gain or share electrons: very unreactive (inert). / Down the group, relative atomic mass increases and atoms have more electrons. / More electrons mean stronger forces between atoms, so more energy is needed to separate them: higher boiling point.
- Reject: Saying noble gases have no electrons or an empty outer shell. / Saying boiling point rises because stronger covalent bonds join the atoms. / Saying noble gases are unreactive just because they are gases.
