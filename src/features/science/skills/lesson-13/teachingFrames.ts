import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: measuring mass, liquids and gases. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsMeasureFrames: Record<string, TeachingFrame[]> = {
  'W13-02': [
    f('Set the balance to zero', 'Put the empty container on the balance and set it to zero before you add anything.', 'container first, then zero', 'A balance tells you the mass of whatever is on it. Put the empty container on the balance first. Then set the balance to exactly zero. Now it shows only the mass of what you add.', 'wsmeasure-zero'),
    f('Move all of it', 'When you move a solid to a new container, the mass you move must match the mass you measured.', 'nothing left behind', 'Sometimes you must move a solid to another container. None of it must be lost on the way. If the solid is going to dissolve, you can wash any left-over bits into the new container with the solvent.', 'wsmeasure-transfer'),
    f('Use the difference in mass', 'Weigh the container with the solid, then again without it. The difference is the mass you added.', 'before minus after', 'Another way is to weigh the container with the solid in it. Tip the solid out, then weigh the container again. The difference in mass is exactly how much solid you moved. For example, 45.0 g before and 42.5 g after means 2.5 g moved.', 'wsmeasure-difference'),
  ],
  'W13-04': [
    f('The dropping pipette', 'A dropping pipette gives a few drops. Use it when the volume does not need to be accurate.', 'a few drops', 'A dropping pipette is a thin tube with a rubber bulb. Squeeze the bulb, lower the tip into the liquid, then let go to draw some up. Use it when you only need a few drops, and the volume does not need to be exact.', 'wsmeasure-dropper'),
    f('The pipette and filler', 'A pipette measures one exact volume. A pipette filler lets you draw liquid up safely.', 'exact volume, safely', 'A pipette is a long thin tube that measures one exact volume of liquid. A rubber bulb called a pipette filler fits on the top. It lets you control the liquid as you draw it up, and it keeps the liquid out of your mouth.', 'wsmeasure-pipette'),
    f('The measuring cylinder', 'Choose a measuring cylinder that is the right size for the volume you want. Do not pick one that is far too big.', 'right size for the job', 'A measuring cylinder is a tall tube with a scale on the side. They come in many sizes. Choose one that suits your volume. A cylinder that is far too big has large steps on its scale, so a small volume is hard to read accurately.', 'wsmeasure-cylinder'),
    f('Read the meniscus', 'Read the volume from the bottom of the meniscus, with your eye level with the liquid.', 'bottom of the curve, eye level', 'The surface of a liquid in a narrow tube curves upwards at the edges. This curve is called the meniscus. Bring your eye level with the liquid. Read the volume from the bottom of the curve.', 'wsmeasure-meniscus'),
  ],
  'W13-07': [
    f('The gas syringe', 'A gas syringe is the most accurate way to measure a gas volume.', 'most accurate', 'A gas syringe is the most accurate way to measure a gas. You met it when you learned about collecting data. The gas from the reaction flows along a delivery tube and pushes the plunger out. Read the volume from the scale. Check that the syringe is the right size and the plunger moves smoothly.', 'wsmeasure-syringe'),
    f('The upturned measuring cylinder', 'A measuring cylinder full of water, turned upside down, can collect a gas. The gas pushes the water out.', 'gas pushes water out', 'You can also fill a measuring cylinder with water and turn it upside down in a trough of water. The gas pushes the water out as it collects. You will practise this method properly when you collect gases.', 'wsmeasure-upturned'),
    f('Counting bubbles', 'Counting bubbles is less accurate, but the results can still be compared.', 'quick but rough', 'You can count the bubbles a reaction makes in a set time. Bubbles are not all the same size, so this is less accurate. It still lets you compare a fast reaction with a slow one.', 'wsmeasure-bubbles'),
  ],
}
