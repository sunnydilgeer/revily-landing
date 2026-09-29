# Chemistry Lesson 35 storyboard — Rate graphs and mean rate

Chapter C6, Rate and extent of chemical change. Folder `chemistry/lesson-35`, id `C-RAT-035-C`, skill `C-RATE-GRAPHS`, AQA 5.6.1.1. It builds on rate and the steep-then-flat graph shape (the first rates lessons) and on the gas-collection methods (the measuring-gas lesson).

Big idea: results from a gas experiment are plotted with time on the x-axis and amount of product on the y-axis, with a line of best fit; a steep line is fast, a flat line means finished. The mean rate of a reaction is the amount of product formed (or reactant used up) divided by the time, in units such as g/s or cm³/s. From a graph you can find the mean rate for the whole reaction (finish time from where the line goes flat) or between two times (difference ÷ time).

Flow note: one gas-volume graph ("graph A") carries the drawing, reading and both mean-rate methods, so the student meets one picture repeatedly. Calculations come after reading graphs because the graph supplies the numbers. Mean rate is taught first from plain numbers (worked → guided), then from graphs (worked → guided), so each new idea has one new difficulty.
1. **Start here** (C35-01): average speed = distance ÷ time (everyday link to "rate as amount ÷ time").
2. **How do you draw a rate graph?** (C35-02–04): axes → crosses → curve of best fit → alternative of two straight lines. Checks: which way round the axes go; which line of best fit.
3. **What does the graph tell you?** (C35-05–06): steep = fast → flat = finished → reading a value up and across. Check: finish time on graph B (40 s).
4. **How do you work out a mean rate?** (C35-07–09): formula → units → three steps. Worked 3.6 g in 90 s (0.04 g/s); guided 5.0 g in 250 s (0.02 g/s).
5. **How do you find a mean rate from a graph?** (C35-10–12): whole reaction (finish time, then 30 ÷ 50) → between two times (22 and 29 → 7 ÷ 20). Worked graph B 10–30 s (0.45 cm³/s); guided graph B 20–40 s (0.20 cm³/s).
6. **On your own** (C35-13–16): calculation from numbers (48 cm³ in 80 s); whole-reaction mean rate from graph C; comparing two reactions' mean rates from data; written: describe and calculate the whole-reaction rate from a table.

Numbers (all checked):
Graph A (time s → gas cm³): 0→0, 10→14, 20→22, 30→27, 40→29, 50→30, 60→30. Whole: 30 ÷ 50 = 0.60 cm³/s. 20–40 s: (29 − 22) ÷ 20 = 0.35 cm³/s.
Graph B: 0→0, 10→10, 20→16, 30→19, 40→20, 50→20, 60→20. Finishes at 40 s. 10–30 s: 9 ÷ 20 = 0.45 cm³/s. 20–40 s: 4 ÷ 20 = 0.20 cm³/s (distractors 0.80 = 16 ÷ 20, 0.50 = whole reaction 20 ÷ 40, 4.0 = no division).
Graph C: 0→0, 10→16, 20→26, 30→32, 40→36, 50→36, 60→36. Whole: 36 ÷ 40 = 0.90 cm³/s (distractors 0.60 = 36 ÷ 60, 1.1 = 40 ÷ 36, 36).
Written table: 0, 11, 18, 22, 24, 24 at 0–50 s → finishes 40 s → 24 ÷ 40 = 0.60 cm³/s.
X: 4.0 g in 50 s = 0.08 g/s; Y: 6.0 g in 100 s = 0.06 g/s. 48 ÷ 80 = 0.6 cm³/s. 3.6 ÷ 90 = 0.04 g/s. 5.0 ÷ 250 = 0.02 g/s.

Out of scope: drawing tangents and comparing rates at a point (Higher tier); the book's tangent worked example, its data tables, examples and practice questions; the qualifying idea of instantaneous rate; rate graphs for mass loss (the gas-volume graph is enough); calculating rates in mol/s (Higher).

Source boundary: supplied revision-guide pages 140–141 (scope only; the tangent section on page 140 is Higher tier and was not used); AQA 8464 Chemistry 5.6.1.1. All data, contexts, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Both a smooth curve and two straight lines are allowed as the line of best fit, as on the page; the guided question accepts only the smooth curve because the alternative options are clearly wrong.
- "The reaction has finished where the line first goes flat" is read to the nearest 10 s marked on the axis.
- Units: g/s and cm³/s only. Results are quoted to 2 significant figures in the worked examples (0.040 written as 0.04 in C35-08; teacher to decide whether to insist on 0.040).
- The graph question C35-06 and the guided C35-12 share graph B, deliberately, so the student is reading a familiar picture.

## Diagram specs (for the diagram worker)

House style: like Science Lessons 17 and 18. Soft curves, gentle tints, hand-drawn feel, no more detail than Foundation needs; 600-wide viewBox, readable at 360 px. Colour: `atomPalette` ink and panels; product/gas line in the electron-blue family; crosses in `ink`; amber (or coral) for the thing being read or measured; green for a finished result. Axes labelled `Time (s)` and `Volume of gas (cm³)` with tick numbers every 10 s (x, 0–60) and every 5 cm³ where needed (y, 0 to 30, or 0 to 40 for graph C). Light grid. Curves must be smooth, monotonic rising and flat after the finish time, passing close to the plotted crosses (crosses are the data, the curve is a best fit). Dotted read-off guides are thin dashed lines with the value at the axis end.

Data sets (cm³ at 0, 10, 20, 30, 40, 50, 60 s): A = 0, 14, 22, 27, 29, 30, 30. B = 0, 10, 16, 19, 20, 20, 20. C = 0, 16, 26, 32, 36, 36, 36.

Teaching frames (graph A unless stated):
- `rgraph-axes`: empty axes with labels and ticks, plus the results table for A beside or above it (Time and Volume rows). No crosses yet.
- `rgraph-points`: the same axes with all seven crosses plotted; the 10 s cross (14 cm³) highlighted in amber with a short dashed guide to each axis.
- `rgraph-curve`: crosses plus one smooth best-fit curve; label "line of best fit".
- `rgraph-lines`: crosses plus two straight lines: a sloping straight line from (0, 0) through the early points (about 1.16 cm³ per s, fitted to the 10 s and 20 s crosses) up to 30 cm³ at about 26 s, then a flat straight line at 30 cm³ to 60 s. (A line from (0, 0) to (50 s, 30 cm³) would miss the early crosses badly, so it is not a best fit.) Label "two straight lines of best fit". Keep it clearly an alternative (fade the curve out or draw a faded copy behind).
- `rgraph-read-steep`: the curve; the first segment (0–10 s) in amber with the label "steep: fast"; a later segment (30–40 s) in a second tint with the label "less steep: slower".
- `rgraph-read-flat`: the curve with the flat part (50–60 s) highlighted in green and a dashed guide down from the start of the flat part to 50 s on the x-axis; label "flat: finished" and "50 s".
- `rgraph-read-values`: dashed guide up from 20 s to the curve then across to 22 on the y-axis; label "22 cm³"; amber.
- `rgraph-formula`: no graph. A panel with the words "mean rate = amount of product formed ÷ time" (fraction layout), with "or amount of reactant used up" as a lighter line under "amount of product formed". Two small icons are optional (a flask with bubbles).
- `rgraph-units`: two rows: "mass in g ÷ time in s → g/s" and "volume of gas in cm³ ÷ time in s → cm³/s".
- `rgraph-steps`: three numbered steps in a row: "1 Find the amount", "2 Find the time", "3 Divide", plus "4 Write the unit" as a small fourth chip.
- `rgraph-whole-finish`: graph A; flat part highlighted; dashed guide down to 50 s; label "finished at 50 s".
- `rgraph-whole-divide`: graph A with guides to 50 s and to 30 cm³ (across); beside or under the graph the working "30 cm³ ÷ 50 s = 0.60 cm³/s" in a panel.
- `rgraph-between-read`: graph A with guides at 20 s (to 22 cm³) and 40 s (to 29 cm³); the difference 29 − 22 = 7 cm³ shown as a small bracket on the y-axis.
- `rgraph-between-divide`: same graph with the 7 cm³ bracket and a 20 s bracket on the x-axis; working "7 cm³ ÷ 20 s = 0.35 cm³/s" in a panel.

Worked-example visual:
- `rgraph-worked-mean`: no graph. A small flask or beaker with "3.6 g of product" and a clock or "90 s" chip; the set-up "mean rate = 3.6 ÷ 90" with NO answer.
- `rgraph-worked-between`: graph B with dashed guides at 10 s and 30 s reaching the curve and across to the y-axis; the axis end labels are the values 10 and 19 cm³ (they are given in the steps text, so showing them is fine); no calculated answer.

Question visuals (assessment view: no answer, no derived values, no annotations that give the answer; when `assessment` is false you may add nothing extra):
- `rgraph-question-read` (C35-06, answer "40 s"): graph B (curve and crosses, axes with ticks), NO finish-time guide, NO "flat" label. Both 40 s and 50 s ticks must be visible.
- `rgraph-question-between` (C35-12, answer 0.20 cm³/s): graph B with dashed vertical guides at 20 s and 40 s up to the curve and across to the y-axis, but do NOT print the y values (16 and 20 must be read by the student); ticks every 2 or 5 cm³ must make them readable (y gridlines every 5 cm³, 0–25).
- `rgraph-question-whole` (C35-14, answer 0.90 cm³/s): graph C (curve and crosses); y-axis 0–40 in steps of 5 or 10; no guides, no finish label.

## Sections
1. **Start here** (from C35-01): Average speed from distance and time
2. **How do you draw a rate graph?** (from C35-02): Axes, crosses and a line of best fit
3. **What does the graph tell you?** (from C35-05): Steep, flat and reading values
4. **How do you work out a mean rate?** (from C35-07): Amount ÷ time, with units
5. **How do you find a mean rate from a graph?** (from C35-10): The whole reaction and between two times
6. **On your own** (from C35-13): Calculations, a graph and a comparison

## States in full

### C35-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A cyclist rides 60 metres in 10 seconds. What is her average speed?
- 0 600 m/s · **1 6 m/s ✓** · 2 50 m/s · 3 70 m/s
- Hint: What do you do with the distance and the time to find a speed?
- Explanation: Average speed is the distance divided by the time. 60 ÷ 10 = 6, so her average speed is 6 m/s.

### C35-02 · teach "How do you draw a rate graph?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Choose the axes | Time goes on the x-axis and the volume of gas on the y-axis. | time → across; gas → up; units on both | A student measured the volume of gas made by a reaction every 10 seconds. To draw the graph, put time on the x-axis, along the bottom. Put the volume of gas on the y-axis, going up. Label both axes with their units. | `rgraph-axes` |
| Plot the points | Mark each result with a small cross. | each pair of numbers → one cross | Take one column of the table at a time. At 10 seconds, 14 cm³ of gas had been made. Find 10 on the x-axis and 14 on the y-axis, and mark a small cross where they meet. Do this for every result. | `rgraph-points` |
| Draw a line of best fit | A smooth curve passes close to the crosses. | not dot-to-dot → one smooth curve | A line of best fit is a line that runs as close as it can to all the points. Do not join the crosses one by one. For this reaction, draw one smooth curve. It rises steeply and then levels off. | `rgraph-curve` |
| Two straight lines | Two straight lines can also fit these points. | sloping part + flat part | You can also draw two straight lines of best fit. Use one for the sloping part of the graph and one for the flat part. Use a ruler. Your teacher may prefer one way, so follow their advice. | `rgraph-lines` |

### C35-03 · choice · `understanding, guided, practice`
**Q:** A student plots the volume of gas made against time. Which way round do the axes go?
- **0 Time on the x-axis, volume of gas on the y-axis ✓** · 1 Volume of gas on the x-axis, time on the y-axis · 2 Time and volume of gas both on the x-axis · 3 It does not matter which way round they go
- Hint: Which axis goes along the bottom of the page?
- Explanation: Time goes on the x-axis, along the bottom, and the volume of gas goes on the y-axis, going up. Label each axis with its unit, such as time (s) and volume of gas (cm³).

### C35-04 · choice · `understanding, guided, practice`
**Q:** The crosses on a rate graph rise and then level off. Which line of best fit is best?
- 0 Straight lines joining each cross to the next one · 1 One straight line from the origin to the last cross · 2 A curve that goes exactly through every cross, even if it wobbles · **3 One smooth curve that passes close to the crosses ✓**
- Hint: Should a line of best fit join the dots one by one?
- Explanation: A line of best fit runs as close as it can to all the points. It does not join them one by one. For a reaction that levels off, that means one smooth curve. Two straight lines are also allowed.

### C35-05 · teach "What does the graph tell you?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Steep means fast | The steeper the line, the faster the reaction. | steep → lots of gas per second | Look at the graph from the experiment. At the start the line is steep, because a lot of gas is made every second. So the reaction is fastest at the start. The line gets less steep as the reaction slows down. | `rgraph-read-steep` |
| Flat means finished | When the line goes flat, no more product is being made. | flat line → nothing new → finished | After about 50 seconds the line is flat. No more gas is being made, so the reaction has finished. The time where the line first goes flat is the time the reaction finished. | `rgraph-read-flat` |
| Reading a value | Read up from the time, then across to the axis. | up from the time → across to the volume | To find how much gas had been made at 20 seconds, start at 20 on the x-axis. Go straight up to the curve. Then go straight across to the y-axis. You read 22 cm³. | `rgraph-read-values` |

### C35-06 · choice · `understanding, guided, practice` · visual `rgraph-question-read`
**Q:** The graph shows gas made by a reaction. At what time did the reaction finish?
- 0 20 s · 1 30 s · **2 40 s ✓** · 3 50 s
- Hint: Where does the line first go flat?
- Explanation: The line goes flat when no more gas is being made, so the reaction has finished. On this graph the line first goes flat at 40 seconds.

### C35-07 · teach "How do you work out a mean rate?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Mean rate | Mean rate is the amount made or used up, divided by the time. | amount ÷ time | The mean rate of a reaction is its average rate over some time. Divide the amount of product formed by the time taken. You can also divide the amount of reactant used up by the time taken. | `rgraph-formula` |
| Units | The unit shows the amount and the time. | g or cm³ ÷ seconds → g/s or cm³/s | The unit of the rate comes from the two numbers you divide. If you measure a mass in grams and the time in seconds, the rate is in g/s. If you measure the volume of a gas in cm³, the rate is in cm³/s. | `rgraph-units` |
| Put it together | Find the amount, find the time, then divide. | amount → time → divide → unit | First, find the amount of product formed, or reactant used. Next, find the time it took. Then divide the amount by the time. Finish by writing the unit, such as g/s or cm³/s. | `rgraph-steps` |

### C35-08 · worked example "Work out the mean rate of a reaction" · visual `rgraph-worked-mean`
**Q:** A reaction makes 3.6 g of product in 90 seconds. What is the mean rate of the reaction?
1. Write the rule: mean rate = amount of product formed ÷ time.
2. The amount of product is 3.6 g and the time is 90 s.
3. Divide: 3.6 ÷ 90 = 0.04.
4. The amount is in grams and the time in seconds, so the mean rate is 0.04 g/s.

### C35-09 · choice · `calculation, guided, practice`
**Q:** A reaction uses up 5.0 g of a reactant in 250 seconds. What is the mean rate?
- **0 0.02 g/s ✓** · 1 0.2 g/s · 2 50 g/s · 3 1250 g/s
- Hint: Divide the amount by the time, not the time by the amount.
- Explanation: Mean rate = amount of reactant used up ÷ time = 5.0 ÷ 250. 5.0 ÷ 250 = 0.02, so the mean rate is 0.02 g/s.

### C35-10 · teach "How do you find a mean rate from a graph?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| When did it finish? | For the whole reaction, start where the line goes flat. | flat → finish time | To find the mean rate for the whole reaction, first find when it finished. On this graph the line goes flat at 50 seconds. So the reaction took 50 seconds. | `rgraph-whole-finish` |
| Divide the total | Total amount made ÷ time taken. | 30 cm³ ÷ 50 s → 0.60 cm³/s | Now read how much gas was made by then. At 50 seconds the graph shows 30 cm³. Divide by the time: 30 ÷ 50 = 0.60. So the mean rate for the whole reaction is 0.60 cm³/s. | `rgraph-whole-divide` |
| Between two times | You can also find the mean rate between two times. | read both values → take the difference | You can find the mean rate between 20 seconds and 40 seconds. Read the volume at each time: 22 cm³ at 20 seconds and 29 cm³ at 40 seconds. The gas made in between is 29 − 22 = 7 cm³. | `rgraph-between-read` |
| Divide the difference | Gas made in between ÷ time in between. | 7 cm³ ÷ 20 s → 0.35 cm³/s | The time in between is 40 − 20 = 20 seconds. Divide: 7 ÷ 20 = 0.35. So the mean rate between 20 and 40 seconds is 0.35 cm³/s. This is lower than for the whole reaction, because the reaction had slowed down. | `rgraph-between-divide` |

### C35-11 · worked example "Find the mean rate between two times on a graph" · visual `rgraph-worked-between`
**Q:** The graph shows the gas made by a reaction. Find the mean rate between 10 s and 30 s.
1. Read the volume at 10 s: 10 cm³. Read the volume at 30 s: 19 cm³.
2. The gas made in between is 19 − 10 = 9 cm³.
3. The time in between is 30 − 10 = 20 s.
4. Divide: 9 ÷ 20 = 0.45. So the mean rate is 0.45 cm³/s.

### C35-12 · choice · `calculation, guided, practice` · visual `rgraph-question-between`
**Q:** Use the same graph. What is the mean rate between 20 s and 40 s?
- 0 0.50 cm³/s · 1 0.80 cm³/s · **2 0.20 cm³/s ✓** · 3 4.0 cm³/s
- Hint: Read the volume at both times, then find the difference.
- Explanation: At 20 s the volume is 16 cm³ and at 40 s it is 20 cm³, so 4 cm³ was made in between. The time in between is 20 s. So 4 ÷ 20 = 0.20 cm³/s.

### C35-13 · choice · `calculation, independent, independent`
**Q:** A reaction makes 48 cm³ of gas in 80 seconds. What is the mean rate of reaction?
- 0 0.06 cm³/s · **1 0.6 cm³/s ✓** · 2 1.7 cm³/s · 3 128 cm³/s
- Hint: Divide the volume of gas by the time.
- Explanation: Mean rate = 48 cm³ ÷ 80 s. 48 ÷ 80 = 0.6, so the mean rate is 0.6 cm³/s.

### C35-14 · choice · `calculation, independent, independent` · visual `rgraph-question-whole`
**Q:** The graph shows the gas made by another reaction. What is the mean rate for the whole reaction?
- 0 0.60 cm³/s · **1 0.90 cm³/s ✓** · 2 1.1 cm³/s · 3 36 cm³/s
- Hint: At what time does the line first go flat?
- Explanation: The line goes flat at 40 s, when 36 cm³ of gas had been made. 36 ÷ 40 = 0.90. Dividing by 60 s, the end of the graph, would wrongly give 0.60.

### C35-15 · choice · `dataInterpretation, independent, independent`
**Q:** Reaction X made 4.0 g of product in 50 s. Reaction Y made 6.0 g of product in 100 s. Which conclusion do these data support?
- 0 Reaction Y was faster, because it made more product · 1 Both reactions had about the same mean rate · 2 The reactions cannot be compared, because the times are different · **3 Reaction X had the higher mean rate, 0.08 g/s compared with 0.06 g/s ✓**
- Hint: Work out the mean rate of each reaction before you compare them.
- Explanation: X: 4.0 ÷ 50 = 0.08 g/s. Y: 6.0 ÷ 100 = 0.06 g/s. Y made more product, but it took longer, so X had the higher mean rate. Different times can be compared once you divide.

### C35-16 · written · teacherOnly
**Q:** A student measured gas from a reaction. Describe how to find the mean rate for the whole reaction, and work it out.
- Hint: Time (s): 0, 10, 20, 30, 40, 50. Volume of gas (cm³): 0, 11, 18, 22, 24, 24. Say when the reaction finished, then divide.
- Model answer: The reaction has finished when the amount of gas stops going up, which is at 40 s, where the graph would go flat. By then 24 cm³ of gas had been made. Divide the volume by the time: 24 ÷ 40 = 0.60. The mean rate is 0.60 cm³/s.
- Rubric:
  - The reaction finished when the volume stopped increasing, at 40 s.
  - 24 cm³ of gas had been made by then.
  - Divide the amount by the time: 24 ÷ 40.
  - The mean rate is 0.60 cm³/s, with the unit.
- Reject:
  - Dividing by 50 s, the last time in the table, instead of 40 s.
  - Giving 0.6 with no unit, or the unit g/s for a gas volume.
  - Giving a number with no explanation of how the finish time was found.
