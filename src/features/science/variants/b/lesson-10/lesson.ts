import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { lungsFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.2 Structure and function of the lungs; adaptation for gaseous exchange' }
const a = author('B-LUNGS', ['4.2.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
const visual = (state: ReturnType<typeof a.choice>, id: string, description: string) => ({ ...state, visual: { id, kind: 'cellModel' as const, brief: 'Original Revily schematic; not to scale.', accessibleDescription: description, assessmentDescription: 'An unlabelled original schematic. All information needed to answer is provided in the question.' } })

export const lungsSections = [
  { id: 'B10-01', label: 'Start here', detail: 'What reaches the air sacs?' },
  { id: 'B10-02', label: 'Route through the lungs', detail: 'Trachea, bronchi and alveoli' },
  { id: 'B10-05', label: 'Gas exchange', detail: 'Oxygen into blood; carbon dioxide out' },
  { id: 'B10-08', label: 'Why alveoli work well', detail: 'Surface area, thin walls and blood supply' },
  { id: 'B10-13', label: 'Apply it independently', detail: 'Route, exchange and adaptation' },
]

const states: ScienceState[] = [
  { ...a.choice('B10-01', 'Which structure is the tiny air sac where gases move between air and blood?', ['An alveolus', 'The trachea', 'A heart valve'], 0, 'Look for the structure at the end of the airway.', ['An alveolus is a tiny air sac.', 'Gas exchange happens across its surface.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B10-02', 'Follow air into the lungs'),
  visual(a.choice('B10-03', 'Which route correctly follows inhaled air to the gas-exchange surface?', ['Trachea, then bronchi, then smaller airways, then alveoli', 'Alveoli, then trachea, then bronchi', 'Trachea, then heart, then alveoli'], 0, 'Begin with the main airway and finish at the air sacs.', ['Air first passes down the trachea.', 'It then travels through the bronchi and smaller airways to the alveoli.']), 'lung-route-question', 'A simplified branching airway with four positions marked in sequence.'),
  a.choice('B10-04', 'Why do the airways branch many times inside the lungs?', ['To carry air to many groups of alveoli', 'To pump blood out of the heart', 'To digest large food molecules'], 0, 'Think about spreading air through a large organ.', ['Branching distributes air through the lungs.', 'The smallest airways lead to groups of alveoli.']),
  t('B10-05', 'Exchange oxygen and carbon dioxide'),
  visual(a.choice('B10-06', 'In which direction does oxygen move at an alveolus?', ['From alveolar air into the blood', 'From the blood into alveolar air', 'From the heart directly into the trachea'], 0, 'Fresh alveolar air has more oxygen than arriving blood.', ['Oxygen moves down its concentration gradient.', 'Its net movement is from alveolar air into the blood.']), 'lung-gas-question', 'An alveolus beside a capillary, with two unlabelled arrows pointing in opposite directions.'),
  a.choice('B10-07', 'Why does carbon dioxide diffuse from blood into an alveolus?', ['Its concentration is higher in arriving blood than in alveolar air', 'The alveolus actively pumps every gas', 'Carbon dioxide has no particles'], 0, 'Diffusion has a net direction from higher to lower concentration.', ['Arriving blood contains more carbon dioxide than alveolar air.', 'Carbon dioxide therefore diffuses into the alveolus and can be breathed out.']),
  t('B10-08', 'How alveoli are adapted for gas exchange'),
  a.choice('B10-09', 'How do thin alveolar and capillary walls help gas exchange?', ['They make the diffusion distance short', 'They stop all gases crossing', 'They remove the concentration gradient'], 0, 'Think about the distance a molecule must travel.', ['Thin walls give gases a short route between air and blood.', 'A shorter diffusion distance increases the rate of exchange.']),
  a.choice('B10-10', 'How does blood flow help maintain gas exchange?', ['It brings carbon-dioxide-rich blood and carries oxygenated blood away', 'It keeps the same blood beside each alveolus forever', 'It closes every capillary during breathing'], 0, 'A concentration gradient needs fresh supplies on both sides.', ['Blood flow continually changes the blood beside the alveoli.', 'This helps maintain oxygen and carbon dioxide concentration gradients.']),
  a.choice('B10-13', 'Which structure comes immediately after the trachea on the route into the lungs?', ['The bronchi', 'The alveoli', 'The vena cava'], 0, 'The main airway divides into two large branches.', ['The trachea divides into the left and right bronchi.', 'Bronchi then branch into smaller airways.'], 'recall', true),
  visual(a.choice('B10-14', 'A gas follows arrow X from the alveolus into the capillary. Which gas is it most likely to be?', ['Oxygen', 'Carbon dioxide', 'Nitrogen made by the heart'], 0, 'Which gas must reach cells for aerobic respiration?', ['Oxygen moves from alveolar air into the blood.', 'Blood then transports oxygen around the body.'], 'application', true), 'lung-gas-question', 'An alveolus and capillary with arrow X pointing from the air space into the blood.'),
  a.choice('B10-15', 'Which set contains three adaptations that increase gas-exchange rate?', ['Large surface area, thin walls, good blood supply', 'Small surface area, thick walls, no blood flow', 'Thick mucus, sealed capillaries, no ventilation'], 0, 'Look for more exchange area, a shorter route and maintained gradients.', ['Many alveoli create a large area.', 'Thin walls shorten diffusion distance, while ventilation and blood flow maintain gradients.'], 'understanding', true),
  a.written('B10-17', 'Explain how an alveolus and its blood supply allow rapid gas exchange.', 'Link at least three features to their effects.', 'Many alveoli give a large surface area. Thin alveolar and capillary walls create a short diffusion distance. Ventilation and blood flow maintain concentration gradients, so oxygen diffuses into blood and carbon dioxide diffuses into the alveoli quickly.', ['Many alveoli provide a large surface area.', 'Thin alveolar and capillary walls make the diffusion distance short.', 'Ventilation refreshes alveolar air and helps maintain concentration gradients.', 'Blood flow brings carbon-dioxide-rich blood and carries oxygen away.', 'The directions of oxygen and carbon dioxide diffusion are correct.'], ['Gas exchange is described as happening in the trachea.', 'Oxygen is said to move from blood into alveolar air.', 'Carbon dioxide is said to move from alveolar air into the blood.']),
]

export const lesson10: ScienceLesson = {
  id: 'B-ORG-010-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'The lungs', prerequisites: ['B-DIFFUSION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
