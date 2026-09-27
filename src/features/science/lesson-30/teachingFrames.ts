import type { TeachingFrame } from '../teachingFrame'

// Follow one body through changing conditions: why levels are kept steady, the three parts that do the work,
// then what happens when a level is too high or too low.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const homeostasisFrames: Record<string, TeachingFrame[]> = {
  'B30-02': [
    f('Kept steady', 'Some conditions inside you stay at the right level.', 'temperature, glucose, water', 'Your body keeps some conditions inside it steady. Your body temperature stays close to 37 °C. The amount of glucose in your blood and the amount of water in your body are kept steady too.', 'nerve-home-levels'),
    f('Why it matters', 'Cells and enzymes need the right conditions.', 'right conditions → enzymes work', 'Your cells need the right conditions to work properly. This includes the right conditions for their enzymes. You met enzymes when you learned how food is digested. If you got much too hot, your enzymes would change shape and stop working.', 'nerve-home-enzyme'),
    f('Homeostasis', 'Homeostasis keeps conditions at the right level as things change.', 'changes happen → levels kept right', 'Conditions keep changing, outside and inside your body. A hot day is a change outside. Muscles working hard are a change inside. Keeping the conditions in your body and cells at the right level, as these changes happen, is called homeostasis.', 'nerve-home-changes'),
    f('Control systems', 'Automatic control systems do the work.', 'automatic: nerves or hormones', 'Your body keeps conditions steady using control systems. They are automatic, so you do not have to think about them. They work using your nerves or chemicals called hormones. You will learn about nerves in the next lesson.', 'nerve-home-control'),
  ],
  'B30-05': [
    f('A change', 'A change in the environment is a stimulus.', 'stimulus = a change', 'You step out of a warm house into a cold wind. The temperature around you drops. A change in the environment like this is called a stimulus. Two or more of them are called stimuli.', 'nerve-parts-stimulus'),
    f('Receptors', 'Receptors detect a stimulus.', 'receptor = detects', 'Cells in your skin detect that the air has got colder. Cells that detect a stimulus are called receptors.', 'nerve-parts-receptor'),
    f('Coordination centres', 'A coordination centre decides what to do.', 'coordination centre = processes, then organises', 'The receptors send information to a coordination centre. It receives and processes the information, then organises a response. The brain, the spinal cord and the pancreas are all coordination centres.', 'nerve-parts-centre'),
    f('Effectors', 'Effectors carry out the response.', 'effector = responds', 'The coordination centre sends information on to effectors. Effectors are the parts that produce a response, such as muscles. Here, the response helps bring your body temperature back up.', 'nerve-parts-effector'),
    f('Put it together', 'Receptor → coordination centre → effector.', 'detect → decide → do', 'Every control system has these three parts. Receptors detect the stimulus. The coordination centre organises a response. Effectors carry out the response.', 'nerve-parts-all'),
  ],
  'B30-08': [
    f('The optimum', 'Each condition has an ideal level.', 'optimum = the ideal level', 'For each condition, there is a best level for your cells. This ideal level is called the optimum. The real level drifts a little above and below it.', 'nerve-loop-optimum'),
    f('Too high', 'If the level is too high, it is brought down.', 'too high → decrease', 'Say the level rises too high. Receptors detect the change, and the coordination centre organises a response. Effectors then decrease the level, back towards the optimum.', 'nerve-loop-high'),
    f('Too low', 'If the level is too low, it is brought up.', 'too low → increase', 'If the level falls too low, the same three parts work the other way. Receptors detect the fall. Effectors then increase the level, back towards the optimum.', 'nerve-loop-low'),
    f('Put it together', 'The level is kept close to the optimum.', 'rise → brought down; fall → brought up', 'The control system keeps working all the time. Each time the level moves away from the optimum, it is brought back. So the level always stays close to the optimum.', 'nerve-loop-all'),
  ],
}
