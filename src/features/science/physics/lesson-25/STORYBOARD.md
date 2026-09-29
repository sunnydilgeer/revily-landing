# Physics Lesson 25 storyboard: Energy, charge and power

Chapter P2, Electricity. Folder `physics/lesson-25`, id `P-ELE-025-P`, skill `P-ENERGY-CHARGE`, specs 6.2.4.1 and 6.2.4.2. It owns E = QV, P = VI and P = I²R, by substitution only. No rearranging and no square roots (the page's worked example that finds a current with a square root is Higher-style and left out).

Big idea: potential difference is the energy transferred for each coulomb of charge, so E = Q × V. Power can be found from current and pd, P = V × I, or from current and resistance, P = I² × R when the pd is unknown.

Flow note: pd as energy per charge first, because it connects to the earlier ideas of work and charge; then P = VI, which is the same idea per second; then P = I²R as the case where the pd is missing. Each equation: worked example → near-identical guided item → independent item on your own (9.0 V and 30 C; 12 V and 2.5 A; 4.0 A and 3.0 Ω), then an "which equation?" question.

Sections:
1. Start here (P25-01): a 12 V and a 3 V battery moving the same charge.
2. What does pd tell you about energy? (P25-02–04): charge carries energy → what pd tells you → E = QV → worked example (6.0 V, 50 C, 300 J). Checks: 12 V and 20 C; double the charge.
3. How do you find power from current and pd? (P25-05–07): power again → P = VI → worked (230 V, 5.0 A, 1150 W) → bigger pd or current. Checks: 9.0 V and 3.0 A; same pd, larger current.
4. What if you do not know the pd? (P25-08–10): the missing pd → P = I²R → what squared means → worked (3.0 A, 4.0 Ω, 36 W). Checks: 2.0 A and 6.0 Ω; choosing the equation.
5. On your own (P25-11–15): three independent calculations; choosing an equation; a written explanation about pd, current and power.

Out of scope: rearranging any of the three equations (including finding I from P = I²R with a square root); E = Pt (earlier lesson); charge Q = It (earlier lesson); the National Grid (next lesson). The exam questions on the page were not reused.

Source boundary: supplied revision-guide page 190 (scope only); AQA 8464 Physics 6.2.4.1 and 6.2.4.2. All wording, numbers, examples and diagrams are original (torch battery, hairdryer and heating element replace the page's toothbrush and motor). Draft pending teacher review.

Judgement calls for the teacher:
- "Energy transferred per coulomb" is used as the meaning of pd and is not converted into "1 V = 1 J/C" wording beyond one clause.
- Squaring is explained in one frame as "multiplied by itself", with "square first, then multiply".
- Numbers are kept calculator-friendly: 230 × 5.0 = 1150 W is the biggest.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling, generous white space. Import symbols and colours from `components/PhysicsKit.tsx` (`physicsPalette`, circuit symbols, energy-store badges). Circuit diagrams use the AQA symbols, straight wires and closed loops, ammeters in series and voltmeters across a component. Text in the SVG at least 12px; it must read on a 360px phone. Equation cards use the PhysicsKit colours: one colour per quantity (energy, charge, pd, current, resistance, power) kept the same across every card and worked example.

- `qv-carries`: cell, lamp and wires with charge dots as small round beads on the wire; an arrow from the cell to the beads "energy transferred to the charge" and from the beads to the lamp "energy transferred to the lamp".
- `qv-pd-meaning`: two batteries, "12 V" and "3 V", each with one bead leaving them; the 12 V bead carries a bigger energy bag than the 3 V bead. Label "bigger pd: more energy for each coulomb".
- `qv-equation`: equation card "energy transferred (J) = charge flow (C) × potential difference (V)" and "E = Q × V", with unit tags.
- `qv-worked`: 6.0 V torch battery with 50 C of charge; calculation card "E = 50 × 6.0 = 300 J" highlighted; a note "no conversion needed".
- `qv-power-again`: an appliance with a clock and "energy each second"; meter icons (ammeter, voltmeter) showing that current and pd are easy to measure.
- `qv-pvi-equation`: equation card "power (W) = potential difference (V) × current (A)" and "P = V × I", with unit tags.
- `qv-pvi-worked`: hairdryer silhouette with "230 V" (voltmeter) and "5.0 A" (ammeter); card "P = 230 × 5.0 = 1150 W" highlighted.
- `qv-pvi-compare`: two appliances X and Y with the same pd, "same V", and different current bars; the one with the longer current bar has the longer power bar. Label "same pd, larger current: larger power".
- `qv-no-pd`: an appliance with an ammeter reading and a resistance label "R", and a big "?" over the voltmeter position. Label "pd unknown".
- `qv-i2r-equation`: equation card "power (W) = current² (A²) × resistance (Ω)" and "P = I² × R", with unit tags.
- `qv-squared`: a small tile showing "3.0²  =  3.0 × 3.0  =  9.0" with two identical squares of side 3 drawn beside it. Label "squared means multiplied by itself".
- `qv-i2r-worked`: heating element silhouette with "3.0 A" and "4.0 Ω"; two step chips "Step 1: 3.0 × 3.0 = 9.0" and "Step 2: 9.0 × 4.0 = 36 W".
No question visuals in this lesson.
