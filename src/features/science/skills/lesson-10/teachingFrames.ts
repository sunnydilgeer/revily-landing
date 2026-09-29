import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: maths skills for science. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsMathsFrames: Record<string, TeachingFrame[]> = {
  'W10-02': [
    f('Very big numbers', 'Standard form writes a big number as a number between 1 and 10, times a power of ten.', 'count the places moved', 'Scientists often use numbers that are huge or tiny. Standard form makes them short. Take 6 000 000 J. Move the decimal point 6 places to the left to get 6. So 6 000 000 J is 6 × 10⁶ J.', 'wsmaths-big'),
    f('Very small numbers', 'For a number smaller than 1 the power of ten is negative.', 'small number, negative power', 'A tiny number needs a negative power. Take 0.00045 m, the width of a cell. Move the decimal point 4 places to the right to get 4.5. So 0.00045 m is 4.5 × 10⁻⁴ m.', 'wsmaths-small'),
    f('The pattern A × 10ⁿ', 'A is between 1 and 10, but not 10 itself. The power n counts the places the point moves.', 'A × 10 to the power n', 'Standard form always looks like A × 10ⁿ. A is at least 1 and less than 10. The power n is positive for numbers bigger than 10 and negative for numbers smaller than 1. So 45 × 10³ is not in standard form.', 'wsmaths-form'),
    f('Going back again', 'To write a standard form number in full, move the decimal point the other way.', 'undo the move', 'You can also go back. Take 7.2 × 10³. A positive power of 3 means move the point 3 places to the right. That gives 7200. For 3 × 10⁻² a negative power means move the point 2 places to the left. That gives 0.03.', 'wsmaths-back'),
  ],
  'W10-05': [
    f('Do the same to both sides', 'Rearranging means getting the quantity you want on its own. Do the same to both sides.', 'keep it balanced', 'Sometimes a formula gives you the wrong quantity. You may need to rearrange it. This means getting the quantity you want on its own. Whatever you do to one side of the equals sign, you must do to the other. This keeps the formula balanced.', 'wsmaths-balance'),
    f('A first example', 'Divide both sides to move a multiplied quantity away.', 'undo with the opposite', 'Take distance = speed × time, or s = v × t. Suppose you want the speed v. Time is multiplying v, so divide both sides by t. This gives s ÷ t = v. So v = s ÷ t. You met this when you worked out speed in Physics.', 'wsmaths-divide'),
    f('A worked example with a fraction', 'Multiply to remove a fraction, then divide to get the quantity on its own.', 'multiply, then divide', 'Kinetic energy is Ek = ½ × m × v². Find m when Ek = 16 J and v = 4 m/s. Multiply both sides by 2: 2 × Ek = m × v². Divide both sides by v²: m = 2 × Ek ÷ v². So m = 2 × 16 ÷ 16 = 2 kg.', 'wsmaths-fraction'),
    f('Formula triangles', 'A formula triangle helps with simple formulas. Cover the quantity you want.', 'cover it up', 'For simple formulas you can use a formula triangle. Cover up the quantity you want to find. What is left shows how to work it out. For example, cover s in the s, v, t triangle and you see v × t. Learn to rearrange properly too, because bigger formulas do not fit in triangles.', 'wsmaths-triangle'),
  ],
  'W10-08': [
    f('Brackets on the calculator', 'Type a fraction with brackets around the top, or your calculator will divide the wrong number.', 'brackets around the top', 'Your calculator follows the order of operations. Take (11.5 + 6.8) ÷ 3, which is 18.3 ÷ 3 = 6.1. If you type 11.5 + 6.8 ÷ 3 it divides only the 6.8. You would get 13.77 instead. Always put brackets around the top of a fraction. You can also use the fraction button.', 'wsmaths-brackets'),
    f('Keep the exact value', 'Use the full value from your calculator in the next step. Round only at the end.', 'do not round early', 'A calculation often has several steps. Use the exact value from the step before, not a rounded one. Rounding early can make the final answer wrong. Most calculators have an Ans button that holds the last answer. Round only the final answer.', 'wsmaths-ans'),
  ],
  'W10-10': [
    f('Direct proportion', 'In direct proportion, if one variable doubles then the other doubles too.', 'both go up together', 'Two variables can be related by proportion. In direct proportion, when one increases the other increases in the same ratio. Double one and the other doubles too. A graph of these is a straight line through the origin. The stretch of a spring is directly proportional to the force pulling it, up to a limit.', 'wsmaths-direct'),
    f('Inverse proportion', 'In inverse proportion, if one variable doubles then the other halves.', 'one up, one down', 'In inverse proportion, when one variable increases the other decreases in the same ratio. Double one and the other halves. Take a journey of 60 km. At double the speed the journey takes half the time. Speed and time are inversely proportional.', 'wsmaths-inverse'),
    f('The proportional symbol', 'The symbol ∝ means is proportional to. Direct is A ∝ B and inverse is A ∝ 1 ÷ B.', 'the symbol ∝', 'The symbol ∝ means is proportional to. For direct proportion write A ∝ B. For inverse proportion write A ∝ 1 ÷ B. In a table, check how the numbers change. If B doubles and A doubles, it is direct. If B doubles and A halves, it is inverse.', 'wsmaths-symbol'),
  ],
}
