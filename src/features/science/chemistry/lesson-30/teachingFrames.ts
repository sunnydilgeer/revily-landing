import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section, built up step by step. Activation energy first (every reaction has it), then the exothermic
// profile, then the endothermic profile, then the two side by side. Exo/endo definitions are only recapped here.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const profileFrames: Record<string, TeachingFrame[]> = {
  'C30-02': [
    f('A picture of the energy', 'A reaction profile is a graph that shows how the energy changes during a reaction.', 'energy up the side, progress along the bottom', 'A reaction profile shows what happens to energy as a reaction goes from start to finish. Energy is on the vertical axis. Progress of the reaction is along the bottom. The line starts at the reactants and ends at the products.', 'profile-what'),
    f('The hump', 'The activation energy is the minimum energy the reactants need before they can react.', 'up the hill before the reaction can start', 'The line always rises before it falls. The size of that rise is the activation energy. It is the smallest amount of energy the particles need when they collide for the reaction to happen. It is drawn as an arrow from the reactants to the top of the peak.', 'profile-ea'),
    f('Bigger hump, harder start', 'The greater the activation energy, the more energy is needed to start the reaction.', 'taller peak → more energy needed', 'Here are two reactions that start at the same energy. Reaction B has a taller peak than reaction A. So B has the greater activation energy. That means more energy has to be put in to get B started.', 'profile-ea-compare'),
    f('Where the energy comes from', 'The activation energy has to be supplied, for example by heating.', 'heat lifts the reactants over the hump', 'The reactants do not have this energy by themselves. It must be supplied, often by heating the reaction mixture. Once enough particles have the energy, the reaction can start.', 'profile-ea-heat'),
  ],
  'C30-05': [
    f('Products end up lower', 'In an exothermic reaction the products are at a lower energy than the reactants.', 'exothermic: products lower', 'You already know that an exothermic reaction gives out energy to its surroundings. On a reaction profile, this shows up as products that are lower than the reactants. The line finishes below where it started.', 'profile-exo-shape'),
    f('The drop is the energy given out', 'The difference in height between reactants and products is the overall energy change.', 'height gap = energy given out', 'Draw a dashed line across from the reactants. The gap down to the products is the overall energy change. In an exothermic reaction, this is the energy given out to the surroundings.', 'profile-exo-delta'),
    f('The rise at the start', 'Even an exothermic reaction needs activation energy to get started.', 'rise at the start = energy needed to start', 'The line still rises at the start of the reaction. This rise is the activation energy, the energy needed to start it. A match must be struck before it burns, even though burning gives out lots of energy.', 'profile-exo-ea'),
    f('The whole exothermic profile', 'Activation energy up, then a bigger drop down to lower products.', 'up to start, then down: energy given out', 'Put it all together. The reaction mixture gets warmer because energy passes to the surroundings. The particles themselves end up with less energy than they began with. That is why the products are lower on the profile.', 'profile-exo-all'),
  ],
  'C30-08': [
    f('Products end up higher', 'In an endothermic reaction the products are at a higher energy than the reactants.', 'endothermic: products higher', 'An endothermic reaction takes in energy from its surroundings. On a reaction profile, this shows up as products that are higher than the reactants. The line finishes above where it started.', 'profile-endo-shape'),
    f('The rise is the energy taken in', 'The difference in height shows the overall energy change: the energy taken in.', 'height gap = energy taken in', 'Draw a dashed line across from the reactants. The gap up to the products is the overall energy change. In an endothermic reaction, this is the energy taken in from the surroundings.', 'profile-endo-delta'),
    f('Activation energy again', 'The rise at the start is still the activation energy.', 'the start of the line rises in both kinds', 'The line rises at the start, just as it does for an exothermic reaction. This rise is the activation energy. The line then falls a little to the products, which stay above the reactants.', 'profile-endo-all'),
    f('Side by side', 'Exothermic: products lower, energy given out. Endothermic: products higher, energy taken in.', 'compare where the products finish', 'Both profiles have a hump for the activation energy. The difference is where the line finishes. Products lower than the reactants means exothermic. Products higher than the reactants means endothermic.', 'profile-compare'),
  ],
}
