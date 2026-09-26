import type { TeachingFrame } from '../teachingFrame'

// One route: tiny units → magnification = image ÷ real → turn the rule round → tiny areas.
// One new word per screen. Plain meaning first, then the term. Visuals: MicroscopyVisuals.tsx
// (unit, formula and standard-form cards), the size reference card, and the animal-cell model.
type Diagram = 'microscopy' | 'scale'
const f = (label: string, summary: string, cue: string, text: string, diagram: Diagram, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram, focus })
const m = (label: string, summary: string, cue: string, text: string, focus: string) => f(label, summary, cue, text, 'microscopy', focus)
// Area frames point at a mitochondrion on the animal-cell model.
const area = (label: string, summary: string, cue: string, text: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, part: 'mitochondria' })

export const magnificationFrames: Record<string, TeachingFrame[]> = {
  'B1-29': [
    f('A tiny unit', 'Cells are measured in micrometres.', '1 mm = 1000 µm', 'Most cells are far smaller than a millimetre. Imagine splitting one millimetre into 1000 equal parts. One of those parts is called a micrometre. We write it as µm.', 'scale', 'units'),
    m('Change the unit', 'mm to µm: multiply by 1000. µm to mm: divide by 1000.', 'mm × 1000 → µm; µm ÷ 1000 → mm', 'There are 1000 µm in 1 mm. So to change mm into µm, multiply by 1000: 0.02 mm = 20 µm. To change µm into mm, divide by 1000: 5 µm = 0.005 mm.', 'units'),
    f('Compare in the same unit', 'Ten times bigger is one order of magnitude.', 'same units, then divide', 'An animal cell might be 20 µm wide and a bacterium 2 µm wide. Both are in µm, so divide: 20 ÷ 2 = 10. The animal cell is 10 times wider. A difference of 10 times is called one order of magnitude. Real cell sizes vary.', 'scale', 'compare'),
    m('A short way to write tiny sizes', '0.003 mm can be written as 3 × 10⁻³ mm.', 'a × 10ⁿ, with a from 1 to under 10', 'Tiny sizes have lots of zeros, so scientists write them in a shorter way. 0.003 mm = 3 × 0.001 mm = 3 × 10⁻³ mm. The first number must be at least 1 but less than 10. This way of writing numbers is called standard form.', 'standard'),
    m('A negative power means a small number', '10⁻³ means 0.001.', 'negative power → small decimal', '10⁻³ means one thousandth, or 0.001. So 3 × 10⁻³ = 3 × 0.001 = 0.003. The negative power shows a small number. It does not mean a negative length. Keep the unit on the end.', 'standard-negative'),
    f('Put it together', 'Tiny sizes use µm, the same unit and standard form.', 'µm → same unit → standard form', 'Cells are measured in micrometres. Multiply by 1000 to go from mm to µm, and divide to go back. Compare sizes only in the same unit. Standard form writes tiny sizes without lots of zeros.', 'scale', 'units-summary'),
  ],
  'B2-12': [
    m('Image size', 'The width of the picture is the image size.', 'measure the picture', 'In the last lesson, the bigger picture a microscope makes was the image. You can measure the width of an image, or a photo of it, with a ruler. This width is called the image size. Always use the size given in the question, not this screen.', 'sizes'),
    m('Real size', 'The width of the actual specimen is the real size.', 'the real cell is tiny', 'The actual cell on the slide is much smaller than its image. Its width is called the real size. Real sizes of cells are often given in µm.', 'sizes'),
    m('The magnification rule', 'Magnification = image size ÷ real size.', 'image ÷ real', 'Magnification tells you how many times bigger the image is. So divide the image size by the real size. For example, an image 20 mm wide of a cell 0.1 mm wide: 20 ÷ 0.1 = 200. The magnification is ×200.', 'formula'),
    m('Match the units first', 'Both sizes must be in the same unit.', 'µm ÷ 1000 → mm', 'You cannot divide a size in mm by a size in µm. So change one size first, so both are in mm or both are in µm. For example, 40 µm ÷ 1000 = 0.04 mm.', 'units'),
    m('Put it together', 'Match the units, divide, then write ×.', 'units → divide → ×', 'First check that both sizes use the same unit, and convert if needed. Then divide the image size by the real size. Write the answer with a × sign. It has no mm or µm, because it compares two sizes.', 'formula'),
  ],
  'B2-18': [
    m('Undo the enlargement', 'Real size = image size ÷ magnification.', 'the image was made bigger → divide', 'Sometimes you know the image size and the magnification. The image was made bigger, so divide to undo it. Real size = image size ÷ magnification. For example, 6 mm ÷ 300 = 0.02 mm.', 'real-size'),
    m('Give the unit asked for', 'Convert at the end if the question asks for µm.', 'mm × 1000 → µm', 'Your answer keeps the unit of the image size. If the question asks for µm, multiply mm by 1000. So 0.02 mm = 20 µm. Check: the real cell should be smaller than its image.', 'real-size-check'),
    m('Apply the enlargement', 'Image size = real size × magnification.', 'made bigger → multiply', 'Sometimes you know the real size and the magnification. The image is bigger, so multiply. Image size = real size × magnification. For example, 0.05 mm × 100 = 5 mm.', 'image-size'),
    m('Keep track of the unit', 'The answer keeps the unit you started with.', 'µm in → µm out', 'If the real size is in µm, the image size comes out in µm. If the question asks for mm, divide by 1000. Check: the image should be bigger than the real cell.', 'image-size-check'),
    m('Put it together', 'Three sizes, one rule.', 'which one is missing?', 'Magnification = image size ÷ real size. Missing real size: divide the image size by the magnification. Missing image size: multiply the real size by the magnification. Then check the unit, and check which size is bigger.', 'formula'),
  ],
  'B2-41': [
    area('A curved cell part', 'Area is how much flat space a shape covers.', 'area = space covered', 'A mitochondrion is a tiny, curved part inside a cell. Sometimes you need to know how much flat space it covers. The flat space a shape covers is called its area.'),
    area('Use a simple shape', 'Draw a rectangle that fits closely around the curved part.', 'curve → rectangle', 'Curved shapes are hard to measure. So draw a rectangle that fits closely around the shape. The area of a rectangle = length × width.'),
    area('Square units', 'µm × µm gives µm².', 'length unit × length unit', 'If the length and width are in µm, the area is in square micrometres. We write this as µm². For example, 5 µm × 1 µm = 5 µm².'),
    area('Only an estimate', 'The curved shape does not fill the rectangle exactly.', '≈ means about equal', 'The curved shape does not exactly fill the rectangle. So the answer is close, but not exact. An answer like this is called an estimate. We write ≈, which means about equal.'),
    area('Put it together', 'Fit a rectangle, multiply, write µm² and ≈.', 'rectangle → length × width → ≈ µm²', 'Fit a rectangle closely around the curved part. Multiply its length by its width. Write the unit as µm², and use ≈ because the answer is an estimate. Next, you will prepare a slide, look at real cells with a light microscope and draw them.'),
  ],
}
