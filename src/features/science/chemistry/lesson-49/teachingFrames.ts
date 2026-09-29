import type { TeachingFrame } from '../../teachingFrame'

// Natural resources and what replaces them, renewable versus finite, then reading a table of formation times.
// Standard form is met only as "10⁶ means 1 000 000"; no calculation with powers of ten.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const resourceFrames: Record<string, TeachingFrame[]> = {
  'C49-02': [
    f('Natural resources', 'A natural resource is anything that comes from the Earth, the sea or the air.', 'from earth, sea or air', 'People use many things from the world around them. A natural resource is anything that comes from the Earth, the sea or the air. Water, wood, cotton and oil are all natural resources.', 'resource-natural'),
    f('What we use them for', 'We use natural resources for warmth, shelter, clothing, food and fuel.', 'each resource has a job', 'Humans use natural resources to get what they need. Cotton is made into clothes. Wood is used to build shelters. Oil is burned as a fuel for heating and transport.', 'resource-use'),
    f('Replacing natural products', 'Some natural products can be replaced or improved by man-made ones, such as polymers replacing rubber.', 'natural product, man-made copy', 'Rubber is a natural product from the sap of trees. Chemists can now make polymers that replace some natural rubber, for example in tyres. Wool from sheep can be replaced by man-made fibres, called synthetic fibres.', 'resource-replace'),
    f('Farming helps too', 'Agriculture (farming) increases our supply of natural resources, and fertilisers help crops grow in a given area.', 'farming boosts the supply', 'Agriculture means farming. Farmers grow crops and animals that give us food, timber, clothing and fuel. Fertilisers add chemicals that plants need. They let farmers grow more crop on the same amount of land.', 'resource-agri'),
  ],
  'C49-05': [
    f('Renewable resources', 'Renewable resources can be remade at least as fast as we use them, so they can be replaced fairly quickly.', 'replaced as fast as used', 'A renewable resource can be remade at least as fast as we use it. That means it can be replaced fairly quickly. Timber is renewable, because trees can be planted after a harvest and regrow in a few years.', 'resource-renewable'),
    f('Finite resources', 'Finite resources are remade slowly or not at all, so they are used up faster than they form and will eventually run out.', 'used faster than made', 'A finite resource is remade very slowly, or not at all. We use it up faster than it forms, so it will eventually run out. Fossil fuels, nuclear fuels, metals and minerals are finite. Finite is another way of saying non-renewable.', 'resource-finite'),
    f('Processing finite resources', 'Finite resources can be processed into useful products, such as petrol from crude oil and pure metals from ores.', 'raw material in, useful product out', 'We can process finite resources into the fuels and materials that modern life needs. Crude oil is separated by fractional distillation to make products such as petrol. Metal ores are reduced to give pure metals.', 'resource-process'),
    f('Sorting examples', 'Water, food and timber are renewable. Fossil fuels, nuclear fuels, metals and minerals are finite.', 'sort the examples', 'Put the examples into the right box. Water, food and timber are renewable. Fossil fuels, nuclear fuels, metals and minerals are finite. Renewable does not mean it can never be used up, only that it can be replaced quickly.', 'resource-sorted'),
  ],
  'C49-08': [
    f('A table of forming times', 'Tables can show how long different resources take to form. A very long time means a finite resource.', 'long time to form = finite', 'You may be given a table showing how long resources take to form. Read the time column carefully. Resources that form in days, months or a few years are renewable. Resources that take a huge time are finite.', 'resource-table-setup'),
    f('Reading 10⁶', 'In standard form, 10⁶ means 1 000 000, so 10⁶ years is one million years.', '10⁶ = 1 000 000', 'Very large numbers are often written in a short way, called standard form. The number 10⁶ means 1 000 000. So 10⁶ years is one million years. You only need to read it as a very big number.', 'resource-table-std'),
    f('Working out the finite one', 'Compare the times. The resource that takes by far the longest to form is the finite one.', 'find the biggest time', 'Suppose three resources take 60 days, 25 years and 10⁷ years to form. The last time is far longer than the others. That resource forms much too slowly to replace, so it is finite. The other two are renewable.', 'resource-table-answer'),
  ],
}
