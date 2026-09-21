import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { LessonVideoDefinition, TutorOperationsVisualDefinition } from './variantCLesson'
import { TutorOperationsVisual } from './TutorOperationsVisual'

export function TutorTeachingMedia({ visual, video, onConsultRule }: {
  visual: TutorOperationsVisualDefinition
  video?: LessonVideoDefinition
  onConsultRule?: () => void
}) {
  const [mode, setMode] = useState<'video' | 'working'>('video')
  if (!video) return <TutorOperationsVisual visual={visual} onConsultRule={onConsultRule} />
  const prefix = `lesson-video-${video.id}`
  return <div className="opc-teaching-media">
    <div className="opc-media-tabs" role="tablist" aria-label="Choose how to learn this example" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const next = event.key === 'Home' ? 'video' : event.key === 'End' ? 'working' : mode === 'video' ? 'working' : 'video'
      setMode(next)
      event.currentTarget.querySelector<HTMLButtonElement>(`#${prefix}-${next}-tab`)?.focus()
    }}>
      <button type="button" role="tab" id={`${prefix}-video-tab`} tabIndex={mode === 'video' ? 0 : -1} aria-selected={mode === 'video'} aria-controls={`${prefix}-video-panel`} onClick={() => setMode('video')}>Watch video</button>
      <button type="button" role="tab" id={`${prefix}-working-tab`} tabIndex={mode === 'working' ? 0 : -1} aria-selected={mode === 'working'} aria-controls={`${prefix}-working-panel`} onClick={() => setMode('working')}>Step by step</button>
    </div>
    <div role="tabpanel" id={`${prefix}-video-panel`} aria-labelledby={`${prefix}-video-tab`} hidden={mode !== 'video'}>
      <LessonVideo video={video} active={mode === 'video'} onShowWorking={() => setMode('working')} />
    </div>
    <div role="tabpanel" id={`${prefix}-working-panel`} aria-labelledby={`${prefix}-working-tab`} hidden={mode !== 'working'}>
      <TutorOperationsVisual visual={visual} onConsultRule={onConsultRule} />
    </div>
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
