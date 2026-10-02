/*
 * Higher-only section for chapter B6 (inheritance and genetic engineering), from the CGP AQA Combined Science Higher guide
 * page 76 (scope only; all wording, examples, questions and diagrams are original). AQA 8464 HT content: 4.6.2.4 (the main
 * steps in genetic engineering). Diagram: components/HigherGeneticEngineeringVisuals.tsx ('hgene-').
 */
import { addition, f, type HigherAddition } from './helpers'

// Selective breeding and genetic engineering · Higher p76: enzymes, vectors (plasmid or virus), and the early stage.
// The Foundation lesson already says a gene is "cut out" and "put in" (insulin, crops, gene therapy); this names how.
const geneSteps = addition('B-GEN-044-B', 'B44-10', 'B-HIGHER-GE-STEPS', ['4.6.2.4'],
  { id: 'B44-H01', higher: true, label: 'How a gene is moved', detail: 'Enzymes, vectors and the early stage' },
  [
    f('Cutting out the gene', 'Enzymes cut the useful gene out of the DNA.', 'enzymes cut → gene removed', 'Earlier you saw that a useful gene can be cut out of one organism. The cutting is done by enzymes. They cut the DNA on each side of the gene, so the gene can be lifted out.', 'hgene-cut'),
    f('A carrier for the gene', 'The gene is put into a vector: a plasmid or a virus.', 'vector = carrier', 'The gene cannot get into new cells on its own. So it is put into a carrier, called a vector. The vector is usually a bacterial plasmid, a small ring of DNA found in some bacteria. It can also be a virus.', 'hgene-vector'),
    f('Into the new cells', 'The vector carries the gene into the target cells.', 'vector → gene inside the cells', 'The vector is used to get the gene into the cells of the organism that needs it. Once inside, the gene works in its new cells. For example, a crop plant can make a protein that keeps insects away.', 'hgene-insert'),
    f('Starting early', 'Genes are usually added at an early stage, such as an egg or embryo.', 'early → every cell gets it', 'In plants and animals, the gene is usually put in at an early stage of development, such as an egg or an embryo. All the cells of the organism grow from these few cells. So every cell has the gene, and the organism develops with the new characteristic.', 'hgene-early'),
    f('Put it together', 'Cut out, put into a vector, carry into cells, early on.', 'enzymes → vector → cells → early stage', 'Enzymes cut out the useful gene. The gene is put into a vector, such as a plasmid or a virus. The vector carries the gene into the target cells. This is done at an early stage, so the organism develops with the characteristic.', 'hgene-all'),
  ],
  a => [
    a.choice('B44-H02', 'In genetic engineering, what is a vector?', ['The enzyme that cuts out the gene', 'A carrier, such as a plasmid or a virus, that takes the gene into the new cells', 'The organism the gene is taken from', 'A crop that has been genetically modified'], 1, 'A vector carries something from one place to another.', ['Enzymes cut out the gene, and the organism it comes from is the donor.', 'A vector is the carrier, usually a bacterial plasmid or a virus, that takes the gene into the target cells.']),
    a.choice('B44-H03', 'The diagram shows the main steps of genetic engineering. What is happening at step 2?', ['Enzymes are cutting the gene out of the DNA', 'The organism is developing with the new characteristic', 'The gene is being put into a vector, such as a plasmid or a virus', 'The bacteria are being killed with an antibiotic'], 2, 'Look at what the coral gene is now inside.', ['At step 1 the gene is cut out, and at step 4 the organism develops.', 'At step 2 the gene sits inside a small ring, a plasmid, or a virus: it is being put into a vector.'], 'dataInterpretation', false, 'hgene-question'),
    a.choice('B44-H04', 'Scientists want sheep that make a medicine in their milk. Why do they add the gene to a sheep embryo, not to an adult sheep?', ['Adult sheep do not have any DNA', 'Every cell of the sheep grows from the embryo, so every cell will have the gene', 'Enzymes only work in embryos', 'An embryo has no cells for the gene to go into'], 1, 'Where do all the cells of a sheep come from?', ['All the cells of the sheep grow from the few cells of the embryo.', 'So if the gene is added early, every cell has it, and the sheep develops with the new characteristic.'], 'application', true),
  ])

export const higherB6: HigherAddition[] = [geneSteps]
