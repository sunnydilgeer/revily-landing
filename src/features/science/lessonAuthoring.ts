import type { TeachingFrame } from './lesson-1/teachingFrames'
import type { ChoiceState, EvidenceDimension, ScienceLesson, TeachingState, WrittenState } from './types'

// Authoring helpers only: learner/session policies remain in the established engine.
export const biologySource = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1 Cell biology; Foundation boundaries recorded in LESSONS-4-6-ALIGNMENT.md' }
export function frame(label: string, summary: string, text: string, focus: string): TeachingFrame {
  const cue = /osmosis|tissue/.test(focus) ? 'water, membrane, overall direction' : /diffusion|active|transport/.test(focus) ? 'how concentrated, which direction, energy' : /practical|plot|percentage|rate/.test(focus) ? 'what changes, units, evidence' : /cycle/.test(focus) ? 'copy, separate, divide' : /stem|therapeutic/.test(focus) ? 'where found, what cells they can form, limits' : /chromosome|pairs/.test(focus) ? 'cell, nucleus, DNA' : /ratio|exchange/.test(focus) ? 'surface area, distance, supply' : 'feature → how it helps → job'
  return { label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus }
}
export function author(skillId: string, specRefs: string[], sourceIds = ['aqa-biology']) {
  const base = { skillId, specRefs, sourceIds }
  return {
    teach(id: string, title: string, frames: TeachingFrame[]): TeachingState {
      const script = frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' ')
      return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script, media: { kind: 'videoScript', seconds: frames.length * 12, script, status: 'notRecorded' } }
    },
    choice(id: string, title: string, labels: string[], correct: number, hint: string, steps: string[], dimension: EvidenceDimension = 'understanding', independent = false, visual?: string): ChoiceState {
      return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : 'guided', contextId: `${skillId}-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : 'practice',
        options: labels.map((label, i) => ({ id: String(i), label })), answerId: String(correct), hint, explanation: { steps, answer: labels[correct] },
        ...(visual ? { visual: { id: visual, kind: 'cellModel' as const, brief: 'Original schematic; see lesson storyboard.', accessibleDescription: 'A simplified cell-biology model.', assessmentDescription: 'A simplified cell-biology model with supplied context in the question.' } } : {}),
        ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : dimension === 'dataInterpretation' ? 'AO3' : 'AO2', status: 'revilyDraft' } as const } : {}) }
    },
    worked(id: string, title: string, body: string, steps: string[], visual: string): TeachingState {
      return { ...base, id, title, body, kind: 'teaching', phase: 'model', steps, visual: { id: visual, kind: 'dataTable', brief: 'Original worked model.', accessibleDescription: body } }
    },
    written(id: string, title: string, hint: string, answer: string, points: string[], reject: string[]): WrittenState {
      return { ...base, id, title, kind: 'written', phase: 'transfer', contextId: `${skillId}-${id}`, dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly', hint,
        placeholder: 'Explain the link using the information given…', instruction: 'Use a few sentences to explain how or why. Your response is saved here for teacher review, not automatically marked.',
        explanation: { steps: points, answer }, rubric: { marks: points.length, points, reject }, exam: { marks: points.length, ao: 'AO2', status: 'revilyDraft' } }
    }
  }
}
export function sampledRequirements(states: ScienceLesson['states']): ScienceLesson['requirements'] {
  const requirements: ScienceLesson['requirements'] = {}
  for (const state of states) if (state.kind !== 'teaching' && state.evidenceRole === 'independent') for (const dimension of state.dimensions) {
    const rule = requirements[dimension] || { inSession: [], delayed: [] }
    rule.inSession.push(state.id); requirements[dimension] = rule
  }
  return requirements
}
