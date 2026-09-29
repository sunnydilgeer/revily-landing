import type { TeachingFrame } from '../../teachingFrame'

// Fill one silicon atom shell by shell first (the rules), then write the result down (diagram and numbers),
// then read the outer shell (stable or reactive), and only then turn the rules into a method from the atomic number.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const electronFrames: Record<string, TeachingFrame[]> = {
  'C6-02': [
    f('Shells', 'Electrons move around the nucleus in shells.', 'shells → also called energy levels', 'You met electrons moving in shells when you learned what is inside an atom. Each shell is a set distance from the nucleus and has its own amount of energy. So shells are also called energy levels. This silicon atom has 14 electrons to place in its shells.', 'shell-fill-shells'),
    f('Inner shell first', 'The shell closest to the nucleus always fills first.', 'first shell → holds only 2', 'Electrons always go into the shell closest to the nucleus first. This inner shell is called the first shell. It can hold only 2 electrons. So silicon’s first 2 electrons fill the first shell, and 12 are still to place.', 'shell-fill-first'),
    f('Second shell', 'When the first shell is full, the second shell fills.', 'first full → second shell, up to 8', 'Once the first shell is full, electrons go into the second shell. The second shell can hold up to 8 electrons. Silicon has 12 left, so 8 of them fill the second shell. That leaves 4 still to place.', 'shell-fill-second'),
    f('Third shell', 'The third shell holds up to 8 for the first 20 elements.', 'second full → third shell, up to 8', 'Next comes the third shell. For the first 20 elements, it holds up to 8 electrons. Silicon’s last 4 electrons go here, so its third shell is only partly filled. The shell furthest out that has electrons in it is called the outer shell.', 'shell-fill-third'),
    f('Put it together', 'Shells fill from the inside out: 2, then 8, then 8.', '2 → 8 → 8, inside out', 'Silicon has 2 electrons in the first shell, 8 in the second and 4 in the third. 2 + 8 + 4 = 14, the same as its number of protons. Of the first 20 elements, only potassium and calcium have electrons in a fourth shell.', 'shell-fill-all'),
  ],
  'C6-05': [
    f('Drawing the shells', 'Draw shells as circles and electrons as dots or crosses.', 'circle = shell; dot or cross = electron', 'How the electrons in an atom are arranged in shells is called its electronic structure. You can show it as a diagram. Draw each shell as a circle around the nucleus. Then draw each electron as a dot or a cross on its shell.', 'shell-write-diagram'),
    f('Writing numbers', 'Numbers can show the same electronic structure.', 'inner shell first, commas between shells', 'You can also write the electronic structure as numbers. Write how many electrons are in each shell, starting with the inner shell. Put a comma between the shells. So silicon is 2,8,4: 2 in the first shell, 8 in the second and 4 in the third.', 'shell-write-numbers'),
    f('More examples', 'Each element has its own electronic structure.', 'the numbers add up to the atomic number', 'Here are five more atoms. Hydrogen has 1 electron, so it is 1. Beryllium is 2,2 and oxygen is 2,6. Neon’s 10 electrons exactly fill two shells: 2,8. Sodium has 11, so it is 2,8,1. In each one, the numbers add up to the atomic number.', 'shell-write-examples'),
  ],
  'C6-08': [
    f('Full outer shells', 'Atoms with a full outer shell are stable.', 'full outer shell → stable', 'Helium (2), neon (2,8) and argon (2,8,8) all have a full outer shell. Atoms like these hardly ever react with anything. Something that does not easily change is called stable. Atoms are much more stable when their outer shell is full.', 'shell-stable-full'),
    f('Not full', 'In most atoms, the outer shell is not full.', 'outer shell not full → reacts', 'In most atoms, the outer shell is not full. Lithium (2,1) has 1 electron in its outer shell, with room for 7 more. Oxygen (2,6) has room for 2 more. Atoms like these react with other atoms to end up with a full outer shell.', 'shell-stable-notfull'),
    f('Put it together', 'Full outer shell: stable. Not full: reacts.', 'full → stable; not full → reacts', 'Look at the outer shell to see how an atom behaves. Neon is 2,8: its outer shell is full, so it is stable. Sodium is 2,8,1: its outer shell holds only 1 electron, so it reacts. You will use this idea when you learn about the groups of the periodic table.', 'shell-stable-all'),
  ],
  'C6-10': [
    f('Count the electrons', 'The atomic number tells you how many electrons there are.', 'atomic number = protons = electrons', 'Start with the atomic number from the periodic table. It is the number of protons in the atom. An atom has the same number of electrons as protons. Nitrogen’s atomic number is 7, so a nitrogen atom has 7 electrons.', 'shell-rule-count'),
    f('Fill in order', 'Fill each shell in order until no electrons are left.', '2 first, then up to 8, then up to 8', 'Put 2 electrons in the first shell. Put up to 8 in the second shell, then up to 8 in the third. Any electrons left after that start a fourth shell. For nitrogen, 2 go in the first shell, leaving 5 for the second. So nitrogen is 2,5.', 'shell-rule-fill'),
    f('Check it', 'The numbers must add up to the atomic number.', 'add up; no shell over its limit', 'Check two things. First, the numbers must add up to the atomic number: 2 + 5 = 7. Second, no shell can hold more than its limit of 2, 8 or 8. Nitrogen’s 2,5 passes both checks, and its drawing matches.', 'shell-rule-check'),
  ],
}
