import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { geneticDiagramFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.6.1.6 Genetic inheritance: gamete, chromosome, gene, allele, dominant, recessive, homozygous, heterozygous, genotype, phenotype; single-gene crosses, Punnett squares, probabilities and ratios; 4.6.1.8 Sex determination: 23 pairs, XX and XY' }
const a = author('B-GENETIC-DIAGRAMS', ['4.6.1.6', '4.6.1.8'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const geneticDiagramSections = [
  { id: 'B39-01', label: 'Start here', detail: 'How many chromosomes in a body cell?' },
  { id: 'B39-02', label: 'Boy or girl?', detail: 'X and Y, and your first Punnett square' },
  { id: 'B39-05', label: 'Versions of a gene', detail: 'Alleles, and the words for them' },
  { id: 'B39-08', label: 'Crossing two mice', detail: 'Genotype, phenotype, crosses and ratios' },
  { id: 'B39-12', label: 'On your own', detail: 'Chances, peas, ratios and real litters' },
]

const states: ScienceState[] = [
  { ...a.choice('B39-01', 'How many chromosomes are in a normal human body cell?', ['23', '46', '92', '12'], 1, 'You met this number when you learned how gametes are made.', ['A gamete has 23 chromosomes, half the normal number.', 'A normal body cell has 46 chromosomes.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B39-02', 'Boy or girl?'),
  a.choice('B39-03', 'Which sex chromosomes does a human male have?', ['XX', 'YY', 'XY', 'X only'], 2, 'Which chromosome causes male characteristics?', ['Females have two X chromosomes, XX.', 'Males have an X and a Y chromosome, XY.']),
  a.choice('B39-04', 'A couple are expecting a baby. What is the chance that the baby will be a girl?', ['1 in 4 (25%)', '1 in 2 (50%)', '3 in 4 (75%)', '1 in 1 (100%)'], 1, 'How many of the four squares in the Punnett square are XX?', ['The Punnett square gives XX, XX, XY and XY.', 'Two of the four are XX, so the chance is 1 in 2 (50%).']),
  t('B39-05', 'Versions of a gene'),
  a.choice('B39-06', 'A mouse has the alleles Bb. Which word describes it?', ['Heterozygous', 'Homozygous', 'Recessive', 'Asexual'], 0, 'Are its two alleles the same or different?', ['Its two alleles, B and b, are different.', 'When the two alleles are different, the organism is heterozygous.']),
  a.choice('B39-07', 'In mice, black fur (B) is dominant to brown fur (b). Which mouse has brown fur?', ['BB', 'Bb', 'bb'], 2, 'How many copies does a recessive allele need to show?', ['One B allele is enough for black fur, so BB and Bb mice are black.', 'Brown is recessive, so only a bb mouse has brown fur.']),
  t('B39-08', 'Crossing two mice'),
  a.worked('B39-09', 'Find a probability', 'In mice, black fur (B) is dominant to brown fur (b). Two Bb mice are crossed. What is the probability that a baby mouse has brown fur?', ['Draw the Punnett square: each parent can give B or b.', 'Fill the squares: BB, Bb, Bb and bb.', 'Brown fur needs bb, and 1 of the 4 squares is bb.', 'So the probability is 1 in 4, which is 25%. The ratio of black to brown is 3 : 1.'], 'inherit-cross-worked'),
  a.choice('B39-10', 'A Bb mouse is crossed with a bb mouse. What is the probability that a baby mouse has brown fur?', ['1 in 4 (25%)', '3 in 4 (75%)', '1 in 2 (50%)', '0 (0%)'], 2, 'Draw the square. The bb parent can only give b.', ['The four squares are Bb, Bb, bb and bb.', '2 of the 4 squares are bb, so the probability is 2 in 4 = 1 in 2 (50%).'], 'calculation'),
  a.choice('B39-11', 'A mouse has the genotype Bb. What is its phenotype?', ['Black fur', 'Bb', 'Heterozygous', 'Brown fur'], 0, 'Phenotype is the characteristic, not the letters.', ['Bb is the genotype, and heterozygous describes it.', 'B is dominant, so the phenotype is black fur.']),
  a.choice('B39-12', 'A couple already have three boys. What is the chance that their next baby will be a girl?', ['Almost certain, because a girl is due', '1 in 4 (25%)', 'No chance at all', '1 in 2 (50%)'], 3, 'Does an earlier baby change which sperm fertilises the next egg?', ['Each pregnancy is separate, and the Punnett square is the same every time.', 'So the chance is still 1 in 2 (50%).'], 'application', true),
  a.choice('B39-13', 'In pea plants, the allele for tall plants (T) is dominant to the allele for short plants (t). The Punnett square shows a cross between two Tt plants. Which numbered square gives a short plant?', ['Square 1', 'Square 2', 'Square 3', 'Square 4'], 3, 'Fill in each square from its column and its row. A short plant needs tt.', ['Squares 1, 2 and 3 each get at least one T, so they give tall plants.', 'Square 4 gets t from both parents, so it is tt: a short plant.'], 'understanding', true, 'inherit-cross-question'),
  a.choice('B39-14', 'In pea plants, purple flowers (P) are dominant to white flowers (p). Two Pp plants are crossed. What is the expected ratio of purple to white offspring?', ['1 : 1', '3 : 1', '1 : 3', '4 : 0'], 1, 'Draw the Punnett square, then count purple and white.', ['The squares are PP, Pp, Pp and pp; only pp is white.', 'Three purple to one white is a ratio of 3 : 1.'], 'calculation', true),
  a.choice('B39-15', 'A breeder crossed two Bb mice several times. The chart shows the babies they got. Which conclusion fits?', ['The results are close to the 3 : 1 ratio the Punnett square predicts', 'Every litter from these mice will be exactly 3 : 1', 'The Punnett square must be wrong', 'Brown fur must be dominant'], 0, 'Work out 3 : 1 for 18 babies. How close are the real results?', ['There were 13 black and 5 brown babies; a 3 : 1 ratio of 18 would be about 13.5 and 4.5.', 'So the results are close to 3 : 1, but a genetic diagram only gives chances, not exact numbers.'], 'dataInterpretation', true, 'inherit-mice-data'),
  a.written('B39-16', 'Two mice with black fur have a baby with brown fur. Use a genetic diagram to explain how this can happen. Black fur (B) is dominant to brown fur (b).', 'Start with the baby’s genotype, then work out what each parent must carry.', 'Brown fur is recessive, so the brown baby must be bb. It got one b allele from each parent. Both parents have black fur, so each must also have a B: they are both Bb. A Punnett square of Bb × Bb gives BB, Bb, Bb and bb, so there is a 1 in 4 (25%) chance of a brown baby.', ['Brown fur is recessive, so the brown baby is bb.', 'The baby got one b allele from each parent.', 'So both black parents must be heterozygous, Bb.', 'A Punnett square of Bb × Bb gives BB, Bb, Bb and bb.', 'So there is a 1 in 4 (25%) chance of a brown baby.'], ['Saying brown fur is dominant.', 'Saying one parent must be bb, even though both have black fur.', 'Saying a 1 in 4 chance means exactly one baby in every four will be brown.']),
]

export const lesson39: ScienceLesson = {
  id: 'B-GEN-039-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Sex chromosomes and genetic diagrams', prerequisites: ['B-MEIOSIS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
