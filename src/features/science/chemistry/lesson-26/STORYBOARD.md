# Chemistry Lesson 26 storyboard — Electrolysis

Chapter C4, Chemical changes. Folder `chemistry/lesson-26`, id `C-CHG-026-C`, skill `C-ELECTROLYSIS`. It builds on ions and ionic bonding (ions in a lattice, charges) and on the reactivity lesson, which only names electrolysis as a way to extract reactive metals.

Big idea: electricity can split an ionic compound that is molten or dissolved, because its ions are then free to move. Positive ions go to the cathode and gain electrons; negative ions go to the anode and lose electrons. In a molten compound the metal forms at the cathode and the non-metal at the anode. Aluminium is extracted by electrolysing aluminium oxide dissolved in molten cryolite.

Flow note: the vocabulary comes first (electrolyte, electrode, cathode and anode, movement of ions, discharge), built on one cell drawing that gains a layer each frame. The molten case comes next and reuses the same cell with real ions (lead bromide), then generalises to a metal/non-metal rule. Aluminium comes last because it needs the rule plus two extra facts (cryolite, graphite anode).

Sections:
1. Start here (C26-01): why molten sodium chloride conducts.
2. What is electrolysis? (C26-02–04)
3. What happens to a molten compound? (C26-05–07)
4. How is aluminium extracted? (C26-08–10)
5. On your own (C26-11–15): zinc chloride products, a numbered cell diagram in assessment view, a results table, inert electrodes, written explanation for molten sodium chloride.

Out of scope: electrolysis of aqueous solutions and the electrolysis practical (next lesson); half equations and electron-transfer definitions of oxidation and reduction (Higher); the book's cartoon, jokes, and exam question on molten calcium chloride (different compounds are used).

Source boundary: supplied revision-guide page 130 (scope only). AQA 8464 Chemistry 5.4.3.1, 5.4.3.2, 5.4.3.3. Everything (examples, diagrams, wording) is original except the standard spec examples (lead bromide, aluminium oxide and cryolite). Draft pending teacher review.

Judgement calls for the teacher:
- Melting points are not given as numbers; the bar chart is "not to scale" and only shows that cryolite lowers it.
- Bromine is drawn as Br₂ pairs; the ion is shown as Br⁻ (Foundation does not need Br₂ equations).
- The graphite anode is described as reacting with oxygen; the "inert electrodes" frame is taught on lead bromide, before the aluminium cell where graphite is not inert.
- "Aluminium sinks as a liquid" is included because the page states it.
- Electrons are mentioned only as "gain" and "lose" at the electrodes; no half equations.

## Diagram plan
`components/ElectrolysisVisuals.tsx`, prefix `elec-`. One cell drawing (cathode left, anode right, cell symbol with + and −), positive ions coral, negative ions blue, uncharged atoms grey. Frames: `elec-electrolyte`, `-electrode`, `-poles`, `-move`, `-discharge`; `elec-molten-why`, `-pbbr2`, `-rule`, `-inert`; `elec-al-why`, `-cell`, `-graphite`, `-equation`. Question visuals: `elec-question-cell` (numbered 1 to 4, words hidden) and `elec-question-data` (results table).

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
