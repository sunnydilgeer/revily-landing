import type { Metadata } from 'next'
import MindReader from '../../../../src/features/maths/labs/mind/MindReader'

export const metadata: Metadata = {
  title: 'Mind Reader | Revily lab',
  description: 'Prototype chapter: algebraic expressions, by cracking a think-of-a-number trick with n.',
}

export default function MindLabPage() {
  return <div className="lab-page"><MindReader /></div>
}
