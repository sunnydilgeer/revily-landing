import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsHeatFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'AT 2 and AT 3 (heating substances, Bunsen burners, water baths and electric heaters), as on the supplied revision page' }
const skill = 'W-PRC-019-W'
const a = author(skill, ['AT 2', 'AT 3'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsHeatSections = [
  { id: 'W19-01', label: 'Start here', detail: 'A lit burner that is not in use' },
  { id: 'W19-02', label: 'How do you use a Bunsen burner?', detail: 'Lighting, flame colours and the air hole' },
  { id: 'W19-05', label: 'How do you hold what you heat?', detail: 'Tongs, tripod, gauze and flammables' },
  { id: 'W19-08', label: 'When is a set temperature better?', detail: 'Water baths and electric heaters' },
  { id: 'W19-11', label: 'On your own', detail: 'Choosing a safe way to heat' },
]

const states: ScienceState[] = [
  { ...a.choice('W19-01', 'A Bunsen burner is lit but nothing is being heated. Which flame is safest to leave?', ['A blue flame with the hole fully open', 'A flame with the gas turned right up', 'A flame that is hard to see', 'A yellow flame, made by closing the hole'], 3, 'Think about a flame that people can see easily.', ['A closed hole gives a yellow flame.', 'A yellow flame is easy to see, so people do not walk into it by mistake.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W19-02', 'How do you use a Bunsen burner?'),
  a.choice('W19-03', 'Which step comes when you light a Bunsen burner?', ['Turn on the gas, then look for a splint', 'Open the air hole fully, then turn on the gas', 'Hold a lit splint over the burner, then turn on the gas', 'Turn on the gas and wait for it to light'], 2, 'The flame must be ready before the gas arrives.', ['You light a splint and hold it over the burner first.', 'Then you turn on the gas, so it lights straight away.'], 'recall'),
  a.choice('W19-04', 'A student opens the air hole of a lit Bunsen burner. What happens to the flame?', ['It turns blue and gets hotter', 'It turns yellow and gets hotter', 'It turns blue and gets cooler', 'It goes out'], 0, 'More air means a hotter flame.', ['The more open the hole, the hotter the flame.', 'An open hole makes the flame blue.'], 'understanding'),
  t('W19-05', 'How do you hold what you heat?'),
  a.choice('W19-06', 'A student is heating a small tube of solution in the flame. How should they hold it?', ['With their fingers near the bottom', 'Leaning it on the gauze', 'With tongs near the top', 'With a tissue at the bottom'], 2, 'Keep your hands away from the heat.', ['Tongs hold the tube near the top, well away from the flame.', 'Fingers or tissue could be burned or catch fire.']),
  a.choice('W19-07', 'A student will heat a beaker over a Bunsen burner. When should the tripod and gauze go in place?', ['After lighting the burner', 'Before lighting the burner', 'Only after the beaker is hot', 'The beaker should go straight in the flame'], 1, 'You should not reach over a lit flame.', ['Put the tripod and gauze in place before you light the burner.', 'Then you do not have to reach over a lit flame.'], 'practicalReasoning'),
  t('W19-08', 'When is a set temperature better?'),
  a.choice('W19-09', 'Why can a water bath not be used to heat something to 150 °C?', ['Water is too cold to do this', 'The bath is too small', 'Water has no heat', 'Water boils at 100 °C'], 3, 'Think about what happens to water at 100 °C.', ['Water boils at 100 °C, so a water bath cannot go higher.', 'An electric heater can reach higher temperatures.'], 'understanding'),
  a.choice('W19-10', 'A student heats a solution on an electric hot plate. What should they do to heat it evenly?', ['Cover it with a lid', 'Leave it alone', 'Open the air hole', 'Stir it'], 3, 'The plate heats only the bottom of the container.', ['A hot plate heats the bottom of the container.', 'Stirring spreads the heat through the substance.'], 'application'),
  a.choice('W19-11', 'A student needs to warm ethanol, which is flammable. Which is the safest way?', ['Hold it in the Bunsen flame with tongs', 'Heat it in a water bath', 'Stand it on a tripod over the flame', 'Heat it with the air hole open'], 1, 'A naked flame could set a flammable liquid alight.', ['A Bunsen flame could set the ethanol on fire.', 'A water bath heats gently and has no flame.'], 'application', true),
  a.choice('W19-12', 'A student must heat a solution to 120 °C. Which equipment should they choose?', ['A water bath', 'A beaker of ice', 'An electric heater with a hot plate', 'A water bath with a lid'], 2, 'It has to go higher than 100 °C.', ['A water bath cannot heat above 100 °C.', 'An electric heater with a hot plate can reach higher temperatures.'], 'practicalReasoning', true),
  a.choice('W19-13', 'Look at the diagram of a Bunsen burner. Which numbered part is closed to give a yellow flame?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 0, 'It is the part that lets air in.', ['Part 1 is the air hole. Closing it gives a yellow flame.', 'Part 2 is the chimney, and part 3 is where the gas comes in.'], 'recall', true, 'wsheat-q-burner'),
  a.written('W19-14', 'Describe how to heat a beaker of water safely with a Bunsen burner. Say how a water bath would be different.', 'Think about setting up, lighting and the flame.', 'I would stand the Bunsen burner on a heat-proof mat with the tripod and gauze in place, and check the air hole is closed. I would light a splint, hold it over the burner and turn on the gas. I would open the hole to get a blue flame and put the beaker on the gauze. When I stopped heating, I would close the hole to make a yellow flame. A water bath has no flame and heats evenly to a set temperature, but it cannot go above 100 °C.', ['Tripod and gauze in place before lighting, burner on a heat-proof mat.', 'Splint lit first, then the gas turned on.', 'Open the hole for a hotter blue flame.', 'Close the hole to a yellow flame when not heating.', 'A water bath: no flame, even heat, set temperature, maximum 100 °C.'], ['Turning on the gas before lighting the splint.', 'Holding the beaker with bare hands.', 'Saying a water bath can heat above 100 °C.']),
]

export const lessonW19: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Heating substances safely', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
