import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { circuitFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.1.1 Standard circuit diagram symbols and 6.2.1.2 Electrical charge and current (current, potential difference and resistance, closed circuits, Q = It), as on the supplied revision page' }
const skill = 'P-CIRCUIT'
const ideas = author(skill, ['6.2.1.1', '6.2.1.2'], ['aqa-physics'])
const charge = author(skill, ['6.2.1.2'], ['aqa-physics'])
const symbols = author(skill, ['6.2.1.1'], ['aqa-physics'])
const draw = author(skill, ['6.2.1.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const circuitSections = [
  { id: 'P15-01', label: 'Start here', detail: 'A lamp and a gap' },
  { id: 'P15-02', label: 'What are current, pd and resistance?', detail: 'Three ideas, three units' },
  { id: 'P15-05', label: 'How much charge flows?', detail: 'Q = I × t' },
  { id: 'P15-09', label: 'What do the circuit symbols look like?', detail: 'Fourteen standard symbols' },
  { id: 'P15-12', label: 'How do you draw a circuit?', detail: 'Rules, ammeters and voltmeters' },
  { id: 'P15-14', label: 'On your own', detail: 'Charge, symbols and circuits' },
]

const states: ScienceState[] = [
  { ...ideas.choice('P15-01', 'A lamp is joined to a cell with wires, but there is a gap in the circuit. What happens to the lamp?', ['It glows brightly', 'It does not light, because charge cannot flow round a gap', 'It glows dimly', 'It gets hot but does not light'], 1, 'Can charge get all the way round the loop?', ['Charge only flows round a complete loop.', 'With a gap, nothing flows, so the lamp does not light.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(ideas, 'P15-02', 'What are current, pd and resistance?'),
  ideas.choice('P15-03', 'Which pair shows a quantity and its unit correctly?', ['Current, ohms', 'Potential difference, amperes', 'Resistance, volts', 'Current, amperes'], 3, 'Current has the symbol A.', ['Current is measured in amperes.', 'Potential difference is in volts and resistance is in ohms.'], 'recall'),
  ideas.choice('P15-04', 'Which of these describes resistance?', ['The driving force that pushes charge round', 'A flow of electrical charge', 'Anything that slows the flow of charge down', 'The energy stored in a cell'], 2, 'Think about what resistance does to the flow.', ['Resistance is anything that slows the flow of charge down.', 'The push is potential difference, and the flow is current.']),
  t(charge, 'P15-05', 'How much charge flows?'),
  charge.worked('P15-06', 'Work out the charge that flows through a heater', 'A current of 3 A flows through a heater for 40 seconds. How much charge flows?', ['Write down what you know: I = 3 A and t = 40 s. The time is already in seconds.', 'Write the equation: charge flow = current × time, so Q = I × t.', 'Substitute the values: Q = 3 × 40 = 120. So 120 C of charge flows.'], 'circuit-worked-charge'),
  charge.choice('P15-07', 'A current of 5 A flows through a motor for 20 seconds. How much charge flows?', ['100 C', '4 C', '25 C', '0.25 C'], 0, 'Multiply the current by the time. The time is already in seconds.', ['Q = I × t = 5 × 20.', 'Q = 100 C.'], 'calculation'),
  charge.choice('P15-08', 'A current of 2 A flows for 3 minutes. How much charge flows?', ['6 C', '360 C', '180 C', '5 C'], 1, 'Change the minutes into seconds first.', ['3 minutes = 3 × 60 = 180 seconds.', 'Q = I × t = 2 × 180 = 360 C.'], 'calculation'),
  t(symbols, 'P15-09', 'What do the circuit symbols look like?'),
  symbols.choice('P15-10', 'Look at the four symbols. Which number shows a variable resistor?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 3, 'A variable resistor is a resistor with an arrow through it.', ['A resistor is a plain rectangle.', 'A variable resistor is a rectangle with an arrow drawn through it. That is number 4.'], 'recall', false, 'circuit-q-symbols'),
  symbols.choice('P15-11', 'Which component measures the current in a circuit?', ['Ammeter', 'Voltmeter', 'Fuse', 'Diode'], 0, 'It has the letter A in a circle.', ['An ammeter measures current.', 'A voltmeter measures potential difference.'], 'recall'),
  t(draw, 'P15-12', 'How do you draw a circuit?'),
  draw.choice('P15-13', 'A student draws a voltmeter in the main loop, in line with a lamp. What is wrong?', ['A voltmeter should be across the lamp, on its own branch', 'Voltmeters must be next to the cell', 'The voltmeter should be replaced by a fuse', 'Nothing is wrong'], 0, 'A voltmeter measures the potential difference across a component.', ['A voltmeter goes across the component, in parallel.', 'An ammeter is the meter that goes in the loop.']),
  charge.choice('P15-14', 'A current of 4 A flows through a motor for 2 minutes. How much charge flows?', ['8 C', '120 C', '240 C', '480 C'], 3, 'Change the minutes into seconds, then multiply.', ['2 minutes = 2 × 60 = 120 seconds.', 'Q = I × t = 4 × 120 = 480 C.'], 'calculation', true),
  symbols.choice('P15-15', 'Look at the circuit. Which number shows the component that measures the current?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 2, 'Look for the circle with an A, in the loop.', ['An ammeter is a circle with the letter A, and it is in the loop.', 'That is number 3.'], 'application', true, 'circuit-q-circuit'),
  draw.choice('P15-16', 'The lamp in this circuit is not lit. Which numbered component is stopping the current?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 3, 'Look for a gap in the loop.', ['Charge can only flow round a closed loop.', 'The switch, number 4, is open, so there is a gap in the loop.'], 'application', true, 'circuit-q-open'),
  ideas.choice('P15-17', 'A lamp is joined to a cell. A resistor is swapped for one with a greater resistance. What happens to the current?', ['It gets bigger', 'It stays the same', 'It gets smaller', 'It becomes charge'], 2, 'The potential difference stays the same. What does more resistance do?', ['A greater resistance slows the flow of charge more.', 'So for the same potential difference, the current gets smaller.'], 'understanding', true),
  ideas.written('P15-18', 'Describe current, potential difference and resistance, and give each unit. Say what a circuit needs for charge to flow.', 'Give the meaning, then the unit, then what the circuit needs.', 'Current is a flow of electrical charge, measured in amperes. Potential difference is the driving force that pushes charge round, measured in volts. Resistance is anything that slows the flow of charge down, measured in ohms. For charge to flow, the circuit must be a complete, closed loop, and it needs a source of potential difference, such as a cell or battery.', ['Current is a flow of charge, in amperes (A).', 'Potential difference is the driving force that pushes the charge, in volts (V).', 'Resistance slows the flow of charge down, in ohms (Ω).', 'The circuit must be a complete, closed loop.', 'It needs a source of potential difference, such as a cell or battery.'], ['Saying that current is a push.', 'Mixing up the units.', 'Saying that charge flows round a loop with a gap.']),
]

export const lessonP15: ScienceLesson = {
  id: 'P-ELE-015-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Current, charge and circuit symbols', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
