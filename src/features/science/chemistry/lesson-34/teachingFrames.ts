import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section. The cross method first (why the mixture goes cloudy, how it is timed, why it is subjective),
// then results and the concentration trend, then fair, safe and repeatable.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const crossFrames: Record<string, TeachingFrame[]> = {
  'C34-02': [
    f('A solid appears', 'Some reactions between clear solutions make a solid, which turns the mixture cloudy.', 'clear liquids, cloudy result', 'Sodium thiosulfate solution and hydrochloric acid are both colourless. When they are mixed, they make a yellow solid, sulfur. A solid made in a solution is called a precipitate. It makes the liquid go cloudy.', 'cross-cloudy'),
    f('The cross', 'Stand the flask on a black cross. Add the acid and start the stopwatch.', 'watch the cross through the liquid', 'Put a set volume of sodium thiosulfate in a conical flask. Stand it on a piece of paper with a black cross. Add the acid and start the stopwatch at once. Look down through the liquid from above.', 'cross-set'),
    f('Timing the disappearance', 'Stop the stopwatch when the cross can no longer be seen.', 'the cloudier it gets, the harder to see', 'As more precipitate forms, the liquid gets cloudier. Stop the stopwatch when you can no longer see the cross. The faster the cross disappears, the quicker the reaction.', 'cross-time'),
    f('Your judgement', 'People may disagree on exactly when the cross has gone, so the results are subjective.', 'no single right answer', 'Different people may not agree on the exact moment the cross vanishes. Results like this are called subjective, because they depend on a person’s judgement. It helps if the same person judges every time.', 'cross-subjective'),
  ],
  'C34-05': [
    f('Only one change', 'To test concentration, change only the concentration of the acid and keep everything else the same.', 'fair test: one change', 'Repeat the experiment with different concentrations of hydrochloric acid. Keep the volumes of the solutions, the temperature and the size of the flask the same. Then any change in the time is caused by the concentration.', 'cross-fair'),
    f('A table of results', 'Write down the time for the cross to disappear at each concentration.', 'time is the measurement', 'For each concentration, record how long the cross takes to disappear. Here are some example results. Acid of 18 g/dm³ took 193 s. Acid of 90 g/dm³ took 164 s.', 'cross-table'),
    f('Higher concentration, less time', 'The higher the concentration, the faster the reaction, so the less time the cross takes to vanish.', 'faster reaction = shorter time', 'The times get shorter as the concentration goes up. A shorter time means a faster reaction. So the higher the concentration, the faster the reaction. You can also keep the acid the same and change the thiosulfate concentration.', 'cross-trend'),
  ],
  'C34-08': [
    f('Keep the conditions the same', 'Use the same volumes, temperature and flask each time.', 'the same every time except one', 'Measure each solution with the same care. Use the same size of flask, the same volumes and the same temperature. Use the same cross and the same lighting.', 'cross-same'),
    f('A gas to watch out for', 'This reaction also gives off sulfur dioxide, so do it in a well-ventilated place.', 'a harmful gas is made', 'The reaction also releases sulfur dioxide gas. This gas can irritate the lungs, especially for people with asthma. So the experiment must be done in a well-ventilated place. Wear safety goggles, and follow your teacher’s instructions.', 'cross-safe'),
    f('Repeat and compare', 'Repeating the timing and having the same person judge makes the results more reliable.', 'same judge, same method', 'Repeat the timing for each concentration if you can, and compare your results. Ask the same person to judge every time. This cuts down the effect of different opinions on when the cross has gone.', 'cross-repeat'),
  ],
}
