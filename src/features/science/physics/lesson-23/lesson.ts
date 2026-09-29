import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { mainsFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.2.3.1 Direct and alternating potential difference; 6.2.3.2 Mains electricity (ac and dc, 230 V and 50 Hz, live, neutral and earth wires, danger of the live wire), as on the supplied revision page' }
const skill = 'P-MAINS'
const supply = author(skill, ['6.2.3.1'], ['aqa-physics'])
const wires = author(skill, ['6.2.3.2'], ['aqa-physics'])
const danger = author(skill, ['6.2.3.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const mainsSections = [
  { id: 'P23-01', label: 'Start here', detail: 'Why a plug is covered in plastic' },
  { id: 'P23-02', label: 'What are ac and dc?', detail: 'Two kinds of supply and the UK mains' },
  { id: 'P23-05', label: 'What is inside a plug cable?', detail: 'Live, neutral and earth' },
  { id: 'P23-08', label: 'Why is the live wire dangerous?', detail: 'A pd between live and earth' },
  { id: 'P23-11', label: 'On your own', detail: 'Wires, supplies and safety' },
]

const states: ScienceState[] = [
  { ...supply.choice('P23-01', 'A plug has plastic on the outside and plastic around each wire inside. Why?', ['Plastic does not conduct, so it stops current reaching you', 'Plastic makes the current larger', 'Plastic is used because it is heavy', 'Plastic lets the wires change colour'], 0, 'Think about what could happen if you touched the wires.', ['Plastic is an insulator, so current cannot pass through it.', 'It keeps the current in the wires and away from you.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(supply, 'P23-02', 'What are ac and dc?'),
  supply.choice('P23-03', 'Which of these gives direct current?', ['A wall socket in a classroom', 'The mains supply to a house', 'A three-pin plug', 'A cell in a torch'], 3, 'Direct current always flows the same way.', ['Cells and batteries supply direct current, or dc.', 'The mains supply is alternating current, or ac.']),
  supply.choice('P23-04', 'Which values describe the UK mains supply?', ['12 V and 5 Hz', 'About 230 V and 50 Hz', 'About 50 V and 230 Hz', 'About 230 V and dc'], 1, 'The pd is a few hundred volts, and the frequency is in the tens.', ['The UK mains supply is about 230 V.', 'It is ac with a frequency of 50 Hz.'], 'recall'),
  t(wires, 'P23-05', 'What is inside a plug cable?'),
  wires.choice('P23-06', 'A wire in a three-core cable is green and yellow. What is its job?', ['It brings 230 V from the supply', 'It completes the circuit', 'It is a safety wire that stops the appliance becoming live', 'It stores charge'], 2, 'Green and yellow is the safety wire.', ['The green and yellow wire is the earth wire.', 'It is a safety wire that stops the appliance becoming live.']),
  wires.choice('P23-07', 'Which wires are at about 0 V?', ['The neutral wire and the earth wire', 'The live wire only', 'The live wire and the neutral wire', 'All three wires'], 0, 'Only one of the three wires is at about 230 V.', ['The live wire is at about 230 V.', 'The neutral wire and the earth wire are at about 0 V.'], 'recall'),
  t(danger, 'P23-08', 'Why is the live wire dangerous?'),
  danger.choice('P23-09', 'Why can touching the live wire give you an electric shock?', ['The neutral wire is at 230 V', 'Your body can link the live wire to the earth, so a current flows through you', 'A current cannot flow through the human body', 'The live wire is always cold'], 1, 'There is a large pd between the live wire and the earth.', ['The live wire is at about 230 V and the earth is at 0 V.', 'If you touch it, current can flow through you to the earth.']),
  danger.choice('P23-10', 'A lamp switch is turned off, but the live wire inside can still be dangerous. Why?', ['The neutral wire becomes live', 'The bulb becomes hot', 'Off switches do nothing', 'The wire on the supply side can still be at about 230 V'], 3, 'Think about which part of the wire is still joined to the supply.', ['An open switch breaks the circuit, but the live wire can still have a pd.', 'So touching it may still be dangerous.']),
  wires.choice('P23-11', 'Look at the plug. Which numbered wire is the live wire, at about 230 V?', ['Wire 1', 'Wire 2', 'Wire 3', 'None of them'], 2, 'Use the colours of the wires.', ['The live wire is brown.', 'Wire 3 is the brown wire.'], 'dataInterpretation', true, 'mains-q-plug'),
  supply.choice('P23-12', 'A student says a battery supplies alternating current. What is wrong with this?', ['A battery supplies direct current, which flows in one direction', 'A battery supplies ac at 230 V', 'A battery does not supply any current', 'Only the mains supply is dc'], 0, 'Think about which kind of supply changes direction.', ['A battery supplies direct current, dc.', 'The current always flows in the same direction.'], 'understanding', true),
  wires.choice('P23-13', 'A fault in a kettle could make its metal case live. What does the earth wire do?', ['It stops the kettle boiling', 'It stops the case becoming live', 'It supplies the 230 V', 'It makes the current alternate'], 1, 'The earth wire is a safety wire.', ['The earth wire is at 0 V and joined to the metal parts.', 'It is there to stop the appliance becoming live.'], 'understanding', true),
  danger.choice('P23-14', 'Why can any connection between the live wire and the earth cause a fire?', ['The wires are coloured', 'The plastic insulation conducts', 'Current cannot flow', 'The large pd could make a huge current flow'], 3, 'Think about a large pd with nothing to limit the current.', ['A large pd between live and earth could make a huge current flow.', 'A huge current can heat wires enough to start a fire.'], 'understanding', true),
  wires.written('P23-15', 'Describe the three wires in a mains cable: colour, job and pd. Then explain why the live wire is dangerous.', 'Go wire by wire, then say what a person could provide.', 'The live wire is brown. It brings the alternating pd of about 230 V from the mains supply. The neutral wire is blue. It completes the circuit and is at about 0 V. The earth wire is green and yellow. It is a safety wire at 0 V that stops the appliance becoming live. The live wire is dangerous because there is a large pd between it and the earth. If you touch it, you can provide a link and a large current can flow through you, giving an electric shock.', ['Live: brown, about 230 V, brings the alternating pd from the supply.', 'Neutral: blue, about 0 V, completes the circuit.', 'Earth: green and yellow, 0 V, safety wire that stops the appliance becoming live.', 'There is a large pd between the live wire and the earth.', 'Touching the live wire links it to the earth so a current flows through you (electric shock).'], ['Saying the neutral wire is at 230 V.', 'Saying the earth wire carries the current all the time.', 'Saying a switch turned off makes the live wire completely safe.']),
]

export const lessonP23: ScienceLesson = {
  id: 'P-ELE-023-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Electricity in the home', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
