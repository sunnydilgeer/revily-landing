import type { Metadata } from 'next'
import RiverRescue from '../../../../src/features/science/labs/river/RiverRescue'

export const metadata: Metadata = {
  title: 'River Rescue | Revily Science Arcade',
  description: 'Trace what’s poisoning a river and make it safe to drink: formulations, chromatography and Rf, pH and neutralisation, water treatment and the water purification practical.',
}

export default function RiverRescueLabPage() {
  return <div className="lab-page"><RiverRescue /></div>
}
