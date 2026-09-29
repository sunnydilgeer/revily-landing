import type { TeachingFrame } from '../../teachingFrame'

// One idea per section: metals with acids (a salt and hydrogen), metals with water (a hydroxide and hydrogen), using
// bubbles and temperature to order metals (the reactivity series), then displacement. Same colour code as the salts lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const metalReactionFrames: Record<string, TeachingFrame[]> = {
  'C25-02': [
    f('Acid + metal', 'A metal and an acid make a salt and hydrogen gas.', 'acid + metal → salt + hydrogen', 'Many metals react with dilute acids. The metal takes the place of the hydrogen in the acid. This makes a salt, and the hydrogen is given off as a gas. So the two products are a salt and hydrogen.', 'mrx-acid-word'),
    f('Name the salt', 'The metal gives the first word and the acid gives the second.', 'zinc + hydrochloric → zinc chloride', 'The naming rule is the same as before. Hydrochloric acid makes chlorides and sulfuric acid makes sulfates. Zinc and hydrochloric acid make zinc chloride. Magnesium and sulfuric acid make magnesium sulfate. Hydrogen is given off each time.', 'mrx-acid-eq'),
    f('How fast?', 'More reactive metals fizz harder. Copper does not react with cold, dilute acid.', 'more reactive → more bubbles', 'Different metals react at different speeds. Magnesium fizzes quickly, zinc more slowly and iron slowly. Copper does not react with cold, dilute acid. Potassium and sodium react so violently that they are never put in acid in school.', 'mrx-acid-rate'),
  ],
  'C25-05': [
    f('Metal + water', 'A metal and water make a metal hydroxide and hydrogen.', 'metal + water → hydroxide + hydrogen', 'Some metals react with water as well. The products are a metal hydroxide and hydrogen gas. A hydroxide contains the OH group. Only the more reactive metals react with water.', 'mrx-water-word'),
    f('Calcium and water', 'Calcium + water → calcium hydroxide + hydrogen.', 'Ca + 2H₂O → Ca(OH)₂ + H₂', 'Calcium reacts with water to make calcium hydroxide and hydrogen. The symbol equation is Ca + 2H₂O → Ca(OH)₂ + H₂. The letters in brackets are state symbols. Calcium hydroxide dissolves in the water, so it is (aq).', 'mrx-water-ca'),
    f('Which metals react?', 'Potassium, sodium, lithium and calcium react with water. Zinc, iron and copper do not.', 'very reactive metals react with water', 'Potassium, sodium, lithium and calcium all react with water. Zinc, iron and copper do not. Reactivity decides which metals react. That is why the same ordering of metals appears again and again.', 'mrx-water-list'),
  ],
  'C25-08': [
    f('Watch the bubbles', 'The faster the hydrogen bubbles, the more reactive the metal.', 'faster bubbles → more reactive', 'You can put metals in order by testing them in the same acid or water. Watch how quickly bubbles of hydrogen form. The faster the bubbles form, the more reactive the metal. Magnesium bubbles faster than zinc, and zinc faster than iron.', 'mrx-order-bubbles'),
    f('Measure the temperature', 'A more reactive metal makes a bigger temperature rise.', 'more reactive → bigger rise', 'You can also measure the temperature change in a set time. These reactions give out heat. A more reactive metal gives a bigger rise. In this invented data, magnesium rises 18 °C, zinc 9 °C and iron 4 °C.', 'mrx-order-temp'),
    f('Make it fair', 'Change only the metal and keep everything else the same.', 'one change, everything else the same', 'A fair test changes only one thing, the metal. Keep the mass of metal, the size of the pieces, the acid and the starting temperature the same. Smaller pieces expose more surface and would react faster. That would make the comparison unfair.', 'mrx-order-fair'),
    f('The reactivity series', 'Metals listed from most to least reactive make the reactivity series.', 'higher up → more reactive', 'A list of metals from most reactive to least reactive is the reactivity series. Potassium, sodium, lithium and calcium are very reactive. Magnesium, zinc and iron are fairly reactive. Copper is not very reactive.', 'mrx-series'),
  ],
  'C25-11': [
    f('Iron in copper sulfate', 'A more reactive metal can push a less reactive metal out of its compound.', 'iron pushes copper out', 'Put an iron nail in blue copper sulfate solution. Brown copper coats the nail and the solution turns pale green. Iron has taken copper’s place in the compound. This is called displacement.', 'mrx-disp-what'),
    f('The rule', 'A more reactive metal displaces a less reactive metal from its compound.', 'higher in the series wins', 'Here is the rule. A more reactive metal displaces a less reactive metal from its compound. Iron is above copper in the reactivity series. So iron displaces copper, and the sulfate joins the iron.', 'mrx-disp-rule'),
    f('Write the equation', 'Iron + copper sulfate → iron sulfate + copper.', 'Fe + CuSO₄ → FeSO₄ + Cu', 'The word equation is iron + copper sulfate → iron sulfate + copper. The symbol equation is Fe + CuSO₄ → FeSO₄ + Cu. Iron and copper are solids and both sulfates are dissolved. The equation is already balanced.', 'mrx-disp-eq'),
    f('When nothing happens', 'A less reactive metal cannot displace a more reactive one.', 'lower in the series → no reaction', 'Now try the opposite. Copper is less reactive than iron, so it cannot push iron out of iron sulfate. Nothing happens: there is no reaction. Check the reactivity series first and you can predict the result.', 'mrx-disp-none'),
  ],
}
