import type { TeachingFrame } from '../../teachingFrame'

// Force basics: vectors and scalars, force arrows, contact and non-contact forces, and interaction pairs (one clause on Newton's Third Law, taught in full later).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const contactForceFrames: Record<string, TeachingFrame[]> = {
  'P38-02': [
    f('Size and direction', 'A vector quantity has a size and a direction. A force is a vector.', 'size and direction', 'To describe a force, it is not enough to say how big it is. You also need to say which way it acts. A quantity with both a size and a direction is called a vector quantity. Force is a vector.', 'contact-vector'),
    f('Size only', 'A scalar quantity has only a size. Distance, speed, mass and time are scalars.', 'only a size', 'Some quantities have only a size, and no direction. These are called scalar quantities. Mass, temperature, time, distance and speed are scalars. Velocity, displacement and acceleration are vectors, like force.', 'contact-scalar'),
    f('Drawing a force', 'An arrow shows a force: the length shows the size and the direction shows which way it acts.', 'length, direction', 'We draw a vector as an arrow. The length of the arrow shows the size of the force. The direction of the arrow shows which way the force acts. A longer arrow means a bigger force.', 'contact-arrow'),
    f('Comparing arrows', 'Two arrows can act in opposite directions. The longer one is the bigger force.', 'longer means bigger', 'Arrows can point in different directions. Here a 10 N arrow points right and a 5 N arrow points left. The right-hand arrow is twice as long, so the force to the right is twice as big.', 'contact-compare'),
  ],
  'P38-05': [
    f('What is a force?', 'A force is a push or a pull on an object. It is measured in newtons, N.', 'push or pull, newtons', 'A force is a push or a pull that acts on an object. Forces are caused by objects interacting with each other. We measure forces in newtons, N.', 'contact-force'),
    f('Contact forces', 'A contact force acts when two objects touch.', 'objects touch', 'Some forces only act when two objects are touching. These are called contact forces. Friction, air resistance and tension in a rope are contact forces. So is the push of a table on a book.', 'contact-touch'),
    f('Non-contact forces', 'A non-contact force can act without the objects touching.', 'no touching needed', 'Some forces act across a gap, without the objects touching. These are called non-contact forces. Magnetic force, gravitational force and electrostatic force are non-contact forces.', 'contact-nontouch'),
    f('Sorting forces', 'Ask: do the objects need to touch? If yes, it is a contact force. If no, it is non-contact.', 'touch or gap', 'To sort a force, ask whether the objects need to touch. A magnet pulling a paper clip across a gap is non-contact. A hand pushing a door is contact. A ball pulled to the ground by gravity is non-contact.', 'contact-sort'),
  ],
  'P38-08': [
    f('Two objects, two forces', 'When two objects interact, a force acts on each of them.', 'force on both', 'When two objects interact, a force is produced on both of them. It is not just one object pushing or pulling the other. Each object feels a force.', 'contact-interact'),
    f('Equal and opposite', 'The two forces are equal in size but act in opposite directions. This is an interaction pair.', 'equal size, opposite way', 'The two forces are equal in size, but they act in opposite directions. Together they are called an interaction pair. If you push a wall, the wall pushes back on you with the same size of force.', 'contact-pair'),
    f('Pairs without touching', 'The Earth pulls on the Moon and the Moon pulls on the Earth. Same size, opposite directions.', 'Earth and Moon', 'Interaction pairs can be non-contact too. The Earth attracts the Moon with a gravitational force. At the same time, the Moon attracts the Earth. The two forces are the same size but act in opposite directions.', 'contact-earthmoon'),
  ],
}
