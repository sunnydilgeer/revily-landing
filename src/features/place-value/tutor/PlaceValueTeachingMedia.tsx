import { useState } from 'react'
import { NumberDisplay, PlaceValueVisual } from './PlaceValueVisuals'
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
/** The working comes first; the video is one tap away (same pattern as every other lesson). */
export function PlaceValueTeachingMedia({ state }: { state: TutorPlaceState }) {
  const [watching, setWatching] = useState(false)
  if (!state.video) return <TeachingVisual visual={state.visual} />
  const panel = `${state.video.id}-video-panel`
  return <div className="opc-teaching-media rung-media">
    {watching
      ? <div id={panel}><LessonVideo video={state.video} active onShowWorking={() => setWatching(false)} /></div>
      : <TeachingVisual visual={state.visual} />}
    <button type="button" className="rung-media__toggle" aria-expanded={watching} aria-controls={watching ? panel : undefined} onClick={() => setWatching(!watching)}>
      {watching ? <>Back to the step-by-step working</> : <><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>Watch the video ({Math.round(state.video.durationSeconds)} sec)</>}
    </button>
  </div>
}
