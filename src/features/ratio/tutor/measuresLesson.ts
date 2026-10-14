import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 40 (Ratio R9–R11): Compound measures. Made with the lesson kit (packs R9.1, R10.1, R11.1) from R9 Density, R10
 * Speed Distance Time and R11 Pressure (p110–115) of Sunny's book, with our own numbers (Sunny, 11 Oct). Each rung uses
 * the formula in words (density = mass ÷ volume), with units on every line (Sunny, 14 Oct: no triangle).
 */

const { add, finish } = author(40)
const density = 'measures-density'
const sdt = 'measures-speed'
const pressure = 'measures-pressure'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
const board = (moves: BoardMove[], label = 'Work it out') => boardModel([], moves, label)
/** A question: its words above the answer, and the board working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, list: Slip[] = []) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  const right = Number(interaction.correctAnswer)
  if (list.length && interaction.type === 'numericInput') state.diagnose = (response: string) => diagnoseSlips(response, right, list)
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson40-${name}`, src: `/media/lesson-40/${name}.mp4`, poster: `/media/lesson-40/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }

/* ---------- Rung 1: density (R9.1) ---------- */

const metal = worked(density, 'A block of metal has a mass of 540 g and a volume of 200 cm³. What is its density?', 'Density of a 540 g block', 'R9.1 video + Q1', board([
  { title: 'Write the formula', say: 'To calculate density, divide the mass by the volume.', rows: ['Density = mass ÷ volume'] },
  { title: 'Put in the numbers', say: 'The mass is 540 g and the volume is 200 cm³. Grams divided by cm³ gives g/cm³.', rows: ['Density = 540 g ÷ 200 cm³ = 2.7 g/cm³', '! 2.7 g/cm³'] },
  { title: 'Check it makes sense', say: 'Multiply back: density × volume gives the mass.', rows: ['2.7 g/cm³ × 200 cm³ = 540 g ✓'] },
]), 'Our aim: learn the formula, then put the numbers in, with their units.')
video(metal, media('density', 'Density of a 540 g block', 'R9.1_Density.mp4', 47, [
  'Density: a block of metal has a mass of 540 g and a volume of 200 cm³. Density = mass ÷ volume.',
  'The triangle: M on top, D × V below. Cover what you want: the line means divide, side by side means multiply.',
  'Step 1, cover D: D = 540 ÷ 200 = 2.7 g/cm³.',
  'Find the mass of 50 cm³ of the same metal: cover M, M = 2.7 × 50 = 135 g.',
  'Units: g and cm³ give g/cm³; kg and m³ give kg/m³. Change kg to g first if the density is in g/cm³.',
]))
practice(density, 'A stone has a mass of 300 g and a volume of 40 cm³. Find its density.', 'R9.1 Q2', number(7.5, '7.5 g/cm³'), 'Density = mass ÷ volume.', board([
  { title: 'Calculate the density', say: 'To calculate density, divide the mass by the volume.', rows: ['Density = mass ÷ volume', 'Density = 300 g ÷ 40 cm³ = 7.5 g/cm³', '! 7.5 g/cm³'] },
]), [[12000, 'Divide mass by volume, don’t multiply.'], [0.13333333333333333, 'Mass goes on top: 300 ÷ 40.']])
practice(density, 'Oil has a density of 0.8 g/cm³. What is the mass of 250 cm³ of oil?', 'R9.1 Q3', number(200, '200 g'), 'Mass = density × volume.', board([
  { title: 'Calculate the mass', say: 'To calculate mass, multiply the density by the volume.', rows: ['Mass = density × volume', 'Mass = 0.8 g/cm³ × 250 cm³ = 200 g', '! 200 g'] },
]), [[312.5, 'Mass = density × volume: 0.8 × 250.']])
practice(density, 'A brass weight has a mass of 1.2 kg. Brass has a density of 8 g/cm³. Find its volume.', 'R9.1 Q4', number(150, '150 cm³'), 'Change kg to g first, then volume = mass ÷ density.', board([
  { title: 'Convert kg to g', say: 'The density is in g/cm³, so use grams. 1 kg is 1000 g.', rows: ['1.2 kg × 1000 = 1200 g'] },
  { title: 'Calculate the volume', say: 'To calculate volume, divide the mass by the density.', rows: ['Volume = mass ÷ density', 'Volume = 1200 g ÷ 8 g/cm³ = 150 cm³', '! 150 cm³'] },
]), [[0.15, 'Change 1.2 kg to 1200 g first.'], [9.6, 'Volume = mass ÷ density, not ×.']])
practice(density, 'A solid cube has sides of 5 cm and a mass of 1 kg. Find its density in g/cm³.', 'R9.1 Q5', number(8, '8 g/cm³'), 'Find the volume (5 × 5 × 5) and the mass in grams first.', board([
  { title: 'Calculate the volume', say: 'A cube: side × side × side.', rows: ['Volume = 5 cm × 5 cm × 5 cm = 125 cm³'] },
  { title: 'Convert kg to g', say: 'The answer is in g/cm³, so use grams.', rows: ['1 kg = 1000 g'] },
  { title: 'Calculate the density', say: 'To calculate density, divide the mass by the volume.', rows: ['Density = mass ÷ volume', 'Density = 1000 g ÷ 125 cm³ = 8 g/cm³', '! 8 g/cm³'] },
]), [[0.008, 'Use the mass in grams: 1 kg = 1000 g.'], [40, 'The volume of a cube is 5 × 5 × 5 = 125 cm³.']])

/* ---------- Rung 2: speed, distance and time (R10.1) ---------- */

const coach = worked(sdt, 'A coach drives 150 miles in 3 hours. What is its average speed?', 'Speed of a coach', 'R10.1 video + Q1', board([
  { title: 'Write the formula', say: 'To calculate speed, divide the distance by the time.', rows: ['Speed = distance ÷ time'] },
  { title: 'Put in the numbers', say: 'The distance is 150 miles and the time is 3 hours. Miles divided by hours gives miles per hour.', rows: ['Speed = 150 miles ÷ 3 hours = 50 mph', '! 50 mph'] },
  { title: 'Check it makes sense', say: 'Multiply back: speed × time gives the distance.', rows: ['50 mph × 3 hours = 150 miles ✓'] },
]), 'Our aim: learn the formula, then put the numbers in, with their units. Keep the time in the same units as the speed: minutes into hours first.')
video(coach, media('speed', 'Speed of a coach', 'R10.1_Speed_Distance_Time.mp4', 49, [
  'Speed, distance and time: a coach drives 150 miles in 3 hours. Speed = distance ÷ time.',
  'The triangle: D on top, S × T below. Cover what you want to find.',
  'Step 1, cover S: S = 150 ÷ 3 = 50 mph.',
  'Find the distance at 40 mph for 2.5 hours: cover D, D = 40 × 2.5 = 100 miles.',
  'Minutes: 12 km at 48 km/h. T = 12 ÷ 48 = 0.25 hours, and 0.25 × 60 = 15 minutes. With a speed per hour, change minutes to hours first.',
]))
practice(sdt, 'A train travels 240 km in 4 hours. Find its average speed.', 'R10.1 Q2', number(60, '60 km/h'), 'Speed = distance ÷ time.', board([
  { title: 'Calculate the speed', say: 'To calculate speed, divide the distance by the time.', rows: ['Speed = distance ÷ time', 'Speed = 240 km ÷ 4 hours = 60 km/h', '! 60 km/h'] },
]), [[960, 'Divide distance by time, don’t multiply.']])
practice(sdt, 'A cyclist rides at 8 m/s for 25 seconds. How far does she go?', 'R10.1 Q3', number(200, '200 m'), 'Distance = speed × time.', board([
  { title: 'Calculate the distance', say: 'To calculate distance, multiply the speed by the time.', rows: ['Distance = speed × time', 'Distance = 8 m/s × 25 s = 200 m', '! 200 m'] },
]), [[3.125, 'Distance = speed × time: 8 × 25.']])
practice(sdt, 'Ben drives 30 miles at an average speed of 40 mph. How many minutes does it take?', 'R10.1 Q4', number(45, '45 minutes'), 'Time = distance ÷ speed gives hours; then × 60.', board([
  { title: 'Calculate the time', say: 'To calculate time, divide the distance by the speed. Miles ÷ mph gives hours.', rows: ['Time = distance ÷ speed', 'Time = 30 miles ÷ 40 mph = 0.75 hours'] },
  { title: 'Convert hours to minutes', say: 'An hour is 60 minutes, so multiply by 60.', rows: ['0.75 hours × 60 = 45 minutes', '! 45 minutes'] },
]), [[0.75, 'That’s in hours. Multiply by 60 for minutes.'], [75, '0.75 of an hour is 0.75 × 60 = 45 minutes, not 75.']])
practice(sdt, 'A van drives at 60 mph for 45 minutes, then at 30 mph for 30 minutes. How far does it travel in total?', 'R10.1 Q5', number(60, '60 miles'), 'Change each time to hours, find each distance, then add.', board([
  { title: 'Convert minutes to hours', say: 'The speeds are per hour, so change the minutes to hours: divide by 60.', rows: ['45 minutes ÷ 60 = 0.75 hours', '30 minutes ÷ 60 = 0.5 hours'] },
  { title: 'Calculate the first distance', say: 'Distance = speed × time.', rows: ['Distance = 60 mph × 0.75 hours = 45 miles'] },
  { title: 'Calculate the second distance', say: 'Do the same for the second part.', rows: ['Distance = 30 mph × 0.5 hours = 15 miles'] },
  { title: 'Calculate the total', say: 'Add the two distances.', rows: ['Total = 45 miles + 15 miles = 60 miles', '! 60 miles'] },
]), [[3600, 'Change the minutes to hours first: 45 minutes = 0.75 hours.'], [45, 'Add the second part too: 30 × 0.5 = 15 miles.']])

/* ---------- Rung 3: pressure (R11.1) ---------- */

const push = worked(pressure, 'A force of 240 N pushes on an area of 0.6 m². What is the pressure?', 'Pressure from 240 N', 'R11.1 video + Q1', board([
  { title: 'Write the formula', say: 'To calculate pressure, divide the force by the area.', rows: ['Pressure = force ÷ area'] },
  { title: 'Put in the numbers', say: 'The force is 240 N and the area is 0.6 m². Newtons divided by m² gives N/m².', rows: ['Pressure = 240 N ÷ 0.6 m² = 400 N/m²', '! 400 N/m²'] },
  { title: 'Check it makes sense', say: 'Multiply back: pressure × area gives the force.', rows: ['400 N/m² × 0.6 m² = 240 N ✓'] },
]), 'Our aim: learn the formula, then put the numbers in, with force in newtons and area in m².')
video(push, media('pressure', 'Pressure from 240 N', 'R11.1_Pressure.mp4', 46, [
  'Pressure: a force of 240 N pushes on an area of 0.6 m². Pressure = force ÷ area.',
  'The triangle: F on top, P × A below. Force in newtons (N), area in m², pressure in N/m².',
  'Step 1, cover P: P = 240 ÷ 0.6 = 400 N/m².',
  'Find the force from 400 N/m² on 0.05 m²: cover F, F = 400 × 0.05 = 20 N.',
  'Watch the units: 1 kN = 1000 N. A smaller area means more pressure for the same force.',
]))
practice(pressure, 'A force of 90 N acts on an area of 3 m². Find the pressure.', 'R11.1 Q2', number(30, '30 N/m²'), 'Pressure = force ÷ area.', board([
  { title: 'Calculate the pressure', say: 'To calculate pressure, divide the force by the area.', rows: ['Pressure = force ÷ area', 'Pressure = 90 N ÷ 3 m² = 30 N/m²', '! 30 N/m²'] },
]), [[270, 'Divide force by area, don’t multiply.']])
practice(pressure, 'A pressure of 250 N/m² acts on an area of 2 m². Find the force.', 'R11.1 Q3', number(500, '500 N'), 'Force = pressure × area.', board([
  { title: 'Calculate the force', say: 'To calculate force, multiply the pressure by the area.', rows: ['Force = pressure × area', 'Force = 250 N/m² × 2 m² = 500 N', '! 500 N'] },
]), [[125, 'Force = pressure × area: 250 × 2.']])
practice(pressure, 'A force of 1.5 kN gives a pressure of 300 N/m². Find the area.', 'R11.1 Q4', number(5, '5 m²'), 'Change kN to N first, then area = force ÷ pressure.', board([
  { title: 'Convert kN to N', say: 'The pressure is in N/m², so use newtons. 1 kN is 1000 N.', rows: ['1.5 kN × 1000 = 1500 N'] },
  { title: 'Calculate the area', say: 'To calculate area, divide the force by the pressure.', rows: ['Area = force ÷ pressure', 'Area = 1500 N ÷ 300 N/m² = 5 m²', '! 5 m²'] },
]), [[0.005, 'Change 1.5 kN to 1500 N first.'], [450000, 'Area = force ÷ pressure, not ×.']])
practice(pressure, 'A box weighs 600 N. It rests on a face 0.5 m by 0.4 m. What pressure does it put on the floor?', 'R11.1 Q5', number(3000, '3000 N/m²'), 'Find the area of the face first.', board([
  { title: 'Calculate the area', say: 'The face is a rectangle: length × width.', rows: ['Area = 0.5 m × 0.4 m = 0.2 m²'] },
  { title: 'Calculate the pressure', say: 'To calculate pressure, divide the force by the area.', rows: ['Pressure = force ÷ area', 'Pressure = 600 N ÷ 0.2 m² = 3000 N/m²', '! 3000 N/m²'] },
]), [[120, 'Divide force by area, don’t multiply.'], [666.6666666666666, 'The area is 0.5 × 0.4 = 0.2 m², not 0.5 + 0.4.']])

add('mixed', 'Compound measures', 'R9–R11 consolidation', text(
  'Learn each formula in words, then put the numbers in with their units.',
  'Density = mass ÷ volume (g/cm³). Speed = distance ÷ time (mph, km/h, m/s). Pressure = force ÷ area (N/m²).',
  'Match the units first: kg to g, kN to N, and minutes to hours when the speed is per hour.',
))

export const tutorMeasuresLesson: TutorMethodLesson = {
  id: 'L040', number: 40, title: 'Compound measures', level: 'GCSE Foundation',
  goal: 'Use density, speed and pressure with their formulas in words, matching the units first.',
  labels: { [density]: 'Density', [sdt]: 'Speed, distance and time', [pressure]: 'Pressure', mixed: 'Review' },
  states: finish(),
}
