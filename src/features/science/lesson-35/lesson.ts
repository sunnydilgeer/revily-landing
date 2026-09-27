import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { menstrualCycleFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.5.3.3 Hormones in human reproduction (Foundation content): secondary sexual characteristics, testosterone and oestrogen, the menstrual cycle, FSH, LH, oestrogen and progesterone' }
const a = author('B-MENSTRUAL-CYCLE', ['4.5.3.3'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const menstrualCycleSections = [
  { id: 'B35-01', label: 'Start here', detail: 'Which gland makes testosterone?' },
  { id: 'B35-02', label: 'What happens at puberty?', detail: 'Sex hormones and new features' },
  { id: 'B35-05', label: 'Follow one cycle', detail: 'Four stages over about 28 days' },
  { id: 'B35-08', label: 'Which hormone does what?', detail: 'FSH, LH, oestrogen and progesterone' },
  { id: 'B35-11', label: 'On your own', detail: 'Dates, diagrams and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B35-01', 'Which gland releases the hormone testosterone?', ['Pituitary gland', 'Thyroid gland', 'Testes', 'Pancreas'], 2, 'You met the six glands when you learned about the endocrine system.', ['The pituitary gland, thyroid gland and pancreas release other hormones.', 'Testosterone is released by the testes.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B35-02', 'What happens at puberty?'),
  a.choice('B35-03', 'Which of these is a secondary sexual characteristic?', ['Having a heart that pumps blood', 'Facial hair growing in males', 'Being able to digest food', 'Blood carrying hormones'], 1, 'Which one is a new feature that develops at puberty?', ['The heart, digestion and the blood all work long before puberty.', 'Facial hair in males develops at puberty, so it is a secondary sexual characteristic.']),
  a.choice('B35-04', 'Which hormone stimulates sperm production?', ['Oestrogen', 'Insulin', 'Adrenaline', 'Testosterone'], 3, 'Which is the main reproductive hormone in males?', ['Oestrogen is the main female reproductive hormone; insulin and adrenaline do other jobs.', 'Testosterone, made by the testes, stimulates sperm production.']),
  t('B35-05', 'Follow one cycle'),
  a.choice('B35-06', 'In a 28-day cycle, on about which day is an egg released?', ['Day 1', 'Day 4', 'Day 14', 'Day 28'], 2, 'Ovulation happens about halfway through the cycle.', ['Days 1 to 4 are the period, and day 28 is the end of the cycle.', 'The egg is released at about day 14.']),
  a.choice('B35-07', 'What happens to the uterus lining in stage 2?', ['It breaks down and leaves the body', 'It builds up into a thick, spongy layer full of blood vessels', 'It turns into an egg', 'It moves into the oviduct'], 1, 'Stage 2 comes straight after the period.', ['The lining breaks down in stage 1, the period.', 'In stage 2, it builds up into a thick, spongy layer full of blood vessels.']),
  t('B35-08', 'Which hormone does what?'),
  a.choice('B35-09', 'Which hormone causes an egg to mature in an ovary?', ['FSH', 'LH', 'Progesterone', 'Testosterone'], 0, 'Which hormone acts first in the cycle?', ['LH causes the egg to be released, and progesterone helps keep the lining thick.', 'FSH causes an egg to mature in an ovary.']),
  a.choice('B35-10', 'Which two hormones grow and maintain the uterus lining?', ['FSH and LH', 'Oestrogen and progesterone', 'Insulin and adrenaline', 'LH and testosterone'], 1, 'Two hormones look after the egg, and two look after the lining.', ['FSH and LH act on the egg in the ovary.', 'Oestrogen and progesterone grow and maintain the uterus lining.']),
  a.choice('B35-11', 'Amira’s period starts on 1 March, and her cycle lasts about 28 days. On about which date would you expect an egg to be released?', ['1 March', '4 March', '14 March', '28 March'], 2, 'Day 1 of the cycle is 1 March. When is ovulation?', ['Day 1 is the first day of the period, 1 March.', 'Ovulation is at about day 14, so about 14 March.'], 'application', true),
  a.choice('B35-12', 'Look at the numbered parts. Which number shows where eggs mature?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 0, 'Eggs mature in the organs that also release oestrogen.', ['Part 2 is the oviduct, part 3 the uterus and part 4 the vagina.', 'Eggs mature in the ovary, part 1.'], 'understanding', true, 'hormone-organs-question'),
  a.choice('B35-13', 'Look at the timeline. Which letter shows a time when the lining is building up?', ['A', 'B', 'C', 'D'], 1, 'The lining builds up between the period and ovulation.', ['A is during the period, C is ovulation and D is while the lining is kept thick.', 'B is between the period and ovulation, when the lining builds up.'], 'understanding', true, 'hormone-cycle-letters'),
  a.choice('B35-14', 'The chart shows the length of one person’s cycle over four months. Which conclusion fits the data best?', ['Her cycle was exactly 28 days every month', 'Her cycles got shorter every month', 'Every person’s cycle lasts 27 to 30 days', 'Her cycle length varied a little, around 28 days'], 3, 'Look at all four numbers. Do they stay the same?', ['Her cycles were 27, 29, 28 and 30 days, so they changed a little, but not always in one direction; one person cannot show what happens for everyone.', 'So her cycle length varied a little, around 28 days.'], 'dataInterpretation', true, 'hormone-cycle-lengths'),
  a.written('B35-15', 'Describe what happens to the uterus lining and to an egg during one 28-day menstrual cycle. Name the hormone that causes the egg to be released.', 'Go through the four stages in order, and say what the lining and the egg are doing in each.', 'In days 1 to 4, the lining breaks down and leaves the body; this is a period. The lining then builds up into a thick, spongy layer full of blood vessels. At about day 14, LH causes an egg to be released from an ovary; this is ovulation. The lining is kept thick, and if no fertilised egg settles by day 28 it breaks down and the cycle starts again.', ['Days 1 to 4: the lining breaks down (menstruation, a period).', 'The lining then builds up into a thick layer with blood vessels.', 'At about day 14 an egg is released from an ovary (ovulation).', 'LH causes the egg to be released.', 'The lining is kept thick, then breaks down if no fertilised egg settles by day 28.'], ['Saying the egg is released on day 1 or during the period.', 'Saying FSH releases the egg (FSH makes it mature).', 'Saying the lining is thickest during menstruation.', 'Saying testosterone controls the menstrual cycle.']),
]

export const lesson35: ScienceLesson = {
  id: 'B-HOM-035-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Puberty and the menstrual cycle', prerequisites: ['B-HORMONES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
