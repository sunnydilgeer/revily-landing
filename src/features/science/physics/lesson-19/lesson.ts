import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { sensorFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.1.4 Thermistors and LDRs, their uses and sensing circuits, as on the supplied revision page' }
const skill = 'P-SENS'
const ldr = author(skill, ['6.2.1.4'], ['aqa-physics'])
const therm = author(skill, ['6.2.1.4'], ['aqa-physics'])
const sensing = author(skill, ['6.2.1.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const sensorSections = [
  { id: 'P19-01', label: 'Start here', detail: 'A light that switches on by itself' },
  { id: 'P19-02', label: 'What does an LDR do?', detail: 'Resistance and light' },
  { id: 'P19-05', label: 'What does a thermistor do?', detail: 'Resistance and temperature' },
  { id: 'P19-08', label: 'How does a sensing circuit work?', detail: 'A thermistor and a fan' },
  { id: 'P19-12', label: 'On your own', detail: 'Graphs, symbols and sensing circuits' },
]

const states: ScienceState[] = [
  { ...ldr.choice('P19-01', 'A street light comes on by itself when it gets dark. What must its circuit be able to do?', ['Store energy from the daytime', 'Detect how bright it is', 'Change the colour of the bulb', 'Measure the time with a clock'], 1, 'Something in the circuit has to notice the change in light.', ['The circuit needs a component that reacts to the amount of light.', 'A light dependent resistor can do this.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(ldr, 'P19-02', 'What does an LDR do?'),
  ldr.choice('P19-03', 'What is the resistance of an LDR in darkness?', ['Highest', 'Lowest', 'Exactly zero', 'The same as in bright light'], 0, 'The resistance falls as the light gets brighter.', ['In darkness the resistance of an LDR is highest.', 'In bright light it falls.']),
  ldr.choice('P19-04', 'Which of these uses an LDR?', ['A kettle that switches off when it boils', 'An oven that keeps a set temperature', 'An automatic night light', 'A radio that changes station'], 2, 'Think about a device that reacts to light.', ['An automatic night light switches on when the room gets dark.', 'The LDR senses the change in light.']),
  t(therm, 'P19-05', 'What does a thermistor do?'),
  therm.choice('P19-06', 'What happens to the resistance of a thermistor when it gets hotter?', ['It increases', 'It stays the same', 'It reaches its highest value', 'It decreases'], 3, 'In cooler conditions the resistance is greater.', ['A hotter thermistor has a lower resistance.', 'A cooler thermistor has a greater resistance.']),
  therm.choice('P19-07', 'Which component could a thermostat use to detect the temperature of a room?', ['An LDR', 'A thermistor', 'A diode', 'A fuse'], 1, 'Its resistance depends on temperature.', ['A thermistor is a temperature-dependent resistor.', 'That makes it a useful temperature detector.']),
  t(sensing, 'P19-08', 'How does a sensing circuit work?'),
  sensing.choice('P19-09', 'In the fan circuit, the room gets hotter. What happens to the pd across the fan?', ['It rises', 'It falls', 'It stays the same', 'It reverses direction'], 0, 'The thermistor takes a smaller share.', ['The thermistor’s resistance decreases, so it takes a smaller share of the pd.', 'So the pd across the fixed resistor and fan rises.']),
  sensing.choice('P19-10', 'In a series circuit that shares the pd, what happens to a component whose resistance is larger?', ['It takes a smaller share of the pd', 'It takes more of the pd', 'It takes no pd at all', 'It takes exactly the same share as the others'], 1, 'Bigger resistance, bigger share.', ['The larger a component’s resistance, the more of the pd it takes.', 'That is how the thermistor controls the fan.']),
  sensing.choice('P19-11', 'The fan is connected across the thermistor instead of the fixed resistor. What happens to the fan as the room gets hotter?', ['It speeds up', 'It stays at the same speed', 'It slows down', 'It switches off for good'], 2, 'A hotter room makes the thermistor take a smaller share.', ['The thermistor takes a smaller share of the pd as it gets hotter.', 'So the fan across it gets less pd and slows down, which is the opposite of what you want.'], 'application'),
  ldr.choice('P19-12', 'Use the graph. Which statement is correct?', ['Resistance is highest in bright light', 'Resistance does not depend on the light', 'Resistance is highest in the dark', 'Resistance rises as light intensity rises'], 2, 'Compare the left end of the graph with the right end.', ['On the left (dark) the curve is high.', 'The curve falls towards bright light, so the resistance is highest in the dark.'], 'dataInterpretation', true, 'sensor-q-ldr'),
  sensing.choice('P19-13', 'A lamp is across a fixed resistor, in series with an LDR. What happens to the lamp as the room gets darker?', ['It gets brighter', 'It gets dimmer', 'It stays the same', 'It switches off for good'], 1, 'In the dark the LDR takes a larger share of the pd.', ['In the dark the resistance of the LDR is highest, so it takes a bigger share of the pd.', 'The lamp and fixed resistor get less pd, so the lamp gets dimmer.'], 'application', true, 'sensor-q-circuit'),
  ldr.choice('P19-14', 'Which numbered symbol is a thermistor?', ['Symbol 1', 'Symbol 2', 'Symbol 3', 'Symbol 4'], 3, 'It is a resistor with a bent line through it.', ['A thermistor symbol is a resistor box with a bent line through it.', 'An LDR has arrows pointing at a circle instead.'], 'recall', true, 'sensor-q-symbols'),
  sensing.written('P19-15', 'Explain why the fan in the sensing circuit goes faster when the room gets hotter.', 'Follow the chain: thermistor resistance, share of the pd, pd across the fan.', 'As the room gets hotter, the resistance of the thermistor decreases. So the thermistor takes a smaller share of the pd from the power supply. This means the pd across the fixed resistor and the fan rises. The greater the pd across the fan, the more energy it gets, so the fan goes faster.', ['The thermistor’s resistance decreases as the temperature rises.', 'The thermistor takes a smaller share of the supply pd.', 'The pd across the fan (and fixed resistor) increases.', 'A greater pd gives the fan more energy, so it goes faster.'], ['Saying the thermistor’s resistance increases when it gets hotter.', 'Saying the current stops flowing through the fan.', 'Saying the pd of the power supply changes.']),
]

export const lessonP19: ScienceLesson = {
  id: 'P-ELE-019-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'LDRs, thermistors and sensing circuits', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
