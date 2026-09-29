import type { TeachingFrame } from '../../teachingFrame'

// Order: the series first (what it is, why it is ordered that way, the two non-metals in it), then oxidation and
// reduction as oxygen gain and loss, then extraction: carbon for metals below it, another method above it, and gold.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const reactivityFrames: Record<string, TeachingFrame[]> = {
  'C24-02': [
    f('A league table of metals', 'The reactivity series lists metals from most reactive to least reactive.', 'top of the list = most reactive', 'Some metals react fiercely and some barely react at all. The reactivity series puts metals in order, with the most reactive at the top. Potassium, sodium, lithium and calcium are very reactive. Hydrogen and copper are not very reactive.', 'react-series'),
    f('Why the order?', 'A metal that loses electrons more easily is higher in the series.', 'lose electrons easily → very reactive', 'Metal atoms react by losing electrons to become positive ions. A very reactive metal loses its electrons very easily. A less reactive metal holds on to them more firmly. So the higher a metal is in the series, the more easily it forms positive ions.', 'react-ions'),
    f('Carbon and hydrogen', 'Carbon and hydrogen are non-metals, but they are included in the series.', 'two non-metals used for comparison', 'Two non-metals are also placed in the series: carbon and hydrogen. They are there to help you compare metals. A metal above carbon is more reactive than carbon. A metal below carbon is less reactive than it.', 'react-nonmetals'),
  ],
  'C24-05': [
    f('Metals and oxygen', 'Many metals react with oxygen to make metal oxides.', 'metal + oxygen → metal oxide', 'Lots of common metals, such as iron and aluminium, react with oxygen. The product is a metal oxide. In the ground, metals are often found as compounds like these, mixed into rock. Rock that contains a metal compound worth extracting is called an ore.', 'react-oxide'),
    f('Gaining oxygen', 'Oxidation is a reaction in which a substance gains oxygen.', 'gain oxygen → oxidised', 'When magnesium burns, it joins with oxygen to make magnesium oxide. The magnesium has gained oxygen. A reaction where a substance gains oxygen is called oxidation. We say the magnesium is oxidised.', 'react-oxidation'),
    f('Losing oxygen', 'Reduction is a reaction in which a substance loses oxygen.', 'lose oxygen → reduced', 'Now run it backwards. When copper oxide is heated with carbon, the copper oxide loses its oxygen and copper is left. A reaction where a substance loses oxygen is called reduction. We say the copper oxide is reduced. Getting a metal out of its oxide is always a reduction.', 'react-reduction'),
  ],
  'C24-08': [
    f('Reduction with carbon', 'Carbon takes oxygen from a metal oxide, so the oxide is reduced.', 'carbon takes the oxygen', 'Some metals can be extracted from their ores by heating with carbon. In a blast furnace, iron oxide is heated with carbon. The iron oxide loses oxygen, so it is reduced. The carbon gains oxygen and makes carbon dioxide, so the carbon is oxidised.', 'react-carbon'),
    f('Which metals suit carbon?', 'Metals below carbon are extracted with carbon. Metals above it are not.', 'above or below carbon?', 'The reactivity series tells you which method to use. Metals below carbon, such as zinc, iron and copper, can be extracted by heating their oxides with carbon. Metals above carbon are extracted by electrolysis. Electrolysis is expensive, because it takes a lot of energy to melt the ore and to make the electricity.', 'react-cut'),
    f('Why carbon only works below', 'Carbon can only take oxygen from metals that are less reactive than itself.', 'stronger takes oxygen from weaker', 'Carbon can only pull oxygen away from a metal that is less reactive than carbon. Copper is below carbon, so carbon takes the oxygen and copper is made. Magnesium is above carbon, so carbon cannot take its oxygen. Nothing happens.', 'react-why'),
    f('The very unreactive', 'A few metals, such as gold, are found in the ground as the metal itself.', 'so unreactive it never made an oxide', 'Some metals are so unreactive that they do not react with oxygen in the ground. They are found as the metal itself. Gold is an example. It needs no extraction from an oxide, just collecting from the rock.', 'react-gold'),
  ],
}
