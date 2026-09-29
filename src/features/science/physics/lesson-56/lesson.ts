import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { refractionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.2 Refraction (waves changing direction at a boundary, constructing ray diagrams), as on the supplied revision page' }
const skill = 'P-REFRACT'
const idea = author(skill, ['6.6.2.2'], ['aqa-physics'])
const lines = author(skill, ['6.6.2.2'], ['aqa-physics'])
const draw = author(skill, ['6.6.2.2'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const refractionSections = [
  { id: 'P56-01', label: 'Start here', detail: 'A bent straw' },
  { id: 'P56-02', label: 'What is refraction?', detail: 'Waves changing direction at a boundary' },
  { id: 'P56-05', label: 'What do the lines mean?', detail: 'Ray, normal and the two angles' },
  { id: 'P56-08', label: 'How do you draw a ray diagram?', detail: 'Five steps with a ruler' },
  { id: 'P56-11', label: 'How do you use a protractor?', detail: 'Draw an incident ray at 40°' },
  { id: 'P56-13', label: 'On your own', detail: 'Read, spot and draw' },
]

const states: ScienceState[] = [
  { ...idea.choice('P56-01', 'A straw in a glass of water looks bent at the water surface. What is happening to the light?', ['The water bends the straw', 'The glass makes the straw shrink', 'The light changes direction where the water meets the air', 'The straw reflects all the light'], 2, 'Think about what light does at the edge of the water.', ['Light from the straw changes direction at the surface of the water.', 'So the straw looks bent, even though it is straight.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(idea, 'P56-02', 'What is refraction?'),
  idea.choice('P56-03', 'A ray of light meets a boundary between air and glass at an angle. What happens to it?', ['It is refracted, so it changes direction', 'It always carries on in a straight line', 'It stops at the boundary', 'It changes into a sound wave'], 0, 'Waves that meet a boundary at an angle can change direction.', ['A wave that meets a boundary at an angle is refracted.', 'So the light changes direction.']),
  idea.choice('P56-04', 'A ray of light hits a boundary at a right angle to it. What happens to its direction?', ['It bends a lot', 'It does not change direction', 'It bends backwards', 'It splits in two'], 1, 'Refraction needs the wave to meet the boundary at an angle.', ['A wave going straight in, at a right angle, is not refracted.', 'So it carries on in the same direction.']),
  t(lines, 'P56-05', 'What do the lines mean?'),
  lines.choice('P56-06', 'Where is the angle of incidence measured?', ['Between the incident ray and the boundary', 'Between the two rays', 'Between the incident ray and the normal', 'Between the refracted ray and the boundary'], 2, 'Angles are always measured from the same dotted line.', ['The angle of incidence is between the incident ray and the normal.', 'It is never measured from the boundary.'], 'recall'),
  lines.choice('P56-07', 'What is the normal on a ray diagram?', ['The ray that leaves the boundary', 'A line drawn along the boundary', 'The ray that arrives at the boundary', 'A dotted line at right angles to the boundary'], 3, 'Normal just means at right angles.', ['The normal is a dotted line at right angles to the boundary.', 'Both angles on the diagram are measured from it.'], 'recall'),
  t(draw, 'P56-08', 'How do you draw a ray diagram?'),
  draw.choice('P56-09', 'You are drawing a ray diagram. Which is the correct order?', ['Incident ray, boundary, normal, refracted ray', 'Boundary, normal, incident ray, refracted ray', 'Normal, refracted ray, boundary, incident ray', 'Refracted ray, incident ray, normal, boundary'], 1, 'The ray needs something to meet first.', ['Draw the boundary, then the normal, then the incident ray.', 'Then draw the refracted ray on the other side.']),
  draw.choice('P56-10', 'Why should you use a ruler to draw rays?', ['Rays are straight lines, so they should look straight and neat', 'So the ray bends more at the boundary', 'To measure the boundary', 'To make the ray dotted'], 0, 'Think about what a ray shows.', ['A ray is a straight line showing the path of a wave.', 'A ruler keeps it straight and makes the angles easy to measure.']),
  t(draw, 'P56-11', 'How do you use a protractor?'),
  draw.choice('P56-12', 'You want to mark an angle of incidence of 60°. Which line should the base line of the protractor lie along?', ['The boundary', 'The normal', 'The incident ray', 'The refracted ray'], 1, 'The angle is measured from the normal.', ['The angle of incidence is measured from the normal.', 'So the base line of the protractor lies along the normal.']),
  lines.choice('P56-13', 'Which numbered line in the diagram is the refracted ray?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 2, 'The refracted ray is on the far side of the boundary.', ['The refracted ray leaves the boundary on the other side.', 'It is the bent ray, line 3.'], 'dataInterpretation', true, 'refract-q-label'),
  draw.choice('P56-14', 'A student measures the angle of incidence from the boundary instead of the normal. What is wrong with this?', ['The ray should be curved', 'The boundary should be dotted', 'Angles should be measured after the boundary', 'Angles should be measured from the normal'], 3, 'Think about which dotted line the angles use.', ['Angles on a ray diagram are measured from the normal.', 'Measuring from the boundary gives the wrong angle.'], 'application', true),
  idea.choice('P56-15', 'Ray A hits a boundary at a right angle. Ray B hits it at an angle. Which statement is correct?', ['Only ray B is refracted, because it meets the boundary at an angle', 'Both rays are refracted', 'Only ray A changes direction', 'Neither ray changes direction'], 0, 'Which ray meets the boundary at an angle?', ['A wave is only refracted if it meets the boundary at an angle.', 'Ray B meets it at an angle. Ray A goes straight in.'], 'application', true),
  idea.written('P56-16', 'Describe how to draw a ray diagram for light going from air into glass at an angle of incidence of 40°.', 'Work through the steps in order: boundary, normal, incident ray, refracted ray.', 'Use a ruler to draw the boundary between the air and the glass. Draw a dotted normal at right angles to it. Put the centre of a protractor where the normal crosses the boundary, with its base line along the normal, and mark 40°. Draw the incident ray through the mark, with an arrow. Draw the refracted ray on the other side of the boundary from the same point, with an arrow, and label both angles from the normal.', ['Draws the boundary with a ruler.', 'Draws a dotted normal at right angles to the boundary.', 'Uses a protractor centred where the normal meets the boundary, with its base line on the normal, to mark 40°.', 'Draws the incident ray to that point with an arrow.', 'Draws the refracted ray on the other side from the same point and labels the angles from the normal.'], ['Measuring the angle from the boundary.', 'Drawing curved rays.', 'Drawing the refracted ray on the same side as the incident ray.']),
]

export const lessonP56: ScienceLesson = {
  id: 'P-WAV-056-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Refraction', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
