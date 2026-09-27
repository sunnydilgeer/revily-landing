# Lesson 40 storyboard — Puberty and the menstrual cycle (v1)

Chapter B5, Homeostasis and response. Folder `lesson-35`, lesson id `B-HOM-035-B`, skill `B-MENSTRUAL-CYCLE`.

Big idea: at puberty, sex hormones switch on. In females this starts a cycle of about 28 days, in which the uterus lining breaks down, builds up and is kept ready while an egg matures and is released. Four hormones control it: FSH and LH act on the egg, and oestrogen and progesterone act on the lining.

Flow note: the lesson moves from what learners can see and already half-know (puberty) to what happens inside (the cycle) to what causes it (the hormones).
1. **Puberty.** Sex hormones switch on → secondary sexual characteristics → testosterone and sperm production → oestrogen and the start of the cycle. The testes and ovaries link straight back to the endocrine glands lesson.
2. **Follow one cycle.** One timeline of the lining's thickness over 28 days, built up stage by stage (period → building up → ovulation → kept thick) and then shown whole. The stages come before the hormones because each hormone is taught as the cause of a stage learners have already seen.
3. **Which hormone does what?** The female reproductive organs, with FSH (egg matures), LH (egg released), then oestrogen and progesterone (lining grows and is kept), then all four together.

1. Start here (B35-01): which gland releases testosterone? (from the endocrine glands lesson).
2. What happens at puberty? (B35-02–04): four frames on `hormone-puberty-*`. Checks: a secondary sexual characteristic; the hormone for sperm production.
3. Follow one cycle (B35-05–07): six frames on `hormone-cycle-*`. Checks: the day of ovulation; what happens in stage 2.
4. Which hormone does what? (B35-08–10): four frames on `hormone-organs-*`. Checks: which hormone matures an egg; which two look after the lining.
5. On your own (B35-11–15): working out a likely ovulation date from a period start date; a numbered organs diagram (where eggs mature); a lettered timeline (when the lining builds up); an invented four-month cycle-length chart read without over-claiming; a teacher-reviewed written answer.

Wording rules: factual, neutral and age-appropriate; simple front-view schematic organs only; one new term per frame; British spelling; other lessons named by topic only.

Out of scope: where FSH and LH are made and how the four hormones affect one another (Higher only); hormones to treat infertility and IVF (Higher only); fertilisation and pregnancy beyond "a fertilised egg settles in the lining"; contraception (next lesson).

Source boundary: supplied page 57 (for scope only); AQA 8464 section 4.5.3.3, Foundation content only. All wording, the dates question, the cycle-length data and every diagram are original. Draft pending teacher review.

---

## Diagram plan
- `components/HormoneVisuals.tsx`. Colour code: indigo tags = hormones, pink-red = uterus lining, cream = eggs.
- **Puberty** (`hormone-puberty-*`, B35-02): two rows, testes → testosterone → effects, and ovaries → oestrogen → effects. The two secondary sexual characteristics are picked out in pink in the "New features" frame.
- **The cycle timeline** (`hormone-cycle-*`, B35-05): an original lining-thickness curve over days 1–28 plus the start of the next cycle. It is thin and ragged in days 1–4, thickens to about day 14, stays thick with blood vessels to day 28, then breaks down again. Four shaded stage bands carry numbered badges, and the egg is released at day 14. The caption across the top changes with the frame. `hormone-cycle-letters` hides the badges and captions and marks days 2, 9, 14 and 21 as A–D.
- **Female reproductive organs** (`hormone-organs-*`, B35-08): a simple front view of the ovaries, oviducts, uterus with its lining, and the vagina, as in a textbook, with no detail beyond what the spec needs. FSH rings a maturing egg; LH shows the egg leaving the ovary; oestrogen and progesterone point to the lining. `hormone-organs-question` numbers the ovary, oviduct, uterus and vagina (1–4).
- **Cycle lengths** (`hormone-cycle-lengths`, B35-14): invented bar chart from zero (27, 29, 28 and 30 days), with no conclusion written on it.

## States in full

### B35-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** Which gland releases the hormone testosterone?
- 0 Pituitary gland · 1 Thyroid gland · **2 Testes ✓** · 3 Pancreas
- Hint: You met the six glands when you learned about the endocrine system.
- Explanation: The pituitary gland, thyroid gland and pancreas release other hormones. Testosterone is released by the testes.

### B35-02 · teach "What happens at puberty?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Puberty starts | At puberty, the body starts releasing sex hormones. | puberty → sex hormones | Puberty is the time when a child’s body starts to develop into an adult body. The body starts releasing reproductive hormones. These are often called sex hormones. | `hormone-puberty-start` |
| New features | Sex hormones cause secondary sexual characteristics. | sex hormones → body changes | Sex hormones make the body develop new features. Examples are facial hair growing in males and breasts developing in females. These are called secondary sexual characteristics. | `hormone-puberty-features` |
| Testosterone | In males, testosterone from the testes stimulates sperm production. | testes → testosterone → sperm | In males, the main reproductive hormone is testosterone. You met it as the hormone made by the testes. At puberty, it stimulates the testes to start making sperm. | `hormone-puberty-testosterone` |
| Oestrogen | In females, oestrogen from the ovaries is the main reproductive hormone. | ovaries → oestrogen → eggs mature | In females, the main reproductive hormone is oestrogen, made by the ovaries. At puberty, sex hormones cause eggs to start maturing in the ovaries. The menstrual cycle also begins. | `hormone-puberty-oestrogen` |

### B35-03 · choice
**Q:** Which of these is a secondary sexual characteristic?
- 0 Having a heart that pumps blood · **1 Facial hair growing in males ✓** · 2 Being able to digest food · 3 Blood carrying hormones
- Hint: Which one is a new feature that develops at puberty?
- Explanation: The heart, digestion and the blood all work long before puberty. Facial hair in males develops at puberty, so it is a secondary sexual characteristic.

### B35-04 · choice
**Q:** Which hormone stimulates sperm production?
- 0 Oestrogen · 1 Insulin · 2 Adrenaline · **3 Testosterone ✓**
- Hint: Which is the main reproductive hormone in males?
- Explanation: Oestrogen is the main female reproductive hormone; insulin and adrenaline do other jobs. Testosterone, made by the testes, stimulates sperm production.

### B35-05 · teach "Follow one cycle"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A monthly cycle | The menstrual cycle repeats about every 28 days. | one cycle ≈ 28 days | After puberty, the uterus goes through the same changes about once a month. The changes get it ready to receive a fertilised egg. This is called the menstrual cycle, and it lasts about 28 days. | `hormone-cycle-intro` |
| Stage 1: a period | Days 1–4: the uterus lining breaks down. | stage 1 = lining breaks down | On day 1, the thick lining of the uterus starts to break down. It leaves the body through the vagina, over about four days. This is called menstruation, or a period. | `hormone-cycle-stage1` |
| Stage 2: building up | The lining builds up again. | stage 2 = lining builds up | From about day 4, the lining builds up again. It becomes a thick, spongy layer full of blood vessels. Now it is ready to receive a fertilised egg. | `hormone-cycle-stage2` |
| Stage 3: ovulation | At about day 14, an egg is released. | stage 3 = egg released | At about day 14, an egg is released from one of the ovaries. It moves into the oviduct, the tube that leads to the uterus. The release of an egg is called ovulation. | `hormone-cycle-stage3` |
| Stage 4: kept ready | The lining stays thick, then breaks down if no fertilised egg settles. | stage 4 = lining kept thick | The lining stays thick for about two more weeks. If no fertilised egg has settled in the lining by day 28, the lining starts to break down. Then the whole cycle starts again. | `hormone-cycle-stage4` |
| Put it together | Four stages repeat about every 28 days. | breaks down → builds up → egg → kept | In stage 1, the lining breaks down. In stage 2, it builds up. In stage 3, an egg is released. In stage 4, the lining is kept thick, ready for a fertilised egg. | `hormone-cycle-all` |

### B35-06 · choice
**Q:** In a 28-day cycle, on about which day is an egg released?
- 0 Day 1 · 1 Day 4 · **2 Day 14 ✓** · 3 Day 28
- Hint: Ovulation happens about halfway through the cycle.
- Explanation: Days 1 to 4 are the period, and day 28 is the end of the cycle. The egg is released at about day 14.

### B35-07 · choice
**Q:** What happens to the uterus lining in stage 2?
- 0 It breaks down and leaves the body · **1 It builds up into a thick, spongy layer full of blood vessels ✓** · 2 It turns into an egg · 3 It moves into the oviduct
- Hint: Stage 2 comes straight after the period.
- Explanation: The lining breaks down in stage 1, the period. In stage 2, it builds up into a thick, spongy layer full of blood vessels.

### B35-08 · teach "Which hormone does what?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| FSH | FSH makes an egg mature in an ovary. | FSH → egg matures | Four hormones control the cycle. The first is follicle-stimulating hormone, or FSH for short. FSH causes an egg to mature in one of the ovaries. | `hormone-organs-fsh` |
| LH | LH makes the mature egg be released. | LH → egg released | The second hormone is luteinising hormone, or LH for short. LH causes the mature egg to be released from the ovary. So LH causes ovulation. | `hormone-organs-lh` |
| Oestrogen and progesterone | Oestrogen and progesterone grow and keep the lining. | oestrogen + progesterone → lining | Oestrogen works with a fourth hormone, called progesterone. Together they make the uterus lining grow. They also keep the lining thick, ready for a fertilised egg. | `hormone-organs-lining` |
| Put it together | Two hormones for the egg, two for the lining. | egg: FSH, LH; lining: oestrogen, progesterone | FSH makes an egg mature, then LH makes it be released. Oestrogen and progesterone grow and maintain the uterus lining. Together, the four hormones control the stages of the cycle. | `hormone-organs-hormones` |

### B35-09 · choice
**Q:** Which hormone causes an egg to mature in an ovary?
- **0 FSH ✓** · 1 LH · 2 Progesterone · 3 Testosterone
- Hint: Which hormone acts first in the cycle?
- Explanation: LH causes the egg to be released, and progesterone helps keep the lining thick. FSH causes an egg to mature in an ovary.

### B35-10 · choice
**Q:** Which two hormones grow and maintain the uterus lining?
- 0 FSH and LH · **1 Oestrogen and progesterone ✓** · 2 Insulin and adrenaline · 3 LH and testosterone
- Hint: Two hormones look after the egg, and two look after the lining.
- Explanation: FSH and LH act on the egg in the ovary. Oestrogen and progesterone grow and maintain the uterus lining.

### B35-11 · choice · `application`, independent
**Q:** Amira’s period starts on 1 March, and her cycle lasts about 28 days. On about which date would you expect an egg to be released?
- 0 1 March · 1 4 March · **2 14 March ✓** · 3 28 March
- Hint: Day 1 of the cycle is 1 March. When is ovulation?
- Explanation: Day 1 is the first day of the period, 1 March. Ovulation is at about day 14, so about 14 March.

### B35-12 · choice · `understanding`, independent · question diagram `hormone-organs-question` (assessment version hides the answer)
**Q:** Look at the numbered parts. Which number shows where eggs mature?
- **0 Part 1 ✓** · 1 Part 2 · 2 Part 3 · 3 Part 4
- Hint: Eggs mature in the organs that also release oestrogen.
- Explanation: Part 2 is the oviduct, part 3 the uterus and part 4 the vagina. Eggs mature in the ovary, part 1.

### B35-13 · choice · `understanding`, independent · question diagram `hormone-cycle-letters` (assessment version hides the answer)
**Q:** Look at the timeline. Which letter shows a time when the lining is building up?
- 0 A · **1 B ✓** · 2 C · 3 D
- Hint: The lining builds up between the period and ovulation.
- Explanation: A is during the period, C is ovulation and D is while the lining is kept thick. B is between the period and ovulation, when the lining builds up.

### B35-14 · choice · `dataInterpretation`, independent · question diagram `hormone-cycle-lengths` (assessment version hides the answer)
**Q:** The chart shows the length of one person’s cycle over four months. Which conclusion fits the data best?
- 0 Her cycle was exactly 28 days every month · 1 Her cycles got shorter every month · 2 Every person’s cycle lasts 27 to 30 days · **3 Her cycle length varied a little, around 28 days ✓**
- Hint: Look at all four numbers. Do they stay the same?
- Explanation: Her cycles were 27, 29, 28 and 30 days, so they changed a little, but not always in one direction; one person cannot show what happens for everyone. So her cycle length varied a little, around 28 days.

### B35-15 · written · `teacherOnly`
**Q:** Describe what happens to the uterus lining and to an egg during one 28-day menstrual cycle. Name the hormone that causes the egg to be released.
- Hint: Go through the four stages in order, and say what the lining and the egg are doing in each.
- Model answer: In days 1 to 4, the lining breaks down and leaves the body; this is a period. The lining then builds up into a thick, spongy layer full of blood vessels. At about day 14, LH causes an egg to be released from an ovary; this is ovulation. The lining is kept thick, and if no fertilised egg settles by day 28 it breaks down and the cycle starts again.
- Marking points: Days 1 to 4: the lining breaks down (menstruation, a period). · The lining then builds up into a thick layer with blood vessels. · At about day 14 an egg is released from an ovary (ovulation). · LH causes the egg to be released. · The lining is kept thick, then breaks down if no fertilised egg settles by day 28.
- Common errors: Saying the egg is released on day 1 or during the period. · Saying FSH releases the egg (FSH makes it mature). · Saying the lining is thickest during menstruation. · Saying testosterone controls the menstrual cycle.

---

## Checks
- 15 states: 3 teaching states (4 + 6 + 4 = 14 frames), 11 choice questions and 1 written task.
- Correct answer positions: 0 ×2, 1 ×4, 2 ×3, 3 ×2. The largest share is 36%.
- Question diagrams: 3, all shown in `assessment` form (B35-12, B35-13, B35-14).
