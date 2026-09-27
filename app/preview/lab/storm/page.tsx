import type { Metadata } from 'next'
import StormRun from '../../../../src/features/maths/labs/storm/StormRun'

export const metadata: Metadata = {
  title: 'Storm Run | Revily lab',
  description: 'Prototype chapter: map scales and speed, distance and time, racing a closing storm.',
}

export default function StormLabPage() {
  return <div className="lab-page"><StormRun /></div>
}
