import type { Metadata } from 'next'
import RigTheStats from '../../../../src/features/maths/labs/stats/RigTheStats'

export const metadata: Metadata = {
  title: 'Rig the Stats | Revily lab',
  description: 'Prototype chapter: mean, median, mode and range by working out (and rigging) a mate’s screen-time chart.',
}

export default function StatsLabPage() {
  return <div className="lab-page"><RigTheStats /></div>
}
