import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { aqueousFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.3.4 Electrolysis of aqueous solutions (required practical: electrolysis of aqueous solutions with inert electrodes), as on the supplied revision page' }
const skill = 'C-ELECTROLYSIS-AQ'
const ions = author(skill, ['5.4.3.4'], ['aqa-chemistry'])
const cathode = author(skill, ['5.4.3.4'], ['aqa-chemistry'])
const anode = author(skill, ['5.4.3.4'], ['aqa-chemistry'])
const worked = author(skill, ['5.4.3.4'], ['aqa-chemistry'])
const method = author(skill, ['5.4.3.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const aqueousSections = [
  { id: 'C27-01', label: 'Start here', detail: 'Where positive ions go' },
  { id: 'C27-02', label: 'Ions in a solution', detail: 'Ions from the salt and from the water' },
  { id: 'C27-05', label: 'What forms at the cathode?', detail: 'Metal or hydrogen' },
  { id: 'C27-08', label: 'What forms at the anode?', detail: 'Halogen or oxygen' },
  { id: 'C27-11', label: 'Two worked examples', detail: 'Copper sulfate and sodium chloride' },
  { id: 'C27-14', label: 'The lab method', detail: 'Required practical: electrolysis of a solution' },
  { id: 'C27-17', label: 'On your own', detail: 'A prediction, the rig, some data and a plan' },
]

const states: ScienceState[] = [
  { ...ions.choice('C27-01', 'In electrolysis of a molten ionic compound, positive ions move towards which electrode?', ['The anode', 'The cathode', 'Neither electrode'], 1, 'The cathode is the negative electrode. Opposites attract.', ['Positive ions are attracted to the negative electrode.', 'The negative electrode is called the cathode.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(ions, 'C27-02', 'Ions in a solution'),
  ions.choice('C27-03', 'Sodium chloride solution is electrolysed. Which ions are in the solution?', ['Na⁺ and Cl⁻ only', 'H⁺ and OH⁻ only', 'Na⁺, Cl⁻, H⁺ and OH⁻', 'Na⁺, Cl⁻ and O²⁻'], 2, 'Count the ions from the salt and the ions from the water.', ['The salt gives Na⁺ and Cl⁻ ions.', 'The water gives H⁺ and OH⁻ ions, so there are four kinds.']),
  ions.choice('C27-04', 'Which ions in an aqueous solution move towards the cathode?', ['Positive ions: metal ions and H⁺', 'Negative ions: halide ions and OH⁻', 'Only hydrogen ions', 'All of the ions'], 0, 'The cathode is negative. Which ions does it attract?', ['The cathode is the negative electrode, so it attracts positive ions.', 'Metal ions and H⁺ ions are positive. Halide ions and OH⁻ ions go to the anode.']),
  t(cathode, 'C27-05', 'What forms at the cathode?'),
  cathode.choice('C27-06', 'Potassium sulfate solution is electrolysed. What forms at the cathode?', ['Potassium metal', 'Oxygen gas', 'Sulfur', 'Hydrogen gas'], 3, 'Is potassium more or less reactive than hydrogen?', ['Potassium is more reactive than hydrogen.', 'So hydrogen gas forms at the cathode, not potassium.']),
  cathode.choice('C27-07', 'Silver nitrate solution is electrolysed. Silver is less reactive than hydrogen. What forms at the cathode?', ['Hydrogen gas', 'A layer of silver', 'Nitrogen gas', 'Oxygen gas'], 1, 'A metal less reactive than hydrogen forms as a solid metal.', ['Silver is less reactive than hydrogen.', 'So a solid layer of silver metal forms on the cathode.']),
  t(anode, 'C27-08', 'What forms at the anode?'),
  anode.choice('C27-09', 'Potassium bromide solution is electrolysed. What forms at the anode?', ['Bromine', 'Oxygen', 'Hydrogen', 'Potassium'], 0, 'Is bromide a halide ion?', ['Bromide is a halide ion.', 'So the halogen, bromine, forms at the anode.']),
  anode.choice('C27-10', 'Copper nitrate solution is electrolysed. There are no halide ions. What forms at the anode?', ['Nitrogen', 'Copper', 'Oxygen and water', 'Hydrogen'], 2, 'With no halide ions, which ions react at the anode?', ['With no halide ions, the OH⁻ ions react.', 'Oxygen and water form at the anode.']),
  t(worked, 'C27-11', 'Two worked examples'),
  worked.choice('C27-12', 'Copper chloride solution is electrolysed. Which pair forms at the cathode and the anode?', ['Hydrogen and oxygen', 'Hydrogen and chlorine', 'Copper and oxygen', 'Copper and chlorine'], 3, 'Copper is below hydrogen in the series. Chloride is a halide ion.', ['Copper is less reactive than hydrogen, so copper forms at the cathode.', 'Chloride is a halide ion, so chlorine forms at the anode.'], 'application'),
  worked.choice('C27-13', 'Sodium sulfate solution is electrolysed. Which pair forms at the cathode and the anode?', ['Sodium and oxygen', 'Hydrogen and oxygen', 'Hydrogen and chlorine', 'Sodium and sulfate'], 1, 'Sodium is above hydrogen. Sulfate is not a halide ion.', ['Sodium is more reactive than hydrogen, so hydrogen forms at the cathode.', 'There are no halide ions, so oxygen forms at the anode.'], 'application'),
  t(method, 'C27-14', 'The lab method'),
  method.choice('C27-15', 'In the lab rig, which electrode is the anode?', ['The one joined to the positive terminal', 'The one joined to the negative terminal', 'The one with more bubbles', 'The one on the left'], 0, 'The anode is the positive electrode.', ['The anode is joined to the positive terminal of the power supply.', 'Its position in the beaker does not matter.'], 'recall'),
  method.choice('C27-16', 'Why is an upside-down test tube full of solution put over each electrode?', ['To keep the electrode cool', 'To stop the solution splashing', 'To collect any gas made there', 'To make the solution conduct'], 2, 'What happens to a gas that bubbles up into a tube?', ['Gas made at an electrode rises into the tube above it.', 'The tube traps it so it can be collected and tested.']),
  ions.choice('C27-17', 'Magnesium bromide solution is electrolysed. Which pair forms at the cathode and the anode?', ['Magnesium and bromine', 'Hydrogen and bromine', 'Hydrogen and oxygen', 'Magnesium and oxygen'], 1, 'Compare magnesium with hydrogen. Then look for a halide ion.', ['Magnesium is more reactive than hydrogen, so hydrogen forms at the cathode.', 'Bromide is a halide ion, so bromine forms at the anode.'], 'application', true),
  method.choice('C27-18', 'A solution is electrolysed in this rig. Which numbered part is the anode?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 0, 'Which electrode is joined to the positive terminal?', ['Find the + terminal on the power supply and follow its wire.', 'The electrode at the end of that wire is the anode, which is part 1.'], 'application', true, 'aqel-question-rig'),
  ions.choice('C27-19', 'Which solution in the table could be sodium sulfate?', ['Solution P', 'Solution R', 'None of them', 'Solution Q'], 3, 'Sodium is above hydrogen. Sulfate is not a halide ion.', ['Sodium sulfate gives hydrogen at the cathode, as sodium is more reactive than hydrogen.', 'It gives oxygen at the anode, as sulfate is not a halide. That is solution Q.'], 'dataInterpretation', true, 'aqel-question-data'),
  method.written('C27-20', 'A student electrolyses copper sulfate solution in the lab with inert electrodes. Describe the method and predict what forms at each electrode.', 'Give the set-up and the steps in order. Then use the two rules for the cathode and the anode.', 'Pour the solution into a beaker and put in two inert electrodes joined to a d.c. power supply. Note that the anode is the electrode joined to the positive terminal. Switch on for a few minutes and record what you see at each electrode. At the cathode a layer of copper forms, because copper is less reactive than hydrogen. At the anode oxygen forms, and bubbles are seen, because there are no halide ions.', ['Set up the solution in a beaker with two inert electrodes joined to a d.c. power supply.', 'Identify the anode as the electrode joined to the positive terminal.', 'Switch on for a few minutes and record what is seen at each electrode.', 'Cathode: copper forms, because copper is less reactive than hydrogen.', 'Anode: oxygen (bubbles) forms, because there are no halide ions.'], ['Predicting hydrogen at the cathode for copper sulfate.', 'Predicting chlorine at the anode when there are no chloride ions.', 'Mixing up the anode and the cathode.']),
]

export const lessonC27: ScienceLesson = {
  id: 'C-CHG-027-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Electrolysis of aqueous solutions', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
