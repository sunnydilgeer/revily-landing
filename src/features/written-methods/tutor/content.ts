import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { working } from '../model'
import type { TutorMethodState, TutorMethodVisual } from './model'

/** Builds a lesson's screens in order. `prefix` names their ids (L11-01); a Higher section passes its own (L11-H01). */
export function author(number: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 2.5 | 11.5, prefix = `L${number}`) {
  const states: TutorMethodState[] = []
  function add(topic: MicroSkillId, title: string, sourceRef: string, visual: TutorMethodVisual, interaction: InteractionDefinition = { type: 'continue' }, explanation?: ReturnType<typeof working>, hint?: string, body?: string) {
    const s: TutorMethodState = {
      id: `${prefix}-${String(states.length + 1).padStart(2, '0')}`, microSkillId: topic, sourceRef, visual, hint,
      phase: interaction.type === 'continue' ? 'teach' : 'independent', teachingIntent: title, content: { title, body }, interaction,
      component: { type: 'expressionSteps', props: { expression: '', steps: [] } },
      feedback: explanation ? { correct: { message: 'Correct.', workedExplanation: explanation }, incorrect: { message: 'Here’s the working.', workedExplanation: explanation } } : undefined,
      transition: {}, completionCondition: 'Continue after viewing the working, regardless of accuracy.',
    }
    states.push(s)
    return s
  }
  function finish({ videoFirst = false }: { videoFirst?: boolean } = {}) {
    if (videoFirst) {
      const index = states.findIndex(state => state.video)
      if (index > 0) states.unshift(states.splice(index, 1)[0])
    }
    states.forEach((state, i) => { state.id = `${prefix}-${String(i + 1).padStart(2, '0')}` })
    states.forEach((state, i) => { state.transition.onComplete = states[i + 1]?.id })
    return states
  }
  return { states, add, finish }
}
