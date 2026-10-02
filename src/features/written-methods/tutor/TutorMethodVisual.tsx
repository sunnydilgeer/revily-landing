'use client'

import { MethodWorkedExample } from './MethodWorkedExample'
import { StepWorkedExample } from './StepWorkedExample'
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
  if (visual.kind === 'step-worked') return <div className="pvb-stage"><StepWorkedExample working={visual} /></div>
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
 * A second video (`video2`) shows another way of doing the same example: it gets its own "Video 2" button.
 */
export function TutorMethodMedia({ state }: { state: TutorMethodState }) {
  const [watching, setWatching] = useState<0 | 1 | 2>(0)
  if (!state.video) return <TeachingVisual visual={state.visual} />
  const videos = [state.video, ...(state.video2 ? [state.video2] : [])]
  const playing = watching ? videos[watching - 1] : undefined
  const panel = playing && `${playing.id}-video-panel`
  const button = (video: typeof state.video, n: 1 | 2) => <button key={n} type="button" className="rung-media__toggle" aria-expanded={false} aria-label={`Watch ${n === 2 ? 'video 2, another way to do it' : 'the video'}${video.durationSeconds ? `, ${Math.round(video.durationSeconds)} seconds` : ''}`} onClick={() => setWatching(n)}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>{n === 2 ? 'Video 2' : 'Video'}{video.durationSeconds ? <span className="rung-media__time">{clock(video.durationSeconds)}</span> : ''}
  </button>
  return <div className="opc-teaching-media rung-media">
    {playing
      ? <div id={panel}><LessonVideo key={playing.id} video={playing} active onShowWorking={() => setWatching(0)} /></div>
      : <TeachingVisual visual={state.visual} />}
    {playing
      ? <button type="button" className="rung-media__toggle" aria-expanded aria-controls={panel} onClick={() => setWatching(0)}>Back to the working</button>
      : <div className="rung-media__videos">{videos.map((video, i) => button(video, (i + 1) as 1 | 2))}</div>}
    {!playing && state.video2 && <p className="rung-media__note">Video 2 shows another way to do it.</p>}
  </div>
}
