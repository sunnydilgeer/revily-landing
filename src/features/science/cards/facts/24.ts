import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-INF-024-B',
  sections: {
    'B24-02': [
      ['What is a symptom?', 'A sign of illness that you notice, such as pain or a high temperature.'],
      ['What do painkillers do?', 'They help to get rid of symptoms, such as pain. They do not kill the pathogen.', 'Painkillers ease symptoms. Your white blood cells destroy the pathogen.'],
    ],
    'B24-04': [
      ['What is an antibiotic?', 'A medicine that kills bacteria inside the body. Penicillin is one example.'],
      ['Why is it important to get the right antibiotic?', 'Different antibiotics kill different types of bacteria.'],
      ['Why do antibiotics not help flu or colds?', 'Antibiotics do not kill viruses. Viruses reproduce inside your own cells, so drugs that kill them could damage your cells.', 'Antibiotics kill bacteria only, not viruses.'],
    ],
    'B24-07': [
      ['How do bacteria become resistant to an antibiotic?', 'Bacteria can mutate, or change, at random. Some mutations make them resistant. The antibiotic kills the others, so resistant bacteria survive and multiply.'],
      ['What is MRSA?', 'A resistant strain of bacteria. Resistant strains have become more common and are hard to treat.', 'Resistant bacteria can still cause disease. The antibiotic just no longer kills them.'],
    ],
    'B24-09': [
      ['Where did aspirin and digitalis first come from?', 'Aspirin, a painkiller, came from a chemical in willow trees. Digitalis, a heart drug, came from foxgloves.'],
      ['Where did penicillin come from?', 'Alexander Fleming found that a mould called Penicillium makes it. Penicillin is an antibiotic that kills bacteria.'],
      ['Who makes new drugs today?', 'Chemists in labs in the pharmaceutical industry. A new drug may still start with a chemical from a plant.'],
    ],
  },
  recall: ['B24-08', 'B24-13'],
}
