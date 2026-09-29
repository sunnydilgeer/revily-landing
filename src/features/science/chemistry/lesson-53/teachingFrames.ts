import type { TeachingFrame } from '../../teachingFrame'

// Potable water: what it means, where it comes from, desalination, then treating fresh water.
// Distillation is recalled from the separation lesson and the next lesson; reverse osmosis is named only as a membrane process.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const potableFrames: Record<string, TeachingFrame[]> = {
  'C53-02': [
    f('Safe to drink', 'Potable water is water that is safe for humans to drink.', 'potable means safe to drink', 'We all need water to live. Water that is safe for humans to drink is called potable water. Some water is potable naturally. Most water needs to be treated first.', 'potable-meaning'),
    f('Potable is not pure', 'Pure water contains only H₂O. Potable water can contain other dissolved substances.', 'pure and potable are different', 'In chemistry, pure water has nothing in it except H₂O molecules. Potable water is not the same. It can contain lots of other dissolved substances, as long as they are at safe levels.', 'potable-notpure'),
    f('Three safety rules', 'Potable water has low levels of dissolved salts, a pH between 6.5 and 8.5, and no harmful microbes.', 'salts, pH, microbes', 'To be safe to drink, water must not have high levels of dissolved salts. Its pH must be between 6.5 and 8.5. It must also have no bacteria or other harmful microbes in it.', 'potable-rules'),
  ],
  'C53-05': [
    f('Rain becomes freshwater', 'Freshwater has little dissolved in it. Rainwater is a type of freshwater.', 'rain has little dissolved in it', 'Freshwater is water that does not have much dissolved in it. Rainwater is a type of freshwater. It is the starting point for most of our drinking water.', 'potable-rain'),
    f('Surface water and ground water', 'Rain collects as surface water in lakes, rivers and reservoirs, or as ground water in rocks underground.', 'above ground or below it', 'When it rains, the water can collect in two ways. Surface water collects in lakes, rivers and reservoirs. Ground water collects in rocks that trap water underground.', 'potable-sources'),
    f('Location decides the source', 'The source used in the UK depends on location. Surface water dries up first, so warmer areas use more ground water.', 'which source dries up first', 'The source of fresh water depends on where you live. Surface water tends to dry up first. So in warmer areas, such as the south-east of England, most of the water supply comes from ground water.', 'potable-uk'),
    f('Very dry countries', 'Where there is not enough surface or ground water, sea water is used instead.', 'no fresh water nearby', 'In some very dry countries there is not enough surface or ground water. Instead, they use sea water to provide potable water. But sea water has a problem, which the next section covers.', 'potable-dry'),
  ],
  'C53-08': [
    f('Too much salt', 'Sea water has too much dissolved salt to be potable. It must be desalinated.', 'remove the salt', 'Sea water has far too much dissolved salt in it to be safe to drink. The salt has to be removed. Taking the salt out of sea water is called desalination.', 'potable-salty'),
    f('Desalination by distillation', 'Distillation boils the water and condenses the steam, leaving the salts behind.', 'boil, then condense', 'One way to desalinate is distillation. The sea water is boiled. The steam is then cooled and condensed into a different container. The dissolved salts are left behind.', 'potable-distill'),
    f('Desalination with a membrane', 'In reverse osmosis, salty water is passed through a membrane that only lets water molecules through.', 'a filter that only water passes', 'Another way uses a membrane. This is called reverse osmosis. Salty water is passed through a membrane with tiny holes. Only water molecules get through. Salts and larger molecules are trapped and separated.', 'potable-membrane'),
    f('The cost', 'Both methods need lots of energy, so they are expensive. They are used only when other fresh water is not available.', 'lots of energy, so expensive', 'Both distillation and reverse osmosis need lots of energy to work. That makes them expensive. So they are not used if other sources of fresh water are available.', 'potable-cost'),
  ],
  'C53-11': [
    f('Fresh water still needs treating', 'Fresh water has low levels of dissolved substances, but it must still be treated before we use it.', 'safe, but not safe enough', 'Fresh water has low levels of dissolved substances. But it can still hold solid bits and microbes. So it needs to be treated to make it safe. The two main steps are filtration and sterilisation.', 'potable-treat'),
    f('Filtration: wire mesh', 'The water first passes through a wire mesh, which stops large things such as twigs.', 'big pieces first', 'In filtration the water is first passed through a wire mesh. The mesh has gaps that are too small for large things such as twigs, so these are caught.', 'potable-mesh'),
    f('Filtration: filter beds', 'Next the water passes through filter beds of sand and gravel, which catch any other solid bits.', 'grains catch tiny bits', 'Next the water goes through filter beds. These are made from grains of sand and gravel. Tiny bits of solid in the water are caught by the grains.', 'potable-beds'),
    f('Sterilisation', 'Sterilising kills harmful bacteria and other microbes, using chlorine gas, ozone or ultraviolet light.', 'kill the microbes', 'Last, the water is sterilised. This means any harmful bacteria or other microbes in the water are killed. It can be done by bubbling chlorine gas or ozone through the water, or by using ultraviolet light.', 'potable-sterilise'),
    f('Put it together', 'Rain collects as surface or ground water, is filtered and sterilised, and becomes potable water.', 'the whole route', 'Rain collects as surface or ground water. It is filtered to remove solids. It is sterilised to kill microbes. Then it is potable. Where fresh water is scarce, sea water is desalinated first.', 'potable-route'),
  ],
}
