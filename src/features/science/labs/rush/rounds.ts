import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, type Round, type Task } from '../kit/types'

/*
 * A&E Rush: a junior doctor's shift with Dr Patel (AQA Trilogy 4.1.1 microscopy, 4.2 the heart,
 * 4.3 infection and response). Every answer is picked first, then the patient is built around it,
 * so the numbers stay whole (the real sizes on the slide are the only decimals, as on the paper).
 */

/** What the stage draws: the eyepiece view, a ward or school as dots, the heart monitor, or the practical's field of view. */
export type Specimen = 'pollen' | 'splinter' | 'bacteria'
export type Scene = {
  layout: 'scope' | 'crowd' | 'monitor' | 'field'
  /** The given values, in the readout beside the picture. */
  given: [string, string][]
  specimen?: Specimen
  /** Crowd: how many dots, how many people each dot is, how many are already marked, and the dial's colour. */
  crowd?: { dots: number; per: number; fixed: number; tint: 'bact' | 'virus' | 'unvax'; key: string }
  /** Field of view: how many cells fit across. */
  across?: number
  /** Monitor: who's in the bed. */
  patient?: string
}
export type RushTask = Task<Scene>
export type RushRound = Round<Scene>

/** Magnifications show as ×400 on the stage; the dial shows the bare number. */
const X = ''
const MU = 'µm'

/** Round 1: magnification = image ÷ real, then rearranged for the real size. */
function scopeRound(rand: Rand): RushRound {
  const real = rand.pick([0.02, 0.05, 0.1]), M = rand.pick([100, 200, 400, 500]), image = Number((real * M).toFixed(3))
  const fix1 = `Magnification = image ÷ real = ${n(image)} ÷ ${n(real)} = ×${M}.`
  const t1: RushTask = {
    id: 'scope-1', prompt: `Hay fever patient. A pollen grain from her nose swab looks ${n(image)} mm wide in the eyepiece. Its real width is ${n(real)} mm. What’s the magnification?`,
    label: 'Magnification ×', unit: X, answer: M, start: 0, min: 0, max: 1000, step: 10, jump: 100,
    win: `Magnification tells you how many times bigger the image is than the real thing. ${fix1}`,
    nope: value => diagnose(M, value, X, [
      [Number((image * real).toFixed(4)), `You multiplied. Magnification = image size ÷ real size.`],
      [image, `That’s just the image size. Divide it by the real size.`],
      [Number((real / image).toFixed(4)), `Upside down: it’s image ÷ real, not real ÷ image.`],
      [M / 10, `Out by 10. Count the decimal places in ${n(real)} carefully.`],
      [M * 10, `Out by 10. Count the decimal places in ${n(real)} carefully.`],
    ], fix1),
    scene: { layout: 'scope', specimen: 'pollen', given: [['Image size', `${n(image)} mm`], ['Real size', `${n(real)} mm`]] },
  }

  const lens = rand.pick([5, 10]), size = rand.int(2, lens === 5 ? 9 : 5), seen = lens * size
  const fix2 = `Real size = image ÷ magnification = ${seen} ÷ ${lens} = ${size} mm.`
  const t2: RushTask = {
    id: 'scope-2', prompt: `A kid’s got a splinter in her thumb. Through a ×${lens} hand lens it looks ${seen} mm long. How long is it really?`,
    label: 'Real size', unit: 'mm', answer: size, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Rearrange: real size = image size ÷ magnification. ${fix2}`,
    nope: value => diagnose(size, value, 'mm', [
      [seen, `That’s the image size, what the lens shows. Divide by ${lens} to get the real size.`],
      [seen - lens, `You took away. Real size = image size ÷ magnification.`],
      [seen + lens, `You added. Real size = image size ÷ magnification.`],
      [seen * lens, `You multiplied, so it got even bigger. The real splinter is SMALLER than the image: divide.`],
    ], fix2),
    scene: { layout: 'scope', specimen: 'splinter', given: [['Image size', `${seen} mm`], ['Hand lens', `×${lens}`]] },
  }

  const right = 'An electron microscope'
  return {
    id: 'scope', title: 'Round 1 · The eyepiece', headline: 'Magnification',
    why: `A microscope makes the image bigger than the real thing. Magnification = image size ÷ real size. Keep both sizes in the same unit. To find the real size, rearrange: real size = image size ÷ magnification.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which microscope could show the tiny ribosomes inside the patient’s cells?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'A light microscope on its top lens', label: 'A light microscope on its top lens', nope: 'Even at its best a light microscope can’t resolve something that small. An electron microscope has a much higher resolution.' },
        { value: 'A hand lens held closer', label: 'A hand lens held closer', nope: 'A hand lens only magnifies about ×10. Ribosomes need an electron microscope.' },
        { value: 'Any microscope, if you stain the cells', label: 'Any microscope, if you stain the cells', nope: 'Stain makes parts show up, but it can’t beat the light microscope’s resolution. You need an electron microscope.' },
      ], { count: 4 }),
      why: `Electron microscopes have much higher magnification and resolution, so they show tiny sub-cellular parts like ribosomes.`,
    },
    chain: [
      { line: `[[r:\\text{real}]] = [[i:\\text{image}]] \\div [[m:\\text{magnification}]]` },
      { line: `[[r:\\text{real}]] = [[i:${seen}]] \\div [[m:${lens}]]`, op: 'Swap in', why: `The image is ${seen} mm and the hand lens is ×${lens}.` },
      { line: `[[r:\\text{real}]] = [[c:${size}]]\\,\\text{mm}`, op: 'Divide', merge: { c: ['i', 'm'] }, why: `${seen} ÷ ${lens} = ${size}. A ${size} mm splinter: out it comes.` },
    ],
  }
}

/** Round 2: total magnification = eyepiece × objective, then the real size of a bacterium in µm. */
function bugRound(rand: Rand): RushRound {
  const eye = rand.pick([5, 10, 15]), obj = rand.pick([40, 100]), M = eye * obj
  const fix1 = `Total = eyepiece × objective = ${eye} × ${obj} = ×${n(M)}.`
  const t1: RushTask = {
    id: 'bug-1', prompt: `Wound swab on the slide. The eyepiece lens is ×${eye} and the objective lens is ×${obj}. What’s the total magnification?`,
    label: 'Total magnification ×', unit: X, answer: M, start: 0, min: 0, max: 2000, step: 10, jump: 100,
    win: `The lenses multiply. ${fix1}`,
    nope: value => diagnose(M, value, X, [
      [eye + obj, `You added the lenses. Their powers multiply: ${eye} × ${obj}.`],
      [obj, `That’s just the objective. Multiply by the eyepiece too.`],
      [eye, `That’s just the eyepiece. Multiply by the objective too.`],
    ], fix1),
    scene: { layout: 'scope', specimen: 'bacteria', given: [['Eyepiece', `×${eye}`], ['Objective', `×${obj}`]] },
  }

  const sizes = [1, 2, 3, 4, 5].filter(s => (s * M) % 1000 === 0 && s * M / 1000 <= 20)
  const size = rand.pick(sizes), image = size * M / 1000, um = image * 1000
  const fix2 = `${image} mm = ${n(um)} µm. Real size = ${n(um)} ÷ ${n(M)} = ${size} µm.`
  const t2: RushTask = {
    id: 'bug-2', prompt: `At ×${n(M)} one rod-shaped bacterium looks ${image} mm long. How long is it really, in micrometres (µm)?`,
    label: 'Real size', unit: MU, answer: size, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Turn mm into µm (× 1000) first, then divide by the magnification. ${fix2}`,
    nope: value => diagnose(size, value, MU, [
      [um / (eye + obj), `You added the lens powers. The total magnification is ${eye} × ${obj} = ${n(M)}.`],
      [um / obj, `You only used the objective lens. The total is ${eye} × ${obj} = ${n(M)}.`],
      [um / eye, `You only used the eyepiece. The total is ${eye} × ${obj} = ${n(M)}.`],
      [image, `That’s the image size in mm. Turn it into µm (× 1000), then divide by ${n(M)}.`],
      [image * 100 / M, `1 mm is 1000 µm, not 100. ${image} mm = ${n(um)} µm.`],
    ], fix2),
    scene: { layout: 'scope', specimen: 'bacteria', given: [['Magnification', `×${n(M)}`], ['Image size', `${image} mm`]] },
  }

  const right = 'Viruses are far too small to see with a light microscope'
  return {
    id: 'bug', title: 'Round 2 · Wound swab', headline: 'Find the bug',
    why: `A light microscope has two lenses. Total magnification = eyepiece × objective. Bacteria are tiny, so we measure them in micrometres: 1 mm = 1000 µm. Change the image size to µm, then divide by the magnification.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Next patient has flu. Even at ×1000 the slide looks empty. Why?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'You need a lower power lens to find it', label: 'You need a lower power lens to find it', nope: 'Lower power makes things look SMALLER. Viruses are too small for any light microscope: you need an electron microscope.' },
        { value: 'Flu is caused by bacteria hiding inside cells', label: 'Flu is caused by bacteria hiding inside cells', nope: 'Flu is a virus, not bacteria. Viruses are much smaller than bacteria, too small for a light microscope.' },
        { value: 'The flu has already been killed by antibiotics', label: 'The flu has already been killed by antibiotics', nope: 'Dr Patel’s eyebrow just hit the ceiling. Antibiotics do nothing to viruses. The slide looks empty because viruses are too small to see.' },
      ], { count: 4 }),
      why: `Viruses are much smaller than bacteria, too small for a light microscope. They live and copy themselves inside cells. You’d need an electron microscope to see them.`,
    },
    chain: [
      { line: `M = [[e:${eye}]] \\times [[o:${obj}]]` },
      { line: `M = [[m:${tex(M)}]]`, op: 'Multiply the lenses', merge: { m: ['e', 'o'] }, why: `Eyepiece × objective: ${eye} × ${obj} = ${n(M)}.` },
      { line: `\\text{real} = [[k:${tex(um)}]]\\,\\mu\\text{m} \\div [[m:${tex(M)}]]`, op: 'mm → µm', why: `The image is ${image} mm, which is ${image} × 1000 = ${n(um)} µm. Real = image ÷ magnification.` },
      { line: `\\text{real} = [[r:${size}]]\\,\\mu\\text{m}`, op: 'Divide', merge: { r: ['k', 'm'] }, why: `${n(um)} ÷ ${n(M)} = ${size} µm. A typical bacterium.` },
    ],
  }
}

/** Round 3: percentages on the ward: who gets antibiotics, who doesn't. */
function wardRound(rand: Rand): RushRound {
  const pairs: [number, number][] = []
  for (const N of [20, 40, 50, 80]) for (const P of [10, 20, 25, 30, 40, 60, 75]) if ((N * P) % 100 === 0) pairs.push([N, P])
  const [N, P] = rand.pick(pairs), a = N * P / 100, v = N - a
  const fix1 = `${P}% of ${N} = ${P} ÷ 100 × ${N} = ${a}.`
  const t1: RushTask = {
    id: 'ward-1', prompt: `${N} patients on the ward. The lab says ${P}% have a bacterial infection. How many need antibiotics?`,
    label: 'Antibiotics', unit: 'patients', answer: a, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Antibiotics kill bacteria, so only the bacterial patients get them. ${fix1}`,
    nope: value => diagnose(a, value, 'patients', [
      [P, `That’s the percentage, not the patients. Find ${P}% OF ${N}.`],
      [v, `That’s everyone WITHOUT a bacterial infection. Antibiotics are only for the ${P}% with bacteria.`],
      [N * P / 10, `You divided by 10. A percentage is out of 100.`],
      [N, `That’s the whole ward. Antibiotics only work on the bacterial ones.`],
    ], fix1),
    scene: { layout: 'crowd', given: [['Patients', `${N}`], ['Bacterial', `${P}%`]], crowd: { dots: N, per: 1, fixed: 0, tint: 'bact', key: 'antibiotics' } },
  }

  const fix2 = `${N} − ${a} = ${v}. That’s ${100 - P}% of ${N}.`
  const t2: RushTask = {
    id: 'ward-2', prompt: `Everyone else has a viral infection. How many get painkillers and fluids instead of antibiotics?`,
    label: 'No antibiotics', unit: 'patients', answer: v, start: 0, min: 0, max: N, step: 1, jump: 5,
    win: `Antibiotics don’t work on viruses, so these patients get treatment for their symptoms. ${fix2}`,
    nope: value => diagnose(v, value, 'patients', [
      [a, `That’s the bacterial patients. Who’s left?`],
      [100 - P, `That’s the percentage. Turn it into patients: ${N} − ${a}.`],
      [N, `That’s the whole ward. Take away the ${a} on antibiotics.`],
    ], fix2),
    scene: { layout: 'crowd', given: [['Patients', `${N}`], ['On antibiotics', `${a}`]], crowd: { dots: N, per: 1, fixed: a, tint: 'virus', key: 'painkillers' } },
  }

  const right = 'Painkillers and rest, to ease the symptoms'
  return {
    id: 'ward', title: 'Round 3 · Ward round', headline: 'Bacteria or virus?',
    why: `Antibiotics kill bacteria inside the body. They do nothing to viruses. Viral infections get painkillers and rest: these ease the symptoms while the body fights it off. To find a percentage of a number, divide by 100 and multiply.`,
    tasks: [t1, t2],
    side: {
      prompt: 'A patient with a viral sore throat demands antibiotics. What does Dr Patel prescribe?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Antibiotics, just to be safe', label: 'Antibiotics, just to be safe', nope: '“Just to be safe”?! Antibiotics kill bacteria, NOT viruses. They won’t help, and overusing them breeds antibiotic-resistant bacteria. Painkillers and rest.' },
        { value: 'Painkillers, to kill the virus', label: 'Painkillers, to kill the virus', nope: 'Close, but painkillers don’t kill anything. They only ease the symptoms while the body fights the virus.' },
        { value: 'A vaccine, to cure it today', label: 'A vaccine, to cure it today', nope: 'Vaccines PREVENT an infection before you catch it. They don’t cure one you already have.' },
      ], { count: 4 }),
      why: `Antibiotics only kill bacteria. A virus gets painkillers and rest to ease the symptoms. Giving antibiotics for viruses helps resistant bacteria spread.`,
    },
    chain: [
      { line: `[[p:${P}\\%]] \\text{ of } [[n:${N}]]` },
      { line: `[[f:${tex(P / 100)}]] \\times [[n:${N}]]`, op: '÷ 100', merge: { f: ['p'] }, why: `Per cent means out of 100: ${P} ÷ 100 = ${n(P / 100)}.` },
      { line: `[[a:${a}]]\\text{ on antibiotics}`, op: 'Multiply', merge: { a: ['f', 'n'] }, why: `${n(P / 100)} × ${N} = ${a} bacterial patients.` },
      { line: `[[n:${N}]] - [[a:${a}]]`, op: 'The rest', why: `Everyone else has a virus.` },
      { line: `[[v:${v}]]\\text{ on painkillers}`, op: 'Subtract', merge: { v: ['n', 'a'] }, why: `${N} − ${a} = ${v}. No antibiotics for viruses.` },
    ],
  }
}

/** Round 4: a measles scare at a school (vaccination percentages), then a fainting pupil's pulse. */
function vaccineRound(rand: Rand): RushRound {
  const S = rand.pick([600, 800, 1000, 1200, 1500]), V = rand.pick([80, 85, 90, 95]), un = S * (100 - V) / 100, jabbed = S - un
  const fix1 = `${100 - V}% aren’t vaccinated: ${100 - V} ÷ 100 × ${n(S)} = ${n(un)}.`
  const t1: RushTask = {
    id: 'vax-1', prompt: `Measles case at a school of ${n(S)} students. ${V}% are vaccinated. How many students are NOT vaccinated?`,
    label: 'Unvaccinated', unit: 'students', answer: un, start: 0, min: 0, max: S, step: 5, jump: 50,
    win: `Those are the students who could catch it and pass it on. ${fix1}`,
    nope: value => diagnose(un, value, 'students', [
      [jabbed, `That’s the VACCINATED students. Find the other ${100 - V}%.`],
      [100 - V, `That’s the percentage. Turn it into students: ${100 - V}% of ${n(S)}.`],
      [S - V, `You took a percentage away from a number of people. Find ${100 - V}% of ${n(S)}.`],
      [S, `That’s the whole school. Only ${100 - V}% aren’t vaccinated.`],
    ], fix1),
    scene: { layout: 'crowd', given: [['Students', n(S)], ['Vaccinated', `${V}%`]], crowd: { dots: 20, per: S / 20, fixed: 0, tint: 'unvax', key: `1 dot = ${S / 20} students` } },
  }

  const beats = rand.int(16, 30), bpm = beats * 4
  const fix2 = `There are four lots of 15 s in a minute: ${beats} × 4 = ${bpm} bpm.`
  const t2: RushTask = {
    id: 'vax-2', prompt: `A Year 9 faints at the sight of the needle (she’s fine). You count ${beats} beats in 15 seconds. What’s her pulse rate?`,
    label: 'Pulse rate', unit: 'bpm', answer: bpm, start: 0, min: 0, max: 200, step: 1, jump: 10,
    win: `Pulse rate is beats per MINUTE. ${fix2}`,
    nope: value => diagnose(bpm, value, 'bpm', [
      [beats, `That’s beats in 15 seconds. A minute is 60 seconds, so × 4.`],
      [beats * 2, `That’s 30 seconds’ worth. A minute is four lots of 15 s: × 4.`],
      [beats + 60, `You added 60. Multiply by 4: four lots of 15 s make a minute.`],
      [beats + 15, `You added 15. Multiply by 4: four lots of 15 s make a minute.`],
    ], fix2),
    scene: { layout: 'monitor', patient: '🧒🏾', given: [['Beats', `${beats}`], ['Time', '15 s']] },
  }

  const right = 'Dead or weakened pathogens make white blood cells produce antibodies'
  return {
    id: 'vax', title: 'Round 4 · Outbreak', headline: 'Vaccines and pulses',
    why: `A vaccine puts a small amount of dead or inactive pathogen into the body. White blood cells make antibodies against it. If the real pathogen turns up, they make the right antibodies fast, so you don’t get ill. The more people vaccinated, the less a disease can spread.`,
    tasks: [t1, t2],
    workingOn: 0,
    side: {
      prompt: 'How does the measles vaccine protect you?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'It contains antibiotics that kill the measles virus', label: 'It contains antibiotics that kill the measles virus', nope: 'Two mistakes in one! Vaccines don’t contain antibiotics, and antibiotics don’t kill viruses anyway. A vaccine trains your white blood cells.' },
        { value: 'It gives you a full-strength dose of measles', label: 'It gives you a full-strength dose of measles', nope: 'That would just give you measles. A vaccine uses dead or inactive pathogen, so you don’t get ill.' },
        { value: 'It makes your red blood cells carry more oxygen', label: 'It makes your red blood cells carry more oxygen', nope: 'Red blood cells carry oxygen; they don’t fight disease. White blood cells make the antibodies.' },
      ], { count: 4 }),
      why: `The vaccine’s dead or inactive pathogen makes white blood cells produce antibodies. If the real measles shows up, they respond fast and you stay well.`,
    },
    chain: [
      { line: `100\\% - [[v:${V}\\%]] = [[u:${100 - V}\\%]]` },
      { line: `[[u:${100 - V}\\%]] \\text{ of } [[s:${tex(S)}]]`, op: 'Of the school', why: `${100 - V}% of the ${n(S)} students aren’t vaccinated.` },
      { line: `[[f:${tex((100 - V) / 100)}]] \\times [[s:${tex(S)}]]`, op: '÷ 100', merge: { f: ['u'] }, why: `${100 - V} ÷ 100 = ${n((100 - V) / 100)}.` },
      { line: `[[r:${tex(un)}]]\\text{ students}`, op: 'Multiply', merge: { r: ['f', 's'] }, why: `${n((100 - V) / 100)} × ${n(S)} = ${n(un)} students to offer the jab.` },
    ],
  }
}

/** Round 5 (boss): the microscopy required practical. Cell size from the field of view, then a drawing's magnification. */
function practicalRound(rand: Rand): RushRound {
  const field = rand.pick([1, 2]), across = rand.pick([4, 5, 8, 10]), cell = field * 1000 / across, fieldUm = field * 1000
  const fix1 = `${field} mm = ${n(fieldUm)} µm. ${n(fieldUm)} ÷ ${across} = ${cell} µm.`
  const t1: RushTask = {
    id: 'prac-1', prompt: `Onion skin under the microscope. The field of view is ${field} mm across and ${across} cells fit across it. How long is one cell, in µm?`,
    label: 'Cell length', unit: MU, answer: cell, start: 0, min: 0, max: 1000, step: 5, jump: 50,
    win: `Share the field of view between the cells. ${fix1}`,
    nope: value => diagnose(cell, value, MU, [
      [fieldUm, `That’s the whole field of view. Share it between the ${across} cells.`],
      [field * 100 / across, `1 mm is 1000 µm, not 100. ${n(fieldUm)} ÷ ${across}.`],
      [fieldUm / (across + 1), `Count the cells across, not the gaps: divide by ${across}.`],
    ], fix1),
    scene: { layout: 'field', across, given: [['Field of view', `${field} mm`], ['Cells across', `${across}`]] },
  }

  const mags = [40, 50, 100, 200, 400].filter(m => Number.isInteger(m * cell / 1000) && m * cell / 1000 >= 20 && m * cell / 1000 <= 120)
  const M = rand.pick(mags), D = M * cell / 1000, Dum = D * 1000
  const fix2 = `${D} mm = ${n(Dum)} µm. ${n(Dum)} ÷ ${cell} = ×${M}.`
  const t2: RushTask = {
    id: 'prac-2', prompt: `You draw one ${cell} µm cell ${D} mm long in your book. What’s the magnification of your drawing?`,
    label: 'Magnification ×', unit: X, answer: M, start: 0, min: 0, max: 1000, step: 10, jump: 50,
    win: `Same units top and bottom, then image ÷ real. ${fix2}`,
    nope: value => diagnose(M, value, X, [
      [D * 100 / cell, `1 mm is 1000 µm, not 100. Your drawing is ${n(Dum)} µm.`],
      [D * 10000 / cell, `1 mm is 1000 µm, not 10,000. Your drawing is ${n(Dum)} µm.`],
      [D, `That’s the drawing’s length. Divide it (in µm) by the real size.`],
      [cell, `That’s the real cell size. Magnification = drawing ÷ real.`],
    ], fix2),
    scene: { layout: 'field', across, given: [['Real cell', `${cell} µm`], ['Drawing', `${D} mm`]] },
  }

  const right = 'The lowest power, to find the cells first'
  return {
    id: 'prac', title: 'Round 5 · The required practical', headline: 'Microscopy',
    why: `Put a thin layer of onion skin on a slide and add a drop of iodine stain so the cells show up. Start on the lowest power objective, focus, then move up. Estimate a cell’s size from the field of view: field width ÷ cells across. Magnification of a drawing = drawing size ÷ real size, both in µm.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Which objective lens should you start the practical on?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'The highest power, to see the most detail', label: 'The highest power, to see the most detail', nope: 'On high power the field is tiny and you’ll never find the cells, and the lens can crack the slide. Start low, then go up.' },
        { value: 'The middle one, to save time', label: 'The middle one, to save time', nope: 'Start on the LOWEST power. It has the biggest field of view, so you can find the cells and focus first.' },
        { value: 'It doesn’t matter, as long as it’s stained', label: 'It doesn’t matter, as long as it’s stained', nope: 'Stain helps you see the cells, but you still start on the lowest power to find and focus them.' },
      ], { count: 4 }),
      why: `The lowest power objective has the widest field of view, so you find the cells and get them in focus. Then switch up to a higher power.`,
    },
    chain: [
      { line: `\\text{cell} = [[f:${tex(fieldUm)}]]\\,\\mu\\text{m} \\div [[k:${across}]]` },
      { line: `\\text{cell} = [[c:${cell}]]\\,\\mu\\text{m}`, op: 'Share the field', merge: { c: ['f', 'k'] }, why: `${field} mm is ${n(fieldUm)} µm, shared between ${across} cells: ${cell} µm each.` },
      { line: `M = [[d:${tex(Dum)}]]\\,\\mu\\text{m} \\div [[c:${cell}]]\\,\\mu\\text{m}`, op: 'Drawing ÷ real', why: `Your drawing is ${D} mm = ${n(Dum)} µm. Same units top and bottom.` },
      { line: `M = \\times [[m:${M}]]`, op: 'Divide', merge: { m: ['d', 'c'] }, why: `${n(Dum)} ÷ ${cell} = ${M}. Your drawing is ×${M}.` },
    ],
  }
}

export function makeRounds(rand: Rand): RushRound[] {
  return [scopeRound(rand), bugRound(rand), wardRound(rand), vaccineRound(rand), practicalRound(rand)]
}
