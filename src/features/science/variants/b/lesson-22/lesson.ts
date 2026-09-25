import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { defenceFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.6 Human defence systems: skin, nose, trachea and bronchi, stomach; phagocytosis, antibodies and antitoxins' }
const a = author('B-BODY-DEFENCES', ['4.3.1.6'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const defenceSections = [
  { id: 'B22-01', label: 'Start here', detail: 'Which blood cells fight pathogens?' },
  { id: 'B22-02', label: 'Keeping pathogens out', detail: 'Skin, nose, airways and stomach' },
  { id: 'B22-06', label: 'One gets in', detail: 'White blood cells and phagocytosis' },
  { id: 'B22-08', label: 'Antibodies and antitoxins', detail: 'Two more ways to attack' },
  { id: 'B22-11', label: 'On your own', detail: 'Defences, order and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B22-01', 'Which part of the blood helps to fight pathogens?', ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma'], 2, 'You met the parts of the blood in Lesson 13.', ['Red blood cells carry oxygen, platelets help clotting and plasma carries substances.', 'White blood cells help to fight pathogens.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B22-02', 'Keeping pathogens out'),
  a.choice('B22-03', 'Look at the numbered defences. Which one kills pathogens with acid?', ['Defence 1', 'Defence 2', 'Defence 3', 'Defence 4'], 3, 'Where does swallowed food end up?', ['Defences 1 to 3 are the nose, the skin and the airways.', 'Defence 4 is the stomach, which makes hydrochloric acid.'], 'understanding', false, 'defence-body-question'),
  a.choice('B22-04', 'You swallow mucus with trapped pathogens in it. Why does this not usually make you ill?', ['Mucus is a medicine', 'Stomach acid kills most of the pathogens', 'Cilia digest the pathogens'], 1, 'Follow the mucus after it is swallowed.', ['Swallowed mucus goes to the stomach.', 'Hydrochloric acid in the stomach kills most pathogens.']),
  a.choice('B22-05', 'What do cilia do?', ['Make hydrochloric acid', 'Release substances that kill pathogens', 'Sweep mucus with trapped pathogens up to the throat'], 2, 'Cilia line the trachea and bronchi.', ['Cilia are tiny hair-like structures in the airways.', 'They sweep mucus, with its trapped pathogens, up to the throat.']),
  t('B22-06', 'One gets in'),
  a.choice('B22-07', 'What happens in phagocytosis?', ['A white blood cell surrounds and digests a pathogen', 'A red blood cell carries oxygen to a pathogen', 'Mucus traps a pathogen in the nose'], 0, 'It is the first of the three ways white blood cells attack.', ['Phagocytosis is done by some white blood cells.', 'The cell surrounds the pathogen and then digests it.']),
  t('B22-08', 'Antibodies and antitoxins'),
  a.choice('B22-09', 'What are the molecules marked 1 on the pathogen’s surface?', ['Antibodies', 'Antigens', 'Antitoxins'], 1, 'Which molecules belong to the pathogen itself?', ['Molecules on the surface of a pathogen are antigens.', 'Antibodies and antitoxins are made by white blood cells.'], 'understanding', false, 'defence-antibody-question'),
  a.choice('B22-10', 'Which substance made by white blood cells stops bacterial toxins working?', ['Antibodies', 'Mucus', 'Antitoxins', 'Hydrochloric acid'], 2, 'The name tells you what it works against.', ['Antibodies lock onto antigens on pathogens.', 'Antitoxins act on toxins and stop them working.']),
  a.choice('B22-11', 'A person’s cilia are damaged. Why might they get more chest infections?', ['Their stomach stops making acid', 'Mucus with trapped pathogens is not swept out of the airways', 'Their skin lets more pathogens in'], 1, 'What job do cilia do?', ['Cilia sweep mucus up to the throat.', 'Without them, mucus and its pathogens stay in the airways, near the lungs.'], 'application', true),
  a.choice('B22-12', 'Why can one type of antibody not protect against every pathogen?', ['Each antibody fits only one type of antigen', 'Antibodies only work in the stomach', 'Antibodies are destroyed by mucus'], 0, 'Think about the word “specific”.', ['Different pathogens have different antigens.', 'Each antibody fits only one type, so it cannot lock onto the others.'], 'understanding', true),
  a.choice('B22-13', 'Which order shows how antibodies help destroy a pathogen?', ['Antigen found → antibodies made → antibodies lock on → pathogen destroyed', 'Antibodies lock on → antigen found → antibodies made → pathogen destroyed', 'Pathogen destroyed → antigen found → antibodies made → antibodies lock on'], 0, 'The white blood cell must notice something first.', ['A white blood cell finds a foreign antigen and makes antibodies.', 'The antibodies lock on, and the pathogen is destroyed.'], 'understanding', true),
  a.choice('B22-14', 'Look at the graph of an infected cut. Which conclusion fits it?', ['Antibodies made the bacteria multiply', 'The bacteria disappeared before any antibodies were made', 'Antibodies always clear every infection in two days', 'As the antibody level rose, the number of bacteria fell'], 3, 'Compare what the two lines do after day 3.', ['The bacteria rose at first, then fell after day 3.', 'The antibody level rose over the same days. The graph shows a pattern, not proof for every infection.'], 'dataInterpretation', true, 'defence-infection-data'),
  a.written('B22-15', 'Describe three ways white blood cells defend the body against pathogens.', 'Name each way, then say what it does to the pathogen or its toxins.', 'Some white blood cells surround pathogens and digest them. This is phagocytosis. Some white blood cells make antibodies, which lock onto antigens on a pathogen so it can be destroyed. White blood cells also make antitoxins, which stop the toxins made by bacteria working.', ['Phagocytosis: white blood cells surround and digest pathogens.', 'Antibodies lock onto antigens so the pathogen is destroyed.', 'Antitoxins stop toxins working.'], ['Antibodies and antigens are mixed up.', 'Skin, mucus or stomach acid are given as white blood cell actions.', 'Antitoxins are said to kill the bacteria themselves.']),
]

export const lesson22: ScienceLesson = {
  id: 'B-INF-022-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'How your body defends itself', prerequisites: ['B-PLANT-PROTIST-DISEASES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
