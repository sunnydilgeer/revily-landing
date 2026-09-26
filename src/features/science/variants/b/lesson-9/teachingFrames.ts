import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const digestionFrames: Record<string, TeachingFrame[]> = {
  'B9-02': [
    f('Why digestion is needed', 'Large food molecules must be broken into smaller soluble molecules.', 'large and insoluble become small and soluble', 'Starch, proteins and lipids are too large to pass through the wall of the digestive system. Digestive enzymes break them into smaller molecules that can dissolve and be absorbed into the bloodstream.', 'digestion-size'),
    f('Absorption is different from digestion', 'Digestion breaks molecules down; absorption moves products into the body.', 'two linked processes', 'Chemical digestion changes large food molecules into smaller ones. Absorption then moves those small soluble products through the small-intestine wall and into the blood.', 'digestion-absorption'),
  ],
  'B9-04': [
    f('Carbohydrases', 'Carbohydrases break carbohydrates into simple sugars.', 'starch becomes sugar', 'Amylase is a carbohydrase. It breaks starch into sugars. Glucose is one sugar that cells can use in respiration.', 'digestion-amylase'),
    f('Proteases', 'Proteases break proteins into amino acids.', 'protein becomes amino acids', 'Amino acids are small soluble products of protein digestion. The body can use absorbed amino acids to build new proteins.', 'digestion-protease'),
    f('Lipases', 'Lipases break lipids into glycerol and fatty acids.', 'lipid becomes glycerol and fatty acids', 'Lipids are fats and oils. Lipase breaks them into glycerol and fatty acids. The absorbed products can be used to build new lipids.', 'digestion-lipase'),
  ],
  'B9-07': [
    f('Where amylase is made and works', 'Amylase is made in salivary glands, the pancreas and the small intestine.', 'production site compared with action site', 'Amylase starts working in the mouth and also works in the small intestine. Remember that where an enzyme is made is not always the only place where it acts.', 'enzyme-sites-amylase'),
    f('Where proteases are made and work', 'Proteases are made in the stomach, pancreas and small intestine.', 'protein digestion', 'Proteases work in the stomach and small intestine. Different proteases can have different optimum conditions.', 'enzyme-sites-protease'),
    f('Where lipases are made and work', 'Lipases are made in the pancreas and small intestine.', 'fat digestion', 'Lipases work in the small intestine. Bile helps them by creating alkaline conditions and breaking large fat drops into smaller droplets.', 'enzyme-sites-lipase'),
  ],
  'B9-10': [
    f('Made in the liver, stored in the gall bladder', 'Bile enters the small intestine.', 'make, store, release', 'The liver makes bile. The gall bladder stores it. Bile is released into the small intestine, where it helps fat digestion.', 'bile-route'),
    f('Bile neutralises acid', 'Bile is alkaline, so it raises the pH of acidic stomach contents.', 'alkaline bile creates a suitable pH', 'Food arriving from the stomach contains hydrochloric acid. Bile helps neutralise this acid and creates alkaline conditions in the small intestine, where its digestive enzymes work effectively.', 'bile-neutralise'),
    f('Bile emulsifies fat', 'Bile separates a large fat drop into many smaller droplets.', 'more surface area for lipase', 'Emulsification does not chemically digest the fat. It increases the total surface area, so lipase can act on more fat at once and digestion is faster.', 'bile-emulsify'),
  ],
  'B9-13': [
    f('Prepare one food sample', 'Use the same well-mixed sample for fair comparisons.', 'sample preparation', 'In a supervised laboratory, a food sample can be mixed with distilled water and filtered when the chosen test needs a clear solution. The exact preparation depends on the centre’s method and the test being used.', 'food-sample'),
    f('Laboratory safety comes first', 'Heating and test reagents require teacher supervision.', 'risk assessment and correct equipment', 'Do not perform these tests at home. Follow the school risk assessment, wear the required eye protection and use a water bath or other equipment exactly as instructed. Reagents must be handled and disposed of safely.', 'food-safety'),
  ],
  'B9-15': [
    f('Benedict’s test for reducing sugars', 'A positive heated test changes from blue towards green, yellow, orange or brick-red.', 'reagent + heating + result', 'Mix the prepared sample with Benedict’s solution and heat it in a hot water bath using the school method. Blue means no reducing sugar was detected. A green-to-brick-red change is positive; the colour depends on amount.', 'food-benedict'),
    f('Iodine test for starch', 'A positive test changes from brown-orange to blue-black.', 'iodine colour', 'Add iodine solution to the sample using the supervised method. Brown-orange means no starch was detected. Blue-black means starch is present.', 'food-iodine'),
    f('Biuret test for protein', 'A positive test changes from blue to lilac or purple.', 'Biuret colour', 'Add the centre’s Biuret reagent safely and mix as instructed. Blue means no protein was detected. A lilac or purple colour means protein is present.', 'food-biuret'),
    f('A lipid test', 'A positive ethanol emulsion test forms a cloudy white layer.', 'lipid result', 'The current AQA handbook uses ethanol and water for a lipid test. A cloudy white emulsion is positive. Ethanol is highly flammable, so it must be kept away from flames. Some school methods use Sudan III instead; follow the method named in the question or by the teacher.', 'food-lipid'),
  ],
  'B9-20': [
    f('Read each result separately', 'A sample can contain more than one food group.', 'test, then observation, then conclusion', 'Do not decide from the food’s appearance. Match each observed colour or layer to its test. For example, blue-black iodine shows starch, while purple Biuret shows protein.', 'food-results'),
    f('Use controls and records', 'A result table keeps observations separate from conclusions.', 'evidence before claim', 'Record the starting colour, final observation and conclusion. A known positive and a known negative sample can help check that the reagents and method behaved as expected.', 'food-results-table'),
  ],
}
