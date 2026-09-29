import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { ohmFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.1.3 Resistance and 6.2.1.4 Ohmic conductors, diodes and filament lamps (V = IR), as on the supplied revision page' }
const skill = 'P-OHM'
const meaning = author(skill, ['6.2.1.3'], ['aqa-physics'])
const calc = author(skill, ['6.2.1.3'], ['aqa-physics'])
const kinds = author(skill, ['6.2.1.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const ohmSections = [
  { id: 'P16-01', label: 'Start here', detail: 'What happens when you add resistance' },
  { id: 'P16-02', label: 'What links pd, current and resistance?', detail: 'V = IR in words, symbols and units' },
  { id: 'P16-05', label: 'How do you use V = IR?', detail: 'Two worked examples, then practice' },
  { id: 'P16-08', label: 'Which components keep the same resistance?', detail: 'Ohmic conductors, diodes and filament lamps' },
  { id: 'P16-11', label: 'On your own', detail: 'Units, calculations and components' },
]

const states: ScienceState[] = [
  { ...meaning.choice('P16-01', 'A student adds another resistor to a working circuit with the same battery. What happens to the current?', ['It gets bigger', 'It stays exactly the same', 'It gets smaller', 'It flows the other way round'], 2, 'Resistance slows the flow of charge.', ['More resistance means it is harder for charge to flow.', 'With the same battery, the current gets smaller.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'P16-02', 'What links pd, current and resistance?'),
  meaning.choice('P16-03', 'Which is the correct word equation?', ['Potential difference = current ÷ resistance', 'Potential difference = current × resistance', 'Potential difference = current + resistance', 'Potential difference = resistance ÷ current'], 1, 'The three quantities are multiplied.', ['Potential difference = current × resistance.', 'In symbols this is V = IR.'], 'recall'),
  meaning.choice('P16-04', 'The battery stays the same and the resistance in a circuit is increased. What happens to the current?', ['It gets smaller', 'It gets bigger', 'It stays the same', 'It becomes zero at once'], 0, 'The greater the resistance, the smaller the current.', ['More resistance slows the flow of charge more.', 'So the current gets smaller.']),
  t(calc, 'P16-05', 'How do you use V = IR?'),
  calc.choice('P16-06', 'A current of 2.5 A flows through a 6.0 Ω resistor. What is the potential difference across it?', ['2.4 V', '8.5 V', '3.5 V', '15 V'], 3, 'Multiply the current by the resistance.', ['V = I × R = 2.5 × 6.0.', 'That equals 15 V.'], 'calculation'),
  calc.choice('P16-07', 'A 9.0 V battery is connected across a 3.0 Ω resistor. What is the current?', ['27 A', '6.0 A', '3.0 A', '12 A'], 2, 'To find the current, divide the potential difference by the resistance.', ['I = V ÷ R = 9.0 ÷ 3.0.', 'That equals 3.0 A.'], 'calculation'),
  t(kinds, 'P16-08', 'Which components keep the same resistance?'),
  kinds.choice('P16-09', 'Which of these is an ohmic conductor at a fixed temperature?', ['A filament lamp', 'A fixed resistor', 'A diode', 'A switch'], 1, 'Its resistance does not change with current.', ['A fixed resistor keeps the same resistance while its temperature is fixed.', 'A filament lamp and a diode both change resistance.']),
  kinds.choice('P16-10', 'A diode is connected so that current flows through it. It is then turned the other way round. What happens?', ['Almost no current flows', 'The current doubles', 'The current stays the same', 'The diode becomes an ohmic conductor'], 0, 'A diode has very high resistance in one direction.', ['A diode lets current through in one direction only.', 'Reversed, its resistance is very high, so almost no current flows.']),
  kinds.choice('P16-11', 'Which unit is used to measure resistance?', ['Amperes', 'Volts', 'Ohms', 'Watts'], 2, 'It has the Greek letter omega as its symbol.', ['Resistance is measured in ohms, Ω.', 'Amperes measure current and volts measure potential difference.'], 'recall', true),
  calc.choice('P16-12', 'The circuit shows a 24 V supply across an 8.0 Ω resistor. What current does the ammeter read?', ['192 A', '3.0 A', '16 A', '32 A'], 1, 'Use I = V ÷ R.', ['I = V ÷ R = 24 ÷ 8.0.', 'That equals 3.0 A.'], 'calculation', true, 'ohm-q-circuit'),
  kinds.choice('P16-13', 'A resistor at constant temperature carries 0.60 A at 3.0 V. What current flows at 6.0 V?', ['0.30 A', '0.60 A', '3.6 A', '1.2 A'], 3, 'The current is directly proportional to the pd.', ['The resistor is ohmic, so doubling the pd doubles the current.', '2 × 0.60 A = 1.2 A.'], 'application', true),
  kinds.choice('P16-14', 'Why does the resistance of a filament lamp increase as the current increases?', ['The wire gets shorter', 'The battery gets weaker', 'The wire gets hotter', 'The current changes direction'], 2, 'Think about what the current does to the thin wire.', ['A larger current heats up the filament.', 'A hotter wire has a higher resistance.'], 'understanding', true),
  kinds.written('P16-15', 'Describe an ohmic conductor. Then explain how a filament lamp is different.', 'Ohmic means the resistance stays the same.', 'An ohmic conductor, such as a wire or a resistor at a fixed temperature, has a resistance that stays the same. Its current is directly proportional to the potential difference, so doubling the pd doubles the current. A filament lamp is different. Its filament heats up as the current increases, and the hotter wire has more resistance. So its resistance changes and it is not ohmic.', ['An ohmic conductor has a constant resistance.', 'Its current is directly proportional to the pd (double the pd, double the current), at a fixed temperature.', 'Examples: a wire or a resistor.', 'The filament in a lamp heats up as the current increases.', 'So the resistance of a filament lamp increases with current and it is not ohmic.'], ['Saying resistance is measured in volts.', 'Saying the filament lamp gets colder as the current rises.', 'Saying an ohmic conductor lets current flow in one direction only.']),
]

export const lessonP16: ScienceLesson = {
  id: 'P-ELE-016-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Resistance and V = IR', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
