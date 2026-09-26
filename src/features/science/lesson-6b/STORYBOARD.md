# Lesson 6b storyboard — Osmosis practical

Big idea: you can see osmosis by weighing plant tissue. Change the concentration, measure the mass change fairly, turn it into a percentage, graph it, and read where there is no net change.

Anchor and route: one set of potato pieces followed through required practical 2: plan a fair test → measure the mass → work out the percentage change → draw the graph → check the results. Every step has its own check before the next step starts.

Why this order: the variables come first, because blotting, the graph axes and the fair-test item all use "independent", "dependent" and "control variable". Measuring comes before the maths, so "final mass − initial mass" is met as a measurement before it is used in a formula. Percentage change comes before the graph, because the y-axis is percentage change. The graph is taught one idea per frame (x-axis → y-axis → plotting → line of best fit → zero crossing). Repeats, anomalies and the mean come last, where they are needed to trust the graph. Each calculation follows worked example → practice with new numbers → reuse on your own.

| Section | Screens | Walkthrough frames | Questions testing them |
|---|---|---|---|
| Start here | B6-50 | — | Potato in pure water gains mass (from the diffusion and osmosis topic) |
| Plan a fair test | B6-25–26 | T6: the question (hand-back to diffusion and osmosis) → stay safe ("risk-assessed method"; teacher-prepared tissue; "Cutting and lab solutions are not home tasks"; "This lesson prepares you for required practical 2. It does not replace doing it.") → independent variable → dependent variable → control variables → put it together | B6-26 which is the independent variable |
| Measure the mass | B6-54, B6-27 | T5: initial mass → soak for a set time at a set temperature → blotting (surface droplets add extra mass) → final mass ("final mass − initial mass") → put it together | B6-27 why blot |
| Work out the percentage change | B6-30, B6-28, B6-29 | T3: why percentages → divide by initial mass, ×100 → keep the sign. W4: 2.00 → 2.20 g = +10% (example data) | B6-29 practice with new numbers: 2.50 → 2.25 g = −10% |
| Draw the graph | B6-33, B6-31, B6-32 | T6: concentration on the x-axis (mol/dm³) → percentage change on the y-axis, with negatives → plot the points (optional plotting practice, "does not submit an assessed answer") → line of best fit → zero crossing: no net movement, water still moves both ways, "an estimate of the cell contents, not an exact measurement" → put it together | B6-31 axis labels; B6-32 estimate the zero crossing (0.3 mol/dm³) from the example graph |
| Check your results | B6-53, B6-45, B6-52 | T5: repeat → anomalous result → check before you decide ("Never delete a result just because it disagrees with your prediction") → mean (+6, +7, +8 → +7%) → put it together (hand-off to active transport and exchange surfaces) | B6-45 what to do with +24%; B6-52 mean practice (−14, −15, −16 → −15%) |
| On your own | B6-40–44 | — | B6-40 percentage change, new carrot data (3.00 → 2.55 g = −15%); B6-41 spot the unfair test (10 vs 60 minutes); B6-42 mean (+4, +5, +6 → +5%); B6-43 invented class data read without over-claiming ("In this test…", zero point lies between 0 and 0.5 mol/dm³); B6-44 written: explain mass loss in concentrated sugar and name a control variable (3 marks, teacher-reviewed) |

Hand-offs:
- Back to diffusion and osmosis: Start here asks about the potato in pure water; B6-25 f1 "You met osmosis in the last topic, diffusion and osmosis."
- On to active transport and exchange surfaces: B6-53 f5 ends "Next, you will see how cells can move substances against a gradient, and how exchange surfaces work."

Practical boundary: "This lesson prepares you for required practical 2. It does not replace doing it." Do the real practical in school with a teacher and a risk-assessed method; teacher-prepared tissue; no cutting or lab solutions at home (the written task rejects a home task). All numbers are original example data, never presented as measurements (worked example says so; the graph says "Example data · not laboratory measurements"). Optional plotting never gates Continue. Completing the lesson online does not show that a learner has done the practical.

Out of this lesson: the rate of water uptake (old B6-33 f2 and B6-34, 0.30 g in 60 minutes) is left out; rate is taught with transpiration. Active transport, SA:V and exchange surfaces belong to the next lesson.

Data: `practicalData.ts` (five example concentrations, used by the graph and set-up diagrams) now lives here; `lesson-6/practicalData.ts` re-exports it so existing importers still work.

Ids: moved screens keep their old lesson 6 ids (B6-25…B6-33, B6-40…B6-45). New ids: B6-50…B6-54. B6-25 and B6-28 stay the practical and calculation screens for the exam-coverage map.

Source boundary: AQA 8464 section 4.1.3.2 and required practical 2 (10.2.2; AT1/3/5); AQA practical handbook. Original wording and schematics. Draft pending teacher review.
