import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { efficiencyFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.2.2 Efficiency (efficiency = useful output energy transfer ÷ total input energy transfer, and the same with useful and total power; decimal and percentage), as on the supplied revision page' }
const skill = 'P-EFFICIENCY'
const idea = author(skill, ['6.1.2.2'], ['aqa-physics'])
const calc = author(skill, ['6.1.2.2'], ['aqa-physics'])
const power = author(skill, ['6.1.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const efficiencySections = [
  { id: 'P9-01', label: 'Start here', detail: 'Two devices, different waste' },
  { id: 'P9-02', label: 'What is efficiency?', detail: 'Useful output compared with total input' },
  { id: 'P9-05', label: 'How do you calculate it?', detail: 'Useful ÷ total, decimal and percentage' },
  { id: 'P9-09', label: 'What about power?', detail: 'The power version and finding the useful output' },
  { id: 'P9-12', label: 'On your own', detail: 'Calculations, a diagram and an explanation' },
]

const states: ScienceState[] = [
  { ...idea.choice('P9-01', 'Two devices each take in 100 J. Device A wastes 20 J and device B wastes 60 J. Which is better?', ['Device B', 'Device A', 'They are equally good', 'It cannot be told'], 1, 'Which device makes more of the energy useful?', ['Device A transfers 80 J usefully and device B only 40 J.', 'A wastes less, so it makes better use of the energy.'], 'understanding'), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P9-02', 'What is efficiency?'),
  idea.choice('P9-03', 'A device takes in 500 J. It transfers 350 J usefully. How much energy is wasted?', ['850 J', '350 J', '150 J', '500 J'], 2, 'Total input = useful output + wasted energy.', ['500 − 350 = 150.', 'So 150 J is wasted.'], 'application'),
  idea.choice('P9-04', 'Why can no device be 100% efficient?', ['Devices are always too old', 'Energy is destroyed', 'Useful energy is always bigger than the input', 'Some energy is always wasted in a transfer'], 3, 'Think about what always happens to some of the energy.', ['In every energy transfer, some energy is dissipated to the surroundings.', 'So the useful output is always less than the total input.'], 'understanding'),
  t(calc, 'P9-05', 'How do you calculate it?'),
  calc.worked('P9-06', 'Work out the efficiency of a motor', 'A motor takes in 500 J of energy. 350 J of it is transferred usefully. What is the efficiency, as a decimal and as a percentage?', ['Write down the numbers: useful output = 350 J and total input = 500 J.', 'Divide: efficiency = 350 ÷ 500 = 0.7.', 'Multiply by 100 to get a percentage: 0.7 × 100 = 70%.'], 'effic-worked-energy'),
  calc.choice('P9-07', 'A heater takes in 400 J of energy and transfers 300 J usefully. What is its efficiency as a percentage?', ['75%', '133%', '0.75%', '25%'], 0, 'Divide the useful output by the total input, then multiply by 100.', ['Efficiency = 300 ÷ 400 = 0.75.', '0.75 × 100 = 75%.'], 'calculation'),
  calc.choice('P9-08', 'A student calculates an efficiency of 1.2. What should the student do?', ['Nothing, 1.2 is a good result', 'Check the calculation, because efficiency cannot be more than 1', 'Multiply by 100 to give 120%', 'Change the unit to watts'], 1, 'Can more useful energy come out than goes in?', ['The useful output is always less than the input, so efficiency is between 0 and 1.', 'An answer of 1.2 means the numbers were probably divided the wrong way round.'], 'application'),
  t(power, 'P9-09', 'What about power?'),
  power.worked('P9-10', 'Work out the useful power of a machine', 'A machine is 60% efficient and has a total input power of 500 W. What is the useful power output?', ['Change the percentage to a decimal: 60 ÷ 100 = 0.6.', 'Rearrange: useful power output = efficiency × total power input.', 'Multiply: 0.6 × 500 = 300. So the useful power output is 300 W.'], 'effic-worked-power'),
  power.choice('P9-11', 'A fan is 40% efficient and has a total input power of 200 W. What is the useful power output?', ['5 W', '8000 W', '80 W', '160 W'], 2, 'Change 40% to a decimal, then multiply by the input power.', ['40% = 40 ÷ 100 = 0.4.', 'Useful power output = 0.4 × 200 = 80 W.'], 'calculation'),
  calc.choice('P9-12', 'A motor takes in 250 J of energy and transfers 200 J usefully. What is its efficiency as a percentage?', ['125%', '0.8%', '25%', '80%'], 3, 'Divide the useful output by the total input, then multiply by 100.', ['Efficiency = 200 ÷ 250 = 0.8.', '0.8 × 100 = 80%.'], 'calculation', true),
  power.choice('P9-13', 'A machine has a total input power of 500 W and a useful output power of 300 W. What is its efficiency?', ['1.7', '0.6', '0.167', '200'], 1, 'Use useful power output ÷ total power input.', ['Efficiency = 300 ÷ 500 = 0.6.', 'As a percentage this is 60%.'], 'calculation', true),
  power.choice('P9-14', 'A machine is 25% efficient and has a total input power of 800 W. What is its useful power output?', ['32 W', '3200 W', '200 W', '775 W'], 2, 'Change 25% to a decimal first.', ['25% = 25 ÷ 100 = 0.25.', 'Useful power output = 0.25 × 800 = 200 W.'], 'calculation', true),
  calc.choice('P9-15', 'The energy transfer diagram shows a lamp. What is the efficiency of the lamp?', ['20%', '25%', '80%', '5%'], 0, 'Find the useful energy on the diagram. Then divide it by the total input.', ['The lamp takes in 200 J and gives out 40 J as light.', 'Efficiency = 40 ÷ 200 = 0.2, which is 20%.'], 'dataInterpretation', true, 'effic-q-lamp'),
  idea.written('P9-16', 'Explain why no device is 100% efficient. Then describe how to work out the efficiency of a device.', 'Say what always happens to some energy, then give the calculation.', 'In every energy transfer, some energy is wasted. It is dissipated to the surroundings, so the useful output is always less than the total input. Efficiency is found by dividing the useful output energy by the total input energy. Multiply by 100 to give a percentage. For example, 30 J useful from 40 J input is 30 ÷ 40 = 0.75, or 75%.', ['Some energy is always wasted or dissipated in an energy transfer.', 'So useful output is always less than total input, so efficiency is less than 100%.', 'Efficiency = useful output energy ÷ total input energy.', 'Multiply by 100 to change the decimal into a percentage.'], ['Saying energy is destroyed.', 'Dividing the input by the output.', 'Saying a good enough design would give 100%.']),
]

export const lessonP9: ScienceLesson = {
  id: 'P-ENE-009-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Efficiency', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
