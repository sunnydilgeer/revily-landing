/*
 * A Paper Sprint: six questions that climb like a real paper does. Two warm-ups (Q1–6 recall), two
 * work-it-outs (Q7–15), one multi-step (Q16–22) and one stretch (Q23+).
 *
 * Questions come first from skills the student has learnt (finished in a lesson), so a sprint tests what they
 * have been taught. When a ramp has nothing learnt yet, any template on that ramp fills the gap.
 * Among those, skills AQA tests more often come up more often (aqaWeights.ts), and each time a template has
 * already been served halves its chance, so everything still comes round.
 * Each template serves its next set of numbers, so a repeat is a new question.
 */
import type { Level } from '../readiness/readiness'
import { aqaWeight } from './aqaWeights'
import { RAMPS, type Question, type Ramp, type Template } from './types'

export const SPRINT_SHAPE: Record<Ramp, number> = { recall: 2, apply: 2, multistep: 1, stretch: 1 }

const LEARNT: Level[] = ['learnt', 'secure', 'examReady']

/** True when every statement the template tests has been learnt. */
export function isLearnt(template: Template, levels: Record<string, Level>) {
  const statements = new Set(template.variants[0].parts.flatMap(part => part.statements))
  return [...statements].every(key => LEARNT.includes(levels[key] ?? 'notStarted'))
}

export const templateWeight = (template: Template) => aqaWeight([...new Set(template.variants[0].parts.flatMap(part => part.statements))])

/** One template, picked with chance in proportion to its score. */
function pickWeighted(candidates: Template[], score: (template: Template) => number, random: () => number) {
  const scores = candidates.map(score), total = scores.reduce((a, b) => a + b, 0)
  let roll = random() * total
  for (let i = 0; i < candidates.length; i++) if ((roll -= scores[i]) < 0) return candidates[i]
  return candidates[candidates.length - 1]
}

export function toQuestion(template: Template, served: number): Question {
  const variant = served % template.variants.length
  const { variants: _variants, ...meta } = template
  return { ...meta, ...template.variants[variant], variant }
}

/**
 * Picks the sprint. `served` counts how many times each template has been shown (to choose its next numbers
 * and to prefer the ones seen least); `random` is injectable so the checks can pin it.
 */
export function buildSprint(templates: Template[], levels: Record<string, Level>, served: Record<string, number>, random = Math.random): Question[] {
  const picked: Template[] = []
  for (const ramp of RAMPS) {
    const onRamp = templates.filter(template => template.ramp === ramp)
    const learnt = onRamp.filter(template => isLearnt(template, levels))
    let pool = learnt.length >= SPRINT_SHAPE[ramp] ? learnt : onRamp
    for (let i = 0; i < SPRINT_SHAPE[ramp]; i++) {
      // Prefer a topic not already in the sprint; then weigh AQA frequency against how often each has been served.
      const fresh = pool.filter(template => !picked.some(other => other.topic === template.topic))
      const candidates = (fresh.length ? fresh : pool).filter(template => !picked.includes(template))
      if (!candidates.length) break
      const fewest = Math.min(...candidates.map(template => served[template.id] ?? 0))
      picked.push(pickWeighted(candidates, template => templateWeight(template) * 0.5 ** ((served[template.id] ?? 0) - fewest), random))
      pool = pool.filter(template => template !== picked[picked.length - 1])
    }
  }
  return picked.map(template => toQuestion(template, served[template.id] ?? 0))
}
