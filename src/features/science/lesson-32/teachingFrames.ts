import type { TeachingFrame } from '../teachingFrame'

// Prepare for the reaction-time practical: what reaction time is, the ruler-drop method, a fair test of caffeine,
// then turning repeated catches into a mean that can be compared.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const reactionTimeFrames: Record<string, TeachingFrame[]> = {
  'B32-02': [
    f('Reaction time', 'Reaction time is how long you take to respond.', 'stimulus → response: how long?', 'A friend lets go of a ruler and you try to catch it. There is a short delay between the ruler starting to fall and your fingers closing. The time it takes to respond to a stimulus is called your reaction time.', 'nerve-rt-time'),
    f('Milliseconds', 'Reaction times are often less than a second.', '1 second = 1000 ms', 'Reaction times are often less than one second. So they may be measured in milliseconds, written ms. There are 1000 milliseconds in one second.', 'nerve-rt-ms'),
    f('What affects it', 'Age, gender and drugs can affect reaction time.', 'factors: age, gender, drugs', 'Reaction times are not the same for everyone. Things that can change a reaction time are called factors. Factors that affect reaction time include age, gender and drugs.', 'nerve-rt-factors'),
    f('Caffeine', 'Caffeine can speed up reaction time.', 'caffeine → can be faster', 'Caffeine is a drug found in coffee, tea and some fizzy drinks. It can speed up a person’s reaction time. In class, you can investigate this with a ruler.', 'nerve-rt-caffeine'),
  ],
  'B32-05': [
    f('Set up', 'Rest your forearm on the edge of a table.', 'arm still, hand over the edge', 'The person being tested sits with their forearm resting on a table. Their hand sticks out over the edge. This keeps their arm still for every catch.', 'nerve-drop-setup'),
    f('Line up the zero', 'The zero mark is level with the top of the thumb.', 'zero at the top of the thumb', 'A partner holds a ruler upright, hanging between the person’s thumb and first finger. The zero mark is level with the top of the thumb. The person must not touch or grip the ruler yet.', 'nerve-drop-zero'),
    f('Drop and catch', 'The ruler is dropped without warning.', 'no warning → no guessing', 'The partner lets go without any warning. The person catches the ruler as quickly as they can. With no warning, they cannot guess when it will fall.', 'nerve-drop-fall'),
    f('Read the ruler', 'Read the number at the top of the thumb.', 'reading = distance the ruler fell', 'Read the number on the ruler that is level with the top of the thumb. This shows how far the ruler fell before it was caught. Here it fell 14 cm.', 'nerve-drop-read'),
    f('Higher means slower', 'A higher reading means a slower reaction.', 'further fall → slower', 'The longer someone takes to react, the further the ruler falls. So the higher the number, the slower the reaction time.', 'nerve-drop-compare'),
  ],
  'B32-08': [
    f('Testing caffeine', 'Compare catches before and after caffeine.', 'drops → drink → wait 10 minutes → drops', 'First, do several ruler drops and record each one. Then the person has a drink with caffeine, such as cola, and waits 10 minutes. Then repeat the ruler drops. Only do this with a teacher in charge, and no one should be pushed into having caffeine.', 'nerve-fair-plan'),
    f('Control variables', 'Keep everything else the same.', 'change one thing only', 'For a fair test, only the caffeine should change. Everything else that could affect the result must stay the same. These are called control variables.', 'nerve-fair-variables'),
    f('Same person, hand and height', 'Three things to keep the same.', 'same person, same hand, same height', 'Use the same person for every catch. They should always catch with the same hand. Drop the ruler from the same height each time.', 'nerve-fair-controls'),
  ],
  'B32-11': [
    f('Results vary', 'Each catch gives a slightly different reading.', 'one catch could be unusual', 'No two catches are exactly the same. One catch on its own could be unusually fast or slow. So you repeat the test several times.', 'nerve-mean-vary'),
    f('The mean', 'The mean gives one typical value.', 'mean = total ÷ how many', 'To turn repeated results into one value, you find the mean. Add up all the results, then divide by how many results there are.', 'nerve-mean-idea'),
    f('Compare the means', 'Compare the mean before and after caffeine.', 'smaller mean distance → faster', 'Work out one mean before the drink and one mean after it. If the mean distance is smaller after the drink, the person reacted faster.', 'nerve-mean-compare'),
  ],
}
