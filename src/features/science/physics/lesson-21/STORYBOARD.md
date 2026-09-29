# Physics Lesson 21 storyboard: Parallel circuits

Chapter P2, Electricity. Folder `physics/lesson-21`, id `P-ELE-021-P`, skill `P-PARALLEL`, spec 6.2.2. It owns the parallel rules: each component on its own branch, the same pd across every branch, currents adding up at a junction, and total resistance smaller than any single resistor. Series circuits are taught in the previous lesson (one-clause contrast only); the investigation is the next lesson.

Big idea: in a parallel circuit each branch is connected straight across the supply, so each branch gets the full pd and works independently. The branch currents add up to the total current, and adding a branch lowers the total resistance.

Flow note: independence first (everyday, no numbers), then the two rules with one worked example, then resistance last, because it needs both rules and R = V ÷ I. Calculation flow: worked example (12 V, 3.0 A, 1.2 A) → near-identical guided item (5.0 A, 2.0 A) → independent item on your own (0.9 A, 0.4 A on a numbered circuit).

Sections:
1. Start here (P21-01): a lamp is switched off and the others stay on.
2. What is a parallel circuit? (P21-02–04): branches → remove one → switches → homes and cars. Checks: a lamp blows; why homes are wired in parallel.
3. How do pd and current behave? (P21-05–07): same pd → junction → add the branches → worked pd → worked current. Checks: pd across a lamp on a 9 V battery; branch current from total.
4. What happens to resistance? (P21-08–10): another route → total current up → resistance down → less than any single resistor. Checks: effect of a third branch; a sensible total for two 20 Ω resistors.
5. On your own (P21-11–15): branch current on a numbered circuit; removing a lamp; why resistance falls; a pd statement; a written explanation.

Out of scope: series rules (previous lesson); the resistor investigation (next lesson); the parallel resistance formula (not needed at Foundation); mixed series and parallel calculations; the exam question on the page was not reused.

Source boundary: supplied revision-guide page 186 (scope only); AQA 8464 Physics 6.2.2. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- "Total resistance less than any one resistor" is stated with a 10 Ω / 20 Ω example, never with the 1/R formula.
- Identical components sharing current equally is stated only for identical branches.
- The page's vine picture is not reused; the junction is drawn as a simple splitting wire.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling, generous white space. Import symbols and colours from `components/PhysicsKit.tsx` (`physicsPalette`, circuit symbols, energy-store badges). Circuit diagrams use the AQA symbols, straight wires and closed loops, ammeters in series and voltmeters across a component. Text in the SVG at least 12px; it must read on a 360px phone. Battery on the left, branches to the right; lamps are the AQA lamp symbol with a soft yellow glow only when lit. Currents are shown by small arrows on the wire, in the physics kit's current colour (vermilion).

- `parallel-branches`: cell with two lamps on two separate loops. Each loop softly tinted a different pale shade and labelled "branch 1" and "branch 2". Label "each branch is joined separately to the cell".
- `parallel-remove`: the same circuit with branch 2's lamp removed (a gap with a small dashed outline and a cross), branch 1's lamp glowing. Label "the other branch still works".
- `parallel-switch`: the same circuit with a switch in each branch, one open (branch 2 dark), one closed (lit). A small note "a switch on a branch controls only that branch".
- `parallel-everyday`: a simple house-wall sketch with a lamp, a kettle and a television, each on its own branch from one supply. Labels "lights and sockets are wired in parallel", "car electrics too".
- `parallel-same-pd`: cell, two lamps in parallel, a voltmeter across the cell and a voltmeter across each lamp, all reading 6 V. Labels "6 V", "6 V", "6 V" and "same pd on every branch".
- `parallel-junction`: cell with two branches; the two junctions highlighted as small dots. Arrows show the current splitting at the top junction and rejoining at the bottom. Label "current splits, then joins again".
- `parallel-add`: the same circuit with ammeters: A (total, by the cell) 3.0 A, A₁ 1.2 A, A₂ 1.8 A in colour-coded boxes, with "3.0 = 1.2 + 1.8".
- `parallel-worked-pd`: 12 V battery, two lamps in parallel, ammeter by the battery reading 3.0 A, branch 1 ammeter reading 1.2 A, branch 2 ammeter shown as "?". Three voltmeter labels "12 V" highlighted amber. Step chip "Step 1: pd".
- `parallel-worked-current`: the same circuit, the ? highlighted; a sum card "3.0 − 1.2 = 1.8 A" beside it. Step chip "Step 2: current".
- `parallel-add-branch`: the two-branch circuit with a third branch and lamp drawn in a highlighted tint. Label "new branch, same pd".
- `parallel-more-current`: the three-branch circuit with ammeter arrows: total current arrow drawn thicker than in the two-branch version (shown faded beside it). Label "more branches, more total current".
- `parallel-less-resistance`: a small card "R = V ÷ I" with the pd arrow level and the current arrow larger, ending "total resistance goes down".
- `parallel-total-r`: two 10 Ω resistors in parallel on the left with a bracketed "total is less than 10 Ω", and two 10 Ω in series on the right "total is 20 Ω". A note "parallel: less than any one; series: add up".
- `parallel-q-circuit` (question, assessment view): cell with two parallel lamp branches A and B. Numbered ammeters: 1 by the cell, 2 on branch A, 3 on branch B. No readings written on the diagram (the numbers are in the question text). Neutral accessible description: "A circuit with a cell and two parallel branches, with three numbered ammeters."
