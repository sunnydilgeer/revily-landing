import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { newtonThirdFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.4.2.3 Newton\'s Third Law, as on the supplied revision page' }
const skill = 'P-NEWTON3'
const law = author(skill, ['6.5.4.2.3'], ['aqa-physics'])
const wall = author(skill, ['6.5.4.2.3'], ['aqa-physics'])
const book = author(skill, ['6.5.4.2.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const newtonThirdSections = [
  { id: 'P48-01', label: 'Start here', detail: 'Pushing a trolley' },
  { id: 'P48-02', label: 'What does the Third Law say?', detail: 'Equal and opposite forces on different objects' },
  { id: 'P48-05', label: 'If forces are equal, how does anything move?', detail: 'A wall, and a puzzle solved' },
  { id: 'P48-08', label: 'What is the book trap?', detail: 'Balanced forces are not always a Third Law pair' },
  { id: 'P48-11', label: 'On your own', detail: 'Spotting pairs and explaining' },
]

const states: ScienceState[] = [
  { ...law.choice('P48-01', 'You push a shopping trolley forwards. What does the trolley do to you?', ['Nothing, trolleys cannot push', 'It pushes back on you with a force of the same size', 'It pushes back with a smaller force', 'It pulls you forwards'], 1, 'Think about how your hands feel when you push hard.', ['Your hands feel a force pushing back.', 'The trolley pushes back on you with a force of the same size.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(law, 'P48-02', 'What does the Third Law say?'),
  law.choice('P48-03', 'Skater A pushes skater B with a force of 40 N. What force does skater B put on skater A?', ['0 N', '20 N in the same direction', '80 N in the opposite direction', '40 N in the opposite direction'], 3, 'The forces are equal and opposite.', ['A Third Law pair has forces of the same size.', 'They point in opposite directions, so skater A feels 40 N the other way.']),
  law.choice('P48-04', 'The two forces in a Newton\'s Third Law pair act on which objects?', ['Two different objects', 'The same object', 'Only the heavier object', 'Only the lighter object'], 0, 'One force acts on each of the two objects that interact.', ['Each force acts on a different object.', 'That is why they do not cancel out.'], 'recall'),
  t(wall, 'P48-05', 'If forces are equal, how does anything move?'),
  wall.choice('P48-06', 'A man pushes a wall with 200 N. How big is the force of the wall on the man?', ['0 N', '100 N', '200 N', '400 N'], 2, 'Equal and opposite.', ['The wall pushes back with a force of the same size.', 'So the force of the wall on the man is 200 N.']),
  wall.choice('P48-07', 'The forces in a pair are equal and opposite. Why can the skaters still accelerate?', ['The forces only act on the ice', 'The forces are not really equal', 'Skaters have no mass', 'The two forces act on different objects'], 3, 'Think about which object each force acts on.', ['Each force acts on a different skater, so they do not cancel out.', 'The force on each skater changes that skater\'s motion.']),
  t(book, 'P48-08', 'What is the book trap?'),
  book.choice('P48-09', 'A book rests on a table. Which is a Newton\'s Third Law pair?', ['The weight of the book, and the normal contact force on the book from the table', 'The weight of the book, and the weight of the table', 'The upward push of the table on the book, and the downward push of the book on the table', 'The push of the book on the table, and the weight of the book'], 2, 'A pair is the same type of force acting on two different objects.', ['A contact force from the table on the book has a contact force from the book on the table as its partner.', 'They are the same type and act on different objects.']),
  book.choice('P48-10', 'Why are the weight of a book and the normal contact force on it NOT a Third Law pair?', ['They both act on the same object, the book', 'They are different sizes', 'They act in the same direction', 'They both act on the table'], 0, 'Where do both forces act?', ['Both forces act on the book.', 'The forces of a Third Law pair act on two different objects.']),
  { ...law.choice('P48-11', 'A swimmer pushes the water backwards. What does Newton\'s Third Law say happens?', ['Nothing, water cannot push', 'The water pushes her forwards with a force of the same size', 'The water pushes her forwards with a smaller force', 'The water pushes her backwards'], 1, 'The water pushes back on her.', ['Her push on the water has a partner force.', 'The water pushes her forwards with a force of the same size, so she moves forwards.'], 'application', true) },
  wall.choice('P48-12', 'Two skaters push each other apart. A has mass 50 kg and B has mass 65 kg. Which is correct?', ['The force on B is bigger, so B accelerates more', 'The force on A is bigger, so A accelerates less', 'The forces are equal, and A accelerates more', 'The forces are equal, and B accelerates more'], 2, 'Equal forces: the smaller mass accelerates more.', ['The forces are equal and opposite.', 'Skater A has the smaller mass, so A accelerates more.'], 'dataInterpretation', true, 'newton3-q-skaters'),
  law.choice('P48-13', 'A car drives along a road. The tyres push the road backwards. Which force is the Third Law partner of this push?', ['The weight of the car', 'The drag from the air', 'The push of the engine', 'The road pushes the tyres forwards with a force of the same size'], 3, 'A pair acts on the two objects that interact.', ['The tyres and the road are the two objects that interact.', 'So the partner is the road pushing the tyres forwards with a force of the same size.'], 'application', true),
  law.choice('P48-14', 'Which statement about a Newton\'s Third Law pair of forces is true?', ['They act on the same object', 'They are always different sizes', 'They are equal in size and opposite in direction', 'They always cancel out'], 2, 'Remember the three key points.', ['A Third Law pair is equal in size and opposite in direction.', 'The forces act on different objects, so they do not cancel out.'], 'recall', true),
  book.written('P48-15', 'A man pushes a wall and it does not move. Use Newton\'s Third Law to describe the forces between them.', 'Name both forces and say what they are like.', 'The man pushes on the wall. The wall pushes back on the man with a normal contact force. These two forces are equal in size and opposite in direction. They act on different objects, one on the wall and one on the man.', ['The man pushes on the wall.', 'The wall pushes back on the man with a normal contact force.', 'The forces are equal in size and opposite in direction.', 'They act on different objects.'], ['Saying the wall pushes back harder than the man pushes.', 'Saying the forces act on the same object and cancel.', 'Saying the wall does not push because it does not move.']),
]

export const lessonP48: ScienceLesson = {
  id: 'P-MOT-048-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Newton\'s Third Law', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
