import { useId, useRef, type ReactNode } from 'react'

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

/** One SVG instance per view: useId prevents marker/gradient collisions in the zoom dialog. */
export function AnatomyFigure(props: FigureProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useId()
  const legend = props.labels && <ol className="anatomy-key">{props.labels.map(label => <li key={label.mark} className={label.active ? 'is-active' : undefined}>
    <span className="anatomy-key__mark">{label.mark}</span><div><strong>{label.name}</strong><span>{label.detail}</span></div>
  </li>)}</ol>
  return <figure className="science-anatomy">
    <figcaption className="anatomy-toolbar"><span>{props.title}</span><button type="button" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">Enlarge diagram</button></figcaption>
    <Drawing {...props}/>
    {legend}
    <p className="anatomy-note">{props.note}</p>
    <dialog ref={dialog} className="anatomy-dialog" aria-labelledby={heading} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="anatomy-dialog__header"><h2 id={heading}>{props.title}</h2><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close diagram</button></div>
      <p className="anatomy-dialog__hint">Scroll across the enlarged drawing on a small screen.{props.labels && ' Labels are also listed below.'}</p>
      <div className="anatomy-dialog__scroll" tabIndex={0} role="region" aria-label="Enlarged diagram, scroll horizontally"><Drawing {...props}/></div>
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
