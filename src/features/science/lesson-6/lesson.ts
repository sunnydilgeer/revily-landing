// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route: particles spread out (diffusion) → diffusion in the body → what speeds it up →
// osmosis → plant cells in solutions, with a check after each walkthrough. See STORYBOARD.md.
import type { ScienceLesson, ScienceState } from '../types'
import { author, biologySource, sampledRequirements } from '../lessonAuthoring'
import { transportFrames as frames } from './teachingFrames'

const a = author('B-CELL-TRANSPORT', ['4.1.3.1', '4.1.3.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const transportSections = [
  { id: 'B6-01', label: 'Start here', detail: 'Strong and weak squash' },
  { id: 'B6-02', label: 'How do particles spread out?', detail: 'Concentration and diffusion' },
  { id: 'B6-04', label: 'What diffuses in your body?', detail: 'Oxygen, carbon dioxide and urea' },
  { id: 'B6-06', label: 'What speeds up diffusion?', detail: 'Gradient, temperature and surface area' },
  { id: 'B6-08', label: 'What is osmosis?', detail: 'Water and a partially permeable membrane' },
  { id: 'B6-11', label: 'What happens to plant cells?', detail: 'Gaining or losing water' },
  { id: 'B6-35', label: 'On your own', detail: 'Use diffusion and osmosis' },
]

const states: ScienceState[] = [
  { ...a.choice('B6-01', 'Two glasses hold the same amount of squash drink. Glass A tastes much stronger. What is different about glass A?', ['It has more squash mixed into the same amount of drink', 'Its glass is bigger', 'It has more water and less squash'], 0, 'Think about how you make squash stronger.', ['Stronger squash has more squash mixed into the same amount of drink.', 'So glass A has more squash in the same volume.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  // How do particles spread out?
  t('B6-02', 'How do particles spread out?'),
  a.choice('B6-03', 'The left region has a higher concentration of the same particles. Which way is the net movement?', ['Left → right', 'Right → left', 'The particles stop moving'], 0, 'Which side is more crowded?', ['Particles move randomly both ways, but more leave the crowded left side than return.', 'So the net movement is from left to right, from higher to lower concentration.'], 'understanding', false, 'diffusion-question'),
  a.choice('B6-46', 'Both regions now have the same concentration. What are the particles doing?', ['They have all stopped moving', 'They are all moving to one side', 'They still move, but there is no net movement'], 2, 'Do particles ever stop moving?', ['Particles keep moving randomly, and just as many move each way.', 'So the movements balance, and there is no net movement.']),

  // What diffuses in your body?
  t('B6-04', 'What diffuses in your body?'),
  a.choice('B6-05', 'Which waste diffuses from liver cells into the plasma, then goes to the kidneys?', ['Oxygen', 'Urea', 'Plasma'], 1, 'Which waste did liver cells make?', ['Liver cells make urea, a waste that dissolves in water.', 'So urea diffuses into the plasma, and the blood carries it to the kidneys.']),

  // What speeds up diffusion?
  t('B6-06', 'What speeds up diffusion?'),
  a.choice('B6-07', 'Everything else stays the same. Which change makes diffusion faster?', ['A smaller concentration difference', 'A lower temperature', 'A larger concentration difference', 'A smaller surface area'], 2, 'Which change gives a steeper gradient?', ['A larger concentration difference is a steeper gradient.', 'So more particles move across overall each second, and diffusion is faster.']),
  a.choice('B6-47', 'You compare diffusion at two different gradients. Why must the temperature stay the same?', ['Temperature has no effect on diffusion', 'Otherwise you cannot tell which change made the difference', 'Diffusion only works at one temperature'], 1, 'What did the fair test screen say?', ['Temperature also changes how fast particles diffuse.', 'So if it changed too, you could not tell which change made the difference.'], 'practicalReasoning'),

  // What is osmosis?
  t('B6-08', 'What is osmosis?'),
  a.choice('B6-09', 'In osmosis, what moves across the membrane?', ['Solute particles, such as sugar', 'Both water and solute, equally', 'Water molecules'], 2, 'Which particles can cross a partially permeable membrane?', ['Osmosis is the diffusion of water.', 'So only water molecules move across the partially permeable membrane.']),
  a.choice('B6-10', 'The left solution is dilute. The right one is concentrated. Only water can cross the membrane. Which way does water move overall?', ['Right → left', 'Left → right', 'No water moves at all'], 1, 'Which side has more water?', ['The dilute left side has more water than the concentrated right side.', 'So net water movement is left → right, into the concentrated solution.'], 'understanding', false, 'osmosis-question'),

  // What happens to plant cells?
  t('B6-11', 'What happens to plant cells?'),
  a.choice('B6-12', 'Potato cells are put in a solution that is more concentrated than their contents. What happens overall?', ['Water moves out, so the mass goes down', 'Water moves in, so the mass goes up', 'No water moves at all'], 0, 'Which side is more concentrated: outside or inside?', ['The outside solution is more concentrated than the cell contents.', 'So water moves out of the cells by osmosis, and the mass goes down.']),

  // On your own
  a.choice('B6-35', 'A muscle cell is working hard. Its oxygen concentration is lower than in the blood next to it. What happens?', ['Oxygen diffuses from the cell into the blood', 'Oxygen moves by osmosis, because it is dissolved', 'Nothing moves until the cell runs out of oxygen', 'Oxygen diffuses from the blood into the cell'], 3, 'Where is the oxygen concentration higher?', ['Oxygen is at a higher concentration in the blood than in the cell.', 'So oxygen diffuses down its gradient, from the blood into the cell.'], 'application', true),
  a.choice('B6-36', 'A slice of cucumber is put in salty water. The salty water is more concentrated than the cell contents. What happens?', ['Salt moves into the cells by osmosis', 'Water leaves the cells, so the cucumber loses mass', 'Water enters the cells, so the cucumber gains mass'], 1, 'Compare the outside with the inside. Which way does water go?', ['The salty water outside is more concentrated than the cell contents.', 'So water leaves the cells by osmosis, and the cucumber loses mass.'], 'application', true),
  a.choice('B6-48', 'Sam writes: “When both sides of the membrane are the same, water molecules stop moving.” What is wrong?', ['Nothing; this is correct', 'Water moves only into the left side', 'The solute stops moving instead', 'Water keeps crossing both ways; there is just no net movement'], 3, 'Do water molecules ever stop moving?', ['Water molecules keep crossing the membrane in both directions.', 'So equal amounts cross each way, which means no net movement, not no movement.'], 'understanding', true),
  a.written('B6-49', 'Dried raisins are left in a bowl of water. After a few hours they have swollen up. Explain why.', 'Compare the water outside with the solution inside the raisin. Which way does water move, and what does it cross?', 'The inside of a raisin is a concentrated sugar solution. The water in the bowl is more dilute. The raisin’s cell membranes are partially permeable. So water moves into the raisin by osmosis, from the dilute water to the concentrated solution. The raisins gain water, so they swell.', ['The raisin contents are more concentrated than the water outside, or the water is more dilute.', 'Water moves into the raisin by osmosis.', 'Water crosses partially permeable cell membranes.', 'The raisins gain water, so they swell or gain mass.'], ['Sugar is said to move by osmosis.', 'Water is said to move from the concentrated solution to the dilute one.', 'Water molecules are said to stop moving once the raisin has swollen.']),
]

export const lesson6: ScienceLesson = {
  id: 'B-CELL-006-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Diffusion and osmosis', prerequisites: ['B-CELL-PARTS-FUNCTIONS', 'B-SPECIALISATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biologySource], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
