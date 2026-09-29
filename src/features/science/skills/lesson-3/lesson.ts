import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsRiskFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 1.5 Risk (hazard, risk, perceived risk, estimating risk from data), WS 2.4 Safe working (hazards in investigations, risk assessment), as on the supplied revision page' }
const skill = 'W-MTH-003-W'
const a = author(skill, ['WS1.5', 'WS2.4'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
// Puts the correct answer at a chosen position so the answer positions are spread across the lesson.
const q = (id: string, title: string, right: string, wrong: string[], pos: number, hint: string, steps: string[], dimension: Parameters<typeof a.choice>[6] = 'understanding', independent = false, visual?: string) => {
  const labels = [...wrong]; labels.splice(pos, 0, right)
  return a.choice(id, title, labels, pos, hint, steps, dimension, independent, visual)
}

export const wsRiskSections = [
  { id: 'W3-01', label: 'Start here', detail: 'A puddle in the corridor' },
  { id: 'W3-02', label: 'Hazard or risk?', detail: 'Hazard, risk and estimating risk from data' },
  { id: 'W3-05', label: 'Why do people judge risk differently?', detail: 'Familiarity, choice and visibility' },
  { id: 'W3-08', label: 'What hazards are there in a lab?', detail: 'Microorganisms, chemicals, electricity and fire' },
  { id: 'W3-11', label: 'How do you reduce a risk?', detail: 'Risk assessment, controls and benefits' },
  { id: 'W3-14', label: 'On your own', detail: 'Spot hazards, compare risks and plan safely' },
]

const states: ScienceState[] = [
  { ...q('W3-01', 'A puddle on a school corridor floor could make someone slip. What is the puddle?', 'A hazard', ['A prediction', 'A result', 'A control'], 2, 'Think about something that could cause harm.', ['A hazard is something that could cause harm.', 'The puddle could cause a slip, so it is a hazard.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W3-02', 'Hazard or risk?'),
  q('W3-03', 'A student heats water in a beaker. Which statement is about the risk, not the hazard?', 'There is a small chance that someone will be scalded', ['The water is hot', 'The beaker is made of glass', 'The Bunsen burner is lit'], 0, 'Look for the chance that harm happens.', ['Risk is the chance that a hazard will actually cause harm.', 'Hot water, glass and a flame are hazards themselves.']),
  q('W3-04', 'In a month, 12 of 1000 trampoline park visitors were injured, and 2 of 1000 swimmers. Which has the higher risk?', 'The trampoline park', ['The swimming pool', 'They are the same', 'It cannot be told from data'], 3, 'Compare the injuries for the same number of people.', ['12 injuries in 1000 visitors is more than 2 in 1000.', 'Data on how often harm happens lets us estimate the size of a risk.'], 'dataInterpretation'),
  t('W3-05', 'Why do people judge risk differently?'),
  q('W3-06', 'A woman feels flying is riskier than driving because she never flies. Which factor is affecting her?', 'Familiarity', ['Choice', 'Visibility', 'The data'], 1, 'Think about which activity is ordinary to her.', ['People tend to think unfamiliar activities are high risk.', 'Driving feels familiar to her, even though driving is often the riskier of the two.']),
  q('W3-07', 'Why might people underestimate the risk from a harmful gas that builds up slowly and cannot be seen?', 'Its effects are long-term and invisible', ['It is a familiar activity', 'They chose to breathe it', 'Gases are never harmful'], 2, 'Think about effects that are not seen at once.', ['People may underestimate risks with long-term or invisible effects.', 'The harm is easy to overlook because nothing seems to happen at first.']),
  t('W3-08', 'What hazards are there in a lab?'),
  q('W3-09', 'A student leaves a lit Bunsen burner and walks off to fetch a book. Which hazard is this?', 'Fire', ['Microorganisms', 'Electricity', 'Chemicals'], 3, 'What could a flame left alone start?', ['An unattended Bunsen burner is a fire hazard.', 'It could set light to paper, hair or a flammable liquid.']),
  q('W3-10', 'Which pair matches a hazard with the harm it can cause?', 'Faulty electrical equipment, electric shock', ['Bacteria, burns to the skin', 'Strong acid, infection', 'Bunsen flame, poisoning'], 0, 'Match each hazard with what it can actually do.', ['Faulty electrical equipment could give you an electric shock.', 'Bacteria can make you ill, strong acid can burn, and flames can burn or start fires.']),
  t('W3-11', 'How do you reduce a risk?'),
  q('W3-12', 'A student will heat liquid in a boiling tube. What is the best way to reduce the risk of eye injury?', 'Wear safety goggles', ['Use a bigger flame', 'Look straight down into the tube', 'Hold the tube with bare fingers'], 1, 'Hot liquids can spit. Which control protects the eyes?', ['Goggles protect your eyes from splashes.', 'A bigger flame and looking into the tube would make an eye injury more likely.']),
  q('W3-13', 'Storing carbon dioxide underground might leak. Why is it still being developed?', 'The benefits, such as lower greenhouse gas emissions, are weighed against the risk', ['Scientists say there is no risk at all', 'Nobody has thought about leaks', 'Risks do not matter for new technology'], 3, 'Think about weighing risks and benefits together.', ['New technology can bring new risks, and these are considered alongside the benefits.', 'Ignoring either the risk or the benefit would give an unfair picture.'], 'application'),
  q('W3-14', 'A student leaves this bench with nobody watching. Which numbered part is the biggest fire hazard?', 'Part 3', ['Part 1', 'Part 2', 'Part 4'], 2, 'Look for a flame and something that burns easily.', ['Part 3 is a lit Bunsen burner next to a bottle of a flammable liquid.', 'The other parts are hazards of different kinds.'], 'practicalReasoning', true, 'wsrisk-q-bench'),
  q('W3-15', 'Activity X caused 3 injuries in 100 people. Activity Y caused 10 injuries in 1000 people. Which has the higher risk?', 'X, because 3 in 100 is 30 in 1000', ['Y, because 10 is more than 3', 'They are equal', 'It cannot be told'], 0, 'Compare them for the same number of people, such as 1000.', ['3 in 100 is the same as 30 in 1000.', '30 in 1000 is more than 10 in 1000, so X has the higher risk.'], 'dataInterpretation', true),
  q('W3-16', 'Many people fear a nuclear power station more than driving, although driving causes far more harm. Which explains this?', 'Driving feels familiar and chosen, while the power station feels unfamiliar and imposed', ['Driving has no hazards', 'The power station is more visible than driving accidents', 'People always judge risk with data'], 1, 'Think about familiarity and choice.', ['People accept familiar, chosen risks more easily.', 'A power station is unfamiliar and not chosen by people living nearby.'], 'understanding', true),
  a.written('W3-17', 'A class heats water on a tripod with a Bunsen burner. Name two hazards and how to reduce each risk.', 'Give two different hazards, each with a matching control.', 'One hazard is the flame, which could start a fire or burn someone. I would tie back long hair, keep the burner on a heat-proof mat and never leave it alone. Another hazard is the hot water and glass, which could burn someone. I would wear safety goggles, use tongs to move hot equipment and let it cool before touching it. Together this is a risk assessment: spot each hazard and reduce the chance of harm.', ['First hazard named clearly, such as the flame or fire.', 'A sensible control for the first hazard.', 'Second hazard named clearly, such as hot water or glass.', 'A sensible control for the second hazard.', 'The controls match the hazards.'], ['Naming controls without any hazard.', 'Saying it is completely safe so no controls are needed.', 'Mixing up hazard and risk.']),
]

export const lessonW3: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Hazards and risk', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
