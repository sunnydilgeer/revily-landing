import type { TeachingFrame } from '../teachingFrame'

// One story: saliva breaking down starch in bread, carried into required practical 4.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const enzymeFrames: Record<string, TeachingFrame[]> = {
  'B8-02': [
    f('Chew some bread', 'Bread slowly tastes sweeter as you chew it.', 'starch → sugar', 'Bread is mostly starch. Starch is a large molecule that does not taste sweet. As you chew, saliva breaks some starch into sugars. So the bread starts to taste sweet. You met saliva and the mouth when you learned about organ systems.', 'digestive-upper'),
    f('Something in saliva does it', 'A protein in saliva speeds up the breakdown of starch.', 'speeds it up', 'On its own, starch breaks down far too slowly to help you. Saliva contains a protein that speeds this reaction up. A protein that speeds up a reaction in a living thing is called an enzyme. The enzyme in saliva is amylase.', 'digestion-amylase'),
    f('Not used up', 'The enzyme is not used up, so it can work again.', 'unchanged → used again', 'After the reaction, amylase is unchanged. So it can break down more starch, again and again. Something that speeds up a reaction without being used up is called a catalyst. So an enzyme is a biological catalyst.', 'enzyme-cycle'),
    f('Put it together', 'The substance an enzyme acts on is called its substrate.', 'substrate → products', 'In your mouth, amylase acts on starch. The substance an enzyme acts on is called its substrate. The substrate is changed into new substances, called products. Here the products are sugars, and amylase is ready to work again.', 'enzyme-catalyst'),
  ],
  'B8-04': [
    f('A pocket with a shape', 'Part of each enzyme is a pocket with a special shape.', 'pocket + matching shape', 'Part of every enzyme has a special shape, like a pocket. The substrate fits into this pocket, and the reaction happens there. This pocket is called the active site.', 'enzyme-fit'),
    f('Only the right shape fits', 'Only a substrate with the matching shape fits the active site.', 'shape → fit → one job', 'A molecule with a different shape does not fit the active site. So each enzyme usually works on only one substrate. Amylase fits starch, but not protein or fat. This idea is called the lock-and-key model.', 'enzyme-specific'),
    f('A simple model', 'The lock-and-key model is simplified.', 'useful, but not the whole story', 'The lock-and-key model is simplified. A real lock is hard and rigid. Real enzymes are flexible molecules, not rigid locks. The model is still useful, because it shows why shape matters.', 'enzyme-match'),
    f('Put it together', 'Substrate in, products out, active site free again.', 'fit → react → leave', 'Starch fits the active site of amylase and is broken into sugars. The sugars leave, so the active site is free again. Other enzymes have active sites that fit proteins or fats. In the next lesson you will learn which enzymes digest which foods.', 'enzyme-products'),
  ],
  'B8-06': [
    f('In the cold', 'Enzymes work slowly in the cold.', 'slow particles → fewer meetings', 'In the cold, enzyme and substrate particles move slowly. They meet less often, so the reaction is slow. The enzyme is not damaged by the cold.', 'enzyme-temperature'),
    f('Warmer', 'Warming speeds the reaction up, until it reaches its fastest.', 'warmer → faster, up to a peak', 'As it gets warmer, particles move faster and meet more often. So the reaction speeds up, until it reaches its fastest. The temperature where an enzyme works fastest is called its optimum temperature.', 'enzyme-temperature'),
    f('Too hot', 'Too much heat changes the shape of the active site.', 'shape changes → no fit', 'Above the optimum, heat breaks bonds that hold the enzyme in shape. The active site changes shape, so the substrate no longer fits. The enzyme is then called denatured. The reaction slows quickly and stops.', 'enzyme-temperature'),
    f('Each enzyme has a best pH', 'pH also changes how fast an enzyme works.', 'pH = how acidic or alkaline', 'pH tells you how acidic or alkaline a solution is. Each enzyme works fastest at one pH. This is called its optimum pH. Different enzymes have different optimum pH values.', 'enzyme-ph'),
    f('Put it together', 'Far from the optimum pH, the active site changes shape too.', 'wrong pH → shape changes → slower', 'When the pH is far from the optimum, the active site changes shape too. The substrate fits less well, so the reaction slows. The enzyme can be denatured. So too much heat and the wrong pH both work by changing the active site.', 'enzyme-ph'),
  ],
  'B8-09': [
    f('Test it in the lab', 'Mix amylase with starch, just like saliva on bread.', 'same reaction, in a test tube', 'In required practical 4, you mix amylase with starch in test tubes. It is the same reaction as saliva on bread. You test how pH affects how fast it happens. This lesson prepares you for required practical 4. It does not replace doing it.', 'enzyme-practical-setup'),
    f('The thing you change', 'You change the pH on purpose.', 'change one thing', 'A buffer solution keeps a mixture at a set pH. You use a different buffer in each tube, so each tube has a different pH. The one thing you change on purpose is called the independent variable. Here, it is pH.', 'enzyme-practical-setup'),
    f('Checking for starch', 'Iodine shows whether starch is still there.', 'blue-black → starch left', 'Put drops of iodine in a spotting tile. Every 30 seconds, transfer a fresh drop of the mixture into the next iodine drop. Blue-black means starch is still there. Brown-orange means no starch is found. You will learn this and other food tests fully when you learn about digestion.', 'enzyme-practical-tile'),
    f('The thing you measure', 'You measure the time until the starch is gone.', 'measure one thing', 'Record the time of the first drop that stays brown-orange. This shows the starch has all been broken down. The thing you measure is called the dependent variable. Here, it is the time taken.', 'enzyme-practical-endpoint'),
    f('Keep everything else the same', 'Other things that affect enzymes must stay the same.', 'same temperature, volumes and amounts', 'Temperature also affects enzymes, so keep every tube in the same water bath. Use the same volumes and concentrations of amylase and starch. Things you keep the same are called control variables. The real investigation needs teacher supervision and a risk assessment.', 'enzyme-practical-bath'),
    f('Repeat and take a mean', 'Repeats and a mean make the results more trustworthy.', 'repeat → mean → less effect of chance', 'A result can be a little off by chance, for example if you start the clock late. This is called random variation. So repeat each pH at least three times. Add the times and divide by how many there are to get the mean. A mean reduces the effect of random variation.', 'enzyme-practical'),
  ],
  'B8-13': [
    f('Read the times', 'A shorter time means a faster reaction.', 'short time → fast', 'The table shows the time for the starch to disappear at each pH. A shorter time means the starch was broken down faster. So the shortest time shows the fastest reaction.', 'enzyme-results'),
    f('Spot the pattern', 'The fastest tested pH is closest to the optimum.', 'fastest → near the peak', 'Here, the time falls from pH 3 to pH 7, then rises again at pH 9. So pH 7 was the fastest of the pH values tested. The real optimum could be a little either side. Testing more pH values near the peak would give a better estimate.', 'enzyme-results'),
    f('Turn time into a rate', 'A rule such as rate = 1000 ÷ time turns a time into a speed.', 'shorter time → bigger rate', 'Rate means how fast something happens. A question may give you the rule rate = 1000 ÷ time. If the starch is gone in 125 seconds, the rate is 1000 ÷ 125 = 8. So a shorter time gives a bigger rate.', 'enzyme-rate'),
  ],
}
