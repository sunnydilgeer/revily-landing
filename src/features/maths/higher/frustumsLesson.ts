/*
 * Geometry 15H: Frustums, a Higher-only lesson after Surface area, as in the book. From the Higher revision guide, GM18
 * Frustums (Level 6-7 and 8-9, p213–215): a frustum is a cone or pyramid with its top cut off parallel to the base; its
 * volume is the whole shape's take away the piece removed, which is similar to the whole. The book's Example 1 (square
 * base 5 cm, top 3 cm, heights 15 and 6 cm: 125 − 27 = 98 cm³), Example 2 (cone 36 mm tall, radius 15 mm, 12 mm
 * removed: 2600π mm³), and Your Turn Q1 to Q5. Q5 gives the top as 7 cm wide, but a top cut 14 cm below the apex of a
 * pyramid 20 cm tall on an 11 cm base is 11 × 14 ÷ 20 = 7.7 cm, so we use 7.7 cm. Each rounded answer is worked out
 * here from Math.PI and Math.sqrt.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens } from '../../geometry/tutor/figureLesson'
import { DEPTH, ellipse, frustum } from '../../geometry/tutor/solidPictures'
import { asks, figure } from './figureHelpers'

const a = author(215.5, 'L215H')
const { add, finish } = a
const { worked } = screens(a)
const ask = asks(a)
const volume = 'frustum-volume'
const lengths = 'frustum-lengths'
const surface = 'frustum-surface'

type Pt = FigurePoint
type Label = { label: string; tone?: FigureTone }
const RY = 0.32
const pic = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => figure(items, spoken, caption, 16)
/** Rounded for the screen, with … when it carries on. */
const cut = (n: number, places = 3) => `${n.toFixed(places)}…`

/* ---------- Pictures ---------- */

/**
 * A cone of radius R and height H (in the question's units, drawn `s` to the unit across and `v` up) with its top cut
 * off `f` up: the frustum drawn solid, the cone removed dashed above it. The book's cones and pyramids are tall and
 * thin; drawn true they would be tiny, so the height is squashed (`v` below `s`) and the labels carry the sizes.
 */
function coneFrustum(R: number, H: number, f: number, s: number, v: number, labels: { R?: Label; r?: Label; H?: Label; f?: Label; slant?: Label; fslant?: Label } = {}, lit?: 'removed'): FigureItem[] {
  const R_ = R * s, H_ = H * v, f_ = f * v, r_ = R_ * (H - f) / H
  const apex: Pt = [0, H_]
  const items: FigureItem[] = [
    { kind: 'shape', points: ellipse([0, 0], R_, R_ * RY, 180, 360), open: true },
    { kind: 'shape', points: ellipse([0, 0], R_, R_ * RY, 0, 180), open: true, dashed: true },
    { kind: 'line', from: [-R_, 0], to: [-r_, f_] }, { kind: 'line', from: [R_, 0], to: [r_, f_] },
    { kind: 'shape', points: ellipse([0, f_], r_, r_ * RY), fill: 'none', ...(lit === 'removed' ? { lit: true } : {}) },
    { kind: 'line', from: [-r_, f_], to: apex, style: lit === 'removed' ? 'lit' : 'dashed' }, { kind: 'line', from: [r_, f_], to: apex, style: lit === 'removed' ? 'lit' : 'dashed' },
  ]
  if (labels.R) items.push({ kind: 'line', from: [0, 0], to: [R_, 0] }, { kind: 'point', at: [0, 0] }, { kind: 'text', at: [R_ / 2, 0], text: labels.R.label, tone: labels.R.tone, dy: 15 })
  if (labels.r) items.push({ kind: 'line', from: [0, f_], to: [r_, f_] }, { kind: 'point', at: [0, f_] }, { kind: 'text', at: [r_, f_], text: labels.r.label, tone: labels.r.tone, dx: 26, dy: -6 })
  if (labels.H) items.push({ kind: 'measure', from: [-R_ - 0.4, 0], to: [-R_ - 0.4, H_], label: labels.H.label, tone: labels.H.tone, offset: -8, side: -1 })
  if (labels.f) items.push({ kind: 'measure', from: [R_ + 0.4, 0], to: [R_ + 0.4, f_], label: labels.f.label, tone: labels.f.tone, offset: 8 })
  if (labels.slant) items.push({ kind: 'measure', from: [-R_, 0], to: apex, label: labels.slant.label, tone: labels.slant.tone, offset: -12, side: -1 })
  if (labels.fslant) items.push({ kind: 'measure', from: [R_, 0], to: [r_, f_], label: labels.fslant.label, tone: labels.fslant.tone, offset: 12 })
  return items
}

/** A square-based pyramid, base b and height H (drawn `s` to the unit across and `v` up), with its top cut off `f` up. */
function pyramidFrustum(b: number, H: number, f: number, s: number, v: number, labels: { b?: Label; t?: Label; H?: Label; f?: Label } = {}, lit?: 'removed' | 'face'): FigureItem[] {
  const b_ = b * s, H_ = H * v, f_ = f * v, t_ = b_ * (H - f) / H
  const mid: Pt = [(b_ + DEPTH[0] * b_) / 2, DEPTH[1] * b_ / 2], apex: Pt = [mid[0], mid[1] + H_]
  const inset = (b_ - t_) / 2, g0: Pt = [inset + DEPTH[0] * inset, f_ + DEPTH[1] * inset], g1: Pt = [g0[0] + t_, g0[1]]
  const h1: Pt = [g1[0] + DEPTH[0] * t_, g1[1] + DEPTH[1] * t_], h0: Pt = [g0[0] + DEPTH[0] * t_, g0[1] + DEPTH[1] * t_]
  const style = lit === 'removed' ? 'lit' as const : 'dashed' as const
  const items: FigureItem[] = [...frustum(b_, t_, f_), ...[g0, g1, h1, h0].map(p => ({ kind: 'line' as const, from: p, to: apex, style }))]
  if (lit === 'face') items.push({ kind: 'shape', points: [[0, 0], [b_, 0], g1, g0], fill: 'part', lit: true })
  if (labels.b) items.push({ kind: 'measure', from: [0, 0], to: [b_, 0], label: labels.b.label, tone: labels.b.tone, offset: 10 })
  if (labels.t) items.push({ kind: 'text', at: [(g0[0] + g1[0]) / 2, g0[1]], text: labels.t.label, tone: labels.t.tone, dy: 14, small: true })
  if (labels.H) items.push({ kind: 'measure', from: [-0.6, 0], to: [-0.6, apex[1]], label: labels.H.label, tone: labels.H.tone, offset: -8, side: -1 })
  if (labels.f) items.push({ kind: 'measure', from: [b_ + DEPTH[0] * b_ + 0.4, 0], to: [b_ + DEPTH[0] * b_ + 0.4, f_], label: labels.f.label, tone: labels.f.tone, offset: 8 })
  return items
}

/* ---------- Volume ---------- */

add(volume, 'Frustums', 'Higher GM18 Volume of Frustums', text(
  'A frustum is what is left of a cone or pyramid after its top is cut off, parallel to the base.',
  'Volume of a frustum = volume of the whole cone (or pyramid) − volume of the piece cut off.',
  'Cone: V = ⅓πr²h. Pyramid: V = ⅓ × area of base × height.',
  'The piece cut off is similar to the whole shape, so you can find its sizes with the scale factor.',
))

{
  // Example 1: base 5 cm, top 3 cm, whole pyramid 15 cm tall, frustum 6 cm.
  const draw = (lit?: 'removed', caption?: string) => pic(pyramidFrustum(5, 15, 6, 0.7, 0.3, { b: { label: '5 cm' }, t: { label: '3 cm', tone: lit ? 'lit' : 'given' }, H: { label: '15 cm' }, f: { label: '6 cm' } }, lit),
    'A square-based pyramid with base 5 cm and height 15 cm. Its top is cut off 6 cm up, leaving a frustum with a 3 cm square top.', caption)
  worked(volume, 'This frustum is cut from a square-based pyramid 15 cm tall. Calculate its volume.', 'Volume of a pyramid frustum', 'Higher GM18 Example 1 (p213)', boardModel([], [
    { title: 'The whole pyramid', say: 'First the pyramid before its top was cut off: base 5 by 5, height 15.', rows: ['V = {1|3} × 5² × 15 = 125 cm³'], picture: draw() },
    { title: 'The piece cut off', say: 'The small pyramid on top has a 3 by 3 base and is 15 − 6 = 9 cm tall.', rows: ['h = 15 − 6 = 9 cm', 'V = {1|3} × 3² × 9 = 27 cm³'], picture: draw('removed') },
    { title: 'Take it away', say: 'The frustum is the whole pyramid without the top.', rows: ['V = 125 − 27', '! V = 98 cm³'], picture: draw(undefined, 'V = 98 cm³') },
  ], 'Find V', draw()), 'Frustum = whole pyramid − small pyramid. The small pyramid’s height is the whole height take away the frustum’s.')
}

{
  // Example 2: cone 36 mm tall, radius 15 mm, the top 12 mm removed.
  const draw = (lit?: 'removed', r = '', caption?: string) => pic(coneFrustum(15, 36, 24, 0.17, 0.12, { R: { label: '15 mm' }, H: { label: '36 mm' }, ...(r ? { r: { label: r, tone: 'found' as const } } : {}) }, lit),
    'A cone 36 mm tall with base radius 15 mm. The top 12 mm is cut off, leaving a frustum.', caption)
  worked(volume, 'A cone 36 mm tall with radius 15 mm has its top 12 mm cut off. Work out the volume of the frustum, in terms of π.', 'Volume of a cone frustum', 'Higher GM18 Example 2 (p213)', boardModel([], [
    { title: 'The whole cone', say: 'The original cone: radius 15, height 36. Leave π in.', rows: ['V = {1|3}π × 15² × 36 = 2700π mm³'], picture: draw() },
    { title: 'The small radius', say: 'The cone cut off is similar to the whole cone: 12 mm tall instead of 36, so its radius is 12 ÷ 36 of 15.', rows: ['{12|36} = {r|15}', 'r = {12|36} × 15 = 5 mm'], picture: draw('removed', '5 mm') },
    { title: 'The cone cut off', say: 'Radius 5, height 12.', rows: ['V = {1|3}π × 5² × 12 = 100π mm³'], picture: draw('removed', '5 mm') },
    { title: 'Take it away', say: 'Whole cone take away the small one.', rows: ['V = 2700π − 100π', '! V = 2600π mm³'], picture: draw(undefined, '5 mm', 'V = 2600π mm³') },
  ], 'Find V', draw()), 'The cone cut off is similar to the whole cone, so its radius is the same fraction of the big radius as its height is of the big height.')
}

{
  // Your Turn Q1: cone 50 cm tall, radius 10 cm, frustum 30 cm tall.
  const big = Math.PI * 100 * 50 / 3, small = Math.PI * 16 * 20 / 3, V = Number((big - small).toPrecision(3))
  const p = pic(coneFrustum(10, 50, 30, 0.26, 0.09, { R: { label: '10 cm' }, H: { label: '50 cm' }, f: { label: '30 cm' } }), 'A cone 50 cm tall with base radius 10 cm. The frustum left at the bottom is 30 cm tall.')
  ask(volume, 'This frustum is cut from a cone 50 cm tall with base radius 10 cm. The frustum is 30 cm tall. Work out its volume, to 3 significant figures.', 'Higher GM18 Your Turn Q1 (Level 6-7)', p, number(V, `${V} cm³`), `${V} cm³`, 'Find the small cone’s height and radius first.', {
    kind: 'step-worked', start: 'Cone: r = 10 cm, h = 50 cm. Frustum 30 cm tall', steps: [
      { title: 'The small cone', why: 'The cone cut off is the top part, and is similar to the whole cone.', lines: [line([part('50'), sign('−'), part('30')], '20 cm'), line([part('10'), sign('×'), part('20'), sign('÷'), part('50')], '4 cm')] },
      { title: 'Both volumes', why: 'A third of pi r squared h for each cone.', lines: [line([part('⅓π × 10² × 50')], cut(big)), line([part('⅓π × 4² × 20')], cut(small))] },
      { title: 'Take it away', why: 'Whole cone take away the small one, then round to three significant figures.', lines: [line([part(cut(big)), sign('−'), part(cut(small))], `${V} cm³`, { answer: true })] },
    ],
  }, { label: 'Volume (cm³)', prefix: 'V =' })
}

{
  // Your Turn Q5, with the top corrected to 7.7 cm: a triangular pyramid 20 cm tall, frustum 6 cm tall.
  const base = Math.sqrt(3) / 4 * 121, big = base * 20 / 3, small = big * 0.343, V = Number((big - small).toFixed(1))
  // Drawn like the book: a triangular base, the apex above, the top 14 cm dashed.
  const s = 0.36, A: Pt = [0, 0], B: Pt = [11 * s, 0], C: Pt = [5.5 * s + DEPTH[0] * 6 * s, DEPTH[1] * 6 * s]
  const apex: Pt = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3 + 20 * 0.22]
  const up = (p: Pt): Pt => [p[0] + 0.3 * (apex[0] - p[0]), p[1] + 0.3 * (apex[1] - p[1])]
  const [a2, b2, c2] = [up(A), up(B), up(C)]
  const items: FigureItem[] = [
    { kind: 'line', from: A, to: B }, { kind: 'line', from: B, to: C, style: 'dashed' }, { kind: 'line', from: C, to: A, style: 'dashed' },
    { kind: 'line', from: A, to: a2 }, { kind: 'line', from: B, to: b2 }, { kind: 'line', from: C, to: c2, style: 'dashed' },
    { kind: 'shape', points: [a2, b2, c2], fill: 'none' },
    ...[a2, b2, c2].map(p => ({ kind: 'line' as const, from: p, to: apex, style: 'dashed' as const })),
    { kind: 'measure', from: A, to: B, label: '11 cm', offset: 10 },
    { kind: 'text', at: [(a2[0] + b2[0]) / 2, a2[1]], text: '7.7 cm', dy: 14, small: true },
    { kind: 'measure', from: [-0.6, 0], to: [-0.6, apex[1]], label: '20 cm', offset: -8, side: -1 },
    { kind: 'measure', from: [B[0] + 1.2, 0], to: [B[0] + 1.2, a2[1]], label: '6 cm', offset: 8 },
  ]
  const p = pic(items, 'A triangular pyramid 20 cm tall on an equilateral triangle base of side 11 cm. Its top is cut off 6 cm up, leaving a frustum whose top is an equilateral triangle of side 7.7 cm.')
  ask(volume, 'A pyramid 20 cm tall has an equilateral triangle base of side 11 cm. Its top is cut off, leaving a frustum 6 cm tall with a top of side 7.7 cm. Calculate the volume of the frustum, to 1 decimal place.', 'Higher GM18 Your Turn Q5 (Level 8-9, top corrected to 7.7 cm)', p,
    number(V, `${V} cm³`), `${V} cm³`, 'The pyramid cut off is 14 cm tall: a scale factor of 14 ÷ 20 from the whole one.', {
      kind: 'step-worked', start: 'Base side 11 cm, height 20 cm, frustum 6 cm tall', steps: [
        { title: 'Area of the base', why: 'An equilateral triangle: a half times side times side times sin sixty.', lines: [line([part('½ × 11 × 11 × sin 60°')], cut(base))] },
        { title: 'The whole pyramid', why: 'A third of the base area times the height.', lines: [line([part(cut(base)), sign('×'), part('20'), sign('÷'), part('3')], cut(big))] },
        { title: 'The scale factor', why: 'The pyramid cut off is fourteen tall out of twenty. Cube it for volumes.', lines: [line([part('14'), sign('÷'), part('20')], '0.7'), line([part('0.7'), sign('×'), part('0.7'), sign('×'), part('0.7')], '0.343')] },
        { title: 'Take it away', why: 'The small pyramid is the whole one times the volume scale factor. Subtract it.', lines: [line([part(cut(big)), sign('×'), part('0.343')], cut(small)), line([part(cut(big)), sign('−'), part(cut(small))], `${V} cm³`, { answer: true })] },
      ],
    }, { label: 'Volume (cm³)', prefix: 'V =' })
}

/* ---------- Lengths ---------- */

{
  // Your Turn Q3: cone r = 7 cm, h = 10 cm, a cone of radius 3 cm cut from its top.
  const small = 30 / 7, f = Number((10 - small).toFixed(2))
  const p = pic(coneFrustum(7, 10, 10 - small, 0.38, 0.42, { R: { label: '7 cm' }, r: { label: '3 cm' }, H: { label: '10 cm' } }), 'A cone 10 cm tall with base radius 7 cm. A small cone of radius 3 cm is cut from its top.')
  ask(lengths, 'A cone with radius 7 cm and height 10 cm has a smaller cone of radius 3 cm cut from its top. Find the height of the frustum, to 2 decimal places.', 'Higher GM18 Your Turn Q3 (Level 6-7)', p, number(f, `${f} cm`), `${f} cm`, 'The small cone is similar: its height is 3 ÷ 7 of 10.', {
    kind: 'step-worked', start: 'Cone: r = 7 cm, h = 10 cm. Small cone r = 3 cm', steps: [
      { title: 'The small cone', why: 'The cone cut off is similar to the whole cone, so its height is the same fraction of ten as three is of seven.', lines: [line([part('3'), sign('÷'), part('7'), sign('×'), part('10')], cut(small, 4))] },
      { title: 'Take it away', why: 'The frustum is the rest of the height. Round to two decimal places.', lines: [line([part('10'), sign('−'), part(cut(small, 4))], `${f} cm`, { answer: true })] },
    ],
  }, { label: 'Height (cm)', prefix: 'h =' })
}

{
  // Your Turn Q4: cone r = 12 cm, slant 15 cm, a cone of radius 3 cm cut from its top.
  const H = Math.sqrt(15 ** 2 - 12 ** 2)
  const p = pic(coneFrustum(12, H, H * 0.75, 0.22, 0.45, { R: { label: '12 cm' }, r: { label: '3 cm' }, slant: { label: '15 cm' }, fslant: { label: 'x cm', tone: 'x' } }), 'A cone with base radius 12 cm and slant height 15 cm. A small cone of radius 3 cm is cut from its top, leaving a frustum with slant height x.')
  ask(lengths, 'A cone has radius 12 cm and slant height 15 cm. A smaller cone of radius 3 cm is cut from its top. Find the slant height, x, of the frustum.', 'Higher GM18 Your Turn Q4 (Level 8-9)', p, number(11.25, '11.25 cm'), '11.25 cm', 'The small cone is similar: its slant height is 3 ÷ 12 of 15.', {
    kind: 'step-worked', start: 'Cone: r = 12 cm, slant 15 cm. Small cone r = 3 cm', steps: [
      { title: 'The scale factor', why: 'The small cone is similar to the whole one: compare the radii.', lines: [line([part('3'), sign('÷'), part('12')], '0.25')] },
      { title: 'Its slant height', why: 'Every length of the small cone is a quarter of the big one’s.', lines: [line([part('15'), sign('×'), part('0.25')], '3.75')] },
      { title: 'Take it away', why: 'The frustum’s slant is the rest of the big slant height.', lines: [line([part('15'), sign('−'), part('3.75')], '11.25 cm', { answer: true })] },
    ],
  }, { label: 'Slant height (cm)', prefix: 'x =' })
}

/* ---------- Surface area ---------- */

{
  // Our own: a pyramid with base 6 cm and height 4 cm, cut halfway up.
  const draw = (lit?: 'face', caption?: string) => pic(pyramidFrustum(6, 4, 2, 0.6, 0.9, { b: { label: '6 cm' }, t: { label: '3 cm' }, H: { label: '4 cm' }, f: { label: '2 cm' } }, lit),
    'A square-based pyramid with base 6 cm and height 4 cm, cut halfway up, leaving a frustum with a 3 cm square top.', caption)
  worked(surface, 'Find the surface area of this frustum, cut halfway up a square-based pyramid.', 'Surface area of a frustum', 'Higher GM18 Surface area (own numbers)', boardModel([], [
    { title: 'Slant height of a face', say: 'Each sloping face is a triangle on the whole pyramid. Its height runs from the middle of a base edge up to the apex: Pythagoras with the height 4 and half the base, 3.', rows: ['l² = 4² + 3² = 25', 'l = 5 cm'], picture: draw() },
    { title: 'One sloping face', say: 'A big triangle take away the small one cut off with it. The small one is half the size: base 3, slant 2.5.', rows: ['Face = {1|2} × 6 × 5 − {1|2} × 3 × 2.5', '= 15 − 3.75 = 11.25 cm²'], picture: draw('face') },
    { title: 'Add every face', say: 'Four sloping faces, the 6 by 6 base and the 3 by 3 top.', rows: ['Area = 4 × 11.25 + 36 + 9', '! Surface area = 90 cm²'], picture: draw(undefined, 'Surface area = 90 cm²') },
  ], 'Find the area', draw()), 'A frustum’s surface is its base, its top and its sloping faces. Each sloping face is a trapezium: a big triangle take away a small one.')
}

{
  // Your Turn Q2: base 8 m, top 4 m, pyramid 7.5 m tall.
  const p = pic(pyramidFrustum(8, 7.5, 3.75, 0.5, 0.55, { b: { label: '8 m' }, t: { label: '4 m' }, H: { label: '7.5 m' } }), 'A square-based pyramid 7.5 m tall with base 8 m. Its top is cut off, leaving a frustum with a 4 m square top.')
  ask(surface, 'This frustum is cut from a square-based pyramid with height 7.5 m and base 8 m. Its top is 4 m across. Work out its surface area.', 'Higher GM18 Your Turn Q2 (Level 6-7)', p, number(182, '182 m²'), '182 m²', 'Find the slant height of a sloping face with Pythagoras: the height and half the base.', {
    kind: 'step-worked', start: 'Base 8 m, top 4 m, pyramid 7.5 m tall', steps: [
      { title: 'Slant height', why: 'Pythagoras with the height and half the base, then square root.', lines: [line([part('56.25'), sign('+'), part('16')], '72.25'), line([part('√72.25')], '8.5')] },
      { title: 'One sloping face', why: 'The top is half the base, so the small triangle has half the base and half the slant height.', lines: [line([part('0.5'), sign('×'), part('8'), sign('×'), part('8.5')], '34'), line([part('0.5'), sign('×'), part('4'), sign('×'), part('4.25')], '8.5'), line([part('34'), sign('−'), part('8.5')], '25.5')] },
      { title: 'Add every face', why: 'Four sloping faces, the base and the top.', lines: [line([part('4'), sign('×'), part('25.5')], '102'), line([part('102'), sign('+'), part('64'), sign('+'), part('16')], '182 m²', { answer: true })] },
    ],
  }, { label: 'Surface area (m²)', prefix: 'Area =' })
}

add('mixed', 'Frustums', 'Higher GM18 consolidation', text(
  'Frustum volume = whole cone or pyramid − the piece cut off.',
  'The piece cut off is similar to the whole: use the scale factor for its radius, height or slant height.',
  'Surface area: the base, the top, and each sloping face as a big triangle take away a small one.',
  'For a cone frustum, leave π in until the end, or round only at the last step.',
))

export const tutorFrustumsLesson: TutorMethodLesson = {
  id: 'L215H', number: 215.5, title: 'Frustums', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  calmColours: true,
  goal: 'Find the volume and surface area of a frustum, using the cone or pyramid cut off its top.',
  labels: { [volume]: 'Volume of a frustum', [lengths]: 'Missing lengths', [surface]: 'Surface area', mixed: 'Review' },
  states: finish(),
}
