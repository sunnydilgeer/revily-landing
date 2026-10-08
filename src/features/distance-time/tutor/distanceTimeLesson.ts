import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorWorking } from '../../written-methods/tutor/model'
import type { GraphBoardSpec } from '../../written-methods/tutor/GraphBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, text } from '../../inequalities/tutor/inequalityWorkings'
import { figure, graphModel, pt, type GraphGrid } from '../../straight-line-graphs/tutor/graphWorkings'
import { amount, distanceAt, partMoves, drawMoves, drawnJourney, dtGrid, journey, journeySlips, speedMoves, speedSlips, stopMoves, totalMoves, type Journey, type Leg } from './distanceTimeWorkings'

/*
 * Graphs lesson 7: Distance–time graphs. From GR8 (p86–88: the key facts, a journey in parts, speed for each part, a
 * bike ride read off its graph, drawing a journey from its story), with our own numbers. Three rungs, easiest first:
 * reading a journey; speed is the gradient; drawing a journey. Time goes across (amber, as a clock) and distance from
 * home up (biro blue). Hands-on (Sunny, 7 Oct): it opens with a play screen where each part shows its speed, and the
 * drawing questions are answered on the graph board (JourneyBoard.tsx).
 *
 * Hidden on live like lessons 1 to 6: not in the course registry; only the hidden Graphs shelf opens it.
 */

export const DISTANCE_TIME_MEDIA_ID = 'graphs-7-3c58d2fa'
const { add, finish } = author(107)
const reading = 'graphs-dt-read'
const speeds = 'graphs-dt-speed'
const drawing = 'graphs-dt-draw'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function explore(topic: MicroSkillId, title: string, sourceRef: string, spec: GraphBoardSpec) {
  const state = add(topic, title, sourceRef, text(title))
  state.board = spec
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
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
const number = (diagnose: (n: number) => string | null) => (response: string) => {
  const n = Number(response.replace(/−/g, '-').replace(/[^\d.-]/g, ''))
  return response.trim() && Number.isFinite(n) ? diagnose(n) : null
}

/* ---------- The journeys ---------- */

// Maya's bike ride: 15 km in an hour, a 30-minute stop, 15 km more in half an hour, then home in an hour and a half.
const maya = journey('Maya', pt(9, 0), pt(10, 15), pt(10.5, 15), pt(11, 30), pt(12.5, 0))
const mayaGrid = dtGrid(maya, [9, 13], 0.5, 40, 5)
// Tom's walk: 4 km in an hour, an hour's stop, 3 km more in half an hour, then home in an hour.
const tom = journey('Tom', pt(14, 0), pt(15, 4), pt(16, 4), pt(16.5, 7), pt(17.5, 0))
const tomGrid = dtGrid(tom, [14, 18], 0.5, 8, 1)
const [mA, , mC, mD] = [[maya.start, maya.corners[0]], [maya.corners[0], maya.corners[1]], [maya.corners[1], maya.corners[2]], [maya.corners[2], maya.corners[3]]] as [typeof maya.start, typeof maya.start][]

/* ---------- Rung 1: reading a journey ---------- */

explore(reading, 'Tap to build a journey. Watch each part’s speed.', 'GR8 p86 Key things to remember (play)',
  { mode: 'journey', grid: dtGrid(null, [9, 13], 0.5, 40, 5), start: pt(9, 0) })
worked(reading, 'Maya’s bike ride is shown. How long did she stop for?', 'How long did Maya stop?', 'GR8 p87 Example: bike ride (own numbers)',
  graphModel('Maya’s bike ride', mayaGrid, stopMoves(maya.corners[0], maya.corners[1]), 'Read the flat part'),
  'Time goes across and distance from home goes up. Going up is moving away, flat is stopped, and going down is coming back home.').video = {
  id: 'graphs-7-distance-time', src: `/media/${DISTANCE_TIME_MEDIA_ID}/distance-time.mp4`, poster: `/media/${DISTANCE_TIME_MEDIA_ID}/distance-time.svg`,
  title: 'Distance–time graphs', durationSeconds: 72, sourceFile: 'GR8.1_Distance_time_graphs.mp4 (tools/lesson-kit/packs/GR8.1-distance-time-graphs.cjs)',
  textAlternative: [
    'A distance–time graph shows a journey: time goes across and distance from home goes up.',
    'Going up is moving away from home, a flat part is stopped, and going down is coming back.',
    'Maya rides 15 km from 09:00 to 10:00, stops until 10:30, rides to 30 km by 11:00, then rides home by 12:30.',
    'Speed is the gradient: distance ÷ time. From 10:30 to 11:00 she rides 15 km in half an hour: 15 ÷ 0.5 = 30 km/h. Steeper means faster.',
    'Recap: up is away, flat is stopped, down is coming back; speed = distance ÷ time, with the time in hours.',
  ],
}
practice(reading, 'How far from home was Maya at 11:00, in km?', 'GR8 p87 Example: bike ride (own numbers)', { interaction: amount(30, 'km'), picture: mayaGrid, prefix: 'distance =' },
  'Up from 11:00 to the line, then across to the distance axis.', graphModel('Maya’s bike ride', mayaGrid, distanceAt(maya.corners[2]), 'Read it'),
  number(n => n === 11 ? 'That’s the time. Go up from 11:00 to the line, then read the distance across.' : null))
practice(reading, 'What was Maya doing from 11:00 to 12:30?', 'GR8 p86 Key things to remember (concept)', { interaction: choose(
  'Riding back home',
  ['Riding further away', 'Further away would go up. This part goes down, back to 0 km: home.'],
  ['Stopped', 'Stopped is a flat part. This part goes down.'],
  ['Slowing down', 'The line is straight, so her speed stays the same. Going down means coming back home.'],
), picture: mayaGrid }, 'Up is away from home, flat is stopped, down is coming back.', graphModel('Maya’s bike ride', mayaGrid, partMoves(...mD, 'Riding back home'), 'Read the part'))
practice(reading, 'How far did Maya ride altogether, in km?', 'GR8 p86 Using distance–time graphs (own numbers)', { interaction: amount(60, 'km'), picture: mayaGrid, prefix: 'distance =' },
  'Add the distance of every part, going out and coming back.', graphModel('Maya’s bike ride', mayaGrid, totalMoves(maya), 'Add the parts'),
  number(n => n === 30 ? 'That’s how far from home she got. She rode back home too.' : n === 45 ? 'She rode 15 + 15 = 30 km out, then 30 km back.' : null))
practice(reading, 'Tom’s walk is shown. For how many minutes did he stop?', 'GR8 p87 Example: stationary (own numbers)', { interaction: amount(60, 'minutes'), picture: tomGrid, prefix: 'time =' },
  'Find the flat part, and read the time at each end of it.', graphModel('Tom’s walk', tomGrid, stopMoves(tom.corners[0], tom.corners[1]), 'Read the flat part'),
  number(n => n === 1 ? 'One hour is right, but the question asks for minutes: 60.' : n === 4 ? 'That’s how far from home he stopped. Read the times across.' : null))

/* ---------- Rung 2: speed is the gradient ---------- */

worked(speeds, 'Work out Maya’s speed from 09:00 to 10:00.', 'Maya’s speed, 09:00 to 10:00', 'GR8 p86 Using distance–time graphs: speed (own numbers)',
  graphModel('Maya’s bike ride', mayaGrid, speedMoves(...mA), 'Distance ÷ time'),
  'Speed is the gradient of the part: distance ÷ time. Across the part is the time, in hours; up or down it is the distance. Steeper means faster.')
practice(speeds, 'Work out Maya’s speed from 10:30 to 11:00, in km/h.', 'GR8 p86 Q (own numbers)', { interaction: amount(30, 'km/h'), picture: mayaGrid, prefix: 'speed =' },
  '15 km in half an hour. How far would that be in a whole hour?', graphModel('Maya’s bike ride', mayaGrid, speedMoves(...mC), 'Distance ÷ time'), speedSlips(...mC))
practice(speeds, 'Work out Maya’s speed riding home, from 11:00 to 12:30, in km/h.', 'GR8 p86 Part D (own numbers)', { interaction: amount(20, 'km/h'), picture: mayaGrid, prefix: 'speed =' },
  '30 km in 1½ hours: 30 ÷ 1.5.', graphModel('Maya’s bike ride', mayaGrid, speedMoves(...mD), 'Distance ÷ time'), speedSlips(...mD))
{
  const [a, b] = [tom.corners[2], tom.corners[3]]
  practice(speeds, 'Tom’s steepest part is his fastest. Work out its speed, in km/h.', 'GR8 p86 Steeper = faster (own numbers)', { interaction: amount(7, 'km/h'), picture: tomGrid, prefix: 'speed =' },
    'The steepest part is the walk home. Distance ÷ time.', graphModel('Tom’s walk', tomGrid, speedMoves(a, b), 'Distance ÷ time'),
    number(n => n === 6 ? 'From 16:00 to 16:30 is 6 km/h. The walk home is steeper: 7 km in 1 hour.' : n === 4 ? 'From 14:00 to 15:00 is 4 km/h. Find the steepest part.' : speedSlips(a, b)(String(n))))
}

/* ---------- Rung 3: drawing a journey ---------- */

function drawStory(j: Journey, title: string, sourceRef: string, x: [number, number], perX: number, top: number, perY: number, legs: Leg[], hint: string, solo = true) {
  const start = dtGrid(j, x, perX, top, perY, false)
  const model = graphModel(`${j.name}’s journey`, start, drawMoves(j, legs), 'Part by part')
  if (!solo) return worked(drawing, title, title, sourceRef, model, 'Draw one part at a time, from where the last one ended. A speed for a time gives the distance: 40 km/h for half an hour is 20 km.')
  return practice(drawing, title, sourceRef, { interaction: drawnJourney(j), board: { mode: 'journey', grid: start, start: j.start, journey: j.corners } }, hint, model, journeySlips(j))
}
{
  const leila = journey('Leila', pt(12, 0), pt(13, 20), pt(13.5, 20), pt(14, 0))
  drawStory(leila, 'Leila leaves home at 12:00. She cycles 20 km in 1 hour, stops for 30 minutes, then cycles home at 40 km/h. Draw her journey.', 'GR8 p87 Q1 (own numbers)', [12, 15], 0.5, 25, 5, [
    { to: pt(13, 20), title: '20 km in 1 hour', say: 'From home at 12:00, up to 20 km at 13:00.', text: '12:00 to 13:00: 0 to 20 km' },
    { to: pt(13.5, 20), title: 'Stops for 30 minutes', say: 'Stopped: flat, from 13:00 to 13:30, still 20 km from home.', text: '13:00 to 13:30: flat at 20 km' },
    { to: pt(14, 0), title: 'Home at 40 km/h', say: '20 km at 40 km an hour takes 20 ÷ 40 = ½ hour. So down to 0 km at 14:00.', text: '20 ÷ 40 = ½ hour: home at 14:00' },
  ], '', false)
}
{
  const ben = journey('Ben', pt(9, 0), pt(11, 6), pt(12, 6), pt(13, 0))
  drawStory(ben, 'Ben leaves home at 09:00. He walks 6 km in 2 hours, stops for 1 hour, then walks home in 1 hour. Draw his journey.', 'GR8 p87 Q1 (own numbers)', [9, 15], 1, 7, 1, [
    { to: pt(11, 6), title: '6 km in 2 hours', say: 'Up from home at 09:00 to 6 km at 11:00.', text: '09:00 to 11:00: 0 to 6 km' },
    { to: pt(12, 6), title: 'Stops for 1 hour', say: 'Flat from 11:00 to 12:00.', text: '11:00 to 12:00: flat at 6 km' },
    { to: pt(13, 0), title: 'Home in 1 hour', say: 'Down to 0 km at 13:00.', text: '12:00 to 13:00: 6 to 0 km' },
  ], 'Tap where each part ends: 2 hours after 09:00, 6 km up.')
}
{
  const asha = journey('Asha', pt(10, 0), pt(11, 30), pt(11.5, 30), pt(12, 0))
  drawStory(asha, 'Asha leaves home at 10:00. She drives at 30 km/h for 1 hour, stops for 30 minutes, then drives home at 60 km/h. Draw her journey.', 'GR8 p87 Q1 (own numbers)', [10, 13], 0.5, 35, 5, [
    { to: pt(11, 30), title: '30 km/h for 1 hour', say: '30 km an hour for 1 hour is 30 km: up to 30 km at 11:00.', text: '30 × 1 = 30 km by 11:00' },
    { to: pt(11.5, 30), title: 'Stops for 30 minutes', say: 'Flat from 11:00 to 11:30.', text: '11:00 to 11:30: flat at 30 km' },
    { to: pt(12, 0), title: 'Home at 60 km/h', say: '30 km at 60 km an hour takes 30 ÷ 60 = ½ hour: home at 12:00.', text: '30 ÷ 60 = ½ hour: home at 12:00' },
  ], 'Speed × time is the distance: 30 km/h for 1 hour is 30 km.')
}
{
  const kai = journey('Kai', pt(8, 0), pt(8.5, 5), pt(9, 8), pt(10, 8))
  drawStory(kai, 'Kai leaves home at 08:00. He runs at 10 km/h for 30 minutes, then at 6 km/h for 30 minutes, then stops until 10:00. Draw his journey.', 'GR8 p88 Q3 (own numbers)', [8, 11], 0.5, 9, 1, [
    { to: pt(8.5, 5), title: '10 km/h for 30 minutes', say: 'Half an hour at 10 km an hour is 5 km: up to 5 km at 08:30.', text: '10 × ½ = 5 km by 08:30' },
    { to: pt(9, 8), title: '6 km/h for 30 minutes', say: 'Half an hour at 6 km an hour is 3 km more: up to 8 km at 09:00. Less steep: slower.', text: '6 × ½ = 3 km: 8 km by 09:00' },
    { to: pt(10, 8), title: 'Stops until 10:00', say: 'Flat at 8 km until 10:00.', text: '09:00 to 10:00: flat at 8 km' },
  ], 'Half an hour at 10 km/h is half of 10 km.')
}

add('mixed', 'Distance–time graphs', 'GR8 consolidation', text(
  'Time goes across and distance from home goes up.',
  'Going up is moving away, flat is stopped, and going down is coming back home.',
  'Speed is the gradient: distance ÷ time, with the time in hours. Steeper means faster.',
  'Total distance: add every part, out and back.',
  'To draw a journey, draw one part at a time from where the last one ended.',
))

export const tutorDistanceTimeLesson: TutorMethodLesson = {
  id: 'L107', number: 107, title: 'Distance–time graphs', level: 'GCSE Foundation',
  goal: 'Read a journey from a distance–time graph, work out the speed of each part as distance ÷ time, and draw a journey from its story.',
  labels: { [reading]: 'Reading a journey', [speeds]: 'Speed is the gradient', [drawing]: 'Drawing a journey', mixed: 'Review' },
  states: finish(),
}
