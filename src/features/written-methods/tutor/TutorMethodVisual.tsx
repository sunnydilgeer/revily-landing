'use client'

import { MethodWorkedExample } from './MethodWorkedExample'
import { useState } from 'react'
import { MethodVisual } from '../MethodVisual'
import { LessonVideo } from '../../order-of-operations/variant-c/TutorTeachingMedia'
import type { TutorMethodState, TutorMethodVisual as Visual } from './model'

function Grid({ first, second }: { first: number[]; second: number[] }) {
  return <table className="wmt-grid" aria-label="Multiplication grid"><thead><tr><th scope="col">×</th>{second.map(n => <th scope="col" key={n}>{n}</th>)}</tr></thead><tbody>{first.map(n => <tr key={n}><th scope="row">{n}</th>{second.map(m => <td key={m}>{n} × {m}</td>)}</tr>)}</tbody></table>
}

function TeachingVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'method-worked') return <div className="pvb-stage"><MethodWorkedExample visual={visual} /></div>
  if (visual.kind === 'grid') return <div className="pvb-stage"><Grid {...visual} /></div>
  return <div className="pvb-stage"><MethodVisual visual={visual.kind === 'diagram' ? visual.diagram : visual} /></div>
}

export function TutorMethodMedia({ state }: { state: TutorMethodState }) {
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
