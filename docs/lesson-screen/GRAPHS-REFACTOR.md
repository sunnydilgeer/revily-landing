# Graphs rebuild: plan

A plan for rebuilding the graph components so graphs are a consistent size, flow with their explanations and tables, and fit the fixed lesson screen. No code has been written for this yet.

## 1. Where graphs are today

| Piece | File | Lines | Role |
|---|---|---|---|
| `GraphVisual`, `ValueTable`, `useGridAlignment`, `useMostAcross`, `balanced` | `src/features/written-methods/tutor/GraphPictures.tsx` | 528 | Draws a graph (axes, ticks, points, lines, curves, labels, the step's heading) and tables of values; lines the graph up with the card's squared paper |
| `GraphBoard` | `GraphBoard.tsx` | 311 | Drag a point; the base for most graph questions |
| `LineBoard`, `TiltBoard`, `CurveBoard`, `JourneyBoard` | `LineBoard.tsx`, `TiltBoard.tsx`, `CurveBoard.tsx`, `JourneyBoard.tsx` | 97–129 each | Draw a line, tilt a line (gradient), plot a curve, distance–time journeys |
| `EquationBoard` (graph variant) | `EquationBoard.tsx` | 95 | Solving with a graph beside the equation |
| Graph lessons | `src/features/{coordinates,lines,gradient,parallel-lines,simultaneous-graphs,curve-graphs,distance-time,real-life-graphs}` | | Lessons 101–108, shown through `src/features/graphs/GraphsShelf.tsx` |

Which lessons use what (counts of references in each lesson's content):

| Lesson | Boards | Tables | Notes |
|---|---|---|---|
| 101 Coordinates | GraphBoard | | Drag the dot |
| 102 Lines | GraphBoard, LineBoard | 13 | Tables of values drive the lines |
| 103 Gradient | GraphBoard, TiltBoard | 1 | |
| 104 Parallel lines | GraphBoard | | Worst overflow (up to 324px on a laptop) |
| 105 Simultaneous equations by graph | GraphBoard | | Second worst |
| 106 Quadratic and cubic graphs | GraphBoard, CurveBoard | 17 | Table-heavy |
| 107 Distance–time | GraphBoard, JourneyBoard | | |
| 108 Real-life graphs | GraphBoard | | Scaled axes |

## 2. What is wrong with it

1. **Size depends on the card's paper.** One graph unit is one square of the card's background grid (32px, or 56px on a desktop in the Graphs chapter). How many squares go across depends on the card's width (`useMostAcross`), and `balanced` makes the graph as tall as it is wide. So a graph's height is set by width and paper, not by the room on the screen. The lesson screen then shrinks the paper to make it fit (`lessonFrame.ts`), which is why graphs come out at different sizes from screen to screen.
2. **The graph follows the paper, and that caused a live crash.** `useGridAlignment` nudges the graph onto the paper's lines. When the card scrolled, the nudge changed the content's height, which moved the scroll, which needed a new nudge: React stopped with "Maximum update depth exceeded" and the lesson went blank (fixed in #172 by making the paper scroll with the content). The dependency is still fragile.
3. **Working is drawn inside the graph.** A step's heading and readings ("y = 2x + 3: m = 2", "Parallel: every m is 2") are drawn by `GraphVisual` itself, so graph worked examples don't use the working window (`<Working>`, #173). They don't roll, and the graph plus its lines overflow a laptop on 54% of screens.
4. **Tables are placed ad hoc**: above, below or inside the picture depending on the lesson.
5. **Five boards repeat the same groundwork** (grid, axes, pointer-to-grid maths) with small differences.

## 3. Target design

**One rule: the graph is given a box and fills it.** It no longer asks the paper how big to be.

1. **`layoutGraph(frame, box)`**: a pure function. From the graph's ranges and the slot's width and height it returns the unit size, the origin, the ticks and where labels fit. Square slot, same number of squares across as up (keep `balanced`'s look), and `unit = min(width / across, height / up)`. It is testable without a browser.
2. **`GraphCanvas`**: one SVG renderer with a `viewBox` in graph units, drawing the grid itself. It draws axes, points, lines, curves and labels from the layout. It replaces the drawing half of `GraphVisual`.
3. **The paper follows the graph, not the other way round.** Do what geometry already does: the graph marks one of its squares and the card's paper lines up with it (`cardPaper.ts`). That keeps "the graph sits on the page's own squared paper" (Sunny, 5 Oct) without the feedback loop.
4. **Working leaves the picture.** Headings, readings and answers are wrapped in `<Working>` and roll in the working window like every other worked example. The graph is the pinned diagram.
5. **Tables have one home:**
   - in a worked example, a table being filled in is working, so it rolls;
   - in a question, the table the student reads from sits with the graph in the diagram slot (beside it in the wide layout, above it otherwise).
6. **Boards become layers on `GraphCanvas`**: drag a point, draw a line, tilt a line, plot a curve, move along a journey. Pointer maths uses the SVG's own transform (`getScreenCTM().inverse()`), so it is right at any size and under any zoom.
7. **The slot comes from the layout framework** (LAYOUT-FRAMEWORK.md, Graphs): a square, as large as fits; the left half of the card in the wide layout.

## 4. Steps

Each step ships on its own, behind the same checks, so it can be rolled back alone.

| Step | Work | Done when |
|---|---|---|
| 1 | `layoutGraph` and `GraphCanvas` for picture-only graphs (no board), used by lesson 101's worked examples; paper lines up with the graph | 101 looks the same or better at all sizes; graph verify scripts pass |
| 2 | Working out of the picture: headings, readings and answers into `<Working>` for all graph worked examples | Graph worked examples roll; `roll.cjs` passes on 102–108 |
| 3 | Tables: one `ValueTable` placement rule (working when being filled in, slot when read from) | 102 and 106 tables in the agreed place |
| 4 | Boards as layers on `GraphCanvas`: GraphBoard first (used by all eight lessons), then Line, Tilt, Curve, Journey | Every board answers correctly at phone, laptop and desktop, including after a resize |
| 5 | Delete the old pieces: `useGridAlignment`, `useMostAcross`, the paper-shrinking path in `lessonFrame.ts` | No references left; frame and sweep checks pass |

**Checks for every step:** the graph verify scripts (`verify:graphs1:tutor` to `verify:graphs8:tutor`, e.g. `node scripts/verify-coordinates-tutor.cjs`), `scripts/ui/frame.cjs`, `roll.cjs`, `sweep.cjs graphs` at three sizes, and a look on a real phone. Target after step 5: Graphs inner scroll at most 10% of laptop screens (54% today) and 5% on desktop and phone.

## 5. Questions for Sunny

1. Keep graphs square (same squares across as up), or let a graph be wider than tall when its ranges are?
2. Should every graph in the chapter be the same size even when it has few squares (bigger squares), or keep squares one size so the grid is consistent?
3. Is it fine for the card's paper to line up with the graph (geometry's way), rather than the graph lining up with fixed paper?
4. In the wide layout: graph left and table under it, or table right with the working?
5. Science draws its own graphs (`src/features/science/components/*Graph*`). Bring those onto `GraphCanvas` later, or keep them separate?
