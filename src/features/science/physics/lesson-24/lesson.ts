import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { appliancePowerFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.4.1 Power (energy transferred by appliances, E = P t); 6.2.4.2 Energy transfers in everyday appliances (power ratings), as on the supplied revision page' }
const skill = 'P-APPLIANCE-POWER'
const transfers = author(skill, ['6.2.4.1'], ['aqa-physics'])
const energy = author(skill, ['6.2.4.1', '6.2.4.2'], ['aqa-physics'])
const rating = author(skill, ['6.2.4.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const appliancePowerSections = [
  { id: 'P24-01', label: 'Start here', detail: 'Two kettles, two power ratings' },
  { id: 'P24-02', label: 'How do appliances transfer energy?', detail: 'Electrical work and energy stores' },
  { id: 'P24-05', label: 'How much energy is transferred?', detail: 'E = P × t and changing minutes to seconds' },
  { id: 'P24-08', label: 'What is a power rating?', detail: 'Maximum safe power, cost and speed' },
  { id: 'P24-11', label: 'On your own', detail: 'Calculating and comparing appliances' },
]

const states: ScienceState[] = [
  { ...transfers.choice('P24-01', 'Two kettles hold the same amount of water. One is rated 2000 W and the other 3000 W. Which transfers energy faster?', ['The 2000 W kettle', 'The 3000 W kettle', 'Both transfer energy at the same rate', 'There is no way to tell'], 1, 'Power is the energy transferred each second.', ['Power is how fast energy is transferred.', 'A bigger power rating means energy is transferred faster.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(transfers, 'P24-02', 'How do appliances transfer energy?'),
  transfers.choice('P24-03', 'What happens when charge moves around a circuit?', ['No energy is transferred', 'Energy is stored in the wires for ever', 'The charge is used up', 'Work is done and energy is transferred electrically'], 3, 'Whenever work is done, energy is transferred.', ['Charge does work against the resistance of the circuit.', 'So energy is transferred electrically.']),
  transfers.choice('P24-04', 'Which describes the energy transfer in a handheld fan run from a battery?', ['Energy is transferred electrically from the chemical store of the battery to the kinetic store of the motor', 'Energy is transferred by heating from the kinetic store of the motor to the battery', 'Energy is transferred mechanically from the thermal store of the battery to the fan', 'No energy is transferred'], 0, 'Think where the energy starts and where it ends up.', ['The battery is the chemical store.', 'Energy is transferred electrically to the kinetic store of the motor.'], 'recall'),
  t(energy, 'P24-05', 'How much energy is transferred?'),
  energy.choice('P24-06', 'A 1500 W hairdryer is used for 3 minutes. How much energy does it transfer?', ['4500 J', '8.3 J', '270 000 J', '1503 J'], 2, 'Change the minutes to seconds first.', ['t = 3 × 60 = 180 s.', 'E = P × t = 1500 × 180 = 270 000 J.'], 'calculation'),
  energy.choice('P24-07', 'A lamp is left on for twice as long. What happens to the energy it transfers?', ['It halves', 'It doubles', 'It stays the same', 'It becomes four times bigger'], 1, 'E = P × t, and the power stays the same.', ['Energy transferred is power × time.', 'Twice the time gives twice the energy.']),
  t(rating, 'P24-08', 'What is a power rating?'),
  rating.choice('P24-09', 'An appliance has a power rating of 2000 W. What does this tell you?', ['It can safely transfer up to 2000 J of energy each second', 'It must be switched on for 2000 s', 'It transfers 2000 J in total', 'It has 2000 V across it'], 0, 'A watt is a joule per second.', ['The power rating is the maximum safe power.', '2000 W means up to 2000 J of energy is transferred each second.'], 'recall'),
  rating.choice('P24-10', 'A 600 W microwave and an 850 W microwave are each used for 5 minutes. Which statement is correct?', ['Both cost the same', 'The 600 W microwave costs more', 'The 850 W microwave transfers more energy, so it costs more', 'The 850 W microwave transfers less energy'], 2, 'Same time, different power.', ['The same time with a higher power means more energy transferred.', 'More energy transferred costs more.']),
  energy.choice('P24-11', 'A 60 W lamp is on for 5 minutes. How much energy does it transfer?', ['300 J', '12 J', '60 005 J', '18 000 J'], 3, 'Change the time to seconds, then use E = P × t.', ['t = 5 × 60 = 300 s.', 'E = P × t = 60 × 300 = 18 000 J.'], 'calculation', true),
  rating.choice('P24-12', 'Look at the rating labels. Which appliance transfers the most energy each second?', ['Appliance 1', 'Appliance 2', 'Appliance 3', 'They are all the same'], 1, 'Find the biggest power rating.', ['Power is the energy transferred each second.', 'Appliance 2 has the biggest power rating.'], 'dataInterpretation', true, 'appower-q-labels'),
  energy.choice('P24-13', 'A 250 W radio is on for 4 minutes. How much energy does it transfer?', ['60 000 J', '1000 J', '254 J', '62.5 J'], 0, 'Time first: minutes to seconds.', ['t = 4 × 60 = 240 s.', 'E = P × t = 250 × 240 = 60 000 J.'], 'calculation', true),
  transfers.choice('P24-14', 'A phone charger is plugged into the mains and charges a phone. Which is the best description?', ['Energy is transferred from the phone to the mains', 'Energy is transferred by heating from the mains to the phone', 'Energy is transferred electrically from the mains to the chemical store of the phone battery', 'No energy is transferred'], 2, 'Think about how the energy gets to the phone battery.', ['The mains supplies the energy through a current.', 'So energy is transferred electrically to the chemical store of the battery.'], 'understanding', true),
  energy.written('P24-15', 'A 1200 W heater is on for 10 minutes. Work out the energy it transfers and say what 1200 W tells you.', 'Time to seconds, equation, substitute, then the meaning of the rating.', 'The time must be in seconds: 10 minutes is 10 × 60 = 600 s. The equation is energy transferred = power × time, E = P × t. So E = 1200 × 600 = 720 000 J. The power rating of 1200 W is the maximum safe power of the heater. It tells you the heater transfers up to 1200 J of energy each second.', ['Change 10 minutes into 600 seconds.', 'Use E = P × t (energy transferred = power × time).', 'E = 1200 × 600 = 720 000 J.', 'The power rating is the maximum safe power, up to 1200 J transferred each second.'], ['Multiplying by 10 without changing minutes to seconds.', 'Saying the power rating is the total energy transferred.', 'Giving the answer without a unit.']),
]

export const lessonP24: ScienceLesson = {
  id: 'P-ELE-024-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Power of electrical appliances', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
