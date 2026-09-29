import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { concentrationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.3.2.5 Concentration of solutions in g/dm³ (the amount of a substance in a given volume of solution; the mass of solute per volume; rearranging to find mass); uncertainty ranges left out' }
const skill = 'C-CONCENTRATION'
const idea = author(skill, ['5.3.2.5'], ['aqa-chemistry'])
const calc = author(skill, ['5.3.2.5'], ['aqa-chemistry'])
const mass = author(skill, ['5.3.2.5'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const concentrationSections = [
  { id: 'C21-01', label: 'Start here', detail: 'Two cups of squash' },
  { id: 'C21-02', label: 'What is concentration?', detail: 'Crowded particles and g/dm³' },
  { id: 'C21-05', label: 'How do you calculate it?', detail: 'Mass ÷ volume, and cm³ to dm³' },
  { id: 'C21-09', label: 'How do you find the mass?', detail: 'Rearranging the formula' },
  { id: 'C21-13', label: 'On your own', detail: 'Calculations, a mistake and some data' },
]

const states: ScienceState[] = [
  { ...idea.choice('C21-01', 'Cup A has 1 spoon of squash and cup B has 3, in equal cups. Which is more concentrated?', ['Cup A', 'Cup B', 'They are equally concentrated'], 1, 'Both cups hold the same volume. Which has more squash in it?', ['The volumes are the same, so the cup with more squash in it is more concentrated.', 'Cup B has 3 spoons in the same volume, so it is more concentrated and tastes stronger.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'C21-02', 'What is concentration?'),
  idea.choice('C21-03', 'The beakers hold the same dissolved solid. Which solution is the most concentrated?', ['Beaker A', 'Beaker B', 'Beaker C', 'A and B are equally concentrated'], 0, 'Compare how crowded the particles are in each beaker.', ['A and B each have 8 particles, but A has only 100 cm³ of solution and B has 200 cm³.', 'A has the same solute in less volume, so it is more crowded. C has fewer particles than B in the same volume, so it is the least concentrated.'], 'understanding', false, 'conc-question-beakers'),
  idea.choice('C21-04', 'Which of these could be a concentration?', ['20 g', '20 dm³', '20 g/dm³', '20 cm³'], 2, 'Concentration is a mass in each volume. Look for a unit with both.', ['Concentration is the mass of solute in a certain volume, so its unit has grams and dm³.', '20 g/dm³ means 20 grams in every dm³. 20 g is only a mass, and 20 dm³ and 20 cm³ are only volumes.']),
  t(calc, 'C21-05', 'How do you calculate it?'),
  calc.worked('C21-06', 'Work out the concentration of a copper sulfate solution', '40 g of copper sulfate is dissolved in water to make 0.50 dm³ of solution. What is the concentration in g/dm³?', ['Write down the mass and the volume: mass = 40 g and volume = 0.50 dm³. The volume is already in dm³.', 'Divide the mass by the volume: concentration = 40 ÷ 0.50.', '40 ÷ 0.50 = 80. So the concentration is 80 g/dm³.'], 'conc-worked-conc'),
  calc.choice('C21-07', '9 g of salt is dissolved to make 300 cm³ of solution. What is the concentration in g/dm³?', ['0.03 g/dm³', '2.7 g/dm³', '270 g/dm³', '30 g/dm³'], 3, 'Change the volume to dm³ first. What is 300 ÷ 1000?', ['300 cm³ = 300 ÷ 1000 = 0.3 dm³.', 'Concentration = 9 ÷ 0.3 = 30 g/dm³.'], 'calculation'),
  calc.choice('C21-08', 'A solution has a volume of 400 cm³. What volume in dm³ do you use in the formula?', ['0.04 dm³', '0.4 dm³', '4 dm³', '400 000 dm³'], 1, 'There are 1000 cm³ in 1 dm³. Do you multiply or divide?', ['To change cm³ to dm³, divide by 1000.', '400 ÷ 1000 = 0.4 dm³.']),
  t(mass, 'C21-09', 'How do you find the mass?'),
  mass.worked('C21-10', 'Work out the mass of solute in a solution', 'A solution has a concentration of 50 g/dm³. What mass of solute is in 0.30 dm³ of the solution?', ['Write down what you know: concentration = 50 g/dm³ and volume = 0.30 dm³.', 'Rearrange: mass = concentration × volume.', 'Multiply: 50 × 0.30 = 15. So there is 15 g of solute.'], 'conc-worked-mass'),
  mass.choice('C21-11', 'A solution has a concentration of 20 g/dm³. What mass of solute is in 250 cm³ of it?', ['80 g', '0.0125 g', '5 g', '5000 g'], 2, 'Change 250 cm³ to dm³ first, then multiply.', ['250 cm³ = 250 ÷ 1000 = 0.25 dm³.', 'Mass = concentration × volume = 20 × 0.25 = 5 g.'], 'calculation'),
  mass.choice('C21-12', 'Which equation could you use to find the mass of solute?', ['mass = concentration × volume', 'mass = concentration ÷ volume', 'mass = volume ÷ concentration', 'mass = concentration + volume'], 0, 'Multiply both sides of concentration = mass ÷ volume by the volume.', ['Concentration = mass ÷ volume. Multiplying both sides by the volume leaves mass on its own.', 'So mass = concentration × volume.']),
  calc.choice('C21-13', '6 g of a dye is dissolved to make 400 cm³ of solution. What is the concentration in g/dm³?', ['0.015 g/dm³', '1.5 g/dm³', '15 g/dm³', '2400 g/dm³'], 2, 'Change 400 cm³ to dm³ before you divide.', ['400 cm³ = 400 ÷ 1000 = 0.4 dm³.', 'Concentration = 6 ÷ 0.4 = 15 g/dm³.'], 'calculation', true),
  mass.choice('C21-14', 'A solution has a concentration of 12 g/dm³. What mass of solute is in 500 cm³ of it?', ['24 g', '6000 g', '0.024 g', '6 g'], 3, 'What is 500 cm³ in dm³?', ['500 cm³ = 500 ÷ 1000 = 0.5 dm³.', 'Mass = 12 × 0.5 = 6 g.'], 'calculation', true),
  calc.choice('C21-15', 'A student worked out the concentration of 12 g of solute in 250 cm³. Which numbered line has the mistake?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 1, 'How many cm³ are there in 1 dm³?', ['Line 2 divides by 100. There are 1000 cm³ in 1 dm³, so 250 cm³ is 0.25 dm³.', 'Then 12 ÷ 0.25 = 48 g/dm³, not 4.8 g/dm³.'], 'application', true, 'conc-question-error'),
  calc.choice('C21-16', 'The table shows four solutions of the same solute. Which conclusion do the data support?', ['Solution S is the most concentrated of the four', 'Solution R is more concentrated than P because it holds more solute', 'Solution Q is the most concentrated because its volume is the smallest', 'The more solute a solution holds, the more concentrated it is'], 0, 'Work out mass ÷ volume for each solution.', ['P = 10 ÷ 0.50 = 20 g/dm³, Q = 10 ÷ 0.25 = 40 g/dm³, R = 20 ÷ 1.00 = 20 g/dm³, S = 30 ÷ 0.50 = 60 g/dm³.', 'S is the highest. R holds more solute than P but has the same concentration, so mass alone does not decide it. Four solutions cannot show a rule for every solution.'], 'dataInterpretation', true, 'conc-data-solutions'),
  calc.written('C21-17', 'A student says 30 g of solute is always more concentrated than 10 g. Explain why they may be wrong.', 'Concentration depends on the mass of solute and the volume. Try an example with different volumes.', 'Concentration is the mass of solute in each dm³, so it depends on the volume as well as the mass. For example, 30 g of solute in 3.0 dm³ has a concentration of 30 ÷ 3.0 = 10 g/dm³. But 10 g of solute in 0.50 dm³ has a concentration of 10 ÷ 0.50 = 20 g/dm³. So the solution with less solute is the more concentrated one.', ['Concentration depends on both the mass of solute and the volume of the solution, not the mass alone.', 'A correct example, such as 30 g in 3.0 dm³ = 10 g/dm³.', 'A second example with less solute in a smaller volume, such as 10 g in 0.50 dm³ = 20 g/dm³.', 'A conclusion that the solution with less solute can be the more concentrated.'], ['Saying only that the student is wrong without a reason.', 'Saying more solute always means more concentrated.', 'Using volumes in cm³ without changing them to dm³.']),
]

export const lessonC21: ScienceLesson = {
  id: 'C-QNT-021-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Concentration of solutions', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
