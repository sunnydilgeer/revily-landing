import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'C-PER-006-C',
  sections: {
    'C6-02': [
      ['Where are the electrons in an atom?', 'In shells around the nucleus. Shells are also called energy levels.'],
      ['Which shell fills first?', 'The inner shell, closest to the nucleus. Inner shells always fill first.'],
      ['How many electrons can each shell hold, for the first 20 elements?', 'First shell 2, second shell 8, third shell 8.', 'Potassium and calcium put their last electrons in a fourth shell.'],
    ],
    'C6-05': [
      ['What is an electronic structure?', 'How the electrons in an atom are arranged in shells.'],
      ['How do you draw an electronic structure?', 'A circle for each shell around the nucleus, and a dot or a cross on the shell for each electron.'],
      ['What does 2,8,1 mean?', '2 electrons in the first shell, 8 in the second and 1 in the third. The numbers add up to the atomic number (11, sodium).'],
    ],
    'C6-08': [
      ['Which atoms are stable?', 'Atoms with a full outer shell, such as helium (2), neon (2,8) and argon (2,8,8).'],
      ['What happens when an atom’s outer shell is not full?', 'The atom reacts to end up with a full outer shell. Most atoms are like this.'],
    ],
    'C6-10': [
      ['How do you work out an electronic structure?', 'Atomic number = number of electrons. Fill 2, then up to 8, then up to 8, then check the numbers add up.'],
      ['What is the electronic structure of aluminium (atomic number 13)?', '2,8,3.', 'Check: 2 + 8 + 3 = 13.'],
    ],
  },
  recall: ['C6-03', 'C6-04', 'C6-07', 'C6-12'],
}
