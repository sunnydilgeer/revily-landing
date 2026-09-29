import type { TeachingFrame } from '../../teachingFrame'

// Preparation for the infrared absorption investigation (melting wax). The online lesson prepares students;
// the practical is done in the lab with a teacher (Bunsen burner, hot wax).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const irAbsorbFrames: Record<string, TeachingFrame[]> = {
  'P61-02': [
    f('The surface matters again', 'How much infrared radiation a material absorbs also depends on its surface.', 'absorb means take in', 'When infrared radiation hits an object, the object can absorb it. That means the energy is taken in. How much it absorbs depends on the surface. You can test this with a simple experiment.', 'irabsorb-idea'),
    f('The equipment', 'You need a Bunsen burner, candle wax, two metal plates and two metal balls.', 'burner, wax, plates, balls', 'You need a Bunsen burner, some candle wax, two metal plates and two metal balls. The two plates must be identical, except for their back surfaces. One plate has a black back and the other has a white back. Your teacher runs this practical in the lab.', 'irabsorb-kit'),
    f('The set-up', 'Stand the Bunsen burner on a heat-proof mat. Put the two plates either side of it, backs facing the flame.', 'flame in the middle', 'Put the Bunsen burner on a heat-proof mat. Stand the plates on either side of it so that the backs face the flame. The black back is on one side and the white back on the other. The flame is the source of infrared radiation.', 'irabsorb-setup'),
  ],
  'P61-05': [
    f('Fix the balls', 'Use hot candle wax to stick a metal ball to the front of each plate.', 'wax holds the ball', 'Melt a little candle wax. Use it to stick one metal ball to the front of each plate. Use the same amount of wax each time. Then leave the wax to cool. It will harden and hold each ball in place.', 'irabsorb-wax'),
    f('Same distance from the flame', 'Face the backs of the plates towards the flame, both the same distance away.', 'a fair test', 'Turn the plates so that their backs face the flame. Place them the same distance from the flame. If the distances were different, the result would not be a fair test.', 'irabsorb-distance'),
    f('Watch and record', 'Record which ball falls first.', 'the first to fall', 'Light the Bunsen burner and watch the balls. Record which ball falls off first. Take care: the burner, the plates and the wax all get hot.', 'irabsorb-fall'),
  ],
  'P61-08': [
    f('Energy is absorbed', 'The plate absorbs infrared radiation from the flame. Energy is transferred to the thermal store of the wax.', 'IR in, wax warms', 'The plates absorb infrared radiation given out by the Bunsen burner. Energy is transferred by radiation to the thermal store of the wax. The wax warms up and starts to melt. Then the ball falls.', 'irabsorb-melt'),
    f('Which ball falls first?', 'The ball on the black plate falls first.', 'better absorber, quicker fall', 'The ball on the plate that is better at absorbing infrared radiation falls first. You should find that the ball on the plate with the black back falls first.', 'irabsorb-result'),
    f('Black is a good absorber', 'Black surfaces are better absorbers of infrared radiation than white ones. Black surfaces are also better emitters.', 'absorb and emit', 'This means the black surface is better at absorbing infrared radiation than the white surface. In the last lesson you found that black surfaces are also better emitters. A surface that is good at one is good at the other.', 'irabsorb-link'),
  ],
}
