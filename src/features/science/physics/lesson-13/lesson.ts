import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { biofuelFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.3 Energy resources (bio-fuels; reliability of fossil fuels and nuclear fuel; environmental impacts of using energy resources), as on the supplied revision page' }
const skill = 'P-FUELS'
const bio = author(skill, ['6.1.3'], ['aqa-physics'])
const rel = author(skill, ['6.1.3'], ['aqa-physics'])
const prob = author(skill, ['6.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const biofuelSections = [
  { id: 'P13-01', label: 'Start here', detail: 'What else can power a car?' },
  { id: 'P13-02', label: 'What are bio-fuels?', detail: 'Fuel from plants and dung' },
  { id: 'P13-05', label: 'Why are fossil fuels still used?', detail: 'Reliable, but running out' },
  { id: 'P13-08', label: 'What problems do they cause?', detail: 'Warming, acid rain, habitats, radiation' },
  { id: 'P13-12', label: 'On your own', detail: 'Weighing up the fuels' },
]

const states: ScienceState[] = [
  { ...bio.choice('P13-01', 'Most cars run on petrol or diesel, which come from oil. What could also be used to run some cars?', ['Fuel made from plants or animal dung', 'Water from a tap', 'Sand', 'Steam from a kettle'], 0, 'Think about a fuel that can be grown.', ['Some fuels are made from plants or animal dung.', 'These are called bio-fuels, and they can be used in some cars.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(bio, 'P13-02', 'What are bio-fuels?'),
  bio.choice('P13-03', 'What are bio-fuels made from?', ['Crude oil', 'Uranium', 'Wind and waves', 'Plant products or animal dung'], 3, 'The bio in the name is about living things.', ['Bio-fuels are made from living things.', 'They come from plant products or animal dung.'], 'recall'),
  bio.choice('P13-04', 'What is a disadvantage of growing crops for bio-fuels?', ['Crops cannot be grown in summer', 'Forests may be cleared, so animals lose their habitats', 'Bio-fuels can never be stored', 'Bio-fuels are non-renewable'], 1, 'Think about where the crops are grown.', ['Areas of forest are often cleared to grow crops for bio-fuels.', 'Plants are destroyed and animals lose their natural habitats.']),
  t(rel, 'P13-05', 'Why are fossil fuels still used?'),
  rel.choice('P13-06', 'Why can a power plant using fossil fuels respond quickly when demand for electricity rises?', ['It uses the wind', 'It has to wait for the Sun', 'It keeps a stock of fuel ready to burn', 'It uses fuel that is renewable'], 2, 'Think about what the power plant has in store.', ['Power plants keep a stock of fuel.', 'They can burn more of it straight away to make more electricity.']),
  rel.choice('P13-07', 'Which is one benefit of using fossil fuels to generate electricity?', ['They will never run out', 'They are reliable and can meet current demand', 'They do no harm to the environment', 'They can only be used at night'], 1, 'Think about why power companies still use them.', ['Fossil fuels are reliable.', 'There is enough of them to meet current demand, although they are slowly running out.']),
  t(prob, 'P13-08', 'What problems do they cause?'),
  prob.choice('P13-09', 'Burning coal, oil and gas releases carbon dioxide. Which problem does this lead to?', ['Acid rain', 'Global warming', 'Oil spills', 'Radiation'], 1, 'Carbon dioxide is a greenhouse gas.', ['Carbon dioxide is released into the atmosphere.', 'It leads to global warming.'], 'recall'),
  prob.choice('P13-10', 'Sulfur dioxide from burning coal and oil causes which problem?', ['Global warming', 'Nuclear waste', 'Acid rain', 'Oil spills'], 2, 'Sulfur dioxide dissolves in rain.', ['Sulfur dioxide causes acid rain.', 'Acid rain makes lakes and rivers acidic and can damage trees and soils.']),
  prob.choice('P13-11', 'Which is a problem of nuclear power?', ['Its waste is very dangerous and difficult to get rid of', 'It gives out sulfur dioxide, causing acid rain', 'It gives out lots of carbon dioxide', 'It causes oil spills'], 0, 'Nuclear power is clean in one way, but not in another.', ['Nuclear power is clean, but the waste is very dangerous.', 'There is also a risk of a big accident releasing radiation.']),
  bio.choice('P13-12', 'A power company can burn bio-fuel or coal. Which statement compares them correctly?', ['Both are non-renewable', 'Coal is renewable but bio-fuel will run out', 'Neither can be burnt to make electricity', 'Bio-fuel is renewable, but coal will run out one day'], 3, 'Think about which one can be grown again.', ['More plants can be grown, so bio-fuels are renewable.', 'Coal is a fossil fuel and will run out one day.'], 'understanding', true),
  rel.choice('P13-13', 'It is a still, dark evening. Why can a coal power plant still meet demand for electricity?', ['It keeps a stock of fuel that is always available', 'It uses the wind', 'It uses the Sun', 'It uses the tides'], 0, 'Think about what the plant burns, and what it depends on.', ['Coal plants do not depend on the wind or the Sun.', 'They keep a stock of fuel, so they can respond to demand.'], 'application', true),
  bio.choice('P13-14', 'A student says: "Bio-fuels are not completely harmless to the environment." Which is a correct reason?', ['They are non-renewable', 'They release radiation', 'They cause oil spills', 'Forests may be cleared to grow the crops'], 3, 'Think about where the crops are grown.', ['Forests are often cleared to grow bio-fuel crops.', 'Animals then lose their natural habitats.'], 'understanding', true),
  prob.choice('P13-15', 'A town replaces a coal power station with a nuclear power station. What is the effect on the environment?', ['Less waste, but more acid rain', 'More global warming, but less radiation', 'Less carbon dioxide and sulfur dioxide, but dangerous nuclear waste', 'No change to any problem'], 2, 'Compare what each one gives out.', ['Coal releases carbon dioxide and sulfur dioxide when it burns.', 'Nuclear power does not, but its waste is very dangerous and there is a risk of radiation.'], 'application', true),
  rel.written('P13-16', 'Give two benefits of using fossil fuels to generate electricity, and describe two environmental problems caused by burning them.', 'Think about reliability, then about the gases released.', 'Fossil fuels are reliable, and there is enough of them to meet current demand. Power plants also keep a stock, so they can respond quickly to changes in demand. Burning coal, oil and gas releases carbon dioxide, which leads to global warming. Burning coal and oil also releases sulfur dioxide, which causes acid rain and can kill animals and plants in lakes and rivers.', ['Fossil fuels are reliable and there is enough to meet current demand.', 'A stock is kept, so power plants can respond quickly to changes in demand.', 'Carbon dioxide released, which leads to global warming.', 'Sulfur dioxide released (from coal and oil), which causes acid rain.'], ['Saying that fossil fuels are renewable.', 'Saying that burning fossil fuels makes oxygen.', 'Saying that acid rain is caused by carbon dioxide alone.']),
]

export const lessonP13: ScienceLesson = {
  id: 'P-RES-013-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Bio-fuels and fossil fuels', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
