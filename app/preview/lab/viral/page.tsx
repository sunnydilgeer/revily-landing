import type { Metadata } from 'next'
import GoingViral from '../../../../src/features/maths/labs/viral/GoingViral'

export const metadata: Metadata = {
  title: 'Going Viral | Revily lab',
  description: 'Prototype chapter: bar charts, pie charts and misleading graphs, by charting an influencer’s stats for a brand pitch.',
}

export default function ViralLabPage() {
  return <div className="lab-page"><GoingViral /></div>
}
