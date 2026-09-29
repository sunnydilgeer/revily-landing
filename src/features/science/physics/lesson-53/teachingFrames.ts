import type { TeachingFrame } from '../../teachingFrame'

// Waves: energy not matter, transverse and longitudinal, and the words used to describe a wave.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const waveTypeFrames: Record<string, TeachingFrame[]> = {
  'P53-02': [
    f('Energy, not matter', 'Waves transfer energy from one place to another without transferring any matter.', 'energy moves, stuff does not', 'Waves transfer energy from one place to another without transferring any matter. Matter just means stuff. When a wave travels through a medium, such as water or air, the particles of the medium vibrate.', 'wavetype-energy'),
    f('Particles stay put', 'The particles pass energy to each other as they vibrate, but overall they stay in the same place.', 'only energy travels', 'The particles pass energy along to their neighbours as they vibrate. But overall the particles stay in the same place. Only the energy travels.', 'wavetype-stay'),
    f('Two examples', 'Ripples do not carry a twig away. Sound does not carry air away from a guitar.', 'no wind, no drift', 'Drop a twig into calm water. Ripples spread out, but they do not carry the water or the twig away. Strum a guitar string. The sound waves do not carry the air away from the guitar. If they did, you would feel a wind whenever there was a sound.', 'wavetype-examples'),
  ],
  'P53-05': [
    f('Transverse waves', 'In a transverse wave, the vibrations are at right angles to the direction the wave travels.', 'vibrations across the travel', 'In a transverse wave, the vibrations are at right angles to the direction the wave travels. Wiggle a spring up and down. The vibrations go up and down while the wave travels along the spring.', 'wavetype-transverse'),
    f('Examples of transverse waves', 'Light and other electromagnetic waves, ripples on water and waves on a string are transverse.', 'three examples', 'All electromagnetic waves are transverse, for example light. Ripples on the surface of water are transverse. So is a wave on a string.', 'wavetype-transverse-eg'),
    f('Longitudinal waves', 'In a longitudinal wave, the vibrations are in the same direction as the wave travels.', 'vibrations along the travel', 'Push the end of a spring in and out along its length. The vibrations are in the same direction as the energy transfer. This makes a longitudinal wave.', 'wavetype-longitudinal'),
    f('Compressions and rarefactions', 'Compressions are where particles are squashed together. Rarefactions are where they spread out.', 'squash and stretch', 'A longitudinal wave has compressions, where the particles squash together. It also has rarefactions, where the particles spread out. A sound wave is an example of a longitudinal wave.', 'wavetype-compress'),
  ],
  'P53-08': [
    f('Displacement and rest position', 'Displacement is how far a point on the wave is from its rest position.', 'distance from the middle', 'A wave goes up and down around a middle line. That line is the rest position. Displacement is how far a point on the wave is from its rest position.', 'wavetype-displacement'),
    f('Amplitude', 'Amplitude is the maximum displacement of a point on the wave from its rest position.', 'biggest displacement', 'The highest point of a wave is a crest. The lowest point is a trough. The amplitude is the maximum displacement from the rest position. It is measured from the middle line up to a crest, or down to a trough.', 'wavetype-amplitude'),
    f('Wavelength', 'Wavelength is the distance from one point on a wave to the same point on the next wave.', 'crest to crest', 'Wavelength is the distance between one point on a wave and the same point on the next wave. For example, it is the distance from one crest to the next crest. It is also the distance from one trough to the next.', 'wavetype-wavelength'),
    f('Frequency', 'Frequency is the number of complete waves passing a point each second. It is measured in hertz, Hz.', 'waves per second', 'Frequency is the number of complete waves that pass a certain point every second. It is measured in hertz, which is written Hz. One hertz is one wave per second.', 'wavetype-frequency'),
    f('Period', 'The period is the time taken for one complete wave to pass a point.', 'time for one wave', 'The period of a wave is the time taken for one complete wave to pass a certain point. It is measured in seconds. A wave with a high frequency has a short period.', 'wavetype-period'),
  ],
}
