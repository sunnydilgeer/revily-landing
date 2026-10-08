import type { MethodChainStep } from './methodChain'
export type Carry = { place: number; value: number; row: 'ones' | 'tens' | 'sum' }
export type LongDivisionRow = { number: string; end: number; kind: 'subtract' | 'remainder' | 'bring-down' }
export type FactorSplit = { value: number; left: number; right: number }
export type NumberListFrame = {
  firstLabel: string; first: number[]
  secondLabel?: string; second?: number[]
  common?: number[]; hcf?: number; lcm?: number
}
export type VennFrame = {
  labels: [string, string]
  left: number[]; middle: number[]; right: number[]
  hcf?: number; lcm?: number
}
export type RoundingFrame = {
  original: string
  target: string
  kept: string
  decisionDigit: string
  remaining: string
  stage: 'identify' | 'decide' | 'result'
  roundsUp: boolean
  /** The decimal point sits between the kept digit and the decision digit, e.g. 3 | .12 */
  pointAfterKept?: boolean
  answer?: string
  /** Truncation: the digits after the cut are thrown away, not used to decide. */
  chop?: boolean
}
/** A number line for bounds: the stated value, its bounds, and the shaded error interval. */
export type IntervalFrame = {
  lower: string
  upper: string
  value: string
  /** 'lower' shows only the lower bound, for the step that works it out. */
  stage: 'value' | 'lower' | 'bounds' | 'interval'
  /** A value to test against the interval, e.g. "Could it be 2450?" */
  test?: string
}
/** Standard form: the decimal point hops one place at a time over a row of digits. */
export type HopFrame = {
  /** The digits in order, including any zeros filled in as the point moves. */
  cells: string[]
  /** Where the point starts and ends, counted as the number of cells in front of it. */
  start: number
  end: number
  /** Empty places that are filled with zeros as the point moves. */
  added?: number[]
  /** Zeros that fall away once the point has moved, e.g. the leading zeros of 0.000512. */
  dropped?: number[]
  stage: 'start' | 'hops' | 'result'
  answer?: string
  /** The first non-zero digit, marked while finding where the point should go (writing a number in standard form). */
  lead?: number
}
/** Collecting like terms: each term keeps its sign and is coloured by its family of like terms. */
export type TermsFrame = {
  /** Tiles; an `op` is a plain sign or bracket between tiles (standard form × and ÷). */
  terms: { text: string; family: number; op?: boolean }[]
  /** Each family added up: "4p + 2p" gives "6p". */
  groups?: { parts: string; total: string; family: number }[]
  /** The groups from this index on are the ones this step adds; the step's heading sits above them. */
  newFrom?: number
  answer?: string
}
export type OrderingFrame = {
  values?: string[]
  comparison?: string
  answer?: string
}
/**
 * Powers written out as copies (indices): each group is one power's copies, e.g. 3⁴ as four 3 tiles.
 * `over` stacks the first row above the second as a fraction, for division; `crossed` tiles cancel.
 */
export type TilesFrame = {
  /** `label` names a group ("2³"), shown under its tiles, or as the whole group when `folded`. */
  rows: { groups: { tiles: string[]; family: number; crossed?: number; label?: string }[] }[]
  over?: boolean
  /** Each group drawn as one block with its label ("2³ × 2³") before it is written out as copies. */
  folded?: boolean
  /** The plain opening picture is this text ("(2³)²") instead of the tiles. */
  opening?: string
  /** A short count under the tiles, e.g. "4 + 5 = 9 threes". */
  note?: string
  plain?: boolean
}
/** A square of small squares (area), with `shaded` rows × columns coloured in: (⅔)² or √49. */
export type SquaresFrame = { rows: number; cols: number; shaded: [number, number]; side?: string; label: string }
/**
 * Expanding brackets as a grid: the term outside (or each term of the first bracket) down the side, the terms
 * inside along the top, and each box the product of its row and column, coloured by its family of like terms.
 */
export type ExpandFrame = {
  grids: { side: string[]; top: string[]; cells?: { text: string; family?: number }[][] }[]
  /** Factorising runs the grid backwards: the boxes are given, and the side and top are found. The plain opening keeps the boxes. */
  given?: boolean
  /** Colour the side like the common factor (purple) and each top box like its column's term. */
  coloured?: boolean
}
/** A factorised answer built from its pieces: the common factor outside, and what is left of each term inside. */
export type BracketFrame = { outside: string; inside: { text: string; family: number; from: string }[] }
/**
 * Solving an equation on a board with two sides: each row is `left = right`, a note across both sides, or the answer
 * (the last row of the last move, drawn in a green box: the working ends there, with no separate answer step).
 * Each side is space-separated tokens: `~` in front strikes a token out (it cancels), `^` after it marks the move
 * done to both sides (purple), and `{top|bottom}` is a fraction. Letters are blue, numbers amber. See EquationPictures.tsx.
 */
/**
 * An inequality (lesson 25) uses the same board: `sign` replaces the = sign ("<", "≥", or "[>]" boxed in purple when it
 * flips), and a row with two signs has a `middle` part between them ("3 < 2x + 1 < 11"), each side worked on alike.
 */
/**
 * Simultaneous equations (lesson 27) put two equations on the board at once: each is a row with a `label` (① or ②) in
 * the gutter, and `given` says how many rows the question itself shows before the first move (1 when left out).
 */
export type EquationRow = { left: string; right: string; sign?: string; middle?: string; sign2?: string; label?: string } | { note: string; family?: number } | { answer: string }
export type EquationFrame = { rows: EquationRow[]; given?: number }
/**
 * An angle picture for geometric proof (lesson 28, A13.3), drawn above the board: a triangle drawn to its angles, the
 * same with the base carried on past the right corner (an exterior angle), a straight line with a line from it, or a
 * quadrilateral cut into two triangles. `labels` name the angles in order: triangle left, right, top (exterior: then the
 * outside angle); straight line: right, then left. A line through the top parallel to the base (`parallel`) makes two
 * new angles, `copies`, and `zig` draws the Z of alternate angles in purple. `boxed` labels are ringed in purple.
 * See AnglePictures.tsx.
 */
export type AngleFrame = {
  shape: 'triangle' | 'exterior' | 'line' | 'quad'
  /** Triangle: the two base angles in degrees (left, right), drawn to scale. Straight line: the angle on the right. */
  angles: number[]
  labels: string[]
  /** Which label colours (`is-f…`) each angle takes, in the same order. */
  families?: number[]
  /** Two equal sides (isosceles): a tick on each. */
  equal?: boolean
  parallel?: boolean
  copies?: [string | null, string | null]
  zig?: 'left' | 'right'
  boxed?: number[]
  /** A quadrilateral's diagonal, cutting it into two triangles. */
  split?: boolean
  /** The picture on the opening screen, before the first step changes it. */
  before?: Omit<AngleFrame, 'before'>
}
/**
 * A function machine (lesson 29, A14), drawn above the board: the word Input, one coloured box per operation and the word
 * Output, joined by arrows, with the numbers underneath (the input, the number after each box, the output; null
 * leaves a gap). `lit` rings the box being worked on in purple, and the number it makes.
 * Going backwards (`back`), `undo` names the opposite of each box under it. A box
 * written "?" is still to be found (creating a machine). `answer` is the number that answers the question, in green.
 * See MachinePictures.tsx.
 */
export type MachineFrame = {
  boxes: string[]
  values: (string | null)[]
  lit?: number
  back?: boolean
  undo?: (string | null)[]
  answer?: number
  /** The machine on the opening screen, before the first step changes it. */
  before?: Omit<MachineFrame, 'before'>
}
/**
 * Ratio bars (lesson 30, R1), like the R1 videos: one bar per share, one block per part (bar 1 amber, bar 2 blue, bar 3
 * teal), the name on the left and a pill after the bar (`tag`: a share's amount, or 7x). `each` writes the value of one
 * part in every block. `rings` circle blocks in purple (from and to count blocks, and can be halves), and `note` is the
 * purple line under the bars that says what they are. `groups` splits every bar into that many equal groups, for 1 : n.
 * `lit` makes those bars' pills purple. `room` is the width kept for pills, the widest any step of the working needs,
 * so the picture keeps its size from step to step. See RatioPictures.tsx.
 */
export type RatioBar = { name: string; parts: number; tag?: string }
export type RatioFrame = {
  bars: RatioBar[]
  each?: string
  rings?: { bar: number; from: number; to: number }[]
  /** Two bars lined up, [smaller, bigger]: a dashed line at the end of the smaller one, the bigger one's first `at` parts fade, and every other bar fades. */
  match?: { bars: [number, number]; at: number }
  groups?: number
  note?: string
  lit?: number[]
  room?: number
  /** The bars on the opening screen, before the first step changes them. */
  before?: Omit<RatioFrame, 'before'>
}
/**
 * Factorising x² + bx + c into two brackets (lesson 21), the whole picture so far, in three steps (Sunny, 1 Oct): the
 * factor pairs of c (c boxed amber in the question), which pair adds to b (b boxed blue), then the brackets. A difference
 * of two squares writes each term as a square instead. `adds` is the part this step draws, where its heading goes.
 */
export type QuadraticFrame = {
  letter: string; middle: number; last: number
  /** The factor pairs of c, in order, with their signs; `sums` adds what each pair adds to, and `pick` is the one that works. */
  pairs?: [number, number][]
  /** The pairs are drawn plain (1 × 20) until a step flips their signs, when there is a minus (Sunny, 2 Oct). */
  flipped?: boolean
  sums?: boolean
  pick?: number
  /** A difference of two squares: each term as a square, "x² = x × x" and "49 = 7 × 7". */
  squares?: boolean
  /** The two numbers that go into the brackets, in order: (x + a)(x + b). */
  answer?: [number, number]
  adds: 'pairs' | 'flip' | 'sums' | 'squares' | 'answer'
  /** What the step before added: it stays clear, with the question and this step; everything older is greyed out. */
  before?: QuadraticFrame['adds']
}
/**
 * Solving x² + bx + c = 0 by factorising (lesson 22), the whole picture so far, in the textbook's four steps: make one
 * side 0 (the board), factorise (A7's factor pairs, then the brackets), set each bracket to 0, then solve each one,
 * ending in the answer. Rows line up on their = signs. `adds` is the part this step draws, where its heading goes.
 */
export type SolveFrame = {
  letter: string; middle: number; last: number
  /** The board before one side is 0: the question, then the rows of the move that makes it 0. None when it already is. */
  board?: EquationRow[]
  /** As in QuadraticFrame: the factor pairs of c, flipped to their signs, their sums and the pair that works. */
  pairs?: [number, number][]
  flipped?: boolean
  sums?: boolean
  pick?: number
  /** The two numbers in the brackets, in order: (x + a)(x + b) = 0. */
  brackets?: [number, number]
  /** The question gives the brackets, so the picture starts there. */
  given?: boolean
  /** Each bracket set equal to 0; `solve` undoes the number in each, ending in the answer. */
  split?: boolean
  solve?: boolean
  adds: 'zero' | 'pairs' | 'flip' | 'sums' | 'brackets' | 'split' | 'solve'
}
/**
 * A sequence (lesson 23), the whole picture so far: the terms as the question gives them, the jumps between them
 * (+ 4, × 2), rows lined up under the terms (4n: 4, 8, 12, 16, then + 1 under each), carrying on from the last term to
 * the next ones, lines of working and the answer. Each part says which step added it (`at`), so finished parts grey out.
 * See SequencePictures.tsx.
 */
export type SequenceFrame = {
  terms: string[]
  /** "…" after the terms: the sequence carries on. */
  more?: boolean
  hops?: { labels: string[]; at: number }
  /** Each term's position (1, 2, 3, 4), small above it, so 4n reads as 4 × the position (Sunny, 2 Oct). */
  positions?: { at: number }
  rows?: { label: string; cells: string[]; family: number; at: number; answer?: boolean }[]
  /** Carrying on from the last term: a jump into each new term, "?" until it is worked out, green once it is. */
  next?: { hops: string[]; terms: string[]; filled: boolean; at: number }
  lines?: { text: string; family: number; at: number }[]
  answer?: { text: string; at: number; parts?: { text: string; label: string; family?: number }[] }
  /** This step's number (0 is step 1), and the part it adds, where its heading goes. */
  step: number
  adds: 'hops' | 'row' | 'next' | 'lines' | 'answer'
}
/**
 * An inequality on a number line (lessons 24 and 25), the whole picture so far: the numbers under the line, a circle on
 * each end (filled when that number is included, open when it isn't), the arrow off one end or the line joining two
 * circles, and whole numbers marked with dots (green: the answer to "list the integers"). Under it, lines of working
 * and the answer. Each part says which step added it (`at`), so finished parts grey out; `boxed` circles a number in
 * purple while a step reads or draws it. See InequalityPictures.tsx.
 */
export type NumberLineFrame = {
  ticks: number[]
  circles?: { value: number; closed: boolean; at: number }[]
  /** From a circle off the end of the line ('left', 'right'), or to the other circle (a number). */
  shade?: { from: number; to: number | 'left' | 'right'; at: number }
  dots?: { values: number[]; at: number }
  boxed?: number[]
  lines?: { text: string; family: number; at: number }[]
  answer?: { text: string; at: number }
  step: number
  adds: 'line' | 'lines' | 'answer'
}
/**
 * A graph (the graphs lessons), the whole picture so far: the page's own squared paper with the axes on it, straight lines (each
 * through two points, drawn edge to edge), points with their coordinates, and the steps between two points: across
 * (change in x, amber) and up or down (change in y, biro blue), as in the graphs videos. Under it, lines of working and the
 * answer. Each part says which step added it (`at`, −1 for the question's own), so finished parts grey out; `boxed`
 * rings points in purple while a step reads them. See GraphPictures.tsx.
 */
export type GraphPoint = { x: number; y: number }
export type GraphTable = { xs: number[]; ys: (number | null)[]; ask?: number; lit?: number; answer?: number; rule?: string }
/** A real-life axis (graphs lessons 7 and 8): each square is `per` units and the axes cross at `start`; every `every`th
 *  square is numbered (from `start`), `clock` writes hours as 09:30, and `name` is written at the axis's end instead of
 *  x or y. With a scale, every coordinate in the frame is in these units. */
export type AxisScale = { per: number; start: number; every?: number; clock?: boolean; name: string }
export type GraphFrame = {
  /** The grid runs from x[0] to x[1] across and y[0] to y[1] up, one square per unit. */
  x: [number, number]
  y: [number, number]
  /** `segment` draws only from one point to the other (a midpoint question), not edge to edge. */
  lines?: { from: GraphPoint; to: GraphPoint; label?: string; at: number; answer?: boolean; segment?: boolean; wrong?: boolean }[]
  scale?: { x: AxisScale; y: AxisScale }
  /** Curves (graphs lesson 6): the rule's numbers [constant, x, x², x³], drawn smooth from x = `from` to x = `to`. */
  curves?: { coeffs: number[]; from: number; to: number; label?: string; at: number; answer?: boolean }[]
  /** A table of values above the grid (graphs lesson 2): the x row amber, the y row biro blue. A null y is an empty
   *  cell, `ask` the cell a question asks for ("?"), `lit` the column a step works on, and `answer` a y in green.
   *  `rule` ("2x − 1") heads the y row, y = 2x − 1, so every y says where it comes from (Sunny, 7 Oct). */
  table?: GraphTable
  /** `place` puts the coordinates to one side (dx −1 left, 1 right) and above or below (dy −1 above, 1 below), clear of
   *  the line and the steps drawn from the point. */
  points?: (GraphPoint & { label?: string; at: number; place?: { dx: number; dy: number }; answer?: boolean })[]
  /** The step from one point to the other: across (change in x) or up/down (change in y), labelled with its size. */
  /** `dashed` is a reading line from a point to an axis: no arrowhead, no size. */
  legs?: { from: GraphPoint; to: GraphPoint; label: string; family: number; at: number; dashed?: boolean }[]
  boxed?: GraphPoint[]
  /** The numbers on the axes this step reads, highlighted x amber and y biro blue (as in the brackets): x = 3 marks the 3. One step only. */
  marks?: { axis: 'x' | 'y'; value: number; family: number }[]
  working?: { text: string; family: number; at: number }[]
  answer?: { text: string; at: number }
  step: number
  adds: 'picture' | 'lines' | 'answer'
}
/** A line of working built up under a picture, e.g. "8.4 − 0.05 → 8.35", coloured like its family (`is-f…`). */
export type WorkingLine = { parts?: string; total: string; family: number }
/** A part of a written method's line: its text, colour (`is-f…`) and whether it is boxed in purple (the carry being added). */
export type LinePart = { text: string; family?: number; boxed?: boolean }
/**
 * A line under a written method's picture: "3 × 4 → 12". `answer` draws the result in the green answer box (the working
 * stops there); `mark` is a small verdict after it ("✓", "too big"); a line with no result is words ("5 won't go into 3").
 */
export type WrittenLine = { parts: LinePart[]; result?: string; resultFamily?: number; answer?: boolean; mark?: string }
/** A carry in column multiplication: `boxed` while it is being added, `used` (struck out) after. */
export type WrittenCarry = Carry & { boxed?: boolean; used?: boolean }
export type BusCarry = { index: number; value: number }
export type MethodFrame = {
  /** The lines of working so far; a step that adds lines has its heading above the new ones. */
  sums?: WorkingLine[]
  /** A written method's lines for this step, under its picture. */
  lines?: WrittenLine[]
  /** Column multiplication: every carry so far, the digit just written, and the row that is the answer. */
  carries?: WrittenCarry[]; written?: { row: 'ones' | 'tens' | 'total'; place: number; wide?: boolean }
  answerRow?: 'ones' | 'tens' | 'total' | 'quotient'; answerCarry?: boolean
  /** The grid's headings are shown once the numbers are split. */
  split?: boolean
  /** Bus stop: every carry so far; `carriesBoxed` boxes them all; `answerWords` is the answer in the question's words. */
  busCarries?: BusCarry[]; carriesBoxed?: boolean; answerWords?: string
  tiles?: TilesFrame
  squares?: SquaresFrame
  expand?: ExpandFrame
  bracket?: BracketFrame
  equation?: EquationFrame
  angles?: AngleFrame
  machine?: MachineFrame
  ratio?: RatioFrame
  quadratic?: QuadraticFrame
  solve?: SolveFrame
  sequence?: SequenceFrame
  numberLine?: NumberLineFrame
  graph?: GraphFrame
  ones?: string; tens?: string; total?: string; carry?: Carry
  quotient?: string; remainder?: number; divisionCarry?: { index: number; value: number }
  cells?: Record<string, number>
  longRows?: LongDivisionRow[]
  decimalRows?: string[]; decimalResult?: string; decimalNote?: string
  factorSplits?: FactorSplit[]; factorAnswer?: string
  numberLists?: NumberListFrame
  venn?: VennFrame
  rounding?: RoundingFrame
  ordering?: OrderingFrame
  interval?: IntervalFrame
  hop?: HopFrame
  terms?: TermsFrame
}
export type MethodStep = {
  title: string; operation: string; equation: string; instruction: string; frame: MethodFrame
  /** A small, quiet reminder after a picture-only step's heading, such as the power being read ("× 10³"). */
  tag?: string
  focus?: { topPlace?: number; factorPlace: number } | { dividendIndex: number; dividendStart?: number } | { cell: string }
}
export type MethodExample = {
  method: 'column' | 'grid' | 'division' | 'long-division' | 'decimal' | 'rounding' | 'ordering' | 'estimate' | 'factor-tree' | 'number-lists' | 'venn' | 'standard-form' | 'collect'
  expression: string; label: string; first: number; second: number
  grid?: { first: number[]; second: number[] }
  steps: MethodStep[]
  /** The working as a step chain with terms that move between lines; otherwise the steps become the lines. */
  chain?: MethodChainStep[]
  /** Draw the whole working in the picture, one step at a time (src/features/EXPLANATIONS.md). */
  pictureOnly?: boolean
  /**
   * Grey out the working a step has finished with, so the row it works on and what it adds stand out (Sunny, 1 Oct,
   * for students who lose their place: A5 on).
   */
  focus?: boolean
}
export type MethodWorking = { kind: 'method-worked'; examples: MethodExample[] }
const place = (i: number) => ['units', 'tens', 'hundreds', 'thousands', 'ten-thousands'][i] ?? `10^${i}`
const value = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 10 })

/*
 * The written methods (grid, columns, bus stop, long division) are drawn as pictures, one move a step
 * (src/features/EXPLANATIONS.md): the method's own layout on top, and under it the step's heading and the lines that
 * show where its new numbers come from ("3 × 4 → 12", then "12 + 1 → 13" with the carried 1 boxed in purple).
 * The last move writes the answer, so that row turns green and the working stops: no check line, no answer step.
 */
const part = (text: string | number, family?: number, boxed?: boolean): LinePart => ({ text: String(text), family, boxed })
const sign = (text: string): LinePart => ({ text })
const line = (parts: LinePart[], result?: string | number, extra: Partial<WrittenLine> = {}): WrittenLine => ({ parts, result: result === undefined ? undefined : String(result), ...extra })

/** Column multiplication. `upTo` stops after that many digit steps and marks the latest carry as the answer. */
export function columnWorking(first: number, second: number, options: { upTo?: number } = {}): MethodExample {
  const steps: MethodStep[] = []
  let frame: MethodFrame = { carries: [] }
  const digits = String(first).split('').reverse().map(Number)
  const factors = String(second).split('').reverse().map(Number)
  // Carries stay where they were written; the one a step adds is boxed, and struck out once it has been added.
  const settle = (carries: WrittenCarry[] = []) => carries.map(carry => carry.boxed ? { ...carry, boxed: false, used: true } : carry)
  factors.forEach((factor, shift) => {
    let carry = 0, partial = 0
    const row: 'ones' | 'tens' = shift ? 'tens' : 'ones'
    if (shift) {
      frame = { ...frame, carries: settle(frame.carries), carry: undefined, tens: '0', written: { row: 'tens', place: 0 } }
      steps.push({
        title: 'Put down a 0', tag: `× ${factor * 10}`, operation: `${factor}\\times10`, equation: `${factor}\\times10=${factor * 10}`,
        instruction: `This row multiplies by ${factor * 10}, not ${factor}. Multiplying by 10 puts a 0 in the units, then you multiply by ${factor} as usual.`,
        frame: { ...frame, lines: [line([part(factor * 10, 0)], `${factor} × 10`)] }, focus: { factorPlace: shift },
      })
    }
    digits.forEach((digit, i) => {
      const incoming = carry, base = digit * factor, product = base + incoming
      const last = i === digits.length - 1
      partial += (last ? product : product % 10) * 10 ** (i + shift)
      carry = last ? 0 : Math.floor(product / 10)
      const previous = settle(frame.carries).map(c => incoming && c.row === row && c.place === i + shift && !c.used ? { ...c, boxed: true } : c)
      frame = {
        ...frame,
        [row]: String(partial).padStart(i + shift + 1, '0'),
        carries: [...previous, ...(carry ? [{ place: i + shift + 1, value: carry, row }] : [])],
        carry: carry ? { place: i + shift + 1, value: carry, row } : undefined,
        written: { row, place: i + shift, wide: last && product > 9 },
      }
      const lines = [line([part(factor, 0), sign('×'), part(digit, 1)], base)]
      if (incoming) lines.push(line([part(base), sign('+'), part(incoming, 3, true)], product))
      const what = last ? 'This is the last digit, so write all of it.' : product > 9 ? 'Write the units digit here and carry the tens digit to the next column.' : 'Write it in this column.'
      steps.push({
        title: `Multiply the ${place(i)}`, tag: `× ${factor}`, operation: `${factor}\\times${digit}${incoming ? `+${incoming}` : ''}`, equation: `${factor}\\times${digit}${incoming ? `+${incoming}` : ''}=${product}`,
        instruction: `${incoming ? 'Multiply, then add the number you carried. ' : ''}${what}`,
        frame: { ...frame, lines }, focus: { topPlace: i, factorPlace: shift },
      })
    })
  })
  if (factors.length > 1) {
    const ones = frame.ones!, tens = frame.tens!
    const width = Math.max(ones.length, tens.length)
    let carry = 0, sum = 0
    for (let i = 0; i < width; i++) {
      const a = i < ones.length ? Number(ones[ones.length - 1 - i]) : undefined, b = Number(tens[tens.length - 1 - i])
      const incoming = carry, base = (a ?? 0) + b, n = base + incoming
      const last = i === width - 1
      sum += (last ? n : n % 10) * 10 ** i
      carry = last ? 0 : Math.floor(n / 10)
      const previous = settle(frame.carries).map(c => incoming && c.row === 'sum' && c.place === i && !c.used ? { ...c, boxed: true } : c)
      frame = {
        ...frame,
        total: String(sum).padStart(i + 1, '0'),
        carries: [...previous, ...(carry ? [{ place: i + 1, value: carry, row: 'sum' as const }] : [])],
        carry: carry ? { place: i + 1, value: carry, row: 'sum' } : undefined,
        written: { row: 'total', place: i, wide: last && n > 9 },
        answerRow: last ? 'total' : undefined,
      }
      const lines = a === undefined
        ? [incoming ? line([part(b, 0), sign('+'), part(incoming, 3, true)], n) : line([part(b, 0)], undefined, { mark: 'nothing to add' })]
        : [line([part(a, 1), sign('+'), part(b, 0)], base)]
      if (incoming && a !== undefined) lines.push(line([part(base), sign('+'), part(incoming, 3, true)], n))
      steps.push({
        title: `Add the ${place(i)}`, operation: `${a ?? 0}+${b}${incoming ? `+${incoming}` : ''}`, equation: `${a ?? 0}+${b}${incoming ? `+${incoming}` : ''}=${n}`,
        instruction: last ? 'This is the last column, so write all of it. The bottom row is the answer.' : n > 9 ? 'Write the units digit and carry the tens digit to the next column.' : 'Add the digits in this column and write the result underneath.',
        frame: { ...frame, lines },
      })
    }
  } else if (!options.upTo) {
    steps[steps.length - 1].frame = { ...steps[steps.length - 1].frame, answerRow: 'ones' }
    steps[steps.length - 1].instruction += ' The bottom row is the answer.'
  }
  if (options.upTo) {
    steps.splice(options.upTo)
    const end = steps[steps.length - 1]
    end.frame = { ...end.frame, answerCarry: true }
    end.instruction += ' The number you carry is the answer.'
  }
  return { method: 'column', expression: `${first}\\times${second}`, label: 'Column method', first, second, steps }
}

/** The grid method: split both numbers into the headings, fill one box a step, then add the boxes. */
export function gridWorking(first: number, second: number, context?: { given: string[]; unit?: string }): MethodExample {
  const a = [Math.floor(first / 10) * 10, first % 10], b = [Math.floor(second / 10) * 10, second % 10]
  const unit = context?.unit ?? ''
  const steps: MethodStep[] = []
  if (context) steps.push({
    title: 'Write the sum', operation: `${first}\\times${second}`, equation: `${first}\\times${second}=${first * second}`,
    instruction: 'The total is the number of tickets times the price of one ticket.',
    frame: { cells: {}, lines: [line([part(context.given[0], 1), sign('×'), part(context.given[1], 0)], `${first} × ${second}`)] },
  })
  steps.push({
    title: 'Split both numbers', operation: `${first}`, equation: `${first}=${a[0]}+${a[1]}`,
    instruction: 'Split each number into tens and units. These parts are the headings of the grid.',
    frame: { cells: {}, split: true, lines: [line([part(first, 1)], `${a[0]} + ${a[1]}`, { resultFamily: 1 }), line([part(second, 0)], `${b[0]} + ${b[1]}`, { resultFamily: 0 })] },
  })
  let cells: Record<string, number> = {}
  const products: number[] = []
  const names = ['Top-left box', 'Top-right box', 'Bottom-left box', 'Bottom-right box']
  a.forEach((n, row) => b.forEach((m, col) => {
    const result = n * m, key = `${row}-${col}`
    products.push(result); cells = { ...cells, [key]: result }
    steps.push({
      title: names[row * 2 + col], operation: `${n}\\times${m}`, equation: `${n}\\times${m}=${result}`,
      instruction: 'Multiply the heading of its row by the heading of its column.',
      frame: { cells, split: true, lines: [line([part(n, 1), sign('×'), part(m, 0)], result)] }, focus: { cell: key },
    })
  }))
  steps.push({
    title: 'Add the boxes', operation: products.join('+'), equation: `${products.join('+')}=${first * second}`,
    instruction: 'Together the four boxes make the whole multiplication, so add them up.',
    frame: { cells, split: true, total: String(first * second), lines: [line(products.map((p, i) => [...(i ? [sign('+')] : []), part(p)]).flat(), `${unit}${value(first * second)}`, { answer: true })] },
  })
  return { method: 'grid', expression: `${first}\\times${second}`, label: 'Grid method', first, second, grid: { first: a, second: b }, steps }
}

/**
 * Short division (the bus stop). Each place: box what is being divided (with any carry), find the biggest multiple of
 * the divisor that fits, and carry what's left. The quotient on top is the answer.
 * `answer` changes the ending: 'remainder' (the last remainder is the answer), 'carries' (box every carry),
 * { roundUp } (one more box for what's left over) or { words } (the answer in the question's own words).
 */
export function divisionWorking(first: number, second: number, answer?: 'remainder' | 'carries' | { roundUp: string } | { words: string }): MethodExample {
  const digits = String(first).split('').map(Number), steps: MethodStep[] = []
  let remainder = 0, quotient = '', begun = false
  const carries: BusCarry[] = []
  digits.forEach((digit, index) => {
    const incoming = remainder, amount = incoming * 10 + digit, q = Math.floor(amount / second)
    remainder = amount % second
    const zero = !q, leading = zero && !begun
    begun = begun || q > 0
    quotient += begun ? q : ' '
    const last = index === digits.length - 1
    const p = digits.length - index - 1
    if (remainder && !last) carries.push({ index: index + 1, value: remainder })
    const equation = remainder ? `${amount}\\div${second}\\;\\longrightarrow\\;${q}\\;\\mathrm{r}\\,${remainder}` : `${amount}\\div${second}=${q}`
    const lines = zero
      ? [line([part(second, 0), sign('won’t go into'), part(amount, 1)])]
      : [line([part(second, 0), sign('×'), part(q)], second * q)]
    if (!zero && (remainder || (last && answer === 'remainder'))) lines.push(line([part(amount, 1), sign('−'), part(second * q)], remainder, { answer: last && answer === 'remainder' }))
    const instruction = zero
      ? `It won’t go, so ${leading ? 'leave the space above empty' : 'write 0 above'}${last ? '.' : ' and carry it into the next place.'}`
      : `Find the biggest multiple of ${second} that fits and write how many above.${remainder && !last ? ' Carry what’s left into the next place.' : remainder ? ' What’s left is the remainder.' : ''}`
    steps.push({
      title: `Divide the ${place(p)}`, operation: `${amount}\\div${second}`, equation, instruction,
      frame: { quotient, busCarries: [...carries], divisionCarry: carries.at(-1), remainder: last ? remainder : undefined, lines }, focus: { dividendIndex: index },
    })
  })
  const end = steps[steps.length - 1]
  const q = Math.floor(first / second)
  if (answer && typeof answer === 'object' && 'roundUp' in answer) {
    steps.push({
      title: 'One more box', operation: `${q}+1`, equation: `${q}+1=${q + 1}`, instruction: answer.roundUp,
      frame: { ...end.frame, lines: [line([part(q), sign('+'), part(1, 3)], q + 1, { answer: true })] },
    })
  } else if (answer && typeof answer === 'object' && 'words' in answer) {
    end.frame = { ...end.frame, answerWords: answer.words }
  } else if (answer !== 'remainder') {
    end.frame = { ...end.frame, answerRow: 'quotient', carriesBoxed: answer === 'carries' }
  }
  return { method: 'division', expression: `${first}\\div${second}`, label: 'Bus-stop method', first, second, steps }
}

/** Long division: start with the first group the divisor fits, then try multiples, subtract and bring down. */
export function longDivisionWorking(first: number, second: number): MethodExample {
  const digits = String(first).split('').map(Number), steps: MethodStep[] = []
  let end = 0, amount = digits[0]
  while (amount < second && end < digits.length - 1) amount = amount * 10 + digits[++end]
  let quotient = ' '.repeat(digits.length), rows: LongDivisionRow[] = [], frame: MethodFrame = { quotient, longRows: rows }
  const group = digits.slice(0, end + 1).map((digit, i) => `${digit}${end - i ? `\\times${10 ** (end - i)}` : ''}`).join('+')
  const tooSmall = digits.slice(0, end).map((_, i) => Number(digits.slice(0, i + 1).join('')))
  steps.push({
    title: `Start with ${amount}`, operation: group, equation: `${group}=${amount}`,
    instruction: `Start with the first group of digits that ${second} fits into. Its answer goes above the group’s last digit.`,
    frame: { ...frame, lines: [line([part(second, 0), sign('won’t go into'), ...tooSmall.flatMap((n, i) => [...(i ? [sign('or')] : []), part(n, 1)])])] },
    focus: { dividendStart: 0, dividendIndex: end },
  })
  while (true) {
    const q = Math.floor(amount / second), product = second * q, remainder = amount - product
    quotient = quotient.slice(0, end) + q + quotient.slice(end + 1)
    frame = { ...frame, quotient }
    const tries = [
      ...(q ? [line([part(second, 0), sign('×'), part(q)], product, { mark: '✓' })] : []),
      line([part(second, 0), sign('×'), part(q + 1)], second * (q + 1), { mark: 'too big' }),
    ]
    steps.push({
      title: `How many ${second}s?`, operation: `${amount}\\div${second}`, equation: remainder ? `${amount}\\div${second}\\;\\longrightarrow\\;${q}\\;\\mathrm{r}\\,${remainder}` : `${amount}\\div${second}=${q}`,
      instruction: `Go up the ${second} times table until the next one is too big. Write how many above.`,
      frame: { ...frame, lines: tries }, focus: { dividendStart: rows.length ? end : 0, dividendIndex: end },
    })
    const lastDigit = end === digits.length - 1
    rows = [...rows, { number: String(product), end, kind: 'subtract' }, { number: String(remainder), end, kind: 'remainder' }]
    frame = { ...frame, longRows: rows, remainder: lastDigit ? remainder : undefined, answerRow: lastDigit ? 'quotient' : undefined }
    steps.push({
      title: 'Subtract', operation: `${amount}-${product}`, equation: `${amount}-${product}=${remainder}`,
      instruction: `Write the multiple under the group and take it away.${lastDigit ? ' No digits are left to bring down, so what’s left is the remainder.' : ''}`,
      frame: { ...frame, lines: [line([part(amount, 1), sign('−'), part(product)], remainder)] },
    })
    if (lastDigit) break
    const nextDigit = digits[++end], nextAmount = remainder * 10 + nextDigit
    rows = [...rows.slice(0, -1), { number: String(nextAmount), end, kind: 'bring-down' }]
    frame = { ...frame, longRows: rows }
    steps.push({
      title: `Bring down the ${nextDigit}`, operation: `${remainder}\\times10+${nextDigit}`, equation: `${remainder}\\times10+${nextDigit}=${nextAmount}`,
      instruction: 'Bring the next digit down beside what’s left. That makes the next number to divide.',
      frame: { ...frame, lines: [line([part(remainder * 10), sign('+'), part(nextDigit, 1)], nextAmount)] }, focus: { dividendIndex: end },
    })
    amount = nextAmount
  }
  return { method: 'long-division', expression: `${first}\\div${second}`, label: 'Long division', first, second, steps }
}

export const methodWorking = (...examples: MethodExample[]): MethodWorking => ({ kind: 'method-worked', examples })

const decimalPlaces = (value: number) => {
  const text = String(value)
  return text.includes('.') ? text.length - text.indexOf('.') - 1 : 0
}
const cleanDecimal = (value: number, places = decimalPlaces(value)) => value.toFixed(places).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
const paddedDecimal = (value: number, places: number) => value.toFixed(places)
const decimalPlaceName = (columnFromRight: number, places: number) => {
  if (columnFromRight < places) return ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'][places - columnFromRight - 1] ?? 'decimal place'
  return ['units', 'tens', 'hundreds', 'thousands'][columnFromRight - places] ?? 'whole-number place'
}
const maskedResult = (answer: string, revealedDigits: number) => {
  let remaining = revealedDigits
  return [...answer].reverse().map(char => {
    if (char === '.') return char
    if (remaining > 0) { remaining--; return char }
    return '·'
  }).reverse().join('')
}

export function decimalAdditionWorking(values: number[]): MethodExample {
  const places = Math.max(...values.map(decimalPlaces))
  const scale = 10 ** places
  const scaled = values.map(value => Math.round(value * scale))
  const total = scaled.reduce((sum, value) => sum + value, 0)
  const answer = paddedDecimal(total / scale, places)
  const width = Math.max(answer.replace('.', '').length, ...scaled.map(value => String(value).length))
  const digits = scaled.map(value => String(value).padStart(width, '0').split('').map(Number))
  const rows = values.map(value => paddedDecimal(value, places))
  const expression = values.map(value => cleanDecimal(value)).join('+')
  const steps: MethodStep[] = [{
    title: 'Line up the decimal points', operation: expression,
    equation: `${expression}=${rows.join('+')}`,
    instruction: `Write every decimal point in the same column. Add trailing zeroes where needed: ${rows.join(', ')}.`,
    frame: { decimalRows: rows, decimalResult: maskedResult(answer, 0), decimalNote: 'Decimal points aligned' },
  }]
  let carry = 0
  for (let column = width - 1, revealed = 1; column >= 0; column--, revealed++) {
    const addends = digits.map(row => row[column])
    const incoming = carry
    const sum = addends.reduce((n, digit) => n + digit, incoming)
    carry = column ? Math.floor(sum / 10) : 0
    const operation = `${addends.join('+')}${incoming ? `+${incoming}` : ''}`
    const placeColumn = width - column - 1
    steps.push({
      title: `Add the ${decimalPlaceName(placeColumn, places)}`, operation,
      equation: `${operation}=${sum}`,
      instruction: `${addends.join(' + ')}${incoming ? `, then add the ${incoming} carried over` : ''} gives ${sum}. Write ${column ? sum % 10 : sum}.${carry ? ` Carry ${carry} into the next column.` : ''}`,
      frame: { decimalRows: rows, decimalResult: maskedResult(answer, revealed), decimalNote: `Working from right to left: ${decimalPlaceName(placeColumn, places)}` },
    })
  }
  steps.push({ title: 'Read the aligned answer', operation: expression, equation: `${expression}=${cleanDecimal(total / scale, places)}`, instruction: `Keep the decimal point in the aligned column. The sum is ${cleanDecimal(total / scale, places)}.`, frame: { decimalRows: rows, decimalResult: answer, decimalNote: 'Complete sum' } })
  return { method: 'decimal', expression, label: 'Decimal addition', first: values[0], second: values[1] ?? 0, steps }
}

export function decimalSubtractionWorking(first: number, second: number): MethodExample {
  const places = Math.max(decimalPlaces(first), decimalPlaces(second))
  const scale = 10 ** places
  const topValue = Math.round(first * scale), bottomValue = Math.round(second * scale), difference = topValue - bottomValue
  const answer = paddedDecimal(difference / scale, places)
  const width = Math.max(String(topValue).length, String(bottomValue).length)
  const top = String(topValue).padStart(width, '0').split('').map(Number)
  const bottom = String(bottomValue).padStart(width, '0').split('').map(Number)
  const rows = [paddedDecimal(first, places), `− ${paddedDecimal(second, places)}`]
  const expression = `${cleanDecimal(first)}-${cleanDecimal(second)}`
  const steps: MethodStep[] = [{ title: 'Line up the decimal points', operation: expression, equation: `${expression}=${paddedDecimal(first, places)}-${paddedDecimal(second, places)}`, instruction: `Line up equal place values and fill empty decimal places with zeroes.`, frame: { decimalRows: rows, decimalResult: maskedResult(answer, 0), decimalNote: 'Decimal points aligned' } }]
  const firstResultColumn = width - String(difference).length
  for (let column = width - 1, revealed = 1; column >= firstResultColumn; column--, revealed++) {
    let regrouped = false
    if (top[column] < bottom[column]) {
      let lender = column - 1
      while (lender >= 0 && top[lender] === 0) lender--
      if (lender >= 0) {
        top[lender]--
        for (let i = lender + 1; i < column; i++) top[i] += 9
        top[column] += 10
        regrouped = true
      }
    }
    const result = top[column] - bottom[column]
    const operation = `${top[column]}-${bottom[column]}`
    const placeColumn = width - column - 1
    steps.push({ title: `Subtract the ${decimalPlaceName(placeColumn, places)}`, operation, equation: `${operation}=${result}`, instruction: `${regrouped ? 'Regroup from the next available column. ' : ''}${top[column]} - ${bottom[column]} = ${result}. Write ${result} in the ${decimalPlaceName(placeColumn, places)} column.`, frame: { decimalRows: rows, decimalResult: maskedResult(answer, revealed), decimalNote: regrouped ? 'Regrouped one place at a time' : `Subtract the ${decimalPlaceName(placeColumn, places)}` } })
  }
  steps.push({ title: 'Read the difference', operation: expression, equation: `${expression}=${cleanDecimal(difference / scale, places)}`, instruction: `Keep the decimal point in its aligned column. The difference is ${cleanDecimal(difference / scale, places)}.`, frame: { decimalRows: rows, decimalResult: answer, decimalNote: 'Complete difference' } })
  return { method: 'decimal', expression, label: 'Decimal subtraction', first, second, steps }
}

function decimalPlacementExample(first: number, second: number): MethodExample {
  const firstPlaces = decimalPlaces(first), secondPlaces = decimalPlaces(second), totalPlaces = firstPlaces + secondPlaces
  const wholeFirst = Math.round(first * 10 ** firstPlaces), wholeSecond = Math.round(second * 10 ** secondPlaces)
  const wholeProduct = wholeFirst * wholeSecond, product = first * second
  const expression = `${cleanDecimal(first)}\\times${cleanDecimal(second)}`
  const steps: MethodStep[] = [
    { title: 'Count the decimal places', operation: `${firstPlaces}+${secondPlaces}`, equation: `${firstPlaces}+${secondPlaces}=${totalPlaces}`, instruction: `${cleanDecimal(first)} has ${firstPlaces} decimal ${firstPlaces === 1 ? 'place' : 'places'} and ${cleanDecimal(second)} has ${secondPlaces}. The product needs ${totalPlaces} decimal ${totalPlaces === 1 ? 'place' : 'places'} altogether.`, frame: { decimalRows: [`${cleanDecimal(first)} → ${firstPlaces} place${firstPlaces === 1 ? '' : 's'}`, `${cleanDecimal(second)} → ${secondPlaces} place${secondPlaces === 1 ? '' : 's'}`], decimalNote: `${totalPlaces} decimal places altogether` } },
    { title: 'Restore the decimal point', operation: `${wholeProduct}\\div${10 ** totalPlaces}`, equation: `${wholeProduct}\\div${10 ** totalPlaces}=${cleanDecimal(product, totalPlaces)}`, instruction: `Starting at the right of ${wholeProduct}, count ${totalPlaces} places to the left. This gives ${cleanDecimal(product, totalPlaces)}.`, frame: { decimalRows: [`Whole-number product: ${wholeProduct}`, `Move ${totalPlaces} place${totalPlaces === 1 ? '' : 's'} left`], decimalResult: cleanDecimal(product, totalPlaces), decimalNote: 'Decimal point restored' } },
    { title: 'State the product', operation: expression, equation: `${expression}=${cleanDecimal(product, totalPlaces)}`, instruction: `${cleanDecimal(first)} × ${cleanDecimal(second)} = ${cleanDecimal(product, totalPlaces)}. Remove unnecessary trailing zeroes only at the end.`, frame: { decimalRows: [cleanDecimal(first), `× ${cleanDecimal(second)}`], decimalResult: cleanDecimal(product, totalPlaces), decimalNote: 'Complete product' } },
  ]
  return { method: 'decimal', expression, label: 'Place the decimal point', first, second, steps }
}

export function decimalMultiplicationWorking(first: number, second: number): MethodWorking {
  const aPlaces = decimalPlaces(first), bPlaces = decimalPlaces(second)
  const wholeFirst = Math.round(first * 10 ** aPlaces), wholeSecond = Math.round(second * 10 ** bPlaces)
  const whole = { ...columnWorking(wholeFirst, wholeSecond), label: 'Whole-number multiplication' }
  return methodWorking(whole, decimalPlacementExample(first, second))
}

export function decimalDivisionWorking(first: number, second: number): MethodExample {
  const scale = 10 ** decimalPlaces(second)
  const scaledFirst = Number((first * scale).toFixed(decimalPlaces(first))), scaledSecond = Math.round(second * scale), quotient = first / second
  const expression = `${cleanDecimal(first)}\\div${cleanDecimal(second)}`
  const steps: MethodStep[] = []
  if (scale > 1) steps.push({ title: 'Make the divisor a whole number', operation: `${cleanDecimal(second)}\\times${scale}`, equation: `${cleanDecimal(second)}\\times${scale}=${cleanDecimal(scaledSecond)}`, instruction: `Multiply the divisor by ${scale}. Apply exactly the same multiplication to the dividend so the quotient does not change.`, frame: { decimalRows: [`Dividend: ${cleanDecimal(first)} × ${scale} = ${cleanDecimal(scaledFirst)}`, `Divisor: ${cleanDecimal(second)} × ${scale} = ${cleanDecimal(scaledSecond)}`], decimalNote: `Both numbers × ${scale}` } })
  else steps.push({ title: 'The divisor is already whole', operation: `${cleanDecimal(second)}`, equation: `${cleanDecimal(second)}=${cleanDecimal(scaledSecond)}`, instruction: `No scaling is needed because ${cleanDecimal(second)} is already a whole number.`, frame: { decimalRows: [`Dividend: ${cleanDecimal(first)}`, `Divisor: ${cleanDecimal(second)}`], decimalNote: 'Ready to divide' } })
  steps.push({ title: 'Write the equivalent division', operation: expression, equation: `${expression}=${cleanDecimal(scaledFirst)}\\div${cleanDecimal(scaledSecond)}`, instruction: `The equivalent calculation is ${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}.`, frame: { decimalRows: [`${cleanDecimal(first)} ÷ ${cleanDecimal(second)}`, `= ${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`], decimalNote: 'Same quotient' } })
  const quotientText = cleanDecimal(quotient, Math.max(decimalPlaces(first), decimalPlaces(second)) + 2)
  const [wholeText, fractionText = ''] = quotientText.split('.')
  const parts: Array<{ value: number; places: number }> = []
  ;[...wholeText].forEach((digit, index) => { const value = Number(digit) * 10 ** (wholeText.length - index - 1); if (value) parts.push({ value, places: 0 }) })
  ;[...fractionText].forEach((digit, index) => { const value = Number(digit) / 10 ** (index + 1); if (value) parts.push({ value, places: index + 1 }) })
  let built = 0
  for (const part of parts) {
    const partText = cleanDecimal(part.value, part.places)
    const productText = cleanDecimal(scaledSecond * part.value, part.places)
    const operation = `${cleanDecimal(scaledSecond)}\\times${partText}`
    built += part.value
    const builtText = cleanDecimal(built, fractionText.length)
    steps.push({ title: `Build the quotient with ${partText}`, operation, equation: `${operation}=${productText}`, instruction: `${cleanDecimal(scaledSecond)} × ${partText} = ${productText}. The quotient built so far is ${builtText}.`, frame: { decimalRows: [`${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`, `${cleanDecimal(scaledSecond)} × ${partText} = ${productText}`], decimalResult: builtText, decimalNote: 'Quotient so far' } })
  }
  steps.push({ title: 'Read the quotient', operation: expression, equation: `${expression}=${cleanDecimal(quotient)}`, instruction: `${cleanDecimal(first)} ÷ ${cleanDecimal(second)} = ${cleanDecimal(quotient)}. Scaling both numbers preserved the value.`, frame: { decimalRows: [`${cleanDecimal(scaledFirst)} ÷ ${cleanDecimal(scaledSecond)}`], decimalResult: cleanDecimal(quotient), decimalNote: 'Complete quotient' } })
  return { method: 'decimal', expression, label: 'Decimal division', first, second, steps }
}

const smallestPrimeFactor = (value: number) => {
  for (let candidate = 2; candidate <= Math.sqrt(value); candidate++) if (value % candidate === 0) return candidate
  return value
}
export const primeFactors = (value: number) => {
  const factors: number[] = []
  let remaining = value
  while (remaining > 1) { const factor = smallestPrimeFactor(remaining); factors.push(factor); remaining /= factor }
  return factors
}
export const primeFactorLatex = (value: number) => {
  const counts = new Map<number, number>()
  for (const factor of primeFactors(value)) counts.set(factor, (counts.get(factor) ?? 0) + 1)
  return [...counts].map(([factor, power]) => power === 1 ? String(factor) : `${factor}^{${power}}`).join('\\times')
}

export function factorTreeWorking(value: number): MethodExample {
  const steps: MethodStep[] = [], splits: FactorSplit[] = []
  let branch = value
  while (smallestPrimeFactor(branch) !== branch) {
    const left = smallestPrimeFactor(branch), right = branch / left
    splits.push({ value: branch, left, right })
    const operation = `${left}\\times${right}`
    steps.push({ title: `Split ${branch} into a factor pair`, operation, equation: `${branch}=${operation}`, instruction: `${branch} = ${left} × ${right}. ${left} is prime${smallestPrimeFactor(right) === right ? ` and ${right} is prime, so this branch is complete.` : `; continue splitting ${right}.`}`, frame: { factorSplits: [...splits] } })
    branch = right
  }
  const expanded = primeFactors(value).join('\\times'), indexed = primeFactorLatex(value)
  steps.push({ title: 'Collect every prime at the ends', operation: expanded, equation: `${value}=${expanded}`, instruction: `Every branch now ends in a prime. The prime factors are ${primeFactors(value).join(', ')}.`, frame: { factorSplits: splits, factorAnswer: `${value} = ${expanded}` } })
  steps.push({ title: 'Write repeated factors in index form', operation: indexed, equation: `${value}=${indexed}`, instruction: `Group repeated prime factors as powers: ${value} = ${indexed.replace(/\^\{(\d+)\}/g, '^$1').replace(/\\times/g, ' × ')}.`, frame: { factorSplits: splits, factorAnswer: `${value} = ${indexed}` } })
  return { method: 'factor-tree', expression: String(value), label: 'Factor tree', first: value, second: 1, steps }
}

const factors = (value: number) => Array.from({ length: value }, (_, index) => index + 1).filter(candidate => value % candidate === 0)
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a)
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)
export function listingWorking(first: number, second: number, mode: 'both' | 'hcf' = 'both'): MethodExample {
  const firstFactors = factors(first), secondFactors = factors(second)
  const common = firstFactors.filter(value => secondFactors.includes(value)), highest = Math.max(...common), lowest = lcm(first, second)
  const base: NumberListFrame = { firstLabel: `Factors of ${first}`, first: firstFactors }
  const steps: MethodStep[] = [
    { title: `List every factor of ${first}`, operation: String(first), equation: `\\{${firstFactors.join(',')}\\}`, instruction: `These are all the whole numbers that divide ${first} exactly.`, frame: { numberLists: base } },
    { title: `List every factor of ${second}`, operation: String(second), equation: `\\{${secondFactors.join(',')}\\}`, instruction: `List the factors in order so shared values are easy to compare.`, frame: { numberLists: { ...base, secondLabel: `Factors of ${second}`, second: secondFactors } } },
    { title: 'Choose the highest common factor', operation: common.join(','), equation: `\\operatorname{HCF}(${first},${second})=${highest}`, instruction: `${common.join(', ')} appear in both lists. The greatest is ${highest}, so the HCF is ${highest}.`, frame: { numberLists: { ...base, secondLabel: `Factors of ${second}`, second: secondFactors, common, hcf: highest } } },
  ]
  if (mode === 'both') {
    const firstMultiples = Array.from({ length: lowest / first }, (_, index) => first * (index + 1))
    const secondMultiples = Array.from({ length: lowest / second }, (_, index) => second * (index + 1))
    steps.push({ title: `List multiples of ${first}`, operation: String(first), equation: firstMultiples.join(','), instruction: `Count in ${first}s until a value can appear in both lists.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples } } })
    steps.push({ title: `List multiples of ${second}`, operation: String(second), equation: secondMultiples.join(','), instruction: `${lowest} is the first value that appears in both multiple lists.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples, secondLabel: `Multiples of ${second}`, second: secondMultiples, common: [lowest] } } })
    steps.push({ title: 'Choose the lowest common multiple', operation: String(lowest), equation: `\\operatorname{LCM}(${first},${second})=${lowest}`, instruction: `The first shared positive multiple is ${lowest}, so the LCM is ${lowest}.`, frame: { numberLists: { firstLabel: `Multiples of ${first}`, first: firstMultiples, secondLabel: `Multiples of ${second}`, second: secondMultiples, common: [lowest], hcf: highest, lcm: lowest } } })
  }
  return { method: 'number-lists', expression: mode === 'both' ? `\\operatorname{HCF/LCM}(${first},${second})` : `\\operatorname{HCF}(${first},${second})`, label: 'Listing method', first, second, steps }
}

export function multiplesWorking(value: number, count: number): MethodExample {
  const values = Array.from({ length: count }, (_, index) => value * (index + 1)), steps: MethodStep[] = []
  values.forEach((multiple, index) => steps.push({ title: `Find multiple ${index + 1}`, operation: `${value}\\times${index + 1}`, equation: `${value}\\times${index + 1}=${multiple}`, instruction: `Multiply ${value} by ${index + 1}. The ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} positive multiple is ${multiple}.`, frame: { numberLists: { firstLabel: `First ${count} multiples of ${value}`, first: values.slice(0, index + 1) } } }))
  return { method: 'number-lists', expression: `${value},2\\times${value},3\\times${value},\\ldots`, label: 'Multiples', first: value, second: count, steps }
}

export function vennWorking(first: number, second: number, labels: [string, string] = [String(first), String(second)]): MethodExample {
  const a = primeFactors(first), b = primeFactors(second), remaining = [...b], middle: number[] = [], left: number[] = []
  for (const factor of a) { const index = remaining.indexOf(factor); if (index >= 0) { middle.push(factor); remaining.splice(index, 1) } else left.push(factor) }
  const right = remaining, highest = gcd(first, second), lowest = lcm(first, second)
  const steps: MethodStep[] = [
    { title: `Prime-factorise ${labels[0]}`, operation: primeFactorLatex(first), equation: `${labels[0]}=${primeFactorLatex(first)}`, instruction: `Write ${labels[0]} as prime factors before placing anything in the diagram.`, frame: { venn: { labels, left: a, middle: [], right: [] } } },
    { title: `Prime-factorise ${labels[1]}`, operation: primeFactorLatex(second), equation: `${labels[1]}=${primeFactorLatex(second)}`, instruction: `Now write ${labels[1]} as prime factors and compare repeated copies one by one.`, frame: { venn: { labels, left: a, middle: [], right: b } } },
    { title: 'Place shared copies in the intersection', operation: middle.join('\\times'), equation: `\\text{shared}= ${middle.join('\\times')}`, instruction: `Match each shared copy only once. Put ${middle.join(', ')} in the overlap.`, frame: { venn: { labels, left, middle, right } } },
    { title: 'Multiply the intersection for the HCF', operation: middle.join('\\times'), equation: `${middle.join('\\times')}=${highest}`, instruction: `Only the intersection belongs to both numbers. Its product is the HCF: ${highest}.`, frame: { venn: { labels, left, middle, right, hcf: highest } } },
    { title: 'Multiply every region for the LCM', operation: [...left, ...middle, ...right].join('\\times'), equation: `${[...left, ...middle, ...right].join('\\times')}=${lowest}`, instruction: `Use every factor in the union, counting the shared copies once. Their product is the LCM: ${lowest}.`, frame: { venn: { labels, left, middle, right, hcf: highest, lcm: lowest } } },
  ]
  return { method: 'venn', expression: `\\operatorname{HCF/LCM}(${labels[0]},${labels[1]})`, label: 'Prime-factor Venn diagram', first, second, steps }
}

export function methodProgress(visual: MethodWorking, revealed: number) {
  const total = visual.examples.reduce((n, e) => n + e.steps.length, 0)
  let before = 0
  const working = visual.examples.map(example => {
    const count = Math.max(0, Math.min(example.steps.length, revealed - before))
    before += example.steps.length
    return { example, count, start: before - example.steps.length }
  })
  const activeIndex = working.findIndex(w => revealed <= w.start + w.example.steps.length)
  const active = activeIndex < 0 ? working.length - 1 : activeIndex
  const current = working[active].example.steps[working[active].count - 1]
  const completed = working.flatMap(({ example, count }, index) => example.steps.slice(0, count).map((step, i) => ({ step, example, index, number: i + 1 })))
  return { total, working, active, current, completed }
}
