import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-DAT-009-W',
  sections: {
    'W9-02': [
      ['What are SI units?', 'The standard units that scientists all over the world use.'],
      ['What are the SI base units for mass, length and time?', 'Kilogram (kg), metre (m) and second (s).', 'The SI unit of temperature is the kelvin (K).'],
    ],
    'W9-04': [
      ['What do kilo and mega mean?', 'Kilo (k) is 1000 times bigger. Mega (M) is 1 000 000 times bigger.'],
      ['What do centi, milli and micro mean?', 'Centi (c) is 100 times smaller. Milli (m) is 1000 times smaller. Micro (µ) is 1 000 000 times smaller.'],
    ],
    'W9-07': [
      ['How do you convert between units?', 'Bigger unit to smaller unit: multiply. Smaller unit to bigger unit: divide.'],
      ['What are some useful conversions?', '1 kg = 1000 g. 1 m = 1000 mm. 1 dm³ = 1000 cm³.'],
    ],
    'W9-10': [
      ['Why check units before using an equation?', 'The equation only works if every value is in the right unit, so convert first.'],
      ['How do you change centimetres into metres?', 'Divide by 100, because a centimetre is smaller than a metre. For example, 60 cm ÷ 100 = 0.6 m.', 'Writing the unit on each line of your working helps you spot mistakes.'],
    ],
  },
  recall: ['W9-05', 'W9-08', 'W9-11'],
}
