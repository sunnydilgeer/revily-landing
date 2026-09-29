import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsMeasureFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 1 and AT 2 (measuring mass, volumes of liquids and volumes of gases), as on the supplied revision page' }
const skill = 'W-PRC-013-W'
const a = author(skill, ['AT 1', 'AT 2'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsMeasureSections = [
  { id: 'W13-01', label: 'Start here', detail: 'Weighing a powder' },
  { id: 'W13-02', label: 'How do you measure mass?', detail: 'Zero, transfer and difference' },
  { id: 'W13-04', label: 'How do you measure a liquid?', detail: 'Pipettes, cylinders and the meniscus' },
  { id: 'W13-07', label: 'How do you measure a gas?', detail: 'Syringe, upturned cylinder and bubbles' },
  { id: 'W13-10', label: 'On your own', detail: 'Choosing and using equipment' },
]

const states: ScienceState[] = [
  { ...a.choice('W13-01', 'You want to weigh 5 g of powder in a beaker on a balance. What should you do first?', ['Add the powder, then guess the beaker’s mass', 'Put the empty beaker on the balance and set it to zero', 'Press down on the balance to steady it', 'Pour the powder straight onto the pan'], 1, 'Think about how to show only the mass of the powder.', ['Put the empty beaker on first and set the balance to zero.', 'Then the reading shows only the mass of the powder you add.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W13-02', 'How do you measure mass?'),
  a.choice('W13-03', 'Why do you set the balance to zero with the empty container on it?', ['So the balance shows only the mass of what you add', 'So the container becomes heavier', 'So the balance switches itself off', 'So the mass is shown in kilograms'], 0, 'Think about what the reading should show once you add the substance.', ['Setting the balance to zero with the container on it removes the container’s mass from the reading.', 'The number you then read is only the mass of the substance.'], 'understanding'),
  t('W13-04', 'How do you measure a liquid?'),
  a.choice('W13-05', 'How should you read the volume of a liquid in a measuring cylinder?', ['With your eye above the top of the cylinder, reading the top of the liquid', 'With your eye below the cylinder, reading the top of the curve', 'With your eye level with the liquid, reading the bottom of the meniscus', 'By reading the label printed on the side'], 2, 'The meniscus is the curved surface of the liquid.', ['Put your eye level with the liquid and read from the bottom of the meniscus.', 'Looking from above or below makes the reading wrong.'], 'practicalReasoning'),
  a.choice('W13-06', 'A student needs just two drops of indicator in a test tube. Which equipment is best?', ['A measuring cylinder', 'A pipette with a filler', 'A beaker', 'A dropping pipette'], 3, 'The volume does not need to be exact.', ['A dropping pipette gives a few drops when you squeeze the bulb.', 'A pipette is for one exact volume, and a measuring cylinder is for larger volumes.'], 'application'),
  t('W13-07', 'How do you measure a gas?'),
  a.choice('W13-08', 'Which method gives the most accurate measurement of a gas volume?', ['A gas syringe', 'Counting bubbles', 'Judging how much froth there is', 'Timing how long it fizzes'], 0, 'Think about a method with a proper scale that the gas pushes along.', ['A gas syringe has a scale, and the gas pushes the plunger out.', 'The other methods are rough, so they are less accurate.'], 'understanding'),
  a.choice('W13-09', 'Why is counting bubbles a less accurate way to measure a gas?', ['All bubbles are exactly the same size', 'A gas cannot make bubbles', 'Bubbles can be different sizes, and they are hard to count', 'Bubbles are always heavier than the gas'], 2, 'Think about whether one bubble always holds the same amount of gas.', ['Bubbles vary in size, and fast bubbling is hard to count.', 'It is still useful for comparing a fast reaction with a slow one.'], 'practicalReasoning'),
  a.choice('W13-10', 'Look at the numbered marks on the measuring cylinder. Which mark shows where to read the volume?', ['Mark 1', 'Mark 2', 'Mark 3', 'Mark 4'], 2, 'Read from the bottom of the curved surface of the liquid.', ['The bottom of the meniscus is where you read the volume.', 'Mark 1 is the edge of the curve, which would give a reading that is too high.'], 'application', true, 'wsmeasure-q-meniscus'),
  a.choice('W13-11', 'A beaker of salt reads 48.6 g. After the salt is tipped out, the beaker reads 45.1 g. What mass was moved?', ['3.5 g', '93.7 g', '45.1 g', '2.5 g'], 0, 'Use the difference between the two readings.', ['Mass of salt = 48.6 − 45.1 = 3.5 g.', 'Adding the readings would be wrong. You want the difference.'], 'calculation', true),
  a.choice('W13-12', 'A student needs exactly 10 cm³ of solution, drawn up safely without using their mouth. What should they use?', ['A dropping pipette', 'A pipette with a pipette filler', 'A 1000 cm³ measuring cylinder', 'A beaker with a scale on the side'], 1, 'You need one exact volume, and a safe way to draw it up.', ['A pipette measures one exact volume, and the filler draws the liquid up safely.', 'A large cylinder is too big to read 10 cm³ accurately.'], 'practicalReasoning', true),
  a.choice('W13-13', 'A class compares how much gas two reactions make and needs the most accurate volumes. What should they do?', ['Count the bubbles for one minute', 'Collect each gas in a gas syringe and read the scale', 'Judge which reaction looks fizzier', 'Ask which reaction sounds louder'], 1, 'Pick the method with a scale that the gas pushes along.', ['A gas syringe gives the most accurate volume of a gas.', 'Counting bubbles and judging by eye are rougher methods.'], 'practicalReasoning', true),
  a.written('W13-14', 'Describe how you would carefully measure out 4.0 g of copper sulfate and 25 cm³ of water.', 'Think about the balance, the right size of equipment and where to read from.', 'I would put a weighing container on the balance and set the balance to zero. Then I would add the solid slowly until it reads 4.0 g. For the water I would use a measuring cylinder that is the right size for 25 cm³. I would put my eye level with the liquid and read from the bottom of the meniscus.', ['Set the balance to zero with the container on it.', 'Add the solid until the balance reads 4.0 g.', 'Use a measuring cylinder of a suitable size.', 'Read the volume at eye level from the bottom of the meniscus.'], ['Reading from the top of the liquid.', 'Adding the solid without zeroing the balance.', 'Using a cylinder far too large for the volume.']),
]

export const lessonW13: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Measuring mass, liquids and gases', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
