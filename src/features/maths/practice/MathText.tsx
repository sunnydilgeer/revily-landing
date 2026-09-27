'use client'

import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/** Text with inline maths in $…$, rendered with KaTeX. */
export function MathText({ text }: { text: string }) {
  const html = useMemo(() => text.split(/(\$[^$]+\$)/g).map(piece => piece.startsWith('$') && piece.endsWith('$') && piece.length > 1
    ? katex.renderToString(piece.slice(1, -1), { throwOnError: false, strict: 'ignore' })
    : piece.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]!)).join(''), [text])
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

/** One line of LaTeX. */
export function MathLine({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, strict: 'ignore' }), [tex])
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
