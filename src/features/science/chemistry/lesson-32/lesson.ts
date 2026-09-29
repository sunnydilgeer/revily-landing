import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { rateFactorFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.6.1.2 Factors which affect the rates of chemical reactions, 5.6.1.3 Collision theory and activation energy and 5.6.1.4 Catalysts, as on the supplied revision page' }
const skill = 'C-RATE-FACTORS'
const temp = author(skill, ['5.6.1.2', '5.6.1.3'], ['aqa-chemistry'])
const conc = author(skill, ['5.6.1.2', '5.6.1.3'], ['aqa-chemistry'])
const area = author(skill, ['5.6.1.2', '5.6.1.3'], ['aqa-chemistry'])
const cat = author(skill, ['5.6.1.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const rateFactorSections = [
  { id: 'C32-01', label: 'Start here', detail: 'Sugar in hot and cold tea' },
  { id: 'C32-02', label: 'Temperature', detail: 'Hotter means faster' },
  { id: 'C32-05', label: 'Concentration and pressure', detail: 'More particles in the same space' },
  { id: 'C32-08', label: 'Surface area', detail: 'Lumps against powder' },
  { id: 'C32-11', label: 'Catalysts', detail: 'A lower activation energy' },
  { id: 'C32-14', label: 'On your own', detail: 'Choosing and explaining the factor' },
]

const states: ScienceState[] = [
  { ...temp.choice('C32-01', 'Sugar dissolves faster in hot tea than in iced tea. Which idea best explains this?', ['The sugar is heavier in hot tea', 'The particles move faster in hot tea', 'Hot tea has fewer particles'], 1, 'Think about what heat does to particles.', ['In hot liquid the particles move faster, so they meet more often.', 'This is the same idea that speeds up many reactions.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(temp, 'C32-02', 'Temperature'),
  temp.choice('C32-03', 'Why does raising the temperature make a reaction faster?', ['Particles move faster, collide more often and more collisions have enough energy', 'Particles get bigger and are easier to hit', 'The activation energy gets much lower', 'More reactants are made'], 0, 'Two things change: how often, and how energetic.', ['Hotter particles collide more often.', 'They also have more energy, so more collisions reach the activation energy.'], 'recall'),
  temp.choice('C32-04', 'A reaction is repeated at a higher temperature. Everything else is the same. What does the graph line look like?', ['Less steep and ends higher', 'Steeper, goes flat sooner, and ends at the same height', 'Steeper and ends higher', 'The same as before'], 1, 'Faster reaction, same amount of reactants.', ['A faster reaction has a steeper line that goes flat sooner.', 'The amounts of reactants are the same, so the final height is the same.']),
  t(conc, 'C32-05', 'Concentration and pressure'),
  conc.choice('C32-06', 'What is different about a more concentrated solution?', ['The particles move faster', 'It has more reactant particles in the same volume', 'It has fewer reactant particles', 'It has a lower activation energy'], 1, 'Concentration is about how crowded the particles are.', ['A more concentrated solution has more particles in the same volume.', 'This makes collisions more frequent.']),
  conc.choice('C32-07', 'What happens to a gas reaction when the pressure is increased?', ['The gas particles get smaller', 'The gas particles are further apart', 'The particles stop moving', 'The particles are closer together, so collisions are more frequent'], 3, 'Same number of particles, smaller space.', ['The same number of gas particles take up a smaller space.', 'They collide more often, so the rate increases.'], 'understanding'),
  t(area, 'C32-08', 'Surface area'),
  area.choice('C32-09', 'A lump of solid is crushed into a powder. What happens to the surface area of the same mass?', ['It is bigger', 'It is smaller', 'It stays the same', 'It depends on the temperature'], 0, 'Think about how many outside surfaces there are.', ['Breaking a solid into small pieces gives a much bigger surface area.', 'More particles are then on the outside where they can be hit.'], 'recall'),
  area.choice('C32-10', 'Why does a powder react faster than a lump of the same mass?', ['The powder particles have more energy', 'The powder has a higher concentration', 'The powder is at a higher temperature', 'More of its particles are exposed, so collisions are more frequent'], 3, 'Where can the other reactant meet the solid?', ['A powder has more particles on its surface.', 'That means more collisions with the other reactant each second.']),
  t(cat, 'C32-11', 'Catalysts'),
  cat.choice('C32-12', 'What is a catalyst?', ['A substance that speeds up a reaction and is not used up', 'A reactant that is used up quickly', 'A product that slows the reaction', 'A substance that raises the activation energy'], 0, 'It helps the reaction but is not part of it.', ['A catalyst speeds up a reaction and is not used up.', 'It is not in the equation.'], 'recall'),
  cat.choice('C32-13', 'How does a catalyst make a reaction faster?', ['It heats the mixture', 'It adds more reactant particles', 'It gives a different pathway with a lower activation energy', 'It makes the products lower in energy'], 2, 'Think about the peak on the profile.', ['The new pathway has a lower activation energy.', 'So more collisions have enough energy to react.']),
  temp.choice('C32-14', 'Which flask has the fastest reaction, if everything else is the same?', ['Flask 1', 'Flask 2', 'Flask 3', 'Flask 4'], 3, 'Look at the number of particles and how they move.', ['Flask 4 has the most particles in the same volume, so collisions are most frequent.', 'Flask 1 has the fewest.'], 'dataInterpretation', true, 'rfac-q-flasks'),
  cat.choice('C32-15', 'Which arrow shows the activation energy of the reaction with the catalyst?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'None of them'], 1, 'Find the lower peak first.', ['The catalyst gives the lower peak. Arrow 2 goes from the reactants to that peak.', 'Arrow 1 is the activation energy without a catalyst.'], 'understanding', true, 'rfac-q-profile'),
  temp.choice('C32-16', 'The dashed line is the original reaction. Which numbered line shows it at a lower temperature?', ['Line 1', 'Line 2', 'Line 3'], 2, 'Cooler particles collide less often.', ['A lower temperature means a slower reaction.', 'Line 3 starts less steep and takes longer to go flat, at the same height.'], 'dataInterpretation', true, 'rfac-q-graph'),
  area.choice('C32-17', '2 g of zinc strip and 2 g of zinc powder are added to the same acid. Which reacts faster, and why?', ['The strip, because it is one piece', 'The strip, because it has a larger surface area', 'They react at the same rate, as the mass is the same', 'The powder, because it has a larger surface area'], 3, 'Compare how much surface each has.', ['The same mass of powder has a much larger surface area.', 'More particles are exposed, so collisions are more frequent and the rate is faster.'], 'application', true),
  conc.written('C32-18', 'Use collision theory to explain why a reaction is faster in a more concentrated solution.', 'What is different about the number of particles, and what does that change about collisions?', 'A more concentrated solution has more reactant particles in the same volume. The particles are closer together, so they collide more often. More collisions each second means more successful collisions each second. So the rate of reaction increases.', ['States that there are more particles in the same volume.', 'Says collisions are more frequent.', 'Links more frequent collisions to more successful collisions per second.', 'Concludes that the rate increases.'], ['Saying the particles move faster.', 'Saying the particles have more energy.', 'Saying the solution makes more product in total.']),
]

export const lessonC32: ScienceLesson = {
  id: 'C-RAT-032-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'What changes the rate of a reaction', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
