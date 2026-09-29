import type { TeachingFrame } from '../../teachingFrame'

// A + B ⇌ C + D is the general picture; hydrated copper sulfate is the first real example, ammonium chloride the second
// (used for direction), and copper sulfate again for the energy idea. No Le Chatelier: only "change the conditions".
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const reversibleFrames: Record<string, TeachingFrame[]> = {
  'C36-02': [
    f('Reactions can go backwards', 'In a reversible reaction, the products can turn back into the reactants.', 'reactants → products → reactants again', 'Most reactions go one way only. In some reactions, the products can react together to make the reactants again. These reactions can go backwards as well as forwards. They are called reversible reactions.', 'rev-ab'),
    f('Forward and backward', 'The two directions have names, and the ⇌ symbol shows both.', 'A + B → C + D is forward; C + D → A + B is backward', 'This equation shows a reversible reaction: A + B ⇌ C + D. The symbol ⇌ means the reaction goes both ways. A and B reacting to make C and D is the forward reaction. C and D reacting to make A and B is the backward reaction.', 'rev-arrow'),
    f('A real example', 'Heating blue crystals of copper sulfate gives a white powder and water.', 'heat → white + water; add water → blue', 'Blue hydrated copper sulfate crystals contain water. When you heat them, they lose their water and turn into a white powder called anhydrous copper sulfate. Add water to the white powder, and it turns blue again.', 'rev-copper'),
  ],
  'C36-05': [
    f('Starting out', 'At the start there are only reactants, so only the forward reaction happens.', 'many reactants → forward fast', 'Imagine a reversible reaction in a sealed flask that starts with only reactants. At first, the forward reaction is fast. There are no products yet, so the backward reaction cannot happen.', 'rev-eq-start'),
    f('Rates change', 'The forward reaction slows down and the backward reaction speeds up.', 'reactants fall → forward slows; products rise → backward speeds up', 'As the reactants are used up, their concentrations fall. So the forward reaction slows down. As more products are made, the backward reaction speeds up.', 'rev-eq-middle'),
    f('Equilibrium', 'At equilibrium the forward and backward reactions have exactly the same rate.', 'same rate → amounts stop changing', 'After a while, the forward and backward reactions go at exactly the same rate. Reactants are made as fast as they are used up. We say the reaction is at equilibrium.', 'rev-eq-balance'),
    f('What equilibrium does not mean', 'It does not mean equal amounts. It means the amounts are not changing.', 'steady, not necessarily equal', 'Equilibrium does not mean there are equal amounts of reactants and products. There can be more products, more reactants, or equal amounts. It only means the amounts are not changing any more.', 'rev-eq-amounts'),
    f('A closed system', 'Equilibrium is only reached if nothing can escape or get in.', 'closed = sealed', 'A reaction can only reach equilibrium in a closed system. In a closed system, none of the reactants or products can escape, and nothing else can get in. A sealed flask is a closed system. An open beaker is not.', 'rev-closed'),
  ],
  'C36-09': [
    f('Overall direction', 'If there are more products than reactants, the reaction is going forwards.', 'more products → forwards; more reactants → backwards', 'When a reaction is at equilibrium, one side may have more. If there are more products than reactants, we say the reaction is going in the forwards direction. If there are more reactants, it is going in the backwards direction.', 'rev-direction'),
    f('Changing the conditions', 'Changing the conditions can change the direction.', 'temperature, pressure, concentration', 'You can change the direction of a reversible reaction by changing the conditions. The conditions are the temperature, the pressure and the concentration. Here we look at temperature.', 'rev-conditions'),
    f('Ammonium chloride', 'Heating gives ammonia and hydrogen chloride. Cooling gives ammonium chloride again.', 'heat → forwards; cool → backwards', 'Ammonium chloride breaks down into ammonia and hydrogen chloride when it is heated. When the mixture cools, they react to make ammonium chloride again. So heating makes the reaction go forwards. Cooling makes it go backwards.', 'rev-ammonium'),
  ],
  'C36-11': [
    f('Opposite energy changes', 'If one direction takes in heat, the other gives out heat.', 'endothermic one way → exothermic the other', 'You met endothermic and exothermic reactions when you learned about energy changes. In a reversible reaction, the two directions have opposite energy changes. If the forward reaction takes in heat, the backward reaction gives out heat.', 'rev-energy'),
    f('The same amount', 'The energy taken in one way equals the energy given out the other way.', 'energy in = energy out', 'The amount of energy is the same in both directions. If the forward reaction takes in a certain amount of heat, the backward reaction gives out exactly that amount.', 'rev-energy-equal'),
    f('Copper sulfate again', 'Heating drives off the water (endothermic). Adding water gives out heat.', 'forwards takes in heat; backwards warms up', 'Turning blue hydrated copper sulfate into white anhydrous copper sulfate takes in heat, so it is endothermic. The backward reaction, adding water to the white powder, gives out heat. It is exothermic, and the powder gets warm.', 'rev-copper-energy'),
  ],
}
