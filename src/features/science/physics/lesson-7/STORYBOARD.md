# Physics Lesson 7 storyboard — Investigating specific heat capacity

Chapter P1, Energy. Folder `physics/lesson-7`, id `P-ENE-007-P`, skill `P-SHC-PRACTICAL`, spec 6.1.1.3 (required practical). It owns the method, variables, equipment, safety and data handling for finding the specific heat capacity of a block with an electric heater. The heater's power is given in watts and the energy is worked out with energy = power × time (from the previous lesson); P = VI is not taught here. c = ΔE ÷ (m × Δθ) is shown as one rearrangement of ΔE = m × c × Δθ, which the earlier specific heat capacity lesson taught.

Big idea: the energy the heater transfers (power × time) warms the block, so the specific heat capacity is that energy divided by the mass times the temperature rise.

Flow note: the aim and equipment first, then why the insulation and the control variables matter, then the method and safety in the order the student would work, then the calculation as four small steps with one worked example. Calculation flow: worked example → near-identical guided item → independent calculation on your own. This lesson prepares students for the practical; it never claims to complete it (the first frame says the teacher runs it in the lab).

Sections:
1. Start here (P7-01): a hot block in a cool room loses energy to the air.
2. What are we measuring? (P7-02–04): the aim → the equipment → where the energy goes → what to control. Checks: why insulate; what stays the same.
3. How do you run it? (P7-05–07): set up → starting temperature → heat for a fixed time → stay safe → try another material. Checks: the safest action at the end; what to record before switching on.
4. How do you find c? (P7-08–11): energy from the heater → all the energy reaches the block → the temperature rise → turn the equation round. Worked: 2.0 kg, 100 W, 3 minutes, 20 °C to 29 °C = 1000 J/kg°C. Guided: 1.5 kg, 60 W, 5 minutes, 18 °C to 28 °C; which equation.
5. On your own (P7-12–16): an independent calculation (200 W, 0.50 kg, 1 minute, 20 °C to 50 °C = 800 J/kg°C); the effect of energy escaping (c too high); a numbered set-up diagram; comparing two blocks' temperature rises; a written method with a safety point.

Out of scope: P = VI (a later lesson); using an ammeter and voltmeter to find the power; uncertainty and percentage error; heat loss corrections; the meaning of c and ΔE = m × c × Δθ (taught in the previous lesson).

Source boundary: supplied revision-guide page 170 (scope only); AQA 8464 Physics 6.1.1.3 required practical. All wording, numbers, examples and diagrams are original; the page's 10 V and 10 A example and its exam question are not reused. Draft pending teacher review.

Judgement calls for the teacher:
- The page finds the heater power with P = VI. Here the power is simply given in watts, so the energy calculation uses P × t; the ammeter and voltmeter are left for later.
- "Too high" for the effect of energy escaping is a standard evaluation point; it is stated in one sentence and checked once.
- Safety is proportionate: hot heater and block, cool before moving, electrical equipment away from water, glass thermometer.

## Diagram specs
Same look as Science Lessons 17 and 18 and the other Physics lessons: soft flat fills with a darker stroke of the same hue, PhysicsKit `physicsPalette`, energy-store badges and transfer arrows. Text in the SVG ≥ 12px, readable on 360px. The set-up drawing is one shared scene used by the method frames: a metal block (rounded, with two holes), a wire-connected heater in one hole with a cable to a power supply box, a thermometer in the other hole, and a thick layer of insulation wrapped round the block. No circuit diagram is needed (that is a later lesson).

- `shcprac-aim`: the block with an arrow "energy in" and a thermometer showing a rise, with the words "how much does the temperature rise?". A small note "your teacher runs this in the lab".
- `shcprac-kit`: the full set-up with label lines to: block, heater, thermometer, insulation, power supply, plus small pictures of a balance and a stopwatch at the side.
- `shcprac-energy`: the set-up with a transfer arrow "electrically" from the power supply to the heater, an arrow "by heating" from the heater into the block, and a smaller faded arrow "some escapes" crossing the insulation. Energy-store badges: "thermal (heater)" and "thermal (block)".
- `shcprac-variables`: two identical set-ups (block A and block B, different colours for the material). Tags on each: "same mass", "same power", "same time", and "different material". The temperature rise is shown as a question mark "measure this".
- `shcprac-setup`: the set-up drawn in stages: balance with the block on it "mass in kg", insulation being wrapped, heater and thermometer in place; power off (switch symbol open).
- `shcprac-start`: the thermometer close-up "20 °C" labelled "starting temperature", the power supply switched on with a stopwatch at "0 s". A tag "heater power given in watts, e.g. 50 W".
- `shcprac-end`: the stopwatch at "10 min" and the thermometer close-up at a higher temperature "final temperature", with the power supply switched off.
- `shcprac-safety`: the set-up with warm-coloured heat marks on heater and block and a "hot: do not touch" sign; a small note "let it cool before moving", a droplet crossed out near the power supply, and a thermometer with "take care: glass".
- `shcprac-repeat`: two panels: "another block" (the set-up with a different coloured block) and "a liquid" (an insulated beaker with the heater and thermometer in liquid, "known mass").
- `shcprac-energy-pt`: a 50 W heater with a stopwatch "10 min = 600 s", the sum "E = 50 × 600 = 30 000 J", unit chips "W × s = J".
- `shcprac-assume`: the set-up with a big arrow from the heater to the block labelled "E = ΔE (assume all of it)", and a thin dotted arrow escaping through the insulation labelled "in real life a little escapes".
- `shcprac-dtheta`: two thermometers "start 20 °C" and "final 26 °C" with a bracket "Δθ = 26 − 20 = 6 °C".
- `shcprac-rearrange`: two-line algebra: "ΔE = m × c × Δθ" then an arrow "÷ (m × Δθ) on both sides" then "c = ΔE ÷ (m × Δθ)", with the unit tag "J/kg°C".
- `shcprac-worked` (worked example, teaching view): the set-up with the given numbers (2.0 kg, 100 W, 3 minutes, 20 °C to 29 °C) and the four steps listed on the right with the answers 180 s, 18 000 J, 9 °C, 1000 J/kg°C.
- `shcprac-q-setup` (question, assessment view): the set-up with numbered pointers: 1 = heater, 2 = thermometer, 3 = block, 4 = insulation. Hide every name. Only numbered dots, matching the four options "Part 1"–"Part 4". Neutral description: "A block with a heater, a thermometer and a layer wrapped round it, with four numbered parts."
- `shcprac-q-results` (question, assessment view): a table with two rows, Block X and Block Y. Columns: "Mass (kg)" 1.0, 1.0; "Heater power (W)" 50, 50; "Heating time (min)" 5, 5; "Temperature rise (°C)" 10 for X and 20 for Y. No c column and no highlight.
