# Lesson 6 — Decimals QA

## Content and learning flow

- All four operations have a learner-controlled worked example followed by a misconception check and four practice questions.
- Addition and subtraction align decimal points and introduce trailing zeroes without changing value.
- Multiplication says “calculate the digits as a whole-number multiplication first”; it never says decimal points can be ignored generally.
- Division applies the same scale to dividend and divisor, and explicitly supplies two-digit divisor support inside Lesson 6 rather than attributing it to Lesson 4.
- Final retrieval checks addition and subtraction; transfer uses measurement and equal grouping.

## Interaction

- Play, Pause, Replay, Previous, Next and all progress dots work with keyboard and pointer.
- Rewinding reconstructs an earlier stage and hides later working.
- Continue is hidden until the final worked-example stage is reached.
- Numeric answers accept equivalent decimal forms and valid comma/space grouping through `normalisedNumber`.
- Misconception choices return targeted feedback.
- Back, restart, Enter-to-submit and disabled submit states work.

## Responsive and accessible behavior

- At 320px, calculation rows scroll inside their card rather than overflowing the page.
- Player controls become a two-column layout with Play/Pause first.
- Lesson journey remains horizontally scrollable and labelled.
- Worked-example progress uses progressbar semantics; dots and player controls have accessible labels.
- Stage narration is announced politely and mathematical work has an equivalent figcaption.
- Focus moves to each new state heading.
- Reduced motion removes stage, decimal-point and progress transitions.

## Regression

- `npx tsc --noEmit` passes.
- `npm run build` passes.
- Lessons 1–5 still load from the selector.
- Lesson 6 is selected by default and available from the selector.
