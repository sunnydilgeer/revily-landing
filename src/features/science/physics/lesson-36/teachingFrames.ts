import type { TeachingFrame } from '../../teachingFrame'

// Half-life: count-rate and activity, random decay, the half-life idea, reading it off a graph, and the halving-steps calculation.
// Friendly numbers only; no net-decline ratio.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const halfLifeFrames: Record<string, TeachingFrame[]> = {
  'P36-02': [
    f('Counting radiation', 'The count-rate is the number of radiation counts a detector picks up each second.', 'detector, per second', 'A radioactive source gives out radiation from the nuclei of its atoms. A detector, such as a Geiger-Muller tube and counter, picks up this radiation. The number of counts it measures each second is called the count-rate.', 'halflife-count'),
    f('How fast a source decays', 'Activity is the rate at which a source decays, measured in becquerels (Bq).', 'decays per second', 'Another way to measure a source is to ask how quickly its nuclei decay. This rate is called the activity. It is measured in becquerels, Bq. One becquerel is one decay every second.', 'halflife-activity'),
    f('A random process', 'You cannot predict which nucleus will decay next, or when.', 'which one, when', 'Decay is random. You cannot say which nucleus in a sample will decay next. You cannot say when any one nucleus will decay either. It is like a crowd of popcorn kernels: nobody knows which one pops next.', 'halflife-random'),
    f('Big numbers are predictable', 'With a huge number of nuclei, you can predict how long it takes for half of them to decay.', 'many nuclei, steady pattern', 'A sample has a huge number of nuclei. So the overall pattern is steady, even though each nucleus is random. You can predict how long it takes for half of the nuclei to decay. This time has a special name, the half-life.', 'halflife-predict'),
  ],
  'P36-05': [
    f('What half-life means', 'The half-life is the time taken for half of the unstable nuclei in a sample to decay.', 'half of the nuclei', 'The half-life is the time taken for the number of unstable nuclei in a sample to halve. After one half-life, half of the nuclei that were there at the start have decayed.', 'halflife-def'),
    f('Activity halves too', 'Half-life is also the time for the count-rate or activity to fall to half of its starting value.', 'nuclei, activity, count-rate', 'Fewer nuclei left means fewer decays each second. So the activity falls too. Half-life is also the time taken for the activity, or the count-rate, to fall to half of its starting value.', 'halflife-steps'),
    f('Halving again and again', 'An activity of 800 Bq becomes 400 Bq, then 200 Bq, then 100 Bq, one half-life at a time.', '800, 400, 200, 100', 'Suppose a source starts at 800 Bq. After one half-life it is 400 Bq. After a second half-life it is 200 Bq. After a third it is 100 Bq. Each half-life takes the same amount of time.', 'halflife-chain'),
    f('Always the same', 'The half-life of a sample is always the same, whatever activity you start with.', 'same time each step', 'The half-life of a radioactive sample always stays the same. So it does not matter how big the activity is at the start. A source that starts at 800 Bq and one that starts at 80 Bq both take one half-life to halve.', 'halflife-same'),
  ],
  'P36-08': [
    f('Start of the graph', 'On an activity-time graph, read the starting activity where the curve meets the vertical axis.', 'start at time zero', 'An activity-time graph shows how the activity of a source falls as time passes. First find the starting activity. Read it off the vertical axis at time zero. Here it is 800 Bq.', 'halflife-graph-initial'),
    f('Find half the activity', 'Half of 800 Bq is 400 Bq. Draw a line across from 400 Bq to the curve.', 'half of the start', 'Now work out half of the starting activity. Half of 800 Bq is 400 Bq. Find 400 Bq on the vertical axis. Draw a line across to the curve.', 'halflife-graph-half'),
    f('Read down to the time', 'From the curve, go down to the time axis. That time is the half-life: 2 s.', 'across, then down', 'From the point on the curve, draw a line straight down to the time axis. It meets the axis at 2 s. So it took 2 s for the activity to halve. The half-life is 2 s.', 'halflife-graph-time'),
    f('Check with a second halving', 'Half of 400 Bq is 200 Bq, at 4 s. That is another 2 s, so the half-life is the same.', 'same gap again', 'You can check by halving again. Half of 400 Bq is 200 Bq. The curve reaches 200 Bq at 4 s. That is another 2 s, so the half-life is steady at 2 s.', 'halflife-graph-check'),
  ],
  'P36-11': [
    f('Halve step by step', 'A source falls from 96 Bq to 12 Bq in 15 minutes. First halve 96 until you reach 12.', 'halve until you get there', 'A source has an activity of 96 Bq. Fifteen minutes later it is 12 Bq. We want the half-life. First halve the activity again and again until you reach 12 Bq.', 'halflife-w-halve'),
    f('Count the half-lives', '96 → 48 → 24 → 12 takes three halvings, so 15 minutes is three half-lives.', 'count the steps', 'One half-life gives 96 ÷ 2 = 48 Bq. Two half-lives give 48 ÷ 2 = 24 Bq. Three half-lives give 24 ÷ 2 = 12 Bq. So 15 minutes is three half-lives.', 'halflife-w-count'),
    f('Share the time out', 'Divide the total time by the number of half-lives: 15 ÷ 3.', 'total time ÷ number of steps', 'The total time is shared equally between the three half-lives. So divide the total time by the number of half-lives. Time for one half-life = 15 ÷ 3.', 'halflife-w-divide'),
    f('Write the answer', '15 ÷ 3 = 5, so the half-life is 5 minutes.', 'number and unit', 'Work out 15 ÷ 3 = 5. The time was in minutes, so the answer is in minutes. The half-life of the source is 5 minutes.', 'halflife-w-answer'),
  ],
}
