import type { ReactNode } from 'react'

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const RUN = /([⁻⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]+)/

/**
 * Text with its powers drawn as raised digits. The app font has its own ¹ ² ³ but falls back to another font
 * for ⁴–⁹, so "7p³q × 2p⁴q²" came out with powers of different sizes. Screen readers get the text as written.
 */
export function Powers({ text }: { text: ReactNode }) {
  if (typeof text !== 'string' || !RUN.test(text)) return <>{text}</>
  const parts = text.split(RUN)
  return <><span aria-hidden="true">{parts.map((part, i) => i % 2
    ? <sup key={i} className="rv-pow">{[...part].map(c => c === '⁻' ? '−' : c === 'ⁿ' ? 'n' : String(SUP.indexOf(c))).join('')}</sup>
    : part)}</span><span className="sr-only">{text}</span></>
}

/**
 * Text with parts in [brackets] drawn boxed, like the parts every term shares when factorising: [3] × 2 × [x] × x.
 * Parts in {braces} are boxed and crossed out: taken outside the bracket. On the equation board, parts in «guillemets»
 * are crossed out (they cancel) and parts in ‹angles› are the move, in purple: the ² in t‹²›.
 */
export function Boxed({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]*\]|\{[^}]*\}|«[^»]*»|‹[^›]*›)/).map((part, i) => part.startsWith('[') || part.startsWith('{')
    ? <span key={i} className={`ns-shared${part.startsWith('{') ? ' is-out' : ''}`}><Powers text={part.slice(1, -1)} /></span>
    : part.startsWith('«') ? <span key={i} className="is-struck"><Powers text={part.slice(1, -1)} /></span>
    : part.startsWith('‹') ? <span key={i} className="ns-eq__move"><Powers text={part.slice(1, -1)} /></span>
    : <Powers key={i} text={part} />)}</>
}
