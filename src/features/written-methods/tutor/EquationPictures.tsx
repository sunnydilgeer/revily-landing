import type { ReactNode } from 'react'
import type { EquationFrame, EquationRow } from './methodWorking'
import { Boxed, Powers } from './Powers'

/*
 * Solving an equation as a board with two sides, like the A5 videos: the equation split at its = sign, the same move
 * written on both sides in purple, the parts that cancel struck out, and the new equation underneath. Letters are
 * blue and numbers amber, as in the other algebra pictures (EXPLANATIONS.md). Tokens are described in methodWorking.ts.
 */

type Token = {
  text: string; struck: boolean; move: boolean; bottom?: string; bottomStruck?: boolean; bottomMove?: boolean
  /** A square root over the whole token (a fraction, or a bracket), with its sign plain, boxed or crossed out. */
  root?: 'plain' | 'boxed' | 'struck'
  /** What follows the token with no gap: the ‹²› that squares it. */
  after?: string
}

/**
 * "~−3" → struck −3; "+3^" → the move +3; "{2x+1|~3}" → 2x + 1 over a struck 3; "{C−5|3^}" → C − 5 over the move ÷ 3.
 * A root over a whole fraction or bracket: "√{A|6}", "√(2A)"; "[√]{h|5}" boxes its sign and "«√»{h|5}‹²›" crosses it
 * out and squares it. Inside a token, «…» is crossed out and ‹…› is the move (Boxed in Powers.tsx).
 */
export function readTokens(side: string): Token[] {
  return (side.match(/~?\{[^}]*\}\^?|\S+/g) ?? []).map(raw => {
    const struck = raw.startsWith('~'), move = raw.endsWith('^')
    const body = raw.replace(/^~/, '').replace(/\^$/, '')
    const parts = body.match(/^(√|\[√\]|«√»)?(?:\{([^|]*)\|(~?)([^}]*?)(\^?)\}|(?<=√|\]|»)\(([^)]*)\))(.*)$/)
    if (!parts) return { text: body, struck, move }
    const [, sign, top, bottomStruck, bottom, bottomMove, under, after] = parts
    const root: Token['root'] = sign === '√' ? 'plain' : sign === '[√]' ? 'boxed' : sign ? 'struck' : undefined
    return top !== undefined
      ? { text: top, struck, move, bottom, bottomStruck: bottomStruck === '~', bottomMove: bottomMove === '^', root, after: after || undefined }
      : { text: under, struck, move, root, after: after || undefined }
  })
}
/** A token as plain words, for a screen reader and the KaTeX chain. */
const words = (token: Token, first: boolean) => {
  const inner = token.bottom !== undefined ? `${spaced(token.text)} over ${token.bottom}` : signed(token.text, first)
  return `${token.root ? `the square root of ${inner}` : inner}${token.after ?? ''}`.replace(/[«»‹›]/g, '')
}

/** Spaces round the signs inside a token, but not a sign that starts a number: "2×3x" → "2 × 3x", "−6×−6" → "−6 × −6". */
export const spaced = (text: string) => text.replace(/(?<=[^(×÷[\s])([+−×÷=])/g, ' $1 ').replace(/\s+/g, ' ').trim()
/** A token after the first: its leading sign stands apart, "+3" → "+ 3", boxed or not ("[+3]" → "[+ 3]"). */
const signed = (text: string, first: boolean) => first ? spaced(text) : spaced(text).replace(/^(\[?)([+−×÷])(?=\S)/, '$1$2 ')
const family = (token: Token, plain?: boolean) => plain ? '' : token.move ? ' is-f3' : /[a-z]/i.test(token.text) ? ' is-f0' : ' is-f1'

/** A token's text: parts in [brackets] are boxed in purple, the part the next move undoes. */
const Show = ({ text, plain }: { text: string; plain?: boolean }) => plain ? <Powers text={text.replace(/[[\]]/g, '')} /> : <Boxed text={text} />

function Body({ token, first, plain }: { token: Token; first: boolean; plain?: boolean }) {
  const bottomClass = [token.bottomStruck && !plain && 'is-struck', token.bottomMove && !plain && 'ns-eq__move'].filter(Boolean).join(' ') || undefined
  return token.bottom !== undefined
    ? <span className="ns-eq__frac"><span><Show text={spaced(token.text)} plain={plain} /></span><span className={bottomClass}><Show text={token.bottom} plain={plain} /></span></span>
    : <Show text={token.root ? spaced(token.text) : signed(token.text, first)} plain={plain} />
}

/** A square root sign that stretches to the height of what it covers, joining the bar over it. Boxed or crossed out like a token. */
function Radical({ mark }: { mark?: Token['root'] }) {
  return <span className={`ns-eq__radical${mark === 'boxed' ? ' ns-shared' : mark === 'struck' ? ' is-cancelled' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 10 20" preserveAspectRatio="none"><path d="M0.5 12.5 L3 11 L5.5 19.5 L9.5 1" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" /></svg>
  </span>
}

function Side({ side, plain }: { side: string; plain?: boolean }) {
  return <>{readTokens(side).map((token, i) => <span key={i} className={`ns-eq__token${family(token, plain)}${token.struck && !plain ? ' is-struck' : ''}`}>
    {token.root
      ? <span className="ns-eq__rooted"><span className="ns-eq__root">
        <Radical mark={plain ? undefined : token.root} />
        <span className="ns-eq__under"><Body token={token} first plain={plain} /></span>
      </span>{token.after && <Show text={token.after} plain={plain} />}</span>
      : <><Body token={token} first={i === 0} plain={plain} />{token.after && <Show text={token.after} plain={plain} />}</>}
  </span>)}</>
}

/** Words for a screen reader: "5x − 3 + 3 = 27 + 3, with − 3 + 3 cancelling". */
function spoken(row: EquationRow) {
  if ('note' in row) return row.note
  const said = (side: string) => readTokens(side).map((token, i) => words(token, i === 0)).join(' ')
  if ('answer' in row) {
    const at = row.answer.indexOf(' = ')
    return `The answer: ${at < 0 ? row.answer : `${row.answer.slice(0, at)} = ${said(row.answer.slice(at + 3))}`}`
  }
  const struck = [...readTokens(row.left), ...readTokens(row.right)].filter(token => token.struck).map(token => signed(token.text, false))
  return `${said(row.left)} = ${said(row.right)}${struck.length ? `, with ${struck.join(' and ')} cancelling` : ''}`.replace(/[[\]]/g, '')
}

/** The board so far. A step's heading goes above the rows it adds (from `newFrom`); `plain` is the question before any working. */
export function EquationVisual({ frame, newFrom, heading, plain }: { frame: EquationFrame; newFrom?: number; heading?: ReactNode; plain?: boolean }) {
  return <div className={`ns-eq${plain ? ' is-plain' : ''}`} role="img" aria-label={frame.rows.map(spoken).join('. ')}>
    {frame.rows.map((row, i) => [
      i === newFrom && heading && <div key="heading" className="ns-eq__heading">{heading}</div>,
      'answer' in row
        ? <p key={i} className="ns-eq__answer" aria-hidden="true">{/[{√]/.test(row.answer) && row.answer.includes(' = ')
          // A formula answer keeps its fraction bar and root: m = (C − 5) over 3, drawn as on the board.
          ? <><Powers text={row.answer.slice(0, row.answer.indexOf(' = '))} /> = <span className="ns-eq__answer-side"><Side side={row.answer.slice(row.answer.indexOf(' = ') + 3)} plain /></span></>
          : <Powers text={row.answer} />}</p>
        : 'note' in row
        ? <p key={i} className={`ns-eq__note is-f${(row.family ?? 3) % 4}`} aria-hidden="true"><Powers text={spaced(row.note)} /></p>
        : <div key={i} className="ns-eq__row" aria-hidden="true">
          <span className="ns-eq__left"><Side side={row.left} plain={plain} /></span>
          <span className="ns-eq__equals">=</span>
          <span className="ns-eq__right"><Side side={row.right} plain={plain} /></span>
        </div>,
    ])}
  </div>
}

