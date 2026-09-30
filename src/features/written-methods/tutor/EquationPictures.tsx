import type { ReactNode } from 'react'
import type { EquationFrame, EquationRow, SolvedFrame } from './methodWorking'
import { Boxed, Powers } from './Powers'

/*
 * Solving an equation as a board with two sides, like the A5 videos: the equation split at its = sign, the same move
 * written on both sides in purple, the parts that cancel struck out, and the new equation underneath. Letters are
 * blue and numbers amber, as in the other algebra pictures (EXPLANATIONS.md). Tokens are described in methodWorking.ts.
 */

type Token = { text: string; struck: boolean; move: boolean; bottom?: string; bottomStruck?: boolean }

/** "~−3" → struck −3; "+3^" → the move +3; "{2x+1|~3}" → 2x + 1 over a struck 3. */
export function readTokens(side: string): Token[] {
  return (side.match(/~?\{[^}]*\}\^?|\S+/g) ?? []).map(raw => {
    const struck = raw.startsWith('~'), move = raw.endsWith('^')
    const body = raw.replace(/^~/, '').replace(/\^$/, '')
    const fraction = body.match(/^\{([^|]*)\|(~?)([^}]*)\}$/)
    return fraction ? { text: fraction[1], struck, move, bottom: fraction[3], bottomStruck: fraction[2] === '~' } : { text: body, struck, move }
  })
}

/** Spaces round the signs inside a token, but not a sign that starts a number: "2×3x" → "2 × 3x", "−6×−6" → "−6 × −6". */
export const spaced = (text: string) => text.replace(/(?<=[^(×÷[\s])([+−×÷=])/g, ' $1 ').replace(/\s+/g, ' ').trim()
/** A token after the first: its leading sign stands apart, "+3" → "+ 3". */
const signed = (text: string, first: boolean) => first ? spaced(text) : spaced(text).replace(/^([+−×÷])(?=\S)/, '$1 ')
const family = (token: Token, plain?: boolean) => plain ? '' : token.move ? ' is-f3' : /[a-z]/i.test(token.text) ? ' is-f0' : ' is-f1'

/** A token's text: parts in [brackets] are boxed in purple, the part the next move undoes. */
const Show = ({ text, plain }: { text: string; plain?: boolean }) => plain ? <Powers text={text.replace(/[[\]]/g, '')} /> : <Boxed text={text} />

function Side({ side, plain }: { side: string; plain?: boolean }) {
  return <>{readTokens(side).map((token, i) => <span key={i} className={`ns-eq__token${family(token, plain)}${token.struck && !plain ? ' is-struck' : ''}`}>
    {token.bottom !== undefined
      ? <span className="ns-eq__frac"><span><Show text={spaced(token.text)} plain={plain} /></span><span className={token.bottomStruck && !plain ? 'is-struck' : undefined}><Show text={token.bottom} plain={plain} /></span></span>
      : <Show text={signed(token.text, i === 0)} plain={plain} />}
  </span>)}</>
}

/** Words for a screen reader: "5x − 3 + 3 = 27 + 3, with − 3 + 3 cancelling". */
function spoken(row: EquationRow) {
  if ('note' in row) return row.note
  const words = (side: string) => readTokens(side).map((token, i) => token.bottom !== undefined ? `${spaced(token.text)} over ${token.bottom}` : signed(token.text, i === 0)).join(' ')
  const struck = [...readTokens(row.left), ...readTokens(row.right)].filter(token => token.struck).map(token => signed(token.text, false))
  return `${words(row.left)} = ${words(row.right)}${struck.length ? `, with ${struck.join(' and ')} cancelling` : ''}`.replace(/[[\]]/g, '')
}

/** The board so far. A step's heading goes above the rows it adds (from `newFrom`); `plain` is the question before any working. */
export function EquationVisual({ frame, newFrom, heading, plain }: { frame: EquationFrame; newFrom?: number; heading?: ReactNode; plain?: boolean }) {
  return <div className={`ns-eq${plain ? ' is-plain' : ''}`} role="img" aria-label={frame.rows.map(spoken).join('. ')}>
    {frame.rows.map((row, i) => [
      i === newFrom && heading && <div key="heading" className="ns-eq__heading">{heading}</div>,
      'note' in row
        ? <p key={i} className={`ns-eq__note is-f${(row.family ?? 3) % 4}`} aria-hidden="true"><Powers text={spaced(row.note)} /></p>
        : <div key={i} className="ns-eq__row" aria-hidden="true">
          <span className="ns-eq__left"><Side side={row.left} plain={plain} /></span>
          <span className="ns-eq__equals">=</span>
          <span className="ns-eq__right"><Side side={row.right} plain={plain} /></span>
        </div>,
    ])}
  </div>
}

/** The answer with where each part came from: "x" on its own, "6" from 30 ÷ 5. */
export function SolvedAnswer({ frame }: { frame: SolvedFrame }) {
  const words = frame.pieces.map(piece => piece.label ? `${piece.text}, ${piece.label}` : piece.text).join(' ')
  return <div className="ns-bracket ns-solved" role="img" aria-label={words}>
    {frame.pieces.map((piece, i) => piece.family === undefined
      ? <span key={i} className="ns-bracket__paren" aria-hidden="true"><Powers text={piece.text} /></span>
      : <span key={i} className={`ns-bracket__piece is-f${piece.family % 4}`} aria-hidden="true"><b><Powers text={piece.text} /></b>{piece.label && <small><Powers text={piece.label} /></small>}</span>)}
  </div>
}
