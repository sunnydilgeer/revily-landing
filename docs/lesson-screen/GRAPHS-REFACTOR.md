# Graphs: one fixed graph on the page's squares

How graphs are laid out in the Graphs chapter (lessons 101–108) since the rebuild of 12 October. Sunny's brief: every
lesson is drawn on squared paper, so a graph must not add a second grid on top of it; and a graph is "a medium size
fixed positioned graph" that looks the same in a worked example, in each step of it, and in the working after a wrong
answer, never resizing.

## 1. The rule

**Every graph is 11 squares across and 11 up, drawn on the card's own squared paper, in the same place on every screen.**

- **Size.** The paper's square on a Graphs card (`--graph-square`) is worked out from the screen's size alone
  (`wideLayout` and `narrowSquare` in `GraphSlot.tsx`), never from what is on the card. On a phone it is the card's
  width over 11 (26–28px, a graph of about 290–310px). On a laptop or desktop it is as tall as the screen allows, up to
  60px (a 518px graph at 1366×768, 660px at 1920×1080). It only changes when the window does.
- **Place.** Laptop and desktop (900px and wider): the card is a whole number of squares across (Sunny, 14 Oct: no
  empty half card, even margins): a square of margin each side, the graph on the left, a square's gap, and 10 to 12
  squares of words. The lesson screen's bars take the card's width. Spare height is split evenly above and below the
  graph and the words, which start level with the graph's top. Phone: the graph at the top of the card, the question
  and the working under it, so a long question never pushes the graph down. A screen with no graph (a question in
  words only) gives the card to the words.
- **No second grid.** The graph draws no grid of its own: its axes, points and lines sit on the paper's lines. The
  card's paper is lined up under the graph (`useGraphCard`), which only paints the background and never moves anything.
- **11 squares.** A lesson's grid (6 to 11 squares) is widened to 11 by `fillGrid` (`GraphPictures.tsx`): an axis that
  starts at 0 grows at its far end, one either side of 0 grows at both ends. A grid whose points are too far apart for 11
  squares counts its y axis in 2s or 5s instead (`yStep`; lesson 103's equations from two points, `gridFor`).

## 2. How it is built

| Piece | File | What it does |
|---|---|---|
| The card | `TutorMethodLessonView.tsx` (`graphCard` on the lesson) | A Graphs card has three parts: the title, the graph slot and the words column (`rung-card--graph`) |
| The slot | `GraphSlot.tsx` (`GraphSlot`, `InGraphSlot`, `GraphWords`) | Whatever draws a graph on the card hands its grid to the one slot. The newest claim is shown: the working after an answer takes the slot from the question's board and gives it back when it closes. Words that go with a graph (headings, tables, readings) go back to the words column |
| The square | `GraphSlot.tsx` (`useGraphCard`, `wideLayout`, `narrowSquare`) | Sets `--graph-square` and `--rv-graph-scale` on the card, its padding and `--graph-card-width` on a wide screen, and lines its paper up under the slot |
| The picture | `GraphPictures.tsx` (`GraphVisual`, `fillGrid`, `usePaper`) | Draws axes, numbers, points, lines and curves at the card's square. Off a Graphs card it finds its own paper as before |
| Boards | `GraphBoard.tsx`, `LineBoard.tsx`, `TiltBoard.tsx`, `CurveBoard.tsx`, `JourneyBoard.tsx`, `EquationBoard.tsx` | Draw their surface in the slot; their notes and buttons stay in the words column. Taps are read at the square drawn (`squareOf`) |
| Layout | `src/features/graphs/graphs.css` | The card's grid, the slot's box, the words column (scrolls inside itself when it is more than the room) |
| Lesson screen | `src/features/maths/lessonFrame.ts` | Leaves a Graphs card alone: nothing on it is zoomed or shrunk |

A worked example's out-of-sight rehearsal (`WorkedChain.tsx`) draws its graphs in place, never in the slot.

## 3. Still open

1. "See the working" is still stepped with its own small buttons in the words column. Driving it from the bottom bar
   is the wider decision in [SEE-THE-WORKING.md](./SEE-THE-WORKING.md), for every lesson.
2. Practice and boss fights draw graphs where they stand, outside the fixed lesson screen, as before.
3. Science draws its own graphs (`src/features/science/components/*Graph*`) and is not affected.

## 4. Checks

The graph verify scripts (`npm run verify:graphs1:tutor` to `verify:graphs8:tutor`), the lesson-screen checks in
[`scripts/ui/`](../../scripts/ui/README.md), and a walk through every section of 101–108 at phone (360, 375 and 390
wide), laptop (1366×768) and desktop (1440×900) sizes: the graph's box must be the same on every screen at a size, with
no second grid, the paper's lines under the graph's axes, and no change of size within a screen.
