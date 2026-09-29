import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsElecFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 6 (voltmeters, ammeters, multimeters and light gates), as on the supplied revision page' }
const skill = 'W-PRC-020-W'
const a = author(skill, ['AT 6'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsElecSections = [
  { id: 'W20-01', label: 'Start here', detail: 'Connecting a meter' },
  { id: 'W20-02', label: 'How do you connect a voltmeter and an ammeter?', detail: 'Parallel, series and safe readings' },
  { id: 'W20-05', label: 'What does a multimeter do?', detail: 'One device, ports and a dial' },
  { id: 'W20-08', label: 'How do light gates measure speed?', detail: 'Interrupted beams, speed and acceleration' },
  { id: 'W20-12', label: 'On your own', detail: 'Meters and light gates' },
]

const states: ScienceState[] = [
  { ...a.choice('W20-01', 'You want to measure the potential difference across a bulb. How should the meter be connected?', ['In line with the bulb, one after the other', 'Across the bulb, in parallel', 'Away from the circuit', 'Only across the cell'], 1, 'The meter goes on a side branch across the bulb.', ['A voltmeter is connected across the component in parallel.', 'This lets it compare the two sides of the bulb.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W20-02', 'How do you connect a voltmeter and an ammeter?'),
  a.choice('W20-03', 'Which meter measures potential difference, and how is it connected?', ['A voltmeter, in parallel', 'A voltmeter, in series', 'An ammeter, in parallel', 'An ammeter, in series'], 0, 'Think: volts, across the component.', ['A voltmeter measures potential difference and goes in parallel.', 'An ammeter measures current and goes in series.'], 'recall'),
  a.choice('W20-04', 'Why should you turn the circuit off between readings?', ['To make the bulb brighter', 'To reset the meter', 'To let the cell recharge', 'To stop the wires overheating and changing the results'], 3, 'Think about what a long current does to wires.', ['Wires heat up when a current flows for a long time.', 'Hot wires change the resistance and affect your results.'], 'practicalReasoning'),
  t('W20-05', 'What does a multimeter do?'),
  a.choice('W20-06', 'A student uses a multimeter to measure current in amps. How should it be set up?', ['In parallel, using the V port', 'In series, using the V port', 'In series, using the A port', 'In parallel, using the A port'], 2, 'Current means series, and the port matches the unit.', ['A multimeter measuring current goes in series.', 'The red wire goes into the port marked A, for amps.'], 'application'),
  a.choice('W20-07', 'What should you do with the dial before measuring a current in amps?', ['Turn it to the V section', 'Turn it to the A section', 'Leave it wherever it is', 'Turn it off and read the screen'], 1, 'The dial must match what you are measuring.', ['Turn the dial to the section for the quantity you are measuring.', 'For a current in amps, that is the A section.'], 'recall'),
  t('W20-08', 'How do light gates measure speed?'),
  a.worked('W20-09', 'Find a speed from a light gate', 'A card is 0.05 m long. It passes through a light gate and interrupts the beam for 0.02 s. Find its speed.', ['Speed = length ÷ time.', 'The length is 0.05 m and the time is 0.02 s.', '0.05 ÷ 0.02 = 2.5.', 'The speed is 2.5 m/s.'], 'wselec-worked-speed'),
  a.choice('W20-10', 'A card 0.10 m long interrupts a light gate beam for 0.05 s. What is its speed?', ['0.5 m/s', '0.05 m/s', '20 m/s', '2 m/s'], 3, 'Divide the length by the time.', ['Speed = length ÷ time = 0.10 ÷ 0.05.', 'The speed is 2 m/s.'], 'calculation'),
  a.choice('W20-11', 'Why is a card with a gap in the middle used to measure acceleration?', ['It interrupts the beam twice, so the gate measures two speeds', 'It makes the beam brighter', 'It stops the light gate breaking', 'It weighs the trolley'], 0, 'Acceleration needs two speeds.', ['The card interrupts the beam twice.', 'The gate measures the speed of each section, and the computer works out the acceleration.'], 'understanding'),
  a.choice('W20-12', 'A trolley carries a card 0.24 m long. It interrupts the beam for 0.08 s. What is its speed?', ['1.5 m/s', '0.03 m/s', '3 m/s', '8 m/s'], 2, 'Speed = length ÷ time.', ['0.24 ÷ 0.08 = 3.', 'The speed is 3 m/s.'], 'calculation', true),
  a.choice('W20-13', 'Look at the circuit. Which numbered meter is connected to measure the current through the lamp?', ['Neither meter', 'Both meters', 'Meter 1', 'Meter 2'], 3, 'A current meter is in series with the lamp, in the same loop.', ['Meter 2 is in the same loop as the lamp, so it is in series. It measures current.', 'Meter 1 is connected across the lamp, so it measures potential difference.'], 'practicalReasoning', true, 'wselec-q-circuit'),
  a.written('W20-14', 'A student times a trolley with a stopwatch. Explain how light gates could improve the investigation.', 'Think about what a light gate measures and how it is timed.', 'A light gate sends a beam across the track. When the trolley passes through, the beam is interrupted and the gate records the time. The computer divides the length of the card by this time to find the speed. This is better than a stopwatch, because a person can press the stopwatch too early or too late. So the light gate reduces timing errors and gives a more accurate speed.', ['A beam is interrupted when the trolley passes.', 'The gate records the time the beam was interrupted.', 'Speed = length ÷ time, worked out by the computer.', 'It avoids human reaction time errors.', 'So the timing is more accurate.'], ['Saying the gate measures the mass.', 'Saying a stopwatch is more accurate.', 'Forgetting that the length of the card is needed.']),
]

export const lessonW20: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Electrical meters and light gates', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
