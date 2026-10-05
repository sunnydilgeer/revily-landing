# Lesson 26 (Graphs GR1): Straight line graphs — storyboard

From the GR1 pages of Sunny's book scan (p70–71: horizontal and vertical lines, gradient from a graph and from two points, positive and negative gradients, four Your Turn questions). The ideas and order follow the book; every number is our own (EXPLANATIONS.md). Progress key `L026`.

**Hidden on live.** The lesson is not in the course registry, so the curriculum, contents, search, exam map, revision cards and practice don't know it exists. It opens only at `/preview/gr1-ba769eb9a12b`, which is behind the preview password (`middleware.ts`) and noindexed. Its video sits under `public/media/gr1-ba769eb9a12b/`. To release it later: add an `entry(...)` to `courseRegistry.ts`, a `case` in `App.tsx`, and delete the preview page.

## Three rungs, easiest first

| Rung | Idea | Worked example | Questions |
| --- | --- | --- | --- |
| Across and up | y = a is across, x = a is up and down | Draw y = 3 and x = −2: plot points with y 3, join; points with x −2, join | which equation is this line (y = 4, choice); line drawn → x = 3; horizontal through (6, −1) → y = −1; which point is on x = −4 (choice); which equation is the y axis (choice) |
| Gradient from a graph | change in y ÷ change in x | Line through (1, 2) and (3, 8): up 6, across 2, gradient 3 (video) | gradient 4; −2 (goes down); 1/2 (shallow); positive or negative (choice) |
| Gradient from two points | subtract in the same order both times | (1, 2) and (4, 8): 8 − 2 = 6, 4 − 1 = 3, gradient 2 | (2, 5) and (4, 11) → 3; (−2, 7) and (1, −5) → −4; (−3, −3) and (5, 1) → 1/2; (6, 2) and (2, 10) → −2; Sam divided across by up (choice) |
| Review | the four facts | | |

## How each working looks (EXPLANATIONS.md)

- The question's own grid is the picture (`GraphPictures.tsx`): a square grid with its axes, the line drawn edge to edge, points with their coordinates. A line the question gives is ink; a line a step draws is biro blue, then green as the answer.
- One move a step, always in the same order: pick two points (ringed in purple), change in y (an up or down arrow in biro blue, its size beside it), change in x (an across arrow in amber), then divide, in the green answer box. Each step writes its own line under the grid, in its arrow's colour.
- With only two points, the same grid is drawn from the points, so the student still sees the triangle, and the lines read "Change in y = 10 − 2 = 8": second point take away the first, both times.
- Gradient answers are typed any way that has the value (3, −2, 1/2, 0.5), with "Gradient =" before the box; the phone shows the full keyboard so − and / are there. Line answers have "x =" or "y =" before the box.
- Wrong-answer messages catch the usual slips: across ÷ up, the sign lost, only the change in y, the x coordinate used for a horizontal line, and subtracting in different orders.

## The video (GR1.1, 1:09)

`tools/lesson-kit/packs/GR1.1-straight-line-graphs.cjs`, on the rung 2 worked example. How steep is the line? Pick (1, 2) and (3, 8); count up 6; count across 2; gradient = change in y ÷ change in x = 3, "up 3 for every 1 across". Then the same from the coordinates alone (8 − 2, 3 − 1), and positive vs negative. Recap: pick two points on grid corners, change in y ÷ change in x, up is positive and down is negative.

## The worksheet (GR1.1, 8 questions, 15 marks)

Worked example (gradient 3 from the graph), then easy (equation of x = −1; draw y = 1 and x = 4), medium (gradient 2 from a graph; (3, 4) and (7, 16) → 3), hard (−1/2 from a graph), very hard ((−5, 2) and (3, −6) → −1; Priya subtracts in different orders). The kit's worksheet now takes a `figure` (the grid) on a question.

## Questions for Sunny

- Order of the steps: the book counts across first in its picture but writes change in y on top of the formula. The lesson always does change in y first, then change in x, so the picture and the formula match. Happy with that?
- "Up over across" is the phrase used for change in y ÷ change in x. Is that how you'd like it said, or "rise over run"?
