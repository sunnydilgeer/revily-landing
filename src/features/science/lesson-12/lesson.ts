import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { vesselsFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.2 Blood-vessel structure and function; blood-flow rate calculations' }
const a = author('B-BLOOD-VESSELS', ['4.2.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
const maths = ['4.2.2.2', 'MS 1a', 'MS 1c']
const visual = (state: ReturnType<typeof a.choice>, description: string) => ({ ...state, visual: { id: 'vessel-question', kind: 'cellModel' as const, brief: 'Original Revily schematic; not to scale.', accessibleDescription: description, assessmentDescription: 'Three unlabelled original blood-vessel schematics marked A, B and C.' } })

export const vesselsSections = [
  { id: 'B12-01', label: 'Start here', detail: 'Where does the aorta go?' },
  { id: 'B12-02', label: 'Away from the heart', detail: 'Arteries' },
  { id: 'B12-05', label: 'Into the muscle', detail: 'Capillaries and exchange' },
  { id: 'B12-08', label: 'Back to the heart', detail: 'Veins and valves' },
  { id: 'B12-11', label: 'How much blood flows?', detail: 'Rate of blood flow' },
  { id: 'B12-14', label: 'On your own', detail: 'Vessels, data and flow rates' },
]

const states: ScienceState[] = [
  { ...a.choice('B12-01', 'In Lesson 11, blood leaves the left ventricle in the aorta. Where does the aorta take it?', ['Back to the lungs', 'Out to the body', 'Into the right atrium'], 1, 'Which side of the heart pumps blood to the body?', ['The left ventricle pumps blood into the aorta.', 'So the aorta carries blood out to the body.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  t('B12-02', 'Away from the heart'),
  visual(a.choice('B12-03', 'Vessel A has a thick wall of muscle and elastic fibres. What is it?', ['A vein', 'A capillary', 'An artery'], 2, 'Which vessel takes blood at high pressure?', ['Arteries carry blood away from the heart at high pressure.', 'So they need thick walls of muscle and elastic fibres.']), 'Cross-sections of three vessels marked A, B and C. A has the thickest wall.'),
  a.choice('B12-04', 'The pulmonary artery carries blood low in oxygen. Why is it still an artery?', ['Arteries are named by oxygen, and it has a little oxygen', 'It carries blood away from the heart', 'It carries blood towards the heart'], 1, 'Are arteries named by direction or by oxygen?', ['An artery is named by the direction the blood flows.', 'The pulmonary artery carries blood away from the heart, so it is an artery.']),

  t('B12-05', 'Into the muscle'),
  a.choice('B12-06', 'Why does oxygen pass quickly from a capillary into a muscle cell?', ['The wall is one cell thick, so the distance is short', 'The wall is thick and strong, so it pushes oxygen out', 'Valves in the capillary push oxygen out'], 0, 'How thick is a capillary wall?', ['Capillary walls are one cell thick.', 'So oxygen has only a short distance to diffuse, and it moves fast.']),
  a.choice('B12-07', 'Which substance diffuses out of a working muscle cell into the capillary?', ['Oxygen', 'Glucose', 'Carbon dioxide'], 2, 'What waste does respiration make?', ['The muscle cell makes carbon dioxide during respiration.', 'So carbon dioxide diffuses from the cell into the blood.']),

  t('B12-08', 'Back to the heart'),
  visual(a.choice('B12-09', 'Which vessel has a thin wall, a wide lumen and valves?', ['Vessel A', 'Vessel B', 'Vessel C'], 1, 'Which vessel carries blood at low pressure back to the heart?', ['Veins carry blood at low pressure, so they have thin walls and a wide lumen.', 'Vessel B has these features and valves, so it is a vein.']), 'Cross-sections and lengthwise views of three unlabelled vessels marked A, B and C.'),
  a.choice('B12-10', 'Why do many veins have valves?', ['To stop blood flowing backwards', 'To raise the blood pressure', 'To let oxygen out into the cells'], 0, 'What could low-pressure blood do?', ['Blood in veins is at low pressure, so it could slip backwards.', 'So valves close to keep blood flowing one way, towards the heart.']),

  t('B12-11', 'How much blood flows?'),
  { ...a.worked('B12-12', 'Work out a rate of blood flow', '1,260 cm³ of blood flows through an artery in 7 minutes. What is the rate of blood flow?', ['Write the rule: rate of blood flow = volume of blood ÷ time.', 'Put in the numbers: 1,260 cm³ ÷ 7 minutes.', 'Work it out: 1,260 ÷ 7 = 180.', 'Add the units: 180 cm³ per minute.'], 'blood-flow-rate'), specRefs: maths },
  { ...a.choice('B12-13', '1,350 cm³ of blood flows through an artery in 9 minutes. What is the rate of blood flow?', ['12,150 cm³ per minute', '150 cm³ per minute', '1,341 cm³ per minute'], 1, 'Use rate = volume of blood ÷ time.', ['Rate of blood flow = volume of blood ÷ time.', '1,350 cm³ ÷ 9 minutes = 150 cm³ per minute.'], 'calculation'), specRefs: maths },

  a.choice('B12-14', 'A student writes: “Veins carry blood towards the heart at high pressure, so they have thick walls.” What is wrong?', ['Veins carry blood away from the heart', 'Veins have no walls at all', 'Veins have walls one cell thick', 'Blood in veins is at low pressure, so vein walls are thinner'], 3, 'Compare the pressure in arteries and veins.', ['Blood has lost most of its pressure by the time it reaches the veins.', 'So veins have thinner walls than arteries.'], 'understanding', true),
  visual(a.choice('B12-15', 'Look at vessel C. Why is it best for swapping substances with muscle cells?', ['Its wall is one cell thick', 'It has the thickest muscle wall', 'It has valves to stop backflow'], 0, 'Which vessel lets substances cross fastest?', ['Vessel C is a capillary, with walls one cell thick.', 'So substances only diffuse a short distance between blood and cells.'], 'application', true), 'Three unlabelled vessels marked A, B and C. C is the smallest, with red blood cells in single file.'),
  { ...a.choice('B12-16', 'In this test, 3,600 cm³ of blood flowed to a leg muscle in 4 minutes of running. What was the rate of blood flow?', ['14,400 cm³ per minute', '3,596 cm³ per minute', '900 cm³ per minute'], 2, 'Use rate = volume of blood ÷ time.', ['Rate of blood flow = volume of blood ÷ time.', '3,600 cm³ ÷ 4 minutes = 900 cm³ per minute.'], 'calculation', true), specRefs: maths },
  a.choice('B12-17', 'In this test, blood flow to the leg muscle was 300 cm³ per minute at rest and 900 cm³ per minute when running. Which conclusion fits?', ['Running always triples blood flow in everyone', 'The muscle got no blood at rest', 'Blood flowed more slowly when running', 'In this test, more blood reached the muscle each minute when running'], 3, 'Only say what these results show.', ['900 cm³ per minute is more than 300 cm³ per minute.', 'So in this test, more blood reached the muscle when running. One test cannot show what happens in everyone.'], 'dataInterpretation', true),
  a.written('B12-18', 'Follow blood from the aorta to a working leg muscle and back to the vena cava. Explain how each type of vessel suits its job.', 'Go in order: artery, capillary, vein. For each, say which way the blood goes and one feature that helps.', 'Blood leaves the heart in the aorta and flows through arteries, which carry blood away from the heart at high pressure. Their thick walls of muscle and elastic fibres withstand this. In the muscle, capillaries have walls one cell thick, so oxygen and glucose diffuse quickly into the cells and carbon dioxide diffuses into the blood. Veins carry blood towards the heart at low pressure, so they have thinner walls and a wide lumen. Valves stop blood flowing backwards. The veins join the vena cava.', ['Arteries carry blood away from the heart at high pressure.', 'Arteries have thick walls of muscle and elastic fibres to withstand the pressure.', 'Capillary walls are one cell thick, so the diffusion distance is short.', 'Oxygen and glucose diffuse into the muscle cells, and carbon dioxide diffuses into the blood.', 'Veins carry blood towards the heart at low pressure, with thinner walls and a wide lumen.', 'Valves in veins stop blood flowing backwards.'], ['All arteries are said to carry oxygen-rich blood.', 'Capillaries are said to have thick muscular walls.', 'Veins are said to carry blood away from the heart.', 'Carbon dioxide is said to move from the blood into the muscle cell.']),
]

export const lesson12: ScienceLesson = {
  id: 'B-ORG-012-B', contentVersion: '0.3.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Circulatory system: blood vessels', prerequisites: ['B-HEART'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
