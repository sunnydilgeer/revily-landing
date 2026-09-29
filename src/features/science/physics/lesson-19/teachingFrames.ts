import type { TeachingFrame } from '../../teachingFrame'

// LDR (dark = highest resistance), thermistor (cold = greater resistance), then a fan sensing circuit explained qualitatively with the shared-pd idea.
// No calculations here; the share rule is taught as "bigger resistance, bigger share".
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const sensorFrames: Record<string, TeachingFrame[]> = {
  'P19-02': [
    f('A light dependent resistor', 'An LDR is a resistor whose resistance changes with the intensity of light. LDR stands for light dependent resistor.', 'resistance depends on light', 'For some components, the resistance depends on things around them. An LDR is a resistor whose resistance changes with the intensity of light. LDR stands for light dependent resistor. Its circuit symbol is a resistor in a circle with two arrows pointing at it.', 'sensor-ldr'),
    f('Dark and bright', 'In darkness an LDR has its highest resistance. In bright light its resistance falls.', 'dark: high, bright: low', 'In darkness, the resistance of an LDR is highest. As the light gets brighter, the resistance falls. The graph shows resistance dropping quickly at first and then levelling off in bright light.', 'sensor-ldr-graph'),
    f('Uses of LDRs', 'LDRs are used in automatic night lights, outdoor lighting and burglar detectors.', 'circuits that react to light', 'LDRs have lots of uses. An automatic night light uses one to switch on when the room goes dark. Outdoor lights use them to come on at dusk. A burglar detector can use one to notice a change in light.', 'sensor-ldr-uses'),
  ],
  'P19-05': [
    f('A thermistor', 'A thermistor is a temperature-dependent resistor. Its resistance changes with temperature.', 'resistance depends on temperature', 'A thermistor is a temperature-dependent resistor. Its resistance changes when its temperature changes. Its circuit symbol is a resistor with a bent line through it.', 'sensor-thermistor'),
    f('Cold and hot', 'In cool conditions a thermistor has a greater resistance. In hot conditions its resistance drops.', 'cold: high, hot: low', 'In cooler conditions, the resistance of a thermistor is greater. In hot conditions, the resistance drops. The graph slopes downwards from cold to hot, in the same way as the LDR graph did for light.', 'sensor-thermistor-graph'),
    f('Thermostats', 'Thermistors make useful temperature detectors, such as electronic thermostats.', 'a thermostat controls heating', 'Thermistors make useful temperature detectors, for example in electronic thermostats. A thermostat turns the heating on when the room is cool. It turns the heating off when the room is warm.', 'sensor-thermostat'),
  ],
  'P19-08': [
    f('What is a sensing circuit?', 'A sensing circuit turns a component on, or increases its power, depending on the conditions, such as the temperature.', 'the conditions control a component', 'A sensing circuit can switch a component on, or increase the power to it, depending on the conditions. Here is one that controls a fan in a hot room. It uses a thermistor to sense the temperature.', 'sensor-what'),
    f('The circuit', 'The thermistor is in series with a fixed resistor. The fan is connected across the fixed resistor. The supply pd is shared out.', 'who shares the supply pd', 'The thermistor is in series with a fixed resistor. The fan is connected across the fixed resistor. The pd of the power supply is shared between the thermistor and the fixed resistor and fan together.', 'sensor-circuit'),
    f('Bigger resistance, bigger share', 'The larger a component’s resistance, the more of the pd it takes. The fan always has the same pd as the fixed resistor.', 'bigger resistance takes more pd', 'How much pd each part gets depends on their resistances. The larger a component’s resistance, the more of the pd it takes. The fan is connected across the fixed resistor, so the pd across the fan is always equal to the pd across the fixed resistor.', 'sensor-share'),
    f('The room gets hotter', 'The thermistor’s resistance decreases, so it takes a smaller share of the pd. The pd across the fixed resistor and fan rises.', 'thermistor takes less', 'Now the room gets hotter. The thermistor’s resistance decreases. So the thermistor takes a smaller share of the pd from the power supply. That leaves more pd for the fixed resistor and the fan, so the pd across them rises.', 'sensor-hot'),
    f('The fan goes faster', 'The greater the pd across the fan, the more energy it gets, so the fan goes faster in a hotter room.', 'more pd, more energy, faster fan', 'The greater the pd across a component, the more energy it gets. So the fan gets more energy and goes faster. That is what we want: the hotter the room, the faster the fan.', 'sensor-fan'),
  ],
}
