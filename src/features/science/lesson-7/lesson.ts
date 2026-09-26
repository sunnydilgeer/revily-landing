import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { organisationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.1 Principles of organisation; 4.2.2.1 digestive-system context' }
const a = author('B-ORGANISATION', ['4.2.1', '4.2.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const organisationSections = [
  { id: 'B7-01', label: 'Start here', detail: 'Cells with jobs' },
  { id: 'B7-02', label: 'Zoom in on the stomach', detail: 'Cells and tissues' },
  { id: 'B7-05', label: 'Build an organ', detail: 'Why the stomach is an organ' },
  { id: 'B7-08', label: 'Follow the sandwich', detail: 'The organs food passes through' },
  { id: 'B7-11', label: 'Build the whole body', detail: 'Organ systems and the organism' },
  { id: 'B7-14', label: 'On your own', detail: 'Use the levels on new examples' },
]

const states: ScienceState[] = [
  { ...a.choice('B7-01', 'Muscle cells are long and can contract. What does this let them do?', ['Move parts of the body', 'Carry water up a plant', 'Swim to an egg'], 0, 'Think back to Lesson 4. What happens when a muscle cell gets shorter?', ['Muscle cells contract, which means they get shorter.', 'So they pull on parts of the body and make them move.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B7-02', 'Zoom in on the stomach'),
  a.choice('B7-03', 'Muscle cells in the stomach wall work together to churn food. What do they make?', ['An organ', 'One cell', 'A tissue'], 2, 'What is a group of similar cells doing one job called?', ['The muscle cells are similar, and they do one job together.', 'So together they make a tissue: muscle tissue.']),
  a.choice('B7-04', 'What is the difference between one epithelial cell and epithelial tissue?', ['They are two names for the stomach', 'The tissue is many similar cells joined in a layer; the cell is just one', 'One epithelial cell is bigger than the tissue'], 1, 'Is the tissue one cell or many?', ['Epithelial tissue is a layer of many similar epithelial cells.', 'So one epithelial cell is only a small part of the tissue.']),
  t('B7-05', 'Build an organ'),
  a.choice('B7-06', 'Why is the stomach an organ, not a tissue?', ['It has different tissues working together', 'It is made of only muscle cells', 'It is the biggest part of the body'], 0, 'How many kinds of tissue does the stomach wall have?', ['The stomach has muscle tissue, epithelial tissue and juice-making tissue.', 'So it has different tissues working together, which makes it an organ.']),
  a.choice('B7-07', 'Which of these is an organ?', ['Muscle tissue', 'The stomach', 'One epithelial cell'], 1, 'Which one is made of different tissues?', ['Muscle tissue is one tissue, and an epithelial cell is one cell.', 'So the stomach is the organ, because it has different tissues working together.']),
  t('B7-08', 'Follow the sandwich'),
  a.choice('B7-09', 'Where is digested food absorbed into the blood?', ['The large intestine', 'The small intestine', 'The oesophagus', 'The stomach'], 1, 'Which organ comes straight after the stomach?', ['The small intestine takes digested food into the blood.', 'So this is where digested food is absorbed. The large intestine absorbs water.']),
  a.choice('B7-10', 'Which organ does the sandwich NOT pass through?', ['The oesophagus', 'The small intestine', 'The pancreas', 'The large intestine'], 2, 'Which organs are helpers that add liquids?', ['The pancreas makes digestive juice that goes into the small intestine.', 'So it is a helper organ. Food never passes through it.']),
  t('B7-11', 'Build the whole body'),
  a.choice('B7-12', 'Why is the digestive system an organ system?', ['It is one very large organ', 'It is made of many similar cells', 'It has several organs working together to digest food'], 2, 'What is it made of, and do the parts work together?', ['The digestive system has several organs, such as the stomach and small intestine.', 'So it is an organ system, because these organs work together to digest and absorb food.']),
  a.choice('B7-13', 'Which order goes from smallest to largest?', ['Organ → tissue → cell → organ system → organism', 'Tissue → cell → organ → organism → organ system', 'Cell → organ → tissue → organ system → organism', 'Cell → tissue → organ → organ system → organism'], 3, 'Which level is each one built from?', ['Cells make tissues, and tissues make organs.', 'So organs make organ systems, and organ systems make the organism.']),
  a.choice('B7-14', 'A doctor takes a tiny sample of stomach lining. It is a layer of many similar epithelial cells. What is the sample?', ['A tissue', 'An organ', 'An organ system', 'A single cell'], 0, 'Is it one cell, or many similar cells doing one job?', ['The sample is many similar cells in a layer, doing one job.', 'So it is a tissue: epithelial tissue.'], 'application', true),
  a.choice('B7-15', 'A student looks at two samples. Sample X has one kind of tissue. Sample Y has three kinds of tissue working together. Which conclusion fits?', ['Sample X is an organ system', 'Every sample with three tissues is a stomach', 'In this test, only sample Y has the different tissues an organ needs', 'Sample Y is one large cell'], 2, 'Only say what these two samples show.', ['An organ has different tissues working together, and only sample Y has this.', 'So in this test, sample Y fits an organ. Two samples cannot tell you it is a stomach.'], 'dataInterpretation', true),
  a.choice('B7-16', 'The diagram shows five levels, from smallest to largest. Which level is the stomach?', ['Level 2', 'Level 3', 'Level 4'], 1, 'Count up: cell, tissue, then what?', ['The levels go cell, tissue, organ, organ system, organism.', 'The stomach is an organ, so it is Level 3.'], 'understanding', true, 'organisation-question'),
  a.written('B7-17', 'You eat a sandwich. Explain how your body is organised to digest it, from cells up to the whole organism. Use the stomach as your example organ.', 'Start with cells. Go up one level at a time, and say what each level is made of.', 'Similar cells, such as muscle cells, work together to form a tissue, such as muscle tissue. The stomach has different tissues, like muscle and epithelial tissue, working together, so it is an organ. The stomach works with other organs, such as the small intestine, to digest and absorb food. These organs make the digestive system, an organ system. Organ systems work together to make the whole organism.', ['Similar cells, such as muscle cells, work together to form a tissue.', 'The stomach has different tissues working together, so it is an organ.', 'The stomach works with other organs, such as the small intestine, in the digestive system, which is an organ system.', 'Organ systems work together to make the whole organism.'], ['The stomach is called a tissue or a single cell.', 'The digestive system is called one organ.', 'The levels are in the wrong order, for example tissues are said to be made of organs.', 'Food is said to pass through the liver or pancreas.']),
]

export const lesson7: ScienceLesson = {
  id: 'B-ORG-007-B', contentVersion: '0.3.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Cells, tissues and organs', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
