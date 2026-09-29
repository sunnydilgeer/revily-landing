import type { TeachingFrame } from '../../teachingFrame'

// Three linked quantities, the word equation and symbols, two worked examples (find V, then find I), ohmic and non-ohmic components.
// Graphs of these components belong to the I–V lesson; only the idea of changing resistance is taught here.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const ohmFrames: Record<string, TeachingFrame[]> = {
  'P16-02': [
    f('Three linked quantities', 'Potential difference pushes charge round, current is the flow of charge, and resistance slows the flow.', 'push, flow, slow down', 'Three quantities work together in every circuit. Potential difference is the push that drives charge round. Current is the flow of charge. Resistance is anything that slows the flow down.', 'ohm-three'),
    f('The word equation', 'Potential difference = current × resistance. A bigger current or a bigger resistance means a bigger potential difference.', 'pd = current × resistance', 'One equation links the three quantities. In words it says: potential difference = current × resistance. You can use it for any component in a circuit.', 'ohm-words'),
    f('Symbols and units', 'V = I × R, usually written V = IR. V is in volts (V), I in amperes (A) and R in ohms (Ω).', 'V, I, R and their units', 'In symbols the equation is V = I × R, which is usually written V = IR. V is the potential difference, measured in volts, V. I is the current, in amperes, A. R is the resistance, in ohms. The ohm has its own symbol, Ω.', 'ohm-symbols'),
    f('More resistance, less current', 'With the same battery, the greater the resistance, the smaller the current.', 'bigger resistance, smaller current', 'Keep the same battery, so the potential difference stays the same. If you add more resistance, the current goes down. The greater the resistance, the smaller the current.', 'ohm-more-r'),
  ],
  'P16-05': [
    f('Worked example: choose the equation', 'A 4.0 Ω resistor carries a current of 3.0 A. Find the potential difference. Start with V = IR.', 'write the equation first', 'Here is a first worked example. A resistor of 4.0 Ω carries a current of 3.0 A. What is the potential difference across it? We want V, and V = IR already has V on its own. So we write the equation down first.', 'ohm-wk1-eq'),
    f('Substitute and give units', 'V = 3.0 × 4.0 = 12 V. Put in the numbers, work it out and write the unit.', 'numbers in, answer with unit', 'Now substitute the numbers. V = I × R = 3.0 × 4.0. That equals 12. The unit for potential difference is volts, so the answer is 12 V.', 'ohm-wk1-sub'),
    f('Rearrange to find the current', 'Sometimes you need I. Divide both sides of V = IR by R to get I = V ÷ R.', 'divide both sides by R', 'Sometimes you know the potential difference and the resistance, and you need the current. Divide both sides of V = IR by R. This gives a new form of the equation: I = V ÷ R.', 'ohm-rearrange'),
    f('Worked example: find the current', 'A 12 V battery across a 6.0 Ω resistor: I = 12 ÷ 6.0 = 2.0 A.', 'V ÷ R, unit amperes', 'A second worked example. A 12 V battery is connected across a 6.0 Ω resistor. Use I = V ÷ R = 12 ÷ 6.0. That equals 2.0. Current is measured in amperes, so the answer is 2.0 A.', 'ohm-wk2'),
  ],
  'P16-08': [
    f('Ohmic conductors', 'Some components keep the same resistance. They are called ohmic conductors. Wires and resistors at a fixed temperature are examples.', 'resistance does not change', 'Some components have a resistance that stays the same, however much current flows. They are called ohmic conductors. Wires and resistors are examples, as long as their temperature stays fixed.', 'ohm-ohmic'),
    f('Directly proportional', 'For an ohmic conductor, if the pd doubles the current doubles too.', 'double the pd, double the current', 'For an ohmic conductor at a fixed temperature, the current is directly proportional to the potential difference. So if the potential difference doubles, the current doubles too. This follows from V = IR when R stays the same.', 'ohm-prop'),
    f('A diode', 'A diode lets current through in one direction only. In the other direction its resistance is very high.', 'one-way component', 'Not every component is ohmic. A diode has a resistance that depends on the direction of the current. It lets current flow easily one way. If the current is reversed, its resistance is very high.', 'ohm-diode'),
    f('A filament lamp', 'The thin wire in a filament lamp heats up as the current increases. A hotter wire has more resistance.', 'hotter wire, more resistance', 'A filament lamp has a thin wire inside called a filament. The filament is designed to heat up and glow when current flows. As the temperature rises, the resistance rises. So a filament lamp is not an ohmic conductor.', 'ohm-lamp'),
  ],
}
