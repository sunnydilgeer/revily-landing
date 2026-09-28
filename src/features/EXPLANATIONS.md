# Revily explanations — style guide

How every worked example and "See the working" explanation looks and reads. Agreed with Sunny on 28 Sep 2026, on the Collecting like terms lesson (A1). That working is the reference: `src/features/like-terms/tutor/` and `NumberSenseWorkedExample.tsx` (`CollectStep`, `TermsVisual`).

The aim is minimal: a student should see the maths once, one step at a time, with nothing to read unless they ask.

## The rules

1. **Show the problem once.** The picture (tiles, columns, number line…) is the maths. Don't write the same expression again as a line of working, in the heading or in the explanation.
   - The heading says only the instruction ("Simplify") when the picture shows the expression. Screen readers still get the full question (`content.heading`).
   - Practice questions keep their full wording, because there's no picture until they answer.
2. **The picture starts before step 1.** The opening screen shows the problem plain (grey tiles). Step 1 adds meaning to it (colours).
3. **One heading at a time.** Only the current step's heading shows. Earlier headings disappear; their maths stays.
4. **A step's heading sits directly above the maths it adds.** Sort → above the tiles. Collect → above the sums. Answer → above the answer. Reading top to bottom is the order of the working.
5. **Explanations are hidden until asked for.** Each heading has an ⓘ; the explanation box opens under that step's maths only when tapped, and each new step starts closed.
6. **Explanations are words, not maths.** The picture already shows every sum, so the box says what to do and why: "Add the p terms, then the numbers." Never repeat the calculation ("3p + 2p = 5p") or the answer.
7. **Short step headings, no decoration.** Two to four words ("Sort the terms", "Collect each family", "Write the answer"). No arrows or numbering.
8. **One type size.** Step headings and lines of working use the question's size (`--ns-problem-size`: 21px on phones, up to 25px). Only the picture itself and the final answer are bigger.
9. **App font only.** No serif maths lines (KaTeX) under a picture. Maths inside the working uses the body font, coloured to match its picture.
10. **Controls in the middle.** ←, the progress dots and Next step sit together, centred under the working.
11. **Phone first.** Everything fits 320px wide with no sideways scroll; a long heading wraps as one centred phrase with ⓘ after its last word.

## Colour

Like things share a colour across the tiles, the sums and the answer (`is-f0`…`is-f3`: biro blue, amber, green, purple). Plain ink means "not sorted yet". Green and red are kept for marking right and wrong.

## Building one

- A working whose picture shows every line uses `WorkedChain` with `pictureOnly`. The picture draws the step heading (`CollectStep`) and the chain isn't drawn.
- Each `MethodStep` still carries its `equation` (checked by `verify:step-chains`) and its `instruction` (the ⓘ text).
- Check the whole working in a browser at desktop width and at 320px: the opening screen, every step with ⓘ closed and open, and the "See the working" version after answering.

## Rolling out

Lessons 4–14 still use the older step chain (serif lines, every heading stacked, explanations open). Convert them one lesson at a time. Show Sunny one example in the Vercel preview first, then do the rest of that lesson.
