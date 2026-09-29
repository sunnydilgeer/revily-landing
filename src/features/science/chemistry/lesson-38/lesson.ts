import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { crudeOilFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.7.1.1 Crude oil (a finite resource formed from the remains of plankton; a mixture of hydrocarbons); 5.7.1.2 Fractions and uses; 5.7.1.3 Properties of hydrocarbons (viscosity, boiling point, flammability) and use as fuels and feedstock, as on the supplied revision page' }
const skill = 'C-CRUDE-OIL'
const formed = author(skill, ['5.7.1.1'], ['aqa-chemistry'])
const uses = author(skill, ['5.7.1.2'], ['aqa-chemistry'])
const props = author(skill, ['5.7.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const crudeOilSections = [
  { id: 'C38-01', label: 'Start here', detail: 'Where petrol comes from' },
  { id: 'C38-02', label: 'How is crude oil formed?', detail: 'Plankton, mud and millions of years' },
  { id: 'C38-06', label: 'What is crude oil used for?', detail: 'Fuels, feedstock and homologous series' },
  { id: 'C38-09', label: 'How do the hydrocarbons in it differ?', detail: 'Chain length and properties' },
  { id: 'C38-13', label: 'On your own', detail: 'Chains, data, feedstock and finite' },
]

const states: ScienceState[] = [
  { ...formed.choice('C38-01', 'Petrol and diesel are made from a dark liquid that is pumped up from rocks. What is this liquid called?', ['Crude oil', 'Natural gas', 'Vegetable oil', 'Coal tar'], 0, 'It is the fossil fuel that is drilled for, often from under the sea.', ['The dark liquid found in rocks is crude oil.', 'Petrol and diesel are made from it.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(formed, 'C38-02', 'How is crude oil formed?'),
  formed.choice('C38-03', 'What was crude oil mainly formed from?', ['Coal that was burned', 'Dinosaur bones', 'The remains of plankton buried in mud', 'Rocks melted by volcanoes'], 2, 'Think of tiny living things in the sea.', ['Crude oil formed mainly from the remains of plankton.', 'They were buried in mud and changed over millions of years.'], 'recall'),
  formed.choice('C38-04', 'Crude oil is non-renewable. What does this mean?', ['It cannot be burned as a fuel', 'It is used up much faster than it forms', 'It forms again within a few years', 'It is not a natural substance'], 1, 'Compare how long it takes to form with how fast we burn it.', ['Crude oil takes millions of years to form.', 'We use it much faster than it forms, so it is non-renewable.'], 'understanding'),
  formed.choice('C38-05', 'Crude oil is a finite resource. What does this mean?', ['It is very expensive', 'It is found only in rocks', 'It cannot be used up', 'It will run out one day'], 3, 'Finite means there is a limit.', ['A finite resource has a limited amount.', 'So one day crude oil will run out.'], 'recall'),
  t(uses, 'C38-06', 'What is crude oil used for?'),
  uses.choice('C38-07', 'Which of these is a fuel that comes from crude oil?', ['Diesel oil', 'Ethanol from sugar cane', 'Hydrogen from water', 'Charcoal from wood'], 0, 'Think about what a lorry runs on.', ['Diesel oil, kerosene, heavy fuel oil and LPG come from crude oil.', 'The others are made from plants or water.'], 'recall'),
  uses.choice('C38-08', 'What is a feedstock?', ['A fuel burned in engines', 'A waste gas from burning', 'A raw material used in a chemical process', 'A finished plastic product'], 2, 'It is what you feed into the process.', ['A feedstock is a raw material for a chemical process.', 'The petrochemical industry uses crude oil compounds as a feedstock to make polymers and other products.'], 'understanding'),
  t(props, 'C38-09', 'How do the hydrocarbons in it differ?'),
  props.choice('C38-10', 'Two hydrocarbons are compared. Which statement about the one with the shorter chain is correct?', ['It is thicker and gloopier', 'It has a lower boiling point', 'It has a higher boiling point', 'It is harder to set alight'], 1, 'Short chains are the "light" ones. Think of gas and petrol against tar.', ['The shorter the chain, the lower the boiling point.', 'It is also runnier and easier to ignite.'], 'recall'),
  props.choice('C38-11', 'Hydrocarbons X, Y and Z have 4, 8 and 20 carbon atoms. Which is the most viscous?', ['X', 'Y', 'They are all the same', 'Z'], 3, 'Viscous means thick and gloopy. Which chain is longest?', ['The longer the chain, the more viscous the hydrocarbon.', 'Z has the longest chain, so Z is the most viscous.'], 'application'),
  props.choice('C38-12', 'Which hydrocarbon is the easiest to set alight?', ['The one with the shortest chain', 'The one with the longest chain', 'The one with the highest boiling point', 'The one that is the most viscous'], 0, 'The shorter the chain, the more flammable.', ['Short-chain hydrocarbons are the most flammable.', 'Long chains, high boiling points and high viscosity all go together, so they are harder to ignite.'], 'understanding'),
  props.choice('C38-13', 'Two hydrocarbon molecules, A and B, are shown. Which one flows more easily?', ['Neither, they flow the same way', 'Molecule B, because it is longer', 'Molecule A, because it has the shorter chain', 'It depends on the colour'], 2, 'Compare the length of the two carbon chains.', ['Molecule A has a much shorter chain than B.', 'The shorter the chain, the runnier the hydrocarbon, so A flows more easily.'], 'application', true, 'crude-q-chains'),
  props.choice('C38-14', 'The table shows three hydrocarbons. Which conclusion do the data support?', ['All hydrocarbons boil below 100 °C', 'In these three, the boiling point rises as the chain gets longer', 'A hydrocarbon with 20 carbon atoms boils at exactly 340 °C', 'The boiling point does not depend on chain length'], 1, 'Stick to what the three rows show. Does the table tell you about a chain with 20 carbon atoms?', ['The boiling points go up from 36 °C to 174 °C to 287 °C as the chains get longer.', 'The table cannot tell us the exact boiling point of a chain that is not in it.'], 'dataInterpretation', true, 'crude-q-table'),
  uses.choice('C38-15', 'A factory uses compounds from crude oil as the raw material to make detergents. What is crude oil in this process?', ['A solvent', 'A catalyst', 'A lubricant', 'A feedstock'], 3, 'It is the raw material for a chemical process.', ['A raw material for a chemical process is called a feedstock.', 'Here the crude oil compounds are turned into detergents.'], 'application', true),
  formed.written('C38-16', 'Explain why crude oil is called a finite, non-renewable resource.', 'Say how it formed and how long that took. Then compare how fast it forms with how fast we use it.', 'Crude oil formed from the remains of plankton that were buried in mud millions of years ago. It takes millions of years to form. We use it much faster than it is being made, so it is non-renewable. The amount is limited, so it is finite and will run out one day.', ['Crude oil formed from the remains of plankton (and other sea life) buried in mud.', 'It took millions of years to form.', 'We use it up much faster than it forms, so it is non-renewable.', 'The amount is limited, so it is finite and will run out one day.'], ['Saying it formed from dinosaurs or from coal.', 'Saying non-renewable means it cannot be burned or is not natural.', 'Saying it will run out with no reason about the rate of use.']),
]

export const lessonC38: ScienceLesson = {
  id: 'C-ORG-038-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Crude oil', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
