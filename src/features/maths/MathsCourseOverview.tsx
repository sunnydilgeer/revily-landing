import { mathsChapters, mathsLessons, type MathsLessonNumber } from './courseRegistry'
import { lessonPercent, type LessonProgressMap } from './lessonProgress'

type Props = {
  progress: LessonProgressMap
  lastLesson: MathsLessonNumber
  onOpenLesson: (lesson: MathsLessonNumber) => void
}

function actionLabel(snapshot: LessonProgressMap[string] | undefined) {
  if (snapshot?.completed) return 'Review'
  return snapshot ? 'Resume' : 'Start'
}

export default function MathsCourseOverview({ progress, lastLesson, onOpenLesson }: Props) {
  const lastEntry = mathsLessons.find(entry => entry.number === lastLesson) ?? mathsLessons[0]
  const nextIncomplete = mathsLessons.find(entry => !progress[entry.lessonId]?.completed)
  const continueEntry = progress[lastEntry.lessonId] && !progress[lastEntry.lessonId].completed
    ? lastEntry
    : nextIncomplete ?? lastEntry
  const continueSnapshot = progress[continueEntry.lessonId]

  return <main className="maths-course" id="main-content">
    <section className="maths-course-intro" aria-labelledby="maths-course-title">
      <p className="maths-course-kicker">GCSE Foundation</p>
      <h1 id="maths-course-title">Maths</h1>
      <p>Build each skill through clear teaching, guided examples and independent practice.</p>
    </section>

    <section className="continue-learning-card" aria-labelledby="continue-learning-title">
      <div className="continue-learning-copy">
        <span className="continue-learning-label">Continue learning</span>
        <h2 id="continue-learning-title">Lesson {continueEntry.number}: {continueEntry.title}</h2>
        <p>{continueEntry.description}</p>
        {continueSnapshot && <div className="lesson-progress-summary">
          <span>{lessonPercent(continueSnapshot)}% complete</span>
          <span>{continueSnapshot.completed ? 'Lesson complete' : 'Progress saved'}</span>
        </div>}
      </div>
      <button className="maths-primary-action" type="button" onClick={() => onOpenLesson(continueEntry.number)}>
        {continueSnapshot?.completed ? 'Review lesson' : continueSnapshot ? 'Continue lesson' : 'Start lesson'}
      </button>
    </section>

    <div className="maths-course-layout">
      <div className="maths-chapter-list">
        {mathsChapters.map(chapter => <section className="maths-chapter" key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
          <header className="maths-chapter-header">
            <div>
              <p>Chapter 1</p>
              <h2 id={`chapter-${chapter.id}`}>{chapter.title}</h2>
            </div>
            <span>{chapter.lessons.length} lessons</span>
          </header>
          <p className="maths-chapter-description">{chapter.description}</p>
          <ol className="maths-lesson-list">
            {chapter.lessons.map(entry => {
              const snapshot = progress[entry.lessonId]
              const percent = lessonPercent(snapshot)
              return <li className="maths-lesson-row" key={entry.lessonId}>
                <span className={`maths-lesson-marker${snapshot?.completed ? ' is-complete' : ''}`} aria-label={snapshot?.completed ? 'Completed' : `Lesson ${entry.number}`}>
                  {snapshot?.completed ? '✓' : entry.number}
                </span>
                <div className="maths-lesson-copy">
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
                {snapshot && <span className="maths-row-progress" aria-label={`${percent}% complete`}>{percent}%</span>}
                <button className="maths-row-action" type="button" onClick={() => onOpenLesson(entry.number)}>
                  {actionLabel(snapshot)}
                </button>
              </li>
            })}
          </ol>
        </section>)}
      </div>

      <aside className="maths-course-preferences" aria-label="Course preferences">
        <details>
          <summary>Preferences</summary>
          <div>
            <p><strong>Lesson wording</strong><span>Final classroom version</span></p>
            <p><strong>Course level</strong><span>GCSE Foundation</span></p>
          </div>
        </details>
        <p className="maths-course-note">Lessons follow the current course order. Your latest position is saved on this device.</p>
      </aside>
    </div>
  </main>
}
