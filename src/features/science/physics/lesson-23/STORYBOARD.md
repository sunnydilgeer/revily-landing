# Physics Lesson 23 storyboard: Electricity in the home

Chapter P2, Electricity. Folder `physics/lesson-23`, id `P-ELE-023-P`, skill `P-MAINS`, specs 6.2.3.1 and 6.2.3.2. It owns ac and dc, the UK mains values (about 230 V, 50 Hz), the live, neutral and earth wires (colours, pd and jobs) and why the live wire is dangerous. The National Grid is a later lesson.

Big idea: the mains is alternating current at about 230 V. A three-core cable has a brown live wire (230 V), a blue neutral wire (0 V, completes the circuit) and a green and yellow earth wire (0 V, safety). The live wire has a large pd to the earth, so touching it can drive a current through you.

Flow note: supply type first (a familiar battery versus the socket), then what is inside the cable, then the danger, because the danger only makes sense once students know the live wire's pd and the earth's 0 V. No calculations in this lesson.

Sections:
1. Start here (P23-01): why plugs and wires are covered in plastic.
2. What are ac and dc? (P23-02–04): two kinds → dc → ac → 230 V and 50 Hz. Checks: which supply is dc; the UK values.
3. What is inside a plug cable? (P23-05–07): three wires → live → neutral → earth. Checks: the green and yellow wire's job; which wires are at 0 V.
4. Why is the live wire dangerous? (P23-08–10): pd to earth → a link through you → switch off → live and earth touching. Checks: why a shock happens; why an off switch is not enough.
5. On your own (P23-11–15): the live wire on a numbered plug; a wrong statement about batteries; the earth wire's job; live to earth fire risk; a written description of the three wires and the danger.

Out of scope: how ac is generated; frequency as a graph; fuses and circuit breakers (not on the page); the National Grid (later lesson); the page's cartoon skeleton is not reused.

Source boundary: supplied revision-guide page 188 (scope only); AQA 8464 Physics 6.2.3.1 and 6.2.3.2. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- "50 Hz = 50 cycles every second" is the only frequency explanation given.
- The earth wire is described as a safety wire that stops the appliance becoming live, as on the page; earthing detail beyond that is left out.
- The "switch off may still be dangerous" point is kept simple: the supply side of the wire can still have a pd.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling, generous white space. Import symbols and colours from `components/PhysicsKit.tsx` (`physicsPalette`, circuit symbols, energy-store badges). Circuit diagrams use the AQA symbols, straight wires and closed loops, ammeters in series and voltmeters across a component. Text in the SVG at least 12px; it must read on a 360px phone. Wire colours are the real ones: live brown, neutral blue, earth green and yellow stripes. Plug drawn as a soft rounded three-pin shape seen from behind (cover off), organic, not technical.

- `mains-two-types`: two small battery-and-lamp icons side by side, left "direct current (dc)" with a straight arrow, right "alternating current (ac)" with a two-headed arrow. Label under each.
- `mains-dc`: a cell with a lamp; arrows on the wire all in one direction. A small graph beside it: current against time, a flat line. Label "dc: one direction".
- `mains-ac`: a mains plug icon with a lamp; two-headed arrows on the wire. A small graph beside it: current against time, a smooth wave crossing zero. Label "ac: keeps changing direction".
- `mains-values`: a socket icon with the big labels "about 230 V" and "50 Hz" and the wave graph marked with one cycle and "50 cycles every second".
- `mains-three-core`: a cable cut open showing three insulated wires (brown, blue, green and yellow) inside a plastic sheath. Labels "plastic insulation", "three-core cable".
- `mains-live`: the plug with the brown wire highlighted and the others faded. Label "live: brown, about 230 V".
- `mains-neutral`: the plug with the blue wire highlighted. Label "neutral: blue, about 0 V, completes the circuit". A small loop arrow going in by live and out by neutral.
- `mains-earth`: the plug with the green and yellow wire highlighted. Label "earth: green and yellow, 0 V, safety wire".
- `mains-pd-live-earth`: a person-free scene: live wire drawn at "230 V" and the ground drawn at "0 V" with a double-headed pd arrow between them. Label "large pd between live and earth".
- `mains-shock`: a simple stick-style hand touching a bare live wire, with a current arrow running through the arm to the ground. Label "your body provides a link to the earth". No graphic detail.
- `mains-switch-off`: lamp circuit with an open switch, the live wire on the supply side marked "230 V" and the lamp side "0 V". Label "switch off: the wire near the supply can still have a pd".
- `mains-fire`: live wire and earth touching with wavy heat lines and a small flame icon. Label "huge current: fire risk".
- `mains-q-plug` (question, assessment view): the plug with the three wires shown in their real colours and numbered pointers: 1 blue, 2 green and yellow, 3 brown. No names, no voltages. Neutral accessible description: "A plug with three numbered wires."
