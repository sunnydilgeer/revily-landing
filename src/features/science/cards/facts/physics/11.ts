import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-RES-011-P',
  sections: {
    'P11-02': [
      ['What are the pros of wind power?', 'There is no pollution once the turbines are built, and no permanent damage to the landscape.'],
      ['What are the cons of wind power?', 'Turbines can spoil the view and be noisy. They stop when there is little wind, and have to be stopped if it is too strong. The supply cannot be increased on demand.'],
    ],
    'P11-05': [
      ['What do solar cells do?', 'They generate electricity directly from sunlight. They are often used in remote places, and to power road signs and satellites.'],
      ['What are the pros and cons of solar power?', 'Pros: no pollution once built, reliable in sunny countries, free energy. Cons: only works in the daytime, lots of energy used to build the panels, output cannot be increased on demand.'],
    ],
    'P11-08': [
      ['Where does geothermal energy come from?', 'The thermal energy stores of hot rocks below the Earth\'s surface. It can generate electricity or heat buildings directly.'],
      ['Why is geothermal power reliable, and what limits it?', 'The hot rocks are always hot. But there are not many suitable locations, and a geothermal power plant is usually costly to build.'],
    ],
  },
  recall: ['P11-03', 'P11-09', 'P11-10'],
}
