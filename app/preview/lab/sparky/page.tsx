import type { Metadata } from 'next'
import Sparky from '../../../../src/features/science/labs/sparky/Sparky'

export const metadata: Metadata = {
  title: 'Sparky | Revily Science Arcade',
  description: 'Wire a solar house and an EV charger: V = IR, series and parallel circuits, power and the resistance-of-a-wire practical.',
}

export default function SparkyLabPage() {
  return <div className="lab-page"><Sparky /></div>
}
