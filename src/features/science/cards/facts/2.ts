import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-CELL-002-B',
  sections: {
    'B2-02': [
      ['What is the specimen?', 'The thin sample you look at. It sits on a glass slide on the stage.'],
      ['What path does light take through a light microscope?', 'Lamp → specimen → objective lens → eyepiece → your eye.', 'The objective lens is nearest the specimen; the eyepiece is nearest your eye.'],
      ['What do the focusing controls do?', 'They change the gap between the lens and the slide, to make a blurred picture sharp.', 'Focusing makes the picture sharp. It does not make it bigger.'],
    ],
    'B2-04': [
      ['What is magnification?', 'How many times bigger the image is than the real thing. ×100 means 100 times bigger.', 'Only the image gets bigger. The real cell stays the same size.'],
      ['How do you work out total magnification?', 'Multiply: eyepiece × objective. A ×10 eyepiece and a ×4 objective give ×40.', 'Multiply the two lenses; do not add them.'],
    ],
    'B2-06': [
      ['What is resolution?', 'How well you can see two close points as separate. Higher resolution shows finer detail.'],
      ['What is resolving power?', 'How well a microscope can separate points that are close together. Greater resolving power gives higher resolution.'],
      ['Does making a blurred image bigger show more detail?', 'No. It only gives a bigger blur. Magnification is about size; resolution is about detail.', 'Do not mix up magnification and resolution.'],
    ],
    'B2-08': [
      ['What does an electron microscope use instead of light?', 'A beam of electrons. Electrons are tiny particles, much smaller than atoms.'],
      ['How does an electron microscope compare with a light microscope?', 'It has higher magnification and higher resolution. It can show tiny parts, such as ribosomes, clearly.', 'A light microscope can show whole cells, but not the tiniest parts clearly.'],
      ['How did electron microscopes help scientists understand cells?', 'They showed sub-cellular structures in fine detail. So scientists could study how these parts are built and what they do.', 'The microscopes revealed these parts; they did not create them.'],
    ],
  },
  recall: ['B2-03', 'B2-05', 'B2-07'],
}
