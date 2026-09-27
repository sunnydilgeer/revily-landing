import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-GEN-043-B',
  sections: {
    'B43-02': [
      ['How do bacteria become resistant to an antibiotic?', 'A random mutation makes some resistant. The antibiotic kills the others, and the resistant ones survive, reproduce and pass on the gene.', 'Bacteria do not “get used to” an antibiotic; the resistance comes from a mutation.'],
      ['Why can bacteria evolve quickly?', 'They reproduce very fast, so many generations grow in a short time.'],
    ],
    'B43-05': [
      ['Why are antibiotic-resistant strains a problem?', 'There may be no effective treatment, and people are not immune to a new strain, so it spreads easily.'],
      ['Why is antibiotic resistance becoming more common?', 'Antibiotics are overused and not always used correctly. MRSA is a superbug, resistant to most antibiotics.'],
    ],
    'B43-08': [
      ['How can doctors and patients slow down resistance?', 'Doctors should only prescribe antibiotics when really needed, not for viruses or non-serious infections. Patients should take the full course.'],
      ['Why should antibiotic use in farming be restricted?', 'Using antibiotics on animals can lead to resistant strains, which can spread to people, for example through meat.'],
      ['Why can new antibiotics not keep up?', 'Developing new drugs is slow and very expensive.'],
    ],
  },
  recall: ['B43-03', 'B43-06', 'B43-09'],
}
