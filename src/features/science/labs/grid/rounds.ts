import { options, type Rand } from '../../../maths/labs/kit/random'
import { diagnose, n, tex, u, type Round, type Task } from '../kit/types'

/*
 * Grid Boss: keep Britain's lights on through the 6pm kettle surge with Gridlock Gary in the
 * National Grid control room (AQA 6.1 Energy). Every answer is picked first, then the numbers are
 * built around it, so they stay whole and land on the dial's grid.
 */

/** One line on the control-room screen. No `value` means it's the line the dial sets. */
export type Row = { name: string; value?: string }

export type Scene = {
  layout: 'surge' | 'plant' | 'hydro' | 'mix' | 'heat'
  rows: Row[]
  /** plant: which station, and what the dial sets, so the energy arrows can follow it. */
  plant?: 'gas' | 'wind'
  sankey?: { mode: 'eff' | 'waste'; total: number }
  /** hydro: pumping water up (store it) or letting it rush down (use it). */
  hydro?: 'up' | 'down'
  /** mix: the supply in GW. No gas means the dial sets it. */
  mix?: { demand: number; nuclear: number; wind: number; solar: number; gas?: number }
  /** heat: what's being heated. */
  vessel?: 'kettle' | 'beaker'
}
export type GridTask = Task<Scene>
export type GridRound = Round<Scene>

const G = 9.8, C = 4200

/** Round 1: P = E ÷ t for one kettle, then E = P × t with the minutes turned into seconds. */
function surgeRound(rand: Rand): GridRound {
  const P = rand.pick([2000, 2200, 2400, 2500, 3000]), t = rand.pick([60, 90, 120, 150, 180]), E = P * t
  const fix1 = `P = E ÷ t = ${n(E)} ÷ ${t} = ${n(P)} W.`
  const t1: GridTask = {
    id: 'surge-1', prompt: `The test kettle in the control room transfers ${n(E)} J of energy in ${t} s. What is its power?`,
    label: 'Power P', unit: 'W', answer: P, start: 0, min: 0, max: 4000, step: 100, jump: 500,
    win: `Power is how fast energy is transferred: joules every second. ${fix1}`,
    nope: value => diagnose(P, value, 'W', [
      [E / 1000, `That’s the energy in kilojoules. Power is energy ÷ time.`],
      [E / t / 2, `You halved it somewhere. It’s just energy ÷ time.`],
      [E / (t / 60), `You turned the seconds into minutes. Keep t in seconds to get watts.`],
    ], fix1),
    scene: { layout: 'surge', rows: [{ name: 'Energy', value: `${n(E)} J` }, { name: 'Time', value: `${t} s` }, { name: 'Power' }] },
  }

  const P2 = rand.pick([2000, 2500, 3000]), mins = rand.pick([2, 3, 4]), secs = mins * 60, E2 = P2 * secs
  const fix2 = `${mins} minutes is ${secs} s, so E = P × t = ${n(P2)} × ${secs} = ${n(E2)} J.`
  const t2: GridTask = {
    id: 'surge-2', prompt: `Mid-surge, a ${n(P2)} W kettle boils for ${mins} minutes. How much energy does it transfer?`,
    label: 'Energy E', unit: 'J', answer: E2, start: 0, min: 0, max: 800000, step: 10000, jump: 100000,
    win: `A watt is a joule every second, and there are ${secs} seconds in ${mins} minutes. ${fix2}`,
    nope: value => diagnose(E2, value, 'J', [
      [P2 * secs / 2, `You halved it. E = P × t, nothing else.`],
      [P2 * mins * 100, `You used ${mins * 100} s. Minutes × 60, not × 100.`],
      [P2 * (secs + 60), `That’s one minute too many. ${mins} minutes is ${secs} s.`],
      [P2 * (secs - 60), `That’s one minute short. ${mins} minutes is ${secs} s.`],
    ], fix2),
    scene: { layout: 'surge', rows: [{ name: 'Power', value: `${n(P2)} W` }, { name: 'Time', value: `${mins} min` }, { name: 'Energy' }] },
  }

  const right = 'The thermal store of the water'
  return {
    id: 'surge', title: 'Round 1 · The kettle surge', headline: 'Power: how fast energy moves',
    why: `Power is the rate energy is transferred, in watts. One watt is one joule every second. So power P = E ÷ t, and energy E = P × t. Time must be in seconds, so turn minutes into seconds first.`,
    tasks: [t1, t2],
    side: {
      prompt: 'As the kettle boils, which energy store fills up?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'The chemical store of the water', label: 'The chemical store of the water', nope: 'Nothing reacts in a kettle. The water gets hotter, so it’s the thermal store.' },
        { value: 'The kinetic store of the kettle', label: 'The kinetic store of the kettle', nope: 'The kettle isn’t moving. The water heats up, so it’s the water’s thermal store.' },
        { value: 'The gravitational store of the water', label: 'The gravitational store of the water', nope: 'The water isn’t lifted any higher. It gets hotter, so the thermal store fills.' },
      ], { count: 4 }),
      why: `Electricity transfers energy to the water’s thermal store. That’s why its temperature goes up.`,
    },
    chain: [
      { line: `[[t:t]] = [[m:${mins}]] \\times [[s:60]]` },
      { line: `[[t:t]] = [[q:${secs}]]\\,\\text{s}`, op: 'Into seconds', merge: { q: ['m', 's'] }, why: `${mins} minutes × 60 = ${secs} seconds.` },
      { line: `[[e:E]] = [[p:${tex(P2)}]] \\times [[q:${secs}]]`, op: 'E = P × t', why: `Power ${n(P2)} W for ${secs} s.` },
      { line: `[[e:E]] = [[r:${tex(E2)}]]\\,\\text{J}`, op: 'Multiply', merge: { r: ['p', 'q'] }, why: `${n(P2)} × ${secs} = ${n(E2)} J from one kettle. Now times that by millions.` },
    ],
  }
}

/** Round 2: efficiency of a gas station as a %, then the energy a wind turbine wastes. */
function efficiencyRound(rand: Rand): GridRound {
  const eff = rand.pick([40, 45, 55, 60]), input = rand.pick([200, 400, 500, 600, 800, 1000]), useful = input * eff / 100
  const fix1 = `Efficiency = useful ÷ total = ${useful} ÷ ${input} = ${n(eff / 100)}, then × 100 = ${eff}%.`
  const t1: GridTask = {
    id: 'eff-1', prompt: `The gas power station burns fuel holding ${input} MJ and sends ${useful} MJ to the grid as electricity. What is its efficiency?`,
    label: 'Efficiency', unit: '%', answer: eff, start: 0, min: 0, max: 100, step: 5, jump: 20,
    win: `Efficiency is the useful output over the total input. ${fix1}`,
    nope: value => diagnose(eff, value, '%', [
      [100 - eff, `That’s the WASTED share. Efficiency is the useful part: useful ÷ total.`],
      [useful, `That’s the useful energy in MJ, not a percentage. Divide it by the total.`],
      [Math.round(input / useful * 100), `Upside down. It’s useful ÷ total, not total ÷ useful.`],
    ], fix1),
    scene: { layout: 'plant', plant: 'gas', sankey: { mode: 'eff', total: input }, rows: [{ name: 'Energy in', value: `${input} MJ` }, { name: 'Useful out', value: `${useful} MJ` }, { name: 'Efficiency' }] },
  }

  const eff2 = rand.pick([35, 40, 45]), total = rand.pick([200, 400, 600, 800, 1000]), used = total * eff2 / 100, wasted = total - used
  const fix2 = `Useful = ${n(eff2 / 100)} × ${total} = ${used} kJ, so wasted = ${total} − ${used} = ${wasted} kJ.`
  const t2: GridTask = {
    id: 'eff-2', prompt: `Out in the North Sea, a gust gives a turbine ${total} kJ of kinetic energy. It’s ${eff2}% efficient. How much energy is wasted?`,
    label: 'Wasted energy', unit: 'kJ', answer: wasted, start: 0, min: 0, max: 1000, step: 5, jump: 50,
    win: `Find the useful part, then take it off the total. ${fix2}`,
    nope: value => diagnose(wasted, value, 'kJ', [
      [used, `That’s the USEFUL energy. Wasted is what’s left: total − useful.`],
      [total, `That’s all of it. Some of it is useful, so take that off.`],
      [100 - eff2, `That’s the wasted percentage. Turn it into kJ: work out the useful part, then total − useful.`],
      [total - eff2, `You took away the percentage itself. Find ${eff2}% of ${total} first.`],
    ], fix2),
    scene: { layout: 'plant', plant: 'wind', sankey: { mode: 'waste', total }, rows: [{ name: 'Energy in', value: `${total} kJ` }, { name: 'Efficiency', value: `${eff2}%` }, { name: 'Wasted' }] },
  }

  const right = 'Spread out into the surroundings, mostly as heat'
  return {
    id: 'eff', title: 'Round 2 · Power stations', headline: 'Efficiency: how much is useful',
    why: `No machine is perfect: some input energy is always wasted. Efficiency = useful output ÷ total input. Times by 100 for a percentage. Energy can’t be made or destroyed, so wasted = total − useful.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Where does the wasted energy go?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'It is destroyed in the generator', label: 'It is destroyed in the generator', nope: 'Energy can never be destroyed. The wasted energy is dissipated, spread out into the surroundings as heat.' },
        { value: 'It is stored in the cables for later', label: 'It is stored in the cables for later', nope: 'You can’t get it back. It spreads out into the surroundings, mostly heating them up a little.' },
        { value: 'It is turned back into fuel', label: 'It is turned back into fuel', nope: 'If only. It is dissipated: spread out into the surroundings as heat, too thin to use.' },
      ], { count: 4 }),
      why: `Wasted energy is dissipated: friction and resistance heat the surroundings. It still exists, just too spread out to be useful.`,
    },
    chain: [
      { line: `[[u:\\text{useful}]] = [[f:${tex(eff2 / 100)}]] \\times [[t:${total}]]` },
      { line: `[[u:\\text{useful}]] = [[a:${used}]]\\,\\text{kJ}`, op: 'Multiply', merge: { a: ['f', 't'] }, why: `${eff2}% is ${n(eff2 / 100)}, and ${n(eff2 / 100)} × ${total} = ${used}.` },
      { line: `[[w:\\text{wasted}]] = [[t:${total}]] - [[a:${used}]]`, op: 'Total − useful', why: `Whatever isn’t useful is wasted. Energy is never lost.` },
      { line: `[[w:\\text{wasted}]] = [[r:${wasted}]]\\,\\text{kJ}`, op: 'Subtract', merge: { r: ['t', 'a'] }, why: `${total} − ${used} = ${wasted} kJ heats the sea air.` },
    ],
  }
}

/** Round 3: pumped hydro at Dinorwig. Ep = m g h going up, Ek = ½ m v² coming down. */
function hydroRound(rand: Rand): GridRound {
  const m = rand.pick([10, 20]), h = rand.pick([100, 200, 300, 400, 500]), Ep = Math.round(m * G * h)
  const fix1 = `Ep = m × g × h = ${m} × 9.8 × ${h} = ${n(Ep)} J.`
  const t1: GridTask = {
    id: 'hydro-1', prompt: `At night the pumps lift ${m} kg of water ${h} m up the mountain. How much gravitational potential energy does it store? (g = 9.8 N/kg)`,
    label: 'Energy Ep', unit: 'J', answer: Ep, start: 0, min: 0, max: 100000, step: 100, jump: 10000,
    win: `Lift it higher, store more energy. ${fix1}`,
    nope: value => diagnose(Ep, value, 'J', [
      [m * h, `You forgot g. Multiply by 9.8 too: Ep = m × g × h.`],
      [m * 10 * h, `You used g = 10. Use 9.8 N/kg, as the question says.`],
      [Math.round(m * G * h / 2), `You halved it. That ½ is for kinetic energy, not Ep.`],
    ], fix1),
    scene: { layout: 'hydro', hydro: 'up', rows: [{ name: 'Mass', value: `${m} kg` }, { name: 'Height', value: `${h} m` }, { name: 'Energy Ep' }] },
  }

  const m2 = rand.pick([2, 4, 6, 8, 10]), v = rand.pick([10, 20, 30, 40, 50]), Ek = m2 * v * v / 2
  const fix2 = `Ek = ½ × m × v² = 0.5 × ${m2} × ${v}² = 0.5 × ${m2} × ${n(v * v)} = ${n(Ek)} J.`
  const t2: GridTask = {
    id: 'hydro-2', prompt: `6pm: open the gates! ${m2} kg of water hits the turbine at ${v} m/s. How much kinetic energy does it have?`,
    label: 'Energy Ek', unit: 'J', answer: Ek, start: 0, min: 0, max: 15000, step: 100, jump: 1000,
    win: `Square the speed first, then halve and multiply. ${fix2}`,
    nope: value => diagnose(Ek, value, 'J', [
      [m2 * v * v, `You forgot the ½. Ek = ½ × m × v².`],
      [m2 * v / 2, `You forgot to square the speed. It’s v², so ${v} × ${v} = ${n(v * v)}.`],
      [(m2 * v / 2) ** 2, `Only the speed is squared, not the whole lot.`],
      [m2 * v, `That’s m × v. Kinetic energy is ½ × m × v².`],
    ], fix2),
    scene: { layout: 'hydro', hydro: 'down', rows: [{ name: 'Mass', value: `${m2} kg` }, { name: 'Speed', value: `${v} m/s` }, { name: 'Energy Ek' }] },
  }

  const right = 'Gravitational potential energy'
  return {
    id: 'hydro', title: 'Round 3 · Dinorwig', headline: 'A mountain-sized battery',
    why: `When wind power is spare at night, Dinorwig pumps water up into a lake high in the mountain. Lifting it stores gravitational potential energy: Ep = m × g × h, with g = 9.8 N/kg. At 6pm the water rushes back down. Moving water has kinetic energy: Ek = ½ × m × v². It spins the turbines in seconds.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Water pumped up to the top lake stores energy as…', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Kinetic energy', label: 'Kinetic energy', nope: 'The water sits still in the lake, so no kinetic energy. It’s high up, so it’s gravitational potential energy.' },
        { value: 'Chemical energy', label: 'Chemical energy', nope: 'Nothing reacts. The water is lifted higher, so it stores gravitational potential energy.' },
        { value: 'Elastic potential energy', label: 'Elastic potential energy', nope: 'That’s for stretched or squashed things like springs. Lifted water stores gravitational potential energy.' },
      ], { count: 4 }),
      why: `Height means gravitational potential energy. Let it fall and it turns into kinetic energy, then electricity.`,
    },
    chain: [
      { line: `E_k = \\tfrac{1}{2} \\times m \\times v^2` },
      { line: `E_k = [[h:0.5]] \\times [[m:${m2}]] \\times [[v:${v}^2]]`, op: 'Swap in', why: `m = ${m2} kg and v = ${v} m/s.` },
      { line: `E_k = [[h:0.5]] \\times [[m:${m2}]] \\times [[q:${tex(v * v)}]]`, op: 'Square first', merge: { q: ['v'] }, why: `Only the speed is squared: ${v} × ${v} = ${n(v * v)}.` },
      { line: `E_k = [[r:${tex(Ek)}]]\\,\\text{J}`, op: 'Multiply', merge: { r: ['h', 'm', 'q'] }, why: `0.5 × ${m2} × ${n(v * v)} = ${n(Ek)} J into the turbine.` },
    ],
  }
}

/** Round 4: fill the gap with gas, then work out the renewable percentage. */
function mixRound(rand: Rand): GridRound {
  const D = rand.pick([40, 50]), N = rand.pick([4, 5, 6])
  let W = 0, S = 0
  do { W = rand.int(10, 20); S = rand.int(2, 8) } while (D === 40 && (W + S) % 2 !== 0)
  const gas = D - N - W - S, R = W + S, pct = R * 100 / D
  const fix1 = `Supply so far: ${N} + ${W} + ${S} = ${N + R} GW, so gas = ${D} − ${N + R} = ${gas} GW.`
  const mix = { demand: D, nuclear: N, wind: W, solar: S }
  const t1: GridTask = {
    id: 'mix-1', prompt: `Demand is ${D} GW. Nuclear gives ${N} GW, wind ${W} GW and solar ${S} GW. How much gas do you need to fire up?`,
    label: 'Gas', unit: 'GW', answer: gas, start: 0, min: 0, max: 50, step: 1, jump: 5,
    win: `Supply has to match demand exactly. ${fix1}`,
    nope: value => diagnose(gas, value, 'GW', [
      [D - W - S, `You forgot the nuclear. Take all three off the demand.`],
      [D - N - W, `You forgot the solar. Take all three off the demand.`],
      [D - N - S, `You forgot the wind. Take all three off the demand.`],
      [D - N, `You only took off the nuclear. Wind and solar are supplying too.`],
      [N + R, `That’s what’s already supplying. Gas fills the GAP up to ${D} GW.`],
    ], fix1),
    scene: { layout: 'mix', mix, rows: [{ name: 'Demand', value: `${D} GW` }, { name: 'Nuclear', value: `${N} GW` }, { name: 'Wind + solar', value: `${W} + ${S} GW` }, { name: 'Gas' }] },
  }

  const fix2 = `Renewable = wind + solar = ${R} GW. ${R} ÷ ${D} × 100 = ${pct}%.`
  const t2: GridTask = {
    id: 'mix-2', prompt: `What percentage of the ${D} GW is coming from renewables?`,
    label: 'Renewable', unit: '%', answer: pct, start: 0, min: 0, max: 100, step: 1, jump: 10,
    win: `Wind and solar are renewable; nuclear and gas are not. ${fix2}`,
    nope: value => diagnose(pct, value, '%', [
      [(R + N) * 100 / D, `You counted nuclear. Uranium runs out, so nuclear is NOT renewable. Just wind and solar.`],
      [W * 100 / D, `You left out solar. Wind and solar are both renewable.`],
      [S * 100 / D, `You left out wind. Wind and solar are both renewable.`],
      [R, `That’s ${R} GW, not a percentage. Divide by ${D}, then × 100.`],
      [100 - pct, `That’s the NON-renewable share. Use wind + solar.`],
      [gas * 100 / D, `That’s the gas share. Use wind + solar.`],
    ], fix2),
    scene: { layout: 'mix', mix: { ...mix, gas }, rows: [{ name: 'Demand', value: `${D} GW` }, { name: 'Wind', value: `${W} GW` }, { name: 'Solar', value: `${S} GW` }, { name: 'Renewable' }] },
  }

  const right = 'Wind and solar aren’t always there when it’s calm or dark'
  return {
    id: 'mix', title: 'Round 4 · Balance the grid', headline: 'Fill the gap, or the lights go out',
    why: `Supply must match demand every second, or the grid’s frequency drifts from 50 Hz. Add up what’s already supplying, and fill the gap with gas. Renewables (wind, solar, hydro, tides) never run out. Nuclear and gas will.`,
    tasks: [t1, t2],
    side: {
      prompt: 'It’s a calm winter evening. Why keep gas stations ready, even with loads of wind farms?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'Gas is renewable too', label: 'Gas is renewable too', nope: 'Natural gas is a fossil fuel: it will run out. It’s kept because it can be switched on fast when the wind drops.' },
        { value: 'Wind turbines only work in summer', label: 'Wind turbines only work in summer', nope: 'Winter is often windier! The problem is calm days and dark evenings: wind and solar aren’t reliable.' },
        { value: 'Gas gives out no carbon dioxide', label: 'Gas gives out no carbon dioxide', nope: 'Burning gas releases carbon dioxide. It’s kept because it’s reliable and quick to start.' },
      ], { count: 4 }),
      why: `Wind and solar depend on the weather and the time of day. Gas can be started quickly to cover the gap. Big batteries and Dinorwig help us use less of it.`,
    },
    chain: [
      { line: `[[r:\\text{renewable}]] = [[w:${W}]] + [[s:${S}]]` },
      { line: `[[r:\\text{renewable}]] = [[t:${R}]]\\,\\text{GW}`, op: 'Add', merge: { t: ['w', 's'] }, why: `Wind ${W} GW + solar ${S} GW. Nuclear isn’t renewable.` },
      { line: `\\% = [[t:${R}]] \\div [[d:${D}]] \\times 100`, op: 'Share of demand', why: `Part ÷ whole, then × 100 for a percentage.` },
      { line: `\\% = [[p:${pct}]]\\%`, op: 'Divide, × 100', merge: { p: ['t', 'd'] }, why: `${R} ÷ ${D} = ${n(R / D)}, × 100 = ${pct}% renewable.` },
    ],
  }
}

/** Round 5 (boss): specific heat capacity. ΔE = m c Δθ forwards for the kettle, then the practical for Δθ. */
function heatRound(rand: Rand): GridRound {
  const m = rand.pick([0.5, 1, 1.5]), start = rand.pick([10, 20, 30, 40]), dT = 100 - start, E = m * C * dT
  const fix1 = `Δθ = 100 − ${start} = ${dT} °C. ΔE = m × c × Δθ = ${n(m)} × 4,200 × ${dT} = ${n(E)} J.`
  const t1: GridTask = {
    id: 'heat-1', prompt: `A kettle holds ${n(m)} kg of water at ${start} °C. How much energy to bring it to 100 °C? (c = 4,200 J/kg °C)`,
    label: 'Energy ΔE', unit: 'J', answer: E, start: 0, min: 0, max: 600000, step: 1000, jump: 10000,
    win: `Use the temperature CHANGE, not the final temperature. ${fix1}`,
    nope: value => diagnose(E, value, 'J', [
      [m * C * 100, `You used 100 °C. Use the change: 100 − ${start} = ${dT} °C.`],
      [m * C * start, `You used the starting temperature. Use the change: ${dT} °C.`],
      [C * dT, `You forgot the mass. Multiply by ${n(m)} kg too.`],
      [m * C * (100 + start), `You added the temperatures. Δθ is the change: 100 − ${start}.`],
    ], fix1),
    scene: { layout: 'heat', vessel: 'kettle', rows: [{ name: 'Mass', value: `${n(m)} kg` }, { name: 'Temp', value: `${start} → 100 °C` }, { name: 'Energy ΔE' }] },
  }

  const m2 = rand.pick([0.2, 0.5, 1]), rise = rand.int(5, 30), room = rand.pick([15, 18, 20, 22]), E2 = Math.round(m2 * C * rise)
  const mc = Math.round(m2 * C)
  const fix2 = `Δθ = ΔE ÷ (m × c) = ${n(E2)} ÷ (${n(m2)} × 4,200) = ${n(E2)} ÷ ${n(mc)} = ${rise} °C.`
  const t2: GridTask = {
    id: 'heat-2', prompt: `The joulemeter reads ${n(E2)} J. The beaker holds ${n(m2)} kg of water, starting at ${room} °C. How much does the temperature rise?`,
    label: 'Rise Δθ', unit: '°C', answer: rise, start: 0, min: 0, max: 60, step: 1, jump: 5,
    win: `Rearrange ΔE = m × c × Δθ for Δθ. ${fix2}`,
    nope: value => diagnose(rise, value, '°C', [
      [room + rise, `That’s the FINAL temperature. The rise is just how much it went up.`],
      [E2 / C, `You forgot the mass. Divide by m × c together: ${n(m2)} × 4,200 = ${n(mc)}.`],
      [E2 * m2 / C, `You multiplied by the mass. Divide by m × c.`],
      [rise - room, `You took off the room temperature. The rise is ΔE ÷ (m × c).`],
    ], fix2),
    scene: { layout: 'heat', vessel: 'beaker', rows: [{ name: 'Energy', value: `${n(E2)} J` }, { name: 'Mass', value: `${n(m2)} kg` }, { name: 'Start', value: `${room} °C` }, { name: 'Rise Δθ' }] },
  }

  const right = 'To reduce energy lost to the surroundings'
  return {
    id: 'heat', title: 'Round 5 · The required practical', headline: 'Specific heat capacity',
    why: `Specific heat capacity is the energy needed to warm 1 kg by 1 °C. Water’s is 4,200 J/kg °C, which is why kettles need so much power. ΔE = m × c × Δθ, where Δθ is the temperature change. In the practical, a heater warms a beaker of water while a joulemeter measures the energy. Wrap the beaker in insulation so less energy escapes.`,
    tasks: [t1, t2],
    side: {
      prompt: 'Why wrap the beaker in insulation?', answer: right,
      choices: options<string>(rand, { value: right, label: right }, [
        { value: 'To make the water heat up more slowly', label: 'To make the water heat up more slowly', nope: 'It does the opposite: less energy escapes, so more stays in the water. It reduces energy lost to the surroundings.' },
        { value: 'To stop the thermometer breaking', label: 'To stop the thermometer breaking', nope: 'It’s about energy, not safety. Insulation cuts the energy lost to the surroundings.' },
        { value: 'To make the joulemeter read higher', label: 'To make the joulemeter read higher', nope: 'The joulemeter just counts what the heater supplies. Insulation keeps that energy in the water.' },
      ], { count: 4 }),
      why: `Insulation reduces the energy dissipated to the surroundings. More of the joulemeter’s energy ends up in the water, so your value of c is closer to the real one.`,
    },
    chain: [
      { line: `\\Delta E = m \\times c \\times \\Delta\\theta` },
      { line: `[[e:${tex(E2)}]] = [[m:${tex(m2)}]] \\times [[c:4{,}200]] \\times [[q:\\Delta\\theta]]`, op: 'Swap in', why: `${n(E2)} J went in, to ${n(m2)} kg of water with c = 4,200 J/kg °C.` },
      { line: `[[q:\\Delta\\theta]] = [[e:${tex(E2)}]] \\div ([[m:${tex(m2)}]] \\times [[c:4{,}200]])`, op: 'Get Δθ on its own', why: `Δθ is multiplied by m and c, so divide by both.` },
      { line: `[[q:\\Delta\\theta]] = [[e:${tex(E2)}]] \\div [[k:${tex(mc)}]]`, op: 'Multiply the bottom', merge: { k: ['m', 'c'] }, why: `${n(m2)} × 4,200 = ${n(mc)}.` },
      { line: `[[q:\\Delta\\theta]] = [[r:${rise}]]\\,^{\\circ}\\text{C}`, op: 'Divide', merge: { r: ['e', 'k'] }, why: `${n(E2)} ÷ ${n(mc)} = ${rise}. It ends at ${room + rise} °C.` },
    ],
  }
}

export function makeRounds(rand: Rand): GridRound[] {
  return [surgeRound(rand), efficiencyRound(rand), hydroRound(rand), mixRound(rand), heatRound(rand)]
}

export { u }
