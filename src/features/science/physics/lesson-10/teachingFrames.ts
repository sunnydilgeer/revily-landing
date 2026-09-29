import type { TeachingFrame } from '../../teachingFrame'

// Overview lesson: what resources are used for, which run out, and how they serve transport and heating.
// The detailed pros and cons of individual resources are taught in the later resource lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const energyResourceFrames: Record<string, TeachingFrame[]> = {
  'P10-02': [
    f('What we use them for', 'Energy resources are mostly used to generate electricity, for transport and for heating.', 'electricity, transport, heating', 'An energy resource is something we can use to get energy for our needs. We use them in three main ways. We use them to generate electricity. We use them for transport, such as cars and trains. And we use them for heating.', 'eres-uses'),
    f('Non-renewable resources', 'Fossil fuels (coal, oil and natural gas) and nuclear fuel will run out one day.', 'used up, not replaced', 'Non-renewable resources will run out one day. They are used faster than they can be replaced. The non-renewable resources are the fossil fuels and nuclear fuel. The three main fossil fuels are coal, oil and natural gas.', 'eres-nonrenew'),
    f('Renewable resources', 'Renewable resources can be replaced as we use them, so they never run out.', 'always replaced', 'Renewable resources never run out, because they can be replaced as they are used. There are seven to know. They are the Sun (solar), wind, water waves, hydro-electricity, bio-fuel, tides and geothermal.', 'eres-renew'),
    f('Good and bad points', 'Non-renewable resources are reliable but run out and damage the environment. Renewable ones never run out, but some are unreliable.', 'reliable, running out, damage', 'Fossil fuels and nuclear fuel are reliable sources of energy. But they will run out and can damage the environment. Renewable resources never run out and are usually less harmful. But most still cause some damage, and some are unreliable because they depend on the weather.', 'eres-compare'),
  ],
  'P10-05': [
    f('Fuels for vehicles', 'Petrol and diesel are made from oil, so most cars use a fossil fuel.', 'oil → petrol and diesel', 'Petrol and diesel are the fuels used by most cars. They are made from oil, which is a non-renewable fossil fuel. When they are burnt in the engine, energy is transferred to make the vehicle move.', 'eres-fuels'),
    f('Bio-fuels', 'Some vehicles run on a mix of bio-fuel and petrol or diesel. Some run on pure bio-fuel.', 'renewable fuel', 'Bio-fuel is a renewable fuel made from plants or waste. Many vehicles can run on a mix of bio-fuel and petrol or diesel. Some can run on pure bio-fuel. This uses less fossil fuel.', 'eres-biofuel'),
    f('Electric vehicles', 'Electricity can power trains and some cars. It can be generated using renewable or non-renewable resources.', 'where does the electricity come from', 'Electricity can power vehicles such as trains and some cars. The electricity has to be generated first. It can be generated using either renewable or non-renewable resources. So an electric vehicle is only as green as the resource that made its electricity.', 'eres-electric'),
  ],
  'P10-08': [
    f('Burning for heat', 'Natural gas is burnt in a boiler to heat water, which is pumped to radiators.', 'gas → hot water → radiators', 'Natural gas is the most widely used fuel for heating homes in the UK. It is burnt in a boiler to heat water. The hot water is then pumped around the house to radiators. Coal and bio-fuel can also be burnt to heat a building.', 'eres-boiler'),
    f('Heat from the ground', 'A geothermal heat pump uses energy from hot rocks under the ground to heat a building.', 'hot rocks below', 'Deep under the ground the rocks are hot. A geothermal heat pump uses energy from the hot rocks to heat a building. No fuel has to be burnt. Geothermal energy is a renewable resource.', 'eres-geothermal'),
    f('Heat from the Sun', 'A solar water heater uses the Sun to heat water, which is pumped to radiators.', 'sunlight → hot water', 'A solar water heater uses the Sun to heat water. The hot water is pumped through radiators in the building. Again, no fuel is burnt, and sunlight is a renewable resource.', 'eres-solar-heater'),
    f('Electric heating', 'Electric heaters use electricity, which can be generated from renewable or non-renewable resources.', 'electricity again', 'Electric heaters need electricity. As with vehicles, the electricity can be generated using renewable or non-renewable resources. So the heater itself does not tell you which type of resource was used.', 'eres-electric-heat'),
  ],
}
