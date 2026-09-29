import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { metalReactionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.1.2 Reactivity series (reactions of metals with water and acids, displacement); 5.4.2.1 Reactions of acids with metals, as on the supplied revision page' }
const skill = 'C-METAL-REACT'
const acids = author(skill, ['5.4.2.1'], ['aqa-chemistry'])
const water = author(skill, ['5.4.1.2'], ['aqa-chemistry'])
const order = author(skill, ['5.4.1.2'], ['aqa-chemistry'])
const disp = author(skill, ['5.4.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const metalReactionSections = [
  { id: 'C25-01', label: 'Start here', detail: 'Bubbles from a metal in acid' },
  { id: 'C25-02', label: 'What do metals make with acids?', detail: 'A salt and hydrogen' },
  { id: 'C25-05', label: 'What do metals make with water?', detail: 'A hydroxide and hydrogen' },
  { id: 'C25-08', label: 'How can you order metals?', detail: 'Bubbles, temperature and fair tests' },
  { id: 'C25-11', label: 'When does one metal push out another?', detail: 'Displacement' },
  { id: 'C25-14', label: 'On your own', detail: 'New metals, results and a plan' },
]

const states: ScienceState[] = [
  { ...acids.choice('C25-01', 'Magnesium ribbon is dropped into dilute hydrochloric acid and bubbles rise. Which gas is most likely in the bubbles?', ['Hydrogen', 'Oxygen', 'Carbon dioxide'], 0, 'Carbonates make carbon dioxide. Is magnesium a carbonate?', ['Acids react with metals to give a salt and hydrogen.', 'The bubbles are hydrogen gas.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(acids, 'C25-02', 'What do metals make with acids?'),
  acids.choice('C25-03', 'Which word equation shows magnesium reacting with sulfuric acid?', ['Sulfuric acid + magnesium → magnesium sulfate + water', 'Sulfuric acid + magnesium → magnesium chloride + hydrogen', 'Sulfuric acid + magnesium → magnesium sulfate + hydrogen', 'Sulfuric acid + magnesium → magnesium sulfate + carbon dioxide'], 2, 'Which acid gives a sulfate? Which gas does a metal give?', ['Sulfuric acid gives a sulfate, and magnesium gives the first word.', 'An acid and a metal make a salt and hydrogen.']),
  acids.choice('C25-04', 'In 2HCl + Zn → ZnCl₂ + H₂, which product is the gas that bubbles off?', ['ZnCl₂', 'HCl', 'Zn', 'H₂'], 3, 'Which product is made of hydrogen atoms only?', ['H₂ is hydrogen gas, so it is the gas that bubbles off.', 'ZnCl₂ is the salt, zinc chloride, and stays in the solution.']),
  t(water, 'C25-05', 'What do metals make with water?'),
  water.choice('C25-06', 'Which word equation shows sodium reacting with water?', ['Sodium + water → sodium chloride + hydrogen', 'Sodium + water → sodium hydroxide + hydrogen', 'Sodium + water → sodium oxide + oxygen', 'Sodium + water → sodium hydroxide + carbon dioxide'], 1, 'A metal and water make a metal hydroxide and which gas?', ['A metal and water make a metal hydroxide and hydrogen.', 'Sodium hydroxide is the hydroxide of sodium.']),
  water.choice('C25-07', 'Which of these metals will not react with water?', ['Copper', 'Calcium', 'Lithium', 'Potassium'], 0, 'Which metal is least reactive?', ['Potassium, lithium and calcium all react with water.', 'Copper is not reactive enough, so it does not react with water.']),
  t(order, 'C25-08', 'How can you order metals?'),
  order.choice('C25-09', 'Metal P makes hydrogen bubbles faster than metal Q in the same acid. What does this suggest?', ['Q is more reactive than P', 'P is more reactive than Q', 'P and Q are equally reactive', 'P is a non-metal'], 1, 'Which metal reacts faster?', ['Faster bubbles mean a faster reaction.', 'So P is more reactive than Q.']),
  order.choice('C25-10', 'Why must the mass and surface area of each metal be kept the same?', ['To make the acid hotter', 'To make the metals react more slowly', 'To show which metal is heaviest', 'So the test is fair and only the metal changes'], 3, 'What should change in the test, and what should not?', ['A fair test changes only one thing, the metal.', 'Mass and surface area change how fast a metal reacts, so they must stay the same.'], 'understanding'),
  t(disp, 'C25-11', 'When does one metal push out another?'),
  disp.choice('C25-12', 'Iron is more reactive than copper. An iron nail is put in copper sulfate solution. What is made?', ['Copper sulfate solution and more iron', 'Iron sulfate solution and hydrogen', 'Iron sulfate solution and copper', 'Nothing, because iron is unreactive'], 2, 'Which metal is pushed out, and which takes its place?', ['Iron is more reactive, so it takes copper’s place.', 'This makes iron sulfate solution and copper.']),
  disp.choice('C25-13', 'The order is magnesium, zinc, iron, copper, most reactive first. In which test will a displacement reaction happen?', ['Zinc in copper sulfate solution', 'Copper in zinc sulfate solution', 'Copper in iron sulfate solution', 'Iron in magnesium sulfate solution'], 0, 'Is the metal you add above or below the metal in the solution?', ['Zinc is above copper, so it displaces copper.', 'In the other tests, the metal added is below the one in the solution.'], 'application'),
  water.choice('C25-14', 'Lithium reacts with water. Which pair of products is made?', ['Lithium chloride and hydrogen', 'Lithium oxide and oxygen', 'Lithium hydroxide and oxygen', 'Lithium hydroxide and hydrogen'], 3, 'A metal and water make a hydroxide and which gas?', ['A metal and water make a metal hydroxide and hydrogen.', 'For lithium this is lithium hydroxide and hydrogen.'], 'application', true),
  order.choice('C25-15', 'Metals P, Q and R are added to the same acid. Which is most reactive?', ['P', 'Q', 'R', 'They are all equally reactive'], 1, 'Which tube has the most bubbles?', ['Tube Q has the most bubbles of hydrogen.', 'More bubbles in the same time means a more reactive metal.'], 'dataInterpretation', true, 'mrx-question-tubes'),
  disp.choice('C25-16', 'The table shows three tests. Which list puts the metals from most reactive to least reactive?', ['Zinc, magnesium, copper', 'Copper, zinc, magnesium', 'Magnesium, zinc, copper', 'Magnesium, copper, zinc'], 2, 'Which metal displaced another, and which did not?', ['Magnesium displaced zinc, and zinc displaced copper.', 'Copper displaced nothing, so the order is magnesium, zinc, copper.'], 'dataInterpretation', true, 'mrx-question-displace'),
  acids.choice('C25-17', 'Copper is added to cold, dilute hydrochloric acid. What is most likely to be seen?', ['No obvious reaction', 'Rapid fizzing', 'An explosion', 'A blue solution forming at once'], 0, 'Is copper high or low in the reactivity series?', ['Copper is not very reactive.', 'It does not react with cold, dilute acids.'], 'recall', true),
  order.written('C25-18', 'A student has strips of magnesium, zinc and iron, and dilute hydrochloric acid. Describe how to find the order of reactivity.', 'Say what to measure, what to keep the same and how the results give the order.', 'Put the same volume of the same dilute acid in three test tubes. Add a strip of each metal, with the same mass and size. Watch how quickly bubbles of hydrogen form, or measure the temperature rise in a set time. The metal with the fastest bubbles or biggest temperature rise is the most reactive. Put the metals in order from most to least reactive.', ['Use the same volume and strength of acid for each metal.', 'Use pieces of the same mass and size, so only the metal changes.', 'Watch how fast the bubbles of hydrogen form, or measure the temperature change in a set time.', 'Faster bubbles or a bigger temperature rise means a more reactive metal.', 'Put the metals in order, most reactive first.'], ['Changing the acid or the size of the pieces between tests.', 'Saying the slowest bubbles mean the most reactive metal.', 'Saying the metal with the biggest piece is the most reactive.']),
]

export const lessonC25: ScienceLesson = {
  id: 'C-CHG-025-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Reactions of metals', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
