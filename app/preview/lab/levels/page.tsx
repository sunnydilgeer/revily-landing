import type { Metadata } from 'next'
import LevelUp from '../../../../src/features/maths/labs/levels/LevelUp'

export const metadata: Metadata = {
  title: 'Level Up | Revily lab',
  description: 'Prototype chapter: linear sequences and the nth term, by cracking the XP pattern in a retro RPG.',
}

export default function LevelsLabPage() {
  return <div className="lab-page"><LevelUp /></div>
}
