'use client'

import '../../App.css'
import '../maths/MathsNavigation.css'
import { RevilyLogo } from '../../ui'
import TutorMethodLessonView from '../written-methods/tutor/TutorMethodLessonView'
import { tutorCoordinatesLesson } from './tutor/coordinatesLesson'

/*
 * Graphs lesson 1, Coordinates, on its own for review before it joins the course. Nothing links here: the lesson isn't
 * in the course registry, so the curriculum, contents, search, cards and practice don't know it exists. The page sits
 * behind the preview password (middleware.ts) and is noindexed.
 */
export default function CoordinatesPreview() {
  return <div className="app-shell app-shell--lesson app-shell--study">
    <header className="site-header">
      <RevilyLogo wordmark={false} size={24} href="/preview" />
      <nav className="maths-breadcrumbs" aria-label="Breadcrumb">
        <span className="maths-breadcrumb-number" aria-current="page">Graphs 1: Coordinates (preview)</span>
      </nav>
    </header>
    <main className="lesson-preview" id="main-content"><TutorMethodLessonView lesson={tutorCoordinatesLesson} /></main>
  </div>
}
