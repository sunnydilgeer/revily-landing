export type PracticalFrame = { label: string; summary: string; cue: string; text: string; diagram: 'practical'; focus: string }
const f = (label: string, summary: string, cue: string, text: string, focus: string): PracticalFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'practical', focus })
export const practicalFrames: Record<string, PracticalFrame[]> = {
  'B3-02': [
    f('Get your equipment ready', 'A thin specimen sits between a slide and coverslip.', 'small sample, clear glass', 'For this onion example: a teacher-prepared onion piece, tweezers, clean slide, coverslip, water, iodine stain and a light microscope. A mounted needle can help lower the coverslip under teacher guidance.', 'equipment'),
    f('Protect eyes and handle glass carefully', 'Follow your teacher’s safety instructions.', 'stain and glass need care', 'Wear eye protection when handling iodine. Avoid skin and eye contact and never taste laboratory materials. Handle glass and pointed tools carefully; tell your teacher about breakage and never pick up shards by hand.', 'safety'),
    f('Practise with your teacher', 'Real microscope work needs supervision and a risk assessment.', 'online preparation, supervised practice', 'Use prepared onion pieces rather than cutting them here. Carry a microscope with one hand on its arm and the other supporting its base. This online lesson prepares you for lab work; it does not complete required practical 1.', 'carry'),
  ],
  'B3-04': [
    f('Start with a clean slide', 'Add a small drop of water to the centre.', 'a wet mount', 'A wet mount holds the tissue in liquid. Start with clean glass so dirt does not obscure your specimen.', 'slide-water'),
    f('Peel a very thin layer', 'Use tweezers to lift the clear inner onion skin.', 'one thin epidermal layer', 'Take a small piece of epidermis from the inner surface of a teacher-prepared onion layer. A thick chunk is hard for light to pass through.', 'slide-peel'),
    f('Spread the tissue flat', 'Place the thin skin into the water.', 'no folds or overlaps', 'Use tweezers to spread the tissue gently. Overlapping layers make it harder to distinguish individual cells.', 'slide-flat'),
    f('Add iodine stain', 'The stain increases contrast.', 'easier to distinguish structures', 'Add a small amount as directed by your teacher. Iodine makes some structures easier to distinguish; it does not magnify them or make every structure visible.', 'slide-stain'),
    f('Lower the coverslip at an angle', 'Touch one edge to the liquid, then lower it gently.', 'let air escape', 'Use a mounted needle if your teacher demonstrates it. Lowering slowly at an angle reduces trapped air bubbles. Do not press hard on the glass.', 'slide-cover'),
    f('Check the finished slide', 'The tissue should be flat beneath the coverslip.', 'ready for the stage', 'Use filter paper to absorb excess liquid around the coverslip edge if needed. Follow your teacher’s instructions for handling and disposal.', 'slide-ready'),
  ],
  'B3-08': [
    f('Secure and illuminate the slide', 'Clip it onto the stage, with the specimen over the light.', 'light through the specimen', 'Place the microscope on a stable surface. Adjust the light as demonstrated so the specimen is illuminated.', 'scope-stage'),
    f('Start with the lowest-power objective', 'A wider view makes cells easier to find.', 'find first, enlarge later', 'Select the lowest objective magnification, commonly ×4. The eyepiece and objective magnifications multiply: ×10 and ×4 give ×40 overall.', 'scope-low'),
    f('Watch from the side when moving closer', 'Never let the objective touch the slide.', 'protect the lens and glass', 'At low power, use coarse focus as demonstrated to bring the objective close to the slide while watching the gap from the side. Stop before contact. Different microscopes move different parts.', 'scope-side'),
    f('Move away to find rough focus', 'Look through the eyepiece and slowly increase the gap.', 'away from glass', 'At low power, slowly turn coarse focus to increase the lens–slide distance until cells come roughly into focus. Do not drive the lens towards the glass while looking through the eyepiece.', 'scope-coarse'),
    f('Use fine focus for a sharp view', 'Make small adjustments once cells are visible.', 'sharp, not just larger', 'Fine adjustment makes small changes to focus. Centre the cells you want to study before changing objective.', 'scope-fine'),
    f('Increase magnification carefully', 'Switch objective, then use fine focus.', 'fine focus at high power', 'A higher objective shows a smaller area in greater magnification. Use fine adjustment at high power, not large coarse movements. Follow your teacher’s instructions for your microscope.', 'scope-high'),
  ],
  'B3-12': [
    f('If the view is blank', 'Check the light and where the specimen sits.', 'start with the simple checks', 'Return to the lowest objective and check illumination. Make sure the specimen is over the stage opening; do not assume a blank view means there are no cells.', 'blank'),
    f('If cells are visible but blurred', 'Adjust focus rather than just making the image bigger.', 'small fine-focus changes', 'Once cells are roughly in focus, use fine adjustment for a sharper image. Higher magnification alone does not correct poor focus.', 'blur'),
    f('If circles or overlapping layers obscure cells', 'Bubbles and folds may be the problem.', 'improve the slide', 'Air bubbles can appear as circles with dark edges. Folds overlap tissue. Ask your teacher about remaking the slide with flat tissue and an angled coverslip.', 'bubbles'),
  ],
  'B3-14': [
    f('Look at the onion cells', 'The cells form a sheet, often with box-like outlines.', 'a tissue, not a single cartoon cell', 'This is an illustrated example, not a micrograph. Real appearance depends on the specimen, stain, focus and microscope.', 'onion'),
    f('Identify features you can distinguish', 'Cell walls form the outlines; stained nuclei may be visible.', 'visible evidence first', 'In this example a cell wall, stained nucleus and some cytoplasm can be distinguished. Not every structure is visible in every cell. Onion-bulb epidermal cells normally have no chloroplasts.', 'onion-features'),
    f('Do not add invisible textbook structures', 'Record what the specimen actually shows.', 'observations, not guesses', 'A plant-cell diagram lists structures a cell may contain. Your practical drawing records visible features; do not add mitochondria, ribosomes or chloroplasts just because they appear in a textbook model.', 'onion-observe'),
  ],
  'B3-15': [
    f('Now observe a prepared animal-cell slide', 'A teacher-provided slide gives a separate animal example.', 'plant and animal observations', 'Required practical 1 includes both plant and animal cells. Use a prepared stained animal-cell slide provided by your teacher; this lesson does not ask you to collect cells from your body.', 'animal'),
    f('Draw the visible animal-cell features', 'A stained nucleus and cell outline may be distinguished.', 'no cell wall', 'The outline marks the cell boundary; a distinct membrane thickness may not be resolved. Animal cells have no cell wall. Label only what you can distinguish in your actual view.', 'animal-features'),
  ],
  'B3-16': [
    f('Make a clear biological drawing', 'Use a sharp pencil and make it large enough to read.', 'clear proportions', 'Draw a few representative cells with their relative sizes and shapes. A drawing need not fill the page, but small crowded features are hard to label.', 'drawing-outline'),
    f('Use clean, single outlines', 'Do not shade or colour in the cells.', 'lines, not decoration', 'Use smooth, thin lines for visible features. Avoid sketchy repeated strokes, heavy shading and invented structures.', 'drawing-clean'),
    f('Add straight label lines', 'Keep labels readable and do not cross the lines.', 'each line reaches its feature', 'Use a ruler for label lines. Point to the actual feature and arrange labels so lines do not cross. This drawing labels a wall and a nucleus visible in the example.', 'drawing-labels'),
    f('Record the title, magnification and scale', 'Make the size information meaningful.', 'a drawing records evidence', 'Include a specimen title and the microscope magnification used for observation. Add a calibrated scale bar or calculate drawing magnification from measured real size. The microscope magnification is not automatically the drawing magnification.', 'drawing-record'),
  ],
  'B3-19': [
    f('Use a calibrated measurement', 'A known field width can estimate a cell’s real size.', 'known width ÷ number of cells', 'Suppose a calibrated field is 1.2 mm wide and four similar cells fit end to end across it. Estimate one cell’s length: 1.2 ÷ 4 = 0.3 mm = 300 µm. This assumes similar lengths and full coverage of the diameter.', 'measure-field'),
    f('A scale bar represents real size', 'Keep the bar and drawing in proportion.', '100 µm means actual length', 'Use a calibrated graticule, field width or supplied real-size measurement. Do not invent a scale from an uncalibrated screen image. In this illustrated example a 300 µm cell is three times the length of a 100 µm scale bar.', 'measure-scale'),
    f('Drawing and microscope magnification differ', 'Your pencil drawing can have its own enlargement.', 'drawing size ÷ real size', 'Microscope magnification = eyepiece × objective. Drawing magnification = drawing length ÷ actual length, using matching units. Measure the paper drawing and use a calibrated real length, not the responsive artwork on this screen.', 'measure-drawing'),
  ],
}
