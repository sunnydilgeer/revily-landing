import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { energyMeasureFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.5.1.1 Energy transfer during exothermic and endothermic reactions (required practical: investigate the variables that affect temperature changes in reacting solutions), as on the supplied revision page' }
const change = author('C-NRG-TEMP-CHANGE', ['5.5.1.1'], ['aqa-chemistry'])
const rig = author('C-NRG-CUP-APPARATUS', ['5.5.1.1'], ['aqa-chemistry'])
const plan = author('C-NRG-VARIABLES', ['5.5.1.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const energyMeasureSections = [
  { id: 'C29-01', label: 'Start here', detail: 'What does a thermometer tell you about a reaction?' },
  { id: 'C29-02', label: 'Measuring a temperature change', detail: 'Start, highest or lowest, and the difference' },
  { id: 'C29-05', label: 'The polystyrene-cup apparatus', detail: 'Lid, cotton wool and why they are there' },
  { id: 'C29-08', label: 'Testing acid concentration', detail: 'Variables, method and reading the results' },
  { id: 'C29-12', label: 'On your own', detail: 'A labelled diagram, a calculation, data and an explanation' },
]

const states: ScienceState[] = [
  { ...change.choice('C29-01', 'Two solutions are mixed and the thermometer reading goes up. What does this show?', ['Energy was transferred to the surroundings', 'Energy was taken in from the surroundings', 'No energy changed', 'Energy was destroyed'], 0, 'A warmer mixture has given out heat.', ['The temperature rose, so energy was given out to the surroundings.', 'Energy is never destroyed. It is only moved around.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(change, 'C29-02', 'Measuring a temperature change'),
  change.choice('C29-03', 'The mixture starts at 21.0 °C and reaches a highest temperature of 29.5 °C. What is the temperature change?', ['−8.5 °C', '50.5 °C', '8.5 °C', '29.5 °C'], 2, 'Highest take away start.', ['Temperature change = highest − start.', '29.5 − 21.0 = 8.5 °C, a rise.'], 'calculation'),
  change.choice('C29-04', 'The temperature of a reaction mixture falls from 23.0 °C to 18.0 °C. What kind of reaction is it?', ['Exothermic, because energy was given out', 'Endothermic, because energy was taken in', 'Exothermic, because the change is 5.0 °C', 'Neither, because the change is small'], 1, 'Did the temperature go up or down?', ['A fall in temperature means energy was taken in from the surroundings.', 'That is an endothermic reaction.']),
  t(rig, 'C29-05', 'The polystyrene-cup apparatus'),
  rig.choice('C29-06', 'Why is a lid put on the polystyrene cup?', ['To speed up the reaction', 'To reduce energy lost to the surroundings', 'To stop the solution evaporating into a gas', 'To make the thermometer more accurate'], 1, 'Think about where the energy could escape.', ['The lid blocks the top of the cup.', 'This reduces energy lost to the surroundings, so the measured temperature change is closer to the real one.'], 'practicalReasoning'),
  rig.choice('C29-07', 'Which numbered part traps air around the cup to insulate it?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'Which part is fluffy and packed around the cup?', ['The cotton wool traps air, and trapped air is a good insulator.', 'It is part 3.'], 'understanding', false, 'calor-q-cup'),
  t(plan, 'C29-08', 'Testing acid concentration'),
  plan.choice('C29-09', 'A student tests how acid concentration affects the temperature change. Which variable does she change?', ['The volume of sodium hydroxide', 'The start temperature', 'The acid concentration', 'The temperature change'], 2, 'What are the 10, 20 and 30 g/dm³ values?', ['The acid concentration is the variable she changes on purpose.', 'The temperature change is what she measures.'], 'practicalReasoning'),
  plan.choice('C29-10', 'Which of these must be kept the same to make the test fair?', ['The acid concentration', 'The volume of each solution', 'The highest temperature', 'The temperature change'], 1, 'Which one is not changed and not measured?', ['To be fair, keep everything the same except what you are testing.', 'The volume of each solution, such as 25 cm³, is a control variable.'], 'practicalReasoning'),
  plan.choice('C29-11', 'Why is the temperature read every 30 seconds?', ['To find the highest temperature reached', 'To keep the mixture stirred', 'To stop energy escaping', 'To change the concentration'], 0, 'What are you trying to spot on the way up?', ['Regular readings show when the temperature stops rising.', 'The highest reading is used to work out the temperature change.'], 'practicalReasoning'),
  rig.choice('C29-12', 'Which numbered part stops energy escaping through the top of the cup?', ['Part 1', 'Part 3', 'Part 5', 'Part 6'], 0, 'Which part sits on top of the cup?', ['The lid is part 1.', 'It blocks the top, so less energy escapes to the surroundings.'], 'application', true, 'calor-q-cup'),
  change.choice('C29-13', 'Read both thermometers. What is the temperature change and what does it show?', ['A rise of 5.5 °C: exothermic', 'A fall of 42.5 °C: endothermic', 'A fall of 5.5 °C: endothermic', 'A fall of 5.5 °C: exothermic'], 2, 'Lowest take away start. Is it up or down?', ['18.5 − 24.0 = −5.5 °C, so the temperature fell by 5.5 °C.', 'A fall means energy was taken in, so the reaction is endothermic.'], 'calculation', true, 'calor-q-thermo'),
  plan.choice('C29-14', 'Which conclusion do the results in the table support?', ['Acid concentration has no effect on the temperature change', 'The temperature change is exactly proportional to concentration', 'The reaction is endothermic', 'A higher acid concentration gave a bigger temperature change'], 3, 'Work out each change, highest − start, then compare.', ['The changes are 4.0, 8.5 and 12.0 °C. The temperature change goes up as the concentration goes up.', 'Three tests cannot prove an exact proportion, and a rise means exothermic.'], 'dataInterpretation', true, 'calor-q-table'),
  rig.written('C29-15', 'A student mixes solutions in an open glass beaker and gets a smaller temperature change than expected. Explain how to improve it.', 'Name two changes to the apparatus. Say what each one stops.', 'She should use a polystyrene cup instead of the glass beaker, because polystyrene is a good insulator and lets little energy through. She should put a lid on the cup so energy cannot escape through the top, and stand the cup in a beaker of cotton wool, which traps air and reduces energy lost through the sides. Less energy is lost to the surroundings, so the measured temperature change is closer to the true value.', ['Use a lid, so less energy escapes through the top.', 'Stand the cup in a beaker of cotton wool, which traps air and insulates the sides.', 'Use a polystyrene cup, which is a good insulator.', 'Less energy is lost to the surroundings, so the measured temperature change is bigger and more accurate.'], ['Saying the lid or cotton wool speeds up the reaction.', 'Saying the cotton wool "makes the cup hotter".', 'Saying energy is destroyed or used up in the surroundings.']),
]

export const lessonC29: ScienceLesson = {
  id: 'C-NRG-029-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Measuring energy changes', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
