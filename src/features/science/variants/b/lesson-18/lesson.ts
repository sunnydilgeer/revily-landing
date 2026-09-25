import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { plantTransportFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.3.2 Plant organ system: transpiration, factors affecting its rate, stomata and guard cells, translocation' }
const a = author('B-PLANT-TRANSPORT', ['4.2.3.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const plantTransportSections = [
  { id: 'B18-01', label: 'Start here', detail: 'Where does water go?' },
  { id: 'B18-02', label: 'Follow the water', detail: 'The transpiration stream' },
  { id: 'B18-05', label: 'The leaf’s doors', detail: 'Stomata and guard cells' },
  { id: 'B18-08', label: 'What speeds it up?', detail: 'Warmth, wind, humidity and light' },
  { id: 'B18-11', label: 'How fast?', detail: 'Working out a rate' },
  { id: 'B18-13', label: 'Food on the move', detail: 'Translocation in phloem' },
  { id: 'B18-16', label: 'On your own', detail: 'Data, rates and explanations' },
]

const states: ScienceState[] = [
  { ...a.choice('B18-01', 'Wet washing dries on a line. Where does the water go?', ['It soaks into the line', 'It evaporates into the air as water vapour', 'It turns into oxygen'], 1, 'Think about what happens to a puddle on a sunny day.', ['Water evaporates when it turns into a gas.', 'The water vapour mixes into the air, so the washing dries.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B18-02', 'Follow the water'),
  a.choice('B18-03', 'Which order does water move through a plant?', ['Leaves → xylem → roots → air', 'Air → leaves → xylem → roots', 'Roots → xylem → leaves → air', 'Roots → phloem → leaves → soil'], 2, 'Water enters at the bottom and leaves at the top.', ['Roots take in water from the soil.', 'Water travels up the xylem to the leaves, then escapes into the air as water vapour.']),
  a.choice('B18-04', 'Why does water move up the xylem?', ['To replace water lost from the leaves', 'The phloem pumps it up', 'The leaves make new water'], 0, 'What happens in the leaf first?', ['Leaves lose water vapour through the stomata.', 'Water moves up the xylem to replace the water that was lost.']),
  t('B18-05', 'The leaf’s doors'),
  a.choice('B18-06', 'A plant is short of water. What happens to its stomata?', ['Guard cells swell and the stomata open wider', 'Guard cells go floppy and the stomata close', 'The stomata move to the top of the leaf'], 1, 'The plant needs to save water.', ['When a plant is short of water, its guard cells lose water and go floppy.', 'The stomata close, so less water vapour escapes.']),
  a.choice('B18-07', 'Why are most stomata on the underside of a leaf?', ['The underside gets the most light', 'Roots are closer to the underside', 'Carbon dioxide only comes from below', 'The underside is cooler and shaded, so less water is lost'], 3, 'Which side of the leaf does the Sun shine on?', ['The underside of the leaf is shaded and cooler.', 'Less water evaporates there, so the plant loses less water.']),
  t('B18-08', 'What speeds up transpiration?'),
  a.choice('B18-09', 'Which conditions give the slowest transpiration?', ['Warm, windy, dry and bright', 'Cool, still, humid and dark', 'Warm, still, dry and bright'], 1, 'Pick the conditions that slow evaporation and keep stomata closed.', ['Cool air slows evaporation. Still, humid air keeps the difference small.', 'In the dark, most stomata close, so little water vapour escapes.']),
  a.choice('B18-10', 'Why does transpiration slow down at night?', ['Most stomata close in the dark', 'The roots stop working at night', 'The plant makes more water at night'], 0, 'What do stomata do in the dark?', ['Stomata open in light so carbon dioxide can get in for photosynthesis.', 'In the dark, most stomata close, so less water vapour escapes.']),
  a.worked('B18-11', 'How fast is transpiration?', 'Rate means how fast something happens. A plant loses 6 g of water in 3 hours. What is its rate of transpiration?', ['Write the rule: rate = water lost ÷ time.', 'Put in the numbers: 6 g ÷ 3 hours.', 'Work it out: 6 ÷ 3 = 2.', 'Add the units: 2 g per hour.'], 'plant-rate-example'),
  a.choice('B18-12', 'A plant loses 4.5 g of water in 3 hours. What is the rate?', ['13.5 g per hour', '1.5 g per hour', '7.5 g per hour'], 1, 'Use rate = water lost ÷ time.', ['Rate = water lost ÷ time.', '4.5 g ÷ 3 hours = 1.5 g per hour.'], 'calculation'),
  t('B18-13', 'Food on the move'),
  a.choice('B18-14', 'A potato stores food made in the leaves. How did the food get there?', ['Through the xylem, in the transpiration stream', 'Through the stomata', 'Through the phloem, by translocation'], 2, 'Which tissue carries sugar?', ['Leaves make sugar by photosynthesis.', 'Phloem carries the sugar down to the potato. This is translocation.']),
  a.choice('B18-15', '“Moves substances both up and down the plant.” Which process is this?', ['Translocation', 'Transpiration', 'Evaporation'], 0, 'Which tube can carry things both ways?', ['Xylem carries water upwards only.', 'Phloem carries sugar up and down, so this describes translocation.']),
  a.choice('B18-16', 'Look at the results. Which conclusion fits them?', ['Temperature caused the difference', 'Moving air always doubles transpiration in every plant', 'The plant in still air lost no water', 'In this test, the plant lost water faster in moving air'], 3, 'Only say what these results show.', ['The plant lost 2.0 g in still air and 5.2 g in moving air, over the same time.', 'So in this test, it lost water faster in moving air. One test cannot show what happens in every plant.'], 'dataInterpretation', true, 'plant-rate-data'),
  a.choice('B18-17', 'In moving air, the plant lost 5.2 g of water in 4 hours. What was its rate of transpiration?', ['20.8 g per hour', '1.3 g per hour', '9.2 g per hour', '0.8 g per hour'], 1, 'Use rate = water lost ÷ time.', ['Rate = water lost ÷ time.', '5.2 g ÷ 4 hours = 1.3 g per hour.'], 'calculation', true, 'plant-rate-data'),
  a.choice('B18-18', 'It is a hot, dry, windy afternoon. What is most likely to happen?', ['Transpiration is slow, so the stomata open wider', 'Transpiration stops because the air is dry', 'Transpiration is fast, and the plant may close its stomata to save water'], 2, 'Think about each condition, then what the plant does if it loses too much water.', ['Heat, dry air and wind all make transpiration faster.', 'If the plant loses water faster than it can take it in, its guard cells go floppy and the stomata close.'], 'application', true),
  a.written('B18-19', 'A gardener turns up the heating in a greenhouse and switches on fans. Explain what happens to transpiration.', 'Take the heating and the fans one at a time. What does each one do to water vapour?', 'Transpiration gets faster. The warmer air gives water particles more energy, so water evaporates faster. The fans blow water vapour away from the leaves, so the air near the leaves stays dry and the difference stays big. More water is then pulled up the xylem to replace it.', ['Transpiration gets faster.', 'Warmer air means water evaporates and spreads out faster.', 'Fans blow water vapour away, so the air near the leaf stays dry.', 'More water is pulled up the xylem to replace the water lost.'], ['Transpiration is said to slow down.', 'Fans are said to make the air more humid around the leaves.', 'Water is said to leave the leaf as a liquid through the roots.']),
]

export const lesson18: ScienceLesson = {
  id: 'B-ORG-018-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Water and food on the move', prerequisites: ['B-PLANT-TISSUE'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
