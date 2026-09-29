import type { TeachingFrame } from '../../teachingFrame'

// The four gas tests, taught in two pairs (paper and liquid tests, then splint tests), then put together in a table.
// Chlorine is toxic: the frames say it is only made or tested by a teacher.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const gasTestFrames: Record<string, TeachingFrame[]> = {
  'C44-02': [
    f('Testing for chlorine', 'Chlorine bleaches damp litmus paper and turns it white.', 'damp litmus paper goes white', 'To test for chlorine, hold a piece of damp litmus paper in the gas. Chlorine bleaches the paper. That means it turns white. Chlorine is poisonous, so only a teacher should make or test it.', 'gastest-chlorine'),
    f('Testing for carbon dioxide', 'Bubble the gas through limewater, or shake the gas with it. Limewater is a solution of calcium hydroxide.', 'limewater is the test liquid', 'Carbon dioxide is tested with limewater. Limewater is a clear solution of calcium hydroxide in water. Bubble the gas through it, or shake the gas with it in a tube.', 'gastest-co2-setup'),
    f('Limewater goes cloudy', 'If the gas is carbon dioxide, the limewater turns cloudy.', 'clear to cloudy', 'If the gas is carbon dioxide, the limewater turns cloudy. It changes from clear to cloudy. If the limewater stays clear, the gas is not carbon dioxide.', 'gastest-co2-result'),
    f('Paper and liquid tests', 'Chlorine: damp litmus paper turns white. Carbon dioxide: limewater turns cloudy.', 'gas, test, result', 'Here are the first two tests side by side. Each has a test, and a result that tells you the gas. Chlorine turns damp litmus paper white. Carbon dioxide turns limewater cloudy.', 'gastest-pair-a'),
  ],
  'C44-05': [
    f('Testing for oxygen', 'A glowing splint relights in oxygen.', 'glowing splint bursts back into flame', 'To test for oxygen, blow out a burning splint so it is still glowing. Put the glowing splint inside the tube of gas. If the gas is oxygen, the splint relights.', 'gastest-oxygen'),
    f('Testing for hydrogen', 'A lit splint held at the open end of a tube of hydrogen makes a squeaky pop.', 'lit splint, squeaky pop', 'To test for hydrogen, hold a lit splint at the open end of the test tube. If the gas is hydrogen, you hear a squeaky pop. The hydrogen burns very quickly with oxygen from the air.', 'gastest-hydrogen'),
    f('Two splints, two results', 'Glowing splint relights: oxygen. Lit splint squeaky pop: hydrogen. Do not mix them up.', 'glowing or lit, relight or pop', 'Both tests use a wooden splint, so take care. A glowing splint has no flame and it relights in oxygen. A lit splint has a flame and it makes a squeaky pop with hydrogen.', 'gastest-pair-b'),
  ],
  'C44-08': [
    f('All four tests together', 'A table of the four gases, the test for each and the result.', 'gas, test, result', 'The four tests are worth learning as a set. Chlorine: damp litmus paper turns white. Oxygen: glowing splint relights. Carbon dioxide: limewater turns cloudy. Hydrogen: lit splint gives a squeaky pop.', 'gastest-summary'),
    f('Working backwards', 'You can also go from a result to a gas. Cloudy limewater means carbon dioxide. A pop means hydrogen.', 'result tells you the gas', 'Often you are told what was seen and asked to name the gas. A relighting splint means oxygen. Bleached litmus paper means chlorine. Cloudy limewater means carbon dioxide. A squeaky pop means hydrogen.', 'gastest-backwards'),
    f('Writing up a test', 'A good answer names the test, then the result, then the gas.', 'test, observation, conclusion', 'A full answer has three parts. First say what you did, for example bubbled the gas through limewater. Then say what you saw, which was that it turned cloudy. Then say what this shows, which is that the gas is carbon dioxide.', 'gastest-report'),
  ],
}
