import type { TeachingFrame } from '../../teachingFrame'

// SI base units, prefixes, converting up and down, converting before using an equation (v = s ÷ t, W = mg).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsUnitFrames: Record<string, TeachingFrame[]> = {
  'W9-02': [
    f('The same units worldwide', 'Scientists everywhere use the same standard units, called SI units, so results can be compared.', 'one set of units for everyone', 'Scientists all over the world use the same standard units to measure things. They are called SI units. This means a result from one laboratory can be compared with a result from another.', 'wsunit-si'),
    f('Four base units', 'Mass is in kilograms (kg), length in metres (m), time in seconds (s) and temperature in kelvin (K).', 'kg, m, s, K', 'The SI base units you will meet most are these. Mass is measured in kilograms, length in metres and time in seconds. Temperature has the SI unit kelvin, but in school practicals you will often see degrees Celsius.', 'wsunit-base'),
  ],
  'W9-04': [
    f('Prefixes change the size', 'A small word in front of a unit, called a prefix, makes the unit bigger or smaller.', 'a word in front', 'Quantities come in a huge range of sizes. To keep the numbers easy to handle, we use bigger or smaller units. They are the base unit with a little word in front, called a prefix.', 'wsunit-prefix'),
    f('Bigger units', 'Kilo (k) means 1000 times bigger. Mega (M) means 1 000 000 times bigger.', 'kilo 1000, mega a million', 'The prefix kilo means 1000 times bigger, so 1 kilometre is 1000 metres. The prefix mega means 1 000 000 times bigger. The kilogram is a special case: it is the SI unit and already has its prefix.', 'wsunit-big'),
    f('Smaller units', 'Centi (c) is 100 times smaller, milli (m) is 1000 times smaller and micro (µ) is 1 000 000 times smaller.', 'centi 100, milli 1000, micro a million', 'The prefix centi means 100 times smaller. Milli means 1000 times smaller, so there are 1000 millimetres in 1 metre. Micro, written µ, means 1 000 000 times smaller. Deci, 10 times smaller, is used rarely.', 'wsunit-small'),
  ],
  'W9-07': [
    f('Which way to convert', 'Bigger unit to smaller unit: multiply. Smaller unit to bigger unit: divide.', 'smaller unit, bigger number', 'To go from a bigger unit to a smaller unit, multiply. To go from a smaller unit to a bigger unit, divide. Check your answer: a smaller unit needs more of them, so the number gets bigger.', 'wsunit-direction'),
    f('Useful conversions', '1 kg = 1000 g. 1 m = 1000 mm. 1 mm = 1000 µm. 1 m³ = 1000 dm³. 1 dm³ = 1000 cm³.', 'each step is × 1000', 'Here are some conversions you will use in GCSE science. Mass: 1 kg = 1000 g. Length: 1 m = 1000 mm, and 1 mm = 1000 µm. Volume: 1 m³ = 1000 dm³, and 1 dm³ = 1000 cm³.', 'wsunit-chains'),
    f('Worked example: choose', 'A cyclist rides 2.5 km. How many metres? A kilometre is bigger than a metre, so multiply.', 'bigger to smaller: multiply', 'A cyclist rides 2.5 kilometres. How many metres is that? One kilometre is 1000 metres. We are going from a bigger unit to a smaller unit, so we multiply.', 'wsunit-work-1'),
    f('Worked example: answer', '2.5 km × 1000 = 2500 m. Metres are smaller, so the number is bigger.', 'multiply, then check', 'Work it out: 2.5 × 1000 = 2500. So the cyclist rides 2500 metres. The check works: metres are smaller than kilometres, so the number of them is bigger.', 'wsunit-work-2'),
  ],
  'W9-10': [
    f('Convert before you calculate', 'An equation only works if the values are in the right units. Convert first, then substitute.', 'right units in, right unit out', 'An equation only works if the values are in the right units. So you may need to convert a value before you put it in the formula. Writing the unit on each line of your working helps you spot mistakes.', 'wsunit-eq-1'),
    f('Worked example: convert', 'A toy car travels 60 cm in 2 s. Find its speed in m/s. Step 1: 60 cm ÷ 100 = 0.6 m.', 'step 1: cm to m', 'A toy car travels 60 cm in 2 seconds. Find its speed in metres per second. Step one: change the distance to metres. A centimetre is smaller than a metre, so divide. 60 ÷ 100 = 0.6 m.', 'wsunit-eq-2'),
    f('Worked example: substitute', 'Speed = distance ÷ time, so v = s ÷ t = 0.6 ÷ 2 = 0.3 m/s.', 'step 2: use the equation', 'Step two: use the equation. In words, speed equals distance divided by time. In symbols, v = s ÷ t. So v = 0.6 ÷ 2 = 0.3 m/s. You met weight, W = m × g, the same way: mass must be in kilograms first.', 'wsunit-eq-3'),
  ],
}
