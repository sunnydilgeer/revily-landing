import type { ChainStep } from '../../maths/step-chain/StepChain'
import { chainFromSteps } from '../../maths/step-chain/fromSteps'
import type { MethodWorking } from './methodWorking'

/** A line of a method's step chain, and which worked step's picture to show from this line on (-1: the empty picture). */
export type MethodChainStep = ChainStep & { at?: { example?: number; step: number } }

/**
 * Every example in a method working as one step chain. An example with its own chain (terms that
 * fly between lines, like the grid method) uses it; any other example's steps become the lines.
 * A second example (the same sum by another method, or the next phase) is introduced by its label.
 */
export function methodChain(visual: MethodWorking): MethodChainStep[] {
  return visual.examples.flatMap((example, index) => {
    const own: MethodChainStep[] = example.chain ?? chainFromSteps(example.expression, example.steps).map((line, i) => i ? { ...line, at: { step: i - 1 } } : line)
    // Collecting like terms: the coloured term tiles already show each line, so the chain keeps only the words.
    if (example.method === 'collect') own.forEach((line, i) => { if (!i || example.steps[i - 1].frame.terms) line.pictured = true })
    const lines = own.map(line => line.at ? { ...line, at: { ...line.at, example: index } } : line)
    if (index === 0) return lines
    const [first, ...rest] = lines
    return [{ ...first, op: example.label, why: `Now the ${example.label.toLowerCase()}, starting from ${example.expression.replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\/g, '')}.`, at: { example: index, step: -1 } }, ...rest]
  })
}
