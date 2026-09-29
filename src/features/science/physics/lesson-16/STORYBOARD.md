# Physics Lesson 16 storyboard — Resistance and V = IR

Chapter P2, Electricity. Folder `physics/lesson-16`, id `P-ELE-016-P`, skill `P-OHM`, spec 6.2.1.3 and 6.2.1.4. It owns V = IR (substitution, plus one rearrangement for current), ohmic conductors, and the idea that a diode and a filament lamp change resistance. The definitions and units of current, pd and resistance come from the earlier circuit-symbols lesson and are only recalled here. Graphs of these components belong to the I–V lesson.

Big idea: pd, current and resistance are linked by V = IR. For the same battery, more resistance means less current. An ohmic conductor keeps a fixed resistance, so its current is directly proportional to its pd; a diode and a filament lamp do not.

Flow note: recall the three quantities, then the equation in words before symbols, so the units mean something. Then the calculation as two worked examples (find V, then find I with one rearrangement), each followed by near-identical guided practice with new numbers, and an independent calculation on your own. The component types come last, because "constant resistance" only makes sense once V = IR is in hand.

Sections:
1. Start here (P16-01): adding a resistor lowers the current.
2. What links pd, current and resistance? (P16-02–04): three quantities → word equation → symbols and units → more resistance, less current. Checks: the word equation; effect of more resistance.
3. How do you use V = IR? (P16-05–07): choose the equation → substitute (4.0 Ω, 3.0 A = 12 V) → rearrange for I → second worked example (12 V, 6.0 Ω = 2.0 A). Checks: V from 2.5 A and 6.0 Ω; I from 9.0 V and 3.0 Ω.
4. Which components keep the same resistance? (P16-08–10): ohmic conductors → direct proportion → diode → filament lamp. Checks: which is ohmic; reversing a diode.
5. On your own (P16-11–15): units (recall), an independent current calculation with a circuit picture, doubling the pd, why the lamp's resistance rises, and a written comparison.

Out of scope: rearranging for R (found again in the I–V lesson as R = V ÷ I at a point), I–V graphs, series and parallel rules, power calculations, semiconductor detail of diodes.

Source boundary: supplied revision-guide page 181 (scope only); AQA 8464 Physics 6.2.1.3 and 6.2.1.4. All wording, numbers and examples are original. Draft pending teacher review.

Judgement calls for the teacher:
- Only I is made the subject of the equation, as the page's example does. R = V ÷ I is met in the next two lessons.
- "Directly proportional" is explained by "double the pd, double the current" and not defined further.
- The filament lamp explanation stays at "hotter wire, more resistance", with no particle detail.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling. Circuits use PhysicsKit symbols, straight wires, closed loops. Text in the SVG ≥ 12px.

- `ohm-three`: three rounded cards in a row. "Potential difference (V), volts: the push" with a small battery; "Current (I), amperes: the flow" with a row of charge dots moving; "Resistance (R), ohms: slows the flow" with a resistor.
- `ohm-words`: a big word equation card "potential difference = current × resistance", each word tinted to match its card in `ohm-three`.
- `ohm-symbols`: the same card with symbols "V = I × R" above the words, and units in small tags below: V (volts), I (amperes, A), R (ohms, Ω).
- `ohm-more-r`: two identical simple circuits (same battery) one above the other. Top: one resistor, a fat arrow of current labelled "bigger current". Bottom: two resistors in series, a thin arrow "smaller current". Caption "same battery".
- Section 3 frames share one drawing: a circuit with a battery and a resistor and an equation card beside it, the step highlighted.
- `ohm-wk1-eq`: circuit with battery (V ?), resistor 4.0 Ω, ammeter 3.0 A; the equation card shows "V = I × R" highlighted.
- `ohm-wk1-sub`: same circuit; card "V = 3.0 × 4.0 = 12 V".
- `ohm-rearrange`: the equation V = IR with "÷ R" arrows on both sides leading to "I = V ÷ R" (a simple two-line balance picture, no formula triangle).
- `ohm-wk2`: circuit with 12 V battery, 6.0 Ω resistor, ammeter reading shown as "?"; card "I = 12 ÷ 6.0 = 2.0 A".
- `ohm-ohmic`: a fixed resistor and a piece of wire side by side, tag "ohmic conductor: resistance stays the same", note "at a fixed temperature".
- `ohm-prop`: two small circuits or two meter faces: 2 V gives 0.5 A, 4 V gives 1.0 A, with "×2" arrows joining the pd and current values.
- `ohm-diode`: diode symbol with a green arrow "current flows easily" through it, and the same diode turned round with a red arrow blocked "very high resistance".
- `ohm-lamp`: filament lamp symbol beside a drawn bulb with a glowing coiled filament; a thermometer-style arrow "hotter as current rises" and "resistance rises".
- `ohm-q-circuit` (question, assessment view): closed circuit with a 24 V battery, an 8.0 Ω resistor and an ammeter labelled "A" with no reading. No equation shown. Neutral description: "A circuit with a battery, a resistor and an ammeter."
