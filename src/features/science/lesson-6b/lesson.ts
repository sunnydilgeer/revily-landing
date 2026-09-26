// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route through required practical 2: plan a fair test → measure the mass → percentage change →
// graph → check the results, with a check after each walkthrough. See STORYBOARD.md.
// Screens keep their old lesson 6 ids (B6-25…B6-45) so links and saved progress still find them.
import type { ScienceLesson, ScienceState } from '../types'
import { author, biologySource, sampledRequirements } from '../lessonAuthoring'
import { osmosisPracticalFrames as frames } from './teachingFrames'

const p = author('B-OSMOSIS-PRACTICAL', ['4.1.3.2', '10.2.2'], ['aqa-biology', 'aqa-practical', 'aqa-handbook'])
const t = (id: keyof typeof frames, title: string) => p.teach(id, title, frames[id])

export const osmosisPracticalSections = [
  { id: 'B6-50', label: 'Start here', detail: 'A potato in pure water' },
  { id: 'B6-25', label: 'Plan a fair test', detail: 'What you change, measure and keep the same' },
  { id: 'B6-54', label: 'Measure the mass', detail: 'Weigh, soak, blot, weigh again' },
  { id: 'B6-30', label: 'Work out the percentage change', detail: 'Compare pieces of different sizes' },
  { id: 'B6-33', label: 'Draw the graph', detail: 'Axes, points and a line of best fit' },
  { id: 'B6-53', label: 'Check your results', detail: 'Repeats, odd results and the mean' },
  { id: 'B6-40', label: 'On your own', detail: 'The whole practical' },
]

const states: ScienceState[] = [
  { ...p.choice('B6-50', 'In the last topic, a piece of potato was put in pure water. What happened to its mass?', ['It went up, because water moved into the cells', 'It went down, because water moved out of the cells', 'It stayed the same, because water cannot cross a membrane'], 0, 'Is pure water more dilute or more concentrated than the cell contents?', ['Pure water is more dilute than the cell contents.', 'So water moved into the cells by osmosis, and the mass went up.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  // Plan a fair test
  t('B6-25', 'Plan a fair test'),
  p.choice('B6-26', 'In this practical, what is the independent variable?', ['The change in mass of the tissue', 'The concentration of the solution', 'The temperature of the room'], 1, 'What do you change on purpose?', ['The independent variable is the thing you change on purpose.', 'You choose a different concentration for each tube, so it is the concentration of the solution.'], 'practicalReasoning'),

  // Measure the mass
  t('B6-54', 'Measure the mass'),
  p.choice('B6-27', 'Why blot each piece before weighing it again?', ['To remove all the water from inside the cells', 'To remove surface droplets that would add extra mass', 'To make every piece the same size'], 1, 'Is the water you remove inside the cells, or on the surface?', ['Droplets on the surface add mass that never went into the cells.', 'So gentle blotting removes them, and the final mass is fair.'], 'practicalReasoning'),

  // Work out the percentage change
  t('B6-30', 'Work out the percentage change'),
  p.worked('B6-28', 'Percentage change: a worked example', 'Example data, not real measurements. A piece of potato starts at 2.00 g and ends at 2.20 g. What is its percentage change?', ['Find the change: final mass − initial mass = 2.20 − 2.00 = +0.20 g.', 'Divide by the initial mass: 0.20 ÷ 2.00 = 0.10.', 'Multiply by 100: 0.10 × 100 = 10.', 'Add the sign: +10%. The plus sign shows a gain.'], 'percentage'),
  p.choice('B6-29', 'A piece starts at 2.50 g and ends at 2.25 g. What is its percentage change?', ['+10%', '−25%', '−10%', '−0.25%'], 2, 'Find final − initial. Divide by the initial mass, then multiply by 100. Gain or loss?', ['Change = 2.25 − 2.50 = −0.25 g.', 'So −0.25 ÷ 2.50 × 100 = −10%. The minus sign shows a loss.'], 'calculation'),

  // Draw the graph
  t('B6-33', 'Draw the graph'),
  p.choice('B6-31', 'Which axis labels suit this graph?', ['x: concentration (mol/dm³); y: percentage change in mass (%)', 'x: percentage change in mass (%); y: concentration (mol/dm³)', 'x: piece number; y: concentration, with no units'], 0, 'Which variable did you change? It goes along the bottom.', ['Concentration is the independent variable, so it goes on the x-axis.', 'So percentage change goes on the y-axis, and both axes need units.'], 'dataInterpretation'),
  p.choice('B6-32', 'The change is +5% at 0.2 mol/dm³ and −5% at 0.4 mol/dm³. The line is straight between them. Estimate where it crosses 0%.', ['0 mol/dm³', '0.3 mol/dm³', '0.6 mol/dm³'], 1, 'Zero is halfway between +5% and −5%.', ['0% is halfway between +5% and −5%, and 0.3 is halfway between 0.2 and 0.4.', 'So the estimate is 0.3 mol/dm³. It estimates the cell contents; it is not an exact measurement.'], 'dataInterpretation', false, 'graph-question'),

  // Check your results
  t('B6-53', 'Check your results'),
  p.choice('B6-45', 'Three repeats at one concentration give +4%, +5% and +24%. What should you do next?', ['Keep repeating until every value is identical', 'Check the method, then repeat the +24% measurement before deciding', 'Delete every result that does not fit your prediction'], 1, 'Does unusual always mean wrong?', ['+24% is very different from the others, so it may be an anomalous result.', 'So check the method and the recorded values, then repeat it. Never delete it just because it disagrees with your prediction.'], 'dataInterpretation'),
  p.choice('B6-52', 'Three repeats at 0.6 mol/dm³ give −14%, −15% and −16%. What is the mean?', ['−45%', '+15%', '−15%', '−16%'], 2, 'Add the repeats, then divide by how many there are.', ['(−14) + (−15) + (−16) = −45.', 'So the mean is −45 ÷ 3 = −15%.'], 'calculation'),

  // On your own
  p.choice('B6-40', 'A carrot piece starts at 3.00 g and ends at 2.55 g. What is its percentage change?', ['+15%', '−45%', '−15%', '−0.45%'], 2, 'Use its own initial mass. Gain or loss?', ['Change = 2.55 − 3.00 = −0.45 g.', 'So −0.45 ÷ 3.00 × 100 = −15%.'], 'calculation', true),
  p.choice('B6-41', 'Jo leaves one piece in its solution for 10 minutes and another for 60 minutes. Why is this not a fair test?', ['Time can also change the mass, so it must be kept the same', 'The concentration should never change', 'Using a balance makes any test unfair'], 0, 'How many things should change on purpose?', ['Only the independent variable, the concentration, should change.', 'Time can also change the mass, so it must be a control variable.'], 'practicalReasoning', true),
  p.choice('B6-42', 'Three repeats at one concentration give +4%, +5% and +6%. What is the mean?', ['+15%', '+6%', '+4%', '+5%'], 3, 'Add the repeats, then divide by how many there are.', ['4 + 5 + 6 = 15.', 'So the mean is 15 ÷ 3 = +5%.'], 'calculation', true),
  p.choice('B6-43', 'A class tests carrot pieces. The mean change is +12% in pure water and −8% in 0.5 mol/dm³ sugar solution. What can you conclude?', ['In this test, the cell contents were between 0 and 0.5 mol/dm³', 'The cell contents are exactly 0.25 mol/dm³', 'Carrot pieces always lose mass in any sugar solution', 'Water stopped moving in the sugar solution'], 0, 'A gain means the outside is more dilute. A loss means it is more concentrated.', ['The carrot gained mass in water and lost mass in 0.5 mol/dm³ solution.', 'So in this test, the zero-change point lies somewhere between them. Two results cannot give an exact value.'], 'dataInterpretation', true),
  p.written('B6-44', 'A piece of potato loses mass in a concentrated sugar solution. Explain the result, and name one control variable.', 'What moves, in which direction, and what does it cross? Then name one thing to keep the same.', 'The cell contents are more dilute than the concentrated sugar solution. So water moves out of the cells by osmosis. It crosses partially permeable cell membranes. The potato loses water, so its mass goes down. One control variable is the soaking time. Temperature, solution volume, or tissue type and size are also suitable.', ['Water moves by osmosis across partially permeable cell membranes.', 'Net water movement is out of the cells, from the dilute cell contents to the concentrated solution, so the potato loses mass.', 'Names one control variable, such as time, temperature, solution volume, or tissue type and size.'], ['Sugar movement is called osmosis.', 'Water is said to move into the potato.', 'A home cutting or chemical task is proposed.']),
]

export const lesson6b: ScienceLesson = {
  id: 'B-CELL-006B-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Osmosis practical', prerequisites: ['B-CELL-TRANSPORT'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biologySource,
    { id: 'aqa-practical', title: 'AQA 8464 practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.2 Required practical 2; AT1/3/5' },
    { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Printed pp10–11,60–62 Osmosis; teacher risk assessment' },
  ], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
