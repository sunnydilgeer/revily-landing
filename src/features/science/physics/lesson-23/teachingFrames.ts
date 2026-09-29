import type { TeachingFrame } from '../../teachingFrame'

// ac and dc, UK mains values, the three wires in a plug and their jobs, and why the live wire is dangerous.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const mainsFrames: Record<string, TeachingFrame[]> = {
  'P23-02': [
    f('Two kinds of supply', 'There are two types of electricity supply: direct current (dc) and alternating current (ac).', 'dc and ac', 'Electricity supplies come in two types. One is direct current, or dc. The other is alternating current, or ac. The difference is what the current does over time.', 'mains-two-types'),
    f('Direct current', 'In dc the current always flows the same way. Cells and batteries supply dc.', 'one direction', 'In direct current the charge always flows in the same direction. It is made by a direct pd, one that stays the same way round. Cells and batteries supply direct current.', 'mains-dc'),
    f('Alternating current', 'In ac the current keeps changing direction. It is made by an alternating pd.', 'back and forth', 'In alternating current the charge keeps changing direction, backwards and forwards. It is made by an alternating pd, which keeps switching from one way round to the other. The mains supply in your home is ac.', 'mains-ac'),
    f('UK mains: 230 V and 50 Hz', 'The UK mains supply is ac at about 230 V. Its frequency is 50 hertz (Hz).', '230 V, 50 Hz', 'The UK mains supply is ac at about 230 V. Its frequency is 50 hertz, written 50 Hz. This means the current completes 50 cycles of changing direction every second.', 'mains-values'),
  ],
  'P23-05': [
    f('Three wires in every plug', 'Most appliances are connected by a three-core cable: three wires, each covered in plastic insulation.', 'three colours', 'Most appliances are connected to the mains by a three-core cable. It has three wires inside. Each wire is covered in plastic insulation, so the current cannot escape. The insulation is coloured so you can tell the wires apart.', 'mains-three-core'),
    f('The live wire is brown', 'The live wire is brown. It brings the alternating pd of about 230 V from the mains supply.', 'brown, 230 V', 'The live wire is brown. It provides the alternating potential difference from the mains supply. Its pd is about 230 V.', 'mains-live'),
    f('The neutral wire is blue', 'The neutral wire is blue. It completes the circuit and is at about 0 V.', 'blue, completes the circuit', 'The neutral wire is blue. It completes the circuit. When the appliance is working normally, current flows in through the live wire and out through the neutral wire. The neutral wire is at around 0 V.', 'mains-neutral'),
    f('The earth wire is green and yellow', 'The earth wire is green and yellow. It is a safety wire at 0 V that stops the appliance becoming live.', 'green and yellow, safety', 'The earth wire is green and yellow. It is a safety wire. It stops the appliance from becoming live if there is a fault. It is at 0 V, and it does not usually carry a current unless there is a fault.', 'mains-earth'),
  ],
  'P23-08': [
    f('A pd between live and earth', 'The live wire is at about 230 V and the earth is at 0 V, so there is a pd between them.', 'live 230 V, earth 0 V', 'The live wire is at about 230 V. The ground and the earth wire are at 0 V. So there is a large potential difference between the live wire and the earth.', 'mains-pd-live-earth'),
    f('You can provide the link', 'If you touch the live wire, you provide a link between the supply and the earth. A current can flow through you.', 'a path through your body', 'If you touch a live wire, your body can provide a link between the live wire and the earth. The pd makes a current flow through you. A large current gives an electric shock, which can injure or kill.', 'mains-shock'),
    f('A switch that is off', 'Even with a switch turned off, the live wire can still be dangerous, because it may still have a pd.', 'off does not mean safe', 'Turning a switch off opens the circuit, but the wire on the supply side can still be at 230 V. So touching the live wire may still be dangerous even when the switch is off.', 'mains-switch-off'),
    f('Live and earth must never touch', 'Any connection between live and earth is dangerous. A huge current could flow and start a fire.', 'huge current, fire risk', 'Any connection between the live wire and the earth can be dangerous. The pd could make a huge current flow. This could cause a fire as well as an electric shock. That is why the wires are covered in insulation.', 'mains-fire'),
  ],
}
