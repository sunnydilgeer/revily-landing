import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { resourceFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.1.1 Using the Earth’s resources and obtaining potable water (natural resources, agriculture, finite and renewable resources, reading a table of resource data), as on the supplied revision page' }
const skill = 'C-RESOURCES'
const natural = author(skill, ['5.10.1.1'], ['aqa-chemistry'])
const kinds = author(skill, ['5.10.1.1'], ['aqa-chemistry'])
const table = author(skill, ['5.10.1.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const resourceSections = [
  { id: 'C49-01', label: 'Start here', detail: 'What grows back?' },
  { id: 'C49-02', label: 'What are natural resources?', detail: 'Uses, replacements and farming' },
  { id: 'C49-05', label: 'Renewable or finite?', detail: 'Replaced quickly, or used up' },
  { id: 'C49-08', label: 'Can you read the table?', detail: 'Forming times and 10⁶' },
  { id: 'C49-11', label: 'On your own', detail: 'Sort, read and explain' },
]

const states: ScienceState[] = [
  { ...natural.choice('C49-01', 'A wood is cut down for timber and new trees are planted. Which resource can grow back within a few years?', ['Coal', 'Crude oil', 'Iron ore', 'Timber from planted trees'], 3, 'Think about which one is alive and can be replanted.', ['Trees can be planted and regrow in a few years.', 'Coal, oil and ore take a very long time to form, or do not form again at all.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(natural, 'C49-02', 'What are natural resources?'),
  natural.choice('C49-03', 'What is a natural resource?', ['Anything made in a factory', 'A material made only by chemists', 'Anything that comes from the Earth, the sea or the air', 'Anything that can never run out'], 2, 'Think about where the resource starts.', ['A natural resource comes from the Earth, the sea or the air.', 'Many natural resources can run out, so that last option is wrong.'], 'recall'),
  natural.choice('C49-04', 'Why do farmers use fertilisers?', ['To make crops taste sweeter', 'To grow more crop in the same area', 'To replace natural rubber', 'To stop crops needing water'], 1, 'Fertilisers give plants something they need.', ['Fertilisers add chemicals that plants need.', 'This lets farmers increase the amount of crop grown in a given area.']),
  t(kinds, 'C49-05', 'Renewable or finite?'),
  kinds.choice('C49-06', 'Which statement describes a finite resource?', ['It is remade slowly, or not at all, so it will eventually run out', 'It can be remade as fast as we use it', 'It is always made by humans', 'It can be used without ever being processed'], 0, 'Finite means there is a limit.', ['A finite resource is remade slowly or not at all.', 'We use it up faster than it forms, so it will eventually run out.']),
  kinds.choice('C49-07', 'Which of these is a finite resource?', ['Food', 'Timber', 'Water', 'Fossil fuels'], 3, 'Think about which ones take millions of years to form.', ['Fossil fuels, nuclear fuels, metals and minerals are finite.', 'Food, timber and water can be replaced fairly quickly.'], 'recall'),
  t(table, 'C49-08', 'Can you read the table?'),
  table.choice('C49-09', 'A table gives the forming time of three resources: A, 40 days; B, 10⁶ years; C, 15 years. Which is finite?', ['A', 'C', 'B', 'All three'], 2, 'Look for the far longest time.', ['10⁶ years is one million years, much longer than the others.', 'A resource that forms that slowly cannot be replaced quickly, so B is finite.'], 'dataInterpretation', false, 'resource-q-table-guided'),
  table.choice('C49-10', 'What does 10⁶ mean?', ['1 000 000', '10 × 6', '106', '60'], 0, 'It is a short way to write a very big number.', ['In standard form, 10⁶ means 1 000 000.', 'So 10⁶ years is one million years.'], 'recall'),
  natural.choice('C49-11', 'Natural rubber comes from the sap of trees. Which change shows a natural product being replaced by a man-made one?', ['Planting more rubber trees', 'Collecting sap earlier in the day', 'Washing rubber before use', 'Using polymers to make some tyres instead'], 3, 'Look for something made by chemists.', ['Polymers are man-made.', 'They can replace some natural rubber, for example in tyres.'], 'application', true),
  table.choice('C49-12', 'Forming times: resource X, 3 months; resource Y, 10⁷ years; resource Z, 25 years. Which resource is finite?', ['X', 'Z', 'All three', 'Y'], 3, 'Look for the far longest time.', ['10⁷ years is ten million years.', 'Y forms far too slowly to be replaced, so it is finite.'], 'dataInterpretation', true, 'resource-q-table'),
  kinds.choice('C49-13', 'Which pair contains only renewable resources?', ['Timber and food', 'Coal and timber', 'Metals and water', 'Crude oil and food'], 0, 'Remember: renewable means it can be replaced fairly quickly.', ['Timber and food can be regrown quickly.', 'Coal, metals and crude oil are finite.'], 'understanding', true),
  natural.choice('C49-14', 'A metal ore is reduced to give a pure metal. What does this show about finite resources?', ['They can never be used', 'They can be processed into useful materials', 'They turn into renewable resources', 'They form again in a few days'], 1, 'Think about what processing does.', ['Finite resources can be processed to make the materials modern life needs.', 'Processing does not make them renewable.'], 'understanding', true),
  kinds.written('C49-15', 'A table shows wood takes 30 years to form and coal takes 10⁶ years. Explain which is renewable and which is finite.', 'Compare how long each takes to form.', 'Wood is renewable because it takes only about 30 years to form, so trees can be planted and regrow fairly quickly. Coal is finite because it takes 10⁶ years, one million years, to form. We use coal up faster than it forms, so it will eventually run out.', ['Wood is renewable and coal is finite.', 'Wood takes much less time to form than coal.', '10⁶ years means one million years.', 'A renewable resource can be replaced as fast as we use it.', 'A finite resource is used faster than it forms, so it will run out.'], ['Saying renewable resources can never be used up under any circumstances.', 'Saying coal is renewable because it is natural.', 'Reading 10⁶ as 106.']),
]

export const lessonC49: ScienceLesson = {
  id: 'C-RES-049-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Finite and renewable resources', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
