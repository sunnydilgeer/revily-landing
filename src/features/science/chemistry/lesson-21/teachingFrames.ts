import type { TeachingFrame } from '../../teachingFrame'

// Concentration is built from the picture first (crowded particles), then the unit (g/dm³), then the formula, then the
// rearranged formula for mass. Each teaching section keeps one kind of picture on screen and changes it frame by frame.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const concentrationFrames: Record<string, TeachingFrame[]> = {
  'C21-02': [
    f('More solute, more crowded', 'In the same volume, more dissolved solid means a more concentrated solution.', 'same volume → more particles → more crowded', 'When a solid dissolves in a liquid, the solid is called the solute. Both beakers here hold the same volume of water. The right beaker has more solute in it, so its particles are more crowded. We say it is more concentrated.', 'conc-crowd-solute'),
    f('More water, less crowded', 'The same solute in more water is less concentrated.', 'same solute → more water → more spread out', 'Now the amount of solute stays the same. The left beaker has only a little water, so the particles are close together. The right beaker has much more water, so they are spread out. Adding water makes a solution less concentrated.', 'conc-crowd-volume'),
    f('Measuring concentration', 'Concentration is the mass of solute in each 1 dm³ of solution.', 'mass in 1 dm³ → g/dm³', 'To measure how crowded a solution is, we count the mass of solute in a fixed volume. The fixed volume is 1 dm³, a cubic decimetre. It is a cube with sides of 10 cm, so 1 dm³ is 1000 cm³. A concentration of 20 g/dm³ means 20 g of solute in every 1 dm³.', 'conc-unit-dm3'),
  ],
  'C21-05': [
    f('The formula', 'Concentration is the mass of solute divided by the volume of solution.', 'mass in g ÷ volume in dm³ → g/dm³', 'To work out concentration, divide the mass of solute by the volume of the solution. The mass is in grams and the volume is in dm³. So the answer is in g/dm³. The units of the answer come from the units you put in.', 'conc-formula'),
    f('Changing cm³ to dm³', 'Divide a volume in cm³ by 1000 to get dm³.', '250 cm³ → ÷ 1000 → 0.25 dm³', 'Volumes are often given in cm³, but the formula needs dm³. There are 1000 cm³ in 1 dm³. So divide by 1000. For example, 250 cm³ is 250 ÷ 1000 = 0.25 dm³, which is a quarter of a dm³.', 'conc-convert'),
    f('Put it together', 'Write the mass, change the volume, then divide.', 'mass → volume in dm³ → divide', 'Suppose 24 g of solute is dissolved in 400 cm³ of solution. Write down the mass: 24 g. Change the volume: 400 ÷ 1000 = 0.4 dm³. Then divide: 24 ÷ 0.4 = 60. So the concentration is 60 g/dm³.', 'conc-steps'),
  ],
  'C21-09': [
    f('Rearranging the formula', 'Multiply both sides by the volume to get the mass on its own.', 'conc × volume = mass', 'Sometimes you know the concentration and the volume, and want the mass of solute. Start with concentration = mass ÷ volume. Multiply both sides by the volume. On the right, the ÷ volume and × volume cancel. That leaves concentration × volume = mass.', 'conc-rearrange'),
    f('A formula triangle', 'Cover the quantity you want to find. What is left shows the sum.', 'cover mass → conc. × volume', 'A formula triangle can help with rearranging. Put mass at the top, and concentration and volume at the bottom. Cover the thing you want to find with your finger. Cover mass and you are left with concentration × volume.', 'conc-triangle'),
    f('Put it together', 'Change the volume to dm³, then multiply by the concentration.', 'volume in dm³ → × conc. → mass in g', 'Suppose a solution is 30 g/dm³ and you have 200 cm³ of it. First change the volume: 200 ÷ 1000 = 0.2 dm³. Then multiply: 30 × 0.2 = 6. So the mass of solute is 6 g.', 'conc-mass-steps'),
  ],
}
