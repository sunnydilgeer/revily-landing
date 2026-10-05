import type { Metadata } from 'next'
import Rewild from '../../../../src/features/science/labs/rewild/Rewild'

export const metadata: Metadata = {
  title: 'Rewild | Revily Science Arcade',
  description: 'Bring beavers back to a British valley: quadrats, population estimates, transects, predator–prey cycles, biodiversity and the field investigation practical.',
}

export default function RewildLabPage() {
  return <div className="lab-page"><Rewild /></div>
}
