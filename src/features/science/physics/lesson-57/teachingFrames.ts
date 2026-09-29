import type { TeachingFrame } from '../../teachingFrame'

// EM waves: energy transfer from source to absorber, same speed in a vacuum, the continuous spectrum and its order, and atoms producing/absorbing EM waves.
// Dangers of EM waves come in the next lesson set; uses come in the next two lessons.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const emSpectrumFrames: Record<string, TeachingFrame[]> = {
  'P57-02': [
    f('From a source to an absorber', 'EM waves carry energy from a source to an absorber.', 'source, waves, absorber', 'Light is one kind of electromagnetic wave. There are many others, and we call them EM waves for short. EM waves carry energy from a source, which gives them out, to an absorber, which takes them in.', 'emspec-source'),
    f('A campfire is a source', 'A campfire gives out infrared radiation, which is a type of EM wave.', 'fire gives out waves', 'Hold your hands beside a campfire and they feel warm, even far from the flames. The fire is the source. It gives out infrared radiation, and infrared is a type of EM wave. EM waves are transverse waves.', 'emspec-fire'),
    f('Absorbed, then warmer', 'Your hands absorb the infrared waves, so energy is transferred to their thermal stores.', 'absorbed, thermal store, warmer', 'Your hands absorb the infrared waves. Energy is transferred to the thermal energy stores of your hands. This makes your hands warm up.', 'emspec-absorb'),
    f('The same speed', 'All EM waves travel at the same speed through air or a vacuum, much faster than sound.', 'same speed, very fast', 'A vacuum is empty space with no air in it. All EM waves travel at the same speed through air or a vacuum. This speed is much faster than the speed of sound in air. That is why you see lightning before you hear thunder.', 'emspec-speed'),
  ],
  'P57-05': [
    f('Many wavelengths', 'EM waves vary in wavelength and frequency.', 'long or short, low or high', 'EM waves are not all the same. Some have a long wavelength and a low frequency. Others have a short wavelength and a high frequency.', 'emspec-many'),
    f('A continuous spectrum', 'There is an EM wave of every wavelength in a certain range, so the spectrum has no gaps.', 'every wavelength, no gaps', 'There is an EM wave of every wavelength within a certain range. The whole range is called the electromagnetic spectrum. It is continuous, which means it has no gaps in it.', 'emspec-continuous'),
    f('The seven groups', 'In order: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays.', 'seven groups in order', 'We split the spectrum into seven groups. In order they are radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays. To remember the order, try: Really Massive Ice-creams Vanish Under X-mas Grins.', 'emspec-order'),
    f('Long to short', 'From radio waves to gamma rays the wavelength gets shorter and the frequency gets higher.', 'wavelength down, frequency up', 'Radio waves have the longest wavelength and the lowest frequency. Gamma rays have the shortest wavelength and the highest frequency. Along the spectrum, as the wavelength gets shorter, the frequency gets higher.', 'emspec-direction'),
    f('Visible light is a small part', 'Our eyes can only detect a small part of the spectrum, called visible light.', 'eyes see one small part', 'Visible light is the only group our eyes can detect. It is a small part of the whole spectrum. The other six groups are invisible to us.', 'emspec-visible'),
  ],
  'P57-09': [
    f('Atoms make and absorb EM waves', 'EM waves can be produced or absorbed by changes in atoms and their nuclei.', 'change in an atom, wave', 'Changes inside atoms can produce EM waves. Changes inside atoms can also absorb EM waves. These changes can happen to the electrons or to the nucleus.', 'emspec-atoms'),
    f('Two examples', 'Electrons moving between energy levels give out or absorb EM waves. A change in a nucleus can produce gamma rays.', 'electrons, nucleus', 'When an electron moves between energy levels, an EM wave is given out or absorbed. A change in the nucleus of an atom can produce gamma rays.', 'emspec-changes'),
    f('Different change, different frequency', 'Each different change produces or absorbs a different frequency, so atoms can make a wide range of EM waves.', 'many changes, many frequencies', 'Each different change gives out or takes in a different frequency of EM wave. There are lots of different changes. So atoms can produce a large range of frequencies, and can also absorb a large range.', 'emspec-range'),
  ],
}
