import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-ORG-010-B',
  sections: {
    'B10-02': [
      ['What route does air take into the lungs?', 'Down the trachea, into the two bronchi, through smaller and smaller tubes, then into the alveoli.'],
      ['What are the bronchi?', 'The two branches of the trachea. One goes into each lung. Just one is called a bronchus.'],
      ['What are alveoli?', 'Tiny air sacs at the ends of the smallest tubes. One is called an alveolus.'],
    ],
    'B10-05': [
      ['Which way does oxygen move in the lungs?', 'From the air in the alveolus into the blood, by diffusion. The air has more oxygen than the blood.'],
      ['Which way does carbon dioxide move in the lungs?', 'From the blood into the alveolus, by diffusion. Then you breathe it out.', 'Oxygen goes into the blood; carbon dioxide comes out.'],
      ['What is gas exchange?', 'Oxygen diffusing into the blood while carbon dioxide diffuses out, across the alveolus and capillary walls.', 'Gas exchange happens in the alveoli, not the trachea.'],
    ],
    'B10-08': [
      ['Why do millions of alveoli help gas exchange?', 'They give a very large surface area, so lots of oxygen can cross at once.'],
      ['Why do thin walls help gas exchange?', 'Alveolus and capillary walls are one cell thick. Gases travel a short distance, so diffusion is fast.', 'Thick walls would slow diffusion down.'],
      ['Why does a good blood supply help?', 'Blood carries oxygen away. So the oxygen difference stays big and oxygen keeps diffusing in.'],
    ],
    'B10-11': [
      ['What is ventilation?', 'Moving air in and out of the lungs.'],
      ['How does ventilation help gas exchange?', 'It brings in fresh air and takes away carbon dioxide. This keeps the difference big for both gases.'],
      ['What four features make gas exchange fast?', 'A large surface area, thin walls, a good blood supply and ventilation.'],
    ],
  },
  recall: ['B10-04', 'B10-07', 'B10-09', 'B10-12'],
}
