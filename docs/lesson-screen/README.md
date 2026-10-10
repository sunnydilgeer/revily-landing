# The lesson screen: handoff

Where the Maths lesson page stands after the work of 10 October 2026, how it is built, how to check it and how to roll it back. Start here before changing anything on the lesson screen.

| Doc | What it is for |
|---|---|
| [LAYOUT-FRAMEWORK.md](./LAYOUT-FRAMEWORK.md) | The screen's anatomy, the three kinds of screen, chapter-by-chapter layout rules and the definition of done |
| [GRAPHS-REFACTOR.md](./GRAPHS-REFACTOR.md) | The plan for rebuilding the graph components |
| [SEE-THE-WORKING.md](./SEE-THE-WORKING.md) | Options for making "See the working" match worked examples (decision pending) |
| [KNOWN-ISSUES.md](./KNOWN-ISSUES.md) | Everything found and not yet fixed |
| [DEVICE-CHECKLIST.md](./DEVICE-CHECKLIST.md) | What to check on a real iPhone and Android phone |

These sit alongside the existing guides: [`src/features/LESSON_DESIGN.md`](../../src/features/LESSON_DESIGN.md) (teaching sequence) and [`src/features/EXPLANATIONS.md`](../../src/features/EXPLANATIONS.md) (how a working looks and reads). Those two still decide what goes on the screen. These docs decide where it goes and how big it is.

## What shipped on 10 October

| PR | What changed |
|---|---|
| #166 | One slim top bar (✕, section title and progress, Contents) instead of breadcrumbs plus a header. One main button that steps through a worked example ("Show the first step" → "Next step") and then becomes Continue. |
| #167 | The lesson page is one fixed screen (`100dvh`). The page never scrolls; only the card scrolls inside, and only when it must. The phone keyboard shrinks the screen instead of covering it. |
| #172 | Diagrams fit the room (graphs shrink with their squared paper, other pictures by CSS `zoom`). Tighter bottom bar (64px, Back as an icon, "See the working" as a link). No scrollbar in the card. **Fixed a live crash**: the Graphs lesson went blank on desktop (an endless re-alignment of a graph to its paper as the card scrolled). |
| #173 | One layout for every worked example: a fixed diagram, then a working window that rolls like film credits, then small controls. Seven renderers hand their working to the window through `<Working>`. The "Show N earlier steps" fold was replaced by the roll. |
| #174 | The roll brings each step's start into view and sizes itself to the whole step (no more missed lines). Diagram labels never shrink below 11px. |

## How it is built

| Piece | File | What it does |
|---|---|---|
| Top bar | `src/App.tsx`, `src/features/graphs/GraphsShelf.tsx`, `src/features/geometry/GeometryShelf.tsx` | `header.lesson-bar` with a slot the section header draws into (`LessonBarSlot`, `src/features/maths/rungs.tsx`) |
| Fixed screen | `src/features/maths/MathsNavigation.css` (`.app-shell--frame`) | One screen tall, flex column, card in the middle, bottom bar at the foot |
| Fitting | `src/features/maths/lessonFrame.ts` | Per card: size the working window, then shrink the diagram (graph paper or `zoom`, down to readable labels), then let the card scroll. Marks `data-more` for the fade. Keeps the answer box above the phone keyboard. |
| One main button | `src/features/maths/step-chain/stepDriver.ts`, `rungs.tsx` (`DriveSteps`, `flow.advance`) | A teaching screen's worked example hands "Next step" to the bottom bar |
| Worked example layout and roll | `src/features/maths/step-chain/WorkedChain.tsx`, `WorkedChain.css` | Diagram (`.wc-picture`), working window (`.wc-roll`), controls. Rolls to the step's start (`stepTop`), reports how tall the step is (`stepNeed`). |
| Working hand-off | `src/features/maths/step-chain/working.tsx` | `<Working>` sends a step's heading, lines and answer into the window (a portal); outside a worked example it draws in place |
| Bottom bar | `src/ui/index.tsx` (`CheckBar`), lesson views, `MathsNavigation.css` | Idle bar 64px; result panels keep one row of actions |

The order a card gives way when it is short of room: **working window → diagram → card scroll.** The working window never goes below what the current step needs, so no line of the step is hidden. Diagram labels never go below 11px. Graphs never use `zoom`; their paper shrinks instead (60% of normal at the smallest).

## Rolling back

Pinned branches (do not push to them):

| Branch | Commit | State |
|---|---|---|
| `known-good-2026-10-10` | `610c401` | After #173, before the missed-lines fix |
| `known-good-2026-10-10-pm` | `6423c4b` | After #174: the state at the end of 10 October |

Fastest first:

1. **Vercel instant rollback** (seconds, no code). Vercel → *revily* → Deployments → pick the deployment to return to → ⋯ → *Instant Rollback* / *Promote to Production*. Afterwards Vercel stops auto-promoting new `main` deploys until one is promoted again.
2. **Revert one PR.** A PR with `git revert -m 1 <merge commit>`. History is kept and nothing is force-pushed.
3. **Restore a known-good branch.** A PR whose tree is the branch's (`git checkout known-good-2026-10-10-pm -- .`, commit). This also undoes anything merged since, from any session, so list what will be lost first.

Merge commits: #166 `e688eb0`, #167 `d53198f`, #172 `6d9cc08`, #173 `610c401`, #174 `6423c4b`.

## Checking a change

Before any push: `npx tsc --noEmit -p .`, `npm run build`, `node scripts/verify-maths-navigation.cjs`, `node scripts/verify-practice.cjs`, `npm run test:science`. Six lesson verify scripts already fail on `main` (see KNOWN-ISSUES.md); everything else under `npm run verify:*` should pass, and `scripts/verify-figure-lessons.cjs` takes a lesson number (205–218).

For anything that changes the lesson screen, also run the browser checks in [`scripts/ui/`](../../scripts/ui/README.md) against a production build (`npm run build && npx next start -p 3123`):

| Script | Checks | Pass |
|---|---|---|
| `frame.cjs` | 9 lessons × 4 screen sizes × 14 screens: the page never scrolls, the bars stay put, no page errors | 0 problems |
| `roll.cjs` | Long worked examples step by step: the step's start and its newest line are both in view | 0 hidden |
| `sweep.cjs` + `summarise.py` | Every lesson in a group (numbers, graphs, diagrams) at desktop, laptop and phone: inner scroll, clipped content, small text, small tap targets, the roll | Compare with the budgets in LAYOUT-FRAMEWORK.md |

## Open decisions

1. How "See the working" after an answer should behave (SEE-THE-WORKING.md).
2. The layout framework's per-chapter diagram slots (LAYOUT-FRAMEWORK.md, "Decisions needed").
3. The graph rebuild's look (GRAPHS-REFACTOR.md, "Questions for Sunny").
4. Whether Science moves onto the fixed lesson screen, so both subjects feel the same.
