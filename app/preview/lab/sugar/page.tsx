import type { Metadata } from 'next'
import SugarRush from '../../../../src/features/science/labs/sugar/SugarRush'

export const metadata: Metadata = {
  title: 'Sugar Rush | Revily Science Arcade',
  description: 'Run an NHS diabetes and reflex clinic: nerve impulse speed, blood glucose and insulin, type 1 and type 2 diabetes, hormones and the reaction time practical.',
}

export default function SugarLabPage() {
  return <div className="lab-page"><SugarRush /></div>
}
