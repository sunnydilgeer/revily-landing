import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, screens, sf, slips, triangleFig, type TriSide } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 20: Trigonometry. From T2 in Sunny's revision book (p158–160), with our own numbers except where a
 * question is the book's. Every screen starts the book's way: label the sides from the angle (hypotenuse, opposite,
 * adjacent), then pick the ratio with SOHCAHTOA. Four rungs: naming the sides and the three ratios; a missing length,
 * by multiplying or dividing (Example 1, Your Turn Q1); a missing angle with tan⁻¹, sin⁻¹ or cos⁻¹ (Example 2, Your
 * Turn Q2 and Q5); and the exact values of sin, cos and tan at 0°, 30°, 45°, 60° and 90° (Example 3, Your Turn Q3 and
 * Q4). Built like lessons 1 to 19, with no play screen: every triangle is drawn to scale, its angle marked.
 *
 * Hidden on live like lessons 1 to 19: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(220)
const { add, finish } = lesson
const { worked, practice } = screens(lesson)
const sides = 'geometry-trig-sides'
const length = 'geometry-trig-length'
const angle = 'geometry-trig-angle'
const exact = 'geometry-trig-exact'

const rad = (d: number) => d * Math.PI / 180
const deg = (r: number) => r * 180 / Math.PI
const L_BOX = (letter: string, unit = 'cm') => ({ label: `Length (${unit})`, prefix: `${letter} =` })
const A_BOX = (letter: string) => ({ label: 'Angle (°)', prefix: `${letter} =` })

/* ---------- Pictures ---------- */

type Tri = [FigurePoint, FigurePoint, FigurePoint]
/**
 * A right-angled triangle, the right angle at corner 0 and the angle we use at corner `at`, marked `mark`. Side k runs
 * from corner k to corner k + 1.
 */
const trig = (pts: Tri, at: number, mark: string, list: (TriSide | undefined)[], spoken: string, o: { names?: string[]; caption?: string; tone?: FigureTone } = {}): AngleFrame =>
  triangleFig(pts, { sides: list, right: 0, angles: [{ at, label: mark, tone: o.tone }], names: o.names, caption: o.caption, spoken, room: 32 })

/* ---------- Rung 1: naming the sides ---------- */

{
  // The angle x at the bottom left, the right angle at the bottom right.
  const pts: Tri = [[8, 0], [8, 5], [0, 0]]
  const t = (s: (TriSide | undefined)[], caption?: string) => trig(pts, 2, 'x', s, 'A right-angled triangle with the angle x marked at the bottom left.', { caption })
  const p = t([])
  worked(sides, 'Name the three sides of this triangle, from the angle x.', 'SOHCAHTOA', 'T2 p158 SOHCAHTOA', boardModel([], [
    { title: 'The hypotenuse', say: 'The hypotenuse is always the longest side, opposite the right angle.', rows: ['>0 Hypotenuse (H): opposite the right angle'], picture: t([undefined, { label: 'H', tone: 'lit' }]) },
    { title: 'The opposite', say: 'The opposite side is across from the angle x. It doesn’t touch x at all.', rows: ['>0 Opposite (O): across from x'], picture: t([{ label: 'O', tone: 'lit' }, { label: 'H' }]) },
    { title: 'The adjacent', say: 'The adjacent side is next to x, and isn’t the hypotenuse.', rows: ['>0 Adjacent (A): next to x'], picture: t([{ label: 'O' }, { label: 'H' }, { label: 'A', tone: 'lit' }]) },
    { title: 'The three ratios', say: 'Each ratio uses two of the sides. SOH CAH TOA helps you remember which.', rows: ['sin x = {O|H}', 'cos x = {A|H}', 'tan x = {O|A}', '! SOH CAH TOA'], picture: t([{ label: 'O' }, { label: 'H' }, { label: 'A' }], 'SOH CAH TOA') },
  ], 'Name the sides', p), 'Trigonometry links the sides of a right-angled triangle to its angles. Label the sides from the angle: the hypotenuse (H), the opposite (O) and the adjacent (A). Then sin = O ÷ H, cos = A ÷ H, tan = O ÷ A.')
}
{
  const pts: Tri = [[6, 0], [6, 4], [0, 0]]
  const names = ['B', 'C', 'A']
  const p = trig(pts, 2, 'y', [], 'A right-angled triangle ABC, the right angle at B and the angle y at A.', { names })
  practice(sides, 'Which side is opposite the angle y?', 'T2 p158 SOHCAHTOA', p, choose('BC', ['AB', 'AB touches y: it’s the adjacent.'], ['AC', 'AC is opposite the right angle: the hypotenuse.']), 'The opposite side doesn’t touch the angle.', boardModel([], [
    { title: 'Across from y', say: 'y is at A. The side that doesn’t touch A is BC.', rows: ['! BC is the opposite'], picture: trig(pts, 2, 'y', [{ label: 'O', tone: 'found' }], 'BC, across from y, is the opposite.', { names }) },
  ], 'Opposite', p))
}
{
  const pts: Tri = [[0, 0], [7, 0], [0, 4]]
  const p = trig(pts, 1, '35°', [{ label: 'A' }, { label: 'H' }], 'A right-angled triangle with its adjacent side A and hypotenuse H marked from the 35° angle.')
  practice(sides, 'You know the adjacent side and want the hypotenuse. Which ratio do you use?', 'T2 p158 SOHCAHTOA', p, choose('cos', ['sin', 'sin uses the opposite and the hypotenuse: SOH.'], ['tan', 'tan uses the opposite and the adjacent: TOA.']), 'Which of SOH, CAH, TOA has A and H?', boardModel([], [
    { title: 'Find A and H', say: 'A and H are together in CAH: cos = adjacent ÷ hypotenuse.', rows: ['cos 35° = {A|H}', '! cos'], picture: trig(pts, 1, '35°', [{ label: 'A', tone: 'lit' }, { label: 'H', tone: 'lit' }], 'CAH: cos') },
  ], 'Ratio', p))
}

/* ---------- Rung 2: a missing length ---------- */

{
  // Example 1: the hypotenuse 12 cm, the angle 38°, y the adjacent.
  const pts: Tri = [[0, 0], [12 * Math.cos(rad(38)), 0], [0, 12 * Math.sin(rad(38))]]
  const t = (y: TriSide, h: TriSide = { label: '12 cm' }, caption?: string) => trig(pts, 1, '38°', [y, h], 'A right-angled triangle: the hypotenuse 12 cm, the angle 38°, and y the side next to it.', { caption })
  const p = t({ label: 'y', tone: 'x' })
  worked(length, 'Find the length of the side marked y, to 1 decimal place.', 'A missing length', 'T2 p158 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Label the sides', say: 'From the 38°: 12 is opposite the right angle, the hypotenuse. y is next to the angle, the adjacent.', rows: ['>0 H = 12, A = y: CAH'], picture: t({ label: 'y (A)', tone: 'lit' }, { label: '12 (H)', tone: 'lit' }) },
    { title: 'Write the equation', say: 'cos = adjacent ÷ hypotenuse.', rows: ['cos 38° = {y|12}'], picture: t({ label: 'y', tone: 'x' }) },
    { title: 'Times both sides', say: 'Multiply both sides by 12, then use the calculator.', rows: ['y = 12 × cos 38°', 'y = 9.4561…', '! y = 9.5 cm'], picture: t({ label: '9.5 cm', tone: 'found' }, undefined, 'y = 9.5 cm') },
  ], 'Find y', p), 'To find a side: label the sides from the angle, pick the ratio that uses the side you know and the side you want, write the equation, then rearrange. If the unknown is on top, multiply.')
}
{
  // The hypotenuse 9 cm, the angle 25°, x opposite.
  const pts: Tri = [[9 * Math.cos(rad(25)), 0], [9 * Math.cos(rad(25)), 9 * Math.sin(rad(25))], [0, 0]]
  const t = (x: TriSide, caption?: string) => trig(pts, 2, '25°', [x, { label: '9 cm' }], 'A right-angled triangle: the hypotenuse 9 cm, the angle 25°, and x the side opposite it.', { caption })
  const p = t({ label: 'x', tone: 'x' })
  practice(length, 'Find the length of the side marked x, to 1 decimal place.', 'T2 p158 (own numbers)', p, number(3.8, '3.8 cm'), 'x is opposite the angle; 9 is the hypotenuse. SOH.', boardModel([], [
    { title: 'Pick the ratio', say: 'O = x and H = 9: SOH, sin.', rows: ['sin 25° = {x|9}'], picture: t({ label: 'x (O)', tone: 'lit' }) },
    { title: 'Times both sides', say: 'Multiply by 9.', rows: ['x = 9 × sin 25° = 3.803…', '! x = 3.8 cm'], picture: t({ label: '3.8 cm', tone: 'found' }, 'x = 3.8 cm') },
  ], 'Find x', p), slips(3.8, [[dp(9 * Math.cos(rad(25))), 'That’s cos. x is opposite the angle: use sin.'], [dp(9 * Math.tan(rad(25))), 'tan needs the adjacent. Here you know the hypotenuse: sin.'], [dp(9 / Math.sin(rad(25))), 'x is on top of the fraction, so multiply by 9, don’t divide.']]), L_BOX('x'))
}
{
  // The adjacent 6 cm, the angle 50°, x opposite.
  const pts: Tri = [[6, 0], [6, 6 * Math.tan(rad(50))], [0, 0]]
  const t = (x: TriSide, caption?: string) => trig(pts, 2, '50°', [x, undefined, { label: '6 cm' }], 'A right-angled triangle: the side next to the 50° angle is 6 cm, and x is opposite it.', { caption })
  const p = t({ label: 'x', tone: 'x' })
  practice(length, 'Find the length of the side marked x, to 1 decimal place.', 'T2 p158 (own numbers)', p, number(7.2, '7.2 cm'), 'Opposite and adjacent: TOA.', boardModel([], [
    { title: 'Pick the ratio', say: 'O = x and A = 6: TOA, tan.', rows: ['tan 50° = {x|6}'], picture: t({ label: 'x (O)', tone: 'lit' }) },
    { title: 'Times both sides', say: 'Multiply by 6.', rows: ['x = 6 × tan 50° = 7.150…', '! x = 7.2 cm'], picture: t({ label: '7.2 cm', tone: 'found' }, 'x = 7.2 cm') },
  ], 'Find x', p), slips(7.2, [[dp(6 * Math.sin(rad(50))), 'sin needs the hypotenuse. You know the adjacent: tan.'], [dp(6 * Math.cos(rad(50))), 'cos needs the hypotenuse. You know the adjacent: tan.'], [dp(6 / Math.tan(rad(50))), 'x is on top, so multiply by 6, don’t divide.']]), L_BOX('x'))
}
{
  // Your Turn Q1: the 43° angle, the adjacent 35 m, p the hypotenuse.
  const pts: Tri = [[0, 0], [35, 0], [0, 35 * Math.tan(rad(43))]]
  const t = (pp: TriSide, caption?: string) => trig(pts, 1, '43°', [{ label: '35 m' }, pp], 'A right-angled triangle: the side next to the 43° angle is 35 m, and p is the hypotenuse.', { caption })
  const p = t({ label: 'p', tone: 'x' })
  const exactP = 35 / Math.cos(rad(43))
  practice(length, 'Find the length of the side marked p, to 3 significant figures.', 'T2 Your Turn Q1 (book’s numbers)', p, number(47.9, '47.9 m'), 'A = 35 and H = p: CAH. p ends up on the bottom, so divide.', boardModel([], [
    { title: 'Pick the ratio', say: 'A = 35 and H = p: CAH, cos.', rows: ['cos 43° = {35|p}'], picture: t({ label: 'p (H)', tone: 'lit' }) },
    { title: 'p on the bottom', say: 'Times both sides by p, then divide by cos 43°.', rows: ['p × cos 43° = 35', 'p = {35|cos 43°} = 47.857…', '! p = 47.9 m'], picture: t({ label: '47.9 m', tone: 'found' }, 'p = 47.9 m') },
  ], 'Find p', p), slips(47.9, [[sf(35 * Math.cos(rad(43))), 'p is the hypotenuse, on the bottom of the fraction. Divide 35 by cos 43°.'], [sf(35 / Math.sin(rad(43))), 'sin needs the opposite. 35 is next to the angle: cos.'], [dp(exactP, 2), 'Round to 3 significant figures: 47.9.'], [48, 'That’s 2 significant figures. Three: 47.9.']]), L_BOX('p', 'm'))
}

/* ---------- Rung 3: a missing angle ---------- */

{
  // Example 2: the opposite 5 mm, the adjacent 8 mm, the angle z at the top.
  const pts: Tri = [[0, 0], [0, 8], [5, 0]]
  const t = (z: string, s: (TriSide | undefined)[], tone?: FigureTone, caption?: string) => trig(pts, 1, z, s, 'A right-angled triangle: the angle z at the top, 8 mm next to it and 5 mm opposite it.', { caption, tone })
  const given: (TriSide | undefined)[] = [{ label: '8 mm' }, undefined, { label: '5 mm' }]
  const p = t('z', given, 'x')
  worked(angle, 'Find the size of the angle z, to 2 significant figures.', 'A missing angle', 'T2 p159 Example 2 (book’s numbers)', boardModel([], [
    { title: 'Label the sides', say: 'From z: 5 is across, the opposite. 8 is next to it, the adjacent.', rows: ['>0 O = 5, A = 8: TOA'], picture: t('z', [{ label: '8 (A)', tone: 'lit' }, undefined, { label: '5 (O)', tone: 'lit' }], 'x') },
    { title: 'Write the equation', say: 'tan = opposite ÷ adjacent.', rows: ['tan z = {5|8}'], picture: t('z', given, 'lit') },
    { title: 'Inverse tan', say: 'To undo tan, use tan⁻¹ on the calculator (shift, tan).', rows: ['z = tan⁻¹ (5 ÷ 8) = 32.005…', '! z = 32°'], picture: t('32°', given, 'found', 'z = 32°') },
  ], 'Find z', p), 'To find an angle: label the sides, pick the ratio, and write it as a fraction. Then undo sin, cos or tan with sin⁻¹, cos⁻¹ or tan⁻¹.')
}
for (const q of [
  { ref: 'T2 p159 (own numbers)', letter: 'a', o: 0, a: 4, h: 9, fn: 'cos', right: 63.6 },
  { ref: 'T2 Your Turn Q2 (book’s numbers)', letter: 'q', o: 13, a: 0, h: 15, fn: 'sin', right: 60.1 },
  { ref: 'T2 Your Turn Q5 (book’s numbers)', letter: 'x', o: 4, a: 7, h: 0, fn: 'tan', right: 29.7 },
] as const) {
  // The angle at the bottom left, or at A on top for Q5 (AB = 7 up, BC = 4 across, the right angle at B).
  const adj = q.a || Math.sqrt(q.h ** 2 - q.o ** 2), opp = q.o || Math.sqrt(q.h ** 2 - q.a ** 2)
  const top = q.fn === 'tan'
  const pts: Tri = top ? [[0, 0], [opp, 0], [0, adj]] : [[adj, 0], [adj, opp], [0, 0]]
  const label = (n: number, unit = ' cm') => `${n}${unit}`
  const s = (tone?: FigureTone, mark = false): (TriSide | undefined)[] => {
    const O = q.o ? { label: mark ? `${q.o} (O)` : label(q.o), tone } : undefined
    const A = q.a ? { label: mark ? `${q.a} (A)` : label(q.a), tone } : undefined
    const H = q.h ? { label: mark ? `${q.h} (H)` : label(q.h), tone } : undefined
    return top ? [O, undefined, A] : [O, H, A]
  }
  const t = (m: string, list: (TriSide | undefined)[], tone?: FigureTone, caption?: string) => trig(pts, 2, m, list, `A right-angled triangle with the angle ${q.letter} marked and two sides given.`, { tone, caption })
  const p = t(q.letter, s(), 'x')
  const [n1, n2] = q.fn === 'sin' ? [q.o, q.h] : q.fn === 'cos' ? [q.a, q.h] : [q.o, q.a]
  const [k1, k2] = q.fn === 'sin' ? ['O', 'H'] : q.fn === 'cos' ? ['A', 'H'] : ['O', 'A']
  const value = deg(q.fn === 'sin' ? Math.asin(n1 / n2) : q.fn === 'cos' ? Math.acos(n1 / n2) : Math.atan(n1 / n2))
  const others = (['sin', 'cos', 'tan'] as const).filter(f => f !== q.fn).map(f => [dp(deg(f === 'sin' ? Math.asin(Math.min(1, n1 / n2)) : f === 'cos' ? Math.acos(Math.min(1, n1 / n2)) : Math.atan(n1 / n2))), `You have ${k1} and ${k2}: that’s ${q.fn === 'sin' ? 'SOH, sin' : q.fn === 'cos' ? 'CAH, cos' : 'TOA, tan'}.`] as [number, string])
  practice(angle, `Find the size of the angle marked ${q.letter}, to 1 decimal place.`, q.ref, p, number(q.right, `${q.right}°`), `Which two sides do you know, from ${q.letter}? Then use ${q.fn}⁻¹.`, boardModel([], [
    { title: 'Pick the ratio', say: `From ${q.letter}: ${k1} = ${n1} and ${k2} = ${n2}. That’s ${q.fn === 'sin' ? 'SOH' : q.fn === 'cos' ? 'CAH' : 'TOA'}.`, rows: [`${q.fn} ${q.letter} = {${n1}|${n2}}`], picture: t(q.letter, s('lit', true), 'lit') },
    { title: `Inverse ${q.fn}`, say: `Undo ${q.fn} with ${q.fn}⁻¹, then round to 1 decimal place.`, rows: [`${q.letter} = ${q.fn}⁻¹ (${n1} ÷ ${n2}) = ${value.toFixed(3)}…`, `! ${q.letter} = ${q.right}°`], picture: t(`${q.right}°`, s(), 'found', `${q.letter} = ${q.right}°`) },
  ], `Find ${q.letter}`, p), slips(q.right, [...others, [dp(n1 / n2, 3), `That’s ${q.fn} ${q.letter}. Use ${q.fn}⁻¹ to get the angle.`]]), A_BOX(q.letter))
}

/* ---------- Rung 4: exact values ---------- */

{
  // Example 3: the hypotenuse 10 cm, the angle 30°, y the adjacent.
  const pts: Tri = [[0, 0], [10 * Math.cos(rad(30)), 0], [0, 5]]
  const t = (y: TriSide, caption?: string) => trig(pts, 1, '30°', [y, { label: '10 cm' }], 'A right-angled triangle: the hypotenuse 10 cm, the angle 30°, and y the side next to it.', { caption })
  const p = t({ label: 'y', tone: 'x' })
  worked(exact, 'Find the exact value of y.', 'Exact values', 'T2 p159 Example 3 (book’s numbers)', boardModel([], [
    { title: 'Pick the ratio', say: 'H = 10 and A = y: CAH.', rows: ['cos 30° = {y|10}'], picture: t({ label: 'y (A)', tone: 'lit' }) },
    { title: 'Use the exact value', say: 'Learn the table: cos 30° is exactly √3 over 2. Put that in, with no calculator.', rows: ['{√3|2} = {y|10}'], picture: t({ label: 'y', tone: 'x' }) },
    { title: 'Times both sides', say: 'Multiply by 10: 10 halves is 5.', rows: ['y = 10 × {√3|2}', '! y = 5√3 cm'], picture: t({ label: '5√3 cm', tone: 'found' }, 'y = 5√3 cm') },
  ], 'Find y', p), 'Learn these exact values. sin 0°, 30°, 45°, 60°, 90° are 0, 1/2, 1/√2, √3/2, 1. cos runs the same list backwards. tan 0°, 30°, 45°, 60° are 0, 1/√3, 1, √3, and tan 90° has no value.')
}
{
  // Your Turn Q3: the two shorter sides both 2.
  const pts: Tri = [[2, 0], [2, 2], [0, 0]]
  const p = trig(pts, 2, 'w', [{ label: '2' }, undefined, { label: '2' }], 'A right-angled triangle with both shorter sides 2 and the angle w at the bottom left.')
  practice(exact, 'Write down the exact value of sin w.', 'T2 Your Turn Q3 (book’s numbers)', p, choose('1/√2', ['1/2', 'That’s sin 30°. Both sides are 2, so w is 45°.'], ['1', 'That’s tan w: 2 ÷ 2. sin is opposite over hypotenuse.'], ['√3/2', 'That’s sin 60°. Both sides are 2, so w is 45°.']), 'Find the hypotenuse with Pythagoras first, then sin = O ÷ H.', boardModel([], [
    { title: 'The hypotenuse', say: 'Pythagoras: 4 + 4 = 8.', rows: ['H² = 2² + 2² = 8', 'H = √(8)'], picture: trig(pts, 2, 'w', [{ label: '2' }, { label: '√8', tone: 'lit' }, { label: '2' }], 'The hypotenuse is the square root of 8.') },
    { title: 'Opposite over hypotenuse', say: '2 ÷ √8 is the same as 1 ÷ √2: the exact value of sin 45°.', rows: ['sin w = {2|√8}', '! sin w = {1|√2}'], picture: trig(pts, 2, '45°', [{ label: '2' }, { label: '√8' }, { label: '2' }], 'Two equal sides: w is 45°.', { tone: 'found' }) },
  ], 'sin w', p))
}
{
  // Your Turn Q4: the right angle at C, 30° at A, AB = 12.
  const pts: Tri = [[0, 0], [0, 12 * Math.cos(rad(30))], [-6, 0]]
  const names = ['C', 'A', 'B']
  const t = (cb: TriSide, caption?: string) => trig(pts, 1, '30°', [undefined, { label: '12 cm' }, cb], 'A right-angled triangle ABC: the right angle at C, 30° at A, AB is 12 cm and CB is missing.', { names, caption })
  const p = t({ label: '?', tone: 'x' })
  practice(exact, 'ABC is a right-angled triangle. Find the length of CB.', 'T2 Your Turn Q4 (book’s numbers)', p, number(6, '6 cm'), 'CB is opposite the 30°. sin 30° is exactly a half.', boardModel([], [
    { title: 'Pick the ratio', say: 'From the 30°: CB is opposite and AB = 12 is the hypotenuse. SOH.', rows: ['sin 30° = {CB|12}'], picture: t({ label: 'CB (O)', tone: 'lit' }) },
    { title: 'Use the exact value', say: 'sin 30° = 1/2, so CB is half of 12.', rows: ['CB = 12 × sin 30°', 'CB = 12 × {1|2}', '! CB = 6 cm'], picture: t({ label: '6 cm', tone: 'found' }, 'CB = 6 cm') },
  ], 'Find CB', p), slips(6, [[dp(12 * Math.cos(rad(30))), 'That’s cos. CB is opposite the 30°: sin.'], [24, 'Multiply by a half, don’t divide by it.'], [360, 'Use sin 30°, not 30.']]), L_BOX('CB'))
}
{
  const pts: Tri = [[0, 0], [3, 0], [0, 3]]
  const p = trig(pts, 1, '45°', [{ label: '1' }, undefined, { label: '1' }], 'A right-angled triangle with two equal sides of 1 and a 45° angle.')
  practice(exact, 'What is the exact value of tan 45°?', 'T2 p159 Trigonometry Common Values', p, choose('1', ['0', 'That’s tan 0°.'], ['1/√2', 'That’s sin 45° and cos 45°.'], ['√3', 'That’s tan 60°.']), 'tan = opposite ÷ adjacent. At 45°, they’re equal.', boardModel([], [
    { title: 'Opposite over adjacent', say: 'A 45° right-angled triangle has two equal sides, so opposite ÷ adjacent is 1.', rows: ['tan 45° = {1|1}', '! tan 45° = 1'], picture: trig(pts, 1, '45°', [{ label: '1 (A)', tone: 'lit' }, undefined, { label: '1 (O)', tone: 'lit' }], 'Opposite and adjacent are equal.', { tone: 'found' }) },
  ], 'tan 45°', p))
}

add('mixed', 'Trigonometry', 'T2 consolidation', text(
  'Label the sides from the angle: hypotenuse (opposite the right angle), opposite (across from the angle), adjacent (next to it).',
  'SOH CAH TOA: sin = O ÷ H, cos = A ÷ H, tan = O ÷ A.',
  'A missing side: write the equation, then multiply, or divide if the unknown is on the bottom.',
  'A missing angle: use sin⁻¹, cos⁻¹ or tan⁻¹. Learn the exact values at 0°, 30°, 45°, 60° and 90°.',
))

export const tutorTrigonometryLesson: TutorMethodLesson = {
  id: 'L220', number: 220, title: 'Trigonometry', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Label the sides of a right-angled triangle, use SOHCAHTOA to find a missing side or angle, and know the exact values.',
  labels: { [sides]: 'Naming the sides', [length]: 'A missing length', [angle]: 'A missing angle', [exact]: 'Exact values', mixed: 'Review' },
  states: finish(),
}
