import type { TeachingFrame } from '../teachingFrame'

// One school field with a big tree: how clover is spread (quadrats placed at random), what the counts tell you
// (mean, median, mode), how many plants the whole field holds, then how things change along a line from a hedge.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const samplingFrames: Record<string, TeachingFrame[]> = {
  'B49-02': [
    f('Distribution', 'Distribution is how organisms are spread across an area.', 'where they are, and how many', 'Clover grows thickly in the sunny part of this field, but hardly at all in the shade of the tree. How an organism is spread across an area is called its distribution. This is a required practical: here you learn the method and how to handle the data.', 'eco-quad-distribution'),
    f('Quadrats', 'A quadrat is a square frame for counting organisms.', 'square frame, fixed area', 'There are far too many clover plants to count them all. Instead, you count the plants inside a square frame placed on the ground. The frame is called a quadrat. A common size is 50 cm by 50 cm, which has an area of 0.25 m².', 'eco-quad-frame'),
    f('At random', 'Each quadrat is placed at random.', 'random coordinates → no bias', 'If you chose where to put the quadrat, you might pick the best patches. So lay two tape measures along the edges of the area. Then use random numbers as coordinates for each quadrat. This is called random sampling.', 'eco-quad-random'),
    f('Count and repeat', 'Count what is inside, then repeat many times.', 'more quadrats → better picture', 'Count the clover plants inside the quadrat. Then place it at another random spot and count again. Repeat as many times as you can, because more quadrats give a better picture of the whole area. Wash your hands after touching soil and plants.', 'eco-quad-count'),
    f('Compare two areas', 'Sample two areas in the same way, then compare.', 'same quadrat, same number → fair', 'To compare the sunny area with the shady area, sample both in the same way. Use the same size of quadrat and the same number of quadrats. Then compare the average number of clover plants per quadrat in each area.', 'eco-quad-compare'),
  ],
  'B49-05': [
    f('The mean', 'Add up the counts, then divide by how many there are.', 'total ÷ number of quadrats', 'These are clover counts from 7 quadrats in the sunny area. To find the mean, add up the counts and divide by the number of quadrats. The total is 63, and 63 ÷ 7 = 9 clover plants per quadrat.', 'eco-mean-mean'),
    f('The median', 'The median is the middle value.', 'put in order → take the middle', 'Put the counts in order, from smallest to largest: 5, 6, 6, 8, 10, 12, 16. The middle value is called the median. There are 7 counts, so the median is the 4th one: 8.', 'eco-mean-median'),
    f('The mode', 'The mode is the value that appears most often.', 'most common value', 'Now look for the count that appears most often. It is called the mode. The count 6 appears twice, and every other count appears once. So the mode is 6.', 'eco-mean-mode'),
  ],
  'B49-09': [
    f('Scale up', 'Use your sample to estimate the whole population.', 'sample → whole field', 'You cannot count every clover plant in a whole field. But you can use your quadrat results to estimate the total. This estimate is the population size, sometimes called the abundance.', 'eco-estimate-idea'),
    f('How many quadrats fit?', 'Divide the area of the field by the area of one quadrat.', 'field area ÷ quadrat area', 'First, work out how many quadrats would fit in the field. Divide the area of the field by the area of one quadrat. This field is 600 m², so 600 ÷ 0.25 = 2400 quadrats.', 'eco-estimate-fit'),
    f('Multiply by the mean', 'Then multiply by the mean number per quadrat.', 'number of quadrats × mean', 'Next, multiply by the mean number of plants per quadrat. The mean here was 8, so 2400 × 8 = 19 200 clover plants. This is an estimate, not an exact count.', 'eco-estimate-multiply'),
  ],
  'B49-12': [
    f('Transects', 'A transect is a line marked across an area.', 'a line from A to B', 'Some organisms change as you move across an area, for example from a hedge into a field. To study this, you mark out a straight line with a tape measure. The line is called a transect.', 'eco-transect-line'),
    f('Counting along the line', 'Count the organisms that touch the line.', 'touching the tape', 'One way to collect data is to count the organisms that touch the line. Record how many touch it in each part, such as every 2 metres.', 'eco-transect-touch'),
    f('Quadrats along the line', 'Place quadrats at regular intervals along the line.', 'every 2 m, count inside', 'Another way is to place quadrats along the line at regular intervals, such as every 2 metres. Count the organisms in each quadrat. This shows how their number changes as you move away from the hedge.', 'eco-transect-quadrats'),
    f('Percentage cover', 'Estimate how much of the quadrat is covered.', 'squares more than half covered', 'Some organisms, such as moss or grass, are hard to count one by one. Instead, you estimate the percentage of the quadrat they cover. This is called percentage cover. Count the small squares that are more than half covered.', 'eco-cover-grid'),
    f('Working it out', 'Divide by the total number of squares, then multiply by 100.', 'covered ÷ total × 100', 'This quadrat has 100 small squares, and 38 of them are more than half covered by moss. Divide by the total number of squares, then multiply by 100. So 38 ÷ 100 × 100 = 38%.', 'eco-cover-count'),
  ],
}
