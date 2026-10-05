# Lesson 26 (Geometry G1): Angle facts — storyboard

The first Geometry lesson. No source pack this time: Claude wrote the explanation, the examples and the numbers. It is lesson 26 in the course (`?lesson=26`, progress key `L026`), and students see it as G1, the first lesson of the new Geometry and measures chapter.

**Why this topic.** The repo's exam map (`maths/readiness/paperTopics.ts`) lists Angles first in Geometry and weights it heaviest (143 marks across 30 papers). Basic angle facts are what every later angles question (triangles, polygons, parallel lines) is built on, and need nothing from Properties of shapes, which the map lists as Angles' prerequisite.

## The three facts, one rung each (easiest first)

| Rung | Fact | Worked example | Questions |
| --- | --- | --- | --- |
| On a straight line | add up to 180° (a half turn) | Two roads cross at 70°: find a (video) | 135° and x → 45°; 67°, x, 48° → 65°; 2x and 3x → 36; is 100° + 70° a straight line? (choice) |
| Around a point | add up to 360° (a full turn) | 90°, 140°, 75°, z → 55° | 125°, 150°, y → 85°; five equal angles → 72°; 2x, 3x, 130° → 46; Jay says 180° (choice) |
| Opposite angles | vertically opposite angles are equal | Lines cross at 58°: y opposite → 58° | opposite 125° → 125°; next to 40° → 140°; 3x opposite 84° → 28; Mia says 55° (choice) |
| Review | the three facts, and "give the fact as your reason" | | |

## How each working looks (EXPLANATIONS.md)

- The question's own diagram is the picture (`AnglePictures.tsx`): straight lines from one point, an arc on each angle with its size or letter. Given angles are ink, letters biro blue.
- One move a step. Step 1 boxes the angles it uses in purple and writes the fact as a purple line ("70° + a = 180°"). The last step writes the answer once, green, on the angle and in the answer box.
- Algebra questions add a step per move: collect the x's, take away the number, divide.
- Practice questions show their diagram above the answer box, because the numbers are in it. Answers are typed as a number, with `x =` before the box and ° after it (a typed ° is accepted).
- Wrong-answer messages catch the usual slips: using 360° on a line or 180° at a point, giving the angle next to it instead of opposite, giving 2x instead of x.

## The video (G1.1, 1:12)

`tools/lesson-kit/packs/G1.1-angle-facts.cjs`. Two roads cross at 70°: find a, b and c. Fact 1 finds a = 110°, fact 2 gives b = 70° and c = 110°, fact 3 checks they make 360°, then "give a reason". Recap: straight line 180°, around a point 360°, vertically opposite equal.

## The worksheet (G1.1, 8 questions, 14 marks)

Worked example (a = 110°, with the reason), then easy (45°, opposite 58°), medium (three on a line 65°, around a point 55°), hard (2x + 3x = 180), very hard (2x + 3x + 130 = 360, and Mia's mistake). Every question has its own diagram; the kit's worksheet now takes a `figure` on a question for that.

## Questions for Sunny

- Is "a half turn / a full turn" the right way in for these students, or would you rather open with a protractor picture?
- Should reasons be marked (typed or chosen) in the app, or is "give the fact as your reason" in the Review enough for now?
