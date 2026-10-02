import type { Metadata } from 'next'
import BaseBuilder from '../../../../src/features/maths/labs/build/BaseBuilder'

export const metadata: Metadata = {
  title: 'Base Builder | Revily lab',
  description: 'Prototype chapter: perimeter and area of rectangles and L-shapes, building a base before the zombies come out.',
}

export default function BuildLabPage() {
  return <div className="lab-page"><BaseBuilder /></div>
}
