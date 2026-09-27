/*
 * The exam world's icon set: one 24 × 24 line style (2px strokes, round caps) for every topic, plus the
 * lock, crown, star and heart. Icons inherit currentColor, so a node's state sets their colour.
 */
import type { ReactNode, SVGProps } from 'react'

const paths: Record<string, ReactNode> = {
  // Number
  'number-types': <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="2" /></>,
  'place-value': <><rect x="3" y="6" width="5" height="12" rx="1.5" /><rect x="9.5" y="6" width="5" height="12" rx="1.5" /><rect x="16" y="6" width="5" height="12" rx="1.5" /><path d="M5.5 10v4M12 11v2M18.5 12h0" /></>,
  bidmas: <><path d="M8 4c-3 3-3 13 0 16M16 4c3 3 3 13 0 16" /><path d="M12 9v6M9 12h6" /></>,
  factors: <><circle cx="12" cy="4.5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="13" cy="19.5" r="2" /><circle cx="21" cy="19.5" r="1.2" /><path d="M10.6 6 7.4 10.5M13.4 6l3.2 4.5M17 13.7l-2.8 4M19 13.7l1.4 4.3" /></>,
  'written-methods': <><path d="M8 5l5 5M13 5l-5 5" /><path d="M4 14h16" /><path d="M8 18.5h8" /></>,
  rounding: <><path d="M4 9c2.5-2.5 5.5 2.5 8 0s5.5-2.5 8 0" /><path d="M4 15c2.5-2.5 5.5 2.5 8 0s5.5-2.5 8 0" /></>,
  fractions: <><circle cx="12" cy="12" r="8.5" /><path d="M12 12V3.5A8.5 8.5 0 0 1 20.5 12Z" fill="currentColor" fillOpacity=".35" /></>,
  decimals: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7.5 5v14M12 5v14M16.5 5v14" /><path d="M3.8 6h2.9v12.3H3.8Z" fill="currentColor" fillOpacity=".35" stroke="none" /></>,
  bounds: <><path d="M3 12h18" /><path d="M7 7H5.5v10H7M17 7h1.5v10H17" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>,
  fdp: <><path d="M19 9a7.5 7.5 0 0 0-13.5-2M5 15a7.5 7.5 0 0 0 13.5 2" /><path d="M5 3.5v3.8h3.8M19 20.5v-3.8h-3.8" /></>,
  percentages: <><circle cx="7" cy="7" r="2.6" /><circle cx="17" cy="17" r="2.6" /><path d="M18.5 5.5l-13 13" /></>,
  money: <><ellipse cx="12" cy="6.5" rx="7" ry="3" /><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /><path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
  // Algebra
  simplifying: <><rect x="3" y="4" width="6" height="6" rx="1.5" /><rect x="3" y="14" width="6" height="6" rx="1.5" /><path d="M11 7h3l3 5-3 5h-3" /><rect x="16" y="9" width="6" height="6" rx="1.5" /></>,
  'function-machines': <><rect x="8" y="6" width="8" height="12" rx="2" /><path d="M2 12h6M16 12h6M19 9l3 3-3 3" /><path d="M11 10.5h2M11 13.5h2" /></>,
  substitution: <><rect x="5" y="12" width="14" height="8" rx="2" /><path d="M12 3v7M9 7l3 3 3-3" /></>,
  equations: <><path d="M12 4v16M7 20h10" /><path d="M4 8h16" /><path d="M4 8l-2.5 6h5ZM20 8l-2.5 6h5Z" /></>,
  sequences: <><circle cx="4.5" cy="18" r="1.6" /><circle cx="10" cy="14" r="1.6" /><circle cx="15" cy="10" r="1.6" /><circle cx="19.5" cy="5.5" r="1.6" /><path d="M6 17l2.5-2M11.5 13l2-2M16.4 8.8l1.8-1.9" /></>,
  'straight-lines': <><path d="M4 3v17h17" /><path d="M6 17 19 6" /><circle cx="10" cy="13.6" r="1.3" fill="currentColor" /><circle cx="15" cy="9.4" r="1.3" fill="currentColor" /></>,
  // Ratio
  ratio: <><rect x="3" y="6" width="7" height="4.5" rx="1.2" /><rect x="11.5" y="6" width="9.5" height="4.5" rx="1.2" /><rect x="3" y="13.5" width="4.5" height="4.5" rx="1.2" /><rect x="9" y="13.5" width="6" height="4.5" rx="1.2" /></>,
  conversions: <><path d="M4 8h15M15 4l4 4-4 4" /><path d="M20 16H5M9 12l-4 4 4 4" /></>,
  speed: <><path d="M3.5 17a8.5 8.5 0 1 1 17 0" /><path d="M12 17l4.5-5.5" /><circle cx="12" cy="17" r="1.5" fill="currentColor" /></>,
  // Geometry
  shapes: <><path d="M8 3.5l5.5 9.5h-11Z" /><rect x="13" y="12" width="8" height="8" rx="1.5" /></>,
  angles: <><path d="M4 19h16M4 19 15 5" /><path d="M10.5 19a6.5 6.5 0 0 0-2.4-5" /></>,
  area: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 12l8-8M4 20 20 4M12 20l8-8" /></>,
  volume: <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></>,
  transformations: <><path d="M3 18l6-11v11Z" /><path d="M21 18l-6-11v11Z" strokeDasharray="2 2.5" /><path d="M12 4v16" strokeDasharray="1 3" /></>,
  pythagoras: <><path d="M4 20V6l14 14Z" /><path d="M4 16h4v4" /><path d="M11 13l4-4 5 5-4 4" strokeDasharray="2 2" /></>,
  trigonometry: <><path d="M4 20h16V6Z" /><path d="M16 20v-4h4" /><path d="M9.5 20a5.5 5.5 0 0 0-1.7-3.9" /></>,
  // Probability and statistics
  probability: <><rect x="4" y="4" width="16" height="16" rx="3.5" /><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" /></>,
  'frequency-trees': <><circle cx="4" cy="12" r="1.8" /><path d="M5.7 11 12 6M5.7 13 12 18" /><path d="M12 6l8-2.5M12 6l8 2.5M12 18l8-2.5M12 18l8 2.5" /></>,
  charts: <><path d="M3 20h18" /><rect x="5" y="11" width="3.5" height="9" rx="1" /><rect x="10.3" y="5" width="3.5" height="15" rx="1" /><rect x="15.6" y="14" width="3.5" height="6" rx="1" /></>,
  averages: <><path d="M3 20h18" /><rect x="5" y="9" width="3.5" height="11" rx="1" /><rect x="10.3" y="13" width="3.5" height="7" rx="1" /><rect x="15.6" y="6" width="3.5" height="14" rx="1" /><path d="M2.5 12.5h19" strokeDasharray="2 2" /></>,
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>{children}</svg>
}

export function TopicIcon({ id, ...rest }: IconProps & { id: string }) {
  return <Svg {...rest}>{paths[id] ?? <circle cx="12" cy="12" r="4" />}</Svg>
}

export const hasTopicIcon = (id: string) => id in paths

export function LockIcon(props: IconProps) {
  return <Svg {...props}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Svg>
}

export function CrownIcon(props: IconProps) {
  return <Svg {...props}><path d="M3.5 8l4.5 4 4-7 4 7 4.5-4-1.8 10.5H5.3Z" fill="currentColor" fillOpacity=".25" /><path d="M5.5 21h13" /></Svg>
}

export function StarIcon(props: IconProps) {
  return <Svg strokeWidth={0} {...props}><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" fill="currentColor" /></Svg>
}

export function HeartIcon({ empty, ...props }: IconProps & { empty?: boolean }) {
  return <Svg {...props}><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.8a4.5 4.5 0 0 1 8 2.7c0 6.1-8 11-8 11Z" fill={empty ? 'none' : 'currentColor'} /></Svg>
}

export function ChecklistIcon(props: IconProps) {
  return <Svg {...props}><path d="M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M4 18.5l1.5 1.5L8 17.5" /><path d="M11 7h9M11 13h9M11 19h9" /></Svg>
}

export function GridIcon(props: IconProps) {
  return <Svg {...props}><rect x="3" y="3" width="10" height="11" rx="2" /><rect x="15" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="11" width="6" height="10" rx="1.5" /><rect x="3" y="16" width="10" height="5" rx="1.5" /></Svg>
}

export function BackIcon(props: IconProps) {
  return <Svg {...props}><path d="M15 5l-7 7 7 7" /></Svg>
}

export function CloseIcon(props: IconProps) {
  return <Svg {...props}><path d="M6 6l12 12M18 6 6 18" /></Svg>
}

export function ArrowIcon(props: IconProps) {
  return <Svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
}
