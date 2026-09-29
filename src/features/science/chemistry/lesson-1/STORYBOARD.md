# Chemistry Lesson 1 storyboard — Atoms, elements and isotopes

Chapter C1a, Atoms, elements, compounds and mixtures. Folder `chemistry/lesson-1`, id `C-ATM-001-C`, skill `C-ATOMS-ELEMENTS`. The first Chemistry lesson: it assumes only everyday ideas, not any Biology lesson.

Big idea: everything is made of atoms. Each atom has a tiny, heavy, positive nucleus of protons and neutrons, with light, negative electrons around it. Two numbers describe an atom, the number of protons decides the element, and isotopes of one element differ only in neutrons, so an element's mass is an average.

Flow note: the lesson builds one real atom, lithium-7, and keeps coming back to it, so every new number can be checked against a picture the student has already built.
1. **What is inside an atom?** One lithium-7 drawing built up frame by frame: the atom, then the nucleus, protons, neutrons, electrons in shells, then its size. It comes first because every later idea counts these particles.
2. **How heavy, and what charge?** Puts numbers on the three particles just met (relative charge, then relative mass), then uses the same lithium atom to show why an atom is neutral. Charge comes before mass because "neutral" needs it.
3. **What do the numbers tell you?** Atomic number and mass number for the same lithium atom, the nuclear symbol ⁷₃Li, then counting all three particles from it (checked against the drawing). Ions come last and stay light: they need "atoms are neutral" and "atomic number = protons".
4. **What makes an element?** Uses "atomic number = protons" to define an element (same protons), then symbols, then isotopes as lithium-6 beside the familiar lithium-7. Isotopes need mass number, so they follow section 3.
5. **What is the average mass?** Only once isotopes exist does an average mass make sense: chlorine as a 3 : 1 mix of chlorine-35 and chlorine-37 (abundance), the average (Aᵣ), the rule, a worked example (chlorine, 35.5), then near-identical practice with new numbers (boron, 10.8).
6. **On your own** applies each idea to something new: a numbered beryllium-9 atom in assessment view, aluminium-27 particles, neon's relative atomic mass from a table (20.2), and a teacher-reviewed explanation of oxygen-16 and oxygen-18.

Sections:
1. Start here (C1-01): the smallest piece of gold that is still gold is one atom (everyday prior knowledge; it sets up "atom" and, later, "element").
2. What is inside an atom? (C1-02–04): atom → nucleus → protons (+) → neutrons (no charge) → electrons (−) in shells, almost no mass → radius about 0.1 nm (1 × 10⁻¹⁰ m), nucleus about 1 × 10⁻¹⁴ m (about 1/10 000), almost all the mass. Checks: what is in the nucleus; nucleus size compared with the atom.
3. How heavy, and what charge? (C1-05–07): relative charges +1, 0, −1 → relative masses 1, 1, very small → protons = electrons, so neutral → table. Checks: which particle is −1 and very light; why a 6-proton atom is neutral.
4. What do the numbers tell you? (C1-08–10): atomic number → mass number → nuclear symbol → neutrons = mass number − atomic number, electrons = protons → ions (Li⁺: 3 − 1 = 2; F⁻: 9 + 1 = 10). Checks: neutrons in fluorine-19; electrons in Mg²⁺.
5. What makes an element? (C1-11–13): element = atoms with the same number of protons, about 100 elements → one- or two-letter symbols (Na, Fe from old names) → isotopes (lithium-6, lithium-7) → same atomic number, different mass number. Checks: two magnesium atoms with 12 and 14 neutrons; an atom with 7 protons is not carbon.
6. What is the average mass? (C1-14–16): abundance (chlorine 75% / 25%) → relative atomic mass as an average → rule (multiply, add, divide) → worked example 35.5 → practice with boron 20% / 80% = 10.8.
7. On your own (C1-17–20): numbered atom (which part holds the mass); aluminium-27 particles; neon 90% / 10% = 20.2 from a data table; written explanation for oxygen-16 and oxygen-18.

Calculation route: worked example (C1-15, chlorine) → near-identical guided practice with new numbers (C1-16, boron) → independent calculation in On your own (C1-19, neon, dimension `calculation`). Real, rounded abundances: chlorine 75.8% / 24.2% (Aᵣ 35.45), boron 19.9% / 80.1% (10.81), neon-20 90.5%, neon-22 9.3%, neon-21 0.3% (20.18).

Wording rules: one new term per frame, plain meaning first then "is called X"; no references to Biology lessons; British spelling; the periodic table is mentioned in one clause as something to come.

Out of scope: the history of the atomic model (plum pudding, alpha scattering, Bohr, Chadwick) and electronic structure rules (2, 8, 8), which come in the periodic table chapter (the drawings show correct shells, but the arrangement is not taught); compounds, formulas and equations (next lessons); relative formula mass; standard-form arithmetic beyond reading the two radii; Higher-tier or Chemistry-only content; the book's cartoons, jokes, worked examples (copper) and exam questions (gallium, silicon).

Source boundary: supplied revision-guide pages 92–93 (scope only); AQA 8464 Chemistry 5.1.1.1, 5.1.1.4, 5.1.1.5 and 5.1.1.6. The lithium-7 build, the beryllium-9 question atom, the lithium-6/7 isotopes, the chlorine, boron and neon calculations, the gold, fluorine, magnesium, aluminium and oxygen examples, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: the nucleus radius is given as "about 1 × 10⁻¹⁴ m, about 1/10 000 of the atom" (the page's wording; AQA says "less than 1/10 000"). Electrons are said to have "almost no mass" and a relative mass of "very small", as the spec says (no 1/1840 or 0.0005). Ions are kept to one frame and one guided question (lithium, fluoride and magnesium ions), because AQA 5.1.1.5 asks students to count the particles in an ion. Relative atomic mass calculations use percentage abundances that total 100 and give answers to 1 decimal place. "Shells" is named alongside "electrons" in one frame because the two ideas are hard to separate.

## Diagram plan
- `components/AtomVisuals.tsx`, focus prefix `atom-`, routed by `CellBiologyVisuals.tsx`. Particle colours for all of Chemistry: proton coral red with "+", neutron grey, electron blue with "−" on thin circular shells (Bohr style); isotopes of one element in light and dark green. Every drawn atom is real (counts checked in `chemistry1.test.tsx`).
- **Build an atom** (`atom-build-*`): one lithium-7 atom (3 p, 4 n, electrons 2, 1) with a numbered key on the right (nucleus, protons, neutrons, electrons), built up and highlighted one step per frame, then a size frame with the radius, the nucleus note and "not to scale".
- **Particle table** (`atom-particle-*`): proton, neutron, electron rows; charge column then mass column highlighted; a neutral frame with the lithium atom and +3 − 3 = 0.
- **Nuclear symbol** (`atom-symbol-*`): ⁷₃Li with numbered pointers 1 mass number, 2 atomic number, 3 symbol; a counting frame beside the lithium drawing; an ion frame (Li → Li⁺, losing its outer electron) with the two ion rules.
- **Elements and isotopes** (`atom-element-*`, `atom-isotope-*`): three lithium atoms and a helium atom; eight symbol tiles (Na and Fe marked as old names); lithium-6 and lithium-7 side by side, then a same/different table.
- **Relative atomic mass** (`atom-ram-*`): 20 chlorine atoms (15 × 35, 5 × 37); a number line with abundance bars and Aᵣ = 35.5 against the halfway point 36; the rule as a fraction; the worked-example set-up (data table and sum, no answer); the neon data table for C1-19.
- **Question atom** (`atom-question`): beryllium-9 (4 p, 5 n, electrons 2, 2) with pointers 1 shell, 2 electron, 3 nucleus; the key appears only after answering.

## States in full

### C1-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** You keep cutting a piece of pure gold in half. What is the smallest piece that is still gold?
- 0 A speck of gold dust you can just see · **1 A single atom of gold ✓** · 2 There is no smallest piece
- Hint: Think about what everything is made of.
- Explanation: Everything is made of tiny particles called atoms. So the smallest piece that is still gold is one atom of gold. It is far too small to see.

### C1-02 · teach "What is inside an atom?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Tiny building blocks | Everything around you is made of atoms. | everything → made of atoms | Your desk, the air and your body are all made of tiny particles. They are far too small to see, even with a light microscope. These tiny particles are called atoms. The drawing shows one atom, made millions of times bigger than it really is. | `atom-build-atom` |
| The nucleus | Every atom has a tiny centre. | middle of the atom → nucleus | Right in the middle of every atom is a tiny centre. This centre is called the nucleus. It is made of even smaller particles packed closely together. | `atom-build-nucleus` |
| Protons | Some particles in the nucleus are positive. | proton → positive (+) | The nucleus holds two kinds of particle. One kind has a positive charge. These particles are called protons. They give the nucleus its positive charge. In the drawings, protons are red with a + sign. | `atom-build-proton` |
| Neutrons | The other particles in the nucleus have no charge. | neutron → no charge | The other particles in the nucleus have no charge at all. They are called neutrons. In the drawings, neutrons are grey. This lithium atom has 3 protons and 4 neutrons in its nucleus. | `atom-build-neutron` |
| Electrons | Tiny negative particles move around the nucleus. | electron → negative (−), in shells | Around the nucleus are much smaller particles with a negative charge. These are called electrons. They move around the nucleus in layers called shells. Electrons have almost no mass. In the drawings, electrons are blue with a − sign. | `atom-build-electron` |
| How big? | Atoms are tiny, and the nucleus is tinier still. | atom radius ≈ 0.1 nm; nucleus ≈ 1/10 000 of that | The radius of an atom is about 0.1 nanometres (nm), or 1 × 10⁻¹⁰ m. A nanometre is one billionth of a metre. The radius of the nucleus is about 1 × 10⁻¹⁴ m. That is about 1/10 000 of the radius of the atom. So an atom is mostly empty space, but almost all its mass is in the nucleus. | `atom-build-size` |

### C1-03 · choice · `understanding, guided, practice`
**Q:** Which particles are found in the nucleus of an atom?
- 0 Protons and electrons · 1 Electrons only · **2 Protons and neutrons ✓** · 3 Neutrons and electrons
- Hint: Which particles did you see packed in the middle?
- Explanation: The nucleus contains protons and neutrons. Electrons are not in the nucleus: they move around it in shells.

### C1-04 · choice · `understanding, guided, practice`
**Q:** How does the radius of the nucleus compare with the radius of the whole atom?
- 0 About half as big · 1 About the same size · **2 About 1/10 000 as big ✓**
- Hint: Is an atom mostly nucleus, or mostly empty space?
- Explanation: The radius of an atom is about 1 × 10⁻¹⁰ m and the radius of its nucleus is about 1 × 10⁻¹⁴ m. So the nucleus is only about 1/10 000 of the radius of the atom.

### C1-05 · teach "How heavy, and what charge?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Relative charge | Each particle has a charge of +1, 0 or −1. | proton +1, neutron 0, electron −1 | Scientists compare the charges of the three particles using simple numbers. A proton has a charge of +1. An electron has a charge of −1. A neutron has no charge, so its charge is 0. These numbers are called relative charges. | `atom-particle-charge` |
| Relative mass | Protons and neutrons have the same mass; electrons are very light. | proton 1, neutron 1, electron very small | Masses are compared in the same way. A proton and a neutron have the same mass, so each has a mass of 1. An electron’s mass is very small compared with them. These numbers are called relative masses. | `atom-particle-mass` |
| No overall charge | An atom has the same number of protons and electrons. | protons = electrons → charges cancel | In an atom, the number of electrons is the same as the number of protons. Each electron’s −1 cancels one proton’s +1. So the atom has no overall charge. An atom with no overall charge is called neutral. | `atom-particle-neutral` |
| Put it together | One table sums up the three particles. | mass 1, 1, very small; charge +1, 0, −1 | Protons and neutrons are heavy and sit in the nucleus. Electrons are very light and move around it. Protons are positive, electrons are negative and neutrons have no charge. An atom has equal numbers of protons and electrons, so it is neutral. | `atom-particle-all` |

### C1-06 · choice · `understanding, guided, practice`
**Q:** Which particle has a relative charge of −1 and a very small mass?
- 0 Proton · **1 Electron ✓** · 2 Neutron · 3 Nucleus
- Hint: Which particle is negative and very light?
- Explanation: A proton is +1 and a neutron is 0, and each has a relative mass of 1. An electron has a relative charge of −1 and a very small mass.

### C1-07 · choice · `understanding, guided, practice`
**Q:** An atom has 6 protons. Why does it have no overall charge?
- 0 Its neutrons cancel the charge of the protons · **1 It has 6 electrons, so the charges cancel ✓** · 2 Protons have no charge · 3 Its electrons have no charge
- Hint: Which particle has the opposite charge to a proton?
- Explanation: Neutrons have no charge, so they cannot cancel anything. The atom has 6 electrons. Six −1 charges cancel six +1 charges, so the atom is neutral.

### C1-08 · teach "What do the numbers tell you?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Atomic number | The atomic number is the number of protons. | atomic number = protons | Every lithium atom has 3 protons. The number of protons in an atom is called its atomic number. So the atomic number of lithium is 3. | `atom-symbol-atomic` |
| Mass number | The mass number counts protons and neutrons together. | mass number = protons + neutrons | Our lithium atom has 3 protons and 4 neutrons. Together that makes 7 heavy particles in its nucleus. The total number of protons and neutrons is called the mass number. So the mass number of this atom is 7. | `atom-symbol-mass` |
| The nuclear symbol | Both numbers are written beside the element’s letters. | top = mass number; bottom = atomic number | Li is the short way to write lithium. The mass number goes at the top left and the atomic number at the bottom left. Writing an atom like this is called its nuclear symbol. The top number is never smaller than the bottom one. | `atom-symbol-symbol` |
| Counting the particles | Two numbers tell you all three particles. | neutrons = mass number − atomic number | Protons = atomic number, so lithium has 3 protons. Neutrons = mass number − atomic number, so 7 − 3 = 4 neutrons. The atom is neutral, so electrons = protons = 3. This matches the drawing of the lithium atom. | `atom-symbol-count` |
| Ions | An atom can lose or gain electrons and become charged. | lose electrons → positive; gain → negative | Sometimes an atom loses or gains electrons. Then the protons and electrons no longer balance, so it has an overall charge. A charged particle like this is called an ion. A lithium ion, Li⁺, has lost 1 electron, so it has 3 − 1 = 2 electrons. A fluoride ion, F⁻, has gained 1, so it has 9 + 1 = 10. | `atom-symbol-ion` |

### C1-09 · choice · `application, guided, practice`
**Q:** A fluorine atom has atomic number 9 and mass number 19. How many neutrons does it have?
- 0 9 · 1 19 · 2 28 · **3 10 ✓**
- Hint: Which two numbers do you take away?
- Explanation: Neutrons = mass number − atomic number. 19 − 9 = 10 neutrons.

### C1-10 · choice · `application, guided, practice`
**Q:** A magnesium atom has atomic number 12. It loses 2 electrons to become Mg²⁺. How many electrons does the ion have?
- 0 14 · 1 12 · **2 10 ✓**
- Hint: How many electrons did the atom have before it lost any?
- Explanation: A magnesium atom has 12 protons, so it has 12 electrons. Mg²⁺ has lost 2 electrons, so it has 12 − 2 = 10 electrons.

### C1-11 · teach "What makes an element?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Elements | An element is made of atoms with the same number of protons. | number of protons → which element | The number of protons decides what type of atom it is. Every atom with 3 protons is lithium. Every atom with 2 protons is helium. A substance made of atoms that all have the same number of protons is called an element. There are about 100 different elements. | `atom-element-same` |
| Chemical symbols | Each element has a symbol of one or two letters. | one capital letter, then maybe one small letter | Each element can be written as a short code of one or two letters. This code is called its chemical symbol. The first letter is always a capital and a second letter is always small. Some come from old names, like Na for sodium and Fe for iron. You will find every symbol on the periodic table. | `atom-element-symbols` |
| Isotopes | Atoms of one element can have different numbers of neutrons. | same protons, different neutrons | Most lithium atoms have 4 neutrons, but a few have only 3. Both kinds have 3 protons, so both are lithium. Atoms of the same element with different numbers of neutrons are called isotopes. We name them by their mass numbers: lithium-7 and lithium-6. | `atom-isotope-pair` |
| Put it together | Isotopes have the same atomic number but different mass numbers. | same element, different mass | Lithium-6 and lithium-7 both have atomic number 3, and both have 3 electrons. Lithium-6 has 3 neutrons, so its mass number is 6. Lithium-7 has 4 neutrons, so its mass number is 7. They are the same element with slightly different masses. | `atom-isotope-all` |

### C1-12 · choice · `understanding, guided, practice`
**Q:** Atom X has 12 protons and 12 neutrons. Atom Y has 12 protons and 14 neutrons. What are X and Y?
- 0 Two different elements · **1 Isotopes of the same element ✓** · 2 Ions with different charges · 3 Atoms with different atomic numbers
- Hint: Compare the protons first, then the neutrons.
- Explanation: Both atoms have 12 protons, so both are the same element (magnesium). They have different numbers of neutrons, so they are isotopes.

### C1-13 · choice · `understanding, guided, practice`
**Q:** Every carbon atom has 6 protons. An atom has 7 protons. What can you say about it?
- **0 It is an atom of a different element ✓** · 1 It is an isotope of carbon · 2 It is a carbon ion
- Hint: What decides which element an atom is?
- Explanation: The number of protons decides which element an atom is. Carbon atoms always have 6 protons, so an atom with 7 protons is a different element (nitrogen).

### C1-14 · teach "What is the average mass?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A mix of isotopes | Most elements are a mix of isotopes. | how common each isotope is → abundance | Chlorine has two isotopes: chlorine-35 and chlorine-37. In any sample of chlorine, about 3 out of every 4 atoms are chlorine-35. So 75% of the atoms are chlorine-35 and 25% are chlorine-37. How common an isotope is, is called its abundance. | `atom-ram-mix` |
| An average mass | The relative atomic mass is an average for the element. | average that counts how common each isotope is | To describe chlorine with one number, we take an average of its mass numbers. The average takes account of how common each isotope is. This average is called the relative atomic mass, written Aᵣ. For chlorine, Aᵣ is 35.5: closer to 35, because chlorine-35 is more common. | `atom-ram-average` |
| The rule | Multiply, add, then divide. | multiply → add → divide by the total abundance | First, multiply each isotope’s mass number by its abundance. Next, add these answers together. Then divide by the total of all the abundances. When the abundances are percentages, that total is 100. | `atom-ram-rule` |

### C1-15 · worked example "Work out the relative atomic mass of chlorine" · visual `atom-ram-example`
**Q:** Chlorine is 75% chlorine-35 and 25% chlorine-37. What is its relative atomic mass?
1. Multiply each mass number by its abundance: 35 × 75 = 2625 and 37 × 25 = 925.
2. Add these together: 2625 + 925 = 3550.
3. Add the abundances: 75 + 25 = 100.
4. Divide: 3550 ÷ 100 = 35.5. So the relative atomic mass of chlorine is 35.5.

### C1-16 · choice · `calculation, guided, practice`
**Q:** Boron is 20% boron-10 and 80% boron-11. What is its relative atomic mass?
- 0 10.5 · **1 10.8 ✓** · 2 10.2 · 3 1080
- Hint: Multiply, add, then divide by the total abundance.
- Explanation: (10 × 20) + (11 × 80) = 200 + 880 = 1080, and 20 + 80 = 100. 1080 ÷ 100 = 10.8. It is closer to 11, because boron-11 is more common.

### C1-17 · choice · `understanding, independent, independent` · visual `atom-question`
**Q:** Look at the numbered parts of this atom. Which part holds almost all of its mass?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓**
- Hint: Which part holds the protons and neutrons?
- Explanation: Part 1 is an electron shell and part 2 is an electron, which has almost no mass. Part 3 is the nucleus. It holds the protons and neutrons, so it has almost all the mass.

### C1-18 · choice · `application, independent, independent`
**Q:** An aluminium atom has atomic number 13 and mass number 27. How many of each particle does it have?
- **0 13 protons, 14 neutrons, 13 electrons ✓** · 1 13 protons, 27 neutrons, 13 electrons · 2 14 protons, 13 neutrons, 14 electrons · 3 13 protons, 14 neutrons, 14 electrons
- Hint: Start with the protons, then use the mass number.
- Explanation: Protons = atomic number = 13, and an atom has the same number of electrons, 13. Neutrons = mass number − atomic number = 27 − 13 = 14.

### C1-19 · choice · `calculation, independent, independent` · visual `atom-ram-neon`
**Q:** Neon is 90% neon-20 and 10% neon-22. What is its relative atomic mass?
- 0 21.0 · 1 21.8 · **2 20.2 ✓** · 3 2020
- Hint: Use the rule: multiply, add, then divide.
- Explanation: (20 × 90) + (22 × 10) = 1800 + 220 = 2020, and 90 + 10 = 100. 2020 ÷ 100 = 20.2. It is close to 20, because most neon atoms are neon-20.

### C1-20 · written · teacher-reviewed
**Q:** Oxygen-16 and oxygen-18 are isotopes. Oxygen’s atomic number is 8. Explain how their atoms are alike and how they differ.
- Hint: Use the atomic number and each mass number. Count the protons, electrons and neutrons in each atom.
- Model answer: Both atoms have atomic number 8, so both have 8 protons. That is why both are oxygen. Atoms are neutral, so both also have 8 electrons. They have different numbers of neutrons: oxygen-16 has 16 − 8 = 8 neutrons and oxygen-18 has 18 − 8 = 10. So they have different mass numbers.
- Rubric (4): Both have 8 protons (atomic number 8), so both are oxygen. / Both have 8 electrons, because atoms are neutral. / Oxygen-16 has 16 − 8 = 8 neutrons. / Oxygen-18 has 18 − 8 = 10 neutrons, so the mass numbers are different.
- Reject: Saying the two isotopes have different numbers of protons. / Saying oxygen-18 has 18 neutrons. / Saying isotopes are different elements.
