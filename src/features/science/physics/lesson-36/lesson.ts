import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { halfLifeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.2.3 Half-life of a radioactive isotope (count-rate, activity, random decay, half-life from a graph and by calculation), as on the supplied revision page' }
const skill = 'P-HALFLIFE'
const measure = author(skill, ['6.4.2.3'], ['aqa-physics'])
const idea = author(skill, ['6.4.2.3'], ['aqa-physics'])
const graph = author(skill, ['6.4.2.3'], ['aqa-physics'])
const calc = author(skill, ['6.4.2.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const halfLifeSections = [
  { id: 'P36-01', label: 'Start here', detail: 'Unstable nuclei and decay' },
  { id: 'P36-02', label: 'How do we measure radioactivity?', detail: 'Count-rate, activity and random decay' },
  { id: 'P36-05', label: 'What is half-life?', detail: 'Halving of nuclei, activity and count-rate' },
  { id: 'P36-08', label: 'How do you read it from a graph?', detail: 'Halve, across, then down' },
  { id: 'P36-11', label: 'How do you calculate a half-life?', detail: 'Count the halvings, then share the time' },
  { id: 'P36-14', label: 'On your own', detail: 'Calculate, spot the error, explain' },
]

const states: ScienceState[] = [
  { ...measure.choice('P36-01', 'An unstable nucleus gives out radiation and changes into a different nucleus. What is this process called?', ['Radioactive decay', 'Irradiation', 'Contamination', 'Evaporation'], 0, 'It happens to unstable nuclei.', ['Unstable nuclei give out radiation to become more stable.', 'This process is called radioactive decay.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(measure, 'P36-02', 'How do we measure radioactivity?'),
  measure.choice('P36-03', 'What is the unit of activity?', ['Watt', 'Becquerel', 'Newton', 'Joule'], 1, 'One decay each second.', ['Activity is the rate at which a source decays.', 'It is measured in becquerels, Bq. One becquerel is one decay per second.'], 'recall'),
  measure.choice('P36-04', 'Why can you not say when one particular nucleus will decay?', ['Because nuclei never decay', 'Because decay only happens at night', 'Because decay is a random process', 'Because the detector is too slow'], 2, 'Think about popcorn kernels popping.', ['Radioactive decay is random.', 'You cannot predict which nucleus will decay next, or when.']),
  t(idea, 'P36-05', 'What is half-life?'),
  idea.choice('P36-06', 'A source has an activity of 80 Bq. Its half-life is 3 days. What is its activity after 3 days?', ['160 Bq', '77 Bq', '3 Bq', '40 Bq'], 3, 'One half-life halves the activity.', ['After one half-life, the activity has halved.', 'Half of 80 Bq is 40 Bq.'], 'calculation'),
  idea.choice('P36-07', 'Samples X (400 Bq) and Y (100 Bq) are the same isotope. What is true about their half-lives?', ['X has the longer half-life', 'They have the same half-life', 'Y has the longer half-life', 'Only X has a half-life'], 1, 'The half-life of one isotope always stays the same.', ['The half-life of a radioactive sample is always the same.', 'It does not depend on the starting activity, so X and Y have the same half-life.']),
  t(graph, 'P36-08', 'How do you read it from a graph?'),
  graph.choice('P36-09', 'The graph shows how the activity of a source falls with time. What is the half-life of the source?', ['5 minutes', '10 minutes', '20 minutes', '30 minutes'], 1, 'Halve the starting activity, go across to the curve, then down.', ['The starting activity is 400 Bq. Half of that is 200 Bq.', 'The curve reaches 200 Bq at 10 minutes, so the half-life is 10 minutes.'], 'dataInterpretation', false, 'halflife-q-graph'),
  graph.choice('P36-10', 'Use the same graph. What is the activity after 20 minutes?', ['50 Bq', '200 Bq', '150 Bq', '100 Bq'], 3, 'Read up from 20 minutes to the curve, then across.', ['20 minutes is two half-lives.', 'The graph shows 100 Bq at 20 minutes.'], 'dataInterpretation', false, 'halflife-q-graph'),
  t(calc, 'P36-11', 'How do you calculate a half-life?'),
  calc.choice('P36-12', 'A source has an activity of 160 Bq. After 21 days it is 20 Bq. What is its half-life?', ['3 days', '21 days', '7 days', '10 days'], 2, 'Halve 160 until you reach 20, and count the steps.', ['160 → 80 → 40 → 20 is three half-lives.', 'The time for one half-life is 21 ÷ 3 = 7 days.'], 'calculation'),
  calc.choice('P36-13', 'A source has a half-life of 5 minutes and an activity of 80 Bq. What is its activity after 10 minutes?', ['40 Bq', '20 Bq', '10 Bq', '60 Bq'], 1, 'How many half-lives are in 10 minutes?', ['10 minutes is two half-lives.', '80 → 40 → 20, so the activity is 20 Bq.'], 'calculation'),
  { ...calc.choice('P36-14', 'A count-rate falls from 320 to 20 counts per second in 32 minutes. What is the half-life?', ['4 minutes', '16 minutes', '32 minutes', '8 minutes'], 3, 'Halve 320 until you reach 20, then share the time out.', ['320 → 160 → 80 → 40 → 20 is four half-lives.', 'The half-life is 32 ÷ 4 = 8 minutes.'], 'calculation', true) },
  idea.choice('P36-15', 'A sample\'s half-life is 4 days. A student says every nucleus will have decayed after 8 days. What is wrong?', ['After 8 days, one quarter of the nuclei are still undecayed', 'Nothing, the student is right', 'After 8 days, half of the nuclei are still undecayed', 'After 8 days, the nuclei have doubled'], 0, 'Eight days is two half-lives. Halve twice.', ['Two half-lives mean the number of nuclei has halved twice.', 'So one half of one half, which is one quarter, is still undecayed.'], 'application', true),
  measure.choice('P36-16', 'Half-lives: source A 2 minutes, source B 5 days, source C 30 years. Which loses half its activity soonest?', ['Source B', 'Source C', 'They all take the same time', 'Source A'], 3, 'The shortest half-life is the quickest to halve.', ['Half-life is the time to halve.', 'Source A has the shortest time, 2 minutes, so it halves soonest.'], 'dataInterpretation', true),
  idea.written('P36-17', 'Explain how you would find the half-life of a source from a graph of activity against time.', 'Start at time zero, then halve.', 'Read the starting activity from the graph at time zero. Work out half of this activity. Draw a line across from this value to the curve. Then draw a line down to the time axis. The time you read is the half-life.', ['Read the starting activity at time zero.', 'Work out half of the starting activity.', 'Go across from this value to the curve.', 'Go down to the time axis and read the time; this is the half-life.'], ['Reading the highest time on the graph.', 'Saying the half-life is when the activity reaches zero.', 'Dividing the starting activity by the time.']),
]

export const lessonP36: ScienceLesson = {
  id: 'P-ATM-036-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Half-life', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
