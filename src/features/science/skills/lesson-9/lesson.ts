import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsUnitFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 4.3 (SI units), WS 4.4 (prefixes), WS 4.5 (converting units, checking units in equations), as on the supplied revision page' }
const skill = 'W-DAT-009-W'
const a = author(skill, ['WS 4.3', 'WS 4.4', 'WS 4.5'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsUnitSections = [
  { id: 'W9-01', label: 'Start here', detail: 'Millimetres or metres?' },
  { id: 'W9-02', label: 'What are SI units?', detail: 'Standard units and base units' },
  { id: 'W9-04', label: 'What do prefixes mean?', detail: 'Kilo, centi, milli, micro and mega' },
  { id: 'W9-07', label: 'How do you convert units?', detail: 'Multiply or divide by 1000', },
  { id: 'W9-10', label: 'Why check units in equations?', detail: 'Convert first, then calculate' },
  { id: 'W9-13', label: 'On your own', detail: 'Prefixes, conversions and equations' },
]

const states: ScienceState[] = [
  { ...a.choice('W9-01', 'A pencil is 15 cm long. Which is the same length?', ['150 mm', '1.5 mm', '15 000 mm', '0.15 mm'], 0, 'A centimetre is bigger than a millimetre. There are 10 mm in each centimetre.', ['There are 10 millimetres in 1 centimetre.', 'So 15 cm is 15 × 10 = 150 mm.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W9-02', 'What are SI units?'),
  a.choice('W9-03', 'Which is the SI base unit of time?', ['Minute', 'Hour', 'Second', 'Day'], 2, 'Think about the unit used in speed in m/s.', ['The SI base unit of time is the second, s.', 'A minute or an hour is a larger unit, and you would convert it into seconds for calculations.'], 'recall'),
  t('W9-04', 'What do prefixes mean?'),
  a.choice('W9-05', 'What does the prefix milli mean?', ['1000 times bigger', '1000 times smaller', '100 times smaller', '1 000 000 times smaller'], 1, 'There are 1000 millimetres in a metre.', ['Milli means 1000 times smaller than the base unit.', 'So there are 1000 millimetres in 1 metre.'], 'recall'),
  a.choice('W9-06', 'How many metres are there in 1 kilometre?', ['100', '10', '10 000', '1000'], 3, 'Kilo means 1000 times bigger.', ['The prefix kilo means 1000 times bigger.', 'So 1 kilometre is 1000 metres.'], 'recall'),
  t('W9-07', 'How do you convert units?'),
  a.choice('W9-08', 'A bag of flour has a mass of 3.2 kg. What is its mass in grams?', ['3200 g', '32 g', '320 g', '0.0032 g'], 0, 'Going from a bigger unit to a smaller unit, multiply.', ['1 kg = 1000 g, and a gram is the smaller unit, so multiply.', '3.2 × 1000 = 3200 g.'], 'calculation'),
  a.choice('W9-09', 'A wire is 450 mm long. What is its length in metres?', ['4.5 m', '0.045 m', '0.45 m', '450 000 m'], 2, 'Going from a smaller unit to a bigger unit, divide.', ['1 m = 1000 mm, and a metre is the bigger unit, so divide.', '450 ÷ 1000 = 0.45 m.'], 'calculation'),
  t('W9-10', 'Why check units in equations?'),
  a.choice('W9-11', 'A trolley travels 40 cm in 2 s. What is its speed in m/s?', ['20 m/s', '0.2 m/s', '2 m/s', '0.02 m/s'], 1, 'Change 40 cm into metres first, then use speed = distance ÷ time.', ['40 cm ÷ 100 = 0.4 m.', 'Speed = 0.4 ÷ 2 = 0.2 m/s.'], 'calculation'),
  a.choice('W9-12', 'A student finds the weight of a 500 g mass with W = m × g. What should she do first?', ['Multiply 500 by 9.8 straight away', 'Divide 500 by 100', 'Multiply 500 by 1000', 'Convert 500 g to 0.5 kg by dividing by 1000'], 3, 'The equation needs the mass in kilograms.', ['500 g ÷ 1000 = 0.5 kg.', 'Then W = 0.5 × 9.8 = 4.9 N.'], 'calculation'),
  a.choice('W9-13', 'Which of these is the smallest length?', ['1 mm', '1 µm', '1 cm', '1 m'], 1, 'Micro means a million times smaller than the base unit.', ['A micrometre is 1 000 000 times smaller than a metre.', 'A millimetre is only 1000 times smaller than a metre.'], 'understanding', true),
  a.choice('W9-14', 'A sample of soil has a mass of 0.45 kg. What is its mass in grams?', ['0.00045 g', '4.5 g', '450 g', '45 000 g'], 2, 'Kilograms to grams: bigger unit to smaller unit.', ['Multiply by 1000 to go from kg to g.', '0.45 × 1000 = 450 g.'], 'calculation', true),
  a.choice('W9-15', 'A student has a mass of 500 g. Use W = m × g with g = 9.8 N/kg. What is the weight?', ['4.9 N', '4900 N', '49 N', '490 N'], 0, 'Convert the mass to kilograms first.', ['500 g ÷ 1000 = 0.5 kg.', 'W = 0.5 × 9.8 = 4.9 N.'], 'calculation', true),
  a.written('W9-16', 'A runner covers 1.5 km in 300 s. Show how to find her speed in m/s.', 'Change the distance to metres first, then use speed = distance ÷ time.', 'Convert the distance: 1.5 km × 1000 = 1500 m. Use speed = distance ÷ time. So v = 1500 ÷ 300 = 5 m/s.', ['Converts kilometres to metres by multiplying by 1000: 1500 m.', 'Writes speed = distance ÷ time.', 'Substitutes correctly: 1500 ÷ 300.', 'Gives the answer 5 with the unit m/s.'], ['Dividing by 1000 instead of multiplying.', 'Using 1.5 as the distance.', 'Giving the answer without a unit.']),
]

export const lessonW9: ScienceLesson = {
  id: 'W-DAT-009-W', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Units and converting them', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
