'use client'

import { MethodWorkedExample } from './MethodWorkedExample'
import { FractionWorkedExample } from '../../fractions/tutor/FractionWorkedExample'
import { ConversionWorkedExample } from '../../fractions-decimals-percentages/tutor/ConversionWorkedExample'
import { useState } from 'react'
import { MethodVisual } from '../MethodVisual'
import { LessonVideo } from '../../order-of-operations/variant-c/TutorTeachingMedia'
import type { TutorMethodState, TutorMethodVisual as Visual } from './model'

function Grid({ first, second }: { first: number[]; second: number[] }) {
  return <table className="wmt-grid" aria-label="Multiplication grid"><thead><tr><th scope="col">×</th>{second.map(n => <th scope="col" key={n}>{n}</th>)}</tr></thead><tbody>{first.map(n => <tr key={n}><th scope="row">{n}</th>{second.map(m => <td key={m}>{n} × {m}</td>)}</tr>)}</tbody></table>
}

export function TeachingVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'method-worked') return <div className="pvb-stage"><MethodWorkedExample visual={visual} /></div>
  if (visual.kind === 'fraction-worked') return <div className="pvb-stage"><FractionWorkedExample visual={visual} /></div>
  if (visual.kind === 'conversion-worked') return <div className="pvb-stage"><ConversionWorkedExample visual={visual} /></div>
  if (visual.kind === 'grid') return <div className="pvb-stage"><Grid {...visual} /></div>
  return <div className="pvb-stage"><MethodVisual visual={visual.kind === 'diagram' ? visual.diagram : visual} /></div>
}

/** 47 → "0:47", 70 → "1:10". */
const clock = (seconds: number) => `${Math.floor(Math.round(seconds) / 60)}:${String(Math.round(seconds) % 60).padStart(2, '0')}`

/**
 * Teaching media for one worked example. The step-by-step working is shown first; the video is
 * one tap away for students who would rather watch. (Previously the video was the default tab.)
 */
export function TutorMethodMedia({ state }: { state: TutorMethodState }) {
  const [watching, setWatching] = useState(false)
  if (!state.video) return <TeachingVisual visual={state.visual} />
  const panel = `${state.video.id}-video-panel`
  return <div className="opc-teaching-media rung-media">
    {watching
      ? <div id={panel}><LessonVideo video={state.video} active onShowWorking={() => setWatching(false)} /></div>
      : <TeachingVisual visual={state.visual} />}
    <button type="button" className="rung-media__toggle" aria-expanded={watching} aria-controls={watching ? panel : undefined} aria-label={watching ? undefined : `Watch the video${state.video.durationSeconds ? `, ${Math.round(state.video.durationSeconds)} seconds` : ''}`} onClick={() => setWatching(!watching)}>
      {watching
        ? <>Back to the working</>
        : <><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>Video{state.video.durationSeconds ? <span className="rung-media__time">{clock(state.video.durationSeconds)}</span> : ''}</>}
    </button>
  </div>
}
