import type { TeachingFrame } from '../../teachingFrame'

// Working Scientifically: measuring pH and the size of a cell. Examples come from Chemistry and Biology.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const wsPhCellFrames: Record<string, TeachingFrame[]> = {
  'W15-02': [
    f('An indicator', 'An indicator is a dye that changes colour in an acid or an alkali. Add just a couple of drops.', 'a dye that changes colour', 'An indicator is a dye. It changes colour depending on whether it is in an acid or an alkali. Add a couple of drops to the solution you want to test.', 'wsphcell-indicator'),
    f('Universal indicator', 'Universal indicator changes colour gradually as the pH changes. You can use its colour to estimate the pH.', 'gradual colour change', 'Universal indicator is a mixture of indicators. It does not change colour suddenly. Its colour changes gradually as the pH changes, so you can use the colour to estimate the pH.', 'wsphcell-universal'),
    f('Indicator paper', 'Indicator paper is a strip of paper that has indicator in it. It suits solutions that are already coloured.', 'spot a drop on a strip', 'Indicator paper is a strip of paper that contains indicator. Spot a little solution onto it and the paper changes colour. It is useful when you do not want to change the colour of the whole solution, or when it is already coloured.', 'wsphcell-paper'),
    f('Litmus and gas samples', 'Litmus paper turns red in acid and blue in alkali. Damp indicator paper can test a gas.', 'red for acid, blue for alkali', 'Litmus paper is a common indicator paper. It turns red in acidic conditions and blue in alkaline conditions. You can test a gas by holding a piece of damp indicator paper in a sample of it.', 'wsphcell-litmus'),
    f('The pH probe', 'A pH probe measures pH electronically. It is more accurate than an indicator.', 'a number on a meter', 'A pH probe measures pH electronically and shows a number on a meter. It is more accurate than an indicator. Choose it when you need an accurate pH value.', 'wsphcell-probe'),
  ],
  'W15-06': [
    f('Set up the ruler', 'Clip a clear ruler and the slide onto the stage. Choose the lens for a total magnification of ×100, then focus.', 'ruler on the slide', 'Place a clear ruler on top of the microscope slide. Clip the ruler and slide onto the stage. Choose the objective lens that gives a total magnification of ×100. Use the focus knobs until you can see the cells clearly.', 'wsphcell-setup'),
    f('Count the cells along 1 mm', 'Line the cells up along 1 mm on the ruler, then count them.', 'line up, then count', 'Move the ruler so that the cells are lined up along 1 mm. Then count the number of cells along that 1 mm. Each cell is the same length, so the cells share out the 1 mm equally.', 'wsphcell-count'),
    f('Change millimetres to micrometres', 'The unit for a cell is the micrometre, µm. 1 mm is the same as 1000 µm.', '1 mm = 1000 µm', 'Cells are so small that we measure them in micrometres. The symbol is µm. 1 mm is the same as 1000 µm. So you can put the number of cells straight into the formula.', 'wsphcell-units'),
    f('The formula', 'Length of a cell (µm) = 1000 µm ÷ the number of cells counted along 1 mm.', 'share 1000 µm between the cells', 'To find the length of one cell, share 1000 µm between the cells you counted. The formula is length of a cell (µm) = 1000 µm ÷ number of cells counted in 1 mm. More cells in 1 mm means each cell is smaller.', 'wsphcell-formula'),
  ],
}
