export type MicroscopyFrame = { label: string; summary: string; cue: string; text: string; diagram: 'microscopy'; focus: string }
const frame = (label: string, summary: string, cue: string, text: string, focus: string): MicroscopyFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'microscopy', focus })
export const microscopyFrames: Record<string, MicroscopyFrame[]> = {
  'B2-02': [
    frame('Meet a light microscope', 'Light and lenses help us see tiny specimens.', 'a whole instrument', 'A specimen is the material being examined. A light microscope can show cells and some of their structures.', 'light'),
    frame('Light travels through the specimen', 'The light source illuminates the slide.', 'light through the slide', 'The specimen sits on a glass slide above the light source.', 'light-source'),
    frame('Two lenses magnify the image', 'The objective and eyepiece work together.', 'multiply the lens magnifications', 'An eyepiece of ×10 and an objective of ×10 give a total magnification of ×100.', 'light-lenses'),
    frame('The stage supports the slide', 'The slide rests on a platform beneath the objective.', 'keep the specimen in place', 'The stage holds the slide in position while it is viewed.', 'light-stage'),
    frame('Focus makes the image sharp', 'Focusing controls adjust the lens-to-specimen distance.', 'sharp, not just bigger', 'Changing focus is different from changing magnification. Practical microscope technique comes in the next lesson.', 'light-focus'),
  ],
  'B2-04': [
    frame('Magnification makes an image bigger', 'The image is larger than the real specimen.', 'bigger image, same cell', 'Magnification tells us how many times larger the image is than the actual object.', 'magnification'),
    frame('The cell has not grown', 'Only its displayed image has become larger.', 'image size versus real size', 'These are illustrative drawings of the same cell. Enlarging an image does not make the real cell bigger.', 'magnification-large'),
  ],
  'B2-06': [
    frame('Resolution is about distinguishing detail', 'Can you tell two close points apart?', 'two points, not one blur', 'Resolution is the ability to distinguish two close points as separate.', 'resolution-low'),
    frame('Higher resolution reveals separate features', 'Two close features can now be distinguished.', 'more detail', 'This illustration shows two separate features rather than one merged patch. It is a diagram, not a micrograph.', 'resolution-high'),
    frame('Bigger does not always mean clearer', 'Enlarging a blur does not reveal missing detail.', 'magnification ≠ resolution', 'Magnification changes image size. Resolution determines whether close points can be distinguished.', 'resolution-zoom'),
  ],
  'B2-08': [
    frame('Meet an electron microscope', 'It uses a beam of electrons rather than light.', 'a different instrument', 'This is a simplified instrument schematic, not a photograph or a guide to operating it.', 'electron'),
    frame('It can study much finer detail', 'Electron microscopes have greater resolving power.', 'smaller structures', 'Their higher magnification and resolution let scientists study sub-cellular structures in greater detail than light microscopes.', 'electron-detail'),
    frame('Better tools changed our understanding', 'Improved microscopes revealed more cell structures.', 'technology opens a closer view', 'Developments in microscopy helped scientists investigate structures that earlier microscopes could not distinguish.', 'electron-history'),
  ],
  'B2-09': [
    frame('Now compare the two microscopes', 'Both produce magnified images of specimens.', 'two tools, different capabilities', 'A light microscope uses light. An electron microscope uses electrons.', 'microscope-comparison'),
    frame('Electron microscopes resolve more detail', 'They have higher magnification and resolving power.', 'size and detail are different', 'A school light microscope can show some cell structures, such as a stained nucleus. Much smaller structures require greater resolving power.', 'microscope-comparison-detail'),
  ],
  'B2-12': [
    frame('Image size and real size are different', 'One measures the image; the other measures the specimen.', 'picture versus actual object', 'Use dimensions supplied in the question. Do not measure a responsive drawing on your screen.', 'sizes'),
    frame('Calculate magnification', 'Divide image size by real size.', 'same units first', 'Magnification = image size ÷ real size. The two sizes must use the same units. Magnification has no length unit; write it as ×400, for example.', 'formula'),
  ],
  'B2-15': [
    frame('Match the units before dividing', '1 millimetre = 1000 micrometres.', 'mm × 1000 → µm', 'A micrometre is written µm. Millimetres and micrometres must not be divided as though they were the same unit.', 'units'),
    frame('Convert in either direction', '30 µm = 0.03 mm.', 'µm ÷ 1000 → mm', 'You can convert both sizes to mm or both to µm. Matching units gives the same magnification either way.', 'units-convert'),
  ],
  'B2-18': [
    frame('Find the real size', 'Divide image size by magnification.', 'undo the enlargement', 'Real size = image size ÷ magnification. The answer keeps the unit of the supplied image size.', 'real-size'),
    frame('Check that the answer makes sense', 'The real specimen is smaller than its magnified image.', 'smaller actual object', 'For example, dividing by ×500 makes the size 500 times smaller. Convert the result if the question asks for a different unit.', 'real-size-check'),
  ],
  'B2-20': [
    frame('Find the image size', 'Multiply real size by magnification.', 'enlarge the actual size', 'Image size = real size × magnification. The answer keeps the unit of the supplied real size.', 'image-size'),
    frame('Keep track of the requested unit', 'An image-size answer may need converting.', 'calculate, then check the unit', 'If real size is supplied in µm, your image-size result is in µm. Convert to mm if requested.', 'image-size-check'),
  ],
  'B2-23': [
    frame('Write small measurements in standard form', 'Use a number from 1 to less than 10, times a power of ten.', 'a × 10ⁿ', 'Standard form is useful for very small cell measurements. Keep the unit with the number.', 'standard'),
    frame('Small decimals use negative powers', '0.003 mm = 3 × 10⁻³ mm.', 'three thousandths', '10⁻³ means 0.001. Multiplying it by 3 gives 0.003. Check the value, not just how the notation looks.', 'standard-negative'),
  ],
}
