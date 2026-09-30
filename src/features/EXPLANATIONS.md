# Revily explanations — style guide

How every worked example and "See the working" explanation looks and reads. Agreed with Sunny on 28 Sep 2026, on the Collecting like terms lesson (A1). That working is the reference: `src/features/like-terms/tutor/` and `NumberSenseWorkedExample.tsx` (`PictureStep`, `TermsVisual`). Standard form (lesson 14) and Bounds (13) follow it too, with the hop picture, tiles, the number line and the cut-off.

The aim is minimal: a student should see the maths once, one step at a time, with nothing to read unless they ask.

## The rules

1. **Show the problem once.** The picture (tiles, columns, number line…) is the maths. Don't write the same expression again as a line of working, in the heading or in the explanation.
   - The heading says only the instruction ("Simplify") when the picture shows the expression. Screen readers still get the full question (`content.heading`).
   - Practice questions keep their full wording, because there's no picture until they answer.
2. **The picture starts before step 1.** The opening screen shows the problem plain (grey tiles, the number before any hops). Step 1 adds meaning to it (colours, empty places).
3. **One heading at a time.** Only the current step's heading shows. Earlier headings disappear; their maths stays (value cards from an earlier step stay above the current one).
4. **A step's heading sits directly above the maths it adds.** Sort → above the tiles. Collect → above the sums. Answer → above the answer. Reading top to bottom is the order of the working.
5. **Explanations are hidden until asked for.** Each heading has an ⓘ; the explanation box opens under that step's maths only when tapped, and each new step starts closed.
6. **Explanations are words, not maths.** The picture already shows every sum, so the box says what to do and why: "Add the p terms, then the numbers." Never repeat the calculation ("3p + 2p = 5p") or the answer.
7. **Short step headings, no decoration.** Two to four words ("Sort the terms", "Collect each family", "Write the answer"). No arrows or numbering. The last step reads as the answer ("The answer", not "Read the number"), so it doesn't sound like more work. **Never repeat the answer:** when the last move already gets there (solving an equation: the move that leaves x on its own), that move's result is the answer, drawn in the green answer box, and the working stops. No extra "The answer" step, check line or restated result (Sunny, 30 Sep 2026, on x − 7 = 12). A heading may carry a small grey reminder of what it refers to (`tag`, e.g. "Read the power × 10³").
8. **One type size.** Step headings and lines of working use the question's size (`--ns-problem-size`: 21px on phones, up to 25px). Only the picture itself and the final answer are bigger.
9. **App font only.** No serif maths lines (KaTeX) under a picture. Maths inside the working uses the body font, coloured to match its picture. Powers are drawn as raised digits (`Powers.tsx`), because the app font's ¹ ² ³ are much smaller than the ⁴–⁹ it borrows from another font.
10. **Controls in the middle.** ←, the progress dots and Next step sit together, centred under the working.
11. **Phone first.** Everything fits 320px wide with no sideways scroll; a long heading wraps as one centred phrase with ⓘ after its last word.

## Colour

Like things share a colour across the tiles, the sums and the answer (`is-f0`…`is-f3`: biro blue, amber, green, purple). Plain ink means "not sorted yet". Green and red are kept for marking right and wrong.

- A calculation with parts of different kinds opens with the question as tiles, one colour per kind, as in collecting like terms. Standard form × and ÷: numbers in front are amber, powers of 10 are blue; the first step sorts them, then each kind is worked out on its own line under its own heading.
- The digit a step is about is marked in its picture (writing a number in standard form: the first non-zero digit, before the point moves).

## Building one

- A working whose every step has a picture uses `WorkedChain` with `pictureOnly`. The picture draws the step heading (`PictureStep`) and the chain isn't drawn. `NumberSenseWorkedExample` decides which workings qualify: `collect`, `standard-form` when every step has a hop, tiles or value cards, and any example marked `pictureOnly: true` (Bounds).
- For a number line or cut-off picture, build the working as lines under it (`sums`: "0.1 ÷ 2 → 0.05", one more per step, coloured by family). `LinesStep` keeps the picture and earlier lines, and puts each heading above what its step adds: new lines, the answer, value cards, or the picture itself.
- Each `MethodStep` still carries its `equation` (checked by `verify:step-chains`) and its `instruction` (the ⓘ text).
- Check the whole working in a browser at desktop width and at 320px: the opening screen, every step with ⓘ closed and open, and the "See the working" version after answering.

## Rolling out

Done: Collecting like terms (A1), Standard form (14), Bounds (13), Powers and roots (A2: powers written out as copies, area squares and lines of working, in `PowerPictures.tsx`), Expanding brackets (A3: the grid method, `GridPictures.tsx`), Factorising (A4: the same grid backwards: the shared parts boxed, then crossed out of each term, and the answer built from labelled coloured pieces), Solving equations (A5: a board with two sides, `EquationPictures.tsx`, one move a step, what cancels struck out). Lessons 4–12 still use the older step chain (serif lines, every heading stacked, explanations open). Convert them one lesson at a time. Show Sunny one example in the Vercel preview first, then do the rest of that lesson.
