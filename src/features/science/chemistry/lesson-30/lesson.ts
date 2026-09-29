import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { profileFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.5.1.2 Reaction profiles (energy level diagrams: activation energy, and the overall energy change of exothermic and endothermic reactions), as on the supplied revision page' }
const skill = 'C-ENERGY-PROFILES'
const activation = author(skill, ['5.5.1.2'], ['aqa-chemistry'])
const exo = author(skill, ['5.5.1.2'], ['aqa-chemistry'])
const endo = author(skill, ['5.5.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const profileSections = [
  { id: 'C30-01', label: 'Start here', detail: 'Why a fire needs a spark' },
  { id: 'C30-02', label: 'Activation energy', detail: 'The hump at the start of every reaction' },
  { id: 'C30-05', label: 'Exothermic profiles', detail: 'Products lower, energy given out' },
  { id: 'C30-08', label: 'Endothermic profiles', detail: 'Products higher, energy taken in' },
  { id: 'C30-11', label: 'On your own', detail: 'Reading profiles and drawing one' },
]

const states: ScienceState[] = [
  { ...activation.choice('C30-01', 'A gas hob needs a spark to light, then keeps burning by itself. What does the spark do?', ['It removes energy from the gas', 'It supplies the energy to start the reaction', 'It makes the gas react without any energy'], 1, 'The burning gives out lots of energy, but something has to get it going.', ['The spark supplies the energy the reaction needs to start.', 'Once it is burning, the energy given out keeps it going.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(activation, 'C30-02', 'Activation energy'),
  activation.choice('C30-03', 'What is the activation energy of a reaction?', ['The energy given out by the reaction', 'The energy of the products', 'The minimum energy the reactants need to react', 'The energy of the surroundings'], 2, 'It is the size of the rise at the start of the profile.', ['Activation energy is the minimum energy the particles need when they collide for a reaction to happen.', 'It is the rise from the reactants to the top of the peak.'], 'recall'),
  activation.choice('C30-04', 'Reaction X has a greater activation energy than reaction Y. What does this mean?', ['More energy is needed to start X', 'X gives out more energy overall', 'X needs no heating', 'X finishes faster'], 0, 'Think about the height of the peak.', ['A taller peak means a greater activation energy.', 'So more energy has to be supplied, for example by heating, to start reaction X.']),
  t(exo, 'C30-05', 'Exothermic profiles'),
  exo.choice('C30-06', 'On a reaction profile the products are lower than the reactants. What kind of reaction is it?', ['Endothermic, because energy is taken in', 'It has no activation energy', 'Neither, because the energy stays the same', 'Exothermic, because energy is given out'], 3, 'Where has the energy gone if the products are lower?', ['Products at a lower energy mean energy has been given out.', 'A reaction that gives out energy is exothermic.']),
  exo.choice('C30-07', 'An exothermic reaction makes a solution warmer. What has happened to the energy of the chemicals?', ['It has increased', 'It has decreased, because energy went to the surroundings', 'It has stayed the same', 'It has been destroyed'], 1, 'Where did the heat in the solution come from?', ['The chemicals lose energy and it passes to the surroundings.', 'That is why the products are lower on the profile and the mixture feels warmer.'], 'understanding'),
  t(endo, 'C30-08', 'Endothermic profiles'),
  endo.choice('C30-09', 'On a reaction profile the products are higher than the reactants. What does the gap in height show?', ['Energy given out', 'The activation energy', 'Energy taken in', 'The energy of the reactants'], 2, 'Products higher means energy went in.', ['The gap in height is the overall energy change.', 'For an endothermic reaction it is the energy taken in from the surroundings.']),
  endo.choice('C30-10', 'Which statement is true for both exothermic and endothermic reaction profiles?', ['The line starts with a rise for the activation energy', 'The products are below the reactants', 'The products are above the reactants', 'There is no peak'], 0, 'Look at how each line begins.', ['Both kinds of reaction need activation energy to get started.', 'Only where the products finish is different.']),
  activation.choice('C30-11', 'Which numbered arrow shows the activation energy?', ['Arrow 3', 'Arrow 1', 'Arrow 2', 'None of them'], 1, 'It starts at the reactants and goes up to the top of the peak.', ['Arrow 1 goes from the reactants to the top of the peak, so it is the activation energy.', 'Arrow 2 shows the overall energy change. Arrow 3 is a different gap.'], 'understanding', true, 'profile-q-arrows'),
  exo.choice('C30-12', 'Which profile shows an exothermic reaction?', ['Profile 1 only', 'Both profiles', 'Neither profile', 'Profile 2 only'], 3, 'Where do the products finish compared with the reactants?', ['In profile 2 the products are lower, so energy is given out.', 'That means profile 2 is exothermic. Profile 1 is endothermic.'], 'application', true, 'profile-q-pair'),
  activation.choice('C30-13', 'Reactions P and Q have the profiles shown. Which statement is supported?', ['Q needs more energy to start than P', 'P gives out more energy than Q', 'P is endothermic and Q is exothermic', 'Q is the faster reaction'], 0, 'Compare the heights of the two peaks.', ['Q has the taller peak, so its activation energy is greater.', 'Both end at the same level, so the overall energy change is the same. The profile does not show speed.'], 'dataInterpretation', true, 'profile-q-two'),
  exo.choice('C30-14', 'Methane burns in oxygen and gives out heat. Where are the products on its reaction profile?', ['Higher than the reactants', 'Level with the reactants', 'Below the reactants', 'At zero energy'], 2, 'Burning is exothermic.', ['Burning fuels gives out energy, so it is exothermic.', 'The products of an exothermic reaction are lower than the reactants.'], 'application', true),
  exo.written('C30-15', 'Methane burns: CH₄ + 2O₂ → CO₂ + 2H₂O. Describe how to draw and label its reaction profile.', 'Which is higher, reactants or products? Then add the activation energy and the overall energy change.', 'Draw axes with energy up the side and progress of reaction along the bottom. Start with a flat line for the reactants, CH₄ and 2O₂. Draw a peak, then let the line fall to a flat line for the products, CO₂ and 2H₂O, which is lower than the reactants. Label the rise from the reactants to the top of the peak as the activation energy. Label the difference in height between the reactants and products as the energy given out.', ['Axes labelled energy and progress of reaction.', 'Reactants (CH₄ and O₂) drawn at a higher level than the products (CO₂ and H₂O).', 'The line rises to a peak between reactants and products.', 'The rise from the reactants to the peak is labelled as the activation energy.', 'The gap between the reactant and product levels is labelled as the energy given out.'], ['Drawing the products higher than the reactants.', 'Labelling the peak-to-products drop as the overall energy change.', 'Leaving out the peak.']),
]

export const lessonC30: ScienceLesson = {
  id: 'C-NRG-030-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Reaction profiles', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
