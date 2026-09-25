import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Big idea: health is physical and mental well-being, and different health problems can affect each other.
// One new word per frame. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const healthFrames: Record<string, TeachingFrame[]> = {
  'B15-02': [
    f('Sam’s week', 'Several small problems can add up.', 'body and mind together', 'Sam has a cold this week. They sleep badly and worry about exams. None of these is serious alone, but Sam does not feel well.', 'health-week'),
    f('Body and mind', 'Health is a state of physical and mental well-being.', 'physical + mental', 'Well-being means feeling well and coping with daily life. Health is a state of physical and mental well-being. Physical means the body. Mental means thoughts and feelings.', 'health-wellbeing'),
    f('More than no disease', 'Health is more than not having a disease.', 'no disease ≠ fully well', 'So health is more than just not having a disease. Someone with no disease can still feel unwell. Diseases are still a major cause of ill health.', 'health-wellbeing'),
  ],
  'B15-04': [
    f('Diseases that spread', 'Communicable diseases can spread between people.', 'pathogen → spreads', 'Some diseases can spread from one person to another. These are communicable diseases. They are caused by pathogens, such as viruses and bacteria. Sam’s cold is one.', 'health-communicable'),
    f('Diseases that do not spread', 'Non-communicable diseases cannot be caught.', 'cannot be caught', 'Other diseases cannot be caught from someone else. These are non-communicable diseases. Coronary heart disease is one. (You met it in Lesson 14.)', 'health-noncommunicable'),
  ],
  'B15-07': [
    f('A weaker defence', 'A weak immune system makes infections more likely.', 'weaker defence → more infections', 'The immune system is the body’s defence against pathogens. If it does not work properly, a person is more likely to catch communicable diseases.', 'health-immune'),
    f('Viruses and cancer', 'Some viruses can trigger some cancers.', 'raises the chance, not certain', 'Some viruses live inside body cells. They can trigger some cancers. This does not mean every infected person gets cancer.', 'health-virus-cancer'),
    f('Allergies', 'An immune reaction can trigger an allergy.', 'reacts to something harmless', 'Sometimes the immune system reacts to a pathogen, then reacts to harmless things too. This is an allergy. It can cause skin rashes or asthma.', 'health-allergy'),
  ],
  'B15-10': [
    f('Body and mind affect each other', 'Physical ill health can lead to mental ill health.', 'illness → daily life → mood', 'A serious long-term illness can stop someone doing things they enjoy. This can lead to depression. Depression is a mental illness where low mood lasts a long time.', 'health-physical-mental'),
    f('Diet and stress', 'Diet and stress can affect health.', 'what we eat, how we feel', 'A poor diet can lead to ill health. Long-term stress can affect sleep, mood and the body. Both can affect physical and mental health.', 'health-diet-stress'),
    f('Life situation', 'Money, housing and healthcare can affect health.', 'things around a person', 'Life situation means things like money, housing and access to healthcare. These can affect health too. They are not always a person’s own choice.', 'health-life'),
  ],
}
