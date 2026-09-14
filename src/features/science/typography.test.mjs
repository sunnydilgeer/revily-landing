import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('./FriendlyLesson.css', import.meta.url), 'utf8')
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
const headingRule = rules.find(([ , selector]) => selector.includes('.science-preview.science-preview--revision h1'))

assert.ok(headingRule, 'All headings must have one scoped typography policy')
for (let level = 1; level <= 6; level++) {
  assert.ok(headingRule[1].includes(`.science-preview.science-preview--revision h${level}`), `Heading level ${level} must use the shared font`)
}
assert.ok(headingRule[1].includes('.science-brand strong'), 'The brand must use the shared font')
assert.match(headingRule[2], /font-family:\s*inherit\s*;/)
assert.match(headingRule[2], /font-weight:\s*600\s*;/)
assert.doesNotMatch(css, /Syne/i, 'Do not reintroduce the wide display font')
assert.doesNotMatch(css, /font-weight:\s*[89]00/, 'Do not reintroduce extra-heavy typography')
for (const [, selector, declarations] of rules) {
  if (!/font-family:/.test(declarations)) continue
  assert.ok(selector.includes('science-preview--revision'), 'Font rules must not change other pages')
  assert.match(declarations, /font-family:\s*(?:"DM Sans"|inherit)/, 'Only the shared MCQ font or inheritance is allowed')
}
console.log('PASS revision typography: shared heading font, moderate weight, no display font, scoped rules')
