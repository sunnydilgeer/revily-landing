import type { TeachingFrame } from '../teachingFrame'

// One route: what a stem cell is → where stem cells are found → what they could be used for
// (plants, then patients) → how to judge whether a treatment works. One new word per screen.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const stemCellFrames: Record<string, TeachingFrame[]> = {
  'B5-14': [
    f('Most cells have one job', 'Most body cells are already specialised.', 'specialised → stuck with one job', 'You have seen how a skin cell divides by mitosis. A nerve cell or a muscle cell has already differentiated. It has one job. When it divides by mitosis, it makes more cells of the same type.', 'differentiate'),
    f('Some cells are not specialised yet', 'A few cells have not differentiated yet.', 'no job yet → could become many types', 'A few cells in the body have not differentiated yet. They have no special shape or job. A cell like this is called undifferentiated.', 'stem-embryo'),
    f('Divide, then become something new', 'A stem cell can make more of itself, or become a specialised cell.', 'divide → more stem cells; differentiate → specialised cell', 'Some undifferentiated cells can divide by mitosis to make more cells like themselves. Later, some of them differentiate into specialised cells. A cell that can do both is called a stem cell.', 'stem-embryo'),
    f('Put it together', 'Dividing makes more stem cells; differentiating makes specialised cells.', 'two routes: divide or differentiate', 'A stem cell is undifferentiated. Dividing makes more stem cells. Differentiating changes a stem cell into a specialised cell with one job, such as a nerve cell.', 'stem-embryo'),
  ],
  'B5-16': [
    f('Stem cells in an embryo', 'Stem cells from an early embryo can form most human cell types.', 'embryo → most human cell types', 'An embryo is a very early stage in the development of a baby. It is a tiny ball of cells. Its stem cells can form most types of human cell. They are called embryonic stem cells.', 'stem-embryo'),
    f('Stem cells in bone marrow', 'Adult bone marrow has stem cells with a smaller range.', 'bone marrow → blood cells and a few others', 'Adults have some stem cells too. The soft tissue inside bones is called bone marrow. Its stem cells can form several cell types, including blood cells. Their range is smaller than embryonic stem cells.', 'stem-marrow'),
    f('Not every adult cell', 'Most adult cells are specialised, not stem cells.', 'most adult cells → one type only', 'Only a few adult tissues keep stem cells, for replacement and repair. A specialised nerve cell is not a stem cell. Adult cells cannot form every cell type.', 'stem-marrow'),
    f('Stem cells in plants', 'Plant growing tips contain stem cells.', 'meristem → any plant cell type, all through life', 'Plants have growing regions at the tips of roots and shoots. Their stem cells can form any type of plant cell, all through the plant’s life. These regions are called meristems.', 'stem-meristem'),
    f('Put it together', 'Embryo, bone marrow and meristem stem cells form different ranges of cells.', 'embryo: most · marrow: some · meristem: any plant type', 'Embryonic stem cells can form most human cell types. Bone-marrow stem cells form a smaller range, including blood cells. Meristem stem cells can form any plant cell type, throughout the plant’s life.', 'stem-meristem'),
  ],
  'B5-18': [
    f('Copies of one plant', 'Meristem cells can grow into whole new plants.', 'meristem cells → new plants', 'A few meristem cells can be grown into whole new plants. Each new plant has exactly the same genes as the parent plant. A genetically identical copy like this is called a clone.', 'stem-meristem'),
    f('Saving rare plants', 'Cloning can quickly make many copies of a rare plant.', 'few plants → many clones', 'Some plant species are rare and could die out. Clones from meristems can make many new plants quickly. So the species is protected from extinction.', 'stem-meristem'),
    f('Useful crops', 'Farmers can clone crops with useful features.', 'useful feature → cloned into many plants', 'A crop plant might resist a disease. Cloning it makes many plants with the same useful feature. This is quick and cheap. Clones have no new genetic variety.', 'stem-meristem'),
  ],
  'B5-20': [
    f('Replacing damaged cells', 'Stem cells might replace damaged or faulty cells.', 'stem cell → new specialised cell → replace damaged cell', 'Stem cells could be made to form nerve cells to help paralysis. They could form insulin-making cells to help diabetes. These are possible uses, not guaranteed cures. Benefits need evidence.', 'stem-benefits'),
    f('Cells that match the patient', 'An embryo with the patient’s genes gives matching stem cells.', 'same genes → not rejected', 'The body can attack cells that are not its own. Scientists can make an embryo with the patient’s own genes. Its stem cells match, so they are not rejected. This is called therapeutic cloning.', 'therapeutic'),
    f('Medical risks', 'A treatment can cause harm as well as help.', 'possible harm = risk', 'Stem cells grown in a lab could pass on a viral infection to the patient. A possible harm like this is called a medical risk. Matching genes do not remove this risk.', 'stem-risks'),
    f('Ethical objections', 'Some people believe using embryos is wrong.', 'right or wrong = ethics', 'Embryonic stem cells come from embryos that are then destroyed. Some people object for religious or moral reasons: beliefs about right and wrong. These are called ethical objections.', 'stem-risks'),
    f('Put it together', 'Weigh benefits, risks and ethical objections.', 'benefit + risk + ethics → weigh them', 'Stem cells could replace damaged cells. Therapeutic cloning avoids rejection, but other risks remain, such as viral infection. Some people object to using embryos. All of these must be weighed.', 'stem-risks'),
  ],
  'B5-35': [
    f('Testing on people', 'A trial tests a new treatment on a group of people.', 'give treatment → count who improves', 'A new treatment is tested on a group of patients. Doctors count how many people improve. This test is called a trial.', 'trial'),
    f('Look at everyone', 'Count the people who did not improve, too.', 'improved + not improved = everyone', 'In this made-up trial, 6 of 10 people improved. So 4 of 10 did not. These numbers are for practice, not real treatment evidence. A treatment that works for some people is not a guaranteed cure.', 'trial'),
    f('Compare with no treatment', 'Some people get better anyway.', 'with treatment vs without', 'Some people get better without any treatment. So trials compare with a group of similar people who do not get the treatment. This group is called a control group.', 'trial'),
    f('Say only what the numbers show', 'Small trials cannot prove a treatment works for everyone.', 'in this test → no bigger claim', 'Start with “In this test, …”. A few people cannot show what happens to everyone. Improvement numbers also do not show that a treatment is safe.', 'stem-benefits'),
    f('Put it together', 'Count everyone, compare with a control group, and do not over-claim.', 'count → compare → careful conclusion', 'Count who improved and who did not. Compare with a control group. Then say only what this test shows: not a cure, and not proof of safety. Next, you will see how substances move into and out of cells.', 'trial'),
  ],
}
