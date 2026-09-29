import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section: temperature, concentration and pressure, surface area, then catalysts. Each factor is explained with
// collision theory (from the previous lesson). The catalyst profile is only shown, not re-taught.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const rateFactorFrames: Record<string, TeachingFrame[]> = {
  'C32-02': [
    f('Hotter particles move faster', 'When the temperature goes up, the particles move faster.', 'hot = fast-moving particles', 'Four things can change the rate of a reaction. The first is temperature. In a hot mixture the particles move faster than in a cold one. Cold particles drift slowly. Hot particles rush about.', 'rfac-temp-move'),
    f('More collisions', 'Faster particles collide more often.', 'faster = more collisions each second', 'Fast-moving particles meet each other more often. So there are more collisions every second. More collisions means more chances for a reaction.', 'rfac-temp-collide'),
    f('More energy in each collision', 'Hotter particles also have more energy, so more collisions are successful.', 'more energy = more collisions reach the activation energy', 'Hotter particles carry more energy. So a greater share of collisions have at least the activation energy. Collisions happen more often, and more of them work. Both effects make the reaction faster.', 'rfac-temp-energy'),
    f('On a graph', 'A higher temperature gives a steeper line that goes flat sooner.', 'steeper, flat sooner, same height', 'On a graph of product against time, the hotter reaction has the steeper line. It goes flat sooner. It ends at the same height, because the amount of reactants has not changed.', 'rfac-temp-graph'),
  ],
  'C32-05': [
    f('More particles in the same space', 'A more concentrated solution has more particles in the same volume.', 'concentrated = crowded', 'The second factor is concentration. Concentration is how much reactant is dissolved in a given volume of solution. A more concentrated solution has more reactant particles in the same volume. The particles are more crowded.', 'rfac-conc-more'),
    f('More frequent collisions', 'With more particles in the same space, collisions are more frequent.', 'crowded = more collisions', 'When particles are crowded together, they collide more often. More collisions per second means a faster reaction. The particles do not move faster, and there are simply more of them to meet.', 'rfac-conc-collide'),
    f('Pressure in a gas', 'Raising the pressure of a gas squeezes the same number of particles into a smaller space.', 'more pressure = same particles, smaller space', 'The same idea works for gases, but the change is pressure. Raising the pressure squeezes the same number of gas particles into a smaller space. They are closer together, so they collide more often. The reaction is faster.', 'rfac-pressure'),
  ],
  'C32-08': [
    f('Big lumps, small pieces', 'The same amount of solid has a bigger surface area when it is broken into smaller pieces.', 'small pieces = more surface', 'The third factor is the surface area of a solid. Only the outside of a lump can meet the other reactant. Break the lump into small pieces and the same amount of solid has a much bigger surface area.', 'rfac-sa-pieces'),
    f('More particles exposed', 'Smaller pieces put more of the solid\'s particles where they can be hit.', 'more exposed particles', 'In one big lump, most particles are buried inside and cannot be reached. In powder, far more particles are on the surface. Scientists say that the surface area to volume ratio has increased.', 'rfac-sa-exposed'),
    f('More frequent collisions', 'More exposed particles means more collisions with the other reactant, so a faster reaction.', 'more surface = more collisions', 'More particles of the solid are available to the particles of the other reactant. So collisions are more frequent. A powder reacts faster than a lump of the same mass.', 'rfac-sa-collide'),
  ],
  'C32-11': [
    f('What a catalyst does', 'A catalyst is a substance that speeds up a reaction without being used up.', 'speeds up, not used up', 'The fourth factor is a catalyst. A catalyst speeds up a reaction. None of it is used up in the reaction. So you can get it back at the end and use it again.', 'rfac-cat-what'),
    f('A different pathway', 'A catalyst gives the reaction a different pathway with a lower activation energy.', 'lower hump = easier start', 'A catalyst works by giving the reaction a different pathway. The new pathway has a lower activation energy. So less energy is needed, and more collisions are successful.', 'rfac-cat-pathway'),
    f('On a profile', 'On a reaction profile, the catalyst lowers the peak but the reactants and products stay at the same levels.', 'peak lower, start and end unchanged', 'Here is the same reaction with and without a catalyst. The catalysed line has a lower peak. The reactants and the products are at the same levels as before.', 'rfac-cat-profile'),
    f('Using catalysts', 'Different reactions need different catalysts. Enzymes are biological catalysts.', 'a catalyst is not part of the equation', 'A catalyst is not a reactant or a product, so it is not in the equation. Different reactions need different catalysts. Enzymes are the catalysts in living things.', 'rfac-cat-notes'),
  ],
}
