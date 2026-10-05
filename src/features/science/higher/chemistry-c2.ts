/*
 * Higher-only section for chapter C2 (bonding, structure and properties of matter), from the CGP AQA Combined Science
 * Higher guide page 119 (scope only; all wording, examples, questions and diagrams are original). AQA 8464 HT content:
 * 5.2.2.2 (limitations of the simple particle model). Diagram: components/HigherParticleModelVisuals.tsx ('hpart-').
 */
import { addition, f, type HigherAddition } from './helpers'

// Chemistry Lesson 17 · Higher p119: the particle model treats particles as small solid spheres and shows no forces.
// Placed straight after "How are the particles arranged?", where the Foundation lesson draws the model.
const particleLimits = addition('C-BND-017-C', 'C17-06', 'C-HIGHER-PARTICLE-LIMITS', ['5.2.2.2'],
  { id: 'C17-H01', higher: true, label: 'Why the model isn’t perfect', detail: 'What the particle model leaves out' },
  [
    f('Not solid balls', 'Real particles are not small solid balls.', 'model ball ≠ real atom', 'The particle model draws every particle as a small solid ball. It is a useful picture, but real particles are not like that. An atom is mostly empty space, with a tiny nucleus and electrons around it.', 'hpart-solid'),
    f('Not all round', 'Real particles can be atoms, ions or molecules of many shapes.', 'balls all the same, molecules not', 'In the model, all the balls look the same. Real particles can be atoms, ions or molecules. Molecules come in different shapes. A water molecule is bent, and a carbon dioxide molecule is straight.', 'hpart-shape'),
    f('No forces shown', 'The model does not show the forces between particles.', 'no forces drawn → can’t tell how strong', 'The model shows where the particles are, but not the forces between them. So it cannot tell you how strong the forces are. That is why the model alone cannot tell you a substance’s melting or boiling point.', 'hpart-forces'),
    f('Put it together', 'The particle model is useful but simple.', 'not solid, not all round, no forces', 'The particle model is great for explaining solids, liquids and gases. But it is simple. Real particles are not solid balls, they are not all round, and the model does not show the forces between them.', 'hpart-all'),
  ],
  a => [
    a.choice('C17-H02', 'In the particle model, how is each particle drawn?', ['As a small solid sphere', 'As a nucleus with electrons around it', 'As a molecule with its real shape', 'As a cloud with no edges'], 0, 'Think of a snooker ball.', ['The model keeps things simple.', 'It draws every particle, whether an atom, an ion or a molecule, as a small solid sphere.']),
    a.choice('C17-H03', 'Which of these is a limitation of the particle model?', ['It shows particles moving in a gas', 'It does not show the forces between particles', 'It shows that solids keep their shape', 'It shows particles close together in a liquid'], 1, 'Which choice is something the model leaves out?', ['The model does show how particles are arranged and how they move.', 'It does not show the forces between them, so it cannot show how strong those forces are.']),
    a.choice('C17-H04', 'A student says, “The particle model shows that the forces in iron are stronger than in water.” Why is the student wrong?', ['Iron and water have the same forces', 'The model does not show forces, so it cannot compare how strong they are', 'The model only works for gases', 'Iron is not made of particles'], 1, 'What does the model leave out?', ['The particle model only shows where the particles are and how they move.', 'It does not show the forces between them, so it cannot be used to compare how strong the forces are.'], 'application', true),
  ])

export const higherC2: HigherAddition[] = [particleLimits]
