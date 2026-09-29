import type { TeachingFrame } from '../../teachingFrame'

// Required practical (Newton's Second Law): trolley, string, pulley, hook and masses, light gate. Preparation only.
// Weight calculation W = mg (g = 9.8 N/kg) with g -> kg conversion as an explicit step; changing mass (masses on the trolley) and changing force (masses moved to the hook).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const motionPracFrames: Record<string, TeachingFrame[]> = {
  'P49-02': [
    f('The aim', 'You test how mass and force change the acceleration of a trolley. Your teacher runs it in the lab.', 'test Newton\'s Second Law', 'This practical tests Newton\'s Second Law. You find out how the mass and the force change the acceleration of a trolley. Your teacher runs the real practical in the lab. This lesson helps you prepare for it.', 'motionprac-aim'),
    f('The equipment', 'A trolley, string, a pulley, a hook with masses, and a light gate joined to a data logger.', 'trolley and falling hook', 'A trolley sits on the bench with a piece of card on top. String joins it, over a pulley, to a hook with masses on it. When the hook falls, the trolley speeds up. A light gate joined to a data logger measures the acceleration as the card passes through.', 'motionprac-kit'),
    f('The mass', 'The mass being accelerated is the total mass of the trolley, the hook and the added masses.', 'everything that moves', 'The mass being accelerated is the total mass of the trolley, the hook and any added masses. All of them move together. Measure each mass with a mass balance.', 'motionprac-mass'),
    f('The force', 'The force that accelerates them is the weight of the hook and its masses.', 'weight of the hook', 'The force that makes the trolley accelerate is the weight of the hook and the masses on it. It is not the weight of the trolley. To find it, measure the mass of the hook and its masses, then use weight = mass × 9.8 N/kg.', 'motionprac-force'),
    f('Worked example', 'Hook and masses: 100 g = 0.10 kg. Weight = 0.10 × 9.8 = 0.98 N.', 'grams to kilograms first', 'Suppose the hook and its masses have a mass of 100 g. First change grams into kilograms: 100 g = 0.10 kg. Then weight = 0.10 × 9.8 = 0.98 N. So the force accelerating the trolley is 0.98 N.', 'motionprac-w'),
  ],
  'P49-05': [
    f('Set up', 'Join the trolley to the hook with string over the pulley. Mark a starting line.', 'starting line', 'Set up the equipment: string from the trolley, over the pulley, to the hook. Mark a starting line on the bench. This makes the trolley travel the same distance to the light gate every time.', 'motionprac-setup'),
    f('Release', 'Put the trolley on the line. Keep the string tight and not touching the table, then release.', 'tight string', 'Place the trolley on the starting line. Hold it so the string is tight and not touching the table. Then let go.', 'motionprac-release'),
    f('Record', 'Record the acceleration that the light gate measures as the trolley passes through.', 'read the data logger', 'The light gate measures the acceleration as the card on the trolley passes through. Record this value. Then reset the trolley and repeat for the next change.', 'motionprac-record'),
    f('No light gate?', 'A stopwatch and chalk marks on the table can do a similar experiment.', 'another way', 'You can do a similar experiment without a light gate. Mark chalk lines on the table and time the trolley between them with a stopwatch.', 'motionprac-alt'),
    f('Stay safe', 'Catch the falling masses with a box, keep feet clear and stop the trolley before the pulley.', 'masses can fall on feet', 'The hook and masses can fall and hurt your feet. Put a box or tray under them and keep your feet clear. Stop the trolley before it hits the pulley.', 'motionprac-safety'),
  ],
  'P49-08': [
    f('Change one thing', 'To investigate mass, change the mass but keep the force the same.', 'one variable at a time', 'To investigate the effect of mass on acceleration, change the mass of the trolley system. Keep the force the same, so the acceleration only changes because of the mass.', 'motionprac-mass1'),
    f('Not on the hook', 'The force is the weight of the hook and its masses, so do not add masses to the hook.', 'protect the force', 'The force is the weight of the hook and its masses. If you add masses to the hook, you change the force. So leave the hook as it is.', 'motionprac-mass2'),
    f('Add masses to the trolley', 'Add masses to the trolley one at a time to increase the total mass.', 'one at a time', 'Add masses to the trolley one at a time. This increases the total mass being accelerated. Record the acceleration for each total mass.', 'motionprac-mass3'),
    f('What you should find', 'As the mass goes up, the acceleration goes down.', 'more mass, less acceleration', 'You should find that as the mass goes up, the acceleration goes down. This agrees with Newton\'s Second Law. More mass gives less acceleration for the same force.', 'motionprac-mass4'),
  ],
  'P49-11': [
    f('Change one thing', 'To investigate force, change the force but keep the total mass the same.', 'one variable at a time', 'Now investigate the effect of force on acceleration. Change the force but keep the total mass of the trolley, hook and masses the same.', 'motionprac-force1'),
    f('Start with masses on the trolley', 'Begin with all the extra masses loaded onto the trolley.', 'masses on the trolley', 'Start with all the extra masses loaded onto the trolley. The hook has only its own mass on it.', 'motionprac-force2'),
    f('Move masses to the hook', 'Move masses from the trolley to the hook one at a time. The total mass stays the same, but the force increases.', 'move, do not add', 'Move the masses from the trolley to the hook, one at a time. Each move increases the force on the trolley. The total mass stays the same, because you only move masses.', 'motionprac-force3'),
    f('Record each run', 'Measure the acceleration for each new force.', 'a table of results', 'Measure the acceleration for each new force. Write the force and the acceleration in a table.', 'motionprac-force4'),
    f('What you should find', 'As the force goes up, the acceleration goes up.', 'more force, more acceleration', 'You should find that as the force goes up, the acceleration goes up. This agrees with Newton\'s Second Law. Acceleration is directly proportional to the resultant force.', 'motionprac-force5'),
  ],
}
