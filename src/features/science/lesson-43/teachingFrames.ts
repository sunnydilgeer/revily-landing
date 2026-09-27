import type { TeachingFrame } from '../teachingFrame'

// Builds on the medicines lesson (antibiotics, resistant, strain, MRSA). One population of bacteria in one patient:
// natural selection step by step, then why resistant strains are a problem, then what doctors, patients and farmers do.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const resistanceFrames: Record<string, TeachingFrame[]> = {
  'B43-02': [
    f('A random mutation', 'By chance, one bacterium becomes resistant.', 'mutation → resistant', 'You met antibiotics and resistant bacteria when you learned about medicines. As bacteria reproduce, random mutations happen in their DNA. By chance, one mutation makes a bacterium resistant to an antibiotic.', 'evolve-res-mutate'),
    f('The antibiotic is taken', 'The antibiotic kills the bacteria that are not resistant.', 'not resistant → killed; resistant → survives', 'A person with the infection takes the antibiotic. It kills the bacteria that are not resistant. The resistant bacterium survives in the person being treated. Being resistant is an advantage.', 'evolve-res-survive'),
    f('Survivors multiply', 'The resistant bacterium reproduces many times.', 'survives → reproduces → passes on the gene', 'The resistant bacterium reproduces many times. It passes the gene for resistance on to its offspring.', 'evolve-res-breed'),
    f('A resistant strain', 'The resistance gene becomes common: the bacteria have evolved.', 'natural selection in bacteria', 'Over time, the gene for resistance becomes more common in the population. The bacteria have evolved by natural selection. Bacteria that are all resistant like this form an antibiotic-resistant strain.', 'evolve-res-strain'),
    f('Fast evolution', 'Bacteria evolve quickly because they reproduce so fast.', 'fast reproduction → fast evolution', 'Bacteria reproduce very fast, so many generations grow in a short time. That is why bacteria can evolve quite quickly. The resistant strain keeps reproducing, so its population grows.', 'evolve-res-fast'),
  ],
  'B43-05': [
    f('No effective treatment', 'The usual antibiotic will not work.', 'resistant → no cure from that drug', 'If an infection is caused by a resistant strain, the usual antibiotic will not work. There may be no effective treatment. So the person can stay ill for longer.', 'evolve-prob-treat'),
    f('Spreads easily', 'People are not immune to a new strain.', 'not immune + hard to treat → spreads', 'People are not immune to a new strain. It is also hard to treat. So a resistant strain can spread easily from person to person.', 'evolve-prob-spread'),
    f('Getting worse', 'Antibiotic resistance is becoming more common.', 'overused + used wrongly', 'Antibiotic resistance is becoming more common. Antibiotics are overused, and people do not always use them correctly. Each time an antibiotic is used, resistant bacteria get a chance to survive and spread.', 'evolve-prob-worse'),
    f('Superbugs', 'MRSA is a superbug.', 'superbug = resistant to most antibiotics', 'Bacteria that are resistant to most known antibiotics are often called superbugs. MRSA is one example, which you met when you learned about medicines. It is very hard to get rid of.', 'evolve-prob-superbug'),
  ],
  'B43-08': [
    f('Only when needed', 'Doctors should prescribe antibiotics only when they are really needed.', 'no antibiotics for viruses or mild illness', 'Doctors should only prescribe antibiotics when they are really needed. They should not prescribe them for non-serious infections. They should not prescribe them for infections caused by viruses, such as colds and flu, because antibiotics do not kill viruses.', 'evolve-slow-doctor'),
    f('The full course', 'Take all the antibiotics you are prescribed.', 'full course → no survivors to mutate', 'A patient should take all of the antibiotic a doctor prescribes. This is called taking the full course. It makes sure all the bacteria are destroyed, so none are left to mutate and become resistant strains.', 'evolve-slow-course'),
    f('On farms', 'Farmers should use fewer antibiotics.', 'farm animals → resistant strains → people', 'Some farmers give animals antibiotics to stop them getting ill and to help them grow faster. This can lead to resistant strains in the animals. These can spread to people, for example when they prepare meat. So antibiotic use in farming should be restricted, which means limited.', 'evolve-slow-farm'),
    f('New antibiotics', 'New antibiotics are slow and expensive to develop.', 'slow + expensive → hard to keep up', 'Drug companies are working on new antibiotics that kill resistant strains. But developing a new drug is slow and very expensive, as you saw when you learned about drug testing. So new drugs are unlikely to keep up with new resistant strains.', 'evolve-slow-new'),
  ],
}
