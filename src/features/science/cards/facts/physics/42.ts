import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-FOR-042-P',
  sections: {
    'P42-02': [
      ['In the springs practical, which variable do you change and which do you measure?', 'You change the force (by adding masses). You measure the extension of the spring.', 'Force is the independent variable. Extension is the dependent variable.'],
      ['What should stay the same in the springs practical?', 'The same spring and the same ruler, with the ruler read at eye level.'],
    ],
    'P42-05': [
      ['How do you find the force on the spring?', 'Work out the weight of the masses: W = m × g, with the mass in kilograms and g = 9.8 N/kg.', 'Example: 200 g = 0.2 kg, so W = 0.2 × 9.8 = 1.96 N.'],
      ['How do you find the extension?', 'Extension = new length − natural length. Wait for the spring to be at rest before you read the length.'],
    ],
    'P42-08': [
      ['What safety steps go with the springs practical?', 'Wear goggles, make the stand stable, put a soft tray under the masses, keep feet clear and do not overload the spring.'],
    ],
    'P42-10': [
      ['How do you plot the springs results?', 'Force on the vertical axis and extension on the horizontal axis, with a cross for each result.', 'Take at least five measurements before the line starts to curve.'],
      ['What does the graph show?', 'A straight line through the origin means force and extension are directly proportional. Where it bends is the limit of proportionality.'],
    ],
    'P42-12': [
      ['How do you work out the energy stored in a spring?', 'Ee = ½ × k × e². Change extension to metres, square it, then multiply by half of k.', 'Example: ½ × 200 N/m × (0.05 m)² = 0.25 J. Only within the limit of proportionality.'],
    ],
  },
  recall: ['P42-03', 'P42-06', 'P42-11', 'P42-13'],
}
