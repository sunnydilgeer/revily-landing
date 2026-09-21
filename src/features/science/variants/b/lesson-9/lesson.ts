import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { digestionFrames as frames } from './teachingFrames'

const biology = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.1 Digestive enzymes, bile and required food tests' }
const practical = { id: 'aqa-practical', title: 'AQA 8464 practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.3 Required practical 3; Biology AT2' }
const handbook = { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Teacher notes pp12–13; student worksheet pp63–65; school risk assessment governs the practical' }
const a = author('B-DIGESTION', ['4.2.2.1'])
const p = author('B-FOOD-TESTS', ['4.2.2.1', '10.2.3'], ['aqa-biology', 'aqa-practical', 'aqa-handbook'])
const t = (id: keyof typeof frames, title: string) => (Number(id.slice(3)) >= 13 ? p : a).teach(id, title, frames[id])

export const digestionSections = [
  { id: 'B9-01', label: 'Start here', detail: 'Why large food molecules must change' },
  { id: 'B9-02', label: 'Digestion and absorption', detail: 'Large molecules become small and soluble' },
  { id: 'B9-04', label: 'Digestive enzymes', detail: 'Carbohydrases, proteases and lipases' },
  { id: 'B9-07', label: 'Where enzymes work', detail: 'Production and action sites' },
  { id: 'B9-10', label: 'Bile', detail: 'Neutralising acid and emulsifying fat' },
  { id: 'B9-13', label: 'Required practical 3', detail: 'Prepare and test food safely' },
  { id: 'B9-15', label: 'Four food tests', detail: 'Reagents and positive results' },
  { id: 'B9-21', label: 'Apply it independently', detail: 'Interpret evidence and explain digestion' },
]

const states: ScienceState[] = [
  { ...a.choice('B9-01', 'Why must many food molecules be digested before absorption?', ['They are too large to cross the digestive-system wall', 'They are already inside blood cells', 'Digestion makes every molecule insoluble'], 0, 'Think about molecule size and crossing a wall.', ['Many food molecules are too large to pass through the gut wall.', 'Digestion produces smaller soluble molecules that can be absorbed.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B9-02', 'Digestion and absorption'),
  a.choice('B9-03', 'Which statement correctly separates digestion from absorption?', ['Digestion breaks molecules down; absorption moves the products into the body', 'Absorption makes large molecules; digestion moves them into blood', 'They are two names for chewing only'], 0, 'First change the molecules, then move the products.', ['Chemical digestion produces smaller molecules.', 'Absorption moves small soluble products through the intestine wall.']),
  t('B9-04', 'Three groups of digestive enzymes'),
  a.choice('B9-05', 'Which enzyme and product pairing is correct?', ['Protease → amino acids', 'Lipase → simple sugars only', 'Amylase → glycerol and fatty acids'], 0, 'Match the enzyme to the large molecule it acts on.', ['Proteases digest proteins.', 'The products are amino acids.']),
  a.choice('B9-06', 'What are the products of lipid digestion?', ['Glycerol and fatty acids', 'Amino acids only', 'Starch and cellulose'], 0, 'Lipase acts on fats and oils.', ['Lipase breaks lipids down.', 'The products are glycerol and fatty acids.']),
  t('B9-07', 'Where digestive enzymes are made and work'),
  a.choice('B9-08', 'Which organs make amylase?', ['Salivary glands, pancreas and small intestine', 'Liver and gall bladder only', 'Large intestine only'], 0, 'Amylase begins working in the mouth and also acts in the small intestine.', ['Salivary glands, the pancreas and the small intestine produce amylase.', 'It acts in the mouth and small intestine.']),
  a.choice('B9-09', 'Where does lipase mainly work?', ['The small intestine', 'Inside red blood cells', 'The large intestine only'], 0, 'Bile and pancreatic enzymes enter this part of the gut.', ['Lipase acts in the small intestine.', 'It digests lipids into glycerol and fatty acids.']),
  t('B9-10', 'How bile helps digestion'),
  a.choice('B9-11', 'Which statement about bile is correct?', ['It is made in the liver and stored in the gall bladder', 'It is an enzyme made in the stomach', 'It turns amino acids back into proteins in the gut'], 0, 'Separate where bile is made from where it is stored.', ['The liver makes bile.', 'The gall bladder stores it before release into the small intestine.']),
  a.choice('B9-12', 'How does emulsifying fat help lipase?', ['It creates smaller droplets with more total surface area', 'It changes lipase into bile', 'It removes every fatty acid before digestion'], 0, 'Compare one large drop with many smaller drops.', ['Smaller droplets have a larger combined surface area.', 'More lipase can act at once, so fat digestion is faster.']),
  t('B9-13', 'Prepare for required practical 3'),
  p.choice('B9-14', 'Why should observations be recorded before conclusions?', ['The visible colour or layer is the evidence for the conclusion', 'A conclusion changes the reagent colour', 'Observations are not needed in food tests'], 0, 'Separate what you see from what you infer.', ['The observation is the measured evidence.', 'The conclusion names the molecule indicated by that result.'], 'practicalReasoning'),
  t('B9-15', 'Food tests and their results'),
  p.choice('B9-16', 'After heating with Benedict’s solution, a sample changes from blue to orange. What is detected?', ['A reducing sugar', 'Starch only', 'Protein only'], 0, 'Benedict’s is the sugar test.', ['A green, yellow, orange or brick-red Benedict’s result is positive.', 'It shows a reducing sugar is present.'], 'recall'),
  p.choice('B9-17', 'Iodine changes from brown-orange to blue-black. What is present?', ['Starch', 'Protein', 'No food molecules'], 0, 'Recall the iodine positive colour.', ['Iodine is used to test for starch.', 'Blue-black is a positive result.'], 'recall'),
  p.choice('B9-18', 'Biuret reagent changes from blue to purple. What is present?', ['Protein', 'Starch', 'Water only'], 0, 'Biuret is the protein test.', ['Biuret reagent tests for protein.', 'Lilac or purple is a positive result.'], 'recall'),
  p.choice('B9-19', 'Which observation is a positive ethanol emulsion test for lipid?', ['A cloudy white emulsion', 'A blue-black iodine colour', 'A purple Biuret colour'], 0, 'Look for a cloudy layer rather than a named colour change.', ['The ethanol emulsion test detects lipids.', 'A cloudy white emulsion is a positive result.'], 'recall'),
  t('B9-20', 'Turn test observations into conclusions'),
  p.choice('B9-21', 'A sample gives blue-black with iodine and remains blue with Biuret. What conclusion is supported?', ['Starch detected; protein not detected', 'Protein detected; starch not detected', 'Both protein and lipid definitely detected'], 0, 'Interpret each test separately.', ['Blue-black iodine is positive for starch.', 'Blue Biuret is a negative protein result.'], 'dataInterpretation', true, 'food-results-question'),
  p.choice('B9-22', 'Which plan is safest and scientifically appropriate?', ['Use supervised laboratory methods, a risk assessment and the specified protective equipment', 'Heat sealed test tubes at home over a candle', 'Taste each reagent to identify it'], 0, 'These tests use heating and chemical reagents.', ['The practical belongs in a supervised laboratory.', 'Follow the centre’s risk assessment and handling instructions.'], 'practicalReasoning', true),
  a.choice('B9-23', 'A food contains starch. Which sequence correctly links digestion to absorption?', ['Amylase helps form sugars; small soluble products can then be absorbed', 'Lipase forms amino acids; starch crosses unchanged', 'Bile turns starch directly into blood'], 0, 'Match starch to its digestive enzyme and product type.', ['Amylase is a carbohydrase that digests starch into sugars.', 'Small soluble digestion products can cross the small-intestine wall.'], 'application', true),
  a.written('B9-24', 'Explain two ways bile helps the digestion of fat.', 'Describe the pH effect and the surface-area effect.', 'Bile is alkaline, so it neutralises acidic contents arriving from the stomach and creates suitable alkaline conditions in the small intestine. It also emulsifies fat into smaller droplets, increasing total surface area so lipase can digest the fat faster.', ['Bile is alkaline and neutralises stomach acid.', 'This provides suitable alkaline conditions for enzymes in the small intestine.', 'Bile emulsifies fat into smaller droplets.', 'The droplets provide more surface area for lipase, increasing digestion rate.'], ['Bile is described as a digestive enzyme.', 'Emulsification is said to chemically break fat into glycerol and fatty acids.', 'Bile is said to be made in the gall bladder.']),
]

export const lesson9: ScienceLesson = {
  id: 'B-ORG-009-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Digestion and food tests', prerequisites: ['B-ENZYMES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biology, practical, handbook], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
