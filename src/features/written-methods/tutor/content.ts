import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { working } from '../model'
import type { TutorMethodState, TutorMethodVisual } from './model'

export function author(number: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 30 | 31 | 32 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 201 | 202) {
  const states: TutorMethodState[] = []
  function add(topic: MicroSkillId, title: string, sourceRef: string, visual: TutorMethodVisual, interaction: InteractionDefinition = { type: 'continue' }, explanation?: ReturnType<typeof working>, hint?: string, body?: string) {
    const s: TutorMethodState = {
      id: `L${number}-${String(states.length + 1).padStart(2, '0')}`, microSkillId: topic, sourceRef, visual, hint,
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
    states.forEach((state, i) => { state.id = `L${number}-${String(i + 1).padStart(2, '0')}` })
    states.forEach((state, i) => { state.transition.onComplete = states[i + 1]?.id })
    return states
  }
  return { states, add, finish }
}
