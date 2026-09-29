import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'P-ELE-018-P',
  sections: {
    'P18-02': [
      ['What is an I–V characteristic?', 'A graph of current (I) against potential difference (V) for a component.', 'A straight line means a linear component. A curve means a non-linear component.'],
      ['How do you find the resistance at a point on an I–V graph?', 'Read off the current and the pd at that point, then use R = V ÷ I.'],
    ],
    'P18-05': [
      ['How do you collect I–V data?', 'Use a variable resistor to change the current. At each setting, read the ammeter (in series) and the voltmeter (across the component). Then reverse the battery connections and repeat.'],
      ['What extra is needed to test a diode?', 'A protective resistor in series to keep the current low, and a milliammeter because the currents are small.'],
    ],
    'P18-08': [
      ['What does the I–V graph of an ohmic conductor look like?', 'A straight line through the origin: the current is directly proportional to the pd and the resistance is constant.'],
      ['Why does the filament lamp graph get less steep?', 'The filament heats up as the current increases, so its resistance increases and current flows less easily.'],
      ['What does the diode graph look like?', 'Flat at first, then it curves up quickly. Current flows in one direction only; the resistance is very high in the reverse direction.'],
    ],
  },
  recall: ['P18-04', 'P18-07', 'P18-10'],
}
