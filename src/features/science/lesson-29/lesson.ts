import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { exerciseFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.4.2.2 Response to exercise: heart rate, breathing rate, breath volume, anaerobic respiration, lactic acid, muscle fatigue, oxygen debt; 4.4.2.3 Metabolism' }
const a = author('B-EXERCISE-METABOLISM', ['4.4.2.2', '4.4.2.3'])
const m = author('B-EXERCISE-METABOLISM', ['4.4.2.3'])
const t = (id: keyof typeof frames, title: string, by = a) => by.teach(id, title, frames[id])

export const exerciseSections = [
  { id: 'B29-01', label: 'Start here', detail: 'Running for a bus' },
  { id: 'B29-02', label: 'Why breathe harder?', detail: 'Breathing rate, breath volume, heart rate' },
  { id: 'B29-05', label: 'Really hard exercise', detail: 'Lactic acid and muscle fatigue' },
  { id: 'B29-08', label: 'Why keep panting?', detail: 'The oxygen debt' },
  { id: 'B29-11', label: 'All the reactions', detail: 'Building up, breaking down, metabolism' },
  { id: 'B29-14', label: 'On your own', detail: 'Heart rate data, the body, protein' },
]

const states: ScienceState[] = [
  { ...a.choice('B29-01', 'You run for a bus. What do you notice straight afterwards?', ['You breathe more slowly than usual', 'You breathe faster and your heart beats faster', 'Your heart stops beating for a moment'], 1, 'Think about how you feel after running.', ['After running, you breathe fast and deeply.', 'Your heart beats faster too.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B29-02', 'Why breathe harder?'),
  a.choice('B29-03', 'Why does your breathing rate increase when you exercise?', ['To breathe out lactic acid', 'To cool the lungs down', 'To get more oxygen into the blood for respiration in the muscles'], 2, 'What do working muscles need more of?', ['Working muscles respire more, so they need more oxygen.', 'Faster breathing gets more oxygen into the blood.']),
  a.choice('B29-04', 'Which chain is in the right order?', ['Muscles contract more → more respiration → more oxygen needed → faster breathing and heart rate', 'Faster heart rate → less respiration → muscles contract less', 'More oxygen needed → muscles contract less → slower breathing'], 0, 'Start with what the muscles are doing.', ['Exercise makes muscles contract more, so they respire more and need more oxygen.', 'Breathing rate, breath volume and heart rate all increase to deliver it.']),
  t('B29-05', 'Really hard exercise'),
  a.choice('B29-06', 'Near the end of a hard sprint, a runner’s legs hurt. What is the most likely cause?', ['Too much oxygen in the leg muscles', 'The heart beating too slowly', 'Lactic acid building up in the leg muscles'], 2, 'What does anaerobic respiration make in muscles?', ['In a hard sprint, not enough oxygen reaches the muscles, so they respire anaerobically as well.', 'This makes lactic acid, which builds up and is painful.']),
  a.choice('B29-07', 'What is muscle fatigue?', ['Muscles growing bigger after exercise', 'Muscles getting tired and not contracting efficiently', 'Muscles making their own oxygen'], 1, 'Fatigue means tiredness.', ['Long periods of exercise make muscles tired.', 'Tired muscles stop contracting efficiently. This is muscle fatigue.']),
  t('B29-08', 'Why keep panting?'),
  a.choice('B29-09', 'What is an oxygen debt?', ['The amount of extra oxygen your body needs after exercise', 'The oxygen you breathe out after exercise', 'The oxygen stored in your muscles'], 0, 'A debt is something you still owe.', ['During hard exercise, the lungs, heart and blood cannot keep up with the muscles.', 'The extra oxygen the body needs afterwards is the oxygen debt.']),
  a.choice('B29-10', 'Why does a swimmer keep breathing hard after a race?', ['To get extra oxygen into the blood for the muscle cells', 'To make more lactic acid', 'Because the lungs have stopped working'], 0, 'What does the body still need after hard exercise?', ['The swimmer has an oxygen debt after the race.', 'Breathing hard gets extra oxygen into the blood, which carries it to the muscle cells.']),
  t('B29-11', 'All the reactions', m),
  m.choice('B29-12', 'Which is the best description of metabolism?', ['Only the reactions that break down food', 'The sum of all the reactions in a cell or the body', 'How fast you breathe', 'The energy stored in fat'], 1, 'It covers building up and breaking down.', ['Cells build some molecules up and break others down, all controlled by enzymes.', 'The sum of all these reactions is metabolism.']),
  m.choice('B29-13', 'Which reaction builds a larger molecule from smaller ones?', ['Glucose → carbon dioxide + water', 'Extra protein → urea', 'Glucose → glycogen'], 2, 'Which one joins small molecules together?', ['Respiration and making urea break molecules down.', 'Joining many glucose molecules makes glycogen, a larger molecule.']),
  a.choice('B29-14', 'The graph shows two students’ heart rates before, during and after the same run. Which conclusion fits the graph?', ['Student B has a heart disease', 'Student A did not run', 'Both students’ heart rates took the same time to return to normal', 'Student B’s heart rate rose more and took longer to return to normal'], 3, 'Compare how high each line goes and when it comes back down.', ['A went from 68 to 120 and was back to 68 by minute 10. B went from 72 to 150 and was still above resting at minute 12.', 'So B’s heart rate rose more and took longer to recover. The graph cannot show that B has a disease.'], 'dataInterpretation', true, 'energy-heart-data'),
  a.choice('B29-15', 'Look at the numbered parts of the body. During a hard sprint, where does lactic acid build up?', ['Part 1', 'Part 2', 'Part 3'], 2, 'Where does anaerobic respiration happen during a sprint?', ['Parts 1 and 2 are the lungs and the heart, which deliver oxygen.', 'Part 3 is a leg muscle, where anaerobic respiration makes lactic acid.'], 'application', true, 'energy-body-question'),
  m.choice('B29-16', 'A student eats much more protein than their body needs. What happens to the extra protein?', ['It is stored as glycogen', 'It is broken down into urea, which leaves the body in urine', 'It is turned into oxygen'], 1, 'Think about the breaking-down reactions.', ['The body cannot store extra protein.', 'It is broken down into urea, which leaves the body in urine.'], 'application', true),
  a.written('B29-17', 'A cyclist rides hard up a long, steep hill. Explain how her body gets more oxygen to her leg muscles, and what happens if it cannot get enough.', 'Start with what the leg muscles need, then her lungs and heart, then what happens without enough oxygen.', 'Her leg muscles contract more, so they respire more and need more oxygen. Her breathing rate and breath volume increase, so more oxygen gets into her blood. Her heart rate increases, so oxygenated blood reaches the muscles faster. If not enough oxygen arrives, the muscles also respire anaerobically, and lactic acid builds up. Afterwards she keeps breathing hard to repay the oxygen debt.', ['Muscles contract more, so they need more energy from respiration and more oxygen.', 'Breathing rate and breath volume increase, so more oxygen gets into the blood.', 'Heart rate increases, so oxygenated blood reaches the muscles faster.', 'Without enough oxygen, the muscles also respire anaerobically and lactic acid builds up (painful, or leads to fatigue).', 'Afterwards there is an oxygen debt, so she keeps breathing hard.'], ['Saying the heart or lungs make oxygen.', 'Saying muscles breathe, or that respiration is breathing.', 'Saying anaerobic respiration makes ethanol or more energy.']),
]

export const lesson29: ScienceLesson = {
  id: 'B-BIO-029-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Exercise and metabolism', prerequisites: ['B-RESPIRATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
