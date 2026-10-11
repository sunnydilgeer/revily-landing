# Handoff: where Revily Maths stands (11 October 2026)

For the next Claude session (and anyone else) picking up this work. Read this first, then `docs/lesson-screen/README.md`.

## The product

Revily: a Duolingo-style app for **GCSE Foundation Maths** (AQA), at `/preview` (password: ask Sunny; it is `PREVIEW_PASSWORD` in Vercel). Next.js 15. As of 11 October all of GCSE Foundation Maths is implemented: about 80 lessons in six areas.

| Area | Lessons | Where |
|---|---|---|
| Number | 1–14 | `src/features/maths/courseRegistry.ts` |
| Algebra | 15–29 | same |
| Ratio and proportion | 30–34 (**6 more to add**, see backlog) | same |
| Graphs | 101–108 | `src/features/graphs/` |
| Geometry | 201–221 | `src/features/geometry/` |
| Probability and statistics | 301–318 | `src/features/probability/` |

## How Sunny likes to work

- **Audit first, then propose fixes ranked by impact, then wait for a go-ahead** before changing anything (unless told to just do it).
- When talking implementation: **at most two detailed steps**, everything else as bullets.
- Once a change is approved, **merge and deploy it yourself**: open a PR, wait for the Vercel preview to pass, merge, confirm the production deploy. Sunny has authorised this.
- Plain English, short summaries, screenshots for anything visual.

## Shipping a change

1. Checks: `npx tsc --noEmit -p .`, `npm run build`, `node scripts/verify-maths-navigation.cjs`, `node scripts/verify-practice.cjs`, `npm run test:science`. For lesson-screen changes also `scripts/ui/` (`frame.cjs`, `roll.cjs`, `sweep.cjs`; see `scripts/ui/README.md`).
2. PR to `main`, with the repo's attribution lines.
3. Vercel status: `curl -s https://api.github.com/repos/sunnydilgeer/revily-landing/commits/<sha>/status`. If it stays "pending" for a long time, check the Vercel bot's comment on the PR: it can say "Ready" while the GitHub status is stuck.
4. Merge, then check the merge commit's status the same way for the production deploy.

Gotchas from 10–11 October:
- `npm run build` takes about 10 minutes here; run it in the background.
- `pkill -f "next start"` kills your own shell (the pattern matches its own command line). Find the server by its process and kill the PID, or run the kill from a script file.
- `ss` isn't installed; use `ps -eo pid,args`.
- The git proxy refuses tag pushes; pin a point with a branch through the GitHub tools instead.
- Six lesson verify scripts already fail on `main` (`Cannot find module …RatioPictures`); `verify-figure-lessons.cjs` needs a lesson number.

## Rolling back

Pinned branches: `known-good-2026-10-10` (`610c401`) and `known-good-2026-10-10-pm` (`6423c4b`, end of 10 Oct). Fastest: Vercel → Deployments → Instant Rollback. Details in `docs/lesson-screen/README.md`.

## Backlog (agreed 11 October, in this order)

1. **Curriculum review** (research and writing, no code):
   - *Content:* map all ~80 lessons to the AQA Foundation specification: gaps, overlaps, Higher-only content, order, accuracy. Deliver a coverage table for Sunny to sign off. It also pins down the six missing Ratio lessons.
   - *Screens:* run the UI sweep across all six areas. Probability and statistics (301–318) and Geometry 219–221 have never been swept. `scripts/ui/sweep.cjs` needs those lesson ranges and the probability shelf URL (`/preview/probability-1df7422723d4`) added to its groups.
2. **Ratio and proportion: add the remaining 6 lessons** (lessons 6–11 of Sunny's book). Get the book's list from Sunny first. Likely candidates from the AQA spec: compound units (speed, density, pressure); converting units; scale drawings and maps; best buys and rates; proportion graphs; rates of change.
3. **Perfect the lesson pages:**
   - Agree, then build, the per-chapter diagram slots (`docs/lesson-screen/LAYOUT-FRAMEWORK.md`, a proposal with decisions listed).
   - Then the specific lessons the sweep flags.
   - Includes the graph rebuild (`docs/lesson-screen/GRAPHS-REFACTOR.md`).
4. **Revision cards:** decks exist only for Number, Algebra and Ratio. `CARD_CHAPTERS` in `src/features/cards/decks.ts`; key facts in `keyFacts.ts`. Extend to Graphs, Geometry, Probability and statistics, and the new Ratio lessons.
5. **Practice module:** the question bank (`src/features/maths/practice/bank/`, 21 topic files) covers Number, Algebra and Ratio only. Add Graphs, Geometry, Probability and statistics. Agree what "complete" means first (spec coverage, AQA weighting in `aqaWeights.ts`, timed papers?).
6. **Carried over:**
   - The "See the working" decision (`docs/lesson-screen/SEE-THE-WORKING.md`).
   - The real-device checks (`docs/lesson-screen/DEVICE-CHECKLIST.md`).
   - The rest of `docs/lesson-screen/KNOWN-ISSUES.md`. Issue 17 is done: the hard-coded preview password fallback was removed on 11 October.

## Where the lesson screen work is documented

`docs/lesson-screen/`: README (what shipped on 10 Oct and how it is built), LAYOUT-FRAMEWORK, GRAPHS-REFACTOR, SEE-THE-WORKING, KNOWN-ISSUES, DEVICE-CHECKLIST. How explanations read: `src/features/EXPLANATIONS.md`. Teaching sequence: `src/features/LESSON_DESIGN.md`.
