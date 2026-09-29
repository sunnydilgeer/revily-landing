import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { irEmitFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.2 Uses and applications of electromagnetic waves, required practical (investigating infrared radiation emitted by different surfaces with a Leslie cube), as on the supplied revision page' }
const skill = 'P-WAV-060-P'
const idea = author(skill, ['6.6.2.2'], ['aqa-physics'])
const method = author(skill, ['6.6.2.2'], ['aqa-physics'])
const result = author(skill, ['6.6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const irEmitSections = [
  { id: 'P60-01', label: 'Start here', detail: 'Two mugs of hot tea' },
  { id: 'P60-02', label: 'What changes the infrared?', detail: 'Temperature, surface and the Leslie cube' },
  { id: 'P60-05', label: 'How do you run it?', detail: 'The method and the boiling-water hazard' },
  { id: 'P60-08', label: 'What do the results show?', detail: 'Matt black emits most, shiny metal least' },
  { id: 'P60-11', label: 'On your own', detail: 'Readings, the set-up and the method' },
]

const states: ScienceState[] = [
  { ...idea.choice('P60-01', 'Two mugs hold tea at the same temperature. One mug is matt black and one is shiny silver. Which gives out more heat radiation?', ['The shiny silver mug', 'The matt black mug', 'They give out exactly the same', 'Neither gives out any'], 1, 'Think about which mug you would feel more warmth from with your hand held near it.', ['A matt black surface gives out more infrared radiation than a shiny one at the same temperature.', 'You will test this idea with a Leslie cube.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P60-02', 'What changes the infrared?'),
  idea.choice('P60-03', 'Which two things affect how much infrared radiation an object emits?', ['Its mass and its shape', 'Its temperature and its surface', 'Its age and its size', 'Its speed and its position'], 1, 'One is how hot it is. The other is about the outside of the object.', ['A hotter object emits more infrared radiation.', 'The surface matters too: how rough or shiny it is, and its colour.'], 'recall'),
  idea.choice('P60-04', 'What is special about the four side faces of a Leslie cube?', ['Each has a different surface', 'They are all matt black', 'They are all at different temperatures', 'They are made of four different liquids'], 0, 'You want only one thing to change between the faces.', ['The four faces are matt black, matt white, shiny metal and dull metal.', 'The water inside is the same for all of them, so only the surface changes.']),
  t(method, 'P60-05', 'How do you run it?'),
  method.choice('P60-06', 'You have just filled the Leslie cube with boiling water. What should you do?', ['Pick it up to turn it round', 'Put your hand on a face to feel the heat', 'Leave it on the mat and do not move it just after filling', 'Pour cold water in to cool it'], 2, 'Boiling water scalds. Moving a full, hot cube is risky.', ['Leave the cube where it is on the heat-proof mat, and do not move it just after filling it.', 'A spill of boiling water could cause a serious burn.'], 'practicalReasoning'),
  method.choice('P60-07', 'Why is the detector put 10 cm from every face?', ['So the cube stays cooler', 'So the test is fair: only the surface changes', 'So the detector reads a higher value', 'So the water stays boiling'], 1, 'If the distance changed, the readings would change for a reason that is not the surface.', ['Keeping the distance the same means the distance cannot explain any difference.', 'That leaves the surface as the only thing that changes.'], 'practicalReasoning'),
  t(result, 'P60-08', 'What do the results show?'),
  result.choice('P60-09', 'Which face should give the highest reading on the detector?', ['Shiny metal', 'Matt white', 'Matt black', 'Dull metal'], 2, 'The best emitter gives out the most infrared radiation.', ['A matt black surface is the best emitter of infrared radiation.', 'So the detector reads highest for the matt black face.'], 'dataInterpretation'),
  result.choice('P60-10', 'Which is the better emitter of infrared radiation: a shiny surface or a matt surface?', ['A matt surface', 'A shiny surface', 'They are the same', 'It depends on the mass'], 0, 'Compare the shiny metal face with the dull metal face.', ['Matt surfaces emit more infrared radiation than shiny ones.', 'Shiny metal is the worst emitter of the four faces.']),
  result.choice('P60-11', 'Which surface was the best emitter in these results?', ['Matt white', 'Dull metal', 'Shiny metal', 'Matt black'], 3, 'The highest bar means the most infrared radiation detected.', ['The matt black face has the highest reading, 78.', 'So matt black is the best emitter of infrared radiation.'], 'dataInterpretation', true, 'iremit-q-readings'),
  method.choice('P60-12', 'Which numbered part of the set-up measures the infrared radiation?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 1, 'It is the small box facing one face of the cube.', ['Part 2 is the infrared detector. It stands on the line 10 cm from the face.', 'Part 1 is the Leslie cube. It is the source of the radiation.'], 'practicalReasoning', true, 'iremit-q-setup'),
  method.choice('P60-13', 'A student puts the detector 10 cm from one face and 20 cm from another. What is wrong?', ['The distance should be the same, so the test is fair', 'The detector should be closer to the shiny face', 'Nothing is wrong', 'The kettle should be moved'], 0, 'Only one variable should change between the four measurements.', ['The distance must be the same for every face.', 'Otherwise you cannot tell whether the surface or the distance caused the difference.'], 'practicalReasoning', true),
  idea.written('P60-14', 'Describe how you could compare the infrared radiation emitted by different surfaces. Include one safety point.', 'Cover the equipment, the measurement, the fair test and safety.', 'Fill a Leslie cube with boiling water. Wait for it to warm up. Hold an infrared detector 10 cm from one face and record the reading. Repeat for each of the four faces at the same distance. Repeat the experiment to check the results. The face with the highest reading is the best emitter. Boiling water can scald, so do not move the cube just after filling it.', ['Fill the Leslie cube with boiling water and leave it to warm up.', 'Use an infrared detector at the same distance from each face.', 'Record the reading for each of the four faces.', 'Repeat the experiment to check the results.', 'The face with the highest reading emits the most infrared radiation.', 'One sensible safety point, such as not moving the cube just after filling it with boiling water.'], ['Saying the online lesson has completed the practical.', 'Using a different distance for each face.', 'Saying a shiny surface is the best emitter.']),
]

export const lessonP60: ScienceLesson = {
  id: 'P-WAV-060-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating infrared emission', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
