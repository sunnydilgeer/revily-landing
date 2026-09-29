import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { electrolysisFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.3.1 Electrolysis; 5.4.3.2 Electrolysis of molten ionic compounds; 5.4.3.3 Using electrolysis to extract metals (aluminium), as on the supplied revision page' }
const skill = 'C-ELECTROLYSIS'
const basics = author(skill, ['5.4.3.1'], ['aqa-chemistry'])
const molten = author(skill, ['5.4.3.2'], ['aqa-chemistry'])
const extract = author(skill, ['5.4.3.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const electrolysisSections = [
  { id: 'C26-01', label: 'Start here', detail: 'Why a molten compound conducts' },
  { id: 'C26-02', label: 'What is electrolysis?', detail: 'Electrolyte, electrodes and ions' },
  { id: 'C26-05', label: 'What happens to a molten compound?', detail: 'Metal at the cathode, non-metal at the anode' },
  { id: 'C26-08', label: 'How is aluminium extracted?', detail: 'Cryolite, graphite and the equation' },
  { id: 'C26-11', label: 'On your own', detail: 'New compounds, a diagram and some results' },
]

const states: ScienceState[] = [
  { ...basics.choice('C26-01', 'Sodium chloride conducts electricity when molten but not when solid. What changes when it melts?', ['The ions leave the compound and become atoms', 'The ions are free to move around', 'The compound gains extra electrons'], 1, 'Think about what carries the charge in an ionic compound.', ['Sodium chloride is made of ions.', 'In the solid, the ions are locked in place. When it melts, the ions can move, and moving ions carry current.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(basics, 'C26-02', 'What is electrolysis?'),
  basics.choice('C26-03', 'What is an electrolyte?', ['The solid rod that carries current into the liquid', 'The negative electrode in the cell', 'A liquid or solution that can conduct electricity', 'A gas made at an electrode'], 2, 'It is the liquid part of the cell, not a rod.', ['The electrolyte is the liquid or solution that conducts.', 'The rods are the electrodes.']),
  basics.choice('C26-04', 'In an electrolysis cell, positive ions move towards which electrode, and what do they do there?', ['The cathode, where they gain electrons', 'The cathode, where they lose electrons', 'The anode, where they gain electrons', 'The anode, where they lose electrons'], 0, 'Positive ions are attracted to the negative electrode.', ['The negative electrode is the cathode, and opposite charges attract.', 'Positive ions gain electrons there and become uncharged atoms.']),
  t(molten, 'C26-05', 'What happens to a molten compound?'),
  molten.choice('C26-06', 'Molten lead bromide is electrolysed with inert electrodes. What forms at the cathode and at the anode?', ['Lead at the anode and bromine at the cathode', 'Bromine at both electrodes', 'Lead at both electrodes', 'Lead at the cathode and bromine at the anode'], 3, 'Which product is the metal? Metal ions are positive.', ['Lead is the metal, so it forms at the negative cathode.', 'Bromine is the non-metal, so it forms at the anode.']),
  molten.choice('C26-07', 'Why can molten lead bromide be electrolysed, while solid lead bromide cannot?', ['Solid lead bromide has no ions in it', 'The ions are free to move when it is molten', 'Solids cannot touch the electrodes', 'Melting turns the compound into a metal'], 1, 'What must the ions be able to do to carry current?', ['Solid lead bromide does contain ions, but they are held in place.', 'When it melts, the ions can move to the electrodes.']),
  t(extract, 'C26-08', 'How is aluminium extracted?'),
  extract.choice('C26-09', 'Why is aluminium oxide dissolved in molten cryolite before it is electrolysed?', ['To make oxygen form at the cathode', 'To make it react with the graphite', 'To lower the melting point so less energy is needed', 'To turn the ions into atoms'], 2, 'Aluminium oxide has a very high melting point.', ['Cryolite lowers the melting point of the mixture.', 'That saves a great deal of energy.']),
  extract.choice('C26-10', 'The graphite anodes in an aluminium cell need replacing regularly. Why?', ['Oxygen reacts with the carbon to make carbon dioxide', 'Aluminium ions dissolve the graphite', 'Cryolite turns the graphite into a metal', 'Graphite is a poor conductor'], 0, 'What gas forms at the anode? What does carbon do with it?', ['Oxygen forms at the anode.', 'At the high temperature it reacts with the carbon, making carbon dioxide, so the anode wears away.']),
  molten.choice('C26-11', 'Molten zinc chloride is electrolysed using inert electrodes. Which pair of products forms at the cathode and anode?', ['Chlorine at the cathode, zinc at the anode', 'Zinc and chlorine both at the cathode', 'Chlorine at both electrodes', 'Zinc at the cathode, chlorine at the anode'], 3, 'Which product is the metal? Which is the non-metal?', ['Zinc is a metal, so it forms at the cathode.', 'Chlorine is a non-metal, so it forms at the anode.'], 'application', true),
  basics.choice('C26-12', 'In the electrolysis cell shown, which numbered part is the anode?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 1, 'The anode is joined to the positive side of the power supply. Look for the plus sign.', ['The plus sign is on the right, so the right-hand electrode is joined to the positive terminal.', 'The positive electrode is the anode: part 2.'], 'application', true, 'elec-question-cell'),
  molten.choice('C26-13', 'A student electrolyses two molten compounds with inert electrodes and records the results. Which conclusion do the results support?', ['Both compounds contain a metal, which formed at the negative electrode', 'Both compounds contain the same non-metal', 'A metal formed at the positive electrode in compound B', 'Compound A is an element'], 0, 'Which electrode is the cathode? What forms at the cathode in a molten compound?', ['A solid forms at the negative electrode in both, and metals form there.', 'The gases and vapours differ in colour, so the non-metals are different.'], 'dataInterpretation', true, 'elec-question-data'),
  molten.choice('C26-14', 'In the lead bromide experiment, why are inert electrodes used?', ['So they conduct less electricity', 'So they turn into the products', 'So they do not react with the electrolyte or the products', 'So the ions stay in place'], 2, 'What does inert mean?', ['Inert means unreactive.', 'Inert electrodes take no part in the reaction, so only the ions in the electrolyte react.'], 'understanding', true),
  molten.written('C26-15', 'Explain why molten sodium chloride can be electrolysed, and say what forms at each electrode.', 'Say what the ions can do when it is molten. Then name the product at the cathode and at the anode.', 'Sodium chloride is an ionic compound. When it is molten, its ions are free to move, so it can conduct electricity and be electrolysed. Positive sodium ions move to the cathode, where sodium metal forms. Negative chloride ions move to the anode, where chlorine forms.', ['When molten, the ions are free to move, so the compound conducts and can be electrolysed.', 'Positive sodium ions go to the cathode (negative electrode) and sodium forms there.', 'Negative chloride ions go to the anode (positive electrode) and chlorine forms there.'], ['Saying that the solid conducts, or that electrons flow through the liquid instead of ions.', 'Putting the metal at the anode or the non-metal at the cathode.', 'Naming products that are not sodium and chlorine.']),
]

export const lessonC26: ScienceLesson = {
  id: 'C-CHG-026-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Electrolysis', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
