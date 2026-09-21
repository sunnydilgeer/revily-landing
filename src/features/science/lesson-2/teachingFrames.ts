export type MicroscopyFrame = { label: string; summary: string; cue: string; text: string; diagram: 'microscopy'; focus: string }
const frame = (label: string, summary: string, cue: string, text: string, focus: string): MicroscopyFrame => ({ label, summary, cue: 'Think: ' + cue, text, diagram: 'microscopy', focus })
export const microscopyFrames: Record<string, MicroscopyFrame[]> = {
  'B2-02': [
    frame('Meet a light microscope', 'Light microscopes let us see cells that are too small to see clearly by eye.', 'look at a tiny specimen', 'The material you examine is called the specimen. A light microscope uses light and lenses to produce an enlarged image of it. It can show whole cells and some structures inside them.', 'light'),
    frame('The light source', 'Light passes through the specimen on the slide.', 'light → specimen → lenses', 'A slide is a thin piece of glass that holds the specimen. The light source below the slide shines through it, allowing you to see the specimen through the lenses.', 'light-source'),
    frame('The objective and eyepiece', 'Two lenses enlarge the image.', 'multiply the two magnifications', 'The objective lens is near the specimen. The eyepiece is the lens you look through. Their magnifications multiply: a ×10 objective and a ×10 eyepiece give ×100 overall, not ×20.', 'light-lenses'),
    frame('The stage', 'A platform holds the slide beneath the objective.', 'hold the slide in place', 'The stage supports the slide, and a clip holds it still. The specimen sits over an opening so light can pass through it. Keeping it in place makes it easier to study the cells.', 'light-stage'),
    frame('The focusing controls', 'Focus changes how sharp the image looks.', 'sharp image, not just a big image', 'Focusing controls adjust the distance between the lens and specimen. At the correct distance, features look sharp instead of blurred. Changing focus is different from increasing magnification.', 'light-focus'),
  ],
  'B2-04': [
    frame('What does magnification mean?', 'Magnification tells you how many times larger the image is than the specimen.', 'image size compared with real size', 'At ×100 magnification, a cell’s image is 100 times its real size along the same dimension. The image is enlarged so you can inspect the cell; the real cell does not grow.', 'magnification'),
    frame('A bigger image, the same cell', 'Enlarging a picture changes the image size, not the actual size.', 'the specimen stays the same', 'Compare these two images of the same cell. The larger image takes up more space, but represents the same cell and the same structures. Magnification describes the enlargement of the image.', 'magnification-large'),
  ],
  'B2-06': [
    frame('What does resolution mean?', 'Resolution is the ability to tell two close points apart.', 'two points or one patch?', 'Imagine two small features very close together. If the microscope cannot resolve them, they look like one blurred patch. A microscope with better resolution can show them as two separate features.', 'resolution-low'),
    frame('Higher resolution shows more detail', 'Features that merged into one patch can now be seen separately.', 'closer points can be told apart', 'Look at the two distinct features in this illustration. Better resolution lets scientists distinguish structures that are close together. This is about separating detail, not just making the image larger.', 'resolution-high'),
    frame('Magnification is not resolution', 'Making a blur bigger does not reveal the missing detail.', 'bigger ≠ more detailed', 'Enlarging a blurred image gives you a larger blur. Magnification changes image size; resolution determines whether nearby features can be seen separately. A useful microscope needs both enlargement and detail.', 'resolution-zoom'),
  ],
  'B2-08': [
    frame('Meet an electron microscope', 'It uses a beam of electrons instead of light.', 'a different way to form an image', 'Electron microscopes are scientific instruments used to investigate very small structures. Like a light microscope, they produce images of specimens, but they use electrons rather than visible light.', 'electron'),
    frame('See smaller cell structures', 'Electron microscopes have greater magnification and resolution.', 'more enlargement and finer detail', 'Their greater resolving power means they can tell more closely spaced features apart. Combined with higher magnification, this lets scientists study smaller sub-cellular structures in greater detail.', 'electron-detail'),
    frame('Better images, better understanding', 'Improved microscopes revealed structures that earlier tools could not show clearly.', 'extra detail → better understanding', 'Scientists could investigate more of the structures inside cells as microscope technology improved. The structures were already there: better tools made them easier to distinguish and study.', 'electron-history'),
  ],
  'B2-09': [
    frame('Compare the two instruments', 'Both microscopes produce enlarged images of specimens.', 'light versus electrons', 'A light microscope uses light and lenses. An electron microscope uses a beam of electrons. Both help scientists study specimens that are too small to see clearly by eye.', 'microscope-comparison'),
    frame('Which shows finer detail?', 'Electron microscopes have greater magnification and resolving power.', 'magnification = size; resolution = detail', 'A school light microscope can show some structures, such as a stained nucleus. An electron microscope can distinguish much smaller structures. Increasing the size of a light-microscope image alone does not supply that extra detail.', 'microscope-comparison-detail'),
  ],
  'B2-12': [
    frame('Image size and real size', 'Image size measures the picture; real size measures the specimen.', 'picture versus actual cell', 'A picture of a cell might be 12 mm wide even though the cell itself is only 0.03 mm wide. The image is much larger than the real cell. Use the sizes given in a question, not a ruler held against this screen.', 'sizes'),
    frame('Calculate magnification', 'Magnification = image size ÷ real size.', 'match the units, then divide', 'The two sizes must have the same units. For example, 12 mm ÷ 0.03 mm = 400, so the image is ×400. Magnification is a comparison of sizes, not a length, so it has no mm or µm unit.', 'formula'),
  ],
  'B2-15': [
    frame('Why do the units need to match?', '1 millimetre = 1000 micrometres.', 'compare like with like', 'A micrometre (µm) is one thousandth of a millimetre. You cannot directly compare a number of mm with a number of µm: they count different-sized units. Convert one measurement before dividing.', 'units'),
    frame('Convert before calculating', '30 µm ÷ 1000 = 0.03 mm.', 'µm ÷ 1000 → mm', 'You can put both sizes in mm, or both in µm. Either method gives the same magnification. For example, 18 mm ÷ 0.03 mm and 18 000 µm ÷ 30 µm both give ×600.', 'units-convert'),
  ],
  'B2-18': [
    frame('Find the real size', 'Real size = image size ÷ magnification.', 'undo the enlargement', 'If an image is 500 times the real size, divide its size by 500 to find the specimen’s size. For example, an image 15 mm wide at ×500 represents a cell 0.03 mm wide.', 'real-size'),
    frame('Check the answer’s size and unit', 'A magnified image should be larger than the specimen it represents.', 'calculate, then convert if needed', 'Dividing an image size in mm gives a real size in mm. If the question asks for µm, convert afterwards: 0.03 mm × 1000 = 30 µm. Check both the number and the requested unit.', 'real-size-check'),
  ],
  'B2-20': [
    frame('Find the image size', 'Image size = real size × magnification.', 'apply the enlargement', 'To make an image 250 times the real width, multiply the real width by 250. A cell 0.04 mm wide has an image 10 mm wide at ×250: 0.04 × 250 = 10.', 'image-size'),
    frame('Keep track of the units', 'The calculated image size starts in the same unit as the real size.', 'multiply, then check the unit', 'If you multiply a size in µm by the magnification, the answer is in µm. Divide by 1000 to convert that answer to mm if the question asks for mm. Magnification itself has no length unit.', 'image-size-check'),
  ],
  'B2-23': [
    frame('What is standard form?', 'A number from 1 to less than 10 is multiplied by a power of ten.', 'a × 10ⁿ', 'Standard form is a compact way to write very large or small numbers. For a measurement, keep its unit too. For example, 0.003 mm can be written as 3 × 10⁻³ mm.', 'standard'),
    frame('A negative power means a small decimal', '10⁻³ = 0.001, or one thousandth.', '3 × 0.001 = 0.003', 'The negative power tells you to divide by a power of ten. Here 3 × 10⁻³ means 3 ÷ 1000 = 0.003. It does not mean the measurement is negative.', 'standard-negative'),
  ],
}
