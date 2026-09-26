import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const vesselsFrames: Record<string, TeachingFrame[]> = {
  'B12-02': [
    f('Arteries carry blood away', 'Arteries carry blood away from the heart at high pressure.', 'away + high pressure', 'Their walls contain thick muscle and elastic tissue. The strong walls withstand pressure, while elastic tissue stretches and recoils.', 'vessel-artery'),
    f('Capillaries reach cells', 'Capillaries are tiny exchange vessels with walls one cell thick.', 'short diffusion distance', 'Their narrow network runs close to body cells. Oxygen and food molecules can diffuse out, while carbon dioxide and other wastes can diffuse into the blood.', 'vessel-capillary'),
    f('Veins return blood', 'Veins carry blood towards the heart at lower pressure.', 'towards + low pressure', 'Veins have thinner walls and a larger lumen than similar-sized arteries. Valves stop blood flowing backwards.', 'vessel-vein'),
  ],
  'B12-07': [
    f('Exchange needs a short route', 'A capillary wall is only one cell thick.', 'a thin wall gives a short distance', 'A short diffusion distance helps substances move rapidly between blood and nearby cells.', 'vessel-exchange-wall'),
    f('Networks create area', 'Many branching capillaries give a large exchange surface.', 'many small vessels', 'The large network brings blood close to many cells. A narrow lumen also keeps red blood cells close to the capillary wall.', 'vessel-exchange-network'),
  ],
}
