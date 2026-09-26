import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { digestionFrames as frames } from './teachingFrames'

const biology = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.1 Digestive enzymes, bile and required food tests' }
const practical = { id: 'aqa-practical', title: 'AQA 8464 practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.3 Required practical 3; Biology AT2' }
const handbook = { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Teacher notes pp12–13; student worksheet pp63–65; school risk assessment governs the practical' }
const a = author('B-DIGESTION', ['4.2.2.1'])
const p = author('B-FOOD-TESTS', ['4.2.2.1', '10.2.3'], ['aqa-biology', 'aqa-practical', 'aqa-handbook'])
const t = (id: keyof typeof frames, title: string) => (Number(id.slice(3)) >= 11 ? p : a).teach(id, title, frames[id])

export const digestionSections = [
  { id: 'B9-01', label: 'Start here', detail: 'Why bread tastes sweet' },
  { id: 'B9-02', label: 'Break the meal down', detail: 'Carbohydrases, proteases and lipases' },
  { id: 'B9-05', label: 'Where do the enzymes work?', detail: 'Mouth, stomach and small intestine' },
  { id: 'B9-07', label: 'Finish in the small intestine', detail: 'Bile, then absorption into the blood' },
  { id: 'B9-11', label: 'Test a food sample', detail: 'Safety, sugar, starch and protein' },
  { id: 'B9-14', label: 'Test for fat, then decide', detail: 'Lipid tests, observations and conclusions' },
  { id: 'B9-16', label: 'On your own', detail: 'Digest, absorb and test' },
]

const states: ScienceState[] = [
  { ...a.choice('B9-01', 'Chew a piece of bread for a long time and it starts to taste sweet. Why?', ['Chewing adds sugar to the bread', 'An enzyme in saliva breaks starch down into sugar', 'The bread melts in your warm mouth'], 1, 'Think back to enzymes: what does amylase do to starch?', ['Saliva contains amylase, an enzyme.', 'Amylase speeds up breaking starch into sugar, so the bread starts to taste sweet.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B9-02', 'Break the meal down'),
  a.choice('B9-03', 'Bread is mostly starch. Which group of enzymes breaks starch down?', ['Proteases', 'Carbohydrases', 'Lipases'], 1, 'Starch is a carbohydrate.', ['Starch is a carbohydrate.', 'Carbohydrases, such as amylase, break carbohydrates into sugars.']),
  a.choice('B9-04', 'Lipase breaks down the fat in the cheese. What does it make?', ['Amino acids', 'Simple sugars', 'Glycerol and fatty acids', 'Starch'], 2, 'Which products did the fat screen show?', ['Lipases break down lipids, which are fats and oils.', 'So the products are glycerol and fatty acids.']),
  t('B9-05', 'Where do the enzymes work?'),
  a.choice('B9-06', 'Where are lipases made?', ['In the pancreas and small intestine', 'In the salivary glands', 'In the stomach'], 0, 'Where does fat digestion happen?', ['Lipases work only in the small intestine.', 'They are made in the pancreas and in the small intestine itself.']),
  t('B9-07', 'Finish in the small intestine'),
  a.choice('B9-08', 'Which statement about bile is correct?', ['It is an enzyme made in the stomach', 'It is made in the gall bladder and stored in the liver', 'It is made in the liver and stored in the gall bladder'], 2, 'Which organ makes bile, and which one stores it?', ['The liver makes bile.', 'The gall bladder stores it, so bile is made in the liver and stored in the gall bladder.']),
  a.choice('B9-09', 'How does emulsifying fat help lipase?', ['It gives more surface area, so lipase works faster', 'It breaks fat into glycerol and fatty acids', 'It makes the fat dissolve in stomach acid'], 0, 'Compare one big drop with many tiny droplets.', ['Many tiny droplets have more surface area than one big drop.', 'So lipase can work on more fat at once, and fat is digested faster.']),
  a.choice('B9-10', 'The cheese has been digested into amino acids. What happens to them next?', ['They are digested again by lipase', 'They stay in the small intestine for good', 'They are turned back into cheese', 'They are absorbed through the small intestine wall into the blood'], 3, 'What happens to small soluble molecules?', ['Amino acids are small and soluble.', 'So they pass through the small intestine wall into the blood. This is absorption.']),
  t('B9-11', 'Test a food sample'),
  p.choice('B9-12', 'After heating with Benedict’s solution, a sample turns from blue to orange. What does this show?', ['Sugar is present', 'Starch is present', 'Protein is present'], 0, 'What does Benedict’s solution test for?', ['Benedict’s solution tests for reducing sugars.', 'Orange is a positive result, so sugar is present.'], 'recall'),
  p.choice('B9-13', 'Which test and result show that protein is present?', ['Iodine turns blue-black', 'Biuret reagent turns lilac or purple', 'Benedict’s solution turns brick-red'], 1, 'Which reagent is the protein test?', ['Biuret reagent tests for protein.', 'Lilac or purple is a positive result, so protein is present.'], 'recall'),
  t('B9-14', 'Test for fat, then decide'),
  p.choice('B9-15', 'Why should you record what you see before you write a conclusion?', ['The conclusion changes the colour of the reagent', 'Observations are not needed for food tests', 'The observation is the evidence for the conclusion'], 2, 'Which comes first: what you see, or what it means?', ['An observation is what you see, such as a colour.', 'The conclusion is based on it, so the observation is the evidence.'], 'practicalReasoning'),
  a.choice('B9-16', 'Sam eats chips cooked in oil. Which two things help digest the oil in his small intestine?', ['Bile and lipase', 'Amylase and protease', 'Saliva and stomach acid'], 0, 'Oil is a lipid. What breaks up fat, and what digests it?', ['Bile emulsifies the oil into tiny droplets.', 'Lipase then digests the oil into glycerol and fatty acids, so both help.'], 'application', true),
  p.choice('B9-17', 'In this test, a sample of bread turns iodine blue-black. Biuret reagent stays blue. What can you conclude?', ['The bread contains only starch', 'Protein was found, but starch was not', 'Bread never contains protein', 'In this test, starch was found, but protein was not'], 3, 'Read each test on its own. Only say what these results show.', ['Blue-black iodine shows starch. Blue Biuret shows no protein was found.', 'So in this test, starch was found but protein was not. Other tests were not done, so you cannot say it is only starch.'], 'dataInterpretation', true, 'food-results-question'),
  p.choice('B9-18', 'A student’s plan says: “Heat the sample and ethanol over a Bunsen flame to speed it up.” What is wrong?', ['Ethanol should be swapped for iodine', 'Ethanol is highly flammable, so it must be kept away from flames', 'The sample should be boiled first', 'Nothing is wrong with this plan'], 1, 'What does ethanol do near a flame?', ['Ethanol catches fire very easily.', 'So it must be kept away from flames. Follow the school risk assessment.'], 'practicalReasoning', true),
  a.written('B9-19', 'Explain what happens to the fat in a cheese sandwich, from the small intestine to the blood.', 'Go in order: what bile does, what lipase does, then where the products go.', 'Bile, made in the liver and stored in the gall bladder, is alkaline, so it neutralises the stomach acid. Bile also emulsifies the fat into tiny droplets, giving more surface area. Lipase then digests the fat faster into glycerol and fatty acids. These small soluble molecules are absorbed through the small intestine wall into the blood.', ['Bile is alkaline, so it neutralises stomach acid.', 'Bile emulsifies fat into tiny droplets, giving more surface area.', 'Lipase digests the fat into glycerol and fatty acids.', 'The small soluble products are absorbed through the small intestine wall into the blood.'], ['Bile is described as an enzyme.', 'Emulsification is said to chemically break fat into glycerol and fatty acids.', 'Bile is said to be made in the gall bladder.', 'Fat is said to be absorbed whole, without being digested.']),
]

export const lesson9: ScienceLesson = {
  id: 'B-ORG-009-B', contentVersion: '0.3.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Digestion and food tests', prerequisites: ['B-ENZYMES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biology, practical, handbook], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
