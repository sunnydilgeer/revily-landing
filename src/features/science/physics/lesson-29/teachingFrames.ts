import type { TeachingFrame } from '../../teachingFrame'

// Internal energy, what heating does, the names of the changes of state, and why a change of state is physical and mass is conserved.
// Temperature change is recalled from specific heat capacity; latent heat itself belongs to the next lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const internalFrames: Record<string, TeachingFrame[]> = {
  'P29-02': [
    f('Kinetic energy stores', 'Particles that move or vibrate store energy in their kinetic energy stores.', 'moving particles', 'A system is made up of particles, and the particles can store energy. Particles that move or vibrate store energy in their kinetic energy stores.', 'internal-kinetic'),
    f('Potential energy stores', 'Particles also store energy in potential energy stores, because of the positions of the particles.', 'positions of particles', 'Particles also store energy in their potential energy stores. This is because of the positions of the particles compared with each other.', 'internal-potential'),
    f('Internal energy', 'The internal energy of a system is the total energy its particles have in their kinetic and potential energy stores.', 'kinetic plus potential', 'Add the two together. The internal energy of a system is the total energy that its particles have in their kinetic and potential energy stores.', 'internal-total'),
  ],
  'P29-05': [
    f('Heating adds energy', 'Heating a system transfers energy to its particles, so its internal energy increases.', 'energy in', 'Heating a system transfers energy to its particles. This increases the internal energy of the system.', 'internal-heating'),
    f('Two possible results', 'More internal energy leads to a change in temperature or a change of state.', 'temperature or state', 'An increase in internal energy leads to one of two things. Either the temperature of the system changes, or the system changes state.', 'internal-two'),
    f('A change in temperature', 'When the temperature changes, the particles move faster. How much depends on mass, specific heat capacity and the energy transferred.', 'faster particles', 'When the temperature rises, the particles move faster. How much the temperature changes depends on the mass of the system, its specific heat capacity and how much energy is transferred to it. You met this in ΔE = mcΔθ.', 'internal-temp'),
    f('A change of state', 'If a solid or liquid is heated enough, it changes state. The energy breaks bonds between the particles.', 'breaking bonds', 'If a solid or liquid is heated enough, it changes state. The energy goes into breaking the bonds between the particles. This increases the energy in the potential energy stores of the particles.', 'internal-state'),
  ],
  'P29-08': [
    f('Solid and liquid', 'Melting changes a solid to a liquid. Freezing changes a liquid to a solid.', 'melting and freezing', 'Melting is when a solid changes to a liquid. Freezing is the reverse: a liquid changes to a solid.', 'internal-solidliquid'),
    f('Liquid and gas', 'Boiling or evaporating changes a liquid to a gas. Condensing changes a gas to a liquid.', 'boiling and condensing', 'Boiling or evaporating is when a liquid changes to a gas. Condensing is the reverse: a gas changes to a liquid.', 'internal-liquidgas'),
    f('Solid to gas', 'Sublimating is when a solid changes straight to a gas.', 'skipping the liquid', 'Sometimes a solid changes straight to a gas without becoming a liquid first. This is called sublimating.', 'internal-sublime'),
    f('Cooling as well as heating', 'A change of state can happen because of cooling as well as heating.', 'energy out', 'A change of state can happen because of cooling as well as heating. Cooling takes energy away from the particles, so the internal energy of the system goes down.', 'internal-map'),
  ],
  'P29-11': [
    f('A physical change', 'A change of state is a physical change, not a chemical change.', 'no new substance', 'A change of state is a physical change, not a chemical change. This means you do not end up with a new substance. The particles are just arranged in a different way.', 'internal-physical'),
    f('It can be reversed', 'If you reverse a change of state, the material gets back all the properties it had before.', 'get it all back', 'If you reverse a change of state, the material gets back all the properties it had before the change. Water that freezes and then melts is the same water again.', 'internal-reverse'),
    f('Same number of particles', 'The number of particles stays the same when the state changes.', 'nothing added or lost', 'The number of particles stays the same when the state changes. No particles are added and none are lost.', 'internal-count'),
    f('Mass is conserved', 'The number of particles stays the same, so the mass is conserved.', 'mass stays the same', 'Because the number of particles stays the same, the mass is conserved. It does not change. If 0.50 kg of ice melts, you have 0.50 kg of water.', 'internal-mass'),
  ],
}
