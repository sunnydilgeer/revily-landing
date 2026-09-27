import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { contraceptionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.5.3.4 Contraception: hormonal methods (oral contraceptive, implant, patch, injection), intrauterine devices, barrier methods, spermicides, sterilisation, natural methods and abstinence; evaluating hormonal and non-hormonal methods' }
const a = author('B-CONTRACEPTION', ['4.5.3.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const contraceptionSections = [
  { id: 'B36-01', label: 'Start here', detail: 'What does FSH do?' },
  { id: 'B36-02', label: 'Hormones and IUDs', detail: 'The pill, implant, patch, injection and IUD' },
  { id: 'B36-05', label: 'Barrier methods', detail: 'Condoms, diaphragms and spermicide' },
  { id: 'B36-08', label: 'Other ways', detail: 'Sterilisation, natural methods and abstinence' },
  { id: 'B36-11', label: 'Weigh them up', detail: 'Pros and cons of each method' },
  { id: 'B36-13', label: 'On your own', detail: 'Choices, diagrams and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B36-01', 'In the menstrual cycle, what does the hormone FSH do?', ['It causes an egg to mature in an ovary', 'It causes the lining to break down', 'It stimulates sperm production', 'It controls blood glucose'], 0, 'You met FSH when you learned about the menstrual cycle.', ['Testosterone stimulates sperm production, and insulin helps control blood glucose.', 'FSH causes an egg to mature in an ovary.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B36-02', 'Hormones and IUDs'),
  a.choice('B36-03', 'How does the contraceptive pill prevent pregnancy?', ['It kills sperm', 'It stops FSH being released, so no eggs mature', 'It forms a barrier in the vagina', 'It removes the uterus lining'], 1, 'Which hormone does the pill stop being released?', ['The pill contains hormones, not spermicide, and it is not a barrier.', 'It stops FSH being released, so no eggs mature.']),
  a.choice('B36-04', 'Which method is a small T-shaped device placed inside the uterus?', ['An implant', 'A patch', 'An IUD', 'A diaphragm'], 2, 'Its name means “inside the uterus”.', ['An implant goes under the skin of the arm, a patch goes on the skin, and a diaphragm covers the entrance to the uterus.', 'An IUD, an intrauterine device, is placed inside the uterus.']),
  t('B36-05', 'Barrier methods'),
  a.choice('B36-06', 'How do barrier methods prevent pregnancy?', ['They stop eggs maturing', 'They stop sperm reaching an egg', 'They release progesterone', 'They stop the lining building up'], 1, 'What does a barrier block?', ['Stopping eggs maturing and releasing progesterone are what hormonal methods do.', 'Barrier methods stop sperm reaching an egg.']),
  a.choice('B36-07', 'Which is the only contraceptive that also protects against sexually transmitted infections?', ['The pill', 'A diaphragm', 'Condoms', 'An implant'], 2, 'Which method covers the penis, or lines the vagina?', ['The pill and the implant use hormones, and a diaphragm only covers the entrance to the uterus.', 'Condoms are the only contraceptive that also protects against STIs.']),
  t('B36-08', 'Other ways'),
  a.choice('B36-09', 'In female sterilisation, which tubes are cut or tied?', ['The oviducts (fallopian tubes)', 'The sperm ducts', 'The blood vessels to the uterus', 'The vagina'], 0, 'Which tubes carry eggs from the ovaries to the uterus?', ['The sperm ducts are cut or tied in male sterilisation.', 'In female sterilisation, the oviducts are cut or tied, so eggs and sperm cannot meet.']),
  a.choice('B36-10', 'Why are natural methods not very effective?', ['They use hormones that stop working', 'They only block sperm for one day', 'They cause side effects such as headaches', 'Cycles vary, so the time when an egg may be in the oviduct is hard to predict'], 3, 'Natural methods rely on timing. Is the timing always the same?', ['Natural methods use no hormones and no barrier.', 'Cycles vary, so it is hard to predict exactly when an egg may be in the oviduct.']),
  t('B36-11', 'Weigh them up'),
  a.choice('B36-12', 'Sofia wants a contraceptive that she does not need to think about every day. Which is the best choice for this?', ['The pill', 'An implant', 'Condoms', 'Spermicide on its own'], 1, 'Which method lasts for years once it is in place?', ['The pill is taken every day, and condoms and spermicide are used every time.', 'An implant lasts three years, so there is nothing to remember each day.']),
  a.choice('B36-13', 'A couple want to prevent pregnancy and also protect themselves against sexually transmitted infections. Which method should they use?', ['Condoms', 'The pill', 'An IUD', 'Sterilisation'], 0, 'Which method is the only one that protects against STIs?', ['The pill, an IUD and sterilisation can prevent pregnancy, but none of them protects against STIs.', 'Condoms prevent pregnancy and also protect against STIs.'], 'application', true),
  a.choice('B36-14', 'Look at the numbered parts. Where is an IUD placed?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'An IUD stops a fertilised egg settling into a wall. Which part has that wall?', ['Part 1 is an ovary, part 2 an oviduct and part 4 the vagina.', 'An IUD is placed inside the uterus, part 3.'], 'understanding', true, 'hormone-organs-question'),
  a.choice('B36-15', 'The table shows how long one dose of four hormonal methods lasts. Which conclusion does the table support?', ['The implant needs replacing least often', 'The implant is the most effective method', 'The patch protects against STIs', 'The pill lasts longer than the injection'], 0, 'The table only shows how long each dose lasts. What can it tell you?', ['The table says nothing about how effective a method is or about STIs, and one pill lasts one day while an injection lasts months.', 'The implant lasts about 3 years, so it needs replacing least often.'], 'dataInterpretation', true, 'hormone-dose-data'),
  a.choice('B36-16', 'Which of these is a disadvantage of sterilisation?', ['It must be remembered every day', 'It is permanent, so it cannot easily be undone', 'It is only about 70 to 80% effective', 'It releases hormones that cause headaches'], 1, 'Think about how long sterilisation lasts.', ['Sterilisation needs no daily action and uses no hormones.', 'It is permanent, so a person who later wants children cannot easily undo it.'], 'application', true),
  a.written('B36-17', 'Evaluate the contraceptive pill and condoms as ways of preventing pregnancy. For each, say how it works and give at least one advantage and one disadvantage.', 'For each method, say how it works, then give a pro and a con. Finish by comparing them.', 'The pill contains hormones that stop FSH being released, so no eggs mature. It is over 99% effective, but it must be taken every day, it can cause side effects such as headaches, and it does not protect against STIs. Condoms are a barrier that stops sperm reaching an egg. They are the only method that protects against STIs and they contain no hormones, but they must be used every time. So condoms are the better choice for protection against STIs, while the pill is very effective against pregnancy.', ['The pill stops FSH being released, so no eggs mature.', 'An advantage of the pill, such as being over 99% effective.', 'A disadvantage of the pill, such as side effects, taking it every day or no STI protection.', 'Condoms are a barrier that stops sperm reaching an egg.', 'An advantage and a disadvantage of condoms, such as STI protection and needing to be used every time.'], ['Saying the pill protects against STIs.', 'Saying condoms contain or release hormones.', 'Saying the pill kills sperm.', 'Giving only advantages, or only disadvantages.']),
]

export const lesson36: ScienceLesson = {
  id: 'B-HOM-036-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Contraception', prerequisites: ['B-MENSTRUAL-CYCLE'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
