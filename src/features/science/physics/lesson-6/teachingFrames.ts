import type { TeachingFrame } from '../../teachingFrame'

// Power is built as "how fast energy is transferred", then the unit (watt), then P = E ÷ t (with the seconds check),
// then E = P × t rearranged once. Each teaching section keeps one picture on screen and changes it frame by frame.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const powerFrames: Record<string, TeachingFrame[]> = {
  'P6-02': [
    f('How fast, not how much', 'Power is how fast energy is transferred.', 'fast or slow transfer', 'Two motors can lift the same box to the same height. Both transfer the same amount of energy to the box. The motor that finishes sooner transferred that energy faster. Power is a measure of how fast energy is transferred.', 'power-rate'),
    f('Measured in watts', 'Power is measured in watts, W. One watt is one joule of energy transferred every second.', 'joules per second', 'Power is measured in watts, written W. One watt means one joule of energy is transferred every second. A 60 W lamp transfers 60 J of energy each second it is on.', 'power-watt'),
    f('Work done means the same', 'Work done is energy transferred, so power is also the rate of doing work.', 'work done = energy transferred', 'When a force moves something, work is done. The work done is the same amount as the energy transferred. So power can also be called how fast work is done. Both ideas are measured in joules.', 'power-work'),
    f('A powerful machine', 'A powerful machine transfers a lot of energy in a short time.', 'lots of energy, short time', 'Picture two cranes lifting identical loads up the same building. The more powerful crane transfers more energy in each second. So it finishes the job sooner. A powerful machine is not always bigger, it is faster at transferring energy.', 'power-powerful'),
  ],
  'P6-05': [
    f('The equation in words', 'Power = energy transferred ÷ time.', 'energy on top, time underneath', 'Power is energy transferred per second, so we divide the energy by the time. In words: power equals energy transferred divided by time. The energy goes on top and the time goes underneath.', 'power-eq-words'),
    f('The equation in symbols', 'P = E ÷ t. P is in watts, E is in joules and t is in seconds.', 'W, J and s', 'In symbols this is P = E ÷ t. P is the power in watts, W. E is the energy transferred in joules, J. The letter t is the time in seconds, s.', 'power-eq-symbols'),
    f('The work version', 'P = W ÷ t gives the same answer, because work done equals energy transferred.', 'work done or energy', 'Since work done equals energy transferred, there is a second version. Power equals work done divided by time, or P = W ÷ t. Here W is the work done, in joules. Take care: W for work done is not the same as W for watts.', 'power-eq-work'),
    f('Get the units right', 'The time must be in seconds. Change minutes by multiplying by 60. Change kJ to J by multiplying by 1000.', 'seconds and joules first', 'Before you divide, check the units. Time must be in seconds, so 2 minutes becomes 2 × 60 = 120 s. Energy must be in joules, so 3 kJ becomes 3 × 1000 = 3000 J. Then put the numbers into the equation.', 'power-units'),
  ],
  'P6-09': [
    f('Finding the energy', 'Sometimes you know the power and the time, and want the energy.', 'know P and t, want E', 'A machine label tells you its power. You may know how long it runs and want the energy it transfers. The equation P = E ÷ t has power on its own, not energy. We need to turn it round.', 'power-find-energy'),
    f('Multiply both sides by time', 'P = E ÷ t becomes E = P × t.', 'multiply both sides by t', 'To get E on its own, multiply both sides of P = E ÷ t by t. The t on the right cancels. That leaves E = P × t. Energy transferred equals power multiplied by time.', 'power-rearrange'),
    f('Same units again', 'Power in watts times time in seconds gives energy in joules.', 'W × s = J', 'Use power in watts and time in seconds. Then the energy comes out in joules. A 20 W lamp on for 10 s transfers 20 × 10 = 200 J. Check the time units before you multiply.', 'power-e-pt'),
  ],
}
