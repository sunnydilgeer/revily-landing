import type { TeachingFrame } from '../../teachingFrame'

// One compound per idea, kept on screen while it is built up: carbon dioxide for adding atoms (no brackets, one small
// number), magnesium hydroxide for brackets, then magnesium oxide for percentage mass (the simplest formula, so the
// new idea is the only hard part).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const formulaMassFrames: Record<string, TeachingFrame[]> = {
  'C18-02': [
    f('Relative atomic mass', 'Each element’s box in the periodic table gives its relative atomic mass.', 'periodic table box → top number → Aᵣ', 'You met relative atomic mass when you learned about atoms. It tells you how heavy an element’s atoms are compared with other atoms. Its symbol is Aᵣ. In the periodic table, it is the top number in each element’s box. Carbon’s Aᵣ is 12 and oxygen’s is 16.', 'mr-co2-tiles'),
    f('Adding up the atoms', 'Add the Aᵣ of every atom in the formula.', 'every atom → its Aᵣ → add them all', 'A molecule of carbon dioxide, CO₂, has one carbon atom and two oxygen atoms. Write the Aᵣ under each atom: 16, 12 and 16. Then add them all up: 16 + 12 + 16 = 44. This total is called the relative formula mass. Its symbol is Mᵣ.', 'mr-co2-add'),
    f('Using the small numbers', 'A small number tells you how many times to count that Aᵣ.', 'O₂ in the formula → 2 × 16', 'The small 2 in CO₂ means there are two oxygen atoms. So instead of adding 16 twice, you can multiply: 2 × 16 = 32. Then add the carbon: 12 + 32 = 44. Both ways give the same Mᵣ.', 'mr-co2-multiply'),
    f('Put it together', 'Three steps give the relative formula mass of any compound.', 'look up → count → multiply and add', 'First, look up the Aᵣ of each element in the periodic table. Next, count how many atoms of each element are in the formula. Then multiply each Aᵣ by its number of atoms, and add the answers. For CO₂, Mᵣ = 12 + (2 × 16) = 44.', 'mr-co2-method'),
  ],
  'C18-06': [
    f('Brackets', 'A small number after a bracket multiplies everything inside it.', 'Mg(OH)₂ → 1 Mg, 2 O, 2 H', 'You met brackets when you learned to read formulas. Magnesium hydroxide is Mg(OH)₂. The small 2 after the bracket doubles everything inside it. So there is 1 magnesium atom, 2 oxygen atoms and 2 hydrogen atoms.', 'mr-bracket-count'),
    f('Inside the bracket first', 'Add up the atoms inside the bracket.', 'one OH → 16 + 1 = 17', 'The Aᵣ values are Mg = 24, O = 16 and H = 1. Start inside the bracket. One OH group has one oxygen atom and one hydrogen atom. So one OH group adds up to 16 + 1 = 17.', 'mr-bracket-inside'),
    f('Then multiply', 'Multiply the bracket total by the small number after it.', 'two OH groups → 2 × 17 = 34', 'The small 2 means there are two OH groups. So multiply the bracket total by 2: 2 × 17 = 34. This is the mass of both OH groups together.', 'mr-bracket-times'),
    f('Put it together', 'Add the bracket total to the rest of the formula.', 'Mg + two OH → 24 + 34 = 58', 'Now add the magnesium: 24 + 34 = 58. So the Mᵣ of Mg(OH)₂ is 58. A common mistake is to double only the hydrogen, which gives 24 + 16 + 2 = 42. The 2 doubles the oxygen too.', 'mr-bracket-total'),
  ],
  'C18-09': [
    f('A share of the mass', 'Each element makes up part of a compound’s Mᵣ.', 'Mᵣ 40 → magnesium 24, oxygen 16', 'Magnesium oxide is MgO. The Aᵣ values are Mg = 24 and O = 16, so its Mᵣ is 24 + 16 = 40. Of that 40, magnesium makes up 24 and oxygen makes up 16. So more than half of the mass is magnesium.', 'mr-pc-share'),
    f('Percentage mass', 'One element’s share of the mass, written as a percentage.', 'element’s part ÷ whole Mᵣ × 100', 'The share of a compound’s mass that comes from one element, as a percentage, is called the percentage mass of that element. To find it, multiply the element’s Aᵣ by its number of atoms in the formula. Divide the answer by the Mᵣ of the compound. Then multiply by 100.', 'mr-pc-rule'),
    f('Put it together', 'Find the Mᵣ, find the element’s part, then divide and multiply by 100.', 'Mᵣ → Aᵣ × atoms → ÷ Mᵣ → × 100', 'First, work out the Mᵣ of the compound. Next, multiply the element’s Aᵣ by how many of its atoms are in the formula. Then divide by the Mᵣ and multiply by 100. The percentages of all the elements in a compound add up to 100%.', 'mr-pc-steps'),
  ],
}
