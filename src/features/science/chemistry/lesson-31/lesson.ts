import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { ratesFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.6.1.1 Rates of reaction and 5.6.1.3 Collision theory and activation energy, as on the supplied revision page' }
const skill = 'C-RATE-COLLISION'
const meaning = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const graphs = author(skill, ['5.6.1.1'], ['aqa-chemistry'])
const collision = author(skill, ['5.6.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const ratesSections = [
  { id: 'C31-01', label: 'Start here', detail: 'A slow reaction and a fast one' },
  { id: 'C31-02', label: 'What rate means', detail: 'Speed of a reaction and the shape of its graph' },
  { id: 'C31-05', label: 'Comparing graph lines', detail: 'Faster, slower and more product' },
  { id: 'C31-08', label: 'Collision theory', detail: 'Collide, with enough energy' },
  { id: 'C31-11', label: 'On your own', detail: 'Reading graphs and explaining rate' },
]

const states: ScienceState[] = [
  { ...meaning.choice('C31-01', 'An iron nail rusts over several weeks. A firework burns in about a second. What can you say?', ['The nail has the greater rate of reaction', 'Both reactions have the same rate', 'The firework has the greater rate of reaction'], 2, 'Rate means how fast a reaction goes.', ['The firework reaction is far faster, so it has the greater rate.', 'Rusting is a very slow reaction.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'C31-02', 'What rate means'),
  meaning.choice('C31-03', 'What is meant by the rate of a reaction?', ['How much product is made in total', 'How much energy the reaction gives out', 'How many reactants there are', 'How fast the reactants are changed into products'], 3, 'Rate is about speed.', ['The rate is how fast the reactants are changed into products.', 'A high rate means the reaction is fast.'], 'recall'),
  meaning.choice('C31-04', 'On a graph of product against time, the line goes flat. What does this show?', ['No more product is being made, so the reaction has finished', 'The reaction is at its fastest', 'The reaction has just started', 'The reaction has slowed but more product is still forming quickly'], 0, 'What happens to the amount of product when the line is level?', ['A flat line means the amount of product is no longer changing.', 'The reactants have been used up, so the reaction has finished.']),
  t(graphs, 'C31-05', 'Comparing graph lines'),
  graphs.choice('C31-06', 'Line 2 starts steeper than line 1 and goes flat sooner, at the same height. What does this show?', ['A slower reaction that made more product', 'A faster reaction that made the same amount of product', 'A faster reaction that made more product', 'The same rate as line 1'], 1, 'Steeper means faster. What does the height tell you?', ['Steeper and flat sooner means a faster reaction.', 'The same final height means the same amount of product.']),
  graphs.choice('C31-07', 'A repeat of a reaction gives a line that goes flat at a greater height than before. What must be true?', ['The reaction was slower', 'There were more reactants at the start', 'A catalyst was used up', 'The reaction started earlier'], 1, 'Where does extra product come from?', ['More product can only come from more reactants.', 'Changing the rate changes how quickly the product forms, not how much can form.'], 'understanding'),
  t(collision, 'C31-08', 'Collision theory'),
  collision.choice('C31-09', 'Collision theory says two particles will react only if they do what?', ['Stay apart and move slowly', 'Collide with at least the activation energy', 'Collide, however gently', 'Have the same mass'], 1, 'There are two things they must do.', ['They must collide and have enough energy.', 'The smallest amount of energy needed is the activation energy.'], 'recall'),
  collision.choice('C31-10', 'Reactant particles collide with enough energy twice as often as before. What happens to the rate?', ['It halves', 'It stays the same', 'It doubles', 'It stops'], 2, 'More successful collisions per second means a faster reaction.', ['Twice as many successful collisions each second makes the reaction twice as fast.', 'So the rate doubles.']),
  graphs.choice('C31-11', 'Which reaction is the fastest?', ['Reaction 1', 'Reaction 2', 'Reaction 3', 'They are the same'], 0, 'Look for the steepest line at the start.', ['Reaction 1 has the steepest line at the start.', 'It also goes flat first, so it finishes sooner.'], 'dataInterpretation', true, 'rates-q-three'),
  graphs.choice('C31-12', 'Which two lines show reactions that made the same amount of product?', ['Lines 1 and 2', 'Lines 2 and 3', 'Lines 1 and 3', 'Lines 1 and 4'], 2, 'Compare the heights where the lines go flat.', ['Lines 1 and 3 go flat at the same height, so they made the same amount.', 'Line 2 finishes lower and line 4 finishes higher.'], 'dataInterpretation', true, 'rates-q-four'),
  collision.choice('C31-13', 'In a mixture many particles collide, but most bounce apart without reacting. What is the most likely reason?', ['They do not have enough energy when they collide', 'The reaction has finished', 'The particles are too big', 'The particles are too far apart'], 0, 'Colliding alone is not enough.', ['A collision only leads to a reaction if the particles have at least the activation energy.', 'Collisions with less energy do not cause a reaction.'], 'application', true),
  collision.choice('C31-14', 'A change makes the particles collide half as often, with no change in their energy. What happens to the rate?', ['It doubles', 'It is halved', 'It stays the same', 'It cannot be predicted'], 1, 'Fewer collisions per second.', ['Half as many collisions each second means half as many successful ones.', 'So the reaction is half as fast.'], 'application', true),
  collision.written('C31-15', 'Explain what has to happen for two reactant particles to react.', 'There are two conditions. What is the minimum energy called?', 'The particles must collide with each other. They must also have enough energy when they collide. The smallest amount of energy needed is called the activation energy. If they collide with less energy than this, they bounce apart and no reaction happens.', ['States that the particles must collide.', 'States that they must have enough energy (at least the activation energy).', 'Names activation energy as the minimum energy needed.', 'Says a collision with too little energy does not cause a reaction.'], ['Saying particles only need to be close together.', 'Saying every collision causes a reaction.', 'Confusing activation energy with the energy given out.']),
]

export const lessonC31: ScienceLesson = {
  id: 'C-RAT-031-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Rates of reaction and collision theory', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
