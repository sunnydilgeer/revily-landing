import type { TeachingFrame } from '../teachingFrame'

// What respiration is (and is not), then the two kinds: with oxygen first, because it is the normal case, then without
// oxygen in muscles, then in yeast and plants, ending with one card that compares all three word equations.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const respirationFrames: Record<string, TeachingFrame[]> = {
  'B28-02': [
    f('Not breathing', 'Respiration is not the same as breathing.', 'breathing = air in and out; respiration = a reaction in cells', 'Breathing moves air in and out of your lungs. Respiration is different: it is a chemical reaction that happens inside cells. All living things respire, including plants and yeast, which do not breathe.', 'energy-resp-breathing'),
    f('Energy from glucose', 'Respiration transfers energy from glucose.', 'glucose broken down → energy', 'In respiration, cells break down glucose and transfer energy from it. You met glucose as the sugar that plants make. Respiration goes on in every cell of your body, all the time. The energy is used for all the living processes a cell carries out.', 'energy-resp-energy'),
    f('Exothermic', 'Respiration gives out energy to the surroundings.', 'exothermic = gives energy out', 'Respiration transfers energy to the environment. A reaction that does this is called exothermic. Photosynthesis is the opposite: it is endothermic, because it takes energy in.', 'energy-resp-exothermic'),
    f('What the energy is for', 'Organisms use the energy in three main ways.', 'build, move, keep warm', 'Organisms use the energy from respiration to build larger molecules from smaller ones. Animals also use it to move about. Mammals and birds use it to keep warm.', 'energy-resp-uses'),
  ],
  'B28-05': [
    f('Aerobic respiration', 'Respiration that uses oxygen is aerobic.', 'aerobic = with oxygen', 'Most of the time, your cells use oxygen to break down glucose. Respiration that uses oxygen is called aerobic respiration. It is the most efficient way to transfer energy from glucose.', 'energy-aerobic-oxygen'),
    f('The word equation', 'Glucose and oxygen react to make carbon dioxide and water.', 'in: glucose + oxygen; out: CO₂ + water', 'The word equation is glucose + oxygen → carbon dioxide + water. Glucose and oxygen go in, and carbon dioxide and water are made. It uses the same substances as photosynthesis, but the other way round.', 'energy-aerobic-equation'),
    f('Mitochondria', 'Most aerobic respiration happens in mitochondria.', 'mitochondria = where it happens', 'Aerobic respiration goes on all the time in plants and animals. Most of its reactions happen inside mitochondria. You met mitochondria when you learned about the parts of a cell.', 'energy-aerobic-where'),
    f('Chemical symbols', 'Each substance has a chemical symbol.', 'C₆H₁₂O₆ + O₂ → CO₂ + H₂O', 'You met these symbols when you learned about photosynthesis. Glucose is C₆H₁₂O₆ and oxygen is O₂. Carbon dioxide is CO₂ and water is H₂O.', 'energy-aerobic-summary'),
  ],
  'B28-08': [
    f('Short of oxygen', 'In hard exercise, muscles may not get enough oxygen.', 'not enough oxygen → respire without it too', 'During hard exercise, your body sometimes cannot get enough oxygen to your muscles. Then the muscle cells also respire without oxygen, as well as with it. Respiration without oxygen is called anaerobic respiration. You will see what this does during exercise in the next lesson.', 'energy-anaerobic-short'),
    f('Lactic acid', 'In muscles, glucose is turned into lactic acid.', 'glucose → lactic acid', 'In muscle cells, anaerobic respiration turns glucose into lactic acid. The word equation is glucose → lactic acid. The glucose is not broken down completely.', 'energy-anaerobic-lactic'),
    f('Much less energy', 'Anaerobic respiration transfers much less energy.', 'no oxygen → incomplete → less energy', 'In anaerobic respiration, glucose is not combined with oxygen. Combining with oxygen is called oxidation, so the oxidation of glucose is incomplete. This means anaerobic respiration transfers much less energy than aerobic respiration.', 'energy-anaerobic-less'),
  ],
  'B28-11': [
    f('Plants and yeast', 'Plants and yeast make ethanol and carbon dioxide.', 'glucose → ethanol + CO₂', 'Plant cells and yeast cells can also respire without oxygen. Yeast is a fungus made of single cells. In these cells, the word equation is glucose → ethanol + carbon dioxide. Ethanol is a type of alcohol.', 'energy-yeast-cells'),
    f('Fermentation', 'Anaerobic respiration in yeast is called fermentation.', 'fermentation = yeast respiring without oxygen', 'When yeast respires without oxygen, the process has its own name. It is called fermentation. The food and drinks industry uses fermentation a lot.', 'energy-yeast-ferment'),
    f('Bread and drinks', 'Carbon dioxide makes bread rise; ethanol is the alcohol in drinks.', 'CO₂ → bread rises; ethanol → beer and wine', 'In bread making, yeast ferments sugar in the dough. The carbon dioxide gas makes bubbles, so the dough rises. In making beer and wine, fermentation makes the ethanol, which is the alcohol in the drink.', 'energy-yeast-uses'),
    f('Compare the three', 'There are three word equations to know.', 'with oxygen; muscles; plants and yeast', 'Aerobic respiration is glucose + oxygen → carbon dioxide + water. In muscles, anaerobic respiration is glucose → lactic acid. In plants and yeast, it is glucose → ethanol + carbon dioxide. Only aerobic respiration uses oxygen.', 'energy-yeast-compare'),
  ],
}
