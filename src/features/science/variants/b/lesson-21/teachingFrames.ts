import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// One garden first: tomatoes (TMV) set up the chlorophyll → photosynthesis → growth chain, roses reuse it.
// Then malaria reuses the vector idea (Lesson 19) and the four-part disease card (Lesson 20).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const plantMalariaFrames: Record<string, TeachingFrame[]> = {
  'B21-02': [
    f('Patchy leaves', 'A virus has infected the tomato plants.', 'patches → virus', 'A gardener notices that her tomato plants have leaves with light and dark patches. The cause is a virus called tobacco mosaic virus, or TMV.', 'disease-tmv-cause'),
    f('A mosaic pattern', 'TMV makes parts of the leaves lose their colour.', 'mosaic = patchwork', 'A mosaic is a pattern made of patches. TMV makes parts of the leaves lose their colour, giving a mosaic pattern. It infects many kinds of plant, including tomatoes.', 'disease-tmv-signs'),
    f('Less green, less photosynthesis', 'The pale patches have less chlorophyll.', 'chlorophyll absorbs light', 'Chlorophyll is the green substance in leaves that absorbs light. The pale patches have less chlorophyll. So less photosynthesis can happen.', 'plantdisease-chain-tmv'),
    f('Too little food to grow', 'Less photosynthesis means less food.', 'less food → poor growth', 'Photosynthesis makes the plant’s food. A plant with TMV makes less food, so it cannot grow well.', 'plantdisease-chain-growth'),
    f('How TMV gets around', 'It spreads when infected plants are touched.', 'touch → spread', 'TMV spreads by direct contact. It passes on when infected plants touch other plants, or on hands and tools. You met direct contact in Lesson 19.', 'disease-tmv-spread'),
  ],
  'B21-05': [
    f('Spots on the roses', 'A fungus is growing on the rose leaves.', 'spots → fungus', 'The same gardener finds purple or black spots on her rose leaves. This is rose black spot. It is caused by a fungus, which you met in Lesson 19.', 'disease-blackspot-cause'),
    f('Yellow leaves fall', 'Spotted leaves turn yellow and drop off.', 'spots → yellow → fall', 'The spotted leaves turn yellow. Then they drop off the plant early.', 'disease-blackspot-signs'),
    f('Fewer leaves, less food', 'The same chain as TMV, starting with fewer leaves.', 'fewer leaves → less photosynthesis', 'Fewer leaves means less photosynthesis. So the rose makes less food and does not grow well.', 'plantdisease-chain-blackspot'),
    f('Carried by water and wind', 'The fungus spreads to other roses.', 'water, wind', 'The fungus spreads in the environment. Water or wind carries it to other rose plants.', 'disease-blackspot-spread'),
    f('Stopping black spot', 'Spray fungicide and destroy spotted leaves.', 'kill it, remove it', 'A fungicide is a chemical that kills fungi. Gardeners spray fungicides. They also remove spotted leaves and destroy them, so the fungus cannot spread.', 'disease-blackspot-stop'),
  ],
  'B21-08': [
    f('Caused by a protist', 'Malaria is caused by a protist.', 'protist → mosquito', 'Malaria is caused by a protist. You met protists in Lesson 19. A life cycle is the stages a living thing goes through. Part of this protist’s life cycle happens inside mosquitoes.', 'disease-malaria-cause'),
    f('Picked up in a bite', 'A mosquito picks up the protist from infected blood.', 'feed → pick up', 'A mosquito feeds on the blood of a person with malaria. The protist passes into the mosquito.', 'malaria-cycle-pickup'),
    f('Passed on in the next bite', 'The mosquito passes the protist to someone new.', 'bite → pass on', 'Later, the mosquito bites another person. It passes the protist on. So the mosquito is a vector: it carries the pathogen.', 'malaria-cycle-passon'),
    f('Signs of malaria', 'Fever that keeps coming back.', 'fever again and again', 'Malaria causes fever that keeps coming back. Malaria can kill.', 'disease-malaria-signs'),
    f('Stopping malaria', 'Stop mosquitoes breeding, and stop the bites.', 'fewer mosquitoes, fewer bites', 'Stopping mosquitoes breeding means there are fewer of them. Mosquito nets stop people being bitten while they sleep.', 'disease-malaria-stop'),
  ],
  'B21-11': [
    f('The full set', 'Seven diseases, four kinds of pathogen.', 'sort by pathogen', 'Bacteria: Salmonella and gonorrhoea. Viruses: measles, HIV and TMV. Fungus: rose black spot. Protist: malaria. You met the first four in Lesson 20.', 'disease-grid7'),
  ],
}
