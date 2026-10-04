import type { Metadata } from 'next'
import GridBoss from '../../../../src/features/science/labs/grid/GridBoss'

export const metadata: Metadata = {
  title: 'Grid Boss | Revily Science Arcade',
  description: 'Keep the National Grid alive through the 6pm kettle surge: power, efficiency, energy stores, the grid mix and the specific heat capacity practical.',
}

export default function GridBossLabPage() {
  return <div className="lab-page"><GridBoss /></div>
}
