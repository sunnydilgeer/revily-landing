import type { TeachingFrame } from '../../teachingFrame'

// How paper chromatography works (mobile and stationary phase, distribution) and how to read a chromatogram.
// The set-up method was taught in the earlier chromatography lesson; here it is recalled in one clause. Rf values come next lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const chromaFrames: Record<string, TeachingFrame[]> = {
  'C42-02': [
    f('What it is for', 'Chromatography separates the substances in a mixture. It can then be used to identify them.', 'separate, then identify', 'You have already met paper chromatography and how to set it up. Now you can see how it works. It separates the substances in a mixture, and the results can be used to identify them.', 'chroma-purpose'),
    f('Two phases', 'Chromatography has two phases: a mobile phase and a stationary phase.', 'one moves, one does not', 'Every type of chromatography has two phases. The word phase just means a part of the system. The two phases are called the mobile phase and the stationary phase.', 'chroma-phases'),
    f('The mobile phase', 'The mobile phase is where molecules can move. In paper chromatography it is the solvent, such as water or ethanol.', 'mobile = can move', 'Mobile means able to move. The mobile phase is where the molecules can move. In paper chromatography this is the solvent, for example water or ethanol.', 'chroma-mobile'),
    f('The stationary phase', 'The stationary phase is where molecules cannot move. In paper chromatography it is the paper.', 'stationary = stuck', 'Stationary means not moving. The stationary phase is where the molecules cannot move. In paper chromatography this is the paper itself.', 'chroma-stationary'),
  ],
  'C42-05': [
    f('The solvent carries them', 'The solvent moves up the paper and carries the substances of the mixture with it.', 'solvent rises, substances travel', 'The solvent soaks up the paper. As it moves, it carries the substances in the mixture with it. They move up the paper, but not all at the same speed.', 'chroma-carry'),
    f('Time dissolved', 'The amount of time a chemical spends dissolved in the solvent, not stuck on the paper, is called its distribution.', 'dissolved or stuck', 'A chemical is sometimes dissolved in the solvent and sometimes stuck on the paper. The amount of time it spends dissolved is called its distribution. Only dissolved chemicals are carried upwards.', 'chroma-distribution'),
    f('More soluble, further up', 'The more soluble a chemical is in the solvent, the more time it spends dissolved and the further it moves up the paper.', 'soluble means further', 'The more soluble a chemical is in the solvent, the more time it spends dissolved. It is carried upwards for longer. So it ends up further up the paper.', 'chroma-soluble'),
    f('Different chemicals, different distances', 'Different chemicals spend different amounts of time dissolved, so they move different distances.', 'different times, different distances', 'Different chemicals are dissolved for different amounts of time. So different chemicals move different distances up the paper.', 'chroma-different'),
    f('They separate into spots', 'Because they move different distances, the chemicals separate into different spots.', 'each chemical, its own spot', 'A chemical that travels a different distance ends up in a different place. So the chemicals in the mixture separate into different spots. You cannot see this movement, but the spots show what happened.', 'chroma-spots'),
  ],
  'C42-09': [
    f('The solvent front', 'The solvent front is the furthest point the solvent reaches up the paper.', 'the top of the wet paper', 'The result of chromatography is called a chromatogram. On it, the solvent front is the furthest point the solvent reached. You mark it with a pencil line when the paper comes out.', 'chroma-front'),
    f('Spots show chemicals', 'Chemicals move different distances, so different spots show different chemicals.', 'spot = chemical', 'Different chemicals move different distances up the paper. So on a chromatogram, different spots show different chemicals.', 'chroma-gram'),
    f('Counting the spots', 'The number of spots is the smallest possible number of chemicals in the mixture.', 'at least this many', 'Count the spots. There cannot be fewer chemicals than spots. So the number of spots is the smallest number of chemicals the mixture could contain.', 'chroma-count'),
    f('Sometimes they overlap', 'Two chemicals that travel the same distance make only one spot between them.', 'same distance, one spot', 'Sometimes two different chemicals travel the same distance up the paper. They then form only one spot between them. That is why the number of spots is only a minimum.', 'chroma-overlap'),
    f('Try another solvent', 'A different solvent gives a different chromatogram, with spots in different places and possibly a different number.', 'solvent changes result', 'If you repeat the experiment with a different solvent, you get a different chromatogram. The spots may be at different heights. There may even be a different number of spots.', 'chroma-solvents'),
    f('One spot in every solvent', 'A substance that gives one spot in lots of different solvents probably contains just one chemical, so it is likely to be pure.', 'always one spot', 'Suppose a substance gives only one spot with lots of different solvents. Then it probably contains only one chemical. That means the substance is likely to be pure.', 'chroma-pure'),
  ],
}
