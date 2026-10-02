import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-BOND-030H-C',
  sections: {
    'C30H-02': [
      ['Is breaking bonds endothermic or exothermic?', 'Endothermic. Energy must be supplied to pull bonded atoms apart.', 'Making bonds is the opposite: it releases energy, so it is exothermic.'],
      ['What decides whether a reaction is exothermic or endothermic overall?', 'Which is bigger. More energy released making bonds than used breaking them means exothermic. More used breaking than released making means endothermic.'],
    ],
    'C30H-06': [
      ['What is a bond energy?', 'The energy needed to break one mole of a particular bond, in kJ/mol. The same energy is released when one mole of that bond forms.'],
      ['How do you calculate the overall energy change from bond energies?', 'Overall energy change = energy needed to break bonds in the reactants − energy released making bonds in the products.', 'Count the bonds from displayed formulae, e.g. CH₄ has 4 C–H bonds.'],
      ['What does the sign of the energy change tell you?', 'Negative means exothermic (energy given out). Positive means endothermic (energy taken in).'],
    ],
    'C30H-11': [
      ['Why do you need the actual numbers to compare two reactions?', 'A reaction that needs less energy to break its bonds may also release less making new bonds. Only bonds broken − bonds made for each shows which gives out more.'],
      ['Hydrogen reacts with bromine (−103 kJ/mol) and with iodine (−11 kJ/mol). Why does iodine give out less?', 'Its bonds need less energy to break, but its H–I bonds release much less energy when they form.'],
    ],
  },
  recall: ['C30H-03', 'C30H-08', 'C30H-12'],
}
