import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: percentage change. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsPercentFrames: Record<string, TeachingFrame[]> = {
  'W22-02': [
    f('Compare change fairly', 'When two things start at different values, compare their percentage changes, not the plain changes.', 'different starting values', 'Sometimes you need to compare results that did not have the same starting value. For example, two potato cylinders may start with different masses. A gain of 2 g means more to a small cylinder than to a big one. So compare the percentage change.', 'wspercent-why'),
    f('The equation', 'Percentage change = (final value − original value) ÷ original value × 100.', 'change ÷ original × 100', 'Work out the change first: final value − original value. Divide it by the original value. Then multiply by 100. Written as an equation: percentage change = (final value − original value) ÷ original value × 100.', 'wspercent-equation'),
    f('Which value is which?', 'The original value is the value at the start. The final value is the value at the end.', 'start and end', 'The original value is the one you measured at the start, for example the mass before an investigation. The final value is the one you measured at the end. Always divide by the original value.', 'wspercent-original'),
  ],
  'W22-06': [
    f('Positive means an increase', 'A positive percentage change means the value has increased.', 'plus means up', 'If the final value is bigger than the original value, the change is positive. A positive percentage change means the value has increased. For example, +25% means it went up by a quarter of its starting value.', 'wspercent-positive'),
    f('Negative means a decrease', 'A negative percentage change means the value has decreased.', 'minus means down', 'If the final value is smaller than the original value, the change is negative. A negative percentage change means the value has decreased. Keep the minus sign in your answer. It tells the reader the value went down.', 'wspercent-negative'),
  ],
  'W22-10': [
    f('Percentages let you compare', 'Work out the percentage change for each one, then compare the two percentages.', 'one percentage each', 'You met potato cylinders in sugar solutions when you learned about osmosis. Work out the percentage change for each cylinder. Then compare the two percentages. The larger percentage change is the bigger change compared with the starting mass.', 'wspercent-compare'),
    f('A bigger gain is not always a bigger percentage', 'A cylinder with a larger gain in grams can still have a smaller percentage change.', 'big start, small percent', 'A bigger gain in grams does not always mean a bigger percentage change. If the cylinder started with a large mass, the same gain is a smaller fraction of it. This is why percentages are fairer.', 'wspercent-fair'),
  ],
}
