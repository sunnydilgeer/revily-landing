import type { TeachingFrame } from '../../teachingFrame'

// Four short walkthroughs, each reusing one drawing idea: the pH strip (range, bands, everyday liquids), colour and
// number measurements, the particles that make a solution acidic or alkaline, and neutralisation.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const acidFrames: Record<string, TeachingFrame[]> = {
  'C22-02': [
    f('A number for acidity', 'The pH scale runs from 0 to 14.', 'pH → a number from 0 to 14', 'Some solutions are acidic, some are alkaline, and some are neither. A number tells you which, and how strongly. It is called the pH. The pH scale runs from 0 to 14.', 'acid-scale-range'),
    f('Above and below 7', 'Low pH is acidic, high pH is alkaline, 7 is neutral.', 'below 7 → acidic · 7 → neutral · above 7 → alkaline', 'A solution with a pH below 7 is acidic. The lower the pH, the more acidic it is. A solution with a pH above 7 is alkaline, and the higher the pH, the more alkaline it is. Pure water is exactly 7. Something that is neither acidic nor alkaline is called neutral.', 'acid-scale-bands'),
    f('Everyday liquids', 'Lemon juice and vinegar are acidic; hand soap and drain cleaner are alkaline.', 'lemon juice → 2 · pure water → 7 · drain cleaner → 13', 'Lemon juice has a pH of about 2, and vinegar about 3, so both are acidic. Normal rain is very slightly acidic. Hand soap and drain cleaner are alkaline. Drain cleaner is strongly alkaline, so it needs careful handling.', 'acid-scale-examples'),
  ],
  'C22-05': [
    f('Indicators', 'An indicator is a dye that changes colour above or below a certain pH.', 'dye → colour changes with pH', 'How can you tell the pH of a solution? One way is to add a dye. Its colour depends on the pH of the solution. A dye like this is called an indicator.', 'acid-ind-dye'),
    f('Universal indicator', 'Universal indicator changes through many colours as the pH changes.', 'red → orange → yellow → green → blue → purple', 'Some indicators only have two colours. Universal indicator gradually changes through many colours as the pH goes from 0 to 14. It is red in strong acid, green at pH 7 and purple in strong alkali. It is called a wide range indicator. Matching the colour to a chart gives you an estimate of the pH.', 'acid-ind-universal'),
    f('A pH probe', 'A pH probe and meter give the pH as a number.', 'probe in solution → meter shows a number', 'You can also measure pH with a pH probe joined to a meter. You put the probe in the solution, and the meter shows the pH as a number. This is more accurate than reading a colour, because the colours only give an estimate.', 'acid-ind-probe'),
  ],
  'C22-08': [
    f('What makes a solution acidic', 'Acids form solutions that contain hydrogen ions, H⁺.', 'acid in water → H⁺ ions → pH below 7', 'Every acid dissolves in water to make hydrogen ions. Their symbol is H⁺. A solution with lots of H⁺ ions is acidic, and its pH is less than 7. Hydrochloric acid is one example.', 'acid-h'),
    f('Bases', 'A base is a substance that neutralises an acid.', 'base + acid → cancel each other out', 'A base is any substance that reacts with an acid and cancels it out. This is called neutralising the acid. Metal oxides and metal hydroxides are bases. Sodium hydroxide and copper oxide are examples.', 'acid-base'),
    f('Alkalis', 'An alkali is a base that dissolves in water to make hydroxide ions, OH⁻.', 'dissolves → OH⁻ ions → pH above 7', 'Some bases dissolve in water. When they do, the solution contains hydroxide ions. Their symbol is OH⁻. A base that dissolves in water is called an alkali. Its solution has a pH greater than 7.', 'acid-oh'),
    f('Put it together', 'All alkalis are bases, but many bases are not alkalis.', 'alkali ⊂ base', 'Sodium hydroxide is a base that dissolves in water, so it is also an alkali. Copper oxide is a base too, but it does not dissolve, so it is not an alkali. Every alkali is a base. Not every base is an alkali.', 'acid-sets'),
  ],
  'C22-11': [
    f('Acid plus base', 'Neutralisation makes a salt and water, and the products are neutral.', 'acid + base → salt + water', 'When an acid reacts with a base, they cancel each other out. This reaction is called neutralisation. It makes a salt and water. If the amounts are just right, the mixture ends up at pH 7, so it is neutral.', 'acid-neut-word'),
    f('The ions', 'Neutralising an alkali: H⁺ and OH⁻ ions join to make water.', 'H⁺ + OH⁻ → H₂O', 'In an acid and an alkali, the H⁺ ions from the acid react with the OH⁻ ions from the alkali. Each pair joins to make a water molecule. The equation is H⁺(aq) + OH⁻(aq) → H₂O(l). The (aq) means the ions are dissolved in water.', 'acid-neut-ions'),
    f('Knowing when to stop', 'Add universal indicator and stop when it turns green.', 'add alkali slowly → green → stop', 'To neutralise an acid, add universal indicator to it. Then add the alkali a little at a time. The colour changes gradually. When the indicator turns green, the mixture is neutral, so you stop. If you add more, it turns blue or purple.', 'acid-neut-indicator'),
  ],
}
