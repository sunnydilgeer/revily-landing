import { useState } from 'react'
import { NumberDisplay, PlaceValueVisual } from '../variant-b/PlaceValueVisuals'
import { StackedWorkedExample } from '../../order-of-operations/variant-c/StackedWorkedExample'
import { LessonVideo } from '../../order-of-operations/variant-c/TutorTeachingMedia'
import type { TutorPlaceState } from './placeValueLesson'

function TeachingVisual({ visual }: { visual: TutorPlaceState['visual'] }) {
  if (visual.kind !== 'cumulative') return <div className="pvb-stage"><PlaceValueVisual visual={visual} /></div>
  return <div className="pvb-stage pvt-working">
    {visual.value && <NumberDisplay value={visual.value} highlights={visual.highlights} />}
    <StackedWorkedExample visual={visual.calculation} />
  </div>
}
export function PlaceValueTeachingMedia({ state }: { state: TutorPlaceState }) {
  const [mode, setMode] = useState<'video' | 'working'>('video')
  if (!state.video) return <TeachingVisual visual={state.visual} />
  const prefix = state.video.id
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
    <div role="tabpanel" id={`${prefix}-video-panel`} aria-labelledby={`${prefix}-video-tab`} hidden={mode !== 'video'}><LessonVideo video={state.video} active={mode === 'video'} onShowWorking={() => setMode('working')} /></div>
    <div role="tabpanel" id={`${prefix}-working-panel`} aria-labelledby={`${prefix}-working-tab`} hidden={mode !== 'working'}><TeachingVisual visual={state.visual} /></div>
  </div>
}
