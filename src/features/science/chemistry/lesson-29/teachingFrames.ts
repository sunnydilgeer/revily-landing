import type { TeachingFrame } from '../../teachingFrame'

// Three short walkthroughs: reading a temperature change, the insulated polystyrene-cup apparatus (one drawing built up
// in four steps), and the acid-concentration investigation (variables, method in two halves, example results).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const energyMeasureFrames: Record<string, TeachingFrame[]> = {
  'C29-02': [
    f('Start and highest', 'Take the temperature before mixing, then the highest or lowest it reaches.', 'start temperature → mix → highest or lowest', 'Sometimes you need to know how much a reaction heats up or cools down. Take the temperature of the reactants before you mix them. Then mix them and watch the thermometer. If the temperature rises, record the highest reading. If it falls, record the lowest.', 'calor-change-both'),
    f('Work out the change', 'Temperature change = end temperature take away start temperature.', 'change = highest − start', 'The temperature change is the highest (or lowest) temperature take away the start temperature. Here, 27.5 − 21.0 = 6.5 °C. A bigger change shows that more energy was transferred, as long as you use the same amounts each time.', 'calor-change-calc'),
    f('Rise or fall', 'A rise means exothermic. A fall means endothermic.', 'up → energy given out · down → energy taken in', 'You have already met exothermic and endothermic reactions. A temperature that goes up shows energy was given out to the surroundings, so the reaction is exothermic. A temperature that goes down shows energy was taken in, so it is endothermic.', 'calor-sign'),
  ],
  'C29-05': [
    f('The problem', 'Energy escapes to the surroundings, so the measured change is too small.', 'energy lost → change looks smaller', 'The biggest problem with these measurements is energy lost to the surroundings. Polystyrene is a good insulator, so a polystyrene cup already lets little energy through. But in an open cup, energy can still escape from the top and the sides.', 'calor-cup'),
    f('Add a lid', 'A lid stops energy escaping through the top.', 'lid → top blocked', 'Put a lid on the cup. It blocks the top, where warm air, or heat from the mixture, would otherwise escape. The lid has a small hole so the thermometer can go through it into the mixture.', 'calor-lid'),
    f('Add cotton wool', 'Cotton wool traps air around the cup, so less energy escapes through the sides.', 'cotton wool → trapped air → insulation', 'Now stand the cup in a large beaker packed with cotton wool. Cotton wool traps a lot of air, and trapped air is a poor conductor of energy. This is called insulation. Very little energy can now get in or out through the sides.', 'calor-cotton'),
    f('Put it together', 'Thermometer through a lid, polystyrene cup, large beaker, cotton wool.', 'name every part and its job', 'This is the apparatus. The reaction mixture is in the polystyrene cup. The thermometer goes through the lid. The large beaker holds the cotton wool. It works for neutralisation, metals with acids, acids with carbonates and displacement reactions.', 'calor-labelled'),
  ],
  'C29-08': [
    f('Plan the test', 'Change one thing, measure the temperature change, keep everything else the same.', 'change one · measure one · keep the rest', 'You can use this apparatus to see how one variable affects the temperature change. Here you change the acid concentration and measure the temperature change. Everything else stays the same. These are called the independent variable, the dependent variable and the control variables.', 'calor-vars'),
    f('The method, part one', 'Equal volumes at the same start temperature go into the lidded cup.', 'measure → match temperatures → mix', 'Measure 25 cm³ of hydrochloric acid and 25 cm³ of sodium hydroxide solution into separate beakers. Stand both in a water bath until they reach 25 °C. Then pour them into the lidded cup, which stands in cotton wool.', 'calor-method-a'),
    f('The method, part two', 'Record every 30 seconds, find the change, then repeat with new concentrations.', 'record → calculate → repeat → compare', 'Read the temperature every 30 seconds and note the highest reading. Work out the temperature change. Then repeat with 20 g/dm³ and 30 g/dm³ acid, and compare the changes.', 'calor-method-b'),
    f('Reading the results', 'Here, a stronger acid gave a bigger temperature rise.', 'compare the bars → say what the results show', 'These invented results show the temperature change for three concentrations. The bars get taller as the concentration goes up. So in these results, a higher concentration of acid gave a bigger temperature rise.', 'calor-results'),
  ],
}
