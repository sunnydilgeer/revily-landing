# Chemistry Lesson 6 storyboard — Electronic structure

Chapter C1b, The periodic table. Folder `chemistry/lesson-6`, id `C-PER-006-C`, skill `C-ELECTRONIC-STRUCTURE`. Builds on atoms, atomic number and electrons in shells from the atoms lesson (named in one clause).

Big idea: electrons sit in shells (energy levels) that fill from the inside out, 2 then up to 8 then up to 8 for the first 20 elements. The arrangement can be drawn or written as numbers, it can be worked out from the atomic number, and a full outer shell makes an atom stable.

Flow note: the lesson fills one real atom, silicon (2,8,4), and keeps coming back to it, so the rules are seen before they are used as a method.
1. **Where do the electrons go?** One silicon atom filled shell by shell: empty shells (energy levels) → first shell, 2 → second shell, 8 → third shell, 4 of up to 8 (outer shell) → put together (2 + 8 + 4 = 14; only potassium and calcium use a fourth shell). The rules come first because everything else uses them.
2. **How do you write it down?** The same silicon atom as an exam-style diagram (circles and crosses), then as numbers 2,8,4, then five more atoms with their numbers. Writing needs the filled atom from section 1.
3. **Why does the outer shell matter?** Full outer shells (helium, neon, argon) are stable; most atoms (lithium, oxygen) have room left and react to end up with a full outer shell. Kept light, as the page does; it needs the number form to read the outer shell, so it follows section 2. It hands on to the groups of the periodic table.
4. **Work it out from the atomic number** turns the rules into a three-step method (count, fill in order, check) with nitrogen (2,5), then a worked example (aluminium, 2,8,3) and near-identical practice with new numbers (sulfur, 2,8,6).
5. **On your own** applies each idea to something new: counting the electrons on a numbered phosphorus atom in assessment view (2,8,5), chlorine from its atomic number (2,8,7), what 2,8,8 tells you, and a teacher-reviewed calcium task (2,8,8,2, outer shell not full).

Sections:
1. Start here (C6-01): a sodium atom (atomic number 11) has 11 electrons (prior knowledge from the atoms lesson; every later step starts here).
2. Where do the electrons go? (C6-02–04): shells = energy levels → inner shell first, holds 2 → second shell up to 8 → third shell up to 8, outer shell → silicon 2 + 8 + 4 = 14. Checks: first shell holds 2; the shell closest to the nucleus fills first.
3. How do you write it down? (C6-05–07): electronic structure as a diagram (dots or crosses on circles) → as numbers (2,8,4, inner shell first) → hydrogen 1, beryllium 2,2, oxygen 2,6, neon 2,8, sodium 2,8,1. Checks: what the 3 in 2,8,3 means; fluorine written 2,7.
4. Why does the outer shell matter? (C6-08–09): full outer shell → stable (helium, neon, argon) → not full (lithium, oxygen) → react to get a full outer shell → neon vs sodium. Check: why neon hardly reacts.
5. Work it out from the atomic number (C6-10–12): count (atomic number = electrons) → fill in order (2, up to 8, up to 8, then a fourth shell) → check (adds up, no shell over its limit) with nitrogen 2,5 → worked example aluminium 2,8,3 → practice sulfur 2,8,6.
6. On your own (C6-13–16): numbered phosphorus atom (count each shell: 2,8,5); chlorine 2,8,7; 2,8,8 has a full outer shell, so stable; written: calcium 2,8,8,2 with each step, outer shell not full.

Method route (like a calculation): worked example (C6-11, aluminium) → near-identical guided practice with a new atomic number (C6-12, sulfur) → independent item in On your own (C6-14, chlorine) plus the numbered diagram (C6-13) and the calcium written task (C6-16). Dimension `application`, as for counting particles in the atoms lesson.

Wording rules: one new term per frame (energy levels, first shell, outer shell, electronic structure, stable), plain meaning first then "is called X"; the atoms lesson is referred to in one clause; British spelling (aluminium, sulfur).

Out of scope: electronic structures beyond calcium (20) and the 2,8,18 pattern; why the third shell stops at 8 (sub-shells); how atoms gain, lose or share electrons in reactions (ionic and covalent bonding come later); the link between electronic structure and group number and the development of the periodic table (the next lessons and the facing page); dot-and-cross diagrams of compounds; the book's snail cartoon, jokes, magnesium worked example, sodium diagram and argon exam question.

Source boundary: supplied revision-guide page 102 (scope only); AQA 8464 Chemistry 5.1.1.7 (with 5.1.1.5 for atomic number = number of electrons). The silicon build, the nitrogen method, the aluminium worked example, the sulfur, chlorine, phosphorus, fluorine and calcium items, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: "stable" is taught as "hardly ever reacts"; atoms with a shell that is not full are said to "react to end up with a full outer shell" (the page says "react to fill it", which does not fit metals that lose electrons, so the wording is kept neutral). The fourth shell is mentioned for potassium and calcium only (one sentence, the capacity strip note and the written task), because AQA asks for the first 20 elements. Shells are said to be "a set distance from the nucleus with its own amount of energy" to explain "energy levels" without sub-shells. Electrons on a shell are spread evenly as in the atoms lesson (not drawn in pairs); in the "not full" frame the outer shell is drawn on eight places so the room left can be seen. Section 3 has one guided question because it is kept light.

## Diagram plan
- `components/ElectronVisuals.tsx`, focus prefix `shell-`, routed by `CellBiologyVisuals.tsx`. Imports `atomPalette`, `Electron` and `Nucleus` from `AtomVisuals.tsx` so atoms look the same as in the atoms lesson (electrons blue with "−", protons coral, neutrons grey, thin shells, pale blue atom space). Every drawn atom is real: the nucleus holds the protons and neutrons of the commonest isotope and the electrons are placed by `structure()` (2, 8, 8, 2).
- **Fill one atom** (`shell-fill-*`): silicon-28 (14 p, 14 n) with three shells, empty ones dashed; a capacity strip on the right (1st shell holds 2, 2nd and 3rd up to 8) fills slot by slot with a placed / still-to-place counter; the active shell and its row are highlighted each frame; the last frame adds 2 + 8 + 4 = 14 and the note about elements 19 and 20.
- **Write it down** (`shell-write-*`): the course silicon beside an exam-style one (circles, crosses, Si); the exam-style silicon with numbered shells beside 2,8,4 with matching numbers; a row of five atoms (H, Be, O, Ne, Na) with their numbers and atomic numbers.
- **Outer shell** (`shell-stable-*`): helium, neon and argon with the full outer shell highlighted; lithium and oxygen with dashed empty places showing the room left; neon (stable) beside sodium (reacts).
- **Method** (`shell-rule-*`, `shell-worked`): three panels (1 count: element tile; 2 fill in order: slots; 3 check: the drawn atom), highlighted step by step for nitrogen; the worked-example visual is the aluminium set-up only (tile and empty slots).
- **Question atom** (`shell-question`): phosphorus-31 (2,8,5) with pointers 1, 2, 3 on the three shells; in assessment view there is no element name and no key.

## States in full

### C6-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A sodium atom has atomic number 11. How many electrons does it have?
- **0 11 ✓** · 1 23 · 2 12 · 3 1
- Hint: How are the numbers of protons and electrons in an atom linked?
- Explanation: The atomic number is the number of protons, so sodium has 11 protons. An atom has the same number of electrons as protons, so a sodium atom has 11 electrons.

### C6-02 · teach "Where do the electrons go?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Shells | Electrons move around the nucleus in shells. | shells → also called energy levels | You met electrons moving in shells when you learned what is inside an atom. Each shell is a set distance from the nucleus and has its own amount of energy. So shells are also called energy levels. This silicon atom has 14 electrons to place in its shells. | `shell-fill-shells` |
| Inner shell first | The shell closest to the nucleus always fills first. | first shell → holds only 2 | Electrons always go into the shell closest to the nucleus first. This inner shell is called the first shell. It can hold only 2 electrons. So silicon’s first 2 electrons fill the first shell, and 12 are still to place. | `shell-fill-first` |
| Second shell | When the first shell is full, the second shell fills. | first full → second shell, up to 8 | Once the first shell is full, electrons go into the second shell. The second shell can hold up to 8 electrons. Silicon has 12 left, so 8 of them fill the second shell. That leaves 4 still to place. | `shell-fill-second` |
| Third shell | The third shell holds up to 8 for the first 20 elements. | second full → third shell, up to 8 | Next comes the third shell. For the first 20 elements, it holds up to 8 electrons. Silicon’s last 4 electrons go here, so its third shell is only partly filled. The shell furthest out that has electrons in it is called the outer shell. | `shell-fill-third` |
| Put it together | Shells fill from the inside out: 2, then 8, then 8. | 2 → 8 → 8, inside out | Silicon has 2 electrons in the first shell, 8 in the second and 4 in the third. 2 + 8 + 4 = 14, the same as its number of protons. Of the first 20 elements, only potassium and calcium have electrons in a fourth shell. | `shell-fill-all` |

### C6-03 · choice · `understanding, guided, practice`
**Q:** How many electrons can the first shell of an atom hold?
- 0 8 · **1 2 ✓** · 2 18 · 3 As many as the atom has
- Hint: How many electrons filled silicon’s first shell?
- Explanation: The first shell is the one closest to the nucleus. It can hold only 2 electrons, so the next electrons go into the second shell.

### C6-04 · choice · `understanding, guided, practice`
**Q:** Which electron shell in an atom is always filled first?
- 0 The outer shell · 1 All the shells fill at the same time · **2 The shell closest to the nucleus ✓**
- Hint: Where did silicon’s first 2 electrons go?
- Explanation: Electrons fill the inner shells first. So the shell closest to the nucleus, the first shell, always fills first.

### C6-05 · teach "How do you write it down?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Drawing the shells | Draw shells as circles and electrons as dots or crosses. | circle = shell; dot or cross = electron | How the electrons in an atom are arranged in shells is called its electronic structure. You can show it as a diagram. Draw each shell as a circle around the nucleus. Then draw each electron as a dot or a cross on its shell. | `shell-write-diagram` |
| Writing numbers | Numbers can show the same electronic structure. | inner shell first, commas between shells | You can also write the electronic structure as numbers. Write how many electrons are in each shell, starting with the inner shell. Put a comma between the shells. So silicon is 2,8,4: 2 in the first shell, 8 in the second and 4 in the third. | `shell-write-numbers` |
| More examples | Each element has its own electronic structure. | the numbers add up to the atomic number | Here are five more atoms. Hydrogen has 1 electron, so it is 1. Beryllium is 2,2 and oxygen is 2,6. Neon’s 10 electrons exactly fill two shells: 2,8. Sodium has 11, so it is 2,8,1. In each one, the numbers add up to the atomic number. | `shell-write-examples` |

### C6-06 · choice · `understanding, guided, practice`
**Q:** An atom’s electronic structure is written 2,8,3. What does the 3 tell you?
- **0 There are 3 electrons in its third shell ✓** · 1 The atom has 3 protons · 2 The atom has 3 electrons in total · 3 Its first shell holds 3 electrons
- Hint: Which shell does each number stand for?
- Explanation: Each number is the electrons in one shell, starting with the inner shell. The third number is 3, so there are 3 electrons in the third shell. The atom has 2 + 8 + 3 = 13 electrons.

### C6-07 · choice · `understanding, guided, practice`
**Q:** A fluorine atom has 2 electrons in its first shell and 7 in its second. How is its electronic structure written?
- 0 7,2 · **1 2,7 ✓** · 2 2,8 · 3 9
- Hint: Which shell do you write first?
- Explanation: Write the number of electrons in each shell, starting with the inner shell. So fluorine is 2,7.

### C6-08 · teach "Why does the outer shell matter?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Full outer shells | Atoms with a full outer shell are stable. | full outer shell → stable | Helium (2), neon (2,8) and argon (2,8,8) all have a full outer shell. Atoms like these hardly ever react with anything. Something that does not easily change is called stable. Atoms are much more stable when their outer shell is full. | `shell-stable-full` |
| Not full | In most atoms, the outer shell is not full. | outer shell not full → reacts | In most atoms, the outer shell is not full. Lithium (2,1) has 1 electron in its outer shell, with room for 7 more. Oxygen (2,6) has room for 2 more. Atoms like these react with other atoms to end up with a full outer shell. | `shell-stable-notfull` |
| Put it together | Full outer shell: stable. Not full: reacts. | full → stable; not full → reacts | Look at the outer shell to see how an atom behaves. Neon is 2,8: its outer shell is full, so it is stable. Sodium is 2,8,1: its outer shell holds only 1 electron, so it reacts. You will use this idea when you learn about the groups of the periodic table. | `shell-stable-all` |

### C6-09 · choice · `understanding, guided, practice`
**Q:** Neon’s electronic structure is 2,8. Why do neon atoms hardly ever react?
- 0 They have no electrons · 1 They have more protons than electrons · 2 Their outer shell is not full · **3 Their outer shell is full ✓**
- Hint: How many electrons can the second shell hold?
- Explanation: The second shell holds up to 8 electrons, and neon has 8 there. So neon’s outer shell is full, which makes neon atoms stable.

### C6-10 · teach "Work it out from the atomic number"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Count the electrons | The atomic number tells you how many electrons there are. | atomic number = protons = electrons | Start with the atomic number from the periodic table. It is the number of protons in the atom. An atom has the same number of electrons as protons. Nitrogen’s atomic number is 7, so a nitrogen atom has 7 electrons. | `shell-rule-count` |
| Fill in order | Fill each shell in order until no electrons are left. | 2 first, then up to 8, then up to 8 | Put 2 electrons in the first shell. Put up to 8 in the second shell, then up to 8 in the third. Any electrons left after that start a fourth shell. For nitrogen, 2 go in the first shell, leaving 5 for the second. So nitrogen is 2,5. | `shell-rule-fill` |
| Check it | The numbers must add up to the atomic number. | add up; no shell over its limit | Check two things. First, the numbers must add up to the atomic number: 2 + 5 = 7. Second, no shell can hold more than its limit of 2, 8 or 8. Nitrogen’s 2,5 passes both checks, and its drawing matches. | `shell-rule-check` |

### C6-11 · worked example "Work out the electronic structure of aluminium" · visual `shell-worked`
**Q:** Aluminium has atomic number 13. What is the electronic structure of an aluminium atom?
1. Atomic number 13 means 13 protons, so an aluminium atom has 13 electrons.
2. The first shell takes 2 electrons. That leaves 13 − 2 = 11.
3. The second shell takes 8 electrons. That leaves 11 − 8 = 3.
4. The last 3 go in the third shell. Check: 2 + 8 + 3 = 13. So aluminium is 2,8,3.

### C6-12 · choice · `application, guided, practice`
**Q:** Sulfur has atomic number 16. What is the electronic structure of a sulfur atom?
- 0 2,6,8 · **1 2,8,6 ✓** · 2 8,8 · 3 2,14
- Hint: Fill 2, then up to 8, then put the rest in the third shell.
- Explanation: 16 electrons: 2 in the first shell and 8 in the second, leaving 16 − 10 = 6. The last 6 go in the third shell, so sulfur is 2,8,6. Check: 2 + 8 + 6 = 16.

### C6-13 · choice · `application, independent, independent` · visual `shell-question`
**Q:** Count the electrons on each numbered shell of this atom. What is its electronic structure?
- 0 5,8,2 · 1 2,8,8 · **2 2,8,5 ✓** · 3 2,5,8
- Hint: Start counting at shell 1, next to the nucleus.
- Explanation: Shell 1 has 2 electrons, shell 2 has 8 and shell 3 has 5. Written from the inner shell outwards, that is 2,8,5. It has 15 electrons, so it is a phosphorus atom.

### C6-14 · choice · `application, independent, independent`
**Q:** Chlorine has atomic number 17. What is the electronic structure of a chlorine atom?
- 0 2,7,8 · 1 8,8,1 · 2 2,8,8 · **3 2,8,7 ✓**
- Hint: How many electrons are left after the first two shells?
- Explanation: 17 electrons: 2 in the first shell and 8 in the second, leaving 17 − 10 = 7. The last 7 go in the third shell, so chlorine is 2,8,7. Check: 2 + 8 + 7 = 17.

### C6-15 · choice · `understanding, independent, independent`
**Q:** An atom has the electronic structure 2,8,8. What can you say about it?
- **0 Its outer shell is full, so it is stable ✓** · 1 Its outer shell is not full, so it reacts easily · 2 It has 8 electrons altogether · 3 Its second shell is not full yet
- Hint: How many electrons can the third shell hold, for the first 20 elements?
- Explanation: For the first 20 elements, the third shell holds up to 8 electrons. This atom has 8 there. So its outer shell is full and the atom is stable. It has 2 + 8 + 8 = 18 electrons (argon).

### C6-16 · written · teacher-reviewed
**Q:** Calcium has atomic number 20. Work out its electronic structure, explaining each step. Is its outer shell full?
- Hint: Start from the atomic number. Fill 2, then up to 8, then up to 8, and start a new shell for any left over.
- Model answer: Calcium’s atomic number is 20, so it has 20 protons and 20 electrons. The first shell holds 2, leaving 18. The second shell holds 8, leaving 10. The third shell holds 8, leaving 2, so the last 2 go into a fourth shell. So calcium is 2,8,8,2. Its outer shell has only 2 electrons, so it is not full.
- Rubric (4): Atomic number 20, so a calcium atom has 20 electrons. / The first shell holds 2, the second 8 and the third 8: 18 so far. / The last 2 go into a fourth shell, so calcium is 2,8,8,2. / The outer shell has only 2 electrons, so it is not full.
- Reject: Putting more than 8 electrons in the third shell, such as 2,8,10. / Numbers that do not add up to 20, such as 2,8,8. / Saying calcium has a full outer shell.
