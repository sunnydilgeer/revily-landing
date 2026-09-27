import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export const anatomy = {
  ink: '#304659', muted: '#657a89', red: '#c64c59', blue: '#357eae',
  oxygen: '#087f83', carbon: '#8555a4', muscle: '#d48780', tissue: '#ecd7ce',
}

export type DiagramIds = { ref: (name: string) => string }
export type AnatomyLabel = { mark: string; name: string; detail: string; active?: boolean }
type FigureProps = {
  title: string; description: string; height?: number; labels?: AnatomyLabel[];
  note: string; children: (ids: DiagramIds) => ReactNode;
}

function Drawing({ description, height = 420, children }: FigureProps) {
  const id = useId().replace(/:/g, '')
  const ref = (name: string) => `${id}-${name}`
  return <svg className="anatomy-drawing" viewBox={`0 0 600 ${height}`} role="img" aria-labelledby={ref('description')}>
    <title id={ref('description')}>{description}</title>
    <defs>
      {Object.entries({ blue: anatomy.blue, red: anatomy.red, oxygen: anatomy.oxygen, carbon: anatomy.carbon, ink: anatomy.ink, signal: '#b47b13' }).map(([name, colour]) =>
        <marker key={name} id={ref(name)} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10L2 5Z" fill={colour}/></marker>)}
      <linearGradient id={ref('lung')} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff0e7"/><stop offset=".55" stopColor="#edb8a9"/><stop offset="1" stopColor="#d99794"/></linearGradient>
      <linearGradient id={ref('muscle')} x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#edb4a7"/><stop offset=".6" stopColor="#cf7f79"/><stop offset="1" stopColor="#b76568"/></linearGradient>
      <linearGradient id={ref('blood')} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#357eae"/><stop offset=".5" stopColor="#a685aa"/><stop offset="1" stopColor="#c64c59"/></linearGradient>
      <linearGradient id={ref('body-blood')} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#c64c59"/><stop offset=".5" stopColor="#a685aa"/><stop offset="1" stopColor="#357eae"/></linearGradient>
      <pattern id={ref('fibres')} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><path d="M0 0V12M6 0V12" stroke="#945852" strokeWidth="1" opacity=".25"/></pattern>
    </defs>
    <g strokeLinejoin="round" strokeLinecap="round" fontFamily="inherit" fill={anatomy.ink}>{children({ ref })}</g>
  </svg>
}

const ZOOMS = [1, 1.5, 2, 3, 4]

/**
 * The enlarged diagram's own zoom, so a pinch never zooms the page behind it: buttons step through
 * ZOOMS, a two-finger pinch sets any level in between, and the drawing pans by scrolling.
 * The zoom keeps the middle of the view where it was.
 */
function useDiagramZoom(scroller: React.RefObject<HTMLDivElement | null>) {
  const [zoom, setZoom] = useState(1)
  const previous = useRef(1)
  useLayoutEffect(() => {
    const view = scroller.current, ratio = zoom / previous.current
    previous.current = zoom
    if (!view || ratio === 1) return
    view.scrollLeft = (view.scrollLeft + view.clientWidth / 2) * ratio - view.clientWidth / 2
    view.scrollTop = (view.scrollTop + view.clientHeight / 2) * ratio - view.clientHeight / 2
  }, [zoom, scroller])
  useEffect(() => {
    const view = scroller.current
    if (!view) return
    let start: { distance: number; zoom: number } | null = null
    const distance = (touches: TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
    const begin = (event: TouchEvent) => { if (event.touches.length === 2) start = { distance: distance(event.touches), zoom: previous.current } }
    const move = (event: TouchEvent) => {
      if (!start || event.touches.length !== 2) return
      event.preventDefault()
      setZoom(Math.min(4, Math.max(1, start.zoom * distance(event.touches) / start.distance)))
    }
    const end = (event: TouchEvent) => { if (event.touches.length < 2) start = null }
    view.addEventListener('touchstart', begin, { passive: true })
    view.addEventListener('touchmove', move, { passive: false })
    view.addEventListener('touchend', end)
    return () => { view.removeEventListener('touchstart', begin); view.removeEventListener('touchmove', move); view.removeEventListener('touchend', end) }
  }, [scroller])
  const step = (direction: 1 | -1) => setZoom(current => direction > 0 ? ZOOMS.find(level => level > current + 0.01) ?? 4 : [...ZOOMS].reverse().find(level => level < current - 0.01) ?? 1)
  return { zoom, zoomIn: () => step(1), zoomOut: () => step(-1), fit: () => setZoom(1) }
}

/** One SVG instance per view: useId prevents marker/gradient collisions in the zoom dialog. */
export function AnatomyFigure(props: FigureProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const heading = useId()
  const { zoom, zoomIn, zoomOut, fit } = useDiagramZoom(scroller)
  const pageScroll = useRef(0)
  const legend = props.labels && <ol className="anatomy-key">{props.labels.map(label => <li key={label.mark} className={label.active ? 'is-active' : undefined}>
    <span className="anatomy-key__mark">{label.mark}</span><div><strong>{label.name}</strong><span>{label.detail}</span></div>
  </li>)}</ol>

  // While the diagram is enlarged the page behind it stays put; closing puts it back exactly as it was, at normal size.
  const open = () => {
    pageScroll.current = window.scrollY
    document.documentElement.classList.add('has-diagram-open')
    fit()
    dialog.current?.showModal()
  }
  const closed = () => {
    document.documentElement.classList.remove('has-diagram-open')
    fit()
    // The browser hands focus back to "Enlarge diagram" as the dialog closes and may scroll to it; put the page back after that.
    const top = pageScroll.current
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' })))
  }
  useEffect(() => () => document.documentElement.classList.remove('has-diagram-open'), [])

  return <figure className="science-anatomy">
    <figcaption className="anatomy-toolbar"><span>{props.title}</span><button type="button" onClick={open} aria-haspopup="dialog">Enlarge diagram</button></figcaption>
    <Drawing {...props}/>
    {legend}
    <p className="anatomy-note">{props.note}</p>
    <dialog ref={dialog} className="anatomy-dialog" aria-labelledby={heading} onClose={closed} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="anatomy-dialog__header">
        <h2 id={heading}>{props.title}</h2>
        <div className="anatomy-dialog__zoom" role="group" aria-label="Zoom">
          <button type="button" onClick={zoomOut} disabled={zoom <= 1} aria-label="Zoom out">−</button>
          <button type="button" onClick={fit} disabled={zoom === 1} aria-label="Fit to screen">{Math.round(zoom * 100)}%</button>
          <button type="button" onClick={zoomIn} disabled={zoom >= 4} aria-label="Zoom in">+</button>
        </div>
        <button type="button" autoFocus onClick={() => dialog.current?.close()}>Close</button>
      </div>
      <p className="anatomy-dialog__hint">Pinch or use + and − to zoom, then drag to move around.{props.labels && ' Labels are also listed below.'}</p>
      <div ref={scroller} className="anatomy-dialog__scroll" tabIndex={0} role="region" aria-label={`Enlarged diagram at ${Math.round(zoom * 100)}%`}>
        <div className="anatomy-dialog__canvas" style={{ width: `${zoom * 100}%` }}><Drawing {...props}/></div>
      </div>
      {legend}<p className="anatomy-note">{props.note}</p>
    </dialog>
  </figure>
}

export function Pointer({ mark, x, y, toX, toY, active = false }: { mark: string; x: number; y: number; toX: number; toY: number; active?: boolean }) {
  return <g className={active ? 'anatomy-pointer is-active' : 'anatomy-pointer'}>
    <path d={`M${x} ${y}L${toX} ${toY}`} fill="none" stroke={active ? '#087f83' : '#657a89'} strokeWidth="1.6"/>
    <circle cx={toX} cy={toY} r="3" fill={active ? '#087f83' : '#657a89'}/>
    <circle cx={x} cy={y} r="15" fill={active ? '#e4f4ef' : '#fff'} stroke={active ? '#087f83' : '#657a89'} strokeWidth="1.8"/>
    <text x={x} y={y + 5.5} fontSize="17" textAnchor="middle" fontWeight="700">{mark}</text>
  </g>
}

export function Flow({ d, ids, colour = 'ink', width = 3, dashed = false }: { d: string; ids: DiagramIds; colour?: 'ink' | 'red' | 'blue' | 'oxygen' | 'carbon' | 'signal'; width?: number; dashed?: boolean }) {
  const stroke = colour === 'signal' ? '#b47b13' : anatomy[colour]
  return <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeDasharray={dashed ? '5 6' : undefined} markerEnd={`url(#${ids.ref(colour)})`}/>
}

export function RedCell({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <ellipse rx="15" ry="9" fill="#c95e68" stroke="#a74454" strokeWidth="1.3"/>
    <ellipse rx="8" ry="4" fill="#edb1af"/><path d="M-11-4Q0-11 11-3" fill="none" stroke="#f3c5bd" strokeWidth="1.4"/>
  </g>
}
