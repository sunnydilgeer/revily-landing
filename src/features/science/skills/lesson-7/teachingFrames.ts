import type { TeachingFrame } from '../../teachingFrame'

// Categoric vs continuous data, how to draw a bar chart, how to plot a graph with a line of best fit and spot an anomaly.
// Correct only in words: no tangents, no calculations here.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsPresentFrames: Record<string, TeachingFrame[]> = {
  'W7-02': [
    f('Data in separate groups', 'Some data comes in separate groups, such as blood group, rock type or a count of whole things.', 'groups with gaps between them', 'Some data comes in separate groups. Blood group, eye colour and type of rock are examples. A count of whole things, such as the number of petals on a flower, also comes as separate values.', 'wspresent-categoric'),
    f('Data with any value', 'Some data can take any value in a range, such as temperature, time, volume or length. This is called continuous.', 'any value in between', 'Other data can have any value in a range. Temperature, time, volume and length work like this. Between 20 °C and 21 °C there are endless values, such as 20.4 °C. We call this continuous data.', 'wspresent-continuous'),
    f('Which display?', 'Groups go in a bar chart. If both variables are continuous, plot a graph.', 'groups: bars, ranges: graph', 'Look at your independent variable. If it comes in separate groups, show the data in a bar chart. If both variables can have any value in a range, plot a graph.', 'wspresent-choose'),
    f('Examples from the sciences', 'Woodlice in four habitats: bar chart. Gas volume over time: graph. Spring stretch against force: graph.', 'ask what type each variable is', 'Counting woodlice in four habitats gives groups, so draw a bar chart. Measuring gas volume every 10 seconds gives two continuous variables, so plot a graph. A spring stretched by different forces also gives a graph.', 'wspresent-examples'),
  ],
  'W7-05': [
    f('An even scale', 'The scale on the vertical axis must go up in equal steps. Draw the chart large.', 'equal steps, big drawing', 'The scale on the vertical axis must be even, so each division stands for the same amount, such as 0, 5, 10, 15. Draw the chart big, using at least half of the paper.', 'wspresent-bar-scale'),
    f('Label both axes', 'Label both axes. Include the units on the axis that shows what was counted or measured.', 'what and how much', 'Label both axes. One axis names the groups, such as the type of habitat. The other axis says what was measured, with its units, such as the number of woodlice.', 'wspresent-bar-labels'),
    f('Gaps and a key', 'Leave a gap between bars for different groups. Add a key if there is more than one set of data.', 'gaps, and a key for two sets', 'Leave a gap between the bars for different groups. If your chart shows more than one set of data, such as two ponds, add a key so the reader knows which bars are which.', 'wspresent-bar-key'),
  ],
  'W7-08': [
    f('Choose the axes', 'The independent variable goes on the x-axis, the horizontal one. The dependent variable goes on the y-axis, the vertical one.', 'x is across, y is up', 'The independent variable goes on the x-axis, which is the horizontal one. The dependent variable goes on the y-axis, which is the vertical one. Label both axes and include the units.', 'wspresent-plot-axes'),
    f('Choose a sensible scale', 'Choose a scale that lets the points spread over most of the paper, with equal steps.', 'use most of the paper', 'Use the biggest values to decide your scale. If the longest time is 46 seconds, the x-axis can run from 0 to 50 seconds. Each division must be the same size.', 'wspresent-plot-scale'),
    f('Plot neat crosses', 'Plot each point as a small, neat cross using a sharp pencil.', 'small and clear', 'Plot each reading as a small, neat cross, using a sharp pencil. Blobs and smudges make it hard to read the graph.', 'wspresent-plot-points'),
    f('Draw a line of best fit', 'A line of best fit passes through, or close to, as many points as possible. Do not just join the dots.', 'smooth, not join the dots', 'Draw a line of best fit. It passes through, or as near as it can to, as many points as possible. Use a ruler if the trend is straight, or a smooth curve if it bends. Do not just join the crosses.', 'wspresent-plot-line'),
    f('Spot an anomaly', 'A point far away from the pattern is an anomalous result. Circle it and ignore it when you draw the line.', 'one point that does not fit', 'Sometimes one point is far from the pattern of the others. This is called an anomalous result. Circle it, and leave it out when you draw your line of best fit.', 'wspresent-plot-anomaly'),
  ],
}
