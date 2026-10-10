# Lesson screen layout framework

A layout framework for the Maths lesson screen, chapter by chapter. It sets where things go and how big they are. What they say and how a working reads stays in [`src/features/EXPLANATIONS.md`](../../src/features/EXPLANATIONS.md).

Status: **a proposal for Sunny to agree**. The anatomy and the definition of done describe what is live. The per-chapter diagram slots are the main change still to make. They answer "diagrams and graphs are not consistent in size and position" (Sunny, 10 Oct).

## 1. Why a framework

Today every diagram decides its own size, and the screen shrinks whatever doesn't fit (`lessonFrame.ts`). That keeps the page from scrolling, but the same chapter's diagrams come out at different sizes and heights from screen to screen. A student's eye has to find the picture again on every screen.

The fix is to turn it around. **Each chapter declares a diagram slot** (a box with a fixed position and a size band), and every diagram in that chapter is drawn to fill its slot. The fitting then picks one slot size per screen size, not one size per diagram.

## 2. Anatomy of the screen

The lesson page is always exactly one screen tall. From top to bottom:

| Zone | Size | Contents |
|---|---|---|
| Top bar | 60px, fixed | ✕ (back to Chapters), lesson name over section title, progress bar, Contents |
| Card | Fills the rest | Paper-grid card. Inside, in this order: **prompt**, **diagram slot**, **working window** or **answer zone**, **controls** |
| Bottom bar | 64px idle, fixed | The one main button (Check / Next step / Continue), Back as an icon. After an answer it becomes a result panel |

Inside the card:

| Card zone | Rule |
|---|---|
| Prompt (`h3`) | One line where possible. The question's own words; no instructions that repeat the bottom bar |
| Diagram slot | Directly under the prompt, centred, same place on every screen of a chapter. Never moves while a worked example steps |
| Working window (`.wc-roll`) | Teaching screens and "See the working". Lines roll up like film credits; the step on screen is always wholly visible |
| Answer zone | Question screens. Inputs or choices, then "Need a hint?" |
| Controls | ←, progress dots, "Again". Centred under the working |

When the card is short of room it gives way in this order: **working window** (never below the current step) → **diagram** (never below readable labels, 11px) → **card scrolls a little**. A card that scrolls shows a soft fade at its bottom edge.

## 3. The three kinds of screen

| Screen | Prompt | Diagram slot | Middle | Bottom bar |
|---|---|---|---|---|
| **Teaching** (worked example) | The step's instruction | The picture, fixed | Working window, rolling | "Show the first step" → "Next step" → "Continue" |
| **Question** | The question | The picture the student answers from: **it must stay big enough to answer from**, so it has priority over the answer zone | Answer zone | "Check" (disabled until answered) |
| **Feedback** (after Check) | Unchanged | Unchanged, with the student's answer marked | Answer zone, marked | Result panel: "Nice!" or "Not quite", the right answer, "See the working" link, "Continue" |

"See the working" is currently a fourth layout (a white panel inside the card with its own Next step button). How it should behave is the open question in [SEE-THE-WORKING.md](./SEE-THE-WORKING.md).

## 4. Screen sizes

| Name | Viewport tested | Card room (approx.) | Layout |
|---|---|---|---|
| Phone | 390 × 844 | 358 × 640 | One column |
| Small phone | 375 × 667 | 343 × 470 | One column; inner scroll accepted on long questions |
| Laptop | 1366 × 768 | 760 × 610 | One column today. Proposed: two columns (below) |
| Desktop | 1440 × 900 | 760 × 740 | One column today. Proposed: two columns |

**Proposed wide layout (≥ 1100px wide):** the card widens to about 1040px. On teaching and question screens with a diagram, the diagram slot moves to the left half and the working window or answer zone to the right half. This is the single biggest win for laptops, where most remaining inner scroll comes from a diagram and its working stacked in 610px of height. (Not built yet.)

**Answer choices:** two columns when the card is at least 600px wide and every choice is short (24 characters or fewer). Four full-width choices currently squeeze the diagram students need (e.g. lesson 212, the translation grid).

## 5. Chapter by chapter

Measured on 10 October with the UI sweep (`scripts/ui/sweep.cjs`: every lesson, about 18 screens each, at desktop, laptop and phone). "Inner scroll" is the share of screens whose card had to scroll inside. The Number, Algebra, Ratio and Graphs rows are from before #174, so they slightly overstate inner scroll.

| Chapter | Lessons | Inner scroll (desktop / laptop / phone) | Diagram shrunk on laptop | Worst |
|---|---|---|---|---|
| Number | 1–14 | 0% / 1% / 1% | 6% | Lesson 2 BIDMAS video (371px) |
| Algebra | 15–29 | 0% / 0% / 0% | 3% | none |
| Ratio and proportion | 30–34 | 0% / 12% / 1% | 20% | Ratio and percentages pictures with a long board |
| Graphs | 101–108 | 28% / 54% / 17% | paper shrunk on 85% | 103, 104, 105, 107 (up to 324px) |
| Geometry | 201–218 | 0% / 3% / 0% (after #174) | 32% | 206, 209, 210, 212 |

### Number (1–14)

- **Visuals:** method layouts (columns, bus stop, grid, long division), place-value charts, number lines and cut-offs, fraction bars, factor trees and lists, term tiles, video intro (lesson 2).
- **Diagram slot:** *method layouts are width-led*: digits sit in fixed columns (2.5rem) and must stay aligned, so they are never zoomed below 80%. Slot height up to 45% of the card on phones and 40% on laptops; a taller layout scrolls inside its slot rather than shrinking. Number lines and cut-offs: full card width, at most 140px tall.
- **Working:** lines under the picture, rolling (most workings use `<Working>`; lessons 4–12 still partly use the older step chain, see EXPLANATIONS.md "Rolling out").
- **Fix needed:** lesson 2's BIDMAS video player must size to the card (it overflows a laptop by up to 371px).

### Algebra (15–29)

- **Visuals:** mostly none. Equation boards, term tiles, grids for expanding/factorising, function machines, angle pictures for proofs.
- **Diagram slot:** small or absent. Tiles, grids and machines: up to 35% of the card. An equation board is working, not a diagram: it lives in the working window.
- **Working:** the board is the screen. The working window may take everything below the prompt.
- **State:** already fits everywhere. Keep it as the reference for "text-led" screens.

### Ratio and proportion (30–34)

- **Visuals:** ratio bars, proportion rows, hundred squares, growth bars, each above an equation board. `steadyPictures`: the picture fills the card's width and keeps one size through a worked example.
- **Diagram slot:** one fixed height for the whole chapter: 30% of the card (phone and laptop), centred, full width. Today the picture shrinks per screen (20% of laptop screens), which is the "not consistent" effect.
- **Working:** the board rolls under the picture.
- **Wide layout:** the strongest candidate for diagram left, board right.

### Graphs (101–108)

- **Visuals:** axes on squared paper, plotted points, lines and curves, tables of values, interactive boards (drag a point, draw a line, tilt a line, journeys).
- **Diagram slot:** a square, the largest that fits the slot: phone up to the card's width; laptop and desktop up to 50% of the card's height in one column, or the full left half in the wide layout. Every graph in the chapter is drawn to that square, so they are all the same size (the squares per unit change, not the graph's size).
- **Working:** headings, readings ("y = 2x + 3: m = 2") and tables go in the working window, not inside the graph. Today they are drawn inside the graph picture, which is why graph screens don't roll and overflow most.
- **Fix needed:** the rebuild in [GRAPHS-REFACTOR.md](./GRAPHS-REFACTOR.md).

### Geometry (201–218)

- **Visuals:** angle diagrams, shapes and polygons, circles and sectors, transformations on squares (the card's paper lines up with them, `cardPaper.ts`), 3D solids, plans and elevations, loci, bearings; interactive angle and measuring boards.
- **Diagram slot:** fixed per chapter: 40% of the card's height (phone and laptop), centred. Shapes are scaled to fit the slot (contain), so a small triangle and a big polygon both fill it. Interactive boards keep their size (their touch maths assumes it).
- **Questions:** the diagram has priority over the answer choices; use two-column choices on wide cards.
- **Working:** rolls under the diagram.

## 6. Definition of done for a lesson screen

A lesson screen (or a change to one) is done when, at phone (390×844), laptop (1366×768) and desktop (1440×900):

1. **The page never scrolls**; the top bar and bottom bar stay put (`frame.cjs`: 0 problems).
2. **No page errors** in the browser console while stepping through the lesson.
3. **No line of the current step is hidden** in a worked example: its start and its newest line are in view (`roll.cjs`: 0 hidden).
4. **Inner scroll within budget**: at most 5% of a chapter's screens on desktop and phone, and 10% on laptop (Graphs: a target for after the rebuild).
5. **Text at least 11px** on screen, including diagram labels after any fitting.
6. **Tap targets at least 44 × 44px** for everything a student presses (see KNOWN-ISSUES.md for the three below that today).
7. **Nothing clipped sideways**; nothing wider than the card.
8. **The diagram stays still** while a worked example steps (moves at most a couple of pixels).
9. **Same chapter, same slot**: diagrams in a chapter sit in the same place at the same size (once the slots are built).
10. **Reduced motion** respected: the roll jumps instead of gliding.
11. **Checked on a real iPhone and Android phone** for anything that changes layout (DEVICE-CHECKLIST.md).

## 7. Decisions needed

1. Agree the slot sizes per chapter (section 5), especially Ratio's fixed 30% and Geometry's 40%.
2. Agree the wide layout (diagram left, working right) for laptops and desktops.
3. Agree two-column answer choices and their 24-character limit.
4. Whether method layouts in Number may scroll inside their slot rather than shrink.
5. Whether Science follows the same framework.
