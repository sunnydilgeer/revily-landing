import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { potableFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.1.2 Potable water (potable versus pure, sources of fresh water, desalination, filtration and sterilisation), as on the supplied revision page' }
const skill = 'C-POTABLE-WATER'
const meaning = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const sources = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const salt = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const treat = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const potableSections = [
  { id: 'C53-01', label: 'Start here', detail: 'Which water is safe to drink?' },
  { id: 'C53-02', label: 'What is potable water?', detail: 'Safe to drink, but not pure' },
  { id: 'C53-05', label: 'Where does it come from?', detail: 'Surface water, ground water, sea water' },
  { id: 'C53-08', label: 'What if there is only sea water?', detail: 'Desalination' },
  { id: 'C53-11', label: 'How is fresh water treated?', detail: 'Filtration and sterilisation' },
  { id: 'C53-14', label: 'On your own', detail: 'Choosing and describing treatments' },
]

const states: ScienceState[] = [
  { ...meaning.choice('C53-01', 'A hiker finds a clear stream. Why is it not safe to assume the water is fine to drink?', ['Clear water can never contain anything harmful', 'Clear water can still hold microbes that make you ill', 'Streams always contain salt', 'Water from rivers is always polluted with oil'], 1, 'Clear does not mean safe.', ['Water can look clean and still contain bacteria or other microbes.', 'Drinking water has to be made safe, not just made to look clear.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'C53-02', 'What is potable water?'),
  meaning.choice('C53-03', 'What does potable water mean?', ['Water containing only H₂O', 'Water that is safe for humans to drink', 'Water taken from the sea', 'Water that has been boiled dry'], 1, 'The word tells you what you can do with it.', ['Potable water is water that is safe for humans to drink.', 'It is not the same as pure water, which contains only H₂O.'], 'recall'),
  meaning.choice('C53-04', 'Which statement about potable water is correct?', ['It can contain dissolved substances at safe levels', 'It must contain only H₂O', 'It must have a pH of exactly 7', 'It must contain no dissolved substances at all'], 0, 'Potable and pure are not the same thing.', ['Potable water can contain other dissolved substances, as long as they are safe.', 'Its pH must be between 6.5 and 8.5, so it does not have to be exactly 7.'], 'understanding'),
  t(sources, 'C53-05', 'Where does it come from?'),
  sources.choice('C53-06', 'Which of these is a source of ground water?', ['A reservoir', 'A river', 'A lake', 'Water trapped in rocks underground'], 3, 'Ground water is found below the surface.', ['Ground water collects in rocks that trap water underground.', 'Lakes, rivers and reservoirs are surface water.'], 'recall'),
  sources.choice('C53-07', 'In the UK, why does the south-east get most of its water from ground water?', ['Surface water tends to dry up first in warmer areas', 'It never rains there', 'Ground water is salty', 'Reservoirs are not allowed'], 0, 'Think about which source dries up first.', ['Surface water tends to dry up first, and warmer areas dry up sooner.', 'So the water supply there relies more on ground water.']),
  t(salt, 'C53-08', 'What if there is only sea water?'),
  salt.choice('C53-09', 'What is desalination?', ['Adding salt to fresh water', 'Removing dissolved salt from sea water', 'Killing microbes with chlorine', 'Collecting rainwater'], 1, 'The word starts with "de", meaning take away.', ['Desalination removes the dissolved salt from sea water.', 'This makes the water suitable to drink.'], 'recall'),
  salt.choice('C53-10', 'Why are distillation and reverse osmosis not used when other fresh water is available?', ['They make the water too pure to drink', 'They use up all the salt in the sea', 'They use lots of energy, so they are expensive', 'They cannot remove salt'], 2, 'Think about the running cost.', ['Both methods need lots of energy to work.', 'That makes them expensive, so they are used only when needed.']),
  t(treat, 'C53-11', 'How is fresh water treated?'),
  treat.choice('C53-12', 'Which step catches tiny solid bits using grains of sand and gravel?', ['Sterilisation', 'Passing through a wire mesh', 'Bubbling with chlorine', 'Filter beds'], 3, 'The beds are made from grains.', ['Filter beds are made from sand and gravel.', 'Tiny bits of solid are caught by the grains.'], 'recall'),
  treat.choice('C53-13', 'What is the purpose of sterilising water?', ['To remove twigs', 'To kill harmful bacteria and other microbes', 'To remove all dissolved salts', 'To raise the pH to 14'], 1, 'Think about what could make you ill.', ['Sterilising kills harmful bacteria and other microbes.', 'It can use chlorine gas, ozone or ultraviolet light.']),
  treat.choice('C53-14', 'A town has a lake, but the water contains twigs and bacteria. Which treatments should be used, and in which order?', ['Filtration, then sterilisation', 'Sterilisation, then reverse osmosis', 'Distillation only', 'Adding salt, then filtering'], 0, 'Remove the solids, then kill the microbes.', ['Filtration removes twigs and other solid bits.', 'Sterilisation then kills the bacteria. Desalination is not needed as the lake water is fresh.'], 'application', true, 'potable-q-flow'),
  sources.choice('C53-15', 'A dry country has no rivers, lakes or ground water, but a long coast. Which source of potable water is most likely?', ['Rainwater from a reservoir', 'Sea water that is desalinated', 'Ground water in the south-east of the UK', 'Filter beds without any water'], 1, 'Only one water source is left.', ['With no fresh water available, sea water is used.', 'It has to be desalinated first because it has too much dissolved salt.'], 'application', true),
  meaning.choice('C53-16', 'Bottled drinking water contains dissolved minerals. A student says it is potable but not pure. Are they right?', ['No, potable water must be pure', 'No, water with minerals cannot be safe', 'Yes, it is safe to drink but contains more than H₂O', 'Yes, but only if its pH is 7'], 2, 'Compare "safe to drink" with "only H₂O".', ['Potable means safe to drink.', 'Water with safe dissolved minerals is potable, but it is not pure because it contains more than H₂O.'], 'understanding', true),
  treat.written('C53-17', 'Describe the steps used to treat fresh water to make it potable.', 'Two stages: filtration, then sterilisation.', 'The water is passed through a wire mesh, which stops large things such as twigs. It then goes through filter beds made from sand and gravel, which catch other solid bits. Finally it is sterilised, using chlorine, ozone or ultraviolet light, to kill any harmful bacteria or other microbes.', ['Passed through a wire mesh to remove large objects such as twigs.', 'Filter beds of sand and gravel remove other small solid bits.', 'Sterilised to kill bacteria and other microbes.', 'Names one method of sterilising: chlorine, ozone or ultraviolet light.'], ['Saying distillation is used to treat all fresh water.', 'Saying sterilisation removes solid bits.', 'Saying potable water has to be pure.']),
]

export const lessonC53: ScienceLesson = {
  id: 'C-RES-053-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Potable water', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
