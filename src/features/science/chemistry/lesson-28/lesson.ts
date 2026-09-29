import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { exoEndoFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.5.1.1 Energy transfer during exothermic and endothermic reactions, as on the supplied revision page' }
const skill = 'C-ENERGY-CHANGES'
const store = author(skill, ['5.5.1.1'], ['aqa-chemistry'])
const types = author(skill, ['5.5.1.1'], ['aqa-chemistry'])
const uses = author(skill, ['5.5.1.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const exoEndoSections = [
  { id: 'C28-01', label: 'Start here', detail: 'Where does the heat come from?' },
  { id: 'C28-02', label: 'Where does the energy go?', detail: 'Stored, moved and conserved' },
  { id: 'C28-05', label: 'Exothermic or endothermic?', detail: 'Energy out or energy in' },
  { id: 'C28-08', label: 'Examples and uses', detail: 'Hand warmers, cans and cold packs' },
  { id: 'C28-11', label: 'On your own', detail: 'New reactions, a diagram and some data' },
]

const states: ScienceState[] = [
  { ...store.choice('C28-01', 'A candle burns and warms the air around it. Where does the heat energy come from?', ['It is made from nothing as the wax burns', 'The chemicals store energy that is given out', 'It is taken in from the cool room'], 1, 'Think about the wax and oxygen before and after the burning.', ['The chemicals store energy, and burning gives some of it out as heat.', 'Energy is not made from nothing.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(store, 'C28-02', 'Where does the energy go?'),
  store.choice('C28-03', 'In a reaction the products store less energy than the reactants. What happens to the extra energy?', ['It is given out to the surroundings', 'It is destroyed', 'It is taken in from the surroundings', 'It stays inside the products'], 0, 'Energy cannot vanish. Where else can it go?', ['The products store less, so some energy is left over.', 'That extra energy is given out to the surroundings.']),
  store.choice('C28-04', 'Energy is conserved in a chemical reaction. What does this mean?', ['Energy is used up as the products form', 'The products always store the same energy as the reactants', 'Energy is moved around but never made or destroyed', 'Energy is always given out to the surroundings'], 2, 'Conserved means the total stays the same.', ['The total energy before and after is the same.', 'It can move between the chemicals and the surroundings, but it is not made or destroyed.']),
  t(types, 'C28-05', 'Exothermic or endothermic?'),
  types.choice('C28-06', 'The temperature of a reaction mixture rises from 20 °C to 31 °C. What type of reaction is this?', ['Endothermic, because energy was taken in', 'Neither, because energy is conserved', 'Exothermic, because energy was given out'], 2, 'Rising temperature means the surroundings gained energy.', ['The mixture and its surroundings got warmer.', 'That means energy was given out, so it is exothermic.']),
  types.choice('C28-07', 'Which statement describes an endothermic reaction?', ['Energy is given out and the temperature rises', 'Energy is given out and the temperature falls', 'Energy is taken in and the temperature rises', 'Energy is taken in and the temperature falls'], 3, 'Endo- means in. What does taking energy in do to the surroundings?', ['Endothermic means energy is taken in from the surroundings.', 'So the surroundings lose energy and the temperature falls.']),
  t(uses, 'C28-08', 'Examples and uses'),
  uses.choice('C28-09', 'Which of these is an exothermic reaction?', ['Thermal decomposition of a compound', 'Burning natural gas in a boiler', 'Citric acid reacting with sodium hydrogencarbonate', 'A reaction inside a sports injury pack'], 1, 'Which one is a fuel burning?', ['Burning fuels (combustion) give out energy.', 'The other three take in energy, so they are endothermic.']),
  uses.choice('C28-10', 'A sports injury pack gets cold without being put in a freezer. What type of reaction happens inside?', ['Endothermic, because it takes in energy from the surroundings', 'Exothermic, because it gives out energy', 'Neither, because the pack is sealed', 'Combustion, because it is a fuel'], 0, 'Cold means the surroundings have lost energy.', ['The pack gets colder, so it takes in energy.', 'A reaction that takes in energy is endothermic.']),
  uses.choice('C28-11', 'Which pair correctly matches a reaction with its type?', ['Neutralisation: endothermic', 'Thermal decomposition: exothermic', 'Burning a fuel: exothermic', 'Hand warmer: endothermic'], 2, 'Think which examples give out energy to warm things.', ['Burning fuels give out energy, so they are exothermic.', 'Neutralisation and hand warmers are exothermic; thermal decomposition is endothermic.'], 'application', true),
  uses.choice('C28-12', 'Each pair of bars shows energy stored before and after a reaction. Which reaction would make its surroundings colder?', ['Pair 1', 'Pair 2', 'Pair 3', 'None of them'], 2, 'Colder means energy is taken in. In which pair do the products store more?', ['Colder surroundings mean energy was taken in.', 'That happens when the products store more energy than the reactants, as in pair 3.'], 'application', true, 'exo-question-bars'),
  types.choice('C28-13', 'A student mixes reactants in a polystyrene cup and records the temperatures in the table. Which conclusion do the data support?', ['Reaction B took in energy from its surroundings', 'Reaction A took in energy from its surroundings', 'Reaction C is endothermic because the temperature changed', 'All three reactions gave out energy'], 0, 'Compare each end temperature with its start temperature.', ['Reaction B fell from 22 °C to 14 °C, so energy was taken in.', 'Reactions A and C rose, so they gave out energy.'], 'dataInterpretation', true, 'exo-question-data'),
  store.choice('C28-14', 'A student says: “This reaction gave out heat, so the energy has disappeared.” Which reply is correct?', ['Yes, giving out heat destroys energy', 'Yes, but only in endothermic reactions', 'No, the products must have more energy than before', 'No, the energy has moved to the surroundings, so it is conserved'], 3, 'Where did the heat go?', ['The heat warmed the surroundings, so the energy has moved there.', 'Energy is conserved. It is never destroyed.'], 'understanding', true),
  types.written('C28-15', 'Explain why a self-heating drinks can gets hot but a sports injury pack gets cold. Use the words energy and surroundings.', 'Say which reaction gives out energy and which takes it in, and what that does to the temperature.', 'The self-heating can uses an exothermic reaction. It gives out energy to the surroundings, so the drink warms up. The sports injury pack uses an endothermic reaction. It takes in energy from the surroundings, so the pack gets cold.', ['The can uses an exothermic reaction, which gives out energy to the surroundings.', 'The energy given out warms the drink, so the temperature rises.', 'The injury pack uses an endothermic reaction, which takes in energy from the surroundings.', 'Taking energy in makes the pack, and what touches it, colder, so the temperature falls.'], ['Saying that cold is made or added, or that the pack "loses" energy to make cold.', 'Mixing up exothermic and endothermic.', 'Saying that energy is created in the can or destroyed in the pack.']),
]

export const lessonC28: ScienceLesson = {
  id: 'C-NRG-028-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Exothermic and endothermic reactions', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
