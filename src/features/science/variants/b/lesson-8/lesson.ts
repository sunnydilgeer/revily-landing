import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { enzymeFrames as frames } from './teachingFrames'

const biology = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.1 Enzymes and the digestive system' }
const practical = { id: 'aqa-practical', title: 'AQA 8464 practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.4 Required practical 4; Biology AT1, AT2 and AT5' }
const handbook = { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Teacher notes pp14–15; student worksheet pp66–68; school risk assessment governs the practical' }
const a = author('B-ENZYMES', ['4.2.2.1'])
const p = author('B-ENZYME-PRACTICAL', ['4.2.2.1', '10.2.4'], ['aqa-biology', 'aqa-practical', 'aqa-handbook'])
const t = (id: keyof typeof frames, title: string) => (Number(id.slice(3)) >= 11 ? p : a).teach(id, title, frames[id])

export const enzymeSections = [
  { id: 'B8-01', label: 'Start here', detail: 'Chemical reactions in living things' },
  { id: 'B8-02', label: 'Enzymes are catalysts', detail: 'Speeding reactions without being used up' },
  { id: 'B8-04', label: 'Active sites', detail: 'The simplified lock-and-key model' },
  { id: 'B8-07', label: 'Temperature', detail: 'Optimum conditions and denaturation' },
  { id: 'B8-09', label: 'pH', detail: 'How pH changes enzyme activity' },
  { id: 'B8-11', label: 'Required practical 4', detail: 'Amylase, pH and continuous sampling' },
  { id: 'B8-16', label: 'Rates and results', detail: 'Calculate and interpret reaction rate' },
  { id: 'B8-19', label: 'Apply it independently', detail: 'Method, data and explanation' },
]

const states: ScienceState[] = [
  { ...a.choice('B8-01', 'A reaction in a cell happens too slowly to support life. What can an enzyme do?', ['Speed up the reaction', 'Turn the cell into an organ', 'Increase every molecule’s size'], 0, 'Enzymes affect reaction rate.', ['Enzymes are biological catalysts.', 'They increase the rate of reactions in living organisms.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B8-02', 'Enzymes and catalysts'),
  a.choice('B8-03', 'Which statement describes a catalyst?', ['It increases reaction rate without being used up', 'It is always a product of the reaction', 'It makes every reaction stop'], 0, 'Ask what happens to the catalyst after the reaction.', ['A catalyst increases reaction rate.', 'It remains chemically unchanged and can be used again.']),
  t('B8-04', 'Active sites and substrates'),
  a.choice('B8-05', 'Why does one enzyme usually act on only certain substrates?', ['Its active site has a shape that fits particular substrates', 'Every substrate is the same shape', 'The enzyme is used up after one reaction'], 0, 'Use the simplified lock-and-key model.', ['The active site has a particular shape.', 'Only suitable substrates bind well enough for the reaction.'], 'understanding', false, 'enzyme-match'),
  a.choice('B8-06', 'What happens to the enzyme after products leave its active site?', ['It is normally unchanged and can work again', 'It becomes one of the products', 'It always breaks into amino acids'], 0, 'A catalyst is not used up.', ['Products leave the active site.', 'The enzyme remains available to catalyse another reaction.']),
  t('B8-07', 'Temperature and enzyme activity'),
  a.choice('B8-08', 'A reaction is slow at 10 °C, fastest at 37 °C and almost stops at 70 °C. What is the best explanation?', ['Low temperature slows collisions; high temperature can denature the enzyme', 'The enzyme is denatured at every low temperature', 'Higher temperature always makes enzymes faster'], 0, 'Separate low-temperature slowing from high-temperature denaturation.', ['Low temperature reduces particle movement and collision frequency.', 'High temperature can change the active site and denature the enzyme.'], 'dataInterpretation'),
  t('B8-09', 'pH and enzyme activity'),
  a.choice('B8-10', 'Why can a pH far from an enzyme’s optimum reduce reaction rate?', ['It can change the active site so the substrate fits less well', 'It turns every substrate into an enzyme', 'It guarantees more successful collisions'], 0, 'Link pH to active-site shape.', ['Extreme pH can disrupt bonds holding the enzyme’s shape.', 'A changed active site binds the substrate less effectively.']),
  t('B8-11', 'Required practical 4 preparation'),
  p.choice('B8-12', 'What is the independent variable in this investigation?', ['The pH set by the buffer', 'The time until starch is no longer detected', 'The colour of unused iodine'], 0, 'Which factor is deliberately changed?', ['The investigation changes pH.', 'Time to the end point is the measured dependent variable.'], 'practicalReasoning'),
  p.choice('B8-13', 'A sample turns iodine blue-black. What does this show?', ['Starch is still present', 'All starch has been broken down', 'The enzyme has become a tissue'], 0, 'Recall the positive iodine result for starch.', ['Iodine becomes blue-black when starch is present.', 'Continue sampling until a drop stays brown-orange.'], 'practicalReasoning'),
  p.choice('B8-14', 'Why must the water bath temperature stay the same for every pH?', ['Temperature also affects enzyme rate', 'pH cannot be changed in warm water', 'The stopclock only works at one temperature'], 0, 'Only pH should be the deliberate difference.', ['Temperature is another factor that affects enzymes.', 'Keeping it constant makes the pH comparison fair.'], 'practicalReasoning'),
  p.choice('B8-15', 'Why repeat each pH and calculate a mean time?', ['To reduce the effect of random variation', 'To change the independent variable', 'To prove every result is exact'], 0, 'Think about reliability, not certainty.', ['Repeated measurements show how consistent the result is.', 'A mean reduces the influence of random variation.'], 'practicalReasoning'),
  p.worked('B8-16', 'Calculate a scaled reaction rate', 'A question gives rate = 1000 ÷ time. A reaction reaches its end point in 125 seconds.', ['Use the supplied formula: rate = 1000 ÷ time.', 'Substitute the time in seconds: 1000 ÷ 125.', 'The scaled rate is 8.0 s⁻¹. This number can be compared with rates calculated using the same formula.'], 'enzyme-rate'),
  p.choice('B8-17', 'Using rate = 1000 ÷ time, what is the rate for an 80-second reaction?', ['12.5 s⁻¹', '0.08 s⁻¹', '1080 s⁻¹'], 0, 'Divide 1000 by the time in seconds.', ['1000 ÷ 80 = 12.5.', 'A shorter time produces a larger rate using this formula.'], 'calculation', true, 'enzyme-rate'),
  t('B8-18', 'Read the pattern in the results'),
  p.choice('B8-19', 'Original results show completion times of 210 s at pH 3, 120 s at pH 5, 60 s at pH 7 and 170 s at pH 9. Which tested pH gave the fastest reaction?', ['pH 3', 'pH 7', 'pH 9'], 1, 'The fastest reaction finishes in the shortest time.', ['The shortest recorded time is 60 seconds.', 'That result occurred at pH 7.'], 'dataInterpretation', true, 'enzyme-results-question'),
  p.choice('B8-20', 'Which method best tests the effect of pH on amylase?', ['Change pH, keep temperature and volumes constant, sample into iodine every 30 seconds', 'Change pH and temperature together, then look once', 'Use a different enzyme and starch concentration at every pH'], 0, 'Only one factor should be deliberately changed.', ['Buffer solution sets the pH.', 'Control temperature, concentrations and volumes; use regular iodine samples to find the end point.'], 'practicalReasoning', true),
  p.written('B8-21', 'Explain how the amylase investigation finds the effect of pH on reaction rate.', 'Include the changed variable, the end point, one control and how rate is compared.', 'Use buffer solutions to change pH while keeping temperature and solution amounts constant. Mix amylase with starch, then sample into iodine every 30 seconds. Record when iodine first stays brown-orange, showing that starch is no longer detected. Shorter times or larger calculated rates mean faster reactions.', ['Change pH using buffer solutions.', 'Use iodine samples at regular 30-second intervals to identify the end point.', 'Keep a relevant variable constant, such as temperature, volume or concentration.', 'Compare completion times or rates correctly.'], ['Change temperature and pH together.', 'Blue-black is treated as the no-starch end point.', 'Carry out the chemical investigation unsupervised at home.', 'A longer completion time is claimed to mean a faster reaction.']),
]

export const lesson8: ScienceLesson = {
  id: 'B-ORG-008-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Enzymes and reaction rates', prerequisites: ['B-ORGANISATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biology, practical, handbook], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
