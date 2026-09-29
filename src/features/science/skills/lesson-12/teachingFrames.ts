import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: uncertainty and evaluations. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsEvalFrames: Record<string, TeachingFrame[]> = {
  'W12-02': [
    f('Measurements are never perfect', 'Uncertainty is the amount of error your measurements might have.', 'a little bit off', 'No measurement is completely perfect. Random errors change your readings a little, such as a slightly late stopwatch click. The equipment also has limits, such as a ruler marked only in millimetres. The amount of error your measurements might have is called the uncertainty.', 'wseval-error'),
    f('First find the range', 'The range is the largest value minus the smallest value.', 'biggest take smallest', 'To find the uncertainty of a mean, first find the range. You met this when you processed data. Suppose a trolley takes 4.2 s, 4.0 s and 4.4 s on three runs. The mean is 4.2 s. The range is 4.4 − 4.0 = 0.4 s.', 'wseval-range'),
    f('Uncertainty is range ÷ 2', 'Uncertainty of the mean = range ÷ 2.', 'halve the range', 'Now use the equation: uncertainty = range ÷ 2. For the trolley, the range is 0.4 s. So the uncertainty is 0.4 ÷ 2 = 0.2 s. Work out the range first, then halve it.', 'wseval-unc'),
    f('Writing it with ±', 'Write the mean, then ± and the uncertainty. Less precise results have a larger uncertainty.', 'mean plus or minus', 'Uncertainty is written with the ± symbol. The trolley time is 4.2 ± 0.2 s. This means the true value is probably between 4.0 s and 4.4 s. The less precise your results are, the higher the uncertainty will be.', 'wseval-plusminus'),
  ],
  'W12-05': [
    f('Accurate and precise', 'Accurate results are close to the true value. Precise results are close together.', 'target and spread', 'To judge the quality of results, ask two questions. Are they accurate? Accurate results are close to the true value. Are they precise? Precise results are close together when you repeat the measurement. Results can be precise without being accurate.', 'wseval-accurate'),
    f('Anomalous results', 'An anomalous result does not fit the pattern. Say so, and try to explain it.', 'the odd one out', 'An anomalous result is one that does not fit the pattern. Look for these in your results. If there are none, say so. If there are some, try to explain them. Perhaps you timed too early or misread the scale.', 'wseval-anomaly'),
    f('Enough evidence?', 'Ask if there was enough evidence for a valid conclusion, and comment on the uncertainty.', 'enough to be sure', 'You should also comment on whether there was enough evidence to reach a valid conclusion. Two or three readings are weaker than many. Finally, comment on the level of uncertainty in your results. Repeats that agree closely give a small uncertainty.', 'wseval-evidence'),
  ],
  'W12-08': [
    f('Look back at the method', 'In an evaluation, comment on whether the method was valid and the test was fair.', 'was it fair?', 'An evaluation looks back over the whole investigation. First comment on the method. Was it valid? Did you control the other variables to make it a fair test? Name any variable that slipped, such as a room that warmed up during the test.', 'wseval-method'),
    f('How confident are you?', 'Use the quality of the method and the results to say how confident you are in the conclusion.', 'how sure am I?', 'Now put it together. Think about the method, the anomalous results and the uncertainty. This lets you say how confident you are that your conclusion is right. A fair test with close repeats gives you more confidence.', 'wseval-confidence'),
    f('Suggest improvements', 'Suggest changes to the method that would improve the results, such as narrower intervals.', 'a better next time', 'Then suggest changes that would improve the quality of the results. Suppose a reaction is fastest at 1.0 mol/dm³ when you tested 0.5, 1.0 and 1.5 mol/dm³. Testing 0.8, 0.9, 1.0, 1.1 and 1.2 mol/dm³ would give a more accurate answer.', 'wseval-improve'),
    f('Predict and test again', 'You can make new predictions from your conclusion and test them with further experiments.', 'what next?', 'Your conclusion can also lead to new predictions. For example, you could predict that another acid behaves in the same way. You could then carry out further experiments to test the new prediction.', 'wseval-predict'),
  ],
}
