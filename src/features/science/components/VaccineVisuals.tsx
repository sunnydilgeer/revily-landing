import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Diagram, Label, Person, Virus, Droplets, blob, infectionPalette as c } from './InfectionVisuals'
import { Antibody, RedCell, WhiteCell, defenceColours } from './DefenceVisuals'

// Lesson 23: original, code-native schematics of immunity and vaccination. Not to scale; not micrographs.
// Colour code as the other B3 diagrams: magenta = pathogens and antigens, slate blue = white blood cells and antibodies,
// red = blood. A shield badge on a person means "vaccinated", as in Lesson 19.
const { wbcLine } = defenceColours
const bloodFill = '#fbeaea', tissue = '#fdf3ee', deskFill = '#e8d6b8', deskLine = '#b99b6f'
type Pt = [number, number]
const ANGLES = [-90, -45, 0, 45, 90, 135, 180, 225]
const onRing = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(deg * Math.PI / 180) * r, cy + Math.sin(deg * Math.PI / 180) * r]

// A pathogen with triangle antigens (as in Lesson 22). An inactive one is pale with a dashed outline, but keeps its antigens.
function Germ({ cx, cy, r = 14, inactive = false, seed = 1 }: { cx: number; cy: number; r?: number; inactive?: boolean; seed?: number }) {
  return <g>
    <path d={blob(cx, cy, r, r, seed + 40, .06)} fill={inactive ? '#f8eef3' : c.bugFill} stroke={c.bug} strokeWidth="2" strokeDasharray={inactive ? '4 3' : undefined} />
    {!inactive && <circle cx={cx - r * .2} cy={cy - r * .1} r={r * .32} fill={c.bug} opacity=".6" />}
    {ANGLES.map(deg => { const [x, y] = onRing(cx, cy, r + 4, deg)
      return <path key={deg} d={`M${x} ${y - 4}l4 7h-8z`} fill={c.bugDeep} transform={`rotate(${deg + 90} ${x} ${y})`} /> })}
  </g>
}
function lockOn(cx: number, cy: number, r: number, angles: number[]) {
  return angles.map(deg => { const [x, y] = onRing(cx, cy, r + 16, deg); return <Antibody key={deg} x={x} y={y} angle={deg - 90} /> })
}
function Pupil({ x, y, scale = .4, jumper = c.jumperA, badge = false, spots = false, body = 110, facing = 1, children }: { x: number; y: number; scale?: number; jumper?: string; badge?: boolean; spots?: boolean; body?: number; facing?: 1 | -1; children?: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><Person x={0} y={0} facing={facing} jumper={jumper} badge={badge} body={body} />
    {spots && [[-9, 4], [6, -7], [10, 8], [-2, -12], [-12, -6]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r="3" fill={c.bug} />)}{children}</g>
}
function Zoom({ cx, cy, r, children, fill = bloodFill }: { cx: number; cy: number; r: number; children: ReactNode; fill?: string }) {
  const id = useId().replace(/:/g, '')
  return <g><clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath><circle cx={cx} cy={cy} r={r} fill={fill} stroke={c.ink} strokeWidth="2" /><g clipPath={`url(#${id})`}>{children}</g></g>
}

// ---------- Sam's class (chickenpox) ----------
const CLASS_X = [70, 170, 270, 370, 470], SAM = 2, HEAD_Y = 120
function ClassScene({ focus }: { focus: string }) {
  const immune = focus === 'vaccine-class-immune'
  return <Diagram title={immune ? 'Sam at his desk in class, highlighted, with a ring of antibodies around him. He is immune to chickenpox: his white blood cells are ready to respond fast. His classmates are faded.' : 'A row of five pupils at their desks. Four classmates have chickenpox spots, and viruses are in the air. Sam, in the middle, has no spots and stays well.'}>
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Sam’s class</text>
    <path d="M10 205H530" stroke={deskLine} strokeWidth="2" />
    {CLASS_X.map((x, i) => <g key={x} opacity={immune && i !== SAM ? c.faded : 1}>
      <Pupil x={x} y={HEAD_Y} scale={.62} jumper={i === SAM ? c.jumperB : c.jumperA} spots={i !== SAM} />
      <rect x={x - 36} y={166} width={72} height={12} rx="3" fill={deskFill} stroke={deskLine} strokeWidth="1.4" /><path d={`M${x - 30} 178V205M${x + 30} 178V205`} stroke={deskLine} strokeWidth="2" />
    </g>)}
    {!immune && [[118, 92], [212, 70], [322, 84], [420, 66]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={5} seed={i + 2} />)}
    {!immune && <><Label x={20} y={44} to={[70, 108]} lines={['classmates ill', 'with chickenpox']} strong colour={c.bugDeep} /><text x={270} y={240} textAnchor="middle" fill={c.ink} fontSize="15" fontWeight="700">Sam stays well</text></>}
    {immune && <g><circle cx={270} cy={138} r={56} fill="none" stroke={wbcLine} strokeWidth="2" strokeDasharray="6 5" />
      {[-150, -30, 30, 150].map(deg => { const [x, y] = onRing(270, 138, 56, deg); return <Antibody key={deg} x={x} y={y} angle={deg + 90} /> })}
      <Label x={352} y={44} to={[312, 100]} lines={['immune to chickenpox:', 'fast response ready']} strong colour={wbcLine} />
      <text x={270} y={240} textAnchor="middle" fill={c.ink} fontSize="15" fontWeight="700">Sam</text></g>}
  </Diagram>
}

// ---------- Inside Sam's blood: first time and second time ----------
const Z = { cx: 380, cy: 150, r: 112 }
function BloodScene({ focus }: { focus: string }) {
  const second = focus === 'vaccine-blood-second'
  const viruses: Pt[] = second ? [[350, 110], [430, 180]] : [[322, 90], [372, 76], [430, 96], [462, 150], [350, 140], [408, 130], [440, 206], [330, 196], [388, 236]]
  return <Diagram title={second ? 'Sam this year, well, with a zoomed-in circle of his blood. The chickenpox viruses are covered in antibodies, which white blood cells made quickly. The virus is destroyed before he feels ill.' : 'Sam at age five, with chickenpox spots, and a zoomed-in circle of his blood. There are many chickenpox viruses and only a few antibodies next to one white blood cell, so the virus multiplies.'}>
    <text x={100} y={36} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="700">{second ? 'Sam, this year' : 'Sam, age 5'}</text>
    <Person x={100} y={96} facing={1} jumper={c.jumperB} body={194} />
    {!second && [[91, 100], [106, 88], [110, 104], [98, 84], [88, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={c.bug} />)}
    <path d="M140 170L286 92M140 200L286 212" stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" />
    <Zoom {...Z}>
      <g opacity=".45">{[[300, 70], [470, 80], [300, 250], [480, 230], [400, 50]].map(([x, y], i) => <RedCell key={i} cx={x} cy={y} r={15} />)}</g>
      {viruses.map(([x, y], i) => <Germ key={i} cx={x} cy={y} r={second ? 16 : 12} seed={i} />)}
      {second ? <>{lockOn(350, 110, 16, [-90, 0, 90, 180])}{lockOn(430, 180, 16, [-60, 30, 120, 210])}<WhiteCell cx={316} cy={210} r={28} /><WhiteCell cx={462} cy={96} r={24} seed={8} />
        {[[356, 190, 20], [386, 214, -30], [470, 138, 60]].map(([x, y, a], i) => <Antibody key={i} x={x} y={y} angle={a} />)}</>
        : <><WhiteCell cx={300} cy={120} r={26} /><Antibody x={292} y={164} angle={170} /></>}
    </Zoom>
    <text x={Z.cx} y={24} textAnchor="middle" fill={c.ink} fontSize="12">Sam’s blood, zoomed in</text>
    {second ? <Label x={180} y={292} to={[298, 216]} lines={['white blood cell']} colour={wbcLine} /> : <Label x={156} y={56} to={[284, 112]} lines={['white', 'blood cell']} colour={wbcLine} />}
    <text x={530} y={292} textAnchor="end" fill={second ? wbcLine : c.bugDeep} fontSize="14" fontWeight="700">{second ? 'antibodies made quickly' : 'few antibodies yet'}</text>
  </Diagram>
}

// ---------- Antibody level over time (teaching curve and question version) ----------
const CURVE: Array<[number, number]> = [[0, 0], [10, 0], [18, 4], [26, 13], [34, 20], [42, 17], [52, 10], [60, 7], [63, 18], [66, 55], [70, 86], [75, 95], [85, 92], [100, 82]]
const CX = (t: number) => 70 + t * 4.4, CY = (l: number) => 240 - l * 1.7
function smoothPath(points: Pt[]) {
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)]
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}
function Axes({ xLabel, yTop = 50, topLabel = false, xRight = false }: { xLabel: string; yTop?: number; topLabel?: boolean; xRight?: boolean }) {
  return <g><path d={`M70 240H515M70 240V${yTop}`} stroke={c.ink} strokeWidth="2" />
    {topLabel ? <text x={78} y={yTop + 8} fill={c.ink} fontSize="12">antibody level</text> : <text x={14} y={130} fill={c.ink} fontSize="12"><tspan x={14}>antibody</tspan><tspan x={14} dy={15}>level</tspan></text>}
    <text x={xRight ? 515 : 292} y={xRight ? 276 : 262} textAnchor={xRight ? 'end' : 'middle'} fill={c.ink} fontSize="12">{xLabel}</text></g>
}
const POINTS: Array<{ at: number; badge: Pt; caption: string }> = [{ at: 1, badge: [96, 196], caption: 'first infection starts' }, { at: 4, badge: [224, 150], caption: 'slow, low response' }, { at: 11, badge: [330, 56], caption: 'fast, high response' }, { at: 13, badge: [496, 186], caption: 'level stays high' }]
function ResponseCurve({ question, assessment }: { question: boolean; assessment: boolean }) {
  const pts: Pt[] = CURVE.map(([t, l]) => [CX(t), CY(l)])
  const title = !question ? 'Graph of antibody level in the blood over time. After the first infection, the level rises slowly to a low peak. After a second infection with the same virus, it rises fast to a much higher peak.'
    : assessment ? 'Graph of antibody level in the blood over time. A pathogen enters twice. Four points on the line are numbered 1 to 4.'
    : 'Graph of antibody level over time with four numbered points: 1 the first infection starts, 2 a slow, low response, 3 a fast, high response after the same pathogen enters again, 4 the level stays high.'
  return <Diagram viewBox={question ? '0 0 540 320' : '0 0 540 300'} title={title}>
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Antibody level in the blood</text>
    <Axes xLabel="time" xRight={question} />
    <path d={smoothPath(pts)} stroke={wbcLine} strokeWidth="3.5" fill="none" />
    <Arrow x1={CX(10)} y1={178} x2={CX(10)} y2={232} colour={c.bug} width={2} /><Arrow x1={CX(60)} y1={160} x2={CX(60)} y2={222} colour={c.bug} width={2} />
    {!question && <g>
      <text x={80} y={170} fill={c.bugDeep} fontSize="13" fontWeight="700">first infection</text>
      <text x={CX(60) - 6} y={152} textAnchor="end" fill={c.bugDeep} fontSize="13" fontWeight="700"><tspan x={CX(60) - 6}>second infection</tspan><tspan x={CX(60) - 6} dy={15}>(same virus)</tspan></text>
      <text x={CX(34)} y={192} textAnchor="middle" fill={c.ink} fontSize="13">slow and low</text>
      <text x={CX(76) + 6} y={60} fill={wbcLine} fontSize="14" fontWeight="700">fast and high</text>
    </g>}
    {question && <g>
      <text x={CX(10)} y={258} textAnchor="middle" fill={c.bugDeep} fontSize="12">pathogen enters</text>
      <text x={CX(60)} y={258} textAnchor="middle" fill={c.bugDeep} fontSize="12">same pathogen enters</text>
      {POINTS.map((p, i) => { const [x, y] = pts[p.at]; return <g key={i}><path d={`M${p.badge[0]} ${p.badge[1]}L${x} ${y}`} stroke={c.ink} strokeWidth="1.5" /><circle cx={x} cy={y} r="3.5" fill={c.ink} /><Badge n={i + 1} x={p.badge[0]} y={p.badge[1]} /></g> })}
      {!assessment && <g fontSize="12" fill={c.ink}>{POINTS.map((p, i) => <text key={i} x={i % 2 ? 280 : 20} y={i < 2 ? 292 : 310}>{`${i + 1}  ${p.caption}`}</text>)}</g>}
    </g>}
  </Diagram>
}
function ResponseData() {
  const data: Pt[] = [[0, 0], [1, 3], [2, 8], [3, 12], [4, 11], [6, 8], [8, 6], [10, 5], [12, 5], [13, 30], [14, 70], [15, 82], [16, 84], [18, 80], [20, 76]]
  const X = (w: number) => 70 + w * 22, Y = (l: number) => 240 - l * 1.8
  return <Diagram title="Graph of one person’s antibody level over 20 weeks. A vaccine is given at week 0, and the level rises to about 12 by week 3, then falls to about 5. The real pathogen enters at week 12, and the level rises to about 84 by week 16, then falls a little.">
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">One person’s antibody level over 20 weeks</text>
    <Axes xLabel="week" yTop={48} topLabel />
    {[0, 4, 8, 12, 16, 20].map(w => <g key={w}><path d={`M${X(w)} 240v6`} stroke={c.ink} /><text x={X(w)} y={258} textAnchor="middle" fontSize="12" fill={c.ink}>{w}</text></g>)}
    {[0, 50, 100].map(l => <g key={l}><path d={`M64 ${Y(l)}h6`} stroke={c.ink} /><text x={60} y={Y(l) + 4} textAnchor="end" fontSize="11" fill={c.ink}>{l}</text></g>)}
    <path d={data.map(([w, l], i) => `${i ? 'L' : 'M'}${X(w)} ${Y(l)}`).join('')} stroke={wbcLine} strokeWidth="3" fill="none" />
    {data.map(([w, l]) => <circle key={w} cx={X(w)} cy={Y(l)} r="3.6" fill={wbcLine} />)}
    <Arrow x1={X(0) + 22} y1={170} x2={X(0) + 4} y2={226} colour={c.ink} width={1.8} /><text x={X(0) + 22} y={162} fill={c.ink} fontSize="12" fontWeight="700">vaccine given</text>
    <Arrow x1={X(12) - 20} y1={130} x2={X(12) - 3} y2={224} colour={c.bug} width={1.8} /><text x={X(12) - 20} y={122} textAnchor="end" fill={c.bugDeep} fontSize="12" fontWeight="700">real pathogen enters</text>
    <text x={515} y={288} textAnchor="end" fill={c.ink} fontSize="11">antibody level in arbitrary units</text>
  </Diagram>
}

// ---------- The arm and a zoom circle: a vaccine as a safe practice run ----------
const JZ = { cx: 392, cy: 150, r: 116 }, SITE: Pt = [150, 176]
function Arm({ syringe }: { syringe: boolean }) {
  return <g>
    <path d="M0 166H196Q226 166 226 196Q226 226 196 226H0Z" fill={c.skin} stroke={c.skinLine} strokeWidth="1.8" />
    <path d="M0 160H44V232H0Z" fill={c.jumperB} stroke={c.ink} strokeWidth="1.6" />
    {syringe && <g transform={`translate(${SITE[0]} ${SITE[1] - 2}) rotate(40)`}>
      <path d="M-26 0H-2" stroke={c.ink} strokeWidth="2" /><rect x={-104} y={-8} width={78} height={16} rx="3" fill="#eef4f8" stroke={c.ink} strokeWidth="1.8" />
      <rect x={-90} y={-5} width={40} height={10} fill="#f3dde8" /><path d="M-104 0H-128M-128 -10V10" stroke={c.ink} strokeWidth="3" />
    </g>}
  </g>
}
function JabScene({ focus }: { focus: string }) {
  const step = focus.replace('vaccine-jab-', '')
  if (step === 'intro') return <Diagram title="Sam wearing a shield badge, which means he is vaccinated. As a young child he had one vaccine against three viruses: measles, mumps and rubella.">
    <text x={110} y={34} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="700">Sam: immune to measles</text>
    <Person x={110} y={96} facing={1} jumper={c.jumperB} body={194} badge />
    <text x={370} y={70} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="600">one vaccine as a young child</text>
    {[['measles', 280], ['mumps', 370], ['rubella', 460]].map(([name, x], i) => <g key={name}><Virus cx={Number(x)} cy={150} r={20} seed={i + 4} /><text x={Number(x)} y={206} textAnchor="middle" fill={c.bugDeep} fontSize="14" fontWeight="700">{name}</text></g>)}
    <Label x={196} y={272} to={[126, 180]} lines={['shield: vaccinated']} strong />
  </Diagram>
  const later = step === 'later', antibodies = step === 'antibodies' || later
  const germs: Pt[] = [[356, 106], [430, 92], [446, 176], [364, 196]]
  const titles: Record<string, string> = {
    inject: 'An arm receiving an injection. A zoomed-in circle under the skin shows small amounts of dead or inactive pathogen, drawn pale with dashed outlines.',
    antigens: 'The zoomed-in circle under the skin. The inactive pathogens are pale and cannot cause disease, but the antigens on their surface are still there and highlighted.',
    antibodies: 'The zoomed-in circle under the skin. A white blood cell makes Y-shaped antibodies, which lock onto the antigens of the inactive pathogens. The person does not get the disease.',
    later: 'Months later, the real pathogen gets into the body. In the zoomed-in circle, white blood cells have quickly made many antibodies, which lock onto the live pathogens.',
  }
  return <Diagram title={titles[step] || titles.inject}>
    <g opacity={step === 'inject' ? 1 : c.faded}><Arm syringe={!later} /></g>
    <path d={`M${SITE[0]} ${SITE[1]}L${JZ.cx - 104} ${JZ.cy - 52}M${SITE[0]} ${SITE[1]}L${JZ.cx - 100} ${JZ.cy + 60}`} stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" />
    <Zoom {...JZ} fill={tissue}>
      {germs.map(([x, y], i) => <g key={i} opacity={step === 'antigens' ? 1 : 1}><Germ cx={x} cy={y} r={17} inactive={!later} seed={i + 10} /></g>)}
      {antibodies && <>{lockOn(356, 106, 17, later ? [-90, 0, 90, 180] : [0, 90])}{lockOn(446, 176, 17, later ? [-45, 45, 135, 225] : [180])}{later && lockOn(430, 92, 17, [-90, 90, 180])}{later && lockOn(364, 196, 17, [0, 90, 180])}
        <WhiteCell cx={later ? 300 : 318} cy={150} r={later ? 22 : 26} seed={6} /></>}
    </Zoom>
    <text x={JZ.cx} y={20} textAnchor="middle" fill={c.ink} fontSize="12">{later ? 'months later, zoomed in' : 'under the skin, zoomed in'}</text>
    {step === 'inject' && <><Label x={20} y={40} to={[340, 100]} lines={['small amounts of', 'dead or inactive pathogen']} strong colour={c.bugDeep} /><Label x={20} y={282} to={SITE} lines={['injection']} strong /></>}
    {step === 'antigens' && <><Label x={20} y={40} to={onRing(356, 106, 21, -135)} lines={['antigens: still on', 'the surface']} strong colour={c.bugDeep} /><Label x={20} y={272} to={[352, 204]} lines={['inactive: cannot', 'cause the disease']} strong /></>}
    {step === 'antibodies' && <><Label x={20} y={40} to={[300, 136]} lines={['white blood', 'cell makes antibodies']} strong colour={wbcLine} /><text x={JZ.cx} y={292} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="700">no illness</text></>}
    {later && <><Label x={20} y={40} to={[416, 84]} lines={['the real', 'pathogen arrives']} strong colour={c.bugDeep} /><Label x={20} y={250} to={[340, 196]} lines={['lots of antibodies,', 'made quickly']} strong colour={wbcLine} /></>}
  </Diagram>
}
function Calendar({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 22} y={y - 18} width={44} height={40} rx="4" fill="white" stroke={c.ink} strokeWidth="1.6" /><rect x={x - 22} y={y - 18} width={44} height={10} fill="#d7e3ec" stroke={c.ink} strokeWidth="1.6" />
    {[0, 1, 2].map(r => [0, 1, 2, 3].map(k => <circle key={`${r}${k}`} cx={x - 14 + k * 9.5} cy={y - 1 + r * 8} r="1.8" fill={c.ink} opacity=".6" />))}</g>
}
function JabQuestion({ assessment }: { assessment: boolean }) {
  const PX = [10, 142, 274, 406], W = 124
  const captions = [['injection'], ['antibodies made'], ['real pathogen', 'enters later'], ['destroyed', 'quickly']]
  return <Diagram viewBox="0 0 540 260" title={assessment ? 'Four numbered pictures in a row, 1 to 4: an arm and a needle; a white blood cell with Y-shaped molecules and a pale pathogen; a calendar with pathogens arriving; pathogens covered in Y-shaped molecules.' : 'Four stages: 1 the vaccine is injected; 2 a white blood cell makes antibodies against the inactive pathogen; 3 later, the real pathogen enters; 4 many antibodies lock on and it is destroyed quickly.'}>
    {PX.map((x, i) => <g key={x}><rect x={x} y={24} width={W} height={170} rx="10" fill={c.panelFill} stroke={c.panelLine} strokeWidth="1.5" /><Badge n={i + 1} x={x + W / 2} y={24} />
      {!assessment && <text x={x + W / 2} y={216} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="600">{captions[i].map((t, k) => <tspan key={t} x={x + W / 2} dy={k ? 15 : 0}>{t}</tspan>)}</text>}</g>)}
    <g transform="translate(10 40) scale(.52)"><Arm syringe /></g>
    <WhiteCell cx={178} cy={150} r={22} /><Germ cx={230} cy={96} r={13} inactive seed={3} />{lockOn(230, 96, 13, [135, 180])}<Antibody x={196} y={112} angle={40} />
    <Calendar x={336} y={74} /><Germ cx={310} cy={150} r={12} seed={5} /><Germ cx={362} cy={160} r={12} seed={6} /><Arrow x1={290} y1={120} x2={302} y2={134} colour={c.bug} width={1.6} />
    <Germ cx={446} cy={84} r={11} seed={7} />{lockOn(446, 84, 11, [-90, 0, 90, 180])}<Germ cx={484} cy={148} r={11} seed={8} />{lockOn(484, 148, 11, [-90, 0, 90, 180])}
  </Diagram>
}

// ---------- The school crowd: protecting everyone ----------
const COLS = [190, 242, 294, 346, 398, 450, 502], ROWS = [62, 142, 222]
const UNVACCINATED = ['1-3', '0-5', '2-1']
function Visitor({ dim = false }: { dim?: boolean }) {
  return <g opacity={dim ? c.faded : 1}><Pupil x={62} y={130} scale={.62} body={150} jumper="#e4c9a8" spots /></g>
}
function Crowd({ lit, badgeFor, numbered }: { lit?: (key: string) => boolean; badgeFor: (key: string) => boolean; numbered?: string }) {
  return <g>{ROWS.map((y, r) => COLS.map((x, k) => { const key = `${r}-${k}`
    return <g key={key} opacity={lit && !lit(key) ? c.faded : 1}><Pupil x={x} y={y} scale={.4} jumper={(r + k) % 2 ? c.jumperA : c.jumperB} badge={badgeFor(key)} />
      {numbered === key && <Badge n={1} x={x} y={y + 32} />}</g> }))}</g>
}
function Spray() {
  return <g>{ROWS.map((y, i) => <Droplets key={y} from={[80, 136]} to={[160, y + 18]} count={8} spread={18} seed={4 + i} />)}</g>
}
function Stop({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="8" fill="white" stroke={wbcLine} strokeWidth="2.2" /><path d={`M${x - 5} ${y + 5}L${x + 5} ${y - 5}`} stroke={wbcLine} strokeWidth="2.2" /></g>
}
function SchoolScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const step = focus.replace('vaccine-school-', '')
  const vaccinated = (key: string) => !UNVACCINATED.includes(key)
  if (step === 'question') return <Diagram title={assessment ? 'A crowd of pupils. Every pupil wears a shield badge except the one marked 1. A visitor with measles stands at the left, and droplets from the visitor stop at the pupils with shields.' : 'A crowd of pupils. Every pupil wears a shield badge, meaning vaccinated, except person 1. Droplets from a visitor with measles stop at the vaccinated pupils, who are immune, so few people can pass it on to person 1.'}>
    <Visitor /><Spray />
    {ROWS.map(y => <Stop key={y} x={168} y={y + 16} />)}
    <Crowd badgeFor={key => key !== '1-3'} numbered="1-3" />
    {!assessment && <Label x={20} y={284} lines={['immune pupils around 1 do not pass it on']} strong colour={wbcLine} />}
  </Diagram>
  if (step === 'epidemic') {
    const group = (x0: number, ill: (i: number) => boolean, shield: (i: number) => boolean) => Array.from({ length: 12 }, (_, i) => {
      const x = x0 + (i % 4) * 52, y = 74 + Math.floor(i / 4) * 72
      return <Pupil key={i} x={x} y={y} scale={.36} jumper={i % 2 ? c.jumperA : c.jumperB} spots={ill(i)} badge={shield(i)} />
    })
    return <Diagram title="Two schools side by side. On the left, few pupils are vaccinated and measles has spread to most of them: a big outbreak, called an epidemic. On the right, most pupils are vaccinated and only one pupil is ill.">
      <text x={130} y={24} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700">few vaccinated</text>
      <text x={410} y={24} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700">most vaccinated</text>
      <path d="M270 36V270" stroke={c.panelLine} strokeWidth="2" strokeDasharray="6 5" />
      {group(52, i => ![2, 9].includes(i), i => i === 2 || i === 9)}
      {group(332, i => i === 5, i => i !== 5 && i !== 10)}
      <text x={130} y={290} textAnchor="middle" fill={c.bugDeep} fontSize="14" fontWeight="700">epidemic: a big outbreak</text>
      <text x={410} y={290} textAnchor="middle" fill={wbcLine} fontSize="14" fontWeight="700">the outbreak stops</text>
    </Diagram>
  }
  const titles: Record<string, string> = {
    arrive: 'A school crowd in which most pupils wear a shield badge, meaning vaccinated. A visitor with measles spots arrives at the left.',
    blocked: 'Droplets from the visitor with measles reach the nearest pupils, who are vaccinated and immune. The spread stops at them, so they do not pass it on.',
    shield: 'The same crowd with three pupils who are not vaccinated highlighted. They are surrounded by vaccinated pupils, so fewer people can pass measles on to them.',
  }
  return <Diagram title={titles[step] || titles.arrive}>
    <Visitor dim={step === 'shield'} />
    {step !== 'arrive' && <g opacity={step === 'shield' ? c.faded : 1}><Spray />{ROWS.map(y => <Stop key={y} x={168} y={y + 16} />)}</g>}
    <Crowd badgeFor={vaccinated} lit={step === 'shield' ? key => !vaccinated(key) : undefined} />
    {step === 'shield' && UNVACCINATED.map(key => { const [r, k] = key.split('-').map(Number); return <circle key={key} cx={COLS[k]} cy={ROWS[r] + 14} r={26} fill="none" stroke={c.ink} strokeWidth="2" strokeDasharray="5 4" /> })}
    {step === 'arrive' && <><Label x={20} y={36} to={[62, 106]} lines={['visitor with', 'measles']} strong colour={c.bugDeep} /><Label x={20} y={284} lines={['shield: vaccinated']} strong /></>}
    {step === 'blocked' && <Label x={20} y={270} lines={['immune pupils do', 'not pass it on']} strong colour={wbcLine} />}
    {step === 'shield' && <Label x={20} y={236} lines={['not vaccinated,', 'but less likely', 'to catch it']} strong />}
  </Diagram>
}

// ---------- The one summary screen: benefits and limits ----------
function Summary() {
  const col = (x: number, heading: string, colour: string, items: string[][]) => <g>
    <rect x={x} y={14} width={252} height={272} rx="12" fill={c.panelFill} stroke={c.panelLine} strokeWidth="1.5" />
    <text x={x + 126} y={42} textAnchor="middle" fill={colour} fontSize="15" fontWeight="700">{heading}</text>
    {items.map((lines, i) => <text key={i} x={x + 40} y={78 + i * 56} fill={c.ink} fontSize="13">{lines.map((t, k) => <tspan key={t} x={x + 40} dy={k ? 16 : 0}>{t}</tspan>)}</text>)}
  </g>
  return <Diagram title="Summary of vaccination. Benefits: it protects the person, protects people who are not vaccinated because fewer people can pass the disease on, and helps prevent epidemics. Limits: it does not always work, and some people have a reaction, such as a sore arm or a fever, which is usually mild.">
    {col(12, 'benefits', '#3f8f6a', [['protects the person:', 'a fast response is ready'], ['protects others: fewer', 'people to pass it on'], ['helps prevent', 'epidemics'], ['has controlled diseases', 'such as polio']])}
    {col(276, 'limits', c.bugDeep, [['does not always work:', 'some people do not', 'become immune'], [], ['a reaction, such as a', 'sore arm or a fever,', 'usually mild']])}
    {[0, 1, 2, 3].map(i => <path key={i} d={`M30 ${68 + i * 56}l8 3v7c0 6 -4 10 -8 12c-4 -2 -8 -6 -8 -12v-7z`} fill="white" stroke="#3f8f6a" strokeWidth="1.6" />)}
    {[0, 2].map(i => <circle key={i} cx={296} cy={74 + i * 56} r="7" fill="white" stroke={c.bugDeep} strokeWidth="1.8" />)}{[0, 2].map(i => <path key={i} d={`M296 ${70 + i * 56}v5M296 ${78 + i * 56}v.5`} stroke={c.bugDeep} strokeWidth="2" strokeLinecap="round" />)}
  </Diagram>
}

export function VaccineVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('vaccine-class-')) return <ClassScene focus={focus} />
  if (focus.startsWith('vaccine-blood-')) return <BloodScene focus={focus} />
  if (focus === 'vaccine-response-curve') return <ResponseCurve question={false} assessment={false} />
  if (focus === 'vaccine-response-question') return <ResponseCurve question assessment={assessment} />
  if (focus === 'vaccine-response-data') return <ResponseData />
  if (focus === 'vaccine-jab-question') return <JabQuestion assessment={assessment} />
  if (focus.startsWith('vaccine-jab-')) return <JabScene focus={focus} />
  if (focus.startsWith('vaccine-school-')) return <SchoolScene focus={focus} assessment={assessment} />
  if (focus === 'vaccine-summary') return <Summary />
  return <ClassScene focus="vaccine-class-outbreak" />
}
