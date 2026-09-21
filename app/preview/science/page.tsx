import type { Metadata } from 'next'
import ScienceLessonPreview from '../../../src/features/science/ScienceLessonPreview'
import ScienceLessonHub from '../../../src/features/science/ScienceLessonHub'
import { getScienceLessons, parseScienceLesson, parseScienceVariant } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore six Cell Biology lessons: cells, microscopy, specialisation, division, transport and practical data skills.',
}

export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[]; variant?: string | string[]; activity?: string | string[] }> }) {
  const params = await searchParams
  const number = parseScienceLesson(params.lesson)
  const variant = parseScienceVariant(params.variant)
  const activity = typeof params.activity === 'string' ? params.activity : undefined
  const available = number && getScienceLessons(variant).some(item => item.number === number)
  return available ? <ScienceLessonPreview lessonNumber={number} variant={variant} initialActivity={activity} key={`science-lesson-${number}-${variant}-${activity || ''}`} /> : <ScienceLessonHub variant={variant} key={`science-hub-${variant}`} />
}
