import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { waterPowerFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.3 Energy resources (hydro-electric power, wave power, tidal barrages: how they work, advantages and disadvantages, reliability), as on the supplied revision page' }
const skill = 'P-WATERPOW'
const hydro = author(skill, ['6.1.3'], ['aqa-physics'])
const wave = author(skill, ['6.1.3'], ['aqa-physics'])
const tide = author(skill, ['6.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const waterPowerSections = [
  { id: 'P12-01', label: 'Start here', detail: 'Why store water behind a dam?' },
  { id: 'P12-02', label: 'How does hydro-electric power work?', detail: 'Dam, turbines, pros and cons' },
  { id: 'P12-05', label: 'What about wave power?', detail: 'Turbines in the sea' },
  { id: 'P12-08', label: 'How do tidal barrages work?', detail: 'Dams across estuaries' },
  { id: 'P12-11', label: 'On your own', detail: 'Comparing water power' },
]

const states: ScienceState[] = [
  { ...hydro.choice('P12-01', 'A big dam holds back a lake high up in the hills. Why is this useful for making electricity?', ['The water can flow down and turn turbines', 'It makes the water warmer', 'It stops rain from falling', 'It makes the water fizz'], 0, 'Think about what moving water can do to a turbine.', ['Water high up can be allowed to fall.', 'The falling water turns turbines, and turbines generate electricity.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(hydro, 'P12-02', 'How does hydro-electric power work?'),
  hydro.choice('P12-03', 'What happens to the valley when a hydro-electric dam is built across it?', ['It is dug deeper', 'It is flooded behind the dam', 'It is turned into a wind farm', 'It is left dry'], 1, 'The dam holds water back.', ['The dam holds the water back, so the valley behind it is flooded.', 'The stored water can then flow out through turbines.'], 'recall'),
  hydro.choice('P12-04', 'Which is an advantage of hydro-electric power?', ['The flow of water can be controlled, so it can respond quickly to extra demand', 'It works well in a long drought', 'It costs very little to build', 'Flooding a valley helps wildlife'], 0, 'Think about how quickly the water can be released.', ['The flow of water can be controlled.', 'So the plant can respond straight away when there is extra demand for electricity.']),
  t(wave, 'P12-05', 'What about wave power?'),
  wave.choice('P12-06', 'Why is the energy from wave power fairly unreliable?', ['The Moon stops pulling on the sea', 'Waves die out when the wind drops', 'The turbines run out of fuel', 'The sea dries up'], 1, 'What makes waves in the first place?', ['Waves tend to die out when the wind drops.', 'So the amount of energy they generate changes.']),
  wave.choice('P12-07', 'Which place could benefit most from wave power?', ['A desert town far from the sea', 'A mountain top with no water', 'An island with a lot of coastline', 'A city in the middle of a large country'], 2, 'The turbines have to be in the sea, near the coast.', ['Wave turbines have to be in the sea, usually near the coast.', 'An island has a lot of coastline.']),
  t(tide, 'P12-08', 'How do tidal barrages work?'),
  tide.choice('P12-09', 'What is an estuary?', ['A dam with turbines in it', 'The top of a wave', 'A valley flooded by a dam', 'The part of a river that meets the sea'], 3, 'A tidal barrage is built across it.', ['An estuary is the part of a river that meets the sea.', 'Tidal barrages are built across estuaries.'], 'recall'),
  tide.choice('P12-10', 'Why are tides described as reliable?', ['They always happen, twice a day', 'They are the same size every day', 'They are made by the wind', 'They only happen in summer'], 0, 'Think about how often the sea level rises and falls.', ['Tides always happen, twice a day.', 'They are caused by the pull of gravity from the Moon and the Sun, not by the wind.']),
  hydro.choice('P12-11', 'Look at the three water power schemes. Which number shows hydro-electric power?', ['Number 1', 'Number 2', 'Number 3', 'None of them'], 2, 'Which one has a dam across a valley?', ['Hydro-electric power uses a dam across a valley.', 'That is number 3. Number 1 is wave power and number 2 is a tidal barrage.'], 'application', true, 'waterpow-q-schemes'),
  wave.choice('P12-12', 'Which pair of water resources can be made unreliable by the weather?', ['Tidal barrages and wave power', 'Tidal barrages and hydro-electric power', 'None, because water power is always reliable', 'Hydro-electric power and wave power'], 3, 'One needs rain, and one needs wind.', ['Hydro-electric power is unreliable in a drought.', 'Wave power is unreliable because waves die out when the wind drops.'], 'understanding', true),
  tide.choice('P12-13', 'A dry country in a long drought has a suitable estuary on its coast. Which is the better choice, and why?', ['Hydro-electric power, because dams store lots of water', 'Tidal barrages, because tides still happen in a drought', 'Hydro-electric power, because a drought helps', 'Wave power, because waves never die out'], 1, 'Which resource does not need rain?', ['Hydro-electric power needs rainfall, so it is not suitable in a drought.', 'Tides always happen, twice a day, whatever the weather.'], 'application', true),
  hydro.choice('P12-14', 'Which is a disadvantage of both hydro-electric power and tidal barrages?', ['They can damage the habitats of wildlife', 'They give off smoke', 'They only work at night', 'They use up fuel'], 0, 'Both build a dam.', ['A dam changes the place where animals and plants live.', 'Flooding a valley and blocking an estuary can both destroy habitats.'], 'understanding', true),
  hydro.written('P12-15', 'Describe how hydro-electric power generates electricity, and give two problems that it causes.', 'Start at the dam and follow the water.', 'A big dam is built across a valley and the valley is flooded, which stores water high up. The water flows out through turbines, and this generates electricity. The initial costs are high. Flooding the valley damages the environment: plants rot and release greenhouse gases, and animals and plants lose their habitats. It is also unreliable in a drought.', ['A dam is built across a valley and the valley is flooded, storing water.', 'The water flows out through turbines, which generates electricity.', 'One problem, such as high initial costs.', 'A second problem, such as habitats lost or greenhouse gases from rotting plants.', 'Unreliable in dry climates or a drought, or another correct problem.'], ['Saying the water is burnt.', 'Saying it gives out pollution while it is running.', 'Saying it works in a drought.']),
]

export const lessonP12: ScienceLesson = {
  id: 'P-RES-012-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Hydro-electricity, waves and tides', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
