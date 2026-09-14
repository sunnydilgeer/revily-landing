export type BidmasRule = 'b' | 'i' | 'dm' | 'as'
export type BidmasContext = 'numerator' | 'place-brackets' | 'resolved-multiplication'

export const bidmasRules: Array<{ id: BidmasRule; letters: string; symbols: string; name: string }> = [
  { id: 'b', letters: 'B', symbols: '( )', name: 'Brackets' },
  { id: 'i', letters: 'I', symbols: 'x²', name: 'Indices' },
  { id: 'dm', letters: 'D M', symbols: '÷ ×', name: 'Division and multiplication' },
  { id: 'as', letters: 'A S', symbols: '+ −', name: 'Addition and subtraction' },
]

// Deliberately scoped to this lesson's authored numerical expressions, not a general LaTeX parser.
const fractionParts = (math: string) => /^\\frac\{([^{}]*)\}\{([^{}]*)\}$/.exec(math)
const withoutAnnotations = (math: string) => math.replace(/\\underbrace\{([^{}]*)\}_\{[^{}]*\}/g, '$1')
const mark = (math: string) => `\\textcolor{#216544}{\\underline{${math}}}`

function markSymbols(math: string, rule: BidmasRule): string {
  return math.replace(/\d+\^\d+|\\times|\\div|[()+-]/g, token => {
    const matches = rule === 'b' ? /^[()]$/.test(token)
      : rule === 'i' ? token.includes('^')
      : rule === 'dm' ? /^\\(times|div)$/.test(token)
      : /^[+-]$/.test(token)
    return matches ? mark(token) : token
  })
}

export function highlightBidmas(math: string, rule: BidmasRule | null, context?: BidmasContext): string {
  if (!rule) return math
  const fraction = fractionParts(math)
  if (fraction) {
    const numerator = markSymbols(fraction[1], rule)
    const denominator = context === 'numerator' ? fraction[2] : markSymbols(fraction[2], rule)
    // B identifies the grouping bar. DM identifies its eventual division, never on a numerator-only task.
    const markBar = rule === 'b' || (rule === 'dm' && context !== 'numerator')
    return markBar
      ? `\\textcolor{#216544}{\\frac{\\textcolor{#244b35}{${numerator}}}{\\textcolor{#244b35}{${denominator}}}}`
      : `\\frac{${numerator}}{${denominator}}`
  }
  // Protect the resolved-working annotation: its multiplication is no longer an operation to perform.
  const parts = math.split(/(\\underbrace\{[^{}]*\}_\{[^{}]*\})/g)
  return parts.map(part => {
    const annotation = /^\\underbrace\{([^{}]*)\}_\{([^{}]*)\}$/.exec(part)
    return annotation ? `\\underbrace{${markSymbols(annotation[1], rule)}}_{${annotation[2]}}` : markSymbols(part, rule)
  }).join('')
}

export function bidmasRuleNote(math: string, rule: BidmasRule, context?: BidmasContext): string {
  const fraction = fractionParts(math)
  const scope = withoutAnnotations(context === 'numerator' && fraction ? fraction[1] : math)
  if (rule === 'b') {
    if (context === 'place-brackets') return 'Brackets make a chosen calculation happen first. Compare where each option places them.'
    if (fraction) return context === 'numerator'
      ? 'The fraction bar groups the whole top. Use BIDMAS within the numerator; leave the bottom for later.'
      : 'The fraction bar groups the whole top and bottom. Use BIDMAS within each group before dividing.'
    return /[()]/.test(scope)
      ? 'Work inside the brackets first. Use BIDMAS within that group before calculating outside it.'
      : 'No brackets here. Check indices next.'
  }
  if (rule === 'i') return scope.includes('^')
    ? 'Indices mean powers. Within each group, calculate powers before ×, ÷, + or −.'
    : 'No indices here. Check division and multiplication next.'
  if (rule === 'dm') {
    if (context === 'resolved-multiplication') return 'The small 3 × 4 shows how 12 was found. That multiplication is complete; only addition remains.'
    if (fraction && context !== 'numerator') return 'Within each group, do × and ÷ before + and −, working left to right. The bar divides the completed top by the completed bottom.'
    if (!/\\(times|div)/.test(scope)) return context === 'numerator'
      ? 'No × or ÷ in the numerator. Its power still comes before addition; the bottom is not needed yet.'
      : 'No × or ÷ here. Check addition and subtraction next.'
    return 'Division and multiplication share priority. After brackets and indices, work from left to right.'
  }
  return /[+-]/.test(scope)
    ? 'Addition and subtraction share priority. After higher-priority operations, work from left to right.'
    : 'No addition or subtraction here. Check the earlier BIDMAS groups.'
}
