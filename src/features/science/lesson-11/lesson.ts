import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { heartFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.2 The heart and blood vessels' }
const a = author('B-HEART', ['4.2.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
const visual = <S extends ReturnType<typeof a.choice>>(state: S, id: string, description: string): S => ({ ...state, visual: { id, kind: 'cellModel' as const, brief: 'Original Revily schematic; not to scale.', accessibleDescription: description, assessmentDescription: 'An unlabelled original schematic. All information needed to answer is provided in the question.' } })

export const heartSections = [
  { id: 'B11-01', label: 'Start here', detail: 'From the lungs to the heart' },
  { id: 'B11-02', label: 'Two loops, one heart', detail: 'Double circulation' },
  { id: 'B11-05', label: 'Look inside the heart', detail: 'Four chambers and their walls' },
  { id: 'B11-08', label: 'What keeps it beating?', detail: 'Natural and artificial pacemakers' },
  { id: 'B11-11', label: 'The heart’s one-way doors', detail: 'Valves' },
  { id: 'B11-13', label: 'Follow the cell through the heart', detail: 'Chambers and vessels in order' },
  { id: 'B11-16', label: 'On your own', detail: 'Use what you know about the heart' },
]

const states: ScienceState[] = [
  { ...a.choice('B11-01', 'Blood picks up oxygen in the lungs. Where does it go next?', ['Into the stomach', 'Back to the heart', 'Into the trachea'], 1, 'What pumps blood around the body?', ['Blood gains oxygen in the lungs, then flows back to the heart.', 'So the heart can pump it on around the body.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  t('B11-02', 'Two loops, one heart'),
  a.choice('B11-03', 'Why is the human circulatory system called double?', ['Humans have two hearts', 'Blood passes through the heart twice in one full trip', 'Every blood vessel carries two kinds of blood'], 1, 'How many loops meet at the heart?', ['There is one loop to the lungs and one loop to the body.', 'Both loops meet at the heart, so blood passes through it twice in one full trip.']),
  visual(a.choice('B11-04', 'In the diagram, blood in the top loop has just left the heart. Where is it going, and why?', ['To the lungs, to give up oxygen', 'To the body cells, to give them oxygen', 'To the lungs, to pick up oxygen'], 2, 'Which organ does the top loop reach?', ['The top loop runs between the heart and the lung capillaries.', 'So blood leaving the heart in this loop goes to the lungs to pick up oxygen.']), 'heart-double-question', 'Two linked loops meeting at a heart: the top loop reaches the lung capillaries and the bottom loop reaches the body capillaries.'),

  t('B11-05', 'Look inside the heart'),
  a.choice('B11-06', 'Which chambers take in blood as it comes into the heart?', ['The atria', 'The ventricles', 'The thick muscle walls'], 0, 'Which chambers are at the top?', ['The atria are the upper chambers.', 'So they take in blood coming into the heart, then pass it down to the ventricles.']),
  a.choice('B11-07', 'Why does the left ventricle have a thicker wall than the right ventricle?', ['It pumps blood around the whole body, so it must push harder', 'It pumps blood only to the lungs, which are close by', 'It stores blood between heartbeats', 'It takes in blood coming back from the body'], 0, 'Where does each ventricle send blood?', ['The left ventricle pumps blood around the whole body.', 'So it needs more muscle to push blood harder than the right ventricle, which only reaches the lungs.']),

  t('B11-08', 'What keeps the heart beating?'),
  a.choice('B11-09', 'Where is the natural pacemaker?', ['In the wall of the right atrium', 'In the wall of the left ventricle', 'Under the skin, outside the heart'], 0, 'Which chamber are the pacemaker cells in?', ['The natural pacemaker is a group of cells in the wall of the right atrium.', 'So it is part of the heart itself, not under the skin like an artificial pacemaker.']),
  a.choice('B11-10', 'What is an artificial pacemaker for?', ['To correct an irregular heart rate', 'To add oxygen to the blood', 'To make the left ventricle wall thicker'], 0, 'What do its electrical signals control?', ['An artificial pacemaker is a small electrical device that sends signals to the heart.', 'So it keeps the heart beating regularly and corrects an irregular heart rate.']),

  t('B11-11', 'The heart’s one-way doors'),
  a.choice('B11-12', 'What is the job of the valves in the heart?', ['To start each heartbeat', 'To add oxygen to the blood', 'To stop blood flowing backwards'], 2, 'What happens to the flaps if blood starts to flow back?', ['Valves close when blood starts to flow backwards.', 'So they keep blood moving one way through the heart.']),

  t('B11-13', 'Follow the cell through the heart'),
  visual(a.choice('B11-14', 'Blood leaves the right ventricle. Which vessel carries it to the lungs?', ['Pulmonary vein', 'Pulmonary artery', 'Aorta', 'Vena cava'], 1, 'Is this vessel carrying blood away from the heart or back to it?', ['The right ventricle pumps blood away from the heart to the lungs.', 'A vessel carrying blood away from the heart is an artery, so it is the pulmonary artery.']), 'heart-route-question', 'A four-chamber heart with arrows showing flow and the connected vessels shown but not named.'),
  a.choice('B11-15', 'Oxygenated blood comes back from the lungs. Which chamber does it enter first?', ['Right atrium', 'Left ventricle', 'Right ventricle', 'Left atrium'], 3, 'Which side sends blood to the body, and which chambers take blood in?', ['The pulmonary vein brings oxygenated blood back from the lungs to the left atrium.', 'So the blood can then pass to the left ventricle and out to the body.']),

  a.choice('B11-16', 'A doctor finds that one of a patient’s heart valves does not close properly. What is most likely to happen?', ['The natural pacemaker stops sending signals', 'Blood can no longer reach the lungs at all', 'The ventricle wall becomes thinner', 'Some blood flows backwards, so the heart pumps less well'], 3, 'What is a valve meant to stop?', ['A valve closes to stop blood flowing backwards.', 'If it does not close properly, some blood leaks back, so the heart pumps blood forwards less well.'], 'application', true),
  a.choice('B11-17', 'A patient’s resting heart rate was 38, 41 and 36 beats per minute on three days. After an artificial pacemaker was fitted, it was 70, 71 and 70. Which conclusion fits these results?', ['Artificial pacemakers make every heart beat at 70 beats per minute', 'The pacemaker made the patient’s lungs take in more oxygen', 'The patient’s natural pacemaker was repaired', 'In this test, the patient’s resting heart rate was higher and steadier after the pacemaker was fitted'], 3, 'Only say what these readings show.', ['Before, the readings were 36 to 41 beats per minute. After, they were 70 to 71.', 'So in this test, the rate was higher and steadier. One patient cannot show what happens in everyone.'], 'dataInterpretation', true),
  a.choice('B11-18', 'A student writes: “The pulmonary artery carries deoxygenated blood, so it should really be called a vein.” What is wrong?', ['Nothing: vessels carrying deoxygenated blood are veins', 'The pulmonary artery carries oxygenated blood', 'Arteries carry blood away from the heart, whatever its oxygen', 'The pulmonary artery carries blood to the body'], 2, 'What decides whether a vessel is an artery or a vein?', ['A vessel is an artery if it carries blood away from the heart.', 'The pulmonary artery carries blood away from the heart to the lungs, so it is still an artery.'], 'understanding', true),
  a.written('B11-19', 'Explain how the heart moves one red blood cell from the body, to the lungs and back out to the body.', 'Follow the cell in order: into the right side, to the lungs, into the left side, out to the body. Then say what stops it going backwards, and how many times it passes through the heart.', 'The cell comes back from the body in the vena cava to the right atrium, then the right ventricle. The right ventricle pumps it through the pulmonary artery to the lungs, where it picks up oxygen. It comes back in the pulmonary vein to the left atrium, then the left ventricle. The left ventricle pumps it out through the aorta to the body. Valves stop it flowing backwards. It passes through the heart twice, so this is a double circulatory system.', ['The vena cava brings deoxygenated blood to the right atrium, then the right ventricle.', 'The right ventricle pumps blood through the pulmonary artery to the lungs, where it picks up oxygen.', 'The pulmonary vein brings oxygenated blood back to the left atrium, then the left ventricle.', 'The left ventricle pumps blood out through the aorta to the body.', 'Valves stop blood flowing backwards.', 'Blood passes through the heart twice in one full trip, so this is a double circulatory system.'], ['The pulmonary artery and pulmonary vein are swapped.', 'Blood is said to go straight from the right side of the heart into the aorta.', 'Blood is said to pick up oxygen inside the heart.']),
]

export const lesson11: ScienceLesson = {
  id: 'B-ORG-011-B', contentVersion: '0.3.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Circulatory system: the heart', prerequisites: ['B-LUNGS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
