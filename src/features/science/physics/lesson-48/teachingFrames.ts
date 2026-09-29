import type { TeachingFrame } from '../../teachingFrame'

// Newton's Third Law: equal and opposite forces on different objects (trolley, skaters), the wall, and the book-on-table trap (a pair must be the same type of force on two objects).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const newtonThirdFrames: Record<string, TeachingFrame[]> = {
  'P48-02': [
    f('Two objects interact', 'When two objects interact, the forces they exert on each other are equal and opposite.', 'equal and opposite', 'Newton\'s Third Law says that when two objects interact, the forces they put on each other are equal and opposite. Push a trolley forward and the trolley pushes back on you, just as hard.', 'newton3-law'),
    f('Different objects', 'The two forces act on different objects.', 'one force on each object', 'The most important thing to remember is that the two forces act on different objects. One force acts on you. The other force acts on the trolley.', 'newton3-different'),
    f('Two skaters', 'Skater A pushes skater B. Skater B pushes skater A with a force of the same size in the opposite direction.', 'a pair of forces', 'Two skaters stand facing each other. Skater A pushes on skater B. At the same moment skater A feels a force of the same size from skater B, in the opposite direction.', 'newton3-skaters'),
    f('Same force, different acceleration', 'The skater with the smaller mass accelerates more.', 'mass matters', 'Both skaters are pushed away from each other by forces of the same size. From the Second Law, the skater with the smaller mass accelerates more.', 'newton3-skater-acc'),
  ],
  'P48-05': [
    f('Pushing a wall', 'The wall pushes back on the man with a normal contact force.', 'the wall pushes back', 'A man pushes on a wall. The wall pushes back on him. This push from a surface is called the normal contact force.', 'newton3-wall'),
    f('Same size, opposite way', 'The two forces are the same size. Push harder and the wall pushes back harder.', 'equal and opposite', 'The push of the man on the wall and the push of the wall on the man are the same size. They point in opposite directions. If he pushes harder, the wall pushes back harder.', 'newton3-wall-equal'),
    f('A puzzle', 'If the forces are always equal and opposite, how does anything ever move?', 'they do not cancel', 'Here is a puzzle. If the forces are always equal and opposite, how does anything ever move? The answer is that the two forces act on different objects, so they do not cancel each other out.', 'newton3-puzzle'),
    f('Look at one object', 'To see how one object moves, look at all the forces acting on that object.', 'forces on one object', 'To decide how one object moves, look at the forces acting on that object only. The force on skater A decides how skater A moves. The force on skater B decides how skater B moves.', 'newton3-one-object'),
  ],
  'P48-08': [
    f('A book at rest', 'The book is in equilibrium: the resultant force on it is zero.', 'not moving', 'A book rests on a table. It is not moving, so the resultant force on it is zero. We say the book is in equilibrium.', 'newton3-book'),
    f('Two forces on the book', 'The weight of the book pulls it down. The normal contact force from the table pushes it up.', 'down and up', 'The weight of the book pulls it down. The normal contact force from the table pushes it up. The two forces are equal and opposite, so they balance.', 'newton3-book-forces'),
    f('Not a Third Law pair', 'These two forces are equal and opposite, but they are not a Third Law pair.', 'a trap', 'Be careful. Not every pair of forces that is equal and opposite is an example of Newton\'s Third Law. The weight and the normal contact force are not a Third Law pair.', 'newton3-book-trap'),
    f('Why not?', 'The forces are different types, and both act on the book.', 'same type, different objects', 'One is a gravity force and the other is a contact force, so they are different types. Both forces act on the book. A Third Law pair is the same type of force, acting on two different objects.', 'newton3-book-why'),
    f('The real pair', 'The table pushes up on the book. The book pushes down on the table with an equal force.', 'a contact pair', 'The real Third Law pair is a contact force each way. The table pushes up on the book. The book pushes down on the table. They are the same type and act on different objects.', 'newton3-real-pair'),
  ],
}
