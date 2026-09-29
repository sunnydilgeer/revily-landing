import type { TeachingFrame } from '../../teachingFrame'

// Investigating waves: ripple tank, finding the speed, vibrating string, and safety. Practical preparation only.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wavePracFrames: Record<string, TeachingFrame[]> = {
  'P55-02': [
    f('The ripple tank', 'A ripple tank is a shallow tray of water. A dipper attached to a signal generator makes ripples.', 'dipper makes ripples', 'A ripple tank is a shallow tray of water. Attach a signal generator to the dipper. When you turn it on, the dipper dips in and out of the water and makes ripples.', 'waveprac-tank'),
    f('Set the frequency', 'The ripples have the frequency set on the signal generator.', 'frequency is known', 'The ripples have the same frequency as the one set on the signal generator. So you already know the frequency. You only need to find the wavelength.', 'waveprac-frequency'),
    f('Make shadows', 'Dim the room lights. A lamp above the tank makes shadows of the ripples on a screen below.', 'lamp, ripples, screen', 'Dim the lights. A lamp above the tank casts shadows of the ripples onto a screen below the tank. Place a metre ruler beside the shadows so you can measure distances.', 'waveprac-shadows'),
    f('Shadow lines', 'The distance between one shadow line and the next is one wavelength.', 'one line, one ripple', 'Each shadow line matches one ripple. So the distance between one shadow line and the next is one wavelength. Place the lamp so the shadows are about the same size as the ripples.', 'waveprac-lines'),
  ],
  'P55-05': [
    f('Measure ten wavelengths', 'Measure across ten wavelengths, not one. It gives a more accurate wavelength.', 'small distances are hard', 'One wavelength is small, so measuring it is not very accurate. Instead, measure the distance across ten wavelengths on the screen. Use the metre ruler beside the shadows.', 'waveprac-ten'),
    f('Divide by ten', 'Divide the distance by 10 to find the average wavelength: 0.20 m ÷ 10 = 0.020 m.', 'average of ten', 'Suppose ten wavelengths measure 0.20 m. Divide by 10 to get the average wavelength. 0.20 ÷ 10 = 0.020. One wavelength is 0.020 m.', 'waveprac-divide'),
    f('Work out the speed', 'With a frequency of 10 Hz: v = f × λ = 10 × 0.020 = 0.20 m/s.', 'v = f × λ', 'The signal generator is set to 10 Hz. Use v = f × λ. Put in the values: v = 10 × 0.020. The speed of the ripples is 0.20 m/s.', 'waveprac-speed'),
    f('Why a ripple tank?', 'It lets you measure the wavelength without disturbing the waves.', 'no touching', 'This set-up is suitable for water waves because the shadows let you measure the wavelength without disturbing the waves. Touching the water would change the ripples.', 'waveprac-suitable'),
  ],
  'P55-08': [
    f('The string set-up', 'A vibration generator shakes a string. The string passes over a pulley and holds masses at the end.', 'generator, string, masses', 'A vibration generator is connected to a signal generator. It shakes one end of a string. The other end passes over a pulley and holds some masses, which keep the string tight.', 'waveprac-string'),
    f('Find a clear wave', 'Turn on the signal generator and adjust the frequency until a clear wave appears on the string.', 'adjust until clear', 'Turn on the signal generator and the string starts to vibrate. Adjust the frequency until you see a clear wave on the string. The frequency is the value set on the signal generator.', 'waveprac-clear'),
    f('Count the loops', 'Each loop is half a wavelength. Two loops make one whole wavelength.', 'loops, halves', 'Count how many wavelengths are on the string. Each vibrating loop is half a wavelength. So two loops make one wavelength. If you count 3 loops, that is one and a half wavelengths.', 'waveprac-loops'),
    f('Find one wavelength', 'Measure the whole string and divide by the number of wavelengths on it.', 'length ÷ wavelengths', 'Measure the length of the whole vibrating string. Suppose it is 0.80 m with 4 loops, which is 2 wavelengths. Divide: 0.80 ÷ 2 = 0.40 m. One wavelength is 0.40 m. Then use v = f × λ with the frequency you set.', 'waveprac-length'),
  ],
  'P55-11': [
    f('Water and electricity', 'Keep water away from electrical equipment. Switch off and unplug before wiping up spills.', 'water near electrics', 'In the ripple tank, water is close to the lamp and signal generator. Keep the water away from plugs and connections. If water is spilled, switch off and unplug the equipment before you wipe it up.', 'waveprac-safe-water'),
    f('Falling masses', 'Masses on the string can fall. Wear goggles and keep your feet clear.', 'masses can drop', 'The masses on the string could fall if the string slips or snaps. Wear safety goggles and keep your feet away from underneath. Use only the masses your teacher gives you.', 'waveprac-safe-masses'),
    f('Your practical', 'Lamps get hot. Follow your teacher\'s instructions and risk assessment.', 'prepare, then do it', 'The lamp above the ripple tank can get hot, so do not touch it. Follow your teacher\'s instructions. This lesson helps you prepare, but you still need to do the real practical yourself.', 'waveprac-safe-lamp'),
  ],
}
