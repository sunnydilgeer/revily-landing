import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one pupil, Mia: flu (a painkiller eases symptoms; her white blood cells clear the virus), then an ear infection
// (an antibiotic kills the bacteria; the same story explains why not for flu), then resistance, then her medicine cupboard.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const medicineFrames: Record<string, TeachingFrame[]> = {
  'B24-02': [
    f('Flu', 'Mia has flu, which is caused by a virus.', 'what can help?', 'Mia has flu. Flu is caused by a virus. She has a headache, a sore throat and a high temperature.', 'drug-flu-mia'),
    f('Symptoms', 'A symptom is a sign of illness that you notice.', 'symptom = a sign you notice', 'A symptom is a sign of illness that you notice, such as pain or a high temperature. Mia’s headache is a symptom of flu.', 'drug-flu-symptoms'),
    f('Painkillers', 'Painkillers ease symptoms but do not kill pathogens.', 'eases symptoms only', 'Mia takes a painkiller, and her headache eases. Painkillers help to get rid of symptoms, such as pain. But they do not kill the pathogen.', 'drug-flu-painkiller'),
    f('Her body clears it', 'Her white blood cells destroy the virus.', 'the body does the killing', 'The painkiller did not touch the flu virus. Mia’s white blood cells destroyed it, as you saw in Lesson 22. After a few days, she feels better.', 'drug-flu-wbc'),
  ],
  'B24-04': [
    f('An ear infection', 'Mia’s ear infection is caused by bacteria.', 'bacteria this time', 'A month later, Mia gets an ear infection caused by bacteria. A painkiller eases the earache. But the bacteria keep multiplying.', 'drug-ear-infection'),
    f('Antibiotics', 'Antibiotics kill bacteria inside the body.', 'antibiotic = kills bacteria', 'An antibiotic is a medicine that kills bacteria inside the body. Penicillin is one example. The doctor gives Mia an antibiotic, and the infection clears.', 'drug-ear-antibiotic'),
    f('The right one', 'Different antibiotics kill different bacteria.', 'match the antibiotic to the bacteria', 'Different antibiotics kill different types of bacteria. So it is important to be treated with the right antibiotic for the infection.', 'drug-ear-right'),
    f('Not for viruses', 'Antibiotics do not kill viruses.', 'viruses hide inside cells', 'Antibiotics do not kill viruses, so one would not have helped Mia’s flu. Viruses reproduce inside your own cells. So it is hard to make drugs that kill viruses without damaging your cells.', 'drug-ear-virus'),
    f('Side by side', 'Painkillers ease symptoms; antibiotics kill bacteria.', 'two jobs', 'Painkillers ease symptoms of many illnesses. Antibiotics kill bacteria, and they have greatly reduced the number of deaths from infections caused by bacteria.', 'drug-summary'),
  ],
  'B24-07': [
    f('Bacteria change', 'Bacteria can mutate as they multiply.', 'mutate = change', 'Bacteria multiply very quickly. As they do, they can mutate. Mutate means change.', 'drug-resist-mutate'),
    f('Resistant', 'Resistant bacteria are not killed by an antibiotic.', 'resistant = not killed by it', 'Some changes make bacteria resistant to an antibiotic. Resistant means the antibiotic no longer kills them. You met resistant gonorrhoea in Lesson 20.', 'drug-resist-resistant'),
    f('Resistant strains', 'MRSA is a resistant strain of bacteria.', 'strain = one type', 'A strain is one type of a bacterium. Resistant strains have become more common, and they are hard to treat. MRSA is one example. A later lesson explains why they spread.', 'drug-resist-mrsa'),
  ],
  'B24-09': [
    f('Chemicals from plants', 'Plant defence chemicals can become drugs.', 'plant chemical → drug', 'Plants make chemicals to defend themselves against pests and pathogens. Some of these chemicals can be used as drugs to treat human diseases.', 'drug-source-plants'),
    f('Aspirin', 'Aspirin was first made from willow.', 'willow → aspirin', 'Aspirin is a painkiller in Mia’s medicine cupboard. It was first made from a chemical found in willow trees.', 'drug-source-willow'),
    f('Digitalis', 'Digitalis was first made from foxgloves.', 'foxglove → digitalis', 'Mia’s grandad takes digitalis for a heart condition. It was first made from a chemical found in foxgloves.', 'drug-source-foxglove'),
    f('Penicillin', 'Penicillin came from a mould.', 'mould → penicillin', 'Some drugs came from microorganisms. Alexander Fleming found that a mould called Penicillium makes a substance that kills bacteria. This substance is penicillin, an antibiotic.', 'drug-source-mould'),
    f('Made in labs', 'Today, chemists in the pharmaceutical industry make new drugs.', 'pharmaceutical industry = drug companies', 'Today, chemists in labs make new drugs. They work in the pharmaceutical industry, the companies that make and sell drugs. A new drug may still start with a chemical from a plant.', 'drug-source-lab'),
  ],
}
