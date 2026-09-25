import { useState, type RefObject } from 'react'
import { RotateCcw } from 'lucide-react'
import type { TeachingState } from '../types'
import { teachingFrames, plantPartIds, type TeachingFrame } from '../lesson-1/teachingFrames'
import { CellModel, cellParts } from './CellModel'
import { AreaModel, BacterialCellModel, PlantCellModel, SizeReference } from './OtherCellModels'
import { MicroscopyVisual } from './MicroscopyVisuals'
import { PracticalVisual } from './PracticalVisuals'
import { CellBiologyVisual } from './CellBiologyVisuals'

export function CellComparison({ differences = false }: { differences?: boolean }) {
  return <div className="science-cell-comparison">
    <div className="science-cell-comparison__diagrams"><CellModel /><PlantCellModel labelled={false} /></div>
    <div className="science-cell-comparison__note">{differences
      ? <><strong>In this plant example</strong><p>Cellulose cell wall · permanent vacuole containing cell sap · chloroplasts for photosynthesis</p><p>Animal cells have no cell wall or chloroplasts. Not every plant cell has chloroplasts.</p></>
      : <><strong>In both cells</strong><p>Cell membrane · cytoplasm · nucleus · mitochondria · ribosomes</p><p>These structures do the same jobs in animal and plant cells.</p></>}</div>
  </div>
}

export function TeachingChunk({ state, onExposure, headingRef, customFrames }: { state: TeachingState; onExposure: () => void; headingRef?: RefObject<HTMLHeadingElement | null>; customFrames?: TeachingFrame[] }) {
  const steps = customFrames || teachingFrames[state.id] || []
  const [index, setIndex] = useState(0)
  const current = steps[index]
  if (!current) return null
  function move(to: number) { setIndex(to); onExposure() }
  const overview = index === steps.length - 1 && !current.part && !current.focus
  const animalParts = state.id === 'B1-05'
    ? cellParts.filter(part => ['membrane', 'cytoplasm', 'nucleus', ...steps.slice(0, index + 1).flatMap(frame => frame.part ? [frame.part] : [])].includes(part.id)).map(part => part.id)
    : steps.slice(0, index + 1).flatMap(frame => frame.part ? [frame.part] : [])
  const plantParts = state.id === 'B1-42'
    ? plantPartIds.filter(part => ['membrane', 'cytoplasm', 'nucleus', ...steps.slice(0, index + 1).flatMap(frame => frame.focus ? [frame.focus] : [])].includes(part))
    : steps.slice(0, index + 1).filter(frame => frame.diagram === 'plant').flatMap(frame => frame.focus ? [frame.focus] : [])
  const bacterialParts = state.id === 'B1-22' ? ['dna'] : [...new Set(steps.slice(0, index + 1).flatMap(frame => frame.focus === 'ribosomes' ? ['cytoplasm', 'ribosomes'] : frame.focus ? [frame.focus] : []))]
  return <div className="science-walkthrough">
    <div className="science-walkthrough__step-label">Step {index + 1} of {steps.length}</div>
    <div className="science-walkthrough__headline" aria-live="polite" aria-atomic="true">
      <h2 ref={headingRef} tabIndex={-1}>{current.label}</h2><p>{current.summary}</p><span className="science-walkthrough__cue">{current.cue}</span>
    </div>
    {current.diagram === 'cellBiology' ? <CellBiologyVisual focus={current.focus || ''} /> : current.diagram === 'practical' ? <PracticalVisual focus={current.focus || ''} /> : current.diagram === 'microscopy' ? <MicroscopyVisual focus={current.focus} visibleFocuses={steps.slice(0, index + 1).flatMap(frame => frame.focus ? [frame.focus] : [])} onSelect={focus => {
      const target = steps.findIndex(frame => frame.focus === focus)
      if (target >= 0) move(target)
    }} />
      : current.diagram === 'scale' ? <SizeReference />
      : current.diagram === 'comparison' ? <CellComparison differences={current.focus === 'differences'} />
      : current.diagram === 'plant' ? <PlantCellModel focus={current.focus} labelled partIds={overview ? plantPartIds : plantParts} selectablePartIds={steps.flatMap(frame => frame.focus ? [frame.focus] : [])} onSelect={focus => {
        const target = steps.findIndex(frame => frame.focus === focus)
        if (target >= 0) move(target)
      }} />
      : current.diagram === 'bacterium' ? <BacterialCellModel focus={current.focus} labelled partIds={bacterialParts} onSelect={focus => {
        const target = steps.findIndex(frame => frame.diagram === 'bacterium' && (frame.focus === focus || (focus === 'cytoplasm' && frame.focus === 'ribosomes')))
        if (target >= 0) move(target)
      }} />
      : <CellModel highlight={current.part} labelled partIds={overview ? cellParts.map(part => part.id) : animalParts} selectablePartIds={steps.flatMap(frame => frame.part ? [frame.part] : [])} onSelectPart={part => {
        const target = steps.findIndex(frame => frame.part === part)
        if (target >= 0) move(target)
      }} />}
    <div className="science-walkthrough__text"><p>{current.text}</p></div>
    <div className="science-walkthrough__controls">
      <div className="science-walkthrough__steps" role="group" aria-label="Explanation steps">{steps.map((frame, i) => <button type="button" key={frame.label} aria-label={`Step ${i + 1}: ${frame.label}`} aria-pressed={index === i} className={i === index ? 'is-current' : ''} onClick={() => move(i)}><span>{i + 1}</span>{frame.label}</button>)}</div>
      {index < steps.length - 1
        ? <button className="science-walkthrough__next" type="button" onClick={() => move(index + 1)}>Next: {steps[index + 1].label}</button>
        : <span className="science-walkthrough__complete">Explanation complete</span>}
    </div>
  </div>
}

export function WorkedReasoning({ state, onExposure }: { state: TeachingState; onExposure: () => void }) {
  const [revealed, setRevealed] = useState(0)
  const steps = state.steps || []
  return <div className="science-worked">
    {/^B(?:[4-9]|1[0-8])-/.test(state.id) ? <CellBiologyVisual focus={state.visual?.id || ''} /> : state.id.startsWith('B3-') ? <PracticalVisual focus={state.id} /> : state.id.startsWith('B2-') ? <MicroscopyVisual focus={state.id} /> : state.id === 'B1-30' ? <AreaModel /> : <CellModel highlight="mitochondria" />}
    <p className="science-worked__prompt">{state.body}</p>
    <ol className="science-worked__steps">{steps.slice(0, revealed).map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol>
    <button type="button" className="science-secondary" onClick={() => { setRevealed(value => value === steps.length ? 0 : value + 1); onExposure() }}>{revealed === steps.length ? <><RotateCcw size={16} /> Replay steps</> : revealed === 0 ? 'Show the reasoning' : 'Show next step'}</button>
  </div>
}
