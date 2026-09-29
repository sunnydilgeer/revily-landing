# Working Scientifically Lesson 12 storyboard: Uncertainty and evaluations

Strand skills, chapter WS1 "Working scientifically". Folder `skills/lesson-12`, id `W-DAT-012-W`, spec WS 3.4, 3.7, 3.8. It owns uncertainty (range ÷ 2, the ± symbol), judging the quality of results (accurate, precise, anomalous, enough evidence), and writing an evaluation with improvements.

Big idea: every measurement has some uncertainty; an evaluation uses it, together with the method and the results, to say how confident you are and how to do better.

Flow note: uncertainty first, as a calculation with a worked example in the frames (range then halve), near-identical guided practice, then an independent calculation. Quality of results follows because it uses the same idea (precise results give small uncertainty). The evaluation comes last as it pulls everything together: method, results, uncertainty, confidence, improvements. Examples: trolley timings (Physics), temperature and gas volume readings (Chemistry), plants at different temperatures (Biology), reaction concentrations (Chemistry).

Sections:
1. Start here (W12-01): three stopwatch times of a falling ball differ a little.
2. What is uncertainty? (W12-02–04): errors, range, range ÷ 2, ± notation. Checks: guided uncertainty calculation; which student has the higher uncertainty.
3. How good are the results? (W12-05–07): accurate and precise, anomalous results, enough evidence. Checks: precise but not accurate; handling an anomalous result.
4. How do you evaluate an investigation? (W12-08–10): the method, confidence, improvements (narrower intervals), predictions. Checks: narrower intervals; what an evaluation includes.
5. On your own (W12-11–15): uncertainty calculation, comparing two groups from a table (assessment view), the problem with one reading, a good evaluation comment, then a written evaluation of a temperature and plant investigation.

Out of scope: percentage uncertainty; error bars; calculating uncertainty from a single measuring instrument's resolution beyond a mention; repeatable and reproducible (covered in designing investigations) and detailed graph work.

Source boundary: supplied revision-guide page 245 (scope only); AQA 8464 WS 3.4, 3.7, 3.8. All wording, examples, numbers and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Uncertainty of a mean is taught only as range ÷ 2 (the page's method), from three repeats.
- Accurate and precise are defined briefly here as used in evaluations; check they match the wording used elsewhere in the course.
- The written task is teacher marked; the four rubric points allow varied answers.

## Diagram specs
Same look as Science Lessons 17 and 18: soft flat fills, darker stroke of the same hue, generous white space, text at least 12px, readable on 360px, `role="img"` and a `<title>`.

- `wseval-error`: a ruler marked in millimetres with a pencil line falling between two marks, and a stopwatch with a small hand pressing it slightly late. Two labels: "random error" and "equipment limit". Caption "uncertainty: how far off a measurement might be".
- `wseval-range`: a number line 3.9 to 4.5 s with three dots at 4.0, 4.2 and 4.4 labelled "run 1 to 3", a bracket from 4.0 to 4.4 labelled "range = 4.4 − 4.0 = 0.4 s", and the mean marked as a small arrow at 4.2.
- `wseval-unc`: the same number line with the range bracket faded, and a half-bracket from 4.2 to 4.4 highlighted, with "uncertainty = range ÷ 2 = 0.4 ÷ 2 = 0.2 s".
- `wseval-plusminus`: the number line with the mean at 4.2 and a shaded band from 4.0 to 4.4, labelled "4.2 ± 0.2 s". A second, wider band beneath labelled "less precise: bigger uncertainty".
- `wseval-accurate`: two simple targets side by side. Left: three darts tightly together but away from the centre, "precise, not accurate". Right: three darts spread around the centre, "accurate on average, not precise" or a third tight cluster on the centre for "accurate and precise". Keep it to three targets in a row: precise not accurate; spread but centred; accurate and precise.
- `wseval-anomaly`: a small dot plot of four repeats, three clustered and one far away, the odd one ringed and labelled "anomalous" with a thought bubble "timed too early?".
- `wseval-evidence`: two small graphs side by side: three scattered points labelled "not much evidence" and many points forming a clear pattern labelled "more evidence".
- `wseval-method`: a checklist card with "valid method?" and "fair test?" and a small thermometer showing a room that warmed up, marked with a cross on "kept the same".
- `wseval-confidence`: a simple three-part scale from "not very confident" to "confident", with three input arrows labelled "method", "anomalous results" and "uncertainty" pointing at it.
- `wseval-improve`: two number lines: "before: 0.5, 1.0, 1.5 mol/dm³" with the best at 1.0 circled, and "after: 0.8, 0.9, 1.0, 1.1, 1.2" with narrower steps around 1.0. Arrow labelled "narrower intervals".
- `wseval-predict`: a loop: conclusion → new prediction → further experiment, with a small arrow back to the start.
- `wseval-q-table` (question, assessment view): a table "Time for a trolley (s)": Group A 3.2, 3.0, 3.1; Group B 2.6, 3.6, 3.1; columns Run 1, 2, 3 and a Mean column showing 3.1 for both. No ranges, no uncertainties shown.

## States in full

### W12-01 Guided choice: You time a falling ball three times with a stopwatch. The times are 1.2 s, 1.3 s and 1.2 s. Why do they differ?
- Options: The ball changed its mass | Measurements always have a little uncertainty | The stopwatch is broken | Gravity changed
- Answer: Measurements always have a little uncertainty
- Hint: Think about reaction time when you press the button.
- Why: Small random errors, such as when you press the button, make repeat readings differ a little. The amount of error your measurements might have is called uncertainty.

### W12-02 Teach: What is uncertainty?
- **Measurements are never perfect** (`wseval-error`): No measurement is completely perfect. Random errors change your readings a little, such as a slightly late stopwatch click. The equipment also has limits, such as a ruler marked only in millimetres. The amount of error your measurements might have is called the uncertainty.
- **First find the range** (`wseval-range`): To find the uncertainty of a mean, first find the range. You met this when you processed data. Suppose a trolley takes 4.2 s, 4.0 s and 4.4 s on three runs. The mean is 4.2 s. The range is 4.4 − 4.0 = 0.4 s.
- **Uncertainty is range ÷ 2** (`wseval-unc`): Now use the equation: uncertainty = range ÷ 2. For the trolley, the range is 0.4 s. So the uncertainty is 0.4 ÷ 2 = 0.2 s. Work out the range first, then halve it.
- **Writing it with ±** (`wseval-plusminus`): Uncertainty is written with the ± symbol. The trolley time is 4.2 ± 0.2 s. This means the true value is probably between 4.0 s and 4.4 s. The less precise your results are, the higher the uncertainty will be.

### W12-03 Guided choice: Three temperature readings are 18.6, 18.0 and 18.3 °C. The mean is 18.3 °C. What is the uncertainty of the mean?
- Options: ± 0.6 °C | ± 0.15 °C | ± 0.3 °C | ± 18.3 °C
- Answer: ± 0.3 °C
- Hint: Find the range first, then halve it.
- Why: Range = 18.6 − 18.0 = 0.6 °C. Uncertainty = 0.6 ÷ 2 = 0.3 °C, so the mean is 18.3 ± 0.3 °C.

### W12-04 Guided choice: Two students time the same trolley. Student X’s repeats are close together. Student Y’s are spread out. Whose mean has the higher uncertainty?
- Options: Student Y, whose results are less precise | Student X, whose results are close together | They are the same | Neither has any uncertainty
- Answer: Student Y, whose results are less precise
- Hint: The less precise the results, the higher the uncertainty.
- Why: Spread-out results have a bigger range, so the uncertainty is higher. Student Y’s results are less precise than Student X’s.

### W12-05 Teach: How good are the results?
- **Accurate and precise** (`wseval-accurate`): To judge the quality of results, ask two questions. Are they accurate? Accurate results are close to the true value. Are they precise? Precise results are close together when you repeat the measurement. Results can be precise without being accurate.
- **Anomalous results** (`wseval-anomaly`): An anomalous result is one that does not fit the pattern. Look for these in your results. If there are none, say so. If there are some, try to explain them. Perhaps you timed too early or misread the scale.
- **Enough evidence?** (`wseval-evidence`): You should also comment on whether there was enough evidence to reach a valid conclusion. Two or three readings are weaker than many. Finally, comment on the level of uncertainty in your results. Repeats that agree closely give a small uncertainty.

### W12-06 Guided choice: Three readings of a boiling point are 96.1, 96.0 and 96.2 °C. The true value is 100 °C. What can you say?
- Options: Accurate but not precise | Both accurate and precise | Neither accurate nor precise | Precise, but not accurate
- Answer: Precise, but not accurate
- Hint: Are they close together? Are they close to 100 °C?
- Why: The readings are close together, so they are precise. They are not close to 100 °C, so they are not accurate.

### W12-07 Guided choice: Four timings in seconds are 2.1, 2.2, 3.9 and 2.0. What should you do about the 3.9 s?
- Options: Delete it and say nothing | Treat it as anomalous and look for a cause, such as a timing slip | Use it, as all results are equally good | Double all the other results
- Answer: Treat it as anomalous and look for a cause, such as a timing slip
- Hint: One result does not fit the pattern.
- Why: A result that does not fit the pattern is anomalous. You should say so and try to explain it, for example by a timing error.

### W12-08 Teach: How do you evaluate an investigation?
- **Look back at the method** (`wseval-method`): An evaluation looks back over the whole investigation. First comment on the method. Was it valid? Did you control the other variables to make it a fair test? Name any variable that slipped, such as a room that warmed up during the test.
- **How confident are you?** (`wseval-confidence`): Now put it together. Think about the method, the anomalous results and the uncertainty. This lets you say how confident you are that your conclusion is right. A fair test with close repeats gives you more confidence.
- **Suggest improvements** (`wseval-improve`): Then suggest changes that would improve the quality of the results. Suppose a reaction is fastest at 1.0 mol/dm³ when you tested 0.5, 1.0 and 1.5 mol/dm³. Testing 0.8, 0.9, 1.0, 1.1 and 1.2 mol/dm³ would give a more accurate answer.
- **Predict and test again** (`wseval-predict`): Your conclusion can also lead to new predictions. For example, you could predict that another acid behaves in the same way. You could then carry out further experiments to test the new prediction.

### W12-09 Guided choice: A reaction was fastest at 1.0 mol/dm³ out of 0.5, 1.0 and 1.5. How could you find the best concentration more accurately?
- Options: Only test 1.0 mol/dm³ again | Use a bigger flask | Take readings at narrower intervals around 1.0 mol/dm³ | Test a concentration of 5.0 mol/dm³
- Answer: Take readings at narrower intervals around 1.0 mol/dm³
- Hint: Look closer to where the best result was found.
- Why: Readings close to 1.0, such as 0.8 to 1.2 mol/dm³, show where the best value really lies. This gives a more accurate result.

### W12-10 Guided choice: Which of these belongs in an evaluation?
- Options: Whether the method was valid and how good the results were | A new hypothesis with no link to the data | A list of the equipment only | The date of the experiment
- Answer: Whether the method was valid and how good the results were
- Hint: An evaluation looks back over the whole investigation.
- Why: An evaluation comments on the method and the quality of the results. It also says how confident you are and how to improve.

### W12-11 Independent choice: Three readings of gas volume are 48, 52 and 50 cm³. The mean is 50 cm³. What is the uncertainty of the mean?
- Options: ± 4 cm³ | ± 2 cm³ | ± 1 cm³ | ± 8 cm³
- Answer: ± 2 cm³
- Hint: Find the range first, then halve it.
- Why: Range = 52 − 48 = 4 cm³. Uncertainty = 4 ÷ 2 = 2 cm³, so the mean is 50 ± 2 cm³.

### W12-12 Independent choice: Both groups have a mean time of 3.1 s. Which mean has the greater uncertainty?
- Options: Group A, because its range is larger | Group B, because its range is larger | They are the same | Group A, because its readings are higher
- Answer: Group B, because its range is larger
- Hint: Find the range of each group.
- Why: Group A range = 3.2 − 3.0 = 0.2 s, so the uncertainty is 0.1 s. Group B range = 3.6 − 2.6 = 1.0 s, so the uncertainty is 0.5 s.
- Visual: `wseval-q-table` (assessment view)

### W12-13 Independent choice: A student took only one reading at each temperature. What is the problem?
- Options: There is no way to check repeatability or spot an anomalous result | The temperature changed too little | The readings are too accurate | One reading is always enough
- Answer: There is no way to check repeatability or spot an anomalous result
- Hint: Think about what repeats let you do.
- Why: With one reading you cannot see whether the result repeats. You also cannot tell if a result is anomalous.

### W12-14 Independent choice: Which is the best evaluation comment?
- Options: It went well. | The results were bad because I am not good at science. | Repeats were close together, so uncertainty was small, but only three temperatures were tested, so I am not fully confident. | Everything was perfect.
- Answer: Repeats were close together, so uncertainty was small, but only three temperatures were tested, so I am not fully confident.
- Hint: A good evaluation gives reasons and says how confident you are.
- Why: This comment refers to the results, the uncertainty and the method. It also says how confident the student is and why.

### W12-15 Written task (teacher marked): A student tests plants at 10, 20 and 30 °C, with one plant per temperature. The tallest grew at 20 °C. Evaluate this and suggest two improvements.
- Hint: Comment on the number of repeats, the intervals and the fair test.
- Model answer: There is only one plant at each temperature, so the results cannot be checked for repeatability or anomalous results. Two improvements are to use several plants at each temperature and take a mean, and to test more temperatures close to 20 °C, such as 16, 18, 20, 22 and 24 °C. I should also keep light and water the same. I am not very confident that 20 °C is best.
- Points: Says one plant per temperature is not enough, or cannot check for anomalous results. / Suggests repeating with more plants and using the mean. / Suggests more temperatures around 20 °C, or narrower intervals. / Says how confident they are in the conclusion, or mentions controlling other variables.
- Reject: Only saying the experiment was fine. / Suggesting a change that does not affect the quality, such as a new pot colour. / Changing the independent variable to something else.

