import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { MachineFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, box, choose, nb, number, pair, readNumbers, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 29 (Algebra A14): Function machines, from Aniksha's A14.1–A14.3 PDFs and videos. Three rungs in the PDFs'
 * order: put an input through the boxes, work backwards from the output, and turn an equation into a machine. Each
 * working draws the question's machine above the A5 board (MachinePictures.tsx): the box being worked on and the
 * number it makes are ringed in purple as the board writes the box's sum, its operation in purple too.
 */

const { add, finish } = author(29)
const forwards = 'function-machines-forwards'
const backwards = 'function-machines-backwards'
const creating = 'function-machines-creating'

/* ---------- Machines ---------- */

const machine = (boxes: string[], values: (string | null)[], extra: Partial<MachineFrame> = {}): MachineFrame => ({ boxes, values, ...extra })
/** A move on the board, with what it changes on the machine. The ring (`lit`) is only on the step that sets it. */
type MachineMove = BoardMove & { machine?: Partial<MachineFrame> }

/** The board working with the machine drawn above it: `start` is the question's own machine, on the opening screen. */
function machineModel(start: MachineFrame, moves: MachineMove[], label = 'Work it out', given: string[] = []): TutorWorking {
  // A box's sum, "7 × 4 = 28", writes the box's operation as the move, in purple like the ring on the box.
  const asMove = (row: string) => row.replace(/^(\S+) ([×÷+−]) (\S+) = /, '$1 $2$3^ = ')
  const model = boardModel(given, moves.map(move => ({ ...move, rows: move.rows.map(asMove) })), label)
  if (model.kind !== 'method-worked') throw new Error('A machine working is a board')
  let current: MachineFrame = start
  model.examples[0].steps.forEach((step, i) => {
    current = { ...current, lit: undefined, ...moves[i].machine }
    step.frame.machine = i === 0 ? { ...current, before: start } : current
  })
  return model
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A question: its own machine above the answer (or its words, when it has two machines), and the working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, shown: MachineFrame | null, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const visual: TutorMethodVisual = shown ? { kind: 'machine', machine: shown } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The machine is drawn above the board, so the heading is only the question.
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson29-${name}`, src: `/media/lesson-29/${name}.mp4`, poster: `/media/lesson-29/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
/** Two numbers typed in order: this question's own slips first, then which of the two is wrong. */
function both(names: [string, string], right: [number, number], list: [[number, number], string][] = []) {
  return (response: string) => {
    const [a, b] = readNumbers(response)
    if (a === undefined || b === undefined || (a === right[0] && b === right[1])) return null
    const own = list.find(([values]) => values[0] === a && values[1] === b)
    if (own) return own[1]
    if (a === right[0]) return `${names[0]} is right. Check ${names[1]} again, one box at a time.`
    if (b === right[1]) return `${names[1]} is right. Check ${names[0]} again, one box at a time.`
    return null
  }
}

/* ---------- Rung 1: input to output (A14.1) ---------- */

const sweets = machine(['× 4', '+ 3'], ['7', null, '?'])
const stall = worked(forwards, 'A fair stall gives 4 sweets for each ticket, then adds 3 free sweets. Work out the output when the input is 7.', 'Input 7: what comes out?', 'A14.1 video + Q1', machineModel(sweets, [
  { title: 'Box 1: × 4', say: 'The input, 7, goes in on the left. Box 1 multiplies it by 4.', rows: ['7 × 4 = 28'], machine: { values: ['7', '28', '?'], lit: 0 } },
  { title: 'Box 2: + 3', say: '28 moves on into box 2, which adds 3. What comes out of the last box is the output.', rows: ['28 + 3 = 31', '! Output = 31 sweets'], machine: { values: ['7', '28', '31'], lit: 1, answer: 2 } },
]), 'Our aim: put the input through the boxes in order, left to right, one box at a time.')
video(stall, media('input-to-output', 'Input 7, × 4, + 3: what comes out?', 'A14.1_Function_Machines_Input_To_Output.mp4', 104, [
  'A sweet machine: the input is 7, box 1 is × 4 and box 2 is + 3. What comes out?',
  'A function machine is a number machine. A number goes in: the input. The boxes change it, one box at a time, in order. A number comes out: the output.',
  'See it in the machine: 7 goes in on the left. Box 1 is × 4, so 7 × 4 = 28. Box 2 is + 3, so 28 + 3 = 31. 31 comes out on the right.',
  'Box 1, × 4: start with the input, 7, and multiply by 4. 7 × 4 = 28. Write 28: it goes into box 2.',
  'Box 2, + 3: add 3 to 28. 28 + 3 = 31. The output is 31.',
  'Does the order matter? If we do + 3 first: 7 + 3 = 10, then 10 × 4 = 40. 40 is not 31, so the order of the boxes matters. Always go box 1, then box 2.',
  'Where you see it: a fair stall gives 4 sweets for each ticket, plus 3 free. Alex buys 7 tickets: 7 × 4 = 28, 28 + 3 = 31, so 31 sweets.',
  'Go through the boxes in order, do one box at a time, and write the number after each box.',
]))
pounds(practice(forwards, 'A shop adds £9 postage to the price of every item. Work out the output when the input is 15.', 'A14.1 Q2', machine(['+ 9'], ['15', '?']), number(24, '£24'), 'Add 9 to the input.', machineModel(machine(['+ 9'], ['15', '?']), [
  { title: 'Box 1: + 9', say: 'There is only one box. It adds 9 to the input, 15.', rows: ['15 + 9 = 24', '! Output = £24'], machine: { values: ['15', '24'], lit: 0, answer: 1 } },
]), slips(24, [[6, 'The box says + 9: add 9, don’t take it away.'], [135, 'The box says + 9: add, don’t multiply.']])))
pounds(practice(forwards, 'Three friends share a taxi fare equally. Each then uses a £5 voucher. Work out the output when the input is 36.', 'A14.1 Q3', machine(['÷ 3', '− 5'], ['36', null, '?']), number(7, '£7'), 'Box 1 first: divide 36 by 3. Then take away 5.', machineModel(machine(['÷ 3', '− 5'], ['36', null, '?']), [
  { title: 'Box 1: ÷ 3', say: 'The fare, 36, is shared equally between 3. Divide by 3.', rows: ['36 ÷ 3 = 12'], machine: { values: ['36', '12', '?'], lit: 0 } },
  { title: 'Box 2: − 5', say: '12 moves on into box 2. Take away the £5 voucher.', rows: ['12 − 5 = 7', '! Output = £7'], machine: { values: ['36', '12', '7'], lit: 1, answer: 2 } },
]), slips(7, [[12, 'That’s after box 1. Now box 2: take away 5.'], [17, 'Box 2 takes 5 away: 12 − 5 = 7.'], [31 / 3, 'Go in order: divide by 3 first, then take away 5.']])))
pounds(practice(forwards, 'A gym charges £5 for each class and takes £8 off with a voucher. Work out the output when the input is 6.', 'A14.1 Q4a', machine(['× 5', '− 8'], ['6', null, '?']), number(22, '£22'), 'Multiply by 5, then take away 8.', machineModel(machine(['× 5', '− 8'], ['6', null, '?']), [
  { title: 'Box 1: × 5', say: '6 classes at £5 each. Multiply the input by 5.', rows: ['6 × 5 = 30'], machine: { values: ['6', '30', '?'], lit: 0 } },
  { title: 'Box 2: − 8', say: '30 moves on into box 2. Take away the £8 voucher.', rows: ['30 − 8 = 22', '! Output = £22'], machine: { values: ['6', '30', '22'], lit: 1, answer: 2 } },
]), slips(22, [[30, 'That’s after box 1. Now box 2: take away 8.'], [38, 'Box 2 takes 8 away: 30 − 8 = 22.'], [-10, 'Go in order: × 5 first, then − 8.']])))
practice(forwards, 'The same machine, × 5 then − 8, is used with an input of −2. Work out the output.', 'A14.1 Q4b', machine(['× 5', '− 8'], ['−2', null, '?']), number(-18, '−18'), 'A negative times a positive is negative. Then take away 8.', machineModel(machine(['× 5', '− 8'], ['−2', null, '?']), [
  { title: 'Box 1: × 5', say: 'A negative number times a positive number is negative.', rows: ['−2 × 5 = −10'], machine: { values: ['−2', '−10', '?'], lit: 0 } },
  { title: 'Box 2: − 8', say: 'Take away 8 from −10: the answer goes further below zero.', rows: ['−10 − 8 = −18', '! Output = −18'], machine: { values: ['−2', '−10', '−18'], lit: 1, answer: 2 } },
]), slips(-18, [[-2, '−10 − 8 goes further below zero, to −18.'], [18, 'Keep the minus sign: −2 × 5 = −10, and −10 − 8 = −18.'], [2, '−2 × 5 is −10, not 10. Then −10 − 8 = −18.'], [-10, 'That’s after box 1. Now take away 8.']]))
const quiz = machine(['× 3', '+ 7', '÷ 2'], ['5', null, null, '?'])
practice(forwards, 'A quiz app turns stars into a team score with this machine: × 3, then + 7, then ÷ 2. Work out the output when the input is 5.', 'A14.1 Q5a', quiz, number(11, '11'), 'Three boxes, in order: × 3, then + 7, then ÷ 2.', machineModel(quiz, [
  { title: 'Box 1: × 3', say: 'Start with the input, 5. Box 1 multiplies by 3.', rows: ['5 × 3 = 15'], machine: { values: ['5', '15', null, '?'], lit: 0 } },
  { title: 'Box 2: + 7', say: '15 moves on into box 2, which adds 7.', rows: ['15 + 7 = 22'], machine: { values: ['5', '15', '22', '?'], lit: 1 } },
  { title: 'Box 3: ÷ 2', say: '22 moves on into box 3, which divides by 2.', rows: ['22 ÷ 2 = 11', '! Output = 11'], machine: { values: ['5', '15', '22', '11'], lit: 2, answer: 3 } },
]), slips(11, [[22, 'That’s after box 2. Now box 3: divide by 2.'], [15, 'That’s after box 1. Keep going: + 7, then ÷ 2.'], [14.5, 'Go in order: add 7 before you divide by 2.']]))
practice(forwards, 'The same quiz machine, × 3 then + 7 then ÷ 2. Work out the output when the input is −7.', 'A14.1 Q5b', machine(['× 3', '+ 7', '÷ 2'], ['−7', null, null, '?']), number(-7, '−7'), 'Take care with the minus sign in every box.', machineModel(machine(['× 3', '+ 7', '÷ 2'], ['−7', null, null, '?']), [
  { title: 'Box 1: × 3', say: 'A negative times a positive is negative.', rows: ['−7 × 3 = −21'], machine: { values: ['−7', '−21', null, '?'], lit: 0 } },
  { title: 'Box 2: + 7', say: 'Adding 7 to −21 moves up towards zero.', rows: ['−21 + 7 = −14'], machine: { values: ['−7', '−21', '−14', '?'], lit: 1 } },
  { title: 'Box 3: ÷ 2', say: 'A negative divided by a positive is negative.', rows: ['−14 ÷ 2 = −7', '! Output = −7'], machine: { values: ['−7', '−21', '−14', '−7'], lit: 2, answer: 3 } },
]), slips(-7, [[7, 'Keep the minus sign: −14 ÷ 2 = −7.'], [-14, 'That’s after box 2. Now divide by 2.'], [-3.5, 'Go in order: + 7 before ÷ 2.'], [-21, 'That’s after box 1. Keep going: + 7, then ÷ 2.']]))
practice(forwards, `Aisha says, “The order of the boxes does not matter.” Machine ① is ${nb('× 3 then + 7')}. Machine ② is ${nb('+ 7 then × 3')}. Put the input 4 into each machine. What comes out of each?`, 'A14.1 Q5c', null, pair(['① ', '② '], [19, 33], '① 19, ② 33'), 'Put 4 through each machine, one box at a time.', machineModel(machine(['× 3', '+ 7'], ['4', null, '?']), [
  { title: 'Machine ①: × 3, then + 7', say: 'Box 1 first: 4 × 3 = 12. Then add 7.', rows: ['> Machine ①', '4 × 3 = 12', '12 + 7 = 19'], machine: { values: ['4', '12', '19'] } },
  { title: 'Machine ②: + 7, then × 3', say: 'The same boxes the other way round. Add 7 first: 4 + 7 = 11. Then multiply by 3.', rows: ['> Machine ②', '4 + 7 = 11', '11 × 3 = 33'], machine: { boxes: ['+ 7', '× 3'], values: ['4', '11', '33'] } },
  { title: 'Compare', say: 'The same input gave two different outputs, so Aisha is wrong: the order of the boxes matters.', rows: ['! 19 is not 33: the order matters'] },
]), both(['Machine ①', 'Machine ②'], [19, 33], [[[33, 19], 'Check which is which: machine ① does × 3 first.'], [[19, 19], 'Machine ② adds 7 first: 4 + 7 = 11, then 11 × 3 = 33.']]))

/* ---------- Rung 2: output to input (A14.2) ---------- */

const taxi = machine(['× 5', '− 4'], ['?', null, '26'], { back: true })
const fare = worked(backwards, 'A taxi charges £5 for each mile, then takes £4 off with a voucher. Joe’s fare, the output, was £26. Work out the input, the number of miles.', 'Output 26: what went in?', 'A14.2 video + Q1', machineModel(taxi, [
  { title: 'Undo box 2: − 4', say: 'We know the output, so go backwards and undo the last box first. Box 2 takes away 4; its opposite is + 4.', rows: ['26 + 4 = 30'], machine: { values: ['?', '30', '26'], undo: [null, '+ 4'], lit: 1 } },
  { title: 'Undo box 1: × 5', say: 'Box 1 multiplies by 5; its opposite is ÷ 5. What comes out is the input.', rows: ['30 ÷ 5 = 6', '! Input = 6 miles'], machine: { values: ['6', '30', '26'], undo: ['÷ 5', '+ 4'], lit: 0, answer: 0 } },
]), 'Our aim: go backwards from the output to the input, undoing the last box first. + and − undo each other, and so do × and ÷.')
video(fare, media('output-to-input', 'Output 26, × 5, − 4: what went in?', 'A14.2_Function_Machines_Output_To_Input.mp4', 104, [
  'A taxi fare: £5 a mile, then £4 off. Joe paid £26. How many miles? The input is unknown: × 5, then − 4, gives the output 26.',
  'Going backwards: this time we know the output, not the input. So we go backwards, from the output to the input. To go backwards, undo each box with its opposite: + and − are opposites, × and ÷ are opposites.',
  'See it going backwards: we know the output, 26. Undo box 2 (− 4) with + 4: 26 + 4 = 30. Undo box 1 (× 5) with ÷ 5: 30 ÷ 5 = 6. The input was 6.',
  'Undo box 2, − 4: go backwards, so undo the last box first. Box 2 is − 4, its opposite is + 4. 26 + 4 = 30. Now we are at 30, just before box 2.',
  'Undo box 1, × 5: box 1 is × 5, its opposite is ÷ 5. 30 ÷ 5 = 6. The input was 6.',
  'Check it: put 6 into the machine and go forwards. 6 × 5 = 30, 30 − 4 = 26. We get 26, the output we were given.',
  'Where you see it: a taxi charges £5 for each mile, then takes £4 off. Joe paid £26: 26 + 4 = 30, 30 ÷ 5 = 6, so 6 miles.',
  'Start at the output, undo the last box first, and use opposites: + and −, × and ÷.',
]))
pounds(practice(backwards, 'A shop takes £6 off every price. The output is 14. Work out the input.', 'A14.2 Q2', machine(['− 6'], ['?', '14'], { back: true }), number(20, '£20'), 'Undo taking away 6 by adding 6.', machineModel(machine(['− 6'], ['?', '14'], { back: true }), [
  { title: 'Undo box 1: − 6', say: 'The box takes away 6. Its opposite is + 6.', rows: ['14 + 6 = 20', '! Input = £20'], machine: { values: ['20', '14'], undo: ['+ 6'], lit: 0, answer: 0 } },
]), slips(20, [[8, 'Undo − 6 with its opposite: add 6.']])))
pounds(practice(backwards, 'A florist adds £7 delivery to the price of the flowers, then doubles the total for a rush order. The output is 30. Work out the input.', 'A14.2 Q3', machine(['+ 7', '× 2'], ['?', null, '30'], { back: true }), number(8, '£8'), 'Undo the last box first: it doubles, so divide by 2.', machineModel(machine(['+ 7', '× 2'], ['?', null, '30'], { back: true }), [
  { title: 'Undo box 2: × 2', say: 'Undo the last box first. It doubles, so its opposite is ÷ 2.', rows: ['30 ÷ 2 = 15'], machine: { values: ['?', '15', '30'], undo: [null, '÷ 2'], lit: 1 } },
  { title: 'Undo box 1: + 7', say: 'Box 1 adds 7. Its opposite is − 7.', rows: ['15 − 7 = 8', '! Input = £8'], machine: { values: ['8', '15', '30'], undo: ['− 7', '÷ 2'], lit: 0, answer: 0 } },
]), slips(8, [[11.5, 'Undo the last box first: divide by 2, then take away 7.'], [15, 'That’s before box 2. Now undo + 7: take away 7.'], [22, 'Undo + 7 with its opposite: take 7 away.']])))
practice(backwards, 'Here is a function machine: ÷ 4, then + 9. The output is 15. Work out the input.', 'A14.2 Q4a', machine(['÷ 4', '+ 9'], ['?', null, '15'], { back: true }), number(24, '24'), 'Undo + 9 first by taking away 9. Then undo ÷ 4.', machineModel(machine(['÷ 4', '+ 9'], ['?', null, '15'], { back: true }), [
  { title: 'Undo box 2: + 9', say: 'Undo the last box first. It adds 9, so take away 9.', rows: ['15 − 9 = 6'], machine: { values: ['?', '6', '15'], undo: [null, '− 9'], lit: 1 } },
  { title: 'Undo box 1: ÷ 4', say: 'Box 1 divides by 4. Its opposite is × 4.', rows: ['6 × 4 = 24', '! Input = 24'], machine: { values: ['24', '6', '15'], undo: ['× 4', '− 9'], lit: 0, answer: 0 } },
]), slips(24, [[6, 'That’s before box 2. Now undo ÷ 4: multiply by 4.'], [51, 'Undo the last box first: take away 9, then multiply by 4.'], [1.5, 'Undo ÷ 4 with its opposite: multiply by 4.']]))
practice(backwards, 'The same machine, ÷ 4 then + 9. The output is 2. Work out the input.', 'A14.2 Q4b', machine(['÷ 4', '+ 9'], ['?', null, '2'], { back: true }), number(-28, '−28'), 'Same order of undoing: take away 9, then multiply by 4. Watch the minus sign.', machineModel(machine(['÷ 4', '+ 9'], ['?', null, '2'], { back: true }), [
  { title: 'Undo box 2: + 9', say: 'Take away 9. 2 − 9 goes below zero.', rows: ['2 − 9 = −7'], machine: { values: ['?', '−7', '2'], undo: [null, '− 9'], lit: 1 } },
  { title: 'Undo box 1: ÷ 4', say: 'Multiply by 4. A negative times a positive is negative.', rows: ['−7 × 4 = −28', '! Input = −28'], machine: { values: ['−28', '−7', '2'], undo: ['× 4', '− 9'], lit: 0, answer: 0 } },
]), slips(-28, [[28, '2 − 9 is −7, below zero. Then −7 × 4 = −28.'], [-7, 'That’s before box 2. Now multiply by 4.'], [44, 'Undo + 9 with its opposite: take 9 away.']]))
const halves = machine(['× 3', '− 6', '÷ 2'], ['?', null, null, '9'], { back: true })
practice(backwards, 'Here is a function machine: × 3, then − 6, then ÷ 2. The output is 9. Work out the input.', 'A14.2 Q5a', halves, number(8, '8'), 'Start from the end: undo ÷ 2, then − 6, then × 3.', machineModel(halves, [
  { title: 'Undo box 3: ÷ 2', say: 'Start from the end. Box 3 divides by 2, so multiply by 2.', rows: ['9 × 2 = 18'], machine: { values: ['?', null, '18', '9'], undo: [null, null, '× 2'], lit: 2 } },
  { title: 'Undo box 2: − 6', say: 'Box 2 takes away 6, so add 6.', rows: ['18 + 6 = 24'], machine: { values: ['?', '24', '18', '9'], undo: [null, '+ 6', '× 2'], lit: 1 } },
  { title: 'Undo box 1: × 3', say: 'Box 1 multiplies by 3, so divide by 3.', rows: ['24 ÷ 3 = 8', '! Input = 8'], machine: { values: ['8', '24', '18', '9'], undo: ['÷ 3', '+ 6', '× 2'], lit: 0, answer: 0 } },
]), slips(8, [[24, 'That’s before box 1. Now undo × 3: divide by 3.'], [4, 'Undo − 6 with its opposite: add 6.'], [18, 'That’s before box 3. Keep going: undo − 6, then × 3.']]))
practice(backwards, 'Show that 8 is the right input: put 8 through the machine × 3, then − 6, then ÷ 2. What comes out?', 'A14.2 Q5b', machine(['× 3', '− 6', '÷ 2'], ['8', null, null, '?']), number(9, '9'), 'Go forwards this time: × 3, then − 6, then ÷ 2.', machineModel(machine(['× 3', '− 6', '÷ 2'], ['8', null, null, '?']), [
  { title: 'Box 1: × 3', say: 'To check, put the input through the machine going forwards.', rows: ['8 × 3 = 24'], machine: { values: ['8', '24', null, '?'], lit: 0 } },
  { title: 'Box 2: − 6', say: '24 moves on into box 2, which takes away 6.', rows: ['24 − 6 = 18'], machine: { values: ['8', '24', '18', '?'], lit: 1 } },
  { title: 'Box 3: ÷ 2', say: 'Divide by 2. It should be the output we started from, 9.', rows: ['18 ÷ 2 = 9', '! Output = 9 ✓'], machine: { values: ['8', '24', '18', '9'], lit: 2, answer: 3 } },
]), slips(9, [[18, 'That’s after box 2. Now divide by 2.'], [24, 'That’s after box 1. Keep going: − 6, then ÷ 2.']]))
practice(backwards, 'Ben says, “To go backwards, undo the first box first.” The machine is × 4, then + 3, and the output is 19. Is Ben right?', 'A14.2 Q5c', machine(['× 4', '+ 3'], ['?', null, '19'], { back: true }), choose(
  'No: undoing the last box first gives 4, and Ben’s way gives 1.75',
  ['Yes: 19 ÷ 4 = 4.75, then 4.75 − 3 = 1.75', 'Put 1.75 through the machine: 1.75 × 4 + 3 = 10, not 19.'],
  ['Yes: the order doesn’t matter going backwards', 'It does. Undo the last box first: 19 − 3 = 16, then 16 ÷ 4 = 4.'],
  ['No: undo + 3 by adding 3', 'Undo + 3 with its opposite, − 3. Ben’s mistake is the order.'],
), 'Find the real input by undoing the last box first. Then try Ben’s way.', machineModel(machine(['× 4', '+ 3'], ['?', null, '19'], { back: true }), [
  { title: 'Undo box 2: + 3', say: 'The right way: undo the last box first. Take away 3.', rows: ['19 − 3 = 16'], machine: { values: ['?', '16', '19'], undo: [null, '− 3'], lit: 1 } },
  { title: 'Undo box 1: × 4', say: 'Divide by 4. The real input is 4: 4 × 4 + 3 = 19.', rows: ['16 ÷ 4 = 4'], machine: { values: ['4', '16', '19'], undo: ['÷ 4', '− 3'], lit: 0 } },
  { title: 'Try Ben’s way', say: 'Ben undoes × 4 first, then + 3. He gets 1.75, not 4, so Ben is wrong.', rows: ['> Ben', '19 ÷ 4 = 4.75', '4.75 − 3 = 1.75', '! 1.75 is not 4: Ben is wrong'] },
], 'Why'))

/* ---------- Rung 3: creating function machines (A14.3) ---------- */

const empty = (boxes: number) => machine(Array(boxes).fill('?'), ['x', ...Array(boxes - 1).fill(null), 'y'])
const ticket = worked(creating, `A fairground stall charges £3 for each ticket plus a £4 entry fee. For x tickets the cost is £y, where ${nb('y = 3x + 4')}. Fill in the function machine.`, 'y = 3x + 4: what are the boxes?', 'A14.3 video + Q1', machineModel(empty(2), [
  { title: 'Box 1: × 3', say: 'x goes in. BIDMAS: 3x, which is 3 × x, is worked out before the + 4. So box 1 is × 3.', marks: [[0, box('3x')]], rows: ['x × 3 = 3x'], machine: { boxes: ['× 3', '?'], values: ['x', '3x', 'y'], lit: 0 } },
  { title: 'Box 2: + 4', say: 'What is left in the equation is + 4. Add 4 to 3x and out comes y.', marks: [[0, box('+4')]], rows: ['3x +4 = y', '! × 3, then + 4'], machine: { boxes: ['× 3', '+ 4'], values: ['x', '3x', 'y'], lit: 1 } },
], 'Work it out', ['y = 3x +4']), 'Our aim: turn the equation into boxes, in the order BIDMAS works them out. Brackets and the top of a fraction come first, then × and ÷, then + and −.')
video(ticket, media('creating', 'y = 3x + 4: what are the two boxes?', 'A14.3_Creating_Function_Machines.mp4', 112, [
  'A ticket stall: y = 3x + 4. What are the two boxes?',
  'A machine from an equation: x is the input, y is the output. The equation tells us what is done to x. Each thing it does becomes one box. We must find the boxes, and their order.',
  'See the finished machine: x goes in. Box 1 turns x into 3x (× 3). Box 2 turns 3x into 3x + 4 (+ 4). y comes out: y = 3x + 4.',
  'Which box comes first? Try x = 5: what happens to it first? BIDMAS: the 3x is worked out before the + 4. 3x means 3 × x, so x = 5 gives 3 × 5 = 15. So box 1 is × 3.',
  'The second box: what is left in the equation? + 4. So box 2 is + 4. 15 + 4 = 19. The machine is x, × 3, + 4, y. Check: 3 × 5 + 4 = 19, the same answer.',
  'Brackets and fractions: what about y = (x + 2) ÷ 5? Brackets first, so box 1 is + 2. Then divide, so box 2 is ÷ 5. The machine is x, + 2, ÷ 5, y.',
  'Where you see it: a stall charges £3 a ticket plus a £4 entry fee, y = 3x + 4. How much for 5 tickets? 3 × 5 + 4 = 19, so £19.',
  'x goes in and y comes out. BIDMAS: brackets, then × and ÷, then + and −. One box for each thing done to x.',
]))
practice(creating, `A school trip costs £8 more than the ticket price. If the ticket costs £x, the trip costs £y, where ${nb('y = x + 8')}. Which box goes in the function machine?`, 'A14.3 Q2', empty(1), choose(
  '+ 8',
  ['× 8', 'x × 8 would be written 8x. Here 8 is added to x.'],
  ['− 8', 'The trip costs £8 more, so 8 is added, not taken away.'],
  ['÷ 8', 'Nothing is divided: 8 is added to x.'],
), 'What is the only thing done to x?', machineModel(empty(1), [
  { title: 'Box 1: + 8', say: 'The only thing done to x is adding 8.', marks: [[0, box('+8')]], rows: ['x +8 = y', '! + 8'], machine: { boxes: ['+ 8'], values: ['x', 'y'], lit: 0 } },
], 'Work it out', ['y = x +8']))
practice(creating, `A baker packs x boxes with 5 muffins in each, then takes 2 muffins home. The number left is y, where ${nb('y = 5x − 2')}. Fill in the function machine.`, 'A14.3 Q3', empty(2), choose(
  '× 5, then − 2',
  ['− 2, then × 5', 'BIDMAS: 5x is worked out before taking away 2, so × 5 comes first.'],
  ['× 2, then − 5', '5x is 5 × x. The number taken away is 2.'],
  ['+ 5, then − 2', '5x means 5 × x, not x + 5.'],
), 'Multiplication comes before subtraction.', machineModel(empty(2), [
  { title: 'Box 1: × 5', say: '5x means 5 × x. Multiplication comes before subtraction, so box 1 is × 5.', marks: [[0, box('5x')]], rows: ['x × 5 = 5x'], machine: { boxes: ['× 5', '?'], values: ['x', '5x', 'y'], lit: 0 } },
  { title: 'Box 2: − 2', say: 'What is left is − 2. Take 2 away from 5x and out comes y.', marks: [[0, box('−2')]], rows: ['5x −2 = y', '! × 5, then − 2'], machine: { boxes: ['× 5', '− 2'], values: ['x', '5x', 'y'], lit: 1 } },
], 'Work it out', ['y = 5x −2']))
practice(creating, `Four friends share a bill of £x plus a £6 tip. Each person pays £y, where ${nb('y = (x + 6) ÷ 4')}: x + 6 over 4. Fill in the function machine.`, 'A14.3 Q4a', empty(2), choose(
  '+ 6, then ÷ 4',
  ['÷ 4, then + 6', 'The whole top, x + 6, is divided by 4, so + 6 comes first.'],
  ['× 4, then + 6', 'The fraction line means divide, and the top is worked out first.'],
  ['+ 6, then × 4', 'The fraction line means ÷ 4, not × 4.'],
), 'The top of the fraction is worked out first.', machineModel(empty(2), [
  { title: 'Box 1: + 6', say: 'The top of the fraction, x + 6, is worked out first. So box 1 is + 6.', rows: ['> Box 1: + 6 makes x + 6'], machine: { boxes: ['+ 6', '?'], values: ['x', 'x + 6', 'y'], lit: 0 } },
  { title: 'Box 2: ÷ 4', say: 'Then the whole top is divided by 4, and out comes y.', rows: ['(x + 6) ÷ 4 = y', '! + 6, then ÷ 4'], machine: { boxes: ['+ 6', '÷ 4'], values: ['x', 'x + 6', 'y'], lit: 1 } },
], 'Work it out', ['y = (x + 6) ÷ 4']))
practice(creating, `Use the machine for ${nb('y = (x + 6) ÷ 4')}, + 6 then ÷ 4, to work out y when x = 10.`, 'A14.3 Q4b', machine(['+ 6', '÷ 4'], ['10', null, '?']), number(4, 'y = 4'), 'Put 10 through the machine, one box at a time.', machineModel(machine(['+ 6', '÷ 4'], ['10', null, '?']), [
  { title: 'Box 1: + 6', say: 'Put 10 in. Box 1 adds 6.', rows: ['10 + 6 = 16'], machine: { values: ['10', '16', '?'], lit: 0 } },
  { title: 'Box 2: ÷ 4', say: '16 moves on into box 2, which divides by 4.', rows: ['16 ÷ 4 = 4', '! y = 4'], machine: { values: ['10', '16', '4'], lit: 1, answer: 2 } },
]), slips(4, [[16, 'That’s after box 1. Now divide by 4.'], [8.5, 'Go in order: + 6 first, then ÷ 4.']]))
practice(creating, `A club doubles its budget of £x, adds £5 for tools, then shares the total between 3 teams. Each team gets £y, where ${nb('y = (2x + 5) ÷ 3')}: 2x + 5 over 3. Fill in the function machine.`, 'A14.3 Q5a', empty(3), choose(
  '× 2, then + 5, then ÷ 3',
  ['+ 5, then × 2, then ÷ 3', 'On the top, 2x is worked out before adding 5.'],
  ['÷ 3, then × 2, then + 5', 'The whole top is divided by 3, so ÷ 3 comes last.'],
  ['× 2, then ÷ 3, then + 5', 'The 5 is on the top of the fraction, so add it before dividing.'],
), 'Look at the top of the fraction first: 2x + 5.', machineModel(empty(3), [
  { title: 'Box 1: × 2', say: 'Look at the top of the fraction, 2x + 5. Multiplication first: box 1 is × 2.', rows: ['x × 2 = 2x'], machine: { boxes: ['× 2', '?', '?'], values: ['x', '2x', null, 'y'], lit: 0 } },
  { title: 'Box 2: + 5', say: 'Then add 5, to finish the top.', rows: ['> Box 2: + 5 makes 2x + 5'], machine: { boxes: ['× 2', '+ 5', '?'], values: ['x', '2x', '2x + 5', 'y'], lit: 1 } },
  { title: 'Box 3: ÷ 3', say: 'The whole top is then divided by 3, and out comes y.', rows: ['(2x + 5) ÷ 3 = y', '! × 2, then + 5, then ÷ 3'], machine: { boxes: ['× 2', '+ 5', '÷ 3'], values: ['x', '2x', '2x + 5', 'y'], lit: 2 } },
], 'Work it out', ['y = (2x + 5) ÷ 3']))
practice(creating, `Use the machine for ${nb('y = (2x + 5) ÷ 3')}, × 2 then + 5 then ÷ 3, to work out y when x = 8.`, 'A14.3 Q5b', machine(['× 2', '+ 5', '÷ 3'], ['8', null, null, '?']), number(7, 'y = 7'), 'Put 8 through all three boxes.', machineModel(machine(['× 2', '+ 5', '÷ 3'], ['8', null, null, '?']), [
  { title: 'Box 1: × 2', say: 'Put 8 in. Box 1 multiplies by 2.', rows: ['8 × 2 = 16'], machine: { values: ['8', '16', null, '?'], lit: 0 } },
  { title: 'Box 2: + 5', say: '16 moves on into box 2, which adds 5.', rows: ['16 + 5 = 21'], machine: { values: ['8', '16', '21', '?'], lit: 1 } },
  { title: 'Box 3: ÷ 3', say: '21 moves on into box 3, which divides by 3.', rows: ['21 ÷ 3 = 7', '! y = 7'], machine: { values: ['8', '16', '21', '7'], lit: 2, answer: 3 } },
]), slips(7, [[21, 'That’s after box 2. Now divide by 3.'], [16, 'That’s after box 1. Keep going: + 5, then ÷ 3.'], [31 / 3, 'Add 5 before you divide: it is on the top of the fraction.']]))
practice(creating, `Dev says the function machine for ${nb('y = 3x + 4')} is + 4, then × 3. Put x = 2 into the equation, then into Dev’s machine. Write y from the equation, then what comes out of Dev’s machine.`, 'A14.3 Q5c', machine(['+ 4', '× 3'], ['2', null, '?']), pair(['y =', 'Dev:'], [10, 18], 'y = 10, Dev 18'), 'Equation first: 3 × 2 + 4. Then Dev’s machine: 2 + 4, then × 3.', machineModel(machine(['+ 4', '× 3'], ['2', null, '?']), [
  { title: 'Put x = 2 into the equation', say: 'BIDMAS: 3 × 2 first, then add 4.', rows: ['3 × 2 + 4 = 10'] },
  { title: 'Put 2 through Dev’s machine', say: 'Dev adds 4 first: 2 + 4 = 6. Then 6 × 3 = 18.', rows: ['2 + 4 = 6', '6 × 3 = 18'], machine: { values: ['2', '6', '18'] } },
  { title: 'Compare', say: 'The equation gives 10 but Dev’s machine gives 18, so Dev is wrong: × 3 comes first.', rows: ['! 18 is not 10: Dev is wrong'] },
], 'Why'), both(['The equation', 'Dev’s machine'], [10, 18], [[[18, 10], 'Check which is which: the equation does × 3 first and gives 10.'], [[18, 18], 'BIDMAS in the equation: 3 × 2 = 6 first, then + 4 = 10.']]))

add('mixed', 'Function machines', 'A14.1-A14.3 consolidation', text(
  'Input to output: go through the boxes in order, left to right, one box at a time, writing the number after each box.',
  'Output to input: start at the output and undo the last box first. + and − undo each other, and so do × and ÷.',
  'From an equation: x goes in and y comes out. One box for each thing done to x, in BIDMAS order: y = 3x + 4 is × 3, then + 4.',
  'The order of the boxes matters: × 3 then + 7 is not the same as + 7 then × 3.',
))

export const tutorFunctionMachinesLesson: TutorMethodLesson = {
  id: 'L029', number: 29, title: 'Function machines', level: 'GCSE Foundation',
  goal: 'Put a number through a function machine, work backwards from the output to the input, and turn an equation like y = 3x + 4 into a machine.',
  labels: { [forwards]: 'Input to output', [backwards]: 'Output to input', [creating]: 'From an equation', mixed: 'Review' },
  states: finish(),
}
