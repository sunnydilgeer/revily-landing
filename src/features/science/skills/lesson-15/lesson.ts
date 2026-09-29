import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsPhCellFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 1 (measuring pH), AT 7 (using a microscope to measure cell size), as on the supplied revision page' }
const skill = 'W-PRC-015-W'
const a = author(skill, ['AT 1', 'AT 7'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsPhCellSections = [
  { id: 'W15-01', label: 'Start here', detail: 'Acid or alkali?' },
  { id: 'W15-02', label: 'How do you measure pH?', detail: 'Indicators, paper and probes' },
  { id: 'W15-06', label: 'How big is a cell?', detail: 'Count cells along 1 mm' },
  { id: 'W15-10', label: 'On your own', detail: 'Choosing methods and calculating size' },
]

const states: ScienceState[] = [
  { ...a.choice('W15-01', 'You have a colourless solution and want to know whether it is an acid or an alkali. What could you do?', ['Weigh it', 'Measure its volume', 'Add a couple of drops of indicator and watch the colour', 'Time how long it takes to pour'], 2, 'You need something that changes colour.', ['An indicator changes colour depending on whether the solution is acid or alkali.', 'Weighing or timing tells you nothing about acidity.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W15-02', 'How do you measure pH?'),
  a.choice('W15-03', 'Which one lets you estimate a pH number from a gradual colour change?', ['Universal indicator', 'Litmus paper', 'A thermometer', 'A measuring cylinder'], 0, 'The colour changes gradually rather than suddenly.', ['Universal indicator changes colour gradually as the pH changes.', 'Litmus paper only shows red for acid and blue for alkali.'], 'understanding'),
  a.choice('W15-04', 'A solution is already strongly coloured. Which method is most useful for testing it?', ['Adding lots of indicator solution', 'Indicator paper', 'Filtering the solution', 'Diluting it with a lot of water'], 1, 'You do not want to change the colour of the whole solution.', ['Indicator paper only changes colour in the small spot you test.', 'Adding a lot of dye would spoil a coloured solution.'], 'application'),
  a.choice('W15-05', 'Which is the most accurate way to measure pH?', ['Litmus paper', 'Universal indicator', 'Indicator paper', 'A pH probe'], 3, 'Think about the electronic method.', ['A pH probe measures electronically and shows a number.', 'It is more accurate than any indicator.'], 'understanding'),
  t('W15-06', 'How big is a cell?'),
  a.worked('W15-07', 'Find the length of one cell', 'Under a microscope, 5 cells fit along 1 mm of a ruler. What is the length of one cell, in µm?', ['1 mm is the same as 1000 µm.', 'Length of a cell (µm) = 1000 µm ÷ number of cells counted.', 'Length = 1000 ÷ 5 = 200.', 'One cell is 200 µm long.'], 'wsphcell-worked-cell'),
  a.choice('W15-08', 'Under a microscope, 8 cells fit along 1 mm. What is the length of one cell?', ['12.5 µm', '125 µm', '8000 µm', '1008 µm'], 1, 'Share 1000 µm between the 8 cells.', ['Length = 1000 ÷ 8 = 125 µm.', 'Do not multiply. Sharing 1000 µm between cells gives a smaller number.'], 'calculation'),
  a.choice('W15-09', 'In tissue A, 5 cells fit along 1 mm. In tissue B, 10 cells fit along 1 mm. Which cells are bigger?', ['Tissue B cells, because there are more', 'They are the same size', 'You cannot tell', 'Tissue A cells, because fewer fit along 1 mm'], 3, 'Bigger cells mean fewer of them fit into the same 1 mm.', ['Tissue A cells are 200 µm and tissue B cells are 100 µm.', 'Fewer cells in 1 mm means each cell is bigger.'], 'dataInterpretation'),
  a.choice('W15-10', 'Under a microscope, 20 cells fit along 1 mm. What is the length of one cell?', ['50 µm', '20 000 µm', '5 µm', '500 µm'], 0, 'Divide 1000 µm by the number of cells.', ['Length = 1000 ÷ 20 = 50 µm.', 'The answer is in µm, because 1 mm is 1000 µm.'], 'calculation', true),
  a.choice('W15-11', 'Look at the cells lined up along 1 mm of the ruler. What is the length of one cell?', ['10 µm', '1000 µm', '100 µm', '1010 µm'], 2, 'Count the cells along the 1 mm, then divide 1000 µm by that number.', ['There are 10 cells along the 1 mm.', 'Length = 1000 ÷ 10 = 100 µm.'], 'calculation', true, 'wsphcell-q-cells'),
  a.choice('W15-12', 'A student needs a very accurate pH for a pond water sample. What should they use?', ['Litmus paper', 'Universal indicator', 'A pH probe', 'Indicator paper'], 2, 'Accurate means the reading is close to the true pH.', ['A pH probe is more accurate than an indicator.', 'Indicators are useful, but they only give a colour to match.'], 'practicalReasoning', true),
  a.choice('W15-13', 'A student wants to find out whether the gas from a reaction is acidic. What could they do?', ['Hold damp indicator paper in a sample of the gas', 'Weigh the gas on a balance', 'Put a ruler in the gas', 'Measure the gas with a thermometer'], 0, 'Think about a strip that changes colour.', ['Damp indicator paper can be held in a gas sample.', 'It changes colour to show whether the gas is acidic or alkaline.'], 'practicalReasoning', true),
  a.written('W15-14', 'Describe how to measure the size of one cell under a microscope, using a clear ruler.', 'Think about the set-up, the counting and the calculation.', 'I would place a clear ruler on the slide and clip both onto the stage. I would use a lens that gives ×100 magnification and focus until the cells are clear. I would line the cells up along 1 mm and count them. Then I would divide 1000 µm by the number of cells to find the length of one cell.', ['Place a clear ruler on the slide and clip both to the stage.', 'Focus so the cells are clear.', 'Line the cells up along 1 mm and count them.', 'Divide 1000 µm by the number of cells.'], ['Multiplying instead of dividing.', 'Leaving out the unit µm.', 'Counting cells across a different length from 1 mm.']),
]

export const lessonW15: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Measuring pH and the size of a cell', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
