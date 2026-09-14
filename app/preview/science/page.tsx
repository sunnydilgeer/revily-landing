import type { Metadata } from 'next'
import ScienceLessonPreview from '../../../src/features/science/ScienceLessonPreview'
import ScienceLessonHub from '../../../src/features/science/ScienceLessonHub'
import { parseScienceLesson } from '../../../src/features/science/lessonNavigation'

export const metadata: Metadata = {
  title: 'Science lessons | Revily',
  description: 'Explore cell biology, microscopy and practical skills with Revily Science.',
}

export default async function SciencePreviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[] }> }) {
  const number = parseScienceLesson((await searchParams).lesson)
  return number ? <ScienceLessonPreview lessonNumber={number} key={`science-lesson-${number}`} /> : <ScienceLessonHub />
}
