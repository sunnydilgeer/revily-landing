import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { ionicFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.2.1.2 Ionic bonding; 5.2.1.3 Ionic compounds; 5.2.2.3 Properties of ionic compounds' }
const skill = 'C-IONIC-BONDING'
const bond = author(skill, ['5.2.1.2'], ['aqa-chemistry'])
const draw = author(skill, ['5.2.1.2'], ['aqa-chemistry'])
const lattice = author(skill, ['5.2.1.3'], ['aqa-chemistry'])
const formula = author(skill, ['5.2.1.3'], ['aqa-chemistry'])
const props = author(skill, ['5.2.2.3', '5.2.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const ionicSections = [
  { id: 'C13-01', label: 'Start here', detail: 'What is table salt made of?' },
  { id: 'C13-02', label: 'How do ions stick together?', detail: 'Electron transfer and the ionic bond' },
  { id: 'C13-05', label: 'How do you draw it?', detail: 'Dot and cross diagrams: NaCl, MgO, MgCl₂' },
  { id: 'C13-08', label: 'What does salt look like inside?', detail: 'The giant ionic lattice and two models' },
  { id: 'C13-11', label: 'How do you find the formula?', detail: 'Count the ions, or balance the charges' },
  { id: 'C13-13', label: 'Why is salt hard to melt?', detail: 'Melting points and conducting electricity' },
  { id: 'C13-16', label: 'On your own', detail: 'Lithium oxide, four substances and lithium sulfide' },
]

const states: ScienceState[] = [
  { ...bond.choice('C13-01', 'Table salt is sodium chloride. What kinds of element is it made from?', ['Two metals', 'A metal and a non-metal', 'Two non-metals'], 1, 'Is sodium a metal or a non-metal? What about chlorine?', ['Sodium is a metal, on the left of the periodic table. Chlorine is a non-metal, on the right.', 'So sodium chloride is made from a metal and a non-metal.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(bond, 'C13-02', 'How do ions stick together?'),
  bond.choice('C13-03', 'When sodium reacts with chlorine, what happens to the electrons?', ['A sodium atom gives one electron to a chlorine atom', 'A chlorine atom gives one electron to a sodium atom', 'The two atoms share a pair of electrons', 'Both atoms lose one electron'], 0, 'Which atom has just one electron in its outer shell?', ['Sodium has one outer electron and chlorine has seven.', 'So sodium’s outer electron moves to chlorine: sodium loses one electron and chlorine gains one.']),
  bond.choice('C13-04', 'What holds the ions together in sodium chloride?', ['Shared pairs of electrons', 'Weak forces between molecules', 'Strong electrostatic attraction between oppositely charged ions', 'Magnetism between the two elements'], 2, 'What do positive and negative charges do to each other?', ['Na⁺ is positive and Cl⁻ is negative, and opposite charges attract.', 'So a strong electrostatic attraction, the ionic bond, holds the ions together.']),
  t(draw, 'C13-05', 'How do you draw it?'),
  draw.choice('C13-06', 'In the magnesium oxide diagram, the oxide ion has six crosses and two dots. What do the two dots show?', ['Protons that oxygen gained', 'Oxygen’s own outer electrons', 'Electrons shared by both atoms', 'The electrons that came from magnesium'], 3, 'Whose electrons are drawn as dots in that diagram?', ['In the diagram, magnesium’s electrons are dots and oxygen’s are crosses.', 'So the two dots are the electrons that moved from magnesium to oxygen.']),
  draw.choice('C13-07', 'Which of these does a dot and cross diagram of sodium chloride not show?', ['Which atom each electron came from', 'How the ions are arranged in the compound', 'The charge on each ion', 'How many electrons are in each shell'], 1, 'The diagram shows one pair of ions. What about the rest of the compound?', ['A dot and cross diagram shows electrons, charges and where each electron came from.', 'So it does not show how the ions are arranged, or how big they are.']),
  t(lattice, 'C13-08', 'What does salt look like inside?'),
  lattice.choice('C13-09', 'In a giant ionic lattice, in which directions do the ionic bonds act?', ['In all directions', 'Only left and right', 'Only between one pair of ions', 'Only up and down'], 0, 'How many ions surround each ion?', ['Each ion is surrounded by oppositely charged ions on every side.', 'So it attracts all of them: the ionic bonds act in all directions.']),
  lattice.choice('C13-10', 'You want to show how big chloride ions are compared with sodium ions. Which model is best?', ['A ball-and-stick model', 'A dot and cross diagram', 'A space-filling model', 'The formula NaCl'], 2, 'Which model draws the ions touching, at their real sizes?', ['A space-filling model draws the ions touching, at their real relative sizes.', 'So it shows that chloride ions are bigger than sodium ions. A ball-and-stick model does not.']),
  t(formula, 'C13-11', 'How do you find the formula?'),
  formula.choice('C13-12', 'Calcium forms Ca²⁺ ions and chlorine forms Cl⁻ ions. What is the formula of calcium chloride?', ['CaCl', 'Ca₂Cl', 'Ca₂Cl₂', 'CaCl₂'], 3, 'How many Cl⁻ ions balance one Ca²⁺ ion?', ['One Ca²⁺ ion has a 2+ charge, and each Cl⁻ ion has a 1− charge.', 'So two Cl⁻ ions balance one Ca²⁺ ion (+2 − 1 − 1 = 0), and the formula is CaCl₂.'], 'calculation'),
  t(props, 'C13-13', 'Why is salt hard to melt?'),
  props.choice('C13-14', 'Why does solid sodium chloride not conduct electricity?', ['It contains no charged particles', 'Its ions are held in place and cannot move', 'Its electrons are all shared', 'It only forms ions when it is heated'], 1, 'Are there charged particles in the solid? Can they move?', ['Solid sodium chloride is made of ions, but they are held in place in the lattice.', 'So they cannot move and carry charge, and the solid does not conduct.']),
  props.choice('C13-15', 'Why do ionic compounds have high melting points?', ['Lots of energy is needed to break the many strong ionic bonds', 'The forces between their molecules are weak', 'Their ions are too heavy to move', 'They always contain a metal'], 0, 'What has to be broken to melt a lattice?', ['Melting pulls the ions apart, which means breaking many strong ionic bonds in all directions.', 'So it takes a lot of energy, and the melting point is high.']),
  draw.choice('C13-16', 'In this lithium oxide diagram, what do the dots in ion 2, like the one at pointer 3, show?', ['Electrons shared by lithium and oxygen', 'Protons that the oxide ion gained', 'Electrons that moved from the lithium atoms', 'Oxygen’s own outer electrons'], 2, 'Ion 2 has two kinds of mark. Which atoms lost electrons?', ['Each lithium atom lost its one outer electron, becoming Li⁺. The oxygen atom gained both, becoming O²⁻.', 'So the two dots are the electrons that came from the two lithium atoms. The crosses are oxygen’s own.'], 'application', true, 'ionic-question'),
  props.choice('C13-17', 'The table shows invented data for four substances. Which is most likely to be an ionic compound?', ['Substance A', 'Substance B', 'Substance C', 'Substance D'], 0, 'An ionic compound has a high melting point. When does it conduct?', ['Substance A has a high melting point and conducts when molten, but not as a solid. That fits an ionic compound.', 'So A is the most likely, but the data does not prove it. C conducts as a solid, so it is not ionic.'], 'dataInterpretation', true, 'ionic-data'),
  formula.choice('C13-18', 'Lithium forms Li⁺ ions and sulfur forms S²⁻ ions. What is the formula of lithium sulfide?', ['LiS', 'LiS₂', 'Li₂S₂', 'Li₂S'], 3, 'How many Li⁺ ions balance one S²⁻ ion?', ['Each Li⁺ ion has a 1+ charge, and one S²⁻ ion has a 2− charge.', 'So two Li⁺ ions balance one S²⁻ ion (+1 + 1 − 2 = 0), and the formula is Li₂S.'], 'calculation', true),
  props.written('C13-19', 'Explain how sodium chloride forms from its atoms, and why it conducts electricity when molten but not when solid.', 'Say what happens to the electron, which ions form, what holds them together, and whether the ions can move in each state.', 'A sodium atom transfers its one outer electron to a chlorine atom. This makes a positive sodium ion, Na⁺, and a negative chloride ion, Cl⁻. The oppositely charged ions attract each other by strong electrostatic forces, called ionic bonds, in a giant ionic lattice. In the solid, the ions are held in place, so they cannot move to carry charge. When it is molten, the ions are free to move, so they carry charge and it conducts.', ['A sodium atom transfers (loses) its one outer electron to a chlorine atom, which gains it.', 'This forms a positive sodium ion (Na⁺) and a negative chloride ion (Cl⁻).', 'Strong electrostatic attraction between the oppositely charged ions (ionic bonds) holds them together in a giant ionic lattice.', 'In the solid the ions are held in place, so they cannot move and carry charge.', 'When molten the ions are free to move, so they can carry charge and it conducts.'], ['Saying sodium and chlorine share electrons, or form molecules.', 'Saying electrons flow through the molten compound to carry the current.', 'Saying the solid does not conduct because it has no ions or no charged particles.']),
]

export const lessonC13: ScienceLesson = {
  id: 'C-BND-013-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Ionic bonding and ionic compounds', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
