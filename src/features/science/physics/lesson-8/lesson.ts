import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { insulationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.1.2.1 Energy transfers in a system (wasted and dissipated energy, lubrication, thermal conductivity, insulation and the rate of cooling of a building), as on the supplied revision page' }
const skill = 'P-INSULATION'
const waste = author(skill, ['6.1.2.1'], ['aqa-physics'])
const lube = author(skill, ['6.1.2.1'], ['aqa-physics'])
const cond = author(skill, ['6.1.2.1'], ['aqa-physics'])
const house = author(skill, ['6.1.2.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const insulationSections = [
  { id: 'P8-01', label: 'Start here', detail: 'A warm phone' },
  { id: 'P8-02', label: 'Where does wasted energy go?', detail: 'Useful, wasted and dissipated energy' },
  { id: 'P8-05', label: 'How does lubrication help?', detail: 'Less friction, less waste' },
  { id: 'P8-07', label: 'How does insulation work?', detail: 'Conduction and thermal conductivity' },
  { id: 'P8-10', label: 'How do we keep a house warm?', detail: 'Three things that change the rate of cooling' },
  { id: 'P8-13', label: 'On your own', detail: 'Wasted energy, a house and some data' },
]

const states: ScienceState[] = [
  { ...waste.choice('P8-01', 'A phone feels warm after a long video call. What does this show?', ['Energy has been destroyed', 'Some energy was transferred to the thermal store of the phone, where it is not wanted', 'The phone has gained mass', 'The battery has charged itself'], 1, 'Think about where the energy from the battery goes.', ['The battery supplies energy for the screen and sound, which is useful.', 'Some energy also warms the phone. That energy is not the part we wanted.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(waste, 'P8-02', 'Where does wasted energy go?'),
  waste.choice('P8-03', 'An electric lamp transfers energy electrically. Which is the wasted energy transfer?', ['Energy to the light', 'Energy from the mains', 'Energy to the thermal store of the lamp and the air', 'Energy to the switch'], 2, 'Wasted energy goes to a store we do not want.', ['We want the lamp to give light, so energy to the light is useful.', 'Energy to the thermal store of the lamp and the air is not wanted. That is the wasted energy.'], 'application'),
  waste.choice('P8-04', 'What happens to wasted energy?', ['It is destroyed', 'It becomes useful again', 'It becomes extra mass', 'It spreads out into the surroundings and still exists'], 3, 'Energy can never be created or destroyed.', ['Wasted energy is dissipated: it spreads out, usually into thermal stores of the surroundings.', 'It still exists, but it is not stored in a way we can use.'], 'understanding'),
  t(lube, 'P8-05', 'How does lubrication help?'),
  lube.choice('P8-06', 'Why does a cyclist put oil on the chain of a bicycle?', ['To make the chain heavier', 'To reduce friction, so less energy is dissipated', 'To increase friction', 'To store energy in the chain'], 1, 'Oil helps surfaces slide over each other.', ['Oil is a lubricant. It reduces the friction between the moving parts.', 'Less friction means less energy is dissipated as heat, so more is transferred usefully.'], 'application'),
  t(cond, 'P8-07', 'How does insulation work?'),
  cond.choice('P8-08', 'Which material would make the best handle for a hot saucepan?', ['Copper, which has a high thermal conductivity', 'Steel, which has a high thermal conductivity', 'Plastic, which has a low thermal conductivity', 'Aluminium, which has a high thermal conductivity'], 2, 'You do not want energy to pass quickly along the handle to your hand.', ['A low thermal conductivity means energy passes slowly through the material.', 'Plastic is a thermal insulator, so the handle stays cooler than a metal one would.'], 'application'),
  cond.choice('P8-09', 'What does a low thermal conductivity tell you about a material?', ['Energy is transferred quickly through it', 'Energy is transferred slowly through it', 'It is always cold', 'It is always a metal'], 1, 'Thermal conductivity is about how quickly energy is transferred by conduction.', ['A low thermal conductivity means energy is transferred slowly.', 'Materials like this are thermal insulators.'], 'recall'),
  t(house, 'P8-10', 'How do we keep a house warm?'),
  house.choice('P8-11', 'Which change would reduce the rate of cooling of a house?', ['Adding loft insulation', 'Making the walls thinner', 'Using a wall material with a high thermal conductivity', 'Taking out the wall insulation'], 0, 'You want energy to be transferred to the outside more slowly.', ['Loft insulation is a thick layer of thermal insulator in the roof, so less energy is lost through it.', 'Thinner walls and a high thermal conductivity would let energy escape more quickly.']),
  house.choice('P8-12', 'House A has brick walls 20 cm thick. House B has the same bricks, 40 cm thick. Which cools more slowly?', ['House A', 'They cool at the same rate', 'It cannot be told', 'House B'], 3, 'The material is the same. What is different?', ['The walls of house B are thicker, and the thicker the walls, the slower the building cools.', 'House B loses energy to the outside more slowly than house A.']),
  waste.choice('P8-13', 'A machine takes in 300 J of energy electrically. 220 J is transferred usefully. How much energy is dissipated?', ['520 J', '220 J', '80 J', '300 J'], 2, 'The total energy stays the same. What is left after the useful part?', ['Energy in = useful energy + wasted energy.', '300 − 220 = 80, so 80 J is dissipated.'], 'application', true),
  house.choice('P8-14', 'The arrows show where a house loses energy. Which arrow shows the loss that loft insulation reduces?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 0, 'Loft insulation goes in the roof space.', ['Arrow 1 points up through the roof.', 'A thick layer of insulation in the loft reduces the energy transferred through the roof.'], 'application', true, 'insul-q-house'),
  cond.choice('P8-15', 'Three materials were wrapped round identical beakers of hot water. The table shows temperatures after 10 minutes. Which insulates best?', ['Material A', 'Material B', 'Material C', 'They are all the same'], 2, 'The best insulator lets the water lose the least energy.', ['All the beakers started at 80 °C. Beaker C stayed the hottest, at 71 °C.', 'So material C reduced the transfer of energy the most. It is the best thermal insulator.'], 'dataInterpretation', true, 'insul-q-cooling'),
  house.written('P8-16', 'A homeowner wants a house that stays warm for longer. Describe two changes and explain why each reduces the rate of cooling.', 'Think about loft insulation, the walls and thermal conductivity.', 'The homeowner could add loft insulation. This is a thermal insulator with a low thermal conductivity, so it slows the transfer of energy through the roof. The homeowner could also use thicker walls, or walls made of a material with a low thermal conductivity. Energy then passes through the walls more slowly, so the house cools more slowly.', ['One valid change, such as loft insulation, thicker walls or low thermal conductivity walls.', 'A reason for the first change linked to slower transfer of energy.', 'A second valid change.', 'A reason for the second change linked to slower transfer of energy.'], ['Saying insulation keeps the cold out.', 'Saying insulation destroys the wasted energy.', 'Saying thin walls or high thermal conductivity reduce cooling.']),
]

export const lessonP8: ScienceLesson = {
  id: 'P-ENE-008-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Reducing unwanted energy transfers', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
