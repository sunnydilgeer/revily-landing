# Physics Lesson 45 storyboard — Distance-time graphs

Chapter P5, Forces (motion). Folder `physics/lesson-45`, id `P-MOT-045-P`, skill `P-DTGRAPH`, spec 6.5.4.1.4. It owns reading and drawing distance-time graphs, gradient = speed with one large triangle, and the meaning of curves.

Big idea: on a distance-time graph, flat means stopped, a straight slope means steady speed, steeper means faster, and the gradient is the speed.

Flow note: read the simple shapes first (flat, straight, steeper), then curves as "the speed is changing", then the calculation (which needs steepness already understood), then drawing a journey stage by stage, which uses everything before. Calculation flow: worked (line through (2 s, 4 m) and (8 s, 16 m), 2 m/s) → guided graph (points (1, 4) and (6, 24), 4 m/s) → independent from a graph (part R, 6 m/s) and from triangle sides (60 m, 20 s, 3 m/s).

Sections:
1. Start here (P45-01): waiting at the school gate.
2. How do you read a journey? (P45-02–04): the axes, flat, straight, steeper. Checks: find the stationary part on a graph; which of two lines is faster.
3. What do curves mean? (P45-05–07): a curve, getting steeper, levelling off. Two checks.
4. How do you find the speed? (P45-08–09): gradient = speed, big triangle, read the sides, divide. Guided graph calculation.
5. How do you draw one? (P45-10–11): split into stages, plot, check. Check: choose the description of a journey.
6. On your own (P45-12–15): fastest part of a graph, speed from the same graph, speed from triangle sides, a written journey.

Out of scope: drawing accurate graphs on paper with a scale (only the stage-by-stage idea); gradient of a curve (tangents, Higher tier); velocity-time graphs (next lesson); negative gradients (returning to the start) are not needed.

Source boundary: supplied revision-guide page 212 (scope only); AQA 8464 Physics 6.5.4.1.4. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Only one method for gradient: one large triangle, sides read from the axes. Numbers are whole and friendly.
- A curve getting steeper or flatter is described as speeding up or slowing down (no tangents).
- The drawing section gives stage points to plot rather than asking for an accurate hand-drawn graph.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, `physicsPalette`, text at least 12px, readable at 360px. Every graph: vertical axis "Distance (m)", horizontal axis "Time (s)", light plain grid, friendly tick numbers, lines in one strong colour with rounded joins; marked points as small dots. Use PhysicsKit graph axes. One graph is reused across a section, changing what is highlighted.

Section 2:
- `dtgraph-axes`: empty axes labelled with units and a small runner icon at the start; an arrow along the axes "distance up, time across"; a plain example line rising.
- `dtgraph-flat`: a graph with one rising section then a flat section highlighted; label "flat: stationary" and a stopped figure.
- `dtgraph-straight`: a straight sloping line from the origin with equal steps drawn (each 1 s across, the same distance up); label "steady speed".
- `dtgraph-steeper`: two straight lines from the origin, a steep one labelled "faster" and a gentle one labelled "slower"; note "steeper line = bigger gradient = faster".

Section 3:
- `dtgraph-curve`: a smooth curve with a few short tangent-style tick lines at different steepness (drawn as small line segments only), label "steepness changes: speed changes".
- `dtgraph-curve-up`: a curve getting steeper, with a car icon and arrow "speeding up".
- `dtgraph-curve-down`: a curve that starts steep and levels off flat, with arrow "slowing down".

Section 4 (one graph reused: a straight line through the origin passing exactly through (2, 4) and (8, 16); time axis 0–10 s, distance axis 0–20 m, ticks every 2 s and 4 m):
- `dtgraph-g1`: the line only, with the equation card "speed = gradient = change in distance ÷ change in time".
- `dtgraph-g2`: adds a large right-angled triangle whose sloping side is the line from (2, 4) to (8, 16); dotted horizontal and vertical sides; label "large triangle: use most of the line" and a small crossed-out tiny triangle near the origin labelled "too small".
- `dtgraph-g3`: same triangle with the horizontal side labelled "change in time = 8 − 2 = 6 s" and the vertical side labelled "change in distance = 16 − 4 = 12 m".
- `dtgraph-g4`: same triangle plus card "speed = 12 ÷ 6 = 2 m/s" in a highlighted box.

Section 5 (one graph reused; axes time 0–40 s ticks every 10 s, distance 0–40 m ticks every 10 m):
- `dtgraph-d1`: a journey strip along the top with three stages and pictures: "walks 20 m in 10 s", "stops for 10 s", "walks 20 m in 20 s"; empty axes below.
- `dtgraph-d2`: the axes with the three line parts drawn: (0,0) to (10,20), flat to (20,20), then to (40,40); the points marked; the stage number labels 1, 2, 3.
- `dtgraph-d3`: the finished graph with axis labels emphasised (tags "quantity and unit") and stage 1 and stage 3 gradient triangles shown lightly to compare steepness; labelled "stage 1 is steeper: faster".

Question visuals (assessment view, no answer labels):
- `dtgraph-q-journey` (P45-03): axes "Distance (m)" and "Time (s)", grid, no tick numbers needed beyond the axis ends. A line in four parts labelled A, B, C, D along the top: A a steady rise, B flat (the only horizontal part), C a gentler rise, D the steepest rise. Neutral accessible description: "A distance-time graph in four labelled parts."
- `dtgraph-q-speed` (P45-09): axes with time 0–8 s (ticks every 1 s) and distance 0–32 m (ticks every 4 m) with a light grid; a single straight line through the origin passing through (1, 4) and (6, 24), with those two points marked by dots on the line. No triangle, no numbers on the dots, no speed. Neutral accessible description: "A straight distance-time line on a grid."
- `dtgraph-q-own` (P45-12 and P45-13): axes time 0–12 s (ticks every 2 s) and distance 0–36 m (ticks every 4 m so that 8 m and 32 m sit on gridlines), grid. Three labelled parts: P from (0, 0) to (4, 8), Q flat from (4, 8) to (8, 8), R from (8, 8) to (12, 32). Points at the ends of each part marked with dots. Labels P, Q, R above their parts. Neutral accessible description: "A distance-time graph in three labelled parts P, Q and R."
