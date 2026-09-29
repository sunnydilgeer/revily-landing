import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsIssueFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 1.3 Communication of scientific developments, WS 1.4 Issues created by science (economic, social, personal, environmental), WS 1.6 Ethical questions science cannot answer, as on the supplied revision page' }
const skill = 'W-MTH-002-W'
const a = author(skill, ['WS1.3', 'WS1.4', 'WS1.6'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
// Puts the correct answer at a chosen position so the answer positions are spread across the lesson.
const q = (id: string, title: string, right: string, wrong: string[], pos: number, hint: string, steps: string[], dimension: Parameters<typeof a.choice>[6] = 'understanding', independent = false, visual?: string) => {
  const labels = [...wrong]; labels.splice(pos, 0, right)
  return a.choice(id, title, labels, pos, hint, steps, dimension, independent, visual)
}

export const wsIssueSections = [
  { id: 'W2-01', label: 'Start here', detail: 'A headline about a study' },
  { id: 'W2-02', label: 'Why tell people?', detail: 'Discoveries, advice and new technologies' },
  { id: 'W2-05', label: 'Can you trust the headline?', detail: 'Misleading, oversimplified and biased reports' },
  { id: 'W2-08', label: 'What issues can science raise?', detail: 'Economic, social, personal and environmental' },
  { id: 'W2-11', label: 'Can science answer everything?', detail: 'Missing data and ethical questions' },
  { id: 'W2-14', label: 'On your own', detail: 'Judge a report, name an issue and write a reply' },
]

const states: ScienceState[] = [
  { ...q('W2-01', 'A headline says "Sugar-free drinks make you smarter!" What is the best first question to ask?', 'What evidence is it based on?', ['Which newspaper is it in?', 'Is the headline in large print?', 'Do my friends drink them?'], 1, 'Think about how you would check whether a claim is fair.', ['A claim is only as good as the evidence behind it.', 'Where it is printed, how big it is and what friends do tell you nothing about the evidence.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W2-02', 'Why tell people?'),
  q('W2-03', 'Which is an example of scientists helping people to change a habit?', 'Advice to drink less sugary drink, because of evidence about tooth decay', ['A scientist keeping results private', 'A shop changing its prices', 'A student repeating an experiment'], 0, 'Look for evidence leading to advice for the public.', ['The evidence about tooth decay led to advice people can act on.', 'The other options do not pass evidence on to people.']),
  q('W2-04', 'A hospital starts using a new scanner. Who needs to be told how it works and what the results mean?', 'Doctors and patients', ['Only the scientists who built it', 'Nobody, because scanners work alone', 'Only newspaper editors'], 2, 'Think about who uses the scanner and who is scanned.', ['Doctors must use it correctly and understand the results.', 'Patients need to understand what their results mean for them.']),
  t('W2-05', 'Can you trust the headline?'),
  q('W2-06', 'An advert says "9 in 10 people saw brighter teeth" but not how many were tested. What is wrong?', 'It shows only the data that helps the advert, so it may be biased', ['The result must be true because it uses numbers', 'Adverts cannot use data', 'The people were too honest'], 3, 'What would you want to know before you believed it?', ['Leaving out how many were tested hides important information.', 'Data that only supports one side can be biased or oversimplified.'], 'dataInterpretation'),
  q('W2-07', 'Which is a sign that a news report on a study might be biased?', 'It gives evidence for one side and none against', ['It names the scientists', 'It includes a graph', 'It was published this week'], 1, 'Think about whether both sides of the argument appear.', ['A biased report ignores one side of the argument.', 'Naming scientists, showing a graph or being recent do not make a report unfair.']),
  t('W2-08', 'What issues can science raise?'),
  q('W2-09', 'A council cannot afford to fit solar panels on every school this year. What type of issue is this?', 'An economic issue', ['A social issue', 'A personal issue', 'An environmental issue'], 0, 'Think about what is stopping the council.', ['Not being able to afford something is about money.', 'Economic issues are about what society can afford to do.']),
  q('W2-10', 'A farmer is upset that a wind farm will be built right beside her house. What type of issue is this?', 'A personal issue', ['An economic issue', 'A social issue', 'An environmental issue'], 2, 'Who is affected most, one person or people in general?', ['The decision affects an individual and how she feels about her home.', 'Social issues are about people in general.']),
  t('W2-11', 'Can science answer everything?'),
  q('W2-12', 'Which of these questions can experiments answer?', 'Does this fertiliser make wheat grow taller?', ['Is it fair to test medicines on animals?', 'Should everyone eat less meat?', 'Is it right to ban fireworks?'], 3, 'Can you collect data that settles the question?', ['We can measure the height of wheat with and without fertiliser.', 'The other questions are about right and wrong, so experiments cannot settle them.']),
  q('W2-13', 'Why can scientists disagree about some questions?', 'There is not yet enough data to support one explanation', ['Scientists never use evidence', 'Disagreeing shows science is wrong', 'Some scientists refuse to test ideas'], 0, 'Think about what is missing.', ['When the data is not yet good enough, more than one explanation can fit.', 'Better experiments may settle it later.'], 'understanding'),
  q('W2-14', 'The report shown says "Chewing gum makes pupils cleverer!" What is the biggest problem with its headline?', 'It ignores that only 8 pupils were tested and 2 did worse', ['It has a picture', 'It uses the word "pupils"', 'It is too short'], 2, 'Read the small print in the report.', ['The report shows the headline overstates what the data shows.', 'Small numbers and results that go against the headline have been left out.'], 'dataInterpretation', true, 'wsissue-q-headline'),
  q('W2-15', 'A bypass would cut traffic fumes but cross a nature reserve. Which type of issue is about harm to nature?', 'An environmental issue', ['An economic issue', 'A personal issue', 'A social issue'], 1, 'Human activity and the living world.', ['Damage to a nature reserve is about how human activity affects the environment.', 'It could also raise other issues, but this one is the environmental one.'], 'application', true),
  q('W2-16', 'Experiments show a drug helps pupils concentrate. A pupil says, "So everyone should take it before exams." What is wrong?', 'Whether it is right to use it is an ethical question that experiments cannot answer', ['Drugs never affect concentration', 'Experiments cannot measure concentration', 'Only doctors can read results'], 3, 'The experiment tells us what happens, not what we should do.', ['The experiment shows what the drug does.', 'Deciding whether it is fair or right to use it is for society to decide.'], 'understanding', true),
  a.written('W2-17', 'A report says "Energy drinks are harmless." How would you decide whether to trust it? Name one issue it could raise.', 'Say what you would check, and name one type of issue.', 'I would ask what evidence the headline is based on, such as how many people were tested and for how long. I would check whether it gives evidence for both sides or leaves out anything against it, because that would be biased. I would look for the original scientific study rather than trusting only the headline. An issue it could raise is a social one, such as whether energy drinks should be sold to children, or an economic one about the cost of a ban.', ['Asks what the evidence is, for example the sample size.', 'Checks whether both sides of the argument are given.', 'Recognises that reports can be biased or oversimplified.', 'Looks for the original study or other sources.', 'Names a sensible issue and its type: economic, social, personal or environmental.'], ['Saying newspapers are always wrong.', 'Saying a report is true because it is in the news.', 'Naming an issue but not its type or why it matters.']),
]

export const lessonW2: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Communicating science and its issues', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
