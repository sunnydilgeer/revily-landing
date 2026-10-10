# Known issues

Found and not yet fixed, as of 10 October 2026. Measured with `scripts/ui/` unless noted. Newest decisions live in the other docs here; this is the list to pick work from.

## Layout and fit

| # | Issue | Where | Size | Fix (see) |
|---|---|---|---|---|
| 1 | Diagrams and graphs are not consistent in size and position from screen to screen | All chapters with pictures, most visible in Ratio, Graphs and Geometry | | Per-chapter diagram slots (LAYOUT-FRAMEWORK.md §5) |
| 2 | Graph screens scroll inside the card | Graphs 101–108, worst 103, 104, 105, 107 | 54% of laptop screens (up to 324px), 28% desktop, 17% phone | Graph rebuild (GRAPHS-REFACTOR.md) |
| 3 | Graph worked examples don't roll: their headings and readings are drawn inside the graph | Graphs 101–108 | | GRAPHS-REFACTOR.md step 2 |
| 4 | The BIDMAS video player is taller than a laptop screen | Lesson 2, opening screen | Up to 371px over (316px on a phone) | Size the player to the card |
| 5 | Four full-width answer choices squeeze the diagram students answer from | Geometry questions, e.g. 212 (translation grid), 209 (sector) | | Two-column choices on wide cards (LAYOUT-FRAMEWORK.md §4) |
| 6 | A laptop still needs inner scroll on some screens | Ratio 30–33, Geometry 206, 209, 210, 212 | Ratio 12%, Geometry about 4% of laptop screens | Wide layout and fixed slots |
| 7 | Small phones (375×667) scroll inside the card on long questions and choice lists | Lessons 8, 30, 32 and geometry | | Accepted fallback for now; two-column choices help |
| 8 | Extra empty gap under the prompt on boards with no diagram ("Solve" in Simultaneous equations) | Lesson 27 and other equation-board workings | About 40px | Trim the hidden diagram area's spacing |

## Interaction and accessibility

| # | Issue | Where | Fix |
|---|---|---|---|
| 9 | Tap targets under 44px | ⓘ "Why?" (26px), worked example ← back (35px) and "Again" (35px) | Larger hit areas (padding or `::after`), visual size can stay |
| 10 | Place-value chart headers are 11px | Lesson 3 and charts in Number | 12px+ |
| 11 | "See the working" behaves differently from worked examples, in four ways | See SEE-THE-WORKING.md | Decision pending |

## Not checked yet

| # | Item | Why it matters |
|---|---|---|
| 12 | **Safari on iPhone and Chrome on Android** | All testing was in Chromium. CSS `zoom` (diagram fitting), `mask-image` (roll fades), `:has()`, `100dvh` and the keyboard behaviour can differ (DEVICE-CHECKLIST.md) |
| 13 | Screen readers through a worked example | The working moves into the window via a portal; the order read aloud should be checked |
| 14 | Science lessons | They don't use the fixed lesson screen, so the two subjects feel different |

## Housekeeping

| # | Item |
|---|---|
| 15 | Six lesson verify scripts fail on `main` with `Cannot find module …RatioPictures` (a `.tsx` import resolved from a `.cjs` script): `verify-equations-tutor`, `verify-expanding-tutor`, `verify-factorising-tutor`, `verify-indices-tutor`, `verify-like-terms-tutor`, `verify-rearranging-tutor`. They failed before 10 October. |
| 16 | `scripts/verify-figure-lessons.cjs` needs a lesson number (205–218), so `npm run verify:*` sweeps report it as failing when run bare. |
| 17 | The `/preview` password has a hard-coded fallback in `lib/previewLock.ts` (used when `PREVIEW_PASSWORD` isn't set). Set `PREVIEW_PASSWORD` in Vercel's environment variables and remove the fallback, so the password isn't in the source. |
