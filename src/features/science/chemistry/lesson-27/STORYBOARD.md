# Chemistry Lesson 27 storyboard — Electrolysis of aqueous solutions

Chapter C4, Chemical changes. Folder `chemistry/lesson-27`, id `C-CHG-027-C`, skill `C-ELECTROLYSIS-AQ`. It builds on the electrolysis lesson (electrolyte, cathode and anode, positive ions to the cathode, negative ions to the anode) and on the reactivity series. Those basics are recalled, not re-taught.

Big idea: a salt solution contains ions from the water (H⁺ and OH⁻) as well as ions from the salt, so you must decide which ion is discharged at each electrode. Cathode: hydrogen if the metal is more reactive than hydrogen, otherwise the metal. Anode: the halogen if halide ions are present, otherwise oxygen (and water). The method is a required practical.

Flow note: the four kinds of ion come first, because both rules are contests between a salt ion and a water ion. The cathode rule and the anode rule are taught separately, each with one diagram that lights up one outcome at a time. The two worked examples (CuSO₄ then NaCl) reuse one cell drawing and go ion list, cathode, anode, so students practise the same three moves twice. The lab method comes after the rules so the results can be explained.
1. **Ions in a solution**: water splits a little → four kinds of ion → positive to the cathode, negative to the anode.
2. **What forms at the cathode?**: compare the metal with hydrogen → more reactive gives H₂ → less reactive gives a metal layer.
3. **What forms at the anode?**: halide ions present? → halogen → none, so OH⁻ reacts and oxygen and water form.
4. **Two worked examples**: copper sulfate and sodium chloride, each in three frames.
5. **The lab method**: set up with a tube over each electrode → find the anode → run and record → whole method.
6. **On your own**: magnesium bromide prediction, a numbered rig question in assessment view, a product table, a written method and prediction.

Sections:
1. Start here (C27-01)
2. Ions in a solution (C27-02–04)
3. What forms at the cathode? (C27-05–07)
4. What forms at the anode? (C27-08–10)
5. Two worked examples (C27-11–13)
6. The lab method (C27-14–16)
7. On your own (C27-17–20)

Out of scope: half equations and electrons gained or lost (Higher); the gas tests for hydrogen, oxygen and chlorine (only mentioned as coming later); reversible reactions beyond the ⇌ symbol; the book's cartoons, jokes and its copper bromide exam question (reworded: different salts are used, and the book's two examples are kept because the spec names them).

Source boundary: supplied revision-guide page 131 (scope only). AQA 8464 Chemistry 5.4.3.4 (required practical: electrolysis of aqueous solutions with inert electrodes). Wording, examples, diagrams and questions are original; CuSO₄ and NaCl are the standard textbook examples. Draft pending teacher review. The lesson prepares students for the practical; it does not replace doing it.

Judgement calls for the teacher:
- Only the rules the page gives are taught (no concentration effects, no sulfate or nitrate discharge). "Oxygen and water form" at the anode is stated as the page does, without the electron detail.
- Hydrogen is placed between iron and copper in the series strip; the strip omits lithium, lead and carbon to stay simple.
- In the lab-rig diagram the electrodes rise from the beaker floor and the wires leave underneath so the test tubes sit clear above; the page's rig hangs them from above. The rig is schematic and not to scale; the gas gaps in the tubes are equal on purpose and do not show gas volumes.
- Inert (graphite) electrodes are assumed throughout and named in the method.
- The independent rig question flips the electrodes so the anode is on the left, to test the terminal rule and not the position.

## Diagram plan
`components/AqueousVisuals.tsx`, focus prefix `aqel-`. Positive ions coral, negative ions blue (Chemistry colours); inert electrodes dark grey rods; amber outline marks the frame's subject.
- Ions: `aqel-water`, `aqel-ions`, `aqel-move` (cell with arrows).
- Cathode rule (`aqel-cath-strip`, `-more`, `-less`): reactivity strip K to Au with H highlighted, outcome cards.
- Anode rule (`aqel-an-q`, `-yes`, `-no`): a halide yes/no decision.
- Worked cell (`aqel-cu-*`, `aqel-na-*`): cathode left, anode right, ions in two columns, faded when not involved, caption under.
- Method rig (`aqel-m-set`, `-which`, `-run`, `-all`): beaker, two electrodes, upside-down tubes, power supply, numbered key steps 1 to 4.
- Questions: `aqel-question-rig` (numbered parts 1 to 4, no words; anode on the left), `aqel-question-data` (product table).

## States in full
See `lesson.ts` (20 screens: C27-01 to C27-20) and `teachingFrames.ts`.
