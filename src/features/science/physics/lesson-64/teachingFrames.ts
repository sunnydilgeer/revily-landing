import type { TeachingFrame } from '../../teachingFrame'

// Electromagnetism: the field round a current-carrying wire, the right-hand thumb rule, strength, solenoids and electromagnets.
// The motor effect and Fleming's left-hand rule are not part of this lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const electromagFrames: Record<string, TeachingFrame[]> = {
  'P64-02': [
    f('A current makes a field', 'A current flowing through a wire creates a magnetic field around the wire.', 'current in, field around', 'A current flowing through a wire creates a magnetic field around it. The field is made up of circles around the wire. There is no field when the current is switched off.', 'emag-wire'),
    f('See it with a compass', 'A compass near the wire points along the field. Use it to draw the field, as you did with a bar magnet.', 'compass shows direction', 'You can see the field by placing a compass near the wire. The needle moves to point in the direction of the field. You can move the compass round the wire and draw the field lines, just as you did for a bar magnet.', 'emag-compass'),
    f('The right-hand thumb rule', 'Point your right thumb along the current and curl your fingers. Your fingers show the direction of the field.', 'thumb = current, fingers = field', 'The right-hand thumb rule tells you which way the field goes. Point your right thumb in the direction of the current. Curl your fingers. The direction of your fingers is the direction of the field.', 'emag-thumb'),
    f('Reverse the current', 'Reversing the current reverses the direction of the field.', 'swap current, swap field', 'Swap the direction of the current and the magnetic field reverses. The circles are the same shape, but the arrows point the other way. You can check this with the thumb rule: point your thumb the other way and your fingers curl the other way.', 'emag-reverse'),
  ],
  'P64-05': [
    f('Closer is stronger', 'The closer you are to the wire, the stronger the field.', 'near the wire', 'The magnetic field is strongest right next to the wire. The closer you are to the wire, the stronger the field gets. In a drawing, the field lines are closer together nearer the wire.', 'emag-distance'),
    f('More current is stronger', 'The larger the current in the wire, the stronger the field.', 'bigger current, bigger field', 'The larger the current through the wire, the stronger the magnetic field. Doubling the current makes the field stronger at every point. The field lines are drawn closer together.', 'emag-current'),
  ],
  'P64-08': [
    f('A solenoid is a coil', 'Wrap a wire into a coil and it is called a solenoid.', 'a coil of wire', 'If you wrap a wire into a coil, it is called a solenoid. Many loops of wire sit next to each other. When a current flows through the coil, each loop makes its own magnetic field.', 'emag-coil'),
    f('The field of a solenoid', 'Outside, the field looks like a bar magnet. Inside, it is strong and uniform.', 'bar magnet shape', 'The field outside a solenoid is just like the field of a bar magnet. The field inside the solenoid is strong and uniform. Uniform means it has the same strength and direction everywhere.', 'emag-solenoid'),
    f('Why a coil is stronger', 'The field lines from each loop line up, so they end up close together and pointing the same way.', 'loops add up', 'Wrapping a wire into a solenoid makes the field stronger than the field of a straight wire. The field lines around each loop line up with each other. Lots of field lines end up close together, pointing in the same direction.', 'emag-loops'),
    f('An iron core', 'Putting a block of iron in the coil makes the field even stronger. A solenoid with an iron core is an electromagnet.', 'coil + iron = electromagnet', 'You can make the field even stronger by putting a block of iron inside the coil. A solenoid with an iron core is called an electromagnet. An electromagnet can be switched off, which a permanent magnet cannot.', 'emag-core'),
  ],
}
