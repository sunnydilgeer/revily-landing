import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsPresentFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 3.1 (presenting observations and data: tables, bar charts and graphs, lines of best fit), as on the supplied revision page' }
const skill = 'W-DAT-007-W'
const a = author(skill, ['WS 3.1'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsPresentSections = [
  { id: 'W7-01', label: 'Start here', detail: 'Showing how pupils travel' },
  { id: 'W7-02', label: 'Bar chart or graph?', detail: 'Groups or continuous data' },
  { id: 'W7-05', label: 'How do you draw a bar chart?', detail: 'Scale, labels, gaps and a key' },
  { id: 'W7-08', label: 'How do you plot a graph?', detail: 'Axes, scale, crosses, line of best fit' },
  { id: 'W7-12', label: 'On your own', detail: 'Spot, read and plan' },
]

const states: ScienceState[] = [
  { ...a.choice('W7-01', 'Pupils travel to school by walking, bike, bus or car. What is the best way to show how many use each?', ['A line graph joining the four counts', 'A bar chart with one bar for each way of travelling', 'A single line of best fit', 'A list of names with no chart'], 1, 'Each way of travelling is a separate group.', ['Each way of travelling is a separate group, so a bar for each group works well.', 'A line joining the counts would suggest there is something in between walking and cycling.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W7-02', 'Bar chart or graph?'),
  a.choice('W7-03', 'Which data should be shown in a bar chart?', ['The volume of gas measured every 10 seconds', 'The length of a spring for different masses', 'The number of woodlice found in each of four habitats', 'The temperature of water as it cools'], 2, 'Look for the data that comes in separate groups.', ['The four habitats are separate groups, so a bar chart suits them.', 'The other three are continuous measurements, so they belong on a graph.'], 'understanding'),
  a.choice('W7-04', 'A student measures the current through a wire at voltages from 1 V to 6 V. What should she draw?', ['A graph, plotting a point for each pair of readings', 'A bar chart with a gap between each voltage', 'A bar chart with a key', 'Nothing, because the readings are numbers'], 0, 'Both the voltage and the current can take any value in a range.', ['Voltage and current are both continuous, so plot a graph.', 'Bars with gaps are for separate groups.'], 'application'),
  t('W7-05', 'How do you draw a bar chart?'),
  a.choice('W7-06', 'A student counts daisies in four fields. Her vertical scale reads 0, 1, 2, 5, 10, 20. What is wrong with it?', ['It starts at zero', 'It has numbers on it', 'It goes up to 20', 'The steps are not equal'], 3, 'Each division should stand for the same amount.', ['The steps between the numbers are different sizes, so the scale is not even.', 'A better scale would be 0, 5, 10, 15, 20.']),
  a.choice('W7-07', 'A bar chart shows tadpole numbers in two ponds, in two colours. What must it have?', ['A line of best fit', 'A gap between every bar and the axis', 'A key showing which colour is which pond', 'A smaller drawing'], 2, 'The reader needs to tell the two sets of bars apart.', ['With two sets of data, a key tells the reader which colour shows which pond.', 'Gaps go between groups, and a line of best fit belongs on a graph.']),
  t('W7-08', 'How do you plot a graph?'),
  a.choice('W7-09', 'Which describes a good line of best fit?', ['It joins every point with short straight lines', 'It passes through, or close to, as many points as possible', 'It always starts at the first point', 'It goes through the anomalous point'], 1, 'The line shows the overall pattern, not each point.', ['A line of best fit passes through or near as many points as it can.', 'It ignores any anomalous result.']),
  a.choice('W7-10', 'A student measures the height of a plant each day for ten days. Which goes on the x-axis?', ['Time in days', 'Height in centimetres', 'The plant’s name', 'Nothing'], 0, 'The independent variable is the one you choose or change.', ['Time is the independent variable, so it goes on the x-axis.', 'Height is the dependent variable, so it goes on the y-axis.']),
  a.choice('W7-11', 'The longest time in an experiment is 46 seconds. Which is the most sensible scale for the time axis?', ['0 to 500 s in steps of 100 s', '0 to 60 s in steps of 7 s', '0 to 50 s, but with steps of 5, 20, 25 and 50', '0 to 50 s in steps of 10 s'], 3, 'The scale needs equal steps, and the data should fill most of the paper.', ['0 to 50 in steps of 10 has equal steps, and the 46 s point sits near the end.', '0 to 500 would squash the points into one corner.']),
  a.choice('W7-12', 'Look at the numbered crosses on the graph. Which one is the anomalous result?', ['Point 1', 'Point 2', 'Point 3', 'Point 4'], 1, 'Look for the point that is far from the pattern of the others.', ['Point 2 is far from the line that the other points follow.', 'You would circle it and ignore it when drawing the line of best fit.'], 'dataInterpretation', true, 'wspresent-q-graph'),
  a.choice('W7-13', 'Which field had twice as many daisies as field C?', ['Field D', 'Field A', 'Field B', 'None of them'], 0, 'Read the height of the bar for field C, then double it.', ['Field C has 8, and double 8 is 16.', 'Field D has 16 daisies.'], 'dataInterpretation', true, 'wspresent-q-bars'),
  a.choice('W7-14', 'A student hangs masses from 100 g to 500 g on a spring and measures its length. Which plan is correct?', ['A bar chart with a gap between each mass', 'Mass on the y-axis and length on the x-axis', 'Mass on the x-axis, length on the y-axis and a line of best fit', 'Join each point with short straight lines'], 2, 'The mass is what she changes. The length is what she measures.', ['The mass is the independent variable, so it goes on the x-axis.', 'The length is the dependent variable, so it goes on the y-axis, and a line of best fit shows the trend.'], 'application', true),
  a.written('W7-15', 'A student measures the temperature of a cooling cup of tea every minute for ten minutes. Describe how to present the results.', 'Say which type of display, which variable goes on which axis, and how to finish.', 'The temperature and the time are both continuous, so plot a graph. Time, the independent variable, goes on the x-axis. Temperature, the dependent variable, goes on the y-axis. Label both axes with units and choose an even scale that fills most of the paper. Plot neat crosses and draw a line of best fit, ignoring any anomalous result.', ['Chooses a graph because both variables are continuous.', 'Puts time on the x-axis and temperature on the y-axis.', 'Labels the axes with units and uses an even scale.', 'Plots crosses and draws a line of best fit, ignoring any anomaly.'], ['Choosing a bar chart.', 'Swapping the axes.', 'Joining every point with straight lines.']),
]

export const lessonW7: ScienceLesson = {
  id: 'W-DAT-007-W', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Presenting data', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
