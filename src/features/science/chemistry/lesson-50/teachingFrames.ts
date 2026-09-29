import type { TeachingFrame } from '../../teachingFrame'

// Sustainable development, why recycling metals and glass helps, and how each is done.
// The blast furnace gets one clause only; it is taught in the metal extraction lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const recycleFrames: Record<string, TeachingFrame[]> = {
  'C50-02': [
    f('Thinking about the future', 'Sustainable development meets the needs of people today without harming the lives of people in the future.', 'today without harming tomorrow', 'Sustainable development means meeting the needs of people today. It must do this without damaging the lives of people in the future. So we have to think ahead when we choose and use resources.', 'recycle-sustain'),
    f('Why using resources can be unsustainable', 'Some raw materials are finite, extraction uses energy and makes waste, and processing uses energy from finite fuels.', 'finite, energy, waste', 'Some raw materials are finite, such as those used to make metals, building materials and many plastics. Extracting them uses lots of energy and makes waste. Processing them into glass or bricks also uses energy from finite fuels.', 'recycle-unsustain'),
    f('Use less', 'One way to be more sustainable is to use fewer finite resources, which also cuts the energy needed to make products.', 'less used, less needed', 'One way to be more sustainable is to use less of a finite resource. That saves the resource. It also reduces everything needed to produce it, such as energy.', 'recycle-less'),
    f('Reuse and recycle', 'Reusing and recycling materials cuts the use of finite resources. We cannot stop using them completely.', 'use again, or process again', 'We can use less by reusing things and by recycling them. In recycling, waste is processed so that it can make new products. We cannot stop using finite resources altogether. Scientists develop processes that use less of them and cause less damage.', 'recycle-loop'),
  ],
  'C50-05': [
    f('Metals cost energy', 'Mining and extracting metals takes lots of energy, most of it from burning fossil fuels.', 'mining and extracting use energy', 'Getting a new metal out of the ground takes a lot of energy. The metal must be mined and then extracted from its ore. Most of this energy comes from burning fossil fuels.', 'recycle-metal-energy'),
    f('Three reasons to recycle metals', 'Recycling often uses much less energy, saves the limited supply of the metal and cuts waste sent to landfill.', 'energy, supply, landfill', 'It is usually better to recycle used metals than to make new ones. It often uses much less energy than making a new metal. It saves some of the limited amount of each metal in the Earth. It also cuts the waste sent to landfill.', 'recycle-metal-benefits'),
    f('How metals are recycled', 'Metals are separated, melted down and recast into the shape of a new product.', 'separate, melt, recast', 'Metals are recycled in steps. First they are separated from other waste. Then they are melted down. Finally the molten metal is moulded, which is called recasting, into the shape of a new product.', 'recycle-metal-steps'),
    f('Not always fully separated', 'How much separation is needed depends on the final product. Waste steel and iron can be kept together.', 'depends on what is being made', 'Sometimes different metals do not need to be completely separated. How much separation is needed depends on what the final product will be. Waste steel and iron can stay together, because both can be added to iron in a blast furnace. That means less iron ore is needed.', 'recycle-metal-mixed'),
  ],
  'C50-08': [
    f('Why reuse and recycle glass', 'Reusing or recycling glass reduces the energy used to make new glass and the amount of glass thrown away.', 'less energy, less waste', 'Reusing or recycling glass helps sustainability. It reduces the energy used for making new glass. It also means less glass is thrown away, so less waste is produced.', 'recycle-glass-benefits'),
    f('Reusing glass bottles', 'Glass bottles can often be reused without being reshaped.', 'same bottle, used again', 'Many glass bottles can be reused without changing their shape. They are collected, washed and filled again. This is reuse, and it needs very little energy.', 'recycle-glass-reuse'),
    f('Recycling glass', 'Glass that cannot be reused is crushed and melted, then reshaped into new glass products such as jars.', 'crush, melt, reshape', 'Some glass products cannot be reused, so they are recycled for a different use. The glass is crushed and melted. It is then reshaped to make other glass products, such as jars.', 'recycle-glass-recycle'),
  ],
}
