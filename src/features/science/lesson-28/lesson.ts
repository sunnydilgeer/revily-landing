import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { respirationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.4.2.1 Aerobic and anaerobic respiration: exothermic, uses of the energy, word equations, lactic acid in muscles, ethanol and carbon dioxide in plants and yeast, fermentation' }
const a = author('B-RESPIRATION', ['4.4.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const respirationSections = [
  { id: 'B28-01', label: 'Start here', detail: 'What the sunflower’s glucose was for' },
  { id: 'B28-02', label: 'What is respiration?', detail: 'Not breathing, exothermic, three uses' },
  { id: 'B28-05', label: 'With oxygen', detail: 'Aerobic respiration and its equation' },
  { id: 'B28-08', label: 'Not enough oxygen', detail: 'Anaerobic respiration in muscles' },
  { id: 'B28-11', label: 'Yeast and plants', detail: 'Fermentation, bread and drinks' },
  { id: 'B28-14', label: 'On your own', detail: 'Mushrooms, arrows, yeast data' },
]

const states: ScienceState[] = [
  { ...a.choice('B28-01', 'A sunflower uses some of its glucose for respiration. What does respiration give the plant?', ['More chlorophyll', 'Energy to live and grow', 'Water from the soil'], 1, 'You met this when you learned what plants do with glucose.', ['Glucose is made by photosynthesis.', 'Respiration transfers energy from glucose, which the plant uses to live and grow.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B28-02', 'What is respiration?'),
  a.choice('B28-03', 'Which sentence about respiration is true?', ['It only happens when you breathe in', 'It happens in every living cell, all the time', 'Only animals respire', 'It is another word for breathing'], 1, 'Where does respiration happen?', ['Breathing moves air; respiration is a chemical reaction in cells.', 'It happens in every living cell, all the time, in plants, animals and yeast.']),
  a.choice('B28-04', 'Respiration is exothermic. What does this mean?', ['It takes in energy from the environment', 'It needs light to happen', 'It transfers energy to the environment'], 2, 'Exothermic is the opposite of endothermic.', ['Endothermic reactions, such as photosynthesis, take energy in.', 'Exothermic reactions, such as respiration, transfer energy to the environment.']),
  t('B28-05', 'With oxygen'),
  a.choice('B28-06', 'What are the products of aerobic respiration?', ['Carbon dioxide and water', 'Glucose and oxygen', 'Lactic acid', 'Glucose and water'], 0, 'The products are on the right of the arrow.', ['Glucose and oxygen go in; they are the reactants.', 'Carbon dioxide and water are made; they are the products.']),
  a.choice('B28-07', 'Look at the numbered parts of the cell. Where do most of the reactions of aerobic respiration happen?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 3, 'Look for the small oval parts.', ['Part 1 is the nucleus, part 2 the cell membrane and part 3 the cytoplasm.', 'Part 4 is a mitochondrion, where most aerobic respiration happens.'], 'understanding', false, 'energy-cell-question'),
  t('B28-08', 'Not enough oxygen'),
  a.choice('B28-09', 'What is the word equation for anaerobic respiration in muscle cells?', ['glucose + oxygen → carbon dioxide + water', 'glucose → lactic acid', 'glucose → ethanol + carbon dioxide', 'lactic acid → glucose'], 1, 'Anaerobic means without oxygen. Which is made in muscles?', ['The first equation uses oxygen, so it is aerobic. Ethanol is made in plants and yeast.', 'In muscle cells, anaerobic respiration is glucose → lactic acid.']),
  a.choice('B28-10', 'Why does anaerobic respiration transfer much less energy than aerobic respiration?', ['The glucose is not combined with oxygen, so it is not broken down completely', 'It makes more carbon dioxide', 'It only happens in plants'], 0, 'What is missing in anaerobic respiration?', ['Without oxygen, the oxidation of glucose is incomplete.', 'The glucose is only partly broken down, so much less energy is transferred.']),
  t('B28-11', 'Yeast and plants'),
  a.choice('B28-12', 'A baker mixes yeast into bread dough. Why does the dough rise?', ['Yeast makes oxygen', 'Yeast makes lactic acid', 'Yeast makes carbon dioxide gas, which forms bubbles'], 2, 'Which gas does fermentation make?', ['Yeast ferments the sugar in the dough: glucose → ethanol + carbon dioxide.', 'The carbon dioxide gas forms bubbles, so the dough rises.']),
  a.choice('B28-13', 'Yeast is respiring in a jar of sugary liquid with no oxygen. What is this process called?', ['Photosynthesis', 'Aerobic respiration', 'Fermentation', 'Breathing'], 2, 'Anaerobic respiration in yeast has its own name.', ['There is no oxygen, so the yeast respires anaerobically.', 'Anaerobic respiration in yeast is called fermentation.']),
  a.choice('B28-14', 'A mushroom has no lungs and does not breathe. Which statement is true?', ['It cannot respire, because it does not breathe', 'It still respires, because all living things respire', 'It gets its energy from breathing through its skin'], 1, 'Is respiration the same as breathing?', ['Respiration is a chemical reaction in cells, not breathing.', 'All living things respire, so the mushroom respires too.'], 'application', true),
  a.choice('B28-15', 'Look at the numbered arrows. Which one shows carbon dioxide?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 2, 'Carbon dioxide is a product, so it leaves the cell.', ['Arrows 1 and 2 bring glucose and oxygen in; arrow 4 takes water out.', 'Arrow 3 shows carbon dioxide leaving the cell.'], 'understanding', true, 'energy-aerobic-question'),
  a.choice('B28-16', 'Three flasks were kept at the same temperature for 30 minutes. Which conclusion fits the results?', ['Sugar makes gas on its own', 'Yeast makes the same amount of gas without sugar', 'All yeast makes exactly 38 cm³ of gas', 'In this test, yeast made much more gas when it had sugar'], 3, 'Compare flask A with flasks B and C, and only say what they show.', ['Yeast with sugar made 38 cm³, yeast without sugar made 2 cm³ and sugar without yeast made none.', 'So in this test, yeast made much more gas when it had sugar. One test cannot give an amount for all yeast.'], 'dataInterpretation', true, 'energy-yeast-data'),
  a.written('B28-17', 'Compare aerobic and anaerobic respiration in a muscle cell.', 'For each type, say whether it uses oxygen, what it makes, how much energy it transfers and when it happens.', 'Aerobic respiration uses oxygen and makes carbon dioxide and water. Anaerobic respiration does not use oxygen and makes lactic acid. Aerobic respiration transfers much more energy, because in anaerobic respiration glucose is only partly broken down. Muscles respire anaerobically as well when they cannot get enough oxygen, such as during hard exercise.', ['Aerobic respiration uses oxygen; anaerobic respiration does not.', 'Aerobic respiration makes carbon dioxide and water.', 'Anaerobic respiration in muscles makes lactic acid.', 'Aerobic respiration transfers much more energy than anaerobic respiration.', 'Anaerobic respiration happens when muscles cannot get enough oxygen, for example in hard exercise.'], ['Saying anaerobic respiration in muscles makes ethanol or carbon dioxide.', 'Saying respiration is breathing, or that anaerobic means not breathing.', 'Saying anaerobic respiration transfers more energy.']),
]

export const lesson28: ScienceLesson = {
  id: 'B-BIO-028-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Respiration: aerobic and anaerobic', prerequisites: ['B-PHOTOSYNTHESIS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
