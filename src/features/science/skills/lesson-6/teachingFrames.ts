import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: processing data. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsProcessFrames: Record<string, TeachingFrame[]> = {
  'W6-02': [
    f('Draw a neat table', 'Draw tables with a ruler. Every column needs a heading.', 'ruler and headings', 'A table is a tidy way to organise your results. Draw it with a ruler. Give every column a heading so that anyone can tell what the numbers mean.', 'wsprocess-table'),
    f('Put the units in the heading', 'Write the unit in the column heading, not after every number.', 'unit once, in the heading', 'Write the unit in the heading, for example Time (s) or Mass (g). Then you only write the numbers in the table. This keeps the table tidy and easy to read.', 'wsprocess-units'),
    f('Room for repeats', 'Give each repeat its own column, and add a column for the mean.', 'repeats, then mean', 'If you repeat a measurement, give each repeat its own column. You can then add a column for the mean of each row. Set out the table before you start, so you have room for every reading.', 'wsprocess-repeats'),
  ],
  'W6-04': [
    f('The mean', 'To find the mean, add up all the values, then divide by how many there are.', 'add, then divide', 'The mean is the type of average you use for repeated measurements. Add up all the values. Then divide by the number of values. When people just say average, they usually mean the mean.', 'wsprocess-mean'),
    f('The median', 'The median is the middle value when the results are in order.', 'order, then middle', 'The median is the middle value. First write the results in order, from smallest to largest. Then pick the middle one. If there are two middle values, the median is halfway between them.', 'wsprocess-median'),
    f('The mode', 'The mode is the value that appears most often.', 'most common', 'The mode is the value that occurs most often in your results. To remember the words: the mode is the MOst common, and the median is the MiDdle.', 'wsprocess-mode'),
    f('The range', 'The range is the largest value minus the smallest value. It shows how spread out the data is.', 'biggest − smallest', 'The range tells you how spread out the data is. To find it, subtract the smallest value from the largest value. A small range means the readings are close together.', 'wsprocess-range'),
    f('Leave out anomalies', 'When you find a mean, leave out any anomalous result.', 'ignore the odd one', 'Sometimes one reading does not fit the rest. This is an anomalous result. Leave it out when you calculate the mean. Then divide by the number of values you actually used.', 'wsprocess-anomaly'),
  ],
  'W6-08': [
    f('Counting significant figures', 'The first significant figure is the first digit that is not zero. The next digits follow straight after it.', 'first digit that is not zero', 'Significant figures tell you how many digits of a number matter. The first one is the first digit that is not zero. The digits straight after it also count, even if they are zeros. So 0.0406 has three significant figures: 4, 0 and 6.', 'wsprocess-sf-count'),
    f('Round to the fewest', 'Round your answer to the lowest number of significant figures in the numbers you were given.', 'match the least precise number', 'In a calculation, round the answer to the fewest significant figures given in the question. If the numbers are 2.5 and 0.60, both have two significant figures. So you round the answer to two significant figures.', 'wsprocess-sf-round'),
    f('Round only at the end', 'In a calculation with several steps, round only the final answer.', 'keep the digits until the end', 'If a calculation has more than one step, only round the final answer. Keep all the digits on your calculator until then. Rounding early can make your final answer wrong.', 'wsprocess-sf-final'),
  ],
}
