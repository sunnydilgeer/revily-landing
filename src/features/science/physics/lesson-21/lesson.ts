import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { parallelFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.2 Series and parallel circuits (parallel: same pd across branches, total current is the sum of branch currents, total resistance less than any one resistor), as on the supplied revision page' }
const skill = 'P-PARALLEL'
const branches = author(skill, ['6.2.2'], ['aqa-physics'])
const rules = author(skill, ['6.2.2'], ['aqa-physics'])
const resist = author(skill, ['6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const parallelSections = [
  { id: 'P21-01', label: 'Start here', detail: 'One lamp off, the others stay on' },
  { id: 'P21-02', label: 'What is a parallel circuit?', detail: 'Branches that work independently' },
  { id: 'P21-05', label: 'How do pd and current behave?', detail: 'Same pd, currents add' },
  { id: 'P21-08', label: 'What happens to resistance?', detail: 'More branches, less total resistance' },
  { id: 'P21-11', label: 'On your own', detail: 'Reading and explaining parallel circuits' },
]

const states: ScienceState[] = [
  { ...branches.choice('P21-01', 'At home you switch off one lamp and the others stay on. How must the lamps be connected?', ['They are all on one single loop', 'Each lamp has its own route to the supply', 'They are joined end to end in a line', 'They are not connected to the supply'], 1, 'Think about what would happen if the current only had one route.', ['If all the lamps were on one loop, switching one off would break the loop.', 'The other lamps stay on, so each lamp must have its own route.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(branches, 'P21-02', 'What is a parallel circuit?'),
  branches.choice('P21-03', 'A parallel circuit has three lamps, each on its own branch. One lamp blows. What happens to the other two?', ['They both go out', 'They flicker on and off', 'They stay lit', 'They get much brighter'], 2, 'Each branch is connected to the supply separately.', ['The broken branch has no current, but the other branches are still complete loops.', 'So the other two lamps stay lit.']),
  branches.choice('P21-04', 'Why is it useful that the sockets in a home are wired in parallel?', ['Each appliance can be switched on and off without affecting the others', 'All appliances must be switched on together', 'Only one appliance can work at a time', 'The wires never get warm'], 0, 'Think about using a kettle while the television is off.', ['In parallel, each appliance is on its own branch.', 'So each one can be used on its own.'], 'recall'),
  t(rules, 'P21-05', 'How do pd and current behave?'),
  rules.choice('P21-06', 'A 9 V battery is connected to two identical lamps in parallel. What is the pd across each lamp?', ['4.5 V', '18 V', '0 V', '9 V'], 3, 'Each branch is connected straight across the battery.', ['In parallel, every branch gets the full pd of the battery.', 'So each lamp has 9 V across it.']),
  rules.choice('P21-07', 'The ammeter by a battery reads 5.0 A. One of two parallel branches carries 2.0 A. What is the other current?', ['7.0 A', '3.0 A', '2.5 A', '10 A'], 1, 'The branch currents add up to the total. Take away the one you know.', ['Total current = branch 1 + branch 2, so 5.0 = 2.0 + I₂.', 'I₂ = 5.0 − 2.0 = 3.0 A.'], 'calculation'),
  t(resist, 'P21-08', 'What happens to resistance?'),
  resist.choice('P21-09', 'A third lamp is added on a new branch of a parallel circuit. What happens to the total current from the battery?', ['It decreases', 'It stays the same', 'It increases', 'It falls to zero'], 2, 'The new branch takes some current of its own.', ['The old branches carry the same current as before.', 'The new branch adds more, so the total current increases.']),
  resist.choice('P21-10', 'Two 20 Ω resistors are connected in parallel. Which value could be their total resistance?', ['10 Ω', '20 Ω', '40 Ω', '60 Ω'], 0, 'The total is less than either resistor on its own.', ['In parallel, the total resistance is less than the resistance of any one resistor.', 'Only 10 Ω is less than 20 Ω.'], 'recall'),
  rules.choice('P21-11', 'Ammeter 1 (by the battery) reads 0.9 A and ammeter 2 (branch A) reads 0.4 A. What does ammeter 3 read?', ['1.3 A', '0.4 A', '0.9 A', '0.5 A'], 3, 'The two branch currents add up to the total current.', ['Total current = branch A + branch B, so 0.9 = 0.4 + I.', 'I = 0.9 − 0.4 = 0.5 A.'], 'calculation', true, 'parallel-q-circuit'),
  rules.choice('P21-12', 'One lamp is removed from a parallel circuit. What happens to the total current and to the current in the other branch?', ['Both stay the same', 'The total goes down and the other branch stays the same', 'The total goes up and the other branch goes down', 'Both go down'], 1, 'The other branch still has the full pd across it.', ['The other branch still has the full battery pd, so its current is unchanged.', 'One route has gone, so the total current from the battery goes down.'], 'understanding', true),
  resist.choice('P21-13', 'Why does adding a resistor in parallel make the total resistance smaller?', ['The current gets smaller', 'The pd across each branch goes up', 'The pd stays the same but the total current gets larger', 'Resistors lose resistance when warm'], 2, 'Use R = V ÷ I.', ['The pd is the same but there is one more route for current.', 'More total current for the same pd means a smaller total resistance.'], 'understanding', true),
  rules.choice('P21-14', 'Which statement about a parallel circuit is correct?', ['Every branch has the same pd as the battery', 'The current is the same everywhere', 'The pd is shared out between the branches', 'The total resistance is all the resistances added up'], 0, 'Think about how each branch is connected to the battery.', ['Each branch is connected straight across the battery.', 'So every branch has the same pd as the battery.'], 'recall', true),
  rules.written('P21-15', 'Explain what happens to the total current and total resistance when one more resistor is added in parallel to a cell.', 'Say what stays the same, what increases, then use R = V ÷ I.', 'The pd across each branch stays the same, because every branch is connected straight across the cell. The new resistor is on its own branch, so the current in the other branches does not change. The new branch takes extra current, so the total current increases. Resistance is pd divided by current, R = V ÷ I. The same pd with a larger current means the total resistance decreases.', ['The pd across each branch stays the same (equal to the cell pd).', 'The current in the existing branches does not change.', 'The new branch takes extra current, so the total current increases.', 'R = V ÷ I, so the total resistance decreases.'], ['Saying the current is shared equally between all branches in every case.', 'Saying the total resistance increases.', 'Saying the pd is split between the branches.']),
]

export const lessonP21: ScienceLesson = {
  id: 'P-ELE-021-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Parallel circuits', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
