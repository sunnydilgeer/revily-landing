import type { Metadata } from 'next'
import LaserLine from '../../../../src/features/maths/labs/laser/LaserLine'

export const metadata: Metadata = {
  title: 'Laser Line | Revily lab',
  description: 'Prototype chapter: straight-line graphs, tuning y = mx + c to aim a laser at drones.',
}

export default function LaserLabPage() {
  return <div className="lab-page"><LaserLine /></div>
}
