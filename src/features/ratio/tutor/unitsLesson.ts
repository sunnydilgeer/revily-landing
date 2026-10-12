import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 38 (Ratio R6): Converting units. Aniksha's R6 files don't exist, so the five videos and worksheets were made
 * with the lesson kit in her style (tools/lesson-kit/packs/R6.1–R6.5), from R6 Conversions (p102–105) of Sunny's book,
 * with our own numbers (Sunny, 11 Oct). Five rungs: metric units, area and volume units, using a conversion rate
 * (imperial and money), time, and speed units. R7 Conversion graphs is already taught in Real-life graphs (GR9).
 */

const { add, finish } = author(38)
const metric = 'units-metric'
const areaVolume = 'units-area-volume'
const rates = 'units-rates'
const time = 'units-time'
const speed = 'units-speed'

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** The opening screen shows the conversion the question asks for, so the board is never empty. */
const board = (given: string, moves: BoardMove[], label = 'Work it out') => boardModel([`>0 ${given}`], moves, label)
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
  id: `lesson38-${name}`, src: `/media/lesson-38/${name}.mp4`, poster: `/media/lesson-38/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }

/* ---------- Rung 1: metric units (R6.1) ---------- */

const flour = worked(metric, 'A bag of flour is 3.5 kg. How many grams is that?', '3.5 kg in grams', 'R6.1 video + Q1', board('3.5 kg = ? g', [
  { title: 'Convert the units', say: '1 kilogram is 1000 grams.', rows: ['1 kg = 1000 g'] },
  { title: 'Grams are smaller, so multiply by 1000', say: 'A gram is smaller than a kilogram, so you need more of them.', rows: ['> a smaller unit needs more of them'] },
  { title: 'Calculate the grams', say: '3.5 × 1000 moves every digit three places left.', rows: ['3.5 kg × 1000 = 3500 g', '! 3.5 kg = 3500 g'] },
  { title: 'Check it makes sense', say: 'Divide by 1000 to go back to kilograms.', rows: ['3500 g ÷ 1000 = 3.5 kg ✓'] },
]), 'Our aim: learn the metric facts, then multiply to go to a smaller unit and divide to go to a bigger one.')
video(flour, media('metric', '3.5 kg in grams', 'R6.1_Metric_Units.mp4', 57, [
  'Metric units: a bag of flour is 3.5 kg. How many grams is that?',
  'The facts to learn: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 tonne = 1000 kg, 1 litre = 1000 ml, and £1 = 100p.',
  'Step 1, the scale factor: 1 kg = 1000 g, so the scale factor is 1000. A gram is smaller, so you need more of them: multiply.',
  'Step 2, multiply: 3.5 × 1000 = 3500, so 3500 g.',
  'The other way: 650 cm in metres. A metre is bigger, so you need fewer: divide. 650 ÷ 100 = 6.5 m.',
  'Small unit to big unit: divide. Big unit to small unit: multiply. Check the answer makes sense.',
]))
practice(metric, 'A bottle holds 2.4 litres. How many millilitres is that?', 'R6.1 Q2', number(2400, '2400 ml'), '1 litre = 1000 ml. Millilitres are smaller, so multiply.', board('2.4 litres = ? ml', [
  { title: 'Convert the units', say: '1 litre is 1000 millilitres.', rows: ['1 litre = 1000 ml'] },
  { title: 'Millilitres are smaller, so multiply by 1000', say: 'A millilitre is smaller than a litre, so you need more of them.', rows: ['> a smaller unit needs more of them'] },
  { title: 'Calculate the millilitres', say: '2.4 × 1000 moves every digit three places left.', rows: ['2.4 litres × 1000 = 2400 ml', '! 2.4 litres = 2400 ml'] },
  { title: 'Check it makes sense', say: 'Divide by 1000 to go back to litres.', rows: ['2400 ml ÷ 1000 = 2.4 litres ✓'] },
]), [[240, '1 litre is 1000 ml, not 100: 2.4 × 1000 = 2400.'], [0.0024, 'Millilitres are smaller, so there are more of them: multiply.']])
pounds(practice(metric, 'Sam has 850p in his money box. How much is that in pounds?', 'R6.1 Q3', number(8.5, '£8.50'), '£1 = 100p. Pounds are bigger, so divide.', board('850p = £?', [
  { title: 'Convert the units', say: '£1 is 100 pence.', rows: ['£1 = 100p'] },
  { title: 'Pounds are bigger, so divide by 100', say: 'A pound is bigger than a penny, so you need fewer of them.', rows: ['> a bigger unit needs fewer of them'] },
  { title: 'Calculate the pounds', say: '850 ÷ 100 moves every digit two places right.', rows: ['850p ÷ 100 = £8.50', '! 850p = £8.50'] },
  { title: 'Check it makes sense', say: 'Multiply by 100 to go back to pence.', rows: ['£8.50 × 100 = 850p ✓'] },
]), [[85, '£1 is 100p, so divide by 100: 850 ÷ 100 = 8.50.'], [85000, 'Pounds are bigger, so there are fewer of them: divide.']]))
practice(metric, 'A lorry carries 0.3 tonnes of sand. How many kilograms is that?', 'R6.1 Q4', number(300, '300 kg'), '1 tonne = 1000 kg.', board('0.3 tonnes = ? kg', [
  { title: 'Convert the units', say: '1 tonne is 1000 kilograms.', rows: ['1 tonne = 1000 kg'] },
  { title: 'Kilograms are smaller, so multiply by 1000', say: 'A kilogram is smaller than a tonne, so you need more of them.', rows: ['> a smaller unit needs more of them'] },
  { title: 'Calculate the kilograms', say: '0.3 × 1000 moves every digit three places left.', rows: ['0.3 tonnes × 1000 = 300 kg', '! 0.3 tonnes = 300 kg'] },
  { title: 'Check it makes sense', say: 'Divide by 1000 to go back to tonnes.', rows: ['300 kg ÷ 1000 = 0.3 tonnes ✓'] },
]), [[30, '1 tonne is 1000 kg: 0.3 × 1000 = 300.']])
practice(metric, 'Ella’s walk to school is 1.2 km. She has walked 450 m. How many metres does she have left?', 'R6.1 Q5', number(750, '750 m'), 'Make the units the same first: change 1.2 km to metres.', board('1.2 km − 450 m = ? m', [
  { title: 'Convert the units', say: 'Make both distances metres first. 1 kilometre is 1000 metres.', rows: ['1 km = 1000 m'] },
  { title: 'Metres are smaller, so multiply by 1000', say: 'A metre is smaller than a kilometre, so you need more of them.', rows: ['1.2 km × 1000 = 1200 m'] },
  { title: 'Calculate the distance left', say: 'Now both are in metres, so take away what she has walked.', rows: ['1200 m − 450 m = 750 m', '! Distance left = 750 m'] },
  { title: 'Check it makes sense', say: 'What she has walked and what is left make the whole walk.', rows: ['750 m + 450 m = 1200 m ✓'] },
]), [[-448.8, 'Change 1.2 km into metres first: 1200 m.'], [1650, 'She has walked 450 m, so take it away.']])

/* ---------- Rung 2: area and volume units (R6.2) ---------- */

const floor = worked(areaVolume, 'A floor has an area of 3 m². What is that in cm²?', '3 m² in cm²', 'R6.2 video + Q1', board('3 m² = ? cm²', [
  { title: 'Not 100', say: '1 m = 100 cm, but a square metre is a square 100 cm by 100 cm.', rows: ['1 m = 100 cm'] },
  { title: 'Square the scale factor', say: 'The square holds 100 rows of 100 square centimetres.', rows: ['1 m² = 100 × 100 = 10 000 cm²'] },
  { title: 'Multiply', say: 'There are 3 square metres.', rows: ['3 × 10 000 = 30 000', '! 30 000 cm²'] },
]), 'Our aim: for area, square the length scale factor; for volume, cube it.')
video(floor, media('area-volume', '3 m² in cm²', 'R6.2_Area_And_Volume_Units.mp4', 48, [
  'Area and volume units: a floor has an area of 3 m². What is that in cm²?',
  'The trap: 1 m = 100 cm, but 1 m² is not 100 cm². Draw the square: it is 100 cm by 100 cm.',
  'Step 1, square the scale factor: 1 m² = 100 × 100 = 10 000 cm².',
  'Step 2, multiply: 3 × 10 000 = 30 000 cm².',
  'Volume: cube it. A cube 1 m each way is 100 × 100 × 100 = 1 000 000 cm³. Also 1 cm² = 100 mm² and 1 cm³ = 1000 mm³.',
  'Square the length factor for area, cube it for volume, multiply to smaller units and divide to bigger.',
]))
practice(areaVolume, 'A stamp has an area of 4 cm². What is that in mm²?', 'R6.2 Q2', number(400, '400 mm²'), '1 cm = 10 mm, so 1 cm² = 10 × 10 mm².', board('4 cm² = ? mm²', [
  { title: 'Square the scale factor', say: '1 cm = 10 mm.', rows: ['1 cm² = 10 × 10 = 100 mm²'] },
  { title: 'Multiply', say: 'There are 4 square centimetres.', rows: ['4 × 100 = 400', '! 400 mm²'] },
]), [[40, 'For area, square the scale factor: 1 cm² = 100 mm², not 10.']])
practice(areaVolume, 'A skip holds 1.2 m³. What is that in cm³?', 'R6.2 Q3', number(1200000, '1 200 000 cm³'), 'Cube the scale factor: 100 × 100 × 100.', board('1.2 m³ = ? cm³', [
  { title: 'Cube the scale factor', say: '1 m = 100 cm.', rows: ['1 m³ = 100 × 100 × 100 = 1 000 000 cm³'] },
  { title: 'Multiply', say: 'There are 1.2 cubic metres.', rows: ['1.2 × 1 000 000 = 1 200 000', '! 1 200 000 cm³'] },
]), [[120, 'For volume, cube the scale factor: 1 m³ = 1 000 000 cm³.'], [12000, 'That squares the scale factor. For volume, cube it: 100 × 100 × 100.']])
practice(areaVolume, 'A rug has an area of 50 000 cm². What is that in m²?', 'R6.2 Q4', number(5, '5 m²'), '1 m² = 10 000 cm². Square metres are bigger, so divide.', board('50 000 cm² = ? m²', [
  { title: 'The scale factor', say: 'Square 100.', rows: ['1 m² = 10 000 cm²'] },
  { title: 'Divide', say: 'Square metres are bigger, so there are fewer.', rows: ['50 000 ÷ 10 000 = 5', '! 5 m²'] },
]), [[500, 'For area, divide by 100 × 100 = 10 000, not 100.']])
practice(areaVolume, 'A fish tank is 80 cm by 50 cm by 40 cm. What is its volume in m³?', 'R6.2 Q5', number(0.16, '0.16 m³'), 'Change each length to metres first, then multiply.', board('80 cm × 50 cm × 40 cm = ? m³', [
  { title: 'Change to metres', say: 'Divide each length by 100.', rows: ['80 cm = 0.8 m', '50 cm = 0.5 m', '40 cm = 0.4 m'] },
  { title: 'Multiply', say: 'Volume = length × width × height.', rows: ['0.8 × 0.5 × 0.4 = 0.16', '! 0.16 m³'] },
]), [[160000, 'That’s in cm³. Divide by 1 000 000 for m³, or change to metres first.'], [1600, 'Divide by 1 000 000 for m³: 100 cubed, not 100.']])

/* ---------- Rung 3: using a conversion rate (R6.3) ---------- */

const suitcase = worked(rates, 'A suitcase weighs 5 kg. Use 1 kg ≈ 2.2 pounds. About how many pounds is that?', '5 kg in pounds', 'R6.3 video + Q1', board('5 kg = ? pounds', [
  { title: 'Read the rate', say: 'Every kilogram is 2.2 pounds, so kg to pounds is multiply. Pounds to kg would be divide.', rows: ['1 kg = 2.2 pounds'] },
  { title: 'Multiply', say: '5 lots of 2.2.', rows: ['5 × 2.2 = 11', '! about 11 pounds'] },
]), 'Our aim: read the rate as “1 of these is so many of those”, multiply to go from the 1, and divide to come back.')
video(suitcase, media('rates', '5 kg in pounds', 'R6.3_Using_A_Conversion_Rate.mp4', 49, [
  'Using a conversion rate: a suitcase weighs 5 kg. Use 1 kg ≈ 2.2 pounds.',
  'Step 1, read the rate: every kilogram is 2.2 pounds. Kg to pounds: multiply by 2.2. Pounds to kg: divide by 2.2.',
  'Step 2, multiply: 5 × 2.2 = 11, so about 11 pounds.',
  'The other way: 33 pounds in kg is 33 ÷ 2.2 = 15 kg. A kilogram is bigger than a pound, so there are fewer.',
  'Money works the same: at £1 = 1.25 dollars, £300 × 1.25 = 375 dollars, and 375 ÷ 1.25 = £300. A fee? Take it off first, then convert.',
  'Read the rate, multiply to go from the 1, divide to go back, and check the size makes sense.',
]))
practice(rates, 'Ravi changes £300 into dollars. The rate is £1 = 1.25 dollars. How many dollars does he get?', 'R6.3 Q2', number(375, '375 dollars'), 'Each pound is 1.25 dollars: multiply.', board('£300 = ? dollars', [
  { title: 'Multiply by the rate', say: 'Pounds to dollars: every £1 gives 1.25 dollars.', rows: ['300 × 1.25 = 375', '! 375 dollars'] },
]), [[240, 'That divides. Each pound is worth 1.25 dollars, so multiply.']])
practice(rates, 'A door is 6 feet tall. Use 1 foot ≈ 30 cm. About how tall is it in centimetres?', 'R6.3 Q3', number(180, '180 cm'), 'Each foot is 30 cm.', board('6 feet = ? cm', [
  { title: 'Multiply by the rate', say: 'Feet to cm: multiply by 30.', rows: ['6 × 30 = 180', '! 180 cm'] },
]), [[5, 'Each foot is 30 cm, so multiply: 6 × 30.'], [0.2, 'Each foot is 30 cm, so multiply: 6 × 30.']])
practice(rates, 'A tank holds 9 litres. Use 1 gallon ≈ 4.5 litres. About how many gallons is that?', 'R6.3 Q4', number(2, '2 gallons'), 'A gallon is bigger than a litre, so divide.', board('9 litres = ? gallons', [
  { title: 'Divide by the rate', say: 'Litres to gallons: divide by 4.5.', rows: ['9 ÷ 4.5 = 2', '! 2 gallons'] },
]), [[40.5, 'A gallon is bigger than a litre, so there are fewer gallons: divide.']])
practice(rates, 'Kim changes £400 into euros. There is a 2% fee, taken off first. The rate is £1 = 1.15 euros. How many euros does she get?', 'R6.3 Q5', number(450.8, '450.80 euros'), 'Take off the 2% fee, then multiply by 1.15.', board('£400 − 2% fee = ? euros', [
  { title: 'Take off the fee', say: 'She keeps 98% of her £400.', rows: ['400 × 0.98 = 392'] },
  { title: 'Convert', say: 'Multiply by the rate.', rows: ['392 × 1.15 = 450.80', '! 450.80 euros'] },
]), [[460, 'Take off the 2% fee first: she changes £392, not £400.'], [8, 'That’s the fee. Take it off, then convert £392.']])

/* ---------- Rung 4: time (R6.4) ---------- */

const film = worked(time, 'A film lasts 2.4 hours. How long is that in hours and minutes?', '2.4 hours in hours and minutes', 'R6.4 video + Q1', board('2.4 hours = ? hours ? minutes', [
  { title: 'Time is in 60s', say: '1 hour = 60 minutes, so 2.4 hours is not 2 hours 40 minutes.', rows: ['1 hour = 60 minutes'] },
  { title: 'Keep the whole hours', say: '2.4 hours is 2 hours and 0.4 of an hour.', rows: ['> 2 hours and 0.4 of an hour'] },
  { title: 'The decimal part × 60', say: '0.4 of 60 minutes.', rows: ['0.4 × 60 = 24', '! 2 hours 24 minutes'] },
]), 'Our aim: time works in 60s, not 10s. Multiply a decimal of an hour by 60 for minutes, and divide minutes by 60 for a decimal.')
video(film, media('time', '2.4 hours in hours and minutes', 'R6.4_Time.mp4', 44, [
  'Converting time: a film lasts 2.4 hours. How long is that in hours and minutes?',
  'The facts: 1 minute = 60 seconds, 1 hour = 60 minutes, 1 day = 24 hours. So 2.4 hours is not 2 hours 40 minutes.',
  'Step 1, keep the whole hours: 2.4 hours is 2 hours and 0.4 of an hour.',
  'Step 2, the decimal part × 60: 0.4 × 60 = 24, so 2 hours 24 minutes.',
  'The other way: 2 hours 15 minutes in hours. 15 ÷ 60 = 0.25, so 2.25 hours.',
  'Time is in 60s. Decimal of an hour × 60 gives minutes; minutes ÷ 60 gives a decimal of an hour.',
]))
practice(time, 'A holiday lasts 3 days. How many hours is that?', 'R6.4 Q2', number(72, '72 hours'), '1 day = 24 hours.', board('3 days = ? hours', [
  { title: 'Multiply by 24', say: 'Each day is 24 hours.', rows: ['3 × 24 = 72', '! 72 hours'] },
]), [[300, 'A day is 24 hours, not 100.'], [180, 'A day is 24 hours, not 60.']])
practice(time, 'A drive takes 3.75 hours. How many minutes is that?', 'R6.4 Q3', number(225, '225 minutes'), '1 hour = 60 minutes.', board('3.75 hours = ? minutes', [
  { title: 'Multiply by 60', say: 'Each hour is 60 minutes.', rows: ['3.75 × 60 = 225', '! 225 minutes'] },
]), [[375, 'An hour is 60 minutes, not 100: 3.75 × 60.']])
practice(time, 'A match lasts 150 minutes. Write this in hours as a decimal.', 'R6.4 Q4', number(2.5, '2.5 hours'), 'Divide the minutes by 60.', board('150 minutes = ? hours', [
  { title: 'Divide by 60', say: '60 minutes make an hour.', rows: ['150 ÷ 60 = 2.5', '! 2.5 hours'] },
]), [[1.5, 'An hour is 60 minutes, not 100: 150 ÷ 60 = 2.5.'], [2.3, '2 hours 30 minutes is 2.5 hours: 30 minutes is half an hour.']])
practice(time, 'A walk takes 4 hours 12 minutes. Write this in hours as a decimal.', 'R6.4 Q5', number(4.2, '4.2 hours'), 'Change the 12 minutes into a decimal of an hour: ÷ 60.', board('4 hours 12 minutes = ? hours', [
  { title: 'Minutes ÷ 60', say: '12 minutes is 12/60 of an hour.', rows: ['12 ÷ 60 = 0.2'] },
  { title: 'Add the hours', say: 'Put the whole hours back.', rows: ['4 + 0.2 = 4.2', '! 4.2 hours'] },
]), [[4.12, '12 minutes is not 0.12 of an hour: 12 ÷ 60 = 0.2.']])
practice(time, 'A train journey takes 1.75 hours. How long is that in hours and minutes?', 'R6.4 (extra)', pair(['hours', 'minutes'], [1, 45], '1 hour 45 minutes'), 'Keep the 1 hour; 0.75 × 60 gives the minutes.', board('1.75 hours = ? hours ? minutes', [
  { title: 'Keep the whole hours', say: '1.75 hours is 1 hour and 0.75 of an hour.', rows: ['> 1 hour and 0.75 of an hour'] },
  { title: 'The decimal part × 60', say: '0.75 of 60 minutes.', rows: ['0.75 × 60 = 45', '! 1 hour 45 minutes'] },
]))

/* ---------- Rung 5: speed units (R6.5) ---------- */

const car = worked(speed, 'A car drives at 72 km/h. What is that in metres per second?', '72 km/h in m/s', 'R6.5 video + Q1', board('72 km/h = ? m/s', [
  { title: 'Change the distance', say: 'km/h means kilometres per hour: 72 km in 1 hour. Change the km to metres.', rows: ['72 × 1000 = 72 000'] },
  { title: 'Change the time', say: '72 000 metres in 1 hour, and an hour is 3600 seconds.', rows: ['1 hour = 60 × 60 = 3600 s'] },
  { title: 'Divide distance by time', say: 'Share the metres between the seconds.', rows: ['72 000 ÷ 3600 = 20', '! 20 m/s'] },
]), 'Our aim: a speed has two units, a distance per a time. Change them one at a time, then divide distance by time.')
video(car, media('speed', '72 km/h in m/s', 'R6.5_Speed_Units.mp4', 44, [
  'Speed units: a car drives at 72 km/h. What is that in metres per second? km/h means kilometres per hour: change the two units one at a time.',
  'Step 1, change the distance: 72 × 1000 = 72 000 metres in 1 hour.',
  'Step 2, change the time: 1 hour = 60 × 60 = 3600 seconds.',
  'Step 3, divide distance by time: 72 000 ÷ 3600 = 20 m/s.',
  'The other way: 15 m/s in km/h. 15 × 3600 = 54 000 metres an hour, and 54 000 ÷ 1000 = 54 km/h.',
  'Change the distance unit, change the time unit, then divide distance by time.',
]))
practice(speed, 'A cyclist rides at 36 km/h. What is that in m/s?', 'R6.5 Q2', number(10, '10 m/s'), 'Change 36 km to metres, then divide by the 3600 seconds in an hour.', board('36 km/h = ? m/s', [
  { title: 'Change the distance', say: '36 km in metres.', rows: ['36 × 1000 = 36 000'] },
  { title: 'Divide by the seconds in an hour', say: 'An hour is 3600 seconds.', rows: ['36 000 ÷ 3600 = 10', '! 10 m/s'] },
]), [[600, 'An hour is 3600 seconds, not 60: divide by 3600.'], [0.6, 'Change the km to metres first: 36 000 m.']])
practice(speed, 'A train travels at 25 m/s. What is that in km/h?', 'R6.5 Q3', number(90, '90 km/h'), 'Find the metres in an hour (× 3600), then change to km (÷ 1000).', board('25 m/s = ? km/h', [
  { title: 'Metres in an hour', say: 'An hour is 3600 seconds.', rows: ['25 × 3600 = 90 000'] },
  { title: 'Change to km', say: '1 km = 1000 m.', rows: ['90 000 ÷ 1000 = 90', '! 90 km/h'] },
]), [[1.5, 'An hour is 3600 seconds, not 60: 25 × 3600 = 90 000 m.'], [90000, 'That’s metres per hour. Divide by 1000 for km/h.']])
practice(speed, 'A road sign says 80 km/h. Use 1 mile ≈ 1.6 km. What is that in miles per hour?', 'R6.5 Q4', number(50, '50 mph'), 'A mile is longer than a km, so divide.', board('80 km/h = ? mph', [
  { title: 'Divide by the rate', say: 'Only the distance changes; it’s still per hour.', rows: ['80 ÷ 1.6 = 50', '! 50 mph'] },
]), [[128, 'A mile is longer than a kilometre, so there are fewer miles: divide.']])
practice(speed, 'A cheetah runs at 108 km/h. A greyhound runs at 28 m/s. Which is faster?', 'R6.5 Q5', choose('The cheetah', ['The greyhound', '108 km/h = 108 000 ÷ 3600 = 30 m/s, and 30 m/s is more than 28 m/s.'], ['They are the same speed', '108 km/h is 30 m/s, not 28 m/s.']), 'Put both speeds in the same units first.', board('108 km/h or 28 m/s: which is faster?', [
  { title: 'Same units', say: 'Change 108 km/h to m/s.', rows: ['108 × 1000 = 108 000', '108 000 ÷ 3600 = 30'] },
  { title: 'Compare', say: '30 m/s is more than 28 m/s.', rows: ['> 30 m/s and 28 m/s', '! The cheetah'] },
]))

add('mixed', 'Converting units', 'R6 consolidation', text(
  'To a smaller unit, multiply; to a bigger unit, divide. Learn the metric facts: 1000 g in a kg, 100 cm in a m, 1000 ml in a litre.',
  'For area, square the length factor: 1 m² = 10 000 cm². For volume, cube it: 1 m³ = 1 000 000 cm³.',
  'A conversion rate says 1 of these is so many of those: multiply to go from the 1, divide to come back.',
  'Time is in 60s: decimal hours × 60 gives minutes, minutes ÷ 60 gives a decimal of an hour.',
  'For a speed, change the distance and the time one at a time, then divide distance by time.',
))

export const tutorUnitsLesson: TutorMethodLesson = {
  id: 'L038', number: 38, title: 'Converting units', level: 'GCSE Foundation',
  goal: 'Convert metric units, area and volume units, imperial units and money with a rate, time, and speeds.',
  labels: { [metric]: 'Metric units', [areaVolume]: 'Area and volume', [rates]: 'Conversion rates', [time]: 'Time', [speed]: 'Speed units', mixed: 'Review' },
  states: finish(),
}
