import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { vesselsFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.2 Blood-vessel structure and function; blood-flow rate calculations' }
const a = author('B-BLOOD-VESSELS', ['4.2.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
const visual = (state: ReturnType<typeof a.choice>, id: string, description: string) => ({ ...state, visual: { id, kind: 'cellModel' as const, brief: 'Original Revily schematic; not to scale.', accessibleDescription: description, assessmentDescription: 'Three unlabelled original blood-vessel schematics marked A, B and C.' } })

export const vesselsSections = [
  { id: 'B12-01', label: 'Start here', detail: 'Which vessel carries blood away?' },
  { id: 'B12-02', label: 'Follow blood through three vessels', detail: 'Artery, capillary, then vein' },
  { id: 'B12-07', label: 'Capillary exchange', detail: 'Thin walls and branching networks' },
  { id: 'B12-10', label: 'Blood-flow rate', detail: 'Volume divided by time' },
  { id: 'B12-12', label: 'Apply it independently', detail: 'Identify, compare, explain and calculate' },
]

const states: ScienceState[] = [
  { ...a.choice('B12-01', 'Which type of blood vessel carries blood away from the heart?', ['An artery', 'A vein', 'A capillary only'], 0, 'Use the direction of blood flow, not its oxygen content.', ['Arteries carry blood away from the heart.', 'This definition also works for the pulmonary artery.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B12-02', 'Follow blood through arteries, capillaries and veins'),
  visual(a.choice('B12-03', 'Vessel A has a thick muscular, elastic wall and a relatively small lumen. What is it?', ['An artery', 'A vein', 'A capillary'], 0, 'Which vessel must withstand the highest pressure?', ['Arteries receive blood pumped from the heart at high pressure.', 'A thick, strong, elastic wall is suited to that pressure.']), 'vessel-question', 'Cross-sections of three vessels marked A, B and C. A has a thick wall and smaller lumen.'),
  a.choice('B12-04', 'Why do many veins contain valves?', ['To prevent backflow at lower pressure', 'To increase diffusion distance', 'To make the wall one cell thick'], 0, 'Veins return blood to the heart without a strong pressure pulse.', ['Valves open as blood moves towards the heart.', 'They close if blood begins to move backwards.']),
  a.choice('B12-05', 'Which feature is most important for rapid exchange across a capillary?', ['A wall only one cell thick', 'A very thick muscular wall', 'Several large valves'], 0, 'Diffusion is faster across a shorter distance.', ['A one-cell-thick wall creates a short diffusion path.', 'This supports rapid exchange with nearby cells.']),
  a.choice('B12-06', 'Which comparison is correct?', ['Veins usually have a larger lumen and thinner wall than similar-sized arteries', 'Arteries always contain valves along their length', 'Capillaries have the thickest muscle layer'], 0, 'Compare the pressure in arteries and veins.', ['Veins carry blood at lower pressure.', 'They have thinner walls and a relatively large lumen; valves help maintain one-way flow.']),
  t('B12-07', 'How capillaries exchange substances'),
  a.choice('B12-08', 'Which substance usually diffuses from body cells into nearby capillaries?', ['Carbon dioxide', 'Oxygen from the blood', 'Every plasma protein'], 0, 'Cells produce this waste during respiration.', ['Respiring cells produce carbon dioxide.', 'It diffuses into the blood and is transported towards the lungs.']),
  a.choice('B12-09', 'Why is a branching capillary network useful?', ['It gives a large exchange area and brings blood close to cells', 'It keeps blood far from every cell', 'It prevents all diffusion'], 0, 'Think about area and distance.', ['Many capillaries create a large total surface area.', 'Their network places exchange surfaces close to body cells.']),
  { ...a.worked('B12-10', 'Calculate a blood-flow rate', 'A vessel carries 1,260 cm³ of blood in 7 minutes. Find the mean flow rate in cm³ per minute.', ['Use flow rate = volume ÷ time.', 'Substitute: 1,260 ÷ 7.', 'The mean flow rate is 180 cm³ per minute.'], 'blood-flow-rate'), specRefs: ['4.2.2.2', 'MS 1a', 'MS 1c'] },
  { ...a.choice('B12-11', 'A vein carries 2.4 litres of blood in 8 minutes. What is the mean flow rate?', ['0.3 litres per minute', '10.4 litres per minute', '19.2 litres per minute'], 0, 'Flow rate = volume ÷ time.', ['2.4 ÷ 8 = 0.3.', 'The mean flow rate is 0.3 litres per minute.'], 'calculation'), specRefs: ['4.2.2.2', 'MS 1a', 'MS 1c'] },
  visual(a.choice('B12-12', 'An unlabelled vessel has a large lumen, a thin wall and valves. Which vessel is it?', ['A vein', 'An artery', 'A capillary'], 0, 'Valves and lower pressure are the key clues.', ['A vein has a relatively large lumen and thinner wall.', 'Valves help prevent backflow.'], 'application', true), 'vessel-question', 'Three unlabelled vessel models; one has a large lumen, thin wall and valves.'),
  a.choice('B12-13', 'Which feature–function link is correct?', ['Elastic artery wall — stretches and recoils as pressure changes', 'Capillary muscle — pumps blood around the body', 'Vein wall one cell thick — exchanges gases with every alveolus'], 0, 'Match each feature to the vessel where it is found.', ['Artery walls contain elastic tissue.', 'They stretch under pressure and recoil as pressure falls.'], 'understanding', true),
  a.choice('B12-14', 'Why are capillaries well suited to supplying oxygen to cells?', ['They form networks close to cells and have one-cell-thick walls', 'They have the thickest walls and smallest surface area', 'They carry blood only away from the heart'], 0, 'Use both distance from cells and wall thickness.', ['Capillary networks bring blood close to cells.', 'Thin walls make the diffusion distance short.'], 'application', true),
  { ...a.choice('B12-15', 'A vessel carries 1,575 cm³ of blood in 9 minutes. What is the flow rate?', ['175 cm³ per minute', '1,566 cm³ per minute', '14,175 cm³ per minute'], 0, 'Divide volume by time.', ['1,575 ÷ 9 = 175.', 'The unit is cm³ per minute.'], 'calculation', true), specRefs: ['4.2.2.2', 'MS 1a', 'MS 1c'] },
  a.written('B12-16', 'Compare an artery with a vein and explain how each is suited to its job.', 'Give linked differences about direction, pressure, walls, lumen or valves.', 'An artery carries blood away from the heart at high pressure, so it has a thick muscular and elastic wall and a relatively small lumen. A vein returns blood at lower pressure, so it has a thinner wall and larger lumen. Vein valves prevent backflow.', ['Arteries carry blood away from the heart; veins carry blood towards it.', 'Arteries carry blood at higher pressure than veins.', 'Arteries have thicker muscular and elastic walls to withstand pressure.', 'Veins have thinner walls and a relatively larger lumen.', 'Valves in many veins prevent backflow.'], ['All arteries are said to carry oxygenated blood.', 'All veins are said to carry deoxygenated blood.', 'Capillaries are described as having thick muscular walls.']),
]

export const lesson12: ScienceLesson = {
  id: 'B-ORG-012-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Circulatory system: blood vessels', prerequisites: ['B-HEART'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
