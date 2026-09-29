import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { sewageFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.1.3 Waste water treatment (sources of waste water, screening, sedimentation, aerobic and anaerobic digestion, extra treatment for toxic waste water), as on the supplied revision page' }
const skill = 'C-SEWAGE'
const why = author(skill, ['5.10.1.3'], ['aqa-chemistry'])
const route = author(skill, ['5.10.1.3'], ['aqa-chemistry'])
const digest = author(skill, ['5.10.1.3'], ['aqa-chemistry'])
const compare = author(skill, ['5.10.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const sewageSections = [
  { id: 'C55-01', label: 'Start here', detail: 'Where the bath water goes' },
  { id: 'C55-02', label: 'Why treat waste water?', detail: 'Sources and pollutants' },
  { id: 'C55-05', label: 'Screening and sedimentation', detail: 'The first two stages' },
  { id: 'C55-08', label: 'Aerobic and anaerobic digestion', detail: 'Bacteria do the cleaning' },
  { id: 'C55-11', label: 'Extra treatment and trade-offs', detail: 'Energy, toxic waste and opinion' },
  { id: 'C55-13', label: 'On your own', detail: 'Stages and their jobs' },
]

const states: ScienceState[] = [
  { ...why.choice('C55-01', 'You pull the plug out of a bath and the water runs away. What has to happen to it before it goes back into a river?', ['Nothing, it is already clean', 'It is treated to remove pollutants first', 'It is boiled and left to cool', 'It is poured on the sea unchanged'], 1, 'Think about what the water has picked up.', ['Used water carries dirt, waste and microbes.', 'It is treated first, so that it does not harm the river or people.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(why, 'C55-02', 'Why treat waste water?'),
  why.choice('C55-03', 'Which of these gives waste water that needs treating?', ['Rain falling on a mountain', 'Washing-up and flushing toilets in homes', 'A sealed bottle of water', 'Ice in a freezer'], 1, 'Think about water that has been used.', ['Waste water is water that has been used and is now dirty.', 'Homes make it every day, and so do farms and factories.']),
  why.choice('C55-04', 'Why is waste water treated before it goes back into rivers and lakes?', ['To make the river salty', 'To turn the river into fertiliser', 'To remove pollutants that could cause health problems', 'To make the water heavier'], 2, 'Think about what is in the water.', ['Waste water holds organic matter and harmful microbes.', 'Removing them means the water does not cause health problems.'], 'recall'),
  t(route, 'C55-05', 'Screening and sedimentation'),
  route.choice('C55-06', 'What does screening remove from sewage?', ['Bacteria and viruses', 'Dissolved oxygen', 'Methane gas', 'Large bits, such as twigs and plastic bags, and grit'], 3, 'It is the first stage, and it catches solid things.', ['Screening removes large bits of material and grit.', 'Grit is small bits of stone and sand.'], 'recall'),
  route.choice('C55-07', 'In sedimentation, what happens to the heavier solids in the sewage?', ['They sink to the bottom as sludge', 'They float on top as effluent', 'They are burned', 'They dissolve in the water'], 0, 'Heavy things sink.', ['The heavier solids sink and form sludge.', 'The lighter liquid, called effluent, floats on top.']),
  t(digest, 'C55-08', 'Aerobic and anaerobic digestion'),
  digest.choice('C55-09', 'The word aerobic describes a process that happens...', ['without oxygen', 'with oxygen', 'without water', 'with methane'], 1, 'Look at the start of the word: aero is about air.', ['Aerobic means with oxygen.', 'Anaerobic means without oxygen.'], 'recall'),
  digest.choice('C55-10', 'What happens to the effluent in aerobic digestion?', ['It is turned into sludge', 'It is burned as a fuel', 'Bacteria break down the organic matter and other microbes in it', 'It is used as fertiliser'], 2, 'Bacteria do the work, and they use oxygen.', ['Bacteria use oxygen to break down organic matter.', 'They also break down other microbes in the water.']),
  t(compare, 'C55-11', 'Extra treatment and trade-offs'),
  compare.choice('C55-12', 'Waste water from a factory contains toxic substances. What might the extra stages include?', ['Adding more sludge', 'Boiling it and letting it evaporate', 'Only screening again', 'Adding chemicals, using UV radiation or using membranes'], 3, 'Think of the three extra treatments on the last screen.', ['Toxic waste water needs extra stages.', 'They may include adding chemicals, UV radiation or membranes.']),
  route.choice('C55-13', 'Look at the sewage treatment plant. Which number shows the stage where bacteria use oxygen to break down organic matter in the effluent?', ['Number 2', 'Number 3', 'Number 4', 'Number 1'], 1, 'Follow the effluent, not the sludge.', ['Effluent goes on to the tank where bacteria use oxygen.', 'That stage is number 3.'], 'application', true, 'sewage-q-plant'),
  route.choice('C55-14', 'A plastic bag and a twig arrive at the sewage works. Which stage removes them?', ['Sedimentation', 'Aerobic digestion', 'Screening', 'Anaerobic digestion'], 2, 'They are large bits and it is the first stage.', ['Large bits such as twigs and plastic bags are caught on a screen.', 'That stage is screening.'], 'application', true),
  digest.choice('C55-15', 'Bacteria break down the sludge without oxygen. What is made, and what is one use for it?', ['Methane gas, used as an energy source', 'Oxygen, used to feed the bacteria', 'Sand, used as fertiliser', 'Grit, used to cook food'], 0, 'One product is a fuel gas.', ['Anaerobic digestion of sludge makes methane gas.', 'Methane can be used as an energy source, for example for cooking.'], 'understanding', true),
  compare.choice('C55-16', 'A town has very little fresh water. Which statement gives a correct reason to consider treating waste water for reuse?', ['It has fewer stages than treating fresh water', 'It needs no treatment before it is released', 'It uses more energy than desalinating salt water', 'It uses less energy than desalinating salt water'], 3, 'Compare it with desalination.', ['Treating waste water has more stages than treating fresh water.', 'It uses less energy than desalination, so it could be an option, although some people dislike the idea.'], 'understanding', true),
  why.written('C55-17', 'Describe what happens to waste water in a sewage treatment plant, in order, and say what is made from the sludge.', 'Screening, sedimentation, then the two digestions.', 'First the sewage is screened to remove large bits and grit. In sedimentation the heavier solids sink as sludge and the lighter effluent floats on top. The effluent is treated by aerobic digestion, where bacteria with oxygen break down organic matter and microbes, and is then released into the environment. The sludge is broken down by anaerobic digestion, without oxygen. This makes methane, which can be used as an energy source, and the remaining waste can be used as fertiliser.', ['Screening removes large bits and grit.', 'Sedimentation: heavier solids sink as sludge and effluent floats on top.', 'Effluent goes to aerobic digestion (bacteria, with oxygen) and is then released.', 'Sludge goes to anaerobic digestion (without oxygen).', 'Methane is made and used as an energy source; the remaining waste is used as fertiliser.'], ['Saying that the sludge is released into the river.', 'Mixing up aerobic and anaerobic.', 'Saying that the water is distilled.']),
]

export const lessonC55: ScienceLesson = {
  id: 'C-RES-055-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Waste water treatment', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
