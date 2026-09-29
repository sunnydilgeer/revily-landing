# Physics Lesson 20 storyboard — Series circuits

Chapter P2, Electricity. Folder `physics/lesson-20`, id `P-ELE-020-P`, skill `P-SER`, spec 6.2.2. It owns what a series circuit is, the three series rules (same current, pd shared, resistances add) with the reason resistance adds, calculating the current from the total resistance, and cells in series. Parallel circuits are the next lesson; V = IR is recalled from the resistance lesson.

Big idea: a series circuit is one loop. The current is the same everywhere, the pd of the supply is shared out between the components, and the resistances add up, so adding a resistor lowers the current.

Flow note: picture first (one loop, a gap breaks everything, voltmeters are the exception), then the three rules one per frame with their symbols, then the calculation, because the calculation uses all three rules. Calculation flow: worked example (4.0 Ω + 8.0 Ω, 24 V = 2.0 A) → near-identical guided item (3.0 Ω + 9.0 Ω, 36 V) → independent calculation on your own (three resistors, 0.50 A, find the battery pd). Cells in series follow as a short last idea with its own check.

Sections:
1. Start here (P20-01): what a circuit needs to work (a complete loop).
2. What is a series circuit? (P20-02–04): one big loop → take one away → voltmeters are the exception → why series is not used much. Checks: removing one lamp; which meter is in parallel.
3. What are the series rules? (P20-05–08): same current → pd is shared → resistances add → why more resistors mean less current. Checks: pd across the second resistor; the second ammeter's reading; total resistance.
4. How do you calculate the current? (P20-09–11): total resistance → I = V ÷ R → substitute → cells in series. Checks: current from 3.0 Ω, 9.0 Ω and 36 V; three 1.5 V cells.
5. On your own (P20-12–15): an independent calculation (circuit picture), three resistors and two voltmeters (assessment view), effect of adding a resistor, and a written description of the three rules.

Out of scope: parallel circuits and their rules, the resistors investigation, cells in series facing opposite ways, power and energy, potential-divider calculations.

Source boundary: supplied revision-guide page 185 (scope only); AQA 8464 Physics 6.2.2. All wording, numbers and diagrams are original; the page's example and exam question are not reused. Draft pending teacher review.

Judgement calls for the teacher:
- The rearrangement I = V ÷ R is shown once as a step in the worked example, as the page does. R and V are never made the subject.
- The reason resistance adds is kept to one frame ("more resistance, less current; bigger resistance takes a bigger share").
- Cells in series are limited to the "same way" case that the page gives.

## Diagram specs
Same look as Lessons 17 and 18 (Science): soft, rounded, gentle tints. Circuit symbols from PhysicsKit, straight wires, closed loops; ammeters in series, voltmeters in parallel (across a component). Text in the SVG ≥ 12px. Section 4 frames share one drawing: a battery (24 V) with two resistors (4.0 Ω and 8.0 Ω) in one loop.

- `series-loop`: a battery with two lamps in a single rounded-rectangle loop; a green arrow going round the whole loop, label "one loop, one path".
- `series-break`: the same circuit with one lamp removed (dashed gap), both lamps drawn dim; label "one gap: all stop".
- `series-voltmeter`: the same circuit with a voltmeter V across one lamp on its own branch, the branch highlighted; label "voltmeter: in parallel, not part of the series loop".
- `series-uses`: a small test circuit with an ammeter and voltmeter on a component, tag "used for measuring and testing".
- `series-current`: the loop with three ammeters A1, A2, A3 in different places, all reading 0.30 A (not 0.40 A, which is the answer to a guided question); the same-current arrow the same width all the way round; note "I₁ = I₂ = I₃".
- `series-pd`: the loop with a 9 V battery, two lamps and voltmeters across each: 4 V and 5 V, and a bar above splitting 9 V into a 4 V and a 5 V segment (not 12 V = 5 V + 7 V, which is the answer to a guided question); note "V total = V₁ + V₂".
- `series-resistance`: two resistors 2 Ω and 3 Ω drawn end to end, joined by a bracket to one resistor 5 Ω; note "R total = R₁ + R₂".
- `series-why`: two loops one above the other with the same battery; top: one resistor, thick current arrow; bottom: two resistors, thin current arrow; label "more resistance, less current".
- `series-wk-total`: the 24 V battery loop with 4.0 Ω and 8.0 Ω resistors; card "R total = 4.0 + 8.0 = 12 Ω".
- `series-wk-eq`: the same circuit faded; card with "V = IR" then "I = V ÷ R".
- `series-wk-sub`: the circuit with an ammeter shown "2.0 A"; card "I = 24 ÷ 12 = 2.0 A".
- `series-cells`: two 1.5 V cells drawn in a row, both with the longer plate on the same side, joined by a bracket to a 3.0 V label; a small second picture with four cells and 6.0 V (not three cells and 4.5 V, which is the answer to a guided question).
- `series-q-circuit` (question, assessment view): closed loop with a battery labelled "?", resistors 3.0 Ω, 4.0 Ω and 5.0 Ω in series and an ammeter A reading 0.50 A. Neutral description: "A series circuit with a battery, three resistors and an ammeter."
- `series-q-voltmeters` (question, assessment view): 12 V battery with three resistors in series; voltmeters across the first two reading 2.0 V and 4.0 V; a voltmeter across the third with reading "?". Neutral description: "A series circuit with three resistors and three voltmeters."
