import type { TeachingFrame } from '../../teachingFrame'

// One idea per section: the ions in the solution, the cathode rule, the anode rule, two worked examples drawn on one cell,
// then the lab method (a required practical) drawn once and lit up step by step.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const aqueousFrames: Record<string, TeachingFrame[]> = {
  'C27-02': [
    f('Water makes ions too', 'A tiny amount of water splits into H⁺ and OH⁻ ions.', 'water gives H⁺ and OH⁻', 'When you electrolyse a molten salt, only the salt’s ions are there. In a solution, there is also water. A very small amount of water splits into two ions: hydrogen ions, H⁺, and hydroxide ions, OH⁻.', 'aqel-water'),
    f('Four kinds of ion', 'A salt solution has ions from the salt and ions from the water.', 'salt ions + water ions = four kinds', 'Dissolve sodium chloride in water. The salt gives Na⁺ and Cl⁻ ions. The water gives H⁺ and OH⁻ ions. So the solution has four kinds of ion. Two are positive and two are negative.', 'aqel-ions'),
    f('Where the ions go', 'Positive ions go to the cathode. Negative ions go to the anode.', 'positive → cathode (−) · negative → anode (+)', 'The cathode is the negative electrode, so it attracts positive ions. The anode is the positive electrode, so it attracts negative ions. Metal ions and H⁺ ions go to the cathode. Halide ions and OH⁻ ions go to the anode. One product forms at each electrode.', 'aqel-move'),
  ],
  'C27-05': [
    f('Metal or hydrogen?', 'At the cathode, compare the metal with hydrogen.', 'which is more reactive: the metal or hydrogen?', 'Two positive ions reach the cathode: a metal ion and an H⁺ ion. Only one of them turns into a product. To decide which, compare the metal with hydrogen on the reactivity series.', 'aqel-cath-strip'),
    f('More reactive than hydrogen', 'If the metal is more reactive than hydrogen, hydrogen gas forms.', 'more reactive metal → hydrogen gas', 'Sodium is more reactive than hydrogen. So a sodium ion stays in the solution, and hydrogen gas forms at the cathode instead. The same happens for potassium, calcium, magnesium, aluminium, zinc and iron.', 'aqel-cath-more'),
    f('Less reactive than hydrogen', 'If the metal is less reactive than hydrogen, a layer of the metal forms.', 'less reactive metal → solid metal', 'Copper is less reactive than hydrogen. So the copper ions turn into copper atoms, and a solid layer of copper metal forms on the cathode. Silver and gold behave in the same way.', 'aqel-cath-less'),
  ],
  'C27-08': [
    f('Halide or not?', 'At the anode, first look for halide ions.', 'look for Cl⁻, Br⁻ or I⁻', 'Two negative ions can reach the anode: an OH⁻ ion, and the negative ion from the salt. Look at the salt first. Does it contain halide ions? These are chloride, bromide or iodide ions.', 'aqel-an-q'),
    f('Halide ions present', 'If halide ions are present, the halogen forms.', 'chloride → chlorine · bromide → bromine · iodide → iodine', 'If the salt contains halide ions, the halogen forms at the anode. Chloride ions make chlorine. Bromide ions make bromine. Iodide ions make iodine.', 'aqel-an-yes'),
    f('No halide ions', 'If there are no halide ions, oxygen and water form.', 'no halide → OH⁻ reacts → oxygen + water', 'Sulfate and nitrate ions are not halide ions. If the salt has none, the OH⁻ ions react at the anode instead. Oxygen gas and water form.', 'aqel-an-no'),
  ],
  'C27-11': [
    f('Copper sulfate: the ions', 'Copper sulfate solution holds Cu²⁺, SO₄²−, H⁺ and OH⁻ ions.', 'list all four ions first', 'Start by listing every ion. Copper sulfate, CuSO₄, gives Cu²⁺ and SO₄²− ions. The water gives H⁺ and OH⁻ ions. The positive ions go to the cathode and the negative ions go to the anode.', 'aqel-cu-ions'),
    f('Copper sulfate: the cathode', 'Copper is less reactive than hydrogen, so copper metal forms.', 'Cu less reactive than H → copper', 'Cu²⁺ and H⁺ ions reach the cathode. Copper is less reactive than hydrogen. So a layer of copper metal forms on the cathode.', 'aqel-cu-cathode'),
    f('Copper sulfate: the anode', 'There are no halide ions, so oxygen and water form.', 'no halide → oxygen + water', 'SO₄²− and OH⁻ ions reach the anode. Sulfate is not a halide ion. So the OH⁻ ions react, and oxygen and water form.', 'aqel-cu-anode'),
    f('Sodium chloride: the ions', 'Sodium chloride solution holds Na⁺, Cl⁻, H⁺ and OH⁻ ions.', 'same steps: list the ions', 'Now try sodium chloride, NaCl. The salt gives Na⁺ and Cl⁻ ions. The water again gives H⁺ and OH⁻ ions. Use the same two rules to predict each product.', 'aqel-na-ions'),
    f('Sodium chloride: the cathode', 'Sodium is more reactive than hydrogen, so hydrogen forms.', 'Na more reactive than H → hydrogen', 'Na⁺ and H⁺ ions reach the cathode. Sodium is more reactive than hydrogen. So hydrogen gas forms at the cathode, and you see bubbles.', 'aqel-na-cathode'),
    f('Sodium chloride: the anode', 'Chloride is a halide ion, so chlorine forms.', 'halide present → chlorine', 'Cl⁻ and OH⁻ ions reach the anode. Chloride is a halide ion. So chlorine gas forms at the anode. Any gas made shows up as bubbles.', 'aqel-na-anode'),
  ],
  'C27-14': [
    f('Set up the apparatus', 'Solution, two electrodes, a power supply and a test tube over each electrode.', 'a tube over each electrode collects the gas', 'Pour the solution into a beaker and put in two electrodes. Join them to a d.c. power supply. Fill two test tubes with solution and turn them upside down over the electrodes. Any gas made will collect in the tubes.', 'aqel-m-set'),
    f('Which is which?', 'The anode is on the same side as the positive terminal.', 'anode = joined to the + terminal', 'Before you switch on, note which electrode is which. The anode is the electrode joined to the positive terminal of the power supply. The cathode is the other one, joined to the negative terminal.', 'aqel-m-which'),
    f('Run it and record', 'Switch on for a few minutes, then write down what you see.', 'metal layer or bubbles at each electrode', 'Switch on the power supply and leave it for a few minutes. Watch each electrode. Write down what you see: a metal forming, or bubbles of gas. If gas collects, you can test it. You will meet those tests later.', 'aqel-m-run'),
    f('Put it together', 'Set up, identify the electrodes, run, record.', 'set up → identify → run → record', 'Set up the rig and identify the anode and cathode. Run it for a few minutes and record what forms at each electrode. Then use the two rules to explain your results. Follow your teacher’s safety instructions.', 'aqel-m-all'),
  ],
}
