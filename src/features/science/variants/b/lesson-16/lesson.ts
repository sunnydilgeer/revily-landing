import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { riskCancerFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.6 The effect of lifestyle on some non-communicable diseases; 4.2.2.7 Cancer' }
const a = author('B-RISK-CANCER', ['4.2.2.6', '4.2.2.7'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const riskCancerSections = [
  { id: 'B16-01', label: 'Start here', detail: 'Risk means chance' },
  { id: 'B16-02', label: 'Risk means chance', detail: 'More likely, not certain' },
  { id: 'B16-04', label: 'Link or cause?', detail: 'Correlation and cause' },
  { id: 'B16-06', label: 'The main risk factors', detail: 'Smoking, diet, obesity, alcohol and carcinogens' },
  { id: 'B16-10', label: 'How cancer starts and spreads', detail: 'Tumours, benign and malignant' },
  { id: 'B16-14', label: 'Lowering risk and cost', detail: 'Prevention and the cost of disease' },
  { id: 'B16-16', label: 'On your own', detail: 'Data, tumours and risk' },
]

const states: ScienceState[] = [
  { ...a.choice('B16-01', 'Someone crosses a busy road without looking. Which statement is true?', ['They will definitely be hit', 'They are more likely to be hit', 'It makes no difference'], 1, 'Does not looking make being hit certain?', ['Not looking makes an accident more likely.', 'It does not make it certain. Risk is about chance.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B16-02', 'Risk means chance'),
  a.choice('B16-03', 'A person has a risk factor for a disease. Which statement is true?', ['Their chance is higher, but it is not certain', 'They will definitely get the disease', 'They can pass the disease to others'], 0, 'Think back to the busy road.', ['A risk factor raises the chance of a disease.', 'It does not make the disease certain, and it does not make it spread.']),
  t('B16-04', 'Link or cause?'),
  a.choice('B16-05', 'Towns that sell more ice cream have more sunburn. What is the best explanation?', ['Ice cream causes sunburn', 'Sunny weather increases both', 'Sunburn makes people buy ice cream'], 1, 'Is there something else that could cause both?', ['Eating ice cream cannot burn skin.', 'Sunny weather makes people buy ice cream, and it also causes sunburn.']),
  t('B16-06', 'Smoking, diet and obesity'),
  a.choice('B16-07', 'Which risk factor and disease are correctly matched?', ['Alcohol – lung cancer', 'Ionising radiation – Type 2 diabetes', 'Smoking – broken bones', 'Obesity – Type 2 diabetes'], 3, 'Which factor is about extra body fat?', ['Smoking is linked to lung disease, and alcohol to liver and brain damage.', 'Obesity is a risk factor for Type 2 diabetes.']),
  t('B16-08', 'Alcohol, pregnancy and carcinogens'),
  a.choice('B16-09', 'Which of these is a carcinogen?', ['Ionising radiation', 'Type 2 diabetes', 'Regular exercise'], 0, 'A carcinogen is something that can cause cancer.', ['Type 2 diabetes is a disease, and exercise lowers some risks.', 'Ionising radiation can damage cells and cause cancer.']),
  t('B16-10', 'How cancer starts'),
  a.choice('B16-11', 'How does a tumour start?', ['Cells stop dividing', 'Pathogens join together', 'Changed cells divide out of control'], 2, 'Think about what normally controls cell division.', ['Normally, cell division is controlled.', 'When a cell changes, it can divide again and again, forming a tumour.']),
  t('B16-12', 'Benign and malignant tumours'),
  a.choice('B16-13', 'What makes a tumour malignant?', ['It stays in one place', 'It is held inside a membrane', 'Its cells can spread and form secondary tumours'], 2, 'Think about whether the cells stay put.', ['Staying in one place inside a membrane describes a benign tumour.', 'Malignant tumour cells invade and spread.']),
  t('B16-14', 'Lowering risk and the cost of disease'),
  a.choice('B16-15', 'Which is a financial cost of a non-communicable disease?', ['Pain', 'Money spent on treatment', 'A shorter life'], 1, 'Financial means to do with money.', ['Pain and a shorter life are human costs.', 'Money spent on treatment is a financial cost.']),
  a.choice('B16-16', 'The graph shows example data for six groups of people. What does it show on its own?', ['Smoking causes every lung cancer', 'There is no link', 'There is a positive correlation', 'Lung cancer causes smoking'], 2, 'What happens to one variable as the other increases?', ['As cigarettes per day increase, the lung cancer rate increases.', 'That is a positive correlation. The graph alone does not show the cause.'], 'dataInterpretation', true, 'risk-data-question'),
  a.choice('B16-17', 'A tumour’s cells travel in the blood and form a new tumour. What kind was the first tumour?', ['Malignant', 'Benign', 'A blood clot'], 0, 'Which kind of tumour can spread?', ['Benign tumours stay in one place.', 'Cells that spread and form secondary tumours come from a malignant tumour.'], 'understanding', true, 'cancer-spread-question'),
  a.choice('B16-18', 'A person has never smoked but gets lung cancer. What does this show?', ['Smoking is not a risk factor', 'Lung cancer is communicable', 'Other risk factors can also lead to the disease'], 2, 'Can a disease have more than one risk factor?', ['Smoking raises the risk of lung cancer.', 'Other factors, such as genes or radiation, can lead to it too.'], 'application', true),
  a.written('B16-19', 'Explain the difference between benign and malignant tumours.', 'Compare invasion, spread and secondary tumours.', 'A benign tumour grows in one place and does not invade nearby tissues. A malignant tumour invades surrounding tissue, and cells can spread through the blood to form secondary tumours elsewhere.', ['Benign tumours stay local and do not invade nearby tissues.', 'Malignant tumours invade surrounding tissues.', 'Malignant cells can spread through the blood.', 'Spread can form secondary tumours.'], ['All benign tumours are said to be harmless in every location.', 'Benign tumours are said to spread to form secondary tumours.', 'Cancer is described as a communicable disease.']),
]

export const lesson16: ScienceLesson = {
  id: 'B-ORG-016-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Risk factors and cancer', prerequisites: ['B-HEALTH'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
