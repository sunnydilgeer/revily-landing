import type { Metadata } from 'next'
import SliceWars from '../../../../src/features/maths/labs/slice/SliceWars'

export const metadata: Metadata = {
  title: 'Slice Wars | Revily lab',
  description: 'Prototype chapter: fractions (equivalent fractions, adding fractions and fractions of amounts) by cutting pizzas in Nonna Rosa’s shop.',
}

export default function SliceLabPage() {
  return <div className="lab-page"><SliceWars /></div>
}
