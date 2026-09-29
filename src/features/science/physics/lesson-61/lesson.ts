import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { irAbsorbFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.2 Uses and applications of electromagnetic waves, investigating infrared absorption (melting wax method, black surfaces good absorbers), as on the supplied revision page' }
const skill = 'P-WAV-061-P'
const idea = author(skill, ['6.6.2.2'], ['aqa-physics'])
const method = author(skill, ['6.6.2.2'], ['aqa-physics'])
const result = author(skill, ['6.6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const irAbsorbSections = [
  { id: 'P61-01', label: 'Start here', detail: 'Cars in the sun' },
  { id: 'P61-02', label: 'What are we testing?', detail: 'Absorption and the melting wax set-up' },
  { id: 'P61-05', label: 'How do you run it?', detail: 'Wax, plates and a fair test' },
  { id: 'P61-08', label: 'What do the results show?', detail: 'Black surfaces absorb best' },
  { id: 'P61-11', label: 'On your own', detail: 'The set-up, fairness and everyday uses' },
]

const states: ScienceState[] = [
  { ...idea.choice('P61-01', 'A black car and a white car are parked side by side in strong sunshine. Which is likely to get hotter?', ['The white car', 'The black car', 'Both stay exactly the same', 'Neither gets warmer'], 1, 'Think about which colour of clothing feels warmer on a sunny day.', ['A black surface absorbs more radiation than a white one, so the black car warms up more.', 'You will test this idea with melting wax.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P61-02', 'What are we testing?'),
  idea.choice('P61-03', 'In the melting wax experiment, which item gives out the infrared radiation?', ['The metal ball', 'The candle wax', 'The Bunsen burner flame', 'The heat-proof mat'], 2, 'It is the hottest thing in the set-up.', ['The hot flame of the Bunsen burner gives out infrared radiation.', 'The plates absorb it.'], 'practicalReasoning'),
  idea.choice('P61-04', 'The two metal plates should be identical except for one thing. What is it?', ['The colour of their back surface', 'Their mass', 'Their distance from the flame', 'The amount of wax'], 0, 'Only the thing you are testing should change.', ['The plates differ only in the colour of their back surface, black or white.', 'Everything else is kept the same so the test is fair.'], 'practicalReasoning'),
  t(method, 'P61-05', 'How do you run it?'),
  method.choice('P61-06', 'Why do you leave the wax to cool before lighting the burner?', ['So the wax turns black', 'So it hardens and holds each ball in place', 'So the plates get colder', 'So the ball becomes lighter'], 1, 'The wax is what holds the ball on the plate.', ['Hard wax holds each ball firmly on its plate.', 'The balls should only fall once the wax melts, not before.'], 'practicalReasoning'),
  method.choice('P61-07', 'Why are the plates placed the same distance from the flame?', ['So both balls fall at the same time', 'So the flame stays lit', 'So the wax stays hard', 'So the test is fair'], 3, 'A closer plate would receive more infrared radiation.', ['If one plate was closer, it would receive more radiation for a reason that is not its surface.', 'Keeping the distance the same makes it a fair test.'], 'practicalReasoning'),
  t(result, 'P61-08', 'What do the results show?'),
  result.choice('P61-09', 'Which ball should fall off first?', ['The ball on the black plate', 'The ball on the white plate', 'Both at exactly the same time', 'Neither ball falls'], 0, 'The plate that absorbs more infrared radiation heats the wax faster.', ['The black plate absorbs more infrared radiation, so its wax melts first.', 'That ball falls first.'], 'dataInterpretation'),
  result.choice('P61-10', 'What does it show if the ball on the black plate falls first?', ['White surfaces are better absorbers', 'Black surfaces are worse emitters', 'Black surfaces are better absorbers of infrared radiation', 'The wax is hotter on the white plate'], 2, 'Faster melting means more energy absorbed.', ['The wax on the black plate melted first because that plate absorbed infrared radiation faster.', 'So black is the better absorber.'], 'dataInterpretation'),
  method.choice('P61-11', 'Which numbered part of the set-up is the source of infrared radiation?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'It is the hot flame in the middle.', ['Part 3 is the Bunsen burner flame, which gives out infrared radiation.', 'The plates on either side absorb it.'], 'practicalReasoning', true, 'irabsorb-q-setup'),
  method.choice('P61-12', 'Which change would make the test unfair?', ['Using plates of the same size', 'Sticking on balls with the same amount of wax', 'Facing both backs towards the flame', 'Putting one plate nearer the flame than the other'], 3, 'Look for the change that alters something other than the surface.', ['Putting one plate nearer the flame changes the amount of radiation it receives.', 'Then you could not tell whether the surface or the distance made the difference.'], 'practicalReasoning', true),
  result.choice('P61-13', 'A solar panel heats water. Why is its surface often painted matt black?', ['Black reflects infrared radiation best', 'Black is a good absorber of infrared radiation', 'Black keeps the water cool', 'Black makes the panel lighter'], 1, 'The panel needs to take in as much radiation from the Sun as it can.', ['A matt black surface is a good absorber of infrared radiation.', 'More energy is absorbed from the Sun to warm the water.'], 'understanding', true),
  idea.written('P61-14', 'Describe how you would show that a black surface absorbs infrared radiation better than a white one. Say how you make it a fair test.', 'Cover the set-up, what you observe and what keeps it fair.', 'Use two identical metal plates, one with a black back and one with a white back. Stick a metal ball to the front of each with candle wax and let the wax harden. Place the plates the same distance from a Bunsen burner with the backs facing the flame. Record which ball falls first. The ball on the black plate falls first because black is the better absorber. Keep the plates identical, the wax the same and the distance the same.', ['Two identical plates with different back surfaces, black and white.', 'A ball stuck to each with wax, which is left to harden.', 'Backs face the Bunsen burner flame.', 'Record which ball falls first.', 'The black plate absorbs better, so its ball falls first.', 'At least one fair test point, such as the same distance from the flame.'], ['Saying the online lesson has completed the practical.', 'Saying the white surface absorbs better.', 'Using different distances from the flame.']),
]

export const lessonP61: ScienceLesson = {
  id: 'P-WAV-061-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating infrared absorption', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
