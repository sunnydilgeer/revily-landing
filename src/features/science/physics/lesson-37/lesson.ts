import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { irradiationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.2.4 Hazards and uses of radioactive emissions: irradiation and contamination, as on the supplied revision page' }
const skill = 'P-IRRAD'
const irr = author(skill, ['6.4.2.4'], ['aqa-physics'])
const con = author(skill, ['6.4.2.4'], ['aqa-physics'])
const cmp = author(skill, ['6.4.2.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const irradiationSections = [
  { id: 'P37-01', label: 'Start here', detail: 'Keeping sources safe' },
  { id: 'P37-02', label: 'What is irradiation?', detail: 'Exposure to radiation, and protection' },
  { id: 'P37-05', label: 'What is contamination?', detail: 'Radioactive atoms on or in an object' },
  { id: 'P37-08', label: 'Which sources are most dangerous?', detail: 'Alpha, beta and gamma, outside and inside' },
  { id: 'P37-11', label: 'On your own', detail: 'Compare, decide and explain' },
]

const states: ScienceState[] = [
  { ...irr.choice('P37-01', 'A school keeps its radioactive sources in a thick lead-lined box. What is the box for?', ['To keep the sources warm', 'To make the sources stronger', 'To absorb radiation so it does not reach people', 'To stop the sources decaying'], 2, 'Think about what could reach people nearby.', ['Radiation from a source can harm living cells.', 'Lead absorbs the radiation, so it does not reach people.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(irr, 'P37-02', 'What is irradiation?'),
  irr.choice('P37-03', 'A metal block is irradiated by a source for an hour. What happens to the block?', ['It becomes radioactive', 'It is exposed to radiation but does not become radioactive', 'It gives out radiation for ever', 'It turns into a different metal'], 1, 'Irradiation is exposure only.', ['Irradiation means being exposed to radiation from outside.', 'The block does not become radioactive.']),
  irr.choice('P37-04', 'Which action helps to stop you being irradiated?', ['Holding the source close to your face', 'Holding the source at arm\'s length', 'Carrying the source in a pocket', 'Leaving the source on a bench'], 1, 'Distance and barriers both help.', ['The further you are from a source, the less radiation reaches you.', 'Holding it at arm\'s length keeps it as far away as you can.']),
  t(con, 'P37-05', 'What is contamination?'),
  con.choice('P37-06', 'Which best describes contamination?', ['Standing near a source that is stored in a box', 'Wearing a lead apron', 'Radioactive atoms getting onto or into an object', 'Radiation passing straight through you'], 2, 'The radioactive atoms themselves move.', ['Contamination is when unwanted radioactive atoms get onto or into an object.', 'The atoms stay and keep decaying, unlike irradiation.']),
  con.choice('P37-07', 'A worker handles a radioactive powder. Which is the best protection against contamination?', ['A lead-lined box', 'Standing further away', 'Watching from behind a barrier', 'Gloves, tongs, a protective suit and a face mask'], 3, 'The powder could stick to skin or be breathed in.', ['Contamination happens when radioactive material gets onto or into you.', 'Gloves, tongs, a suit and a mask stop it sticking to you or being breathed in.']),
  t(cmp, 'P37-08', 'Which sources are most dangerous?'),
  cmp.choice('P37-09', 'Which source is the least dangerous to be irradiated by, from outside the body?', ['Alpha', 'Beta', 'Gamma', 'They are all the same'], 0, 'Which one is stopped by the skin and a small air gap?', ['Alpha cannot penetrate the skin and is stopped by a small air gap.', 'So alpha is the least dangerous from outside.']),
  cmp.choice('P37-10', 'Which source is the most dangerous if it gets inside the body?', ['Gamma', 'Beta', 'They are all the same', 'Alpha'], 3, 'Where does the damage go, and how strongly does it ionise?', ['Alpha does all its damage in a very small area and is the most strongly ionising.', 'So alpha is the most dangerous inside the body.']),
  con.choice('P37-11', 'A student spills a beta source\'s radioactive dust on their hands. Why is this more serious than holding a sealed beta source?', ['The dust is a stronger source', 'The dust makes the student radioactive for ever', 'The dust could sink through the table', 'The dust could be swallowed or stay on the skin, and keeps decaying'], 3, 'Think about atoms getting onto or into you.', ['Spilled dust is contamination: radioactive atoms are on the skin.', 'They can be swallowed and they keep releasing radiation.'], 'application', true),
  cmp.choice('P37-12', 'Why is a gamma source more dangerous to be irradiated by than an alpha source?', ['Gamma can penetrate the body, but alpha is stopped by the skin and air', 'Gamma is heavier than alpha', 'Alpha is more ionising, so it is safer', 'Alpha travels much further than gamma'], 0, 'Think about what stops each type.', ['Gamma can pass through the body and reach delicate organs.', 'Alpha is stopped by a small air gap and by the skin, so it cannot get in.'], 'explanation', true),
  irr.choice('P37-13', 'A student says: "If I am irradiated, I will give out radiation to other people." What is wrong with this?', ['Nothing, this is correct', 'Irradiation does not make you radioactive, so you do not give out radiation', 'Only children give out radiation', 'Irradiation makes you a stronger source'], 1, 'Does exposure change what you are made of?', ['Irradiation only means being exposed to radiation.', 'It does not make you radioactive.'], 'application', true),
  cmp.choice('P37-14', 'Which source is least dangerous if it gets inside the body?', ['Gamma, because it mostly passes straight out', 'Alpha, because it is stopped by skin', 'Beta, because it damages the biggest area', 'They are all equally dangerous'], 0, 'Which one mostly passes out of the body?', ['Gamma mostly passes straight out of the body.', 'It is also the least ionising, so it does the least damage inside.'], 'recall', true),
  cmp.written('P37-15', 'Explain why an alpha source is safer than a beta source outside the body, but more dangerous inside the body.', 'Compare what stops alpha with where it does damage.', 'Outside the body, alpha cannot penetrate the skin and is stopped by a small air gap. So it is the least dangerous. Beta can penetrate the body. Inside the body, alpha does all its damage in a very small area and is highly ionising. So it is more dangerous than beta, which is absorbed over a wider area and is less ionising.', ['Outside, alpha cannot penetrate the skin or is stopped by a small air gap.', 'Beta can penetrate the body and damage organs from outside.', 'Inside, alpha does all its damage in a small area.', 'Alpha is more ionising than beta, so it is more damaging inside.'], ['Saying alpha is always the most dangerous.', 'Saying gamma is stopped by skin.', 'Saying irradiation makes the body radioactive.']),
]

export const lessonP37: ScienceLesson = {
  id: 'P-ATM-037-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Irradiation and contamination', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
