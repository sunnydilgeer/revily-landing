import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: heating substances safely. Examples come from Chemistry, Biology and Physics.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsHeatFrames: Record<string, TeachingFrame[]> = {
  'W19-02': [
    f('Set up the burner', 'Connect the burner to the gas tap with the hole closed. Stand it on a heat-proof mat.', 'closed hole, mat underneath', 'A Bunsen burner heats things quickly, and you can easily adjust it. Connect it to the gas tap and check that the air hole is closed. Stand it on a heat-proof mat.', 'wsheat-setup'),
    f('Light it safely', 'Light a splint, hold it over the burner, then turn on the gas. The flame should be yellow.', 'flame first, then gas', 'Light a splint and hold it over the top of the burner. Now turn on the gas. The burner lights with a yellow flame. Lighting the splint first means the gas never builds up unlit.', 'wsheat-light'),
    f('Open the hole for more heat', 'Opening the hole makes the flame blue and hotter. The more open the hole, the hotter the flame.', 'more air, more heat', 'Open the air hole to the amount you want. The flame turns blue. The more open the hole is, the hotter the flame becomes. Heat things just above the tip of the blue cone, which is the hottest part.', 'wsheat-blue'),
    f('Close the hole when you stop', 'When the burner is not heating anything, close the hole. The flame turns yellow and is easy to see.', 'yellow means visible', 'When the burner is not heating anything, close the hole. The flame turns yellow. A yellow flame is cooler, and it is easy to see, so no one walks into it by accident.', 'wsheat-yellow'),
  ],
  'W19-05': [
    f('Tongs for a small tube', 'To heat a container in the flame, hold it near the top with tongs.', 'not your fingers', 'To heat a small container in the flame, hold it near the top with a pair of tongs. This keeps your fingers away from the heat. Never hold hot glassware with your bare hands.', 'wsheat-tongs'),
    f('Tripod and gauze for a bigger container', 'To heat a container over the flame, put the tripod and gauze in place first, then light the burner.', 'set up before you light', 'To heat a beaker over the flame, stand a tripod over the burner and put a gauze on top. Do this before you light the burner. Then place the beaker on the gauze.', 'wsheat-tripod'),
    f('Do not heat flammables in a flame', 'Never heat a flammable substance with a Bunsen burner. The flame could set it on fire.', 'flame plus flammable equals fire', 'A flammable substance, such as ethanol, catches fire easily. Never heat it with a Bunsen burner, because the flame could set it alight. Use a water bath or an electric heater instead.', 'wsheat-flammable'),
  ],
  'W19-08': [
    f('A water bath', 'A water bath is a container of water that can be set to a chosen temperature. It heats the substance evenly.', 'water all round', 'A water bath is a container filled with water. It can be heated to a set temperature. The substance in your container is surrounded by water, so it is heated very evenly.', 'wsheat-bath'),
    f('Using a water bath', 'Set the temperature, let the water heat up, and lower the container in with tongs. Keep the water level just above the substance.', 'set, wait, lower in', 'First set the temperature and let the water heat up. Then lower your container in with tongs. The water outside should be just above the level of the substance inside. The substance warms to the same temperature as the water.', 'wsheat-bathsteps'),
    f('An electric heater', 'An electric heater has a hot plate at a set temperature. Stir the substance so it heats evenly.', 'hotter, but stir', 'An electric heater has a metal plate that can be heated to a set temperature. Stand your container on top of the plate. It can reach higher temperatures than a water bath. You have to stir the substance, so it heats evenly.', 'wsheat-plate'),
    f('The 100 °C limit', 'A water bath cannot heat something above 100 °C. Use an electric heater for higher temperatures.', 'water boils at 100', 'Water boils at 100 °C, so a water bath cannot go higher than this. To heat something above 100 °C, use an electric heater. Handle heated glassware with tongs until you are sure it has cooled.', 'wsheat-limit'),
  ],
}
