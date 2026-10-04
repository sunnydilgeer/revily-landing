import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Round, type Task } from '../kit/types'

/*
 * Sugar Rush: a shift at an NHS diabetes and reflex clinic with Nurse Kemi (AQA Trilogy 4.5
 * Homeostasis and response, Foundation: the reflex arc, blood glucose and insulin, type 1 and type 2
 * diabetes, hormones in the menstrual cycle, and the reaction time required practical). Every answer
 * is picked first, then the patient is built around it, so the numbers stay friendly. Spec-level
 * biology only: no doses, no treatment advice.
 */

/** What the stage draws: a nerve pathway, the glucose monitor, the waiting room as dots, a calendar, a cycle timeline or the ruler drop. */
export type Scene = {
  layout: 'reflex' | 'glucose' | 'crowd' | 'calendar' | 'cycles' | 'ruler'
  /** The given values, in the readout beside the picture. */
  given: [string, string][]
  /** Reflex: the emoji at the receptor and at the effector. */
  reflex?: { from: string; to: string }
  /** Glucose monitor: dial the rise (peak = start + dial) or the fall time (back at peak time + dial). */
  glucose?: { mode: 'rise' | 'fall'; base: number; peak: number; peakAt: number; backAt: number }
  /** Waiting room: dots, patients per dot, dots already coloured (type 1, then matched type 2). */
  crowd?: { dots: number; per: number; type1: number; matched: number; key: string }
  /** Calendar: the date of day 1 of the cycle. */
  calendar?: { start: number }
  /** Cycle timeline: how many days are tracked. */
  days?: number
  /** Ruler drop: the trials to show, which one is the anomaly (−1 for none), and the mean before (for the change). */
  ruler?: { trials: number[]; anomaly: number; before?: number }
}
export type SugarTask = Task<Scene>
export type SugarRound = Round<Scene>

const ordinal = (d: number) => `${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`
export { ordinal }

/** Round 1: speed of a nerve impulse = distance ÷ time, then the time for a reflex in ms. */
function reflexRound(rand: Rand): SugarRound {
  const pairs: [number, number][] = []
  for (const t of [0.01, 0.02, 0.04, 0.05]) for (let v = 20; v <= 100; v += 10) {
    const d = Number((v * t).toFixed(3))
    if (d >= 0.4 && d <= 2 && Number.isInteger(Number((d * 10).toFixed(3)))) pairs.push([v, t])
  }
  const [v, t] = rand.pick(pairs), d = Number((v * t).toFixed(3))
  const fix1 = `Speed = distance ÷ time = ${n(d)} ÷ ${n(t)} = ${v} m/s.`
  const t1: SugarTask = {
    id: 'reflex-1', prompt: `A patient treads on a drawing pin (ouch). The impulse travels ${n(d)} m from her foot to her spinal cord in ${n(t)} s. How fast is the impulse?`,
    label: 'Impulse speed', unit: 'm/s', answer: v, start: 0, min: 0, max: 200, step: 10, jump: 50,
    win: `Nerve impulses are electrical, so they are fast. ${fix1}`,
    nope: value => diagnose(v, value, 'm/s', [
      [v * 10, `Out by 10. Count the decimal places in ${n(t)} carefully.`],
      [v / 10, `Out by 10. Count the decimal places in ${n(t)} carefully.`],
    ], fix1),
    scene: { layout: 'reflex', reflex: { from: '🦶', to: '🦵' }, given: [['Distance', `${n(d)} m`], ['Time', `${n(t)} s`]] },
  }

  const times = [10, 20, 30, 40, 50, 60].filter(ms => v * ms / 1000 >= 0.6 && v * ms / 1000 <= 2.4)
  const ms = rand.pick(times), d2 = Number((v * ms / 1000).toFixed(3)), s = Number((ms / 1000).toFixed(3))
  const fix2 = `Time = distance ÷ speed = ${n(d2)} ÷ ${v} = ${n(s)} s = ${ms} ms.`
  const t2: SugarTask = {
    id: 'reflex-2', prompt: `Hot pan! The pathway from fingertip to spinal cord and back to the arm muscle is ${n(d2)} m. At ${v} m/s, how long does the impulse take, in milliseconds (ms)?`,
    label: 'Impulse time', unit: 'ms', answer: ms, start: 0, min: 0, max: 200, step: 5, jump: 20,
    win: `Rearrange: time = distance ÷ speed, then × 1000 to get ms. ${fix2} Faster than you can say “ouch”.`,
    nope: value => diagnose(ms, value, 'ms', [
      [ms / 10, `1 s is 1000 ms, not 100. ${n(s)} s × 1000 = ${ms} ms.`],
      [ms * 10, `1 s is 1000 ms, not 10,000. ${n(s)} s × 1000 = ${ms} ms.`],
      [v, `That’s the speed. Time = distance ÷ speed.`],
      [Number((d2 * v).toFixed(3)), `You multiplied. Time = distance ÷ speed.`],
    ], fix2),
    scene: { layout: 'reflex', reflex: { from: '✋', to: '💪' }, given: [['Distance', `${n(d2)} m`], ['Speed', `${v} m/s`]] },
  }

  const right = 'Receptor → sensory neurone → relay neurone → motor neurone → effector'
  return {
    id: 'reflex', title: 'Round 1 · Triage', headline: 'The reflex arc',
    why: `A reflex is automatic and rapid: it doesn’t involve the conscious part of your brain. A receptor detects the stimulus. An impulse travels along a sensory neurone to a relay neurone in the spinal cord, then along a motor neurone to an effector, usually a muscle. Speed = distance ÷ time, so time = distance ÷ speed.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which is the right order for a reflex arc?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'motor-first', label: 'Receptor → motor neurone → relay neurone → sensory neurone → effector', nope: 'Sensory and motor are swapped. SENSORY neurones carry the impulse in from the receptor; MOTOR neurones carry it out to the effector.' },
        { value: 'brain', label: 'Receptor → sensory neurone → conscious brain → motor neurone → effector', nope: 'A reflex skips the conscious brain: that’s why it’s so fast. The relay neurone is in the spinal cord.' },
        { value: 'backwards', label: 'Effector → motor neurone → relay neurone → sensory neurone → receptor', nope: 'That’s backwards. It starts at the receptor, which detects the pin, and ends at the effector, the muscle that moves.' },
      ], { count: 4 }),
      why: `Receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector. Skipping the conscious brain makes it fast.`,
    },
    chain: [
      { line: `[[t:\\text{time}]] = [[d:\\text{distance}]] \\div [[v:\\text{speed}]]` },
      { line: `[[t:\\text{time}]] = [[d:${tex(d2)}]] \\div [[v:${v}]]`, op: 'Swap in', why: `The pathway is ${n(d2)} m and the impulse travels at ${v} m/s.` },
      { line: `[[t:\\text{time}]] = [[s:${tex(s)}]]\\,\\text{s}`, op: 'Divide', merge: { s: ['d', 'v'] }, why: `${n(d2)} ÷ ${v} = ${n(s)} s.` },
      { line: `[[t:\\text{time}]] = [[m:${ms}]]\\,\\text{ms}`, op: '× 1000', merge: { m: ['s'] }, why: `1 s = 1000 ms, so ${n(s)} s = ${ms} ms.` },
    ],
  }
}

/** Round 2: a glucose tolerance test on the monitor: the rise to the peak, then the time to fall back. */
function glucoseRound(rand: Rand): SugarRound {
  const base = rand.int(4, 6), rise = rand.int(3, 6), peak = base + rise
  const peakAt = rand.pick([30, 45, 60]), fall = rand.int(60, 150, 15), backAt = peakAt + fall
  const g = { base, peak, peakAt, backAt }
  const fix1 = `Rise = peak − start = ${peak} − ${base} = ${rise} mmol/L.`
  const t1: SugarTask = {
    id: 'gluc-1', prompt: `Glucose test: a patient drinks a sugary drink. The monitor starts at ${base} mmol/L and peaks at ${peak} mmol/L. How much did her blood glucose rise?`,
    label: 'Glucose rise', unit: 'mmol/L', answer: rise, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Glucose from the drink is absorbed into the blood, so the level rises. ${fix1}`,
    nope: value => diagnose(rise, value, 'mmol/L', [
      [peak, `That’s the peak reading. The RISE is how far it went up from the start.`],
      [base, `That’s where it started. Take it away from the peak.`],
      [peak + base, `You added. A rise is a difference: peak − start.`],
    ], fix1),
    scene: { layout: 'glucose', glucose: { mode: 'rise', ...g }, given: [['Start', `${base} mmol/L`], ['Peak', `${peak} mmol/L`]] },
  }

  const fix2 = `Time to fall = ${backAt} − ${peakAt} = ${fall} minutes.`
  const t2: SugarTask = {
    id: 'gluc-2', prompt: `The peak is at ${peakAt} minutes. It’s back down to ${base} mmol/L at ${backAt} minutes. How long did it take to fall back?`,
    label: 'Time to fall', unit: 'min', answer: fall, start: 0, min: 0, max: 300, step: 15, jump: 60,
    win: `Insulin brings it back down. ${fix2}`,
    nope: value => diagnose(fall, value, 'min', [
      [backAt, `That’s the time on the clock when it got back down. Start counting from the peak at ${peakAt} min.`],
      [peakAt, `That’s when it peaked. How long from then until ${backAt} min?`],
      [backAt + peakAt, `You added the times. Take the peak time away: ${backAt} − ${peakAt}.`],
    ], fix2),
    scene: { layout: 'glucose', glucose: { mode: 'fall', ...g }, given: [['Peak at', `${peakAt} min`], ['Back at', `${backAt} min`]] },
  }

  const right = 'Insulin, from the pancreas: glucose moves into cells and the liver stores some as glycogen'
  return {
    id: 'gluc', title: 'Round 2 · Glucose test', headline: 'Blood glucose',
    why: `Your body keeps blood glucose within a narrow range: that’s homeostasis. After a meal, glucose is absorbed and the level rises. The pancreas detects this and releases the hormone insulin into the blood. Insulin makes glucose move from the blood into cells. In the liver and muscles, extra glucose is stored as glycogen. To read a change off a graph, take the start away from the end.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Her glucose is high after the drink. What brings it back down?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'liver-insulin', label: 'Insulin, made by the liver', nope: 'Insulin is made by the PANCREAS. The liver is where some of the glucose gets stored, as glycogen.' },
        { value: 'glycogen-hormone', label: 'Glycogen, a hormone that turns glucose into insulin', nope: 'Glycogen isn’t a hormone: it’s the storage form of glucose. The hormone is insulin, from the pancreas.' },
        { value: 'kidneys', label: 'The kidneys, by sweating it out', nope: 'Kidneys don’t sweat, and that’s not how it works. The pancreas releases insulin so glucose moves into cells.' },
      ], { count: 4 }),
      why: `The pancreas releases insulin. Glucose moves from the blood into cells, and the liver and muscles store extra as glycogen.`,
    },
    chain: [
      { line: `[[r:\\text{rise}]] = [[p:\\text{peak}]] - [[b:\\text{start}]]` },
      { line: `[[r:\\text{rise}]] = [[p:${peak}]] - [[b:${base}]]`, op: 'Read the graph', why: `The trace starts at ${base} mmol/L and peaks at ${peak} mmol/L.` },
      { line: `[[r:\\text{rise}]] = [[c:${rise}]]\\,\\text{mmol/L}`, op: 'Subtract', merge: { c: ['p', 'b'] }, why: `${peak} − ${base} = ${rise}. Then insulin takes ${fall} minutes to bring it back.` },
    ],
  }
}

/** Round 3: the clinic list: how many patients have type 2 diabetes, and how many more than type 1. */
function typesRound(rand: Rand): SugarRound {
  const N = rand.pick([200, 400, 500, 800, 1000]), P = rand.pick([80, 85, 90]), t2n = N * P / 100, t1n = N - t2n, diff = t2n - t1n
  const per = N / 20
  const fix1 = `${P}% of ${n(N)} = ${P} ÷ 100 × ${n(N)} = ${n(t2n)}.`
  const t1: SugarTask = {
    id: 'types-1', prompt: `${n(N)} patients on the clinic list. ${P}% have type 2 diabetes. How many is that?`,
    label: 'Type 2 count', unit: 'patients', answer: t2n, start: 0, min: 0, max: N, step: 5, jump: 50,
    win: `Type 2 is by far the most common kind in the UK. ${fix1}`,
    nope: value => diagnose(t2n, value, 'patients', [
      [P, `That’s the percentage, not the patients. Find ${P}% OF ${n(N)}.`],
      [t1n, `That’s everyone else: the type 1 patients. Find the ${P}%.`],
      [N - P, `You took a percentage away from a number of people. Find ${P}% of ${n(N)}.`],
      [N * P / 10, `You divided by 10. A percentage is out of 100.`],
      [N, `That’s the whole list. Only ${P}% have type 2.`],
    ], fix1),
    scene: { layout: 'crowd', given: [['Patients', n(N)], ['Type 2', `${P}%`]], crowd: { dots: 20, per, type1: 0, matched: 0, key: `1 dot = ${per} patients` } },
  }

  const fix2 = `Type 1: ${n(N)} − ${n(t2n)} = ${n(t1n)}. Then ${n(t2n)} − ${n(t1n)} = ${n(diff)} more.`
  const t2: SugarTask = {
    id: 'types-2', prompt: `Everyone else on the list has type 1. How many MORE patients have type 2 than type 1?`,
    label: 'Difference', unit: 'patients', answer: diff, start: 0, min: 0, max: N, step: 5, jump: 50,
    win: `“How many more” is a difference: find both groups, then subtract. ${fix2}`,
    nope: value => diagnose(diff, value, 'patients', [
      [t1n, `That’s the type 1 patients. Now find how many MORE type 2 there are: ${n(t2n)} − ${n(t1n)}.`],
      [t2n, `That’s all the type 2 patients. Take away the ${n(t1n)} with type 1.`],
      [P - (100 - P), `That’s the difference in percentages. Turn it into patients.`],
      [N, `That’s the whole list. Subtract the type 1 count from the type 2 count.`],
    ], fix2),
    scene: { layout: 'crowd', given: [['Type 2', n(t2n)], ['Type 1', n(t1n)]], crowd: { dots: 20, per, type1: t1n / per, matched: t1n / per, key: `1 dot = ${per} patients` } },
  }

  const right = 'The body’s cells no longer respond to insulin; obesity is a risk factor'
  return {
    id: 'types', title: 'Round 3 · Clinic list', headline: 'Type 1 and type 2',
    why: `In type 1 diabetes the pancreas doesn’t make enough insulin, so blood glucose can rise too high. It’s treated with insulin injections. In type 2 diabetes the body’s cells no longer respond to insulin. Obesity is a risk factor, and it’s treated with a carbohydrate-controlled diet and exercise. To find a percentage of a number, divide by 100 and multiply.`,
    tasks: [t1, t2],
    side: {
      prompt: 'What happens in type 2 diabetes?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'type1', label: 'The pancreas doesn’t make enough insulin', nope: 'That’s type 1. In type 2 the pancreas still makes insulin, but the body’s cells stop responding to it.' },
        { value: 'catch', label: 'You catch it from someone else, like flu', nope: 'Diabetes isn’t infectious: it’s a non-communicable disease. In type 2 the cells stop responding to insulin.' },
        { value: 'glycogen', label: 'The liver runs out of glycogen', nope: 'That’s not it. In type 2 the body’s cells no longer respond to insulin, so blood glucose stays high.' },
      ], { count: 4 }),
      why: `Type 2: the body’s cells no longer respond to insulin, and obesity is a risk factor. Type 1: the pancreas doesn’t make enough insulin.`,
    },
    chain: [
      { line: `[[p:${P}\\%]] \\text{ of } [[n:${tex(N)}]]` },
      { line: `[[a:${tex(t2n)}]]\\text{ type 2}`, op: 'Find the %', merge: { a: ['p', 'n'] }, why: `${P} ÷ 100 × ${n(N)} = ${n(t2n)}.` },
      { line: `[[n:${tex(N)}]] - [[a:${tex(t2n)}]] = [[b:${tex(t1n)}]]\\text{ type 1}`, op: 'The rest', why: `Everyone else has type 1: ${n(N)} − ${n(t2n)} = ${n(t1n)}.` },
      { line: `[[a:${tex(t2n)}]] - [[b:${tex(t1n)}]]`, op: 'How many more', why: `“How many more” means subtract.` },
      { line: `[[d:${tex(diff)}]]\\text{ more}`, op: 'Subtract', merge: { d: ['a', 'b'] }, why: `${n(t2n)} − ${n(t1n)} = ${n(diff)} more patients with type 2.` },
    ],
  }
}

/** Round 4: hormones in the menstrual cycle: the likely ovulation date, then eggs released over a few months. */
function cycleRound(rand: Rand): SugarRound {
  const date = rand.int(15, 30), start = date - 13
  const fix1 = `Day 1 is the ${ordinal(start)}, so day 14 is 13 days later: ${start} + 13 = the ${ordinal(date)}.`
  const t1: SugarTask = {
    id: 'cycle-1', prompt: `A patient’s period started on the ${ordinal(start)} of the month: that’s day 1 of her 28-day cycle. Ovulation is about day 14. On what date is that?`,
    label: 'Ovulation date', unit: '', answer: date, start: 1, min: 1, max: 31, step: 1, jump: 7,
    win: `About halfway through a 28-day cycle, an egg is released from an ovary. ${fix1}`,
    nope: value => diagnose(date, value, '', [
      [start + 14, `So close! The ${ordinal(start)} is already day 1, so day 14 is only 13 days later.`],
      [14, `That’s the day of the CYCLE. Her cycle started on the ${ordinal(start)}, so count on from there.`],
      [start, `That’s day 1, when her period started. Count on to day 14.`],
      [start + 28 <= 31 ? start + 28 : NaN, `That’s when the next cycle starts. Ovulation is about halfway, day 14.`],
    ], fix1),
    scene: { layout: 'calendar', calendar: { start }, given: [['Day 1', `the ${ordinal(start)}`], ['Ovulation', 'day 14']] },
  }

  const k = rand.int(3, 13), days = 28 * k
  const fix2 = `${days} ÷ 28 = ${k} cycles, so about ${k} eggs.`
  const t2: SugarTask = {
    id: 'cycle-2', prompt: `She tracks her cycle for ${days} days. With a regular 28-day cycle, about one egg is released each cycle. About how many eggs is that?`,
    label: 'Egg count', unit: 'eggs', answer: k, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `One egg per cycle, so count the cycles. ${fix2}`,
    nope: value => diagnose(k, value, 'eggs', [
      [days / 14, `You divided by 14. Ovulation is ON day 14, but a cycle is 28 days long.`],
      [days / 7, `That’s the number of weeks. One egg per 28-day cycle: divide by 28.`],
      [k + 1, `One too many. ${days} ÷ 28 = ${k} cycles.`],
    ], fix2),
    scene: { layout: 'cycles', days, given: [['Tracked', `${days} days`], ['Cycle', '28 days']] },
  }

  const right = 'The pituitary gland'
  return {
    id: 'cycle', title: 'Round 4 · Hormone clinic', headline: 'The menstrual cycle',
    why: `Hormones are chemicals carried in the blood to a target organ. The pituitary gland in the brain releases FSH, which makes an egg mature in an ovary. LH, also from the pituitary, makes the ovary release the egg: that’s ovulation, about day 14 of a 28-day cycle. Oestrogen and progesterone keep the lining of the uterus ready.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which gland releases FSH, the hormone that makes an egg mature?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'ovaries', label: 'The ovaries', nope: 'The ovaries release oestrogen, and the eggs. FSH comes from the pituitary gland in the brain.' },
        { value: 'pancreas', label: 'The pancreas', nope: 'The pancreas releases insulin. FSH comes from the pituitary gland.' },
        { value: 'adrenal', label: 'The adrenal glands', nope: 'Not those. FSH comes from the pituitary gland in the brain, the “master gland”.' },
      ], { count: 4 }),
      why: `The pituitary gland makes FSH (egg matures) and LH (egg released). The ovaries make oestrogen.`,
    },
    chain: [
      { line: `[[e:\\text{eggs}]] = [[d:\\text{days}]] \\div [[c:28]]` },
      { line: `[[e:\\text{eggs}]] = [[d:${days}]] \\div [[c:28]]`, op: 'Swap in', why: `She tracked ${days} days, and each cycle is 28 days.` },
      { line: `[[e:\\text{eggs}]] = [[k:${k}]]`, op: 'Divide', merge: { k: ['d', 'c'] }, why: `${days} ÷ 28 = ${k} cycles: about one egg each.` },
    ],
  }
}

/** Round 5 (boss): the reaction time required practical. Mean of four trials (anomaly out), then the change after coffee. */
function reactionRound(rand: Rand): SugarRound {
  const M = rand.int(220, 300, 10)
  const spread = rand.pick([[-20, -10, 10, 20], [-30, 0, 10, 20], [-10, -10, 0, 20], [-20, 0, 0, 20], [-10, 0, 0, 10]])
  const jumpUp = rand.pick([150, 200, 250]), A = M + jumpUp
  const good = rand.shuffle(spread.map(o => M + o)), at = rand.int(0, 4)
  const trials = [...good.slice(0, at), A, ...good.slice(at)]
  const sum = 4 * M, mean5 = (sum + A) / 5
  const fix1 = `Leave out ${A}: (${good.join(' + ')}) ÷ 4 = ${n(sum)} ÷ 4 = ${M} ms.`
  const t1: SugarTask = {
    id: 'react-1', prompt: `Ruler-drop test for Dev the porter. Five catches: ${trials.join(', ')} ms. One is an anomaly (he sneezed). Leave it out: what’s his mean reaction time?`,
    label: 'Mean time', unit: 'ms', answer: M, start: 0, min: 0, max: 600, step: 10, jump: 50,
    win: `${A} ms doesn’t fit the pattern, so it’s left out. ${fix1}`,
    nope: value => diagnose(M, value, 'ms', [
      [mean5, `You kept the anomaly. ${A} ms is way off the others: leave it out and divide by 4.`],
      [sum / 5, `You left out ${A} but still divided by 5. Four trials left, so divide by 4.`],
      [(sum + A) / 4, `You kept ${A} in the total. Leave the anomaly out, then divide by 4.`],
      [A, `That’s the anomaly! Leave it out and average the other four.`],
    ], fix1),
    scene: { layout: 'ruler', ruler: { trials, anomaly: at }, given: [] },
  }

  const d = rand.int(20, 60, 10), M2 = M - d
  const after = rand.shuffle(rand.pick([[-10, 0, 10], [-20, 10, 10], [-10, -10, 20], [-20, 0, 20]]).map(o => M2 + o))
  const fix2 = `After: (${after.join(' + ')}) ÷ 3 = ${M2} ms. Change = ${M} − ${M2} = ${d} ms faster.`
  const t2: SugarTask = {
    id: 'react-2', prompt: `Then Dev has a strong coffee (caffeine) and tries again: ${after.join(', ')} ms. How many ms faster is his mean now?`,
    label: 'Time saved', unit: 'ms', answer: d, start: 0, min: 0, max: 300, step: 10, jump: 50,
    win: `Caffeine is a stimulant: it can make reactions quicker. ${fix2}`,
    nope: value => diagnose(d, value, 'ms', [
      [M2, `That’s his new mean. How much FASTER is it than ${M} ms?`],
      [mean5 - M2, `You used the mean WITH the anomaly. His mean before was ${M} ms.`],
      [M, `That’s his mean BEFORE the coffee. Find the new mean, then subtract.`],
      [M + M2, `You added the means. “How much faster” is a difference: ${M} − ${M2}.`],
    ], fix2),
    scene: { layout: 'ruler', ruler: { trials: after, anomaly: -1, before: M }, given: [['Before', `${M} ms`], ['After (ms)', after.join(' · ')]] },
  }

  const right = 'The same person catches with the same hand each time'
  return {
    id: 'react', title: 'Round 5 · The required practical', headline: 'Reaction time',
    why: `A partner holds a ruler with zero level with your fingers, then drops it without warning. You catch it as fast as you can. The further it falls, the slower your reaction, and a table turns the distance into a time. Repeat it, leave out any anomaly and find the mean. Change one thing, like a caffeine drink, and keep everything else the same.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Dev tests coffee against no coffee. Which is a control variable?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'coffee', label: 'Whether he has had the coffee', nope: 'That’s the INDEPENDENT variable: the one thing you change on purpose. Control variables are kept the same, like the hand he catches with.' },
        { value: 'time', label: 'His reaction time', nope: 'That’s the DEPENDENT variable: what you measure. Control variables are kept the same, like the same person and the same hand.' },
        { value: 'mood', label: 'How much he wants to win', nope: 'You can’t really control that. A control variable is something you keep the same, like the same person, hand and ruler.' },
      ], { count: 4 }),
      why: `Control variables stay the same so it’s a fair test: same person, same hand, same ruler. Only the coffee changes.`,
    },
    chain: [
      { line: `\\text{mean} = \\frac{[[s:${good.join(' + ')}]]}{[[k:4]]}` },
      { line: `\\text{mean} = \\frac{[[t:${tex(sum)}]]}{[[k:4]]}`, op: 'Add', merge: { t: ['s'] }, why: `Leave out the anomaly, ${A} ms. The other four add up to ${n(sum)}.` },
      { line: `\\text{mean} = [[m:${M}]]\\,\\text{ms}`, op: '÷ 4', merge: { m: ['t', 'k'] }, why: `${n(sum)} ÷ 4 = ${M} ms. With the anomaly in, you’d get ${n(mean5)} ms: too slow.` },
    ],
  }
}

export function makeRounds(rand: Rand): SugarRound[] {
  return [reflexRound(rand), glucoseRound(rand), typesRound(rand), cycleRound(rand), reactionRound(rand)]
}
