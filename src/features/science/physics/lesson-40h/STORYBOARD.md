# Physics Lesson 40H storyboard — Calculating forces

Chapter P5, Forces. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). It sits after Lesson 40 (resultant forces and work done), which left forces at angles out, and before Lesson 41 (forces and elasticity). Folder `physics/lesson-40h`, id `P-FOR-040H-P`, skill `P-FORCE-DRAWING`. Visuals: `components/HigherForceDrawingVisuals.tsx` (focus prefix `hfdraw-`).

Big idea: forces that do not act along one line cannot just be added or subtracted. A scale drawing does the job: draw the forces to scale, tip-to-tail, and the line from the start of the first to the tip of the last is the resultant; measure its length (size) and angle (direction). If the forces make a closed shape the resultant is zero and the object is in equilibrium, and a missing force closes the gap. Going the other way, one slanted force can be split into a horizontal and a vertical component on a square grid.

Flow note: builds on force arrows as vectors and on resultants along a line (add or subtract) without re-teaching them. Everything is done by drawing and measuring with a ruler and protractor: no trigonometry or Pythagoras. One object carries the first two sections: a metal ring pulled by strings (8 N right, 6 N up), drawn beside its scale drawing (1 cm = 2 N). Section 2 builds the resultant (10 N at 37°); section 3 adds a third string that holds the ring still, so the same triangle closes, and the missing force is found the same way. Components come last because they are the reverse of the first idea (one force → two), on a square grid where counting replaces measuring. All numbers are 3-4-5 triangles, so every length is whole.

1. **Start here** (P40H-01): what a twice-as-long force arrow shows (size; force is a vector).
2. **Finding a resultant by drawing** (P40H-02–06): ring with 8 N right and 6 N up beside squared paper: not 14 N → scale 1 cm = 2 N (4 cm, 3 cm) → tip-to-tail → resultant from start of first to tip of last → measure 5 cm = 10 N, protractor 37°. Worked: 15 N right, 20 N up at 1 cm = 5 N → 5 cm = 25 N at 53°. Checks: length of a 30 N arrow at 1 cm = 5 N (6 cm); where the resultant goes; 6.5 cm at 1 cm = 4 N (26 N).
3. **Forces in equilibrium** (P40H-07–10): the same ring with a third string (10 N down-left): resultant zero, equilibrium → closed triangle, ends where it started → missing force: known forces tip-to-tail, close the gap → measure 10 N, 37° below the horizontal, down and to the left. Checks: what a closed triangle means; how to draw a missing force; grid question (4 N left, 3 N down, dashed 5-square closing line → 5 N up and to the right).
4. **Splitting a force into components** (P40H-11–13): sledge rope pulling 10 N at an angle (forwards and up) → drawn on a square grid, 1 square = 1 N → across along a grid line, then up to the tip → 8 squares = 8 N, 6 squares = 6 N; together the same effect as the 10 N pull. Checks: what components are; horizontal component on a grid at 2 N per square (8 N).
5. **On your own** (P40H-14–18): 5 cm resultant at 1 cm = 3 N (15 N); which numbered arrow is the resultant (assessment view); vertical component on a grid at 5 N per square, force pointing up-left (15 N); missing force for 6 N right and 8 N down in equilibrium (10 N up and to the left); written task: describe the scale drawing for 12 N right and 5 N up (13 N at about 23°).

Numbers (each checked twice): 8, 6 → 10 N, tan⁻¹(6/8) = 36.9° ≈ 37° · 15, 20 → 25 N, tan⁻¹(20/15) = 53.1° ≈ 53° · 30 ÷ 5 = 6 cm · 6.5 × 4 = 26 N (forces 10 N and 24 N; distractors 6.5 + 4, 6.5 ÷ 4) · grid 4 and 3 squares → 5 squares, 5 N · 2 N per square: 4 × 2 = 8 N horizontal, 3 × 2 = 6 N vertical · 5 × 3 = 15 N (forces 9 N and 12 N; distractors 5 + 3, 5 ÷ 3) · 5 N per square: 3 × 5 = 15 N vertical, 4 × 5 = 20 N horizontal · 6, 8 → 3 cm and 4 cm at 1 cm = 2 N, closing line 5 cm = 10 N · 12, 5 → 13 N, tan⁻¹(5/12) = 22.6° ≈ 23°.

Out of scope: calculating the resultant or components with Pythagoras or trigonometry (the method is drawing and measuring); more than three forces or forces not at right angles in the resultant section (the closed-shape idea is general but only triangles are drawn); moments; inclined planes; the parallelogram method; the book's examples, question, cartoon and jokes.

Source boundary: supplied revision-guide page 211 (scope only); AQA 8464 Physics 6.5.1.4 (HT only: scale vector diagrams for resultants, equilibrium and resolving), with 6.5.1.1 (vectors as arrows) for the opening question. The book's 4 N and 3 N worked example, its three-force sketch and its 0.50 N / 0.30 N question were replaced by the ring with strings (8 N and 6 N; 15 N and 20 N), the sledge rope, and invented grid and scale questions. All wording, numbers, questions and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Angles are given to the nearest degree (37°, 53°, 23°), as a protractor reading would be; the exact values are not mentioned.
- The direction of the resultant is described as an angle "above the horizontal"; the missing force as "down and to the left, 37° below the horizontal". Bearings are not used.
- Equilibrium is described only as "the forces are balanced, the ring stays still". Moving at a steady velocity is left for Newton's First Law.
- The sledge's vertical component is described as "lifting the front a little"; the 6 N does not exceed the sledge's weight, and weight and the normal force are not drawn, to keep one idea per frame.
- The scale drawings on screen are not literally centimetre-accurate on every device; the frames state the lengths in cm.

## Diagram specs
House style of the Physics lessons (PhysicsKit `PhysicsDiagram`, ContactForceVisuals `ForceArrow` and `forceTone`): first force orange, second blue, resultant dark slate, third (balancing or missing) force purple; components teal (horizontal) and purple (vertical). The object sits on the left with block force arrows (length ∝ force); the scale drawing sits on the right on soft squared paper with thin pencil-style arrows. Amber dashed glows mark the point a frame is about; green cards hold the measured answer. Text ≥ 13px, readable at 360px. Assessment views hide components, the resultant label and the missing force's arrowhead and size.

- `hfdraw-res-forces` … `hfdraw-res-measure`: ring + squared paper, built up step by step; the last frame adds the 10 N resultant on the ring and the 37° arc.
- `hfdraw-worked-ring`: the same scene for 15 N and 20 N at 1 cm = 5 N.
- `hfdraw-eq-balanced` … `hfdraw-eq-together`: ring with three strings; closed triangle; dashed missing force; measured 10 N with the 37° arc.
- `hfdraw-comp-pull` … `hfdraw-comp-together`: sledge with a rope at an angle beside a square grid (1 square = 1 N).
- Questions: `hfdraw-q-missing` (P40H-10), `hfdraw-q-grid` (P40H-13), `hfdraw-q-arrows` (P40H-15, three numbered arrows), `hfdraw-q-comp` (P40H-16).

## States in full

(See `lesson.ts` for every state, option, hint and explanation, and `teachingFrames.ts` for every frame.)
