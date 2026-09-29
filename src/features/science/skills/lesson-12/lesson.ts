import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsEvalFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 3.4 (uncertainty), WS 3.7 (evaluating methods and data), WS 3.8 (improving investigations), as on the supplied revision page' }
const skill = 'W-DAT-012-W'
const a = author(skill, ['WS 3.4', 'WS 3.7', 'WS 3.8'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsEvalSections = [
  { id: 'W12-01', label: 'Start here', detail: 'Are two readings ever the same?' },
  { id: 'W12-02', label: 'What is uncertainty?', detail: 'Range ÷ 2 and the ± symbol' },
  { id: 'W12-05', label: 'How good are the results?', detail: 'Accurate, precise and anomalous' },
  { id: 'W12-08', label: 'How do you evaluate an investigation?', detail: 'Method, confidence and improvements' },
  { id: 'W12-11', label: 'On your own', detail: 'Uncertainty and evaluation' },
]

const states: ScienceState[] = [
  { ...a.choice('W12-01', 'You time a falling ball three times with a stopwatch. The times are 1.2 s, 1.3 s and 1.2 s. Why do they differ?', ['The ball changed its mass', 'Measurements always have a little uncertainty', 'The stopwatch is broken', 'Gravity changed'], 1, 'Think about reaction time when you press the button.', ['Small random errors, such as when you press the button, make repeat readings differ a little.', 'The amount of error your measurements might have is called uncertainty.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W12-02', 'What is uncertainty?'),
  a.choice('W12-03', 'Three temperature readings are 18.6, 18.0 and 18.3 °C. The mean is 18.3 °C. What is the uncertainty of the mean?', ['± 0.6 °C', '± 0.15 °C', '± 0.3 °C', '± 18.3 °C'], 2, 'Find the range first, then halve it.', ['Range = 18.6 − 18.0 = 0.6 °C.', 'Uncertainty = 0.6 ÷ 2 = 0.3 °C, so the mean is 18.3 ± 0.3 °C.'], 'calculation'),
  a.choice('W12-04', 'Two students time the same trolley. Student X’s repeats are close together. Student Y’s are spread out. Whose mean has the higher uncertainty?', ['Student Y, whose results are less precise', 'Student X, whose results are close together', 'They are the same', 'Neither has any uncertainty'], 0, 'The less precise the results, the higher the uncertainty.', ['Spread-out results have a bigger range, so the uncertainty is higher.', 'Student Y’s results are less precise than Student X’s.'], 'understanding'),
  t('W12-05', 'How good are the results?'),
  a.choice('W12-06', 'Three readings of a boiling point are 96.1, 96.0 and 96.2 °C. The true value is 100 °C. What can you say?', ['Accurate but not precise', 'Both accurate and precise', 'Neither accurate nor precise', 'Precise, but not accurate'], 3, 'Are they close together? Are they close to 100 °C?', ['The readings are close together, so they are precise.', 'They are not close to 100 °C, so they are not accurate.'], 'dataInterpretation'),
  a.choice('W12-07', 'Four timings in seconds are 2.1, 2.2, 3.9 and 2.0. What should you do about the 3.9 s?', ['Delete it and say nothing', 'Treat it as anomalous and look for a cause, such as a timing slip', 'Use it, as all results are equally good', 'Double all the other results'], 1, 'One result does not fit the pattern.', ['A result that does not fit the pattern is anomalous.', 'You should say so and try to explain it, for example by a timing error.'], 'dataInterpretation'),
  t('W12-08', 'How do you evaluate an investigation?'),
  a.choice('W12-09', 'A reaction was fastest at 1.0 mol/dm³ out of 0.5, 1.0 and 1.5. How could you find the best concentration more accurately?', ['Only test 1.0 mol/dm³ again', 'Use a bigger flask', 'Take readings at narrower intervals around 1.0 mol/dm³', 'Test a concentration of 5.0 mol/dm³'], 2, 'Look closer to where the best result was found.', ['Readings close to 1.0, such as 0.8 to 1.2 mol/dm³, show where the best value really lies.', 'This gives a more accurate result.']),
  a.choice('W12-10', 'Which of these belongs in an evaluation?', ['Whether the method was valid and how good the results were', 'A new hypothesis with no link to the data', 'A list of the equipment only', 'The date of the experiment'], 0, 'An evaluation looks back over the whole investigation.', ['An evaluation comments on the method and the quality of the results.', 'It also says how confident you are and how to improve.']),
  a.choice('W12-11', 'Three readings of gas volume are 48, 52 and 50 cm³. The mean is 50 cm³. What is the uncertainty of the mean?', ['± 4 cm³', '± 2 cm³', '± 1 cm³', '± 8 cm³'], 1, 'Find the range first, then halve it.', ['Range = 52 − 48 = 4 cm³.', 'Uncertainty = 4 ÷ 2 = 2 cm³, so the mean is 50 ± 2 cm³.'], 'calculation', true),
  a.choice('W12-12', 'Both groups have a mean time of 3.1 s. Which mean has the greater uncertainty?', ['Group A, because its range is larger', 'Group B, because its range is larger', 'They are the same', 'Group A, because its readings are higher'], 1, 'Find the range of each group.', ['Group A range = 3.2 − 3.0 = 0.2 s, so the uncertainty is 0.1 s.', 'Group B range = 3.6 − 2.6 = 1.0 s, so the uncertainty is 0.5 s.'], 'calculation', true, 'wseval-q-table'),
  a.choice('W12-13', 'A student took only one reading at each temperature. What is the problem?', ['There is no way to check repeatability or spot an anomalous result', 'The temperature changed too little', 'The readings are too accurate', 'One reading is always enough'], 0, 'Think about what repeats let you do.', ['With one reading you cannot see whether the result repeats.', 'You also cannot tell if a result is anomalous.'], 'application', true),
  a.choice('W12-14', 'Which is the best evaluation comment?', ['It went well.', 'The results were bad because I am not good at science.', 'Repeats were close together, so uncertainty was small, but only three temperatures were tested, so I am not fully confident.', 'Everything was perfect.'], 2, 'A good evaluation gives reasons and says how confident you are.', ['This comment refers to the results, the uncertainty and the method.', 'It also says how confident the student is and why.'], 'application', true),
  a.written('W12-15', 'A student tests plants at 10, 20 and 30 °C, with one plant per temperature. The tallest grew at 20 °C. Evaluate this and suggest two improvements.', 'Comment on the number of repeats, the intervals and the fair test.', 'There is only one plant at each temperature, so the results cannot be checked for repeatability or anomalous results. Two improvements are to use several plants at each temperature and take a mean, and to test more temperatures close to 20 °C, such as 16, 18, 20, 22 and 24 °C. I should also keep light and water the same. I am not very confident that 20 °C is best.', ['Says one plant per temperature is not enough, or cannot check for anomalous results.', 'Suggests repeating with more plants and using the mean.', 'Suggests more temperatures around 20 °C, or narrower intervals.', 'Says how confident they are in the conclusion, or mentions controlling other variables.'], ['Only saying the experiment was fine.', 'Suggesting a change that does not affect the quality, such as a new pot colour.', 'Changing the independent variable to something else.']),
]

export const lessonW12: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Uncertainty and evaluations', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
