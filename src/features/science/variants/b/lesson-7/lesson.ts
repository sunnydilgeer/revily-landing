import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { organisationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.1 Principles of organisation; 4.2.2.1 digestive-system context' }
const a = author('B-ORGANISATION', ['4.2.1', '4.2.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const organisationSections = [
  { id: 'B7-01', label: 'Start here', detail: 'What makes a working organism?' },
  { id: 'B7-02', label: 'Levels of organisation', detail: 'Cell to tissue to organ to system' },
  { id: 'B7-05', label: 'Tissues', detail: 'Epithelial cells working together' },
  { id: 'B7-07', label: 'Organs', detail: 'Why the stomach is an organ' },
  { id: 'B7-09', label: 'The digestive system', detail: 'Organs with different jobs' },
  { id: 'B7-13', label: 'Apply it independently', detail: 'Classify and explain new examples' },
]

const states: ScienceState[] = [
  { ...a.choice('B7-01', 'Several similar cells work together to line a surface. What level of organisation is this?', ['A tissue', 'An organ system', 'A whole organism'], 0, 'A tissue is made from a group of similar cells.', ['The cells are similar and work together.', 'That group is a tissue.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B7-02', 'From cells to an organism'),
  a.choice('B7-03', 'Which order goes from smallest to largest?', ['Cell → tissue → organ → organ system → organism', 'Tissue → cell → organ system → organ → organism', 'Organism → organ → tissue → cell → organ system'], 0, 'Start with one living building block.', ['Similar cells form tissues.', 'Different tissues form organs; organs form systems; systems work in an organism.']),
  a.choice('B7-04', 'What makes something an organ?', ['It is one specialised cell', 'It contains different tissues working together for a function', 'It is every system in an organism'], 1, 'Think about both what it contains and what it does.', ['An organ contains more than one type of tissue.', 'Those tissues work together for a particular function.']),
  t('B7-05', 'Epithelial tissue'),
  a.choice('B7-06', 'Which statement correctly compares an epithelial cell with epithelial tissue?', ['The cell is one unit; the tissue is many similar cells working together', 'The tissue is smaller than one cell', 'They are two names for a whole organ system'], 0, 'Compare one cell with a group of cells.', ['An epithelial cell is one cell.', 'Epithelial tissue is formed from many similar epithelial cells.']),
  t('B7-07', 'The stomach as an organ'),
  a.choice('B7-08', 'Why is the stomach described as an organ rather than a tissue?', ['It contains different tissues that work together', 'It contains only one cell type', 'It is the whole digestive system'], 0, 'An organ is one level above a tissue.', ['Different stomach tissues perform different parts of its job.', 'Together they make one organ.']),
  t('B7-09', 'Meet the digestive system'),
  a.choice('B7-10', 'Which pairing is correct?', ['Liver — makes bile; gall bladder — stores bile', 'Gall bladder — makes all digestive enzymes; liver — stores food', 'Pancreas — absorbs most water from undigested food'], 0, 'Separate making bile from storing it.', ['Bile is made in the liver.', 'It is stored in the gall bladder before release into the small intestine.']),
  a.choice('B7-11', 'Which statement correctly separates the two intestines?', ['The small intestine absorbs digested molecules; the large intestine absorbs water from undigested material', 'The large intestine makes bile; the small intestine stores it', 'Both have exactly the same function'], 0, 'One mainly absorbs digested food molecules; the other absorbs water.', ['Most absorption of digested soluble food molecules occurs in the small intestine.', 'The large intestine absorbs water from remaining material.']),
  t('B7-12', 'How organs work as a system'),
  a.choice('B7-13', 'A structure contains muscle tissue, lining tissue and nervous tissue that work together to move food. How should it be classified?', ['A single cell', 'An organ', 'A whole organism'], 1, 'Different tissues working together identify one level.', ['The structure contains several tissue types.', 'Those tissues work together for a function, so it is an organ.'], 'application', true, 'organisation-question'),
  a.choice('B7-14', 'Why is the digestive system an organ system?', ['It is one large tissue', 'It contains organs that work together to digest and absorb food', 'It contains no specialised cells'], 1, 'Use both parts of the definition.', ['An organ system is made of several organs.', 'The digestive organs contribute to digestion and absorption.'], 'understanding', true),
  a.written('B7-15', 'The bladder is described as an organ. Explain what this means.', 'State what an organ is made from and how its parts work.', 'The bladder contains different tissues. These tissues work together to carry out a function, including storing and releasing urine.', ['It contains different tissues.', 'The tissues work together.', 'They carry out the organ’s function, such as storing or releasing urine.'], ['The bladder is only one cell.', 'Every organ contains only one type of tissue.', 'The bladder is an organ system.']),
]

export const lesson7: ScienceLesson = {
  id: 'B-ORG-007-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Cells, tissues and organs', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
