/*
 * Higher-only sections for chapter B5 (hormones in human reproduction), from the CGP AQA Combined Science Higher guide,
 * pages 60 and 62 (scope only; all wording, examples and drawings are original). AQA 8464 4.5.3.3 (HT) and 4.5.3.5 (HT).
 * Diagrams: components/HigherFertilityVisuals.tsx ('hfert-').
 *
 * tier.ts splices additions in array order. In each lesson the last section is placed before the "On your own" screen
 * and each earlier section is then placed before the section that follows it, so the array lists them last first.
 * Sensitive topic: factual, neutral wording; the ethics frame gives each view in equal space.
 */
import { addition, f, type HigherAddition } from './helpers'

// Biology · puberty and the menstrual cycle · Higher p60: reading the four hormone levels on one graph.
const hormoneGraph = addition('B-HOM-035-B', 'B35-11', 'B-HIGHER-CYCLE-GRAPH', ['4.5.3.3'],
  { id: 'B35-H05', higher: true, label: 'Reading a hormone graph', detail: 'Four hormone levels over 28 days' },
  [
    f('Hormone levels', 'A graph can show all four hormone levels over one cycle.', 'days along the bottom, level up the side', 'The level of each hormone in the blood changes during the cycle. A graph can show all four hormones on the same axes. The days of the cycle go along the bottom. Early in the cycle the FSH level is raised, so an egg starts to mature.', 'hfert-graph-fsh'),
    f('Oestrogen rises', 'Oestrogen rises in the first half and peaks just before day 14.', 'oestrogen up → FSH down', 'As the follicle grows, it releases more and more oestrogen. The oestrogen level peaks just before day 14. Notice that the FSH level falls as oestrogen rises. That is because oestrogen inhibits FSH.', 'hfert-graph-oestrogen'),
    f('The LH peak', 'LH shoots up to a sharp peak at about day 14.', 'LH peak → ovulation', 'High oestrogen stimulates the pituitary gland to release LH. So the LH level shoots up to a sharp peak at about day 14. This peak triggers ovulation. Then the LH level quickly falls again.', 'hfert-graph-lh'),
    f('Progesterone', 'Progesterone is high in the second half of the cycle, then falls.', 'progesterone high → lining kept thick', 'After ovulation, the progesterone level rises. It stays high through the second half of the cycle, so the lining is kept thick. FSH and LH stay low because progesterone inhibits them. Near day 28, progesterone falls and the lining breaks down.', 'hfert-graph-progesterone'),
    f('Put it together', 'Each rise on the graph leads to the next event in the cycle.', 'FSH → oestrogen → LH → progesterone', 'Read the graph from left to right. FSH rises first, and an egg matures. Oestrogen rises, and the lining grows. The LH peak at day 14 releases the egg. Progesterone keeps the lining thick, then falls, and the cycle starts again.', 'hfert-graph-all'),
  ],
  a => [
    a.choice('B35-H06', 'On a graph of hormone levels during the cycle, which hormone has a sharp peak at about day 14?', ['LH', 'Oestrogen', 'Progesterone', 'FSH'], 0, 'Which hormone triggers ovulation?', ['Oestrogen peaks just before day 14, and progesterone is high in the second half of the cycle.', 'LH has a sharp peak at about day 14, and this triggers ovulation.']),
    a.choice('B35-H07', 'The graph shows the levels of four hormones over one cycle. Which numbered line shows progesterone?', ['Line 1', 'Line 2', 'Line 3', 'Line 4'], 1, 'Progesterone is made after ovulation. In which half of the cycle is it high?', ['Line 3 has a sharp peak at day 14, so it is LH. Line 4 peaks just before it, so it is oestrogen.', 'Line 2 is low in the first half and high in the second half, so it shows progesterone.'], 'dataInterpretation', true, 'hfert-graph-question'),
    a.choice('B35-H08', 'Near the end of the cycle, the progesterone level falls. What happens next?', ['The lining gets thicker and LH peaks', 'An egg is released straight away', 'The lining breaks down, and FSH is no longer inhibited', 'Oestrogen stops the lining from growing'], 2, 'Progesterone keeps the lining thick and inhibits FSH.', ['While progesterone is high, the lining is kept thick and FSH is inhibited.', 'When it falls, the lining breaks down and FSH is released again, so a new cycle starts.']),
  ])

// Biology · puberty and the menstrual cycle · Higher p60: where FSH and LH come from, and how the four hormones affect one another.
const hormoneLoop = addition('B-HOM-035-B', 'B35-H05', 'B-HIGHER-CYCLE-HORMONES', ['4.5.3.3'],
  { id: 'B35-H01', higher: true, label: 'How the four hormones work together', detail: 'Stimulating and inhibiting each other' },
  [
    f('FSH starts it off', 'FSH from the pituitary gland makes an egg mature and stimulates oestrogen.', 'pituitary → FSH → egg matures + oestrogen made', 'FSH is released by the pituitary gland, a small gland under the brain. In an ovary, FSH makes an egg mature inside a tiny sac of fluid. This sac is called a follicle. FSH also stimulates the ovaries to make oestrogen.', 'hfert-loop-fsh'),
    f('Oestrogen', 'Oestrogen grows the lining, stimulates LH and inhibits FSH.', 'oestrogen → more LH, less FSH', 'Oestrogen from the ovaries makes the uterus lining grow. It also travels in the blood to the pituitary gland. There it stimulates the release of LH. It also stops FSH being released, which is called inhibiting FSH.', 'hfert-loop-oestrogen'),
    f('LH', 'LH from the pituitary gland triggers ovulation at about day 14.', 'LH → egg released', 'LH is also made by the pituitary gland. When the oestrogen level is high, the pituitary gland releases a burst of LH. LH makes the follicle release its egg at about day 14. You met this as ovulation.', 'hfert-loop-lh'),
    f('Progesterone', 'Progesterone keeps the lining thick and inhibits FSH and LH.', 'progesterone → lining kept, less FSH and LH', 'After ovulation, what is left of the follicle stays in the ovary and releases progesterone. Progesterone maintains the uterus lining during the second half of the cycle. It also inhibits both FSH and LH. So no new egg matures while the lining is kept ready.', 'hfert-loop-progesterone'),
    f('Put it together', 'When progesterone falls, the lining breaks down and the cycle starts again.', 'progesterone falls → period → FSH again', 'If no fertilised egg settles in the lining, the progesterone level falls. Without progesterone, the lining breaks down, and this is a period. FSH is no longer inhibited, so the pituitary gland releases it again. A new egg starts to mature.', 'hfert-loop-all'),
  ],
  a => [
    a.choice('B35-H02', 'Which hormone is released by the pituitary gland and makes an egg mature in a follicle?', ['Oestrogen', 'Progesterone', 'FSH', 'LH'], 2, 'It is the hormone that starts each cycle off.', ['Oestrogen and progesterone come from the ovaries, and LH triggers the release of the egg.', 'FSH, from the pituitary gland, makes an egg mature inside a follicle.']),
    a.choice('B35-H03', 'Which hormone inhibits both FSH and LH?', ['FSH', 'Progesterone', 'Oestrogen', 'LH'], 1, 'This hormone is high in the second half of the cycle.', ['Oestrogen inhibits FSH, but it stimulates the release of LH.', 'Progesterone, made after ovulation, inhibits both FSH and LH.']),
    a.choice('B35-H04', 'The oestrogen level rises during the first half of the cycle. What effect does this have on the pituitary gland?', ['It stimulates the release of FSH and inhibits the release of LH', 'It stops the pituitary gland releasing any hormones', 'It makes the pituitary gland release progesterone', 'It stimulates the release of LH and inhibits the release of FSH'], 3, 'Which hormone does the pituitary gland need to release next, for ovulation?', ['Progesterone is made in the ovary, not the pituitary gland.', 'Oestrogen stimulates the release of LH, which triggers ovulation, and inhibits the release of FSH.'], 'application', true),
  ])

// Biology · contraception · Higher p62: weighing up IVF, including the ethical issues.
const weighIvf = addition('B-HOM-036-B', 'B36-13', 'B-HIGHER-IVF-WEIGH', ['4.5.3.5'],
  { id: 'B36-H08', higher: true, label: 'Weighing up IVF', detail: 'Benefits, risks and ethical issues' },
  [
    f('A chance of a child', 'IVF can give a couple who could not have a baby the chance of one.', 'IVF → a chance of a baby', 'The main benefit of IVF is that a couple who could not have a baby may now have one. For many couples, this means a great deal. IVF also has drawbacks, and people weigh these up in different ways.', 'hfert-weigh-benefit'),
    f('Multiple births', 'If more than one embryo develops, twins or triplets are born.', 'two embryos → twins → more risk', 'When two embryos are placed in the uterus, both may develop. Then the woman has twins or more, which is called a multiple birth. Multiple births carry more risks for the mother and for the babies.', 'hfert-weigh-multiple'),
    f('Success rate', 'Most IVF attempts do not lead to a baby.', 'many tries → stressful and upsetting', 'The share of attempts that lead to a baby is called the success rate, and for IVF it is low. Repeated failures can be very stressful and upsetting. IVF can also be hard on the body. Some women react strongly to the hormones, with stomach pain or being sick.', 'hfert-weigh-success'),
    f('Improving the odds', 'Microscope techniques have raised the success rate of IVF.', 'fine tools + time-lapse imaging', 'Very fine tools are used to handle eggs and sperm under a microscope. They can also remove one cell from an embryo for genetic testing. A camera in the incubator can take pictures of embryos as they grow. This is called time-lapse imaging, and it helps pick the embryos most likely to succeed.', 'hfert-weigh-tools'),
    f('Ethical issues', 'People disagree about what happens to embryos.', 'unused embryos, choosing embryos', 'IVF raises questions about right and wrong, called ethical issues. Unused embryos are often destroyed, and some people think each embryo is, or could become, a human life. Some also worry that testing embryos could be used to choose features such as biological sex or eye colour. Others think IVF is acceptable because it helps people have children, and testing can help avoid serious genetic disorders.', 'hfert-weigh-ethics'),
  ],
  a => [
    a.choice('B36-H09', 'Why can IVF lead to a multiple birth?', ['IVF embryos grow faster than other embryos', 'The hormones split each embryo in two', 'More than one embryo may be placed in the uterus, and more than one may develop', 'The uterus lining becomes too thick'], 2, 'How many embryos are placed in the uterus?', ['IVF does not make embryos split or grow faster.', 'One or two embryos may be placed in the uterus, and if both develop, the woman has twins.']),
    a.choice('B36-H10', 'Which of these is an ethical issue with IVF, rather than a medical risk?', ['Unused embryos are often destroyed', 'The success rate is low', 'The hormones can cause stomach pain', 'Twins or triplets carry more risks'], 0, 'An ethical issue is about whether something is right or wrong.', ['A low success rate, side effects and the risks of multiple births are practical and medical drawbacks.', 'Whether it is right to destroy unused embryos is a question of right and wrong, so it is an ethical issue.'], 'understanding', true),
  ])

// Biology · contraception · Higher p62: the steps of IVF.
const ivfSteps = addition('B-HOM-036-B', 'B36-H08', 'B-HIGHER-IVF', ['4.5.3.5'],
  { id: 'B36-H04', higher: true, label: 'How IVF works', detail: 'From ovary to lab dish to uterus' },
  [
    f('Several eggs', 'In IVF, FSH and LH are given so that several eggs mature.', 'FSH + LH → several eggs', 'If a fertility drug does not work, IVF may help. IVF stands for in vitro fertilisation, which means fertilising eggs in a lab. First, the woman is given FSH and LH. These make several eggs mature, not just one.', 'hfert-ivf-eggs'),
    f('Fertilised in a lab', 'The eggs are collected and fertilised with sperm in a lab.', 'collect eggs → add sperm', 'Next, the mature eggs are collected from the woman’s ovaries. In a lab, they are mixed with the man’s sperm in a dish. Some of the eggs are fertilised.', 'hfert-ivf-lab'),
    f('Embryos grow', 'Each fertilised egg divides to form a tiny ball of cells.', 'fertilised egg → ball of cells', 'The fertilised eggs are kept warm in an incubator. Each one divides again and again into a tiny ball of cells. This is called an embryo.', 'hfert-ivf-embryo'),
    f('Into the uterus', 'One or two embryos are placed in the uterus.', 'embryo → uterus → may settle in the lining', 'While the embryos are still tiny balls of cells, one or two are placed in the woman’s uterus. This improves the chance of a pregnancy. A pregnancy starts if an embryo settles into the lining.', 'hfert-ivf-uterus'),
    f('Put it together', 'IVF has four main steps.', 'hormones → lab → embryo → uterus', 'First, FSH and LH make several eggs mature. The eggs are collected and fertilised with sperm in a lab. The fertilised eggs grow into embryos in an incubator. Then one or two embryos are placed in the uterus.', 'hfert-ivf-all'),
  ],
  a => [
    a.choice('B36-H05', 'In IVF, why is the woman given FSH and LH first?', ['To make several eggs mature, so they can be collected', 'To kill any sperm in the uterus', 'To make the embryos grow faster', 'To stop the uterus lining building up'], 0, 'What does FSH do to eggs?', ['FSH and LH do not affect sperm or make embryos grow.', 'They make several eggs mature at once, so that more than one can be collected.']),
    a.choice('B36-H06', 'The diagram shows four steps of IVF. Which number shows where the eggs are fertilised?', ['Step 1', 'Step 2', 'Step 3', 'Step 4'], 1, 'In IVF, fertilisation happens outside the body.', ['Step 1 is the ovary, step 3 is an embryo growing and step 4 is the uterus.', 'The eggs are fertilised with sperm in a lab dish, step 2.'], 'understanding', false, 'hfert-ivf-question'),
    a.choice('B36-H07', 'Which list shows the steps of IVF in the right order?', ['Eggs collected → FSH and LH given → embryos placed in the uterus → eggs fertilised', 'Embryos placed in the uterus → FSH and LH given → eggs fertilised → embryos grow', 'FSH and LH given → embryos placed in the uterus → eggs fertilised → embryos grow', 'FSH and LH given → eggs collected and fertilised → embryos grow → embryos placed in the uterus'], 3, 'Eggs must mature before they can be collected.', ['Hormones come first, so that several eggs mature.', 'Then the eggs are collected and fertilised, the embryos grow, and one or two are placed in the uterus.'], 'understanding', true),
  ])

// Biology · contraception · Higher p62: FSH and LH as a fertility drug.
const fertilityDrug = addition('B-HOM-036-B', 'B36-H04', 'B-HIGHER-FERTILITY-DRUG', ['4.5.3.5'],
  { id: 'B36-H01', higher: true, label: 'Hormones to help fertility', detail: 'FSH and LH in a fertility drug' },
  [
    f('Too little FSH', 'Some women make too little FSH for their eggs to mature.', 'low FSH → no egg matures → none released', 'Hormones can also be used to help people have a baby. Some women make too little FSH, so their eggs do not mature. Then no eggs are released, and they cannot get pregnant. Not being able to have a baby is called infertility.', 'hfert-drug-low'),
    f('A fertility drug', 'FSH and LH can be given as a fertility drug.', 'FSH + LH → egg matures → egg released', 'Doctors can give these women FSH and LH as a medicine. FSH makes an egg mature, and LH stimulates its release. A medicine that helps a woman to release eggs is called a fertility drug.', 'hfert-drug-given'),
    f('The benefit', 'A fertility drug helps many women to get pregnant.', 'drug → pregnancy possible', 'The main advantage is clear. Many women who could not get pregnant before become pregnant after taking a fertility drug. For many people, this matters a great deal.', 'hfert-drug-pro'),
    f('The drawbacks', 'It does not always work, and it can cause a multiple pregnancy.', 'many attempts, cost, twins or triplets', 'A fertility drug does not always work. Some women need many attempts, which can be expensive. The drug can also make too many eggs mature at once. This can lead to twins or triplets, which is called a multiple pregnancy.', 'hfert-drug-cons'),
  ],
  a => [
    a.choice('B36-H02', 'Why can a woman with very low FSH levels find it hard to get pregnant?', ['Her uterus lining is too thick', 'Her eggs do not mature, so none are released', 'Her body makes too much progesterone', 'Sperm cannot reach her uterus'], 1, 'What does FSH do to eggs?', ['FSH makes eggs mature.', 'With too little FSH, eggs do not mature, so no eggs are released and none can be fertilised.']),
    a.choice('B36-H03', 'A woman takes a fertility drug containing FSH and LH. Which is a possible disadvantage of this treatment?', ['It stops her ovaries making eggs', 'It protects against sexually transmitted infections', 'It always works first time', 'Several eggs may be released, leading to a multiple pregnancy'], 3, 'What happens if too many eggs mature at once?', ['A fertility drug helps eggs mature, does nothing against STIs and does not always work.', 'It can make several eggs mature and be released, which can lead to twins or triplets.'], 'application', true),
  ])

export const higherB5Fertility: HigherAddition[] = [hormoneGraph, hormoneLoop, weighIvf, ivfSteps, fertilityDrug]
