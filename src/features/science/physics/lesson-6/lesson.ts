import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { powerFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.1.4 Power (power as the rate of energy transfer or the rate of doing work; the watt; P = E ÷ t and P = W ÷ t; a more powerful machine transfers more energy in the same time), as on the supplied revision page' }
const skill = 'P-POWER'
const idea = author(skill, ['6.1.1.4'], ['aqa-physics'])
const calc = author(skill, ['6.1.1.4'], ['aqa-physics'])
const energy = author(skill, ['6.1.1.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const powerSections = [
  { id: 'P6-01', label: 'Start here', detail: 'Two motors lifting the same box' },
  { id: 'P6-02', label: 'What is power?', detail: 'How fast energy is transferred, in watts' },
  { id: 'P6-05', label: 'How do you work out power?', detail: 'Energy ÷ time, with seconds' },
  { id: 'P6-09', label: 'How do you find the energy?', detail: 'Turning the equation round' },
  { id: 'P6-12', label: 'On your own', detail: 'Calculations, a mistake and some data' },
]

const states: ScienceState[] = [
  { ...idea.choice('P6-01', 'Two motors lift identical boxes equally high. Motor A takes 5 seconds and motor B takes 10 seconds. What is true?', ['Motor B transfers more energy to its box', 'Motor A transfers the same energy in less time', 'Motor A transfers less energy to its box', 'Neither motor transfers any energy'], 1, 'The boxes and the height are the same. What is different?', ['Both boxes gain the same amount of energy, because they are identical and lifted equally high.', 'Motor A does the job in less time, so it transfers the energy faster.'], 'understanding'), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P6-02', 'What is power?'),
  idea.choice('P6-03', 'Which of these is a unit of power?', ['Second', 'Joule', 'Newton', 'Watt'], 3, 'It is named after a Scottish engineer, and it is written W.', ['Power is measured in watts.', 'A joule is a unit of energy, a newton is a unit of force and a second is a unit of time.'], 'recall'),
  idea.choice('P6-04', 'A 40 W lamp is switched on. How much energy does it transfer every second?', ['40 W', '4 J', '40 J', '400 J'], 2, 'One watt means one joule every second.', ['1 W is 1 J each second, so 40 W is 40 J each second.', 'The answer is an amount of energy, so it is in joules, not watts.']),
  t(calc, 'P6-05', 'How do you work out power?'),
  calc.worked('P6-06', 'Work out the power of a pump', 'A pump does 4500 J of work in 30 s. What is its power?', ['Check the units: the work is in joules and the time is in seconds, so nothing needs changing.', 'Write the equation: P = W ÷ t, so P = 4500 ÷ 30.', '4500 ÷ 30 = 150. So the power is 150 W.'], 'power-worked-power'),
  calc.choice('P6-07', 'A winch does 8000 J of work in 40 s. What is its power?', ['200 W', '320 000 W', '0.005 W', '8040 W'], 0, 'Divide the work done by the time. Both are already in the right units.', ['P = W ÷ t = 8000 ÷ 40.', '8000 ÷ 40 = 200, so the power is 200 W.'], 'calculation'),
  calc.choice('P6-08', 'A heater transfers 12 000 J of energy in 2 minutes. What is its power?', ['6000 W', '24 000 W', '100 W', '1.7 W'], 2, 'Change the minutes to seconds first. There are 60 seconds in a minute.', ['2 minutes = 2 × 60 = 120 s.', 'P = E ÷ t = 12 000 ÷ 120 = 100 W.'], 'calculation'),
  t(energy, 'P6-09', 'How do you find the energy?'),
  energy.worked('P6-10', 'Work out the energy a motor transfers', 'A 250 W motor runs for 40 s. How much energy does it transfer?', ['Check the units: 250 W is in watts and 40 s is in seconds.', 'Turn the equation round: E = P × t, so E = 250 × 40.', '250 × 40 = 10 000. So the motor transfers 10 000 J.'], 'power-worked-energy'),
  energy.choice('P6-11', 'A 60 W lamp is on for 50 s. How much energy does it transfer?', ['110 J', '3000 J', '1.2 J', '300 J'], 1, 'Multiply the power by the time.', ['E = P × t = 60 × 50.', '60 × 50 = 3000, so the lamp transfers 3000 J.'], 'calculation'),
  calc.choice('P6-12', 'A machine transfers 3.6 kJ of energy in 2 minutes. What is its power?', ['30 W', '1.8 W', '1800 W', '0.03 W'], 0, 'Change both units first: kilojoules to joules and minutes to seconds.', ['3.6 kJ = 3.6 × 1000 = 3600 J, and 2 minutes = 120 s.', 'P = E ÷ t = 3600 ÷ 120 = 30 W.'], 'calculation', true),
  calc.choice('P6-13', 'A student says 3000 J in 2 minutes gives 3000 ÷ 2 = 1500 W. What is the mistake?', ['Energy should be multiplied by time', 'Time should be 120 s, so the power is 25 W', 'The answer should be in joules', 'There is no mistake'], 1, 'Check the unit of time in the equation.', ['Time must be in seconds. 2 minutes is 120 s.', 'P = 3000 ÷ 120 = 25 W. The student divided by 2 instead of 120.'], 'application', true),
  energy.choice('P6-14', 'A 400 W heater is switched on for 20 s. How much energy does it transfer?', ['20 J', '420 J', '8000 J', '80 000 J'], 2, 'Energy = power × time.', ['E = P × t = 400 × 20.', '400 × 20 = 8000, so the heater transfers 8000 J.'], 'calculation', true),
  calc.choice('P6-15', 'The table shows three motors. Which is the most powerful?', ['Motor A', 'Motor B', 'All three are equally powerful', 'Motor C'], 3, 'Work out energy ÷ time for each motor.', ['Motor A: 3000 ÷ 10 = 300 W. Motor B: 4000 ÷ 20 = 200 W. Motor C: 2000 ÷ 5 = 400 W.', 'Motor C transfers the most energy each second. Motor B transfers the most in total, but it takes longest.'], 'dataInterpretation', true, 'power-q-motors'),
  idea.written('P6-16', 'What is the power of a machine? Describe how to find the energy a 500 W machine transfers in 20 seconds.', 'Say what power measures, its unit, then use E = P × t.', 'Power is how fast energy is transferred, or how fast work is done. It is measured in watts, and 1 W is 1 J transferred every second. To find the energy, use energy = power × time. The time is already in seconds, so E = 500 × 20 = 10 000 J.', ['Power is the rate of energy transfer, or how fast energy is transferred.', 'Power is measured in watts, and 1 W is 1 J per second.', 'Uses energy transferred = power × time.', 'Substitutes correctly: 500 × 20.', 'Gives the answer 10 000 J with the unit.'], ['Saying power is the amount of energy.', 'Dividing 500 by 20.', 'Giving the answer in watts.']),
]

export const lessonP6: ScienceLesson = {
  id: 'P-ENE-006-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Power', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
