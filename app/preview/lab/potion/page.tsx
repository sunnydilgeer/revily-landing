import type { Metadata } from 'next'
import PotionLab from '../../../../src/features/maths/labs/potion/PotionLab'

export const metadata: Metadata = {
  title: 'Potion Lab | Revily lab',
  description: 'Prototype chapter: scaling ratios by brewing potions, where the same ratio makes the same colour.',
}

export default function PotionLabPage() {
  return <div className="lab-page"><PotionLab /></div>
}
