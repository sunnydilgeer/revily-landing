import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { LessonVideoDefinition, TutorOperationsVisualDefinition } from './variantCLesson'
import { TutorOperationsVisual } from './TutorOperationsVisual'

export function TutorTeachingMedia({ visual, video, onConsultRule }: {
  visual: TutorOperationsVisualDefinition
  video?: LessonVideoDefinition
  onConsultRule?: () => void
}) {
  const [watching, setWatching] = useState(false)
  if (!video) return <TutorOperationsVisual visual={visual} onConsultRule={onConsultRule} />
  const panel = `lesson-video-${video.id}-panel`
  // The working comes first; the video is one tap away (same pattern as lessons 4 to 11).
  return <div className="opc-teaching-media rung-media">
    {watching
      ? <div id={panel}><LessonVideo video={video} active onShowWorking={() => setWatching(false)} /></div>
      : <TutorOperationsVisual visual={visual} onConsultRule={onConsultRule} />}
    <button type="button" className="rung-media__toggle" aria-expanded={watching} aria-controls={watching ? panel : undefined} onClick={() => setWatching(!watching)}>
      {watching ? <>Back to the step-by-step working</> : <><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>Watch the video ({Math.round(video.durationSeconds)} sec)</>}
    </button>
  </div>
}

export function LessonVideo({ video, active, onShowWorking }: { video: LessonVideoDefinition; active: boolean; onShowWorking: () => void }) {
  const player = useRef<HTMLVideoElement>(null)
  const [watched, setWatched] = useState(false)
  const [failed, setFailed] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [playbackNotice, setPlaybackNotice] = useState('')
  useEffect(() => { if (!active) player.current?.pause() }, [active])
  useEffect(() => {
    const element = player.current
    return () => { element?.pause() }
  }, [])
  const replay = async () => {
    const element = player.current
    if (!element) return
    element.currentTime = 0
    setPlaybackNotice('')
    try { await element.play() } catch { setPlaybackNotice('Use the play control on the video to begin.') }
  }
  return <figure className="opc-video-stage" aria-label={video.title}>
    <figcaption className="opc-video-heading"><span>Watch an example</span><span>{Math.ceil(video.durationSeconds)} sec</span></figcaption>
    <video ref={player} controls playsInline preload="metadata" poster={video.poster} aria-label={video.title} onEnded={() => setWatched(true)} onError={() => setFailed(true)}>
      <source src={video.src} type="video/mp4" onError={() => setFailed(true)} />
      Your browser cannot play this clip. Use Step by step.
    </video>
    <div className="opc-video-tools">
      <button type="button" onClick={replay} disabled={failed} aria-label="Replay video"><RotateCcw size={16} aria-hidden="true" /> Replay</button>
      <label>Speed <select aria-label="Video playback speed" value={speed} onChange={event => {
        const value = Number(event.target.value)
        setSpeed(value)
        if (player.current) player.current.playbackRate = value
      }}>{[0.75, 1, 1.25, 1.5, 2].map(value => <option key={value} value={value}>{value}×</option>)}</select></label>
      {watched && <span className="opc-video-watched" role="status">Watched ✓</span>}
    </div>
    {playbackNotice && <p role="status" className="opc-video-note">{playbackNotice}</p>}
    {failed && <div className="opc-video-error" role="alert"><p>The video could not load. You can still learn this example.</p><button type="button" onClick={onShowWorking}>Use step-by-step working</button></div>}
  </figure>
}
