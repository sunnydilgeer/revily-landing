import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { figure, graphModel, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { lineAnswer } from '../../lines/tutor/lineWorkings'
import { amount, at, crossMoves, drawLineMoves, fixedMove, rateMoves, readAcross, readUp, rlGrid, scaleUpMoves, slips, yOf, type Amount, type Line } from './realLifeWorkings'

/*
 * Graphs lesson 8: Real-life graphs. From GR9 (p88–90: a gradient is a rate of change; a conversion graph; a fixed
 * charge plus an amount a day), with our own numbers. Three rungs, easiest first: conversion graphs (read up and
 * across, and scale up for an amount off the graph); the gradient is a rate; a fixed charge plus a rate. Hands-on
 * (Sunny, 7 Oct): it opens with a play screen where the dot slides along a conversion line, and some questions are
 * answered on the graph board: tap a point, draw a cost line.
 *
 * Hidden on live like lessons 1 to 7: not in the course registry; only the hidden Graphs shelf opens it.
 */

export const REAL_LIFE_MEDIA_ID = 'graphs-8-b71d0e46'
const { add, finish } = author(108)
const convert = 'graphs-real-convert'
const rates = 'graphs-real-rate'
const fixed = 'graphs-real-fixed'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: GraphBoardSpec) {
  const state = add(topic, title, sourceRef, text(title))
  state.board = spec
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = title
  return state
}
type Answer = { interaction: InteractionDefinition; board?: GraphBoardSpec; picture?: GraphGrid; prefix?: string }
function practice(topic: MicroSkillId, title: string, sourceRef: string, answer: Answer, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const { interaction } = answer
  const shown = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, answer.picture ? figure(answer.picture) : text(title), interaction, working(shown, ...workingSteps(model)), hint)
  state.working = model
  state.board = answer.board
  if (diagnose) state.diagnose = diagnose
  if (answer.prefix) state.answerPrefix = answer.prefix
  return state
}

/* ---------- Rung 1: conversion graphs ---------- */

// Pounds to euros: £1 is €1.20, so £50 is €60.
const pounds: Amount = { before: '£', name: '£', per: 10 }, euros: Amount = { before: '€', name: '€', per: 10 }
const euro: Line = { m: 1.2, c: 0 }
const euroGrid = rlGrid(pounds, 80, euros, 100, [euro])
explore(convert, 'Slide the dot along the line. Watch pounds turn into euros.', 'GR9 p90 Q3 Conversion graphs (play)',
  { mode: 'rule', rule: { m: 1.2, c: 0 }, grid: euroGrid, start: pt(10, 12), reads: ['£', '€'] })
worked(convert, 'Use the graph to change £50 into euros.', 'GR9 p90 Q3 Conversion graphs (own numbers)',
  graphModel('£50 into euros', euroGrid, [readUp(euro, pounds, euros, 50)], 'Up, then across'),
  'A conversion graph changes one amount into another. Start at the amount you have, go to the line, then across or down to the other axis.').video = {
  id: 'graphs-8-real-life', src: `/media/${REAL_LIFE_MEDIA_ID}/real-life.mp4`, poster: `/media/${REAL_LIFE_MEDIA_ID}/real-life.svg`,
  title: 'Real-life graphs', durationSeconds: 70, sourceFile: 'GR9.1_Real_life_graphs.mp4 (tools/lesson-kit/packs/GR9.1-real-life-graphs.cjs)',
  textAlternative: [
    'Real-life graphs show how one amount changes with another: euros with pounds, litres with minutes, cost with hours.',
    'A conversion graph: up from £50 to the line, then across to the euro axis: €60. For £400, read £40 = €48, then times 10: €480.',
    'The gradient is a rate: a bath fills with 120 litres in 10 minutes, so 120 ÷ 10 = 12 litres a minute.',
    'A plumber charges £40 to come out, then £20 an hour. The line starts at £40, the fixed charge, and its gradient is £20 an hour.',
    'Recap: read up to the line and across; the gradient is the rate, the amount up for each one across; where the line starts is the fixed charge.',
  ],
}
practice(convert, 'Use the graph to change €30 into pounds.', 'GR9 p90 Q3 (own numbers)', { interaction: amount(25, '£25'), picture: euroGrid, prefix: '£' },
  'Across from €30 to the line, then down to the pounds.', graphModel('€30 into pounds', euroGrid, [readAcross(euro, pounds, euros, 30)], 'Across, then down'),
  slips([[36, 'That changes £30 into euros. Start at €30 on the euro axis.']]))
practice(convert, 'Tap the point on the line that shows €60 in pounds.', 'GR9 p90 Q3 (own numbers)', { interaction: at(pt(50, 60), '£50'), board: { mode: 'plot', grid: euroGrid } },
  'Across from €60 to the line.', graphModel('€60 in pounds', euroGrid, [readAcross(euro, pounds, euros, 60)], 'Across, then down'),
  response => response.replace(/\s/g, '') === '60,72' ? 'That’s £60. Start at €60 on the euro axis, then across to the line.' : null)
practice(convert, 'Lena changes £400 into euros. The graph only goes to £80. How many euros does she get?', 'GR9 p90 Q3: an amount off the graph (own numbers)',
  { interaction: amount(480, '€480'), picture: euroGrid, prefix: '€' }, '£400 is 10 lots of £40. Read £40, then times 10.',
  graphModel('£400 into euros', euroGrid, scaleUpMoves(euro, pounds, euros, 400, 10), 'Read, then scale up'),
  slips([[48, 'That’s £40. £400 is 10 times as much.'], [40, '£40 is the amount to read on the graph: go up to the line, across to euros, then times 10.']]))

/* ---------- Rung 2: the gradient is a rate ---------- */

{
  const minutes: Amount = { after: ' min', name: 'minutes', per: 2 }, litres: Amount = { after: ' litres', name: 'litres', per: 20 }
  const bath: Line = { m: 12, c: 0 }
  worked(rates, 'A bath fills at a steady rate. How many litres a minute go in?', 'GR9 p89 Gradient represents a rate of change (own numbers)',
    graphModel('litres a minute', rlGrid(minutes, 14, litres, 160, [bath]), rateMoves(pt(0, 0), pt(10, 120), minutes, litres, 'litres a minute'), 'Up ÷ across'),
    'The gradient of a real-life graph is a rate: how much the amount up changes for each one across. Litres up, minutes across: litres a minute.')
}
{
  const seconds: Amount = { after: ' s', name: 'seconds', per: 1 }, mb: Amount = { after: ' MB', name: 'MB', per: 10 }
  const download: Line = { m: 15, c: 0 }
  practice(rates, 'A phone downloads a file at a steady rate. How many MB a second?', 'GR9 p89 A: litres per second (own numbers)',
    { interaction: amount(15, '15 MB a second'), picture: rlGrid(seconds, 8, mb, 100, [download]), prefix: 'MB a second =' },
    'Pick two points on the line: up ÷ across.', graphModel('MB a second', rlGrid(seconds, 8, mb, 100, [download]), rateMoves(pt(0, 0), pt(6, 90), seconds, mb, 'MB a second'), 'Up ÷ across'),
    slips([[90, 'That’s the MB after 6 seconds. Divide by the seconds it took.'], [1 / 15, 'Up ÷ across: MB ÷ seconds.']]))
}
{
  const kg: Amount = { after: ' kg', name: 'kg', per: 1 }, cost: Amount = { before: '£', name: '£', per: 2 }
  const apples: Line = { m: 3, c: 0 }
  practice(rates, 'The graph shows the cost of apples. What does its gradient tell you?', 'GR9 p89 B: price per day (concept)', { interaction: choose(
    'The cost of 1 kg',
    ['The total cost', 'The total is read off the line. The gradient is how much the cost goes up for each kg.'],
    ['How many kg you buy', 'That’s the amount across. The gradient is the cost up for each kg across.'],
    ['The cost when you buy nothing', 'That’s where the line starts: £0. The gradient is how steep it is.'],
  ), picture: rlGrid(kg, 7, cost, 20, [apples]) }, 'Up ÷ across: £ ÷ kg.', graphModel('£ a kg', rlGrid(kg, 7, cost, 20, [apples]), rateMoves(pt(0, 0), pt(2, 6), kg, cost, 'a kg'), 'Up ÷ across'))
}
{
  const minutes: Amount = { after: ' min', name: 'minutes', per: 2 }, litres: Amount = { after: ' litres', name: 'litres', per: 10 }
  const tank: Line = { m: -10, c: 80 }
  practice(rates, 'A tank drains at a steady rate. How many litres a minute drain out?', 'GR9 p89 Rate of change: falling (own numbers)',
    { interaction: amount(10, '10 litres a minute'), picture: rlGrid(minutes, 12, litres, 90, [tank]), prefix: 'litres a minute =' },
    'Down ÷ across, from the full tank to empty.', graphModel('litres a minute', rlGrid(minutes, 12, litres, 90, [tank]), rateMoves(pt(0, 80), pt(8, 0), minutes, litres, 'litres a minute'), 'Down ÷ across'),
    slips([[80, 'That’s how much was in the tank. Divide by the minutes it took to drain.'], [-10, 'It drains 10 litres a minute: the line goes down because the water is going out.']]))
}

/* ---------- Rung 3: a fixed charge plus a rate ---------- */

const hours: Amount = { after: ' h', name: 'hours', per: 1 }
{
  const pounds20: Amount = { before: '£', name: '£', per: 20 }
  const plumber: Line = { m: 20, c: 40 }
  const g = rlGrid(hours, 7, pounds20, 180, [plumber])
  worked(fixed, 'A plumber’s charges are shown. How much does a 3-hour job cost?', 'GR9 p90 Q2 Flat rate plus an amount (own numbers)',
    graphModel('a 3-hour job', g, [fixedMove(plumber, pounds20, 'The line starts at £40, at 0 hours: £40 just to come out. That’s the fixed charge.'), ...rateMoves(pt(0, 40), pt(1, 60), hours, pounds20, 'an hour').slice(0, 2), readUp(plumber, hours, pounds20, 3, '3 hours')], 'Start, rate, read'),
    'Where the line starts on the cost axis is the fixed charge, paid before any work. Its gradient is the rate: £20 more for each hour.')
}
{
  const days: Amount = { after: ' days', name: 'days', per: 1 }, cost: Amount = { before: '£', name: '£', per: 5 }
  const bike: Line = { m: 5, c: 10 }
  const g = rlGrid(days, 7, cost, 45, [bike])
  practice(fixed, 'The graph shows the cost of hiring a bike. What is the fixed charge?', 'GR9 p90 Q2 (own numbers)', { interaction: amount(10, '£10'), picture: g, prefix: '£' },
    'Where does the line start, at 0 days?', graphModel('the fixed charge', g, [{ ...fixedMove(bike, cost), adds: 'answer', change: (frame, step) => ({ ...fixedMove(bike, cost).change(frame, step), answer: { text: '£10', at: step } }) }], 'Where it starts'),
    slips([[5, '£5 is how much each day adds. The fixed charge is where the line starts, at 0 days.']]))
  practice(fixed, 'How much does each extra day of bike hire cost?', 'GR9 p90 Q2 (own numbers)', { interaction: amount(5, '£5 a day'), picture: g, prefix: '£' },
    'Up ÷ across between two points on the line.', graphModel('£ a day', g, rateMoves(pt(0, 10), pt(6, 40), days, cost, 'a day'), 'Up ÷ across'),
    slips([[40 / 6, 'Don’t start from £0: the line starts at £10. Up from £10 to £40 is £30, over 6 days.'], [10, '£10 is the fixed charge. Each day adds the gradient.']]))
}
{
  const cost: Amount = { before: '£', name: '£', per: 15 }
  const electrician: Line = { m: 15, c: 30 }
  const g = rlGrid(hours, 7, cost, 135)
  const ends: [ReturnType<typeof pt>, ReturnType<typeof pt>] = [pt(0, 30), pt(1, 45)]
  practice(fixed, 'An electrician charges £30 to come out, plus £15 an hour. Draw the graph of the cost.', 'GR9 p90 Q2: drawing it (own numbers)',
    { interaction: lineAnswer(...ends), board: { mode: 'line', grid: g, line: ends } }, 'Start at £30 at 0 hours. Each hour adds £15.',
    graphModel('£30 plus £15 an hour', g, drawLineMoves(electrician, hours, cost, 4, 7, 135), 'Start, then step'),
    response => {
      const [a, b, c] = response.split(',').map(Number)
      if (![a, b, c].every(Number.isFinite)) return null
      if (b !== 0 && Math.abs(c / b) < 1e-9) return 'The line starts at £30, not £0: £30 before any work.'
      if (b !== 0 && Math.abs(c / b - 30) < 1e-9) return 'It starts at £30. Now each hour adds £15: £45 after 1 hour.'
      return null
    })
}
{
  const months: Amount = { after: ' months', name: 'months', per: 1 }, cost: Amount = { before: '£', name: '£', per: 10 }
  const gymA: Line = { m: 10, c: 20, name: 'A' }, gymB: Line = { m: 15, c: 0, name: 'B' }
  const g = rlGrid(months, 7, cost, 100, [gymA, gymB])
  practice(fixed, 'Gym A costs £20 to join, then £10 a month. Gym B costs £15 a month. Tap where they cost the same.', 'GR9 p88 Q1 Comparing two lines (own numbers)',
    { interaction: at(pt(4, 60), '4 months, £60'), board: { mode: 'plot', grid: g } }, 'Where the two lines cross.', graphModel('the same cost', g, crossMoves(pt(4, 60), months, cost), 'Where they cross'),
    response => {
      const [x, y] = response.split(',').map(Number)
      if (x === 0 && y === 20) return 'That’s Gym A’s joining fee. Find where the two lines cross.'
      if (Math.abs(y - yOf(gymA, x)) < 1e-9 || Math.abs(y - yOf(gymB, x)) < 1e-9) return 'That point is on one line only. They cost the same where the lines cross.'
      return null
    })
}

add('mixed', 'Real-life graphs', 'GR9 consolidation', text(
  'A conversion graph: start at the amount you have, go to the line, then across or down to the other axis.',
  'For an amount off the graph, read a smaller one and multiply up.',
  'The gradient is a rate: the amount up for each one across, like litres a minute or £ a day.',
  'Where the line starts on the up axis is the fixed charge, paid before anything else.',
  'Where two lines cross, both give the same amount.',
))

export const tutorRealLifeGraphsLesson: TutorMethodLesson = {
  id: 'L108', number: 108, title: 'Real-life graphs', level: 'GCSE Foundation',
  goal: 'Read a conversion graph both ways, use the gradient as a rate of change, and read a fixed charge and a rate from a cost graph.',
  labels: { [convert]: 'Conversion graphs', [rates]: 'The gradient is a rate', [fixed]: 'Fixed charge plus a rate', mixed: 'Review' },
  states: finish(),
}
