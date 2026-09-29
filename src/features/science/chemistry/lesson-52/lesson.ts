import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { lcaCompareFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.2.1 Life cycle assessment (carrying out and interpreting LCAs, comparing them, and the limitations and possible bias of LCAs), as on the supplied revision page' }
const skill = 'C-LCA-COMPARE'
const compare = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const conclude = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const problems = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const lcaCompareSections = [
  { id: 'C52-01', label: 'Start here', detail: 'Which bag is better?' },
  { id: 'C52-02', label: 'Comparing two bags', detail: 'Plastic and paper, stage by stage' },
  { id: 'C52-05', label: 'Reaching a conclusion', detail: 'Weighing up the evidence' },
  { id: 'C52-08', label: 'Problems with LCAs', detail: 'Judgement and bias' },
  { id: 'C52-11', label: 'On your own', detail: 'Read data, spot bias, explain' },
]

const states: ScienceState[] = [
  { ...compare.choice('C52-01', 'A shop wants to know whether paper bags or plastic bags are better for the environment. What should it compare?', ['Which bag looks nicer', 'Information about every stage of each bag’s life', 'Only the price of the bags', 'Which bag is bigger'], 1, 'Think about what an LCA covers.', ['An LCA covers every stage of a product’s life.', 'Comparing the stages for both bags shows which affects the environment less.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(compare, 'C52-02', 'Comparing two bags'),
  compare.choice('C52-03', 'Which raw material is used to make a paper bag?', ['Wood', 'Crude oil', 'Sand', 'Iron ore'], 0, 'Paper comes from trees.', ['A paper bag starts as wood, which is turned into pulp.', 'A plastic bag starts as crude oil instead.'], 'recall'),
  compare.choice('C52-04', 'What does biodegradable mean?', ['Can be reused several times', 'Made from crude oil', 'Cannot be recycled', 'Can be broken down naturally by microorganisms'], 3, 'Bio means living things.', ['Microorganisms are tiny living things such as bacteria.', 'Biodegradable things are broken down naturally by them.'], 'recall'),
  t(conclude, 'C52-05', 'Reaching a conclusion'),
  conclude.choice('C52-06', 'Why might a plastic bag be less harmful overall, even though it is not usually biodegradable?', ['It is made from wood', 'It breaks down quickly in landfill', 'It takes less energy to make and can be reused several times', 'It is never thrown away'], 2, 'Think about energy and lifespan.', ['Plastic bags take less energy to make.', 'They also have a longer lifespan, because they can be reused.']),
  conclude.choice('C52-07', 'Bag X takes lots of energy and is used once. Bag Y takes little energy and is reused. Which is less harmful?', ['Bag X', 'Bag Y', 'They must be the same', 'Neither, because bags are not part of an LCA'], 1, 'Compare the energy and the number of uses.', ['Bag Y needs less energy and gets more uses.', 'Less energy and more uses point to less harm overall.'], 'application'),
  t(problems, 'C52-08', 'Problems with LCAs'),
  problems.choice('C52-09', 'Which effect of a product is easy to measure and give a number for in an LCA?', ['The energy used to make it', 'How unattractive litter looks', 'How much people like the advert', 'How pleasing the shape is'], 0, 'Look for the one you can measure with units.', ['Energy used, resources used and waste made can all be measured.', 'How something looks needs a personal judgement.'], 'understanding'),
  problems.choice('C52-10', 'Why could two people carrying out the same LCA get different results?', ['Raw materials change colour', 'Measuring energy is impossible', 'LCAs contain no facts at all', 'Some effects need a personal judgement, so the person doing it can affect the result'], 3, 'Think about effects that are hard to measure.', ['Some effects are hard to measure, so the person has to use their own judgement.', 'That means the results can change depending on who does the assessment.']),
  { ...compare.choice('C52-11', 'Look at the table. Which statement is supported by the information given?', ['Cup P is better in every way', 'Cup P can be used 40 times', 'Cup Q needs more energy to make but is used many more times', 'Cup Q is biodegradable'], 2, 'Read the energy row and the uses row.', ['Cup Q needs 8 units of energy and Cup P needs 3.', 'Cup Q is used 40 times and Cup P once. The table says nothing about biodegradable.'], 'dataInterpretation', true, 'lcause-q-table') },
  problems.choice('C52-12', 'A company publishes an LCA that shows only the good points of its product. What is the problem?', ['LCAs cannot use numbers', 'It is selective, so it may be biased in the company’s favour', 'The product must be harmless', 'The LCA is too accurate'], 1, 'Think about what is left out.', ['A selective LCA shows only some of a product’s impacts.', 'It can be written to support the company’s claims, so it can be biased.'], 'understanding', true),
  compare.choice('C52-13', 'Which is the best way to compare two products using LCAs?', ['Compare information from all four stages of both products', 'Compare only the stage where the product is used', 'Compare only the stage where it is thrown away', 'Compare only the raw materials'], 0, 'A fair comparison needs the whole life.', ['Each product has good and bad points at different stages.', 'Looking at all four stages for both products lets you weigh them up fairly.'], 'understanding', true),
  problems.choice('C52-14', 'A student compares two bags but only uses facts that support the bag they like. What does this do to the conclusion?', ['It makes it fairer', 'It makes no difference', 'It makes it more accurate', 'It makes it biased, because it favours one view not backed by all the facts'], 3, 'Think about what bias means.', ['Bias favours one point of view in a way that is not backed up by facts.', 'Using only some of the facts makes the conclusion biased.'], 'understanding', true),
  compare.written('C52-15', 'Explain how a plastic bag and a paper bag could be compared using LCAs. Give one reason the conclusion might be biased.', 'Compare stage by stage, then think about judgement or selective facts.', 'To compare the bags, you look at the LCA information for each stage of their lives: raw materials, manufacture and packaging, use and disposal. You then weigh up the good and bad points and pick the bag that affects the environment the least overall. For example, a plastic bag may take less energy to make and can be reused, while a paper bag is biodegradable. The conclusion could be biased because some effects, such as how unattractive litter looks, need the assessor’s own judgement, or because a company might show only the impacts that support its claims.', ['Compares the bags at each of the four stages.', 'Weighs up good and bad points to pick the least harmful overall.', 'Gives at least one correct stage comparison, such as energy to make or reuse.', 'Gives a reason for bias: personal judgement, or selective impacts to support a company.'], ['Saying one bag is best without any stage evidence.', 'Saying that LCAs are always accurate and never biased.', 'Saying plastic bags are biodegradable.']),
]

export const lessonC52: ScienceLesson = {
  id: 'C-RES-052-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Comparing life cycle assessments', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
