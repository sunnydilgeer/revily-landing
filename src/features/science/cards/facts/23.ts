import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-INF-023-B',
  sections: {
    'B23-02': [
      ['What happens the first time a pathogen gets into your body?', 'Its antigens are new. White blood cells take several days to make the right antibodies. Meanwhile it multiplies, and you feel ill.'],
      ['Why is the second response to the same pathogen faster?', 'White blood cells recognise its antigens. They quickly make lots of antibodies. The pathogen is destroyed before you feel ill.'],
      ['What does immune mean?', 'Your white blood cells can destroy a pathogen before it makes you ill.'],
    ],
    'B23-05': [
      ['What is vaccination?', 'Putting small amounts of dead or inactive pathogen into the body, often by an injection.', 'A vaccine does not contain antibodies. Your own white blood cells make them.'],
      ['Why does a vaccine not make you ill?', 'The pathogen is dead or inactive, so it cannot cause the disease. It still carries its antigens.'],
      ['How does a vaccine protect you later?', 'White blood cells make antibodies and then recognise the antigens. If the real pathogen arrives, they respond fast. You are much less likely to become ill.'],
    ],
    'B23-08': [
      ['How does vaccinating most people protect those not vaccinated?', 'Immune people do not catch the disease, so cannot pass it on. Fewer people can pass it to the unvaccinated.'],
      ['What is an epidemic?', 'A big outbreak of a disease. Vaccinating lots of people can prevent epidemics.'],
      ['What are the drawbacks of vaccines?', 'Vaccines do not always work, so a person may not become immune. Some people have a reaction, such as a sore arm. This is usually mild.'],
    ],
  },
  recall: ['B23-06', 'B23-12', 'B23-13'],
}
