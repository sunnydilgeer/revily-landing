import Link from 'next/link'
import { scienceHubHref, scienceLessonHref, type LessonNumber, type ScienceVariant } from '../lessonNavigation'

export function ScienceVariantSwitch({ variant, lessonNumber, activity }: { variant: ScienceVariant; lessonNumber?: LessonNumber; activity?: string | null }) {
  if (lessonNumber && lessonNumber >= 7) return <div className="science-variant-bar"><nav aria-label="Lesson wording" className="science-variant-switch"><span aria-current="page">Easier wording · only version</span></nav><p>Lessons 7–25 were authored once in the clearer wording style. There is no baseline copy.</p></div>
  return <div className="science-variant-bar">
    <nav aria-label="Compare lesson wording" className="science-variant-switch">
      {(['a', 'b'] as const).map(value => <Link key={value}
        href={lessonNumber ? scienceLessonHref(lessonNumber, value, activity) : scienceHubHref(value)}
        aria-current={variant === value ? 'page' : undefined}>
        {value === 'a' ? 'A · Current wording' : 'B · Easier wording'}
      </Link>)}
    </nav>
    <p>Lessons 1–6 have both wording choices and separate progress. Lessons 7–25 use easier wording only.</p>
  </div>
}
