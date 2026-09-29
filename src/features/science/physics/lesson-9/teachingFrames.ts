import type { TeachingFrame } from '../../teachingFrame'

// Efficiency: useful vs total energy, then the energy equation (decimal, percentage), then the power version with one rearrangement.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const efficiencyFrames: Record<string, TeachingFrame[]> = {
  'P9-02': [
    f('Input, useful and wasted', 'The total energy going in splits into useful energy out and wasted energy.', 'in = useful + wasted', 'Every device takes in some energy. This is the total input energy. Some of it is transferred usefully. The rest is wasted. Total input = useful output + wasted energy.', 'effic-split'),
    f('What efficiency measures', 'Efficiency measures how much of the input energy ends up in useful stores.', 'how much is useful', 'Efficiency tells us how much of the input energy is transferred usefully. A device that wastes little is efficient. A device that wastes a lot is not efficient. The less energy that is wasted, the more efficient the transfer.', 'effic-measure'),
    f('Never 100 per cent', 'Some energy is always wasted, so no device is 100% efficient.', 'always some waste', 'In every energy transfer, some energy is dissipated. So the useful output is always less than the input. No device is 100% efficient. Some are very close, but none reaches it.', 'effic-never'),
  ],
  'P9-05': [
    f('The equation', 'Efficiency = useful output energy transfer ÷ total input energy transfer.', 'useful over total', 'To calculate efficiency, divide the useful energy output by the total energy input. In words: efficiency = useful output energy transfer ÷ total input energy transfer. Both energies are in joules, so the units cancel.', 'effic-eq'),
    f('A decimal from 0 to 1', 'The answer is a decimal. It is never more than 1.', 'decimal between 0 and 1', 'The answer to this division is a decimal. Because the useful output is less than the input, it is always smaller than 1. For example, 0.8 means 80 out of every 100 joules are useful. An answer over 1 means you have divided the wrong way round.', 'effic-decimal'),
    f('Percentage', 'To change a decimal into a percentage, multiply it by 100.', 'multiply by 100', 'Efficiency is often given as a percentage. To change a decimal into a percentage, multiply it by 100. So 0.8 × 100 = 80%. To change a percentage back into a decimal, divide it by 100.', 'effic-percent'),
    f('Three steps', 'Put the numbers in, divide, then multiply by 100 if you want a percentage.', 'in, divide, × 100', 'Follow the same steps every time. Write down the useful output and the total input. Divide the useful output by the total input. If the question asks for a percentage, multiply your answer by 100.', 'effic-steps'),
  ],
  'P9-09': [
    f('Power in and power out', 'You can also use the useful power output and the total power input.', 'watts, not joules', 'Sometimes you are given power instead of energy. Power is how fast energy is transferred. So efficiency can also be worked out as useful power output ÷ total power input. Both are in watts.', 'effic-power'),
    f('Same idea', 'Efficiency = useful power output ÷ total power input. A lamp with 20 W in and 5 W of light out is 25% efficient.', 'same equation, power values', 'The equation works exactly the same way. A lamp takes in 20 W and gives out 5 W of light. Efficiency = 5 ÷ 20 = 0.25. As a percentage this is 25%.', 'effic-power-eq'),
    f('Finding the useful output', 'Rearrange: useful power output = efficiency × total power input.', 'multiply both sides by the input', 'Sometimes you know the efficiency and the input, and need the useful output. Multiply both sides of the equation by the total power input. This gives useful power output = efficiency × total power input. Use the efficiency as a decimal.', 'effic-rearrange'),
  ],
}
