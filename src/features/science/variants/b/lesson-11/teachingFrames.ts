import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const heartFrames: Record<string, TeachingFrame[]> = {
  'B11-02': [
    f('One trip to the lungs', 'The right side of the heart pumps deoxygenated blood to the lungs.', 'the pulmonary circuit', 'Gas exchange in the lungs adds oxygen to the blood. Oxygenated blood then returns to the heart.', 'heart-double-lungs'),
    f('One trip to the body', 'The left side of the heart pumps oxygenated blood around the body.', 'the systemic circuit', 'Body cells take oxygen from the blood. Deoxygenated blood returns to the right side of the heart.', 'heart-double-body'),
    f('Two linked circuits', 'Blood passes through the heart twice during one complete journey.', 'pulmonary circuit + body circuit', 'The heart-to-lungs circuit and heart-to-body circuit are joined. That is why humans have a double circulatory system.', 'heart-double-all'),
  ],
  'B11-05': [
    f('Body to right heart', 'The vena cava returns deoxygenated blood to the right atrium and then the right ventricle.', 'begin with blood returning from the body', 'The right atrium is the upper receiving chamber. Blood passes through a valve into the right ventricle below it.', 'heart-chambers-atria'),
    f('Right heart to lungs', 'The right ventricle pumps blood through the pulmonary artery to the lungs.', 'send deoxygenated blood for gas exchange', 'In lung capillaries, blood loses carbon dioxide and gains oxygen.', 'heart-chambers-out'),
    f('Lungs to left heart', 'Pulmonary veins return oxygenated blood to the left atrium and then the left ventricle.', 'return oxygenated blood to the pump', 'The left atrium receives blood from the lungs. Blood passes through a valve into the left ventricle.', 'heart-chambers-atria'),
    f('Left heart to body', 'The left ventricle pumps blood through the aorta to the body.', 'complete the continuous journey', 'The left ventricle has a thicker muscular wall because it must create enough pressure to pump blood around the whole body.', 'heart-chambers-out'),
  ],
  'B11-09': [
    f('Valves guide flow', 'Heart valves open for forward flow and close to prevent backflow.', 'one direction through the heart', 'The names of the valves are not required here. Their key job is to stop blood moving backwards.', 'heart-valves'),
    f('The heart needs oxygen too', 'Coronary arteries supply the heart muscle with oxygenated blood.', 'a muscle needs respiration', 'The heart muscle contracts throughout life, so its cells need oxygen for aerobic respiration. Coronary arteries branch from the aorta and run over the heart.', 'heart-coronary'),
  ],
  'B11-12': [
    f('The natural pacemaker', 'A group of cells in the right atrium controls the resting heart rate.', 'an electrical timing signal', 'These pacemaker cells produce electrical impulses that spread through the heart and coordinate contractions.', 'heart-pacemaker-natural'),
    f('Artificial pacemakers', 'An artificial pacemaker can correct some irregular heart rhythms.', 'device helps timing', 'An artificial pacemaker is a small electrical device. It sends impulses when needed to help the heart beat regularly.', 'heart-pacemaker-artificial'),
  ],
}
