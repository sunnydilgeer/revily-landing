# Physics Lesson 18 storyboard — I–V characteristics

Chapter P2, Electricity. Folder `physics/lesson-18`, id `P-ELE-018-P`, skill `P-IV`, spec 6.2.1.4 (required practical). It owns what an I–V characteristic is, linear versus non-linear, finding resistance at a point with R = V ÷ I, the required-practical method, and the three graph shapes: ohmic conductor, filament lamp and diode. It prepares students for the practical and never claims to replace it.

Big idea: an I–V characteristic is a graph of current against pd for one component. Its shape shows how the resistance behaves: a straight line through the origin means constant resistance; a curve means the resistance changes.

Flow note: meaning of the graph first (with R = V ÷ I as one small worked calculation), then how the data is collected, then the three shapes with a reason for each, because the reasons (heating, one-way flow) make more sense once students have seen the circuit and the reversed battery. Calculation flow: worked example in the frames (4.0 V, 0.50 A = 8.0 Ω) → near-identical guided item (6.0 V, 0.20 A) → independent calculation on your own (3.0 V, 0.25 A).

Sections:
1. Start here (P18-01): more pd, more current in a fixed resistor.
2. What is an I–V characteristic? (P18-02–04): a graph of current against pd → linear and non-linear → read off a point → R = V ÷ I. Checks: name of a curved-graph component; R at a point.
3. How do you collect the data? (P18-05–07): the circuit → vary and read the meters → reverse the direction → plot → testing a diode. Checks: job of the variable resistor; why a protective resistor.
4. What do the three graphs look like? (P18-08–10): ohmic conductor → filament lamp → diode → all three together. Checks: why the lamp graph flattens; which component is flat then steep.
5. On your own (P18-11–15): matching a lamp to numbered graphs (assessment view), an independent resistance calculation, what a straight line shows, the change needed to test a diode, and a written explanation of the lamp graph.

Out of scope: gradient calculations, thermistor and LDR graphs (next lesson), the reverse-direction section of the lamp graph beyond "same on both sides", semiconductor detail.

Source boundary: supplied revision-guide page 183 (scope only); AQA 8464 Physics 6.2.1.4. All wording, numbers and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The page's "milliammeter" and "protective resistor" points are kept because they are on the page; each is one frame and one guided question.
- Diode graph is described as "flat, then curves up quickly" as on the page; no forward-voltage value is given.
- The filament lamp curve is drawn symmetrical (same in both directions) and described simply as getting less steep.

## Diagram specs
Same look as Lessons 17 and 18 (Science): soft, rounded, gentle tints. Graph axes from PhysicsKit; I on the vertical axis, V on the horizontal, both crossing at the origin so negative values show. Colours: ohmic conductor green, filament lamp orange-red, diode blue, matching the tints used in the resistance lesson. Circuits use PhysicsKit symbols, straight wires, closed loops. Text in the SVG ≥ 12px.

- `ivchar-meaning`: empty I–V axes with the labels "Current, I (A)" and "Pd, V (V)" and a faint sample curve; caption "an I–V characteristic".
- `ivchar-linear`: two small graphs side by side: a straight line through the origin tagged "linear: fixed resistor", and a curved line tagged "non-linear: filament lamp, diode".
- `ivchar-point`: a graph with a curve (or line) and a marked point; dashed lines drop to both axes with the values "V = 4.0 V" and "I = 0.50 A" (the point matches the worked example).
- `ivchar-calc`: the same graph, point faded, beside a card "R = V ÷ I = 4.0 ÷ 0.50 = 8.0 Ω".
- Section 3 frames share one drawing of the test circuit: cell or battery (+ marked), variable resistor (symbol with arrow), the component in a labelled box "component", ammeter A in series, voltmeter V in parallel across the component only. The step is highlighted, the rest faded.
- `ivchar-circuit`: the full circuit, all labels shown.
- `ivchar-vary`: the same circuit, the variable resistor highlighted with a curved arrow, a small table of two readings (I, V) beside it.
- `ivchar-reverse`: the same circuit with the battery connections crossed over (drawn as two wires swapped) and the current arrow reversed; note "swap the wires at the battery".
- `ivchar-plot`: axes with crosses on both sides of the origin and a smooth best-fit curve through them (neutral shape: a filament lamp curve).
- `ivchar-diode-circuit`: the circuit with a diode as the component and a protective resistor drawn in series next to it, and a milliammeter mA in place of A; small labels "protective resistor" and "milliammeter".
- `ivchar-ohmic`: axes with a straight line through the origin, rising left to right and mirrored below; tag "ohmic conductor, e.g. resistor at constant temperature"; note "straight line: resistance constant".
- `ivchar-lamp`: axes with an S-shaped curve through the origin (steeper near 0, flattening at larger |V|), and a small filament lamp picture that glows brighter towards the right; note "gets less steep: resistance increases as it heats up".
- `ivchar-diode`: axes with a curve flat along the V axis on the left of the origin and near the origin, then curving up quickly on the right; note "one direction only".
- `ivchar-three`: the three graphs in a row, each in its own tint with its component symbol underneath.
- `ivchar-q-graphs` (question, assessment view): three graphs in a row numbered 1, 2, 3 with no component names or notes: Graph 1 flat then rising steeply (diode), Graph 2 S-shaped flattening curve (filament lamp), Graph 3 straight line through the origin (ohmic conductor). Neutral description: "Three I–V graphs, numbered 1 to 3."
