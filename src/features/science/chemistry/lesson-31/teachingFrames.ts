import type { TeachingFrame } from '../../teachingFrame'

// One drawing per section, built up step by step: what rate means and the shape of the graph, then comparing graph lines,
// then collision theory. Activation energy is met as "the minimum energy to react"; profiles and catalysts belong to other lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const ratesFrames: Record<string, TeachingFrame[]> = {
  'C31-02': [
    f('Fast and slow reactions', 'The rate of a reaction is how fast the reactants are changed into products.', 'rate = speed of the reaction', 'Some reactions are very slow. An iron nail takes weeks to rust. Others are very fast. A firework burns in a second. The speed of a reaction is called its rate. It tells you how fast the reactants turn into products.', 'rates-meaning'),
    f('A graph of the product', 'A graph can show how the amount of product changes as time goes by.', 'product up the side, time along the bottom', 'We can follow a reaction by measuring how much product has formed. On the graph, time goes along the bottom. The amount of product formed goes up the side. The line shows how the reaction changes over time.', 'rates-curve'),
    f('Steeper means faster', 'The steeper the line, the faster the rate of reaction.', 'steep line = lots of product quickly', 'Look at where the line rises most sharply. There, a lot of product forms in a short time. So the reaction is fast. The steeper the line, the faster the rate. Reactions are fastest at the very start.', 'rates-steep'),
    f('Levelling off', 'The line gets less steep as reactants are used up. A flat line means the reaction has finished.', 'flat line = nothing more forms', 'As the reaction goes on, the reactants are used up. Fewer are left to react, so the line becomes less steep. When the line goes flat, no more product is being made. The reaction has finished.', 'rates-flat'),
  ],
  'C31-05': [
    f('The original reaction', 'Line 1 is the starting reaction that the other lines are compared with.', 'this line is the one to compare against', 'A reaction is done and its graph is drawn. This is line 1, the original reaction. Then the conditions are changed and the reaction is done again. Each new line is compared with line 1.', 'rates-lines-original'),
    f('A faster reaction', 'A faster reaction starts steeper and goes flat sooner.', 'steeper at the start, flat sooner', 'Line 2 is steeper than line 1 at the start. It also goes flat sooner. So reaction 2 is faster than the original. Its products are made in a shorter time.', 'rates-lines-faster'),
    f('A slower reaction', 'A slower reaction starts less steep and takes longer to go flat.', 'less steep, flat later', 'Line 3 is less steep than line 1 at the start. It goes flat later. So reaction 3 is slower than the original. It takes longer to finish.', 'rates-lines-slower'),
    f('The same height', 'Lines that finish at the same height made the same amount of product, even if they took different times.', 'same height = same amount of product', 'Lines 1, 2 and 3 all go flat at the same height. This shows that they made the same amount of product. They only took different times to make it.', 'rates-lines-same'),
    f('More product', 'A line that finishes higher means more product was made, which needs more reactants at the start.', 'higher finish = more reactants used', 'Line 4 goes flat at a greater height. More product was made. This can only happen if there were more reactants at the start. A faster rate alone cannot make more product.', 'rates-lines-more'),
  ],
  'C31-08': [
    f('Particles must collide', 'Collision theory says a reaction can only happen when particles crash into each other.', 'no collision, no reaction', 'Collision theory is an idea that explains reaction rates. It says that reactant particles can only react when they collide. Particles that never meet cannot react. Particles in a liquid or gas are always moving and colliding.', 'rates-collide'),
    f('Enough energy', 'Colliding is not enough. The particles must also have enough energy.', 'a gentle bump does nothing', 'Most collisions do not cause a reaction. If the particles collide too gently, they just bounce apart. They must hit each other with enough energy to react. Only these collisions are successful.', 'rates-energy'),
    f('Activation energy', 'The smallest amount of energy particles need to react is called the activation energy.', 'activation energy = minimum energy to react', 'There is a minimum amount of energy that colliding particles need. This is the activation energy. Particles that collide with at least this much energy can react. Particles with less energy bounce off unchanged.', 'rates-activation'),
    f('More collisions, faster reaction', 'The more collisions with enough energy per second, the faster the reaction.', 'twice as many successful collisions = twice as fast', 'How often particles collide is called the collision frequency. The more collisions per second, the faster the reaction. If the particles collide with enough energy twice as often, the reaction is twice as fast. More energy also means more collisions are successful.', 'rates-frequency'),
  ],
}
