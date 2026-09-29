import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: safety and ethics in the lab. Examples come from Biology, Chemistry and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsSafetyFrames: Record<string, TeachingFrame[]> = {
  'W16-02': [
    f('Dress and listen', 'Wear a lab coat, goggles, gloves and sensible shoes. Follow your teacher’s instructions carefully.', 'clothing and instructions', 'Before you start, wear the right clothing. This means a lab coat, safety goggles, gloves and sensible shoes. Do not touch hot equipment. Follow your teacher’s instructions carefully.', 'wssafety-clothing'),
    f('Hazardous chemicals', 'Some chemicals are flammable or irritant. Check before you light a Bunsen burner.', 'flammable or irritant', 'A hazard is something that could cause harm. Some chemicals are flammable, so they catch fire easily. Others are irritants, so they can burn or irritate your skin. Check that nothing near a Bunsen burner is flammable, and work in a well ventilated area.', 'wssafety-hazard'),
    f('Use a fume cupboard', 'If a reaction may give off a harmful gas, do it in a fume cupboard.', 'gas cannot escape', 'Some experiments make harmful gases, such as chlorine. Do these in a fume cupboard, which is also called a fume hood. It draws the gas away, so it cannot escape into the room.', 'wssafety-fume'),
    f('Never touch chemicals', 'Use a spatula for solids and a funnel to pour liquids.', 'spatula and funnel', 'Never touch chemicals directly, even if you are wearing gloves. Use a spatula to move a solid from one container to another. Pour a liquid carefully, using a funnel so that nothing spills.', 'wssafety-transfer'),
    f('Dilute the safe way', 'When diluting, add the concentrated liquid to the water, never the other way round.', 'concentrated into water', 'Mixing chemicals can cause a reaction. When you dilute a liquid, add the concentrated liquid to the water. Never do it the other way round, because the mixture could get very hot.', 'wssafety-dilute'),
  ],
  'W16-06': [
    f('Clamp stands and masses', 'Use clamp stands so equipment does not fall, and choose masses and pulleys sensibly.', 'stop things falling', 'Use a clamp stand to stop masses and equipment falling over. Make sure the masses are not too heavy, so they do not break other equipment. Use a pulley that is not too long, so that hanging masses do not hit the floor.', 'wssafety-clamp'),
    f('Hot equipment', 'Let hot materials cool before moving them, or wear insulated gloves. Dry out an immersion heater in air.', 'cool, gloves, dry out', 'Let hot materials cool before you move them, or wear insulated gloves to handle them. An immersion heater is an electric heater for liquids. Always let it dry out in air, in case liquid has leaked inside it. You may also need eye protection.', 'wssafety-heat'),
    f('Low voltage', 'Use a low voltage and current. This stops wires overheating and damage to components.', 'low voltage', 'When you build circuits, use a low voltage and a low current. This stops the wires from overheating. It also stops damage to the components.', 'wssafety-electric'),
  ],
  'W16-09': [
    f('Look after animals', 'Handle animals carefully, and give any animals kept in the lab plenty of space.', 'safe and kind', 'Any living organisms that you use in an experiment need to be treated safely and ethically. Ethically means fairly and kindly. Animals should be handled carefully. Animals kept in the lab should be well cared for, for example with plenty of space.', 'wssafety-animals'),
    f('Return wild animals', 'Wild animals you capture should be returned to their habitat after the experiment.', 'back where they came from', 'Sometimes you catch wild animals to study them, such as woodlice or pond snails. Put them back in their habitat after the experiment. Do not keep them in the lab.', 'wssafety-return'),
    f('People must agree', 'Other students who take part in an experiment should be happy to do so.', 'they can say no', 'Sometimes other students take part in an experiment, for example to measure their pulse. They should be happy to do so. Anyone should be able to say no.', 'wssafety-people'),
  ],
}
