import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { pathogenFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.1 Communicable (infectious) diseases: pathogens, how they spread and how spread is reduced' }
const a = author('B-PATHOGEN-SPREAD', ['4.3.1.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const pathogenSections = [
  { id: 'B19-01', label: 'Start here', detail: 'Which diseases can you catch?' },
  { id: 'B19-02', label: 'Follow the cold', detail: 'Pathogens, droplets and cell damage' },
  { id: 'B19-05', label: 'Stopping the cold', detail: 'Hygiene, isolation and vaccination' },
  { id: 'B19-07', label: 'Other pathogens', detail: 'Bacteria, fungi and protists' },
  { id: 'B19-10', label: 'Other ways in', detail: 'Touch, water and vectors' },
  { id: 'B19-13', label: 'On your own', detail: 'Routes, data and explanations' },
]

const states: ScienceState[] = [
  { ...a.choice('B19-01', 'Which of these is a communicable disease?', ['Coronary heart disease', 'A cold', 'Lung cancer caused by smoking'], 1, 'Communicable means it can pass from person to person. You met this in Lesson 15.', ['Heart disease and smoking-related cancer cannot be caught from someone else.', 'A cold can pass from person to person, so it is communicable.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B19-02', 'Follow the cold'),
  a.choice('B19-03', 'How does a cold virus get from one person to the next?', ['In droplets from coughs and sneezes', 'Through the soil', 'It forms on its own inside each person'], 0, 'Think about what a sneeze sends out.', ['A sneeze sprays droplets that carry viruses through the air.', 'Someone nearby breathes the droplets in.']),
  a.choice('B19-04', 'Why does a cold virus make you feel ill?', ['Cold weather damages your nose', 'The virus makes toxins', 'Your cells are damaged when new viruses burst out'], 2, 'Zoom in on what happens inside the cell.', ['The virus makes copies of itself inside your cells.', 'The cells burst, and this cell damage makes you feel ill.']),
  t('B19-05', 'Stopping the cold'),
  a.choice('B19-06', 'A pupil sneezes into a tissue, bins it and washes their hands. Why does this help?', ['It stops the virus reaching other people', 'It cures the pupil’s cold', 'It makes the pupil immune'], 0, 'Who does hygiene protect?', ['The tissue and hand washing remove viruses.', 'So fewer viruses reach anyone else.']),
  t('B19-07', 'Other kinds of pathogen'),
  a.choice('B19-08', 'Look at the four pathogens. Which one is not a cell?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 3, 'Look for the smallest one. How does it copy itself?', ['Numbers 1 to 3 are a bacterium, a fungus and a protist. These are all living cells.', 'Number 4 is a virus. It is much smaller and is not a cell.'], 'understanding', false, 'pathogen-types-question'),
  a.choice('B19-09', 'Salmonella bacteria cause vomiting. What causes this symptom?', ['The bacteria burst out of your cells', 'Toxins made by the bacteria', 'The bacteria are too big to digest'], 1, 'Bacteria and viruses harm you in different ways.', ['Bursting out of cells is what viruses do.', 'Bacteria make toxins, and the toxins damage cells and cause symptoms.']),
  t('B19-10', 'Other ways in'),
  a.choice('B19-11', 'Which scene shows a pathogen spreading by direct contact?', ['Scene 1', 'Scene 2', 'Scene 3'], 1, 'Which scene involves touching?', ['Scene 1 shows droplets in the air, and scene 3 shows dirty water.', 'Scene 2 shows a handshake, which is direct contact.'], 'understanding', false, 'pathogen-routes-question'),
  a.choice('B19-12', 'Mosquitoes carry a pathogen between people. Which action would most directly reduce the spread?', ['Isolate people who are ill', 'Wash hands before eating', 'Destroy the places where mosquitoes breed', 'Use tissues when sneezing'], 2, 'Mosquitoes are vectors. What stops vectors?', ['The mosquitoes carry the pathogen, so they are vectors.', 'Destroying their breeding places means fewer mosquitoes to pass it on.']),
  a.choice('B19-13', 'Flies land on rubbish, then on food. Why might killing the flies reduce disease?', ['Flies make toxins in the food', 'Flies carry pathogens from rubbish to food', 'Flies are a type of pathogen'], 1, 'What do we call a living thing that carries pathogens?', ['Flies pick up pathogens from rubbish and carry them to food.', 'They are acting as vectors, so killing them stops this route.'], 'application', true),
  a.choice('B19-14', 'Look at the results. Which conclusion fits them?', ['Hand gel proves nobody will catch a stomach bug', 'Cases went up after the gel was added', 'Colder weather caused the change', 'In this school, fewer cases followed the gel stations'], 3, 'Only say what these results show.', ['Cases fell from 24 and 22 a week to 9 and 7 after the gel stations went in.', 'One school’s results cannot prove what causes every case, or what happens everywhere.'], 'dataInterpretation', true, 'pathogen-handgel-data'),
  a.choice('B19-15', 'A disease spreads through dirty drinking water in a village. Which step would reduce the spread most directly?', ['Give out mosquito nets', 'Ask people to wear masks', 'Provide clean drinking water'], 2, 'Match the stop to the route.', ['The pathogen travels in dirty water.', 'Clean drinking water removes that route.'], 'application', true),
  a.written('B19-16', 'Flu spreads easily in schools. Describe two ways a school could reduce the spread of flu. Explain how each works.', 'Flu travels in droplets. For each idea, say how it stops the virus reaching someone new.', 'Pupils could catch sneezes in tissues and wash their hands. This removes viruses before they reach anyone else. Pupils with flu could stay at home, so they cannot pass the virus on in school. Vaccination also makes people less likely to catch flu and pass it on.', ['Hygiene, such as tissues or hand washing, removes viruses.', 'Isolation, such as staying at home, stops an ill pupil passing flu on.', 'Vaccination makes pupils less likely to catch flu and pass it on.', 'Each method is linked to how it stops the virus spreading.'], ['Hand washing is said to cure flu.', 'Flu is said to spread through dirty water or insects.', 'A method is named with no explanation of how it works.']),
]

export const lesson19: ScienceLesson = {
  id: 'B-INF-019-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Pathogens and how disease spreads', prerequisites: ['B-HEALTH'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
