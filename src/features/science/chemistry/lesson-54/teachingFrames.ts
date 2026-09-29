import type { TeachingFrame } from '../../teachingFrame'

// Three properties of pure water, the evaporating basin test for dissolved solids (a practical-preparation lesson),
// pH and boiling point checks, then distilling water in the lab. Distillation is recalled from the separation lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const waterTestFrames: Record<string, TeachingFrame[]> = {
  'C54-02': [
    f('Never taste it', 'You test water with chemistry, not by drinking it.', 'tests, not tasting', 'You can test whether water is pure. None of the tests involve drinking it to see what happens. Never taste a sample in the lab. Here are three properties you can check.', 'wtest-intro'),
    f('Three properties of pure water', 'Pure water boils at 100 °C, has a pH of 7 and contains no dissolved solids.', 'boiling point, pH, dissolved solids', 'Pure water boils at 100 °C. It has a pH of 7, which means it is neutral. It also has no dissolved solids in it. You can check one or more of these to confirm a sample is pure.', 'wtest-three'),
    f('Which test for which property', 'Boiling a sample checks for dissolved solids. A pH probe checks pH. A thermometer checks the boiling point.', 'match test to property', 'Each property has its own check. To look for dissolved solids, you evaporate a sample and see what is left. To check pH, you use a pH probe or indicator. To check the boiling point, you measure the temperature at which it boils.', 'wtest-match'),
  ],
  'C54-05': [
    f('Weigh the empty basin', 'Step 1: measure the mass of a clean, dry evaporating basin.', 'start with the basin alone', 'To check for dissolved solids, you evaporate a water sample. First, measure the mass of a clean, dry evaporating basin. Say it is 40.16 g.', 'wtest-basin'),
    f('Add the sample', 'Step 2: add a known volume of the water sample to the basin.', 'known volume', 'Next, add a known volume of your water sample to the basin. A known volume means you measured how much you put in, for example with a measuring cylinder.', 'wtest-sample'),
    f('Heat until dry', 'Step 3: heat the basin until all the water has boiled off. It must be completely dry.', 'no water left', 'Heat the basin, for example with a Bunsen burner. Keep heating until all of the water has boiled off. The basin must be completely dry. Any dissolved solids cannot boil away, so they stay behind.', 'wtest-heat'),
    f('Cool and weigh again', 'Step 4: let the basin cool, then measure its mass again.', 'second mass', 'Let the basin cool. Then measure its mass a second time. Say it is now 40.22 g.', 'wtest-weigh'),
    f('Work out the change', 'Step 5: subtract the first mass from the second. An increase means the sample contained dissolved solids.', 'second minus first', 'Subtract the first mass from the second. The change is 40.22 − 40.16 = 0.06 g. The mass has increased. So the water did contain dissolved solids, which were left behind. It was not pure.', 'wtest-change'),
    f('Look in the basin', 'You can also look for solid in the basin, but a tiny amount may be too small to see.', 'the mass is more reliable', 'You can also look in the basin to see if any solid is left. But if the sample had only a small amount of solid, you might not see it. This is why the mass measurement is the better check.', 'wtest-look'),
  ],
  'C54-08': [
    f('Checking the pH', 'Pure water has a pH of about 7. You can measure it with a pH probe and meter, or with universal indicator paper or solution.', 'about 7 is neutral', 'You could check the pH of the sample to see if it is around 7. Use a pH probe and meter, or use universal indicator paper or universal indicator solution.', 'wtest-ph'),
    f('Checking the boiling point', 'Pure water boils at exactly 100 °C, so measure the temperature at which the sample boils.', 'a pure substance boils at one temperature', 'Pure substances melt and boil at specific temperatures. So you can measure the temperature at which your sample boils. If it is pure water, it will boil at 100 °C.', 'wtest-bp'),
    f('Reading the results', 'If the pH is not 7, the boiling point is not 100 °C or solid is left behind, the water is not pure.', 'any failed test means impure', 'Pure water passes all three checks. If solid is left behind, the pH is not about 7, or the boiling point is not 100 °C, then the sample is not pure. It may still be safe to drink, but it is not pure.', 'wtest-results'),
  ],
  'C54-11': [
    f('Why distil in the lab?', 'Distillation separates pure water from impurities, including dissolved solids, by boiling and condensing it.', 'boil, then condense', 'Water can be purified by distillation. The water is boiled and the steam is condensed in a different container. This separates it from impurities, including dissolved solids.', 'wtest-why'),
    f('Boil the sample', 'The impure water goes in a round-bottomed flask and is heated until it boils and becomes steam.', 'flask on the heat', 'A sample of impure water is put in a round-bottomed flask. It is heated, for example with a Bunsen burner, until the water boils and becomes steam. The dissolved solids stay in the flask.', 'wtest-flask'),
    f('Cool the steam', 'The flask is joined to a condenser cooled by cold water. The steam cools and turns back into liquid water.', 'cold water outside the tube', 'The flask is connected to a condenser. This is a tube cooled on the outside by cold water. The cold water goes in at the bottom and out at the top. As steam passes through, it cools and condenses back into water.', 'wtest-condenser'),
    f('Collect the pure water', 'The pure water drips out of the condenser and is collected in a beaker.', 'catch what comes out', 'The pure water drips out of the end of the condenser. It is collected in a beaker or another container. This is why you never boil all the water away in an open container if you want to keep the pure water. It escapes as steam.', 'wtest-collect'),
    f('The whole set-up', 'Flask and heat, condenser with cold water, and a beaker: the pure water is collected as it condenses.', 'follow the water through', 'Follow the water through the apparatus. It is heated in the flask, cooled in the condenser and collected in the beaker. The dissolved solids are left behind in the flask.', 'wtest-setup'),
  ],
}
