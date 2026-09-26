import type { TeachingFrame } from '../teachingFrame'

// Follow blood from the aorta to a working muscle cell and back to the vena cava.
// Each vessel is taught once, in the order the blood meets it.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const vesselsFrames: Record<string, TeachingFrame[]> = {
  'B12-02': [
    f('Leaving the heart', 'Blood leaves the heart in tubes called blood vessels.', 'the aorta is the first tube', 'In Lesson 11, blood left the left ventricle in the aorta. Each heartbeat pushes blood out hard, so it is at high pressure. Tubes that carry blood around the body are called blood vessels.', 'heart-double-body'),
    f('Away from the heart', 'Arteries carry blood away from the heart.', 'artery means away', 'The aorta is the biggest artery. It splits into smaller arteries that lead to every organ, such as a leg muscle. Vessels that carry blood away from the heart are called arteries.', 'vessel-artery'),
    f('Thick, stretchy walls', 'Artery walls are thick, with muscle and elastic fibres.', 'high pressure needs a strong wall', 'Blood in arteries is at high pressure. So arteries have thick walls of muscle to stay strong. They also contain stretchy strands called elastic fibres. These stretch with each heartbeat, then spring back.', 'vessel-artery'),
    f('Still an artery', 'An artery is named by its direction, not by its oxygen.', 'away from the heart means artery', 'Most arteries carry blood rich in oxygen, but not all. The pulmonary artery carries blood low in oxygen to the lungs. It is still an artery, because it carries blood away from the heart.', 'heart-double-lungs'),
  ],
  'B12-05': [
    f('Smaller and smaller', 'Arteries split into tiny vessels called capillaries.', 'tiny tubes with very thin walls', 'Near the leg muscle, the artery splits again and again. The smallest vessels are narrow, with walls one cell thick. These tiny vessels are called capillaries.', 'vessel-capillary'),
    f('Right beside the cells', 'Capillaries run between the cells of the muscle.', 'every cell has a capillary close by', 'Capillaries branch into a mesh that runs between the muscle cells. So every muscle cell has a capillary close beside it. Many capillaries also give a large area for substances to cross.', 'vessel-exchange-network'),
    f('Oxygen and glucose out', 'Oxygen and glucose pass from the blood into the muscle cell.', 'a short trip is a fast trip', 'Blood in the capillary has lots of oxygen and glucose. The muscle cell has less. So they diffuse out, across the thin wall, into the cell. The distance is short, so diffusion is fast.', 'vessel-exchange-wall'),
    f('Carbon dioxide in', 'Carbon dioxide passes from the muscle cell into the blood.', 'waste goes the other way', 'The muscle cell uses oxygen and glucose to release energy by respiration. This makes carbon dioxide as a waste. So carbon dioxide diffuses out of the cell and into the capillary. The blood carries it away.', 'vessel-exchange-wall'),
    f('Put it together', 'Capillaries swap substances between the blood and the cells.', 'thin walls and close to cells', 'Capillary walls are one cell thick, so the diffusion distance is short. Capillaries run close to every cell. So oxygen and glucose get into cells fast, and carbon dioxide gets out fast.', 'vessel-exchange-network'),
  ],
  'B12-08': [
    f('Towards the heart', 'Veins carry blood back towards the heart.', 'vein means back to the heart', 'After the muscle, the capillaries join up into wider vessels. Vessels that carry blood back like this are called veins. So veins carry blood towards the heart.', 'vessel-vein'),
    f('Low pressure, wide space', 'Veins have thinner walls and a wide lumen.', 'low pressure needs a less strong wall', 'By now, the blood has lost most of its pressure. So vein walls are thinner than artery walls. The hollow space where blood flows is called the lumen. Veins have a wider lumen than arteries.', 'vessel-vein'),
    f('Valves stop backflow', 'Veins have valves so blood only flows one way.', 'flaps that shut if blood slips back', 'The blood in veins is at low pressure, so it could slip backwards. Many veins have flaps inside them. These flaps close if blood starts to flow back. They are called valves, like the valves in the heart.', 'vessel-vein'),
    f('Back into the heart', 'Veins join up into the vena cava, which enters the heart.', 'aorta, artery, capillary, vein, vena cava', 'Small veins join into bigger veins. The biggest vein is the vena cava. It takes the blood into the right atrium. So blood goes from the aorta, through arteries, capillaries and veins, to the vena cava.', 'heart-double-body'),
  ],
  'B12-11': [
    f('Why measure flow?', 'A working muscle needs more blood each minute.', 'more work needs more blood', 'When you run, your leg muscles respire faster. They need more oxygen and glucose each minute. So more blood must flow to them. Doctors can measure blood flow to check a vessel is supplying enough.', 'vessel-artery'),
    f('Rate of blood flow', 'The volume of blood that flows each minute is the rate of blood flow.', 'how much blood in one minute', 'To find it, divide the volume of blood by the time in minutes. The volume of blood that passes in one minute is called the rate of blood flow.', 'blood-flow-rate'),
    f('Get the units right', 'The unit is the volume unit per minute.', 'cm³ divided by minutes gives cm³ per minute', 'If the volume is in cm³ and the time is in minutes, the answer is in cm³ per minute. Blood flow tells you how much blood arrives. In the next lesson, you will look at what is in the blood itself.', 'blood-flow-rate'),
  ],
}
