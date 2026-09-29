import type { TeachingFrame } from '../../teachingFrame'

// One column drawing, built up step by step. First how the column works (heat, temperature gradient, rising vapour),
// then why fractions leave at different heights (chain length and boiling point), then the named fractions.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const fractionFrames: Record<string, TeachingFrame[]> = {
  'C39-02': [
    f('A mixture to separate', 'Crude oil is a mixture of many different hydrocarbons, most of them alkanes.', 'one mixture, many hydrocarbons', 'Crude oil is not one substance. It is a mixture of many different hydrocarbons, and most of them are alkanes. We cannot use the mixture straight away. The hydrocarbons have to be separated first, and this is done by fractional distillation.', 'frac-mixture'),
    f('Heat the oil', 'The oil is heated until most of it has evaporated. The vapours pass into the column.', 'heat first, then into the column', 'First the oil is heated until most of it has evaporated. The hot vapours pass into a tall tube called the fractionating column. Any liquid that has not evaporated is drained away from the bottom.', 'frac-heat'),
    f('Hot below, cool above', 'The column is very hot at the bottom and gets cooler towards the top.', 'temperature drops as you go up', 'The column is not the same temperature all the way up. It is very hot at the bottom. It gets steadily cooler as you go higher. This change in temperature is what separates the hydrocarbons.', 'frac-gradient'),
    f('Rise, cool, condense', 'Vapours rise up the column. Each one condenses to a liquid when it reaches a part that is cool enough.', 'a gas turns to liquid when it cools enough', 'The vapours rise up the column and cool as they go. Each hydrocarbon turns back into a liquid where the column is cool enough for it. The liquids are drained off at different heights.', 'frac-rise'),
  ],
  'C39-05': [
    f('Short chains', 'Short hydrocarbon molecules have low boiling points.', 'short chain, low boiling point', 'Hydrocarbons with short chains have low boiling points. That means they are still gases even when it is fairly cool. They do not condense until they have travelled a long way up the column.', 'frac-short'),
    f('Long chains', 'Long hydrocarbon molecules have high boiling points.', 'long chain, high boiling point', 'Hydrocarbons with long chains have high boiling points. They stay as gases only if it is very hot. As soon as they rise a little way, the column is cool enough for them to condense.', 'frac-long'),
    f('Different heights', 'So long chains leave near the bottom of the column and short chains leave near the top.', 'long near the bottom, short near the top', 'Put the two ideas together. Long chains condense early and drain out near the bottom. Short chains keep rising and condense near the top. The chains get shorter as you go up the column.', 'frac-heights'),
    f('Fractions', 'Each fraction is a group of hydrocarbons with similar numbers of carbon atoms, so similar boiling points.', 'one fraction, similar chain lengths', 'The crude oil ends up split into separate parts. These parts are called fractions. Each fraction is still a mixture, but its hydrocarbons have similar numbers of carbon atoms. So they have similar boiling points.', 'frac-similar'),
  ],
  'C39-08': [
    f('The main fractions', 'From the top of the column to the bottom: LPG, petrol, kerosene, diesel oil, heavy fuel oil and bitumen.', 'six fractions, top to bottom', 'Six main fractions leave the column. From the top down they are LPG, petrol, kerosene, diesel oil, heavy fuel oil and bitumen. LPG stands for liquefied petroleum gas.', 'frac-list'),
    f('Longer as you go down', 'The molecules get longer and the boiling points get higher as you go down.', 'down the column: longer chains, higher boiling points', 'Roughly, LPG has about 3 carbon atoms in each molecule and petrol about 8. Kerosene has about 15, diesel oil about 20 and heavy fuel oil about 40. Bitumen has the longest molecules of all.', 'frac-trend'),
    f('What each is used for', 'LPG, petrol, kerosene, diesel oil, heavy fuel oil and bitumen all have different uses.', 'match the fraction to a job', 'LPG is used as a fuel for heating and cooking. Petrol fuels cars, kerosene fuels aircraft and diesel oil fuels lorries. Heavy fuel oil is burned to power large ships. Bitumen is used to surface roads.', 'frac-uses'),
  ],
}
