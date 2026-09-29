import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { crossFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.6.1.2 Factors which affect the rates of chemical reactions (required practical: how changing concentration affects the rate, measured by the time for a cross to disappear), as on the supplied revision page' }
const skill = 'C-RATE-MEASURE-CROSS'
const method = author(skill, ['5.6.1.2'], ['aqa-chemistry'])
const results = author(skill, ['5.6.1.2'], ['aqa-chemistry'])
const safe = author(skill, ['5.6.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const crossSections = [
  { id: 'C34-01', label: 'Start here', detail: 'Timing a cloudy mixture' },
  { id: 'C34-02', label: 'The disappearing cross', detail: 'A precipitate hides a cross' },
  { id: 'C34-05', label: 'Concentration and time', detail: 'A table of results' },
  { id: 'C34-08', label: 'Fair, safe and reliable', detail: 'Variables, ventilation and judging' },
  { id: 'C34-11', label: 'On your own', detail: 'Apparatus, data and a plan' },
]

const states: ScienceState[] = [
  { ...method.choice('C34-01', 'A clear solution slowly goes cloudy as a reaction makes a solid. How could you time the reaction?', ['Weigh the solution', 'Measure the time until you can no longer see a mark through it', 'Wait until it turns clear again', 'Measure the volume of gas'], 1, 'The cloudier it gets, the harder it is to see through.', ['A solid in the liquid makes it cloudy.', 'You can time how long it takes for a mark under the flask to be hidden.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(method, 'C34-02', 'The disappearing cross'),
  method.choice('C34-03', 'Sodium thiosulfate and hydrochloric acid are both colourless. Why does the mixture go cloudy?', ['It gets colder', 'A solid called a precipitate forms', 'A gas is made', 'The two liquids do not mix'], 1, 'Something yellow forms in the liquid.', ['The reaction makes a yellow solid, sulfur.', 'A solid made in a solution is called a precipitate.'], 'understanding'),
  method.choice('C34-04', 'Why are the results of the disappearing cross method described as subjective?', ['Different people may decide differently when the cross has gone', 'The stopwatch is not accurate', 'The cross is too small', 'The acid is not colourless'], 0, 'It depends on someone’s judgement.', ['Subjective means there is not just one right answer.', 'People may not agree on the exact moment the cross disappears.'], 'understanding'),
  t(results, 'C34-05', 'Concentration and time'),
  results.choice('C34-06', 'In this method, which measurement tells you how fast the reaction was?', ['The colour of the precipitate', 'The volume of the flask', 'The mass of the acid', 'The time for the cross to disappear'], 3, 'What do you time with the stopwatch?', ['You time how long the cross takes to disappear.', 'A shorter time means a faster reaction.'], 'recall'),
  results.choice('C34-07', 'A stronger acid made the cross disappear in less time. What does this show about the reaction?', ['It was slower', 'It made less precipitate', 'It was faster', 'It gave out more energy'], 2, 'Less time to cloud over means the reaction went more quickly.', ['A shorter time for the cross to vanish means a faster reaction.', 'So the higher concentration gave the faster reaction.'], 'dataInterpretation'),
  t(safe, 'C34-08', 'Fair, safe and reliable'),
  safe.choice('C34-09', 'A student changes the acid concentration in the cross experiment. Which should stay the same?', ['The temperature of the solutions', 'The concentration of the acid', 'The time the cross takes', 'The volume of gas produced'], 0, 'Only one thing should change.', ['In a fair test only the concentration changes.', 'The temperature, volumes and flask stay the same.'], 'application'),
  safe.choice('C34-10', 'Why should the cross experiment be done in a well-ventilated place?', ['To make the reaction faster', 'To help the cross to be seen', 'A harmful gas, sulfur dioxide, is also given off', 'The precipitate is poisonous'], 2, 'Think about a gas the reaction releases.', ['The reaction gives off sulfur dioxide.', 'This gas can irritate the lungs, so fresh air is needed.'], 'recall'),
  method.choice('C34-11', 'The diagram shows the experiment. Which numbered part is watched to decide when to stop the timer?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'It is the mark under the flask.', ['Part 3 is the cross under the flask.', 'You stop the timer when you can no longer see it through the liquid.'], 'understanding', true, 'cross-q-set'),
  results.choice('C34-12', 'The table gives the time for a cross to disappear at three acid concentrations. Which statement is supported?', ['The lowest concentration gave the fastest reaction', 'The highest concentration gave the fastest reaction', 'The time did not depend on concentration', 'Every concentration took the same time'], 1, 'Find the shortest time.', ['The highest concentration had the shortest time.', 'A shorter time means a faster reaction.'], 'dataInterpretation', true, 'cross-q-table'),
  safe.choice('C34-13', 'Two students time the same reaction and give times 10 s apart. What is the most likely reason?', ['They disagree slightly on when the cross has gone', 'The acid was different in each', 'The stopwatch does not work', 'The reaction went backwards'], 0, 'Think about how the end point is decided.', ['The end point depends on judgement, so it is subjective.', 'Having the same person judge each time reduces this problem.'], 'application', true),
  method.written('C34-14', 'Describe how you would use the disappearing cross method to compare the rate of reaction at two concentrations of hydrochloric acid.', 'What do you time, what do you change, and what stays the same?', 'Put a set volume of sodium thiosulfate solution in a conical flask on a piece of paper with a black cross on it. Add a set volume of the first hydrochloric acid and start the stopwatch. Look down through the mixture and stop the stopwatch when the cross can no longer be seen. Record the time. Repeat with the second concentration of acid. Change only the concentration and keep the volumes, temperature and flask the same. Work in a well-ventilated place because sulfur dioxide is given off. The shorter time shows the faster reaction.', ['Sodium thiosulfate in a conical flask on a black cross.', 'Acid added and the stopwatch started together.', 'Stopwatch stopped when the cross can no longer be seen, and the time recorded.', 'Repeated with the other concentration, changing only the concentration.', 'Keeps volumes, temperature and flask the same.', 'A shorter time means a faster reaction, and a ventilation or safety point.'], ['Measuring a volume of gas.', 'Changing more than one variable.', 'Saying a longer time means a faster reaction.']),
]

export const lessonC34: ScienceLesson = {
  id: 'C-RAT-034-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'The disappearing cross', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
