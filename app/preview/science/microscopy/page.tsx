import { redirect } from 'next/navigation'
import { scienceLessonHrefById } from '../../../../src/features/science/lessonNavigation'

export default function MicroscopyPreviewPage() {
  redirect(scienceLessonHrefById('B-CELL-002-B'))
}
