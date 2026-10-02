import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-EQM-036H-C',
  sections: {
    'C36H-02': [
      ['What is Le Chatelier’s principle?', 'If you change the conditions of a reversible reaction at equilibrium, the system responds to counteract the change.'],
      ['What does it mean if an equilibrium lies to the right?', 'There are more products than reactants at equilibrium.', 'Lies to the left: more reactants than products.'],
      ['Which conditions affect the position of equilibrium?', 'The temperature, the pressure (only for reactions with gases) and the concentrations of the reactants and products.'],
    ],
    'C36H-06': [
      ['What does raising the temperature do to an equilibrium?', 'It moves the equilibrium in the endothermic direction, so the system takes in heat.', 'Lowering the temperature moves it in the exothermic direction.'],
      ['In N₂ + 3H₂ ⇌ 2NH₃ the forward reaction is exothermic. How do you get more ammonia?', 'Lower the temperature. The equilibrium moves in the exothermic direction, to the right.'],
    ],
    'C36H-10': [
      ['What does raising the pressure do to an equilibrium with gases?', 'It moves the equilibrium to the side with fewer molecules of gas, counted from the balanced equation.', 'Lowering the pressure moves it to the side with more molecules of gas.'],
      ['When does changing the pressure have no effect on an equilibrium?', 'When there are no gases, or both sides have the same number of molecules of gas.'],
      ['What happens if you add a reactant or remove a product?', 'The equilibrium moves to the right, so more products form until equilibrium is reached again.'],
    ],
  },
  recall: ['C36H-03', 'C36H-08', 'C36H-12'],
}
