import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { humanDiseaseFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.2 Viral diseases (measles, HIV); 4.3.1.3 Bacterial diseases (Salmonella, gonorrhoea)' }
const a = author('B-HUMAN-DISEASES', ['4.3.1.2', '4.3.1.3'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const humanDiseaseSections = [
  { id: 'B20-01', label: 'Start here', detail: 'How bacteria make you ill' },
  { id: 'B20-02', label: 'Salmonella', detail: 'Bacteria in food' },
  { id: 'B20-05', label: 'Gonorrhoea', detail: 'Bacteria passed on by sexual contact' },
  { id: 'B20-08', label: 'Measles', detail: 'A virus in droplets' },
  { id: 'B20-11', label: 'HIV', detail: 'A virus in body fluids' },
  { id: 'B20-13', label: 'Side by side', detail: 'Four diseases in one grid' },
  { id: 'B20-15', label: 'On your own', detail: 'Signs, data and explanations' },
]

const states: ScienceState[] = [
  { ...a.choice('B20-01', 'Bacteria and viruses make you ill in different ways. How do most bacteria do it?', ['They burst your cells from inside', 'They make toxins that damage cells and tissues', 'They block your blood vessels'], 1, 'Think back to Lesson 19. Which pathogen made poisons?', ['Bursting cells is how viruses cause harm.', 'Bacteria make toxins, and the toxins damage your cells and tissues.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B20-02', 'Salmonella'),
  a.choice('B20-03', 'Why are most UK chickens vaccinated against Salmonella?', ['To cure people who already have food poisoning', 'To make the meat cook faster', 'To control the spread of Salmonella to people'], 2, 'Think about what happens before the chicken reaches a plate.', ['Vaccinated chickens are less likely to carry Salmonella.', 'So less of it reaches food, and fewer people catch it.']),
  a.choice('B20-04', 'A cook handles raw chicken and does not wash their hands. Why is this a risk?', ['Salmonella could get onto other food', 'Their hands will start making toxins', 'The chicken will lose its vaccine'], 0, 'Where could bacteria on the hands go next?', ['Raw chicken can carry Salmonella bacteria.', 'Unwashed hands can carry the bacteria onto other food.']),
  t('B20-05', 'Gonorrhoea'),
  a.choice('B20-06', 'Why is penicillin no longer used for most gonorrhoea infections?', ['Gonorrhoea is now caused by a virus', 'Many strains are resistant to penicillin', 'Penicillin only works on food poisoning'], 1, 'What does “resistant” mean?', ['Penicillin used to kill the bacteria.', 'Many strains are no longer killed by it, so doctors use other antibiotics.']),
  a.choice('B20-07', 'Which of these reduces the spread of gonorrhoea?', ['Wearing a face mask', 'Vaccinating chickens', 'Using condoms', 'Sleeping under a mosquito net'], 2, 'How does gonorrhoea pass between people?', ['Gonorrhoea is passed on by sexual contact.', 'Condoms are a barrier, so the bacteria cannot pass between people.']),
  t('B20-08', 'Measles'),
  a.choice('B20-09', 'How does measles spread from one person to another?', ['By sexual contact', 'In undercooked food', 'In droplets from coughs and sneezes'], 2, 'Measles spreads the same way as a cold.', ['Measles is a virus carried in droplets.', 'People nearby breathe the droplets in.']),
  a.choice('B20-10', 'Why are most young children vaccinated against measles?', ['Measles only affects adults', 'Measles is caused by bacteria', 'Vaccines cure a measles rash', 'Measles can lead to serious complications'], 3, 'Think about what can happen after catching measles.', ['Measles can lead to complications, and these can kill.', 'Vaccination makes children much less likely to catch it.']),
  t('B20-11', 'HIV'),
  a.choice('B20-12', 'What do antiretroviral drugs do?', ['Kill bacteria in the blood', 'Stop HIV copying itself in the body', 'Clear up a measles rash'], 1, 'HIV is a virus. What must it do to spread inside the body?', ['HIV makes copies of itself inside the body.', 'Antiretroviral drugs stop the copying, which controls the virus.']),
  t('B20-13', 'Four diseases side by side'),
  a.choice('B20-14', 'Look at column 3 of the grid. Which disease is it?', ['Salmonella', 'Gonorrhoea', 'HIV', 'Measles'], 3, 'Read the pathogen and the route first. Which disease spreads like a cold?', ['Column 3 is caused by a virus, spreads in droplets and causes a fever and a rash.', 'That matches measles.'], 'understanding', false, 'disease-grid-question'),
  a.choice('B20-15', 'A patient has the signs on this card. Which disease fits best?', ['Measles', 'Gonorrhoea', 'Salmonella'], 1, 'Which disease causes a discharge?', ['Measles causes a fever and a rash. Salmonella causes vomiting and cramps.', 'Pain when urinating and a discharge match gonorrhoea.'], 'application', true, 'disease-symptom-card'),
  a.choice('B20-16', 'Look at the results. Which conclusion fits them?', ['Vaccination causes measles', 'Cases fell as vaccination fell', 'In this region, cases rose as vaccination fell', 'Vaccination stops every case of measles'], 2, 'Describe what happened, without claiming more than the data shows.', ['Vaccination fell from 95% to 85%, and cases rose from 12 to 140.', 'The data shows a pattern in one region. It cannot show that vaccination stops every case.'], 'dataInterpretation', true, 'disease-measles-data'),
  a.choice('B20-17', 'A restaurant kitchen has a Salmonella outbreak. Which action would most directly reduce the spread?', ['Hand washing and cleaning between raw and cooked food', 'Mosquito nets for the staff', 'Face masks for the customers'], 0, 'How does Salmonella get into food?', ['Salmonella spreads in food and on unwashed hands and surfaces.', 'Hand washing and cleaning stop it reaching cooked food.'], 'application', true),
  a.written('B20-18', 'Salmonella and measles spread in different ways. Describe how each spreads. Give one way to reduce the spread of each.', 'Take one disease at a time. What carries the pathogen, and what would block that route?', 'Salmonella spreads in food, such as undercooked chicken, or from unwashed hands in an unclean kitchen. Vaccinating poultry and keeping kitchens and hands clean reduce its spread. Measles spreads in droplets from coughs and sneezes. Vaccinating children reduces its spread.', ['Salmonella spreads in food or from unclean kitchens.', 'Salmonella: vaccinate poultry, or keep hands and kitchens clean.', 'Measles spreads in droplets that are breathed in.', 'Measles: vaccination or isolation.'], ['Measles is said to spread in food.', 'Salmonella is said to be a virus.', 'Antibiotics are suggested to stop measles.']),
]

export const lesson20: ScienceLesson = {
  id: 'B-INF-020-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Diseases people pass on', prerequisites: ['B-PATHOGEN-SPREAD'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
