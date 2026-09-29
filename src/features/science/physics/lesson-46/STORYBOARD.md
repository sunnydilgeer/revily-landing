# Physics Lesson 46 storyboard — Velocity-time graphs and terminal velocity

Chapter P5, Forces (motion). Folder `physics/lesson-46`, id `P-MOT-046-P`, skill `P-VTGRAPH`, spec 6.5.4.1.5. It owns what the lines on a velocity-time graph mean, acceleration as the gradient (one large triangle), drag and air resistance, and terminal velocity told as a qualitative story. Distance-time graphs and a = Δv ÷ t belong to the neighbouring lessons.

Big idea: on a velocity-time graph the shape of the line tells the story of the journey, and its steepness is the acceleration. A falling object speeds up until the drag equals its weight, then it falls at a steady terminal velocity.

Flow note: line shapes first (no numbers), then the gradient calculation as its own short section, then drag on its own, because terminal velocity needs both drag and the idea of a levelling curve. Calculation flow: worked example (0 to 12 m/s in 4 s = 3 m/s²) → near-identical guided item (cyclist 2 to 10 m/s in 4 s) → independent calculation (motorbike 4 to 24 m/s in 5 s). Axes always carry units, and every triangle is a large one.

Sections:
1. Start here (P46-01): what a skydiver's speed does at first.
2. What do the lines mean? (P46-02–04): axes → uphill → flat → downhill → curve. Checks: a flat section; the line for slowing down.
3. How do you find acceleration? (P46-05–06): gradient → big triangle → the two sides → divide → unit. Check: cyclist calculation.
4. What is drag? (P46-07–08): fluids → drag → opposes motion → more speed, more drag. Check: what drag is.
5. What is terminal velocity? (P46-09–11): weight bigger than drag → drag grows → acceleration shrinks → forces balance → steady speed and levelling graph. Checks: drag against weight; acceleration near terminal velocity.
6. On your own (P46-12–15): motorbike calculation; reading a three-part journey; parachutist force; written description of a fall.

Out of scope: negative gradients as a calculation; area under the graph; parachute opening; the exam questions on the page (not reused); numerical drag values.

Source boundary: supplied revision-guide page 213 (scope only); AQA 8464 Physics 6.5.4.1.5. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The curved line is taught in one frame as "the acceleration is changing", as on the page, and is used again only for the terminal velocity graph.
- Deceleration is shown with a straight downward line but never calculated.
- The skydiver story keeps to weight, drag and the resultant force; no numbers except the 700 N check question.

## Diagram specs
Look as in Lessons 17 and 18 and the other Physics lessons: soft flat fills with a darker stroke of the same hue, `physicsPalette`, text >= 12px in the SVG, readable at 360px. Graphs use PhysicsKit graph axes: "Time (s)" along the bottom and "Velocity (m/s)" up the side, with friendly tick numbers and a light grid. One line colour per idea.

Section 2 (one small graph each, the same axes throughout):
- `vtgraph-axes`: empty axes with the two labels, a small car icon and the note "velocity = how fast, and which way".
- `vtgraph-uphill`: a straight line rising from the origin; a small car speeding up beneath; label "straight, sloping up: constant acceleration".
- `vtgraph-flat`: a line rising then a flat section; the flat section highlighted; label "flat: steady speed, no acceleration".
- `vtgraph-downhill`: a line falling to the time axis; highlighted; label "sloping down: deceleration".
- `vtgraph-curve`: a curve that gets steeper, then a second faded curve that levels off; label "curve: the acceleration is changing".

Section 3 (one graph, a step highlighted each time): a car line from (0 s, 0 m/s) straight up to (4 s, 12 m/s) on axes with ticks 0-12 (step 4) and 0-4 s.
- `vtgraph-g1`: the line only, label "gradient = steepness = acceleration".
- `vtgraph-g2`: a large right-angled triangle under the line, its slanted side on the line, covering most of it; a small faded "too small" triangle for contrast.
- `vtgraph-g3`: the triangle with the upright side labelled "12 − 0 = 12 m/s" and the flat side "4 − 0 = 4 s".
- `vtgraph-g4`: the same, with the card "gradient = 12 ÷ 4 = 3".
- `vtgraph-g5`: the result card "acceleration = 3 m/s²" with a tick.

Section 4:
- `vtgraph-fluid`: a glass of water and a puff of air side by side, both labelled "fluid", with a ball moving through each.
- `vtgraph-drag`: a ball falling through air with a small arrow up "drag (air resistance)".
- `vtgraph-drag-dir`: a car moving right, a long arrow to the right "movement", a red arrow to the left "drag".
- `vtgraph-drag-speed`: two cyclists, slow (short drag arrow, "3 m/s") and fast (long drag arrow, "10 m/s").

Section 5 (one skydiver scene on the left, a small velocity-time curve on the right that grows frame by frame; weight is a down arrow, drag an up arrow, sizes matter):
- `vtgraph-term1`: skydiver just jumped; long "weight" arrow down, tiny "drag" arrow up; graph shows the start of a steep line.
- `vtgraph-term2`: faster; drag arrow grows, weight the same; graph curve continues.
- `vtgraph-term3`: drag arrow nearly as long as weight; "resultant force gets smaller"; the curve is getting flatter.
- `vtgraph-term4`: arrows equal length; label "drag = weight, resultant force zero"; the curve is flat.
- `vtgraph-term5`: the whole curve, the flat part labelled "terminal velocity".

Question visuals (assessment view; no answers on the picture):
- `vtgraph-q-cyclist` (P46-06): a straight line on axes, starting at (0 s, 2 m/s) and reaching (4 s, 10 m/s), ticks at every 2 m/s and every 1 s; no triangle, no gradient values.
- `vtgraph-q-bike` (P46-12): a straight line from (0 s, 4 m/s) to (5 s, 24 m/s), ticks 4 m/s and 1 s; no triangle drawn.
- `vtgraph-q-journey` (P46-13): axes with a line in three parts numbered 1, 2, 3 by pointers: part 1 slopes up (0 to 4 s, 0 to 8 m/s), part 2 flat at 8 m/s (4 to 8 s), part 3 slopes down (8 to 10 s, 8 to 0 m/s). No words such as "steady" or "slowing".
