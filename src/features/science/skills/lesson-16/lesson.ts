import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsSafetyFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 2.4 (safe working and ethical treatment of living things), AT 3 (safe use of apparatus and chemicals), as on the supplied revision page' }
const skill = 'W-PRC-016-W'
const a = author(skill, ['WS 2.4', 'AT 3'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsSafetySections = [
  { id: 'W16-01', label: 'Start here', detail: 'Before the practical starts' },
  { id: 'W16-02', label: 'How do you work safely with chemicals?', detail: 'Clothing, hazards, fume cupboards and dilution' },
  { id: 'W16-06', label: 'Is equipment hazardous too?', detail: 'Clamp stands, heating and electronics' },
  { id: 'W16-09', label: 'What about ethics?', detail: 'Animals and people' },
  { id: 'W16-11', label: 'On your own', detail: 'Spotting hazards and planning safely' },
]

const states: ScienceState[] = [
  { ...a.choice('W16-01', 'A class is about to start a practical with chemicals. What is the best thing to do first?', ['Start straight away to save time', 'Put on the right clothing and listen to the instructions', 'Smell each chemical to find out what it is', 'Ask a friend to hold the chemicals'], 1, 'Think about how to be prepared before anything is opened.', ['Wear a lab coat, goggles and gloves, and follow your teacher’s instructions.', 'This keeps you safe before any chemicals are used.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W16-02', 'How do you work safely with chemicals?'),
  a.choice('W16-03', 'A reaction will give off a harmful gas. Where should it be carried out?', ['On an open bench', 'Near a hot Bunsen burner', 'In a fume cupboard', 'Under the table'], 2, 'You want the gas to be drawn away from the room.', ['A fume cupboard draws harmful gases away.', 'The gas cannot escape into the room where people are working.'], 'application'),
  a.choice('W16-04', 'What should you use to move a solid from one container to another?', ['Gloved fingers', 'Your bare hands', 'A kitchen spoon', 'A spatula'], 3, 'You should never touch chemicals directly.', ['Use a spatula to transfer solids.', 'Gloves do not make it safe to touch chemicals.'], 'understanding'),
  a.choice('W16-05', 'You are diluting a concentrated acid. What is the safe way to do it?', ['Add the concentrated acid to the water', 'Add water to the concentrated acid quickly', 'Mix them in a closed bottle', 'Heat the acid first'], 0, 'Think about which liquid goes into which.', ['Add the concentrated liquid to the water.', 'Doing it the other way round could make the mixture very hot.'], 'practicalReasoning'),
  t('W16-06', 'Is equipment hazardous too?'),
  a.choice('W16-07', 'A metal block has just been heated. What should you do before you move it?', ['Pick it up quickly with bare hands', 'Let it cool, or wear insulated gloves', 'Hold it with your fingers under the tap', 'Leave a hot immersion heater in the liquid'], 1, 'Think about the hot material and your hands.', ['Let hot materials cool, or wear insulated gloves.', 'This stops burns.'], 'application'),
  a.choice('W16-08', 'Why do students use a low voltage and low current when building circuits?', ['To stop wires overheating and components being damaged', 'To make the bulbs brighter', 'To use less wire', 'To make the wires heat up'], 0, 'Too much current heats wires.', ['A low voltage and current keep the wires from overheating.', 'It also protects the components.'], 'understanding'),
  t('W16-09', 'What about ethics?'),
  a.choice('W16-10', 'A class catches pond snails to study them. What should happen after the experiment?', ['They are kept in a bag overnight', 'They are thrown in the bin', 'They are left in a classroom drawer', 'They are returned to the pond'], 3, 'Wild animals belong in their habitat.', ['Wild animals should be returned to their habitat afterwards.', 'They must be handled carefully throughout.'], 'application'),
  a.choice('W16-11', 'Look at the numbered parts of this practical. Which numbered part is an unsafe way of working?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'Look for the part that breaks a safety rule from this lesson.', ['Part 3 shows a bare hand touching a hot beaker, which could burn.', 'The other parts show safe habits, such as goggles, a spatula and a funnel.'], 'practicalReasoning', true, 'wssafety-q-scene'),
  a.choice('W16-12', 'Before lighting a Bunsen burner, what should you check?', ['That the door is locked', 'That nothing flammable is nearby and the area is well ventilated', 'That the tap is running', 'That your gloves are off'], 1, 'Think about what could catch fire.', ['Flammable chemicals near a flame could catch fire.', 'Work in a well ventilated area.'], 'practicalReasoning', true),
  a.choice('W16-13', 'A student wants to measure how exercise changes the pulse rates of classmates. What must they make sure of?', ['Everyone taking part is happy to do so', 'Only people who say no are used', 'Nobody is told what will happen', 'The exercise is as hard as possible'], 0, 'Other students who take part have a choice.', ['Students should be happy to take part and able to say no.', 'The exercise should also be sensible, not as hard as possible.'], 'application', true),
  a.written('W16-14', 'A student will react a solid with a concentrated acid, which gives off a harmful gas. Describe how to carry out the experiment safely.', 'Think about clothing, the gas, moving the chemicals and diluting.', 'I would wear a lab coat, safety goggles and gloves and follow my teacher’s instructions. I would carry out the reaction in a fume cupboard, because the gas is harmful. I would move the solid with a spatula and pour the liquid through a funnel, and never touch the chemicals. If the acid needed diluting, I would add the concentrated acid to the water.', ['Wear a lab coat, goggles and gloves.', 'Use a fume cupboard for the harmful gas.', 'Use a spatula for the solid and a funnel for the liquid.', 'Add the concentrated acid to water, not the other way round.'], ['Adding water to concentrated acid.', 'Touching the chemicals because gloves are on.', 'Doing the experiment on the open bench.']),
]

export const lessonW16: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Safety and ethics in the lab', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
