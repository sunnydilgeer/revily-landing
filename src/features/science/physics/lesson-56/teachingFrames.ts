import type { TeachingFrame } from '../../teachingFrame'

// Refraction: what it is, what the lines on a ray diagram mean, the five drawing steps, and using a protractor (worked example, 40 degrees).
// No wavefronts, no "bends towards or away from the normal" rule: the page does not ask for them.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const refractionFrames: Record<string, TeachingFrame[]> = {
  'P56-02': [
    f('A wave meets a boundary', 'A boundary is the edge where one material meets another.', 'wave, boundary, new material', 'A wave can travel from one material into another. For example, light can go from air into water. The place where the two materials meet is called a boundary.', 'refract-boundary'),
    f('Waves can change direction', 'When a wave crosses a boundary it can change direction. This is called refraction.', 'boundary, new direction', 'When a wave crosses a boundary between two materials, it can change direction. This change of direction is called refraction. It is why a straw in a glass of water looks bent at the surface.', 'refract-idea'),
    f('It needs an angle', 'A wave is only refracted if it meets the boundary at an angle.', 'angle means bend', 'A wave that meets the boundary at an angle is refracted. A wave that goes straight in, at a right angle to the boundary, carries on in the same direction.', 'refract-angle'),
    f('The materials decide how much', 'How much a wave is refracted depends on the two materials it passes between.', 'two materials, one bend', 'Light going from air into glass bends by one amount. Light going from air into water bends by a different amount. So the size of the bend depends on the two materials.', 'refract-materials'),
  ],
  'P56-05': [
    f('Rays are straight lines', 'A ray is a straight line that shows the path a wave travels along.', 'ray means straight path', 'A ray diagram shows the path a wave takes. Each ray is drawn as a straight line with an arrow on it. Always use a ruler, so the rays are neat and straight.', 'refract-rays'),
    f('The normal', 'The normal is a dotted line drawn at right angles to the boundary.', 'right angles to the boundary', 'First draw the boundary between the two materials. Then draw a dotted line at right angles to it. This dotted line is called the normal. Normal just means at right angles.', 'refract-normal'),
    f('The incident ray', 'The incident ray is the ray that travels towards the boundary.', 'the ray that arrives', 'The ray that travels towards the boundary is called the incident ray. It meets the boundary at the point where the normal crosses it.', 'refract-incident'),
    f('The angle of incidence', 'The angle of incidence is the angle between the incident ray and the normal.', 'measure from the normal', 'Angles are always measured from the normal, never from the boundary. The angle between the incident ray and the normal is called the angle of incidence.', 'refract-aoi'),
    f('The refracted ray', 'The refracted ray is the bent ray on the other side. The angle of refraction is the angle between it and the normal.', 'new direction, new angle', 'After crossing the boundary, the ray carries on in a new direction. This bent ray is called the refracted ray. The angle between the refracted ray and the normal is called the angle of refraction.', 'refract-aor'),
  ],
  'P56-08': [
    f('Step 1: the boundary', 'Start with a ruler-straight line for the boundary between the two materials.', 'boundary first', 'Use a ruler and a sharp pencil. Draw a straight line across the page for the boundary. Write the name of the material above it and the material below it.', 'refract-step1'),
    f('Step 2: the normal', 'Draw a dotted line at right angles to the boundary. This is the normal.', 'dotted, at right angles', 'Use a protractor to find 90° to the boundary. Draw a dotted line up and down through the boundary. This is the normal.', 'refract-step2'),
    f('Step 3: the incident ray', 'Use a ruler to draw the incident ray so it meets the normal at the boundary.', 'ruler, arrow, meets the normal', 'Draw a straight line from above the boundary to the point where the normal crosses it. Add an arrow to show which way the ray travels. Measure the angle of incidence from the normal.', 'refract-step3'),
    f('Step 4: the refracted ray', 'Draw the refracted ray on the other side of the boundary, starting at the same point.', 'same point, other side', 'Start at the same point on the boundary. Draw a straight line into the second material, in its new direction. Add an arrow that points away from the boundary.', 'refract-step4'),
    f('Step 5: mark the angles', 'Label the angle of incidence and the angle of refraction. Both are measured from the normal.', 'label both angles', 'Now label the two angles, one on each side of the boundary. Both are measured from the normal. Check that every ray is straight and the arrows follow the path of the wave.', 'refract-step5'),
  ],
  'P56-11': [
    f('Find the centre point', 'Put the centre mark of the protractor on the point where the boundary and the normal cross.', 'centre mark on the crossing', 'We want an incident ray with an angle of incidence of 40°. Place the protractor so that its centre mark sits exactly on the point where the boundary and the normal cross.', 'refract-prot1'),
    f('Line up the base line', 'Turn the protractor so its flat base line lies along the normal.', 'measure from the normal', 'The angle must be measured from the normal. So turn the protractor until its flat base line lies along the normal.', 'refract-prot2'),
    f('Mark the angle', 'Start at 0° on the normal and make a small pencil dot at 40°.', 'start at zero, then dot', 'Start counting from 0° on the normal. Most protractors have two scales, so check you are using the right one. Make a small dot at 40°.', 'refract-prot3'),
    f('Draw the ray', 'Take the protractor away. Use a ruler to join the dot to the centre point.', 'ruler through the dot', 'Take the protractor away. Line up a ruler with your dot and the centre point. Draw a straight incident ray through both and add an arrow.', 'refract-prot4'),
  ],
}
