import type { TeachingFrame } from '../../teachingFrame'

// Required practical preparation: force and extension of a spring (method, variables, safety, results and graph), then Ee = 1/2 k e squared as a recap with one worked example.
// Practical preparation only; the online lesson does not replace doing the practical.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const springPracFrames: Record<string, TeachingFrame[]> = {
  'P42-02': [
    f('The aim', 'The practical finds out how the force on a spring is linked to its extension.', 'add force, measure extension', 'In this practical you add masses to a spring, one at a time. Each mass pulls on the spring with a force. You measure how much the spring stretches each time.', 'springprac-aim'),
    f('The apparatus', 'A spring hangs from a clamp beside a fixed ruler. A mass holder hangs from the spring and extra masses go on it.', 'spring, ruler, masses', 'A clamp on a stand holds the spring. A ruler is fixed upright next to it. A piece of tape on the end of the spring marks its length on the ruler. Masses hang from the bottom of the spring.', 'springprac-kit'),
    f('What you change and measure', 'The variable you change is the force. The variable you measure is the extension.', 'change one, measure one', 'The variable you choose to change is called the independent variable. Here it is the force from the hanging masses. The variable you measure is called the dependent variable. Here it is the extension of the spring.', 'springprac-vars'),
    f('What you keep the same', 'Use the same spring and the same ruler throughout, and read the ruler at eye level.', 'a fair test', 'To make it a fair test, everything else must stay the same. Use the same spring and the same ruler each time. Read the tape mark against the ruler with your eye level with it.', 'springprac-control'),
  ],
  'P42-05': [
    f('Start with no masses', 'Set up the apparatus with no masses hanging. Measure the natural length of the spring.', 'natural length first', 'Set up the apparatus as shown, with no masses hanging from the spring. Read the position of the tape mark on the ruler. This is the natural length of the spring.', 'springprac-m1'),
    f('Find the force', 'The force is the weight of the masses. Change grams to kilograms, then use W = m × g with g = 9.8 N/kg.', 'grams to kilograms, then weight', 'The force pulling the spring is the weight of the hanging masses. Measure each mass on a balance in grams and divide by 1000 to get kilograms. Then use W = m × g. For 200 g: 0.2 × 9.8 = 1.96 N.', 'springprac-m2'),
    f('Add a mass and wait', 'Add one mass. Wait for the spring to come to rest, then read its new length.', 'wait until it is still', 'Hang one mass on the spring. Wait until the spring stops moving and is at rest. Then read the new length from the ruler.', 'springprac-m3'),
    f('Work out the extension', 'Extension = new length − natural length.', 'how much longer', 'The extension is how much longer the spring has become. Extension = new length − natural length. For example, 15.5 cm − 12.0 cm = 3.5 cm.', 'springprac-m4'),
    f('Repeat', 'Add another mass and repeat, so you get a set of forces with their extensions.', 'one more mass each time', 'Add masses one at a time. After each one, wait for the spring to rest, read its length and work out the extension. Write every result in a table as you go.', 'springprac-m5'),
  ],
  'P42-08': [
    f('Protect your eyes', 'Wear safety goggles. A spring under tension can spring back if something slips.', 'goggles on', 'Wear safety goggles for the whole practical. A stretched spring is under tension. If a hook slips, the spring can spring back towards your face.', 'springprac-s1'),
    f('Masses can fall', 'Make the stand stable and put a soft tray under the masses. Keep your feet clear.', 'catch the falling mass', 'The masses may fall if the spring breaks or a hook slips. Weigh down the base of the stand so it cannot tip. Put a tray with a soft lining under the masses. Keep your feet out of the way.', 'springprac-s2'),
    f('Read carefully', 'Read the ruler at eye level and use the same mark each time. Do not overload the spring.', 'care and no overloading', 'Do not add more masses than your teacher tells you to. Read the ruler with your eye level with the tape mark. This lesson prepares you. The real practical is where you do it with your own equipment.', 'springprac-s3'),
  ],
  'P42-10': [
    f('Record a table', 'A results table has columns for mass, force, length and extension.', 'one row per mass', 'Make a results table before you start. Give it columns for mass in kilograms, force in newtons, length of spring and extension. Put the units in the column headings. Each added mass gives one new row.', 'springprac-table'),
    f('Plot the graph', 'Plot force on the vertical axis and extension on the horizontal axis. Mark each result with a cross.', 'force up, extension across', 'Draw a graph of your results. Put force in newtons on the vertical axis. Put extension on the horizontal axis. Use extension in metres if you want the spring constant in N/m. Mark each result with a small cross.', 'springprac-plot'),
    f('Enough points', 'Take at least five measurements before the limit of proportionality, where the line starts to curve.', 'at least five', 'You need at least five measurements before the line starts to curve. That gives enough crosses to see the straight line clearly. Draw a straight line through the origin using the crosses on the straight part.', 'springprac-points'),
    f('Read the graph', 'A straight line means force and extension are directly proportional. Where it bends is the limit of proportionality.', 'straight, then bend', 'A straight line through the origin shows that extension is directly proportional to force. If the crosses start to curve, the spring has gone past its limit of proportionality. The steeper the straight part, the stiffer the spring.', 'springprac-read'),
  ],
  'P42-12': [
    f('Energy stored in a spring', 'Within the limit, Ee = ½ × k × e². Ee in joules (J), k in newtons per metre (N/m), e in metres (m).', 'half, k, e squared', 'Stretching a spring transfers energy to its elastic potential store. If the spring is not stretched past its limit of proportionality, use Ee = ½ × k × e². Ee is in joules. The spring constant k is in N/m. The extension e is in metres.', 'springprac-ee'),
    f('Convert, then square', 'A spring has k = 200 N/m and extends by 5 cm. 5 cm = 0.05 m, and 0.05² = 0.0025.', 'metres first, square second', 'A spring has a spring constant of 200 N/m. It extends by 5 cm. First change to metres: 5 ÷ 100 = 0.05 m. Then square the extension: 0.05 × 0.05 = 0.0025.', 'springprac-ee2'),
    f('Finish the sum', 'Ee = ½ × 200 × 0.0025 = 0.25 J.', 'finish with joules', 'Put the numbers in. Ee = ½ × 200 × 0.0025. Half of 200 is 100, and 100 × 0.0025 = 0.25. The energy in the elastic potential store is 0.25 J.', 'springprac-ee3'),
  ],
}
