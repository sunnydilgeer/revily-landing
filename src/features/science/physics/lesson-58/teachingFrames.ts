import type { TeachingFrame } from '../../teachingFrame'

// Uses of radio waves (TV, radio, Bluetooth), microwaves (satellites, ovens) and infrared (cameras, heating, cooking).
// Uses of the other four groups are in the next lesson; dangers come in the next thread.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const emUseFrames: Record<string, TeachingFrame[]> = {
  'P58-02': [
    f('Radio waves carry programmes', 'Radio and TV programmes are sent using radio waves.', 'transmitter, radio waves, aerial', 'Radio waves are used mainly for communication. Radio and TV programmes are sent as radio waves from a transmitter to an aerial. The waves carry the signal without any wires.', 'emuse-radio'),
    f('Shorter waves need a clear path', 'FM radio and TV use short radio waves, which must be in direct sight of the receiver.', 'short wave, clear path, short distance', 'FM radio and TV use radio waves with a shorter wavelength. These have to be in direct sight of the receiver, with nothing in the way. So they cannot travel very far.', 'emuse-short'),
    f('Longer waves travel further', 'Radio waves with a longer wavelength can travel much further, even around the world.', 'long wave, long distance', 'Radio waves with a longer wavelength can travel further. They can be used to send radio signals around the world.', 'emuse-long'),
    f('Bluetooth', 'Bluetooth uses radio waves with an even shorter wavelength, over very short distances.', 'very short wave, very short distance', 'Bluetooth also uses radio waves, and its wavelength is even shorter. It sends data over very short distances between devices without wires. A phone and wireless headphones are one example.', 'emuse-bluetooth'),
  ],
  'P58-05': [
    f('The signal goes up', 'A microwave signal is sent from a dish on the ground up to a satellite.', 'dish, up, satellite', 'Microwaves can pass through the Earth\'s atmosphere. A dish on the ground sends a microwave signal up to a satellite high above the atmosphere.', 'emuse-sat1'),
    f('The satellite sends it back', 'The satellite sends the signal back to Earth in a different direction.', 'signal returns, new direction', 'The satellite sends the signal back towards Earth. It travels in a different direction from the way it arrived.', 'emuse-sat2'),
    f('A dish receives it', 'A satellite dish on the ground receives the signal. Satellite TV works this way.', 'dish receives', 'Another dish on the ground receives the signal. This is how satellite TV programmes can reach a home a long way from the studio.', 'emuse-sat3'),
  ],
  'P58-07': [
    f('Microwaves in the oven', 'A microwave oven gives out microwaves, which are absorbed by water in the food.', 'oven, microwaves, water', 'A microwave oven gives out microwaves. Most food contains water. The water in the food absorbs the microwaves.', 'emuse-oven1'),
    f('Energy to the water', 'Energy carried by the microwaves is transferred to the water molecules, so they heat up.', 'absorbed, energy transferred, hotter', 'The microwaves carry energy. When the water absorbs them, that energy is transferred to the water molecules. The water molecules heat up.', 'emuse-oven2'),
    f('The whole food cooks', 'The hot water heats the rest of the food, which quickly cooks.', 'hot water heats the food', 'The hot water heats the rest of the food around it. This causes the whole food to heat up and cook quickly.', 'emuse-oven3'),
  ],
  'P58-09': [
    f('Everything gives out infrared', 'All objects give out infrared radiation. The hotter the object, the more it gives out.', 'hotter, more infrared', 'Infrared, or IR for short, is a type of EM wave. All objects give out infrared radiation. The hotter an object is, the more infrared radiation it gives out.', 'emuse-ir1'),
    f('Absorbing infrared warms things', 'When an object absorbs infrared radiation, energy is transferred to its thermal store and it warms up.', 'absorbed, thermal store, warmer', 'When an object absorbs infrared radiation, energy is transferred to the object\'s thermal energy store. This makes the object warm up.', 'emuse-ir2'),
    f('Infrared cameras', 'Infrared cameras detect infrared radiation, so they can monitor temperature.', 'detect, colour, temperature', 'An infrared camera detects infrared radiation and shows it as colours. The redder the colour, the more infrared is being detected. It can show where energy is being lost from a house. It can also show hot objects in the dark.', 'emuse-ircam'),
    f('Heating and cooking', 'Electric heaters and toaster elements give out lots of infrared radiation.', 'lots of infrared, warms or cooks', 'An electric heater gives out lots of infrared radiation, which warms a room. The heating element in a toaster gives out infrared radiation that cooks the bread.', 'emuse-irheat'),
  ],
}
