# Chemistry Lesson 8 storyboard — The modern periodic table

Chapter C1b, The periodic table. Folder `chemistry/lesson-8`, id `C-PER-008-C`, skill `C-PERIODIC-MODERN`. It builds on atomic number (the atoms lesson), electronic structure (2, 8, 8) and the history of the table (the previous lesson, not repeated here).

Big idea: the modern periodic table puts about 100 elements in order of atomic number, and its layout follows the electrons. The group number gives the outer-shell electrons (Group 0: a full outer shell), the period number gives the shells, so elements in a group react alike and trends let you predict. Metals sit on the left and bottom, lose electrons to form positive ions and share a set of physical properties; non-metals sit top right, gain or share electrons, and have roughly opposite properties.

Flow note: one drawing of the whole table is reused (periods 1–6 plus francium and radium, as on the source page), changing only what is highlighted, so the student builds one picture.
1. **How is the table laid out?** Order (atomic number) → reading a box → rows (period) → columns (group) → a repeating pattern (periodic). The layout has to exist before it can be explained.
2. **What does the group number tell you?** Group 1 atoms (one outer electron) → across period 2 (1 to 7) → Group 0 as the exception → shells and periods → put it together with chlorine. Electrons come before predictions because they are the reason groups behave alike.
3. **How can you make predictions?** Same outer shell → similar reactions → predicting from sodium → the Group 1 trend with water → predicting rubidium. It hands on to the Group 1 lesson.
4. **Where are the metals?** Metals (left, bottom, most elements) → non-metals (top right, staircase line) → metals lose electrons (positive ion) → non-metals gain or share → put it together. Position before reactions, because the side of the table explains the ions.
5. **How are metals and non-metals different?** Metal properties one at a time (malleable, conductor, high melting point) → non-metals (brittle, then the rest) → side-by-side summary. Properties come last: they describe, and the later metallic-bonding lesson explains.
6. **On your own**: a numbered blank table (same group, not same period); three invented samples read without over-claiming; bromine from its group and period (no full structure needed); a written explanation for magnesium.

Sections:
1. Start here (C8-01): lithium 2,1 has 1 outer electron (prior knowledge from electronic structure).
2. How is the table laid out? (C8-02–04): checks on atomic-number order and reading the magnesium box.
3. What does the group number tell you? (C8-05–07): checks on oxygen (Group 6 → 6) and 2,8,3 → Group 3, period 3.
4. How can you make predictions? (C8-08–10): checks on why sodium and potassium react alike and a melting-point trend (Li 181, Na 98, K 63 → Rb below 63 °C).
5. Where are the metals? (C8-11–13): checks on where metals are and magnesium losing 2 electrons.
6. How are metals and non-metals different? (C8-14–16): checks on a typical metal property and a dull, brittle solid.
7. On your own (C8-17–20).

Wording rules: one new term per frame (period, group, periodic, trend, malleable, conductor, brittle); plain meaning first; other lessons by topic in one clause ("You met ions when you learned about atoms"); British spelling (sulfur, caesium, aluminium).

Out of scope: Mendeleev and the history of the table (previous lesson); detail of Group 1, Group 7 and Group 0 reactions and trends (next lessons: only the Group 1 water trend is used, as the page does); how ions form in detail and dot-and-cross diagrams (bonding lessons); why metals conduct or are malleable (metallic bonding lesson); transition metals and the elements after radium; flame colours; the book's cartoons, jokes, figures and exam questions (its beryllium and chlorine/bromine questions were replaced with oxygen, 2,8,3 and sodium/potassium).

Source boundary: supplied revision-guide pages 104–105 (scope only); AQA 8464 Chemistry 5.1.2.1 and 5.1.2.3, with 5.1.1.7 used to explain groups and periods. The table drawing, all examples, data, questions, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- "About 100 elements" follows the spec and page (118 are known). The drawing stops at radium like the page; the starred boxes stand for 57–71 and 89–103.
- The staircase puts B, Si, As, Te and At on the non-metal side (as the page's line does); Ge, Sb and Po are shaded as metals. Hydrogen is shaded as a non-metal but left out of Group 1's list (Li to Fr, as on the page).
- "Groups 1 to 7 and 0" follows AQA; the middle block is described as having no group number.
- Group 1 water reactions: "lithium fizzes steadily, sodium faster, potassium faster still"; a note says these are teacher demonstrations only. Melting points used: Li 181, Na 98, K 63, Rb 39 °C.
- "Most non-metal atoms have four or more outer electrons" (hydrogen and helium are the exceptions; carbon has 4 and tends to share).
- Bromine (C8-19) is asked only as "7 outer electrons in 4 shells"; its full structure (2,8,18,7) is beyond the 2,8,8 rule and is never shown.
- The samples in C8-18 use real values for iron (1538 °C), sulfur (115 °C) and copper (1085 °C) but are not named.

## Diagram plan
- `components/TableVisuals.tsx`, focus prefix `mtab-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette`, `Electron` and `Nucleus` from AtomVisuals. Amber = "look here"; metals = coral proton tint; non-metals = electron-blue tint; atoms drawn as in the electronic-structure lesson, outer shell thick blue.
- **Whole table** (`mtab-order`, `-periods`, `-groups`, `-repeat`, `-metals`, `-nonmetals`): 18 columns, symbols in place, group numbers and period numbers where needed; order adds a row-2 strip with atomic numbers 3–10; the metal frames add the staircase line and a key.
- **Box** (`mtab-box`; question `mtab-box-q` with numbered pointers, labels hidden in assessment view).
- **Atoms** (`mtab-g1`, `-shells`: Li, Na, K; `mtab-g0`: He, Ne, Ar; `mtab-cl`: chlorine with a small table; `mtab-period2`: Li–Ne tiles with outer-electron dots).
- **Group 1 column** (`mtab-similar`, `-predict`, `-trend`, `-next`) and melting-point bars (`mtab-melt`, rubidium shown as "?" in assessment view).
- **Ions** (`mtab-lose`: Na → [Na]+ in brackets; `mtab-gain`: chlorine with one empty place; `mtab-sides`: small table with the two summaries).
- **Properties** (`mtab-prop-*`): metals and non-metals panels, one row highlighted per frame.
- **On your own**: `mtab-q-positions` (blank table, four numbered boxes: Na, Fe, S, K; names only outside assessment view), `mtab-q-samples` (data table).

## States in full

### C8-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A lithium atom has the electronic structure 2,1. How many electrons are in its outer shell?
- 0 2 · **1 1 ✓** · 2 3
- Hint: Which number is for the shell furthest from the nucleus?
- Explanation: In 2,1 the first shell holds 2 electrons and the outer shell holds 1. So lithium has 1 electron in its outer shell. You will see why that matters in this lesson.

### C8-02 · teach "How is the table laid out?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| About 100 elements | The modern table lists the elements in order of atomic number. | atomic number 1, 2, 3 … → one box each | There are about 100 elements. The modern periodic table gives each one its own box. The boxes go in order of atomic number, the number of protons in an atom. Read each row from left to right, then carry on at the start of the next row. | `mtab-order` |
| Reading a box | Each box shows a symbol and two numbers. | bottom number = atomic number; top number = relative atomic mass | Each box shows the element’s symbol and name. The number at the bottom is the atomic number. The number at the top is the relative atomic mass. For sodium, the atomic number is 11 and the relative atomic mass is 23. | `mtab-box` |
| Rows | A row of the table is called a period. | row across → period | The rows go across the table, and there are seven of them. Each row is called a period. Sodium is in the third row, so it is in period 3. | `mtab-periods` |
| Columns | A column of similar elements is called a group. | column down → group → similar elements | The columns go down the table. Elements in the same column have similar properties. A column like this is called a group. The groups are numbered 1 to 7, and the last column is Group 0. The elements in the wide middle block do not get a group number. | `mtab-groups` |
| A repeating pattern | Similar properties come back again, row after row. | pattern repeats every row → periodic | Rows 2 to 6 each start with a very reactive metal in Group 1. Each of these rows ends with an unreactive gas in Group 0. So the same pattern repeats, row after row. A pattern that repeats like this is called periodic, which is how the periodic table got its name. | `mtab-repeat` |

### C8-03 · choice · `understanding, guided, practice`
**Q:** In the modern periodic table, what order are the elements in?
- 0 Order of relative atomic mass · **1 Order of atomic number ✓** · 2 Order of discovery · 3 Alphabetical order of symbols
- Hint: Which number goes up by one from each box to the next?
- Explanation: Each box has an atomic number one more than the box before it. So the elements are in order of atomic number, the number of protons.

### C8-04 · choice · `understanding, guided, practice` · visual `mtab-box-q`
**Q:** Look at the box for magnesium. What is magnesium’s atomic number?
- **0 12 ✓** · 1 24 · 2 36 · 3 2
- Hint: Is the atomic number at the top or the bottom of the box?
- Explanation: The atomic number is the number at the bottom of the box. The top number, 24, is the relative atomic mass. So magnesium’s atomic number is 12: its atoms have 12 protons.

### C8-05 · teach "What does the group number tell you?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Group number | The group number is the number of electrons in the outer shell. | Group 1 → 1 outer electron | Lithium, sodium and potassium are all in Group 1. Lithium is 2,1, sodium is 2,8,1 and potassium is 2,8,8,1. Each one has a single electron in its outer shell. For Groups 1 to 7, the group number is the number of outer-shell electrons. | `mtab-g1` |
| Across a period | One group to the right means one more outer electron. | Group 1 → Group 7: 1 → 7 outer electrons | Look along period 2, from lithium to fluorine. Each element has one more electron than the one before. So the outer shell gains one electron at each step. Carbon is in Group 4, and its outer shell holds 4 electrons. | `mtab-period2` |
| Group 0 | Group 0 elements have a full outer shell. | Group 0 → full outer shell (helium 2, the rest 8) | Group 0 does not follow the number rule. Its elements all have a full outer shell. Helium has only one shell, so its full outer shell holds 2 electrons. Neon, argon and the rest of Group 0 have 8 electrons in their outer shell. | `mtab-g0` |
| Shells and periods | The period number is the number of shells. | one more period → one more shell | Lithium has electrons in 2 shells, and it is in period 2. Sodium has 3 shells and is in period 3. Potassium has 4 shells and is in period 4. So each new period starts a new shell of electrons. | `mtab-shells` |
| Put it together | Where an element sits tells you about its electrons. | group → outer electrons; period → shells | Chlorine is in Group 7 and period 3. Group 7 means it has 7 electrons in its outer shell. Period 3 means its electrons are in 3 shells. So chlorine’s electronic structure is 2,8,7. | `mtab-cl` |

### C8-06 · choice · `application, guided, practice`
**Q:** Oxygen is in Group 6 of the periodic table. How many electrons are in its outer shell?
- 0 8 · 1 2 · **2 6 ✓** · 3 16
- Hint: What does the group number count?
- Explanation: For Groups 1 to 7, the group number is the number of outer-shell electrons. So oxygen, in Group 6, has 6 electrons in its outer shell. Its structure is 2,6.

### C8-07 · choice · `application, guided, practice`
**Q:** An atom has the electronic structure 2,8,3. Where is it in the periodic table?
- **0 Group 3, period 3 ✓** · 1 Group 2, period 3 · 2 Group 3, period 2 · 3 Group 8, period 3
- Hint: Count the outer electrons, then count the shells.
- Explanation: The outer shell has 3 electrons, so it is in Group 3. Its electrons are in 3 shells, so it is in period 3. So it is in Group 3, period 3. It is aluminium.

### C8-08 · teach "How can you make predictions?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Same outer shell | Elements in the same group react in similar ways. | same number of outer electrons → similar reactions | All the elements in a group have the same number of outer-shell electrons. How an atom reacts depends mostly on its outer shell. So elements in the same group react in similar ways. For example, every Group 1 element is a metal with one outer electron. | `mtab-similar` |
| Predicting from one element | Knowing one element lets you predict the others in its group. | one element known → predict the rest of its group | Sodium reacts with cold water and makes hydrogen gas. Lithium and potassium are in the same group as sodium. So you can predict that they react with water too, and they do. You will learn more about Group 1 in the next lesson. | `mtab-predict` |
| A trend | Some properties change steadily down a group. | down Group 1 → more violent reaction with water | Lithium fizzes steadily in water. Sodium reacts faster, and potassium reacts faster still. So the reaction gets more violent as you go down Group 1. A steady change like this is called a trend. | `mtab-trend` |
| Put it together | A trend lets you predict an element you have not tested. | trend carries on → rubidium even more violent | Rubidium is below potassium in Group 1. It has one outer electron, so it should react with water like the others. The trend says it should react even more violently than potassium. Chemists use patterns like this to predict how elements behave. | `mtab-next` |

### C8-09 · choice · `understanding, guided, practice`
**Q:** Sodium and potassium are both in Group 1. Why do they react in similar ways?
- 0 They have the same atomic number · 1 They are in the same period · 2 They have the same relative atomic mass · **3 They have the same number of outer-shell electrons ✓**
- Hint: What do all the elements in one group share?
- Explanation: Sodium and potassium each have one electron in their outer shell. So they react in similar ways. They have different atomic numbers and are in different periods.

### C8-10 · choice · `dataInterpretation, guided, practice` · visual `mtab-melt`
**Q:** The chart shows melting points down Group 1. What is the best prediction for rubidium, below potassium?
- **0 Lower than 63 °C ✓** · 1 Higher than 181 °C · 2 Between 98 °C and 181 °C · 3 Exactly 63 °C
- Hint: Which way do the melting points change as you go down?
- Explanation: The melting point falls down the group: 181 °C, then 98 °C, then 63 °C. So rubidium, next in the trend, should melt below 63 °C. Its real melting point is 39 °C.

### C8-11 · teach "Where are the metals?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Metals | Most elements are metals, on the left and towards the bottom. | left and bottom → metals | The shaded boxes are the metals. Most elements are metals. They are on the left of the table and towards the bottom. Sodium, iron and gold are all metals. | `mtab-metals` |
| Non-metals | Non-metals are at the top right of the table. | top right → non-metals | The blue boxes are the non-metals. They are on the right of the table, towards the top. Oxygen, chlorine and neon are non-metals. Hydrogen, in its own box at the top, is a non-metal too. A zigzag staircase line separates the metals from the non-metals. | `mtab-nonmetals` |
| Metals lose electrons | Metal atoms lose outer electrons to make positive ions. | few outer electrons → lose them → positive ion | Metal atoms have only a few electrons in their outer shell. When they react, they lose these electrons quite easily. This leaves a full outer shell underneath. The atom now has more protons than electrons, so it is a positive ion. You met ions when you learned about atoms. | `mtab-lose` |
| Non-metals gain or share | Non-metal atoms gain or share electrons instead. | more outer electrons → gain or share | Most non-metal atoms have four or more electrons in their outer shell. It is easier for them to gain or share a few electrons than to lose many. Chlorine is 2,8,7, so it needs one more electron to fill its outer shell. Non-metals do not usually form positive ions. | `mtab-gain` |
| Put it together | Where an element sits tells you how it reacts. | left: lose → positive ions; right: gain or share | Atoms react to get a full outer shell. Metals, on the left, lose electrons and form positive ions. Non-metals, on the right, gain or share electrons. You will see how ions and shared electrons hold atoms together in later lessons. | `mtab-sides` |

### C8-12 · choice · `understanding, guided, practice`
**Q:** Where in the periodic table are most metals found?
- 0 At the top right · **1 On the left and towards the bottom ✓** · 2 Only in Group 0 · 3 Only in the top row
- Hint: Which side of the staircase line were the shaded boxes?
- Explanation: Metals are on the left of the table and towards the bottom. Non-metals are at the top right. So most metals are found on the left and towards the bottom.

### C8-13 · choice · `application, guided, practice`
**Q:** Magnesium is a metal in Group 2. What does a magnesium atom usually do when it reacts?
- 0 Gains 2 electrons to form a negative ion · 1 Shares its electrons and forms no ion · **2 Loses 2 electrons to form a positive ion ✓** · 3 Gains 6 electrons to form a positive ion
- Hint: Do metal atoms lose or gain their outer electrons?
- Explanation: Magnesium is in Group 2, so it has 2 outer electrons. Metal atoms lose their outer electrons. So magnesium loses 2 electrons and forms a positive ion, Mg²⁺.

### C8-14 · teach "How are metals and non-metals different?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Strong but bendable | Metals are strong but can be bent or hammered into shape. | hammer a metal → it changes shape, it does not break | Metals are strong, so they are hard to break. But you can bend them or hammer them into new shapes. A material that can be hammered into shape is called malleable. That is why metals can be pressed into cans and car bodies. | `mtab-prop-strong` |
| Good conductors | Metals let heat and electricity pass through easily. | metal → heat and electricity pass through | Heat and electricity pass through metals easily. A material that lets them through is called a conductor. So metals are good conductors of heat and electricity. That is why wires are made of copper and pans are made of metal. | `mtab-prop-conduct` |
| High melting points | Most metals have high melting and boiling points. | high melting point → solid at room temperature | Most metals only melt at high temperatures, and they boil at even higher ones. So most metals are solid at room temperature. Iron, for example, melts at about 1500 °C. | `mtab-prop-melt` |
| Dull and brittle | Solid non-metals are often dull and break easily. | hit a solid non-metal → it shatters | Non-metals do not share the properties of metals. Solid non-metals tend to look dull, not shiny. If you try to bend them, they break. A material that breaks instead of bending is called brittle. Sulfur is a dull yellow solid that is brittle. | `mtab-prop-brittle` |
| Other differences | Non-metals are not always solid and rarely conduct. | non-metals → often gases, poor conductors, low density | Non-metals are not always solid at room temperature. Oxygen is a gas and bromine is a liquid. Most non-metals do not conduct electricity. They also tend to have a lower density than metals. | `mtab-prop-other` |
| Put it together | Metals and non-metals have opposite properties. | metal: strong, malleable, conducts; non-metal: brittle, dull, does not conduct | Metals are strong and malleable. They conduct heat and electricity, and they have high melting and boiling points. Non-metals are dull and brittle when solid, and many are gases. They do not usually conduct electricity. You will find out why metals behave like this in a later lesson. | `mtab-prop-all` |

### C8-15 · choice · `understanding, guided, practice`
**Q:** Which property is typical of a metal?
- 0 It is brittle · **1 It conducts electricity well ✓** · 2 It has a low melting point · 3 It is a gas at room temperature
- Hint: Which property did the lit bulb stand for?
- Explanation: Brittle, low melting points and being a gas are properties of many non-metals. Metals are good conductors, so a typical metal conducts electricity well.

### C8-16 · choice · `understanding, guided, practice`
**Q:** A solid element is dull and shatters when it is hit with a hammer. What is it most likely to be?
- 0 A metal, because it is solid · 1 A metal, because it is hard · **2 A non-metal, because it is dull and brittle ✓**
- Hint: Do metals shatter or change shape when they are hammered?
- Explanation: Metals are malleable: hammering changes their shape. Many non-metals are solid too. This element is dull and brittle, so it is most likely a non-metal.

### C8-17 · choice · `application, independent, independent` · visual `mtab-q-positions`
**Q:** The numbers mark four elements in the periodic table. Which two will react in the most similar ways?
- 0 1 and 3 · 1 2 and 3 · **2 1 and 4 ✓** · 3 3 and 4
- Hint: Which two numbered boxes are in the same column?
- Explanation: Boxes 1 and 4 are in the same column, Group 1, so they have the same number of outer electrons. Boxes 1 and 3 are only in the same period. So elements 1 and 4 react in the most similar ways. They are sodium and potassium.

### C8-18 · choice · `dataInterpretation, independent, independent` · visual `mtab-q-samples`
**Q:** A student tested three solid elements. Which conclusion does the data support?
- **0 Sample B is most likely a non-metal ✓** · 1 Samples A and C are non-metals · 2 All metals melt above 1000 °C · 3 Sample A must be in Group 1
- Hint: Which sample is dull, does not conduct and shatters?
- Explanation: Sample B is dull, does not conduct and shatters, like a non-metal. Samples A and C conduct and flatten, like metals. So B is most likely a non-metal. Three samples cannot show which group A is in, or how every metal behaves.

### C8-19 · choice · `application, independent, independent`
**Q:** Bromine is in Group 7 and period 4. Which of these describes a bromine atom?
- 0 4 outer electrons, in 7 shells · 1 7 outer electrons, in 7 shells · 2 35 outer electrons, in 4 shells · **3 7 outer electrons, in 4 shells ✓**
- Hint: Which number tells you the outer electrons, and which tells you the shells?
- Explanation: Group 7 means 7 electrons in the outer shell. Period 4 means its electrons are in 4 shells. So bromine has 7 outer electrons in 4 shells.

### C8-20 · written · teacher-reviewed
**Q:** Magnesium is in Group 2 and period 3. Explain what this tells you about its atoms and how it reacts.
- Hint: Say what the group number and the period number tell you. Then use which side of the table it is on.
- Model answer: Group 2 means a magnesium atom has 2 electrons in its outer shell. Period 3 means its electrons are in 3 shells, so it is 2,8,2. Magnesium is on the left of the table, so it is a metal. When it reacts, it loses its 2 outer electrons to form a positive ion. It reacts in a similar way to other Group 2 elements, such as calcium.
- Rubric (4): Group 2: a magnesium atom has 2 electrons in its outer shell. / Period 3: its electrons are in 3 shells (2,8,2). / It is a metal (on the left of the table), so it loses its 2 outer electrons to form a positive ion. / It reacts in a similar way to the other elements in Group 2 (e.g. calcium or beryllium).
- Reject: Saying the group number is the number of shells, or the period number is the number of outer electrons. / Saying magnesium gains electrons or forms a negative ion. / Saying elements in the same period react in similar ways.

