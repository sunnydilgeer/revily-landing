import type { Metadata } from 'next'
import FormulaForge from '../../../../src/features/maths/labs/formula/FormulaForge'

export const metadata: Metadata = {
  title: 'Formula Forge | Revily lab',
  description: 'Prototype chapter: substitution into formulae and function machines, forging weapons with Flint the blacksmith.',
}

export default function FormulaLabPage() {
  return <div className="lab-page"><FormulaForge /></div>
}
