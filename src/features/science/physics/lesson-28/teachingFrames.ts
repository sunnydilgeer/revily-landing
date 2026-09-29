import type { TeachingFrame } from '../../teachingFrame'

// Density: meaning and particle packing, the equation with one worked example, and the methods for regular solids, irregular solids and liquids.
// Practical preparation only; unit conversions between cm3 and m3 are avoided (g/cm3 or given values).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const densityFrames: Record<string, TeachingFrame[]> = {
  'P28-02': [
    f('Mass in a given space', 'Density tells you how much mass is packed into a certain space.', 'mass in a space', 'Density tells you how much mass there is in a certain space. A block of lead and a block of wood can be the same size, but the lead has far more mass. So the lead is denser.', 'density-idea'),
    f('Packed particles', 'The denser a material, the more tightly packed its particles are.', 'tightly packed', 'The density of a material depends on what it is made of and how its particles are arranged. The denser a material is, the more tightly packed its particles are.', 'density-packing'),
    f('Solids, liquids and gases', 'Solids are generally denser than liquids, and liquids are generally denser than gases.', 'packing in each state', 'Solids are generally denser than liquids, and liquids are generally denser than gases. That is because their particles are packed less and less tightly.', 'density-states'),
    f('The density equation', 'Density = mass ÷ volume, or ρ = m/V. Mass in kg and volume in m³ give density in kg/m³.', 'mass ÷ volume', 'To work out density, use the word equation density = mass ÷ volume. In symbols this is ρ = m/V, where ρ is the Greek letter rho. With mass in kilograms and volume in cubic metres, density is in kg/m³.', 'density-equation'),
  ],
  'P28-05': [
    f('Choose the equation', 'A steel block has a volume of 0.0050 m³ and a mass of 39 kg. Start with density = mass ÷ volume.', 'word equation first', 'A block of steel has a volume of 0.0050 m³ and a mass of 39 kg. We want its density. Start with the word equation: density = mass ÷ volume.', 'density-w1'),
    f('Put the numbers in', 'density = 39 ÷ 0.0050', 'mass on top', 'Substitute the values into the equation. Density = 39 ÷ 0.0050. The mass in kilograms goes on top, and the volume in cubic metres goes underneath.', 'density-w2'),
    f('Work it out', '39 ÷ 0.0050 = 7800', 'use a calculator', 'Use a calculator to divide. 39 ÷ 0.0050 = 7800.', 'density-w3'),
    f('Add the unit', 'The density of the steel is 7800 kg/m³.', 'kg and m³ give kg/m³', 'The mass was in kilograms and the volume was in cubic metres. So the answer is in kilograms per cubic metre. The density of the steel is 7800 kg/m³.', 'density-w4'),
  ],
  'P28-08': [
    f('A regular solid', 'For a regular shape, use a balance for the mass and a ruler for the length, width and height.', 'balance and ruler', 'A regular solid, such as a cuboid, has a simple shape. Use a balance to measure its mass. Then use a ruler to measure its length, width and height.', 'density-regular'),
    f('Find its density', 'Volume of a cuboid = length × width × height. Then density = mass ÷ volume.', 'volume first', 'Multiply the three lengths to find the volume of the cuboid. The volume of a cuboid is length × width × height. Then use density = mass ÷ volume.', 'density-regular-calc'),
    f('An irregular solid', 'An irregular object has no simple volume formula. Use a eureka can to find its volume.', 'no simple formula', 'An irregular object, such as a small stone, has no simple formula for its volume. Use a balance to measure its mass. To find the volume, you need a eureka can. This is a can with a spout in its side.', 'density-eureka'),
    f('Volume by displacement', 'The stone pushes water out of the can. The water collected has the same volume as the stone.', 'water pushed out', 'Fill the eureka can with water and put a measuring cylinder under the spout. Lower the stone in gently on a thread. It pushes some water out through the spout. The volume of water collected is equal to the volume of the stone.', 'density-displace'),
  ],
  'P28-11': [
    f('Mass of a liquid', 'Put an empty measuring cylinder on a balance and zero it. Then pour in the liquid.', 'zero the balance', 'To find the density of a liquid, put an empty measuring cylinder on a balance. Zero the balance. Then pour in 50 cm³ of the liquid, and the balance shows the mass of the liquid only.', 'density-liquid'),
    f('Density of a liquid', 'Use density = mass ÷ volume. For example, 40 g in 50 cm³ gives 0.8 g/cm³.', 'g and cm³ give g/cm³', 'Read the volume from the measuring cylinder. Then use density = mass ÷ volume. Suppose the mass is 40 g and the volume is 50 cm³. Then density = 40 ÷ 50 = 0.8 g/cm³, because grams and cm³ give g/cm³.', 'density-liquid-calc'),
    f('Taking care', 'Read the scale level with your eye. Repeat and take a mean. Wipe up spills.', 'accuracy and safety', 'Read the scale of the measuring cylinder with your eye level with the liquid surface. Repeat the measurements and take a mean to make the result more reliable. Wipe up spills quickly because they are slippery. This prepares you for the real practical, where you use the equipment yourself.', 'density-care'),
  ],
}
