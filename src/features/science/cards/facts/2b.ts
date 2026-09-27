import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-CELL-002B-B',
  sections: {
    'B1-29': [
      ['How many micrometres (µm) are in 1 millimetre (mm)?', '1000. To change mm into µm, multiply by 1000. To change µm into mm, divide by 1000.', 'Match units before comparing sizes.'],
      ['How many times wider is a 30 µm cell than a 3 µm bacterium?', '30 ÷ 3 = 10 times wider. A difference of 10 times is one order of magnitude.', 'These are example sizes. Real cell sizes vary.'],
      ['Write 0.005 mm in standard form.', '5 × 10⁻³ mm. 10⁻³ means 0.001, so 5 × 0.001 = 0.005.', '5 × 10³ is 5000. A negative power means a small number, not a negative length.'],
    ],
    'B2-12': [
      ['What is the rule for magnification?', 'Magnification = image size ÷ real size.', 'Divide the image size by the real size, not the other way round.'],
      ['What must you check before you divide?', 'Both sizes must be in the same unit. For example, change 40 µm into 0.04 mm.'],
      ['What unit does magnification have?', 'None. Write it with a × sign, such as ×200. It compares two sizes.', 'Do not write mm or µm after a magnification.'],
    ],
    'B2-18': [
      ['How do you find the real size?', 'Real size = image size ÷ magnification. For example, 6 mm ÷ 300 = 0.02 mm, which is 20 µm.', 'Check: the real cell should be smaller than its image.'],
      ['How do you find the image size?', 'Image size = real size × magnification. For example, 0.05 mm × 100 = 5 mm.', 'Check: the image should be bigger than the real cell.'],
      ['Which unit does your answer come out in?', 'The unit you started with. If the question asks for a different unit, convert at the end.'],
    ],
    'B2-41': [
      ['A rectangle around a mitochondrion is 5 µm by 2 µm. Estimate its area.', 'Area ≈ length × width = 5 × 2 = 10 µm².', 'Do not add the lengths, or write µm instead of µm².'],
      ['Why is a rectangle’s area only an estimate?', 'The curved shape does not exactly fill the rectangle. So write ≈, which means about equal.'],
    ],
  },
  recall: ['B2-40', 'B2-17', 'B2-31', 'B2-22'],
}
