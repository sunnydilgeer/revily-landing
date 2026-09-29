import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { windSolarFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.3 Energy resources (wind power, solar cells, geothermal power: uses, advantages and disadvantages, reliability), as on the supplied revision page' }
const skill = 'P-WINDSOL'
const wind = author(skill, ['6.1.3'], ['aqa-physics'])
const solar = author(skill, ['6.1.3'], ['aqa-physics'])
const geo = author(skill, ['6.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const windSolarSections = [
  { id: 'P11-01', label: 'Start here', detail: 'A wind farm on a still day' },
  { id: 'P11-02', label: 'How does wind power work?', detail: 'Blades, pros and cons' },
  { id: 'P11-05', label: 'What about solar power?', detail: 'Solar cells, uses, pros and cons' },
  { id: 'P11-08', label: 'What is geothermal power?', detail: 'Hot rocks and reliability' },
  { id: 'P11-11', label: 'On your own', detail: 'Choosing and comparing resources' },
]

const states: ScienceState[] = [
  { ...wind.choice('P11-01', 'Some days a wind farm makes plenty of electricity. On other days it makes hardly any. What is the most likely reason?', ['The wind speed changes from day to day', 'The turbines get tired and need a rest', 'The Sun is too bright', 'The wind farm runs out of fuel'], 0, 'What do the blades need in order to turn?', ['The blades are turned by the wind.', 'When there is little wind, they turn slowly or stop, so less electricity is made.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(wind, 'P11-02', 'How does wind power work?'),
  wind.choice('P11-03', 'Which of these is a disadvantage of wind power?', ['It gives off smoke when the blades turn', 'The turbines stop when there is very little wind', 'It uses up fuel that cannot be replaced', 'It works only at night'], 1, 'Think about what the blades need.', ['Wind turbines depend on the wind.', 'When there is little wind, the turbines stop, and the supply cannot be increased on demand.'], 'recall'),
  wind.choice('P11-04', 'Some wind turbines on a hillside are taken away. What happens to the land?', ['It stays damaged for ever', 'It fills up with pollution', 'It goes back to normal', 'It turns into a lake'], 2, 'Think about whether wind turbines cause lasting damage.', ['Wind turbines cause no permanent damage to the landscape.', 'If they are removed, the area goes back to normal.']),
  t(solar, 'P11-05', 'What about solar power?'),
  solar.choice('P11-06', 'Why are solar cells a good choice for a road sign in a remote place?', ['They need a long cable from the nearest town', 'They produce electricity only at night', 'They make electricity from sunlight, so no cable is needed', 'They burn fuel inside the sign'], 2, 'Think about what a solar cell needs to work.', ['Solar cells generate electricity directly from sunlight.', 'So they are useful in remote places where there is not much choice.']),
  solar.choice('P11-07', 'Which statement about solar cells is correct?', ['They give electricity in the dark', 'Their output can be increased when demand rises', 'Their running costs are very high', 'Once they are built, the energy they use is free'], 3, 'Think about the cost of sunlight.', ['Sunlight is free, so the running costs are almost zero.', 'Solar cells do not work in the dark, and their output cannot be increased on demand.']),
  t(geo, 'P11-08', 'What is geothermal power?'),
  geo.choice('P11-09', 'Where does the energy for geothermal power come from?', ['The light of the Sun', 'Hot rocks below the Earth\'s surface', 'The wind', 'Burning coal'], 1, 'The word geothermal means heat from the Earth.', ['Geothermal power uses energy from the thermal energy stores of hot rocks.', 'The rocks are below the Earth\'s surface.'], 'recall'),
  geo.choice('P11-10', 'Why is geothermal power more reliable than wind power?', ['The hot rocks are always hot, but the wind is not always blowing', 'Geothermal plants can be built anywhere', 'Wind turbines give out a lot of pollution', 'Geothermal power costs nothing to build'], 0, 'Think about what each one depends on.', ['The hot rocks are always hot, so geothermal power works all the time.', 'Wind turbines stop when there is little wind.']),
  wind.choice('P11-11', 'Look at the three pictures. Which number shows a resource that only makes electricity in the daytime?', ['Number 1', 'Number 2', 'Number 3', 'None of them'], 2, 'Which one needs light from the Sun?', ['Solar cells need sunlight, so they only work in the daytime.', 'That is the solar panel, number 3.'], 'application', true, 'windsol-q-resources'),
  geo.choice('P11-12', 'A company wants a supply that does not depend on the weather. Which is the best choice, if a site is available?', ['Geothermal power', 'Solar cells', 'Wind turbines', 'Solar cells and wind turbines together'], 0, 'Which resource works whatever the weather?', ['Geothermal power uses hot rocks that are always hot.', 'Wind and solar power both depend on the weather or the time of day.'], 'application', true),
  wind.choice('P11-13', 'Which disadvantage is shared by wind turbines and solar cells, but not by geothermal power?', ['They give off pollution when they run', 'They can only be built underground', 'They cost nothing to build', 'Their output depends on the weather or the time of day'], 3, 'Think about what makes them unreliable.', ['Wind turbines need wind, and solar cells need daylight.', 'Geothermal power works all the time.'], 'understanding', true),
  solar.choice('P11-14', 'Wind power, solar power and geothermal power are all what kind of energy resource?', ['Non-renewable', 'Renewable, so they never run out', 'Fossil fuels', 'Nuclear'], 1, 'Think about whether the resource gets used up.', ['The wind, the Sun and the Earth\'s heat are not used up.', 'So all three are renewable.'], 'recall', true),
  wind.written('P11-15', 'Choose wind power or solar power. Give two advantages and two disadvantages of using it to generate electricity.', 'Think about pollution, cost, and when it works.', 'Wind power has no pollution once the turbines are built, and it does no lasting damage to the landscape. But turbines can spoil the view and be noisy, and they stop when there is little wind. Solar power has no pollution once built, and the energy is free so running costs are almost zero. But solar cells only work in the daytime, and a lot of energy is used to build them.', ['One advantage, such as no pollution once built.', 'A second advantage, such as no lasting damage (wind) or free energy (solar).', 'One disadvantage, such as stopping when there is little wind, or working only in the daytime.', 'A second disadvantage, such as spoiling the view, noise, or the energy needed to build the panels.'], ['Saying that wind or solar power gives out pollution while it runs.', 'Saying that the output can be increased whenever demand rises.', 'Saying that they run out.']),
]

export const lessonP11: ScienceLesson = {
  id: 'P-RES-011-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Wind, solar and geothermal power', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
