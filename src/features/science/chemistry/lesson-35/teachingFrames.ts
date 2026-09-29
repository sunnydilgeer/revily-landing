import type { TeachingFrame } from '../../teachingFrame'

// One gas-volume experiment (graph A) is kept on screen for drawing, reading and the two mean-rate methods.
// Graph A data (time s → gas cm³): 0→0, 10→14, 20→22, 30→27, 40→29, 50→30, 60→30.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const rateGraphFrames: Record<string, TeachingFrame[]> = {
  'C35-02': [
    f('Choose the axes', 'Time goes on the x-axis and the volume of gas on the y-axis.', 'time → across; gas → up; units on both', 'A student measured the volume of gas made by a reaction every 10 seconds. To draw the graph, put time on the x-axis, along the bottom. Put the volume of gas on the y-axis, going up. Label both axes with their units.', 'rgraph-axes'),
    f('Plot the points', 'Mark each result with a small cross.', 'each pair of numbers → one cross', 'Take one column of the table at a time. At 10 seconds, 14 cm³ of gas had been made. Find 10 on the x-axis and 14 on the y-axis, and mark a small cross where they meet. Do this for every result.', 'rgraph-points'),
    f('Draw a line of best fit', 'A smooth curve passes close to the crosses.', 'not dot-to-dot → one smooth curve', 'A line of best fit is a line that runs as close as it can to all the points. Do not join the crosses one by one. For this reaction, draw one smooth curve. It rises steeply and then levels off.', 'rgraph-curve'),
    f('Two straight lines', 'Two straight lines can also fit these points.', 'sloping part + flat part', 'You can also draw two straight lines of best fit. Use one for the sloping part of the graph and one for the flat part. Use a ruler. Your teacher may prefer one way, so follow their advice.', 'rgraph-lines'),
  ],
  'C35-05': [
    f('Steep means fast', 'The steeper the line, the faster the reaction.', 'steep → lots of gas per second', 'Look at the graph from the experiment. At the start the line is steep, because a lot of gas is made every second. So the reaction is fastest at the start. The line gets less steep as the reaction slows down.', 'rgraph-read-steep'),
    f('Flat means finished', 'When the line goes flat, no more product is being made.', 'flat line → nothing new → finished', 'After about 50 seconds the line is flat. No more gas is being made, so the reaction has finished. The time where the line first goes flat is the time the reaction finished.', 'rgraph-read-flat'),
    f('Reading a value', 'Read up from the time, then across to the axis.', 'up from the time → across to the volume', 'To find how much gas had been made at 20 seconds, start at 20 on the x-axis. Go straight up to the curve. Then go straight across to the y-axis. You read 22 cm³.', 'rgraph-read-values'),
  ],
  'C35-07': [
    f('Mean rate', 'Mean rate is the amount made or used up, divided by the time.', 'amount ÷ time', 'The mean rate of a reaction is its average rate over some time. Divide the amount of product formed by the time taken. You can also divide the amount of reactant used up by the time taken.', 'rgraph-formula'),
    f('Units', 'The unit shows the amount and the time.', 'g or cm³ ÷ seconds → g/s or cm³/s', 'The unit of the rate comes from the two numbers you divide. If you measure a mass in grams and the time in seconds, the rate is in g/s. If you measure the volume of a gas in cm³, the rate is in cm³/s.', 'rgraph-units'),
    f('Put it together', 'Find the amount, find the time, then divide.', 'amount → time → divide → unit', 'First, find the amount of product formed, or reactant used. Next, find the time it took. Then divide the amount by the time. Finish by writing the unit, such as g/s or cm³/s.', 'rgraph-steps'),
  ],
  'C35-10': [
    f('When did it finish?', 'For the whole reaction, start where the line goes flat.', 'flat → finish time', 'To find the mean rate for the whole reaction, first find when it finished. On this graph the line goes flat at 50 seconds. So the reaction took 50 seconds.', 'rgraph-whole-finish'),
    f('Divide the total', 'Total amount made ÷ time taken.', '30 cm³ ÷ 50 s → 0.60 cm³/s', 'Now read how much gas was made by then. At 50 seconds the graph shows 30 cm³. Divide by the time: 30 ÷ 50 = 0.60. So the mean rate for the whole reaction is 0.60 cm³/s.', 'rgraph-whole-divide'),
    f('Between two times', 'You can also find the mean rate between two times.', 'read both values → take the difference', 'You can find the mean rate between 20 seconds and 40 seconds. Read the volume at each time: 22 cm³ at 20 seconds and 29 cm³ at 40 seconds. The gas made in between is 29 − 22 = 7 cm³.', 'rgraph-between-read'),
    f('Divide the difference', 'Gas made in between ÷ time in between.', '7 cm³ ÷ 20 s → 0.35 cm³/s', 'The time in between is 40 − 20 = 20 seconds. Divide: 7 ÷ 20 = 0.35. So the mean rate between 20 and 40 seconds is 0.35 cm³/s. This is lower than for the whole reaction, because the reaction had slowed down.', 'rgraph-between-divide'),
  ],
}
