import type { TeachingFrame } from '../../teachingFrame'

// How electrical appliances transfer energy, E = Pt with a minutes-to-seconds conversion (worked example, then guided practice),
// and what a power rating means. Power in watts and P = E ÷ t come from the earlier Power lesson; P = VI is the next lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const appliancePowerFrames: Record<string, TeachingFrame[]> = {
  'P24-02': [
    f('Charge does work', 'When charge moves around a circuit, work is done against the resistance of the circuit.', 'charge moves, work is done', 'When a current flows, charge moves around the circuit. As it moves, work is done against the resistance of the circuit. Whenever work is done, energy is transferred.', 'appower-work'),
    f('Energy transferred electrically', 'Work done by charge means energy is transferred electrically.', 'transferred electrically', 'When charge does work, energy is transferred electrically. So an appliance transfers energy from the supply to parts of the circuit when a current flows. The current is the way the energy gets there.', 'appower-electrically'),
    f('A kettle', 'A kettle transfers energy electrically from the mains supply to the thermal store of its heating element.', 'mains to thermal store', 'A kettle transfers energy electrically from the mains supply to the thermal store of the heating element. The hot element then transfers energy to the water by heating. Some energy also spreads out to the surroundings.', 'appower-kettle'),
    f('A battery-powered fan', 'A handheld fan transfers energy electrically from the chemical store of its battery to the kinetic store of its motor.', 'battery to motor', 'A handheld fan works differently. Energy is transferred electrically from the chemical store of its battery to the kinetic store of the motor. The moving blades then push air around. As with every appliance, some energy is wasted.', 'appower-fan'),
  ],
  'P24-05': [
    f('Power and time', 'The energy an appliance transfers depends on its power and on how long it is on.', 'power and time', 'How much energy an appliance transfers depends on two things. One is how long it is switched on. The other is its power. The power of an appliance is the energy it transfers each second, measured in watts.', 'appower-depends'),
    f('The equation', 'Energy transferred = power × time. In symbols E = P × t, with E in joules, P in watts and t in seconds.', 'joules, watts, seconds', 'The word equation is: energy transferred = power × time. In symbols this is E = P × t. Energy E is in joules, power P is in watts, and time t is in seconds. The time must always be in seconds.', 'appower-equation'),
    f('Worked example: convert the time', 'An 800 W toaster is on for 2 minutes. Step 1: change the time to seconds. 2 × 60 = 120 s.', 'minutes × 60', 'A toaster has a power of 800 W. It is used for 2 minutes. How much energy does it transfer? Step 1: change the time into seconds. There are 60 seconds in a minute, so t = 2 × 60 = 120 s.', 'appower-worked-time'),
    f('Worked example: substitute', 'Step 2: E = P × t = 800 × 120 = 96 000 J.', 'put the numbers in', 'Step 2: put the numbers into the equation. E = P × t. E = 800 × 120. E = 96 000 J. The toaster transfers 96 000 joules of energy.', 'appower-worked-sub'),
  ],
  'P24-08': [
    f('What a power rating is', 'A power rating is the maximum safe power an appliance can work at.', 'maximum safe power', 'Many appliances have a power rating printed on them. It tells you the maximum power the appliance can safely work at. In other words, it is the most energy it transfers between stores each second.', 'appower-rating'),
    f('Higher rating, higher cost', 'For the same time, an appliance with a higher power rating transfers more energy and costs more to run.', 'more energy costs more', 'Take two microwaves, one rated 850 W and one rated 600 W. Used for the same 5 minutes, the 850 W microwave transfers more energy. So it costs more to run for that time.', 'appower-cost'),
    f('But it works faster', 'A higher power rating means energy is transferred faster, so the appliance may not need to be on for as long.', 'faster, shorter time', 'A higher power rating also means the appliance transfers energy faster. So it may not need to be switched on for as long to do the same job. Power tells you how quickly, and time tells you for how long.', 'appower-faster'),
  ],
}
