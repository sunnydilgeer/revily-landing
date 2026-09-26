import { redirect } from 'next/navigation'
import { scienceLessonHrefById } from '../../../../src/features/science/lessonNavigation'
export default function MicroscopyPracticalPage() {
  redirect(scienceLessonHrefById('B-CELL-003-B'))
}
