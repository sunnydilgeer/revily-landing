import type { Metadata } from 'next'
import {
  AnswerBox, Button, CheckBar, FinalAnswer, LadderMark, Mark, NewValue, RevilyLogo, StepChip, Working, WorkingLine,
} from '../../../src/ui'
import './kit.css'

export const metadata: Metadata = {
  title: 'UI kit | Revily',
  description: 'Revily design tokens and shared components.',
  robots: { index: false, follow: false },
}

const colours: [string, string][] = [
  ['Night', '--rv-night'], ['Night 2', '--rv-night-2'], ['Paper', '--rv-paper'], ['Ink', '--rv-ink'], ['Muted', '--rv-muted'],
  ['Yellow', '--rv-yellow'], ['Good', '--rv-good'], ['Red pen', '--rv-redpen'], ['Biro', '--rv-biro'], ['Alarm', '--rv-alarm'],
  ['Step B', '--rv-step-b'], ['Step I', '--rv-step-i'], ['Step D=M', '--rv-step-dm'], ['Step A=S', '--rv-step-as'],
]

export default function KitPage() {
  return <main className="kit">
    <header className="kit-head">
      <RevilyLogo />
      <p>UI kit · tokens and shared components for every Revily surface</p>
    </header>

    <section className="kit-section">
      <h2>Brand</h2>
      <div className="kit-row">
        <div className="kit-tile rv-paper"><RevilyLogo href={null} size={34} /></div>
        <div className="kit-tile kit-tile--night"><RevilyLogo href={null} onNight size={34} /></div>
        <div className="kit-tile"><LadderMark size={56} rail="var(--rv-ink)" /></div>
      </div>
      <p className="kit-type-display">GCSE Foundation maths, one step at a time.</p>
      <p className="kit-type-body">Lexend for reading and maths: 3 + 4 × 2 = 11. Designed to be easy to read.</p>
      <p className="kit-type-pen">Caveat for handwritten notes only</p>
    </section>

    <section className="kit-section">
      <h2>Colour</h2>
      <ul className="kit-swatches">
        {colours.map(([name, token]) => <li key={token}><span style={{ background: `var(${token})` }} /><b>{name}</b><code>{token}</code></li>)}
      </ul>
    </section>

    <section className="kit-section">
      <h2>Step chips</h2>
      <div className="kit-row">
        <StepChip tone="b">B</StepChip><StepChip tone="i">I</StepChip><StepChip tone="dm">D</StepChip><StepChip tone="dm">M</StepChip>
        <StepChip tone="as">A</StepChip><StepChip tone="as">S</StepChip><StepChip tone="biro">1</StepChip><StepChip>2</StepChip>
      </div>
    </section>

    <section className="kit-section rv-paper kit-board">
      <h2>One job per line</h2>
      <Working label="Working for 3 + 4 × 2">
        <WorkingLine tone="dm" expression={<>3 + <Mark tone="dm">4 × 2</Mark> <AnswerBox /></>} chip="M" note="4 × 2 = 8" />
        <WorkingLine tone="as" expression={<><Mark tone="as">3 + <NewValue tone="dm">8</NewValue></Mark></>} chip="A" note="3 + 8 = 11" />
        <WorkingLine expression={<>Answer <FinalAnswer>11</FinalAnswer></>} />
      </Working>
      <p className="kit-caption">The answer box starts dashed. When the sum is solved it fills in green:</p>
      <p className="kit-eq">3 + 4 × 2 <AnswerBox value="11" solved /></p>
    </section>

    <section className="kit-section">
      <h2>Buttons</h2>
      <div className="kit-row">
        <Button>Check</Button>
        <Button variant="secondary">Watch it again</Button>
        <Button variant="dark">Start lesson</Button>
        <Button variant="ghost">Skip for now</Button>
        <Button disabled>Check</Button>
      </div>
      <div className="kit-row"><Button size="lg">Keep going</Button><Button variant="good">Continue</Button><Button variant="bad">Got it</Button></div>
    </section>

    <section className="kit-section kit-bars">
      <h2>Check bar</h2>
      <CheckBar style={{ position: 'static' }}><Button variant="ghost">Skip</Button><Button size="lg" disabled>Check</Button></CheckBar>
      <CheckBar style={{ position: 'static' }} status="correct" title="Nice! That's right." message="18 ÷ 6 = 3 and 24 ÷ 6 = 4, so 18/24 = 3/4."><Button variant="good" size="lg">Continue</Button></CheckBar>
      <CheckBar style={{ position: 'static' }} status="incorrect" title="Not quite" message={<>5/10 isn&rsquo;t equal to 10/15. Divide the top and bottom by the <b>same</b> number. The answer is 2/3.</>}>
        <Button variant="secondary">See the working</Button><Button variant="bad" size="lg">Continue</Button>
      </CheckBar>
    </section>
  </main>
}
