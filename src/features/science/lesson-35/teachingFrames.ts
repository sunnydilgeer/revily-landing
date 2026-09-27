import type { TeachingFrame } from '../teachingFrame'

// Puberty first (sex hormones switch on), then what happens to the uterus lining and an egg over one cycle,
// and only then the four hormones that cause each stage.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const menstrualCycleFrames: Record<string, TeachingFrame[]> = {
  'B35-02': [
    f('Puberty starts', 'At puberty, the body starts releasing sex hormones.', 'puberty → sex hormones', 'Puberty is the time when a child’s body starts to develop into an adult body. The body starts releasing reproductive hormones. These are often called sex hormones.', 'hormone-puberty-start'),
    f('New features', 'Sex hormones cause secondary sexual characteristics.', 'sex hormones → body changes', 'Sex hormones make the body develop new features. Examples are facial hair growing in males and breasts developing in females. These are called secondary sexual characteristics.', 'hormone-puberty-features'),
    f('Testosterone', 'In males, testosterone from the testes stimulates sperm production.', 'testes → testosterone → sperm', 'In males, the main reproductive hormone is testosterone. You met it as the hormone made by the testes. At puberty, it stimulates the testes to start making sperm.', 'hormone-puberty-testosterone'),
    f('Oestrogen', 'In females, oestrogen from the ovaries is the main reproductive hormone.', 'ovaries → oestrogen → eggs mature', 'In females, the main reproductive hormone is oestrogen, made by the ovaries. At puberty, sex hormones cause eggs to start maturing in the ovaries. The menstrual cycle also begins.', 'hormone-puberty-oestrogen'),
  ],
  'B35-05': [
    f('A monthly cycle', 'The menstrual cycle repeats about every 28 days.', 'one cycle ≈ 28 days', 'After puberty, the uterus goes through the same changes about once a month. The changes get it ready to receive a fertilised egg. This is called the menstrual cycle, and it lasts about 28 days.', 'hormone-cycle-intro'),
    f('Stage 1: a period', 'Days 1–4: the uterus lining breaks down.', 'stage 1 = lining breaks down', 'On day 1, the thick lining of the uterus starts to break down. It leaves the body through the vagina, over about four days. This is called menstruation, or a period.', 'hormone-cycle-stage1'),
    f('Stage 2: building up', 'The lining builds up again.', 'stage 2 = lining builds up', 'From about day 4, the lining builds up again. It becomes a thick, spongy layer full of blood vessels. Now it is ready to receive a fertilised egg.', 'hormone-cycle-stage2'),
    f('Stage 3: ovulation', 'At about day 14, an egg is released.', 'stage 3 = egg released', 'At about day 14, an egg is released from one of the ovaries. It moves into the oviduct, the tube that leads to the uterus. The release of an egg is called ovulation.', 'hormone-cycle-stage3'),
    f('Stage 4: kept ready', 'The lining stays thick, then breaks down if no fertilised egg settles.', 'stage 4 = lining kept thick', 'The lining stays thick for about two more weeks. If no fertilised egg has settled in the lining by day 28, the lining starts to break down. Then the whole cycle starts again.', 'hormone-cycle-stage4'),
    f('Put it together', 'Four stages repeat about every 28 days.', 'breaks down → builds up → egg → kept', 'In stage 1, the lining breaks down. In stage 2, it builds up. In stage 3, an egg is released. In stage 4, the lining is kept thick, ready for a fertilised egg.', 'hormone-cycle-all'),
  ],
  'B35-08': [
    f('FSH', 'FSH makes an egg mature in an ovary.', 'FSH → egg matures', 'Four hormones control the cycle. The first is follicle-stimulating hormone, or FSH for short. FSH causes an egg to mature in one of the ovaries.', 'hormone-organs-fsh'),
    f('LH', 'LH makes the mature egg be released.', 'LH → egg released', 'The second hormone is luteinising hormone, or LH for short. LH causes the mature egg to be released from the ovary. So LH causes ovulation.', 'hormone-organs-lh'),
    f('Oestrogen and progesterone', 'Oestrogen and progesterone grow and keep the lining.', 'oestrogen + progesterone → lining', 'Oestrogen works with a fourth hormone, called progesterone. Together they make the uterus lining grow. They also keep the lining thick, ready for a fertilised egg.', 'hormone-organs-lining'),
    f('Put it together', 'Two hormones for the egg, two for the lining.', 'egg: FSH, LH; lining: oestrogen, progesterone', 'FSH makes an egg mature, then LH makes it be released. Oestrogen and progesterone grow and maintain the uterus lining. Together, the four hormones control the stages of the cycle.', 'hormone-organs-hormones'),
  ],
}
