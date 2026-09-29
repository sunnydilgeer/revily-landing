import type { TeachingFrame } from '../../teachingFrame'

// The greenhouse effect as a four-step picture, then human activities, then the evidence and how far to trust it, then the possible effects.
// Sensitive topic: calm and factual; effects are "may" and "could" as on the page. Carbon footprints and reducing emissions are the next lesson.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const greenhouseFrames: Record<string, TeachingFrame[]> = {
  'C46-02': [
    f('Gases that keep us warm', 'Carbon dioxide, methane and water vapour are greenhouse gases. They keep the Earth warm enough for life.', 'three greenhouse gases', 'Greenhouse gases include carbon dioxide, methane and water vapour. They keep the Earth warm enough to support life. Here is how they work.', 'ghg-gases'),
    f('Step 1: the Sun', 'The Sun gives out short wavelength radiation, which reaches the Earth.', 'Sun sends radiation to Earth', 'The Sun gives out radiation with a short wavelength. This radiation passes through the atmosphere and reaches the Earth.', 'ghg-step1'),
    f('Step 2: the Earth', 'The Earth absorbs it and gives it out again as long wavelength thermal (heat) radiation.', 'absorbed, then re-emitted as heat', 'The Earth absorbs this radiation. It then gives it out again as long wavelength radiation. This is thermal radiation, which means heat. Greenhouse gases in the atmosphere absorb it.', 'ghg-step2'),
    f('Step 3: all directions', 'Greenhouse gases give out the radiation again in all directions.', 'sent out every way', 'The greenhouse gases then give this radiation out again. They send it out in all directions, not just up towards space.', 'ghg-step3'),
    f('Step 4: warming', 'Some radiation heads back towards the Earth and warms the surface. This is the greenhouse effect.', 'some comes back down', 'Some of the radiation heads back towards the Earth. It warms up the surface. This is called the greenhouse effect. It keeps the Earth warmer than it would be without these gases.', 'ghg-step4'),
    f('All four steps', 'Sun radiation in, Earth heat out, greenhouse gases send some back, and the surface warms.', 'the whole loop', 'Put the four steps together. Radiation from the Sun warms the Earth. The Earth gives out heat radiation. Greenhouse gases send some of it back, which warms the surface.', 'ghg-effect'),
  ],
  'C46-05': [
    f('People add greenhouse gases', 'Some human activities increase the amount of greenhouse gases in the atmosphere.', 'four activities', 'Some human activities increase the amount of greenhouse gases in the atmosphere. Four examples are deforestation, burning fossil fuels, agriculture and creating waste.', 'ghg-human'),
    f('Deforestation', 'With fewer trees, less carbon dioxide is taken in for photosynthesis.', 'fewer trees, less carbon dioxide taken in', 'Deforestation means cutting down large areas of forest. With fewer trees, less carbon dioxide is taken in for photosynthesis. More carbon dioxide stays in the atmosphere.', 'ghg-deforest'),
    f('Burning fossil fuels', 'Burning fossil fuels releases carbon dioxide.', 'carbon dioxide from burning', 'Burning fossil fuels such as coal, oil and gas releases carbon dioxide. Fuels burned in power stations, vehicles and homes all add to it.', 'ghg-fossil'),
    f('Agriculture', 'More farm animals give out more methane when they digest food. Rice paddies also give out a lot of methane.', 'methane from farming', 'Farm animals give out methane when they digest their food. The more animals there are, the more methane there is. Growing rice in flooded fields, called rice paddies, also releases a lot of methane.', 'ghg-agri'),
    f('Creating waste', 'Waste in landfill sites and from farming releases carbon dioxide and methane as it breaks down.', 'rotting waste gives gases', 'More waste goes to landfill sites, and farming also creates waste. When this waste breaks down, it releases carbon dioxide and methane.', 'ghg-waste'),
  ],
  'C46-08': [
    f('Temperature is going up', 'The average temperature of the Earth has risen recently. Scientists agree extra carbon dioxide from human activity is the cause.', 'temperature up, linked to carbon dioxide', 'The average temperature of the Earth’s surface has gone up recently. Scientists agree this has been caused by extra carbon dioxide from human activity. They agree it is leading to climate change.', 'ghg-temp'),
    f('Checked evidence', 'Peer-reviewed evidence has been checked by other scientists, so it is reliable.', 'other scientists check the work', 'The evidence has been peer-reviewed. This means other scientists have checked it before it is published. That makes the information more reliable.', 'ghg-peer'),
    f('A complex climate', 'The Earth’s climate is very complex, so a model of it is easily oversimplified.', 'lots of factors to include', 'The Earth’s climate is very complex. This makes it hard to build a model that is not oversimplified. A model that leaves out important factors could give misleading predictions.', 'ghg-model'),
    f('Stories in the media', 'Some stories in the media give only some of the information or favour one view without good evidence. This is called bias.', 'check the evidence behind a story', 'People form their own theories and opinions, particularly in the media. Some stories are not based on good evidence. They may be biased, which means they favour one point of view. They may also give only some of the information.', 'ghg-media'),
  ],
  'C46-11': [
    f('Ice and sea level', 'Higher temperatures are melting ice in the Arctic and Antarctic, and sea levels are rising. This could cause more flooding on coasts.', 'melting ice, rising sea', 'Higher global temperatures are causing ice in the Arctic and Antarctic to melt. This makes sea levels rise. If sea levels keep rising, there will be more flooding in coastal areas.', 'ghg-ice'),
    f('Rain and storms', 'Rainfall is changing, so some places get too much water and others too little. Storms may become more frequent and more severe.', 'too much, too little, stronger storms', 'Changes in rainfall are causing some regions to get too much water and others too little. Storms may also become more frequent and more severe.', 'ghg-rain'),
    f('Food production', 'Changes in temperature and rainfall may affect how much food can be produced in certain places.', 'weather affects crops', 'Changes in temperature and rainfall may affect the production of food in certain places. Crops need the right conditions to grow.', 'ghg-food'),
  ],
}
