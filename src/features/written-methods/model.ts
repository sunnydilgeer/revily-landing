import type { FeedbackDefinition, InteractionDefinition, LearningState, LessonDefinition, MicroSkillId } from '../number-types/types'

export type Diagram =
  | { kind: 'division'; dividend: string; divisor: number; quotient?: string; active?: number; carry?: { index: number; value: number } }
  | { kind: 'multiply'; top: string; bottom: string; ones?: string; tens?: string; total?: string; carry?: { column: number; value: number }; active?: 'ones' | 'tens' }
  | { kind: 'text'; lines: string[] }
export type MethodVisual = Diagram
  | { kind: 'groups' } | { kind: 'exchange' } | { kind: 'area' } | { kind: 'scale' }
  | { kind: 'worked'; initial: Diagram; steps: Array<{ diagram: Diagram; text: string }> }
export type MethodState = LearningState & { visual: MethodVisual; hint?: string }
export type MethodLesson = Omit<LessonDefinition, 'states'> & { states: MethodState[] }
export const select = (labels: string[], correct: number): InteractionDefinition => ({ type: 'select', options: labels.map((label, i) => ({ id: String(i), label })), correctAnswer: String(correct) })
export const numeric = (answer: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: answer.toLocaleString('en-GB'), acceptanceRule: 'normalisedNumber' })
export const remainder = (dividend: number, divisor: number): InteractionDefinition => ({ type: 'quotientRemainderInput', dividend, divisor, correctAnswer: { quotient: Math.floor(dividend / divisor), remainder: dividend % divisor } })
export const working = (answer: string, ...steps: Array<[string, string]>): NonNullable<FeedbackDefinition['workedExplanation']> => ({ answer, steps: steps.map(([title, line]) => ({ title, lines: [line] })) })
export function storyboard(prefix: string) {
  const states: MethodState[] = []
  function add(topic: MicroSkillId, title: string, visual: MethodVisual, interaction: InteractionDefinition, explanation?: ReturnType<typeof working>, hint?: string, phase: LearningState['phase'] = 'guided', body?: string) {
    states.push({ id: `${prefix}-${String(states.length + 1).padStart(2, '0')}`, microSkillId: topic, phase, teachingIntent: title, content: { title, body }, visual, hint, interaction,
      component: { type: 'placeValueChart', props: { value: '0' } },
      feedback: explanation ? { correct: { message: 'Correct.', workedExplanation: explanation }, incorrect: { message: 'Here’s the working.', workedExplanation: explanation } } : undefined,
      transition: {}, completionCondition: 'Continue after one submission, regardless of accuracy.' })
  }
  function teach(topic: MicroSkillId, title: string, visual: MethodVisual, body?: string) { add(topic, title, visual, { type: 'continue' }, undefined, undefined, 'teach', body) }
  return { states, add, teach }
}
