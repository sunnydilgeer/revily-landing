import type { TeachingFrame } from '../../teachingFrame'

// The particle model for solids, liquids and gases (arrangement and energy), then gas pressure and its link to temperature at fixed volume.
// States of matter are also met in Chemistry; here the focus is energy and gas pressure.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const gasParticleFrames: Record<string, TeachingFrame[]> = {
  'P27-02': [
    f('Same particles, three states', 'The particles of a substance are always the same, whatever state it is in.', 'the particle stays the same', 'Everything is made up of small particles. The particles of a substance are always the same, whatever state it is in. So a single particle of ice is exactly the same as a single particle of water.', 'gaspart-same'),
    f('Solids', 'In a solid, strong forces hold the particles close in a fixed, regular pattern. They only vibrate.', 'fixed and vibrating', 'In a solid, strong forces hold the particles close together in a fixed, regular pattern. The particles have the least energy, so they can only vibrate about their fixed positions.', 'gaspart-solid'),
    f('Liquids', 'In a liquid, the forces are slightly weaker. The particles are close but in an irregular pattern, and they move past each other.', 'close but free to slide', 'In a liquid, slightly weaker forces hold the particles close together in an irregular pattern. They have more energy than in a solid. They move past each other in random directions at low speeds.', 'gaspart-liquid'),
    f('Gases', 'In a gas, there are almost no forces between the particles. They have the most energy and move constantly.', 'far apart and fast', 'In a gas there are almost no forces between the particles, so they are not held close together. They have more energy than in a liquid. They constantly move in random directions at a range of high speeds.', 'gaspart-gas'),
  ],
  'P27-06': [
    f('Free to move', 'The particles in a gas are free to move around.', 'moving freely', 'The particles in a gas are free to move around. They travel in straight lines until they hit something.', 'gaspart-free'),
    f('Collisions', 'They collide with each other and with the sides of the container they are in.', 'bumping into walls', 'Gas particles collide with each other. They also collide with the sides of the container they are in. Each bump against a wall gives it a tiny push.', 'gaspart-collide'),
    f('Force over an area is pressure', 'When particles hit a surface they apply a force. The force applied over a given area is called pressure.', 'force spread over area', 'When a particle hits something, it applies a force to it. The force applied over a given area is called pressure. Millions of particles hitting a wall every second together create the pressure of the gas.', 'gaspart-pressure'),
  ],
  'P27-09': [
    f('Temperature and energy', 'The temperature of a gas depends on the average energy in the kinetic energy stores of its particles.', 'average kinetic energy', 'The temperature of a gas depends on the average energy in the kinetic energy stores of its particles. A hotter gas has a higher average kinetic energy.', 'gaspart-temp'),
    f('Faster particles', 'A hotter gas has a higher average kinetic energy, so its particles move faster on average.', 'hotter, so faster', 'Higher average kinetic energy means the particles move faster on average. So heating a gas makes its particles speed up.', 'gaspart-faster'),
    f('Harder and more often', 'Faster particles hit the container more often and with more force. This increases the pressure.', 'more hits, bigger hits', 'Faster particles hit the sides of the container more often and with more force. This increases the overall force on the container. So increasing the temperature of a gas increases its pressure.', 'gaspart-harder'),
    f('Only if the volume stays the same', 'This only works if the space the gas takes up, its volume, does not change.', 'fixed volume', 'This only works if the space the gas takes up, called its volume, does not change. In a sealed, rigid container the volume is fixed. Cooling the gas does the opposite, so its pressure goes down.', 'gaspart-volume'),
  ],
}
