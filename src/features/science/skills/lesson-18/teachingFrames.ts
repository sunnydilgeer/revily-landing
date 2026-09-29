import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: collecting gases and drawing apparatus. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsGasFrames: Record<string, TeachingFrame[]> = {
  'W18-02': [
    f('Set up the equipment', 'Fill a measuring cylinder with water, turn it upside down in a trough of water, and lead the delivery tube into it.', 'water in, cylinder upside down', 'You can collect a gas over water. Fill a measuring cylinder with water. Turn it upside down in a trough of water. Lead a delivery tube from the reaction flask into the open end of the cylinder.', 'wsgas-setup'),
    f('Note the starting level', 'Before the reaction starts, read the water level on the cylinder scale.', 'read the scale first', 'Before you start the reaction, read the level of the water on the scale of the cylinder. This is the starting level. Write it down straight away.', 'wsgas-start'),
    f('The gas pushes water out', 'The gas travels down the tube and rises into the cylinder, pushing water out of it.', 'gas in, water out', 'The gas made in the reaction travels along the delivery tube. It bubbles up into the cylinder. It pushes the water out of the cylinder, so the water level moves.', 'wsgas-push'),
    f('Find the volume', 'The volume of gas is the difference between the final level and the starting level.', 'final level minus starting level', 'When the reaction has finished, read the final level of the water. The volume of gas is the difference between the final level and the starting level. You met gas syringes when you learned about measuring. A syringe is more accurate.', 'wsgas-volume'),
    f('Keep it sealed', 'The delivery tube must be completely inside the cylinder, and the flask must be sealed, or gas escapes.', 'no gaps for gas to escape', 'The whole system must be sealed. Push the bung firmly into the flask. Make sure the delivery tube is completely inside the measuring cylinder. If not, some gas escapes into the air and your volume is too small.', 'wsgas-sealed'),
  ],
  'W18-06': [
    f('Use a test tube instead', 'If you only need a sample of gas, you can use an upturned test tube full of water instead of a cylinder.', 'sample, not volume', 'Sometimes you only need a sample of the gas, not its volume. Then you can use a test tube instead of a measuring cylinder. Fill it with water and turn it upside down over the delivery tube. You met this when you collected the gases in electrolysis.', 'wsgas-testtube'),
    f('Store it with a bung', 'When the test tube is full of gas, put a bung in it. You can then keep the gas until you test it.', 'seal it, store it', 'When the test tube is full of gas, put a bung in the top of it while the mouth is still under water. The bung stops the gas escaping. This lets you store the gas and test it later.', 'wsgas-bung'),
    f('Choose the right tool', 'Use a measuring cylinder when you need a volume. Use a test tube when you need a sample to test.', 'volume or sample', 'A measuring cylinder has a scale, so use it when you need to know how much gas there is. A test tube has no scale, so use it when you only need a sample. A gas syringe measures the volume most accurately.', 'wsgas-choose'),
  ],
  'W18-09': [
    f('Draw it from the side', 'A scientific drawing shows each piece of equipment as a flat, side-on view.', 'flat and from the side', 'A good method includes a labelled diagram of the set-up. Use a scientific drawing. Each piece of equipment is drawn as if you are looking at it from the side. It is a flat, two-dimensional shape with no shading.', 'wsgas-side'),
    f('Draw the equipment shapes', 'Use simple shapes: a beaker is a tall open shape, a test tube has a rounded base, a tripod is a triangle on legs.', 'the simple shape of each one', 'Learn the shape of each piece. A beaker is an open box shape. A test tube is a tall tube with a round bottom. A tripod is a table with three legs. A Bunsen burner has a chimney and a base.', 'wsgas-shapes'),
    f('Gauze and heat-proof mat', 'A gauze is a dashed line. A heat-proof mat is a single flat line.', 'a dashed line and a flat line', 'Some things are drawn very simply. A gauze is drawn as a dashed line. A heat-proof mat is drawn as a flat straight line. Use a ruler for every straight line.', 'wsgas-gauzemat'),
    f('Show a sealed tube', 'To show that a test tube is sealed, draw a bung in the top. Then label each part.', 'draw the bung, add labels', 'If the equipment is sealed, draw a bung in the top. Without a bung, the tube looks open. Finish by labelling every part with a straight line from the label to the part.', 'wsgas-drawsealed'),
  ],
}
