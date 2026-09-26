import type { TeachingFrame } from '../teachingFrame'

// One route: see a cell bigger → how much bigger → how much detail → electrons for finer detail.
// One new word per screen. Plain meaning first, then the term. Visuals: components/MicroscopyVisuals.tsx.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'microscopy', focus })

export const microscopyFrames: Record<string, TeachingFrame[]> = {
  'B2-02': [
    f('Meet a light microscope', 'It uses light and lenses to show tiny things.', 'too small to see → use a microscope', 'Cells are too small to see with your eyes. A light microscope shines light through a thin sample. Lenses then make a bigger picture of it. The sample you look at is called the specimen.', 'light'),
    f('The stage', 'The slide sits on a flat platform with a hole in it.', 'light comes up through the hole', 'The specimen sits on a glass slide. The slide rests on a flat platform with a hole in the middle. A lamp underneath shines light up through the hole and the specimen. This platform is called the stage.', 'light-stage'),
    f('The objective lens', 'A lens just above the specimen makes the first bigger picture.', 'the lens nearest the specimen', 'Just above the stage is a lens close to the specimen. It makes the first bigger picture. It is called the objective lens. Most microscopes have several, so you can switch between them.', 'light-lenses'),
    f('The eyepiece', 'You look through a second lens at the top.', 'the lens nearest your eye', 'At the top is the lens you put your eye to. It makes the picture bigger again. It is called the eyepiece.', 'light-lenses'),
    f('The focusing controls', 'Knobs make a blurred picture sharp.', 'sharp, not bigger', 'Turning the knobs changes the gap between the lens and the slide. At the right gap, the picture is sharp. These knobs are called the focusing controls. Focusing makes the picture sharp. It does not make it bigger.', 'light-focus'),
    f('Put it together', 'Light passes up through the specimen, then through two lenses to your eye.', 'lamp → specimen → objective → eyepiece → eye', 'Light shines up through the specimen on the stage. The objective lens makes a bigger picture. The eyepiece makes it bigger again. Then you turn the focusing controls until the picture is sharp.', 'light'),
  ],
  'B2-04': [
    f('The image', 'What you see is a picture of the specimen.', 'picture, not the real thing', 'When you look down a microscope, you do not see the real cell at its real size. You see a bigger picture of it. This picture is called the image.', 'magnification'),
    f('How many times bigger?', 'Magnification says how many times bigger the image is.', '×100 → 100 times wider', 'If the image is 100 times wider than the real cell, we write ×100. How many times bigger the image is than the real thing is called magnification.', 'magnification-large'),
    f('The real cell stays the same', 'Only the image gets bigger.', 'bigger picture, same cell', 'Both pictures show the same cell. One image is bigger than the other. The real cell has not grown, and it has not gained any new parts.', 'magnification-large'),
    f('Multiply the two lenses', 'Eyepiece × objective gives the total magnification.', 'multiply, do not add', 'Each lens has its own magnification. Multiply them together, for example ×10 eyepiece and ×4 objective: 10 × 4 = 40. So the image is 40 times bigger. This is called the total magnification.', 'light-lenses'),
    f('Put it together', 'The objective makes the image bigger, then the eyepiece makes it bigger again.', 'total = eyepiece × objective', 'The objective lens enlarges the specimen. The eyepiece enlarges that image again. So the total magnification is eyepiece × objective. The real cell stays the same size all the time.', 'light'),
  ],
  'B2-06': [
    f('Two dots or one?', 'Close things can merge into one blurred patch.', 'too close → one blur', 'Two tiny parts of a cell may sit very close together. Through a microscope, they can look like one blurred patch. Then you cannot tell there are two.', 'resolution-low'),
    f('Seeing them apart', 'Resolution is how well you can see close things as separate.', 'two dots, not one patch', 'A better microscope shows the two parts as two separate dots. Seeing two close points as separate is called resolution. Higher resolution shows finer detail.', 'resolution-high'),
    f('Resolving power', 'Some microscopes can separate closer points than others.', 'closer points apart → more resolving power', 'Some microscopes can separate points that are closer together than others can. How well a microscope does this is called its resolving power. Greater resolving power gives higher resolution.', 'resolution-high'),
    f('Bigger is not clearer', 'A bigger blur is still a blur.', 'bigger ≠ more detail', 'Magnification makes the image bigger. It does not split one blurred patch into two dots. Making a blurred image bigger only gives you a bigger blur.', 'resolution-zoom'),
    f('Put it together', 'Magnification is about size. Resolution is about detail.', 'size and detail are different', 'Magnification tells you how many times bigger the image is. Resolution tells you how much detail you can see. To see tiny parts clearly, a microscope needs both.', 'resolution-high'),
  ],
  'B2-08': [
    f('A beam of electrons', 'Some microscopes use electrons instead of light.', 'electrons instead of light', 'Electrons are tiny particles, much smaller than atoms. Some microscopes use a beam of electrons instead of light to make an image. This kind of microscope is called an electron microscope.', 'electron'),
    f('Much more detail', 'Electron microscopes have higher magnification and higher resolution.', 'bigger and clearer', 'An electron microscope can magnify far more than a light microscope. It also has much greater resolving power. So it shows tiny parts clearly that a light microscope shows as a blur.', 'electron-detail'),
    f('Compare the two', 'Both make images bigger, but only one shows the tiniest parts.', 'light → cells; electrons → tiny parts', 'A light microscope can show whole cells and a stained nucleus. An electron microscope can show much smaller parts, such as ribosomes. The parts inside a cell are called sub-cellular structures.', 'microscope-comparison'),
    f('Seeing more, learning more', 'Better microscopes helped scientists understand cells.', 'more detail → better understanding', 'Electron microscopes let scientists see sub-cellular structures in fine detail. So scientists could study how these parts are built and what they do. The microscopes revealed these parts; they did not create them.', 'electron-history'),
    f('Put it together', 'Light shows cells. Electrons show the tiny parts inside them.', 'light vs electron', 'A light microscope uses light and can show cells. An electron microscope uses electrons. It has higher magnification and resolution, so it shows sub-cellular structures in detail. Next, you will use magnification to work out the real size of a cell.', 'microscope-comparison-detail'),
  ],
}
