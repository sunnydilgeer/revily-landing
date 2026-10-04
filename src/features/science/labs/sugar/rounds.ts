import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Task } from '../kit/types'
import type { PlayRound, PlayTask, TileTask } from '../kit/tiles'

/*
 * Sugar Rush: a shift at an NHS diabetes and reflex clinic with Nurse Kemi (AQA Trilogy 4.5
 * Homeostasis and response, Foundation: the reflex arc, blood glucose and insulin, type 1 and type 2
 * diabetes, hormones in the menstrual cycle, and the reaction time required practical).
 * The move is the biology itself: build the reflex arc and watch the impulse race along it, chain the
 * glucose control loop and watch the monitor settle, file type 1 and type 2 facts, match hormones to
 * the cycle, order the ruler-drop practical. Dials stay where a calculation is the exam skill.
 * Every answer is picked first, so the numbers stay friendly. Spec-level biology only: no doses, no
 * treatment advice, nothing Higher-only.
 */

export type Scene = {
  /** arc: body + reflex arc · monitor/control: the glucose monitor · crowd/files: the clinic list · cycle/calendar · steps/ruler: the ruler drop */
  layout: 'arc' | 'monitor' | 'control' | 'crowd' | 'files' | 'cycle' | 'calendar' | 'steps' | 'ruler'
  /** The given values, shown as chips under the picture. */
  given: [string, string][]
  /** The reflex: what the hand touches. */
  arc?: { emoji: string; what: string }
  /** The glucose monitor: where the trace starts and peaks (mmol/L). */
  glucose?: { base: number; peak: number }
  /** The clinic list: patients per figure. */
  crowd?: { per: number }
  /** Calendar: the date of day 1 of the cycle. */
  calendar?: { start: number }
  /** Ruler drop: the trials, which one is the anomaly, and the mean (ms) the ruler is caught at on a hit. */
  ruler?: { trials: number[]; anomaly: number; mean: number }
}
export type SugarTask = PlayTask<Scene>
export type SugarRound = PlayRound<Scene>

const ordinal = (d: number) => `${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'}`
export { ordinal }

/** A tile that belongs in a slot, with why it goes there; and a believable wrong tile, with why not. */
type Piece = { value: string; label: string; role: string }
type Decoy = { value: string; label: string; nope: string }

/** A tile task: the pieces in slot order, plus decoys, shuffled into the palette. */
function placeTask(rand: Rand, id: string, prompt: string, label: string, slots: string[], pieces: Piece[], decoys: Decoy[], win: string, scene: Scene): TileTask<Scene> {
  const answer = pieces.map(p => p.value)
  return {
    kind: 'tiles', id, prompt, label, slots, answer, win, scene,
    palette: rand.shuffle([...pieces, ...decoys]).map(({ value, label }) => ({ value, label })),
    nope: picked => {
      const wrong = picked.flatMap((tile, i) => tile !== answer[i] ? [i] : [])
      if (!wrong.length) return `Fill every slot first: ${slots.length} tiles.`
      const i = wrong[0], tile = picked[i]
      const more = wrong.length > 1 ? ` ${wrong.length} slots need fixing.` : ''
      const decoy = decoys.find(d => d.value === tile)
      if (decoy) return `${decoy.nope}${more}`
      const placed = pieces.find(p => p.value === tile)
      return `${placed?.label ?? tile} doesn’t go in “${slots[i]}”. ${pieces[i].role}${more}`
    },
  }
}

/** Round 1: build the reflex arc, then the impulse speed = distance ÷ time. */
function reflexRound(rand: Rand): SugarRound {
  const arc = rand.pick([{ emoji: '🔥', what: 'hot pan' }, { emoji: '📌', what: 'drawing pin' }, { emoji: '🌵', what: 'cactus' }])
  const pairs: [number, number][] = []
  for (const t of [0.01, 0.02, 0.04, 0.05]) for (let v = 20; v <= 100; v += 10) {
    const d = Number((v * t).toFixed(3))
    if (d >= 0.4 && d <= 2 && Number.isInteger(Number((d * 10).toFixed(3)))) pairs.push([v, t])
  }
  const [v, t] = rand.pick(pairs), d = Number((v * t).toFixed(3))

  const t1 = placeTask(rand, 'reflex-1', `Ouch, a ${arc.what}! Build the reflex arc, in order.`, 'Reflex arc',
    ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    [
      { value: 'receptor', label: 'Receptor', role: `Step 1 is the receptor in the skin: it detects the stimulus.` },
      { value: 'sensory', label: 'Sensory neurone', role: `Step 2 is the sensory neurone: it carries the impulse IN to the spinal cord.` },
      { value: 'relay', label: 'Relay neurone', role: `Step 3 is the relay neurone in the spinal cord: it links sensory to motor.` },
      { value: 'motor', label: 'Motor neurone', role: `Step 4 is the motor neurone: it carries the impulse OUT to the effector.` },
      { value: 'effector', label: 'Effector', role: `Step 5 is the effector, a muscle: it pulls the hand away.` },
    ],
    [
      { value: 'brain', label: 'Conscious brain', nope: `A reflex skips the conscious brain: that’s why it’s so fast. The relay neurone in the spinal cord does the linking.` },
      { value: 'hormone', label: 'Hormone', nope: `Hormones travel in the blood: far too slow for a reflex. A reflex arc is all neurones carrying electrical impulses.` },
    ],
    `Receptor → sensory → relay → motor neurone → effector. No conscious thought, so it’s automatic and rapid.`,
    { layout: 'arc', arc, given: [] })

  const fix = `Speed = distance ÷ time = ${n(d)} ÷ ${n(t)} = ${v} m/s.`
  const t2: Task<Scene> = {
    id: 'reflex-2', prompt: `The impulse travels ${n(d)} m in ${n(t)} s. How fast?`,
    label: 'Impulse speed', unit: 'm/s', answer: v, start: 0, min: 0, max: 200, step: 10, jump: 50,
    win: `Nerve impulses are electrical, so they’re fast. ${fix}`,
    nope: value => diagnose(v, value, 'm/s', [
      [v * 10, `Out by 10. Count the decimal places in ${n(t)} carefully.`],
      [v / 10, `Out by 10. Count the decimal places in ${n(t)} carefully.`],
    ], fix),
    scene: { layout: 'arc', arc, given: [['Distance', `${n(d)} m`], ['Time', `${n(t)} s`]] },
  }

  const right = 'It skips the conscious part of the brain'
  return {
    id: 'reflex', title: 'Round 1 · Triage', headline: 'The reflex arc',
    why: `A reflex is automatic and rapid: it doesn’t involve the conscious part of your brain. A receptor detects the stimulus. An impulse travels along a sensory neurone to a relay neurone in the spinal cord, then along a motor neurone to an effector, usually a muscle. Speed = distance ÷ time.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Why is a reflex so fast?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'hormone', label: 'Hormones carry the message', nope: 'Hormones travel in the blood, which is slower. A reflex uses electrical impulses along neurones and skips the conscious brain.' },
        { value: 'decide', label: 'You decide to move quickly', nope: 'You don’t decide anything: a reflex is automatic. It skips the conscious part of the brain.' },
        { value: 'heart', label: 'The impulse goes via the heart', nope: 'The heart isn’t part of it. The impulse goes receptor → spinal cord → muscle, skipping the conscious brain.' },
      ], { count: 4 }),
      why: `The relay neurone is in the spinal cord, so the impulse never waits for the conscious brain to decide.`,
    },
    chain: [
      { line: `[[v:\\text{speed}]] = [[d:\\text{distance}]] \\div [[t:\\text{time}]]` },
      { line: `[[v:\\text{speed}]] = [[d:${tex(d)}]] \\div [[t:${tex(t)}]]`, op: 'Swap in', why: `The impulse travels ${n(d)} m in ${n(t)} s.` },
      { line: `[[v:\\text{speed}]] = [[s:${v}]]\\,\\text{m/s}`, op: 'Divide', merge: { s: ['d', 't'] }, why: `${n(d)} ÷ ${n(t)} = ${v} m/s. Faster than you can say “ouch”.` },
    ],
  }
}

/** Round 2: the glucose test on the monitor: the rise, then build the control chain that brings it down. */
function glucoseRound(rand: Rand): SugarRound {
  const base = rand.int(4, 6), rise = rand.int(3, 6), peak = base + rise
  const glucose = { base, peak }
  const fix = `Rise = peak − start = ${peak} − ${base} = ${rise} mmol/L.`
  const t1: Task<Scene> = {
    id: 'gluc-1', prompt: `Sugary drink: ${base} up to ${peak} mmol/L. How much did it rise?`,
    label: 'Glucose rise', unit: 'mmol/L', answer: rise, start: 0, min: 0, max: 20, step: 1, jump: 5,
    win: `Glucose from the drink is absorbed into the blood, so the level rises. ${fix}`,
    nope: value => diagnose(rise, value, 'mmol/L', [
      [peak, `That’s the peak reading. The RISE is how far it went up from the start.`],
      [base, `That’s where it started. Take it away from the peak.`],
      [peak + base, `You added. A rise is a difference: peak − start.`],
    ], fix),
    scene: { layout: 'monitor', glucose, given: [['Start', `${base} mmol/L`], ['Peak', `${peak} mmol/L`]] },
  }

  const t2 = placeTask(rand, 'gluc-2', 'Glucose is high. Build the chain that brings it down.', 'Glucose control',
    ['The change', 'Detected by', 'Releases', 'Result'],
    [
      { value: 'high', label: 'Glucose high', role: `It starts with the change: blood glucose too high after the drink.` },
      { value: 'pancreas', label: 'Pancreas', role: `The pancreas detects the high blood glucose.` },
      { value: 'insulin', label: 'Insulin', role: `The pancreas releases the hormone insulin into the blood.` },
      { value: 'stored', label: 'Glycogen stored', role: `The result: glucose moves into cells, and the liver stores extra as glycogen.` },
    ],
    [
      { value: 'liver', label: 'Liver', nope: `The liver stores glycogen, but it’s the PANCREAS that detects high glucose and releases insulin.` },
      { value: 'glycogen', label: 'Glycogen', nope: `Glycogen isn’t a hormone: it’s how glucose is stored. The hormone released is insulin.` },
      { value: 'brain', label: 'Brain', nope: `Blood glucose is monitored by the pancreas, not the brain. The pancreas releases insulin.` },
    ],
    `Glucose high → pancreas → insulin → glucose into cells, extra stored as glycogen. Back in the healthy range.`,
    { layout: 'control', glucose, given: [] })

  const right = 'Keeping conditions inside the body steady'
  return {
    id: 'gluc', title: 'Round 2 · Glucose test', headline: 'Blood glucose',
    why: `Your body keeps blood glucose within a narrow range: that’s homeostasis. After a meal or a sugary drink, glucose is absorbed and the level rises. The pancreas detects this and releases the hormone insulin. Insulin makes glucose move from the blood into cells. In the liver and muscles, extra glucose is stored as glycogen.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'What is homeostasis?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'respire', label: 'Breaking down glucose for energy', nope: 'That’s respiration. Homeostasis is keeping internal conditions, like blood glucose, steady.' },
        { value: 'more', label: 'Making more hormones every day', nope: 'Hormones are released when needed, not more and more. Homeostasis is keeping internal conditions steady.' },
        { value: 'grow', label: 'Growing new cells to repair the body', nope: 'That’s growth and repair. Homeostasis is keeping internal conditions, like glucose, within a narrow range.' },
      ], { count: 4 }),
      why: `Homeostasis keeps internal conditions steady, like blood glucose, body temperature and water levels, so cells can work properly.`,
    },
    chain: [
      { line: `[[r:\\text{rise}]] = [[p:\\text{peak}]] - [[b:\\text{start}]]` },
      { line: `[[r:\\text{rise}]] = [[p:${peak}]] - [[b:${base}]]`, op: 'Read the graph', why: `The trace starts at ${base} mmol/L and peaks at ${peak} mmol/L.` },
      { line: `[[r:\\text{rise}]] = [[c:${rise}]]\\,\\text{mmol/L}`, op: 'Subtract', merge: { c: ['p', 'b'] }, why: `${peak} − ${base} = ${rise}. Then insulin brings it back down.` },
    ],
  }
}

/** Round 3: the clinic list: how many have type 2, then file type 1 and type 2 facts. */
function typesRound(rand: Rand): SugarRound {
  const N = rand.pick([200, 400, 500, 800, 1000]), P = rand.pick([80, 85, 90]), t2n = N * P / 100, t1n = N - t2n
  const per = N / 20
  const fix = `${P}% of ${n(N)} = ${P} ÷ 100 × ${n(N)} = ${n(t2n)}.`
  const t1: Task<Scene> = {
    id: 'types-1', prompt: `${n(N)} patients. ${P}% have type 2 diabetes. How many?`,
    label: 'Type 2 patients', unit: 'patients', answer: t2n, start: 0, min: 0, max: N, step: 5, jump: 50,
    win: `Type 2 is by far the most common kind in the UK. ${fix}`,
    nope: value => diagnose(t2n, value, 'patients', [
      [P, `That’s the percentage, not the patients. Find ${P}% OF ${n(N)}.`],
      [t1n, `That’s everyone else: the type 1 patients. Find the ${P}%.`],
      [N - P, `You took a percentage away from a number of people. Find ${P}% of ${n(N)}.`],
      [N * P / 10, `You divided by 10. A percentage is out of 100.`],
      [N, `That’s the whole list. Only ${P}% have type 2.`],
    ], fix),
    scene: { layout: 'crowd', crowd: { per }, given: [['List', n(N)], ['Type 2', `${P}%`]] },
  }

  const t2 = placeTask(rand, 'types-2', 'File each fact under type 1 or type 2.', 'Diabetes files',
    ['Type 1: cause', 'Type 1: treated with', 'Type 2: cause', 'Type 2: risk factor'],
    [
      { value: 'little', label: 'Too little insulin', role: `In type 1, the pancreas doesn’t make enough insulin.` },
      { value: 'inject', label: 'Insulin injections', role: `Type 1 is treated with insulin injections, because the body can’t make enough.` },
      { value: 'ignore', label: 'Cells ignore insulin', role: `In type 2, the body’s cells no longer respond to insulin.` },
      { value: 'obesity', label: 'Obesity', role: `Obesity is a risk factor for type 2.` },
    ],
    [
      { value: 'liver', label: 'Liver makes no insulin', nope: `The liver never makes insulin: the pancreas does. In type 1, the pancreas makes too little.` },
      { value: 'much', label: 'Too much insulin', nope: `Neither type is too much insulin. Type 1: too little is made. Type 2: cells stop responding to it.` },
    ],
    `Type 1: the pancreas makes too little insulin, so insulin injections. Type 2: cells stop responding to insulin; obesity is a risk factor.`,
    { layout: 'files', given: [] })

  const right = 'It can’t spread from person to person'
  return {
    id: 'types', title: 'Round 3 · Clinic list', headline: 'Type 1 and type 2',
    why: `In type 1 diabetes the pancreas doesn’t make enough insulin, so blood glucose can rise too high. It’s treated with insulin injections. In type 2 diabetes the body’s cells no longer respond to insulin. Obesity is a risk factor, and it’s treated with a carbohydrate-controlled diet and exercise. To find a percentage of a number, divide by 100 and multiply.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'Diabetes is non-communicable. What does that mean?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'cure', label: 'It can’t be treated', nope: 'Both types can be treated. Non-communicable means it can’t be passed from person to person.' },
        { value: 'adults', label: 'Only adults get it', nope: 'Children can have diabetes too. Non-communicable means it can’t be passed from person to person.' },
        { value: 'symptoms', label: 'It has no symptoms', nope: 'It can have symptoms. Non-communicable means you can’t catch it from someone else.' },
      ], { count: 4 }),
      why: `Non-communicable diseases aren’t caused by pathogens, so you can’t catch them from someone else.`,
    },
    chain: [
      { line: `[[p:${P}\\%]] \\text{ of } [[n:${tex(N)}]]` },
      { line: `\\frac{[[p:${P}]]}{[[h:100]]} \\times [[n:${tex(N)}]]`, op: 'Out of 100', why: `A percentage is out of 100: divide by 100, then multiply.` },
      { line: `[[a:${tex(t2n)}]]\\text{ type 2}`, op: 'Work it out', merge: { a: ['p', 'h', 'n'] }, why: `${P} ÷ 100 × ${n(N)} = ${n(t2n)}. The other ${n(t1n)} have type 1.` },
    ],
  }
}

/** Round 4: match the hormones of the menstrual cycle to their jobs, then the ovulation date. */
function cycleRound(rand: Rand): SugarRound {
  const t1 = placeTask(rand, 'cycle-1', 'Match each hormone to its job in the cycle.', 'Cycle hormones',
    ['Egg matures', 'Egg released', 'Lining builds', 'Lining kept'],
    [
      { value: 'fsh', label: 'FSH', role: `FSH, from the pituitary gland, makes an egg mature in the ovary.` },
      { value: 'lh', label: 'LH', role: `LH, also from the pituitary, makes the ovary release the egg: ovulation.` },
      { value: 'oest', label: 'Oestrogen', role: `Oestrogen, from the ovary, makes the uterus lining build up.` },
      { value: 'prog', label: 'Progesterone', role: `Progesterone keeps the uterus lining thick, ready for a fertilised egg.` },
    ],
    [
      { value: 'insulin', label: 'Insulin', nope: `Insulin controls blood glucose, not the cycle. It comes from the pancreas.` },
      { value: 'testo', label: 'Testosterone', nope: `Testosterone is the main male hormone, made in the testes. The cycle runs on FSH, LH, oestrogen and progesterone.` },
    ],
    `FSH matures the egg, LH releases it, oestrogen builds the lining and progesterone keeps it.`,
    { layout: 'cycle', given: [] })

  const date = rand.int(15, 30), start = date - 13
  const fix = `Day 1 is the ${ordinal(start)}, so day 14 is 13 days later: ${start} + 13 = the ${ordinal(date)}.`
  const t2: Task<Scene> = {
    id: 'cycle-2', prompt: `Day 1 was the ${ordinal(start)}. Ovulation is day 14: what date?`,
    label: 'Ovulation date', unit: '', answer: date, start: 1, min: 1, max: 31, step: 1, jump: 7,
    win: `About halfway through a 28-day cycle, LH makes the ovary release an egg. ${fix}`,
    nope: value => diagnose(date, value, '', [
      [start + 14, `So close! The ${ordinal(start)} is already day 1, so day 14 is only 13 days later.`],
      [14, `That’s the day of the CYCLE. Her cycle started on the ${ordinal(start)}, so count on from there.`],
      [start, `That’s day 1, when her period started. Count on to day 14.`],
      [start + 28 <= 31 ? start + 28 : NaN, `That’s when the next cycle starts. Ovulation is about halfway, day 14.`],
    ], fix),
    scene: { layout: 'calendar', calendar: { start }, given: [['Day 1', `the ${ordinal(start)}`]] },
  }

  const right = 'The pituitary gland'
  return {
    id: 'cycle', title: 'Round 4 · Hormone clinic', headline: 'The menstrual cycle',
    why: `Hormones are chemicals carried in the blood to a target organ. The pituitary gland releases FSH, which makes an egg mature in an ovary, and LH, which makes the ovary release it: that’s ovulation, about day 14 of a 28-day cycle. Oestrogen and progesterone build up and keep the lining of the uterus.`,
    tasks: [t1, t2],
    workingOn: 1,
    side: {
      prompt: 'Which gland releases FSH and LH?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'ovaries', label: 'The ovaries', nope: 'The ovaries release oestrogen, and the eggs. FSH and LH come from the pituitary gland.' },
        { value: 'pancreas', label: 'The pancreas', nope: 'The pancreas releases insulin. FSH and LH come from the pituitary gland.' },
        { value: 'testes', label: 'The testes', nope: 'The testes make testosterone, in males. FSH and LH come from the pituitary gland in the brain.' },
      ], { count: 4 }),
      why: `The pituitary gland in the brain is the “master gland”: it releases FSH and LH, which act on the ovaries.`,
    },
    chain: [
      { line: `\\text{day } 14 = \\text{day } 1 + [[d:13]]\\text{ days}` },
      { line: `[[s:${start}]] + [[d:13]]`, op: 'Swap in', why: `Day 1 is the ${ordinal(start)}. Day 14 is 13 days after it, not 14.` },
      { line: `\\text{the } [[a:${ordinal(date)}]]`, op: 'Add', merge: { a: ['s', 'd'] }, why: `${start} + 13 = ${date}: the likely ovulation date.` },
    ],
  }
}

/** Round 5 (boss): the reaction time required practical. Order the method, then the mean (anomaly out). */
function reactionRound(rand: Rand): SugarRound {
  const M = rand.int(220, 300, 10)
  const spread = rand.pick([[-20, -10, 10, 20], [-30, 0, 10, 20], [-10, -10, 0, 20], [-20, 0, 0, 20], [-10, 0, 0, 10]])
  const jumpUp = rand.pick([150, 200, 250]), A = M + jumpUp
  const good = rand.shuffle(spread.map(o => M + o)), at = rand.int(0, 4)
  const trials = [...good.slice(0, at), A, ...good.slice(at)]
  const sum = 4 * M, mean5 = (sum + A) / 5
  const ruler = { trials, anomaly: at, mean: M }

  const t1 = placeTask(rand, 'react-1', 'Ruler-drop practical: put the steps in order.', 'Method',
    ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    [
      { value: 'zero', label: 'Zero at fingers', role: `Step 1: hold the ruler with zero level with their thumb and finger.` },
      { value: 'drop', label: 'Drop, no warning', role: `Step 2: drop it without warning, so they can’t anticipate it.` },
      { value: 'catch', label: 'Catch it', role: `Step 3: they catch it as fast as they can.` },
      { value: 'read', label: 'Read the cm', role: `Step 4: read how far it fell, in cm. Further means slower.` },
      { value: 'repeat', label: 'Repeat + mean', role: `Step 5: repeat it, leave out anomalies and find the mean.` },
    ],
    [
      { value: 'warn', label: 'Shout “go!”', nope: `A warning lets them anticipate, so it isn’t a true reaction time. Drop it without warning.` },
      { value: 'watch', label: 'Use a stopwatch', nope: `No stopwatch: far too slow to time a catch. The distance it falls gives the time, using a table.` },
    ],
    `Zero at the fingers, drop without warning, catch, read the cm, repeat. A table turns each distance into a time.`,
    { layout: 'steps', ruler, given: [] })

  const fix = `Leave out ${A}: (${good.join(' + ')}) ÷ 4 = ${n(sum)} ÷ 4 = ${M} ms.`
  const t2: Task<Scene> = {
    id: 'react-2', prompt: `Dev sneezed on one catch. Leave out the anomaly: mean time?`,
    label: 'Mean time', unit: 'ms', answer: M, start: 0, min: 0, max: 600, step: 10, jump: 50,
    win: `${A} ms doesn’t fit the pattern, so it’s left out. ${fix}`,
    nope: value => diagnose(M, value, 'ms', [
      [mean5, `You kept the anomaly. ${A} ms is way off the others: leave it out and divide by 4.`],
      [sum / 5, `You left out ${A} but still divided by 5. Four trials left, so divide by 4.`],
      [(sum + A) / 4, `You kept ${A} in the total. Leave the anomaly out, then divide by 4.`],
      [A, `That’s the anomaly! Leave it out and average the other four.`],
    ], fix),
    scene: { layout: 'ruler', ruler, given: [] },
  }

  const right = 'The same person catches with the same hand'
  return {
    id: 'react', title: 'Round 5 · The required practical', headline: 'Reaction time',
    why: `A partner holds a ruler with zero level with your fingers, then drops it without warning. You catch it as fast as you can. The further it falls, the slower your reaction, and a table turns the distance into a time. Repeat it, leave out any anomaly and find the mean. Change one thing, like a caffeine drink, and keep everything else the same.`,
    tasks: [t1, t2],
    workingOn: 1,
    side: {
      prompt: 'Dev tests coffee vs no coffee. Which is a control variable?', answer: right,
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
