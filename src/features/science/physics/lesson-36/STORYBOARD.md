# Physics Lesson 36 storyboard — Half-life

Chapter P4, Atomic structure. Folder `physics/lesson-36`, id `P-ATM-036-P`, skill `P-HALFLIFE`, spec 6.4.2.3. It owns count-rate versus activity (Bq), random decay, the half-life definition, reading half-life off an activity-time graph, and the halving-steps calculation.

Big idea: you cannot predict one nucleus, but a big sample halves in a fixed time. Count the halvings, then share the time out.

Flow note: measuring (count-rate, activity) and randomness first, because half-life only makes sense for a large random sample; then the definition with an 800 → 100 Bq chain; then the graph method (visual, one big step at a time); then the calculation (worked 96 → 12 Bq in 15 min, guided 160 → 20 Bq in 21 days, independent 320 → 20 in 32 min). Friendly numbers only; no net-decline ratio.

Sections:
1. Start here (P36-01): what unstable nuclei do.
2. How do we measure radioactivity? (P36-02–04): count-rate → activity → random → predictable in bulk. Checks: unit of activity; why random.
3. What is half-life? (P36-05–07): definition → activity halves → chain → always the same. Checks: one halving; two samples, same isotope.
4. How do you read it from a graph? (P36-08–10): start → half → across and down → check. Checks: half-life from graph; activity after 20 minutes.
5. How do you calculate a half-life? (P36-11–13): halve step by step → count → divide → unit. Checks: guided calculation; forward halving.
6. On your own (P36-14–17): independent calculation; two half-lives is one quarter left; comparing half-lives; written graph method.

Out of scope: net decline ratio, exponential formulae, background count subtraction, uses of half-life for dating, choosing sources by half-life.

Source boundary: supplied revision-guide page 201 (scope only); AQA 8464 Physics 6.4.2.3. All wording, numbers and examples are original. Draft pending teacher review.

Judgement calls: the popcorn comparison is one sentence; the teaching graph uses 800 Bq with a half-life of 2 s, and the separate question graph uses 400 Bq with a half-life of 10 minutes.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, gentle tints, hand-drawn feeling, text >= 12px, readable at 360px. Use `physicsPalette` and PhysicsKit helpers (graph axes, energy-store badges, transfer arrows). Walkthrough frames in one section reuse one drawing and change the highlight.

Section 2:
- `halflife-count`: a source with rays, a Geiger-Muller tube and counter showing clicks; label "count-rate: counts each second (cps)".
- `halflife-activity`: the same source with a few nuclei; label "activity: decays each second, in becquerels (Bq)" and "1 Bq = 1 decay per second".
- `halflife-random`: a cluster of about 12 nuclei, a few shaded as decayed, with a question mark over one still-undecayed nucleus; label "which one next? no way to know".
- `halflife-predict`: a big cluster of nuclei (about 30 dots) with half shaded as decayed; label "half have decayed: predictable for a big sample" and clock icon.

Section 3:
- `halflife-def`: two grids of nuclei (e.g. 16 dots) side by side, left all unstable, right half shaded; arrow labelled "one half-life"; caption "number of nuclei halves".
- `halflife-steps`: the two grids again, with an activity meter under each: "800 Bq" and "400 Bq"; label "activity halves too".
- `halflife-chain`: a row of four bars 800, 400, 200, 100 Bq falling in height, with arrows labelled "one half-life" between them.
- `halflife-same`: two small chains, one from 800 Bq and one from 80 Bq, each with the same gap marked "same time each step".

Section 4 (one activity-time graph, x-axis "Time (s)" 0, 2, 4, 6, curve from 800 Bq; y-axis "Activity (Bq)" 0-800; step highlighted):
- `halflife-graph-initial`: mark the start point (0, 800) with a label "start: 800 Bq".
- `halflife-graph-half`: dashed horizontal line from 400 Bq across to the curve; label "half of 800 = 400".
- `halflife-graph-time`: dashed line goes down to 2 s; label "half-life = 2 s".
- `halflife-graph-check`: second dashed guides 200 Bq at 4 s, both gaps marked "2 s".

Section 5 (a row of four bars 96, 48, 24, 12 Bq; step highlighted; time bar "15 minutes" under):
- `halflife-w-halve`: bars 96 → 48 → 24 → 12 with "÷ 2" arrows appearing.
- `halflife-w-count`: the three arrows numbered 1, 2, 3 and labelled "3 half-lives".
- `halflife-w-divide`: the 15 minute bar cut into three equal parts, "15 ÷ 3".
- `halflife-w-answer`: one part highlighted "half-life = 5 minutes" with a tick.

Question visual (assessment view):
- `halflife-q-graph` (P36-09, P36-10): an activity-time graph, x-axis "Time (minutes)" 0-30 in steps of 10, y-axis "Activity (Bq)" 0-400 in steps of 100; a smooth decay curve through (0, 400), (10, 200), (20, 100), (30, 50). Gridlines every 100 Bq and 5 minutes so points can be read. No dashed guides and no half-life label. Neutral description: "Graph of activity against time for a radioactive source."
