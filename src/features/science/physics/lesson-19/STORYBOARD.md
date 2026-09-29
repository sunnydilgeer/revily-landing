# Physics Lesson 19 storyboard — LDRs, thermistors and sensing circuits

Chapter P2, Electricity. Folder `physics/lesson-19`, id `P-ELE-019-P`, skill `P-SENS`, spec 6.2.1.4. It owns the LDR and thermistor (graphs, symbols, uses) and one qualitative sensing circuit: a thermistor in series with a fixed resistor, with a fan connected across the fixed resistor. The current–pd graphs of other components are in the I–V lesson; series and parallel rules are in the next lessons and are only used here in one plain sentence ("the pd is shared").

Big idea: an LDR's resistance falls as the light gets brighter; a thermistor's resistance falls as it gets hotter. In a circuit where the pd is shared, a component with a bigger resistance takes a bigger share, so the sensor can steer the pd to a fan or lamp.

Flow note: the two sensors first, in the same pattern (what it is, dark/cold = high resistance, uses), so the second is a light echo of the first. The sensing circuit comes last and stays qualitative: chain of reasoning (temperature → thermistor resistance → its share of the pd → pd across the fan → fan speed). No calculations: the page gives none.

Sections:
1. Start here (P19-01): a street light that comes on by itself.
2. What does an LDR do? (P19-02–04): definition and symbol → dark high, bright low (graph) → uses. Checks: resistance in darkness; a use of an LDR.
3. What does a thermistor do? (P19-05–07): definition and symbol → cold high, hot low (graph) → thermostats. Checks: hotter thermistor; which component for a thermostat.
4. How does a sensing circuit work? (P19-08–11): what it is → the circuit → bigger resistance, bigger share → the room gets hotter → fan goes faster. Checks: pd across the fan; the sharing rule; the fan wired across the thermistor instead (opposite effect).
5. On your own (P19-12–15): reading an LDR graph (assessment view), a lamp/LDR sensing circuit (assessment view), symbol recall (assessment view), and a written explanation of the fan circuit.

Out of scope: numerical pd-sharing (potential dividers), the shape of the thermistor graph beyond "falls", reasons for LDR/thermistor behaviour at particle level, transistors and switching circuits.

Source boundary: supplied revision-guide page 184 (scope only); AQA 8464 Physics 6.2.1.4. All wording, examples and diagrams are original; the page's characters and exam question are not reused. Draft pending teacher review.

Judgement calls for the teacher:
- The page uses a fan in a hot room; here the fan is kept (it is the standard idea) but the question items use a different device (lamp with an LDR).
- The term "parallel" is avoided; the fan is described as "connected across the fixed resistor" and having the same pd as it, as the page states.
- The thermistor is the type whose resistance falls as temperature rises, as on the page.

## Diagram specs
Same look as Lessons 17 and 18 (Science): soft, rounded, gentle tints. Circuit symbols from PhysicsKit (LDR, thermistor, resistor, fan as a motor or fan icon, lamp), straight wires, closed loops. Graph axes from PhysicsKit. Sensing-circuit frames share one drawing: battery on the left, thermistor at the top of the middle wire, fixed resistor and fan side by side in a loop underneath (fan wired across the fixed resistor). Text in the SVG ≥ 12px.

- `sensor-ldr`: LDR symbol large, with a small torch or sun above it, and a label "light dependent resistor: resistance changes with light".
- `sensor-ldr-graph`: axes "Light intensity" (x: dark to bright, no numbers) and "Resistance (Ω)" (y); a smooth curve falling steeply from high at dark, then flattening. Tags "dark: highest resistance" and "bright: resistance falls".
- `sensor-ldr-uses`: three small icons in rounded cards: a night light, an outdoor lamp on a house, a doorway with a beam (burglar detector).
- `sensor-thermistor`: thermistor symbol large, with a small thermometer, label "temperature-dependent resistor".
- `sensor-thermistor-graph`: axes "Temperature" (cold to hot) and "Resistance (Ω)"; same falling curve. Tags "cool: greater resistance" and "hot: resistance drops".
- `sensor-thermostat`: a room with a radiator and a small thermometer; two labelled states side by side: "cool: heating on" and "warm: heating off".
- `sensor-what`: a room scene: a fan and a small thermometer, with a hint arrow "conditions change what the fan does".
- `sensor-circuit`: the sensing circuit with labels "thermistor", "fixed resistor", "fan". The supply pd drawn as a shaded bar above it split into two segments "thermistor" and "fixed resistor + fan" (equal at this stage).
- `sensor-share`: the same circuit, with the split bar showing a bigger segment for the bigger resistance (two example resistors labelled "large resistance: big share" and "small resistance: small share"); a note that the fan and the fixed resistor have the same pd.
- `sensor-hot`: the same circuit with a sun/thermometer "hotter", the thermistor drawn with a smaller resistance tag, and the split bar now with a small thermistor segment and a large fixed-resistor-and-fan segment.
- `sensor-fan`: the same circuit with the fan blades drawn with motion lines and the bar unchanged; caption "more pd across the fan: faster".
- `sensor-q-ldr` (question, assessment view): axes "Light intensity" (dark on the left, bright on the right) and "Resistance (Ω)", one falling curve. No highest/lowest tags. Neutral description: "A graph of the resistance of a component against light intensity."
- `sensor-q-circuit` (question, assessment view): battery, an LDR in series with a fixed resistor, and a lamp connected across the fixed resistor. No pd shares or words such as "dimmer" drawn.
- `sensor-q-symbols` (question, assessment view): four circuit symbols in a row numbered 1 to 4, no names: 1 fixed resistor, 2 LDR, 3 diode, 4 thermistor. Neutral description: "Four circuit symbols, numbered 1 to 4."
