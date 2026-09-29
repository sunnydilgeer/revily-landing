import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { pollutionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.9.3.1 Atmospheric pollutants from fuels and 5.9.3.2 Properties and effects of atmospheric pollutants (carbon monoxide, particulates, sulfur dioxide, oxides of nitrogen, acid rain), as on the supplied revision page' }
const skill = 'C-AIR-POLLUTION'
const burn = author(skill, ['5.9.3.1'], ['aqa-chemistry'])
const co = author(skill, ['5.9.3.2'], ['aqa-chemistry'])
const acid = author(skill, ['5.9.3.1', '5.9.3.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const pollutionSections = [
  { id: 'C48-01', label: 'Start here', detail: 'A blocked chimney' },
  { id: 'C48-02', label: 'What is released when fuels burn?', detail: 'Complete and incomplete combustion' },
  { id: 'C48-05', label: 'Why are CO and particulates harmful?', detail: 'Blood, lungs and global dimming' },
  { id: 'C48-08', label: 'Where do acid rain gases come from?', detail: 'Sulfur dioxide and nitrogen oxides' },
  { id: 'C48-11', label: 'On your own', detail: 'Pollutants, causes and effects' },
]

const states: ScienceState[] = [
  { ...burn.choice('C48-01', 'A gas heater is running in a small room with the window shut. Its air supply is nearly blocked. What is the main risk?', ['Too much oxygen in the room', 'Not enough oxygen, so a harmful gas can be made', 'The heater will make water only', 'There is no risk at all'], 1, 'Think about what a fuel needs to burn well.', ['Fuels need plenty of oxygen to burn completely.', 'With too little oxygen the fuel burns incompletely and can make a poisonous gas.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(burn, 'C48-02', 'What is released when fuels burn?'),
  burn.choice('C48-03', 'Which are the products of complete combustion of a hydrocarbon fuel?', ['Carbon dioxide and water vapour', 'Carbon monoxide and soot', 'Sulfur dioxide and water', 'Hydrogen and oxygen'], 0, 'Both products are made in every kind of combustion.', ['Complete combustion of a hydrocarbon releases carbon dioxide and water vapour.', 'Incomplete combustion releases these as well as other things.'], 'recall'),
  burn.choice('C48-04', 'What is the difference between complete and incomplete combustion?', ['Complete needs no oxygen at all', 'Incomplete uses more oxygen than complete', 'Complete uses plenty of oxygen; incomplete does not have enough', 'They are exactly the same'], 2, 'It depends on how much oxygen there is.', ['In complete combustion there is plenty of oxygen and all the fuel burns.', 'In incomplete combustion there is not enough oxygen, so some fuel does not burn.']),
  t(co, 'C48-05', 'Why are CO and particulates harmful?'),
  co.choice('C48-06', 'Why is carbon monoxide so dangerous?', ['It turns the air red', 'It makes people too warm', 'It has a strong smell that people cannot stand', 'It stops the blood carrying enough oxygen around the body'], 3, 'Think about what the blood carries.', ['Carbon monoxide stops the blood carrying enough oxygen.', 'It has no colour or smell, so it is hard to detect, which makes it more dangerous.']),
  co.choice('C48-07', 'What are particulates?', ['Gases that turn rain acidic', 'Tiny solid particles such as soot released in incomplete combustion', 'A type of fuel', 'Another name for water vapour'], 1, 'They are solids, not gases.', ['Particulates are tiny solid particles, such as soot (carbon), released in incomplete combustion.', 'Breathing them in can damage the lungs.'], 'recall'),
  t(acid, 'C48-08', 'Where do acid rain gases come from?'),
  acid.choice('C48-09', 'Where does the sulfur dioxide released from burning fuels come from?', ['Sulfur impurities in the fuel', 'Nitrogen in the air', 'Water in the fuel', 'The oxygen in the air'], 0, 'It is named after an element that is in some fuels.', ['Some fossil fuels contain sulfur impurities.', 'When the fuel burns, the sulfur is released as sulfur dioxide.']),
  acid.choice('C48-10', 'How are oxides of nitrogen made when fuel burns?', ['They are already in the fuel as impurities', 'Nitrogen burns with water', 'They are made when carbon dioxide cools', 'Nitrogen and oxygen from the air react in the heat'], 3, 'The gases come from the air, and heat drives the reaction.', ['Nitrogen and oxygen in the air react together.', 'The heat from burning the fuel makes this reaction happen.']),
  { ...co.choice('C48-11', 'A hydrocarbon fuel burns in limited oxygen. Which product would not be released if there were plenty of oxygen?', ['Carbon dioxide', 'Water vapour', 'Carbon monoxide', 'They would all still be released'], 2, 'Complete combustion releases only two products.', ['Carbon dioxide and water vapour are made in both types of combustion.', 'Carbon monoxide, soot and unburnt fuel are made only in incomplete combustion.'], 'application', true) },
  co.choice('C48-12', 'Fine soot in the air reflects some sunlight back into space, so less light reaches the ground. What is this called?', ['The greenhouse effect', 'Global dimming', 'Acid rain', 'Complete combustion'], 1, 'Think about what happens to the light.', ['Particulates reflect sunlight back into space.', 'Less light reaching the Earth is called global dimming.'], 'recall', true),
  burn.choice('C48-13', 'Two tiles are held over burning fuel, as shown. Which fuel was burning incompletely?', ['Fuel 2', 'Fuel 1', 'Both of them', 'Neither of them'], 0, 'Look for the solid black deposit.', ['Soot is a solid particle made only in incomplete combustion.', 'Tile 2 has a black deposit, so fuel 2 was burning incompletely.'], 'dataInterpretation', true, 'pollute-q-tiles'),
  acid.choice('C48-14', 'What happens when sulfur dioxide and oxides of nitrogen mix with clouds?', ['They make rain with no effect', 'They make more oxygen', 'They make acid rain', 'They make soot'], 2, 'The rain becomes something different.', ['These gases mix with water in clouds.', 'The result is acid rain, which harms plants, water life and buildings.'], 'understanding', true),
  acid.written('C48-15', 'Explain how acid rain forms and describe two of its effects.', 'Start with burning fuels, then the clouds, then the damage.', 'Burning fossil fuels that contain sulfur releases sulfur dioxide, and the heat also makes nitrogen and oxygen from the air form oxides of nitrogen. These gases mix with clouds and cause acid rain. Acid rain kills plants and water life, and damages buildings, statues and metals.', ['Sulfur dioxide comes from sulfur impurities in fuels.', 'Oxides of nitrogen form from nitrogen and oxygen in the air, in the heat.', 'The gases mix with clouds to make acid rain.', 'Two effects, for example kills plants, kills water life, damages buildings, statues or metals.'], ['Saying carbon dioxide causes acid rain in this way.', 'Saying the nitrogen oxides come from the fuel.', 'Saying acid rain has no effect on living things.']),
]

export const lessonC48: ScienceLesson = {
  id: 'C-ATM-048-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Air pollution', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
