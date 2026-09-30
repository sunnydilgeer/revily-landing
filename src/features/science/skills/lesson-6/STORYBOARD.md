# Working Scientifically Lesson 6 storyboard: Processing data

Strand skills, chapter WS1 "Working scientifically". Folder `skills/lesson-6`, id `W-DAT-006-W`, spec WS 3.2, 4.6. It owns tables with headings and units, mean, median, mode and range (mean excluding anomalies), and significant figures (round to the fewest given; round only the final answer).

Big idea: raw readings become useful when they are set out in a table and summarised with a mean, and answers are rounded sensibly.

Flow note: tables first, because readings need somewhere to go; then the four summary values, with one worked example and two guided items; then significant figures, because they follow from a calculated answer (speed, density). Calculation flow: worked example → near-identical guided item → independent calculation on your own, for both the mean and significant figures. Anomalies were introduced in the previous lesson and are used here in one clause. Tangents to curves and other Higher content are not present.

Sections:
1. Start here (W6-01): three trolley times, which single value sums them up.
2. How do you set out a table? (W6-02–03): a neat table → units in the heading → room for repeats. Check: a correct heading.
3. Mean, median, mode and range (W6-04–07): mean → median → mode → range → leave out anomalies. Worked: 10, 14, 8, 14, 19 cm³ (mean 13, median 14, mode 14, range 11). Guided: mean of 24, 30, 27, 26, 33 s = 28 s; median of six seed masses = 16 g.
4. How do you round an answer? (W6-08–11): counting significant figures → round to the fewest → round only at the end. Worked: 2.5 m ÷ 0.60 s = 4.2 m/s. Guided: 4.8 ÷ 0.70 = 6.9 m/s; 0.0472 to 2 s.f. = 0.047.
5. On your own (W6-12–15): mean without an anomaly (24 cm³); density 9.1 ÷ 2.4 = 3.8 g/cm³; a table with an anomalous reading; written task on processing five trolley times.

Out of scope: choosing graphs and plotting (later lessons); uncertainty and evaluation; standard form.

Source boundary: supplied revision-guide page 239 (scope only); AQA 8464 WS 3.2, 4.6. All wording, examples, numbers and diagrams are original; the page's table, gas example and density example are not reused. Draft pending teacher review.

Judgement calls for the teacher:
- The median of six values is shown as halfway between the middle two, and the worked example uses an odd count first.
- The mode is treated as the most common value; data sets with no mode are not tested.
- Rounding is done half up (3.79 rounds to 3.8).

## Diagram specs
Same look as Science Lessons 17 and 18: soft flat fills, darker stroke of the same hue, text at least 12px, readable on 360px. Tables are drawn as neat rounded grids.

- `wsprocess-table`: a neat results table drawn with straight lines and a ruler icon beside it; every column has a heading. Label "a heading on every column".
- `wsprocess-units`: two tables side by side: left with "Time" and cells "5 s, 6 s" (cross), right with "Time (s)" and cells "5, 6" (tick).
- `wsprocess-repeats`: a table with columns "Repeat 1 (s)", "Repeat 2 (s)", "Repeat 3 (s)", "Mean (s)" and two rows of small numbers, the mean column highlighted.
- `wsprocess-mean`: five stacked coin/blocks of different heights levelled out into equal heights, with "add up, then divide". Values 10, 14, 8, 14, 19.
- `wsprocess-median`: the same five values in order 8, 10, 14, 14, 19 with the middle one highlighted; a small side note for an even number of values "halfway between the middle two".
- `wsprocess-mode`: the same values with the two 14s highlighted "most often".
- `wsprocess-range`: a number line with 8 and 19 marked and a bracket "range = 19 − 8 = 11".
- `wsprocess-anomaly`: a row of readings 22, 24, 41, 23, 27 with the 41 faded and crossed "left out", and "divide by 4, not 5".
- `wsprocess-sf-count`: the number 0.0406 with the three digits 4, 0, 6 marked 1st, 2nd, 3rd and the leading zeros greyed.
- `wsprocess-sf-round`: the sum 2.5 ÷ 0.60 with each number tagged "2 s.f.", an arrow "answer: 2 s.f.".
- `wsprocess-sf-final`: two steps of a calculation with the digits kept and one final "round here" marker at the end only.
- `wsprocess-worked-average` (worked example, teaching view): the five values with the four steps and answers 13, 14, 14, 11 cm³.
- `wsprocess-worked-sf` (worked example, teaching view): the speed calculation with 4.1666… m/s crossed by rounding to 4.2 m/s (2 s.f.).
- `wsprocess-q-table` (question, assessment view): a table titled "Volume of gas (cm³)" with rows Tube A (31, 33, 32) and Tube B (45, 47, 62), columns Repeat 1, 2, 3. No mean column and no highlight. Neutral description: "A table of three repeat gas volumes for each of two test tubes."
