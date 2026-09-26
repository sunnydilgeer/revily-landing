import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ScienceLessonPreview from '../../../src/features/science/ScienceLessonPreview'
import ScienceLesson from '../../../src/features/science/ScienceLesson'
import StudyTimer from '../../../src/features/maths/StudyTimer'
import { parseScienceLesson } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore interactive Cell Biology and Organisation lessons, from cells and enzymes to circulation, health and cancer.',
}

// Pilot: these lessons use the new lesson frame; the rest keep the original player until signed off.
const RESKINNED = new Set<number>([1, 2, 3])

// The Science home lives in the app (/preview?subject=science); this route only plays lessons.
// Old links with ?variant= still work: the parameter is ignored.
export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[]; activity?: string | string[] }> }) {
  const params = await searchParams
  const number = parseScienceLesson(params.lesson)
  const activity = typeof params.activity === 'string' ? params.activity : undefined
  if (!number) redirect('/preview?subject=science')
  return <>
    <StudyTimer subject="science" />
    {RESKINNED.has(number)
      ? <ScienceLesson lessonNumber={number} initialActivity={activity} key={`science-lesson-${number}-${activity || ''}`} />
      : <ScienceLessonPreview lessonNumber={number} initialActivity={activity} key={`science-lesson-${number}-${activity || ''}`} />}
  </>
}
