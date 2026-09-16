'use client'

import { useRef, useState, type Ref } from 'react'
import type { LessonVideoDefinition } from '../types'

export function LessonVideoActivity({ clip, headingRef, canGoBack, onBack, onContinue }: {
  clip: LessonVideoDefinition['props']
  headingRef: Ref<HTMLHeadingElement>
  canGoBack: boolean
  onBack: () => void
  onContinue: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [speed, setSpeed] = useState('1')

  function replay() {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }

  return <div className="lesson-video-activity">
    <h3 ref={headingRef} tabIndex={-1} className="sr-only">{clip.title}</h3>
    <video
      ref={videoRef}
      className="lesson-video"
      controls
      playsInline
      preload="metadata"
      poster={clip.poster}
      width={clip.width}
      height={clip.height}
      aria-label={clip.title}
      onEnded={() => setEnded(true)}
      onPlay={() => setEnded(false)}
      onError={() => setFailed(true)}
    >
      <source src={clip.src} type="video/mp4" />
      {clip.captions && <track kind="captions" src={clip.captions} srcLang="en" label="English" default />}
      Your browser does not support this video. You can read the summary below and continue.
    </video>
    <div className="lesson-video-toolbar">
      <span>Ani’s explanation · {clip.durationLabel}</span>
      <label>Speed <select value={speed} onChange={event => {
        setSpeed(event.target.value)
        if (videoRef.current) videoRef.current.playbackRate = Number(event.target.value)
      }}>
        <option value="0.75">0.75×</option>
        <option value="1">1×</option>
        <option value="1.25">1.25×</option>
        <option value="1.5">1.5×</option>
        <option value="2">2×</option>
      </select></label>
    </div>
    {clip.clarification && <p className="lesson-video-clarification">{clip.clarification}</p>}
    {failed && <p className="lesson-video-error" role="status">The video couldn’t load. Read the summary or continue to the activity.</p>}
    <details className="lesson-video-summary">
      <summary>Read summary</summary>
      <ul>{clip.summary.map(line => <li key={line}>{line}</li>)}</ul>
    </details>
    <div className="lesson-state__actions">
      {canGoBack && <button className="lesson-secondary-action" type="button" onClick={onBack}>← Back</button>}
      {ended && <button className="lesson-secondary-action" type="button" onClick={replay}>Replay</button>}
      <button className="lesson-primary-action" type="button" onClick={onContinue}>Continue <span aria-hidden="true">→</span></button>
    </div>
  </div>
}
