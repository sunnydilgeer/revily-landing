import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { crackingFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.7.1.4 Cracking and alkenes (catalytic and steam cracking, the bromine water test, completing a cracking equation), as on the supplied revision page' }
const skill = 'C-CRACKING'
const why = author(skill, ['5.7.1.4'], ['aqa-chemistry'])
const how = author(skill, ['5.7.1.4'], ['aqa-chemistry'])
const test = author(skill, ['5.7.1.4'], ['aqa-chemistry'])
const equation = author(skill, ['5.7.1.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const crackingSections = [
  { id: 'C40-01', label: 'Start here', detail: 'Lots of thick oil, not enough petrol' },
  { id: 'C40-02', label: 'Why crack hydrocarbons?', detail: 'Smaller, more useful molecules' },
  { id: 'C40-05', label: 'How is cracking done?', detail: 'Steam cracking and catalytic cracking' },
  { id: 'C40-08', label: 'How do you test for an alkene?', detail: 'Bromine water' },
  { id: 'C40-11', label: 'Can you complete the equation?', detail: 'Balancing carbons and hydrogens' },
  { id: 'C40-13', label: 'On your own', detail: 'Tests, methods and equations' },
]

const states: ScienceState[] = [
  { ...why.choice('C40-01', 'A refinery has lots of thick heavy oil but customers want more petrol. What could the refinery do?', ['Split the heavy oil into smaller molecules', 'Burn the heavy oil and sell the smoke', 'Add water to the heavy oil', 'Cool the heavy oil until it is petrol'], 0, 'Petrol is made of shorter molecules than heavy oil.', ['Heavy oil has long molecules and petrol has short ones.', 'Splitting long molecules into smaller ones makes more of what is wanted.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(why, 'C40-02', 'Why crack hydrocarbons?'),
  why.choice('C40-03', 'What is cracking?', ['Joining small molecules into long ones', 'Splitting long-chain hydrocarbons into smaller molecules', 'Separating crude oil by boiling point', 'Burning hydrocarbons in air'], 1, 'The word tells you something breaks apart.', ['Cracking splits long-chain hydrocarbons into smaller, more useful molecules.', 'Separating crude oil into fractions is a different process, fractional distillation.'], 'recall'),
  why.choice('C40-04', 'Why are the alkenes made by cracking a useful starting material?', ['They are less reactive than alkanes', 'They are more reactive than alkanes, so they can be made into other compounds', 'They cannot burn', 'They are the same as alkanes'], 1, 'Think about how reactive they are.', ['Alkenes are more reactive than alkanes.', 'That makes them a good starting material, for example for making polymers.']),
  t(how, 'C40-05', 'How is cracking done?'),
  how.choice('C40-06', 'In which method are the vaporised hydrocarbons mixed with steam and heated to a very high temperature?', ['Steam cracking', 'Catalytic cracking', 'Fractional distillation', 'Both, in exactly the same way'], 0, 'One method is named after what is added.', ['In steam cracking the vapour is mixed with steam and heated to a very high temperature.', 'Catalytic cracking uses a hot catalyst instead.']),
  how.choice('C40-07', 'What is the catalyst in catalytic cracking?', ['Steam', 'Bromine water', 'Powdered aluminium oxide', 'Crude oil'], 2, 'It is a hot powder that the vapour passes over.', ['The vapour is passed over hot powdered aluminium oxide.', 'The long molecules split apart on the surface of the catalyst.'], 'recall'),
  t(test, 'C40-08', 'How do you test for an alkene?'),
  test.choice('C40-09', 'Bromine water is shaken with a hydrocarbon and stays orange. What does this show?', ['The hydrocarbon is an alkene', 'The hydrocarbon is not an alkene', 'The bromine has been used up', 'There is no hydrocarbon in the tube'], 1, 'An alkene would change the colour.', ['Bromine water only reacts with alkenes.', 'It stayed orange, so there was no reaction and the hydrocarbon is not an alkene.']),
  test.choice('C40-10', 'What happens when orange bromine water is shaken with an alkene?', ['It stays orange', 'It turns colourless', 'It turns blue', 'It turns solid'], 1, 'The bromine reacts and the colour goes.', ['The bromine reacts with the alkene.', 'The product is colourless, so the mixture turns from orange to colourless.'], 'recall'),
  t(equation, 'C40-11', 'Can you complete the equation?'),
  equation.choice('C40-12', 'Dodecane, C₁₂H₂₆, cracks into octane, C₈H₁₈, and one other product. What is the formula of the other product?', ['C₄H₈', 'C₂₀H₄₄', 'C₄H₁₀', 'C₈H₈'], 0, 'Subtract the carbons, then subtract the hydrogens.', ['Carbon atoms: 12 − 8 = 4.', 'Hydrogen atoms: 26 − 18 = 8. So the other product is C₄H₈.'], 'calculation'),
  test.choice('C40-13', 'After shaking with bromine water, tube 2 is colourless and tubes 1 and 3 stay orange. Which tube held an alkene?', ['Tube 1', 'Tube 3', 'None of them', 'Tube 2'], 3, 'Look for the colour change.', ['Only an alkene turns bromine water colourless.', 'Tube 2 changed colour, so it held an alkene.'], 'dataInterpretation', true, 'crack-q-tubes'),
  how.choice('C40-14', 'Hydrocarbon vapour is passed over hot powdered aluminium oxide. Which cracking method is this?', ['Steam cracking', 'Thermal distillation', 'Catalytic cracking', 'Fractional distillation'], 2, 'Look for the catalyst.', ['Aluminium oxide is the catalyst.', 'A hot catalyst used to split vaporised hydrocarbons is catalytic cracking.'], 'application', true),
  equation.choice('C40-15', 'Octane, C₈H₁₈, is cracked into hexane, C₆H₁₄, and one other product. What is the formula of the other product?', ['C₂H₄', 'C₂H₆', 'C₁₄H₃₂', 'C₄H₄'], 0, 'Find the missing carbons first, then the missing hydrogens.', ['Carbon atoms: 8 − 6 = 2.', 'Hydrogen atoms: 18 − 14 = 4. So the other product is C₂H₄.'], 'calculation', true),
  why.choice('C40-16', 'Which statement about cracking is correct?', ['It makes long-chain hydrocarbons from short ones', 'It only makes alkanes', 'It splits long molecules into smaller ones, including alkenes', 'It happens at room temperature without heating'], 2, 'Think about what breaks, and what is made.', ['Cracking splits long-chain hydrocarbons into smaller molecules.', 'The products include alkanes for fuels and alkenes, and heating is needed.'], 'understanding', true),
  why.written('C40-17', 'Explain why crude oil fractions are cracked, and describe how you could show that one of the products is an alkene.', 'Demand for fuels, then the bromine water colour change.', 'Cracking is done because there is a high demand for fuels with small molecules, and crude oil has too many long-chain hydrocarbons. Cracking splits the long molecules into smaller, more useful ones, and also makes alkenes. To show that a product is an alkene, shake it with orange bromine water. If it is an alkene the bromine water turns colourless.', ['There is a high demand for short-chain hydrocarbons such as petrol.', 'Crude oil contains more long-chain hydrocarbons than are needed.', 'Cracking splits long chains into smaller, more useful molecules.', 'Test: shake the product with orange bromine water.', 'An alkene turns the bromine water from orange to colourless.'], ['Saying that cracking joins small molecules together.', 'Saying bromine water turns colourless for an alkane.', 'Saying the bromine water turns from colourless to orange.']),
]

export const lessonC40: ScienceLesson = {
  id: 'C-ORG-040-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Cracking', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
