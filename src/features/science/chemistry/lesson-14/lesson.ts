import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { covalentFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.2.1.4 Covalent bonding; 5.2.2.4 Properties of small molecules' }
const skill = 'C-COVALENT'
const share = author(skill, ['5.2.1.4'], ['aqa-chemistry'])
const count = author(skill, ['5.2.1.4'], ['aqa-chemistry'])
const multiple = author(skill, ['5.2.1.4'], ['aqa-chemistry'])
const draw = author(skill, ['5.2.1.4'], ['aqa-chemistry'])
const small = author(skill, ['5.2.2.4', '5.2.1.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const covalentSections = [
  { id: 'C14-01', label: 'Start here', detail: 'Filling an outer shell' },
  { id: 'C14-02', label: 'How do non-metal atoms share?', detail: 'Shared pairs and covalent bonds' },
  { id: 'C14-05', label: 'How many bonds does an atom make?', detail: 'H₂, HCl, water, ammonia and methane' },
  { id: 'C14-08', label: 'Can atoms share more than one pair?', detail: 'Double and triple bonds' },
  { id: 'C14-10', label: 'How can you draw a molecule?', detail: 'Three drawings and the molecular formula' },
  { id: 'C14-13', label: 'Why do small molecules boil easily?', detail: 'Weak forces between molecules' },
  { id: 'C14-16', label: 'On your own', detail: 'Methane, boiling data and a mystery substance' },
]

const states: ScienceState[] = [
  { ...share.choice('C14-01', 'A chlorine atom has 7 electrons in its outer shell. How many more electrons would fill that shell?', ['7', '1', '8', '2'], 1, 'How many electrons fill the outer shell of an atom like chlorine?', ['Chlorine’s outer shell is full with 8 electrons.', 'It has 7, so it needs 1 more.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(share, 'C14-02', 'How do non-metal atoms share?'),
  share.choice('C14-03', 'What is a covalent bond?', ['An electron moved from a metal atom to a non-metal atom', 'The attraction between a positive ion and a negative ion', 'A pair of electrons shared between two atoms', 'Two atoms touching, with no electrons involved'], 2, 'What did the two chlorine atoms do with one electron each?', ['In a covalent bond, each atom puts one electron into a pair that both atoms share.', 'So a covalent bond is a shared pair of electrons. Moving electrons to make ions is ionic bonding.']),
  share.choice('C14-04', 'In a chlorine molecule, Cl₂, how many electrons does each chlorine atom count in its outer shell?', ['8', '7', '14', '2'], 0, 'Does each atom count the shared pair as its own?', ['Each atom has 6 outer electrons that are not shared, and it counts both electrons in the shared pair.', 'So each atom counts 6 + 2 = 8, a full outer shell.']),
  t(count, 'C14-05', 'How many bonds does an atom make?'),
  count.choice('C14-06', 'A nitrogen atom has 5 outer electrons. How many covalent bonds does it usually make?', ['5', '8', '2', '3'], 3, 'How many more electrons does nitrogen need to reach 8?', ['Nitrogen has 5 outer electrons, so it needs 3 more to reach 8.', 'Each covalent bond gives it one extra electron, so it makes 3 bonds, as in ammonia, NH₃.']),
  count.choice('C14-07', 'A sulfur atom has 6 outer electrons, like oxygen. What is the formula of the molecule sulfur makes with hydrogen?', ['HS', 'H₂S', 'H₆S', 'H₈S'], 1, 'How many bonds does oxygen make in water?', ['Sulfur has 6 outer electrons, so it needs 2 more and makes 2 covalent bonds.', 'Each hydrogen atom makes 1 bond, so sulfur bonds with 2 hydrogen atoms: H₂S.'], 'application'),
  t(multiple, 'C14-08', 'Can atoms share more than one pair?'),
  multiple.choice('C14-09', 'How many electrons are shared between the two atoms in an oxygen molecule, O₂?', ['2', '8', '4', '6'], 2, 'How many shared pairs make a double bond?', ['An oxygen molecule has a double bond: two shared pairs.', 'Each pair is 2 electrons, so 4 electrons are shared.']),
  t(draw, 'C14-10', 'How can you draw a molecule?'),
  draw.choice('C14-11', 'Which drawing shows which atom each electron in a covalent bond came from?', ['A dot-and-cross diagram', 'A displayed formula', 'A 3D model', 'A molecular formula'], 0, 'Which drawing uses two different marks for electrons?', ['A dot-and-cross diagram uses dots for one atom’s electrons and crosses for the other atom’s.', 'So it shows where the bonding electrons came from. Lines, balls and formulas do not show electrons at all.']),
  draw.choice('C14-12', 'The displayed formula shows a propane molecule. What is its molecular formula?', ['CH₃', 'C₈H₃', 'C₃H₄', 'C₃H₈'], 3, 'Count every C, then count every H.', ['There are 3 carbon atoms and 8 hydrogen atoms in the molecule.', 'So the molecular formula is C₃H₈: each symbol followed by its number of atoms.'], 'understanding', false, 'cov-propane'),
  t(small, 'C14-13', 'Why do small molecules boil easily?'),
  small.choice('C14-14', 'Chlorine boils at −34 °C. What happens to chlorine molecules as it boils?', ['The covalent bond inside each molecule breaks', 'The weak forces between the molecules are overcome', 'The molecules turn into ions', 'The molecules get smaller'], 1, 'Do the Cl₂ molecules stay whole in the gas?', ['When chlorine boils, the Cl₂ molecules move apart but each one stays whole.', 'So only the weak intermolecular forces are overcome. The strong covalent bonds do not break.']),
  small.choice('C14-15', 'Oxygen, O₂, is a simple molecular substance. Why does it not conduct electricity?', ['Its covalent bonds are too strong', 'Its ions cannot move', 'Its molecules have no overall charge', 'Its molecules are too far apart'], 2, 'What does a substance need in order to carry a current?', ['A current needs charged particles that can move.', 'Oxygen molecules have no overall electric charge, so oxygen cannot conduct.']),
  count.choice('C14-16', 'The dot-and-cross diagram shows a methane molecule. Which number points to one covalent bond?', ['1', '2', '3'], 1, 'Which part is a pair of electrons shared by two atoms?', ['A covalent bond is a shared pair of electrons, drawn where two outer shells overlap.', 'So number 2, the dot and cross between carbon and hydrogen, is one covalent bond.'], 'understanding', true, 'cov-question'),
  small.choice('C14-17', 'The table shows four simple molecular substances. Which conclusion does the data support?', ['In these four, bigger molecules have higher boiling points', 'Methane has the strongest intermolecular forces of the four', 'Butane is a liquid at 20 °C', 'Boiling breaks the covalent bonds in these molecules'], 0, 'Compare the number of atoms with the boiling point, row by row.', ['The boiling point rises from −162 °C for methane to −1 °C for butane as the molecules get bigger.', 'So the data supports bigger molecules having higher boiling points in these four. All four boil below 20 °C, so all are gases at 20 °C.'], 'dataInterpretation', true, 'cov-data'),
  small.choice('C14-18', 'Substance X melts at −95 °C and does not conduct electricity as a liquid. What is X most likely made of?', ['Positive and negative ions in a giant lattice', 'A metal', 'Ions that are free to move', 'Small molecules with weak forces between them'], 3, 'Which kind of substance has a low melting point and no charged particles?', ['A low melting point means only weak forces hold the particles together. No conduction means no charged particles can move.', 'So X is most likely a simple molecular substance: small molecules with weak intermolecular forces.'], 'application', true),
  small.written('C14-19', 'Methane, CH₄, is in natural gas. Explain how its atoms are held together and why it is a gas at room temperature.', 'Say what the atoms share, how strong those bonds are, and what has to be overcome for methane to boil.', 'The carbon atom shares a pair of electrons with each of the four hydrogen atoms. Each shared pair is a covalent bond, and these bonds are strong. Methane is made of small molecules. The intermolecular forces between the molecules are weak, so little energy is needed to overcome them. So methane has a very low boiling point and is a gas at room temperature.', ['The carbon and hydrogen atoms share pairs of electrons: four covalent bonds.', 'The covalent bonds inside each molecule are strong.', 'The intermolecular forces between methane molecules are weak.', 'Little energy is needed to overcome these weak forces, so the boiling point is low and methane is a gas at room temperature.'], ['Saying the covalent bonds break when methane boils.', 'Saying methane is made of ions, or that electrons are transferred.', 'Saying the forces between the molecules are strong.']),
]

export const lessonC14: ScienceLesson = {
  id: 'C-BND-014-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Covalent bonding and simple molecules', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
