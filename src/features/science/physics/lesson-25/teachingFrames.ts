import type { TeachingFrame } from '../../teachingFrame'

// E = QV, P = VI and P = I²R: substitution only, each shown once as a worked example then practised with new numbers.
// No rearranging (no square roots). Power in watts and E = P × t come from the two earlier Power lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const chargeEnergyFrames: Record<string, TeachingFrame[]> = {
  'P25-02': [
    f('Charge carries energy', 'As charge moves around a circuit, energy is transferred to or from it.', 'charge carries energy', 'Charge is carried around a circuit by the current. A cell or battery transfers energy to the charge. Then the charge transfers that energy to the components it passes through, such as a lamp or a motor.', 'qv-carries'),
    f('What potential difference tells you', 'Potential difference is the energy transferred for each coulomb of charge that passes.', 'energy per charge', 'The energy transferred by a component depends on two things. One is how much charge flows through it. The other is the potential difference across it. A larger pd means more energy is transferred for each coulomb of charge.', 'qv-pd-meaning'),
    f('The equation E = QV', 'Energy transferred = charge flow × potential difference. In symbols E = Q × V, in joules, coulombs and volts.', 'joules, coulombs, volts', 'The word equation is: energy transferred = charge flow × potential difference. In symbols this is E = Q × V. Energy E is in joules, charge Q is in coulombs and pd V is in volts.', 'qv-equation'),
    f('Worked example', 'A 6.0 V torch battery passes 50 C of charge. E = Q × V = 50 × 6.0 = 300 J.', 'plug the numbers straight in', 'A 6.0 V torch battery passes 50 C of charge through the bulb. No unit conversion is needed here. E = Q × V. E = 50 × 6.0. E = 300 J. So 300 joules of energy are transferred.', 'qv-worked'),
  ],
  'P25-05': [
    f('Power again', 'Power is the energy transferred each second. It also depends on the current and the pd.', 'power in watts', 'You know that power is the energy transferred each second. The power of an appliance can also be found from its current and the pd across it. This is useful because a current and a pd are easy to measure with meters.', 'qv-power-again'),
    f('The equation P = VI', 'Power = potential difference × current. In symbols P = V × I, in watts, volts and amperes.', 'watts, volts, amps', 'The word equation is: power = potential difference × current. In symbols this is P = V × I. Power P is in watts, pd V is in volts and current I is in amperes.', 'qv-pvi-equation'),
    f('Worked example', 'A hairdryer has 230 V across it and a current of 5.0 A. P = V × I = 230 × 5.0 = 1150 W.', 'multiply pd by current', 'A hairdryer has 230 V across it and a current of 5.0 A flows through it. P = V × I. P = 230 × 5.0. P = 1150 W. The hairdryer transfers 1150 joules each second.', 'qv-pvi-worked'),
    f('Bigger pd or bigger current', 'A larger pd or a larger current means a larger power.', 'either one raises the power', 'The equation shows that power goes up if the pd goes up. It also goes up if the current goes up. So two appliances with the same pd, but different currents, have different powers. The one with the larger current has the larger power.', 'qv-pvi-compare'),
  ],
  'P25-08': [
    f('When you do not know the pd', 'If you know the current and the resistance but not the pd, you can still find the power.', 'current and resistance known', 'Sometimes you know the current through an appliance and its resistance, but you do not know the pd. You can still find the power. There is another equation for that case.', 'qv-no-pd'),
    f('The equation P = I²R', 'Power = current squared × resistance. In symbols P = I² × R, in watts, amperes and ohms.', 'current squared', 'The word equation is: power = current squared × resistance. In symbols this is P = I² × R. Power P is in watts, current I is in amperes and resistance R is in ohms.', 'qv-i2r-equation'),
    f('What squared means', 'Current squared means the current multiplied by itself. 3.0 squared is 3.0 × 3.0 = 9.0.', 'multiply it by itself', 'Squared means multiplied by itself. So I² is I × I. For a current of 3.0 A, I² = 3.0 × 3.0 = 9.0. Do the squaring first, and then multiply by the resistance.', 'qv-squared'),
    f('Worked example', 'A heater has a current of 3.0 A and a resistance of 4.0 Ω. P = I² × R = 9.0 × 4.0 = 36 W.', 'square first, then multiply', 'A heating element has a current of 3.0 A through it and a resistance of 4.0 Ω. Step 1: I² = 3.0 × 3.0 = 9.0. Step 2: P = I² × R = 9.0 × 4.0 = 36 W. So the element has a power of 36 W.', 'qv-i2r-worked'),
  ],
}
