# Physics Lesson 41 storyboard — Forces and elasticity

Chapter P5, Forces. Folder `physics/lesson-41`, id `P-FOR-041-P`, skill `P-ELASTIC`, spec 6.5.3. It owns why deforming needs more than one force, elastic vs inelastic deformation, extension, F = ke (substitution, then one rearrangement for k with a cm to m conversion), and the force-extension graph with the limit of proportionality.

Big idea: forces can stretch, squash or bend an object. For a spring, extension is directly proportional to force (F = ke) until the limit of proportionality.

Flow note: shape change and the two kinds of deformation first (the words everything else uses), then extension and the equation, then the equation used twice (find F, then find k, each with its own short walkthrough), then the graph last because it shows where the equation stops working. Calculation flow: find F: worked (k 30, e 0.2, 6 N) → guided (k 50, e 0.4, 20 N) → independent (k 25, e 0.6, 15 N). Find k: worked (10 N, 5 cm, 200 N/m) → guided (12 N, 3 cm, 400 N/m) → independent (15 N, 3 cm, 500 N/m).

Sections:
1. Start here (P41-01): a rubber band stretched and let go.
2. How do forces change shape? (P41-02–04): two forces, stretch/squash/bend, elastic, inelastic, energy stored. Checks: what is needed; which is inelastic.
3. How are force and extension linked? (P41-05–06): extension, direct proportion, F = ke and units, spring constant, compression. Check: extension from two lengths.
4. How do you find a force? (P41-07–08): write, substitute, answer. Guided calculation.
5. How do you find the spring constant? (P41-09–10): rearrange, convert cm to m, divide. Guided calculation.
6. When does it stop working? (P41-11–12): the graph, straight line, steepness, limit of proportionality. Check: what is true past the limit.
7. On your own (P41-13–16): independent F, independent k, a graph question, a written description.

Out of scope: the springs practical and energy stored Ee = ½ke² (next lesson); rearranging for extension; calculating the gradient of the graph (only "steeper = stiffer"); non-linear springs beyond the limit of proportionality.

Source boundary: supplied revision-guide page 207 (scope only); AQA 8464 Physics 6.5.3. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Gradient is described as "the steepness of the straight part equals k"; no triangle calculation here.
- The page's compression note is one frame; questions use stretching only.
- Elastic potential store is named once (deformation frame) and taught in full in the next lesson.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, `physicsPalette`, force arrows in one colour throughout (the same as Lesson 38 will use for forces), text at least 12px, readable at 360px. Springs drawn as smooth coils.

Section 2:
- `elastic-shape`: left, a ball with one arrow pushing it and a small motion trail (label "one force: it moves"); right, a sponge squeezed between two opposing arrows (label "two forces: it changes shape").
- `elastic-deform`: three small panels: a spring stretched by two outward arrows ("stretch"), a spring squashed by two inward arrows ("compress"), a ruler bent by two arrows ("bend"). Caption "deformation".
- `elastic-elastic`: a spring stretched, an arrow "forces removed", the spring back at its original length with a dashed outline of the stretched length. Label "elastic deformation".
- `elastic-inelastic`: a lump of plasticine squashed, an arrow "forces removed", it stays squashed; beside it a bent paper clip. Label "inelastic deformation".
- `elastic-energy`: a stretched spring with the "Elastic potential" store badge from PhysicsKit and a small bar; a hand doing the pulling; label "work done stores energy".

Section 3:
- `elastic-extension`: two springs side by side hanging from a bar: natural length (labelled "natural length") and stretched by a mass ("stretched length"); a dimension line between the bottom ends labelled "extension, e".
- `elastic-proportion`: three springs with masses giving forces 2 N, 4 N, 6 N and extensions 3 cm, 6 cm, 9 cm, dimension lines growing by equal steps. Label "twice the force, twice the extension".
- `elastic-eq`: an equation card "force = spring constant × extension" and "F = k × e", each symbol tagged with its name and unit: F (newtons, N), k (newtons per metre, N/m), e (metres, m). Colour each symbol consistently (F, k, e colours reused in the worked frames).
- `elastic-k`: two springs of the same natural length pulled by the same force; the stiff one barely stretches ("stiff spring: large k"), the soft one stretches a lot ("soft spring: small k").
- `elastic-compress`: a spring squashed by two inward arrows with a dimension line showing "e" as the natural length minus the squashed length; label "compression".

Section 4 (one drawing, step highlighted; a spring with a hand pulling):
- `elastic-w1`: spring with tags "k = 30 N/m", "e = 0.2 m", question "F = ?", and the equation "F = k × e" beneath.
- `elastic-w2`: the same with "F = 30 × 0.2".
- `elastic-w3`: "F = 6 N" in a highlighted box, unit circled.

Section 5 (one drawing; a spring with a force arrow and extension dimension line):
- `elastic-r1`: card "F = k × e" with an arrow "divide both sides by e" leading to "k = F ÷ e".
- `elastic-r2`: spring with "10 N" and extension "5 cm"; below "5 cm ÷ 100 = 0.05 m", the "÷ 100" highlighted as the conversion step.
- `elastic-r3`: "k = 10 ÷ 0.05 = 200 N/m" in a highlighted box.

Section 6 (one graph reused, each frame adds to it): axes "Force (N)" vertical and "Extension (m)" horizontal, grid-free, plain ticks with friendly values.
- `elastic-graph1`: empty axes with a few crosses appearing along a straight rising line; caption "each cross is one measurement".
- `elastic-graph2`: adds a straight line through the origin and the label "directly proportional".
- `elastic-graph3`: adds a second, steeper dashed line labelled "stiffer spring (bigger k)" next to the first labelled "softer spring".
- `elastic-limit`: line straight then curving over; point P marked at the start of the bend, labelled "limit of proportionality"; the straight part labelled "F = ke works", the curved part "F = ke does not work".

Question visual:
- `elastic-q-graph` (assessment view, P41-15): a force-extension graph with axes labelled "Force (N)" and "Extension (m)" and no numbers. Four crosses labelled A, B, C on the straight part and D on the curved part beyond the bend. The bend point is NOT marked or labelled and no "limit" text appears. Neutral accessible description: "A force-extension graph with four labelled points."
