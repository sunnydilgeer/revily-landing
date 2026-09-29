import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-RES-055-C',
  sections: {
    'C55-02': [
      ['Where does waste water come from?', 'Homes, agriculture (farming) and industrial processes.'],
      ['Why is waste water treated?', 'To remove pollutants such as organic matter and harmful microbes, so it does not cause health problems when put back into rivers and lakes.'],
    ],
    'C55-05': [
      ['What happens in screening?', 'Large bits, such as twigs and plastic bags, and grit (small bits of stone and sand) are removed.'],
      ['What happens in sedimentation?', 'The heavier solids sink to the bottom as sludge. The lighter liquid waste, called effluent, floats on top.'],
    ],
    'C55-08': [
      ['What is aerobic digestion?', 'Bacteria, using oxygen, break down organic matter and other microbes in the effluent. Aerobic means with oxygen.'],
      ['What is anaerobic digestion?', 'Bacteria break down the sludge without oxygen. It makes methane gas, which can be used as an energy source. The remaining waste can be used as fertiliser.', 'Anaerobic means without oxygen.'],
    ],
    'C55-11': [
      ['How does treating waste water compare with desalination?', 'It has more stages than treating fresh water, but uses less energy than desalinating salt water.'],
      ['What extra treatment do toxic substances need?', 'Extra stages, such as adding chemicals, UV radiation or membranes.'],
    ],
  },
  recall: ['C55-06', 'C55-09', 'C55-12'],
}
