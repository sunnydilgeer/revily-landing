import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-024-P',
  sections: {
    'P24-02': [
      ['How is energy transferred when charge moves around a circuit?', 'Work is done against the resistance of the circuit, so energy is transferred electrically.'],
      ['Give an example of an electrical energy transfer.', 'A kettle transfers energy electrically from the mains to the thermal store of its heating element. A battery fan transfers it from the chemical store of the battery to the kinetic store of the motor.'],
    ],
    'P24-05': [
      ['What is the equation for energy transferred by an appliance?', 'Energy transferred (J) = power (W) × time (s), or E = P × t.', 'Change minutes to seconds first.'],
      ['What is power?', 'The energy an appliance transfers each second, measured in watts.', '1 W is 1 J per second.'],
    ],
    'P24-08': [
      ['What is a power rating?', 'The maximum safe power an appliance can work at: the most energy it can transfer between stores each second.'],
      ['What does a higher power rating mean?', 'For the same time, more energy is transferred, so it costs more to run. But energy is transferred faster, so it may not need to be on for as long.'],
    ],
  },
  recall: ['P24-04', 'P24-06', 'P24-09'],
}
