import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: collecting data. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsCollectFrames: Record<string, TeachingFrame[]> = {
  'W5-02': [
    f('Sample size', 'Sample size is the number of measurements or observations you make.', 'how many', 'The sample size is the number of observations or measurements in your investigation. It could be 30 daisies in a field, or 6 different concentrations of acid. It is how many things you looked at.', 'wscollect-samplesize'),
    f('Bigger is better', 'A bigger sample reduces the chance that a few odd results change your conclusion.', 'odd results matter less', 'A bigger sample makes it less likely that one or two odd results will mislead you. Imagine measuring the heights of only three students. One very tall student would change your answer a lot. Among a hundred students, one tall student hardly matters.', 'wscollect-bigger'),
    f('Be realistic', 'A sample must be practical to collect, and it should represent the whole population.', 'practical and fair to everyone', 'Scientists must be realistic. Testing every person in a city would take too long and cost too much. Instead they pick a smaller sample, such as 1000 people. A sample is representative if it includes a range of ages, genders and backgrounds, like the whole population.', 'wscollect-representative'),
  ],
  'W5-05': [
    f('Precise results', 'Precise results are close together. They are not spread out.', 'close together', 'Precise results are all very close to each other when you repeat a measurement. Precise means the results are not spread out. They are close to their own mean, but that does not mean they are correct.', 'wscollect-precise'),
    f('Accurate results', 'Accurate results are close to the true value.', 'close to the truth', 'Accurate results are close to the true answer. Suppose a block really has a mass of 50.0 g. Readings of 50.1 g, 49.9 g and 50.0 g are accurate. Readings of 52.0 g, 52.1 g and 51.9 g are precise, but not accurate.', 'wscollect-accurate'),
    f('Comparing three students', 'Look at how far the readings are from the true value and from each other.', 'spread and distance from the truth', 'The table shows three students weighing the same block of true mass 50.0 g. Student A is both precise and accurate. Student B is precise but not accurate. Student C has spread-out readings, so is not precise.', 'wscollect-table'),
    f('Accuracy depends on method', 'Some methods are more accurate than others. A gas syringe is better than counting bubbles.', 'a better method', 'How accurate your results are often depends on your method. Counting bubbles of gas is not very accurate. You might miss some, and the bubbles can be different sizes. Measuring the gas volume with a gas syringe is more accurate.', 'wscollect-method'),
    f('Right equipment for the job', 'Set up the equipment properly, and use equipment that is sensitive enough.', 'set up and sensitivity', 'First, set up the equipment properly. For example, check that a balance reads zero before you weigh anything. Second, use equipment that is sensitive enough. To measure 11 cm³ of a liquid, use a measuring cylinder with 1 cm³ steps, not one with steps of 10 cm³.', 'wscollect-equipment'),
  ],
  'W5-09': [
    f('Systematic errors', 'A systematic error makes every measurement wrong by the same amount.', 'same mistake every time', 'A systematic error makes every reading wrong by the same amount, in the same direction. For example, a balance that reads 2 g when empty makes every mass 2 g too high. If you know about it, you may be able to correct it.', 'wscollect-systematic'),
    f('Random errors', 'Random errors make repeat readings vary a little.', 'small differences each time', 'Random errors are small mistakes that change from one reading to the next. Examples are pressing a stopwatch a little early or late. They make your repeat readings vary a little.', 'wscollect-random'),
    f('Reduce random errors', 'Take repeat readings and find the mean to reduce the effect of random errors.', 'repeat, then mean', 'You can reduce the effect of random errors by repeating your readings. Then calculate the mean. Some readings will be a little too high and some a little too low, so they partly cancel out.', 'wscollect-reduce'),
    f('Anomalous results', 'An anomalous result does not fit the pattern. Find its cause, then ignore it when processing.', 'the odd one out', 'An anomalous result is one that does not fit in with the rest. Try to find out what caused it, such as a misread scale. Once you know it is anomalous, you can ignore it when you process your results.', 'wscollect-anomalous'),
  ],
}
