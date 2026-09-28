import type { ReactNode } from 'react'
import { Arrow, Badge, Diagram, Label, blob, seeded } from './InfectionVisuals'
import { plantPalette as P } from './PlantOrganisationVisuals'

// Chapter B7 (Lessons 51–54): communities, factors, adaptations, food chains, quadrats and transects. Original, code-native schematics. Not to scale.
// Focus ids start with 'eco-'.
// Colour code, as the rest of the course: yellow = light from the Sun, blue = water, purple = carbon dioxide,
// teal = oxygen, amber = glucose/food, green = plants and producers. Feeding roles keep one colour each across the
// chapter: producer green, primary consumer (and prey) amber-brown, secondary consumer (and predator) rust,
// tertiary consumer plum. Animals are simple original silhouettes, not accurate drawings of any one individual.
type Pt = [number, number]
const ink = P.ink, green = P.deepGreen, leafFill = '#a9d49a', grassFill = '#e4f0d6', grassLine = '#9cc58a'
const water = '#55acd0', waterFill = '#dcf0f8', waterDeep = '#3f93bd', soil = P.soil, soilLine = '#c9b18c'
const sunFill = '#f6d25e', sunLine = '#c9951c', lightInk = '#a77c12', co2 = P.purple, teal = '#2f9c95', tealFill = '#d5efec'
const sugar = P.amber, sugarFill = P.amberFill, muted = '#7d93a3', faded = .28
const producer = '#4f8f5a', primary = '#a86f16', secondary = '#bf5536', tertiary = '#7a4f86'
const warm = '#c8505a', mineral = '#8a6d45'

// ---------- Small shared pieces ----------
function Fade({ on = true, children }: { on?: boolean; children: ReactNode }) { return <g opacity={on ? 1 : faded}>{children}</g> }
function At({ x, y, s = 1, flip = false, children }: { x: number; y: number; s?: number; flip?: boolean; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{children}</g>
}
function Sun({ x, y, r = 17 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={sunFill} stroke={sunLine} strokeWidth="1.6" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${(x + Math.cos(a) * (r + 6)).toFixed(1)} ${(y + Math.sin(a) * (r + 6)).toFixed(1)}L${(x + Math.cos(a) * (r + 13)).toFixed(1)} ${(y + Math.sin(a) * (r + 13)).toFixed(1)}`} stroke={sunLine} strokeWidth="2.2" strokeLinecap="round" /> })}</g>
}
function Chip({ x, y, text, colour = ink, anchor = 'middle', fill = 'white' }: { x: number; y: number; text: string; colour?: string; anchor?: 'start' | 'middle' | 'end'; fill?: string }) {
  const w = text.length * 7 + 18, left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x
  return <g><rect x={left} y={y - 14} width={w} height={21} rx={10.5} fill={fill} stroke={colour} strokeWidth="1.6" /><text x={left + w / 2} y={y + 1.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={colour}>{text}</text></g>
}
function Title({ x = 20, y = 26, text, anchor = 'start' }: { x?: number; y?: number; text: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fill={ink} fontSize="14" fontWeight="700">{text}</text>
}
/** The numbered walkthrough list used across the course (lesson 18 style): the current step is filled, the rest fade. */
function Steps({ items, active, x = 372, colour = green }: { items: Array<{ y: number; lines: string[] }>; active: number; x?: number; colour?: string }) {
  return <g>{items.map((item, i) => {
    const n = i + 1, current = active === n, on = active === 0 || current
    return <g key={n} opacity={on ? 1 : .42}>
      <circle cx={x} cy={item.y} r="12" fill={current ? colour : 'white'} stroke={ink} strokeWidth="2" />
      <text x={x} y={item.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={current ? 'white' : ink}>{n}</text>
      <Label x={x + 20} y={item.y - 2} lines={item.lines} strong={current} />
    </g>
  })}</g>
}
function Cross({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <path d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`} stroke={warm} strokeWidth="4" strokeLinecap="round" />
}
function Thermometer({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 5} y={y - 30} width={10} height={34} rx={5} fill="white" stroke={ink} strokeWidth="1.6" /><rect x={x - 2} y={y - 16} width={4} height={20} fill={warm} /><circle cx={x} cy={y + 8} r={8} fill={warm} stroke={ink} strokeWidth="1.6" /></g>
}
function Drop({ x, y, s = 1, fill = waterFill, stroke = water }: { x: number; y: number; s?: number; fill?: string; stroke?: string }) {
  return <path d={`M${x} ${y - 9 * s}C${x + 6 * s} ${y - 1 * s} ${x + 6 * s} ${y + 5 * s} ${x} ${y + 5 * s}C${x - 6 * s} ${y + 5 * s} ${x - 6 * s} ${y - 1 * s} ${x} ${y - 9 * s}Z`} fill={fill} stroke={stroke} strokeWidth="1.5" />
}
function CO2({ x, y }: { x: number; y: number }) {
  return <g>{[-8, 8].map(d => <circle key={d} cx={x + d} cy={y} r={5} fill="#e9e0f6" stroke={co2} strokeWidth="1.5" />)}<circle cx={x} cy={y} r={4.6} fill={co2} /></g>
}
function Bubble({ x, y, r = 4 }: { x: number; y: number; r?: number }) { return <circle cx={x} cy={y} r={r} fill={tealFill} stroke={teal} strokeWidth="1.4" /> }
function Mineral({ x, y }: { x: number; y: number }) { return <path d={`M${x} ${y - 4}L${x + 4} ${y + 3}H${x - 4}Z`} fill="#d9c29a" stroke={mineral} strokeWidth="1.3" /> }

// ---------- Organisms (drawn facing right, standing on y = 0) ----------
function Rabbit({ fur = '#cbb49a', line = '#8a6d45' }: { fur?: string; line?: string }) {
  return <g stroke={line} strokeWidth="1.5">
    <circle cx={-25} cy={-18} r={5} fill="white" />
    <ellipse cx={-6} cy={-15} rx={19} ry={13} fill={fur} />
    <ellipse cx={-14} cy={-10} rx={11} ry={10} fill={fur} />
    <ellipse cx={-12} cy={-1.8} rx={10} ry={3} fill={fur} /><ellipse cx={8} cy={-2.5} rx={6} ry={2.8} fill={fur} />
    <ellipse cx={8} cy={-42} rx={4.2} ry={12.5} fill={fur} transform="rotate(-20 8 -42)" /><ellipse cx={15} cy={-42} rx={4.2} ry={12.5} fill={fur} transform="rotate(6 15 -42)" />
    <ellipse cx={14} cy={-26} rx={10.5} ry={8.5} fill={fur} />
    <circle cx={18} cy={-28} r={1.7} fill={ink} stroke="none" /><circle cx={24} cy={-25} r={1.4} fill="#c77b8f" stroke="none" />
  </g>
}
function Fox({ fur = '#dd8a4b', line = '#9a5226', bigEars = false, dark = '#5b3a2a', tip = 'white' }: { fur?: string; line?: string; bigEars?: boolean; dark?: string; tip?: string }) {
  const ears = bigEars ? 'M17 -32L12 -62L29 -35ZM24 -33L33 -63L36 -31Z' : 'M17 -33L19 -47L27 -35ZM24 -34L30 -46L32 -32Z'
  return <g stroke={line} strokeWidth="1.5" strokeLinejoin="round">
    {[-20, -12, 11, 18].map(x => <rect key={x} x={x - 2.4} y={-15} width={4.8} height={15} rx={2} fill={dark} stroke="none" />)}
    <path d="M-24 -24C-42 -30 -58 -22 -62 -6C-50 -8 -38 -12 -24 -16Z" fill={fur} />
    <path d="M-55 -11C-58 -9 -61 -7 -62 -6C-58 -6 -54 -7 -50 -8Z" fill={tip} stroke="none" />
    <ellipse cx={-2} cy={-22} rx={26} ry={10.5} fill={fur} />
    <path d={ears} fill={fur} />
    <path d="M13 -26C16 -37 28 -39 33 -32L46 -25C42 -21 36 -20 30 -19C22 -18 15 -19 13 -26Z" fill={fur} />
    <path d="M30 -19C36 -20 42 -21 46 -25C42 -22 36 -18 30 -17Z" fill={tip} stroke="none" />
    <ellipse cx={17} cy={-17} rx={6} ry={5} fill={tip} stroke="none" />
    <circle cx={30} cy={-29} r={1.7} fill={ink} stroke="none" /><circle cx={46} cy={-25} r={2} fill={ink} stroke="none" />
  </g>
}
function Squirrel({ fur = '#c0643a', line = '#86401f', tufts = true }: { fur?: string; line?: string; tufts?: boolean }) {
  return <g stroke={line} strokeWidth="1.5" strokeLinejoin="round">
    <path d="M-6 -8C-32 -6 -38 -36 -24 -52C-15 -62 -1 -58 -5 -48C-9 -42 -18 -40 -16 -28C-14 -18 -8 -16 -1 -14Z" fill={fur} />
    <ellipse cx={4} cy={-17} rx={10} ry={14} fill={fur} transform="rotate(12 4 -17)" />
    <ellipse cx={-1} cy={-5} rx={10} ry={5} fill={fur} />
    <circle cx={12} cy={-33} r={8.5} fill={fur} />
    <path d={tufts ? 'M7 -39L7 -51L13 -41Z' : 'M7 -39L9 -46L13 -40Z'} fill={fur} />
    <ellipse cx={13} cy={-18} rx={3} ry={2.2} fill={line} stroke="none" />
    <circle cx={15} cy={-35} r={1.6} fill={ink} stroke="none" /><circle cx={20.5} cy={-31} r={1.3} fill={ink} stroke="none" />
  </g>
}
/** A small perched bird (blue tit, blackbird, robin…), feet on y = 0. */
function Bird({ body, belly, cap, beak = '#3b4a57', eye = ink, bars = false, hooked = false }: { body: string; belly: string; cap?: string; beak?: string; eye?: string; bars?: boolean; hooked?: boolean }) {
  return <g stroke={ink} strokeWidth="1.3" strokeLinejoin="round">
    <path d="M-3 -2V4M3 -2V4" stroke={ink} strokeWidth="1.6" />
    <path d="M-12 -12L-26 -5L-24 -1L-10 -7Z" fill={body} />
    <ellipse cx={0} cy={-12} rx={13} ry={10.5} fill={belly} />
    {bars && [-15, -11, -7].map(y => <path key={y} d={`M-4 ${y}q4 2 9 0`} stroke={body} strokeWidth="1.2" fill="none" />)}
    <path d="M-13 -14C-6 -24 6 -22 10 -15C4 -9 -6 -8 -13 -10Z" fill={body} />
    <circle cx={9} cy={-22} r={7.5} fill={cap ? 'white' : body} />
    {cap && <path d="M2 -24C4 -31 13 -31 16 -24C12 -26 6 -26 2 -24Z" fill={cap} />}
    <path d={hooked ? 'M15.5 -24L21 -22Q21 -18 17 -18L15.5 -20Z' : 'M15.5 -23.5L22 -21.5L15.5 -19.5Z'} fill={beak} />
    <circle cx={11} cy={-23} r={1.7} fill={eye} stroke={hooked ? ink : 'none'} strokeWidth=".6" />
  </g>
}
const BlueTit = () => <Bird body="#5f9fd2" belly="#f3d35b" cap="#3f7fbf" />
const Sparrowhawk = () => <g transform="scale(1.35)"><Bird body="#6f8294" belly="#f2e4d0" bars hooked beak="#e2b23a" eye="#e2b23a" /></g>
function Heron() {
  return <g stroke={ink} strokeWidth="1.4" strokeLinejoin="round">
    <path d="M-2 -30V0M4 -30V0" stroke="#8a8f78" strokeWidth="2.2" />
    <path d="M-20 -44C-24 -30 -6 -24 10 -32C16 -36 14 -48 4 -50C-6 -52 -16 -52 -20 -44Z" fill="#b8c2cb" />
    <path d="M-20 -44L-30 -34L-16 -38Z" fill="#8d9aa6" />
    <path d="M6 -48C4 -58 2 -66 8 -72" fill="none" stroke="#dfe5ea" strokeWidth="6" strokeLinecap="round" />
    <path d="M6 -48C4 -58 2 -66 8 -72" fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
    <circle cx={10} cy={-74} r={5.5} fill="#eef2f5" /><path d="M8 -79L2 -84" stroke="#3b4a57" strokeWidth="1.8" />
    <path d="M14 -76L30 -72L14 -71Z" fill="#e2b23a" /><circle cx={11.5} cy={-75} r={1.2} fill={ink} stroke="none" />
  </g>
}
function Owl() {
  return <g stroke="#6b4a2a" strokeWidth="1.4">
    <ellipse cx={0} cy={-18} rx={14} ry={18} fill="#b98a5a" />
    <ellipse cx={0} cy={-12} rx={8} ry={10} fill="#ecd9bf" stroke="none" />
    <path d="M-9 -40L-10 -49L-3 -43ZM9 -40L10 -49L3 -43Z" fill="#b98a5a" />
    <circle cx={0} cy={-34} r={11} fill="#b98a5a" />
    <ellipse cx={0} cy={-33} rx={9} ry={7} fill="#f3e7d4" stroke="none" />
    {[-4.2, 4.2].map(x => <circle key={x} cx={x} cy={-34} r={2.6} fill={ink} stroke="none" />)}
    <path d="M-1.4 -30L0 -27L1.4 -30Z" fill="#e2b23a" stroke="none" />
  </g>
}
function Swallow() {
  return <g stroke={ink} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M-2 0C-12 -6 -24 -8 -34 -4C-24 -2 -14 0 -4 3Z" fill="#2f4f7a" />
    <path d="M-2 0C-14 -14 -26 -22 -36 -24C-26 -14 -16 -4 -4 4Z" fill="#2f4f7a" />
    <ellipse cx={0} cy={1} rx={11} ry={4.5} fill="#2f4f7a" />
    <path d="M-10 2L-24 8L-14 2L-24 12L-9 4Z" fill="#2f4f7a" />
    <circle cx={10} cy={0} r={3.6} fill="#b8453a" stroke="none" /><path d="M13 -1L17 0L13 1Z" fill={ink} />
  </g>
}
function Stickleback({ colour = '#8fae8a' }: { colour?: string }) {
  return <g stroke="#56745a" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M-12 0L-21 -6L-20 6Z" fill={colour} />
    <path d="M-14 0Q-2 -9 14 0Q-2 8 -14 0Z" fill={colour} />
    <path d="M-4 -5L-2 -10L0 -5M3 -5L5 -9L6 -4" fill="none" />
    <path d="M-4 3Q2 5 9 2" stroke="#c0564a" strokeWidth="2" fill="none" />
    <circle cx={8} cy={-1.5} r={1.4} fill={ink} stroke="none" />
  </g>
}
function Pike() { return <g transform="scale(1.6 1.2)"><Stickleback colour="#9bb77a" /></g> }
function Snail() {
  return <g stroke="#8a6436" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M-12 0C-12 -4 -8 -5 -4 -5H12C16 -5 18 -3 19 0Z" fill="#d8c3a4" />
    <path d="M13 -5L15 -13M16 -5L20 -12" fill="none" />
    <circle cx={0} cy={-11} r={9} fill="#e3c38f" />
    <path d="M0 -11m-2 0a2 2 0 1 1 4 0a4 4 0 1 1 -8 0a6 6 0 1 1 12 0" fill="none" />
  </g>
}
function Nymph() {
  return <g stroke="#6f5d33" strokeWidth="1.2" strokeLinejoin="round">
    <path d="M-12 -3L-22 -8M-12 -3L-23 -3M-12 -3L-22 2" fill="none" />
    <path d="M-2 -1L-5 3M3 -1L2 4M7 -1L9 3" fill="none" />
    <path d="M-13 -3Q-4 -8 6 -5Q-4 1 -13 -3Z" fill="#b8a36a" />
    <ellipse cx={8} cy={-4} rx={5} ry={3.6} fill="#a48f58" /><circle cx={14} cy={-4.5} r={3.2} fill="#a48f58" />
  </g>
}
function Beetle() {
  return <g stroke="#26302a" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M-6 -2L-16 4M0 -1L-4 6M6 -2L12 4" fill="none" />
    <ellipse cx={-1} cy={-7} rx={13} ry={8} fill="#44563f" />
    <path d="M-1 -15V1" stroke="#9fb08f" strokeWidth="1" />
    <ellipse cx={13} cy={-7} rx={4} ry={3.5} fill="#34432f" />
  </g>
}
function Caterpillar() {
  return <g stroke="#4f7d34" strokeWidth="1.2">
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-20 + i * 7} cy={-6 - Math.sin(i / 5 * Math.PI) * 5} r={5} fill="#9ccc62" />)}
    <circle cx={22} cy={-7} r={5.6} fill="#6f9f44" /><circle cx={24} cy={-8} r={1.2} fill={ink} stroke="none" />
  </g>
}
function Vole() {
  return <g stroke="#6b4a2a" strokeWidth="1.3">
    <path d="M-16 -5Q-26 -3 -30 -1" fill="none" />
    <ellipse cx={-2} cy={-8} rx={15} ry={8.5} fill="#9a7654" />
    <circle cx={11} cy={-10} r={6} fill="#9a7654" /><circle cx={9} cy={-16} r={3} fill="#b89373" />
    <circle cx={14} cy={-11} r={1.3} fill={ink} stroke="none" />
  </g>
}
function Gerbil() {
  return <g stroke="#9a7040" strokeWidth="1.3">
    <path d="M-14 -6C-26 -4 -34 -8 -42 -16" fill="none" strokeWidth="1.6" /><path d="M-42 -16l-5 -4" stroke="#7a5530" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx={-3} cy={-9} rx={13} ry={9} fill="#e3c08a" />
    <ellipse cx={-7} cy={-3} rx={9} ry={3} fill="#e3c08a" />
    <circle cx={10} cy={-13} r={6.5} fill="#e3c08a" /><ellipse cx={7} cy={-20} rx={3} ry={4} fill="#efd3a6" />
    <circle cx={13} cy={-14} r={1.4} fill={ink} stroke="none" />
  </g>
}
function Bee() {
  return <g stroke={ink} strokeWidth="1.1">
    <ellipse cx={-2} cy={-12} rx={5} ry={3} fill="white" opacity=".9" transform="rotate(-25 -2 -12)" /><ellipse cx={3} cy={-12} rx={5} ry={3} fill="white" opacity=".9" transform="rotate(20 3 -12)" />
    <ellipse cx={0} cy={-5} rx={8} ry={5} fill="#f2c230" />
    <path d="M-3 -9.6V-0.4M2 -9.6V-0.4" stroke={ink} strokeWidth="2" /><circle cx={8.5} cy={-5} r={3} fill={ink} />
  </g>
}
function Flower({ petal = 'white', centre = '#f2c230', r = 1 }: { petal?: string; centre?: string; r?: number }) {
  return <g><path d={`M0 0V${-26 * r}`} stroke={green} strokeWidth="2" />
    {Array.from({ length: 7 }, (_, i) => { const a = i / 7 * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 6 * r} cy={-26 * r + Math.sin(a) * 6 * r} rx={4.5 * r} ry={2.6 * r} transform={`rotate(${a * 180 / Math.PI} ${Math.cos(a) * 6 * r} ${-26 * r + Math.sin(a) * 6 * r})`} fill={petal} stroke="#b9c3cb" strokeWidth=".8" /> })}
    <circle cx={0} cy={-26 * r} r={3.6 * r} fill={centre} stroke={sunLine} strokeWidth=".8" /></g>
}
function Tuft({ x, y, s = 1, colour = green }: { x: number; y: number; s?: number; colour?: string }) {
  return <path d={`M${x - 6 * s} ${y}Q${x - 5 * s} ${y - 8 * s} ${x - 9 * s} ${y - 14 * s}M${x} ${y}Q${x} ${y - 10 * s} ${x + 1 * s} ${y - 17 * s}M${x + 6 * s} ${y}Q${x + 6 * s} ${y - 8 * s} ${x + 10 * s} ${y - 13 * s}`} stroke={colour} strokeWidth="1.8" fill="none" strokeLinecap="round" />
}
function Tree({ x, y, s = 1, fill = '#8fc27d', seed = 3 }: { x: number; y: number; s?: number; fill?: string; seed?: number }) {
  return <g><path d={`M${x - 7 * s} ${y}L${x - 5 * s} ${y - 60 * s}H${x + 5 * s}L${x + 7 * s} ${y}Z`} fill="#9b7650" stroke="#6f5236" strokeWidth="1.5" />
    <path d={blob(x, y - 88 * s, 48 * s, 40 * s, seed, .12)} fill={fill} stroke={green} strokeWidth="2" /></g>
}
function Clover({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-90, 30, 150].map(a => { const r = a * Math.PI / 180; return <circle key={a} cx={x + Math.cos(r) * 2.6 * s} cy={y + Math.sin(r) * 2.6 * s} r={2.6 * s} fill="#6aa95f" stroke="#3f7d3a" strokeWidth=".8" /> })}</g>
}
function OakLeaf({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <path d="M0 0C-6 -3 -12 -5 -9 -11C-16 -13 -16 -20 -9 -22C-16 -26 -14 -33 -7 -33C-8 -39 -4 -43 0 -46C4 -43 8 -39 7 -33C14 -33 16 -26 9 -22C16 -20 16 -13 9 -11C12 -5 6 -3 0 0Z" fill={leafFill} stroke={green} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M0 2V-42" stroke={green} strokeWidth="1.3" />
  </g>
}
function Algae({ x, y, n = 7, seed = 2 }: { x: number; y: number; n?: number; seed?: number }) {
  const rand = seeded(seed)
  return <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x + (rand() - .5) * 26} cy={y + (rand() - .5) * 14} r={2.4 + rand() * 1.4} fill="#7cc06a" stroke="#4f8f45" strokeWidth=".9" />)}</g>
}
function Microbe({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return <g transform={`rotate(${a} ${x} ${y})`}><rect x={x - 8} y={y - 3.6} width={16} height={7.2} rx={3.6} fill="#f5d9e7" stroke="#b8467f" strokeWidth="1.3" /><path d={`M${x + 8} ${y}q4 -3 7 0`} stroke="#b8467f" strokeWidth="1.1" fill="none" /></g>
}
function Pondweed({ x, y, h, seed = 1 }: { x: number; y: number; h: number; seed?: number }) {
  const rand = seeded(seed)
  const pts = Array.from({ length: 6 }, (_, i) => [x + Math.sin(i + seed) * 4, y - i * h / 5] as Pt)
  return <g><path d={`M${pts.map(p => p.join(' ')).join('L')}`} stroke={green} strokeWidth="2" fill="none" />
    {pts.slice(1).map(([px, py], i) => { const d = i % 2 ? 1 : -1, l = 9 + rand() * 4; return <ellipse key={i} cx={px + d * l / 2} cy={py + 1} rx={l / 2} ry={2.6} fill={leafFill} stroke={green} strokeWidth="1" transform={`rotate(${d * -25} ${px + d * l / 2} ${py + 1})`} /> })}</g>
}
function Reeds({ x, y }: { x: number; y: number }) {
  return <g>{[-6, 0, 7].map((d, i) => <g key={d}><path d={`M${x + d} ${y}Q${x + d - 2} ${y - 30} ${x + d + (i - 1) * 3} ${y - 50 - i * 4}`} stroke={green} strokeWidth="2" fill="none" />{i !== 2 && <rect x={x + d - 3.4 + (i - 1) * 2} y={y - 50 - i * 4} width={6.8} height={16} rx={3.4} fill="#8a6440" />}</g>)}</g>
}

// ---------- Lesson 51: the pond (habitat → ecosystem) ----------
const POND = 'M62 156C70 236 112 268 180 270C248 268 292 236 300 156Z'
const fishAt: Pt[] = [[122, 192], [170, 214], [226, 188], [196, 244]]
function PondScene({ step }: { step: number }) {
  const living = step !== 1 && step !== 2 ? 1 : step === 2 ? faded : 1
  const others = step === 2 ? faded : 1
  return <g>
    <path d="M10 150H340V292H10Z" fill="#efe6cf" />
    <path d="M10 146H340V156H10Z" fill={grassFill} />
    <path d={POND} fill={waterFill} stroke={water} strokeWidth="2" />
    <path d="M100 262C140 272 220 272 262 262L256 268C220 276 140 276 104 268Z" fill="#d9c7a6" />
    <path d="M62 156H300" stroke={water} strokeWidth="2" />
    <Fade on={step !== 2 || false}><g opacity={step === 2 ? 1 : 1}>
      <Reeds x={70} y={156} /><Reeds x={292} y={156} />
      <Pondweed x={112} y={266} h={86} seed={2} /><Pondweed x={250} y={264} h={78} seed={5} /><Pondweed x={160} y={270} h={60} seed={8} />
      <Algae x={94} y={172} seed={3} /><Algae x={272} y={174} seed={4} /><Algae x={226} y={262} n={6} seed={9} />
      <At x={140} y={268} s={.9}><Snail /></At><At x={262} y={250} s={.85} flip><Snail /></At>
      <At x={250} y={220}><Beetle /></At>
      <At x={200} y={268} s={.9}><Nymph /></At><At x={108} y={238} s={.85} flip><Nymph /></At>
      <At x={34} y={150}><Heron /></At>
    </g></Fade>
    <g opacity={living}>{fishAt.map(([x, y], i) => <At key={i} x={x} y={y} flip={i % 2 === 1}><Stickleback /></At>)}</g>
    {step === 2 && fishAt.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20} fill="none" stroke={secondary} strokeWidth="2" strokeDasharray="4 4" />)}
    <g opacity={others}>
      <Fade on={step === 0 || step === 4}><Sun x={160} y={48} /></Fade>
      {step === 4 && <><Chip x={160} y={100} text="light" colour={lightInk} /><Chip x={180} y={232} text="water" colour={waterDeep} fill="#f4fafd" /><Thermometer x={316} y={108} /><Chip x={334} y={60} text="temperature" colour={warm} anchor="end" /></>}
    </g>
    {step === 1 && <path d="M54 150C60 244 110 278 180 280C250 278 302 244 308 150Z" fill="none" stroke={sugar} strokeWidth="3" strokeDasharray="7 5" />}
    {step === 3 && <g fill="none" stroke={green} strokeWidth="1.8" strokeDasharray="3 4">
      {[[70, 128, 16, 32], [292, 128, 16, 32], [112, 222, 16, 46], [250, 222, 16, 44], [140, 258, 14, 12], [262, 240, 14, 12], [250, 214, 16, 10], [200, 262, 16, 8], [108, 234, 14, 8], [34, 112, 22, 40], [94, 172, 16, 10], [272, 174, 16, 10]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} />)}
      {fishAt.map(([x, y], i) => <ellipse key={`f${i}`} cx={x} cy={y} rx={20} ry={11} />)}
    </g>}
  </g>
}
function Community({ focus }: { focus: string }) {
  const step = { 'eco-comm-habitat': 1, 'eco-comm-population': 2, 'eco-comm-community': 3, 'eco-comm-ecosystem': 4 }[focus] || 0
  if (focus === 'eco-comm-all') return <Nested />
  const titles = [
    '', 'Step 1, habitat: a garden pond drawn in cross-section, outlined as the place where sticklebacks, snails, pondweed, algae, water beetles, mayfly nymphs and a heron live.',
    'Step 2, population: the four sticklebacks in the pond are circled. They are all one species. Other living things are faded.',
    'Step 3, community: every living thing in the pond is circled, all the different species together.',
    'Step 4, ecosystem: the whole pond, with its living things and the non-living parts labelled: light from the Sun, the water and the temperature.',
  ]
  return <Diagram title={titles[step]}>
    <PondScene step={step} />
    <Steps active={step} items={[{ y: 44, lines: ['habitat: where', 'they live'] }, { y: 112, lines: ['population: all', 'of one species'] }, { y: 180, lines: ['community: all', 'the species'] }, { y: 248, lines: ['ecosystem: plus', 'non-living parts'] }]} />
  </Diagram>
}
function Nested() {
  return <Diagram title="Summary as nested boxes. The largest box is the ecosystem: the community plus light, water and temperature. Inside it is the community: all the species in the pond. Inside that is the population: all the sticklebacks. Inside that, one stickleback is circled as a single organism.">
    <rect x={14} y={10} width={512} height={282} rx={16} fill="#eef6fb" stroke={water} strokeWidth="2" />
    <text x={30} y={36} fill={waterDeep} fontSize="14" fontWeight="700">ecosystem</text><text x={122} y={36} fill={ink} fontSize="13">= community + non-living parts</text>
    <Sun x={384} y={32} r={8} /><text x={410} y={37} fill={lightInk} fontSize="12" fontWeight="700">light</text><Drop x={452} y={36} /><text x={462} y={37} fill={waterDeep} fontSize="12" fontWeight="700">water</text>
    <rect x={30} y={54} width={480} height={224} rx={14} fill="#f1f8ec" stroke={green} strokeWidth="2" />
    <text x={46} y={78} fill={green} fontSize="14" fontWeight="700">community</text><text x={138} y={78} fill={ink} fontSize="13">= all the species</text>
    <rect x={46} y={92} width={240} height={172} rx={12} fill="white" stroke={secondary} strokeWidth="2" />
    <text x={60} y={116} fill={secondary} fontSize="14" fontWeight="700">population</text><text x={60} y={134} fill={ink} fontSize="13">= all the sticklebacks</text>
    {[[196, 170], [250, 200], [186, 238], [252, 244]].map(([x, y], i) => <At key={i} x={x} y={y} s={1.2} flip={i % 2 === 1}><Stickleback /></At>)}
    <At x={106} y={184} s={1.2}><Stickleback /></At><circle cx={106} cy={184} r={26} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="4 4" />
    <text x={106} y={230} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">organism:</text><text x={106} y={246} textAnchor="middle" fill={ink} fontSize="12">one stickleback</text>
    <At x={330} y={140}><Snail /></At><At x={400} y={138}><Beetle /></At><At x={462} y={136} s={1.1}><Nymph /></At>
    <Pondweed x={340} y={260} h={80} seed={3} /><Algae x={410} y={220} n={9} seed={6} /><At x={466} y={262} s={.8}><Heron /></At>
  </Diagram>
}

// ---------- Lesson 51: what organisms need and compete for ----------
function Blackbird({ female = false }: { female?: boolean }) { return <Bird body={female ? '#7a5a3c' : '#2f3036'} belly={female ? '#9a7652' : '#3a3b42'} beak={female ? '#b98a4a' : '#e9a13b'} eye={female ? ink : '#e9a13b'} /> }
function Competition({ focus }: { focus: string }) {
  const step = { 'eco-comp-need': 0, 'eco-comp-plants': 1, 'eco-comp-animals': 2, 'eco-comp-compete': 3 }[focus] ?? 0
  const titles = [
    'Two panels. Left: plants need light, water, space and mineral ions; a tall plant and a small seedling grow in soil with water and mineral ions. Right: animals need food, territory and mates; two male blackbirds, a worm and a female blackbird.',
    'Plants need light, water, space and mineral ions. A tall plant shades a small seedling of another species, and their roots reach into the same soil for water and mineral ions.',
    'Animals need food, territory and mates. Two male blackbirds each have a territory, shown as dashed areas, with a worm to eat and a female blackbird nearby.',
    'Competition. The tall plant and the seedling, two different species, compete for light, water and mineral ions. The two male blackbirds, the same species, compete for food, territory and mates.',
  ]
  const leftOn = step !== 2, rightOn = step !== 1
  return <Diagram title={titles[step]}>
    <Fade on={leftOn}>
      <rect x={8} y={8} width={256} height={286} rx={14} fill="#f3f9ef" stroke="#cfe3c4" strokeWidth="1.5" />
      {step !== 3 && <Title x={22} y={32} text="Plants need…" />}
      <Sun x={44} y={78} r={14} />
      {[[62, 90, 92, 118], [66, 80, 104, 96]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={sunFill} width={2.4} />)}
      <path d="M150 104L236 222H176Z" fill="#5a6f7c" opacity=".08" />
      <path d="M8 222H264V280Q264 294 250 294H22Q8 294 8 280Z" fill={soil} />
      <path d="M120 222C118 180 124 140 120 96" stroke={green} strokeWidth="5" fill="none" strokeLinecap="round" />
      {[[120, 190, -1], [120, 160, 1], [121, 130, -1], [120, 110, 1]].map(([x, y, d], i) => <ellipse key={i} cx={x + d * 22} cy={y} rx={22} ry={8} transform={`rotate(${d * -18} ${x + d * 22} ${y})`} fill={leafFill} stroke={green} strokeWidth="1.6" />)}
      <circle cx={120} cy={90} r={9} fill="#f2c230" stroke={sunLine} strokeWidth="1.4" />
      <path d="M200 222V204" stroke={green} strokeWidth="2.4" /><path d="M200 208q-10 -8 -15 -1q7 6 15 1zM200 206q10 -8 15 -1q-7 6 -15 1z" fill={leafFill} stroke={green} strokeWidth="1.2" />
      <g stroke={P.root} strokeWidth="2.2" fill="none" strokeLinecap="round"><path d="M120 222C118 242 124 256 120 272M120 230C104 240 92 250 84 264M121 232C138 242 150 252 164 262" /><path d="M200 222C198 234 204 244 200 254M200 228C188 236 180 242 172 250" /></g>
      {[[98, 250], [148, 276], [186, 262], [60, 270]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={.8} />)}
      {[[76, 244], [140, 252], [178, 240], [232, 250]].map(([x, y], i) => <Mineral key={i} x={x} y={y} />)}
      <Chip x={22} y={156} text="light" colour={lightInk} anchor="start" />
      <Chip x={236} y={186} text="space" colour={green} anchor="end" />
      <Chip x={20} y={210} text="water" colour={waterDeep} anchor="start" /><Chip x={256} y={283} text="mineral ions" colour={mineral} anchor="end" />
    </Fade>
    <Fade on={rightOn}>
      <rect x={276} y={8} width={256} height={286} rx={14} fill="#fbf6ee" stroke="#eadcc6" strokeWidth="1.5" />
      {step !== 3 && <Title x={290} y={32} text="Animals need…" />}
      <path d="M276 238H532V280Q532 294 518 294H290Q276 294 276 280Z" fill={grassFill} />
      <ellipse cx={336} cy={238} rx={52} ry={22} fill="none" stroke={primary} strokeWidth="1.6" strokeDasharray="5 4" />
      <ellipse cx={470} cy={238} rx={52} ry={22} fill="none" stroke={primary} strokeWidth="1.6" strokeDasharray="5 4" />
      <At x={350} y={236} s={1.3}><Blackbird /></At><At x={456} y={236} s={1.3} flip><Blackbird /></At>
      <path d="M394 238q5 -6 10 0t10 0" stroke="#c77b8f" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M380 120H520" stroke="#9b7650" strokeWidth="4" strokeLinecap="round" /><At x={470} y={120} s={1.2} flip><Blackbird female /></At>
      <Chip x={404} y={272} text="food" colour={secondary} />
      <Chip x={290} y={170} text="territory" colour={primary} anchor="start" />
      <Chip x={420} y={100} text="mates" colour={tertiary} anchor="end" />
    </Fade>
    {step === 3 && <><circle cx={190} cy={122} r={17} fill="white" stroke={warm} strokeWidth="2" /><text x={190} y={127} textAnchor="middle" fill={warm} fontSize="13" fontWeight="700">vs</text>
      <rect x={24} y={16} width={224} height={24} rx={12} fill="white" stroke={warm} strokeWidth="1.5" /><text x={136} y={33} textAnchor="middle" fill={warm} fontSize="12.5" fontWeight="700">other species compete</text>
      <circle cx={404} cy={206} r={17} fill="white" stroke={warm} strokeWidth="2" /><text x={404} y={211} textAnchor="middle" fill={warm} fontSize="13" fontWeight="700">vs</text>
      <rect x={292} y={16} width={224} height={24} rx={12} fill="white" stroke={warm} strokeWidth="1.5" /><text x={404} y={33} textAnchor="middle" fill={warm} fontSize="12.5" fontWeight="700">same species compete</text></>}
  </Diagram>
}

// ---------- Lesson 51: interdependence and the pond food web ----------
function Depend() {
  const tile = (x: number, y: number, title: string, body: ReactNode) => <g><rect x={x} y={y} width={254} height={136} rx={12} fill="#f7fafc" stroke="#cfdde7" strokeWidth="1.5" /><text x={x + 14} y={y + 24} fill={ink} fontSize="14" fontWeight="700">{title}</text>{body}</g>
  return <Diagram title="Four ways species depend on each other. Food: a blue tit eats a caterpillar. Shelter: birds nest in a tree. Pollination: a bee carries pollen from one flower to another. Seed dispersal: a bird eats berries and drops the seeds far away, where a new plant grows.">
    {tile(8, 8, 'food', <g><path d="M60 118Q140 104 240 112" stroke="#9b7650" strokeWidth="4" fill="none" strokeLinecap="round" /><At x={150} y={108} s={1.6}><BlueTit /></At><At x={196} y={82} s={.8}><Caterpillar /></At></g>)}
    {tile(278, 8, 'shelter', <g><Tree x={404} y={136} s={.9} seed={11} /><path d="M388 76q16 12 32 0" fill="#b08a5c" stroke="#7a5a36" strokeWidth="1.5" />{[398, 408].map(x => <ellipse key={x} cx={x} cy={74} rx={4} ry={3} fill="#cfe6f2" stroke={ink} strokeWidth=".8" />)}<At x={456} y={60} s={.9} flip><BlueTit /></At></g>)}
    {tile(8, 156, 'pollination', <g><At x={70} y={284} s={1.4}><Flower petal="#f3b5c8" /></At><At x={206} y={284} s={1.4}><Flower petal="#f3b5c8" /></At><path d="M86 236Q140 200 186 236" stroke={sugar} strokeWidth="1.6" strokeDasharray="4 4" fill="none" /><At x={140} y={222} s={1.3}><Bee /></At>{[[120, 214], [126, 220], [160, 218]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} fill={sunFill} stroke={sunLine} strokeWidth=".6" />)}</g>)}
    {tile(278, 156, 'seed dispersal', <g><path d={blob(326, 250, 34, 26, 4, .12)} fill="#8fc27d" stroke={green} strokeWidth="1.8" />{[[312, 240], [330, 234], [340, 252], [318, 258]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#b8453a" stroke="#7d2a24" strokeWidth=".8" />)}<path d="M384 238Q400 226 414 234" stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" /><At x={430} y={250} s={1.25}><Blackbird /></At><circle cx={458} cy={223} r={3.4} fill="#b8453a" stroke="#7d2a24" strokeWidth=".8" /><path d="M456 252Q474 262 486 266" stroke={ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" /><path d="M492 282V270" stroke={green} strokeWidth="2" /><path d="M492 272q-7 -6 -11 -1q5 5 11 1zM492 271q7 -6 11 -1q-5 5 -11 1z" fill={leafFill} stroke={green} strokeWidth="1" /><circle cx={486} cy={266} r={2.4} fill="#7a5a36" /></g>)}
  </Diagram>
}
type WebNode = { id: string; name: string; x: number; y: number; icon: ReactNode; producer?: boolean }
const pondWeb: WebNode[] = [
  { id: 'heron', name: 'heron', x: 132, y: 38, icon: <At x={0} y={14} s={.42}><Heron /></At> },
  { id: 'fish', name: 'sticklebacks', x: 132, y: 118, icon: <At x={0} y={2}><Stickleback /></At> },
  { id: 'beetle', name: 'water beetles', x: 408, y: 118, icon: <At x={-2} y={5}><Beetle /></At> },
  { id: 'nymph', name: 'mayfly nymphs', x: 132, y: 198, icon: <At x={2} y={5}><Nymph /></At> },
  { id: 'snail', name: 'snails', x: 408, y: 198, icon: <At x={-2} y={10} s={.9}><Snail /></At> },
  { id: 'algae', name: 'algae', x: 270, y: 270, icon: <Algae x={0} y={0} n={8} seed={5} />, producer: true },
]
const pondLinks: Array<[string, string, number, number, number, number]> = [
  ['algae', 'nymph', 214, 248, 184, 222], ['algae', 'snail', 326, 248, 356, 222], ['nymph', 'fish', 132, 176, 132, 142],
  ['nymph', 'beetle', 218, 186, 320, 130], ['snail', 'beetle', 408, 176, 408, 142], ['fish', 'heron', 132, 96, 132, 62],
]
function WebBox({ node, dim = false }: { node: WebNode; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={node.x - 86} y={node.y - 22} width={172} height={44} rx={12} fill={node.producer ? '#eef7ea' : 'white'} stroke={node.producer ? producer : '#9fb4c2'} strokeWidth="1.8" />
    <g transform={`translate(${node.x - 58} ${node.y})`}>{node.icon}</g>
    <text x={node.x - 30} y={node.y + 5} fill={ink} fontSize="13.5" fontWeight="700">{node.name}</text>
  </g>
}
function FoodWeb({ focus }: { focus: string }) {
  const removed = focus === 'eco-web-remove'
  return <Diagram viewBox="0 0 540 300" title={removed ? 'The pond food web with the mayfly nymphs crossed out. Sticklebacks have less food, so their numbers may fall. Snails have more algae to themselves, so their numbers may rise.' : 'A pond food web. Arrows point from the organism eaten to the one that eats it: algae to mayfly nymphs and to snails; mayfly nymphs to sticklebacks and to water beetles; snails to water beetles; sticklebacks to the heron.'}>
    {pondWeb.map(node => <WebBox key={node.id} node={node} dim={removed && node.id === 'nymph'} />)}
    {pondLinks.map(([from, to, x1, y1, x2, y2]) => <g key={from + to} opacity={removed && (from === 'nymph' || to === 'nymph') ? faded : 1}><Arrow x1={x1} y1={y1} x2={x2} y2={y2} colour={ink} width={2.2} /></g>)}
    {removed && <><Cross x={74} y={198} r={16} />
      <text x={230} y={112} fill={secondary} fontSize="13" fontWeight="700"><tspan x={230}>less food:</tspan><tspan x={230} dy={16}>may fall ↓</tspan></text>
      <text x={366} y={250} fill={green} fontSize="13" fontWeight="700">more algae: may rise ↑</text></>}
    {!removed && <text x={530} y={40} textAnchor="end" fill={muted} fontSize="12"><tspan x={530}>arrow points</tspan><tspan x={530} dy={15}>to the eater</tspan></text>}
  </Diagram>
}
function Stable() {
  const snails = [118, 124, 115, 121, 126, 117, 122, 119, 125, 120], fish = [52, 48, 55, 50, 46, 53, 49, 54, 51, 48]
  const X = (i: number) => 86 + i * 44, Y = (v: number) => 250 - v * 1.3
  return <Diagram title="A line graph of two populations in a stable pond over 10 years. Snails stay between about 115 and 126, and sticklebacks between about 46 and 55. Each goes up and down a little but stays about the same.">
    <Title text="Numbers counted in a stable pond" />
    <path d="M70 250H510M70 250V48" stroke={ink} strokeWidth="2" />
    {[0, 50, 100, 150].map(v => <g key={v}><path d={`M64 ${Y(v)}h6`} stroke={ink} /><text x={60} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {snails.map((_, i) => <g key={i}><path d={`M${X(i)} 250v6`} stroke={ink} /><text x={X(i)} y={270} textAnchor="middle" fontSize="12" fill={ink}>{i + 1}</text></g>)}
    <text x={290} y={292} textAnchor="middle" fontSize="12" fill={ink}>year</text>
    <text x={20} y={150} fontSize="12" fill={ink} transform="rotate(-90 20 150)" textAnchor="middle">number counted</text>
    <path d={snails.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join('')} stroke={primary} strokeWidth="3" fill="none" />
    <path d={fish.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join('')} stroke={waterDeep} strokeWidth="3" fill="none" />
    <text x={X(9)} y={Y(125) - 12} textAnchor="end" fill={primary} fontSize="13" fontWeight="700">snails</text>
    <text x={X(9)} y={Y(48) + 24} textAnchor="end" fill={waterDeep} fontSize="13" fontWeight="700">sticklebacks</text>
    <text x={290} y={Y(90)} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">up and down a little, but about the same</text>
  </Diagram>
}

// ---------- Lesson 51: questions ----------
function Meadow({ assessment }: { assessment: boolean }) {
  const rabbits: Array<[number, number, boolean]> = [[136, 238, false], [196, 264, true], [256, 236, false], [316, 262, true]]
  const marks: Array<{ n: number; b: Pt; to: Pt; name: string }> = [
    { n: 1, b: [118, 40], to: [78, 52], name: 'the Sun' },
    { n: 2, b: [78, 170], to: [128, 224], name: 'one rabbit' },
    { n: 3, b: [404, 238], to: [360, 238], name: 'all the rabbits' },
    { n: 4, b: [504, 34], to: [480, 70], name: 'all the living things' },
  ]
  return <Diagram title={assessment ? 'A meadow with the Sun, grass, daisies, a tree, a bird and four rabbits. Four numbered labels point to different parts of the picture: label 1 at the top left, label 2 at one rabbit, label 3 at a dashed ring, label 4 at a larger dashed box.' : 'A meadow. Label 1 is the Sun, which is not living. Label 2 is one rabbit, an organism. Label 3 is a dashed ring round all the rabbits, a population. Label 4 is a dashed box round all the living things, a community.'}>
    <Sun x={60} y={52} r={16} />
    <path d="M0 168Q140 156 270 166T540 162V300H0Z" fill={grassFill} />
    {[[40, 200], [96, 262], [320, 210], [372, 276], [456, 262], [120, 290], [300, 290], [500, 214]].map(([x, y], i) => <Tuft key={i} x={x} y={y} colour={grassLine} />)}
    {[[62, 262], [410, 284], [50, 214], [372, 190], [496, 288]].map(([x, y], i) => <At key={i} x={x} y={y} s={.8}><Flower /></At>)}
    <Tree x={452} y={206} s={.9} seed={7} /><At x={420} y={140} s={.9} flip><BlueTit /></At>
    {rabbits.map(([x, y, f], i) => <At key={i} x={x} y={y} s={.85} flip={f}><Rabbit /></At>)}
    <ellipse cx={228} cy={238} rx={132} ry={48} fill="none" stroke={secondary} strokeWidth="2" strokeDasharray="6 5" />
    <rect x={26} y={70} width={496} height={222} rx={18} fill="none" stroke={green} strokeWidth="2" strokeDasharray="6 5" />
    {marks.map(m => <g key={m.n}><path d={`M${m.b[0]} ${m.b[1]}L${m.to[0]} ${m.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={m.to[0]} cy={m.to[1]} r="2.6" fill={ink} /><Badge n={m.n} x={m.b[0]} y={m.b[1]} />
      {!assessment && <text x={m.b[0] + (m.n === 4 ? -18 : 18)} y={m.b[1] + 5} textAnchor={m.n === 4 ? 'end' : 'start'} fill={ink} fontSize="13" fontWeight="700">{m.name}</text>}</g>)}
  </Diagram>
}
function Hedgehogs() {
  const counts = [38, 41, 36, 40, 39, 42]
  const X = (i: number) => 110 + i * 70, Y = (v: number) => 250 - v * 3.8
  return <Diagram title="Bar chart of hedgehogs counted in one park each year for six years: year 1, 38; year 2, 41; year 3, 36; year 4, 40; year 5, 39; year 6, 42.">
    <Title text="Hedgehogs counted in one park" />
    <path d="M70 250H510M70 250V48" stroke={ink} strokeWidth="2" />
    {[0, 10, 20, 30, 40, 50].map(v => <g key={v}><path d={`M64 ${Y(v)}h6`} stroke={ink} /><text x={60} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {counts.map((c, i) => <g key={i}><rect x={X(i) - 20} y={Y(c)} width={40} height={250 - Y(c)} fill="#d8c3a4" stroke={primary} strokeWidth="1.6" /><text x={X(i)} y={Y(c) - 6} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>{c}</text><text x={X(i)} y={268} textAnchor="middle" fontSize="12" fill={ink}>{i + 1}</text></g>)}
    <text x={290} y={290} textAnchor="middle" fontSize="12" fill={ink}>year</text>
    <text x={22} y={150} fontSize="12" fill={ink} transform="rotate(-90 22 150)" textAnchor="middle">number of hedgehogs</text>
  </Diagram>
}

// ---------- Lesson 52: abiotic factors ----------
function FieldAndPond({ lit }: { lit: (group: 'weather' | 'soil' | 'gases') => boolean }) {
  return <g>
    <Fade on={lit('weather')}>
      <Sun x={50} y={46} r={16} /><Chip x={50} y={96} text="light" colour={lightInk} />
      <Thermometer x={150} y={52} /><Chip x={150} y={96} text="temperature" colour={warm} />
      <path d={blob(266, 42, 38, 18, 8, .1)} fill="#eef2f5" stroke="#9fb0bd" strokeWidth="1.6" />{[252, 268, 284].map(x => <path key={x} d={`M${x} 64l-4 10`} stroke={water} strokeWidth="2.2" strokeLinecap="round" />)}
      <Chip x={266} y={96} text="moisture" colour={waterDeep} />
      {[34, 48, 62].map((y, i) => <path key={y} d={`M${346 + i * 6} ${y}q14 -6 28 0t28 0`} stroke="#7d93a3" strokeWidth="2" fill="none" strokeLinecap="round" />)}
      <Arrow x1={416} y1={48} x2={446} y2={48} colour="#7d93a3" width={2.2} /><Chip x={384} y={96} text="wind" colour="#5b7a90" />
    </Fade>
    <path d="M0 170Q120 160 250 168T540 166V300H0Z" fill={grassFill} />
    <Fade on={lit('soil')}>
      <path d="M0 222H330V300H0Z" fill={soil} /><path d="M0 222H330" stroke={soilLine} strokeWidth="1.5" />
      {[[30, 248], [80, 272], [130, 244], [190, 280], [250, 250], [300, 276], [160, 262]].map(([x, y], i) => <Mineral key={i} x={x} y={y} />)}
      <Chip x={110} y={292} text="soil pH and minerals" colour={mineral} />
    </Fade>
    {[[40, 222], [150, 220], [210, 222], [270, 220], [306, 222]].map(([x, y], i) => <Tuft key={i} x={x} y={y} s={1.3} colour={green} />)}
    {[[96, 224], [180, 222], [250, 224]].map(([x, y], i) => <At key={i} x={x} y={y}><Flower /></At>)}
    <At x={140} y={220} s={.9}><Rabbit /></At>
    <path d="M340 190Q430 176 530 190V282Q430 296 340 282Z" fill={waterFill} stroke={water} strokeWidth="2" />
    <At x={420} y={244} s={1.2}><Stickleback /></At><At x={480} y={264} flip><Stickleback /></At>
    <Fade on={lit('gases')}>
      <CO2 x={214} y={152} /><Chip x={214} y={134} text="carbon dioxide" colour={co2} />
      {[[436, 226], [442, 212], [450, 200], [466, 248], [470, 236]].map(([x, y], i) => <Bubble key={i} x={x} y={y} r={3.4} />)}
      <Chip x={436} y={150} text="oxygen in water" colour={teal} />
    </Fade>
  </g>
}
function Abiotic({ focus }: { focus: string }) {
  if (focus === 'eco-abiotic-chain') return <AbioticChain />
  const step = focus.replace('eco-abiotic-', '')
  const titles: Record<string, string> = {
    all: 'A field next to a pond, with the abiotic (non-living) factors labelled: light, temperature, moisture, wind, soil pH and minerals, carbon dioxide in the air, and oxygen in the water.',
    weather: 'The same field and pond with light, temperature, moisture and wind highlighted; the other factors are faded.',
    soil: 'The same field and pond with the soil highlighted: its pH and the mineral ions in it.',
    gases: 'The same field and pond with the gases highlighted: carbon dioxide in the air for plants, and oxygen dissolved in the water for fish.',
  }
  return <Diagram title={titles[step] || titles.all}>
    <FieldAndPond lit={g => step === 'all' || g === step} />
  </Diagram>
}
function AbioticChain() {
  const panel = (x: number, title: string[], body: ReactNode) => <g><rect x={x} y={40} width={150} height={170} rx={14} fill="#f7fafc" stroke="#cfdde7" strokeWidth="1.5" />{body}<text x={x + 75} y={236} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{title.map((t, i) => <tspan key={t} x={x + 75} dy={i ? 16 : 0}>{t}</tspan>)}</text></g>
  const down = (x: number) => <g><circle cx={x} cy={60} r={13} fill="white" stroke={warm} strokeWidth="2" /><path d={`M${x} 52V67M${x - 5} 62L${x} 67L${x + 5} 62`} stroke={warm} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
  return <Diagram title="A chain of three panels. First, the soil has fewer mineral ions. Arrow to: the grass grows less well, so there is less of it. Arrow to: the rabbits that eat the grass have less food, so their population may fall.">
    {panel(14, ['fewer mineral ions', 'in the soil'], <g><rect x={30} y={120} width={118} height={74} rx={8} fill={soil} stroke={soilLine} />{[[58, 150], [118, 172]].map(([x, y], i) => <Mineral key={i} x={x} y={y} />)}{down(130)}</g>)}
    {panel(195, ['grass grows', 'less well'], <g><path d="M210 180H330" stroke={soilLine} strokeWidth="2" />{[232, 268, 304].map((x, i) => <Tuft key={x} x={x} y={180} s={1.1 - i * .15} colour={green} />)}<path d={`M252 180q-2 -12 4 -20`} stroke="#b9a468" strokeWidth="1.8" fill="none" />{down(311)}</g>)}
    {panel(376, ['rabbits have', 'less food'], <g><At x={450} y={180} s={1.3}><Rabbit /></At><path d="M394 180H510" stroke={soilLine} strokeWidth="2" />{down(492)}</g>)}
    <Arrow x1={168} y1={125} x2={190} y2={125} colour={ink} width={2.6} /><Arrow x1={349} y1={125} x2={371} y2={125} colour={ink} width={2.6} />
    <text x={270} y={286} textAnchor="middle" fill={ink} fontSize="13">One non-living change can spread to many species.</text>
  </Diagram>
}

// ---------- Lesson 52: biotic factors ----------
function Biotic({ focus }: { focus: string }) {
  const step = focus.replace('eco-biotic-', '')
  const on = (g: string) => step === 'all' || step === g
  const titles: Record<string, string> = {
    all: 'A wood with the biotic (living) factors labelled: food (nuts and acorns on the ground), a predator (a fox), pathogens (microorganisms shown enlarged in a circle), and competition between a red squirrel and a grey squirrel.',
    food: 'The wood with the nuts and acorns highlighted: the food available for squirrels.',
    predators: 'The wood with the fox highlighted: a new predator that hunts squirrels.',
    pathogens: 'The wood with the pathogens highlighted: microorganisms, shown enlarged in a circle, that could spread a new disease.',
    competition: 'The wood with the red and grey squirrels highlighted. Both want the same nuts and the same shelter; the grey squirrel outcompetes the red squirrel.',
  }
  return <Diagram title={titles[step] || titles.all}>
    <path d="M0 226Q140 216 270 224T540 222V300H0Z" fill="#eef3df" />
    <Tree x={70} y={232} s={1.3} fill="#8fc27d" seed={5} /><Tree x={470} y={232} s={1.05} fill="#9fcb86" seed={12} />
    <Fade on={on('food')}>{[[196, 262], [222, 270], [250, 258], [236, 284], [270, 276], [208, 286]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={6} ry={7.5} fill="#b98a4a" stroke="#7a5530" strokeWidth="1.2" /><path d={`M${x - 6} ${y - 4}q6 -6 12 0`} fill="#8a6440" stroke="#7a5530" strokeWidth="1.2" /></g>)}<Chip x={236} y={214} text="food" colour={primary} /></Fade>
    <Fade on={on('competition')}>
      <At x={170} y={262} s={1.3}><Squirrel /></At><At x={310} y={264} s={1.3} flip><Squirrel fur="#a3abb1" line="#646d74" tufts={false} /></At>
      <text x={150} y={296} textAnchor="middle" fill="#86401f" fontSize="12.5" fontWeight="700">red squirrel</text><text x={330} y={296} textAnchor="middle" fill="#646d74" fontSize="12.5" fontWeight="700">grey squirrel</text>
      {step === 'competition' && <><circle cx={240} cy={240} r={0} /><Chip x={240} y={178} text="grey outcompetes red" colour={warm} /></>}
      {step === 'all' && <Chip x={240} y={178} text="competition" colour={warm} />}
    </Fade>
    <Fade on={on('predators')}><At x={432} y={272} s={1.1} flip><Fox /></At><Chip x={420} y={196} text="predators" colour={secondary} /></Fade>
    <Fade on={on('pathogens')}>
      <circle cx={200} cy={68} r={40} fill="#fbf3f7" stroke="#b8467f" strokeWidth="2" />
      <Microbe x={186} y={56} a={20} /><Microbe x={212} y={78} a={-30} /><Microbe x={196} y={90} a={70} /><Microbe x={218} y={48} a={-80} />
      <path d="M184 105L148 190" stroke="#b8467f" strokeWidth="1.3" strokeDasharray="4 4" /><circle cx={148} cy={190} r={2.6} fill="#b8467f" />
      <Chip x={252} y={60} text="pathogens" colour="#b8467f" anchor="start" /><text x={252} y={88} fill={muted} fontSize="12">enlarged</text>
    </Fade>
  </Diagram>
}

// ---------- Lesson 52: adaptations ----------
function Adaptations({ focus }: { focus: string }) {
  const step = focus.replace('eco-adapt-', '')
  const on = (t: string) => step === 'all' || step === t
  const tile = (key: string, x: number, y: number, bg: string, title: string, caption: string[], body: ReactNode) => <Fade key={key} on={on(key)}>
    <rect x={x} y={y} width={256} height={138} rx={12} fill={bg} stroke={step === key ? ink : '#cfdde7'} strokeWidth={step === key ? 2.4 : 1.5} />
    {body}
    <text x={x + 12} y={y + 22} fill={ink} fontSize="14" fontWeight="700">{title}</text>
    <text x={x + 244} y={y + 104} textAnchor="end" fill={ink} fontSize="12.5">{caption.map((c, i) => <tspan key={c} x={x + 244} dy={i ? 15 : 0}>{c}</tspan>)}</text>
  </Fade>
  const titles: Record<string, string> = {
    all: 'Four tiles. Structural: an Arctic fox with white fur on snow. Behavioural: swallows flying to a warmer place before winter. Functional: a desert gerbil that makes little sweat and small amounts of concentrated urine. Extremophiles: microorganisms living around a hot volcanic vent deep in the sea.',
    structural: 'Structural adaptation: an Arctic fox with white fur lies on snow, hard to see.', behavioural: 'Behavioural adaptation: swallows fly to a warmer place before winter.',
    functional: 'Functional adaptation: a desert animal makes very little sweat and only a small amount of concentrated urine.', extreme: 'Extremophiles: microorganisms living in very hot water around a volcanic vent at high pressure deep in the sea.',
  }
  return <Diagram viewBox="0 0 540 300" title={titles[step] || titles.all}>
    {tile('structural', 8, 8, '#eef4f8', 'structural', ['white fur: hard to', 'see against snow'], <g><path d="M8 110Q70 92 140 104T264 100V134Q264 146 252 146H20Q8 146 8 134Z" fill="white" stroke="#c9d6df" /><At x={92} y={108} s={1.05}><Fox fur="#f8fafc" line="#8d9ca8" dark="#c3ccd3" tip="#f8fafc" /></At></g>)}
    {tile('behavioural', 276, 8, '#f3f7fb', 'behavioural', ['flies to a warmer', 'place before winter'], <g><path d="M296 100Q380 40 488 70" stroke={ink} strokeWidth="1.8" strokeDasharray="5 5" fill="none" /><Arrow x1={470} y1={64} x2={494} y2={72} colour={ink} width={1.8} /><At x={330} y={80} s={.9}><Swallow /></At><At x={376} y={58} s={.9}><Swallow /></At><Sun x={500} y={40} r={10} /><text x={292} y={126} fill={waterDeep} fontSize="12.5" fontWeight="700">cold</text></g>)}
    {tile('functional', 8, 154, '#fbf2e2', 'functional', ['little sweat, a little', 'concentrated urine'], <g><path d="M8 262Q80 250 160 258T264 256V280Q264 292 252 292H20Q8 292 8 280Z" fill="#f1dcae" /><At x={104} y={262} s={1.5}><Gerbil /></At></g>)}
    {tile('extreme', 276, 154, '#e3edf6', 'extremophiles', ['very hot, very salty', 'or high pressure'], <g><path d="M276 280H532V280Q532 292 520 292H288Q276 292 276 280Z" fill="#b9c6d2" /><path d="M318 282L328 222H348L360 282Z" fill="#6f6a66" stroke="#4d4845" strokeWidth="1.5" /><path d="M338 220C330 206 346 196 336 182C330 172 340 166 338 160" stroke="#555" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".55" />{[[304, 250, 10], [368, 238, -40], [380, 266, 60], [300, 272, -20]].map(([x, y, a], i) => <Microbe key={i} x={x} y={y} a={a} />)}<Thermometer x={410} y={226} /></g>)}
  </Diagram>
}
function Fennec({ assessment }: { assessment: boolean }) {
  const marks: Array<{ n: number; b: Pt; to: Pt; name: string }> = [
    { n: 1, b: [110, 150], to: [250, 202], name: 'sandy fur' },
    { n: 2, b: [150, 282], to: [248, 262], name: 'furry soles' },
    { n: 3, b: [440, 76], to: [360, 142], name: 'very large ears' },
  ]
  return <Diagram title={assessment ? 'A fennec fox standing on desert sand, with three numbered pointers: 1 to its body, 2 to its feet, 3 to its ears.' : 'A fennec fox on desert sand: 1 sandy fur, 2 furry soles, 3 very large ears.'}>
    <Sun x={52} y={50} r={18} />
    <path d="M0 244Q140 226 270 238T540 232V300H0Z" fill="#f1dcae" /><path d="M30 270q40 -8 80 0M380 262q50 -8 100 0" stroke="#dcbf86" strokeWidth="2" fill="none" />
    <At x={280} y={264} s={2.6}><Fox fur="#e6c58f" line="#a57c45" bigEars dark="#c9a26a" tip="#fbf1de" /></At>
    {marks.map(m => <g key={m.n}><path d={`M${m.b[0]} ${m.b[1]}L${m.to[0]} ${m.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={m.to[0]} cy={m.to[1]} r="2.8" fill={ink} /><Badge n={m.n} x={m.b[0]} y={m.b[1]} />
      {!assessment && <text x={m.b[0] - 18} y={m.b[1] + 5} textAnchor="end" fill={ink} fontSize="13" fontWeight="700">{m.name}</text>}</g>)}
  </Diagram>
}
function SquirrelData() {
  const counts = [48, 50, 47, 38, 30, 24, 19, 16]
  const X = (i: number) => 96 + i * 56, Y = (v: number) => 250 - v * 3.4
  return <Diagram title="Line graph of red squirrels counted in one wood over 8 years: 48, 50, 47, 38, 30, 24, 19 and 16. A dashed line at year 3 marks when grey squirrels arrived.">
    <Title text="Red squirrels counted in one wood" />
    <path d="M70 250H510M70 250V60" stroke={ink} strokeWidth="2" />
    {[0, 10, 20, 30, 40, 50].map(v => <g key={v}><path d={`M64 ${Y(v)}h6`} stroke={ink} /><text x={60} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {counts.map((_, i) => <g key={i}><path d={`M${X(i)} 250v6`} stroke={ink} /><text x={X(i)} y={270} textAnchor="middle" fontSize="12" fill={ink}>{i + 1}</text></g>)}
    <text x={290} y={292} textAnchor="middle" fontSize="12" fill={ink}>year</text>
    <text x={22} y={160} fontSize="12" fill={ink} transform="rotate(-90 22 160)" textAnchor="middle">number of red squirrels</text>
    <path d={`M${X(2)} 250V70`} stroke="#7d8a93" strokeWidth="1.6" strokeDasharray="5 5" /><text x={X(2) + 8} y={62} fill="#646d74" fontSize="12.5" fontWeight="700">grey squirrels arrive</text>
    <path d={counts.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join('')} stroke="#c0643a" strokeWidth="3" fill="none" />
    {counts.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r="4" fill="#c0643a" />)}
  </Diagram>
}

// ---------- Lesson 53: the woodland food chain ----------
const chainX = [80, 205, 330, 462]
const roleColour = [producer, primary, secondary, tertiary]
const roleName = ['producer', 'primary consumer', 'secondary consumer', 'tertiary consumer']
/** A feeding-role tag: one or two short lines in a rounded box, so four tags fit side by side. */
function RoleTag({ x, y, i }: { x: number; y: number; i: number }) {
  const lines = i === 0 ? ['producer'] : [roleName[i].split(' ')[0], 'consumer'], h = lines.length === 1 ? 22 : 36
  return <g><rect x={x - 48} y={y - 13} width={96} height={h} rx={10} fill="white" stroke={roleColour[i]} strokeWidth="1.6" />
    <text x={x} y={y + 2} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={roleColour[i]}>{lines.map((l, k) => <tspan key={l} x={x} dy={k ? 15 : 0}>{l}</tspan>)}</text></g>
}
function OakTwig() {
  return <g><path d="M-36 20Q0 10 34 -14" stroke="#8a6440" strokeWidth="4" fill="none" strokeLinecap="round" /><OakLeaf x={-20} y={16} a={-60} s={.9} /><OakLeaf x={2} y={8} a={-10} s={1} /><OakLeaf x={20} y={-4} a={40} s={.85} /><circle cx={-8} cy={22} r={4.6} fill="#b98a4a" stroke="#7a5530" /></g>
}
function Chain({ focus }: { focus: string }) {
  const step = focus.replace('eco-chain-', '')
  const lit = (i: number) => ({ producer: i === 0, biomass: i === 0, arrows: true, consumers: i > 0, primary: i <= 1, secondary: i <= 2, tertiary: true, all: true }[step] ?? true)
  const roleShown = (i: number) => ({ producer: i === 0, biomass: i === 0, arrows: i === 0, consumers: i === 0, primary: i <= 1, secondary: i <= 2, tertiary: true, all: true }[step] ?? true)
  const current = { producer: 0, biomass: 0, primary: 1, secondary: 2, tertiary: 3 }[step] ?? -1
  const arrowsOn = step !== 'producer' && step !== 'biomass'
  const titles: Record<string, string> = {
    producer: 'A woodland food chain with only the oak leaves highlighted. Light from the Sun reaches the leaves, which make glucose by photosynthesis: the oak is the producer.',
    biomass: 'The oak twig highlighted. Some glucose made in the leaves is used to build new leaves, wood and roots: the tree’s biomass.',
    arrows: 'The food chain: oak leaves, arrow to caterpillar, arrow to blue tit, arrow to sparrowhawk. Each arrow points to the eater, and biomass passes along the chain.',
    consumers: 'The food chain with the caterpillar, blue tit and sparrowhawk highlighted as consumers: organisms that eat other organisms.',
    primary: 'The caterpillar is labelled as the primary consumer: it eats the producer, the oak leaves.',
    secondary: 'The blue tit is labelled as the secondary consumer: it eats the primary consumer, the caterpillar.',
    tertiary: 'The sparrowhawk is labelled as the tertiary consumer: it eats the secondary consumer, the blue tit.',
    all: 'The whole food chain labelled: oak leaves, producer; caterpillar, primary consumer; blue tit, secondary consumer; sparrowhawk, tertiary consumer.',
  }
  const icons = [<OakTwig key="o" />, <At key="c" x={0} y={8} s={1.6}><Caterpillar /></At>, <At key="b" x={0} y={24} s={1.7}><BlueTit /></At>, <At key="s" x={0} y={24} s={1.4}><Sparrowhawk /></At>]
  const names = ['oak leaves', 'caterpillar', 'blue tit', 'sparrowhawk']
  return <Diagram title={titles[step] || titles.all}>
    <Fade on={step === 'producer' || step === 'biomass' || step === 'all'}><Sun x={40} y={40} r={15} /></Fade>
    {(step === 'producer' || step === 'all') && [[58, 56, 70, 96], [62, 48, 92, 92]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={sunFill} width={2.4} />)}
    {chainX.map((x, i) => <g key={i}>
      <Fade on={lit(i)}><g transform={`translate(${x} 140)`}>{icons[i]}</g><text x={x} y={200} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700">{names[i]}</text></Fade>
      {current === i && <circle cx={x} cy={138} r={50} fill="none" stroke={roleColour[i]} strokeWidth="2.2" strokeDasharray="5 5" />}
      {roleShown(i) && <RoleTag x={x} y={228} i={i} />}
      {i < 3 && <Fade on={arrowsOn}><Arrow x1={x + [40, 48, 42][i]} y1={140} x2={chainX[i + 1] - [46, 50, 52][i]} y2={140} colour={ink} width={2.6} /></Fade>}
    </g>)}
    {step === 'producer' && <Label x={130} y={70} lines={['makes glucose by', 'photosynthesis']} strong colour={green} />}
    {step === 'biomass' && <g><path d="M114 96Q140 72 176 72" stroke={sugar} strokeWidth="2" fill="none" strokeDasharray="4 3" /><path d={`M${106} 110l7 -4v-8l-7 -4l-7 4v8z`} fill={sugarFill} stroke={sugar} strokeWidth="1.6" /><Label x={184} y={66} lines={['glucose → new leaves,', 'wood and roots']} strong colour={sugar} /><text x={184} y={104} fill={green} fontSize="13" fontWeight="700">= biomass</text></g>}
    {step === 'arrows' && <text x={270} y={276} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">each arrow points to the eater: biomass passes along</text>}
    {step === 'consumers' && <g><path d="M160 76V64H508V76" stroke={ink} strokeWidth="1.8" fill="none" /><text x={334} y={54} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">consumers: eat other organisms</text></g>}
    {step === 'all' && <text x={270} y={276} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">count along the arrows from the producer</text>}
  </Diagram>
}
function PondChain({ assessment }: { assessment: boolean }) {
  const xs = [76, 206, 336, 466]
  const icons = [<Algae key="a" x={0} y={0} n={12} seed={4} />, <At key="n" x={0} y={8} s={1.8}><Nymph /></At>, <At key="f" x={0} y={4} s={2}><Stickleback /></At>, <At key="h" x={0} y={44} s={.9}><Heron /></At>]
  const names = ['algae', 'mayfly nymph', 'stickleback', 'heron']
  return <Diagram viewBox="0 0 540 260" title={assessment ? 'A pond food chain with four numbered organisms joined by arrows: 1 algae, 2 mayfly nymph, 3 stickleback, 4 heron. Each arrow points to the eater.' : 'A pond food chain: 1 algae, the producer; 2 mayfly nymph, the primary consumer; 3 stickleback, the secondary consumer; 4 heron, the tertiary consumer.'}>
    <path d="M8 82H404V150Q404 160 394 160H18Q8 160 8 150Z" fill={waterFill} stroke={water} strokeWidth="1.6" />
    <path d="M404 162H532" stroke={soilLine} strokeWidth="3" strokeLinecap="round" /><path d="M404 162H532V168H404Z" fill={grassFill} />
    {xs.map((x, i) => <g key={i}>
      <g transform={`translate(${x} 118)`}>{icons[i]}</g>
      <Badge n={i + 1} x={x} y={36} />
      <text x={x} y={186} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700">{names[i]}</text>
      {!assessment && <RoleTag x={x} y={216} i={i} />}
      {i < 3 && <Arrow x1={x + [22, 36, 34][i]} y1={118} x2={xs[i + 1] - [44, 46, 36][i]} y2={118} colour={ink} width={2.6} />}
    </g>)}
  </Diagram>
}

// ---------- Lesson 53: predator–prey cycles ----------
const cycX = (t: number) => 80 + t * 19.5, cycY = (n: number) => 262 - n * 1.15
const prey = (t: number) => 110 + 60 * Math.sin(2 * Math.PI * t / 10)
const predator = (t: number) => 46 + 22 * Math.sin(2 * Math.PI * (t - 2.5) / 10)
function curve(f: (t: number) => number, from: number, to: number) {
  const pts: string[] = []
  for (let t = from; t <= to + 1e-6; t += .25) pts.push(`${pts.length ? 'L' : 'M'}${cycX(t).toFixed(1)} ${cycY(f(t)).toFixed(1)}`)
  return pts.join('')
}
function Axes({ yLabel = 'number of animals' }: { yLabel?: string }) {
  return <g><path d="M70 262H516M70 262V52" stroke={ink} strokeWidth="2" /><Arrow x1={70} y1={262} x2={522} y2={262} colour={ink} width={2} /><Arrow x1={70} y1={262} x2={70} y2={46} colour={ink} width={2} />
    <text x={294} y={288} textAnchor="middle" fontSize="12.5" fill={ink}>time (years)</text>
    <text x={30} y={160} fontSize="12.5" fill={ink} transform="rotate(-90 30 160)" textAnchor="middle">{yLabel}</text></g>
}
function Cycle({ focus }: { focus: string }) {
  const step = focus.replace('eco-cycle-', '')
  const hi: Record<string, { prey?: [number, number]; pred?: [number, number]; note?: [number, number, string, string] }> = {
    rise: { prey: [0, 2.5], pred: [0, 5], note: [cycX(3.4), 30, 'more rabbits → more', 'food → foxes rise'] },
    fall: { prey: [2.5, 7.5], pred: [3, 7], note: [cycX(5.6), 30, 'lots of foxes →', 'rabbits fall'] },
    low: { prey: [7.5, 10], pred: [5, 10], note: [cycX(7.6), 30, 'fewer rabbits → foxes fall;', 'fewer foxes → rabbits rise'] },
  }
  const h = hi[step]
  const titles: Record<string, string> = {
    meet: 'A fox hunting a rabbit: the fox is the predator and the rabbit is its prey. Behind, a faint graph of their numbers over time.',
    rise: 'Graph of rabbit and fox numbers over time. Highlighted: rabbit numbers rise, then fox numbers rise, because the foxes have more food.',
    fall: 'The same graph. Highlighted: while fox numbers are high, rabbit numbers fall, because more rabbits are eaten.',
    low: 'The same graph. Highlighted: with fewer rabbits, fox numbers fall; then with fewer foxes, rabbit numbers start to rise again.',
    lag: 'Graph of rabbit and fox numbers rising and falling in cycles. There are always fewer foxes than rabbits. Each fox peak comes a while after a rabbit peak; the gap is marked as the lag.',
  }
  const dim = step === 'meet' ? .22 : h ? .3 : 1
  return <Diagram viewBox="0 0 540 322" title={titles[step] || titles.lag}>
    {step !== 'meet' && <g>
      <path d="M86 18H112" stroke={primary} strokeWidth="4" strokeLinecap="round" /><text x={120} y={23} fill={primary} fontSize="13" fontWeight="700">rabbits (prey)</text><At x={262} y={26} s={.5}><Rabbit /></At>
      <path d="M300 18H326" stroke={secondary} strokeWidth="4" strokeLinecap="round" /><text x={334} y={23} fill={secondary} fontSize="13" fontWeight="700">foxes (predators)</text><At x={506} y={26} s={.45}><Fox /></At></g>}
    <g transform="translate(0 22)">
    <g opacity={step === 'meet' ? .22 : 1}><Axes /></g>
    <path d={curve(prey, 0, 22)} stroke={primary} strokeWidth="3" fill="none" opacity={dim} />
    <path d={curve(predator, 0, 22)} stroke={secondary} strokeWidth="3" fill="none" opacity={dim} />
    {h?.prey && <path d={curve(prey, ...h.prey)} stroke={primary} strokeWidth="5.5" fill="none" strokeLinecap="round" />}
    {h?.pred && <path d={curve(predator, ...h.pred)} stroke={secondary} strokeWidth="5.5" fill="none" strokeLinecap="round" />}
    {h?.note && <Label x={h.note[0]} y={h.note[1]} lines={[h.note[2], h.note[3]]} strong />}
    {step === 'meet' && <g>
      <rect x={110} y={70} width={340} height={150} rx={16} fill="white" stroke="#cfdde7" strokeWidth="1.5" />
      <At x={210} y={176} s={1.5}><Fox /></At><At x={372} y={176} s={1.4}><Rabbit /></At>
      <Arrow x1={286} y1={150} x2={330} y2={150} colour={ink} width={2.4} /><text x={308} y={136} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="700">hunts</text>
      <text x={200} y={208} textAnchor="middle" fill={secondary} fontSize="13" fontWeight="700">predator</text><text x={372} y={208} textAnchor="middle" fill={primary} fontSize="13" fontWeight="700">prey</text>
    </g>}
    {step === 'lag' && <g>
      {[2.5, 12.5].map(t => <path key={t} d={`M${cycX(t)} ${cycY(prey(t))}V262`} stroke={primary} strokeWidth="1.4" strokeDasharray="4 4" />)}
      {[5, 15].map(t => <path key={t} d={`M${cycX(t)} ${cycY(predator(t))}V262`} stroke={secondary} strokeWidth="1.4" strokeDasharray="4 4" />)}
      <path d={`M${cycX(12.5)} 250H${cycX(15)}`} stroke={ink} strokeWidth="2" /><path d={`M${cycX(12.5)} 244v12M${cycX(15)} 244v12`} stroke={ink} strokeWidth="2" />
      <text x={cycX(13.75)} y={240} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">lag</text>
      {[2.5, 12.5].map(t => <circle key={t} cx={cycX(t)} cy={cycY(prey(t))} r={5} fill={primary} stroke="white" strokeWidth="1.5" />)}
      {[5, 15].map(t => <circle key={t} cx={cycX(t)} cy={cycY(predator(t))} r={5} fill={secondary} stroke="white" strokeWidth="1.5" />)}
      <Label x={cycX(5.4)} y={30} lines={['each fox peak comes', 'after a rabbit peak']} strong />
    </g>}
    </g>
  </Diagram>
}
function CycleQuestion() {
  const a = (t: number) => 120 + 55 * Math.sin(2 * Math.PI * (t - .8) / 9), b = (t: number) => 40 + 18 * Math.sin(2 * Math.PI * (t - 3.05) / 9)
  return <Diagram title="Graph of two populations over time, labelled line A and line B. Line A is higher and rises and falls first. Line B is lower and its peaks come a while after line A's peaks.">
    <Title x={80} y={30} text="Voles and owls in one wood" />
    <Axes />
    <path d={curve(a, 0, 22)} stroke="#3f8fb0" strokeWidth="3" fill="none" />
    <path d={curve(b, 0, 22)} stroke="#8a5aa0" strokeWidth="3" fill="none" strokeDasharray="9 5" />
    <path d="M360 25H390" stroke="#3f8fb0" strokeWidth="3" /><text x={398} y={30} fill="#3f8fb0" fontSize="14" fontWeight="700">line A</text>
    <path d="M448 25H478" stroke="#8a5aa0" strokeWidth="3" strokeDasharray="9 5" /><text x={486} y={30} fill="#8a5aa0" fontSize="14" fontWeight="700">line B</text>
  </Diagram>
}
function VoleData() {
  const rows = [[1, 200, 10], [2, 320, 12], [3, 410, 18], [4, 260, 22], [5, 150, 14], [6, 220, 10]]
  return <Diagram viewBox="0 0 540 250" title="Table of voles and owls counted in one wood over 6 years. Year 1: 200 voles, 10 owls. Year 2: 320, 12. Year 3: 410, 18. Year 4: 260, 22. Year 5: 150, 14. Year 6: 220, 10.">
    <Title x={270} y={26} anchor="middle" text="Voles and owls counted in one wood" />
    <rect x={30} y={42} width={480} height={196} rx={12} fill="#f7fafc" stroke="#cfdde7" strokeWidth="1.5" />
    <At x={86} y={124} s={1.1}><Vole /></At><At x={86} y={206} s={.95}><Owl /></At>
    <text x={136} y={72} fill={ink} fontSize="13.5" fontWeight="700">year</text>
    {rows.map(([y], i) => <text key={y} x={226 + i * 50} y={72} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700">{y}</text>)}
    <path d="M46 84H494" stroke="#cfdde7" strokeWidth="1.5" />
    <text x={136} y={122} fill={primary} fontSize="13.5" fontWeight="700">voles</text>
    <text x={136} y={190} fill={secondary} fontSize="13.5" fontWeight="700">owls</text>
    {rows.map(([y, v, o], i) => <g key={y}><text x={226 + i * 50} y={122} textAnchor="middle" fill={ink} fontSize="14">{v}</text><text x={226 + i * 50} y={190} textAnchor="middle" fill={ink} fontSize="14">{o}</text></g>)}
    <path d="M46 154H494" stroke="#cfdde7" strokeWidth="1.5" />
  </Diagram>
}

// ---------- Lesson 54: the school field and quadrats ----------
const FIELD = { x: 60, y: 30, w: 280, h: 224 }, M = 28 // 10 m × 8 m, 28 px per metre
const SHADE: Pt = [118, 88], SHADE_R = 76
const fx = (m: number) => FIELD.x + m * M, fy = (m: number) => FIELD.y + FIELD.h - m * M
const clovers: Pt[] = (() => {
  const rand = seeded(21), out: Pt[] = []
  for (let i = 0; i < 700 && out.length < 150; i++) {
    const x = FIELD.x + 6 + rand() * (FIELD.w - 12), y = FIELD.y + 6 + rand() * (FIELD.h - 12)
    const shade = Math.hypot(x - SHADE[0], y - SHADE[1]) < SHADE_R
    if (rand() < (shade ? .1 : .75)) out.push([x, y])
  }
  return out
})()
function Quadrat({ x, y, s = 14, active = false }: { x: number; y: number; s?: number; active?: boolean }) {
  return <rect x={x} y={y} width={s} height={s} fill={active ? '#fff8e6aa' : '#ffffff66'} stroke="#b0782c" strokeWidth={active ? 2.6 : 2} />
}
function Tapes({ on = true }: { on?: boolean }) {
  return <Fade on={on}>
    <rect x={FIELD.x} y={FIELD.y + FIELD.h + 4} width={FIELD.w} height={10} fill="#f6dc6a" stroke="#b8902e" strokeWidth="1.2" />
    <rect x={FIELD.x - 14} y={FIELD.y} width={10} height={FIELD.h} fill="#f6dc6a" stroke="#b8902e" strokeWidth="1.2" />
    {Array.from({ length: 11 }, (_, m) => <g key={m}><path d={`M${fx(m)} ${FIELD.y + FIELD.h + 4}v6`} stroke="#8a6d20" />{m % 2 === 0 && <text x={fx(m)} y={FIELD.y + FIELD.h + 30} textAnchor="middle" fontSize="12" fill={ink}>{m}</text>}</g>)}
    {Array.from({ length: 9 }, (_, m) => <g key={m}><path d={`M${FIELD.x - 14} ${fy(m)}h6`} stroke="#8a6d20" />{m % 2 === 0 && <text x={FIELD.x - 20} y={fy(m) + 4} textAnchor="end" fontSize="12" fill={ink}>{m}</text>}</g>)}
    <text x={FIELD.x + FIELD.w + 12} y={FIELD.y + FIELD.h + 30} fontSize="12" fill={ink}>m</text><text x={FIELD.x - 20} y={FIELD.y - 8} textAnchor="end" fontSize="12" fill={ink}>m</text>
  </Fade>
}
function FieldPlan({ children, tapes = false, dimClover = false }: { children?: ReactNode; tapes?: boolean; dimClover?: boolean }) {
  return <g>
    <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} rx={6} fill="#e7f3db" stroke={grassLine} strokeWidth="2" />
    <circle cx={SHADE[0]} cy={SHADE[1]} r={SHADE_R} fill="#5d7f55" opacity=".2" />
    <path d={blob(SHADE[0], SHADE[1], 46, 42, 9, .12)} fill="#8fc27d" stroke={green} strokeWidth="2" opacity=".85" /><circle cx={SHADE[0]} cy={SHADE[1]} r={6} fill="#9b7650" />
    <g opacity={dimClover ? .45 : 1}>{clovers.map(([x, y], i) => <Clover key={i} x={x} y={y} s={.9} />)}</g>
    <Tapes on={tapes} />
    {children}
  </g>
}
// Eight random spots: six in the sun and two in the shade. The counts shown are the sunny-area data used in the
// averages section (8, 6, 12, 5, 16, 10) and two shady-area counts, so the lesson's numbers stay consistent.
const sampleSpots: Array<[number, number, number]> = [[7, 3, 8], [4, 6, 2], [9, 7, 12], [2, 1, 6], [6, 1, 10], [8.5, 4.5, 5], [1, 6.5, 0], [5, 4, 16]]
function QuadratScenes({ focus }: { focus: string }) {
  const step = focus.replace('eco-quad-', '')
  const q = (m: [number, number, number]) => [fx(m[0]), fy(m[1]) - 14] as Pt
  if (step === 'distribution') return <Diagram title="Plan view of a school field, 10 m by 8 m, with a large tree in one corner. Clover plants are dotted thickly across the sunny part and only sparsely in the shade under the tree.">
    <FieldPlan />
    <Label x={360} y={70} to={[118, 130]} lines={['little clover', 'in the shade']} strong colour={green} />
    <Label x={360} y={200} to={[300, 190]} lines={['lots of clover', 'in the sun']} strong colour={green} />
    <Clover x={374} y={262} s={1.4} /><text x={388} y={267} fill={ink} fontSize="12.5">= clover</text>
  </Diagram>
  if (step === 'frame') return <Diagram title="The field with one small quadrat on it, and an enlarged quadrat: a square frame 50 cm by 50 cm, an area of 0.25 square metres, with seven clover plants inside.">
    <FieldPlan dimClover><Quadrat x={fx(7)} y={fy(3) - 14} active /></FieldPlan>
    <path d={`M${fx(7) + 14} ${fy(3) - 14}L372 70M${fx(7) + 14} ${fy(3)}L372 210`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
    <rect x={372} y={70} width={140} height={140} fill="#e7f3db" stroke="#b0782c" strokeWidth="6" />
    {Array.from({ length: 4 }, (_, i) => <g key={i}><path d={`M${372 + (i + 1) * 28} 70V210M372 ${70 + (i + 1) * 28}H512`} stroke="#b0782c" strokeWidth=".9" opacity=".6" /></g>)}
    {[[392, 94], [430, 88], [478, 104], [404, 146], [456, 150], [490, 186], [420, 190]].map(([x, y], i) => <Clover key={i} x={x} y={y} s={2} />)}
    <text x={442} y={60} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">50 cm</text>
    <text x={524} y={144} fill={ink} fontSize="13" fontWeight="700" transform="rotate(90 524 144)" textAnchor="middle">50 cm</text>
    <text x={442} y={238} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700">quadrat: area 0.25 m²</text>
  </Diagram>
  if (step === 'random') return <Diagram title="The field with tape measures along the bottom and left edges, marked in metres. Random numbers give the coordinates 7 m along and 3 m up; dashed lines from each tape meet at that point, where the quadrat is placed.">
    <FieldPlan tapes dimClover>
      <path d={`M${fx(7)} ${FIELD.y + FIELD.h + 4}V${fy(3)}H${FIELD.x - 4}`} stroke={secondary} strokeWidth="2" strokeDasharray="5 4" fill="none" />
      <Quadrat x={fx(7)} y={fy(3) - 14} active />
    </FieldPlan>
    <rect x={368} y={80} width={152} height={100} rx={12} fill="white" stroke="#cfdde7" strokeWidth="1.5" />
    <text x={444} y={106} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">random numbers</text>
    <text x={444} y={134} textAnchor="middle" fill={secondary} fontSize="14" fontWeight="700">7 m along</text><text x={444} y={158} textAnchor="middle" fill={secondary} fontSize="14" fontWeight="700">3 m up</text>
    <text x={444} y={214} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={444}>tape measures</tspan><tspan x={444} dy={15}>along two edges</tspan></text>
  </Diagram>
  if (step === 'count') return <Diagram title="The field with eight quadrats placed at random. The number of clover plants counted inside each one is written beside it; quadrats in the sun hold more clover than those in the shade.">
    <FieldPlan tapes dimClover>
      {sampleSpots.map((m, i) => { const [x, y] = q(m); return <g key={i}><Quadrat x={x} y={y} active /><rect x={x + 15} y={y - 12} width={20} height={16} rx={4} fill="white" stroke="#b0782c" /><text x={x + 25} y={y + 1} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">{m[2]}</text></g> })}
    </FieldPlan>
    <text x={440} y={100} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700"><tspan x={440}>count the clover</tspan><tspan x={440} dy={17}>in each quadrat</tspan></text>
    <text x={440} y={170} textAnchor="middle" fill={ink} fontSize="13.5"><tspan x={440}>repeat at many</tspan><tspan x={440} dy={17}>random spots</tspan></text>
  </Diagram>
  return <Diagram title="The field split into a sunny area and a shady area under the tree, each sampled with the same size and number of quadrats. Result cards: sunny area, mean 9 clover plants per quadrat; shady area, mean 2 per quadrat.">
    <FieldPlan dimClover>
      <circle cx={SHADE[0]} cy={SHADE[1]} r={SHADE_R - 4} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
      <rect x={fx(5.2)} y={fy(6.4)} width={M * 4.4} height={M * 6} rx={10} fill="none" stroke={sunLine} strokeWidth="2.2" strokeDasharray="6 5" />
    </FieldPlan>
    <rect x={364} y={60} width={160} height={70} rx={12} fill="#fdf6dc" stroke={sunLine} strokeWidth="1.6" /><text x={444} y={86} textAnchor="middle" fill={lightInk} fontSize="13.5" fontWeight="700">sunny area</text><text x={444} y={112} textAnchor="middle" fill={ink} fontSize="13.5">mean: 9 per quadrat</text>
    <rect x={364} y={150} width={160} height={70} rx={12} fill="#eef3ec" stroke={ink} strokeWidth="1.6" /><text x={444} y={176} textAnchor="middle" fill={ink} fontSize="13.5" fontWeight="700">shady area</text><text x={444} y={202} textAnchor="middle" fill={ink} fontSize="13.5">mean: 2 per quadrat</text>
    <text x={444} y={256} textAnchor="middle" fill={ink} fontSize="12.5"><tspan x={444}>same quadrat size,</tspan><tspan x={444} dy={15}>same number of quadrats</tspan></text>
  </Diagram>
}

// ---------- Lesson 54: averages ----------
function CountTiles({ values, x0, y, hl = [], label, size = 52 }: { values: number[]; x0: number; y: number; hl?: number[]; label?: (i: number) => string; size?: number }) {
  return <g>{values.map((v, i) => { const x = x0 + i * (size + 12), on = hl.includes(i)
    return <g key={i}><rect x={x} y={y} width={size} height={size} rx={6} fill={on ? '#fff3cf' : '#eef6e8'} stroke={on ? sugar : '#b0782c'} strokeWidth={on ? 3 : 2} />
      <text x={x + size / 2} y={y + size / 2 + 7} textAnchor="middle" fill={ink} fontSize="20" fontWeight="700">{v}</text>
      {label && <text x={x + size / 2} y={y + size + 16} textAnchor="middle" fill={muted} fontSize="12">{label(i)}</text>}</g> })}</g>
}
const sunny = [8, 6, 12, 5, 16, 6, 10], sunnySorted = [...sunny].sort((a, b) => a - b)
function Averages({ focus }: { focus: string }) {
  const step = focus.replace('eco-mean-', '')
  if (step === 'worked') return <Diagram viewBox="0 0 540 250" title="Worked example: five quadrats from the shady area hold 2, 0, 3, 1 and 4 clover plants. The total is 10, and 10 divided by 5 gives a mean of 2 per quadrat.">
    <Title text="Shady area: clover in 5 quadrats" />
    <CountTiles values={[2, 0, 3, 1, 4]} x0={100} y={50} label={i => `quadrat ${i + 1}`} />
    <text x={270} y={170} textAnchor="middle" fill={ink} fontSize="16">total = 2 + 0 + 3 + 1 + 4 = <tspan fontWeight="700">10</tspan></text>
    <text x={270} y={206} textAnchor="middle" fill={ink} fontSize="16">mean = 10 ÷ 5 = <tspan fontWeight="700" fill={sugar}>2 per quadrat</tspan></text>
  </Diagram>
  const titles: Record<string, string> = {
    mean: 'Seven quadrat counts from the sunny area: 8, 6, 12, 5, 16, 6 and 10. They add up to 63, and 63 divided by 7 gives a mean of 9 per quadrat.',
    median: 'The same seven counts put in order: 5, 6, 6, 8, 10, 12, 16. The middle (4th) value, 8, is highlighted as the median.',
    mode: 'The seven counts with the two 6s highlighted: 6 appears most often, so the mode is 6.',
  }
  const sorted = step !== 'mean'
  const values = sorted ? sunnySorted : sunny
  const hl = step === 'median' ? [3] : step === 'mode' ? values.map((v, i) => v === 6 ? i : -1).filter(i => i >= 0) : []
  return <Diagram viewBox="0 0 540 260" title={titles[step] || titles.mean}>
    <Title text={sorted ? 'Sunny area: the counts in order' : 'Sunny area: clover in 7 quadrats'} />
    <CountTiles values={values} x0={48} y={48} hl={hl} label={sorted ? undefined : i => `Q${i + 1}`} />
    {step === 'median' && <><Arrow x1={276} y1={140} x2={276} y2={108} colour={sugar} width={2.4} /><text x={276} y={162} textAnchor="middle" fill={ink} fontSize="13.5"><tspan fontWeight="700">3 counts</tspan> each side</text></>}
    <text x={270} y={step === 'mean' ? 160 : 206} textAnchor="middle" fill={ink} fontSize="16">
      {step === 'mean' ? <>total = 8 + 6 + 12 + 5 + 16 + 6 + 10 = <tspan fontWeight="700">63</tspan></> : step === 'median' ? <>median = the middle value = <tspan fontWeight="700" fill={sugar}>8</tspan></> : <>mode = the most common value = <tspan fontWeight="700" fill={sugar}>6</tspan></>}
    </text>
    {step === 'mean' && <text x={270} y={196} textAnchor="middle" fill={ink} fontSize="16">mean = 63 ÷ 7 = <tspan fontWeight="700" fill={sugar}>9 per quadrat</tspan></text>}
    {step === 'mode' && <text x={270} y={160} textAnchor="middle" fill={ink} fontSize="13.5">6 appears twice; every other count appears once</text>}
  </Diagram>
}

// ---------- Lesson 54: estimating population size ----------
function Estimate({ focus }: { focus: string }) {
  const worked = focus === 'eco-estimate-worked'
  const step = { 'eco-estimate-idea': 0, 'eco-estimate-fit': 1, 'eco-estimate-multiply': 2 }[focus] ?? 3
  const d = worked ? { area: 200, w: '20 m', h: '10 m', mean: 6, fit: 800, total: '4800', name: 'buttercups', rw: 280, rh: 140 } : { area: 600, w: '30 m', h: '20 m', mean: 8, fit: 2400, total: '19 200', name: 'clover plants', rw: 270, rh: 180 }
  const x0 = 40, y0 = 60
  const titles = [
    'A field 30 m by 20 m, an area of 600 square metres, with a few small quadrats of 0.25 square metres placed at random. The quadrats found a mean of 8 clover plants each.',
    'Step 1: 600 square metres divided by 0.25 square metres: 2400 quadrats would fit in the field.',
    'Step 2: 2400 quadrats multiplied by a mean of 8 clover plants per quadrat gives an estimate of 19 200 clover plants.',
    'Worked example: a lawn 20 m by 10 m, 200 square metres. Step 1: 200 divided by 0.25 is 800 quadrats. Step 2: 800 times a mean of 6 buttercups is about 4800 buttercups.',
  ]
  const rand = seeded(worked ? 4 : 13)
  const plants = Array.from({ length: worked ? 40 : 60 }, () => [x0 + 6 + rand() * (d.rw - 12), y0 + 6 + rand() * (d.rh - 12)] as Pt)
  return <Diagram title={titles[step]}>
    <Title text={worked ? 'Estimate the buttercups on a lawn' : 'Estimate the clover in a whole field'} />
    <rect x={x0} y={y0} width={d.rw} height={d.rh} rx={6} fill="#e7f3db" stroke={grassLine} strokeWidth="2" />
    {step === 1 && Array.from({ length: Math.floor(d.rw / 12) }, (_, i) => <path key={i} d={`M${x0 + (i + 1) * 12} ${y0}V${y0 + d.rh}`} stroke="#b0782c" strokeWidth=".6" opacity=".45" />)}
    {step === 1 && Array.from({ length: Math.floor(d.rh / 12) }, (_, i) => <path key={i} d={`M${x0} ${y0 + (i + 1) * 12}H${x0 + d.rw}`} stroke="#b0782c" strokeWidth=".6" opacity=".45" />)}
    {plants.map(([x, y], i) => worked ? <circle key={i} cx={x} cy={y} r={3} fill="#f2c230" stroke={sunLine} strokeWidth=".8" /> : <Clover key={i} x={x} y={y} s={.8} />)}
    {[[.2, .3], [.6, .2], [.4, .7], [.8, .6]].map(([a, b], i) => <Quadrat key={i} x={x0 + a * d.rw} y={y0 + b * d.rh} s={12} active />)}
    <text x={x0 + d.rw / 2} y={y0 - 8} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="700">{d.w}</text>
    <text x={x0 - 10} y={y0 + d.rh / 2} textAnchor="middle" fill={ink} fontSize="12.5" fontWeight="700" transform={`rotate(-90 ${x0 - 10} ${y0 + d.rh / 2})`}>{d.h}</text>
    <text x={x0 + d.rw / 2} y={y0 + d.rh + 22} textAnchor="middle" fill={ink} fontSize="13">area = {d.area} m² · quadrat = 0.25 m² · mean = {d.mean}</text>
    <g>
      <Fade on={step === 1 || step === 3}><rect x={346} y={62} width={182} height={78} rx={12} fill="white" stroke={step === 1 ? green : '#cfdde7'} strokeWidth={step === 1 ? 2.2 : 1.5} /><text x={437} y={86} textAnchor="middle" fill={ink} fontSize="12.5">1. area ÷ quadrat area</text><text x={437} y={112} textAnchor="middle" fill={ink} fontSize="15" fontWeight="700">{d.area} ÷ 0.25 = {d.fit}</text><text x={437} y={130} textAnchor="middle" fill={muted} fontSize="12">quadrats would fit</text></Fade>
      <Fade on={step === 2 || step === 3}><rect x={346} y={158} width={182} height={78} rx={12} fill="white" stroke={step === 2 ? green : '#cfdde7'} strokeWidth={step === 2 ? 2.2 : 1.5} /><text x={437} y={182} textAnchor="middle" fill={ink} fontSize="12.5">2. × mean per quadrat</text><text x={437} y={208} textAnchor="middle" fill={ink} fontSize="15" fontWeight="700">{d.fit} × {d.mean} = {d.total}</text><text x={437} y={226} textAnchor="middle" fill={muted} fontSize="12">{d.name} (estimate)</text></Fade>
      {step === 0 && <text x={437} y={272} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700"><tspan x={437}>sample a few quadrats,</tspan><tspan x={437} dy={16}>then scale up</tspan></text>}
    </g>
  </Diagram>
}

// ---------- Lesson 54: transects and percentage cover ----------
const T = { x0: 84, x1: 504, y: 160, m: 42 } // 10 m transect, 42 px per metre
const transectPlants: Pt[] = (() => {
  const rand = seeded(31), out: Pt[] = []
  for (let i = 0; i < 900 && out.length < 120; i++) {
    const x = T.x0 + rand() * (T.x1 - T.x0), y = 60 + rand() * 200, p = Math.min(1, (x - T.x0) / (T.x1 - T.x0) * 1.1)
    if (rand() < p * p * .9 + .03 && !(y > T.y + 26 && y < T.y + 48)) out.push([x, y])
  }
  return out
})()
function Transect({ focus }: { focus: string }) {
  const step = focus.replace('eco-transect-', '')
  const touching = transectPlants.filter(([, y]) => Math.abs(y - T.y) < 7)
  const sections = [0, 2, 4, 6, 8].map(m => touching.filter(([x]) => x >= T.x0 + m * T.m && x < T.x0 + (m + 2) * T.m).length)
  const qs = [0, 2, 4, 6, 8].map(m => { const x = T.x0 + m * T.m, y = T.y - 21; return { x, y, n: transectPlants.filter(([px, py]) => px > x && px < x + 42 && py > y && py < y + 42).length } })
  const titles: Record<string, string> = {
    line: 'Plan view of a field next to a hedge. A tape measure runs in a straight line from the hedge, at 0 m, into the field, to 10 m: a transect. Clover becomes more common further from the hedge.',
    touch: `The transect with the clover plants that touch the tape circled. Counts for each 2 m part, from the hedge outwards: ${sections.join(', ')}.`,
    quadrats: `The transect with a quadrat placed every 2 m along the line. Clover counted in each, from the hedge outwards: ${qs.map(q => q.n).join(', ')}.`,
  }
  return <Diagram title={titles[step] || titles.line}>
    <rect x={T.x0} y={50} width={T.x1 - T.x0 + 20} height={220} fill="#e7f3db" />
    <rect x={T.x0} y={50} width={90} height={220} fill="#5d7f55" opacity=".12" />
    <path d={`M${T.x0} 50V270`} stroke={green} strokeWidth="2" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={blob(56, 62 + i * 25, 28, 17, 40 + i, .14)} fill={i % 2 ? '#6f9f5a' : '#7fae68'} stroke={green} strokeWidth="1.6" />)}
    <text x={56} y={292} textAnchor="middle" fill={green} fontSize="13" fontWeight="700">hedge</text>
    <g opacity={step === 'line' ? 1 : .55}>{transectPlants.map(([x, y], i) => <Clover key={i} x={x} y={y} s={.9} />)}</g>
    <rect x={T.x0} y={T.y - 5} width={T.x1 - T.x0} height={10} fill="#f6dc6a" stroke="#b8902e" strokeWidth="1.3" />
    {Array.from({ length: 11 }, (_, m) => <g key={m}><path d={`M${T.x0 + m * T.m} ${T.y + 5}v6`} stroke="#8a6d20" strokeWidth="1.3" />{m % 2 === 0 && <text x={T.x0 + m * T.m + (m ? 0 : 4)} y={T.y + 42} textAnchor={m ? 'middle' : 'start'} fontSize="12" fill={ink} fontWeight="700">{m} m</text>}</g>)}
    {step === 'line' && <><Label x={330} y={22} to={[300, T.y - 6]} lines={['transect: a tape', 'measure in a line']} strong /><text x={500} y={292} textAnchor="end" fill={ink} fontSize="12.5">into the field →</text></>}
    {step === 'touch' && <>{touching.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="none" stroke={secondary} strokeWidth="1.8" />)}
      {sections.map((n, i) => <g key={i}><rect x={T.x0 + (i * 2 + 1) * T.m - 14} y={32} width={28} height={22} rx={6} fill="white" stroke={secondary} strokeWidth="1.5" /><text x={T.x0 + (i * 2 + 1) * T.m} y={48} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{n}</text></g>)}
      <text x={500} y={292} textAnchor="end" fill={ink} fontSize="12.5">clover touching the tape, per 2 m</text></>}
    {step === 'quadrats' && <>{qs.map((q, i) => <g key={i}><rect x={q.x} y={q.y} width={42} height={42} fill="#fff8e6aa" stroke="#b0782c" strokeWidth="2.6" /><rect x={q.x + 8} y={q.y - 30} width={26} height={22} rx={6} fill="white" stroke="#b0782c" strokeWidth="1.5" /><text x={q.x + 21} y={q.y - 14} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{q.n}</text></g>)}
      <text x={500} y={292} textAnchor="end" fill={ink} fontSize="12.5">clover in a quadrat every 2 m</text></>}
  </Diagram>
}
// Moss patches as ellipses; a square counts when more than half of it is covered (checked on a fine grid).
const mossPatches: Array<[number, number, number, number]> = [[3.1, 3.2, 2.6, 2.05], [6.9, 6.4, 2.1, 2.6], [2.4, 7.6, 1.5, 1.2]]
const covered = (() => {
  const inside = (x: number, y: number) => mossPatches.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1)
  const out: Pt[] = []
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
    let n = 0
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (inside(c + (i + .5) / 8, r + (j + .5) / 8)) n++
    if (n > 32) out.push([c, r])
  }
  return out
})()
const coverCount = covered.length
function Cover({ focus }: { focus: string }) {
  const count = focus === 'eco-cover-count', cell = 22, gx = 40, gy = 44
  const eg = { yes: covered.find(([c, r]) => c === 3 && r === 3) || covered[0], no: [5, 1] as Pt }
  return <Diagram title={count ? `One quadrat divided into 100 small squares with patches of moss. The ${coverCount} squares more than half covered are shaded; ${coverCount} divided by 100, times 100, gives ${coverCount}% cover.` : 'One quadrat divided into 100 small squares, with patches of moss. One square that is more than half covered is ticked, and one that is less than half covered is crossed.'}>
    <Title x={gx} y={30} text="One quadrat: 100 small squares" />
    <rect x={gx} y={gy} width={cell * 10} height={cell * 10} fill="#f7f3e6" />
    <g>{mossPatches.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={gx + cx * cell} cy={gy + cy * cell} rx={rx * cell} ry={ry * cell} fill="#9cc47a" stroke="#5f8f46" strokeWidth="1.8" />)}</g>
    {count && covered.map(([c, r], i) => <rect key={i} x={gx + c * cell} y={gy + r * cell} width={cell} height={cell} fill="#3f7d3a" opacity=".38" />)}
    {Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M${gx + i * cell} ${gy}V${gy + cell * 10}M${gx} ${gy + i * cell}H${gx + cell * 10}`} stroke="#b0782c" strokeWidth={i % 10 ? .9 : 3} /></g>)}
    {!count && <><path d={`M${gx + eg.yes[0] * cell + 5} ${gy + eg.yes[1] * cell + 12}l5 5l8 -10`} stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" /><rect x={gx + eg.yes[0] * cell} y={gy + eg.yes[1] * cell} width={cell} height={cell} fill="none" stroke={ink} strokeWidth="2.4" />
      <rect x={gx + eg.no[0] * cell} y={gy + eg.no[1] * cell} width={cell} height={cell} fill="none" stroke={warm} strokeWidth="2.4" /><path d={`M${gx + eg.no[0] * cell + 6} ${gy + eg.no[1] * cell + 6}l10 10m0 -10l-10 10`} stroke={warm} strokeWidth="2.4" strokeLinecap="round" />
      <Label x={300} y={96} to={[gx + eg.yes[0] * cell + cell, gy + eg.yes[1] * cell + cell / 2]} lines={['more than half', 'covered: count it']} strong />
      <Label x={300} y={50} to={[gx + eg.no[0] * cell + cell, gy + eg.no[1] * cell + cell / 2]} lines={['less than half: do not count it']} colour={warm} strong />
      <Label x={300} y={220} lines={['moss is hard to', 'count one by one']} /></>}
    {count && <><rect x={300} y={70} width={226} height={150} rx={12} fill="white" stroke="#cfdde7" strokeWidth="1.5" />
      <text x={413} y={98} textAnchor="middle" fill={ink} fontSize="13">squares more than half covered</text>
      <text x={413} y={124} textAnchor="middle" fill={green} fontSize="18" fontWeight="700">{coverCount}</text>
      <text x={413} y={162} textAnchor="middle" fill={ink} fontSize="15">{coverCount} ÷ 100 × 100</text>
      <text x={413} y={194} textAnchor="middle" fill={green} fontSize="18" fontWeight="700">= {coverCount}% cover</text></>}
  </Diagram>
}
function CoverQuestion() {
  const shaded = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 3], [4, 3], [3, 4], [4, 4]]
  const cell = 40, gx = 150, gy = 40
  return <Diagram viewBox="0 0 540 260" title="A small quadrat divided into 25 squares, 5 by 5. Nine squares are shaded: the squares more than half covered by moss.">
    <rect x={gx} y={gy} width={cell * 5} height={cell * 5} fill="#f7f3e6" />
    {shaded.map(([c, r], i) => <rect key={i} x={gx + c * cell} y={gy + r * cell} width={cell} height={cell} fill="#7fb062" />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${gx + i * cell} ${gy}V${gy + cell * 5}M${gx} ${gy + i * cell}H${gx + cell * 5}`} stroke="#b0782c" strokeWidth={i % 5 ? 1.2 : 3} />)}
    <rect x={380} y={96} width={22} height={22} fill="#7fb062" stroke="#b0782c" /><text x={410} y={112} fill={ink} fontSize="12.5"><tspan x={410}>more than half</tspan><tspan x={410} dy={15}>covered by moss</tspan></text>
  </Diagram>
}
function TransectData() {
  const cover = [60, 45, 30, 15, 5]
  const X = (i: number) => 130 + i * 80, Y = (v: number) => 250 - v * 2.6
  return <Diagram title="Bar chart of the percentage cover of moss along a transect from a hedge: 0 m, 60%; 2 m, 45%; 4 m, 30%; 6 m, 15%; 8 m, 5%.">
    <Title text="Moss along a transect from a hedge" />
    <path d="M80 250H510M80 250V46" stroke={ink} strokeWidth="2" />
    {[0, 20, 40, 60, 80].map(v => <g key={v}><path d={`M74 ${Y(v)}h6`} stroke={ink} /><text x={70} y={Y(v) + 4} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {cover.map((c, i) => <g key={i}><rect x={X(i) - 24} y={Y(c)} width={48} height={250 - Y(c)} fill="#9cc47a" stroke="#5f8f46" strokeWidth="1.6" /><text x={X(i)} y={Y(c) - 6} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>{c}%</text><text x={X(i)} y={268} textAnchor="middle" fontSize="12" fill={ink}>{i * 2}</text></g>)}
    <text x={295} y={290} textAnchor="middle" fontSize="12" fill={ink}>distance from the hedge (m)</text>
    <text x={24} y={150} fontSize="12" fill={ink} transform="rotate(-90 24 150)" textAnchor="middle">percentage cover of moss (%)</text>
  </Diagram>
}

export function EcologyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('eco-comm-')) return <Community focus={focus} />
  if (focus.startsWith('eco-comp-')) return <Competition focus={focus} />
  if (focus === 'eco-web-depend') return <Depend />
  if (focus === 'eco-web-stable') return <Stable />
  if (focus.startsWith('eco-web-')) return <FoodWeb focus={focus} />
  if (focus === 'eco-meadow-question') return <Meadow assessment={assessment} />
  if (focus === 'eco-hedgehog-data') return <Hedgehogs />
  if (focus.startsWith('eco-abiotic-')) return <Abiotic focus={focus} />
  if (focus.startsWith('eco-biotic-')) return <Biotic focus={focus} />
  if (focus.startsWith('eco-adapt-')) return <Adaptations focus={focus} />
  if (focus === 'eco-fennec-question') return <Fennec assessment={assessment} />
  if (focus === 'eco-squirrel-data') return <SquirrelData />
  if (focus.startsWith('eco-chain-')) return <Chain focus={focus} />
  if (focus === 'eco-pondchain-question') return <PondChain assessment={assessment} />
  if (focus === 'eco-cycle-question') return <CycleQuestion />
  if (focus.startsWith('eco-cycle-')) return <Cycle focus={focus} />
  if (focus === 'eco-vole-data') return <VoleData />
  if (focus.startsWith('eco-quad-')) return <QuadratScenes focus={focus} />
  if (focus.startsWith('eco-mean-')) return <Averages focus={focus} />
  if (focus.startsWith('eco-estimate-')) return <Estimate focus={focus} />
  if (focus === 'eco-cover-question') return <CoverQuestion />
  if (focus.startsWith('eco-cover-')) return <Cover focus={focus} />
  if (focus === 'eco-transect-data') return <TransectData />
  if (focus.startsWith('eco-transect-')) return <Transect focus={focus} />
  return <Community focus="eco-comm-all" />
}
