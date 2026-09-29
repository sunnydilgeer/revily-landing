import type { TeachingFrame } from '../../teachingFrame'

// The story of the atom model: solid sphere, electrons, plum pudding, alpha scattering (three observations, three conclusions),
// Bohr energy levels, protons, neutrons. Models change when new evidence does not fit.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const nucModelFrames: Record<string, TeachingFrame[]> = {
  'P31-02': [
    f('Atoms as solid spheres', 'Scientists first thought an atom was a solid sphere that could not be split.', 'solid ball, nothing inside', 'Scientists used to think that atoms were solid spheres. They believed an atom could not be split into anything smaller. Picture a tiny hard ball with nothing inside it.', 'nucmodel-solid'),
    f('Electrons are found', 'Atoms contain smaller particles with a negative charge, called electrons.', 'smaller, negative', 'Then scientists found that atoms contain even smaller particles. These particles have a negative charge. They are called electrons. So atoms can be split after all.', 'nucmodel-electron'),
    f('The plum pudding model', 'The plum pudding model is a ball of positive charge with electrons scattered through it.', 'positive ball, electrons inside', 'This led to a new idea called the plum pudding model. The atom is a ball of positive charge. The negative electrons are scattered through the ball, like currants in a sticky pudding.', 'nucmodel-plum'),
  ],
  'P31-05': [
    f('Firing alpha particles at gold', 'Scientists fired positive alpha particles at a very thin sheet of gold foil.', 'fire, then watch where they go', 'Scientists tested the plum pudding model with an experiment. They fired alpha particles at a very thin sheet of gold foil. Alpha particles have a positive charge. A detector showed where the particles ended up.', 'nucmodel-gold-setup'),
    f('What the old model predicted', 'The plum pudding model predicts that most particles pass straight through, or bend only slightly.', 'nothing dense, so straight through', 'In the plum pudding model, the positive charge is spread out and nothing is dense. So scientists expected most alpha particles to pass straight through. Any that changed direction should change it only slightly.', 'nucmodel-gold-expect'),
    f('What actually happened', 'Most particles went straight through, a few were deflected at large angles, and a tiny number bounced back.', 'three different results', 'The results were different from the prediction. Most of the particles passed straight through the foil. A few were deflected at large angles. A tiny number bounced straight back.', 'nucmodel-gold-results'),
    f('Three observations, three conclusions', 'Each observation gave a clue: empty space, a tiny heavy nucleus, and a positive charge.', 'observation, then conclusion', 'So the plum pudding model could not be right. Most particles passed through, so most of the atom is empty space. A tiny number bounced back, so most of the mass is in a tiny nucleus. Some positive particles were deflected, so the nucleus is positive, because like charges repel. This new picture is called the nuclear model.', 'nucmodel-gold-conclude'),
  ],
  'P31-08': [
    f('Bohr and energy levels', 'Bohr said electrons orbit the nucleus in energy levels at fixed distances.', 'orbits at fixed distances', 'Niels Bohr improved the nuclear model. He suggested that electrons orbit the nucleus in energy levels. Each energy level is at a fixed distance from the nucleus. Many calculations and later experiments supported his idea.', 'nucmodel-bohr'),
    f('Protons in the nucleus', 'Later experiments showed the nucleus can be divided into positive particles called protons.', 'nucleus splits into protons', 'Results from more experiments showed that the nucleus can be divided into smaller particles. These particles have a positive charge. They were named protons.', 'nucmodel-protons'),
    f('Neutrons join the nucleus', 'James Chadwick showed the nucleus also holds neutral particles called neutrons.', 'neutral particles in the nucleus', 'Experiments by James Chadwick showed that the nucleus also contains neutral particles. These are called neutrons. This happened about 20 years after scientists agreed that atoms have a nucleus.', 'nucmodel-neutron'),
    f('Models change with evidence', 'Every model was changed when new evidence did not fit the old one.', 'new evidence, new model', 'Put it together. The solid sphere gave way to the plum pudding model. That gave way to the nuclear model, then Bohr\'s energy levels, with protons and neutrons in the nucleus. Each time, new evidence changed the model.', 'nucmodel-timeline'),
  ],
}
