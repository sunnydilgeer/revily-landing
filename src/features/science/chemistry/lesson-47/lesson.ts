import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { footprintFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.9.2.4 Carbon footprint and its reduction (meaning, ways to reduce emissions, why reductions are difficult), as on the supplied revision page' }
const skill = 'C-CARBON-FOOTPRINT'
const what = author(skill, ['5.9.2.4'], ['aqa-chemistry'])
const reduce = author(skill, ['5.9.2.4'], ['aqa-chemistry'])
const hard = author(skill, ['5.9.2.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const footprintSections = [
  { id: 'C47-01', label: 'Start here', detail: 'Which is worse for the air?' },
  { id: 'C47-02', label: 'What is a carbon footprint?', detail: 'A measure of greenhouse gases released' },
  { id: 'C47-05', label: 'How can footprints be reduced?', detail: 'Technology, rules and energy choices' },
  { id: 'C47-08', label: 'Why is it still difficult?', detail: 'Cost, agreement and lifestyle' },
  { id: 'C47-11', label: 'On your own', detail: 'Footprints, reductions and problems' },
]

const states: ScienceState[] = [
  { ...what.choice('C47-01', 'Two families use energy at home. One burns much more fuel than the other. Which family probably releases more carbon dioxide?', ['The family that burns more fuel', 'The family that uses less fuel', 'They release exactly the same', 'Neither, because carbon dioxide is not released'], 0, 'Burning fuel releases carbon dioxide.', ['Burning fossil fuels releases carbon dioxide into the air.', 'The family that burns more fuel releases more.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(what, 'C47-02', 'What is a carbon footprint?'),
  what.choice('C47-03', 'What does a carbon footprint measure?', ['How much a product costs', 'The carbon dioxide and other greenhouse gases released over the full life of something', 'How many trees are in a forest', 'The mass of carbon in a person'], 1, 'It is about greenhouse gases.', ['A carbon footprint measures the carbon dioxide and other greenhouse gases released.', 'It counts them over the full life of the product, service or event.'], 'recall'),
  what.choice('C47-04', 'Why can a rough calculation of a carbon footprint still be useful?', ['It shows exactly how much gas is released', 'It stops carbon dioxide being made', 'It shows what releases the most greenhouse gases, so people can avoid using it', 'It proves climate change is not happening'], 2, 'Think about what a rough answer can still tell you.', ['A full footprint can be very hard or impossible to measure.', 'A rough calculation still shows which things release the most, so people can avoid them.']),
  t(reduce, 'C47-05', 'How can footprints be reduced?'),
  reduce.choice('C47-06', 'A power station catches its carbon dioxide before it reaches the air and stores it deep underground. What is this doing?', ['Making more carbon dioxide', 'Turning carbon dioxide into oxygen', 'Increasing the greenhouse effect', 'Reducing the carbon footprint by capturing the gas'], 3, 'The gas never reaches the atmosphere.', ['Capturing carbon dioxide before it is released keeps it out of the atmosphere.', 'Storing it deep underground means it does not add to the greenhouse effect.']),
  reduce.choice('C47-07', 'A government sets a limit on total emissions, and companies can sell licences up to it. What is this limit called?', ['A cap on emissions', 'A tax', 'A footprint', 'A renewable source'], 0, 'The limit is a ceiling.', ['A limit on emissions is a cap.', 'Companies can then sell licences for emissions up to the cap.'], 'recall'),
  t(hard, 'C47-08', 'Why is it still difficult?'),
  hard.choice('C47-09', 'Why might some governments worry about making big cuts in emissions?', ['Cuts always make energy cheaper', 'The changes could harm the economy and the well-being of communities', 'Carbon dioxide is not a greenhouse gas', 'Renewable energy does not exist'], 1, 'Think about money and jobs.', ['Big changes can affect the economies of communities.', 'That could harm well-being, especially in developing countries.']),
  hard.choice('C47-10', 'Which is a reason why individuals find it hard to change their lifestyle?', ['Lifestyle has no effect on emissions', 'Everyone already agrees on what to do', 'Some people do not want to, or do not understand why or how', 'Governments are not allowed to help'], 2, 'Think about people, not technology.', ['Changing a lifestyle takes effort, and not everyone is willing.', 'Some people also do not understand why the changes matter or how to make them.']),
  { ...what.choice('C47-11', 'Which of these can have a carbon footprint?', ['Only a car', 'Only a factory', 'Only something made of carbon', 'A school trip, a concert and a kettle all can'], 3, 'A footprint can be worked out for almost anything.', ['A footprint can be a service, an event or a product.', 'So a school trip, a concert and a kettle each have one.'], 'application', true) },
  reduce.choice('C47-12', 'A company changes to a process that produces less waste, and waste that rots releases methane. How does this help?', ['It cuts the amount of methane, a greenhouse gas, that is released', 'It releases more carbon dioxide', 'It has no effect on greenhouse gases', 'It removes oxygen from the air'], 0, 'Think about what decomposing waste gives out.', ['Decomposing waste releases methane, which is a greenhouse gas.', 'Less waste means less methane, so the carbon footprint gets smaller.'], 'application', true),
  hard.choice('C47-13', 'The chart shows greenhouse gases released by three school trips in one year. Which trip has the biggest footprint?', ['Trip 1', 'Trip 3', 'Trip 2', 'They are all equal'], 2, 'Read the tallest bar.', ['The tallest bar shows the most greenhouse gas released.', 'Trip 2 has the tallest bar, so it has the biggest footprint.'], 'dataInterpretation', true, 'footprint-q-trips'),
  reduce.choice('C47-14', 'Which change would reduce a carbon footprint?', ['Using more fossil fuels', 'Using renewable energy or nuclear energy instead of fossil fuels', 'Cutting down more forest', 'Making more waste'], 1, 'Think about which choice releases less carbon dioxide.', ['Renewable and nuclear energy do not release carbon dioxide from burning fuel.', 'Replacing fossil fuels with them lowers the footprint.'], 'understanding', true),
  hard.written('C47-15', 'Describe two ways to reduce greenhouse gas emissions and give one reason why doing this is difficult.', 'Pick two ways from the lesson, then one difficulty.', 'One way is to use renewable energy or nuclear energy instead of fossil fuels. Another is for governments to put a cap on emissions and sell licences, or to tax companies for what they release. It is difficult because changes can harm the economies of communities, and countries find it hard to agree on cuts.', ['Two ways, for example capture and store carbon dioxide, tax, less energy or waste, a cap and licences, renewables or nuclear.', 'Explains that these reduce the greenhouse gases released.', 'One reason it is difficult, for example cost to economies, hard to agree, or lifestyle changes.'], ['Saying that a carbon footprint only counts carbon dioxide from cars.', 'Saying that reducing emissions is easy and needs no changes.', 'Saying the carbon dioxide is stored in the air.']),
]

export const lessonC47: ScienceLesson = {
  id: 'C-ATM-047-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Carbon footprints', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
