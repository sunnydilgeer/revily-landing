# Physics Lesson 15 storyboard: Current, charge and circuit symbols

Topic P2 Electricity. Folder `physics/lesson-15`, id `P-ELE-015-P`, skill `P-CIRCUIT`, prefix `circuit-`. It owns current, potential difference and resistance (meanings and units), the closed loop, charge and Q = I × t with the minutes-to-seconds conversion, the fourteen circuit symbols and the rules for drawing a circuit diagram. V = IR is the next lesson.

Big idea: current is a flow of charge, pushed by potential difference and slowed by resistance, and it only flows round a closed loop. Q = I × t tells you how much charge has flowed. Circuit diagrams have standard symbols and simple rules.

Flow note: three ideas and three units first, because everything else in electricity needs them. The closed loop and "more resistance, less current" are stated, not calculated. Charge is next because it uses only the current idea, with one worked example, one near-identical guided question and one that needs the minutes-to-seconds step. Symbols are grouped in fives to avoid a list of fourteen. Drawing rules come last, when the symbols are known, and include the ammeter (in the loop) and voltmeter (across a component).

Sections:
1. Start here (P15-01): a lamp with a gap.
2. What are current, pd and resistance? (P15-02–04): current → pd → resistance → complete loop → more resistance, less current. Checks: quantity and unit; what resistance is.
3. How much charge flows? (P15-05–08): rate of flow → Q = I × t → minutes to seconds → worked example (3 A, 40 s) → guided (5 A, 20 s) → guided with minutes (2 A, 3 min).
4. What do the circuit symbols look like? (P15-09–11): cell, battery, switches → lamp, fuse, LED → resistors → meters → diode, LDR, thermistor. Checks: a variable resistor; which meter measures current.
5. How do you draw a circuit? (P15-12–13): rules → ammeter in series → voltmeter in parallel → whole circuit. Check: a misplaced voltmeter.
6. On your own (P15-14–18): a calculation with minutes; identify the ammeter; find the open switch; resistance and current; a written answer.

Out of scope: V = IR and ohmic conductors (next lesson), series and parallel rules for current and pd (later lessons), how LDRs, thermistors and diodes behave, electron flow versus conventional current, Higher-tier content.

Source boundary: supplied revision-guide page 180 (scope only; the current and resistance link is stated, not calculated); AQA 8464 Physics 6.2.1.1 and 6.2.1.2. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- "In series" and "in parallel" appear once each, only to place the ammeter and voltmeter; the full rules are taught in later lessons.
- The cell is described as one long thin line (positive) and one short thick line, the AQA convention.
- The three questions on unit, symbol and meter have one right answer each; the minutes-to-seconds step is a separate frame and a separate guided question.

## Diagram specs
Organic, soft and slightly hand-drawn, as in Science Lessons 17 and 18: rounded shapes, gentle tints with a darker stroke of the same hue, generous white space, no more detail than Foundation needs, readable at 360px. Use PhysicsKit (physicsPalette, energy-store badges, transfer arrows) and the course colours: yellow = energy from the Sun, blue = water, green = plants, amber = fuels. Text in the SVG at least 12px. Every SVG has role="img" and a title; assessment views hide the answer-giving words but keep the numbers. All circuit symbols come from PhysicsKit only (AQA symbols), wires straight with square corners, loops closed, ammeters in series, voltmeters in parallel. Charge is drawn as small blue dots (the Physics kit colour); current as vermilion arrows along the wire, in the conventional direction.

- `circuit-current`: a simple closed loop with a cell, switch (closed) and lamp; small dots moving round with arrows. Labels "flow of charge = current", unit badge "amperes, A", an ammeter in the loop.
- `circuit-pd`: the same loop with the cell highlighted and a big soft "push" arrow beside it. Labels "cell provides the push: potential difference", unit badge "volts, V", a voltmeter across the cell.
- `circuit-resistance`: the same loop with a resistor highlighted and the dots bunching and moving slowly through it. Labels "resistance slows the flow", unit badge "ohms, Ω".
- `circuit-loop`: two loops side by side: a complete loop with a tick and moving dots "closed loop with a source of pd: charge flows", and a loop with a gap and a cross "gap: no flow". Note "single loop: same current everywhere", with equal current arrows at three places.
- `circuit-depends`: two identical loops with the same cell, one with a small resistor and a big current arrow, one with a large resistor and a small arrow. Labels "small resistance: bigger current", "large resistance: smaller current", "same push".
- `circuit-charge`: a wire cross-section with dots passing a dashed line: three dots pass in one second with a "1 s" stopwatch, then more dots for a bigger current. Labels "bigger current, more charge every second", "charge is measured in coulombs, C".
- `circuit-formula`: the equation "charge flow (C) = current (A) × time (s)" and "Q = I × t" as a colour-coded card, with the three unit badges C, A, s.
- `circuit-time`: a stopwatch showing "2 minutes" with an arrow "× 60" to "120 seconds". Note "the time must be in seconds".
- `circuit-worked-charge`: a worked-steps card for 3 A for 40 s: "I = 3 A", "t = 40 s", "Q = I × t", "Q = 3 × 40", "Q = 120 C", each step on its own line with the answer highlighted.
- `circuit-cell-switch`: a labelled symbols strip: cell (with + on the long line), battery (two cells), switch open, switch closed. Names under each.
- `circuit-lamp`: filament lamp, fuse, LED (with two arrows) symbols with names under each.
- `circuit-resistor`: resistor and variable resistor symbols with names, and a short note "arrow: resistance can be changed".
- `circuit-meters`: ammeter (A in a circle) and voltmeter (V in a circle) symbols, each with a one-word job: "measures current", "measures potential difference".
- `circuit-sensors`: diode, LDR, thermistor symbols with names under each.
- `circuit-rules`: a good circuit (straight wires, square corners, closed) with a tick, and a bad one (curved wire, a gap) with a cross. A finger-path arrow "follow the wire all the way round".
- `circuit-series`: the loop with an ammeter in the loop, next to the lamp, highlighted; current arrows going through the ammeter. Label "ammeter: in the loop (in series)".
- `circuit-parallel`: the loop with a voltmeter on a separate branch across the lamp, highlighted. Label "voltmeter: across the component (in parallel)".
- `circuit-whole`: the full circuit: cell, closed switch, lamp and ammeter in one loop, voltmeter across the lamp; names on each part and a tick "closed loop, straight wires".
- `circuit-q-symbols` (question, assessment view): four numbered symbols in a row: 1 resistor, 2 fuse, 3 LED, 4 variable resistor. No names. Neutral description: "Four circuit symbols, numbered 1 to 4."
- `circuit-q-circuit` (question, assessment view): a closed loop: 1 cell (left), 2 lamp (top), 3 ammeter (right, in the loop), 4 voltmeter across the lamp. Numbers only. Neutral description: "A circuit diagram with four numbered components."
- `circuit-q-open` (question, assessment view): a loop with 1 lamp, 2 cell, 3 ammeter and 4 an open switch. Numbers only, the switch drawn open. Neutral description: "A circuit diagram with four numbered components."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
