import type { TeachingFrame } from '../../teachingFrame'

// What a series circuit is, the three rules (current, pd, resistance) with the reason resistance adds, then a worked calculation and cells in series.
// Parallel circuits are the next lesson; voltmeters are mentioned only as the exception.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const seriesFrames: Record<string, TeachingFrame[]> = {
  'P20-02': [
    f('One big loop', 'In a series circuit the components are connected one after another in a line, in a single loop.', 'one loop, one path', 'In a series circuit, the components are all connected in a line, one after another, between the ends of the power supply. That makes one big loop. The charge has only one path to follow.', 'series-loop'),
    f('Take one away', 'If you remove one component, the circuit is broken. So all the components stop working.', 'a gap stops everything', 'Remove one component from a series circuit and the loop has a gap in it. The circuit is broken. So all the components stop working, not just the one you took out.', 'series-break'),
    f('Voltmeters are the exception', 'Voltmeters are always connected in parallel. They do not count as part of the series circuit.', 'voltmeters sit on the side', 'Voltmeters are the one exception. They are always connected in parallel, across a component. So they do not count as part of the series circuit.', 'series-voltmeter'),
    f('Why series is not used much', 'Very few things are connected in series, because one broken part stops everything. Series circuits are useful for measuring and testing.', 'handy for testing', 'In everyday life, very few things are connected in series. If one part breaks, everything stops. But series circuits are useful for measuring and testing components, like the test circuits used in the practicals.', 'series-uses'),
  ],
  'P20-05': [
    f('The current is the same everywhere', 'The same current flows through all the components: I₁ = I₂ = …', 'same current everywhere', 'In a single closed loop, the current has the same value everywhere. So an ammeter placed anywhere in a series circuit gives the same reading. In symbols, I₁ = I₂ and so on.', 'series-current'),
    f('The pd is shared', 'The total pd of the supply is shared between the components: V total = V₁ + V₂ + …', 'add the pds to get the supply', 'The total potential difference of the supply is shared between all the components. If you add up the pd across each component, you get the pd of the power supply. In symbols, V total = V₁ + V₂ + …', 'series-pd'),
    f('The resistances add up', 'The total resistance is the sum of the resistances of all the components: R total = R₁ + R₂ + …', 'add the resistances', 'The total resistance of a series circuit is the sum of the resistances of all the components. In symbols, R total = R₁ + R₂ and so on. For example, a 2 Ω resistor and a 3 Ω resistor in series have a total of 5 Ω.', 'series-resistance'),
    f('Why more resistors mean less current', 'Adding a resistor raises the total resistance, so the total current goes down. A bigger resistance takes a bigger share of the pd.', 'more resistance, less current', 'Adding another resistor in series makes the total resistance go up. The total current in the circuit then goes down. The pd is shared out, and the bigger a component’s resistance, the bigger its share of the total pd.', 'series-why'),
  ],
  'P20-09': [
    f('Worked example: total resistance', 'A 4.0 Ω and an 8.0 Ω resistor in series with a 24 V battery. Total resistance = 4.0 + 8.0 = 12 Ω.', 'add the resistors first', 'Here is a worked example. A 4.0 Ω resistor and an 8.0 Ω resistor are in series with a 24 V battery. We want the current. First find the total resistance by adding: R total = 4.0 + 8.0 = 12 Ω.', 'series-wk-total'),
    f('Write the equation for current', 'V = IR rearranged for current is I = V ÷ R. Use the total resistance and the battery pd.', 'I = V ÷ R', 'Now choose the equation. V = IR rearranged for the current is I = V ÷ R. We use the pd of the battery and the total resistance of the circuit.', 'series-wk-eq'),
    f('Substitute', 'I = 24 ÷ 12 = 2.0 A.', 'numbers in, unit amperes', 'Substitute the numbers. I = V ÷ R = 24 ÷ 12. That equals 2.0. The unit is amperes, so the current is 2.0 A, and it is the same everywhere in the loop.', 'series-wk-sub'),
    f('Cells in series', 'Cells connected in series the same way add their pds. Two 1.5 V cells supply 3.0 V.', 'add the cell pds', 'A cell is a source of potential difference. When cells are connected in series, facing the same way, their pds add up. For example, two 1.5 V cells in series supply 3.0 V between them.', 'series-cells'),
  ],
}
