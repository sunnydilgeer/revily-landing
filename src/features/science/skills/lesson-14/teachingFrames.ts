import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: measuring volume, length, angles, temperature and time. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsLengthFrames: Record<string, TeachingFrame[]> = {
  'W14-02': [
    f('What is a eureka can?', 'A eureka can is a beaker with a spout. It helps you find the volume of an irregular solid.', 'a beaker with a spout', 'A eureka can is a beaker with a spout near the top. You use it to find the volume of an irregular solid. That is a solid with a shape that is hard to measure with a ruler, such as a stone. You met the eureka can when you learned about density.', 'wslength-eureka-can'),
    f('Set the water level', 'Fill the can above the spout, and let it drain until the water is just at the spout.', 'level with the spout', 'Fill the can with water until the level is above the spout. Let the extra water drain out. The water should stop just at the height of the spout. Now water can only leave when you add something.', 'wslength-eureka-level'),
    f('Lower in the object', 'Put a measuring cylinder under the spout. The object pushes water out of the spout.', 'the object pushes water out', 'Put a measuring cylinder under the spout. Lower the object gently into the can. It takes up space, so it pushes water up and out of the spout into the cylinder.', 'wslength-eureka-object'),
    f('Read the volume', 'Wait until the spout stops dripping, then read the volume of water in the cylinder. It equals the volume of the object.', 'wait, then read', 'Wait until the spout has stopped dripping. Then read the volume of water in the measuring cylinder. This is the same as the volume of the object.', 'wslength-eureka-read'),
  ],
  'W14-05': [
    f('Choose the right ruler', 'Use a centimetre ruler for most lengths, a metre rule for long distances and a micrometer for tiny things.', 'size of the job', 'Most lengths can be measured with a centimetre ruler. A metre rule is handy for long distances. A micrometer measures tiny things, such as the width of a thin wire.', 'wslength-rulers'),
    f('Line up and look straight on', 'Put the ruler alongside the object, and keep your eye level with the reading.', 'alongside, eye level', 'Place the ruler alongside the object you are measuring. Keep your eye level with the mark you are reading. Looking from an angle can make the reading wrong.', 'wslength-eyelevel'),
    f('Start from the same point', 'When you measure the same object many times, always measure from the same point. A small marker can help.', 'same start every time', 'You may need lots of measurements of the same object, such as a spring that is stretched. Always measure from the same point. You can attach a small marker to the object and line the ruler up with it.', 'wslength-marker'),
    f('Measure ten, then divide', 'To find the length of one very small thing, measure ten together, then divide by ten.', 'ten together, divide by ten', 'It is hard to measure just one very small thing. Measure ten of them together instead. Then divide the length by ten to find the length of one.', 'wslength-ten'),
  ],
  'W14-09': [
    f('Measure an angle', 'Put the middle of the protractor on the corner of the angle, line up the base line, then read the scale.', 'middle on the corner', 'Place the middle of the protractor on the corner of the angle. Line up its base line with one line of the angle. Read the angle from the scale where the other line crosses. A sharp pencil gives thin lines and reduces errors.', 'wslength-protractor'),
    f('Bulb under the surface', 'Put the whole bulb of the thermometer under the surface of the liquid.', 'bulb completely under', 'The sensing part of a thermometer is the bulb at the bottom. Make sure the bulb is completely under the surface of the liquid. Then it measures the liquid, not the air above it.', 'wslength-thermometer-bulb'),
    f('Wait, then read at eye level', 'Wait for the temperature to stop changing, then read the scale at eye level.', 'steady reading, eye level', 'If you need a starting temperature, wait until the reading stops changing. Then read the scale with your eye level with the top of the liquid thread. This gives a steady, accurate reading.', 'wslength-thermometer-read'),
    f('Time it with a stopwatch', 'Use a stopwatch to time experiments. Start and stop it at exactly the right moments.', 'start and stop exactly', 'A stopwatch is more accurate than most regular watches. Start and stop it at exactly the right times. For example, to time a reaction, start the stopwatch at the exact moment you mix the reactants.', 'wslength-stopwatch'),
  ],
}
