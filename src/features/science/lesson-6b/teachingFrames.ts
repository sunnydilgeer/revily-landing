import type { TeachingFrame } from '../teachingFrame'

// One route through required practical 2: plan a fair test → measure the mass → percentage change →
// graph → check the results. One new word per screen, one graph idea per screen. See STORYBOARD.md.
// All numbers are original example data, not laboratory measurements.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const osmosisPracticalFrames: Record<string, TeachingFrame[]> = {
  'B6-25': [
    f('The question', 'How does the concentration of a solution change the mass of plant tissue?', 'concentration → mass change', 'You met osmosis in the last topic, diffusion and osmosis. Now you will measure it. Pieces of potato go into sugar or salt solutions of different concentrations. You find out how much mass each piece gains or loses.', 'practical-setup'),
    f('Stay safe', 'The real practical happens in school, with your teacher.', 'this lesson first, then the real practical', 'A method that has been checked for dangers is called a risk-assessed method. Do the real practical in school with your teacher and a risk-assessed method. Your teacher prepares the tissue. Cutting and lab solutions are not home tasks. This lesson prepares you for required practical 2. It does not replace doing it.', 'practical-setup'),
    f('What you change', 'The thing you change on purpose is the independent variable.', 'you choose it', 'You choose a different concentration for each tube of solution. The thing you change on purpose is called the independent variable. Here, it is the concentration of the solution.', 'practical-setup'),
    f('What you measure', 'The thing you measure is the dependent variable.', 'it depends on what you changed', 'You measure how much the mass of each piece changes. The thing you measure is called the dependent variable. Here, it is the change in mass.', 'practical-data'),
    f('Keep everything else the same', 'Things you keep the same are control variables.', 'only one thing changes', 'Use the same type of tissue, cut to the same size. Use the same volume of solution, the same time and the same temperature. Things you keep the same are called control variables. So only the concentration can cause the change.', 'practical-setup'),
    f('Put it together', 'Change the concentration, measure the mass change, keep the rest the same.', 'change one → measure one → fix the rest', 'Independent variable: the concentration. Dependent variable: the change in mass. Control variables: tissue type and size, solution volume, time and temperature. So the test is fair.', 'practical-setup'),
  ],
  'B6-54': [
    f('Weigh first', 'Record the mass of each piece before it goes in.', 'mass before', 'Weigh each piece on a balance before it goes into a solution. This first reading is called the initial mass. Record it in a results table, next to the concentration.', 'practical-setup'),
    f('Soak for a set time', 'Every piece soaks for the same time, at the same temperature.', 'same time, same temperature', 'Put each piece into its own tube of solution. Leave them all for the same time, such as 30 minutes. Keep them at the same temperature.', 'practical-setup'),
    f('Dry the surface', 'Gently remove surface liquid before weighing again.', 'surface droplets add extra mass', 'Take each piece out. Droplets on its surface would add extra mass that never went into the cells. Gently dabbing them off with paper towel is called blotting. Blot every piece in the same way.', 'practical-setup'),
    f('Weigh again', 'Record the final mass and work out the change.', 'mass after − mass before', 'Weigh each piece again. This reading is called the final mass. Change in mass = final mass − initial mass. A negative change means the piece lost mass.', 'practical-data'),
    f('Put it together', 'Weigh, soak, blot, then weigh again.', 'weigh → soak → blot → weigh', 'Weigh each piece first. Soak it for a set time at a set temperature. Blot it gently, then weigh it again. Record both masses in your table.', 'practical-setup'),
  ],
  'B6-30': [
    f('Why not just grams?', 'Pieces start at different masses, so compare percentages.', 'change compared with the start', 'Pieces do not all start at the same mass. A 0.2 g gain is a big change for a small piece but a small change for a big one. So you compare each change with the starting mass. This is called the percentage change.', 'percentage'),
    f('Divide, then multiply', 'Divide the change by the initial mass, then multiply by 100.', 'change ÷ initial × 100', 'First find the change: final mass − initial mass. Divide the change by the initial mass. Then multiply by 100 to give a percentage.', 'percentage'),
    f('Plus or minus', 'A positive percentage is a gain; a negative one is a loss.', '+ gained, − lost', 'If the piece gained mass, the change is positive. If it lost mass, the change is negative. Always keep the sign in your answer.', 'percentage'),
  ],
  'B6-33': [
    f('Concentration goes across', 'Put what you changed along the bottom.', 'independent variable → x-axis', 'The independent variable goes along the bottom, on the x-axis. Here, that is concentration. Its unit is mol/dm³, said “moles per decimetre cubed”. A bigger number means a more concentrated solution.', 'practical-graph'),
    f('Percentage change goes up', 'Put what you measured up the side.', 'dependent variable → y-axis', 'The dependent variable goes up the side, on the y-axis. Here, that is the percentage change in mass. Gains go above zero and losses go below. So the scale needs negative numbers too.', 'practical-graph'),
    f('Plot the points', 'Each result becomes one point on the graph.', 'across, then up', 'Use an even scale on each axis. For each concentration, go across, then up or down to its percentage change. At 0.2 mol/dm³, the change is +5%. Try plotting that point. This optional practice does not submit an assessed answer.', 'plot'),
    f('Draw a line of best fit', 'One line through the middle of the points shows the pattern.', 'do not join the dots', 'Do not join the dots. Draw one straight or smooth line that passes close to as many points as possible. This is called a line of best fit. It shows the overall pattern.', 'practical-graph'),
    f('Where the line crosses zero', 'At 0% change, there is no net gain or loss of water.', 'zero change → balanced', 'Where the line crosses 0%, the tissue neither gains nor loses mass. There is no net movement of water, but water still moves both ways. This concentration is an estimate of the cell contents, not an exact measurement.', 'practical-graph'),
    f('Put it together', 'Axes, points, line, then read where it crosses zero.', 'across → up → line → zero', 'Concentration goes across and percentage change goes up. Plot each point, then draw a line of best fit. Where the line crosses 0%, water moves in and out equally.', 'practical-graph'),
  ],
  'B6-53': [
    f('Repeat each test', 'Test each concentration more than once.', 'one result could be a fluke', 'One result could be affected by a small slip or by chance. So test each concentration at least three times. Doing the same test again is called a repeat.', 'practical-data'),
    f('Spot an odd result', 'A result that does not fit the pattern is anomalous.', 'one result far from the others', 'Suppose three repeats give +4%, +5% and +24%. The +24% is very different from the others. A result that does not fit the pattern is called an anomalous result.', 'practical-data'),
    f('Check before you decide', 'Investigate an odd result; do not just delete it.', 'check, then repeat', 'Unusual does not always mean wrong. Check the method and the recorded values. Then repeat the measurement. Never delete a result just because it disagrees with your prediction.', 'practical-data'),
    f('Find the mean', 'Add the repeats, then divide by how many there are.', 'add up ÷ how many', 'Add the repeat results, then divide by how many there are. This value is called the mean. For +6%, +7% and +8%: (6 + 7 + 8) ÷ 3 = 21 ÷ 3 = +7%.', 'practical-data'),
    f('Put it together', 'Repeat, check odd results, then find the mean.', 'repeat → check → mean', 'Repeat each concentration. Check any anomalous result and repeat it. Then find the mean of the repeats. Repeats and a mean reduce the effect of chance, so your estimate is more reliable. Next, you will see how cells can move substances against a gradient, and how exchange surfaces work.', 'practical-data'),
  ],
}
