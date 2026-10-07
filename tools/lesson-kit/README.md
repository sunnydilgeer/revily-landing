# Lesson kit

Makes a lesson's **video** and **worksheet PDF** from one pack file, in the style of Aniksha's A-series videos and
worksheets. The A8.1 video on lesson 22 was made this way.

```bash
npm i --no-save playwright        # once per machine; not an app dependency. ffmpeg must be installed too.
node tools/lesson-kit/kit.cjs tools/lesson-kit/packs/A8.1-solving-quadratics.cjs          # video and PDF
node tools/lesson-kit/kit.cjs tools/lesson-kit/packs/A8.1-solving-quadratics.cjs video    # just the video
node tools/lesson-kit/kit.cjs tools/lesson-kit/packs/A8.1-solving-quadratics.cjs pdf      # just the PDF
npm run verify:lesson-kit         # every pack's checks, maths and marks, without a browser
```

Output goes to `tools/lesson-kit/out/<code>/` (not committed): the `.mp4`, the `.pdf`, `slides.png` (the last state of
every slide, to look over without playing the video) and the frames. A video that goes into a lesson is copied to
`public/media/lesson-N/` with an `.svg` poster, like any other.

## Making a new pack

Copy `packs/A8.1-solving-quadratics.cjs` and change it. A pack is a function that gets the helpers and returns:

- `code`, `topic`, `strand`, and `file` (the output name, e.g. `A12.1_Straight_Line_Graphs`).
- `checks`: every answer in the pack worked out again, as `{ 'what it checks': true/false }`. Brute force where you
  can (try every x from −100 to 100). The kit stops if any check is false.
- `video.slides`: each slide is a `hero` (big title, with `sub`) or a `title` (with an optional `stage`, such as
  "Step 2 · factorise", and `from`, the line carried over from the slide before). Its `items` appear one at a time:
  `[html, seconds]`, or `[html, seconds, n]` to replace item n, so a list can change in place.
- `video.recap`: the "Well done!" checklist, added as the last slide.
- `worksheet.title` and `worksheet.questions`: each has `n` ("1", "5a"), `level` (worked, easy, medium, hard,
  very hard: easiest first), `marks`, `question` (a string, or a list of paragraphs) and `working`: steps that are
  `{ say }` (teal words), `{ math }` (a line of maths), `{ picture }`, `{ mark }` (a method mark) or `{ answer }`
  (the final answer). A question can carry its own `figure` (an SVG, such as a grid), drawn under its words. The marks must equal the number of `mark` and `answer` steps.

Words take maths between `$…$` (`'take $20$ from both sides'`), `**bold**`, and ✓ and ✗, which are coloured.
The helpers for slides: `line`, `big`, `board` (a move written under both sides), `result` (a halfway result, blue),
`answer` (green, only for the answer), `row`, `stack`, `column`, `picture` (any SVG), `pill`, `m` (maths).

## What the kit checks

- Every maths string goes through KaTeX; one that can't be read stops the build and names it.
- Every state of every slide is measured: nothing may spill out of the card, either too tall or too wide.
- Worksheet levels run easiest first, and each question's marks match its working.
- The pack's own `checks`.

The explanation rules in `src/features/EXPLANATIONS.md` still apply: show where every number comes from, one move a
step, the move in the pale-yellow box, a halfway result never green, and our own numbers, never a textbook's or a
past paper's.

## Taking it to another project

The folder stands alone: copy `tools/lesson-kit/` and its `verify` script. It needs Node, `katex`, Playwright with a
Chromium (it finds `/opt/pw-browsers` in the cloud container, or set `CHROMIUM_PATH`) and ffmpeg. The fonts
(Poppins for videos, Lato for worksheets) are bundled with their open licences.
