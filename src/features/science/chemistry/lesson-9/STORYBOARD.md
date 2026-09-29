# Chemistry Lesson 9 storyboard — Group 1: the alkali metals

Chapter C1b, The periodic table. Folder `chemistry/lesson-9`, id `C-PER-009-C`, skill `C-GROUP1`. It builds on electronic structure (electron shells lesson), ions (atoms lesson) and balancing equations (chemical equations lesson).

Big idea: the alkali metals all have one electron in their outer shell, so they react in similar ways, losing that electron to form 1+ ions. Going down the group the outer electron is further from the nucleus and lost more easily, so reactivity increases (while melting and boiling points fall and relative atomic mass rises). They react with water (metal hydroxide + hydrogen), chlorine (white metal chloride salts) and oxygen (metal oxide, a tarnish).

Flow note: meet the group before any trend, then explain the trends, then show the reactions, so each reaction can be read as "the same, but more vigorous further down".
1. **What are the alkali metals?** Where Group 1 is → one outer electron (Li, Na, K drawn) → soft → low density. The one-electron idea comes first because every later point hangs on it; the physical properties are quick wins before reactions.
2. **What changes down the group?** Losing the one electron → 1+ ion (the reason they react) → reactivity increases, "trend" → why (further from the nucleus, less attracted) → melting and boiling points fall → put it together with relative atomic mass. The ion comes first so "lost more easily" makes sense.
3. **What happens in water?** What you see (floats, moves, fizzes) → products and "metal hydroxide" → balanced equation 2Na + 2H₂O → 2NaOH + H₂ → lithium, sodium, potassium side by side. Observation before explanation; the comparison reuses the reactivity trend.
4. **What about chlorine and oxygen?** Hot sodium in chlorine → 2Na + Cl₂ → 2NaCl, more vigorous down the group → tarnishing with oxygen → summary of all three, each a 1+ ion in an ionic compound.
5. **On your own**: potassium in water in assessment view (which gas burns); invented example timings read without over-claiming; a new element (rubidium) predicted from the trend; a new balanced equation (lithium and chlorine); a written explanation of potassium v sodium.

Sections:
1. Start here (C9-01): the outer-shell number of 2,8,1 (prior knowledge from the electron shells lesson).
2. What are the alkali metals? (C9-02–04): Group 1 and its six elements → one outer electron → soft → low density. Checks: why similar reactions; what cutting and floating show.
3. What changes down the group? (C9-05–07): 1+ ion → more reactive, trend → why → melting and boiling points → summary with relative atomic mass. Checks: why potassium beats sodium; predict rubidium's melting point range.
4. What happens in water? (C9-08–10): floats, moves, fizzes → hydroxide + hydrogen, alkaline → balanced equation → Li/Na/K comparison. Checks: lithium's products; why potassium gives a flame.
5. What about chlorine and oxygen? (C9-11–13): sodium in chlorine → 2Na + Cl₂ → 2NaCl → tarnishing → summary. Checks: potassium in chlorine; why a cut surface goes dull.
6. On your own (C9-14–18): numbered potassium-in-water diagram; example timings; rubidium in water; lithium + chlorine equation; written task.

Wording rules: one new term per frame (alkali metals, density, 1+ ion, trend, metal hydroxide, salts, tarnishing, ionic compounds); plain meaning first; earlier topics referred to by topic ("You met balancing when you learned about chemical equations"); dot-and-cross and ionic bonding are left to the bonding lessons, so "ionic compounds" is only named.

Out of scope: flame tests and the crimson/yellow flame colours (AQA 5.8.3.1, chemistry-only), apart from potassium's lilac flame, which is what you see when the hydrogen ignites; the different oxides formed (Li₂O, Na₂O₂, KO₂); state symbols (taught with states of matter); rubidium, caesium and francium reactions beyond prediction; storage under oil; dot-and-cross diagrams of ionic compounds; the book's cartoons, jokes and questions.

Source boundary: supplied revision-guide page 106 (scope only); AQA 8464 Chemistry 5.1.2.5 (Group 1). The Li/Na/K atom drawings, the density chart, the knife and tarnish pictures, the particle equations, the example timings, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- The explanation of the reactivity trend (outer electron further from the nucleus, less attracted, lost more easily) is taught at Foundation, as on the page; please confirm this level is wanted.
- Balanced symbol equations for sodium with water and chlorine are taught and one new one (lithium + chlorine) is assessed independently; no oxide symbol equations.
- "Its solution is alkaline, which is how the alkali metals got their name" is a one-clause extension beyond the page.
- Data: melting points 181, 98, 63, 39, 28 °C; boiling points 1342, 883, 759, 688, 671 °C; densities 0.53, 0.97, 0.86 g/cm³ (iron 7.9); relative atomic masses as on the page (Li 7, Na 23, K 39, Rb 85, Cs 133, Fr 223). Francium shown as "too rare to measure".
- The C9-15 timings (40, 11, 3 s) are invented example results and are labelled as such.
- Nuclei in the shell diagrams are drawn as a single coral disc (protons and neutrons are in the atoms lesson) so that three atoms fit side by side.
- Sodium in chlorine is shown as a teacher demonstration in a gas jar; no fume-cupboard detail is given.

## Diagram plan
- `components/AlkaliVisuals.tsx`, focus prefix `alk-`, routed by `CellBiologyVisuals.tsx`. Chemistry palette from AtomVisuals: electrons blue on thin shells, the nucleus a coral disc, positive ions coral with square brackets and "+". Group 1 tiles use PeriodicVisuals' soft metal grey; coral marks the idea of the frame; water pale blue; chlorine gas pale green; oxygen/oxide amber; hydrogen bubbles white; potassium's flame lilac.
- **Group column** (`alk-group-table`, `-electron`, `-soft`, `-light`; `alk-trend-reactive`, `-melt`, `-all`): the same six tiles on the left in every frame, with the first three highlighted when only they are discussed; the right side changes: outline of the whole table, Li/Na/K shell atoms, knife and cut block, density bar chart, reactivity arrow, melting/boiling table, three trend cards.
- **Atoms** (`alk-trend-ion`, `alk-trend-why`): sodium atom → Na⁺ in brackets; Li, Na, K at one scale with a dashed nucleus-to-outer-electron line.
- **Water trough** (`alk-water-see`, `-products`, `-trend`, `alk-q-water`): one trough drawing with a floating piece, trail and bubbles; three small troughs for the comparison; the question view hides the key.
- **Equations** (`alk-water-equation`, `alk-cl-equation`): symbol equation with a particle picture and an atom count.
- **Chlorine and oxygen** (`alk-cl-react`, `alk-ox-tarnish`, `alk-react-all`): gas jar with spoon; shiny v tarnished slice (the same slice as the knife frame); three reaction cards.
- **Question visuals**: `alk-q-water` (numbered pointers; key only outside assessment) and `alk-q-data` (example timings table).

## States in full

### C9-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Sodium’s electronic structure is 2,8,1. How many electrons are in its outer shell?
- 0 8 · **1 1 ✓** · 2 11
- Hint: Which number stands for the outer shell?
- Explanation: The numbers go from the inner shell outwards, so the last number is the outer shell. Sodium has 1 electron in its outer shell (11 electrons in all).

### C9-02 · teach "What are the alkali metals?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Group 1 | The first column of the periodic table is Group 1. | first column → Group 1 → the alkali metals | Group 1 is the first column of the periodic table. It holds lithium, sodium, potassium, rubidium, caesium and francium. They are all metals. Together they are called the alkali metals. Hydrogen often sits above lithium, but it is not an alkali metal. | `alk-group-table` |
| One outer electron | Every alkali metal atom has one electron in its outer shell. | same number of outer electrons → similar reactions | You met electronic structures when you learned about electron shells. Lithium is 2,1, sodium is 2,8,1 and potassium is 2,8,8,1. Each has just one electron in its outer shell. Elements with the same number of outer electrons react in similar ways. So the alkali metals have similar properties. | `alk-group-electron` |
| Soft metals | Alkali metals are soft enough to cut with a knife. | a knife cuts it easily → soft | Most metals are hard. The alkali metals are soft, so a knife cuts them easily. The outside of a lump looks dull. But a freshly cut surface is shiny, like other metals. | `alk-group-soft` |
| Low density | Lithium, sodium and potassium float on water. | less dense than water → floats | Density tells you how heavy a material is for its size. Lithium, sodium and potassium are all less dense than water. So they float on water. Most metals, such as iron, are much denser and sink. | `alk-group-light` |

### C9-03 · choice · `understanding, guided, practice`
**Q:** Lithium, sodium and potassium react in similar ways. Why?
- 0 They all have the same number of shells · 1 They all float on water · **2 They all have one electron in their outer shell ✓** · 3 They all have the same relative atomic mass
- Hint: Look at the last number in 2,1, 2,8,1 and 2,8,8,1.
- Explanation: Lithium is 2,1, sodium 2,8,1 and potassium 2,8,8,1. Each has one electron in its outer shell, and elements with the same number of outer electrons react in similar ways.

### C9-04 · choice · `understanding, guided, practice`
**Q:** A lump of sodium is cut easily with a knife, and a small piece floats on water. What do these show?
- **0 It is soft and has a low density ✓** · 1 It is hard and has a high density · 2 It is soft and has a high density · 3 It is hard and has a low density
- Hint: What does floating on water tell you about density?
- Explanation: Being easy to cut shows sodium is soft. Floating shows it is less dense than water, so it has a low density.

### C9-05 · teach "What changes down the group?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Losing one electron | Alkali metals react by losing their one outer electron. | lose 1 electron → full outer shell → 1+ ion | When an alkali metal reacts, each atom loses its one outer electron. The shell underneath is full, so now the outer shell is full. The atom has one more proton than electrons, so it has a charge of 1+. You met charged particles like this, called ions, when you learned about atoms. Sodium forms the ion Na⁺. | `alk-trend-ion` |
| More reactive | Going down Group 1, the metals get more reactive. | down the group → more reactive → a trend | Going down Group 1, the metals get more reactive. Lithium fizzes steadily in water. Potassium reacts so fast that the hydrogen it makes catches fire. A pattern like this, going down a group, is called a trend. | `alk-trend-reactive` |
| Why reactivity increases | Further down, the outer electron is lost more easily. | more shells → further away → less attracted → lost more easily | Each step down the group adds one more shell of electrons. So the outer electron is further from the nucleus. The positive nucleus attracts it less strongly. So the outer electron is lost more easily, and the metal is more reactive. | `alk-trend-why` |
| Melting and boiling points | Melting and boiling points get lower going down the group. | down the group → lower melting and boiling points | Lithium melts at 181 °C, sodium at 98 °C and potassium at only 63 °C. So melting points get lower going down Group 1. Boiling points get lower too. Caesium melts at 28 °C, just above room temperature. | `alk-trend-melt` |
| Put it together | Three trends run down Group 1. | reactivity up, melting and boiling points down, mass up | Going down Group 1, reactivity increases. Melting and boiling points decrease. Relative atomic mass increases, from 7 for lithium to 133 for caesium. You can use these trends to predict how an element behaves from its place in the group. | `alk-trend-all` |

### C9-06 · choice · `understanding, guided, practice`
**Q:** Why is potassium more reactive than sodium?
- 0 Potassium has more electrons in its outer shell · 1 Potassium’s outer electron is closer to the nucleus · 2 Potassium has a higher melting point · **3 Potassium’s outer electron is further from the nucleus, so it is lost more easily ✓**
- Hint: Potassium has one more shell than sodium. Where does that put its outer electron?
- Explanation: Both have one outer electron, but potassium has one more shell, so its outer electron is further from the nucleus. It is less strongly attracted, so it is lost more easily. That makes potassium more reactive.

### C9-07 · choice · `dataInterpretation, guided, practice`
**Q:** Melting points: lithium 181 °C, sodium 98 °C, potassium 63 °C. What is the best prediction for rubidium, just below potassium?
- 0 Higher than 181 °C · 1 Between 98 °C and 181 °C · 2 Between 63 °C and 98 °C · **3 Lower than 63 °C ✓**
- Hint: Which way do the melting points go as you move down?
- Explanation: The melting points get lower going down Group 1. Rubidium is below potassium, so its melting point should be lower than 63 °C. It is 39 °C.

### C9-08 · teach "What happens in water?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| What you see | Sodium floats, moves around and fizzes on water. | floats, moves, fizzes → a gas is made | A teacher drops a tiny piece of sodium into a trough of water, behind a safety screen. It floats, because it is less dense than water. It moves around on the surface. It fizzes, which shows that a gas is being made. Lithium and potassium do the same. | `alk-water-see` |
| The products | The reaction makes a metal hydroxide and hydrogen. | alkali metal + water → metal hydroxide + hydrogen | The gas in the bubbles is hydrogen. The other product is sodium hydroxide, which dissolves in the water. A compound like this is called a metal hydroxide. Its solution is alkaline, which is how the alkali metals got their name. | `alk-water-products` |
| The symbol equation | The balanced equation is 2Na + 2H₂O → 2NaOH + H₂. | count each kind of atom on both sides | You met balancing when you learned about chemical equations. Hydrogen gas is made of H₂ molecules, so two sodium atoms must react. The balanced equation is 2Na + 2H₂O → 2NaOH + H₂. Count the atoms: 2 sodium, 4 hydrogen and 2 oxygen on each side. | `alk-water-equation` |
| Down the group | The reaction with water gets more vigorous going down. | lithium steady → sodium fast → potassium catches fire | Lithium fizzes steadily. Sodium fizzes faster and moves around quickly. Potassium reacts so vigorously that it gives out enough energy to set the hydrogen alight. The hydrogen burns with a lilac flame. The further down the group, the more violent the reaction. | `alk-water-trend` |

### C9-09 · choice · `understanding, guided, practice`
**Q:** Lithium reacts with water. What are the products?
- 0 Lithium oxide and water · **1 Lithium hydroxide and hydrogen ✓** · 2 Lithium chloride and hydrogen · 3 Lithium hydroxide and oxygen
- Hint: Alkali metal + water → metal hydroxide + ?
- Explanation: An alkali metal and water make a metal hydroxide and hydrogen. So lithium makes lithium hydroxide and hydrogen.

### C9-10 · choice · `understanding, guided, practice`
**Q:** Potassium’s reaction with water makes a flame, but lithium’s does not. Why?
- **0 Potassium reacts more vigorously, giving out enough energy to set the hydrogen alight ✓** · 1 Potassium makes oxygen instead of hydrogen · 2 Lithium does not react with water · 3 Potassium sinks, so it reacts faster
- Hint: Which is further down the group, and what does that do to the reaction?
- Explanation: Potassium is further down Group 1, so it reacts more vigorously than lithium. Its reaction gives out enough energy to set the hydrogen alight, which burns with a lilac flame.

### C9-11 · teach "What about chlorine and oxygen?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Reacting with chlorine | Hot sodium reacts vigorously with chlorine gas. | alkali metal + chlorine → metal chloride, a white salt | Chlorine is a pale green, poisonous gas. Hot sodium lowered into chlorine reacts vigorously. White clouds form and settle as a white powder of sodium chloride. White solids like this metal chloride are called salts. | `alk-cl-react` |
| The symbol equation | The balanced equation is 2Na + Cl₂ → 2NaCl. | Cl₂ has two atoms → two sodium atoms needed | Chlorine gas is made of Cl₂ molecules, with two atoms in each. So two sodium atoms react with each chlorine molecule. The balanced equation is 2Na + Cl₂ → 2NaCl. Going down the group, the reaction with chlorine gets more vigorous. | `alk-cl-equation` |
| Tarnishing | A freshly cut surface goes dull as it reacts with oxygen. | alkali metal + oxygen → metal oxide → dull surface | Alkali metals also react with oxygen in the air. A freshly cut surface of lithium is shiny. Within minutes, a thin layer of lithium oxide forms on it, so it looks dull. This dulling is called tarnishing. | `alk-ox-tarnish` |
| Put it together | Alkali metals form ionic compounds. | lose 1 electron → 1+ ion → ionic compound | With water, an alkali metal makes a metal hydroxide and hydrogen. With chlorine, it makes a metal chloride. With oxygen, it makes a metal oxide. Each time, the metal atom loses its outer electron and forms a 1+ ion. Compounds made of ions like this are called ionic compounds. | `alk-react-all` |

### C9-12 · choice · `understanding, guided, practice`
**Q:** Hot potassium is lowered into chlorine gas. What forms?
- 0 A green gas, potassium oxide · 1 Hydrogen gas · **2 A white solid, potassium chloride ✓** · 3 A grey metal, potassium hydroxide
- Hint: Alkali metal + chlorine → ?
- Explanation: An alkali metal and chlorine make a metal chloride. Metal chlorides are white solids (salts), so potassium chloride forms as a white solid.

### C9-13 · choice · `understanding, guided, practice`
**Q:** A freshly cut piece of sodium is shiny, but it soon goes dull. Why?
- 0 It dries out in the air · **1 It reacts with oxygen in the air to form sodium oxide ✓** · 2 It reacts with chlorine in the air · 3 It melts at room temperature
- Hint: Which gas in the air do alkali metals react with?
- Explanation: Alkali metals react with oxygen in the air. A thin, dull layer of sodium oxide forms on the surface. This is tarnishing.

### C9-14 · choice · `application, independent, independent` · visual `alk-q-water`
**Q:** Potassium is added to water. The gas made catches fire at label 2. Which gas is it?
- 0 Oxygen · **1 Hydrogen ✓** · 2 Chlorine · 3 Carbon dioxide
- Hint: What gas do alkali metals make with water?
- Explanation: Alkali metal + water → metal hydroxide + hydrogen. Potassium gives out enough energy to set the hydrogen alight, so the burning gas is hydrogen.

### C9-15 · choice · `dataInterpretation, independent, independent` · visual `alk-q-data`
**Q:** The table shows example results for same-sized pieces added to water. Which conclusion do these results support?
- 0 Every element gets more reactive going down any group · 1 Sodium is the most reactive of the three · **2 For these three metals, reactivity increases going down Group 1 ✓** · 3 Rubidium would take exactly 1 second
- Hint: A shorter time means a faster reaction. What do these three results show, and no more?
- Explanation: The times get shorter from lithium (40 s) to sodium (11 s) to potassium (3 s), so the reaction gets faster down the group. The data only covers these three metals in water. It says nothing exact about rubidium or about other groups.

### C9-16 · choice · `application, independent, independent`
**Q:** Rubidium is below potassium in Group 1. What would you expect when a tiny piece is added to water?
- **0 A more vigorous reaction than potassium, making rubidium hydroxide and hydrogen ✓** · 1 No reaction, because rubidium atoms are too heavy · 2 A slower reaction than lithium, making rubidium oxide · 3 It sinks and makes chlorine gas
- Hint: Use the trend in reactivity and the general word equation.
- Explanation: Reactivity increases going down Group 1, so rubidium reacts more vigorously than potassium. Like the others, it makes a metal hydroxide and hydrogen: rubidium hydroxide and hydrogen.

### C9-17 · choice · `application, independent, independent`
**Q:** Which is the balanced symbol equation for lithium reacting with chlorine?
- 0 Li + Cl₂ → LiCl · 1 2Li + Cl → 2LiCl · 2 2Li + 2Cl₂ → 2LiCl · **3 2Li + Cl₂ → 2LiCl ✓**
- Hint: Chlorine gas is Cl₂. Count each kind of atom on both sides.
- Explanation: Chlorine gas is Cl₂, and the product is lithium chloride, LiCl. Two lithium atoms react with one Cl₂ molecule: 2Li + Cl₂ → 2LiCl, with 2 lithium and 2 chlorine on each side, like sodium.

### C9-18 · written · teacher-reviewed
**Q:** Explain why potassium reacts more vigorously with water than sodium does. Name the products of the reaction.
- Hint: Compare their electronic structures, say how far the outer electron is from the nucleus, and give the word equation.
- Model answer: Sodium (2,8,1) and potassium (2,8,8,1) both have one electron in their outer shell, which they lose when they react. Potassium has one more shell, so its outer electron is further from the nucleus. It is less strongly attracted to the nucleus, so it is lost more easily, which makes potassium more reactive. Potassium reacts with water to make potassium hydroxide and hydrogen.
- Rubric (4): Both have one electron in their outer shell, which is lost when they react. / Potassium’s outer electron is further from the nucleus, because it has more shells. / So it is less strongly attracted to the nucleus and is lost more easily, making potassium more reactive. / The products are potassium hydroxide and hydrogen.
- Reject: Saying potassium has more outer electrons than sodium. / Saying potassium’s outer electron is closer to the nucleus or more strongly attracted. / Saying the products are potassium oxide and water, or that oxygen is made.
