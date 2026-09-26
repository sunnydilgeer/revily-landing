import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one pupil, Sam: chickenpox goes round his class but he stays well (first versus second response).
// He is also immune to measles without ever having had it (a vaccine as a safe practice run).
// Then measles reaches his school (protecting others), and the lesson ends with what vaccines cannot do.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const vaccinationFrames: Record<string, TeachingFrame[]> = {
  'B23-02': [
    f('Chickenpox again', 'Chickenpox spreads round Sam’s class, but he stays well.', 'why not Sam?', 'Chickenpox is a disease caused by a virus. Sam had it when he was five. This year it spreads round his class, but Sam stays well.', 'vaccine-class-outbreak'),
    f('The first time', 'The first time, antibodies were made slowly.', 'new antigen → slow response', 'When Sam first caught chickenpox, its antigens were new to his white blood cells. They took several days to make the right antibodies. Meanwhile the virus multiplied, and he felt ill.', 'vaccine-blood-first'),
    f('The second time', 'The second time, antibodies were made fast.', 'same antigen → fast response', 'This year the same virus got into Sam’s body. His white blood cells recognised its antigens and quickly made lots of antibodies. The virus was destroyed before he felt ill.', 'vaccine-blood-second'),
    f('Immune', 'Immune means you can destroy a pathogen before it makes you ill.', 'immune = fast response ready', 'Immune means your white blood cells can destroy a pathogen before it makes you ill. Sam is now immune to chickenpox. Most people only have chickenpox once.', 'vaccine-class-immune'),
    f('On a graph', 'A graph of antibody level shows both responses.', 'second rise: faster and higher', 'A graph can show the antibody level in the blood over time. After the first infection, it rises slowly. After the second, it rises faster and much higher.', 'vaccine-response-curve'),
  ],
  'B23-05': [
    f('Immune without being ill', 'Sam is immune to measles but never had it.', 'immune — but how?', 'Sam has never had measles, but he is immune to it. You met measles in Lesson 20. As a young child, Sam had a vaccine against measles, mumps and rubella.', 'vaccine-jab-intro'),
    f('Vaccination', 'A vaccine puts a small amount of pathogen into the body.', 'vaccine = practice run', 'Vaccination means putting small amounts of dead or inactive pathogen into the body. It is often done by an injection.', 'vaccine-jab-inject'),
    f('Dead or inactive', 'Inactive pathogens cannot cause the disease.', 'inactive = cannot cause disease', 'Inactive means the pathogen cannot cause the disease. But the dead or inactive pathogens still carry their antigens on their surface.', 'vaccine-jab-antigens'),
    f('Antibodies without illness', 'White blood cells make antibodies, but you do not get ill.', 'antigens → antibodies', 'The antigens cause white blood cells to make antibodies. This happens without you getting the disease. Your white blood cells now recognise these antigens.', 'vaccine-jab-antibodies'),
    f('The real pathogen', 'If the real pathogen arrives, the response is fast.', 'vaccine → fast response later', 'Later, the real pathogen may get into your body. White blood cells quickly make lots of the right antibodies. So you are much less likely to become ill.', 'vaccine-jab-later'),
  ],
  'B23-08': [
    f('Measles at school', 'Most pupils at Sam’s school are vaccinated.', 'who can catch it?', 'Most pupils at Sam’s school have had the measles vaccine. One day, a visitor with measles comes into the school.', 'vaccine-school-arrive'),
    f('Nowhere to spread', 'Most people near the visitor are immune.', 'immune people do not pass it on', 'Measles spreads in droplets from coughs and sneezes. But most people near the visitor are immune. They do not catch it, so they cannot pass it on.', 'vaccine-school-blocked'),
    f('Protecting others', 'People who are not vaccinated are protected too.', 'fewer people to pass it on', 'A few pupils are not vaccinated. They are less likely to catch measles, because fewer people around them can pass it on.', 'vaccine-school-shield'),
    f('Epidemics', 'Vaccinating lots of people can prevent epidemics.', 'epidemic = big outbreak', 'An epidemic is a big outbreak of a disease. Vaccinating lots of people can prevent epidemics. Vaccines have helped control diseases that were once common in the UK, such as polio.', 'vaccine-school-epidemic'),
    f('Weighing it up', 'Vaccines protect most people, but not every time.', 'pros and cons', 'Vaccines do not always work: sometimes a person does not become immune. Some people have a reaction, such as a sore arm or a fever. This is usually mild.', 'vaccine-summary'),
  ],
}
