import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one sunflower through a summer: what goes in and out (the word equation), where it happens (chloroplasts,
// chlorophyll, endothermic, symbols), then where the glucose goes, ending with why starch rather than glucose is stored.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const photosynthesisFrames: Record<string, TeachingFrame[]> = {
  'B26-02': [
    f('A sunflower grows', 'A small seed grows taller than you in one summer.', 'where does it all come from?', 'A sunflower seed can grow into a plant taller than you in one summer. Most of the new plant is made from carbon dioxide and water. It does this by photosynthesis.', 'photo-sun-grow'),
    f('The word equation', 'Photosynthesis turns carbon dioxide and water into glucose and oxygen.', 'in: CO₂ + water; out: glucose + oxygen', 'Photosynthesis uses energy from light to change carbon dioxide and water into glucose and oxygen. Glucose is a sugar. The word equation is carbon dioxide + water → glucose + oxygen, with light over the arrow.', 'photo-sun-equation'),
    f('Carbon dioxide in', 'Carbon dioxide gets in through the stomata.', 'from the air', 'Carbon dioxide gets into the leaves from the air, through tiny holes called stomata. You met stomata in Lesson 18. Oxygen leaves the same way.', 'photo-sun-co2'),
    f('Water in', 'Water comes up from the roots.', 'from the soil', 'Water is taken in by the roots from the soil. It travels up the stem to the leaves in the xylem, as you saw in Lesson 18.', 'photo-sun-water'),
  ],
  'B26-05': [
    f('Chloroplasts', 'Photosynthesis happens in chloroplasts.', 'chloroplast = where it happens', 'Photosynthesis happens inside chloroplasts in plant cells. Leaf cells near the top of the leaf are packed with them, as you saw in Lesson 17.', 'photo-leaf-chloroplast'),
    f('Chlorophyll', 'Chlorophyll absorbs light.', 'chlorophyll = green, absorbs light', 'Chloroplasts contain chlorophyll. Chlorophyll is a green substance that absorbs light. This is why leaves look green.', 'photo-leaf-chlorophyll'),
    f('Endothermic', 'Photosynthesis takes in energy from the environment.', 'endothermic = takes energy in', 'Light transfers energy from the environment to the chloroplasts. A reaction that takes in energy from the environment is endothermic. Photosynthesis is endothermic.', 'photo-leaf-endothermic'),
    f('Chemical symbols', 'Each substance also has a chemical symbol.', 'symbols: CO₂, H₂O, C₆H₁₂O₆, O₂', 'Scientists also write each substance as a chemical symbol. Carbon dioxide is CO₂ and water is H₂O. Glucose is C₆H₁₂O₆ and oxygen is O₂.', 'photo-summary'),
  ],
  'B26-08': [
    f('Respiration', 'Some glucose is used for respiration.', 'glucose → energy to live', 'Some glucose is used for respiration. Respiration transfers energy from glucose. The sunflower uses this energy to live and grow, and to turn the rest of its glucose into other substances.', 'photo-use-respiration'),
    f('Cell walls', 'Glucose is made into cellulose for cell walls.', 'cellulose = strong walls', 'Some glucose is changed into cellulose. Cellulose makes strong plant cell walls, so the sunflower’s stem can grow tall.', 'photo-use-cellulose'),
    f('Proteins', 'Glucose and nitrate make amino acids, then proteins.', 'glucose + nitrate → amino acids', 'Glucose is combined with nitrate ions to make amino acids. The roots absorb nitrate ions from the soil. Amino acids are then joined to make proteins.', 'photo-use-protein'),
    f('Oils in seeds', 'Glucose is turned into oils stored in seeds.', 'lipids = fats and oils', 'Glucose is turned into lipids, which are fats and oils. The sunflower stores oil in its seeds. This is where sunflower oil comes from.', 'photo-use-oil'),
    f('Starch', 'Glucose is stored as starch for later.', 'starch = a food store', 'Glucose is turned into starch and stored in roots, stems and leaves. At night, when there is no light, the sunflower uses this stored starch.', 'photo-use-starch'),
    f('Why starch?', 'Starch is insoluble, so it does not pull in water.', 'insoluble = does not dissolve', 'Starch is insoluble, which means it does not dissolve in water. A cell full of glucose would draw in lots of water by osmosis and swell. You met osmosis in Lesson 6.', 'photo-use-insoluble'),
  ],
}
