import type { TeachingFrame } from '../../teachingFrame'

// Where waste water comes from and why it is treated, then the sewage plant route (screening, sedimentation),
// then aerobic and anaerobic digestion, then trade-offs and toxic waste water. Desalination is recalled from the potable water lesson.
// Fine detail such as the chemistry of digestion is out of scope: the page only asks what happens at each stage.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const sewageFrames: Record<string, TeachingFrame[]> = {
  'C55-02': [
    f('Water from homes', 'Waste water from homes runs down the drain into sewers and on to a sewage treatment plant.', 'the drain leads to a treatment plant', 'Every time you wash up, flush a toilet or have a bath, you make waste water. It goes down the drain and into the sewers. The sewers carry it to a sewage treatment plant.', 'sewage-homes'),
    f('Farms and factories too', 'Waste water also comes from agriculture (farming) and from industrial processes.', 'homes, farms, factories', 'Homes are not the only source. Farms make waste water, and so do factories. Each source gives waste water that needs to be dealt with.', 'sewage-sources'),
    f('What is in it?', 'Waste water can hold organic matter (carbon compounds from the remains and waste of living things) and harmful microbes.', 'the pollutants to remove', 'Waste water carries pollutants. One is organic matter. This is made of carbon compounds that come from the remains and waste of living things. Another is harmful microbes, such as some bacteria and viruses.', 'sewage-pollutants'),
    f('Clean enough for rivers', 'Waste water is treated before it goes back into rivers and lakes, so it does not cause health problems.', 'treated before it goes back', 'The treated water is put back into fresh water sources, such as rivers and lakes. If the pollutants were left in, they could cause health problems. So waste water is treated first.', 'sewage-return'),
  ],
  'C55-05': [
    f('The route through the plant', 'A sewage treatment plant treats waste water in several stages. The first two remove solids.', 'four stages, one after another', 'A sewage treatment plant does not clean the water in one go. It uses four main stages, one after another. Follow the numbers in order. The first two stages take out solid material.', 'sewage-route'),
    f('Stage 1: screening', 'Screening removes large bits, such as twigs and plastic bags, and grit, which is small bits of stone and sand.', 'a screen catches the solid bits', 'In screening, the sewage passes through a screen. The screen catches large bits, such as twigs and plastic bags. It also removes grit. Grit is small bits of stone and sand.', 'sewage-screening'),
    f('Stage 2: sedimentation', 'In sedimentation the heavier solids sink to the bottom as sludge, and the lighter liquid floats on top.', 'heavy sinks, light floats', 'Next the sewage goes into a large tank and is left to settle. This is called sedimentation. The heavier solids sink to the bottom. They form a thick layer called sludge.', 'sewage-sediment'),
    f('Two streams leave the tank', 'The liquid waste floating on top is called effluent. It and the sludge are treated separately.', 'effluent one way, sludge the other', 'The lighter liquid waste floats on the top. It is called effluent. It is taken off and sent on for treatment. The sludge is taken from the bottom and treated in a different way.', 'sewage-split'),
  ],
  'C55-08': [
    f('Stage 3: aerobic digestion', 'The effluent is treated by aerobic digestion: bacteria with oxygen break down organic matter and other microbes.', 'aerobic means with oxygen', 'The effluent goes into a tank where air is bubbled through. Aerobic means with oxygen. Bacteria that use oxygen break down the organic matter in the water. This includes other harmful microbes.', 'sewage-aerobic'),
    f('Back to the environment', 'After aerobic digestion, the treated water is released into the environment.', 'the water leaves the plant', 'Once this stage is finished, the water has been treated. It is released into the environment, for example into a river.', 'sewage-released'),
    f('Stage 4: anaerobic digestion', 'The sludge is broken down by bacteria without oxygen in anaerobic digestion. This makes methane gas.', 'anaerobic means without oxygen', 'Now for the sludge. It goes into a large sealed tank. Bacteria break it down without oxygen. Anaerobic means without oxygen. This process makes a gas called methane.', 'sewage-anaerobic'),
    f('Two useful products', 'The methane gas can be used as an energy source, for example for cooking. The remaining waste can be used as fertiliser.', 'methane for energy, waste for fertiliser', 'Methane is a fuel, so it can be used as an energy source, for example for cooking. The waste that is left can be used as fertiliser, to help crops grow.', 'sewage-products'),
    f('Put it together', 'Screening, sedimentation, then effluent to aerobic digestion and sludge to anaerobic digestion.', 'follow the two streams', 'Here is the whole plant. Screening takes out big bits and grit. Sedimentation separates effluent from sludge. Bacteria treat the effluent with oxygen, and treat the sludge without oxygen.', 'sewage-whole'),
  ],
  'C55-11': [
    f('More stages, less energy', 'Treating waste water has more stages than treating fresh water, but it uses less energy than desalinating salt water.', 'compare with desalination', 'Treating sewage takes more stages than treating fresh water for drinking. But it uses less energy than desalination, which turns salt water into fresh water. This is an advantage.', 'sewage-compare'),
    f('Where fresh water is scarce', 'Because it uses less energy, treated waste water could be an option in areas where there is little fresh water. Some people dislike the idea.', 'an option, but not everyone likes it', 'So treating waste water could be an option in places with little fresh water. However, some people do not like the idea of drinking water that used to be sewage.', 'sewage-option'),
    f('Toxic substances', 'Waste water with toxic substances needs extra stages, such as adding chemicals, UV radiation or membranes.', 'extra stages for toxic waste', 'Some waste water contains toxic substances. It needs extra treatment stages. These may include adding chemicals, treating with UV radiation, or passing the water through membranes.', 'sewage-toxic'),
  ],
}
