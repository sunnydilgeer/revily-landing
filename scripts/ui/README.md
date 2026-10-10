# Lesson screen browser checks

Playwright checks for the fixed lesson screen. Run them against a **production build**, before pushing anything that changes the lesson screen. What "pass" means, and why, is in [`docs/lesson-screen/`](../../docs/lesson-screen/README.md).

```bash
npm run build && npx next start -p 3123 &            # the app under test
export PREVIEW_PASSWORD=…                            # the /preview password (not stored in the repo)
node scripts/ui/frame.cjs                            # the page never scrolls, bars fixed, no page errors   → "problems: 0"
node scripts/ui/roll.cjs                             # worked examples: no line of a step hidden            → "start hidden: 0, newest line hidden: 0"
mkdir -p ui-results
for s in desktop laptop phone; do node scripts/ui/sweep.cjs graphs $s > ui-results/graphs-$s.jsonl; done
python3 scripts/ui/summarise.py ui-results/*.jsonl  # compare with the budgets in docs/lesson-screen/LAYOUT-FRAMEWORK.md §6
```

| Setting | Default | |
|---|---|---|
| `BASE` | `http://localhost:3123` | The app to test |
| `PREVIEW_PASSWORD` | (required) | The `/preview` password |
| `CHROMIUM_PATH` | Playwright's own | A Chromium to launch, e.g. `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` in a Claude cloud session |
| `OUT` | `ui-results/` | Screenshots of anything that fails |
| `ONLY` | all four | Screen sizes for `frame.cjs`, e.g. `phone,laptop` (all four take about 40 minutes) |
| `LESSONS` | `27,19,30,32,8,22,25` | Lessons for `roll.cjs` |
| `SCREENS` | `18` | Screens per lesson for `sweep.cjs` |

Playwright is not a project dependency; `lib.cjs` uses one if installed (`npm i -D playwright`, or the copy a Claude cloud session already has). A full sweep (three groups × three sizes) takes about 40 minutes; run sizes in parallel to save time.
