import type { TeachingFrame } from '../teachingFrame'

// What biodiversity is and why it matters first, then why it is falling: more people, more resources, more waste and pollution.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const biodiversityFrames: Record<string, TeachingFrame[]> = {
  'B51-02': [
    f('Many kinds of living thing', 'Biodiversity is the variety of species.', 'more species → higher biodiversity', 'This small wood has nine different species living in it. The variety of different species on Earth, or in one ecosystem, is called biodiversity. An ecosystem with many species has high biodiversity.', 'earth-bio-variety'),
    f('Depending on each other', 'Species depend on each other for food and shelter.', 'many species → many links', 'Species in an ecosystem depend on each other for things like food and shelter. When there are lots of species, each one has many others to depend on, not just a few. The fox eats both rabbits and mice.', 'earth-bio-links'),
    f('Keeping conditions right', 'Species help keep the conditions right for each other.', 'living things help their surroundings', 'Different species also help keep the conditions in their environment right for each other. The oak tree gives shelter to other species. Microorganisms in the soil recycle mineral ions, which keeps the soil right for plants.', 'earth-bio-conditions'),
    f('A stable ecosystem', 'High biodiversity helps an ecosystem stay stable.', 'one species lost → the others carry on', 'Suppose the rabbits disappear from the wood. The fox can still eat mice, so it survives. Because each species has many others to depend on, the ecosystem does not change much. We say it is stable.', 'earth-bio-stable'),
  ],
  'B51-05': [
    f('More people', 'The number of people in the world is growing quickly.', 'more people → more needs', 'The number of people in the world is increasing quickly. More people need more food, water, materials and energy to survive. The things people use like this are called resources.', 'earth-people-more'),
    f('Wanting more', 'Many people also want more things.', 'more things each → even more resources', 'Many people also want things that make life more comfortable, such as cars and computers. This is called a higher standard of living. So each person uses more resources too.', 'earth-people-living'),
    f('Used up faster', 'Resources are used faster than they are replaced.', 'used quickly, replaced slowly', 'Making things takes raw materials, such as rock from quarries, and energy from power stations. We are now using many resources more quickly than they are being replaced.', 'earth-people-resources'),
    f('Less room for other species', 'Many human activities reduce biodiversity.', 'more for us → less for other species', 'Many human activities reduce biodiversity, for example by taking the land that other species live on. But humans depend on a good level of biodiversity to survive. People have only recently started taking action to stop biodiversity falling.', 'earth-people-biodiversity'),
  ],
  'B51-08': [
    f('More waste', 'Making and using more things makes more waste.', 'more things made → more waste', 'As more things are made and used, more waste is produced. Some waste contains toxic chemicals, which are poisonous. If waste is not handled properly, it harms the environment. This is called pollution.', 'earth-pollution-waste'),
    f('In water', 'Sewage, fertiliser and toxic chemicals can pollute water.', 'rivers, lakes and seas', 'Sewage is waste water from toilets and drains. Sewage and toxic chemicals from industry can pollute lakes, rivers and seas. Rain can also wash fertilisers from fields into the water. This harms the plants and animals that rely on that water.', 'earth-pollution-water'),
    f('On land', 'Landfill and toxic chemicals can pollute land.', 'buried rubbish and farm sprays', 'Lots of household waste is dumped in big holes in the ground, called landfill sites. Toxic chemicals used on farms can also pollute the land. These include pesticides, which kill insects, and herbicides, which kill weeds.', 'earth-pollution-land'),
    f('In the air', 'Smoke and acidic gases can pollute the air.', 'chimneys → air', 'Factory chimneys can release smoke and acidic gases into the air. This is air pollution.', 'earth-pollution-air'),
    f('Biodiversity falls', 'Pollution kills plants and animals.', 'pollution → fewer species', 'Pollution in water, on land or in the air can kill plants and animals, such as the fish in a polluted river. When species are lost from an area, its biodiversity is reduced.', 'earth-pollution-all'),
  ],
}
