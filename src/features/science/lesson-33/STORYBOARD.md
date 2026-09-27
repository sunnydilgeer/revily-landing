# Lesson 38 storyboard — Hormones and the endocrine system (v1)

Chapter B5, Homeostasis and response. Folder `lesson-33`, lesson id `B-HOM-033-B`, skill `B-HORMONES`.

Big idea: some messages in the body are chemicals. Endocrine glands release hormones straight into the blood, the blood carries them everywhere, and only their target organs respond. This is slower than the nervous system, but the effects last longer.

Flow note: the lesson follows one hormone from start to finish before it names any particular gland. It opens with something learners already know: the plasma carries dissolved substances (the blood lesson). Then:
1. **What a hormone is.** Chemical messenger → endocrine gland (and the endocrine system) → carried in the blood → target organ → put it together. The route comes first because every later idea (each gland, and the comparison with nerves) is a special case of it.
2. **Where the glands are.** One body outline, built up one gland per frame: pituitary (the master gland), thyroid, adrenal glands, pancreas, then ovaries and testes shown in two enlarged circles, then the whole key. The pituitary comes first because "it controls other glands" only makes sense before the others are met; the pancreas is placed just before the sex glands and flagged as the next lesson.
3. **Nerves or hormones.** Nerves (a link back to the nervous-system lessons) → hormones → which one suits which job. This comes last because it needs both the hormone route and the nervous system.

1. Start here (B33-01): which part of the blood carries dissolved substances? (plasma, from the blood lesson).
2. What is a hormone? (B33-02–04): five frames on `hormone-route-*`. Checks: how a hormone travels; what a target organ is.
3. Where are the glands? (B33-05–08): six frames on `hormone-glands-*`. Checks: a numbered body diagram (which number is the pancreas); why the pituitary is the master gland; which hormone is "fight or flight".
4. Nerves or hormones? (B33-09–11): three frames on `hormone-compare-*`. Checks: the correct comparison; which response is nervous.
5. On your own (B33-12–16): adrenaline before a race; a numbered diagram (the gland for puberty and sperm production); an invented two-response table read without over-claiming; a mouse liver scenario (target organ); a teacher-reviewed written answer on pancreas → blood → liver.

Wording rules: one new term per frame, plain meaning first, then "this is called X"; British spelling; other lessons named by topic only.

Out of scope: how insulin controls blood glucose (next lesson); glucagon; negative feedback involving thyroxine and adrenaline (Higher only); the details of the menstrual cycle hormones (Lesson 40); reflex arcs and synapses (the nervous-system lessons).

Source boundary: supplied page 55 (for scope only); AQA 8464 section 4.5.3.1. All wording, the race and mouse scenarios, the two-response table and every diagram are original. Draft pending teacher review.

---

## Diagram plan
- `components/HormoneVisuals.tsx`, focus prefix `hormone-`. Colour code for the chapter: indigo diamonds = hormones, red tube = blood, gold = nerve impulses, green = a target organ that responds, amber = glucose (next lesson).
- **A hormone's route** (`hormone-route-*`, B33-02): gland → blood vessel → two organs (one grey "no response", one green target). Numbered steps 1–3 on the right; each frame highlights one step and fades the rest, like the Lesson 18 transpiration stream.
- **Glands on a body** (`hormone-glands-*`, B33-05): an anatomy figure (numbered pointers 1–6, key underneath, Enlarge button). Ovaries and testes sit in two enlarged circles off the pelvis, so one neutral body can show both. In the assessment version (`hormone-glands-question`) the key and the "female/male" captions are hidden; the pointers stay.
- **Nerves compared with hormones** (`hormone-compare-*`, B33-09): two lanes, a neurone to one muscle (gold) above, a gland and blood vessel to many organs (indigo) below, each with three short tags.
- **Two responses** (`hormone-response-data`, B33-14): an invented table only; no conclusion is written on it.

## States in full

### B33-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** Blood carries many substances around the body. Which part of the blood carries dissolved substances, such as glucose?
- 0 Red blood cells · **1 Plasma ✓** · 2 Platelets · 3 White blood cells
- Hint: You met the parts of the blood when you learned about blood.
- Explanation: Red blood cells carry oxygen, platelets help blood clot and white blood cells defend the body. Plasma is the liquid part of the blood, so it carries dissolved substances.

### B33-02 · teach "What is a hormone?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Chemical messengers | Hormones are chemicals that carry messages around the body. | hormone = chemical messenger | Your body does not send every message as a nerve impulse. Some messages are chemicals made by glands. A chemical messenger like this is called a hormone. | `hormone-route-hormone` |
| Endocrine glands | Glands release hormones straight into the blood. | gland → straight into the blood | A gland releases its hormone directly into the blood, not through a tube. A gland that does this is called an endocrine gland. Together, these glands make up the endocrine system. | `hormone-route-gland` |
| Carried in the blood | The blood carries hormones all around the body. | released → carried everywhere | Once a hormone is in the blood, the blood carries it all around the body. It travels dissolved in the plasma. You met plasma when you learned about blood. | `hormone-route-blood` |
| Target organs | Only certain organs respond to a hormone. | reaches most organs, only targets respond | A hormone reaches almost every organ, but only some of them respond to it. An organ that responds to a hormone is called a target organ. Other organs do not respond. | `hormone-route-target` |
| Put it together | Gland → blood → target organ. | gland → blood → target organ | A gland releases a hormone straight into the blood. The blood carries it around the body. Only its target organs respond. Next, you will see where the main glands are. | `hormone-route-all` |

### B33-03 · choice
**Q:** How does a hormone travel from its gland to its target organ?
- 0 Along neurones, as an electrical impulse · 1 Through a tube, straight to the target organ · **2 In the blood ✓** · 3 Through the air in the lungs
- Hint: Where does an endocrine gland release its hormone?
- Explanation: Endocrine glands release hormones directly into the blood, not into a tube. So the blood carries hormones to their target organs.

### B33-04 · choice
**Q:** A hormone reaches every organ in the body, but only the liver responds to it. What is the liver for this hormone?
- 0 The gland that made it · 1 The endocrine system · 2 A nerve · **3 A target organ ✓**
- Hint: What do we call an organ that responds to a hormone?
- Explanation: The hormone reaches almost every organ, but most do not respond. An organ that responds to a hormone is a target organ.

### B33-05 · teach "Where are the glands?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The pituitary gland | The pituitary gland is the “master gland”. | pituitary → controls other glands | The pituitary gland is a small gland under the brain. It releases several hormones. Many of them act on other glands and make them release their own hormones. So it is often called the master gland. | `hormone-glands-pituitary` |
| The thyroid gland | The thyroid gland releases thyroxine. | thyroid → thyroxine → metabolism | The thyroid gland is in the neck. It releases a hormone called thyroxine. Thyroxine helps control the rate of metabolism, which is how quickly reactions happen in your cells. It also affects heart rate and body temperature. | `hormone-glands-thyroid` |
| The adrenal glands | The adrenal glands release adrenaline. | adrenaline = fight or flight | There are two adrenal glands, one on top of each kidney. They release a hormone called adrenaline. Adrenaline gets the body ready to act at a scary or exciting moment. This is called the “fight or flight” response. | `hormone-glands-adrenal` |
| The pancreas | The pancreas releases insulin. | pancreas → insulin → blood glucose | The pancreas sits just below the stomach. It releases a hormone called insulin. Insulin helps control the amount of glucose in the blood. You will learn how in the next lesson. | `hormone-glands-pancreas` |
| Ovaries and testes | Ovaries release oestrogen; testes release testosterone. | ovaries → oestrogen; testes → testosterone | Females have two ovaries, which release oestrogen. Oestrogen is involved in the menstrual cycle. Males have two testes, which release testosterone. Testosterone controls puberty and sperm production in males. | `hormone-glands-sex` |
| Put it together | Six glands, each with its own hormones. | gland → hormone → job | Each gland releases its own hormones, and each hormone has its own target organs. The key under the drawing lists all six glands. Use it to link each gland to its hormone and its job. | `hormone-glands-all` |

### B33-06 · choice · question diagram `hormone-glands-question` (assessment version hides the answer)
**Q:** Look at the numbered glands. Which number shows the pancreas?
- 0 Gland 1 · 1 Gland 2 · 2 Gland 3 · **3 Gland 4 ✓**
- Hint: The pancreas sits just below the stomach.
- Explanation: Gland 1 is the pituitary gland, gland 2 the thyroid gland and gland 3 the adrenal glands. Gland 4, just below the stomach, is the pancreas.

### B33-07 · choice
**Q:** Why is the pituitary gland called the “master gland”?
- 0 It is the largest gland in the body · **1 Its hormones act on other glands and make them release hormones ✓** · 2 It makes every hormone in the body · 3 It sends electrical impulses to the brain
- Hint: What do many of its hormones act on?
- Explanation: Many pituitary hormones have other glands as their target organs. They make those glands release their own hormones, so the pituitary is called the master gland.

### B33-08 · choice
**Q:** Which hormone gets the body ready for “fight or flight”?
- **0 Adrenaline ✓** · 1 Insulin · 2 Thyroxine · 3 Testosterone
- Hint: Think about the glands on top of the kidneys.
- Explanation: Insulin controls blood glucose, thyroxine affects metabolism and testosterone controls puberty in males. Adrenaline, from the adrenal glands, prepares the body for fight or flight.

### B33-09 · teach "Nerves or hormones?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Nerves | Nerves carry fast electrical impulses. | nerves = fast, short, precise | You met neurones when you learned about the nervous system. They carry electrical impulses very fast. The effect lasts a very short time. It happens in a precise area, such as one muscle. | `hormone-compare-nerves` |
| Hormones | Hormones act more slowly, but for longer. | hormones = slower, longer, general | Hormones travel in the blood, so they act more slowly than nerves. Their effects usually last for longer. They can reach many organs, so they act in a more general way. | `hormone-compare-hormones` |
| Which one? | Quick jobs use nerves; long-lasting jobs use hormones. | fast → nerves; long-lasting → hormones | Pulling your hand away from a hot pan needs a fast, precise response, so nerves control it. Changing at puberty takes years, so hormones control it. Hormones also keep blood glucose steady all day. | `hormone-compare-all` |

### B33-10 · choice
**Q:** Which statement about hormones, compared with nerves, is correct?
- 0 Hormones act faster than nerves · **1 Hormones act more slowly, and their effects last longer ✓** · 2 Hormones act only on one precise area · 3 Hormones travel along neurones
- Hint: How do hormones travel, and how does that affect speed?
- Explanation: Hormones travel in the blood, which is slower than an electrical impulse along a neurone. So hormones act more slowly, and their effects last longer.

### B33-11 · choice
**Q:** Which response is most likely to be controlled by nerves?
- 0 Growing taller during puberty · 1 Making sperm over many years · **2 Blinking when dust flies towards your eye ✓** · 3 Keeping blood glucose steady all day
- Hint: Which response needs to be very fast and precise?
- Explanation: Puberty, sperm production and blood glucose control all happen over a long time, so hormones control them. Blinking must happen very fast in one precise place, so nerves control it.

### B33-12 · choice · `application`, independent
**Q:** Just before a race, Priya feels her heart pounding and she is ready to run. Which gland released the hormone that caused this?
- 0 Thyroid gland · 1 Pancreas · **2 Adrenal glands ✓** · 3 Testes
- Hint: Which hormone gets the body ready for action?
- Explanation: Adrenaline gets the body ready for fight or flight, such as a race. Adrenaline is released by the adrenal glands.

### B33-13 · choice · `understanding`, independent · question diagram `hormone-glands-question` (assessment version hides the answer)
**Q:** Look at the numbered glands. Which gland releases a hormone that controls puberty and sperm production?
- 0 Gland 1 · 1 Gland 3 · 2 Gland 5 · **3 Gland 6 ✓**
- Hint: Which hormone controls sperm production, and where is it made?
- Explanation: Testosterone controls puberty and sperm production in males. Testosterone is made by the testes, gland 6.

### B33-14 · choice · `dataInterpretation`, independent · question diagram `hormone-response-data` (assessment version hides the answer)
**Q:** The table shows two responses measured in one person. Which conclusion fits the data best?
- 0 Response A is more likely to be controlled by hormones · **1 Response B is more likely to be controlled by hormones ✓** · 2 Both responses must be controlled by nerves · 3 The data prove that every slow response is caused by hormones
- Hint: Hormones act more slowly and for longer. Which response matches?
- Explanation: Response B starts later and lasts much longer than response A, but two responses cannot prove a rule for every response. So response B is more likely to be controlled by hormones.

### B33-15 · choice · `application`, independent
**Q:** A hormone is added to the blood of a mouse. Only the mouse’s liver responds. What is the best explanation?
- **0 The liver is a target organ for this hormone ✓** · 1 The hormone only reached the liver · 2 The liver made the hormone · 3 Nerves carried the hormone to the liver
- Hint: Does the blood carry a hormone to one organ, or all of them?
- Explanation: The blood carries a hormone all around the body, so it reached almost every organ. Only the liver responded, so the liver is a target organ for this hormone.

### B33-16 · written · `teacherOnly`
**Q:** The pancreas releases insulin, and the liver responds to it. Explain how insulin gets from the pancreas to the liver. Then give one way this is different from a response controlled by nerves.
- Hint: Say where the gland releases the hormone, how it travels and why the liver responds. Then compare speed or how long the effect lasts.
- Model answer: The pancreas is an endocrine gland, so it releases insulin directly into the blood. The blood carries insulin all around the body. The liver responds because it is a target organ for insulin. Hormones act more slowly than nerves, but their effects last longer.
- Marking points: The pancreas releases insulin directly into the blood. · The blood carries insulin around the body. · The liver responds because it is a target organ for insulin. · A correct difference: hormones act more slowly, last longer or act more generally than nerves.
- Common errors: Saying insulin travels along nerves or neurones. · Saying insulin travels through a tube straight to the liver. · Saying hormones act faster than nerves. · Saying the liver makes insulin.

---

## Checks
- 16 states: 3 teaching states (5 + 6 + 3 = 14 frames), 12 choice questions and 1 written task.
- Correct answer positions: 0 ×2, 1 ×4, 2 ×3, 3 ×3. The largest share is 33%.
- Question diagrams: 3, all shown in `assessment` form (B33-06, B33-13, B33-14).
