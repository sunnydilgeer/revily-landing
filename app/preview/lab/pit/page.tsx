import type { Metadata } from 'next'
import PitCrew from '../../../../src/features/science/labs/pit/PitCrew'

export const metadata: Metadata = {
  title: 'Pit Crew | Revily Science Arcade',
  description: 'Tune a self-driving electric car so it stops before the zebra crossing: speed, stopping distance, resultant force, F = m a, acceleration, weight and the acceleration practical.',
}

export default function PitCrewLabPage() {
  return <div className="lab-page"><PitCrew /></div>
}
