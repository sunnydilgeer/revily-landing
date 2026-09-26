import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { medicineFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.8 Antibiotics and painkillers; 4.3.1.9 Discovery of drugs: digitalis, aspirin, penicillin and the pharmaceutical industry' }
const a = author('B-MEDICINES', ['4.3.1.8', '4.3.1.9'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const medicineSections = [
  { id: 'B24-01', label: 'Start here', detail: 'Which pathogen lives inside your cells?' },
  { id: 'B24-02', label: 'Mia’s flu', detail: 'Symptoms and painkillers' },
  { id: 'B24-04', label: 'The ear infection', detail: 'Antibiotics, and why not for viruses' },
  { id: 'B24-07', label: 'When antibiotics stop working', detail: 'Resistant bacteria and MRSA' },
  { id: 'B24-09', label: 'Where Mia’s medicines came from', detail: 'Willow, foxgloves, a mould and the lab' },
  { id: 'B24-12', label: 'On your own', detail: 'Choosing medicines and reading data' },
]

const states: ScienceState[] = [
  { ...a.choice('B24-01', 'Which type of pathogen reproduces inside your body cells?', ['Bacteria', 'Viruses', 'Fungi'], 1, 'You met the types of pathogen in Lesson 19.', ['Bacteria and fungi are cells, and they can reproduce outside your body cells.', 'Viruses are not cells, and they reproduce inside your body cells.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B24-02', 'Mia’s flu'),
  a.choice('B24-03', 'Mia’s painkiller eased her headache. What did it do to the flu virus?', ['It killed the virus', 'It made the virus resistant', 'Nothing: painkillers ease symptoms but do not kill pathogens'], 2, 'Is a headache the pathogen itself, or a sign of illness?', ['A headache is a symptom of flu.', 'Painkillers ease symptoms, but they do not kill the virus.']),
  t('B24-04', 'The ear infection'),
  a.choice('B24-05', 'Look at the zoomed-in picture. Which numbered pathogen could an antibiotic kill?', ['Pathogen 1', 'Pathogen 2', 'Pathogen 3'], 1, 'Antibiotics work against only one of the types of pathogen shown.', ['Pathogens 1 and 3 are viruses, and antibiotics do not kill viruses.', 'Pathogen 2 is a bacterium, so an antibiotic could kill it.'], 'understanding', false, 'drug-ear-question'),
  a.choice('B24-06', 'Why do doctors not give antibiotics to treat flu?', ['Flu is caused by a virus, and antibiotics do not kill viruses', 'Flu is too mild to need any treatment', 'Antibiotics only work on the skin'], 0, 'What type of pathogen causes flu?', ['Antibiotics kill bacteria inside the body.', 'Flu is caused by a virus, and antibiotics do not kill viruses.']),
  t('B24-07', 'When antibiotics stop working'),
  a.choice('B24-08', 'What does it mean if bacteria are resistant to an antibiotic?', ['The bacteria can no longer cause disease', 'The antibiotic kills them faster', 'The bacteria have turned into viruses', 'The antibiotic no longer kills them'], 3, 'Think about gonorrhoea in Lesson 20.', ['Resistant bacteria have changed, so the antibiotic does not work on them.', 'It no longer kills them.']),
  t('B24-09', 'Where Mia’s medicines came from'),
  a.choice('B24-10', 'Look at the numbered sources. Which one first gave us penicillin?', ['Source 1', 'Source 2', 'Source 3'], 2, 'Penicillin came from a microorganism, not a plant.', ['Source 1 is a foxglove, which gave digitalis, and source 2 is willow, which gave aspirin.', 'Source 3 is a mould, which gave penicillin.'], 'understanding', false, 'drug-source-question'),
  a.choice('B24-11', 'Which drug was first made from a chemical found in willow trees?', ['Aspirin', 'Digitalis', 'Penicillin'], 0, 'It is a painkiller.', ['Digitalis came from foxgloves, and penicillin came from a mould.', 'Aspirin, a painkiller, came from willow.']),
  a.choice('B24-12', 'Mia’s brother Tom has a cold, caused by a virus. He asks for antibiotics. What would a doctor most likely suggest?', ['Antibiotics, to kill the virus', 'Something to ease his symptoms while his body clears the virus', 'A stronger antibiotic than usual', 'Nothing, because colds cannot be treated at all'], 1, 'Which kind of medicine helps with how he feels?', ['A cold is caused by a virus, so antibiotics would not help.', 'Medicines such as painkillers can ease his symptoms while his white blood cells clear the virus.'], 'application', true),
  a.choice('B24-13', 'Why is it hard to develop drugs that destroy viruses?', ['Viruses are too big for drugs to reach', 'Viruses have no antigens', 'Viruses never cause serious disease', 'Viruses reproduce inside body cells, so a drug could damage the cells too'], 3, 'Where do viruses reproduce?', ['Viruses reproduce inside your own body cells.', 'A drug that destroys them there could also damage the body cells.'], 'understanding', true),
  a.choice('B24-14', 'The chart shows the clear zone, where bacteria died, around three antibiotics. Which conclusion fits it?', ['Antibiotic P killed these bacteria best', 'Antibiotic Q will kill every type of bacteria', 'Antibiotic Q killed these bacteria best', 'None of the antibiotics had any effect'], 2, 'What does a wider clear zone tell you?', ['The chart shows one patient’s bacteria only, so it cannot show that Q works on every type.', 'Q has the widest clear zone, so it killed these bacteria best.'], 'dataInterpretation', true, 'drug-antibiotic-data'),
  a.choice('B24-15', 'Why is it important to be treated with the right antibiotic?', ['Different antibiotics kill different types of bacteria', 'Some antibiotics kill viruses instead of bacteria', 'The wrong antibiotic turns bacteria into viruses'], 0, 'Think about Mia’s ear infection.', ['Antibiotics do not all work on the same bacteria.', 'Different antibiotics kill different types of bacteria.'], 'understanding', true),
  a.written('B24-16', 'Mia was given an antibiotic for her ear infection, but not for her flu. Explain why.', 'Name the type of pathogen behind each illness, then say what antibiotics do.', 'Mia’s ear infection was caused by bacteria. Antibiotics kill bacteria inside the body, so the antibiotic could clear the infection. Her flu was caused by a virus. Antibiotics do not kill viruses, so an antibiotic would not have helped; a painkiller could ease her symptoms instead.', ['The ear infection was caused by bacteria.', 'Antibiotics kill bacteria.', 'Flu is caused by a virus.', 'Antibiotics do not kill viruses.'], ['Saying antibiotics kill all pathogens.', 'Saying painkillers kill pathogens.', 'Saying the flu virus was “resistant” rather than that antibiotics do not work on viruses.']),
]

export const lesson24: ScienceLesson = {
  id: 'B-INF-024-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Medicines and where they come from', prerequisites: ['B-VACCINATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
