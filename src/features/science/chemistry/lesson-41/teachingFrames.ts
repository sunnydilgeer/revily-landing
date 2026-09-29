import type { TeachingFrame } from '../../teachingFrame'

// Everyday "pure" versus chemical purity, the melting and boiling point test, then formulations.
// Mixtures and separation methods are recalled from earlier lessons, not re-taught.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const purityFrames: Record<string, TeachingFrame[]> = {
  'C41-02': [
    f('Pure in everyday life', 'In everyday life, pure usually means that nothing has been added to something.', 'nothing added', 'On a food label, pure usually means nothing has been added. Pure orange juice has had nothing put in. But that juice is still a mixture of many different substances.', 'pure-everyday'),
    f('Pure in chemistry', 'In chemistry, a pure substance contains only one element or one compound, all the way through.', 'one substance only', 'Chemists use the word more strictly. A pure substance contains only one element or only one compound. It is not mixed with anything else, all the way through.', 'pure-chemistry'),
    f('Pure or mixed?', 'Pure water has only water molecules. Tap water and orange juice also hold other substances, so they are mixtures.', 'is anything else in there?', 'Pure water contains only water molecules. Tap water has dissolved substances in it too. So tap water is a mixture, even though it looks clear and clean.', 'pure-sort'),
    f('An impure sample', 'A sample with other substances in it is impure. Making a substance in the lab does not guarantee it is pure.', 'unwanted extras', 'A chemist may make a compound and still end up with some other substances mixed in. The sample is then impure. Chemists have ways to find out how pure a sample is.', 'pure-impure'),
  ],
  'C41-05': [
    f('A fixed temperature', 'A pure substance melts and boils at one specific temperature.', 'one exact temperature', 'A pure substance melts at one specific temperature. It also boils at one specific temperature. For example, pure water melts at 0 °C and boils at 100 °C.', 'pure-fixed'),
    f('Look up the value', 'Data books list the melting and boiling points of pure substances, so you can compare your sample with them.', 'compare with a data book', 'To test a sample, measure its melting point or boiling point. Then look up the value for the pure substance in a data book. Compare your result with it.', 'pure-compare'),
    f('Closer means purer', 'The closer the measured value is to the data book value, the purer the sample is.', 'small gap, pure sample', 'Look at the gap between the two values. A small gap means the sample is very pure. A big gap means the sample is less pure.', 'pure-gap'),
    f('Impurities and melting', 'Impurities lower the melting point. They can also make the sample melt over a wider range of temperatures.', 'lower, and spread out', 'Impurities lower the melting point of a sample. A pure sample melts at one temperature. An impure one may melt gradually, across a range of temperatures.', 'pure-melting'),
    f('Impurities and boiling', 'Impurities raise the boiling point. They can also make the sample boil over a range of temperatures.', 'higher, and spread out', 'Impurities raise the boiling point of a sample. An impure sample may also boil across a range of temperatures, not at one.', 'pure-boiling'),
  ],
  'C41-08': [
    f('A mixture with a purpose', 'A formulation is a mixture designed to be useful for a particular job.', 'a designed mixture', 'A formulation is a mixture that has been designed for a particular use. Every part of it is there for a reason.', 'pure-formulation'),
    f('Follow the recipe', 'Formulations are made following a formula, which is a recipe. Each part is measured so that it is in the right amount.', 'exact amounts', 'A formulation is made by following a formula, which is a recipe. Each part is measured carefully. This gives the right amount of every part.', 'pure-recipe'),
    f('The right properties', 'Measuring each part carefully gives the formulation the properties it needs to do its job.', 'amounts decide properties', 'Getting the amounts right matters. It gives the formulation the properties it needs to work as it should. Changing an amount changes how the product behaves.', 'pure-properties'),
    f('Paint as a formulation', 'Paint contains a pigment for colour, a solvent, a binder and additives, each with its own job.', 'four parts, four jobs', 'Paint is a formulation. The pigment gives the colour. The solvent dissolves the other parts and makes the paint runny. The binder holds the pigment on the wall. Additives change the properties.', 'pure-paint'),
    f('Formulations everywhere', 'Cleaning products, fuels, medicines, cosmetics, fertilisers, alloys and food are all formulations.', 'look around the house', 'Formulations are all around you. Cleaning products, fuels, medicines, cosmetics, fertilisers, metal alloys, and food and drink are all formulations.', 'pure-everyday-formulations'),
  ],
}
