import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { heartFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.2 The heart and blood vessels' }
const a = author('B-HEART', ['4.2.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
const visual = (state: ReturnType<typeof a.choice>, id: string, description: string) => ({ ...state, visual: { id, kind: 'cellModel' as const, brief: 'Original Revily schematic; not to scale.', accessibleDescription: description, assessmentDescription: 'An unlabelled original schematic. All information needed to answer is provided in the question.' } })

export const heartSections = [
  { id: 'B11-01', label: 'Start from the lungs', detail: 'Where oxygenated blood travels next' },
  { id: 'B11-05', label: 'Trace one complete route', detail: 'Four chambers and five named vessels' },
  { id: 'B11-02', label: 'Recognise double circulation', detail: 'The route contains a lung circuit and a body circuit' },
  { id: 'B11-09', label: 'Valves and coronary arteries', detail: 'One-way flow and the heart’s own supply' },
  { id: 'B11-12', label: 'Pacemakers', detail: 'Natural control and an artificial device' },
  { id: 'B11-15', label: 'Apply it independently', detail: 'Trace blood and explain heart structure' },
]

const states: ScienceState[] = [
  { ...a.choice('B11-01', 'After blood gains oxygen in the lungs, where must it travel next?', ['Back to the heart', 'Into the trachea', 'Into the stomach'], 0, 'Connect the lung lesson to the organ that pumps blood.', ['Oxygenated blood returns from the lungs to the heart.', 'The heart then pumps it around the body.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B11-05', 'Trace blood through the heart'),
  visual(a.choice('B11-06', 'Which vessel carries blood from the right ventricle to the lungs?', ['Pulmonary artery', 'Pulmonary vein', 'Vena cava'], 0, 'An artery carries blood away from the heart.', ['The right ventricle pumps blood away from the heart.', 'It travels to the lungs in the pulmonary artery.']), 'heart-route-question', 'A four-chamber heart with the major connected vessels shown but not named.'),
  a.choice('B11-07', 'Which vessel brings oxygenated blood from the lungs to the heart?', ['Pulmonary vein', 'Pulmonary artery', 'Vena cava'], 0, 'A vein returns blood to the heart.', ['The pulmonary vein carries blood from the lungs.', 'It enters the left atrium.']),
  a.choice('B11-08', 'Why is the wall of the left ventricle thicker than the wall of the right ventricle?', ['It must pump blood at higher pressure around the whole body', 'It stores air before breathing', 'It only moves blood to nearby lungs'], 0, 'Compare the distance and resistance of the two circuits.', ['The left ventricle supplies the whole body.', 'Its thicker muscle produces the greater pressure needed.']),
  t('B11-02', 'Recognise the two linked circuits'),
  a.choice('B11-03', 'Why is the human circulatory system described as double?', ['Blood passes through the heart twice in one complete journey', 'Humans have two separate hearts', 'Every vessel contains two layers of blood'], 0, 'Count how often blood returns to the heart: after the lungs and after the body.', ['One circuit links the heart and lungs.', 'A second circuit links the heart and the rest of the body.']),
  visual(a.choice('B11-04', 'Which circuit carries deoxygenated blood from the heart to the lungs?', ['The pulmonary circuit', 'The body circuit leaving the left ventricle', 'The digestive tract'], 0, 'Pulmonary means linked to the lungs.', ['The right ventricle sends deoxygenated blood to the lungs.', 'This is the pulmonary circuit.']), 'heart-double-question', 'Two linked circulation loops with one route between heart and lungs and one between heart and body.'),
  t('B11-09', 'Keep the heart supplied and flowing one way'),
  a.choice('B11-10', 'What is the main job of valves in the heart?', ['To stop blood flowing backwards', 'To add oxygen directly to blood', 'To make red blood cells'], 0, 'Valves respond to pressure differences.', ['Valves open to allow forward flow.', 'They close to prevent backflow.']),
  a.choice('B11-11', 'Why does heart muscle need coronary arteries?', ['To receive oxygen and glucose for respiration', 'To move air into the alveoli', 'To store bile before digestion'], 0, 'Heart muscle cells need energy to contract.', ['Coronary arteries supply the heart muscle.', 'Oxygen and glucose support aerobic respiration in its cells.']),
  t('B11-12', 'How the heartbeat is controlled'),
  a.choice('B11-13', 'Where is the natural pacemaker located?', ['In the wall of the right atrium', 'Inside the aorta', 'In an alveolus'], 0, 'The specification names one upper chamber.', ['A group of cells in the right atrium acts as the natural pacemaker.', 'Its electrical impulses coordinate the heartbeat.']),
  a.choice('B11-14', 'What is an artificial pacemaker used for?', ['Helping correct some irregular heart rhythms', 'Replacing every blood vessel', 'Increasing the number of alveoli'], 0, 'It is an electrical timing device.', ['An artificial pacemaker sends electrical impulses.', 'It can help keep the heart beating regularly.']),
  a.choice('B11-15', 'Which sequence correctly traces blood from the body to the lungs?', ['Vena cava → right atrium → right ventricle → pulmonary artery', 'Aorta → left atrium → right ventricle → pulmonary vein', 'Pulmonary vein → left ventricle → vena cava → lungs'], 0, 'Start with the vessel returning blood from the body.', ['The vena cava returns deoxygenated blood to the right atrium.', 'It passes to the right ventricle and leaves through the pulmonary artery.'], 'recall', true),
  visual(a.choice('B11-16', 'On the diagram, vessel X leaves the left ventricle for the body. What is X?', ['Aorta', 'Vena cava', 'Pulmonary vein'], 0, 'Name the large artery serving the body circuit.', ['The left ventricle pumps into the aorta.', 'The aorta carries blood away towards the body.'], 'application', true), 'heart-vessel-question', 'An unlabelled four-chamber heart with vessel X leaving the left ventricle.'),
  a.choice('B11-17', 'Which statement is correct?', ['The pulmonary artery carries deoxygenated blood away from the heart', 'The pulmonary vein carries deoxygenated blood to the lungs', 'The vena cava carries oxygenated blood out of the left ventricle'], 0, 'Use vessel direction and oxygen content separately.', ['The pulmonary artery is an artery because it carries blood away from the heart.', 'It carries deoxygenated blood to the lungs.'], 'understanding', true),
  a.choice('B11-18', 'A valve becomes leaky. What is the most direct effect?', ['Some blood can flow backwards, making pumping less efficient', 'The lungs stop having alveoli', 'Every artery becomes a vein'], 0, 'Think about the one-way function of a valve.', ['A leaky valve does not prevent backflow fully.', 'The heart may need to work harder to move enough blood forwards.'], 'application', true),
  a.written('B11-19', 'Explain the route of one red blood cell from the vena cava to the aorta.', 'Name the chambers, lung vessels and lungs in the correct order.', 'The cell enters the right atrium through the vena cava, moves into the right ventricle and leaves in the pulmonary artery. It reaches lung capillaries, where it gains oxygen, then returns in the pulmonary vein to the left atrium. It moves into the left ventricle and leaves through the aorta.', ['Vena cava to right atrium.', 'Right atrium to right ventricle.', 'Pulmonary artery carries it to the lungs.', 'Gas exchange occurs in lung capillaries.', 'Pulmonary vein returns it to the left atrium.', 'Left atrium to left ventricle, then out through the aorta.'], ['The pulmonary artery and pulmonary vein are reversed.', 'Blood is said to pass directly from the right ventricle to the aorta.', 'Blood is said to gain oxygen inside the heart.']),
]

export const lesson11: ScienceLesson = {
  id: 'B-ORG-011-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Circulatory system: the heart', prerequisites: ['B-LUNGS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
