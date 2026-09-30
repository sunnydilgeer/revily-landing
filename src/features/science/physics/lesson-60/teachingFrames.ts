import type { TeachingFrame } from '../../teachingFrame'

// Preparation for the infrared emission investigation with a Leslie cube. The online lesson prepares students;
// the practical itself is done in the lab with a teacher (boiling water is a real hazard).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const irEmitFrames: Record<string, TeachingFrame[]> = {
  'P60-02': [
    f('Hot things give out infrared', 'Every object gives out infrared radiation. The hotter it is, the more it gives out.', 'hotter means more', 'Every object gives out infrared radiation. This is called emitting it. The hotter the object is, the more infrared radiation it emits. A hot kettle emits far more than a cold one.', 'iremit-temp'),
    f('The surface matters too', 'The amount also depends on the surface: how rough or shiny it is, and its colour.', 'rough, shiny, colour', 'Two objects at the same temperature can still emit different amounts. The surface makes a difference. It matters how rough or shiny the surface is, and what colour it is.', 'iremit-surface'),
    f('The Leslie cube', 'A Leslie cube is a hollow metal cube. Its four side faces have four different surfaces.', 'one cube, four surfaces', 'A Leslie cube is a hollow metal cube that you fill with hot water. Its four side faces are each finished differently. One face is matt black, one is matt white, one is shiny metal and one is dull metal. Matt means dull, not shiny.', 'iremit-cube'),
  ],
  'P60-05': [
    f('The equipment', 'You need a Leslie cube, a heat-proof mat, an infrared detector, a pencil and a kettle.', 'cube, mat, detector, kettle', 'Stand the Leslie cube on a heat-proof mat. You also need an infrared detector to measure the radiation, a pencil, and a kettle of boiling water. Your teacher runs this practical in the lab. Here you learn the method.', 'iremit-kit'),
    f('Fill it safely', 'Boil the water and fill the cube. Do not move the cube straight after filling it.', 'boiling water is a hazard', 'Boil water in a kettle and fill the Leslie cube with it. Boiling water can scald you. Do not move the cube just after filling it, and carry a full kettle with great care.', 'iremit-safety'),
    f('Measure each face', 'Draw a square 10 cm from the cube. Put the detector on the line facing one face and record the reading.', 'same distance every time', 'Before you start, draw a square round the cube, 10 cm away from every face. Wait for the cube to warm up. Place the infrared detector on the line, facing one vertical face. Record the amount of infrared radiation it detects.', 'iremit-detect'),
    f('Repeat for every face', 'Do the same for each of the four faces, then repeat the whole experiment.', 'four faces, same method', 'Repeat the measurement for each of the four faces, with the detector the same distance away every time. Then repeat the whole experiment to check your results. All four faces should be at the same temperature, so only the surface changes.', 'iremit-repeat'),
  ],
  'P60-08': [
    f('Read the detector', 'The face with the highest reading is giving out the most infrared radiation.', 'highest reading, most emitted', 'The detector shows how much infrared radiation reaches it. The face with the highest reading is emitting the most infrared radiation. The face with the lowest reading is emitting the least.', 'iremit-results'),
    f('Black beats white', 'The matt black face gives a higher reading than the matt white face.', 'colour changes the reading', 'You should find that the matt black face emits more infrared radiation than the matt white face. Black is a better emitter of infrared radiation than white. This is true even though the water inside is the same temperature.', 'iremit-compare'),
    f('Matt beats shiny', 'Matt surfaces emit more than shiny ones. Shiny metal is the worst emitter.', 'dull emits more than shiny', 'You should also find that a matt surface emits more infrared radiation than a shiny one. So the best emitter is matt black, and the worst is shiny metal. Repeating the experiment lets you check the pattern.', 'iremit-order'),
  ],
}
