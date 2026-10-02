import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { acidStrengthFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.2.5 Strong and weak acids (HT): strong and weak in terms of the degree of ionisation; dilute and concentrated; for a given concentration, the stronger the acid, the lower the pH; a fall of one pH unit means ten times the hydrogen ion concentration, as on the supplied revision page' }
const skill = 'C-ACID-STRENGTH'
const prior = author(skill, ['5.4.2.4'], ['aqa-chemistry'])
const strength = author(skill, ['5.4.2.5'], ['aqa-chemistry'])
const ph = author(skill, ['5.4.2.5'], ['aqa-chemistry'])
const conc = author(skill, ['5.4.2.5'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const acidStrengthSections = [
  { id: 'C22H-01', label: 'Start here', detail: 'The ion every acid makes' },
  { id: 'C22H-02', label: 'Strong and weak acids', detail: 'Fully or only partly ionised' },
  { id: 'C22H-06', label: 'pH and hydrogen ions', detail: 'Ten times the H⁺ for each pH step' },
  { id: 'C22H-12', label: 'Strong is not concentrated', detail: 'How much acid, and how much it ionises' },
  { id: 'C22H-15', label: 'On your own', detail: 'A dilution, four beakers, some data and a mistake' },
]

const states: ScienceState[] = [
  { ...prior.choice('C22H-01', 'Which ions do all acids make when they dissolve in water?', ['Hydroxide ions, OH⁻', 'Hydrogen ions, H⁺', 'Sodium ions, Na⁺'], 1, 'Which ion makes a solution acidic, with a pH below 7?', ['Every acid makes hydrogen ions, H⁺, in water. That is what makes the solution acidic.', 'Alkalis make hydroxide ions, OH⁻. This lesson is about how many H⁺ ions an acid makes.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  t(strength, 'C22H-02', 'Strong and weak acids'),
  strength.choice('C22H-03', 'Which of these acids is a weak acid?', ['Hydrochloric acid', 'Nitric acid', 'Ethanoic acid', 'Sulfuric acid'], 2, 'Which one only partly ionises in water?', ['Ethanoic acid is a weak acid: only a few of its molecules ionise in water.', 'Hydrochloric, nitric and sulfuric acids are strong acids. They ionise completely.']),
  strength.choice('C22H-04', 'The beakers show two acids in water. Which acid is weak?', ['Acid 1, because most of its particles have not ionised', 'Acid 2, because all of its particles have ionised', 'Acid 1, because it has fewer particles', 'Neither, because both make H⁺ ions'], 0, 'Count the whole molecules left in each beaker.', ['Both beakers started with the same number of acid particles.', 'In acid 2 every particle has split into ions, so it is strong. In acid 1 most particles are still whole molecules, so it is weak.'], 'understanding', false, 'hacid-q-beakers'),
  strength.choice('C22H-05', 'What does the ⇌ sign in CH₃COOH ⇌ H⁺ + CH₃COO⁻ show?', ['Hydrogen gas is given off', 'The acid ionises completely', 'Ethanoic acid is a strong acid', 'The reaction can go both ways'], 3, 'What does a two-way arrow mean in an equation?', ['The ⇌ sign shows a reversible reaction: it can go forwards and backwards.', 'Ethanoic acid molecules split into ions, and some ions join back into molecules. So only a few H⁺ ions are there at any time.']),

  t(ph, 'C22H-06', 'pH and hydrogen ions'),
  ph.worked('C22H-07', 'Count the pH steps', 'The pH of a solution falls from 5 to 2. By what factor does the H⁺ ion concentration change?', ['Count the steps from 5 down to 2: 5 → 4 → 3 → 2. That is 3 steps.', 'Each step down the pH scale multiplies the H⁺ ion concentration by 10.', 'So the factor is 10 × 10 × 10 = 1000.', 'The H⁺ ion concentration is 1000 times greater at pH 2 than at pH 5.'], 'hacid-worked-steps'),
  ph.worked('C22H-08', 'Use the formula', 'The pH of a solution falls from 7 to 3. Use factor = 10⁻ˣ to find how the H⁺ ion concentration changes.', ['X is the difference in pH: X = final pH − initial pH = 3 − 7 = −4.', 'Put it in the formula: factor = 10⁻ˣ = 10⁻⁽⁻⁴⁾.', 'Two minus signs make a plus, so the factor is 10⁴ = 10 × 10 × 10 × 10 = 10 000.', 'Check by counting: 7 down to 3 is 4 steps, so the H⁺ ion concentration is 10 000 times greater.'], 'hacid-worked-formula'),
  ph.choice('C22H-09', 'An acid’s pH falls from 6 to 4. How many times greater is its H⁺ ion concentration?', ['100 times', '2 times', '20 times', '1000 times'], 0, 'Count the pH steps. Multiply by 10 for each one.', ['From 6 down to 4 is 2 steps.', 'So the H⁺ ion concentration is 10 × 10 = 100 times greater.'], 'calculation'),
  ph.choice('C22H-10', 'The pH of a solution falls from 6 to 1. By what factor does the H⁺ ion concentration increase?', ['50 times', '100 000 times', '5 times', '10 000 times'], 1, 'Find X = final pH − initial pH. Then work out 10⁻ˣ.', ['X = 1 − 6 = −5, so the factor is 10⁻⁽⁻⁵⁾ = 10⁵.', '10⁵ = 100 000. Counting gives the same: 6 down to 1 is 5 steps of × 10.'], 'calculation'),
  ph.choice('C22H-11', 'The pH of a solution goes up from 2 to 3. What happens to its H⁺ ion concentration?', ['It becomes 10 times greater', 'It stays the same', 'It becomes 10 times smaller', 'It goes down by 1'], 2, 'Going up the pH scale means fewer H⁺ ions.', ['One step up the pH scale divides the H⁺ ion concentration by 10.', 'So at pH 3 there are 10 times fewer H⁺ ions than at pH 2.']),

  t(conc, 'C22H-12', 'Strong is not the same as concentrated'),
  conc.choice('C22H-13', 'What does the word “strong” tell you about an acid?', ['A lot of it is dissolved in a small volume', 'It is very dangerous to touch', 'It has a pH above 7', 'All of its particles ionise in water'], 3, 'Strength is about ionising, not about amount.', ['A strong acid ionises completely: every acid particle releases H⁺ ions in water.', 'How much acid is in a volume is its concentration. That is a different idea.']),
  conc.choice('C22H-14', 'Ethanoic acid and hydrochloric acid solutions have the same concentration. Which has the lower pH?', ['Ethanoic acid', 'Hydrochloric acid', 'Both have the same pH', 'You cannot tell without knowing the volume'], 1, 'Which acid makes more H⁺ ions from the same amount of acid?', ['Hydrochloric acid is strong, so all of it ionises. Ethanoic acid is weak, so only a little ionises.', 'At the same concentration, hydrochloric acid has more H⁺ ions, so its pH is lower.']),

  conc.choice('C22H-15', 'A student dilutes an acid with water. Its pH goes from 1 to 3. How has the H⁺ ion concentration changed?', ['100 times greater', '2 times smaller', '10 times smaller', '100 times smaller'], 3, 'Did the pH go up or down? Count the steps.', ['The pH went up by 2 steps, from 1 to 3.', 'Each step up divides the H⁺ ion concentration by 10, so it is 10 × 10 = 100 times smaller.'], 'calculation', true),
  conc.choice('C22H-16', 'Which numbered beaker shows a dilute solution of a strong acid?', ['Beaker 1', 'Beaker 2', 'Beaker 3', 'Beaker 4'], 2, 'Dilute means few acid particles. Strong means every particle has ionised.', ['Beaker 3 has only a few acid particles, so it is dilute, and every one has split into ions, so the acid is strong.', 'Beaker 2 is concentrated and strong. Beaker 1 is concentrated and weak. Beaker 4 is dilute and weak.'], 'application', true, 'hacid-q-grid'),
  ph.choice('C22H-17', 'The table shows four acid solutions of the same concentration. Which conclusion do these data support?', ['The hydrochloric acid solution has 100 times the H⁺ concentration of the ethanoic acid solution', 'Citric acid is a strong acid', 'Ethanoic acid has a pH of 3 at any concentration', 'The nitric acid solution has 10 times the H⁺ concentration of the hydrochloric acid'], 0, 'Compare the pH values. Remember these are all at one concentration.', ['Hydrochloric acid is pH 1 and ethanoic acid is pH 3. That is 2 steps, so 10 × 10 = 100 times the H⁺ concentration.', 'Nitric and hydrochloric acid have the same pH, so the same H⁺ concentration. Citric acid has a greater pH than the strong acids. The table only shows one concentration.'], 'dataInterpretation', true, 'hacid-data-acids'),
  ph.choice('C22H-18', 'A student worked out how the H⁺ concentration changes when the pH falls from 5 to 2. Which line is wrong?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 2, 'Is 10⁻ˣ the same as 10 × 3?', ['Line 3 multiplies 10 by 3. But 10⁻⁽⁻³⁾ = 10³, which means 10 × 10 × 10.', 'So the factor is 1000, and the H⁺ ion concentration is 1000 times greater, not 30 times.'], 'application', true, 'hacid-question-error'),
  strength.written('C22H-19', 'Hydrochloric acid and ethanoic acid solutions have the same concentration. Explain why the hydrochloric acid has the lower pH.', 'Say which acid is strong and which is weak, and what that means. Then link the number of H⁺ ions to pH.', 'Hydrochloric acid is a strong acid, so it ionises completely in water: every particle releases an H⁺ ion. Ethanoic acid is a weak acid, so only a small fraction of its molecules ionise, and the reaction is reversible. With the same concentration, the hydrochloric acid solution therefore has a greater concentration of H⁺ ions. The greater the concentration of H⁺ ions, the lower the pH.', ['Hydrochloric acid is strong: it ionises completely in water.', 'Ethanoic acid is weak: it only partially ionises (a reversible reaction).', 'So the hydrochloric acid solution has more H⁺ ions (a greater H⁺ concentration) for the same concentration of acid.', 'More H⁺ ions means a lower pH.'], ['Saying hydrochloric acid is more concentrated.', 'Saying ethanoic acid makes no H⁺ ions at all.', 'Saying a strong acid has a greater pH.']),
]

export const lessonC22H: ScienceLesson = {
  id: 'C-ACID-022H-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Strong and weak acids', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
