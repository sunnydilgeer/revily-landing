import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: random sampling. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsSampleFrames: Record<string, TeachingFrame[]> = {
  'W21-02': [
    f('A population is too big to study all of it', 'A population is all the members of one type in an area. It is usually too big to study every single one.', 'too many to count', 'A population is all the living things of one type in an area, such as all the daisies in a field. It is usually not possible to study every single one. You would never finish counting.', 'wssample-population'),
    f('Take a sample', 'A sample is a small part of the population that you study instead.', 'a small part', 'Instead, you take a sample. A sample is a small part of the population. You study the sample and use it to draw conclusions about the whole population.', 'wssample-sample'),
    f('A good sample represents the population', 'A sample must accurately represent the whole population, or your conclusions will be wrong.', 'a fair picture', 'Your sample needs to accurately represent the whole population. If it does not, your conclusions about the whole population will not be reliable. A bigger sample usually gives a better picture.', 'wssample-represent'),
    f('Choose the sample at random', 'Random means every member has the same chance of being chosen. It helps make a sample fair.', 'no choosing by hand', 'To help make the sample fair, choose it at random. This means every member of the population has the same chance of being picked. You do not choose the easy or interesting ones.', 'wssample-random'),
  ],
  'W21-05': [
    f('Divide the field into a grid', 'Split the field into a grid, and number the sides from 1 up to the end.', 'a grid of squares', 'You met quadrats when you learned about ecology. To sample plants at random, first divide the field into a grid. Label the grid along the bottom and up the side with numbers.', 'wssample-grid'),
    f('Pick random coordinates', 'Use a random number generator to choose a pair of numbers, such as (2, 7).', 'numbers from a generator', 'Use a random number generator, for example on a calculator or computer, to pick coordinates. Each pair of numbers, such as (2, 7), points to one square in the grid.', 'wssample-coords'),
    f('Place the quadrats and count', 'Put a quadrat at each pair of coordinates. Count the plants in it to take your sample.', 'quadrat at each pair', 'Place a quadrat at each pair of coordinates. Count the plants inside it. Each quadrat is one sample from the field. Then find the mean of your quadrats.', 'wssample-place'),
    f('Non-random sampling is biased', 'Sampling only one corner, or the easy patch, gives a biased sample that does not represent the whole field.', 'one corner only', 'If you only sample one corner, or only the patches that look best, your sample is biased. It does not represent the whole field. Random squares from all over the grid give a fairer picture.', 'wssample-bias'),
  ],
  'W21-08': [
    f('Sampling people', 'Health scientists also need a random sample, because they cannot study every person.', 'people, not plants', 'Scientists studying health in a country cannot test everybody. They take a random sample of people. The same rule applies as for plants in a field: everyone must have an equal chance of being chosen.', 'wssample-people'),
    f('Use the records', 'Records list the whole population. Give every person a number.', 'a list, then numbers', 'Suppose hospital records list everybody with a condition. Give each person a number, starting from 1. This list is the whole population you are interested in.', 'wssample-records'),
    f('Pick the sample group', 'A random number generator picks numbers, and the people with those numbers form the sample group.', 'generator picks the group', 'A random number generator then chooses numbers, such as 72, 11 and 193. The people with those numbers form your sample group. You did not choose them, so the group is not biased.', 'wssample-generator'),
    f('Use the sample to estimate', 'Find the proportion of the sample with a feature. Use it to estimate the proportion in the whole population.', 'sample tells you about everyone', 'Look at the records of the sample group. Work out the proportion who have a second condition. This gives an estimate for the whole population. The estimate is only as good as the sample is random.', 'wssample-estimate'),
  ],
}
