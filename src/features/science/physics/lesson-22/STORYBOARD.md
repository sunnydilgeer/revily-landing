# Physics Lesson 22 storyboard: Investigating resistors in series and parallel

Chapter P2, Electricity. Folder `physics/lesson-22`, id `P-ELE-022-P`, skill `P-RESISTOR-PRACTICAL`, spec 6.2.2 (required practical). It owns the method for adding identical resistors in series and then in parallel, the measurements, R = V ÷ I, the two expected graphs, fair testing and safety. Preparation only: this online lesson never claims to complete the practical.

Big idea: to find the total resistance of a circuit you measure the current and use the cell's pd, R = V ÷ I. Adding resistors in series raises the total resistance (straight line up); adding them in parallel lowers it (falling curve).

Flow note: series method first because it is the simpler circuit and includes the calculation; then parallel as "one change"; then what the results should show, graphs and safety, so students can predict before they collect data. Calculation flow: worked example (6.0 V, 0.50 A, then 0.25 A) → near-identical guided item (6.0 V, 0.20 A) → independent item (4.5 V, 0.090 A).

Sections:
1. Start here (P22-01): which measurements give resistance.
2. How do you test resistors in series? (P22-02–04): the question and the kit → build with one resistor → measure and calculate → worked example → add one at a time. Checks: where the ammeter goes; a resistance calculation.
3. What changes for parallel? (P22-05–07): same circuit, one change → measure again → a fair test. Checks: the only change; why keep equipment the same.
4. What should your results show? (P22-08–10): what to expect → the series graph → the parallel graph → safety and reliability. Checks: current in parallel; why open the switch.
5. On your own (P22-11–15): choose the parallel graph from four; an independent calculation; resistance from series data; spot the unfair comparison; a written method with the expected graph.

Out of scope: the resistance-of-a-wire practical and the I–V practical (their own lessons); the parallel resistance formula; uncertainty and error bars; the exam question on the page was not reused.

Source boundary: supplied revision-guide page 187 (scope only); AQA 8464 Physics 6.2.2. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The first resistor's total resistance is worked out from the cell pd and the ammeter reading, ignoring the tiny resistance of wires and ammeter, as the page does.
- The expected parallel graph is drawn as a falling curve that flattens and never reaches zero.
- Safety is proportionate: warm resistors and wires, open the switch between readings, low-voltage cell only.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling, generous white space. Import symbols and colours from `components/PhysicsKit.tsx` (`physicsPalette`, circuit symbols, energy-store badges). Circuit diagrams use the AQA symbols, straight wires and closed loops, ammeters in series and voltmeters across a component. Text in the SVG at least 12px; it must read on a 360px phone. Resistors are the AQA rectangle symbol in a soft amber tint. Graphs use the PhysicsKit axes: "Number of identical resistors" horizontal, "Total resistance (Ω)" vertical.

- `rprac-kit`: the equipment laid out as simple labelled icons: cell, switch, four identical resistors, ammeter, wires. Label "identical resistors: same resistance".
- `rprac-one-resistor`: series circuit with cell, switch, one resistor and an ammeter in the same loop. Labels "ammeter in series", "pd of cell: 6.0 V".
- `rprac-calculate`: the same circuit with the ammeter reading "0.50 A" and a card "R = V ÷ I" with V and I coloured to match the cell and ammeter. Small note "open the switch after each reading".
- `rprac-worked`: two circuits side by side: one resistor (0.50 A, R = 6.0 ÷ 0.50 = 12 Ω) and two in series (0.25 A, R = 6.0 ÷ 0.25 = 24 Ω). Same 6.0 V cell drawn on both.
- `rprac-add-series`: the circuit with a resistor being added in series (highlighted), and a small blank results table headed "number of resistors", "current (A)", "total resistance (Ω)".
- `rprac-parallel-build`: two-resistor circuit with the second resistor on a new branch (highlighted) and the ammeter by the cell. Label "new resistor goes in parallel".
- `rprac-parallel-measure`: the same circuit with the ammeter highlighted, reading "1.0 A", and "total current" beside it; a card "R = V ÷ I".
- `rprac-fair`: series circuit and parallel circuit side by side, both with the same cell, same resistors and same ammeter drawn in matching colours joined by "=" signs. Label "same equipment for both".
- `rprac-expect`: two-column summary card, "Adding in series: current down, total resistance up" and "Adding in parallel: current up, total resistance down", with small arrows.
- `rprac-graph-series`: axes as above, a straight line rising through the points for 1, 2, 3, 4 resistors. Label "more resistors = larger total resistance".
- `rprac-graph-parallel`: same axes, a smooth curve falling and flattening. Label "more resistors = smaller total resistance".
- `rprac-safety`: a small circuit with a warm resistor drawn with soft heat wavy lines; a switch labelled "open between readings". Note "warm parts can change results and cause burns".
- `rprac-q-graphs` (question, assessment view): four small graphs in a 2×2 grid numbered 1 to 4, all with the same axes "Number of identical resistors" and "Total resistance (Ω)": 1 straight line rising, 2 flat horizontal line, 3 curve rising and getting steeper, 4 smooth curve falling and flattening (the correct one). No hints. Neutral accessible description: "Four graphs of total resistance against number of identical resistors."
