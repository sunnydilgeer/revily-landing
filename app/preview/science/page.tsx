import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ScienceLesson from '../../../src/features/science/ScienceLesson'
import StudyTimer from '../../../src/features/maths/StudyTimer'
import { parseScienceLesson } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore interactive Cell Biology and Organisation lessons, from cells and enzymes to circulation, health and cancer.',
}

// The Science home lives in the app (/preview?subject=science); this route only plays lessons.
// Old links with ?variant= still work: the parameter is ignored.
export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[]; activity?: string | string[] }> }) {
  const params = await searchParams
  const number = parseScienceLesson(params.lesson)
  const activity = typeof params.activity === 'string' ? params.activity : undefined
  if (!number) redirect('/preview?subject=science')
  return <>
    <StudyTimer subject="science" />
    <ScienceLesson lessonNumber={number} initialActivity={activity} key={`science-lesson-${number}-${activity || ''}`} />
  </>
}
