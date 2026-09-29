import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { gasRateFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.6.1.1 Rates of reaction and 5.6.1.2 Factors which affect the rates of chemical reactions (required practical: how changing concentration affects the rate, measured by gas collected), as on the supplied revision page' }
const skill = 'C-RATE-MEASURE-GAS'
const gas = author(skill, ['5.6.1.1', '5.6.1.2'], ['aqa-chemistry'])
const mass = author(skill, ['5.6.1.1', '5.6.1.2'], ['aqa-chemistry'])
const fair = author(skill, ['5.6.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const gasRateSections = [
  { id: 'C33-01', label: 'Start here', detail: 'Comparing two fizzing reactions' },
  { id: 'C33-02', label: 'Collecting the gas', detail: 'Upturned cylinder, gas syringe, readings' },
  { id: 'C33-05', label: 'Using a balance', detail: 'Mass falls as gas escapes' },
  { id: 'C33-08', label: 'A fair test on concentration', detail: 'Change one thing, compare the gas' },
  { id: 'C33-11', label: 'On your own', detail: 'Apparatus, data, a calculation and a plan' },
]

const states: ScienceState[] = [
  { ...gas.choice('C33-01', 'Two reactions both fizz and give off gas. How could you tell which is the faster reaction?', ['Wait until the fizzing stops', 'Compare how much gas each gives off in the same time', 'Compare the colour of the gas', 'Compare the mass of the flasks at the start'], 1, 'Think about how much gas appears each second.', ['A faster reaction makes gas more quickly.', 'So you compare how much gas is made in the same time.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(gas, 'C33-02', 'Collecting the gas'),
  gas.choice('C33-03', 'Which piece of equipment can measure the volume of gas given off in a reaction?', ['A thermometer', 'A balance', 'A gas syringe', 'A conical flask'], 2, 'You need something that shows a volume of gas.', ['A gas syringe collects the gas and shows its volume in cm³.', 'An upturned measuring cylinder full of water can also be used.'], 'recall'),
  gas.choice('C33-04', 'A cylinder reads 4 cm³ at the start. After 30 s it reads 19 cm³. What volume of gas has been produced?', ['23 cm³', '4 cm³', '19 cm³', '15 cm³'], 3, 'Subtract the starting reading from the new reading.', ['Volume produced = reading − starting reading.', '19 − 4 = 15 cm³.'], 'calculation'),
  t(mass, 'C33-05', 'Using a balance'),
  mass.choice('C33-06', 'A flask of reacting chemicals stands on a balance with the top open. Why does the reading fall?', ['A gas is made and escapes into the air', 'The acid is used up as a liquid', 'The balance is not accurate', 'The chemicals lose their mass as they get hot'], 0, 'Where does the gas go if nothing catches it?', ['The gas leaves the flask, so the mass of the flask and contents goes down.', 'The quicker the reading falls, the faster the reaction.'], 'understanding'),
  mass.choice('C33-07', 'What is the cotton wool in the neck of the flask for?', ['To speed up the reaction', 'To collect the gas', 'To let gas escape but stop acid spitting out', 'To make the balance more accurate'], 2, 'Think about what should leave the flask and what should not.', ['Gas passes through the cotton wool.', 'Drops of acid are trapped, so they do not spoil the mass readings.'], 'understanding'),
  t(fair, 'C33-08', 'A fair test on concentration'),
  fair.choice('C33-09', 'You test how acid concentration affects the rate with marble chips. Which variable must you keep the same?', ['The concentration of the acid', 'The time you wait', 'The volume of gas collected', 'The mass of marble chips'], 3, 'Only one thing should change: the concentration.', ['In a fair test you change only the concentration.', 'The mass of marble chips, volume of acid and temperature stay the same.'], 'application'),
  fair.choice('C33-10', 'After 30 s, acid A gave 18 cm³ of gas and acid B gave 31 cm³. What does this suggest?', ['The reaction with acid B was faster', 'The reaction with acid A was faster', 'Acid B was the weaker acid', 'The reactions went at the same rate'], 0, 'Compare the gas made in the same time.', ['More gas in the same time means a faster reaction.', 'So the reaction with acid B was faster.'], 'dataInterpretation'),
  gas.choice('C33-11', 'The diagram shows gas collection. Which numbered part measures the volume of gas?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'It is the tube that fills with gas and pushes water out.', ['Part 3 is the upside-down measuring cylinder.', 'Its scale shows how much gas has been collected.'], 'understanding', true, 'gasrate-q-set'),
  mass.choice('C33-12', 'The table shows a balance reading at four times. In which time interval was the reaction fastest?', ['60 to 90 s', '0 to 30 s', '30 to 60 s', 'All three were the same'], 1, 'Find where the mass falls the most.', ['The mass fell by 1.2 g in the first 30 s.', 'It fell by less in each later interval, so the reaction was fastest at the start.'], 'dataInterpretation', true, 'gasrate-q-table'),
  gas.choice('C33-13', 'A cylinder reads 6 cm³ at the start and 31 cm³ after 40 s. What volume of gas was produced?', ['37 cm³', '31 cm³', '25 cm³', '6 cm³'], 2, 'Subtract the starting reading.', ['Volume produced = reading − starting reading.', '31 − 6 = 25 cm³.'], 'calculation', true),
  mass.choice('C33-14', 'A reaction gives off a toxic gas. What is the problem with measuring it on an open balance?', ['The gas is released into the room', 'The balance cannot measure a mass', 'The mass would go up', 'The reaction would stop'], 0, 'Where does the gas end up?', ['With an open flask, the gas escapes into the air of the room.', 'A toxic gas should be collected, or the work done in a fume cupboard, as your teacher directs.'], 'application', true),
  fair.written('C33-15', 'Plan how to compare the rate of marble chips with two concentrations of acid by collecting gas. Say what stays the same.', 'What do you change, what do you measure and what stays the same?', 'Put a set volume of the first concentration of acid in a conical flask. Add a set mass of marble chips, quickly attach the delivery tube to an upturned measuring cylinder full of water (or a gas syringe), and start the stopwatch. Read the volume of gas at regular intervals, such as every 10 s, and write the readings in a table. Repeat with the second concentration. Change only the concentration. Keep the volume of acid, the mass of marble chips and the temperature the same. The one that gives more gas in the same time is the faster reaction.', ['Uses a set volume of acid and a set mass of marble chips in a flask.', 'Collects the gas in an upturned measuring cylinder or gas syringe.', 'Starts the stopwatch as the reaction starts and reads the gas volume at regular intervals.', 'Changes only the acid concentration.', 'Keeps the volume of acid, mass of chips and temperature the same.', 'Says more gas in the same time means a faster reaction.'], ['Changing more than one variable.', 'Measuring the time for the acid to disappear.', 'Forgetting to say how the gas is measured.']),
]

export const lessonC33: ScienceLesson = {
  id: 'C-RAT-033-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Measuring rates using gas', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
