import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { magnetFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.7.1.1 Poles of a magnet and 6.7.1.2 Magnetic fields (attraction and repulsion, magnetic materials, field lines, compass, the Earth\'s field, permanent and induced magnets), as on the supplied revision page' }
const skill = 'P-MAG-063-P'
const poles = author(skill, ['6.7.1.1'], ['aqa-physics'])
const fields = author(skill, ['6.7.1.2'], ['aqa-physics'])
const compass = author(skill, ['6.7.1.2'], ['aqa-physics'])
const types = author(skill, ['6.7.1.1', '6.7.1.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const magnetSections = [
  { id: 'P63-01', label: 'Start here', detail: 'Pushing two magnets together' },
  { id: 'P63-02', label: 'How do magnets push and pull?', detail: 'Poles, forces and magnetic materials' },
  { id: 'P63-05', label: 'What is a magnetic field?', detail: 'Field lines and where the field is strongest' },
  { id: 'P63-08', label: 'How do you see a field?', detail: 'Compasses, plotting and the Earth' },
  { id: 'P63-11', label: 'Permanent or induced?', detail: 'Two types of magnet' },
  { id: 'P63-13', label: 'On your own', detail: 'A field diagram, induced magnets and a method' },
]

const states: ScienceState[] = [
  { ...poles.choice('P63-01', 'You push the north poles of two bar magnets towards each other. What do you feel?', ['They pull together', 'They push apart', 'Nothing at all', 'They spin round'], 1, 'Think about whether the same poles or different poles pull together.', ['Two north poles are like poles, and like poles repel each other.', 'You feel the magnets pushing apart, even though they do not touch.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(poles, 'P63-02', 'How do magnets push and pull?'),
  poles.choice('P63-03', 'What happens when a north pole is brought near a south pole?', ['They attract each other', 'They repel each other', 'Nothing happens', 'They both lose their magnetism'], 0, 'Unlike poles are opposite poles.', ['Unlike poles attract each other.', 'Like poles repel.'], 'recall'),
  poles.choice('P63-04', 'Which of these materials is attracted by a magnet?', ['Copper', 'Aluminium', 'Nickel', 'Plastic'], 2, 'The magnetic materials are iron, steel, nickel and cobalt.', ['Nickel is a magnetic material, so a magnet attracts it.', 'Copper and aluminium are metals that are not magnetic. Plastic is not magnetic either.']),
  t(fields, 'P63-05', 'What is a magnetic field?'),
  fields.choice('P63-06', 'In which direction do magnetic field lines point outside a bar magnet?', ['From south to north', 'Round in circles only', 'In straight lines away from both poles', 'From north to south'], 3, 'The lines show which way a north pole would be pushed.', ['A north pole is pushed away from the north pole of the magnet and towards the south pole.', 'So the field lines go from north to south.']),
  fields.choice('P63-07', 'Where is the magnetic field around a bar magnet strongest?', ['Far from the magnet', 'At the poles', 'Halfway along the side', 'It is the same everywhere'], 1, 'Look for where the field lines are closest together.', ['The field lines are closest together at the poles.', 'So the magnetic field, and the force, are strongest at the poles.']),
  t(compass, 'P63-08', 'How do you see a field?'),
  compass.choice('P63-09', 'Why does a compass needle point north when it is far from any magnet?', ['It lines up with the magnetic field of the Earth', 'It is pulled by the Sun', 'It is attracted by the North Star', 'The needle is made of plastic'], 0, 'The needle is a tiny magnet, and a magnet lines up with a field.', ['The Earth has its own magnetic field.', 'The compass needle lines up with it, so it points north.'], 'understanding'),
  compass.choice('P63-10', 'You are plotting a field with a compass and have marked both ends of the needle. What is the next step?', ['Take the magnet away', 'Turn the magnet over', 'Move the compass so its tail is where its tip was', 'Add another magnet'], 2, 'You build the line up one small step at a time.', ['Move the compass so the tail end of the needle sits where the tip was before.', 'Then mark the ends again and repeat, and at the end join the marks to draw a field line.'], 'practicalReasoning'),
  t(types, 'P63-11', 'Permanent or induced?'),
  types.choice('P63-12', 'What is the difference between a permanent magnet and an induced magnet?', ['An induced magnet is always stronger', 'A permanent magnet only works inside a field', 'They are exactly the same', 'A permanent magnet has its own field. An induced magnet needs another field'], 3, 'One makes its own field, and the other borrows one.', ['A permanent magnet produces its own magnetic field.', 'An induced magnet is a magnetic material that only acts as a magnet while it is in a magnetic field.'], 'recall'),
  fields.choice('P63-13', 'Which numbered point is in the strongest part of the magnetic field?', ['Point 1', 'Point 2', 'Point 3', 'Point 4'], 0, 'Find where the field lines are closest together.', ['Point 1 is at a pole, where the field lines are crowded together.', 'The field is strongest there.'], 'dataInterpretation', true, 'magnet-q-field'),
  types.choice('P63-14', 'An iron nail picks up a pin while touching a magnet. The nail is then pulled away. What happens to the pin?', ['It stays held on the nail', 'It falls, because the nail quickly stops being a magnet', 'It sticks even harder', 'It changes into a magnet'], 1, 'The nail was an induced magnet only while it was in the field.', ['Away from the magnet, the nail loses all or most of its magnetism.', 'It can no longer hold the pin, so the pin falls.'], 'understanding', true),
  poles.choice('P63-15', 'The south poles of two magnets are brought close together. What happens?', ['They attract', 'They stay still', 'They repel', 'They swap poles'], 2, 'Are these like poles or unlike poles?', ['Two south poles are like poles.', 'Like poles repel each other.'], 'understanding', true),
  compass.written('P63-16', 'Describe how you would use a compass to plot the magnetic field of a bar magnet. Say what a field line shows.', 'Cover the method and the meaning of the lines.', 'Draw round the magnet on a piece of paper and put a compass next to it. Mark a dot at each end of the needle. Move the compass so the tail end is on the dot where the tip was. Repeat many times and join the dots to make a field line. Do this from several starting points. A field line goes from north to south and shows the way a north pole would be pushed.', ['Draw round the magnet and place the compass next to it.', 'Mark a dot at each end of the needle.', 'Move the compass so the tail is where the tip was, and repeat.', 'Join the dots to draw a field line.', 'A field line goes from north to south and shows the direction of the force on a north pole.'], ['Saying field lines go from south to north.', 'Saying the compass needle is not a magnet.', 'Drawing the lines as crossing each other.']),
]

export const lessonP63: ScienceLesson = {
  id: 'P-MAG-063-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Magnets and magnetic fields', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
