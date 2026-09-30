import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { electromagFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.7.2.1 Magnetic fields and electromagnets (field around a wire carrying a current, right-hand thumb rule, solenoids, iron core electromagnets), as on the supplied revision page' }
const skill = 'P-MAG-064-P'
const wire = author(skill, ['6.7.2.1'], ['aqa-physics'])
const strength = author(skill, ['6.7.2.1'], ['aqa-physics'])
const coil = author(skill, ['6.7.2.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const electromagSections = [
  { id: 'P64-01', label: 'Start here', detail: 'The scrapyard crane' },
  { id: 'P64-02', label: 'How does a wire make a field?', detail: 'Circles, the thumb rule and reversing' },
  { id: 'P64-05', label: 'What makes the field stronger?', detail: 'Distance and current' },
  { id: 'P64-08', label: 'What is an electromagnet?', detail: 'Solenoids and iron cores' },
  { id: 'P64-11', label: 'On your own', detail: 'Strength, solenoids and a description' },
]

const states: ScienceState[] = [
  { ...wire.choice('P64-01', 'A scrapyard crane lifts old cars with a magnet that can be switched on and off. What is the magnet?', ['A hot metal plate', 'A huge compass', 'A coil of wire with a current flowing through it', 'A big magnet glued to the crane'], 2, 'A permanent magnet cannot be switched off. What can?', ['A current in a coil of wire makes a magnetic field.', 'Switch the current off and the magnetism goes, so the cars drop.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(wire, 'P64-02', 'How does a wire make a field?'),
  wire.choice('P64-03', 'What shape is the magnetic field around a straight wire carrying a current?', ['Circles around the wire', 'Straight lines along the wire', 'Lines pointing straight out from the wire', 'There is no field'], 0, 'Picture looking down the wire from the end.', ['The field is made up of circles around the wire.', 'A compass near the wire shows its direction.'], 'recall'),
  wire.choice('P64-04', 'In the right-hand thumb rule, what does your thumb point along?', ['The direction of the field', 'Away from the wire', 'Towards the compass', 'The direction of the current'], 3, 'Your fingers curl to show the field.', ['Point your right thumb in the direction of the current.', 'Your curled fingers then show the direction of the field.'], 'understanding'),
  t(strength, 'P64-05', 'What makes the field stronger?'),
  strength.choice('P64-06', 'Where is the magnetic field around a wire strongest?', ['Far from the wire', 'Close to the wire', 'Only at the ends', 'It is the same everywhere'], 1, 'Think about where the field lines are closest together.', ['The closer you are to the wire, the stronger the field.', 'The field lines are closest together near the wire.'], 'understanding'),
  strength.choice('P64-07', 'The current through a wire is made larger. What happens to the field?', ['It gets stronger', 'It gets weaker', 'It reverses direction', 'It stays the same'], 0, 'A larger current has more effect.', ['The larger the current, the stronger the magnetic field.', 'Reversing the current changes the direction, not the strength.'], 'understanding'),
  t(coil, 'P64-08', 'What is an electromagnet?'),
  coil.choice('P64-09', 'What is the magnetic field like inside a solenoid?', ['Weak and different in every place', 'Zero', 'Strong and uniform', 'Only found at the ends'], 2, 'Uniform means the same everywhere.', ['Inside a solenoid the field is strong and uniform.', 'Uniform means it has the same strength and direction everywhere.'], 'recall'),
  coil.choice('P64-10', 'What is an electromagnet?', ['A solenoid with an iron core', 'A straight wire with no current', 'Two bar magnets taped together', 'A compass with a wire round it'], 0, 'It is a coil plus something that makes the field stronger.', ['A solenoid with an iron core is called an electromagnet.', 'The iron makes the field even stronger.'], 'recall'),
  wire.choice('P64-11', 'Which numbered point has the stronger magnetic field?', ['Point 2', 'Point 1', 'Both are the same', 'Neither has a field'], 1, 'Look for the point closer to the wire.', ['Point 1 is closer to the wire, so the field is stronger there.', 'Field strength gets less as you move away from the wire.'], 'dataInterpretation', true, 'emag-q-wire'),
  coil.choice('P64-12', 'Which change would make an electromagnet stronger?', ['Reducing the current', 'Removing the iron core', 'Putting an iron block in the coil', 'Uncoiling the wire'], 2, 'There are two ways: more current, or an iron core.', ['An iron core makes the field stronger.', 'A smaller current or a straight wire would make it weaker.'], 'understanding', true),
  coil.choice('P64-13', 'Which numbered part of the solenoid has a strong, uniform field?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 3, 'It is not outside the coil.', ['Part 4 is inside the coil, where the field is strong and uniform.', 'The field outside a solenoid is like that of a bar magnet and is weaker.'], 'dataInterpretation', true, 'emag-q-solenoid'),
  wire.written('P64-14', 'Describe the magnetic field around a wire carrying a current, and explain how to make a strong electromagnet.', 'Cover the shape of the field, what changes its strength, and the coil with an iron core.', 'The field around a straight wire is a set of circles around the wire. The field is stronger closer to the wire and when the current is larger. Reversing the current reverses the direction of the field. To make an electromagnet, wrap the wire into a coil, which is a solenoid, and put an iron core inside it. The coil makes the field stronger and the iron makes it stronger still.', ['The field is circles around the wire.', 'The field is stronger closer to the wire.', 'The field is stronger with a larger current.', 'Wrap the wire into a coil (a solenoid).', 'Put an iron core in the coil to make an electromagnet.'], ['Saying the field goes along the wire in straight lines.', 'Saying that the field is stronger far from the wire.', 'Saying an electromagnet is a permanent magnet.']),
]

export const lessonP64: ScienceLesson = {
  id: 'P-MAG-064-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Electromagnetism', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
