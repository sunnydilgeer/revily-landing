# Chemistry Lesson 7 storyboard — Building the periodic table

Chapter C1b, The periodic table. Folder `chemistry/lesson-7`, id `C-PER-007-C`, skill `C-PERIODIC-HISTORY`. It builds on atomic number, relative atomic mass and isotopes from the atoms lesson.

Big idea: the periodic table was built step by step. Early chemists could only order elements by atomic weight, so their tables were incomplete and put some elements in the wrong group. Mendeleev (1869) kept similar elements together by switching some and leaving gaps, predicted the missing elements, and was proved right when they were found. Isotopes later explained why weight order was sometimes wrong.

Flow note: the lesson follows the table through time and keeps coming back to one small, real slice of it (the carbon, nitrogen, oxygen and fluorine columns, rows 2–5), so every change can be seen in the same picture.
1. **How were the first tables made?** Why weight (no protons known, so no atomic numbers) → a row in weight order → elements not yet found (neon) → rows and columns, "group" → the misfit (iodine lands with oxygen and sulfur). The problem has to exist before Mendeleev's fixes make sense.
2. **What did Mendeleev change?** His table (1869, about 60 elements, mainly by weight) → switching tellurium and iodine → gaps. Switching comes first because it answers the misfit just seen; gaps lead into predictions.
3. **Was Mendeleev right?** Predicting from the neighbours of the gap below silicon → germanium found (1886) → predictions against real values → gallium and scandium too. Evidence follows the claim.
4. **Why was weight order wrong?** Isotopes (recalled, not re-taught) share one place → atomic weight is an average of isotopes: tellurium mostly 128 and 130, iodine all 127 → tellurium has fewer protons (52 v 53), so Mendeleev's switch was right → timeline "put it together". It comes last because isotopes were discovered last and explain the earlier switch.
5. **On your own**: a new group (boron, aluminium, gap, indium) in assessment view; real gallium data read without over-claiming; a new switched pair (argon and potassium); a written explanation of Mendeleev's changes and the evidence.

Sections:
1. Start here (C7-01): without protons, chemists could not know atomic numbers (prior knowledge from the atoms lesson).
2. How were the first tables made? (C7-02–04): atomic weight → not complete (neon, argon found in the 1890s) → group → iodine in the wrong group. Checks: ordered by atomic weight; why iodine with oxygen and sulfur was a problem.
3. What did Mendeleev change? (C7-05–07): 1869 table mainly by atomic weight → switched tellurium and iodine → gap below silicon for an undiscovered element. Checks: why tellurium goes first; why gaps.
4. Was Mendeleev right? (C7-08–10): prediction for the gap (about 72, about 5.5 g/cm³, dark grey solid) → germanium 1886 → comparison (72.6, 5.3) → gallium 1875, scandium 1879. Checks: how he predicted; what a close density shows.
5. Why was weight order wrong? (C7-11–13): isotopes share one place → tellurium's heavy isotopes → 52 v 53 protons → timeline. Checks: why chlorine-35 and chlorine-37 share one place; why tellurium's weight is higher.
6. On your own (C7-14–17): numbered group with a gap; gallium predictions table; argon and potassium; written task.

Wording rules: one new term per frame (atomic weight, group, gap); plain meaning first; the atoms lesson is referred to by topic ("You met isotopes when you learned about atoms"); modern groups and periods are only named as far as needed ("a column … is called a group"), because the modern table is the next topic.

Out of scope: the modern periodic table in detail (periods, metals and non-metals, group numbers, electronic structure links) — next topic; Newlands, Döbereiner and other named early chemists; noble gases as a group; Mendeleev's other predictions in detail; the book's cartoons, jokes, figure and exam questions.

Source boundary: supplied revision-guide page 103 (scope only); AQA 8464 Chemistry 5.1.2.2 (with 5.1.1.5 isotopes, used only to explain the order). The table slice, the neon example, the tellurium/iodine, germanium, gallium, scandium and argon/potassium examples, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Atomic weights are today's values, rounded to 1 d.p. (early 1800s values were less accurate); "atomic weight" is linked once to "relative atomic mass".
- The 1869 table is drawn the modern way round (groups as columns); Mendeleev's own table had groups as rows. The slice is labelled "a small part".
- "About 60 elements" were known in 1869 (63). Mendeleev's detailed predictions for eka-silicon date from 1871; the lesson says only "he predicted". Predicted values used: eka-silicon about 72 and 5.5 g/cm³, dark grey; eka-aluminium about 68 and 5.9 g/cm³. Real: germanium 72.6, 5.3 g/cm³; gallium 69.7, 5.9 g/cm³.
- Tellurium's isotope sample (20 atoms) is rounded from natural abundances (Te-130 34%, Te-128 32%, Te-126 19% …; mean of the drawn mass numbers 127.65). A note says isotope masses differ very slightly from mass numbers (iodine-127 is 126.9).
- Argon and potassium (C7-16) is a switch in the modern table, not one Mendeleev made (argon was found in 1894); the question does not say Mendeleev placed it.
- The gallium group question uses the modern group (B, Al, Ga, In); Mendeleev's own placement of indium differed at first, so the stem says only "this group".

## Diagram plan
- `components/PeriodicVisuals.tsx`, focus prefix `ptable-`, routed by `CellBiologyVisuals.tsx`. Uses `atomPalette` from AtomVisuals; tiles are flat soft fills with a darker stroke. Family tints: oxygen's group amber, fluorine's group blue, carbon's group grey, nitrogen's plain. Coral red (the proton colour) marks the idea of the frame: misfit, switch, gap, filled gap. Isotopes use the Chemistry isotope greens.
- **Weight strip** (`ptable-weight-strip`, `-missing`): H to Mg with weights and a "heavier" arrow; then a dashed "?" tile between F and Na for neon.
- **Early table** (`ptable-weight-rows`, `-misfit`): N/O/F columns, rows 2–4 in weight order with the family notes; then row 5 in strict weight order (Sb, I, Te) with iodine and tellurium flagged.
- **Mendeleev's slice** (`ptable-mend-table`, `-switch`, `-gap`, `ptable-predict`, `ptable-found`, `ptable-found-all`): one 4 × 4 grid (C N O F / Si P S Cl / ? As Se Br / Sn Sb Te I), highlighting the switch (swap arrow), the gap, the prediction card with arrows from silicon and tin, germanium filling the gap, and the list of gaps filled.
- **Comparison table** (`ptable-compare`): predicted v germanium.
- **Isotopes** (`ptable-iso-same`, `-mix`, `-order`): chlorine-35 and chlorine-37 into one Cl box; 20 tellurium atoms v 20 iodine atoms; Te (52 protons) and I (53) with the two orders.
- **Timeline** (`ptable-timeline`): early 1800s → 1869 → 1875–1886 → early 1900s.
- **Question visuals**: `ptable-question` (boron's group with numbered boxes; the key naming gallium appears only after answering) and `ptable-gallium` (data table).

## States in full

### C7-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** In the early 1800s, nobody had discovered protons. Which of these could chemists not know about an element?
- 0 How heavy its atoms are compared with other atoms · **1 Its atomic number ✓** · 2 How it reacts with water
- Hint: What does the atomic number count?
- Explanation: The atomic number is the number of protons in an atom. So without knowing about protons, nobody could know atomic numbers. They could still weigh things and watch reactions.

### C7-02 · teach "How were the first tables made?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| No atomic numbers yet | Early chemists sorted elements by how heavy their atoms were. | no protons known → compare masses instead | In the early 1800s, nobody had discovered protons, neutrons or electrons. So nobody knew any atomic numbers. But chemists could compare how heavy the atoms of different elements were. This mass was called the atomic weight. Today we call it relative atomic mass. | `ptable-weight-strip` |
| Not every element yet | Many elements had not been discovered. | missing elements → table not complete | Chemists put the known elements in order of atomic weight. But many elements had not been found yet. For example, the gases neon and argon were not found until the 1890s. So the early tables were not complete. | `ptable-weight-missing` |
| Rows and columns | Similar elements were lined up in columns. | similar properties → same column → group | Chemists wrote the elements in rows, in order of atomic weight. They started a new row so that elements with similar properties lined up. For example, chlorine and bromine react in very similar ways. A column of elements with similar properties is called a group. | `ptable-weight-rows` |
| Some in the wrong group | Strict weight order put some elements with the wrong family. | weight order → iodine in the wrong group | Iodine reacts like chlorine and bromine. But iodine’s atomic weight is a little less than tellurium’s. So strict weight order put iodine in the column with oxygen and sulfur. Iodine does not behave like them, so it was in the wrong group. | `ptable-weight-misfit` |

### C7-03 · choice · `understanding, guided, practice`
**Q:** How did chemists in the early 1800s put the elements in order?
- 0 By atomic number · 1 By the date each was discovered · **2 By atomic weight ✓** · 3 In alphabetical order
- Hint: What could they measure without knowing about protons?
- Explanation: Protons had not been discovered, so atomic numbers were unknown. So chemists put the elements in order of atomic weight.

### C7-04 · choice · `understanding, guided, practice`
**Q:** Early tables ordered strictly by atomic weight put iodine with oxygen and sulfur. Why was this a problem?
- **0 Iodine reacts like chlorine and bromine, not like oxygen and sulfur ✓** · 1 Iodine had not been discovered yet · 2 Iodine has no atomic weight · 3 Oxygen and sulfur are in no group
- Hint: Which elements does iodine behave like?
- Explanation: A group should hold elements with similar properties. Iodine behaves like chlorine and bromine, so putting it with oxygen and sulfur put it in the wrong group.

### C7-05 · teach "What did Mendeleev change?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Mendeleev’s table | In 1869 Mendeleev arranged all the known elements in a table. | 1869 → Mendeleev → mainly by atomic weight | In 1869, a Russian chemist called Dmitri Mendeleev took all the elements known at the time. There were about 60 of them. He arranged them in a table, mainly in order of atomic weight. The drawing shows a small part of his idea, drawn the modern way round. | `ptable-mend-table` |
| Switching places | He swapped some elements so each stayed with its family. | similar properties matter more than weight order | Tellurium is slightly heavier than iodine. Weight order would put iodine first. Mendeleev switched them, so tellurium went before iodine. This kept iodine in the same group as chlorine and bromine, which it is like. | `ptable-mend-switch` |
| Leaving gaps | He left empty spaces where no known element fitted. | no element fits → leave a gap | Sometimes the next known element did not match the group it would fall into. So Mendeleev left an empty space in the table, called a gap. He said each gap was for an element that had not been discovered yet. One gap was below silicon. | `ptable-mend-gap` |

### C7-06 · choice · `understanding, guided, practice`
**Q:** Mendeleev put tellurium before iodine, even though tellurium is heavier. Why?
- 0 He made a mistake with the weights · **1 To keep iodine in the same group as elements it is like ✓** · 2 Tellurium was discovered first · 3 To leave a gap for a new element
- Hint: Which elements is iodine like?
- Explanation: Weight order would have put iodine in the group with oxygen and sulfur. Mendeleev switched them, so iodine stayed in the same group as chlorine and bromine.

### C7-07 · choice · `understanding, guided, practice`
**Q:** Why did Mendeleev leave gaps in his table?
- 0 To make every row the same length · 1 For isotopes of known elements · 2 Because some elements had no atomic weight · **3 For elements that had not been discovered yet ✓**
- Hint: What did he say belonged in each gap?
- Explanation: No known element fitted those spaces. So he left gaps for elements that had not been discovered yet.

### C7-08 · teach "Was Mendeleev right?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Predicting from a gap | The elements around a gap showed what the missing element would be like. | neighbours in the group → predict properties | Mendeleev used the elements around each gap to describe the missing element. The one below silicon should be like silicon above it and tin below it. He predicted an atomic weight of about 72. He predicted a dark grey solid with a density of about 5.5 g/cm³. | `ptable-predict` |
| Germanium is found | In 1886 a new element was found that fitted the gap. | new element → fits the gap | In 1886, a chemist in Germany discovered a new element. It was named germanium. Its properties were like those of silicon and tin. So it fitted exactly into the gap below silicon. | `ptable-found` |
| Checking the predictions | Germanium matched Mendeleev’s predictions closely. | predicted ≈ found → evidence he was right | Germanium’s atomic weight is 72.6, very close to the 72 Mendeleev predicted. Its density is 5.3 g/cm³, close to his 5.5. The predictions were made years before anyone had seen germanium. So they were good evidence that his table was right. | `ptable-compare` |
| Put it together | Several new elements filled Mendeleev’s gaps. | gaps → predictions → discoveries → table accepted | Germanium was not the only one. Gallium was found in 1875 and scandium in 1879, and both fitted gaps. Each time, the new element matched what Mendeleev had predicted. So more and more scientists accepted his table. | `ptable-found-all` |

### C7-09 · choice · `understanding, guided, practice`
**Q:** How did Mendeleev predict the properties of the missing element below silicon?
- 0 He measured a sample of it · 1 He chose values at random · 2 He copied the properties of oxygen · **3 He used the elements above and below it in its group ✓**
- Hint: Nobody had a sample. What could he look at instead?
- Explanation: Nobody had found the element, so there was nothing to measure. So he used silicon above it and tin below it, because elements in a group are similar.

### C7-10 · choice · `dataInterpretation, guided, practice`
**Q:** Mendeleev predicted a density of about 5.5 g/cm³. Germanium’s density is 5.3 g/cm³. What does this show?
- **0 The prediction was close, which supports his table ✓** · 1 The prediction was wrong, so his table was wrong · 2 Germanium does not fit the gap · 3 Germanium was found before 1869
- Hint: How far apart are 5.5 and 5.3?
- Explanation: 5.3 g/cm³ is very close to the 5.5 g/cm³ he predicted before germanium was found. So the result is evidence that his table and its gaps were right.

### C7-11 · teach "Why was weight order wrong?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Isotopes | Atoms of one element can have different masses. | same protons, different neutrons → different masses | Early in the 1900s, long after Mendeleev’s table, isotopes were discovered. You met isotopes when you learned about atoms: same number of protons, different numbers of neutrons. So isotopes of one element have different masses. They have the same properties, so they share the same place in the table. | `ptable-iso-same` |
| A mix of masses | An element’s atomic weight is an average of its isotopes. | mostly heavy isotopes → high average | An element’s atomic weight is an average of the masses of its isotopes. Most tellurium atoms are tellurium-128 or tellurium-130. Every natural iodine atom is iodine-127. So tellurium’s average mass, 127.6, is higher than iodine’s, 126.9. | `ptable-iso-mix` |
| Why the order flipped | Tellurium has fewer protons than iodine, even though it is heavier. | fewer protons but heavier isotopes → weight order wrong | A tellurium atom has 52 protons and an iodine atom has 53. So tellurium really does come before iodine. Its heavy isotopes make it look out of order by weight. Mendeleev was right to switch them, even before anyone knew why. | `ptable-iso-order` |
| Put it together | Each new discovery built on the one before. | weight order → Mendeleev → germanium → isotopes | Early tables used atomic weight and were not complete. Mendeleev switched some elements and left gaps. New elements such as germanium then filled the gaps. Later, isotopes explained why weight order was sometimes wrong. | `ptable-timeline` |

### C7-12 · choice · `understanding, guided, practice`
**Q:** Chlorine-35 and chlorine-37 have different masses. Why do they share one place in the periodic table?
- 0 They have the same mass number · **1 They are the same element, with the same properties ✓** · 2 They were discovered at the same time · 3 They have the same number of neutrons
- Hint: How many protons does each have?
- Explanation: Both have the same number of protons, so both are chlorine. They only differ in neutrons, so they have the same properties and the same place.

### C7-13 · choice · `understanding, guided, practice`
**Q:** Tellurium has fewer protons than iodine. Why is its atomic weight higher?
- 0 Tellurium has more electrons · 1 Iodine atoms have no neutrons · **2 Most tellurium atoms are heavy isotopes ✓** · 3 Its atomic weight was measured wrongly
- Hint: Which isotopes are most tellurium atoms?
- Explanation: Most tellurium atoms are tellurium-128 or tellurium-130, but every natural iodine atom is iodine-127. So tellurium’s average mass is higher, even though it has fewer protons.

### C7-14 · choice · `understanding, independent, independent` · visual `ptable-question`
**Q:** This group has a gap at box 3. What did Mendeleev expect the missing element to be like?
- **0 Like the elements in boxes 2 and 4, in the same group ✓** · 1 Like no other known element · 2 Like the elements in the next group along · 3 Lighter than every other element in the group
- Hint: What do elements in the same group share?
- Explanation: Elements in one group have similar properties. So the missing element should be like aluminium and indium around it. It was gallium, found in 1875.

### C7-15 · choice · `dataInterpretation, independent, independent` · visual `ptable-gallium`
**Q:** The table compares Mendeleev’s predictions with gallium, found in 1875. Which conclusion does the data support?
- 0 Every prediction Mendeleev made was exactly right · 1 Gallium does not fit the gap he left · **2 The predictions were close, which supports his table ✓** · 3 Gallium’s atomic weight is exactly 68
- Hint: Are the values close, or exactly the same?
- Explanation: The predicted atomic weight (about 68) is close to 69.7, and the predicted density (5.9) matches 5.9 g/cm³. So the data supports his table, but it does not show that every prediction was exactly right.

### C7-16 · choice · `application, independent, independent`
**Q:** Argon’s atomic weight is 39.9 and potassium’s is 39.1. Potassium reacts like sodium. Why is argon placed before potassium?
- 0 Argon was discovered first · 1 Potassium is heavier than argon · 2 To leave a gap for a new element · **3 So potassium stays in the same group as sodium ✓**
- Hint: Which group should potassium be in?
- Explanation: Potassium is lighter, so strict weight order would put it before argon, in the wrong group. So the order is switched, like tellurium and iodine, to keep potassium with sodium.

### C7-17 · written · teacher-reviewed
**Q:** Explain how Mendeleev’s table was different from earlier tables, and why later discoveries showed he was right.
- Hint: Say what he did to the order, what he left, and what was found later. Use tellurium, iodine or germanium as an example.
- Model answer: Earlier tables put elements strictly in order of atomic weight, so some ended up in the wrong group. Mendeleev mainly used atomic weight, but he switched some elements, such as tellurium and iodine, so elements with similar properties stayed in the same group. He also left gaps for undiscovered elements and predicted their properties. Later, germanium was found. It fitted the gap below silicon and matched his predictions. Much later, isotopes explained why weight order was sometimes wrong.
- Rubric (4): He switched the order of some elements (e.g. tellurium and iodine) so elements with similar properties stayed in the same group. / He left gaps for elements that had not been discovered yet. / He used the gaps to predict the properties of the missing elements. / Elements found later (e.g. germanium, gallium) fitted the gaps and matched his predictions, showing he was right.
- Reject: Saying Mendeleev ordered the elements by atomic number. / Saying the gaps were mistakes or spaces to make rows equal. / Saying the switched elements had the wrong atomic weights.
