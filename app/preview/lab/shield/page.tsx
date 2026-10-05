import type { Metadata } from 'next'
import SkyShield from '../../../../src/features/science/labs/shield/SkyShield'

export const metadata: Metadata = {
  title: 'Sky Shield | Revily Science Arcade',
  description: 'Build, power and fly the defence drones that net rogue drones over a UK airport: weight and thrust, P = V × I, v = f × λ, echoes, kinetic energy and the ripple-tank practical.',
}

export default function SkyShieldLabPage() {
  return <div className="lab-page"><SkyShield /></div>
}
