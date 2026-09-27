import type { TeachingFrame } from '../teachingFrame'

// Two disorders that mirror each other (recessive, then dominant), each ending in a genetic diagram, then a family tree
// that uses the same cross, then embryo screening with the arguments on both sides given equal space.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const inheritedDisorderFrames: Record<string, TeachingFrame[]> = {
  'B40-02': [
    f('Inherited disorders', 'Some health conditions are caused by faulty alleles.', 'faulty allele → passed on', 'Some health conditions are passed from parents to their children. They are caused by inheriting faulty alleles. Conditions like this are called inherited disorders.', 'inherit-cf-intro'),
    f('Cystic fibrosis', 'Cystic fibrosis is a disorder of cell membranes.', 'recessive allele f; ff has it', 'Cystic fibrosis is an inherited disorder of cell membranes. It is caused by a recessive allele, written f. The dominant allele, F, does not cause the disorder. So a person must have two f alleles, ff, to have cystic fibrosis.', 'inherit-cf-allele'),
    f('Carriers', 'People with one f allele do not have the disorder.', 'Ff = carrier', 'A person with one F allele and one f allele does not have cystic fibrosis. But they can pass the f allele on to their children. A person like this is called a carrier.', 'inherit-cf-carrier'),
    f('Two carriers', 'Two carriers have a 1 in 4 chance of a child with cystic fibrosis.', 'Ff × Ff → FF, Ff, Ff, ff', 'For a child to have cystic fibrosis, both parents must be carriers or have the disorder. Here, two carriers (Ff) have a child. The four possible genotypes are FF, Ff, Ff and ff. So there is a 1 in 4 (25%) chance of the child having cystic fibrosis.', 'inherit-cf-cross'),
  ],
  'B40-05': [
    f('Extra fingers or toes', 'Polydactyly means being born with extra fingers or toes.', 'extra digits', 'Some babies are born with an extra finger or toe. This inherited disorder is called polydactyly.', 'inherit-poly-hand'),
    f('A dominant allele', 'Polydactyly is caused by a dominant allele, D.', 'D: one copy is enough', 'Polydactyly is caused by a dominant allele, written D. The other allele, d, is recessive. Because D is dominant, one copy is enough. So a person who is Dd has polydactyly, and just one parent can pass it on.', 'inherit-poly-allele'),
    f('One parent', 'One Dd parent gives a 1 in 2 chance.', 'Dd × dd → Dd, dd, Dd, dd', 'Here, one parent has polydactyly (Dd) and the other does not (dd). The four possible genotypes are Dd, dd, Dd and dd. Two of the four have a D allele. So there is a 1 in 2 (50%) chance of the child having polydactyly.', 'inherit-poly-cross'),
  ],
  'B40-08': [
    f('The key', 'Squares are males and circles are females.', 'shape = sex; shading = the allele', 'A family tree shows how a characteristic is passed down a family. Squares are males and circles are females. A fully shaded shape has the disorder. A half-shaded shape is a carrier.', 'inherit-tree-key'),
    f('Reading the tree', 'Carriers without the disorder show the allele is recessive.', 'carriers → not dominant', 'This family tree shows cystic fibrosis. Several people carry the allele but do not have the disorder. So the allele cannot be dominant. If it were, everyone with the allele would have cystic fibrosis.', 'inherit-tree-read'),
    f('A new baby', 'Two carrier parents: 25% disorder, 50% carrier.', 'Ff × Ff again', 'Two carriers in this family, both Ff, are expecting a baby. It is the same cross you saw for cystic fibrosis. There is a 25% chance the baby is ff and has the disorder. There is a 50% chance it is Ff, a carrier, and a 25% chance it is FF.', 'inherit-tree-baby'),
  ],
  'B40-10': [
    f('Testing an embryo', 'Embryos made in a lab can be tested before going into the womb.', 'lab embryo → one cell → test genes', 'Eggs can be fertilised in a lab. This is called in vitro fertilisation, or IVF. The embryos are then put into the mother’s womb. Before this, scientists can remove one cell from each embryo and test its genes.', 'inherit-screen-ivf'),
    f('Embryo screening', 'Testing embryos for disorders is called embryo screening.', 'test the DNA → find disorders', 'DNA can also be taken from an embryo growing in the womb and tested. Testing embryos like this for disorders is called embryo screening. Many inherited disorders can be found this way.', 'inherit-screen-womb'),
    f('Hard decisions', 'Screening can lead to difficult decisions.', 'a result → a choice to make', 'Screening can lead to hard decisions, and this is one reason some people disagree with it. After IVF, embryos with alleles linked to a disorder would not be used, and would be destroyed. For an embryo in the womb, a result could lead to a decision to end the pregnancy.', 'inherit-screen-decisions'),
    f('Arguments for', 'Some reasons people give for embryo screening.', 'suffering, cost, laws', 'People who support embryo screening say it could help stop people suffering from serious disorders. Treating disorders also costs a lot of money. They point out that there are laws to stop screening going too far. For example, in the UK parents cannot choose their baby’s sex, except for health reasons.', 'inherit-screen-for'),
    f('Arguments against', 'Some reasons people give against embryo screening.', 'fairness, choosing features, cost', 'People against embryo screening say it suggests that people with genetic disorders are not wanted. This could lead to them being treated unfairly. Some worry that one day people may want to choose features they prefer, such as eye colour. Screening is also expensive.', 'inherit-screen-against'),
  ],
}
