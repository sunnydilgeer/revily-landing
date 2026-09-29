import type { TeachingFrame } from '../../teachingFrame'

// Magnets and magnetic fields: poles and forces, field lines, plotting with a compass, the Earth's field, permanent and induced magnets.
// Contact and non-contact forces were met earlier in Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const magnetFrames: Record<string, TeachingFrame[]> = {
  'P63-02': [
    f('Two poles', 'Every magnet has a north pole and a south pole.', 'north-seeking, south-seeking', 'Every magnet has two poles. One is the north pole, or north seeking pole. The other is the south pole, or south seeking pole. The poles are at the ends of a bar magnet, where the magnetism is strongest.', 'magnet-poles'),
    f('Like poles repel, unlike poles attract', 'Two like poles push apart. Two unlike poles pull together.', 'same repel, different attract', 'Bring two magnets close together and each pole exerts a force on the other. Two like poles, such as north and north, repel each other. Two unlike poles, such as north and south, attract each other. This is a non-contact force, because the magnets do not have to touch.', 'magnet-forces'),
    f('Magnetic materials', 'Iron, steel, nickel and cobalt are magnetic materials. A magnet attracts them.', 'not all metals', 'A magnetic material is one that feels a force in a magnetic field. Iron, steel, nickel and cobalt are magnetic materials. Not all metals are magnetic. Copper and aluminium, for example, are not attracted by a magnet.', 'magnet-materials'),
  ],
  'P63-05': [
    f('The magnetic field', 'A magnetic field is the region around a magnet where other magnets or magnetic materials feel a force.', 'a region of force', 'Every magnet has a magnetic field around it. This is the region where another magnet, or a magnetic material, feels a force. You cannot see the field, but you can draw it.', 'magnet-field'),
    f('Field lines', 'Field lines go from north to south. They show the way a north pole would be pushed.', 'north to south', 'You show a magnetic field by drawing magnetic field lines with arrows. The lines go from the north pole to the south pole. At any point, a line shows which way the force would push a north pole placed there.', 'magnet-lines'),
    f('Where is the field strongest?', 'Lines close together mean a stronger field. It is strongest at the poles.', 'crowded lines, strong field', 'Where the field lines are closer together, the magnetic field is stronger. The closer you are to a magnet, the stronger the field is. The field is strongest at the poles, so the magnetic force is strongest there too.', 'magnet-strength'),
  ],
  'P63-08': [
    f('A compass is a tiny magnet', 'The needle of a compass is a tiny bar magnet. It points in the direction of the magnetic field.', 'needle follows the field', 'The needle of a compass is a tiny bar magnet that can spin freely. It lines up with any magnetic field it is in. The north end of the needle points in the direction of the field.', 'magnet-compass'),
    f('Plotting a field', 'Mark the ends of the needle, move the compass along, and join up the marks.', 'dot, dot, move, repeat', 'Draw round a magnet on a piece of paper and place a compass by it. Mark a dot at each end of the needle. Move the compass so that the tail end of the needle is where the tip was. Repeat many times, then join the dots to draw one field line.', 'magnet-plot'),
    f('The Earth is a magnet', 'Far from any magnet, a compass points north, because the Earth has its own magnetic field.', 'core of the Earth', 'When a compass is not near a magnet, it always points north. It is lining up with the magnetic field of the Earth. This means the inside, or core, of the Earth must be magnetic.', 'magnet-earth'),
  ],
  'P63-11': [
    f('Permanent and induced', 'A permanent magnet has its own magnetic field. An induced magnet is a magnetic material that becomes a magnet in a field.', 'own field or borrowed field', 'There are two types of magnet. A permanent magnet always produces its own magnetic field. An induced magnet is a magnetic material that turns into a magnet when it is put in a magnetic field.', 'magnet-types'),
    f('Induced magnetism does not last', 'Take an induced magnet away from the field and it quickly loses all or most of its magnetism.', 'field gone, magnetism gone', 'An iron nail placed against a magnet can pick up a pin. The nail has become an induced magnet. Take the nail away from the field and it quickly stops being a magnet. A permanent magnet and an induced magnet always attract each other.', 'magnet-induced'),
  ],
}
