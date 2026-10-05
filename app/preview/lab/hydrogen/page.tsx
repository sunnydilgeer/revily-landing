import type { Metadata } from 'next'
import HydrogenLab from '../../../../src/features/science/labs/hydrogen/HydrogenLab'

export const metadata: Metadata = {
  title: 'Green Hydrogen Lab | Revily Science Arcade',
  description: 'Run a wind-powered hydrogen plant for a Net Zero town: relative formula mass, balancing equations, electrolysis of water, rates of reaction and the rates required practical.',
}

export default function HydrogenLabPage() {
  return <div className="lab-page"><HydrogenLab /></div>
}
