import type { TeachingFrame } from '../../teachingFrame'

// The National Grid: what it is, meeting demand, why high pd and low current, and step-up and step-down transformers.
// P = VI is recalled from the earlier power lessons; no transformer equations (Higher tier).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const gridFrames: Record<string, TeachingFrame[]> = {
  'P26-02': [
    f('A giant network', 'The National Grid is a giant system of cables and transformers that covers Great Britain.', 'cables and transformers', 'Electricity is made in power stations, often far from where it is used. The National Grid is a giant system of cables and transformers that covers Great Britain. It links power stations to almost every home, school and business.', 'grid-network'),
    f('Power stations to consumers', 'The grid transfers electrical power from power stations to consumers.', 'who makes it, who uses it', 'The grid carries electrical power from power stations to consumers. A consumer is anyone who is using electricity, such as a family at home or a factory.', 'grid-consumers'),
    f('Cables and transformers', 'The cables carry the electrical power. The transformers change the potential difference.', 'carry it, change it', 'The grid has two main parts. The cables carry the electrical power along. The transformers change the potential difference, or pd, of the electricity. You will see why that matters soon.', 'grid-parts'),
  ],
  'P26-05': [
    f('Demand changes', 'The amount of electricity being used is called the demand, and it changes through the day.', 'more or less used', 'The amount of electricity being used at any moment is called the demand. Demand changes through the day. It is higher when people get up in the morning, come home in the evening, or when it is dark or cold outside.', 'grid-demand'),
    f('Enough for everyone', 'Power stations must produce enough electricity for everyone to have it when they need it.', 'supply matches demand', 'Power stations have to produce enough electricity for everyone to have it when they need it. So the amount they make has to follow the demand as it rises and falls.', 'grid-enough'),
    f('Room to spare', 'Power stations often run below their maximum power output, so they can increase it when needed.', 'not flat out', 'Power stations often run well below their maximum power output. That leaves room to spare. They can increase their power output quickly if it is needed.', 'grid-spare'),
    f('Coping with surprises', 'So the grid can cope with high demand, even if a power station shuts down without warning.', 'other stations step in', 'This means the National Grid can cope with a high demand. It can even cope if one power station shuts down without warning, because other stations can make more.', 'grid-cope'),
  ],
  'P26-08': [
    f('Power, pd and current', 'For a given power, a higher pd means a lower current, because P = VI.', 'P = VI', 'You know that power = potential difference × current, or P = VI. To send a huge amount of power you need either a high current or a high pd. For a given power, the higher the pd, the lower the current.', 'grid-pvi'),
    f('A high current heats the cables', 'A high current makes the cables hot, so energy is lost to the surroundings.', 'hot wires waste energy', 'A high current makes the wires heat up. Lots of energy is then lost to the thermal energy store of the surroundings. That is wasteful, so we say it is inefficient.', 'grid-hotcable'),
    f('High pd, low current', 'The grid uses a very high pd, so the current is low and less energy is lost as heat.', 'high pd, low current', 'So the National Grid transfers energy at a very high pd. A high pd means a low current for the same power. A low current means the cables heat up much less, so much less energy is lost.', 'grid-highpd'),
    f('Cheaper and more efficient', 'A high pd and low current is a cheaper, more efficient way to transfer electricity.', 'less wasted', 'Using a high pd is a much cheaper and more efficient way to transfer electricity. Less energy is wasted on the way, so less has to be generated in the first place.', 'grid-compare'),
  ],
  'P26-11': [
    f('Step-up transformer', 'A step-up transformer increases the pd between the power station and the transmission cables.', 'raise the pd', 'A transformer changes the pd of an electricity supply. A step-up transformer increases the pd. It sits between the power station and the long transmission cables.', 'grid-stepup'),
    f('Current goes down', 'As the pd is increased, the current is decreased, so power is transmitted efficiently.', 'pd up, current down', 'When the pd is raised, the current in the cables goes down. This means the power can be transmitted to homes efficiently, with little energy lost as heat.', 'grid-currentdown'),
    f('Step-down transformer', 'A step-down transformer brings the pd back down before the electricity reaches homes.', 'lower it again', 'A step-down transformer brings the pd back down before electricity reaches homes. This makes the pd safe for consumers. As the pd is decreased, the current is increased.', 'grid-stepdown'),
    f('The whole journey', 'Power station, step-up transformer, transmission cables, step-down transformer, consumers.', 'follow it along', 'Now follow the whole route. Electricity leaves the power station and passes through a step-up transformer. It travels along the transmission cables, then through a step-down transformer, and reaches the consumers.', 'grid-journey'),
  ],
}
