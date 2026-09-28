# Step chain

Worked steps as one chain of working: each line is the line above, transformed. Preview: `/preview/steps`.

## Writing a worked example

```ts
const steps: ChainStep[] = [
  { line: '[[a:3x]] [[b:+ 5]] = [[c:20]]' },
  { line: '[[a:3x]] [[b:+ 5]] [[m:- 5]] = [[c:20]] [[n:- 5]]', op: '− 5 from both sides', why: '…' },
  { line: '[[a:3x]] = [[r:15]]', op: 'Simplify', merge: { r: ['c', 'n'] } },
]
<StepChain steps={steps} revealed={revealed} />
```

- `line` is LaTeX. Wrap each term that moves in `[[key:latex]]`. The same key on the next line is where it flies to.
- `op` is how this line came from the one above, in two to four words. `why` explains the reasoning in one or two plain sentences (why this move, not just what it is). It opens by itself with its step; earlier steps fold theirs behind the ⓘ next to `op`.
- `merge` names a result and the terms above that combine into it (20 and − 5 become 15). Those terms fly into the result and fade.
- A key that appears for the first time is the operation and is coloured to match `op`.
- A key that disappears without being merged is crossed out in red on the line above (`strikes.ts`: neighbouring terms share one stroke, drawn once as the step plays). Terms that merge glow yellow, like their result.
- Lines split on the first ` = ` so equals signs line up. When the first line has no ` = ` (simplifying an expression: `18/24`, `= 3/4`), each line is centred as a whole instead.
- For digits moving between place-value columns, pass `layout={{ kind: 'columns', columns: ['H', 'T', 'U', '.', 't'] }}` and split each line into cells with `|`.

## Controls

Worked steps are paced by the student, so the controls work in steps, not seconds:

- **Next step / ←** in the bottom bar move one line on or back. Going back removes lines without animation.
- **Dots** (`<StepDots onSelect>`) jump to any step. Jumping forward animates only the last line.
- **Tap an operation** to replay that step. The ⓘ next to it opens the `why`.
- **Slower animations** (`useStepPace()`, saved on the device) passes `pace={1.6}`, which stretches every movement.

A play/pause/speed/scrubber player only makes sense once a worked example has narration to follow.

## Rules

One thing moves per step. Show the same operation on both sides rather than moving a term across the equals sign. The last line is the answer, shown once. Reduced motion (system setting or the `reduceMotion` prop) shows each line straight away.

`flip.ts` does the movement and works on any layout whose terms carry `data-k`, so new layouts (column addition, bus stop division) can reuse it.
