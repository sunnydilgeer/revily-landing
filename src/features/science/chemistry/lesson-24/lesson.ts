import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { reactivityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.1.2 Reactivity series; 5.4.1.3 Extraction of metals and reduction; 5.4.1.4 Oxidation and reduction in terms of gain or loss of oxygen (Foundation), as on the supplied revision page' }
const skill = 'C-METAL-REACTIVITY'
const series = author(skill, ['5.4.1.2'], ['aqa-chemistry'])
const redox = author(skill, ['5.4.1.4'], ['aqa-chemistry'])
const extract = author(skill, ['5.4.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const reactivitySections = [
  { id: 'C24-01', label: 'Start here', detail: 'Which metal reacts more?' },
  { id: 'C24-02', label: 'What is the reactivity series?', detail: 'A league table of metals' },
  { id: 'C24-05', label: 'Oxidation and reduction', detail: 'Gaining and losing oxygen' },
  { id: 'C24-08', label: 'How are metals extracted?', detail: 'Carbon, electrolysis and gold' },
  { id: 'C24-12', label: 'On your own', detail: 'New metals, data and an equation' },
]

const states: ScienceState[] = [
  { ...series.choice('C24-01', 'A lump of sodium and a lump of copper are dropped into cold water. What happens?', ['Both fizz at the same rate', 'The sodium reacts and the copper does not', 'The copper reacts and the sodium does not'], 1, 'Think about what you know of Group 1 metals in water.', ['Sodium is a Group 1 metal, and it reacts with water.', 'Copper is much less reactive and does not react with cold water.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(series, 'C24-02', 'What is the reactivity series?'),
  series.choice('C24-03', 'What decides how high a metal is in the reactivity series?', ['How easily its atoms lose electrons to form positive ions', 'How heavy its atoms are', 'How shiny the metal is', 'How many atoms are in a lump of it'], 0, 'Think about what metal atoms do when they react.', ['Metal atoms react by losing electrons to form positive ions.', 'The more easily a metal does this, the higher it sits in the series.']),
  series.choice('C24-04', 'Which list shows metals in order from most reactive to least reactive?', ['Copper, iron, zinc, sodium', 'Zinc, sodium, copper, iron', 'Sodium, zinc, iron, copper', 'Iron, copper, sodium, zinc'], 2, 'The most reactive metal is at the top of the series.', ['Sodium is very reactive, zinc and iron are fairly reactive, and copper is not very reactive.', 'So the order is sodium, zinc, iron, copper.']),
  t(redox, 'C24-05', 'Oxidation and reduction'),
  redox.choice('C24-06', 'Iron reacts with oxygen to make iron oxide. What is this type of reaction called?', ['Reduction, because iron loses oxygen', 'Reduction, because iron gains oxygen', 'Oxidation, because iron loses oxygen', 'Oxidation, because iron gains oxygen'], 3, 'Did the iron gain oxygen or lose it?', ['The iron joins with oxygen, so it gains oxygen.', 'A substance that gains oxygen is oxidised.']),
  redox.choice('C24-07', 'In 2CuO + C → 2Cu + CO₂, which substance is reduced?', ['Carbon', 'Copper oxide', 'Copper', 'Carbon dioxide'], 1, 'Which substance loses oxygen?', ['Copper oxide turns into copper, so it loses oxygen.', 'Losing oxygen is reduction. The carbon gains oxygen, so it is oxidised.']),
  t(extract, 'C24-08', 'How are metals extracted?'),
  extract.choice('C24-09', 'Which of these metals can be extracted from its oxide by heating with carbon?', ['Sodium', 'Calcium', 'Iron', 'Potassium'], 2, 'Which one is below carbon in the series?', ['Iron is below carbon, so carbon can take oxygen from iron oxide.', 'Sodium, calcium and potassium are all above carbon.']),
  extract.choice('C24-10', 'Why can carbon not be used to extract magnesium from magnesium oxide?', ['Carbon is less reactive than magnesium, so it cannot take the oxygen', 'Carbon is more reactive than magnesium', 'Magnesium oxide is a gas', 'Carbon has no oxygen to give'], 0, 'Compare the positions of carbon and magnesium in the series.', ['Magnesium is above carbon in the series.', 'Carbon can only take oxygen from metals less reactive than itself, so it cannot reduce magnesium oxide.']),
  extract.choice('C24-11', 'Why is gold often found in the ground as the metal itself?', ['It is very reactive, so it is easy to find', 'It reacts with oxygen to make an ore', 'It is a gas in the ground', 'It is so unreactive that it does not react to form compounds'], 3, 'Think about where gold sits in the reactivity series.', ['Gold is very unreactive.', 'It does not react with oxygen in the ground, so it stays as the metal.']),
  extract.choice('C24-12', 'In the diagram, which numbered metal is the most reactive one that carbon can extract?', ['Metal 1', 'Metal 2', 'Metal 3', 'Metal 4'], 2, 'Carbon can only extract metals below it. Which numbered metal is highest among those?', ['Metals 1 and 2 are above carbon, so carbon cannot extract them.', 'Metals 3 and 4 are below carbon, and metal 3 is higher, so it is the most reactive one carbon can extract.'], 'application', true, 'react-question-series'),
  extract.choice('C24-13', 'A student heats four metal oxides with carbon, as the table shows. Which conclusion do these data support?', ['P is more reactive than carbon', 'Q is more reactive than carbon', 'R and S are equally reactive', 'Q is less reactive than carbon'], 1, 'What does "no change" tell you about carbon and that metal?', ['Carbon did not take the oxygen from Q oxide or S oxide, so Q and S are more reactive than carbon.', 'Carbon did take the oxygen from P oxide and R oxide, so those metals are less reactive than carbon.'], 'dataInterpretation', true, 'react-question-data'),
  extract.choice('C24-14', 'Lithium oxide is heated with carbon and nothing happens. What is the best explanation?', ['Lithium is not a metal', 'Lithium is less reactive than carbon', 'The carbon has already been oxidised', 'Lithium is more reactive than carbon, so carbon cannot take its oxygen'], 3, 'Is lithium above or below carbon in the series?', ['Lithium is above carbon, so it holds on to its oxygen more strongly.', 'Carbon can only reduce oxides of metals below it.'], 'explanation', true),
  redox.choice('C24-15', 'Zinc oxide is reduced by carbon. Which balanced equation is correct?', ['2ZnO + C → 2Zn + CO₂', 'ZnO + C → Zn + CO₂', '2ZnO + C → Zn + 2CO₂', 'ZnO + 2C → Zn + CO₂'], 0, 'Count the oxygen atoms on each side. Carbon dioxide has two.', ['Two ZnO give 2 oxygen atoms, which is exactly what one CO₂ needs.', '2ZnO + C → 2Zn + CO₂ has 2 Zn, 2 O and 1 C on each side.'], 'application', true),
  extract.written('C24-16', 'Explain why iron can be extracted from iron oxide using carbon, but sodium cannot.', 'Compare where iron, carbon and sodium sit in the series. Then say what carbon does to the oxide.', 'Iron is below carbon in the reactivity series, so carbon is more reactive than iron. Carbon can take the oxygen from iron oxide, so iron oxide is reduced and carbon is oxidised. Sodium is above carbon, so carbon is not reactive enough to take its oxygen. Sodium has to be extracted by electrolysis, which is expensive because of the energy needed.', ['Iron is less reactive than carbon (below it in the series).', 'Carbon takes the oxygen from iron oxide, so the iron oxide is reduced (and the carbon is oxidised).', 'Sodium is more reactive than carbon (above it in the series).', 'So carbon cannot take the oxygen from sodium oxide.', 'Sodium is extracted by electrolysis instead, which is expensive because it uses a lot of energy.'], ['Saying carbon is more reactive than iron but not linking this to taking the oxygen.', 'Saying reduction is gaining oxygen.', 'Saying sodium cannot be extracted at all.']),
]

export const lessonC24: ScienceLesson = {
  id: 'C-CHG-024-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'The reactivity series and extracting metals', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
