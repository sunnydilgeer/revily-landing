import type { Metadata } from 'next'
import ElementHunter from '../../../../src/features/science/labs/element/ElementHunter'

export const metadata: Metadata = {
  title: 'Element Hunter | Revily Science Arcade',
  description: 'Hunt lithium in Cornwall and silicon for British chips: atomic structure, the periodic table, ions and bonding, and the temperature-changes practical.',
}

export default function ElementHunterLabPage() {
  return <div className="lab-page"><ElementHunter /></div>
}
