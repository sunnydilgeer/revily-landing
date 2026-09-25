import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { healthFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.5 Health issues' }
const a = author('B-HEALTH', ['4.2.2.5'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const healthSections = [
  { id: 'B15-01', label: 'Start here', detail: 'Sam’s week' },
  { id: 'B15-02', label: 'What health means', detail: 'Physical and mental well-being' },
  { id: 'B15-04', label: 'Two kinds of disease', detail: 'Communicable and non-communicable' },
  { id: 'B15-07', label: 'Diseases can affect each other', detail: 'Immune system, viruses and allergies' },
  { id: 'B15-10', label: 'Body, mind and life', detail: 'Depression, diet, stress and life situation' },
  { id: 'B15-13', label: 'On your own', detail: 'Classify, read a chart, explain' },
]

const states: ScienceState[] = [
  { ...a.choice('B15-01', 'Sam has a cold, sleeps badly and feels stressed about exams. Which parts of Sam’s health are affected?', ['Only their body', 'Only their mind', 'Both their body and their mind'], 2, 'A cold, poor sleep and worry each affect something different.', ['A cold affects Sam’s body. Worry about exams affects their thoughts and feelings.', 'So both parts of Sam’s health are affected.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B15-02', 'What health means'),
  a.choice('B15-03', 'Which is the best description of health?', ['Not having any disease', 'Being physically fit', 'A state of physical and mental well-being'], 2, 'Think about Sam’s week.', ['Health covers the body and the mind.', 'It is more than having no disease or being fit.']),
  t('B15-04', 'Two kinds of disease'),
  a.choice('B15-05', 'Which of these is a non-communicable disease?', ['Measles', 'Coronary heart disease', 'A cold'], 1, 'Which one can you not catch from someone else?', ['Measles and colds are caused by viruses and spread between people.', 'Coronary heart disease cannot be caught, so it is non-communicable.']),
  a.choice('B15-06', 'Why is a cold a communicable disease?', ['It can spread between people', 'It lasts a long time', 'It is caused by stress'], 0, 'What does “communicable” tell you about the disease?', ['A cold is caused by a virus, which is a pathogen.', 'The virus can spread between people.']),
  t('B15-07', 'Diseases can affect each other'),
  a.choice('B15-08', 'A person’s immune system does not work properly. What is more likely?', ['They catch more infections', 'They never become ill', 'Their diseases stop spreading'], 0, 'What does the immune system defend against?', ['The immune system fights pathogens.', 'If it is weak, pathogens cause infections more easily.']),
  a.choice('B15-09', 'Which statement about viruses and cancer is correct?', ['Every virus causes cancer', 'Some viruses can trigger some cancers', 'Cancer spreads like a cold'], 1, 'Look for the careful word.', ['Only some viruses are linked to cancer, and not everyone infected gets it.', 'Cancer itself does not spread between people.']),
  t('B15-10', 'Body, mind and life'),
  a.choice('B15-11', 'How can a serious physical illness affect mental health?', ['It cannot affect mental health', 'It can lead to depression', 'It always improves mood'], 1, 'Think about what the illness might stop someone doing.', ['A long illness can stop someone doing things they enjoy.', 'This can lead to depression.']),
  a.choice('B15-12', 'Which is an example of a life situation that affects health?', ['Access to healthcare', 'Catching a virus', 'Having a blood group'], 0, 'Think about things around a person, not inside their body.', ['A virus is a pathogen, and a blood group is inside the body.', 'Access to healthcare is part of a person’s life situation.']),
  a.choice('B15-13', 'Disease X is caused by a virus. It spreads between people. What kind of disease is it?', ['Non-communicable', 'Communicable', 'An allergy'], 1, 'Use the information about spreading.', ['A virus is a pathogen.', 'Disease X spreads between people, so it is communicable.'], 'application', true, 'health-classify-question'),
  a.choice('B15-14', 'The chart shows why students missed school one term. How many more missed school with colds than with asthma?', ['8 more', '24 more', '16 more', '32 more'], 2, 'Read both bars, then find the difference.', ['Colds: 24 students. Asthma: 8 students.', '24 − 8 = 16, so 16 more students.'], 'dataInterpretation', true, 'health-absence-chart'),
  a.choice('B15-15', 'A person has a long illness and must stop playing sport. For months afterwards, they feel low. What does this show?', ['Physical ill health can affect mental health', 'The illness was communicable', 'Mental health cannot change'], 0, 'Which part of health changed first, and which changed next?', ['The illness affected the person’s body first.', 'Losing sport then led to low mood, so physical ill health affected mental health.'], 'understanding', true),
  a.written('B15-16', 'Explain why health is affected by more than disease alone.', 'Include physical and mental well-being and one other factor.', 'Health includes physical and mental well-being, and the two can affect each other. Diet, stress and life situation can also change health by affecting the body, behaviour, exposure to risks or access to care.', ['Health includes physical well-being.', 'Health includes mental well-being.', 'Physical and mental health can interact.', 'A relevant factor such as diet, stress or life situation is linked to health.'], ['Health is said to mean only the absence of disease.', 'Every health problem is claimed to be communicable.', 'Life situation is said never to affect health.']),
]

export const lesson15: ScienceLesson = {
  id: 'B-ORG-015-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Health and disease', prerequisites: ['B-CARDIOVASCULAR'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
