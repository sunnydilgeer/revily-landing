import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-RES-012-P',
  sections: {
    'P12-02': [
      ['How does hydro-electric power work?', 'A big dam is built across a valley and the valley is flooded. Water flows out through turbines, which generates electricity.'],
      ['What are the pros and cons of hydro-electric power?', 'Pros: no pollution when running, and the flow can be controlled to respond straight away to extra demand. Cons: high initial costs, and flooding harms the environment. It is unreliable in dry climates or a drought.'],
    ],
    'P12-05': [
      ['How does wave power work?', 'Waves turn turbines in the sea, usually near the coast, and this generates electricity.'],
      ['What are the pros and cons of wave power?', 'Pros: no pollution, and useful on islands. Cons: turbines can disturb the seabed and habitats, the energy is fairly unreliable, and the turbines are difficult and expensive to maintain.'],
    ],
    'P12-08': [
      ['What is a tidal barrage?', 'A big dam with turbines in it, built across an estuary. Water passing through the turbines generates electricity.', 'An estuary is the part of a river that meets the sea.'],
      ['What are the pros and cons of tidal barrages?', 'Pros: no pollution, and tides are reliable, happening twice a day. Cons: they can change the habitats of wildlife, there are few suitable estuaries, and smaller tides give less energy.'],
    ],
  },
  recall: ['P12-03', 'P12-06', 'P12-09'],
}
