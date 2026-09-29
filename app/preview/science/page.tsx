import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ScienceLesson from '../../../src/features/science/ScienceLesson'
import StudyTimer from '../../../src/features/maths/StudyTimer'
import { parseScienceLessonRef } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore interactive Cell Biology and Organisation lessons, from cells and enzymes to circulation, health and cancer.',
}

// The Science home lives in the app (/preview?subject=science); this route only plays lessons.
// Old links with ?variant= still work: the parameter is ignored.
// Biology: ?lesson=N (unchanged). Other subjects: ?subject=chemistry&lesson=N (numbered from 1 per subject).
export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ subject?: string | string[]; lesson?: string | string[]; activity?: string | string[] }> }) {
  const params = await searchParams
  const ref = parseScienceLessonRef(params.subject, params.lesson)
  const activity = typeof params.activity === 'string' ? params.activity : undefined
  if (!ref) redirect('/preview?subject=science')
  return <>
    <StudyTimer subject="science" />
    <ScienceLesson subject={ref.subject} lessonNumber={ref.number} initialActivity={activity} key={`science-lesson-${ref.subject}-${ref.number}-${activity || ''}`} />
  </>
}
