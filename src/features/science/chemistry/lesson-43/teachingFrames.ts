import type { TeachingFrame } from '../../teachingFrame'

// What Rf means, how to work one out (measure, divide, 2 s.f.), then using reference spots to identify substances.
// The chromatography method is taught in the earlier chromatography lessons; only a one-clause reminder here.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const rfFrames: Record<string, TeachingFrame[]> = {
  'C43-02': [
    f('Two distances', 'A chromatogram gives two distances to measure: how far the spot moved and how far the solvent moved.', 'spot distance and solvent distance', 'When a chromatogram is finished, the solvent has moved up the paper and carried the spots with it. We can measure two distances from the baseline. One is how far a spot has moved. The other is how far the solvent has moved.', 'rfval-two-distances'),
    f('The solvent front', 'The solvent front is the highest point the solvent reached. Mark it with a pencil line before the paper dries.', 'top of the wet paper', 'The highest point the solvent reached is called the solvent front. Mark it with a pencil line as soon as the paper is taken out. Once the paper dries, the line is hard to see.', 'rfval-front'),
    f('A ratio, the Rf value', 'The Rf value compares the two distances: distance moved by the spot divided by distance moved by the solvent.', 'spot distance ÷ solvent distance', 'A ratio compares one amount with another. The Rf value is the ratio of the distance moved by the spot to the distance moved by the solvent. The substance is the spot, so the formula is Rf = distance moved by substance ÷ distance moved by solvent.', 'rfval-formula'),
    f('Further means a larger Rf', 'The further a substance moves, the larger its Rf value. A spot cannot move further than the solvent.', 'further spot, bigger number', 'A spot that moves a long way has a large Rf value. A spot that hardly moves has a small one. A spot never travels further than the solvent, so an Rf value is never bigger than 1. It also has no units, because the two distances cancel.', 'rfval-bigger'),
  ],
  'C43-05': [
    f('Measure the spot', 'Measure from the baseline to the centre of the spot, in the same units as the solvent distance.', 'baseline to the middle of the spot', 'Start with a ruler. Measure from the baseline up to the centre of the spot. Say the spot is 7.3 cm from the baseline. Call this the distance moved by the substance.', 'rfval-measure-spot'),
    f('Measure the solvent', 'Measure from the baseline to the solvent front. Use the same units as before.', 'baseline to the solvent front', 'Now measure from the baseline to the solvent front. Say this is 9.6 cm. It must be in the same units as the first distance, here centimetres.', 'rfval-measure-front'),
    f('Divide', 'Rf = 7.3 ÷ 9.6 = 0.7604…, using the formula with the substance distance on top.', 'substance on top, solvent below', 'Put the numbers into the formula. Rf = 7.3 ÷ 9.6. A calculator gives 0.7604… The substance distance goes on top and the solvent distance goes underneath.', 'rfval-divide'),
    f('Round to 2 significant figures', 'The Rf value is 0.76 to 2 significant figures.', 'two significant figures', 'Give the answer to 2 significant figures. Start at the first digit that is not zero and keep two digits. The next digit is 0, so the 6 stays as it is: 0.7604… becomes 0.76. So the Rf value of this spot is 0.76, with no units.', 'rfval-round'),
  ],
  'C43-08': [
    f('Use a reference', 'To check for a substance, run a pure sample of it, called a reference, next to the mixture on the same paper.', 'pure sample beside the mixture', 'Chromatography can show whether a mixture contains a certain substance. Run a pure sample of that substance next to the mixture. The pure sample is called a reference. Both are on the same paper and use the same solvent.', 'rfval-reference'),
    f('Compare the spots', 'If a reference spot has the same Rf value as a spot in the mixture, that substance could be in the mixture.', 'same distance, same Rf', 'Look across the paper. If a reference spot has moved the same distance as a spot from the mixture, they have the same Rf value. So that substance could be in the mixture.', 'rfval-compare'),
    f('Reading a whole chromatogram', 'Reference A and reference C match spots in the mixture. Reference B matches none, so it is probably not in the mixture.', 'match each reference in turn', 'In this picture, reference A and reference C each match a spot in the mixture. Reference B does not match any spot. So the mixture possibly contains substances A and C, but probably not B.', 'rfval-read'),
    f('Check with a different solvent', 'Rf values change with the solvent. If the values match in a second solvent as well, the substances are likely to be the same.', 'repeat with another solvent', 'The Rf value of a substance changes if you change the solvent. Two different substances might match in one solvent by chance. So repeat with a different solvent. If they match again, it is likely that they are the same substance.', 'rfval-solvent'),
  ],
}
