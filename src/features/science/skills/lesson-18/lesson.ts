import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsGasFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 3 (collecting gases, drawing scientific apparatus), as on the supplied revision page' }
const skill = 'W-PRC-018-W'
const a = author(skill, ['AT 3'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsGasSections = [
  { id: 'W18-01', label: 'Start here', detail: 'Catching a gas' },
  { id: 'W18-02', label: 'How do you collect a gas over water?', detail: 'Upturned cylinder, sealed system' },
  { id: 'W18-06', label: 'Which container should you use?', detail: 'Cylinder, test tube and bung' },
  { id: 'W18-09', label: 'How do you draw your apparatus?', detail: 'Flat side-on scientific drawings' },
  { id: 'W18-12', label: 'On your own', detail: 'Volumes, set-ups and drawings' },
]

const states: ScienceState[] = [
  { ...a.choice('W18-01', 'A reaction gives off a gas and you want to measure how much. Which set-up would work?', ['Open the flask and count the bubbles by eye', 'Pour the gas into a beaker', 'Lead the gas along a tube into a measuring cylinder full of water', 'Wait for the gas to turn into a liquid'], 2, 'You need a way to trap the gas and read a scale.', ['A gas can be led along a delivery tube into a measuring cylinder.', 'The scale on the cylinder then shows how much gas was made.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W18-02', 'How do you collect a gas over water?'),
  a.worked('W18-03', 'Find the volume of gas collected', 'A piece of magnesium ribbon reacts with dilute acid. The gas is collected over water. The water level starts at 5 cm³ and ends at 47 cm³. Find the volume of gas.', ['The starting level is 5 cm³ and the final level is 47 cm³.', 'Volume of gas = final level − starting level.', '47 − 5 = 42 cm³.', 'The volume of gas collected is 42 cm³.'], 'wsgas-worked-volume'),
  a.choice('W18-04', 'In a gas collection, the water level starts at 8 cm³ and ends at 53 cm³. What volume of gas was collected?', ['61 cm³', '45 cm³', '53 cm³', '8 cm³'], 1, 'Subtract the starting level from the final level.', ['Volume of gas = final level − starting level.', '53 − 8 = 45 cm³. Adding the levels, 61 cm³, would be wrong.'], 'calculation'),
  a.choice('W18-05', 'Why must the delivery tube go completely inside the measuring cylinder?', ['So that no gas escapes into the air', 'So that the water gets warmer', 'So that the gas can be seen', 'So that the gas dissolves in the water'], 0, 'Think about where the gas could get out.', ['If the tube is not fully inside, some gas escapes.', 'Then the volume you read would be too small.'], 'practicalReasoning'),
  t('W18-06', 'Which container should you use?'),
  a.choice('W18-07', 'Which set-up is best for keeping a small sample of gas to test later?', ['A measuring cylinder left open on the bench', 'A beaker of water with the gas bubbling through it', 'A flask left open on the bench', 'A test tube full of gas with a bung in the top'], 3, 'You need to stop the gas escaping.', ['A bung in the top of the test tube seals the gas inside.', 'You can then keep the tube and test the gas later.'], 'practicalReasoning'),
  a.choice('W18-08', 'A student wants to know how much gas a reaction makes. Which equipment should they choose?', ['A test tube, because it is small', 'A beaker, because it is wide', 'A measuring cylinder, because it has a scale', 'A bung, because it seals'], 2, 'You need something that shows a volume.', ['A measuring cylinder has a scale that shows the volume.', 'A test tube has no scale, so it is better for collecting a sample.'], 'application'),
  t('W18-09', 'How do you draw your apparatus?'),
  a.choice('W18-10', 'Which rule is correct for a scientific drawing of apparatus?', ['Draw it in three dimensions with shading', 'Draw each piece as a flat side view, using a ruler for straight lines', 'Draw it from above', 'Draw it quickly and skip the labels'], 1, 'A scientific drawing is simple and flat.', ['Scientific drawings show each piece from the side as a flat shape.', 'Use a ruler for straight lines and add labels.'], 'recall'),
  a.choice('W18-11', 'How do you show in a drawing that a test tube is sealed?', ['Draw a bung in the top', 'Colour the tube in', 'Draw bubbles at the bottom', 'Draw the tube upside down'], 0, 'Think about what seals a test tube.', ['A bung seals the top of the tube.', 'Without a bung, the drawing would show an open tube.'], 'understanding'),
  a.choice('W18-12', 'Hydrogen is collected over water. The level starts at 12 cm³ and ends at 68 cm³. What volume is collected?', ['80 cm³', '12 cm³', '68 cm³', '56 cm³'], 3, 'Final level minus starting level.', ['Volume = final level − starting level.', '68 − 12 = 56 cm³.'], 'calculation', true),
  a.choice('W18-13', 'Look at the diagram of a gas being collected. Which numbered part will collect and measure the gas?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 1, 'Look for the part with a scale, turned upside down.', ['Part 2 is the upturned measuring cylinder. The gas pushes water out of it.', 'Part 3 only carries the gas. Part 1 is where the gas is made.'], 'practicalReasoning', true, 'wsgas-q-collect'),
  a.written('W18-14', 'Describe how to collect a gas from a reaction and measure its volume. Include what you would draw.', 'Think about the set-up, the levels and keeping the gas in.', 'I would fill a measuring cylinder with water and turn it upside down in a trough of water. I would put the delivery tube from the sealed flask completely inside the cylinder. I would note the starting level and start the reaction. The gas pushes water out of the cylinder. Then I would read the final level and take the starting level from it to get the volume. In my drawing I would draw each piece flat from the side, with a bung in the flask, and label every part.', ['Cylinder filled with water and turned upside down in water.', 'Delivery tube from a sealed flask completely inside the cylinder.', 'Note the starting level before the reaction.', 'Volume = final level − starting level.', 'A flat side-view drawing with labels.'], ['Leaving the flask open.', 'Adding the levels instead of subtracting.', 'Drawing the apparatus in 3D with shading.']),
]

export const lessonW18: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Collecting gases and drawing apparatus', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
