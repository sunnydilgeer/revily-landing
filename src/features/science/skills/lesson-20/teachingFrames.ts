import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: electrical meters and light gates. Examples come from Physics, Chemistry and Biology.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsElecFrames: Record<string, TeachingFrame[]> = {
  'W20-02': [
    f('A voltmeter goes across', 'A voltmeter measures potential difference. Connect it in parallel across the component.', 'across the component', 'A voltmeter measures potential difference. Connect it in parallel, which means across the component you want to test. You met parallel and series circuits when you learned about circuits.', 'wselec-voltmeter'),
    f('Red and black ports', 'Wires are usually red for positive and black for negative. They go into the red and black ports.', 'colours match', 'The wires that come with a meter are usually red for positive and black for negative. Plug them into the red and black ports of the meter. Then read the value from the scale, or from the screen if the meter is digital.', 'wselec-ports'),
    f('An ammeter goes in line', 'An ammeter measures current. Connect it in series with the component.', 'in the loop, in line', 'An ammeter measures current. Connect it in series, which means in the same loop as the component you want to test. The current then flows through the ammeter as well. Its red and black ports show you where the wires go.', 'wselec-ammeter'),
    f('Switch off between readings', 'Turn the circuit off between readings. This stops the wires overheating and changing your results.', 'off, then on again', 'Turn your circuit off between readings. Wires heat up when a current flows through them for a long time. Hot wires can change the resistance, which affects your results.', 'wselec-off'),
  ],
  'W20-05': [
    f('One meter, several jobs', 'A multimeter measures potential difference, current and usually resistance. A dial chooses the job.', 'one device, a dial', 'A multimeter is a single device that can measure potential difference, current and usually resistance. A dial on the front chooses which one it measures.', 'wselec-multimeter'),
    f('Potential difference with a multimeter', 'For potential difference, connect the multimeter in parallel. Plug the red wire into the port marked V.', 'parallel, port V', 'To measure potential difference, connect the multimeter in parallel. Plug the red wire into the port marked V, for volts. Turn the dial to the volts section.', 'wselec-multi-v'),
    f('Current with a multimeter', 'For current, connect the multimeter in series. Plug the red wire into the port marked A and turn the dial to A.', 'series, port A', 'To measure current, connect the multimeter in series. Use the port marked A, for amps. Turn the dial to the amps section. The screen then shows the value you are measuring.', 'wselec-multi-a'),
  ],
  'W20-08': [
    f('A beam that gets interrupted', 'A light gate sends a beam of light across the gate to a detector. Something passing through interrupts the beam.', 'beam across a gap', 'A light gate sends a beam of light from one side of the gate to a detector on the other side. When something passes through the gate, the beam is interrupted. The gate records when this happened and for how long.', 'wselec-gate'),
    f('Finding a speed', 'Type the length of the object into the computer. It works out the speed from the time the beam was interrupted.', 'length ÷ time', 'Light gates can be connected to a computer. To find speed, type in the length of the object. The computer divides the length by the time the beam was interrupted. So speed = length ÷ time.', 'wselec-speed'),
    f('Finding an acceleration', 'A card with a gap in the middle interrupts the beam twice. The gate measures the speed for each part.', 'two interruptions', 'To measure acceleration, use an object that interrupts the beam twice. A piece of card with a gap cut into the middle does this. The gate measures the speed for each section of the card. The computer uses these to work out the acceleration.', 'wselec-accel'),
    f('Fewer timing errors', 'A light gate can replace a stopwatch. It reduces errors from reaction time.', 'no slow fingers', 'A light gate can be used instead of a stopwatch. A person may press the stopwatch too early or too late. The gate does not, so your timing errors are smaller.', 'wselec-errors'),
  ],
}
