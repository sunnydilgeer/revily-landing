import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ScienceLessonPreview from '../../../src/features/science/ScienceLessonPreview'
import StudyTimer from '../../../src/features/maths/StudyTimer'
import { getScienceLessons, parseScienceLesson, parseScienceVariant } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore interactive Cell Biology and Organisation lessons, from cells and enzymes to circulation, health and cancer.',
}

// The Science home now lives in the app (/preview?subject=science); this route only plays lessons.
export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[]; variant?: string | string[]; activity?: string | string[] }> }) {
  const params = await searchParams
  const number = parseScienceLesson(params.lesson)
  const variant = parseScienceVariant(params.variant)
  const activity = typeof params.activity === 'string' ? params.activity : undefined
  const available = number && getScienceLessons(variant).some(item => item.number === number)
  if (!number || !available) redirect('/preview?subject=science')
  return <>
    <StudyTimer subject="science" />
    <ScienceLessonPreview lessonNumber={number} variant={variant} initialActivity={activity} key={`science-lesson-${number}-${variant}-${activity || ''}`} />
  </>
}
