import type { Metadata } from 'next'
import ExamRevisionPreview from '../../../src/features/science/revision-b/ExamRevisionPreview'

export const metadata: Metadata = { title: 'Science Revision · Cells | Revily', description: 'Lesson 1 only: concise Cells revision cards mapped to AQA Trilogy Foundation, with original exam-style practice and transparent source-review status.' }
export default async function ScienceRevisionPage({ searchParams }: { searchParams: Promise<{ view?: string | string[]; card?: string | string[]; task?: string | string[]; filter?: string | string[] }> }) {
  const params = await searchParams
  const view = params.view === 'cards' || params.view === 'practice' || params.view === 'alignment' ? params.view : 'home'
  const card = typeof params.card === 'string' ? params.card : undefined
  const task = typeof params.task === 'string' ? params.task : undefined
  return <ExamRevisionPreview view={view} initialCard={card} initialTask={task} initialReviewOnly={params.filter === 'again'} key={`${view}-${card || ''}-${task || ''}-${params.filter || ''}`} />
}
