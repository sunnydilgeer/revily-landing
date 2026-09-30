import type { ScienceFactSet } from '../../types'

export const facts: ScienceFactSet = {
  lessonId: 'W-MTH-001-W',
  sections: {
    'W1-02': [
      ['What is a hypothesis?', 'A possible explanation for an observation.'],
      ['What is a prediction?', 'A statement, based on the hypothesis, of what should happen in a test.', 'A prediction can be tested. A hypothesis is the idea behind it.'],
      ['What does a right prediction show?', 'Evidence that the hypothesis might be right. It does not prove it for certain.'],
    ],
    'W1-05': [
      ['What is peer review?', 'Other scientists check the evidence, for example whether the experiment was done in a sensible way.'],
      ['Why do scientists share their results?', 'So that others can check them, repeat the experiment and test the hypothesis further.'],
    ],
    'W1-08': [
      ['When does a hypothesis become an accepted theory?', 'When all the evidence supports it, after lots of testing over many years.'],
      ['What happens if evidence shows a hypothesis is wrong?', 'Scientists change the hypothesis or come up with a new one, then test again.'],
    ],
    'W1-11': [
      ['What is a model in science?', 'A simple way of describing or showing what is going on in real life. It can explain ideas and make predictions.'],
      ['What is the difference between a spatial and a computational model?', 'A spatial model shows where parts are placed. A computational model uses a computer to simulate a complex process.', 'A ball-and-stick molecule is spatial. A climate simulation is computational.'],
      ['Why do all models have limits?', 'One model cannot explain everything about an idea. The Bohr model explains some patterns but not every observation.'],
    ],
  },
  recall: ['W1-03', 'W1-09', 'W1-12'],
}
