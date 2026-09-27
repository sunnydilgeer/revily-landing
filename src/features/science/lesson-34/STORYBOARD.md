# Lesson 39 storyboard — Controlling blood glucose and diabetes (v1)

Chapter B5, Homeostasis and response. Folder `lesson-34`, lesson id `B-HOM-034-B`, skill `B-BLOOD-GLUCOSE`.

Big idea: after a meal, glucose floods into the blood. The pancreas detects the high level and releases insulin, which makes glucose move into cells, where liver and muscle cells store it as glycogen. In diabetes this control fails: in Type 1 there is too little insulin; in Type 2 the cells do not respond to it.

Flow note: the lesson follows the glucose from one breakfast (Sam's porridge) all the way through before it shows a graph or a disease.
1. **Glucose in, glucose out.** A meal puts glucose in → cells use it for respiration → exercise uses much more → the pancreas monitors the level (a one-clause link to homeostasis). Inputs and outputs come first so that "too high" means something.
2. **When glucose is too high.** Insulin released → glucose moves into cells → stored as glycogen → back to normal. The same drawing as section 2, with steps 4–6 added, so the picture builds up.
3. **Read the graph.** The same story, drawn as two lines against time. It comes after the mechanism, because "insulin rises after glucose" is only sensible once learners know why.
4. **What is diabetes?** Type 1 (too little insulin) and its injections, then Type 2 (cells resistant; obesity raises the risk) and its diet and exercise. Diabetes comes last because both types are described as a failure of the insulin step.

1. Start here (B34-01): which food is digested into glucose? (from the digestion lesson).
2. Glucose in, glucose out (B34-02–04): four frames on `hormone-glucose-*`. Checks: what raises the level; which organ monitors it.
3. When glucose is too high (B34-05–07): four frames on the same drawing. Checks: what insulin does; where glycogen is stored.
4. Read the graph (B34-08–09): three frames on `hormone-graph-*`. Check: which numbered line is insulin (lines drawn in the same colour in the question, so colour gives nothing away).
5. What is diabetes? (B34-10–12): five frames on `hormone-diabetes-*`. Checks: the cause of Type 1; how Type 2 is controlled.
6. On your own (B34-13–17): why Leo injects at mealtimes; a numbered organ diagram (which releases insulin); an invented two-person glucose graph read without over-claiming (it cannot show which type of diabetes, if any); a football match with no food; a teacher-reviewed written answer.

Wording rules: one new term per frame, plain meaning first; British spelling; other lessons named by topic only. "Arbitrary units" is explained once, in the axes frame.

Out of scope: glucagon and the fall of blood glucose being corrected by a second hormone (Higher only); negative feedback as a named idea; other medicines for Type 2; blood glucose meters; the kidneys.

Source boundary: supplied page 56 (for scope only); AQA 8464 section 4.5.3.2, Foundation content only. The breakfast story, the characters, all questions, both graphs and every diagram are original. Draft pending teacher review.

---

## Diagram plan
- `components/HormoneVisuals.tsx`. Colour code: amber hexagons = glucose, amber clusters = glycogen, indigo diamonds = insulin, red tube = blood.
- **The glucose route** (`hormone-glucose-*`, B34-02 and B34-05): one scene used for eight frames. A blood vessel runs left to right, with the small intestine and liver above it and a muscle and the pancreas below it. Six numbered steps build up on the right, one per frame, with the current step highlighted. The number of glucose hexagons in the vessel drops once insulin has acted. `hormone-glucose-question` hides all names, steps and glucose, and numbers the four organs.
- **Glucose and insulin graph** (`hormone-graph-*`, B34-08): invented data, time 0–180 minutes, concentration in arbitrary units. Glucose peaks at about 30 minutes; insulin rises later and peaks at about 60 minutes, then both return towards their starting levels. The question version draws both lines in ink (one dashed) labelled 1 and 2.
- **Two people** (`hormone-two-people`, B34-15): invented glucose lines for A (back to about 4 by 120 minutes) and B (still above 7 at 180 minutes). No conclusion is written on the graph.
- **Type 1 and Type 2** (`hormone-diabetes-*`, B34-10): two panels side by side, each with the pancreas, a body cell and glucose outside it. Type 1 shows a dashed arrow with little or no insulin; Type 2 shows insulin arriving but the cell not responding. Treatments appear underneath one at a time: an insulin injection; a plate with a measured carbohydrate portion and a trainer for exercise.

## States in full

### B34-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** When you digest a meal, which kind of food is broken down into glucose?
- 0 Proteins · **1 Carbohydrates, such as starch ✓** · 2 Fats (lipids) · 3 Vitamins
- Hint: You met this when you learned about digestion and enzymes.
- Explanation: Proteins are broken down into amino acids, and fats into fatty acids and glycerol. Carbohydrates, such as starch, are broken down into sugars such as glucose.

### B34-02 · teach "Glucose in, glucose out"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Glucose from a meal | Digested carbohydrate puts glucose into the blood. | meal → glucose in the blood | At breakfast, Sam eats a bowl of porridge. His gut breaks the carbohydrate down into glucose, a sugar. The glucose passes from the small intestine into the blood. | `hormone-glucose-meal` |
| Cells use glucose | Cells take glucose from the blood for respiration. | cells use glucose → energy | Cells all over the body take glucose out of the blood. They use it for respiration, which transfers the energy they need. So the amount of glucose in the blood slowly falls. | `hormone-glucose-cells` |
| Exercise uses more | Exercise makes muscles take much more glucose. | exercise → more glucose used | When Sam runs for the bus, his muscles work harder. They need more energy for respiration. So they take a lot more glucose out of the blood. | `hormone-glucose-exercise` |
| The pancreas checks | The pancreas monitors the blood glucose level. | pancreas = checks the level | Keeping blood glucose steady is part of homeostasis, which you met when you learned how the body keeps conditions steady. The pancreas monitors the blood glucose level all the time. It detects when the level is too high. | `hormone-glucose-pancreas` |

### B34-03 · choice
**Q:** What makes the blood glucose level rise?
- **0 Eating a meal that contains carbohydrate ✓** · 1 Running for a bus · 2 Cells using glucose for respiration · 3 Insulin being released
- Hint: Where does the glucose in the blood come from?
- Explanation: Exercise and respiration use glucose up, so they lower the level. Digesting carbohydrate from a meal puts glucose into the blood, so the level rises.

### B34-04 · choice
**Q:** Which organ monitors the blood glucose level?
- 0 The liver · 1 The heart · **2 The pancreas ✓** · 3 The small intestine
- Hint: Which organ detects when the level is too high?
- Explanation: The small intestine absorbs glucose, and the liver stores it. The pancreas monitors the blood glucose level.

### B34-05 · teach "When glucose is too high"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Insulin is released | When glucose is too high, the pancreas releases insulin. | too high → insulin released | After breakfast, Sam’s blood glucose level is high. The pancreas detects this and releases the hormone insulin into the blood. The blood carries insulin all around the body. | `hormone-glucose-insulin` |
| Glucose moves into cells | Insulin makes glucose move from the blood into cells. | insulin → glucose into cells | Insulin makes glucose move out of the blood and into cells. Liver cells and muscle cells take in a lot of it. So the level of glucose in the blood falls. | `hormone-glucose-into-cells` |
| Stored as glycogen | Liver and muscle cells store glucose as glycogen. | glucose → glycogen, a store | Inside liver and muscle cells, many glucose molecules are joined into one large storage molecule. This store is called glycogen. It keeps glucose in the cells for later. | `hormone-glucose-glycogen` |
| Back to normal | The blood glucose level falls back to normal. | high → insulin → level falls | Glucose entered the blood, and the pancreas released insulin. Glucose moved into cells and was stored as glycogen. So the blood glucose level fell back to normal. This happens after every meal. | `hormone-glucose-all` |

### B34-06 · choice
**Q:** What does insulin do?
- **0 It makes glucose move from the blood into cells ✓** · 1 It breaks down starch in the gut · 2 It carries oxygen in the blood · 3 It makes the pancreas release glucose
- Hint: What happens to the glucose level after insulin is released?
- Explanation: Insulin is a hormone released when blood glucose is too high. It makes glucose move from the blood into cells, so the level falls.

### B34-07 · choice
**Q:** Where is extra glucose stored as glycogen?
- 0 In the pancreas · **1 In liver and muscle cells ✓** · 2 In the blood plasma · 3 In the small intestine
- Hint: Which cells take in a lot of glucose when insulin is released?
- Explanation: The pancreas releases insulin, but it does not store the glucose. Liver and muscle cells turn glucose into glycogen and store it.

### B34-08 · teach "Read the graph"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The axes | A graph can show glucose and insulin after a meal. | axes: time along, concentration up | This graph shows what happens in Sam’s blood after breakfast. Time after the meal, in minutes, runs along the bottom. Concentration in the blood goes up the side, in arbitrary units (a.u.). Arbitrary units let us compare how the lines rise and fall. | `hormone-graph-axes` |
| The glucose line | Glucose rises first, then falls. | meal → glucose peaks first | The glucose line rises soon after the meal. It peaks at about 30 minutes. Then it falls back to its starting level by about 120 minutes. | `hormone-graph-glucose` |
| The insulin line | Insulin rises after glucose rises. | glucose up → insulin up → glucose down | The insulin line rises after the glucose line, and it peaks later, at about 60 minutes. As insulin rises, glucose falls. When glucose is back to normal, the pancreas releases less insulin. | `hormone-graph-insulin` |

### B34-09 · choice · question diagram `hormone-graph-question` (assessment version hides the answer)
**Q:** The graph shows glucose and insulin in the blood after a meal. Which line shows insulin?
- 0 Line 1, because it rises first · **1 Line 2, because it rises after glucose rises ✓** · 2 Line 1, because it has the higher peak
- Hint: Which comes first after a meal: glucose or insulin?
- Explanation: Eating makes glucose rise first, and the pancreas releases insulin in response. So insulin rises later: it is line 2.

### B34-10 · teach "What is diabetes?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Diabetes | In diabetes, blood glucose is not controlled properly. | diabetes = glucose not controlled | Some people cannot control their blood glucose level properly. This condition is called diabetes. There are two types: Type 1 and Type 2. | `hormone-diabetes-what` |
| Type 1 | In Type 1, the pancreas makes too little insulin, or none. | Type 1 = too little insulin | In Type 1 diabetes, the pancreas does not make enough insulin. It may make none at all. So glucose stays in the blood, and the level can rise so high that it is life-threatening. | `hormone-diabetes-type1` |
| Insulin injections | Type 1 is treated with insulin injections. | Type 1 → inject insulin | People with Type 1 diabetes inject insulin several times through the day. The injected insulin makes glucose move from the blood into cells. This means glucose is removed from the blood soon after a meal. | `hormone-diabetes-injection` |
| Type 2 | In Type 2, cells do not respond properly to insulin. | Type 2 = cells do not respond | In Type 2 diabetes, the pancreas still makes insulin, but the body’s cells do not respond to it properly. This is called being resistant to insulin. Being obese, which means very overweight, increases the chance of Type 2. | `hormone-diabetes-type2` |
| Controlling Type 2 | Type 2 is controlled by diet and exercise. | Type 2 → diet + exercise | A carbohydrate-controlled diet means carefully measuring how much carbohydrate is eaten. This limits how much glucose enters the blood. Regular exercise also helps, because working muscles use up glucose. | `hormone-diabetes-type2-treat` |

### B34-11 · choice
**Q:** What causes Type 1 diabetes?
- **0 The pancreas makes too little insulin, or none ✓** · 1 The body’s cells stop responding to insulin · 2 Eating too much carbohydrate at one meal · 3 The liver stores too much glycogen
- Hint: Which type is about not making enough insulin?
- Explanation: In Type 2, the cells stop responding to insulin properly. In Type 1, the pancreas makes too little insulin, or none.

### B34-12 · choice
**Q:** How is Type 2 diabetes often controlled?
- 0 By eating as much carbohydrate as possible · 1 By removing the pancreas · **2 With a carbohydrate-controlled diet and regular exercise ✓** · 3 By storing more glycogen in the pancreas
- Hint: How can less glucose enter the blood, and more be used up?
- Explanation: A carbohydrate-controlled diet limits how much glucose enters the blood, and exercise uses glucose up. So Type 2 is often controlled with a carbohydrate-controlled diet and regular exercise.

### B34-13 · choice · `application`, independent
**Q:** Leo has Type 1 diabetes. Why does he inject insulin around mealtimes?
- **0 A meal raises his blood glucose, and his pancreas cannot make enough insulin to bring it down ✓** · 1 Insulin gives him the energy to digest his food · 2 Insulin turns the meal into glycogen in his stomach · 3 His cells are resistant to the glucose in the meal
- Hint: What happens to blood glucose after a meal, and what is missing in Type 1?
- Explanation: After a meal, glucose enters the blood and the level rises. His pancreas makes too little insulin to bring the level down, so he injects it.

### B34-14 · choice · `understanding`, independent · question diagram `hormone-glucose-question` (assessment version hides the answer)
**Q:** Look at the numbered organs. Which number shows the organ that releases insulin?
- 0 Organ 1 · 1 Organ 2 · 2 Organ 3 · **3 Organ 4 ✓**
- Hint: Insulin is released by a gland just below the stomach.
- Explanation: Organ 1 is the small intestine, organ 2 the liver and organ 3 a muscle. Organ 4 is the pancreas, which releases insulin.

### B34-15 · choice · `dataInterpretation`, independent · question diagram `hormone-two-people` (assessment version hides the answer)
**Q:** The graph shows blood glucose in two people after the same meal. Which conclusion fits the data best?
- 0 Person A’s glucose stayed high for longer than person B’s · **1 Person B’s glucose stayed high for longer than person A’s ✓** · 2 Person B has Type 2 diabetes · 3 Both people will get the same result after every meal
- Hint: Compare where each line is at 120 and 180 minutes.
- Explanation: Person A’s glucose was back to about 4 by 120 minutes, but person B’s was still above 7 at 180 minutes. One graph cannot show what type of diabetes, if any, person B has. So person B’s glucose stayed high for longer than person A’s.

### B34-16 · choice · `application`, independent
**Q:** During a long football match, Mia’s muscles work hard and she eats nothing. What happens to her blood glucose level?
- 0 It rises, because exercise makes glucose · 1 It stays exactly the same · **2 It falls, because her muscle cells take glucose from the blood for respiration ✓** · 3 It rises, because insulin is released
- Hint: What do working muscles need more of?
- Explanation: Working muscles need more energy, so they take more glucose from the blood for respiration. With no food to top it up, her blood glucose level falls.

### B34-17 · written · `teacherOnly`
**Q:** Explain how blood glucose comes back down after a meal, and why someone with Type 1 diabetes needs insulin injections.
- Hint: Follow the glucose from the meal to the cells, naming the organ and the hormone. Then say what is different in Type 1.
- Model answer: Glucose from the meal enters the blood, so the level rises. The pancreas detects the high level and releases insulin into the blood. Insulin makes glucose move from the blood into cells, and liver and muscle cells store it as glycogen. In Type 1 diabetes the pancreas makes too little insulin, or none, so the person injects insulin to bring the level down.
- Marking points: Glucose from the meal enters the blood, so the level rises. · The pancreas detects the high level and releases insulin into the blood. · Insulin makes glucose move from the blood into cells. · Liver and muscle cells store the glucose as glycogen. · In Type 1 the pancreas makes too little or no insulin, so insulin has to be injected.
- Common errors: Saying insulin is made by the liver. · Saying glycogen is stored in the pancreas or in the blood. · Saying insulin itself is turned into glycogen. · Confusing Type 1 (too little insulin) with Type 2 (cells do not respond properly).

---

## Checks
- 17 states: 4 teaching states (4 + 4 + 3 + 5 = 16 frames), 12 choice questions and 1 written task.
- Correct answer positions: 0 ×4, 1 ×4, 2 ×3, 3 ×1. The largest share is 33%.
- Question diagrams: 3, all shown in `assessment` form (B34-09, B34-14, B34-15).
