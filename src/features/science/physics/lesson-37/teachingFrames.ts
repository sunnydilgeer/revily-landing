import type { TeachingFrame } from '../../teachingFrame'

// Irradiation and contamination: exposure from outside, radioactive atoms on or in an object, and how dangerous alpha, beta and gamma are in each case.
// Property values come from the previous radiation lesson; peer review is one clause.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const irradiationFrames: Record<string, TeachingFrame[]> = {
  'P37-02': [
    f('Being exposed', 'Irradiation means an object near a radioactive source is exposed to its radiation.', 'source outside, object exposed', 'An object near a radioactive source is exposed to the radiation from it. This exposure is called irradiation. The source stays outside the object.', 'irrad-exposed'),
    f('Distance matters', 'The further you are from a source, the less radiation reaches you.', 'far away, less reaches you', 'The further you are from a source, the less radiation reaches you. If you are far enough away, none reaches you. Radiation that is blocked by something cannot reach you either. Then you are not irradiated.', 'irrad-distance'),
    f('Not made radioactive', 'Being irradiated does not make an object radioactive.', 'exposed, not changed', 'Irradiating something does not make it radioactive. The object only receives radiation. It does not give any out afterwards. Ionising radiation can still damage living cells, so we need to be careful.', 'irrad-notradioactive'),
    f('Staying safe from irradiation', 'Store sources in lead-lined boxes, use barriers, and keep them far away.', 'block it, or keep away', 'To stop irradiation, keep radioactive sources in lead-lined boxes when they are not in use. Stand behind barriers that absorb radiation when using a source. Hold the source as far away as you can, for example at arm\'s length.', 'irrad-protect'),
  ],
  'P37-05': [
    f('Atoms on or in an object', 'Contamination is when unwanted radioactive atoms get onto or into an object.', 'atoms end up on or in it', 'Sometimes radioactive atoms get onto or into an object, and they are not wanted there. Then the object is contaminated. The radioactive atoms themselves have moved onto it.', 'irrad-contaminated'),
    f('They keep decaying', 'The contaminating atoms decay and release radiation which could harm you.', 'atoms stay, radiation keeps coming', 'The contaminating atoms stay where they are and keep decaying. Each decay releases radiation. This radiation could harm you. Washing them away is not always easy.', 'irrad-decay'),
    f('Why contamination is worse', 'Contamination is especially dangerous because radioactive material could get inside your body.', 'inside the body', 'Contamination is especially dangerous. Radioactive material could get inside your body, for example by breathing it in or swallowing it. Then you cannot move away from the source.', 'irrad-inside'),
    f('Staying safe from contamination', 'Use gloves and tongs, and wear protective suits and face masks.', 'keep atoms off skin and out of lungs', 'Use gloves and tongs when handling radioactive sources. This stops radioactive material sticking to your skin or getting under your nails. People whose jobs involve radioactive materials often wear protective suits and face masks. The masks stop them breathing in radioactive dust and gas.', 'irrad-suits'),
  ],
  'P37-08': [
    f('Type of radiation matters', 'How much harm irradiation or contamination does depends on the type of radiation.', 'alpha, beta, gamma', 'Irradiation and contamination can both cause harm. How much harm depends on the type of radiation. We will compare alpha, beta and gamma sources.', 'irrad-compare'),
    f('Irradiation from outside', 'Alpha is least dangerous outside the body, because a small air gap or the skin stops it.', 'outside: can it get in?', 'From outside the body, alpha is the least dangerous. It cannot penetrate the skin and is stopped by a small air gap. Beta and gamma are more dangerous. They can penetrate the body and damage delicate organs.', 'irrad-outside'),
    f('Contamination inside the body', 'Alpha is most dangerous inside the body. Gamma is least dangerous inside.', 'inside: where does the damage go?', 'Inside the body, it is the other way round. Alpha does all its damage in a very small area and is the most strongly ionising. So alpha is the most dangerous. Gamma mostly passes straight out of the body, so it is the least dangerous.', 'irrad-inside-compare'),
    f('Beta in the middle', 'Beta inside the body damages a wider area and is less ionising than alpha.', 'in between', 'Beta is absorbed over a wider area inside the body and is less ionising than alpha. So inside the body, beta is less dangerous than alpha but more dangerous than gamma.', 'irrad-beta'),
    f('The whole picture', 'Outside: alpha least dangerous. Inside: alpha most dangerous. High levels of any radiation are dangerous.', 'compare outside and inside', 'Put it together. Outside the body, alpha is the least dangerous and beta and gamma are more dangerous. Inside the body, alpha is the most dangerous and gamma the least. Research about radiation is published and checked by other scientists. This peer review helps us protect ourselves.', 'irrad-table'),
  ],
}
