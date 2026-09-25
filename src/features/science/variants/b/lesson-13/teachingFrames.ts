import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Big idea: blood is a tissue — a liquid carrying three kinds of cell part, each with one job.
// One new word per frame. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const bloodFrames: Record<string, TeachingFrame[]> = {
  'B13-02': [
    f('A drop of blood', 'Most of blood is a pale yellow liquid called plasma.', 'what do the cells float in?', 'Blood looks red, but most of it is a pale yellow liquid. This liquid is called plasma. Cells float in it and are carried around the body.', 'blood-components'),
    f('Three kinds of cell part', 'Red blood cells, white blood cells and platelets float in plasma.', 'different part → different job', 'Three things float in plasma: red blood cells, white blood cells and platelets. Each has its own job. Because these parts work together, blood is a tissue. (You met tissues in Lesson 7.)', 'blood-components'),
  ],
  'B13-04': [
    f('Red cells carry oxygen', 'Red blood cells are packed with haemoglobin, which carries oxygen.', 'lungs → body cells', 'Red blood cells carry oxygen from the lungs to body cells. They are packed with a red protein called haemoglobin. Oxygen joins onto haemoglobin in the lungs. It is let go where cells need it.', 'blood-red-haemoglobin'),
    f('A dished shape', 'A biconcave shape gives a large surface area.', 'shape → surface area', 'A red blood cell is dished in on both sides. This shape is called biconcave. It gives a large surface area, so oxygen moves in and out quickly.', 'blood-red-shape'),
    f('No nucleus', 'No nucleus leaves more room for haemoglobin.', 'more room → more oxygen', 'Red blood cells have no nucleus. This leaves more room inside for haemoglobin. More haemoglobin means more oxygen can be carried.', 'blood-red-cell'),
  ],
  'B13-08': [
    f('Defending the body', 'White blood cells defend the body against pathogens.', 'microorganisms that cause disease', 'Some microorganisms cause disease. These are called pathogens. White blood cells defend the body against pathogens. Unlike red blood cells, they have a nucleus.', 'blood-white-cell'),
    f('Surround and swallow', 'Some white blood cells engulf pathogens.', 'change shape → swallow', 'Some white blood cells change shape to surround a pathogen. They swallow it and digest it. This is called engulfing.', 'blood-white-engulf'),
    f('Making antibodies', 'Other white blood cells make antibodies.', 'small molecules that stick', 'Other white blood cells make antibodies. Antibodies are small molecules that stick to pathogens. You will learn more about defence in Lesson 19.', 'blood-white-antibody'),
  ],
  'B13-10': [
    f('Tiny pieces of cells', 'Platelets are tiny pieces of cells with no nucleus.', 'smaller than a whole cell', 'Platelets are tiny pieces of cells. They have no nucleus.', 'blood-platelet'),
    f('Sealing a cut', 'Platelets help a clot form at a cut.', 'cut → plug', 'At a cut, platelets help the blood make a plug. This plug is called a clot. The clot stops blood loss. It also stops microorganisms getting in.', 'blood-platelet'),
  ],
  'B13-12': [
    f('The carrier', 'Plasma carries cells, platelets and dissolved substances.', 'the liquid carries everything', 'Plasma carries the cells and platelets. It also carries substances dissolved in it. Dissolved means mixed in so well you cannot see them.', 'blood-plasma'),
    f('Useful substances', 'Plasma carries glucose, amino acids and hormones.', 'from where it is made → to where it is used', 'Glucose and amino acids go from the small intestine to body cells. Hormones are chemical messages. Plasma carries them from glands to other organs.', 'blood-plasma-useful'),
    f('Waste', 'Plasma carries urea and carbon dioxide away to be removed.', 'waste → the organ that removes it', 'Urea is a waste made in the liver. Plasma carries it to the kidneys, which remove it. Carbon dioxide is carried from body cells to the lungs.', 'blood-plasma-waste'),
  ],
}
