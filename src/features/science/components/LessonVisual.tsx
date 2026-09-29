import { ArrowRight, BookOpen } from 'lucide-react'
import type { ScienceState } from '../types'
import { CellModel } from './CellModel'
import { AreaModel } from './OtherCellModels'
import { MicroscopyVisual } from './MicroscopyVisuals'
import { PracticalVisual } from './PracticalVisuals'
import { CellBiologyVisual } from './CellBiologyVisuals'

/** The picture for a question or plain teaching screen, if it has one. */
export function LessonVisual({ state, feedbackVisible }: { state: ScienceState; feedbackVisible: boolean }) {
  if (/^(?:B(?:[4-9]|[1-9]\d)|[CP]\d+)-/.test(state.id) && state.visual) return <CellBiologyVisual focus={state.visual.id} assessment={!feedbackVisible} />
  if (state.id === 'B3-01') return <PracticalVisual focus="onion" />
  if (state.id === 'B3-17') return <PracticalVisual focus="drawing-choice" />
  if (state.id === 'B2-01') return <MicroscopyVisual focus="light" />
  if (state.id === 'B1-01') return <div className="science-visual-panel science-visual-panel--opening"><CellModel description="A simplified model of a typical animal cell, not to scale. Colours distinguish structures; this is not a photograph." /></div>
  if (state.visual?.kind === 'cellModel') {
    const target = state.id === 'B1-03' || state.id === 'B1-20'
    return <div className="science-visual-panel"><CellModel pointer={target} alternate={state.visual.id === 'animal-cell-b'} labelled={!target || feedbackVisible} highlight={state.id === 'B1-09' ? 'nucleus' : undefined} description={target && !feedbackVisible ? state.visual.assessmentDescription : state.visual.accessibleDescription} /></div>
  }
  if (state.id === 'B1-10' || state.id === 'B1-11') return <div className="science-observation"><div className="science-observation__label"><BookOpen size={17} aria-hidden="true" /> An observation record</div><p>“In this prepared stained animal-cell view, a nucleus and cell outline were visible; tiny internal structures were not distinguished.”</p><span>Illustrative scenario · not a real micrograph</span></div>
  if (state.id === 'B1-06') return <div className="science-function-visual"><span>Structure</span><ArrowRight size={18} aria-hidden="true" /><span>Process</span><ArrowRight size={18} aria-hidden="true" /><span>Function</span></div>
  if (state.id === 'B1-35') return <AreaModel length={6} width={2} />
  if (state.id === 'B1-21') return <div className="science-context"><span className="science-eyebrow">Compare two structures</span><p>Animal cell <ArrowRight size={16} aria-hidden="true" /> Bacterial cell</p></div>
  return null
}
