import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const enzymeFrames: Record<string, TeachingFrame[]> = {
  'B8-02': [
    f('Meet enzymes', 'Enzymes speed up reactions in living organisms.', 'reaction + catalyst', 'Cells carry out many chemical reactions. An enzyme is a large protein that acts as a biological catalyst. A catalyst increases reaction rate without being used up by the reaction.', 'enzyme-catalyst'),
    f('Enzymes are not reactants', 'An enzyme can be used again.', 'unchanged after the reaction', 'A substrate is the substance an enzyme acts on. Products leave after the reaction, but the enzyme remains chemically unchanged and can catalyse another reaction.', 'enzyme-cycle'),
  ],
  'B8-04': [
    f('The active site', 'A substrate binds to a specially shaped part of the enzyme.', 'shape and fit', 'The active site is a region on the enzyme with a particular shape. A substrate with a matching shape can bind there. This is the simplified lock-and-key model.', 'enzyme-fit'),
    f('Specific reactions', 'Different active sites fit different substrates.', 'one shape does not fit every substrate', 'An enzyme usually catalyses one type of reaction because its active site only fits particular substrate molecules. The model explains specificity, but real enzymes are flexible molecules rather than rigid locks.', 'enzyme-specific'),
    f('Products leave', 'The reaction changes the substrate, not the enzyme.', 'substrate → products', 'While the substrate is in the active site, bonds can break or form. Products have different shapes and leave. The active site is available again.', 'enzyme-products'),
  ],
  'B8-07': [
    f('Low temperature', 'Particles move more slowly, so successful collisions happen less often.', 'movement and collision rate', 'At a low temperature an enzyme is not normally denatured. The reaction is slower because enzyme and substrate particles move more slowly and meet less often.', 'enzyme-temperature'),
    f('Optimum temperature', 'Reaction rate reaches a highest point.', 'fastest conditions', 'As temperature rises, particles move faster and collide more often. Rate increases until the enzyme reaches its optimum temperature: the temperature where it works fastest.', 'enzyme-temperature'),
    f('Too hot', 'High temperature can change the active site.', 'shape change → substrate no longer fits', 'Too much heat can break bonds that hold the enzyme’s shape. The active site changes, so the substrate no longer fits. The enzyme is denatured and the rate falls quickly.', 'enzyme-temperature'),
  ],
  'B8-09': [
    f('Every enzyme has an optimum pH', 'An enzyme works fastest in a particular pH range.', 'pH compared with optimum', 'pH describes how acidic or alkaline a solution is. Different enzymes have different optimum pH values, so there is no single best pH for every enzyme.', 'enzyme-ph'),
    f('Far from the optimum', 'Very high or low pH can change the active site.', 'bonds, shape and fit', 'A pH far from the optimum can disrupt bonds that hold the enzyme’s shape. If the active site changes, the substrate fits less well or not at all. The enzyme can become denatured.', 'enzyme-ph'),
  ],
  'B8-11': [
    f('The question', 'Test how pH affects the rate at which amylase breaks down starch.', 'change pH, measure time', 'Use several buffer solutions to set different pH values. Amylase is the enzyme and starch is its substrate. Measure how long starch takes to disappear at each pH.', 'enzyme-practical-setup'),
    f('Keep temperature controlled', 'Use a water bath or electric heater to keep temperature constant.', 'one changed variable', 'Temperature also affects enzymes, so it must stay the same. Keep the amylase and starch concentrations and volumes the same too. The real investigation needs teacher supervision and a risk assessment.', 'enzyme-practical-bath'),
    f('Sample every 30 seconds', 'Use iodine to check whether starch remains.', 'continuous sampling', 'Place iodine in a spotting tile. Every 30 seconds, transfer a fresh drop of the reaction mixture to the next iodine well. Blue-black means starch remains. Brown-orange means no starch is detected in that sample.', 'enzyme-practical-tile'),
    f('Find the end point', 'Record the first sample that stays brown-orange.', 'shorter time → faster reaction', 'Stop when iodine stays brown-orange. Record the time. Repeat at each pH and repeat trials so a mean can be calculated. A shorter completion time means a faster reaction.', 'enzyme-practical-endpoint'),
  ],
  'B8-18': [
    f('Read completion times', 'A shorter time means starch was broken down faster.', 'time compared with rate', 'Compare trials only when temperature, volumes and concentrations were controlled. The shortest completion time identifies the fastest measured reaction.', 'enzyme-results'),
    f('Find the measured optimum', 'The tested pH with the greatest rate is closest to the optimum.', 'highest rate in the tested range', 'A graph can show the pattern across pH values. The highest measured point suggests the optimum, but more pH values near the peak would give a more precise estimate.', 'enzyme-results'),
  ],
}
