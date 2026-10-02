/*
 * Higher-only sections for chapter B4 (bioenergetics), from the CGP AQA Combined Science Higher guide, pages 47, 49 and 52
 * (scope only; all wording, numbers and drawings are original). Diagrams: components/HigherPhotosynthesisVisuals.tsx ('hphoto-').
 *
 * Two sections go into the rate of photosynthesis lesson, both before its "On your own" screens. tier.ts splices additions in
 * array order, so the inverse square law section (placed before B27-15) comes first here, and the two-factor graph section
 * is then placed before it (before B27-H05). Higher students meet the graphs first, then distance and cost.
 */
import { addition, f, type HigherAddition } from './helpers'

// Biology · rate of photosynthesis · Higher p49: the inverse square law, and paying for heat, light and carbon dioxide.
const lightAndCost = addition('B-BIO-027-B', 'B27-15', 'B-HIGHER-INVERSE-SQUARE', ['4.4.1.2'],
  { id: 'B27-H05', higher: true, label: 'Distance, light and cost', detail: 'The inverse square law and greenhouses' },
  [
    f('Further away, dimmer', 'The further the lamp, the lower the light intensity.', 'distance up → light intensity down', 'A grower hangs a lamp above a tomato plant. When the lamp is moved further away, less light reaches the leaves. So as the distance goes up, the light intensity goes down. The graph shows how quickly it falls.', 'hphoto-isl-farther'),
    f('Spreading out', 'Light intensity depends on 1 ÷ distance squared.', 'twice as far → spread over 4 times the area', 'Light spreads out as it travels. At twice the distance, the same light covers four times the area, so each part gets a quarter. Light intensity is proportional to 1 ÷ distance². This is called the inverse square law.', 'hphoto-isl-spread'),
    f('Halve the distance', 'Halve the distance and the light intensity is four times greater.', '½ the distance → 4 × the light', 'Moving the lamp from 20 cm to 10 cm halves the distance. The light intensity becomes 2², or 4, times greater. Doubling the distance does the opposite: the light intensity becomes four times smaller.', 'hphoto-isl-halve'),
    f('Work it out', 'Use 1 ÷ d² as a measure of light intensity.', 'light intensity = 1 ÷ d²', 'Worked example: the lamp is 20 cm from the plant. Square the distance: 20 × 20 = 400. Then 1 ÷ 400 = 0.0025. The answer has no real unit, so we write 0.0025 a.u. This stands for arbitrary units.', 'hphoto-isl-calc'),
    f('Worth the cost?', 'Farmers pay for heat, light and carbon dioxide only while it speeds up growth.', 'extra only helps while it is limiting', 'In a greenhouse, farmers can add lamps, heaters and extra carbon dioxide. A paraffin heater gives both heat and carbon dioxide. Faster growth means more crops to sell, but all of this costs money. Once a factor stops limiting, adding more is wasted money. Spending only what pays back is called being cost-effective.', 'hphoto-isl-cost'),
  ],
  a => [
    a.choice('B27-H06', 'A lamp is 25 cm from a plant. Use light intensity = 1 ÷ d² to work out the light intensity.', ['0.04 a.u.', '625 a.u.', '0.0016 a.u.', '0.08 a.u.'], 2, 'Square the distance first, then divide 1 by your answer.', ['Square the distance: 25 × 25 = 625.', 'Then 1 ÷ 625 = 0.0016, so the light intensity is 0.0016 a.u.'], 'calculation'),
    a.choice('B27-H07', 'A lamp is moved from 30 cm to 15 cm away from some pondweed. What happens to the light intensity?', ['It doubles', 'It becomes four times greater', 'It halves', 'It becomes four times smaller'], 1, 'The distance has been halved. Think 1 ÷ d².', ['Going from 30 cm to 15 cm halves the distance.', 'Light intensity depends on 1 ÷ d², so it becomes 2² = 4 times greater.']),
    a.choice('B27-H08', 'A farmer adds more lamps to a warm greenhouse. The tomatoes do not grow any faster. Why is buying more lamps a waste of money?', ['Lamps cool the greenhouse down', 'Plants need less light inside a greenhouse', 'Lamps take carbon dioxide out of the air', 'Light is not the limiting factor, so more light does not speed up photosynthesis'], 3, 'Extra light only helps while light is the limiting factor.', ['The growth did not speed up, so light is no longer the limiting factor.', 'Something else, such as carbon dioxide, is holding it back, so paying for more light is not cost-effective.'], 'application', true),
  ])

// Biology · rate of photosynthesis · Higher p47: one graph showing two limiting factors.
const twoFactors = addition('B-BIO-027-B', 'B27-H05', 'B-HIGHER-TWO-FACTORS', ['4.4.1.2'],
  { id: 'B27-H01', higher: true, label: 'Two factors on one graph', detail: 'Light with temperature or carbon dioxide' },
  [
    f('Two lines, one start', 'At first, both lines rise together: light is limiting.', 'both rising → light is limiting', 'This graph has two lines. Both show rate against light intensity, but one plant is at 15 °C and one is at 25 °C. At low light, the lines rise together. So here, light intensity is the limiting factor for both.', 'hphoto-two-rise'),
    f('Both level off', 'When a line goes flat, light is no longer limiting.', 'flat → something else limits', 'Further along, each line levels off. More light no longer speeds photosynthesis up. So light is no longer the limiting factor on the flat parts.', 'hphoto-two-flat'),
    f('Higher when warmer', 'The 25 °C line levels off higher, so temperature limited the 15 °C line.', 'warmer → higher flat part', 'The 25 °C line levels off at a higher rate than the 15 °C line. The only difference between them is temperature. So on its flat part, the 15 °C line was limited by temperature.', 'hphoto-two-gap'),
    f('Same idea, carbon dioxide', 'More carbon dioxide gives a higher flat part.', 'more carbon dioxide → higher flat part', 'Now both plants are at 25 °C. One has 0.04% carbon dioxide, like normal air. The other has 0.1%. The 0.1% line levels off higher, so carbon dioxide limited the 0.04% line. Temperature cannot explain the gap, because it is the same for both.', 'hphoto-two-co2'),
    f('Put it together', 'Rising: light limits. Flat: look for what is different.', 'what is different between the lines?', 'To read a two-line graph, start with the rising part: light is limiting there. Then compare the flat parts. Find the one thing that differs between the lines. That factor was limiting the lower line.', 'hphoto-two-all'),
  ],
  a => [
    a.choice('B27-H02', 'Look at point 1 on the graph. Which factor is limiting the rate of photosynthesis there?', ['Temperature', 'Light intensity', 'Carbon dioxide concentration'], 1, 'Is the line still rising at point 1?', ['At point 1 the line is still rising, and both lines are together.', 'More light still speeds photosynthesis up, so light intensity is the limiting factor.'], 'understanding', false, 'hphoto-two-question'),
    a.choice('B27-H03', 'Point 2 is on the flat part of the 15 °C line. What is limiting the rate at point 2?', ['Light intensity', 'Carbon dioxide concentration', 'Temperature'], 2, 'The 25 °C line levels off higher. What is different about it?', ['At point 2 the line is flat, so light is not limiting.', 'At 25 °C the rate goes higher, and only the temperature differs, so temperature is limiting at point 2.'], 'dataInterpretation', false, 'hphoto-two-question'),
    a.choice('B27-H04', 'A student measures rate against light intensity at 0.04% and at 0.1% carbon dioxide, both at 20 °C. The 0.1% line levels off higher. What limited the 0.04% line on its flat part?', ['Carbon dioxide concentration', 'Temperature', 'Light intensity', 'The amount of water'], 0, 'Find the one thing that is different between the two lines.', ['Both lines are at 20 °C, so temperature cannot explain the gap, and light is not limiting on a flat part.', 'Only the carbon dioxide differs, so carbon dioxide concentration limited the 0.04% line.'], 'dataInterpretation', true),
  ])

// Biology · exercise and metabolism · Higher p52: lactic acid to the liver, and what the oxygen debt is really for.
const lacticAcid = addition('B-BIO-029-B', 'B29-14', 'B-HIGHER-LACTIC', ['4.4.2.2'],
  { id: 'B29-H01', higher: true, label: 'Clearing the lactic acid', detail: 'The liver and the oxygen debt' },
  [
    f('Off to the liver', 'Blood carries lactic acid from the muscles to the liver.', 'muscle → blood → liver', 'After hard exercise, lactic acid has built up in the muscles. Blood flowing through the muscles picks it up. The blood carries the lactic acid to the liver.', 'hphoto-lactic-liver'),
    f('Back to glucose', 'In the liver, lactic acid is converted back into glucose.', 'lactic acid → glucose', 'In the liver, the lactic acid is changed back into glucose. Changing one substance into another like this is called converting. The glucose can then be used again.', 'hphoto-lactic-glucose'),
    f('Oxygen reacts with it', 'Oxygen reacts with lactic acid to make carbon dioxide and water.', 'lactic acid + oxygen → carbon dioxide + water', 'Removing lactic acid needs oxygen. Oxygen reacts with the lactic acid. This makes carbon dioxide and water, which are harmless.', 'hphoto-lactic-oxygen'),
    f('What the debt is for', 'The oxygen debt is the extra oxygen needed to remove the lactic acid.', 'oxygen debt → clears lactic acid', 'Now you can see why you keep breathing hard after exercise. The oxygen debt is the extra oxygen your body needs to react with the lactic acid. This removes it from the cells. Breathing and heart rate stay high until it is cleared.', 'hphoto-lactic-debt'),
  ],
  a => [
    a.choice('B29-H02', 'Look at the numbered parts. Where is lactic acid converted back into glucose?', ['Part 1', 'Part 2', 'Part 3'], 1, 'Blood carries the lactic acid away from the muscles to one organ.', ['Part 1 is a leg muscle, where lactic acid is made, and part 3 is the lungs.', 'Part 2 is the liver, where lactic acid is converted back into glucose.'], 'recall', false, 'hphoto-lactic-question'),
    a.choice('B29-H03', 'Which is the best description of the oxygen debt?', ['The oxygen the muscles used during the race', 'The lactic acid left in the muscles after exercise', 'The extra oxygen needed after exercise to react with lactic acid and remove it from the cells'], 2, 'What does the extra oxygen react with?', ['After hard exercise, lactic acid has built up in the cells.', 'The oxygen debt is the extra oxygen needed to react with the lactic acid and remove it.']),
    a.choice('B29-H04', 'After a sprint, oxygen reacts with the lactic acid in a runner’s cells. What does this reaction make?', ['Carbon dioxide and water', 'Ethanol and carbon dioxide', 'Urea and oxygen', 'More lactic acid'], 0, 'The products are harmless and you breathe one of them out.', ['Oxygen reacts with lactic acid to remove it.', 'This makes carbon dioxide and water, which are harmless.'], 'recall', true),
  ])

export const higherB4: HigherAddition[] = [lightAndCost, twoFactors, lacticAcid]
